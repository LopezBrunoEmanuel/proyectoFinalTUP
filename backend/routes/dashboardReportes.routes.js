// ============================================================
// dashboardReportes.routes.js
// Define las rutas GET del panel de reportes.
// Se registra en index.routes.js bajo el prefijo /dashboardReportes
//
// Rutas disponibles (con prefijo /api/dashboardReportes/...):
//   GET /api/dashboardReportes/clientes
//   GET /api/dashboardReportes/productos
//   GET /api/dashboardReportes/reservas
//   GET /api/dashboardReportes/usuarios
//   GET /api/dashboardReportes/resumen
//   GET /api/dashboardReportes/actividad
//
// UTN - Tecnicatura Universitaria en Programación
// Trabajo Final de Carrera
// ============================================================

import { Router } from "express";
import {
  getTotalClientes,
  getTotalProductos,
  getTotalReservas,
  getTotalUsuarios,
  getDashboardResumen,
  getDashboardActividad
} from "../controllers/dashboardReportes.controller.js";

const router = Router();

// Cada ruta llama a su función del controlador
router.get("/clientes", getTotalClientes);
router.get("/productos", getTotalProductos);
router.get("/reservas", getTotalReservas);
router.get("/usuarios", getTotalUsuarios);
router.get("/resumen", getDashboardResumen);
router.get("/actividad", getDashboardActividad);

export default router;