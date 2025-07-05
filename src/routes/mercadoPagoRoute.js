import { Router } from 'express';
import  mercadoPagoController  from '../controllers/mercadoPagoController.js';
const router = Router();

//puse por id doctor para tener de un lado el precio de la consulta
router.post('/crear-preferencia/:idDoctor/turno/:idTurno', mercadoPagoController.createPreference);
router.post('/webhook', mercadoPagoController.recibirPago);
export default router;