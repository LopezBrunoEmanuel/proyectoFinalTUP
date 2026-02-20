import connection from "../config/DB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUsuario = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const emailLowerCase = email.toLowerCase().trim();

    const query = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";
    connection.query(query, [emailLowerCase], async (error, results) => {
        if (error) return res.status(500).json({ error: error.message });

        if (results.length === 0) {
        return res.status(401).json({error: "Credenciales invalidas"});
        }

        const user = results[0];

        if (!user.activo) {
            res.status(403).json({ error: "Usuario desactivado. Contacte al administrador." })
        }

        try {
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return res.status(401).json({error: "Credenciales invalidas"})

            const payload = {sub: user.idUsuario, rol: user.rol};
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "2h",
            })

        return res.json({
            token,
            user: {
            id: user.idUsuario,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol,
            activo: user.activo,
            },
        });
        } catch (error) {
        return res.status(500).json({error: "Error verificando contraseña"})
        }
    });
}

export const registrarUsuario = async (req, res) => {
  const { nombre, apellido, email, telefono, password } = req.body;

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const queryCheck = "SELECT idUsuario FROM usuarios WHERE email = ? LIMIT 1";
  connection.query(queryCheck, [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (rows.length > 0) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const queryInsert = `
        INSERT INTO usuarios (nombre, apellido, email, telefono, rol, activo, passwordHash) 
        VALUES (?, ?, ?, ?, 'cliente', 1, ?)
      `;

      connection.query(
        queryInsert,
        [nombre, apellido, email, telefono || null, passwordHash],
        (error, results) => {
          if (error) {
            console.error("Error al registrar usuario:", error);
            return res.status(500).json({ error: error.message });
          }

          const nuevoId = results.insertId;

          const payload = { sub: nuevoId, rol: "cliente" };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "2h",
          });

          return res.status(201).json({
            token,
            user: {
              id: nuevoId,
              nombre,
              apellido,
              email,
              telefono: telefono || null,
              rol: "cliente",
              activo: 1,
            },
          });
        }
      );
    } catch (error) {
      console.error("Error hasheando contraseña:", error);
      return res.status(500).json({ error: "Error al registrar usuario" });
    }
  });
};