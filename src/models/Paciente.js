// modelo para paciente
import mongoose from 'mongoose';

const PacienteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, ingrese un correo electrónico válido.']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  fechaNacimiento: {
    type: Date,
    default: null
  },
  rol: {
    type: String,
    enum: ['paciente', 'doctor', 'admin'],
    default: 'paciente'
  },
  hijos: [{
    nombreHijo: {
      type: String,
      required: [true, 'El nombre del hijo es obligatorio'],
      trim: true
    },
    fechaNacimientoHijo: {
      type: Date,
      required: [true, 'La fecha de nacimiento del hijo es obligatoria']
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Paciente', PacienteSchema);