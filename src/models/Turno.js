import mongoose from "mongoose";
import Paciente from "./Paciente.js";
import Doctor from "./Doctor.js";

const turnoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: [true, "La fecha del turno es obligatoria"],
    },
    hora: {
        type: String,
        required: [true, "La hora del turno es obligatoria"],
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        required: [true, "El paciente es obligatorio"],
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, "El doctor es obligatorio"],
    },
    estado: {
        type: String,
        enum: ["pendiente", "realizado", "cancelado"],
        default: "pendiente",
    },
    observaciones: {
        type: String,
        trim: true,
        default: "",
    }
})
const Turno = mongoose.model("Turno", turnoSchema);
export default Turno;