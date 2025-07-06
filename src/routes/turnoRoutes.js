import express from 'express'
import turnoController from '../controllers/turnoController.js'

const router = express.Router()
// Rutas para Turnos
// Crear un turno
router.post('/paciente/:idPaciente/doctor/:idDoctor', turnoController.createTurno)
// Obtener turnos por paciente y doctor
router.get('/paciente/:idPaciente', turnoController.getTurnosByPaciente)
router.get('/doctor/:idDoctor', turnoController.getTurnosByDoctor)
// Obtener todos los turnos
router.get('/', turnoController.getAllTurnos)
// Obtener turnos fecha
router.get('/fecha', turnoController.getTurnosByFecha)
// Obtener un turno por ID
router.get('/:idTurno', turnoController.getTurnoById)

// Obtener todos los turnos de un doctor por fecha
router.get('/doctor/:idDoctor/fecha', turnoController.getTurnosByDoctorAndFecha)
// Obtener turnos por estado pendiente
router.get('/estado/pendiente', turnoController.getTurnosPendientes)
// Obtener turnos por estado :estado
router.get('/estado/:estado/paciente/:idPaciente',turnoController.getTurnosByEstadoAndPacienteId)
// Actualizar un turno (actualiza solo observaciones)
router.put('/:idTurno', turnoController.updateTurno)
// Cancelar un turno cambia estado a "cancelado"
router.put('/:idTurno/cancelado', turnoController.cancelarTurno)
// Marcar un turno como realizado cambia estado a "realizado"
router.put('/:idTurno/realizado', turnoController.successTurno)
// Confirmar un turno cambia estado a "confirmado"
router.put('/:idTurno/confirmado', turnoController.confirmarTurno)
export default router
