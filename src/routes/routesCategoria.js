//Llamar al Router de express (con llaves: solo traemos Router)
const { Router } = require('express');

//Llamamos al controlador de categorías y al middleware que revisa el token
const control = require('../controllers/controllerCategoria.js');
const verificarToken = require('../middlewares/verificarToken.js');

const routesCategoria = Router();

//Rutas libres: cualquiera puede consultar las categorías
routesCategoria.get('/', control.listarCategorias);
routesCategoria.get('/:id', control.obtenerCategoriaPorId);

//Rutas protegidas: primero el guardia (verificarToken), luego el controlador
routesCategoria.post('/', verificarToken, control.crearCategoria);
routesCategoria.put('/:id', verificarToken, control.actualizarCategoria);
routesCategoria.delete('/:id', verificarToken, control.eliminarCategoria);

module.exports = routesCategoria;
