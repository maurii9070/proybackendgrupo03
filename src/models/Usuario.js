import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema(
	{
		dni: {
			type: String,
			required: [true, 'El DNI es obligatorio'],
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			match: [/^\S+@\S+\.\S+$/, 'Por favor, ingresa un correo electrónico válido'],
		},
		password: {
			type: String,
			required: [true, 'La contraseña es obligatoria'],
			minlength: [3, 'La contraseña debe tener al menos 3 caracteres'],
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
	},
	{ discriminatorKey: '_rol' }
)

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario
