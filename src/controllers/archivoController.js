import Turno from '../models/Turno.js'
import Archivo from '../models/Archivo.js'

export const subirArchivo = async (req, res) => {
	const { idTurno } = req.params
	const { tipo, url } = req.body

	const turno = await Turno.findById(idTurno)
	if (!turno) {
		return res.status(404).json({ message: 'Turno no encontrado' })
	}

	const nuevoArchivo = new Archivo({ tipo, url })

	// Agregar el archivo al turno
	turno.archivos.push(nuevoArchivo._id)

	await Promise.allSettled([nuevoArchivo.save(), turno.save()])

	return res.json({ message: 'Archivo subido correctamente', idTurno })
}
