import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "../../../styles/admin/adminReportes.css";

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// Cambiá esta URL si tu backend corre en otro puerto o dominio
// ─────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000/api";

// ─────────────────────────────────────────────────────────────
// PALETA DE COLORES (refleja las variables CSS del proyecto)
// ─────────────────────────────────────────────────────────────
const C = {
  verdeBosque: "#46624a",
  verdeOlivo: "#7a9e7e",
  beige: "#f5ede4",
  beigeClaro: "#f8f4ed",
  dorado: "#d4af37",
  rosa: "#ca1c73",
  grisOscuro: "#2d3436",
  grisSuave: "#e0e0e0",
  borde: "#e4e4e4",
  blanco: "#ffffff",
  exito: "#4caf50",
  error: "#dc3545",
};

// Paleta para gráficos con múltiples series
const PALETTE = [C.verdeBosque, C.verdeOlivo, C.dorado, C.rosa, "#a0c4a5"];

// ─────────────────────────────────────────────────────────────
// TABS DE NAVEGACIÓN
// Definimos las pestañas disponibles en el dashboard
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "general", label: "General", icono: "📊" },
  { id: "clientes", label: "Clientes", icono: "👥" },
  { id: "productos", label: "Productos", icono: "🌱" },
  { id: "reservas", label: "Reservas", icono: "📋" },
];

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: Tooltip personalizado para los gráficos
// Reemplaza el tooltip default de Recharts por uno con
// el estilo visual del vivero
// ─────────────────────────────────────────────────────────────
function TooltipVivero({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ar-tooltip">
      <p className="ar-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{ color: p.color, margin: "2px 0", fontSize: "0.85rem" }}
        >
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: Skeleton de carga
// Muestra una animación mientras los datos se están cargando
// Props:
//   height     → altura del bloque (px), default 88
//   borderRadius → redondeo, default 16
// ─────────────────────────────────────────────────────────────
function Skeleton({ height = 88, borderRadius = 16 }) {
  return <div className="ar-skeleton" style={{ height, borderRadius }} />;
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: KpiCard
// Tarjeta de indicador clave (número grande con variación %)
// Props:
//   icono     → emoji del indicador
//   titulo    → texto descriptivo
//   valor     → número a mostrar
//   variacion → porcentaje de cambio vs mes anterior (número)
//   prefijo   → símbolo antes del valor (ej: "$"), default ""
//   delay     → retardo de animación de entrada (ms)
// ─────────────────────────────────────────────────────────────
function KpiCard({ icono, titulo, valor, variacion, prefijo = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const positivo = variacion >= 0;

  // La tarjeta aparece con una pequeña animación al cargar
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className={`ar-kpi ${visible ? "ar-kpi--visible" : ""}`}>
      <div className="ar-kpi__icono">{icono}</div>
      <div
        className="ar-kpi__valor"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: C.verdeBosque,
        }}
      >
        {prefijo}
        {typeof valor === "number" && prefijo === "$"
          ? valor.toLocaleString("es-AR")
          : valor}
      </div>
      <div className="ar-kpi__titulo">{titulo}</div>
      {/* Variación vs mes anterior */}
      <div
        className="ar-kpi__variacion"
        style={{ color: positivo ? C.exito : C.error }}
      >
        {positivo ? "▲" : "▼"} {positivo ? "+" : ""}
        {variacion}% vs mes anterior
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: GraficoCard
// Contenedor con título y animación de entrada para cada gráfico
// Props:
//   titulo → texto del encabezado de la tarjeta
//   delay  → retardo de animación (ms)
//   children → el gráfico Recharts en su interior
// ─────────────────────────────────────────────────────────────
function GraficoCard({ titulo, delay = 0, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`ar-grafico-card ${visible ? "ar-grafico-card--visible" : ""}`}
    >
      <h3 className="ar-grafico-card__titulo">{titulo}</h3>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: GENERAL
// Muestra las 4 KPI cards y la actividad reciente del vivero:
// - Últimas 5 reservas de productos
// - Últimos 5 clientes registrados
// ─────────────────────────────────────────────────────────────
function TabGeneral({ datos, cargando }) {
  const [verMasReservas, setVerMasReservas] = useState(false);
  const [verMasClientes, setVerMasClientes] = useState(false);

  const LIMITE = 5;

  const colorEstado = {
    pendiente: { bg: "#fff8e1", color: C.dorado },
    confirmada: { bg: "#e8f5e9", color: C.verdeBosque },
    realizada: { bg: "#e3f2fd", color: "#1976d2" },
    cancelada: { bg: "#fce4ec", color: C.rosa },
  };

  if (cargando || !datos) {
    return (
      <div>
        <div className="ar-kpi-grid">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} />
          ))}
        </div>
        <Skeleton height={260} />
      </div>
    );
  }

  const { resumen, clientes, actividad } = datos;

  const reservasList = actividad?.reservas ?? [];
  const clientesList = actividad?.clientes ?? [];

  const reservasVisibles = verMasReservas
    ? reservasList
    : reservasList.slice(0, LIMITE);
  const clientesVisibles = verMasClientes
    ? clientesList
    : clientesList.slice(0, LIMITE);

  const kpis = [
    {
      icono: "👥",
      titulo: "Clientes totales",
      valor: resumen?.clientes?.valor || 0,
      variacion: 0,
      delay: 0,
    },
    {
      icono: "📋",
      titulo: "Reservas",
      valor: resumen?.reservas?.valor || 0,
      variacion: 0,
      delay: 80,
    },
    {
      icono: "🌱",
      titulo: "Productos",
      valor: resumen?.productos?.valor || 0,
      variacion: 0,
      delay: 160,
    },
    {
      icono: "👤",
      titulo: "Usuarios",
      valor: resumen?.usuarios?.valor || 0,
      variacion: 0,
      delay: 240,
    },
  ];

  return (
    <div className="ar-tab-content">
      {/* ── 4 KPI cards ── */}
      <div className="ar-kpi-grid">
        {kpis.map((k) => (
          <KpiCard key={k.titulo} {...k} />
        ))}
      </div>

      {/* ── Tendencia de clientes (últimos 3 meses) ── */}
      <GraficoCard
        titulo="📈 Tendencia de clientes — últimos 3 meses"
        delay={320}
      >
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={(clientes?.grafico || []).slice(-3)}>
            <defs>
              <linearGradient id="gradGeneral" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={C.verdeBosque}
                  stopOpacity={0.18}
                />
                <stop offset="95%" stopColor={C.verdeBosque} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.grisSuave} />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<TooltipVivero />} />
            <Area
              type="monotone"
              dataKey="cantidad"
              name="Clientes"
              stroke={C.verdeBosque}
              strokeWidth={2.5}
              fill="url(#gradGeneral)"
              dot={{ r: 4, fill: C.verdeBosque, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GraficoCard>

      {/* ── Actividad reciente: 2 columnas ── */}
      <div className="ar-actividad-grid">
        {/* Últimas reservas de productos */}
        <GraficoCard titulo="📋 Últimas reservas de productos" delay={420}>
          <div className="ar-lista">
            {reservasVisibles.map((r) => {
              const est = colorEstado[r.estado] || {
                bg: C.grisSuave,
                color: C.grisOscuro,
              };
              return (
                <div key={r.idReserva} className="ar-lista__item">
                  <div className="ar-lista__info">
                    <span className="ar-lista__nombre">{r.cliente}</span>
                    <span className="ar-lista__sub">
                      🌱 {r.producto}
                      <span
                        className="ar-badge"
                        style={{
                          background: C.verdeBosque + "18",
                          color: C.verdeBosque,
                        }}
                      >
                        {r.tamanio}
                      </span>
                    </span>
                  </div>
                  <div className="ar-lista__meta">
                    <span
                      className="ar-badge ar-badge--estado"
                      style={{ background: est.bg, color: est.color }}
                    >
                      {r.estado}
                    </span>
                    <span className="ar-lista__fecha">{r.fecha}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {reservasList.length > LIMITE && (
            <button
              className="ar-btn-ver-mas"
              style={{ borderColor: C.verdeBosque, color: C.verdeBosque }}
              onClick={() => setVerMasReservas((v) => !v)}
            >
              {verMasReservas
                ? "Ver menos ▲"
                : `Ver más (${reservasList.length - LIMITE} más) ▼`}
            </button>
          )}
        </GraficoCard>

        {/* Últimos clientes registrados */}
        <GraficoCard titulo="👥 Últimos clientes registrados" delay={480}>
          <div className="ar-lista">
            {clientesVisibles.map((cli, i) => (
              <div key={i} className="ar-lista__item">
                <div className="ar-avatar">{cli.nombre.charAt(0)}</div>
                <div className="ar-lista__info">
                  <span className="ar-lista__nombre">{cli.nombre}</span>
                  <span className="ar-lista__sub">{cli.email}</span>
                </div>
                <span className="ar-lista__fecha">{cli.fecha}</span>
              </div>
            ))}
          </div>

          {clientesList.length > LIMITE && (
            <button
              className="ar-btn-ver-mas"
              style={{ borderColor: C.verdeBosque, color: C.verdeBosque }}
              onClick={() => setVerMasClientes((v) => !v)}
            >
              {verMasClientes
                ? "Ver menos ▲"
                : `Ver más (${clientesList.length - LIMITE} más) ▼`}
            </button>
          )}
        </GraficoCard>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: CLIENTES
// Muestra:
// - KPI total de clientes
// - Comparativa esta semana vs semana anterior
// - AreaChart de clientes por mes
// - LineChart de altas por rol (cliente / empleado / admin)
// ─────────────────────────────────────────────────────────────
function TabClientes({ datos, cargando }) {
  if (cargando || !datos) {
    return (
      <div className="ar-tab-content">
        <Skeleton />
        <Skeleton height={120} />
        <Skeleton height={280} />
        <Skeleton height={240} />
      </div>
    );
  }

  const { clientes, usuarios, resumen } = datos;

  // Calculamos la variación entre semanas
  const diffSemana = clientes.semanaActual - clientes.semanaAnterior;
  const pctSemana = Math.round((diffSemana / clientes.semanaAnterior) * 100);
  const subeSemanana = diffSemana >= 0;

  return (
    <div className="ar-tab-content">
      {/* KPI total */}
      <KpiCard
        icono="👥"
        titulo="Total de clientes activos"
        valor={clientes.kpi}
        variacion={resumen.clientes.variacion}
        delay={0}
      />

      {/* ── Comparativa semanal ── */}
      <GraficoCard
        titulo="📅 Clientes nuevos — esta semana vs semana anterior"
        delay={100}
      >
        <div className="ar-semanas">
          {/* Semana actual */}
          <div className="ar-semanas__bloque ar-semanas__bloque--actual">
            <span className="ar-semanas__label">Esta semana</span>
            <span
              className="ar-semanas__numero"
              style={{ color: C.verdeBosque }}
            >
              {clientes.semanaActual}
            </span>
            <span className="ar-semanas__sub">clientes nuevos</span>
          </div>

          {/* Indicador central (flecha + %) */}
          <div className="ar-semanas__centro">
            <span style={{ fontSize: "1.6rem" }}>
              {subeSemanana ? "📈" : "📉"}
            </span>
            <span
              className="ar-semanas__pct"
              style={{ color: subeSemanana ? C.exito : C.error }}
            >
              {subeSemanana ? "+" : ""}
              {pctSemana}%
            </span>
          </div>

          {/* Semana anterior */}
          <div className="ar-semanas__bloque">
            <span className="ar-semanas__label">Semana anterior</span>
            <span
              className="ar-semanas__numero"
              style={{ color: C.grisOscuro }}
            >
              {clientes.semanaAnterior}
            </span>
            <span className="ar-semanas__sub">clientes nuevos</span>
          </div>
        </div>
      </GraficoCard>

      {/* ── Clientes por mes ── */}
      <GraficoCard titulo="📈 Clientes registrados por mes" delay={200}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={clientes.grafico}>
            <defs>
              <linearGradient id="gradClientes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.verdeBosque} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.verdeBosque} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.grisSuave} />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<TooltipVivero />} />
            <Area
              type="monotone"
              dataKey="cantidad"
              name="Clientes nuevos"
              stroke={C.verdeBosque}
              strokeWidth={2.5}
              fill="url(#gradClientes)"
              dot={{ r: 4, fill: C.verdeBosque, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GraficoCard>

      {/* ── Altas por rol ── */}
      <GraficoCard titulo="🔑 Altas de usuarios por rol" delay={300}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={usuarios.grafico}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.grisSuave} />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<TooltipVivero />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line
              type="monotone"
              dataKey="clientes"
              name="Clientes"
              stroke={C.verdeBosque}
              strokeWidth={2.5}
              dot={{ r: 4, fill: C.verdeBosque, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="empleados"
              name="Empleados"
              stroke={C.dorado}
              strokeWidth={2.5}
              dot={{ r: 4, fill: C.dorado, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="admins"
              name="Admins"
              stroke={C.rosa}
              strokeWidth={2.5}
              dot={{ r: 4, fill: C.rosa, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GraficoCard>
    </div>
  );
}

function ListaAlerta({ lista, color, bg, showStock, limite = 5 }) {
  const [verTodos, setVerTodos] = useState(false);
  const visibles = verTodos ? lista : lista.slice(0, limite);

  return (
    <>
      {visibles.map((prod, i) => (
        <div
          key={i}
          className="ar-alertas-grupo__item"
          style={{ background: bg }}
        >
          <div className="ar-alertas-grupo__info">
            <div
              className="ar-alertas-grupo__dot"
              style={{ background: color }}
            />
            <div>
              <span className="ar-alertas-grupo__nombre">{prod.nombre}</span>
              <span className="ar-alertas-grupo__tamanio" style={{ color }}>
                Talle: {prod.tamanio}
              </span>
            </div>
          </div>
          <div className="ar-alertas-grupo__derecha">
            <span
              className="ar-badge"
              style={{ background: C.grisSuave, color: C.verdeBosque }}
            >
              {prod.categoria}
            </span>
            {showStock && (
              <span style={{ fontWeight: 700, color, fontSize: "0.85rem" }}>
                {prod.stock} u.
              </span>
            )}
          </div>
        </div>
      ))}
      {lista.length > limite && (
        <button
          onClick={() => setVerTodos(!verTodos)}
          style={{
            marginTop: 8,
            background: "none",
            border: `1px solid ${color}`,
            color,
            borderRadius: 8,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "0.82rem",
            width: "100%",
          }}
        >
          {verTodos ? "Ver menos ▲" : `Ver todos (${lista.length}) ▼`}
        </button>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: PRODUCTOS
// Muestra:
// - KPI total de productos
// - PieChart (torta) con distribución de stock por categoría
// - BarChart horizontal de stock por categoría
// - Top 5 productos con más stock (gráfico + tabla con medallas)
// - Alertas de stock por tamaño (sin stock / crítico / bajo)
// ─────────────────────────────────────────────────────────────
function TabProductos({ datos, cargando }) {
  if (cargando || !datos) {
    return (
      <div className="ar-tab-content">
        <Skeleton />
        <Skeleton height={260} />
        <Skeleton height={300} />
        <Skeleton height={280} />
        <Skeleton height={320} />
      </div>
    );
  }

  const { productos, resumen } = datos;

  const totalStock = (productos.grafico ?? []).reduce((s, d) => s + d.stock, 0);

  return (
    <div className="ar-tab-content">
      {/* KPI */}
      <KpiCard
        icono="🌱"
        titulo="Productos activos en catálogo"
        valor={productos.kpi}
        variacion={resumen.productos.variacion}
        delay={0}
      />

      {/* ── Gráfico de TORTA: distribución por categoría ── */}
      <GraficoCard titulo="🥧 Distribución de stock por categoría" delay={100}>
        <div className="ar-pie-layout">
          {/* Torta tipo donut */}
          <div className="ar-pie-layout__chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productos.grafico}
                  dataKey="stock"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {(productos.grafico ?? []).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val} u.`]}
                  contentStyle={{
                    background: C.blanco,
                    border: `1.5px solid ${C.verdeOlivo}`,
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda personalizada con barra de % */}
          <div className="ar-pie-layout__leyenda">
            {(productos.grafico ?? []).map((d, i) => {
              const pct = Math.round((d.stock / totalStock) * 100);
              return (
                <div key={i} className="ar-pie-leyenda__item">
                  <div
                    className="ar-pie-leyenda__punto"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="ar-pie-leyenda__nombre">{d.categoria}</span>
                  {/* Barra mini proporcional */}
                  <div className="ar-pie-leyenda__barra-bg">
                    <div
                      className="ar-pie-leyenda__barra-fill"
                      style={{
                        width: `${pct}%`,
                        background: PALETTE[i % PALETTE.length],
                      }}
                    />
                  </div>
                  <span
                    className="ar-pie-leyenda__pct"
                    style={{ color: PALETTE[i % PALETTE.length] }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
            <p className="ar-pie-leyenda__total">
              Total en stock:{" "}
              <strong style={{ color: C.verdeBosque }}>
                {totalStock.toLocaleString("es-AR")} u.
              </strong>
            </p>
          </div>
        </div>
      </GraficoCard>

      {/* ── BarChart horizontal: stock por categoría ── */}
      <GraficoCard titulo="🌿 Stock total por categoría" delay={200}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={productos.grafico}
            layout="vertical"
            margin={{ left: 10, right: 24 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={C.grisSuave}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="categoria"
              tick={{ fontSize: 12 }}
              width={105}
            />
            <Tooltip content={<TooltipVivero />} />
            <Bar dataKey="stock" name="Unidades en stock" radius={[0, 8, 8, 0]}>
              {(productos.grafico ?? []).map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GraficoCard>

      {/* ── Top 5 productos con más stock ── */}
      <GraficoCard titulo="🏆 Top 5 productos con más stock" delay={280}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={productos.top5}
            layout="vertical"
            margin={{ left: 10, right: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={C.grisSuave}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              tick={{ fontSize: 11 }}
              width={150}
              tickFormatter={(v) => (v.length > 20 ? v.slice(0, 19) + "…" : v)}
            />
            <Tooltip content={<TooltipVivero />} />
            <Bar dataKey="stock" name="Unidades" radius={[0, 8, 8, 0]}>
              {(productos.top5 ?? []).map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Tabla de ranking con medallas */}
        <div className="ar-ranking">
          <div className="ar-ranking__header">
            {["#", "Producto", "Categoría", "Stock"].map((h, i) => (
              <span
                key={i}
                className="ar-ranking__th"
                style={{ textAlign: i === 3 ? "right" : "left" }}
              >
                {h}
              </span>
            ))}
          </div>
          {(productos.top5 ?? []).map((prod, i) => (
            <div
              key={i}
              className={`ar-ranking__row ${i % 2 === 0 ? "" : "ar-ranking__row--alt"}`}
            >
              <span className="ar-ranking__pos">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </span>
              <span className="ar-ranking__nombre">{prod.nombre}</span>
              <span
                className="ar-badge"
                style={{ background: C.grisSuave, color: C.verdeBosque }}
              >
                {prod.categoria}
              </span>
              <div className="ar-ranking__stock">
                <span style={{ fontWeight: 700, color: C.verdeBosque }}>
                  {prod.stock}
                </span>
                <div className="ar-ranking__barra-bg">
                  <div
                    className="ar-ranking__barra-fill"
                    style={{
                      width: `${Math.round((prod.stock / (productos.top5?.[0]?.stock ?? 1)) * 100)}%`,
                      background: PALETTE[i % PALETTE.length],
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GraficoCard>

      {/* ── Alertas de stock por tamaño ── */}
      <GraficoCard titulo="⚠️ Alertas de stock por tamaño" delay={360}>
        {/* Resumen de contadores */}
        <div className="ar-alertas-resumen">
          {[
            {
              label: "Sin stock",
              count: (productos.alertas?.sinStock ?? []).length,
              bg: "#fce4ec",
              color: C.rosa,
              icono: "🚫",
            },
            {
              label: "Stock crítico",
              count: (productos.alertas?.stockCritico ?? []).length,
              bg: "#fff3e0",
              color: "#e65100",
              icono: "🔴",
            },
            {
              label: "Stock bajo",
              count: (productos.alertas?.stockBajo ?? []).length,
              bg: "#fff8e1",
              color: "#f57f17",
              icono: "🟡",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="ar-alertas-resumen__item"
              style={{ background: item.bg }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icono}</span>
              <span
                className="ar-alertas-resumen__num"
                style={{ color: item.color }}
              >
                {item.count}
              </span>
              <span
                className="ar-alertas-resumen__label"
                style={{ color: item.color }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Listado por grupo con ver más */}
        {[
          {
            titulo: "🚫 Sin stock",
            lista: productos.alertas?.sinStock ?? [],
            color: C.rosa,
            bg: "#fce4ec",
            showStock: false,
          },
          {
            titulo: "🔴 Stock crítico",
            lista: productos.alertas?.stockCritico ?? [],
            color: "#e65100",
            bg: "#fff3e0",
            showStock: true,
          },
          {
            titulo: "🟡 Stock bajo",
            lista: productos.alertas?.stockBajo ?? [],
            color: "#f57f17",
            bg: "#fff8e1",
            showStock: true,
          },
        ].map(
          (grupo) =>
            grupo.lista.length > 0 && (
              <div key={grupo.titulo} className="ar-alertas-grupo">
                <p
                  className="ar-alertas-grupo__titulo"
                  style={{ color: grupo.color }}
                >
                  {grupo.titulo} ({grupo.lista.length})
                </p>
                <ListaAlerta {...grupo} />
              </div>
            ),
        )}
      </GraficoCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: RESERVAS
// Muestra:
// - KPI reservas activas
// - BarChart agrupado por estado y mes
// - Top 5 clientes con más reservas realizadas
// ─────────────────────────────────────────────────────────────
function TabReservas({ datos, cargando }) {
  if (cargando || !datos) {
    return (
      <div className="ar-tab-content">
        <Skeleton />
        <Skeleton height={300} />
        <Skeleton height={300} />
      </div>
    );
  }

  const { reservas, resumen } = datos;
  const maxReservas = reservas.top5Usuarios?.[0]?.total ?? 1;

  return (
    <div className="ar-tab-content">
      {/* KPI */}
      <KpiCard
        icono="📋"
        titulo="Reservas activas (pendiente + confirmada)"
        valor={reservas.kpi}
        variacion={resumen.reservas.variacion}
        delay={0}
      />

      {/* ── BarChart agrupado por estado y mes ── */}
      <GraficoCard titulo="📋 Reservas por estado mensual" delay={150}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reservas.grafico} barCategoryGap="22%">
            <CartesianGrid strokeDasharray="3 3" stroke={C.grisSuave} />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<TooltipVivero />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar
              dataKey="pendiente"
              name="Pendiente"
              fill={C.dorado}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="confirmada"
              name="Confirmada"
              fill={C.verdeBosque}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="realizada"
              name="Realizada"
              fill={C.verdeOlivo}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="cancelada"
              name="Cancelada"
              fill={C.rosa}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </GraficoCard>

      {/* ── Top 5 clientes con más reservas realizadas ── */}
      <GraficoCard
        titulo="🏆 Top 5 clientes con más reservas realizadas"
        delay={300}
      >
        <div className="ar-top5">
          {(reservas.top5Usuarios ?? []).map((u, i) => (
            <div
              key={i}
              className={`ar-top5__item ${i === 0 ? "ar-top5__item--lider" : ""}`}
            >
              {/* Posición */}
              <span className="ar-top5__pos">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </span>

              {/* Avatar con inicial */}
              <div className="ar-avatar ar-avatar--grande">{u.avatar}</div>

              {/* Nombre + barra de progreso */}
              <div className="ar-top5__info">
                <span className="ar-top5__nombre">{u.nombre}</span>
                <div className="ar-top5__barra-bg">
                  <div
                    className="ar-top5__barra-fill"
                    style={{
                      width: `${Math.round((u.total / maxReservas) * 100)}%`,
                      background:
                        i === 0
                          ? `linear-gradient(90deg, ${C.verdeBosque}, ${C.verdeOlivo})`
                          : PALETTE[i % PALETTE.length],
                    }}
                  />
                </div>
              </div>

              {/* Contador */}
              <div className="ar-top5__contador">
                <span
                  className="ar-top5__num"
                  style={{ color: i === 0 ? C.verdeBosque : C.grisOscuro }}
                >
                  {u.total}
                </span>
                <span className="ar-top5__sub">reservas</span>
              </div>
            </div>
          ))}
        </div>
      </GraficoCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: AdminReportes
// Maneja el estado global, el fetch de datos y el enrutado
// entre tabs. Es el único componente que se exporta.
// ─────────────────────────────────────────────────────────────
function AdminReportes() {
  const [tabActiva, setTabActiva] = useState("general");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [datos, setDatos] = useState(null);

  // ── Fetch de todos los endpoints en paralelo ──────────────
  // Usamos Promise.all para hacer todas las peticiones a la vez
  // y no esperar una a una (más eficiente)
  const fetchDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const [
        resClientes,
        resProductos,
        resReservas,
        resUsuarios,
        resResumen,
        resActividad,
      ] = await Promise.all([
        fetch(`${API_BASE}/dashboardReportes/clientes`),
        fetch(`${API_BASE}/dashboardReportes/productos`),
        fetch(`${API_BASE}/dashboardReportes/reservas`),
        fetch(`${API_BASE}/dashboardReportes/usuarios`),
        fetch(`${API_BASE}/dashboardReportes/resumen`),
        fetch(`${API_BASE}/dashboardReportes/actividad`),
      ]);

      // Verificamos que todas las respuestas sean 2xx
      const todas = [
        resClientes,
        resProductos,
        resReservas,
        resUsuarios,
        resResumen,
        resActividad,
      ];
      if (todas.some((r) => !r.ok)) {
        throw new Error("Error al obtener datos del servidor");
      }

      const [clientes, productos, reservas, usuarios, resumen, actividad] =
        await Promise.all(todas.map((r) => r.json()));

      setDatos({
        clientes,
        productos,
        reservas,
        usuarios,
        resumen,
        actividad,
      });
    } finally {
      setCargando(false);
    }
  };

  // Cargamos datos al montar el componente
  useEffect(() => {
    fetchDatos();
  }, []);

  // ── Pantalla de error ─────────────────────────────────────
  if (error) {
    return (
      <div className="ar-error">
        <span style={{ fontSize: "3rem" }}>🌿</span>
        <p>No se pudieron cargar los reportes.</p>
        <small>{error}</small>
        <button className="ar-btn-primario" onClick={fetchDatos}>
          Reintentar
        </button>
      </div>
    );
  }

  // ── Render del tab activo ──────────────────────────────────
  const renderTab = () => {
    // Mientras carga, cada tab muestra sus propios skeletons
    switch (tabActiva) {
      case "general":
        return <TabGeneral datos={datos} cargando={cargando} />;
      case "clientes":
        return <TabClientes datos={datos} cargando={cargando} />;
      case "productos":
        return <TabProductos datos={datos} cargando={cargando} />;
      case "reservas":
        return <TabReservas datos={datos} cargando={cargando} />;
      case "asistente":
        return <TabAsistenteIA />;
      default:
        return null;
    }
  };

  // ── Render principal ──────────────────────────────────────
  return (
    <div className="ar-wrapper">
      {/* ── Encabezado ── */}
      <header className="ar-header">
        <div className="ar-header__izquierda">
          <div className="ar-header__logo">🌿</div>
          <div>
            <div className="ar-header__titulo-row">
              <h1 className="ar-header__titulo">Panel de Análisis</h1>
            </div>
            <p className="ar-header__subtitulo">
              Visualización inteligente de tu negocio · Actualizado hoy
            </p>
          </div>
        </div>

        {/* Botón para recargar todos los datos */}
        <button
          className="ar-btn-primario"
          onClick={fetchDatos}
          disabled={cargando}
        >
          {cargando ? "Cargando…" : "↻ Actualizar"}
        </button>
      </header>

      {/* ── Navegación por tabs ── */}
      <nav className="ar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ar-tab ${tabActiva === tab.id ? "ar-tab--activo" : ""}`}
            onClick={() => setTabActiva(tab.id)}
          >
            <span>{tab.icono}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Contenido del tab activo ── */}
      <main>{renderTab()}</main>

      {/* ── Pie de página ── */}
      <footer className="ar-footer">Vivero — Sistema de Gestión </footer>
    </div>
  );
}

export default AdminReportes;
