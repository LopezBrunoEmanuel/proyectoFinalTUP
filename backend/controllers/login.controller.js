import connection from "../config/DB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUsuario = (req, res) => {
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
            direccion: user.direccion,
            rol: user.rol,
            activo: user.activo,
            },
        });
        } catch (error) {
        return res.status(500).json({error: "Error verificando contraseña"})
        }
    });
}