import express from "express";
import {
  obtenerServicios,
  obtenerServiciosActivos,
  obtenerServicioPorId,
  crearServicio,
  editarServicio,
  eliminarServicio
} from "../controllers/servicios.controller.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rutas publicas
// GET - Obtener servicios activos
router.get("/activos", obtenerServiciosActivos);

// GET - Obtener un servicio por ID
router.get("/:id", obtenerServicioPorId);

// Rutas de ADMIN
// GET - Obtener todos los servicios
router.get("/", verificarToken, verificarAdmin, obtenerServicios);

// POST - Crear nuevo servicio
router.post("/", verificarToken, verificarAdmin, crearServicio);

// PUT - Editar servicio
router.put("/:id", verificarToken, verificarAdmin, editarServicio);

// DELETE - Eliminar servicio
router.delete("/:id", verificarToken, verificarAdmin, eliminarServicio);

export default router;