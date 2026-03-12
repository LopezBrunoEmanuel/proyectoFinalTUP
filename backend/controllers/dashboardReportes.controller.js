import connection from "../config/DB.js";

// ─────────────────────────────────────────────────────────────
// GET /api/dashboardReportes/clientes
// ─────────────────────────────────────────────────────────────
export const getTotalClientes = async (req, res) => {
  try {
    const db = connection.promise();

    const [[{ totalClientes }]] = await db.query(`
      SELECT COUNT(*) AS totalClientes
      FROM usuarios
      WHERE rol = 'cliente' AND activo = 1
    `);

    const [grafico] = await db.query(`
      SELECT
        DATE_FORMAT(createdAt, '%b') AS mes,
        MONTH(createdAt)             AS nroMes,
        COUNT(*)                     AS cantidad
      FROM usuarios
      WHERE rol = 'cliente'
        AND activo = 1
        AND YEAR(createdAt) = YEAR(CURDATE())
      GROUP BY mes, nroMes
      ORDER BY nroMes ASC
    `);

    const [[{ semanaActual }]] = await db.query(`
      SELECT COUNT(*) AS semanaActual
      FROM usuarios
      WHERE rol = 'cliente'
        AND activo = 1
        AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    const [[{ semanaAnterior }]] = await db.query(`
      SELECT COUNT(*) AS semanaAnterior
      FROM usuarios
      WHERE rol = 'cliente'
        AND activo = 1
        AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
        AND createdAt <  DATE_SUB(CURDATE(), INTERVAL 7  DAY)
    `);

    res.json({
      kpi: totalClientes,
      grafico,
      semanaActual,
      semanaAnterior,
    });
  } catch (error) {
    console.error("Error getTotalClientes:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/dashboardReportes/productos
// ─────────────────────────────────────────────────────────────
export const getTotalProductos = async (req, res) => {
  try {
    const db = connection.promise();

    const [[{ totalProductos }]] = await db.query(`
      SELECT COUNT(*) AS totalProductos
      FROM productos
      WHERE activo = 1
    `);

    const [grafico] = await db.query(`
      SELECT
        c.nombreCategoria AS categoria,
        COALESCE(SUM(
          CASE WHEN pt.activo = 1 THEN pt.stock ELSE 0 END
        ), 0) AS stock
      FROM categorias c
      LEFT JOIN productos p         ON p.idCategoria = c.idCategoria AND p.activo = 1
      LEFT JOIN producto_tamanio pt ON pt.idProducto = p.idProducto
      GROUP BY c.idCategoria, c.nombreCategoria
      ORDER BY stock DESC
    `);

    const [top5] = await db.query(`
      SELECT
        p.nombreProducto  AS nombre,
        c.nombreCategoria AS categoria,
        SUM(pt.stock)     AS stock
      FROM productos p
      JOIN producto_tamanio pt ON pt.idProducto = p.idProducto AND pt.activo = 1
      JOIN categorias c        ON c.idCategoria = p.idCategoria
      WHERE p.activo = 1
      GROUP BY p.idProducto, p.nombreProducto, c.nombreCategoria
      ORDER BY stock DESC
      LIMIT 5
    `);

    const [sinStock] = await db.query(`
      SELECT
        p.nombreProducto  AS nombre,
        t.nombreTamanio   AS tamanio,
        c.nombreCategoria AS categoria
      FROM producto_tamanio pt
      JOIN productos  p ON p.idProducto  = pt.idProducto AND p.activo = 1
      JOIN tamanios   t ON t.idTamanio   = pt.idTamanio
      JOIN categorias c ON c.idCategoria = p.idCategoria
      WHERE pt.activo = 1 AND pt.stock = 0
      ORDER BY p.nombreProducto
    `);

    const [stockCritico] = await db.query(`
      SELECT
        p.nombreProducto  AS nombre,
        t.nombreTamanio   AS tamanio,
        pt.stock,
        c.nombreCategoria AS categoria
      FROM producto_tamanio pt
      JOIN productos  p ON p.idProducto  = pt.idProducto AND p.activo = 1
      JOIN tamanios   t ON t.idTamanio   = pt.idTamanio
      JOIN categorias c ON c.idCategoria = p.idCategoria
      WHERE pt.activo = 1 AND pt.stock BETWEEN 1 AND 5
      ORDER BY pt.stock ASC
    `);

    const [stockBajo] = await db.query(`
      SELECT
        p.nombreProducto  AS nombre,
        t.nombreTamanio   AS tamanio,
        pt.stock,
        c.nombreCategoria AS categoria
      FROM producto_tamanio pt
      JOIN productos  p ON p.idProducto  = pt.idProducto AND p.activo = 1
      JOIN tamanios   t ON t.idTamanio   = pt.idTamanio
      JOIN categorias c ON c.idCategoria = p.idCategoria
      WHERE pt.activo = 1 AND pt.stock BETWEEN 6 AND 10
      ORDER BY pt.stock ASC
    `);

    // Convertimos stock a número porque MySQL puede devolverlo como string
    const graficoFixed = grafico.map(d => ({ ...d, stock: Number(d.stock) }));
    const top5Fixed = top5.map(d => ({ ...d, stock: Number(d.stock) }));
    const stockCriticoFixed = stockCritico.map(d => ({ ...d, stock: Number(d.stock) }));
    const stockBajoFixed = stockBajo.map(d => ({ ...d, stock: Number(d.stock) }));

    res.json({
      kpi: totalProductos,
      grafico: graficoFixed,
      top5: top5Fixed,
      alertas: { sinStock, stockCritico: stockCriticoFixed, stockBajo: stockBajoFixed },
    });
  } catch (error) {
    console.error("Error getTotalProductos:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/dashboardReportes/reservas
// idEstado: 1=Pendiente, 2=Confirmada, 3=En preparación,
//           4=Lista para retiro, 5=Retirada, 6=Cancelada
// ─────────────────────────────────────────────────────────────
export const getTotalReservas = async (req, res) => {
  try {
    const db = connection.promise();

    const [[{ totalReservas }]] = await db.query(`
      SELECT COUNT(*) AS totalReservas
      FROM reservas
      WHERE idEstado IN (1, 2)
    `);

    const [grafico] = await db.query(`
      SELECT
        DATE_FORMAT(fechaReserva, '%b') AS mes,
        MONTH(fechaReserva)             AS nroMes,
        SUM(CASE WHEN idEstado = 1 THEN 1 ELSE 0 END) AS pendiente,
        SUM(CASE WHEN idEstado = 2 THEN 1 ELSE 0 END) AS confirmada,
        SUM(CASE WHEN idEstado = 5 THEN 1 ELSE 0 END) AS realizada,
        SUM(CASE WHEN idEstado = 6 THEN 1 ELSE 0 END) AS cancelada
      FROM reservas
      WHERE YEAR(fechaReserva) = YEAR(CURDATE())
      GROUP BY mes, nroMes
      ORDER BY nroMes ASC
    `);

    const [top5Usuarios] = await db.query(`
      SELECT
        CONCAT(u.nombre, ' ', u.apellido) AS nombre,
        LEFT(u.nombre, 1)                 AS avatar,
        COUNT(*)                          AS total
      FROM reservas r
      JOIN usuarios u ON u.idUsuario = r.idUsuario
      WHERE r.idEstado = 5
      GROUP BY r.idUsuario, u.nombre, u.apellido
      ORDER BY total DESC
      LIMIT 5
    `);

    res.json({
      kpi: totalReservas,
      grafico,
      top5Usuarios,
    });
  } catch (error) {
    console.error("Error getTotalReservas:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/dashboardReportes/usuarios
// ─────────────────────────────────────────────────────────────
export const getTotalUsuarios = async (req, res) => {
  try {
    const db = connection.promise();

    const [[{ totalUsuarios }]] = await db.query(`
      SELECT COUNT(*) AS totalUsuarios
      FROM usuarios
      WHERE activo = 1
    `);

    const [grafico] = await db.query(`
      SELECT
        DATE_FORMAT(createdAt, '%b') AS mes,
        MONTH(createdAt)             AS nroMes,
        SUM(CASE WHEN rol = 'cliente'  THEN 1 ELSE 0 END) AS clientes,
        SUM(CASE WHEN rol = 'empleado' THEN 1 ELSE 0 END) AS empleados,
        SUM(CASE WHEN rol = 'admin'    THEN 1 ELSE 0 END) AS admins
      FROM usuarios
      WHERE activo = 1 AND YEAR(createdAt) = YEAR(CURDATE())
      GROUP BY mes, nroMes
      ORDER BY nroMes ASC
    `);

    res.json({ kpi: totalUsuarios, grafico });
  } catch (error) {
    console.error("Error getTotalUsuarios:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/dashboardReportes/resumen
// ─────────────────────────────────────────────────────────────
export const getDashboardResumen = async (req, res) => {
  try {
    const db = connection.promise();

    const [[{ totalClientes }]] = await db.query(`
      SELECT COUNT(*) AS totalClientes FROM usuarios WHERE rol = 'cliente' AND activo = 1
    `);
    const [[{ totalProductos }]] = await db.query(`
      SELECT COUNT(*) AS totalProductos FROM productos WHERE activo = 1
    `);
    const [[{ totalReservas }]] = await db.query(`
      SELECT COUNT(*) AS totalReservas FROM reservas WHERE idEstado IN (1, 2)
    `);
    const [[{ totalUsuarios }]] = await db.query(`
      SELECT COUNT(*) AS totalUsuarios FROM usuarios WHERE activo = 1
    `);

    res.json({
      clientes:  { valor: totalClientes,  variacion: 0 },
      productos: { valor: totalProductos, variacion: 0 },
      reservas:  { valor: totalReservas,  variacion: 0 },
      usuarios:  { valor: totalUsuarios,  variacion: 0 },
    });
  } catch (error) {
    console.error("Error getDashboardResumen:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/dashboardReportes/actividad
// ─────────────────────────────────────────────────────────────
export const getDashboardActividad = async (req, res) => {
  try {
    const db = connection.promise();

    const [reservas] = await db.query(`
      SELECT
        r.idReserva,
        CONCAT(u.nombre, ' ', u.apellido)          AS cliente,
        e.nombreEstado                             AS estado,
        DATE_FORMAT(r.fechaReserva, '%d/%m %H:%i') AS fecha
      FROM reservas r
      JOIN usuarios        u ON u.idUsuario = r.idUsuario
      JOIN estados_reserva e ON e.idEstado  = r.idEstado
      ORDER BY r.fechaReserva DESC
      LIMIT 5
    `);

    const [clientes] = await db.query(`
      SELECT
        CONCAT(nombre, ' ', apellido)      AS nombre,
        email,
        DATE_FORMAT(createdAt, '%d/%m/%Y') AS fecha
      FROM usuarios
      WHERE rol = 'cliente' AND activo = 1
      ORDER BY createdAt DESC
      LIMIT 5
    `);

    res.json({ reservas, clientes });
  } catch (error) {
    console.error("Error getDashboardActividad:", error.message);
    res.status(500).json({ error: error.message });
  }
};