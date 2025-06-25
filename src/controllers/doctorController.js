//controller para doctor
import Doctor from '../models/Doctor.js';
import Especialidad from '../models/Especialidad.js';
import bcrypt from 'bcryptjs';

//registrar un nuevo doctor
export const registrarDoctor = async (req, res) => {
  try {
    const { email, password, nombre, apellido, especialidadId, precioConsulta, telefono, disponibilidad } = req.body;

    // Verificar si el doctor ya existe
    const doctorExistente = await Doctor.findOne({ email });
    if (doctorExistente) {
      return res.status(400).json({ message: 'El doctor ya está registrado' });
    }

    // Verificar si la especialidad existe
    const especialidadExistente = await Especialidad.findById(especialidadId);
    if (!especialidadExistente) {
      return res.status(400).json({ message: 'La especialidad no existe' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Crear el nuevo doctor
    const nuevoDoctor = new Doctor({
      email,
      password: passwordEncriptada,
      nombre,
      apellido,
      especialidad: especialidadId, //se guarda la referecian al objectId de especialidad
      precioConsulta,
      telefono,
      disponibilidad: disponibilidad || [], // si no se proporciona, se inicializa como un arreglo vacío
    });

    // Guardar el doctor en la base de datos
    await nuevoDoctor.save();

    res.status(201).json({ message: 'Doctor registrado exitosamente', doctorId: nuevoDoctor._id });
  } catch (error) {
    console.error('Error al registrar doctor:', error.message);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todos los doctores
export const getDoctores = async (req, res) => {
  try {
    // se usa .select('-password') para no enviar la contraseña al cliente
    // se usa .populate('especialidad', 'nombre') para obtener el nombre de la especialidad
    const doctores = await Doctor.find().select('-password').populate('especialidad', 'nombre');
    res.status(200).json(doctores);
  } catch (error) {
    console.error('Error al obtener doctores:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// actualizar informacion de un doctor (actualiza solo telefono, precioConsulta y disponibilidad)
export const actualizarDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nombre, apellido, especialidad, precioConsulta, telefono, disponibilidad } = req.body;

    // Verificar si el doctor existe
    const doctorExistente = await Doctor.findById(id);
    if (!doctorExistente) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    // Actualizar los datos del doctor (solo campos telefono, precioConsulta y disponibilidad)
    doctorExistente.disponibilidad = disponibilidad || doctorExistente.disponibilidad;
    doctorExistente.precioConsulta = precioConsulta || doctorExistente.precioConsulta;
    doctorExistente.telefono = telefono || doctorExistente.telefono;

    // Si se intenta cambiar la especialidad, verificar que la nueva especialidad exista (funciona pero me parece que no es necesario)
    /* if (especialidadId !== undefined) {
      const especialidadExistente = await Especialidad.findById(especialidad);
      if (!especialidadExistente) {
        return res.status(400).json({ message: 'La especialidad no existe' });
      }
      doctorExistente.especialidad = especialidad; // Actualizar la especialidad
    } */

    // Guardar los cambios en la base de datos
    await doctorExistente.save();

    res.status(200).json({ message: 'Doctor actualizado exitosamente', doctor: doctorExistente });
  } catch (error) {
    console.error('Error al actualizar el doctor:', error.message);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un doctor (borrado lógico)
export const eliminarDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el doctor existe
    const doctorExistente = await Doctor.findById(id);
    if (!doctorExistente) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    // Marcar al doctor como inactivo
    doctorExistente.activo = false;
    await doctorExistente.save();
    res.status(200).json({ message: 'Doctor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el doctor:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

