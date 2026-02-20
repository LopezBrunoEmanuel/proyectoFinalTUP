import connection from "../config/DB.js";

// GET - OBTENER LA CONFIGURACION ADMIN
export const obtenerConfiguracion = (req, res) => {
  const query = `
    SELECT 
      idConfiguracion,
      clave,
      valor,
      tipo,
      descripcion,
      grupo,
      updatedAt
    FROM configuracion_general
    ORDER BY grupo ASC, clave ASC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener configuración:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results);
  });
};

// GET - OBTENER LA CONFIGURACION PUBLICA
export const obtenerConfiguracionPublica = (req, res) => {
  const clavesPublicas = [
    'telefono_contacto',
    'email_principal',
    'whatsapp',
    'instagram_url',
    'facebook_url',
    'horario_atencion',
    'direccion_local',
    'mensaje_bienvenida',
    'acepta_envios'
  ];

  const query = `
    SELECT clave, valor, tipo
    FROM configuracion_general
    WHERE clave IN (?)
  `;

  connection.query(query, [clavesPublicas], (error, results) => {
    if (error) {
      console.error("Error al obtener configuración pública:", error);
      return res.status(500).json({ error: error.message });
    }

    const config = {};
    results.forEach(item => {
      config[item.clave] = item.valor;
    });

    res.status(200).json(config);
  });
};

// GET - OBTENER UNA CONFIGURACION UNICA POR CLAVE
export const obtenerConfiguracionPorClave = (req, res) => {
  const { clave } = req.params;

  const query = `
    SELECT 
      idConfiguracion,
      clave,
      valor,
      tipo,
      descripcion,
      grupo
    FROM configuracion_general
    WHERE clave = ?
  `;

  connection.query(query, [clave], (error, results) => {
    if (error) {
      console.error("Error al obtener configuración:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!results.length) {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }

    res.status(200).json(results[0]);
  });
};

// GET - OBTENER CONFIGURACION POR GRUPO
export const obtenerConfiguracionPorGrupo = (req, res) => {
  const { grupo } = req.params;

  const query = `
    SELECT 
      idConfiguracion,
      clave,
      valor,
      tipo,
      descripcion,
      grupo
    FROM configuracion_general
    WHERE grupo = ?
    ORDER BY clave ASC
  `;

  connection.query(query, [grupo], (error, results) => {
    if (error) {
      console.error("Error al obtener configuración por grupo:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(results);
  });
};

// POST - CREAR NUEVA CONFIGURACION
export const crearConfiguracion = (req, res) => {
  const { clave, valor, tipo, descripcion, grupo } = req.body;

  if (!clave || !clave.trim()) {
    return res.status(400).json({ error: "La clave es obligatoria" });
  }

  const query = `
    INSERT INTO configuracion_general (clave, valor, tipo, descripcion, grupo)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    clave.trim(),
    valor || null,
    tipo || 'texto',
    descripcion || null,
    grupo || null
  ];

  connection.query(query, values, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Ya existe una configuración con esa clave" });
      }
      console.error("Error al crear configuración:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
      idConfiguracion: results.insertId,
      clave,
      valor: valor || null,
      tipo: tipo || 'texto',
      descripcion: descripcion || null,
      grupo: grupo || null
    });
  });
};

// PUT - ACTUALIZAR CONFIGURACION
export const actualizarConfiguracion = (req, res) => {
  const { id } = req.params;
  const { valor, tipo, descripcion, grupo } = req.body;

  const query = `
    UPDATE configuracion_general 
    SET valor = ?, tipo = ?, descripcion = ?, grupo = ?
    WHERE idConfiguracion = ?
  `;

  const values = [
    valor || null,
    tipo || 'texto',
    descripcion || null,
    grupo || null,
    id
  ];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error al actualizar configuración:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }

    res.status(200).json({ success: true });
  });
};

// PUT - ACTUALIZAR CONFIGURACION POR CLAVE
export const actualizarConfiguracionPorClave = (req, res) => {
  const { clave } = req.params;
  const { valor } = req.body;

  const query = "UPDATE configuracion_general SET valor = ? WHERE clave = ?";

  connection.query(query, [valor, clave], (error, results) => {
    if (error) {
      console.error("Error al actualizar configuración:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }

    res.status(200).json({ success: true });
  });
};

// PUT - ACTUALIZAR MAS DE 1 CONFIGURACION
export const actualizarConfiguracionMasiva = (req, res) => {
  const { configuraciones } = req.body;

  if (!Array.isArray(configuraciones) || configuraciones.length === 0) {
    return res.status(400).json({ error: "Se requiere un array de configuraciones" });
  }

  let completadas = 0;
  let errores = [];

  configuraciones.forEach((config) => {
    const { clave, valor } = config;

    connection.query(
      "UPDATE configuracion_general SET valor = ? WHERE clave = ?",
      [valor, clave],
      (error) => {
        if (error) {
          errores.push({ clave, error: error.message });
        }
        completadas++;

        if (completadas === configuraciones.length) {
          if (errores.length > 0) {
            return res.status(500).json({
              success: false,
              errores
            });
          }
          res.status(200).json({ success: true });
        }
      }
    );
  });
};

// DELETE - ELIMINAR CONFIGURACION
export const eliminarConfiguracion = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM configuracion_general WHERE idConfiguracion = ?";

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar configuración:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }

    res.status(200).json({ success: true, message: "Configuración eliminada correctamente" });
  });
};