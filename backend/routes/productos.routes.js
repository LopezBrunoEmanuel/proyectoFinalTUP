import express from "express";
import {
  obtenerProductos,
  obtenerProductoPorID,
  agregarProducto,
  editarProducto,
  cambiarEstadoProducto,
  activarProductoConTamanios,
  eliminarProducto,
  obtenerTamaniosProducto,
  agregarTamanioAProducto,
  editarTamanioDeProducto,
  eliminarTamanioDeProducto,
} from "../controllers/productos.controller.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rutas publicas (catalogo)
// GET - Obtener todos los productos
router.get("/", obtenerProductos);

// GET - Obtener un producto por ID
router.get("/:id", obtenerProductoPorID);

// Rutas de ADMIN
// POST - Crear nuevo producto
router.post("/", verificarToken, verificarAdmin, agregarProducto);

// PUT - Editar producto
router.put("/:id", verificarToken, verificarAdmin, editarProducto);

// PATCH - Cambiar estado (activo/inactivo)
router.patch("/:id/estado", verificarToken, verificarAdmin, cambiarEstadoProducto);

// POST - Activar producto con selección de tamaños
router.post("/:id/activar-con-tamanios", verificarToken, verificarAdmin, activarProductoConTamanios);

// DELETE - Eliminar producto
router.delete("/:id", verificarToken, verificarAdmin, eliminarProducto);

// Rutas de gestion de tamaños ADMIN
// GET - Obtener tamaños de un producto
router.get("/:id/tamanios", verificarToken, verificarAdmin, obtenerTamaniosProducto);

// POST - Agregar tamaño a un producto
router.post("/:id/tamanios", verificarToken, verificarAdmin, agregarTamanioAProducto);

// PUT - Editar tamaño
router.put("/:id/tamanios/:idTamanio", verificarToken, verificarAdmin, editarTamanioDeProducto);

// DELETE - Eliminar tamaño
router.delete("/:id/tamanios/:idTamanio", verificarToken, verificarAdmin, eliminarTamanioDeProducto);

export default router;