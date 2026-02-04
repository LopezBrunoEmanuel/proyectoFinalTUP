import connection from "../config/DB.js";
import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10;

// GET - OBTENER LOS USUARIOS
export const obtenerUsuario = (req, res) => {
  const query= `SELECT idUsuario, nombre, apellido, email, telefono, direccion, rol, activo, createdAt, updatedAt FROM usuarios;`
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({error: error.message})
    }
    res.status(200).json(results)
  })
}

// POST - AGREGAR USUARIO NUEVO
export const agregarUsuario = async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    rol,
    password
  } = req.body

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: "Faltan datos obligatorios"})
  }

  try {
    // aca hasheamos la contraseña
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // se guarda el usuario con el hash
    const query = "INSERT INTO usuarios (nombre, apellido, email, telefono, direccion, rol, activo, passwordHash) VALUES (?,?,?,?,?,?,?,?)";

    const values = [
      nombre,
      apellido,
      email,
      telefono || null,
      direccion || null,
      rol || "cliente",
      1,
      passwordHash
    ]

    connection.query(query, values, (error, results) => {
      if (error) return res.status(500).json({ error: error.message});

      const nuevoId = results.insertId

      // se devuelve el usuario SIN passwordHash (o sea que no se mande el pass)
      connection.query(
        "SELECT idUsuario, nombre, apellido, email, telefono, direccion, rol, activo, createdAt, updatedAt FROM usuarios WHERE idUsuario = ?",
        [nuevoId],
        (error2, data) => {
          if (error2) return res.status(500).json({error: error2.message})
          res.status(201).json(data[0])
        }
      )
    })
  } catch (error) {
    return res.status(500).json({error: "Error hasheando la contraseña"})
  }
}

// UPDATE - EDITAR DATOS DE USUARIO
export const editarUsuario = (req, res) => {
    const id = req.params.id
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      rol,
      activo
    } = req.body

    if (!nombre || !apellido || !email) {
      return res.status(400).json({error: "Faltan datos obligatorios"})
    }

    const query = "UPDATE usuarios SET nombre=?, apellido=?, email=?, telefono=?, direccion=?, rol=?, activo=? WHERE idUsuario=?"
    const values = [
      nombre,
      apellido,
      email,
      telefono || null,
      direccion || null,
      rol || "cliente",
      typeof activo === "number" ? activo : 1, 
      id
    ]

    connection.query(query, values, (error, results) => {
        if (error) {

          if (error.code === "ER_DUP_ENTRY" || error.errno ===  1062) {
            return res.status(409).json({error: "Este email ya esta siendo usado"})
          }
            return res.status(500).json({error: error.message})
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({error: "Usuario no encontrado"})
        }
        
        return res.status(200).json({success: true})
    })
}

// UPDATE (password) - ACTUALIZAR CONTRASEÑA
export const actualizarPassword = async (req, res) => {
  const { email, nuevaPassword } = req.body;

  if (!email || !nuevaPassword) {
    return res.status(400).json({error: "Faltan datos"})
  }

  try {
    const password = String(nuevaPassword).trim();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const query = "UPDATE usuarios SET passwordHash = ?, updatedAt = NOW() WHERE email = ?";

    connection.query(query, [passwordHash, email], (error, results) => {
  if (error) {
    console.error("ERROR MYSQL UPDATE PASSWORD:", error);
    return res.status(500).json({ error: error.message });
  }

  if (results.affectedRows === 0) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.status(200).json({
    success: true,
    message: "Contraseña actualizada con éxito",
  });
});

} catch (error) {
  console.error("ERROR HASHING PASSWORD:", error);
  return res.status(500).json({ error: "Error hasheando la nueva contraseña" });
}
}

// DELETE - ELIMINAR USUARIO
export const eliminarUsuario = (req, res) => {
    const id = req.params.id
    const query = "DELETE from usuarios WHERE idUsuario=?";

    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        res.json(results)
    })
}

