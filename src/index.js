import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import { conexionDB } from './config/db.js'
import pacienteRoutes from './routes/pacientes.js'
import doctorRoutes from './routes/doctores.js'
import especialidadesRoutes from './routes/especialidades.js'
import administradorRoutes from './routes/administradores.js'
import authRoutes from './routes/auth.js'
import mercadoPagoRoutes from './routes/mercadoPagoRoute.js'
import { corsConfig } from './config/cors.js'
import morgan from 'morgan'
import turnoRoutes from './routes/turnoRoutes.js'
import archivoRoutes from './routes/archivoRoutes.js'
import { swaggerDocs } from './config/swagger.js'

dotenv.config()

// conectar a la base de datos
conexionDB()

// instanciar express
const app = express()

// CORS
app.use(cors(corsConfig))
// Middleware para procesar datos JSON en las peticiones HTTP.
app.use(express.json())

app.use(morgan('dev'))

//ruta de swagger
swaggerDocs(app)
//rutas de la API
app.use('/api/pacientes', pacienteRoutes)
app.use('/api/doctores', doctorRoutes)
app.use('/api/especialidades', especialidadesRoutes)
app.use('/api/administradores', administradorRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/mercadoPago', mercadoPagoRoutes)
app.use('/api/turnos', turnoRoutes)
app.use('/api/archivos', archivoRoutes)

const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log(colors.cyan.bold(`Servidor corriendo en el puerto: ${port}`))
	console.log('Documentación Swagger en http://localhost:4000/api-docs')
})
