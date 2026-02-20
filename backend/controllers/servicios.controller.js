import connection from "../config/DB.js";

// GET - OBTENER TODOS LOS SERVICIOS (para admin)
export const obtenerServicios = (req, res) => {
  const query = `
    SELECT 
      idServicio,
      nombreServicio,
      descripcionServicio,
      imagenServicio,
      activo,
      ordenVisualizacion
    FROM servicios
    ORDER BY ordenVisualizacion ASC, nombreServicio ASC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener servicios:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results);
  });
};

// GET - OBTENER SERVICIOS ACTIVOS (para frontend público)
export const obtenerServiciosActivos = (req, res) => {
  const query = `
    SELECT 
      idServicio,
      nombreServicio,
      descripcionServicio,
      imagenServicio,
      ordenVisualizacion
    FROM servicios
    WHERE activo = 1
    ORDER BY ordenVisualizacion ASC, nombreServicio ASC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener servicios activos:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results);
  });
};

// GET - OBTENER UN SERVICIO POR ID
export const obtenerServicioPorId = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      idServicio,
      nombreServicio,
      descripcionServicio,
      imagenServicio,
      activo,
      ordenVisualizacion
    FROM servicios
    WHERE idServicio = ?
  `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al obtener servicio:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!results.length) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.status(200).json(results[0]);
  });
};

// POST - CREAR NUEVO SERVICIO
export const crearServicio = (req, res) => {
  const { nombreServicio, descripcionServicio, imagenServicio, activo, ordenVisualizacion } = req.body;

  if (!nombreServicio || !nombreServicio.trim()) {
    return res.status(400).json({ error: "El nombre del servicio es obligatorio" });
  }

  const query = `
    INSERT INTO servicios (nombreServicio, descripcionServicio, imagenServicio, activo, ordenVisualizacion)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    nombreServicio.trim(),
    descripcionServicio || null,
    imagenServicio || null,
    activo !== undefined ? (activo ? 1 : 0) : 1,
    ordenVisualizacion || 0
  ];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error al crear servicio:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
      idServicio: results.insertId,
      nombreServicio,
      descripcionServicio: descripcionServicio || null,
      imagenServicio: imagenServicio || null,
      activo: activo !== undefined ? (activo ? 1 : 0) : 1,
      ordenVisualizacion: ordenVisualizacion || 0
    });
  });
};

// PUT - EDITAR SERVICIO
export const editarServicio = (req, res) => {
  const { id } = req.params;
  const { nombreServicio, descripcionServicio, imagenServicio, activo, ordenVisualizacion } = req.body;

  if (!nombreServicio || !nombreServicio.trim()) {
    return res.status(400).json({ error: "El nombre del servicio es obligatorio" });
  }

  const query = `
    UPDATE servicios 
    SET nombreServicio = ?, descripcionServicio = ?, imagenServicio = ?, activo = ?, ordenVisualizacion = ?
    WHERE idServicio = ?
  `;

  const values = [
    nombreServicio.trim(),
    descripcionServicio || null,
    imagenServicio || null,
    activo ? 1 : 0,
    ordenVisualizacion || 0,
    id
  ];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error al editar servicio:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.status(200).json({ success: true });
  });
};

// DELETE - ELIMINAR SERVICIO
export const eliminarServicio = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM servicios WHERE idServicio = ?";

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar servicio:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.status(200).json({ success: true, message: "Servicio eliminado correctamente" });
  });
};