import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { apiReference } from '@scalar/express-api-reference'

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API Documentation',
			version: '1.0.0',
			description: 'Documentación de mi API',
		},
		servers: [
			//se puede agregar el servidor desplegado en producción
			{
				url: 'http://la-ruta-del-backend-en-render.com',
				description: 'Servidor en producción (Render)',
			},

			{
				url: 'http://localhost:4000', // Cambia esto según tu entorno
				description: 'Servidor local',
			},
		],
		//PARA AGREGAR AUTENTICACIÓN CON JWT
		// components: {
		//     securitySchemes: {
		//         bearerAuth: {
		//             type: 'http',
		//             scheme: 'bearer',
		//             bearerFormat: 'JWT',
		//         },
		//     },
		// },
		// security: [
		//     {
		//         bearerAuth: [],
		//     },
		// ],
	},
	apis: ['src/routes/*.js'], // Ruta a tus archivos de rutas
}

const swaggerSpec = swaggerJsdoc(options)
export const swaggerDocs = app => {
	// Configurar la ruta para acceder a la documentación Swagger
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

	app.use(
		'/reference',
		apiReference({
			spec: {
				content: swaggerSpec,
			},
			theme: 'deepSpace',
			darkMode: true,
			layout: 'modern',
		})
	)

	// Opcional: Ruta para obtener el spec JSON
	app.get('/api-docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})
	console.log('Documentación Swagger disponible en /api-docs')
}
