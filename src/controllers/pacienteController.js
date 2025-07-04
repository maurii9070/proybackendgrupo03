// controlador para manejar un paciente
import Paciente from '../models/Paciente.js'
import bcrypt from 'bcryptjs'

// funciones
export const registrarPaciente = async (req, res) => {
	try {
		// aca cambiamos para que el paciente se registre con dni y contraseña
		// y no con email y contraseña como en el modelo base Usuario
		const { dni, password, nombre, apellido, telefono, fechaNacimiento, email } = req.body

		// Validación de campos obligatorios
		// Esto podemos hacerlo con un middleware de express-validator
		// if (!email || !password || !nombre || !apellido || !telefono) {
		//   return res.status(400).json({ error: 'Todos los campos son obligatorios' });
		// }

		// 1- hay que verificar si el dni ya existe (ese es el identificador ahora, antes era el email)

		// valido que el paciente no este registrado por dni
		let paciente = await Paciente.findOne({ dni })
		if (paciente) {
			return res.status(400).json({ error: 'El DNI ya está registrado' })
		}

		// Encriptar la contraseña
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Crear nuevo paciente
		const nuevoPaciente = new Paciente({
			dni,
			password: hashedPassword,
			nombre,
			apellido,
			rol: 'paciente', // Asignar rol de paciente, este es el rol que agregamos
			telefono,
			fechaNacimiento,
			email, //opcional, pero si se proporciona, debe ser válido
		})

		// Guardar paciente en la base de datos
		await nuevoPaciente.save()
		console.log('Paciente registrado exitosamente:', nuevoPaciente)
		res.status(201).json({ message: 'Paciente registrado exitosamente', paciente: nuevoPaciente })
	} catch (error) {
		console.error('Error al registrar paciente:', error.message)
		if (error.name === 'ValidationError') {
			let errors = {}
			Object.keys(error.errors).forEach(key => {
				errors[key] = error.errors[key].message
			})
			return res.status(400).json({ error: 'Error de validación', details: errors })
		}
		res.status(500).json({ error: 'Error interno del servidor' })
	}
}

export const getPacientes = async (req, res) => {
	try {
		const pacientes = await Paciente.find().select('-password') // Excluir el campo de contraseña
		res.status(200).json(pacientes)
	} catch (error) {
		console.error('Error al obtener pacientes:', error.message)
		res.status(500).json({ error: 'Error interno del servidor' })
	}
}
export const getPacienteById = async (req, res) => {
	try {
		const { idPaciente } = req.params
		const paciente = await Paciente.findById(idPaciente).select('-password') // Excluir el campo de contraseña
		if (!paciente) {
			return res.status(404).json({ error: 'Paciente no encontrado' })
		}
		res.status(200).json(paciente)
	} catch (error) {
		console.error('Error al obtener paciente:', error.message)
		res.status(500).json({ error: 'Error interno del servidor' })
	}
}
export const getPacienteByDni = async (req, res) => {
    try {
        const { dni } = req.params;
        
        // Limpiar y normalizar el DNI
        const dniNormalizado = dni.trim();
        
        const paciente = await Paciente.findOne({ 
            dni: dniNormalizado 
        }).select('-password');
        
        if (!paciente) {
            // Para depuración: verificar qué DNI se está buscando
            console.log(`Buscando paciente con DNI: "${dniNormalizado}"`);
            return res.status(404).json({ 
                error: 'Paciente no encontrado',
                dniBuscado: dniNormalizado // Para ayudar en la depuración
            });
        }
        
        res.status(200).json(paciente);
    } catch (error) {
        console.error('Error al obtener paciente por DNI:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
