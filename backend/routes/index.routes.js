import express from "express";
import usuariosRoutes from "./usuarios.routes.js";
import productosRoutes from "./productos.routes.js";
import categoriasRoutes from "./categorias.routes.js";
import tamaniosRoutes from "./tamanios.routes.js";
import direccionesRoutes from "./direcciones.routes.js";
import serviciosRoutes from "./servicios.routes.js";
import metodosPagoRoutes from "./metodos_pago.routes.js";
import reservasRoutes from "./reservas.routes.js";
import configuracionRoutes from "./configuracion.routes.js";
import estadosRoutes from "./estado_reservas.routes.js";

const router = express.Router();

// ESTAS SON TODAS LAS RUTAS QUE MANEJA LA API
// (no todas estan en uso aun)

router.use("/auth", usuariosRoutes);        // /api/auth/login, /api/auth/register
router.use("/usuarios", usuariosRoutes);    // /api/usuarios

// Catalogo
router.use("/productos", productosRoutes);  // /api/productos
router.use("/categorias", categoriasRoutes); // /api/categorias
router.use("/tamanios", tamaniosRoutes);    // /api/tamanios

// Usuario
router.use("/direcciones", direccionesRoutes); // /api/direcciones

// Servicios
router.use("/servicios", serviciosRoutes);  // /api/servicios

// Reservas
router.use("/reservas", reservasRoutes);    // /api/reservas
router.use("/estados-reserva", estadosRoutes); // /api/estados-reserva
router.use("/metodos-pago", metodosPagoRoutes); // /api/metodos-pago

// Configuracion de datos generales del vivero
router.use("/configuracion", configuracionRoutes); // /api/configuracion

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API del Vivero funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

export default router;