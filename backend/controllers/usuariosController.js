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
    const query = "UPDATE productos SET nombreUsuario=? , emailUsuario=?, telefonoUsuario=?, direccionUsuario=?, rolUsuario=?, passwordUsuario=? WHERE idProducto=?"
    const values = [nombreUsuario, emailUsuario, telefonoUsuario, direccionUsuario, rolUsuario, passwordUsuario, id]

    connection.query(query, values, (error, results) => {
        if (error) throw error;
        res.json(results)
    })
}

export const eliminarUsuario = (req, res) => {
    const id = req.params.id
    const query = "DELETE from usuarios WHERE idusuario=?";

    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        res.json(results)
    })
}