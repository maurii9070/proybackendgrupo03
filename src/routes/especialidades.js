// src/routes/especialidades.js
import express from 'express';
const router = express.Router();
import { crearEspecialidad, getEspecialidadById, getEspecialidades, actualizarEspecialidad, eliminarEspecialidad } from '../controllers/especialidadController.js';

//  Rutas para manejar especialidades
router.post('/', crearEspecialidad);
router.get('/:id', getEspecialidadById);
router.get('/', getEspecialidades);
router.put('/:id', actualizarEspecialidad);
router.delete('/:id', eliminarEspecialidad);

export default router;