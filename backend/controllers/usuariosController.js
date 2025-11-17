import connection from "../config/DB.js";

export const obtenerUsuario = (req, res) => {
  connection.query("Select * from usuarios;", (error,results) => {
    if(error) throw error;
    res.json(results)
  }) 
}

export const agregarUsuario = (req, res) => {
  const { nombreUsuario, emailUsuario, telefonoUsuario, direccionUsuario, rolUsuario, passwordUsuario} = req.body
  const query = "Insert into usuarios (  nombreUsuario, emailUsuario, telefonoUsuario, direccionUsuario, rolUsuario, passwordUsuario) Values (?,?,?,?,?,?)"
  const values = [nombreUsuario, emailUsuario, telefonoUsuario, direccionUsuario, rolUsuario, passwordUsuario]

  connection.query(query, values, (error,results) =>{
    if(error) throw error;
    const nuevoId = results.insertId;
        connection.query("SELECT * from usuarios where idUsuario=?", [nuevoId], (error,data) => {
          if (error) throw error;
                res.json(data[0])
            }
          );
        })
  }

export const editarUsuario = (req, res) => {
    const id = req.params.id
    const {nombreUsuario, emailUsuario, telefonoUsuario,direccionUsuario, rolUsuario, passwordUsuario} = req.body
    const query = "UPDATE usuarios SET nombreUsuario=? , emailUsuario=?, telefonoUsuario=?, direccionUsuario=?, rolUsuario=?, passwordUsuario=? WHERE idUsuario=?"
    const values = [nombreUsuario, emailUsuario, telefonoUsuario, direccionUsuario, rolUsuario, passwordUsuario, id]

    connection.query(query, values, (error, results) => {
        if (error) throw error;
        res.json(results)
    })
}

export const eliminarUsuario = (req, res) => {
    const id = req.params.id
    const query = "DELETE from usuarios WHERE idUsuario=?";

    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        res.json(results)
    })
}
// recuperar contraseña 

export const actualizarPassword = (req, res) => {
  console.log("Body recibido:", req.body);
  const { emailUsuario, nuevaPassword } = req.body;

  if (!emailUsuario || !nuevaPassword) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = "UPDATE usuarios SET passwordUsuario = ? WHERE emailUsuario = ?";
  connection.query(query, [nuevaPassword, emailUsuario], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  });
};

