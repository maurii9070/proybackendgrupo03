import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import { body, param } from 'express-validator'
import { conexionDB } from './config/db.js'
import { handleInputErrors } from './middlewares/validacionInputs.js'
import pacienteRoutes from './routes/pacientes.js'
import doctorRoutes from './routes/doctores.js'
import especialidadesRoutes from './routes/especialidades.js'
import administradorRoutes from './routes/administradores.js'
import authRoutes from './routes/auth.js'
import mercadoPagoRoutes from './routes/mercadoPagoRoute.js'
import { corsConfig } from './config/cors.js'
import turnoRoutes from './routes/turnoRoutes.js'

dotenv.config()

// conectar a la base de datos
conexionDB()

// instanciar express
const app = express()

// CORS
app.use(cors(corsConfig))
// Middleware para procesar datos JSON en las peticiones HTTP.
app.use(express.json())

app.use('/api/pacientes', pacienteRoutes)
app.use('/api/doctores', doctorRoutes)
app.use('/api/especialidades', especialidadesRoutes)
app.use('/api/administradores', administradorRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/mercadoPago', mercadoPagoRoutes)
app.use('/api/turnos', turnoRoutes)
//Rutas de la API, prueba para express-validator
/*
app.get(
	'/:id',
	param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'), // Para los parametros de la ruta
	body('nombre') // Para los datos del cuerpo de la petición
		.trim()
		.notEmpty()
		.withMessage('El nombre es obligatorio')
		.isLength({ min: 2, max: 10 })
		.withMessage('El nombre debe tener entre 2 y 10 caracteres'),
	handleInputErrors, // Middleware para manejar errores de validación (Muestra un arreglo de errores)
	(req, res) => {
		res.send('API funcionando...')
	}
)
*/
const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log(colors.cyan.bold(`Servidor corriendo en el puerto: ${port}`))
})
