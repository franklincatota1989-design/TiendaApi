const pool = require('../config/db.js');

// Crea el cliente y devuelve sus datos SIN el hash de la clave
async function crearCliente(nombre, email, passwordHash) {
    const r = await pool.query(`INSERT INTO clientes (nombre, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, nombre, email, rol`,
        [nombre, email, passwordHash]);
    return r.rows[0];
}s

// Busca por email. Es la única consulta que trae el hash, porque el login
// lo necesita para bcrypt.compare; el controlador nunca lo envía al cliente.
async function buscarPorEmail(email) {
    const r = await pool.query(`SELECT id, nombre, email, password, rol
         FROM clientes
         WHERE email = $1 AND activo = true`, [email]);
    return r.rows[0];
}

// Datos públicos del cliente para /auth/perfil (sin el hash)
async function obtenerClientePorId(id) {
    const r = await pool.query(`SELECT id, nombre, email, rol, creado_en
         FROM clientes
         WHERE id = $1 AND activo = true`, [id]);
    return r.rows[0];
}

module.exports = {
    crearCliente,
    buscarPorEmail,
    obtenerClientePorId
};
