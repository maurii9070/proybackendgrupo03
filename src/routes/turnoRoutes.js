import express from 'express';
import turnoController from '../controllers/turnoController.js';

const router = express.Router();
// Rutas para Turnos
// Crear un turno 
router.post('/paciente/:idPaciente/doctor/:idDoctor', turnoController.createTurno);
// Obtener turnos por paciente y doctor
router.get('/paciente/:idPaciente', turnoController.getTurnosByPaciente);
router.get('/doctor/:idDoctor', turnoController.getTurnosByDoctor);
// Obtener un turno por ID
router.get('/:idTurno', turnoController.getTurnoById);
// Actualizar un turno (actualiza solo observaciones)
router.put('/:idTurno', turnoController.updateTurno);
// Cancelar un turno cambia estado a "cancelado"
router.put('/:idTurno/cancelado', turnoController.cancelarTurno);
// Marcar un turno como realizado cambia estado a "realizado"
router.put('/:idTurno/realizado', turnoController.successTurno);
export default router;