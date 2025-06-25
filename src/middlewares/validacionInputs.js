// validaciones mediandte express-validator
import { validationResult } from 'express-validator';

export const handleInputErrors = (req, res, next) => {
	let errors = validationResult(req); // Obtiene los errores de validación
	// Si hay errores, devuelve un error 400 con los detalles de los errores
	// Si no hay errores, llama a next() para continuar con la siguiente función middleware
	if (!errors.isEmpty()) {
		const extractedErrors = [];
		errors.array().forEach(err => {
			// Extrae los errores y los formatea
			if (!extractedErrors[err.path]) {
				extractedErrors[err.path] = [];
			}
			extractedErrors[err.path].push(err.msg);
		});

		return res.status(400).json({ errors: extractedErrors }); // Devuelve un error 400 con los errores de validación
	}

	next(); // Si no hay errores, continúa con la siguiente función middleware
};
