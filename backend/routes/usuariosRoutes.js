// import express from "express";
// import { obtenerUsuario, agregarUsuario, editarUsuario, eliminarUsuario } from "../controllers/usuariosController.js";

// const router = express.Router();

// router.get("/", obtenerUsuario);
// router.post("/", agregarUsuario);
// router.put("/:id", editarUsuario);
// router.delete("/:id", eliminarUsuario);

// // nueva ruta
// router.put("/actualizar-password", UsuarioController.actualizarPassword);

// export default router;


import express from "express";
import { 
  obtenerUsuario,
  agregarUsuario,
  editarUsuario,
  eliminarUsuario,
  actualizarPassword
} from "../controllers/usuariosController.js";

const router = express.Router();

router.get("/", obtenerUsuario);
router.post("/", agregarUsuario);

// nueva ruta
router.put("/actualizar-password", actualizarPassword);


router.put("/:id", editarUsuario);
router.delete("/:id", eliminarUsuario);



export default router;
