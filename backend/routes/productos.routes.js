import express from "express";
import {
  obtenerProductos,
  obtenerProductoPorID,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  cambiarEstadoProducto
} from "../controllers/productos.controller.js";

const router = express.Router();

// Obtener todos los productos - soporta parámetros opcionales: ?search=..., ?categoria=..., ?activo=1
router.get("/", obtenerProductos);

// Obtener un producto por su ID
router.get("/:id", obtenerProductoPorID);

// Crear un nuevo producto
router.post("/", agregarProducto);

// Editar un producto existente
router.put("/:id", editarProducto);

// Eliminar un producto
router.delete("/:id", eliminarProducto);

// Cambiar estado (activo/inactivo)
router.patch("/:id/estado", cambiarEstadoProducto);

export default router;




// viejas rutas
// import express from "express";
// import {obtenerProductos, obtenerProductoPorID, agregarProducto, editarProducto, eliminarProducto} from "../controllers/productosController.js";

// const router = express.Router();

// router.get("/", obtenerProductos);
// router.get("/:id", obtenerProductoPorID);
// router.post("/", agregarProducto);
// router.put("/:id", editarProducto);
// router.delete("/:id", eliminarProducto);

// export default router;