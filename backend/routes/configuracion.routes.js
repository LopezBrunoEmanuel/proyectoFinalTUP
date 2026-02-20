import express from "express";
import {
  obtenerConfiguracion,
  obtenerConfiguracionPublica,
  obtenerConfiguracionPorClave,
  obtenerConfiguracionPorGrupo,
  crearConfiguracion,
  actualizarConfiguracion,
  actualizarConfiguracionPorClave,
  actualizarConfiguracionMasiva,
  eliminarConfiguracion
} from "../controllers/configuracion.controller.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rutas publicas
// GET - Obtener configuración pública
router.get("/publica", obtenerConfiguracionPublica);

// Rutas de ADMIN
// GET - Obtener toda la configuración
router.get("/", verificarToken, verificarAdmin, obtenerConfiguracion);

// GET - Obtener configuración por grupo
router.get("/grupo/:grupo", verificarToken, verificarAdmin, obtenerConfiguracionPorGrupo);

// GET - Obtener configuración por clave
router.get("/clave/:clave", verificarToken, verificarAdmin, obtenerConfiguracionPorClave);

// POST - Crear nueva configuración
router.post("/", verificarToken, verificarAdmin, crearConfiguracion);

// PUT - Actualizar configuración por ID
router.put("/:id", verificarToken, verificarAdmin, actualizarConfiguracion);

// PUT - Actualizar valor por clave
router.put("/clave/:clave", verificarToken, verificarAdmin, actualizarConfiguracionPorClave);

// PUT - Actualizar múltiples configuraciones
router.put("/masiva", verificarToken, verificarAdmin, actualizarConfiguracionMasiva);

// DELETE - Eliminar configuración
router.delete("/:id", verificarToken, verificarAdmin, eliminarConfiguracion);

export default router;