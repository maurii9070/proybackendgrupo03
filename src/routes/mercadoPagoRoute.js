import { Router } from 'express'
import mercadoPagoController from '../controllers/mercadoPagoController.js'
import { body } from 'express-validator'
import { handleInputErrors } from '../middlewares/validacionInputs.js'
const router = Router()

//puse por id doctor para tener de un lado el precio de la consulta
router.post(
	'/crear-preferencia/:idDoctor/turno/:idTurno',
	body('idDoctor').isMongoId().withMessage('ID de doctor inválido'),
	body('idTurno').isMongoId().withMessage('ID de turno inválido'),
	handleInputErrors,
	mercadoPagoController.createPreference
)
router.post('/webhook', mercadoPagoController.recibirPago)
export default router
