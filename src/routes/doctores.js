import express from 'express';
const router = express.Router();
import { registrarDoctor, getDoctores, actualizarDoctor, eliminarDoctor, getDoctoresByName, getDoctoresByEspecialidad, getDoctorById } from '../controllers/doctorController.js';

// rutas
router.post('/', registrarDoctor); // Registrar un nuevo doctor
router.get('/', getDoctores); // Obtener todos los doctores
router.put('/:id', actualizarDoctor); // Actualizar un doctor por ID
router.delete('/:id', eliminarDoctor); // Eliminar un doctor por ID (borrado lógico)
router.get('/name', getDoctoresByName);
router.get('/especialidad/:idEspecialidad', getDoctoresByEspecialidad)
router.get('/:id',getDoctorById)

// Faltan agregar validaciones y middlewares de autorización 
// las rutas que estan, ya estan probadas y funcionan correctamente

export default router;