// 1. Importar Router de Express
const { Router } = require('express');

// 2. Importar el controlador de productos
const control = require('../controllers/productos.controller.js');

const router = Router();

// 3. Rutas de productos (el prefijo /productos se define en app.js)
router.get('/', control.listarProductos);
router.get('/:id', control.obtenerProductoPorId);
router.post('/', control.crearProducto);
router.put('/:id', control.actualizarProducto);
router.delete('/:id', control.eliminarProducto);

module.exports = router;
