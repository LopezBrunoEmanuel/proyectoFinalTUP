import express from "express";
import { 
  obtenerUsuario,
  agregarUsuario,
  editarUsuario,
  eliminarUsuario,
  actualizarPassword
} from "../controllers/usuarios.controller.js";

const router = express.Router();

// OBTENER TODOS LOS USUARIOS
router.get("/", obtenerUsuario);

// CREAR USUARIO NUEVO
router.post("/", agregarUsuario);

router.use((req, res, next) => {
  console.log("[USUARIOS ROUTER]", req.method, req.originalUrl);
  next();
});

// CAMBIAR CONTRASEÑA
router.put("/actualizar-password", actualizarPassword);

// EDITAR DATOS DE USUARIO (excepto la contraseña)
router.put("/:id", editarUsuario);

// ELIMINAR USUARIO
router.delete("/:id", eliminarUsuario);

export default router;
