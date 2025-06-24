// controlador para manejar un paciente
import Paciente from '../models/Paciente.js';

// funciones
export const registrarPaciente = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, fechaNacimiento, hijos } = req.body;

    // Validación de campos obligatorios
    if (!email || !password || !nombre || !apellido || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // valido que el paciente no este registrado por email
    let paciente = await Paciente.findOne({ email });
    if (paciente) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Crear nuevo paciente
    const nuevoPaciente = new Paciente({
      email,
      password,
      nombre,
      apellido,
      telefono,
      fechaNacimiento,
      hijos
    });

    // Guardar paciente en la base de datos
    await nuevoPaciente.save();

    res.status(201).json({ message: 'Paciente registrado exitosamente', paciente: nuevoPaciente });
  } catch (error) {
    console.error('Error al registrar paciente:', error.message);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ error: 'Error de validación', details: errors });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find().select('-password'); // Excluir el campo de contraseña
    res.status(200).json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
