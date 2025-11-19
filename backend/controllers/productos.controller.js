import connection from "../config/DB.js";


// OBTENER TODOS LOS PRODUCTOS (con tamaños si existen) - ya modificado
export const obtenerProductos = (req, res) => {
  const queryProductos = `
    SELECT 
      p.idProducto,
      p.nombreProducto,
      p.descripcionProducto,
      p.precioBase,
      p.idCategoria,
      c.nombreCategoria AS categoriaNombre,
      p.idProveedor,
      p.imagenPrincipal,
      p.tieneTamanios,
      p.activo,
      COALESCE(SUM(pt.stock), 0) AS stock
    FROM Productos p
    LEFT JOIN Categorias c ON p.idCategoria = c.idCategoria
    LEFT JOIN Producto_Tamanio pt ON p.idProducto = pt.idProducto
    GROUP BY 
      p.idProducto, 
      p.nombreProducto, 
      p.descripcionProducto, 
      p.precioBase, 
      p.idCategoria, 
      c.nombreCategoria, 
      p.idProveedor, 
      p.imagenPrincipal, 
      p.tieneTamanios, 
      p.activo
    ORDER BY p.idProducto ASC;
  `;

  connection.query(queryProductos, async (error, productos) => {
    if (error) {
      console.error("❌ Error al obtener productos:", error);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }

    if (!productos.length) return res.json([]);

    // 🔹 Obtener todos los tamaños relacionados de una sola vez
    const ids = productos.map((p) => p.idProducto);
    const queryTamanios = `
      SELECT 
        pt.idProducto,
        t.nombreTamanio,
        pt.precio,
        pt.stock,
        pt.activo
      FROM Producto_Tamanio pt
      JOIN Tamanios t ON pt.idTamanio = t.idTamanio
      WHERE pt.idProducto IN (?)
    `;

    connection.query(queryTamanios, [ids], (err, tamanios) => {
      if (err) {
        console.error("❌ Error al obtener tamaños:", err);
        return res.status(500).json({ error: "Error al obtener tamaños" });
      }

      // 🔸 Agrupar tamaños por producto
      const productosConTamanios = productos.map((p) => ({
        ...p,
        tamanios: tamanios.filter((t) => t.idProducto === p.idProducto),
      }));

      res.json(productosConTamanios);
    });
  });
};

// OBTENER UN PRODUCTO POR ID (con tamaños agrupados) - ya modificado
export const obtenerProductoPorID = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      p.idProducto,
      p.nombreProducto,
      p.descripcionProducto,
      p.precioBase,
      p.imagenPrincipal,
      p.tieneTamanios,
      p.activo,
      c.nombreCategoria,
      t.nombreTamanio,
      pt.stock,
      pt.precio AS precioTamanio,
      pt.activo AS activoTamanio
    FROM Productos p
    LEFT JOIN Categorias c ON p.idCategoria = c.idCategoria
    LEFT JOIN Producto_Tamanio pt ON p.idProducto = pt.idProducto
    LEFT JOIN Tamanios t ON pt.idTamanio = t.idTamanio
    WHERE p.idProducto = ?
  `;


  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("❌ Error al obtener producto:", error);
      return res.status(500).json({ error: "Error al obtener producto" });
    }

    if (!results.length) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const base = results[0];

    // 🔸 Agrupar los tamaños (si existen)
    const tamanios = results
      .filter((r) => r.nombreTamanio)
      .map((r) => ({
        nombreTamanio: r.nombreTamanio,
        precio: r.precioTamanio,
        stock: r.stock,
        activo: r.activoTamanio ?? true,
      }));


    // 🔹 Devolver producto con array de tamaños
    res.json({
      idProducto: base.idProducto,
      nombreProducto: base.nombreProducto,
      descripcionProducto: base.descripcionProducto,
      precioBase: base.precioBase,
      imagenPrincipal: base.imagenPrincipal,
      tieneTamanios: !!base.tieneTamanios,
      activo: !!base.activo,
      nombreCategoria: base.nombreCategoria,
      tamanios,
    });
  });
};

// AGREGAR UN PRODUCTO NUEVO - ya modificado
export const agregarProducto = async (req, res) => {
  const {
    nombreProducto,
    descripcionProducto,
    precioBase,
    idCategoria,
    idProveedor,
    imagenPrincipal,
    tieneTamanios,
    activo,
    stock,
    tamanios = []
  } = req.body;

  const conn = connection.promise();

  try {
    // 1️⃣ Insertar el producto principal
    const queryProducto = `
      INSERT INTO Productos 
      (nombreProducto, descripcionProducto, precioBase, idCategoria, idProveedor, imagenPrincipal, tieneTamanios, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nombreProducto,
      descripcionProducto,
      precioBase,
      idCategoria,
      idProveedor || null,
      imagenPrincipal,
      tieneTamanios || 0,
      activo !== undefined ? activo : 1
    ];

    const [result] = await conn.query(queryProducto, values);
    const nuevoId = result.insertId;

    // 2️⃣ Manejar tamaños dinámicos (si tieneTamanios = true)
    if (tieneTamanios && Array.isArray(tamanios) && tamanios.length > 0) {
      for (const t of tamanios) {
        if (!t.nombreTamanio || !t.nombreTamanio.trim()) continue; // ignorar vacíos

        // Verificar si el tamaño ya existe en Tamanios
        const [existe] = await conn.query(
          "SELECT idTamanio FROM Tamanios WHERE nombreTamanio = ? LIMIT 1",
          [t.nombreTamanio.trim()]
        );

        let idTamanio;
        if (existe.length > 0) {
          idTamanio = existe[0].idTamanio;
        } else {
          const [nuevoT] = await conn.query(
            "INSERT INTO Tamanios (nombreTamanio) VALUES (?)",
            [t.nombreTamanio.trim()]
          );
          idTamanio = nuevoT.insertId;
        }

        // Insertar relación producto-tamaño
        await conn.query(
          `INSERT INTO Producto_Tamanio (idProducto, idTamanio, stock, precio, activo)
           VALUES (?, ?, ?, ?, ?)`,
          [nuevoId, idTamanio, t.stock || 0, t.precio || null, t.activo !== false]
        );
      }
    } else {
      // Caso clásico (sin tamaños)
      await conn.query(
        `INSERT INTO Producto_Tamanio (idProducto, idTamanio, stock, precio, activo)
         VALUES (?, 1, ?, NULL, TRUE)`,
        [nuevoId, stock || 0]
      );
    }

    // 3️⃣ Obtener el producto completo con sus tamaños
    const [productoCompleto] = await conn.query(
      `
      SELECT 
        p.*, 
        c.nombreCategoria AS categoriaNombre
      FROM Productos p
      LEFT JOIN Categorias c ON p.idCategoria = c.idCategoria
      WHERE p.idProducto = ?
      `,
      [nuevoId]
    );

    // 4️⃣ Incluir tamaños asociados
    const [tamaniosAsociados] = await conn.query(
      `
      SELECT 
        t.nombreTamanio, pt.precio, pt.stock, pt.activo
      FROM Producto_Tamanio pt
      JOIN Tamanios t ON pt.idTamanio = t.idTamanio
      WHERE pt.idProducto = ?
      `,
      [nuevoId]
    );

    res.json({ ...productoCompleto[0], tamanios: tamaniosAsociados });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    res.status(500).json({
      error: "Error al agregar producto",
      detalle: error.sqlMessage || error.message
    });
  }
};

// EDITAR UN PRODUCTO EXISTENTE (versión corregida)
export const editarProducto = async (req, res) => {
  const idProducto = req.params.id;
  const {
    nombreProducto,
    descripcionProducto,
    precioBase,
    idCategoria,
    idProveedor,
    imagenPrincipal,
    tieneTamanios,
    activo,
    stock,
    tamanios = []
  } = req.body;

  const conn = connection.promise();

  try {
    // 1️⃣ Actualizar datos del producto principal
    await conn.query(
      `
      UPDATE Productos 
      SET 
        nombreProducto = ?, 
        descripcionProducto = ?, 
        precioBase = ?, 
        idCategoria = ?, 
        idProveedor = ?, 
        imagenPrincipal = ?, 
        tieneTamanios = ?, 
        activo = ?
      WHERE idProducto = ?
      `,
      [
        nombreProducto,
        descripcionProducto,
        precioBase,
        idCategoria,
        idProveedor || null,
        imagenPrincipal,
        tieneTamanios ? 1 : 0,
        activo ? 1 : 0,
        idProducto
      ]
    );

    // 2️⃣ Manejar tamaños (edición inteligente)
    if (tieneTamanios && Array.isArray(tamanios)) {

      // Obtener tamaños actuales asociados
      const [existentes] = await conn.query(
        `
        SELECT 
          pt.idTamanio, 
          t.nombreTamanio
        FROM Producto_Tamanio pt
        JOIN Tamanios t ON pt.idTamanio = t.idTamanio
        WHERE pt.idProducto = ?
        `,
        [idProducto]
      );

      // Mapa para detectar cuáles eliminar
      const mapaExistentes = new Map(
        existentes.map((e) => [
          e.nombreTamanio.toLowerCase(),
          e.idTamanio
        ])
      );

      // 2.1️⃣ Procesar cada tamaño del request
      for (const t of tamanios) {
        const nombre = t.nombreTamanio.trim();
        const nombreLower = nombre.toLowerCase();

        if (!nombre) continue;

        let idTamanio = mapaExistentes.get(nombreLower);

        // ➕ Si NO existe, lo creamos
        if (!idTamanio) {
          const [nuevo] = await conn.query(
            "INSERT INTO Tamanios (nombreTamanio) VALUES (?)",
            [nombre]
          );
          idTamanio = nuevo.insertId;
        }

        // Guardar o actualizar relación
        await conn.query(
          `
          INSERT INTO Producto_Tamanio (idProducto, idTamanio, stock, precio, activo)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            stock = VALUES(stock),
            precio = VALUES(precio),
            activo = VALUES(activo)
          `,
          [
            idProducto,
            idTamanio,
            t.stock ?? 0,
            t.precio ?? null,
            t.activo !== false
          ]
        );

        // Eliminar del mapa para NO borrarlo
        mapaExistentes.delete(nombreLower);
      }

      // 2.2️⃣ Eliminar tamaños que ya no existen en la edición
      for (const [, idTamanioEliminar] of mapaExistentes) {
        await conn.query(
          "DELETE FROM Producto_Tamanio WHERE idProducto = ? AND idTamanio = ?",
          [idProducto, idTamanioEliminar]
        );
      }
    } else {
      // Producto único → mantener stock general
      await conn.query(
        `
        INSERT INTO Producto_Tamanio (idProducto, idTamanio, stock, precio, activo)
        VALUES (?, 1, ?, NULL, TRUE)
        ON DUPLICATE KEY UPDATE stock = VALUES(stock)
        `,
        [idProducto, stock || 0]
      );
    }

    // 3️⃣ Obtener producto actualizado
    const [productoActualizado] = await conn.query(
      `
      SELECT 
        p.*, 
        c.nombreCategoria AS categoriaNombre
      FROM Productos p
      LEFT JOIN Categorias c ON p.idCategoria = c.idCategoria
      WHERE p.idProducto = ?
      `,
      [idProducto]
    );

    // 4️⃣ Obtener tamaños actualizados
    const [tamaniosAsociados] = await conn.query(
      `
      SELECT 
        t.nombreTamanio, 
        pt.precio, 
        pt.stock, 
        pt.activo
      FROM Producto_Tamanio pt
      JOIN Tamanios t ON pt.idTamanio = t.idTamanio
      WHERE pt.idProducto = ?
      ORDER BY t.nombreTamanio ASC
      `,
      [idProducto]
    );

    res.json({
      ...productoActualizado[0],
      tamanios: tamaniosAsociados
    });

  } catch (error) {
    console.error("❌ Error al editar producto:", error);
    res.status(500).json({
      error: "Error al editar producto",
      detalle: error.sqlMessage || error.message
    });
  }
};

// ELIMINAR PRODUCTO - perfecto, no necesitaba modificacion
export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  const conn = connection.promise();

  try {
    await conn.beginTransaction();

    // 1️⃣ Eliminar stock asociado
    await conn.query("DELETE FROM Producto_Tamanio WHERE idProducto = ?", [id]);

    // 2️⃣ Eliminar producto principal
    await conn.query("DELETE FROM Productos WHERE idProducto = ?", [id]);

    await conn.commit();

    console.log(`🗑️ Producto ID ${id} eliminado correctamente`);
    res.json({ message: "✅ Producto eliminado correctamente", idProducto: id });
  } catch (error) {
    await conn.rollback();
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto o sus tamaños" });
  }
};

// CAMBIAR ESTADO ACTIVO/INACTIVO - ya modificado
export const cambiarEstadoProducto = (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;

  const query = "UPDATE Productos SET activo = ? WHERE idProducto = ?";

  connection.query(query, [activo, id], (error) => {
    if (error) {
      console.error("❌ Error al cambiar estado:", error);
      return res.status(500).json({ error: "Error al cambiar estado" });
    }

    // 🔹 Propagar el cambio al detalle de tamaños
    const queryTamanios = "UPDATE Producto_Tamanio SET activo = ? WHERE idProducto = ?";
    connection.query(queryTamanios, [activo, id], (err2) => {
      if (err2) {
        console.error("⚠️ Advertencia: no se pudieron actualizar los tamaños:", err2);
      }

      // 🔹 Retornar el producto actualizado
      const selectQuery = "SELECT * FROM Productos WHERE idProducto = ?";
      connection.query(selectQuery, [id], (err3, rows) => {
        if (err3) {
          console.error("❌ Error al obtener producto actualizado:", err3);
          return res.status(500).json({ error: "Error al obtener producto actualizado" });
        }

        res.json(rows[0]);
      });
    });
  });
};



// controlers anteriores
// import connection from "../config/DB.js";

// //obtener todos los productos
// export const obtenerProductos = (req, res) => {
//     connection.query("SELECT * from productos;", (error,results) => {
//         if (error) throw error;
//         res.json(results)
//     })
// }

// //obtener un producto unico por id
// export const obtenerProductoPorID = (req, res) => {
//     const id = req.params.id

//     connection.query("SELECT * from productos WHERE idProducto=?", [id], (error, results) => {
//         if (error) throw error;
//         res.json(results[0])
//     })
// }

// //agrergar un producto
// export const agregarProducto = (req, res) => {
//     const {nombreProducto, descripcionProducto, precioProducto, stockProducto, categoriaProducto, imagenProducto, dimensionProducto} = req.body
//     const query = "INSERT into productos (nombreProducto, descripcionProducto, precioProducto, stockProducto, categoriaProducto, imagenProducto, dimensionProducto) VALUES (?,?,?,?,?,?,?)"
//     const values = [nombreProducto, descripcionProducto, precioProducto, stockProducto, categoriaProducto, imagenProducto, dimensionProducto]

//     connection.query(query, values, (error, results) => {
//         if (error) throw error;
//         const nuevoId = results.insertId;
//             connection.query("SELECT * from productos where idProducto=?", [nuevoId], (error, data) => {
//                 if (error) throw error;
//                 res.json(data[0])
//             }
//         );
//     });
// }

// //editar un producto
// export const editarProducto = (req, res) => {
//     const id = req.params.id
//     const {nombreProducto, descripcionProducto, precioProducto, stockProducto, categoriaProducto, imagenProducto, dimensionProducto} = req.body
//     const query = "UPDATE productos SET nombreProducto=? , descripcionProducto=?, precioProducto=?, stockProducto=?, categoriaProducto=?, imagenProducto=?, dimensionProducto=? WHERE idProducto=?"
//     const values = [nombreProducto, descripcionProducto, precioProducto, stockProducto, categoriaProducto, imagenProducto, dimensionProducto, id]

//     connection.query(query, values, (error, results) => {
//         if (error) throw error;
//         res.json(results)
//     })
// }


// //eliminar un producto
// export const eliminarProducto = (req, res) => {
//     const id = req.params.id
//     const query = "DELETE from productos WHERE idProducto=?";

//     connection.query(query, [id], (error, results) => {
//         if (error) throw error;
//         res.json(results)
//     })
// }