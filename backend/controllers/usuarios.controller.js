import connection from "../config/DB.js";
import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10;

// GET - OBTENER LOS USUARIOS
export const obtenerUsuario = (req, res) => {
  const query= `SELECT idUsuario, nombre, apellido, email, telefono, direccion, rol, activo, createdAt, updatedAt FROM Usuarios;`
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({error: error.message})
    }
    res.status(200).json(results)
  })
}

// GET - OBTENER UN USARIO POR ID
export const obtenerUsuarioPorId = (req, res) => {
  const { id } = req.params;

  const query = `SELECT idUsuario AS id, nombre, apellido, email, telefono, direccion, rol, activo FROM Usuarios WHERE idUsuario = ? LIMIT 1`;

  connection.query(query, [id], (error, results) => {
    if (error) return res.status(500).json({error: error.message});
    if (!results.length) return res.status(404).json({error: "Usuario no encontrado"});

    return res.status(200).json({user: results[0]});
  });
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
    const query = "INSERT INTO Usuarios (nombre, apellido, email, telefono, direccion, rol, activo, passwordHash) VALUES (?,?,?,?,?,?,?,?)";

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
        "SELECT idUsuario, nombre, apellido, email, telefono, direccion, rol, activo, createdAt, updatedAt FROM Usuarios WHERE idUsuario = ?",
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

// UPDATE - EDITAR DATOS DE USUARIO (para que el admin modifique desde el panel de administracion)
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

    if (!String(nombre ?? "").trim() || !String(apellido ?? "").trim() || !String(email ?? "").trim()) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const ROLES_VALIDOS = new Set(["cliente", "empleado", "admin"]);
    const rolNormalizado = String(rol ?? "cliente").trim().toLowerCase();

    if (!ROLES_VALIDOS.has(rolNormalizado)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    let activoNormalizado;
    if (typeof activo === "boolean") {
      activoNormalizado = activo ? 1 : 0;
    } else if (typeof activo === "number") {
      activoNormalizado = activo === 1 ? 1 : 0;
    } else if (typeof activo === "string") {
      const a = activo.trim();
      if (a === "1") activoNormalizado = 1;
      else if (a === "0") activoNormalizado = 0;
      else activoNormalizado = 1;
    } else {
      activoNormalizado = 1;
    }

    const query = "UPDATE Usuarios SET nombre=?, apellido=?, email=?, telefono=?, direccion=?, rol=?, activo=? WHERE idUsuario=?"
    const values = [
      String(nombre).trim(),
      String(apellido).trim(),
      String(email).trim(),
      telefono ? String(telefono).trim() : null,
      direccion ? String(direccion).trim() : null,
      rolNormalizado,
      activoNormalizado,
      id
    ];


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

// UPDATE - EDITAR MI PERFIL (desde "mi perfil", o sea para usuario logueado)
export const editarMiUsuario = (req, res) => {
  const idUsuario = req.user?.idUsuario;
  const { nombre, apellido, telefono, direccion } = req.body;

  console.log("[EditarMiUsuario] req.user: ", req.user, "| body: ", { nombre, apellido, telefono, direccion});

  if (!idUsuario) {
    return res.status(401).json({error: "No autenticado"})
  }

  if (!String(nombre ?? "").trim() || !String(apellido ?? "").trim()) {
    return res.status(400).json({error: "Faltan datos obligatorios"})
  }

  const query = `UPDATE Usuarios SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE idUsuario = ?`;

  const values = [
    String(nombre).trim(),
    String(apellido).trim(),
    telefono ? String(telefono).trim() : null,
    direccion ? String(direccion).trim() : null,
    idUsuario,
  ]

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log("[editarMiUsuario] MYSQL ERROR:",error);
      return res.status(500).json({error: error.message})
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }

    //Devolver usario actualizado
    const selectQuery = `SELECT idUsuario AS id, nombre, apellido, email, telefono, direccion, rol, activo FROM Usuarios WHERE idUsuario = ? LIMIT 1`;

    connection.query(selectQuery, [idUsuario], (error2, rows) => {
      if (error2) {
        console.error("[editarMiUsuario MYSQL SELECT ERROR: ", error2);
        return res.status(500).json({error: error2.message});
      }

      return res.status(200).json({success: true, user: rows[0]})
    })
  })
}

// UPDATE - ACTUALIZAR CONTRASEÑA (proximamente esta sera la que usaremos para cambiar por mail. POR AHORA FUNCIONA, PERO NO DEBE QUEDAR COMO ESTA EN ESTE MOMENTO)
export const actualizarPassword = async (req, res) => {
  const { email, nuevaPassword } = req.body;

  if (!email || !nuevaPassword) {
    return res.status(400).json({error: "Faltan datos"})
  }

  try {
    const password = String(nuevaPassword).trim();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const query = "UPDATE Usuarios SET passwordHash = ?, updatedAt = NOW() WHERE email = ?";

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

// UPDATE - CAMBIAR MI PASSWORD (para cambiar la contraseña desde "mi perfil", usuario logueado)
export const actualizarMiPassword = (req, res) => {
  const idUsuario = req.user?.idUsuario;
  const { passwordActual, nuevaPassword } = req.body || {};

  console.log("[actualizarMiPassword] req.user:", req.user, "| body keys:", Object.keys(req.body || {}));

  if (!idUsuario) return res.status(401).json({error: "No autenticado"});

  if (!passwordActual || !nuevaPassword) return res.status(400).json({error: "Faltan datos"});

  const nueva = String(nuevaPassword).trim();
  const actual = String(passwordActual).trim();

  //validacion minima para que no entre un password corto - la validacion mas fuerte vendra del front
  if (nueva.length < 5) return res.status(400).json({error: "La contraseña nueva es muy corta"});

  const qSelect = "SELECT passwordHash FROM Usuarios WHERE idUsuario = ? LIMIT 1";
  console.log("[actualizarMiPassword] SQL:", qSelect, "| idUsuario:", idUsuario);

  connection.query(qSelect, [idUsuario], async (err, rows) => {
    if (err) {
      console.error("[actualizarMiPassword] MYSQL SELECT ERROR", err);
      return res.status(500).json({error: err.message});
    }

    if (!rows.length) return res.status(404).json({error: "Usuario no encontrado"});

    const hashDB = rows[0].passwordHash;

    try {
      const ok = await bcrypt.compare(actual, hashDB);

      if (!ok) return res.status(401).json({error: "Contraseña actual incorrecta"});

      const nuevoHash = await bcrypt.hash(nueva, SALT_ROUNDS);
      const qUpdate = "UPDATE Usuarios SET passwordHash = ? WHERE idUsuario = ?";
      console.log("[actualizarMiPassword] SQL:", qUpdate, "| idUsuario:", idUsuario);

      connection.query(qUpdate, [nuevoHash, idUsuario], (err2, results) => {
        if (err2) {
          console.error("[actualizarMiPassword] MYSQL UPDATE ERROR: ", err2);
          return res.status(500).json({error: err2.message});
        }

        if (!results.affectedRows) return res.status(404).json({error: "Usuario no encontrado"});

        return res.status(200).json({ success: true, message: "Contraseña actualizada con exito"});
      });
    } catch (e) {
      console.error("[actualizarMiPassword] ERROR:",e);
      return res.status(500).json({error: "Error actualizando contraseña"});
    }
  });
}

// DELETE - ELIMINAR USUARIO
export const eliminarUsuario = (req, res) => {
    const id = req.params.id
    const query = "DELETE from Usuarios WHERE idUsuario=?";

    connection.query(query, [id], (error, results) => {
        if (error) {
          console.error("ERROR MYSQL DELETE USUARIO", error);
          return res.status(500).json({ error: error.message})
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario no encontrado"})
        }

        return res.status(200).json({ success: true, message: "Usuario eliminado"})
    })
}