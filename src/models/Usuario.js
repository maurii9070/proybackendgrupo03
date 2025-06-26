import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema(
	{
		dni: {
			type: String,
			required: [true, 'El DNI es obligatorio'],
			unique: true,
			trim: true,
			minlength: [7, 'El DNI debe tener al menos 7 caracteres'],
			maxlength: [8, 'El DNI no puede tener más de 8 caracteres'],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true, // El email también debería ser único si lo vamos a usar con firebase + gmail
			sparse: true, // Permite que haya documentos con email nulo sin violar unique
			match: [/^\S+@\S+\.\S+$/, 'Por favor, introduce un email válido'] // Validación de formato de email, tambien se podria obligar a ingresar un mail de gmail
		},
		password: {
			type: String,
			required: [true, 'La contraseña es obligatoria'],
			minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
		},
		nombre: {
			type: String,
			required: [true, 'El nombre es obligatorio'],
			trim: true,
		},
		apellido: {
			type: String,
			required: [true, 'El apellido es obligatorio'],
			trim: true,
		},
		// Este campo lo añadimos para identificar el tipo de usuario cuando no hay login por email
		// Es redundante con _rol, pero puede ser útil si quieres un campo explícito para "rol"
		rol: {
			type: String,
			enum: ['paciente', 'doctor', 'admin'],
			required: true, // El rol es esencial para la autorización
			default: 'paciente' // Valor por defecto si no se especifica al crear
		}
	},
	{
		discriminatorKey: '_rol',
		timestamps: true,
	}
)

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario
