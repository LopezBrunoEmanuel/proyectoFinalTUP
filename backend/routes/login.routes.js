import express from "express";
import { auth } from "../middlewares/auth.js"
import { loginUsuario } from "../controllers/login.controller.js";

const router = express.Router();

router.get("/whoami", auth, (req, res) => {
  return res.json({ok: true, user: req.user})
});

router.post("/", loginUsuario);

export default router;
