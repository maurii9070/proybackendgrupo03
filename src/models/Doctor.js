// modelo para doctor
import mongoose from 'mongoose';
import { act } from 'react';

const DoctorSchema = new mongoose.Schema({
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
  especialidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Especialidad',
    // se refiere al modelo Especialidad
    required: [true, 'La especialidad es obligatoria'],
    trim: true
  },
  precioConsulta: {
    type: Number,
    required: [true, 'El precio de la consulta es obligatorio'],
    min: [0, 'El precio de la consulta no puede ser negativo']
  },
  telefono: {
    type: String,
    trim: true,
    default: null
  },
  activo: {
    type: Boolean,
    default: true
  },
  rol: {
    type: String,
    enum: ['doctor'],
    default: 'doctor'
  },
  // la disponibilidad del doctor se gestiona en el frontend
  disponibilidad: [{
    diaSemana: {
      type: String,
      required: true,
      enum: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
    },
    horaInicio: {
      type: String, //usar string HH:MM
      required: true,
    },
    horaFin: {
      type: String, //usar string HH:MM
      required: true,
    }
  }]
}, {
  timestamps: true
});


export default mongoose.model('Doctor', DoctorSchema);