import express from "express";
import { obtenerUsuario, agregarUsuario, editarUsuario, eliminarUsuario } from "../controllers/usuariosController.js";

const router = express.Router();

router.get("/", obtenerUsuario);
router.post("/", agregarUsuario);
router.put("/:id", editarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;