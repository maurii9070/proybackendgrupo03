// controlador para manejar un paciente
import Paciente from '../models/Paciente.js'
import bcrypt from 'bcryptjs'

// funciones
export const registrarPaciente = async (req, res) => {
	try {
		const { dni, password, nombre, apellido, telefono, fechaNacimiento, email } = req.body

		// Validación de campos obligatorios
		// Esto podemos hacerlo con un middleware de express-validator
		// if (!email || !password || !nombre || !apellido || !telefono) {
		//   return res.status(400).json({ error: 'Todos los campos son obligatorios' });
		// }

		// valido que el paciente no este registrado por dni
		let paciente = await Paciente.findOne({ dni })
		if (paciente) {
			return res.status(400).json({ error: 'El DNI ya está registrado' })
		}

		// Encriptar la contraseña
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Crear nuevo paciente
		const nuevoPaciente = new Paciente({
			dni,
			password: hashedPassword,
			nombre,
			apellido,
			telefono,
			fechaNacimiento,
			email,
		})

		// Guardar paciente en la base de datos
		await nuevoPaciente.save()
		console.log('Paciente registrado exitosamente:', nuevoPaciente)
		res.status(201).json({ message: 'Paciente registrado exitosamente', paciente: nuevoPaciente })
	} catch (error) {
		console.error('Error al registrar paciente:', error.message)
		if (error.name === 'ValidationError') {
			let errors = {}
			Object.keys(error.errors).forEach(key => {
				errors[key] = error.errors[key].message
			})
			return res.status(400).json({ error: 'Error de validación', details: errors })
		}
		res.status(500).json({ error: 'Error interno del servidor' })
	}
}

export const getPacientes = async (req, res) => {
	try {
		const pacientes = await Paciente.find().select('-password') // Excluir el campo de contraseña
		res.status(200).json(pacientes)
	} catch (error) {
		console.error('Error al obtener pacientes:', error.message)
		res.status(500).json({ error: 'Error interno del servidor' })
	}
}
