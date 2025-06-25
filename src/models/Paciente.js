// modelo para paciente
import mongoose from 'mongoose'
import Usuario from './Usuario.js'

const PacienteSchema = new mongoose.Schema({
	telefono: {
		type: String,
		required: [true, 'El teléfono es obligatorio'],
		trim: true,
	},
	fechaNacimiento: {
		type: String, // Usar string en formato YYYY-MM-DD - Creo que es mas facil de manejar
		trim: true,
		required: [true, 'La fecha de nacimiento es obligatoria'],
	},
	uid_firebase: {
		type: String,
		trim: true,
		default: null, // Para que no sea obligatorio
	},

	// Para sacar a hijos de aqui, mejor registremos por dni y se nos va los hijes

	// hijos: [{
	//   nombreHijo: {
	//     type: String,
	//     required: [true, 'El nombre del hijo es obligatorio'],
	//     trim: true
	//   },
	//   fechaNacimientoHijo: {
	//     type: Date,
	//     required: [true, 'La fecha de nacimiento del hijo es obligatoria']
	//   }
	// }]
})

// Hereda del modelo Usuario
const Paciente = Usuario.discriminator('Paciente', PacienteSchema)
export default Paciente
