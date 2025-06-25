import express from 'express';
const router = express.Router();
import { registrarDoctor, getDoctores, actualizarDoctor, eliminarDoctor } from '../controllers/doctorController.js';

// rutas
router.post('/', registrarDoctor); // Registrar un nuevo doctor
router.get('/', getDoctores); // Obtener todos los doctores
router.put('/:id', actualizarDoctor); // Actualizar un doctor por ID
router.delete('/:id', eliminarDoctor); // Eliminar un doctor por ID (borrado lógico)

export default router;