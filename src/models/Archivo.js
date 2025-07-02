import mongoose from 'mongoose'

const archivoSchema = new mongoose.Schema({
	nombre: { type: String, required: true },
	tipo: { type: String, required: true, enum: ['medico', 'pago'] },
	url: { type: String, required: true },
	fechaSubida: { type: Date, default: Date.now },
})

const Archivo = mongoose.model('Archivo', archivoSchema)
export default Archivo
