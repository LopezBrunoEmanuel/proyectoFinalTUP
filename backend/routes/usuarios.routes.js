import express from "express";
import { 
  obtenerUsuario,
  obtenerUsuarioPorId,
  agregarUsuario,
  editarUsuario,
  eliminarUsuario,
  actualizarPassword,
  editarMiUsuario,
  actualizarMiPassword,
} from "../controllers/usuarios.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.use((req, res, next)=>{
  console.log("[USUARIOS]", req.method, req.originalUrl);
  next();
});

// EDITAR MI PERFIL (usuario logueado)
router.put("/me", auth, editarMiUsuario);

// CAMBIAR MI CONTRASEÑA (usuario logueado)
router.put("/me/password", auth, actualizarMiPassword);

// OBTENER TODOS LOS USUARIOS
router.get("/", obtenerUsuario);

// OBTENER UN USUARIO POR ID
router.get("/:id", obtenerUsuarioPorId);

// CREAR USUARIO NUEVO
router.post("/", agregarUsuario);

// CAMBIAR CONTRASEÑA
router.put("/actualizar-password", actualizarPassword);

// EDITAR DATOS DE USUARIO (excepto la contraseña)
router.put("/:id", editarUsuario);

// ELIMINAR USUARIO
router.delete("/:id", eliminarUsuario);

export default router;
