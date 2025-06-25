/**
 * Middleware para proteger rutas: verifica la validez del token JWT.
 * Si el token es válido, agrega el usuario al objeto `req` y llama a `next()`.
 * Si el token no es válido o no se proporciona, devuelve un error 401.
 */

