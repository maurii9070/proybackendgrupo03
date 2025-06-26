// validaciones mediandte express-validator

/**
 * @fileoverview Middleware para manejar y formatear los errores de validación de `express-validator`.
 * Este middleware se utiliza después de definir las reglas de validación con `express-validator`.
 * Si existen errores de validación en la petición, los captura, los formatea en un objeto legible
 * y envía una respuesta 400 (Bad Request) con los detalles de los errores.
 * Si no hay errores, permite que la petición continúe hacia el siguiente middleware o controlador.
 */

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
