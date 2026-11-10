// 1. Llamar a Express
const express = require('express');

// 2. Llamar a las rutas de productos
const productosRoutes = require('./routes/productos.routes.js');

// 3. Crear la aplicación y permitir leer JSON en el body
const app = express();
app.use(express.json());

// 4. Rutas de productos
app.use('/productos', productosRoutes);

// 5. Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
