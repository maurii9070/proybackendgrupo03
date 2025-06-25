//rutas para el modelo paciente
import express from 'express'
import { registrarPaciente, getPacientes } from '../controllers/pacienteController.js'
const router = express.Router()

// Ruta para registrar un nuevo paciente
router.post('/registro', registrarPaciente)

// Ruta para obtener todos los pacientes
router.get('/', getPacientes)

export default router
