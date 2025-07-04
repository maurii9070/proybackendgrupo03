import Turno from '../models/Turno.js'
import Doctor from '../models/Doctor.js'
import Usuario from '../models/Usuario.js'
import Especialidad from '../models/Especialidad.js'
import mongoose from 'mongoose'

// Estadística 1: Turnos por especialidad
const getTurnosPorEspecialidad = async (req, res) => {
	try {
		const stats = await Turno.aggregate([
			{
				$lookup: {
					from: 'usuarios', // Cambiado de 'doctors' a 'usuarios'
					localField: 'doctor',
					foreignField: '_id',
					as: 'doctorInfo',
				},
			},
			{
				$unwind: '$doctorInfo',
			},
			{
				$match: {
					'doctorInfo._rol': 'Doctor', // Filtrar solo doctores con mayúscula
				},
			},
			{
				$lookup: {
					from: 'especialidads', // Mantener como 'especialidads'
					localField: 'doctorInfo.especialidad',
					foreignField: '_id',
					as: 'especialidadInfo',
				},
			},
			{
				$unwind: '$especialidadInfo',
			},
			{
				$group: {
					_id: '$especialidadInfo._id',
					especialidad: { $first: '$especialidadInfo.nombre' },
					totalTurnos: { $sum: 1 },
					turnosPendientes: {
						$sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] },
					},
					turnosRealizados: {
						$sum: { $cond: [{ $eq: ['$estado', 'realizado'] }, 1, 0] },
					},
					turnosCancelados: {
						$sum: { $cond: [{ $eq: ['$estado', 'cancelado'] }, 1, 0] },
					},
				},
			},
			{
				$sort: { totalTurnos: -1 },
			},
		])

		// Formato para charts
		const chartData = {
			labels: stats.map(item => item.especialidad),
			datasets: [
				{
					label: 'Total Turnos',
					data: stats.map(item => item.totalTurnos),
					backgroundColor: [
						'#FF6384',
						'#36A2EB',
						'#FFCE56',
						'#4BC0C0',
						'#9966FF',
						'#FF9F40',
						'#FF6384',
						'#C9CBCF',
					],
				},
			],
		}

		res.json({
			raw: stats,
			chartData,
		})
	} catch (error) {
		console.error('Error en getTurnosPorEspecialidad:', error)
		res.status(500).json({ error: 'Error al obtener estadísticas por especialidad' })
	}
}

// Estadística 2: Horarios más solicitados
const getHorariosMasSolicitados = async (req, res) => {
	try {
		const stats = await Turno.aggregate([
			{
				$group: {
					_id: '$hora',
					totalTurnos: { $sum: 1 },
					turnosPendientes: {
						$sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] },
					},
					turnosRealizados: {
						$sum: { $cond: [{ $eq: ['$estado', 'realizado'] }, 1, 0] },
					},
				},
			},
			{
				$sort: { totalTurnos: -1 },
			},
			{
				$limit: 10, // Top 10 horarios más solicitados
			},
		])

		// Formato para charts
		const chartData = {
			labels: stats.map(item => item._id),
			datasets: [
				{
					label: 'Total Turnos',
					data: stats.map(item => item.totalTurnos),
					backgroundColor: '#36A2EB',
					borderColor: '#36A2EB',
					borderWidth: 1,
				},
				{
					label: 'Turnos Realizados',
					data: stats.map(item => item.turnosRealizados),
					backgroundColor: '#4BC0C0',
					borderColor: '#4BC0C0',
					borderWidth: 1,
				},
			],
		}

		res.json({
			raw: stats,
			chartData,
		})
	} catch (error) {
		console.error('Error en getHorariosMasSolicitados:', error)
		res.status(500).json({ error: 'Error al obtener horarios más solicitados' })
	}
}

// Estadística 3: Turnos por doctor
const getTurnosPorDoctor = async (req, res) => {
	try {
		const stats = await Turno.aggregate([
			{
				$lookup: {
					from: 'usuarios', // Cambiado de 'doctors' a 'usuarios'
					localField: 'doctor',
					foreignField: '_id',
					as: 'doctorInfo',
				},
			},
			{
				$unwind: '$doctorInfo',
			},
			{
				$match: {
					'doctorInfo._rol': 'Doctor', // Filtrar solo doctores con mayúscula
				},
			},
			{
				$group: {
					_id: '$doctor',
					doctorNombre: {
						$first: {
							$concat: ['$doctorInfo.nombre', ' ', '$doctorInfo.apellido'],
						},
					},
					matricula: { $first: '$doctorInfo.matricula' },
					totalTurnos: { $sum: 1 },
					turnosPendientes: {
						$sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] },
					},
					turnosRealizados: {
						$sum: { $cond: [{ $eq: ['$estado', 'realizado'] }, 1, 0] },
					},
					turnosCancelados: {
						$sum: { $cond: [{ $eq: ['$estado', 'cancelado'] }, 1, 0] },
					},
				},
			},
			{
				$sort: { totalTurnos: -1 },
			},
		])

		// Formato para charts
		const chartData = {
			labels: stats.map(item => item.doctorNombre),
			datasets: [
				{
					label: 'Total Turnos',
					data: stats.map(item => item.totalTurnos),
					backgroundColor: '#FFCE56',
				},
				{
					label: 'Turnos Realizados',
					data: stats.map(item => item.turnosRealizados),
					backgroundColor: '#4BC0C0',
				},
				{
					label: 'Turnos Pendientes',
					data: stats.map(item => item.turnosPendientes),
					backgroundColor: '#FF9F40',
				},
				{
					label: 'Turnos Cancelados',
					data: stats.map(item => item.turnosCancelados),
					backgroundColor: '#FF6384',
				},
			],
		}

		res.json({
			raw: stats,
			chartData,
		})
	} catch (error) {
		console.error('Error en getTurnosPorDoctor:', error)
		res.status(500).json({ error: 'Error al obtener estadísticas por doctor' })
	}
}

// Estadística 4: Turnos por mes (últimos 12 meses)
const getTurnosPorMes = async (req, res) => {
	try {
		const stats = await Turno.aggregate([
			{
				$addFields: {
					fechaArray: { $split: ['$fecha', '/'] },
				},
			},
			{
				$addFields: {
					mes: { $toInt: { $arrayElemAt: ['$fechaArray', 1] } },
					anio: { $toInt: { $arrayElemAt: ['$fechaArray', 2] } },
				},
			},
			{
				$group: {
					_id: {
						mes: '$mes',
						anio: '$anio',
					},
					totalTurnos: { $sum: 1 },
					turnosRealizados: {
						$sum: { $cond: [{ $eq: ['$estado', 'realizado'] }, 1, 0] },
					},
					turnosCancelados: {
						$sum: { $cond: [{ $eq: ['$estado', 'cancelado'] }, 1, 0] },
					},
				},
			},
			{
				$sort: { '_id.anio': 1, '_id.mes': 1 },
			},
		])

		// Nombres de meses
		const meses = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		]

		// Formato para charts
		const chartData = {
			labels: stats.map(item => `${meses[item._id.mes - 1]} ${item._id.anio}`),
			datasets: [
				{
					label: 'Total Turnos',
					data: stats.map(item => item.totalTurnos),
					borderColor: '#36A2EB',
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					fill: true,
				},
				{
					label: 'Turnos Realizados',
					data: stats.map(item => item.turnosRealizados),
					borderColor: '#4BC0C0',
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					fill: true,
				},
			],
		}

		res.json({
			raw: stats,
			chartData,
		})
	} catch (error) {
		console.error('Error en getTurnosPorMes:', error)
		res.status(500).json({ error: 'Error al obtener estadísticas por mes' })
	}
}

// Estadística 5: Estados de turnos (resumen general)
const getEstadosTurnos = async (req, res) => {
	try {
		const stats = await Turno.aggregate([
			{
				$group: {
					_id: '$estado',
					cantidad: { $sum: 1 },
				},
			},
			{
				$sort: { cantidad: -1 },
			},
		])

		// Calcular porcentajes
		const total = stats.reduce((sum, item) => sum + item.cantidad, 0)
		const statsWithPercentage = stats.map(item => ({
			...item,
			porcentaje: ((item.cantidad / total) * 100).toFixed(1),
		}))

		// Formato para charts (pie chart)
		const chartData = {
			labels: stats.map(item => {
				const estados = {
					pendiente: 'Pendientes',
					realizado: 'Realizados',
					cancelado: 'Cancelados',
				}
				return estados[item._id] || item._id
			}),
			datasets: [
				{
					data: stats.map(item => item.cantidad),
					backgroundColor: ['#FF9F40', '#4BC0C0', '#FF6384'],
					borderWidth: 1,
				},
			],
		}

		res.json({
			raw: statsWithPercentage,
			total,
			chartData,
		})
	} catch (error) {
		console.error('Error en getEstadosTurnos:', error)
		res.status(500).json({ error: 'Error al obtener estadísticas de estados' })
	}
}

// Estadística 6: Ingresos por especialidad (si tienes precios)
const getIngresosPorEspecialidad = async (req, res) => {
	try {
		const stats = await Turno.aggregate([
			{
				$match: { estado: 'realizado' }, // Solo turnos realizados generan ingresos
			},
			{
				$lookup: {
					from: 'usuarios', // Cambiado de 'doctors' a 'usuarios'
					localField: 'doctor',
					foreignField: '_id',
					as: 'doctorInfo',
				},
			},
			{
				$unwind: '$doctorInfo',
			},
			{
				$match: {
					'doctorInfo._rol': 'Doctor', // Filtrar solo doctores con mayúscula
				},
			},
			{
				$lookup: {
					from: 'especialidads', // Mantener como 'especialidads'
					localField: 'doctorInfo.especialidad',
					foreignField: '_id',
					as: 'especialidadInfo',
				},
			},
			{
				$unwind: '$especialidadInfo',
			},
			{
				$group: {
					_id: '$especialidadInfo._id',
					especialidad: { $first: '$especialidadInfo.nombre' },
					turnosRealizados: { $sum: 1 },
					ingresoTotal: { $sum: '$doctorInfo.precioConsulta' },
					precioPromedio: { $avg: '$doctorInfo.precioConsulta' },
				},
			},
			{
				$sort: { ingresoTotal: -1 },
			},
		])

		// Formato para charts
		const chartData = {
			labels: stats.map(item => item.especialidad),
			datasets: [
				{
					label: 'Ingresos Totales',
					data: stats.map(item => item.ingresoTotal),
					backgroundColor: '#9966FF',
					borderColor: '#9966FF',
					borderWidth: 1,
				},
			],
		}

		res.json({
			raw: stats,
			chartData,
		})
	} catch (error) {
		console.error('Error en getIngresosPorEspecialidad:', error)
		res.status(500).json({ error: 'Error al obtener ingresos por especialidad' })
	}
}

// Endpoint de resumen - obtiene todas las estadísticas principales en una sola llamada
const getResumenEstadisticas = async (req, res) => {
	try {
		// Estadísticas básicas
		const totalTurnos = await Turno.countDocuments()
		const turnosPendientes = await Turno.countDocuments({ estado: 'pendiente' })
		const turnosRealizados = await Turno.countDocuments({ estado: 'realizado' })
		const turnosCancelados = await Turno.countDocuments({ estado: 'cancelado' })

		const totalDoctores = await Usuario.countDocuments({ rol: 'doctor' })
		const totalEspecialidades = await Especialidad.countDocuments()

		// Top 5 especialidades
		const topEspecialidades = await Turno.aggregate([
			{
				$lookup: {
					from: 'usuarios',
					localField: 'doctor',
					foreignField: '_id',
					as: 'doctorInfo',
				},
			},
			{
				$unwind: '$doctorInfo',
			},
			{
				$match: {
					'doctorInfo.rol': 'doctor',
				},
			},
			{
				$lookup: {
					from: 'especialidads',
					localField: 'doctorInfo.especialidad',
					foreignField: '_id',
					as: 'especialidadInfo',
				},
			},
			{
				$unwind: '$especialidadInfo',
			},
			{
				$group: {
					_id: '$especialidadInfo.nombre',
					cantidad: { $sum: 1 },
				},
			},
			{
				$sort: { cantidad: -1 },
			},
			{
				$limit: 5,
			},
		])

		// Top 5 horarios
		const topHorarios = await Turno.aggregate([
			{
				$group: {
					_id: '$hora',
					cantidad: { $sum: 1 },
				},
			},
			{
				$sort: { cantidad: -1 },
			},
			{
				$limit: 5,
			},
		])

		const resumen = {
			estadisticasGenerales: {
				totalTurnos,
				turnosPendientes,
				turnosRealizados,
				turnosCancelados,
				totalDoctores,
				totalEspecialidades,
				porcentajeRealizados: totalTurnos > 0 ? ((turnosRealizados / totalTurnos) * 100).toFixed(1) : 0,
			},
			topEspecialidades,
			topHorarios,
		}

		res.json(resumen)
	} catch (error) {
		console.error('Error en getResumenEstadisticas:', error)
		res.status(500).json({ error: 'Error al obtener resumen de estadísticas' })
	}
}

export {
	getTurnosPorEspecialidad,
	getHorariosMasSolicitados,
	getTurnosPorDoctor,
	getTurnosPorMes,
	getEstadosTurnos,
	getIngresosPorEspecialidad,
	getResumenEstadisticas,
}
