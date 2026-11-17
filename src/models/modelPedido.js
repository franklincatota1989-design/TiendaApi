const pool = require('../config/db');

// 1. Cabecera: el dueño (cliente_id) llega desde el token, no desde el body
async function crearPedido(cliente_id) {
    const r = await pool.query(
        `INSERT INTO pedidos (cliente_id)
         VALUES ($1)
         RETURNING id, cliente_id, fecha, estado, total`, [cliente_id]);
    return r.rows[0];
}

// 2. Detalle: el precio se copia de productos (INSERT ... SELECT)
//    $3::int indica a PostgreSQL que la cantidad es un número entero
async function agregarDetalle(pedido_id, producto_id, cantidad) {
    const r = await pool.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
         SELECT $1::int, id, $3::int, precio, precio * $3::int
         FROM productos
         WHERE id = $2 AND activo = true
         RETURNING producto_id, cantidad, precio_unitario, subtotal`,
        [pedido_id, producto_id, cantidad]);
    return r.rows[0];
}

// 3. Total = suma de los subtotales del detalle (lo calcula la base)
async function actualizarTotal(pedido_id) {
    const r = await pool.query(
        `UPDATE pedidos
         SET total = (
             SELECT COALESCE(SUM(subtotal), 0)
             FROM detalle_pedido
             WHERE pedido_id = $1
         )
         WHERE id = $1
         RETURNING id, cliente_id, fecha, estado, total`, [pedido_id]);
    return r.rows[0];
}

// Mis pedidos: solo los del cliente del token
async function listarPedidosDeCliente(cliente_id) {
    const r = await pool.query(
        `SELECT id, fecha, estado, total
         FROM pedidos
         WHERE cliente_id = $1
         ORDER BY id DESC`, [cliente_id]);
    return r.rows;
}

// Un pedido: el id Y el dueño deben coincidir (evita IDOR)
async function obtenerPedido(id, cliente_id) {
    const r = await pool.query(
        `SELECT id, cliente_id, fecha, estado, total
         FROM pedidos
         WHERE id = $1 AND cliente_id = $2`, [id, cliente_id]);
    return r.rows[0]; // undefined si no existe o es de otro cliente
}

// Las líneas del pedido con el nombre del producto (JOIN)
async function obtenerDetalle(pedido_id) {
    const r = await pool.query(
        `SELECT d.producto_id, p.nombre, d.cantidad, d.precio_unitario, d.subtotal
         FROM detalle_pedido d
         JOIN productos p ON p.id = d.producto_id
         WHERE d.pedido_id = $1
         ORDER BY d.id`, [pedido_id]);
    return r.rows;
}

module.exports = {
    crearPedido,
    agregarDetalle,
    actualizarTotal,
    listarPedidosDeCliente,
    obtenerPedido,
    obtenerDetalle
};
