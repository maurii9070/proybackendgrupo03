import express from 'express'
import {
	getTurnosPorEspecialidad,
	getHorariosMasSolicitados,
	getTurnosPorDoctor,
	getTurnosPorMes,
	getEstadosTurnos,
	getIngresosPorEspecialidad,
	getResumenEstadisticas,
} from '../controllers/estadisticasController.js'
import { protegerRuta } from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/estadisticas/resumen:
 *   get:
 *     summary: Obtiene un resumen general de estadísticas
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de estadísticas obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estadisticasGenerales:
 *                   type: object
 *                 topEspecialidades:
 *                   type: array
 *                 topHorarios:
 *                   type: array
 */

/**
 * @swagger
 * /api/estadisticas/turnos-por-especialidad:
 *   get:
 *     summary: Obtiene la cantidad de turnos por especialidad
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas por especialidad obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 raw:
 *                   type: array
 *                 chartData:
 *                   type: object
 */

/**
 * @swagger
 * /api/estadisticas/horarios-mas-solicitados:
 *   get:
 *     summary: Obtiene los horarios más solicitados
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horarios más solicitados obtenidos exitosamente
 */

/**
 * @swagger
 * /api/estadisticas/turnos-por-doctor:
 *   get:
 *     summary: Obtiene la cantidad de turnos por doctor
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas por doctor obtenidas exitosamente
 */

/**
 * @swagger
 * /api/estadisticas/turnos-por-mes:
 *   get:
 *     summary: Obtiene la cantidad de turnos por mes
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas por mes obtenidas exitosamente
 */

/**
 * @swagger
 * /api/estadisticas/estados-turnos:
 *   get:
 *     summary: Obtiene la distribución de estados de turnos
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estados de turnos obtenidos exitosamente
 */

/**
 * @swagger
 * /api/estadisticas/ingresos-por-especialidad:
 *   get:
 *     summary: Obtiene los ingresos generados por especialidad
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ingresos por especialidad obtenidos exitosamente
 */

// Rutas para estadísticas - requieren autenticación
router.get('/resumen', getResumenEstadisticas)
router.get('/turnos-por-especialidad', getTurnosPorEspecialidad)
router.get('/horarios-mas-solicitados', getHorariosMasSolicitados)
router.get('/turnos-por-doctor', getTurnosPorDoctor)
router.get('/turnos-por-mes', getTurnosPorMes)
router.get('/estados-turnos', getEstadosTurnos)
router.get('/ingresos-por-especialidad', getIngresosPorEspecialidad)

export default router
