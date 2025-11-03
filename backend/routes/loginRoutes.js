import express from "express";
import connection from "../config/DB.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { emailUsuario, passwordUsuario } = req.body;

  if (!emailUsuario || !passwordUsuario) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = "SELECT * FROM usuarios WHERE emailUsuario = ? AND passwordUsuario = ?";
  connection.query(query, [emailUsuario, passwordUsuario], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });

    if (results.length === 0) {
      return res.json({ user: null });
    }

    const user = results[0];
    res.json({
      user: {
        id: user.idUsuario,
        nombre: user.nombreUsuario,
        email: user.emailUsuario,
        rol: user.rolUsuario,
      },
    });
  });
});

export default router;
