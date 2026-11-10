// El controlador valida los datos y decide qué código de estado responder
const producto = require('../models/producto.model.js');

// Validación de datos: nombre obligatorio, precio mayor a 0 y stock no negativo
const datosValidos = (d) => d.nombre && Number(d.precio) > 0 && Number(d.stock) >= 0;
// Validación de ID: debe ser un número entero mayor a 0
const idValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

async function listarProductos(req, res) {
  const productos = await producto.listarProductos();
  res.status(200).json(productos);
}

async function obtenerProductoPorId(req, res) {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const encontrado = await producto.obtenerProductoPorId(id);
  if (!encontrado) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(200).json(encontrado);
}

async function crearProducto(req, res) {
  const { nombre, precio, stock } = req.body ?? {};
  if (!datosValidos({ nombre, precio, stock })) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  const nuevo = await producto.crearProducto(nombre, precio, stock);
  res.status(201).json(nuevo);
}

async function actualizarProducto(req, res) {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body ?? {};
  if (!idValido(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  if (!datosValidos({ nombre, precio, stock })) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  const actualizado = await producto.actualizarProducto(id, nombre, precio, stock);
  if (!actualizado) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(200).json(actualizado);
}

async function eliminarProducto(req, res) {
  const { id } = req.params;
  if (!idValido(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const filas = await producto.eliminarProducto(id);
  if (filas === 0) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(204).send();
}

module.exports = {
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
