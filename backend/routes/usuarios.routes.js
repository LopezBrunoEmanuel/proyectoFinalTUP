import express from "express";
import { 
  obtenerUsuario,
  agregarUsuario,
  editarUsuario,
  eliminarUsuario,
  actualizarPassword
} from "../controllers/usuariosController.js";

const router = express.Router();

// OBTENER TODOS LOS USUARIOS
router.get("/", obtenerUsuario);

// CREAR USUARIO NUEVO
router.post("/", agregarUsuario);

// EDITAR DATOS DE USUARIO (excepto la contraseña)
router.put("/:id", editarUsuario);

// CAMBIAR CONTRASEÑA
router.put("/actualizar-password", actualizarPassword);

// ELIMINAR USUARIO
router.delete("/:id", eliminarUsuario);

export default router;
