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

// OBTENER TODOS LOS PRODUCTOS
router.get("/", obtenerProductos);

// OBTENER UN PRODUCTO POR ID
router.get("/:id", obtenerProductoPorID);

// CREAR NUEVO PRODUCTO
router.post("/", agregarProducto);

// EDITAR UN PRODUCTO
router.put("/:id", editarProducto);

// ELIMINAR PRODUCTO
router.delete("/:id", eliminarProducto);

// CAMBIAR ESTADO (activo/inactivo)
router.patch("/:id/estado", cambiarEstadoProducto);

export default router;