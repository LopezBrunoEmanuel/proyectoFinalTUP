import express from "express";
import connection from "../config/DB.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = "SELECT * FROM Usuarios WHERE email = ? LIMIT 1";
  connection.query(query, [email], async (error, results) => {
    if (error) return res.status(500).json({ error: error.message });

    if (results.length === 0) {
      return res.status(401).json({error: "Credenciales invalidas"});
    }

    const user = results[0];

    try {
      const ok = await bcrypt.compare(password, user.passwordHash)
      if (!ok) return res.status(401).json({error: "Credenciales invalidas"})

      return res.json({
        user: {
          id: user.idUsuario,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          activo: user.activo,
        },
      });
    } catch (error) {
      return res.status(500).json({error: "Error verificando contraseña"})
    }
  });

});

export default router;
