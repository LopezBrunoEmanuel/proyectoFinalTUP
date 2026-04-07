import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from "recharts";
import { FiUsers, FiPackage, FiClipboard, FiTag, FiFileText, FiDownload, FiCalendar } from "react-icons/fi";
import axios from "../../../api/axiosConfig";
import "../../../styles/admin/adminReportes.css";
import { generarInformePDF } from "../../../utils/generarInformePDF";

const PALETA_GENERAL = ["#1a6b3c", "#2d9e5f", "#52c68a", "#85dba8"];
const PALETA_CLIENTES = ["#1d4ed8", "#2563eb", "#60a5fa", "#93c5fd"];
const PALETA_PRODUCTOS = ["#0f766e", "#0d9488", "#2dd4bf", "#99f6e4"];
const PALETA_RESERVAS = ["#4f46e5", "#7c3aed", "#a78bfa", "#c4b5fd"];

const TABS = [
  { id: "general", label: "General", icono: <FiTag /> },
  { id: "clientes", label: "Clientes", icono: <FiUsers /> },
  { id: "productos", label: "Productos", icono: <FiPackage /> },
  { id: "reservas", label: "Reservas", icono: <FiClipboard /> },
  { id: "informes", label: "Informes", icono: <FiFileText /> },
];

function TooltipVivero({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ar-tooltip">
      <p className="ar-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0", fontSize: "0.85rem" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

function Skeleton({ height = 88, borderRadius = 16 }) {
  return <div className="ar-skeleton" style={{ height, borderRadius }} />;
}

function KpiCard({ icono, titulo, valor, prefijo = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className={`ar-kpi ${visible ? "ar-kpi--visible" : ""}`}>
      <div className="ar-kpi__icono">{icono}</div>
      <div className="ar-kpi__valor">
        {prefijo}
        {typeof valor === "number" && prefijo === "$"
          ? valor.toLocaleString("es-AR")
          : valor}
      </div>
      <div className="ar-kpi__titulo">{titulo}</div>
    </div>
  );
}

function GraficoCard({ titulo, delay = 0, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className={`ar-grafico-card ${visible ? "ar-grafico-card--visible" : ""}`}>
      <h3 className="ar-grafico-card__titulo">{titulo}</h3>
      {children}
    </div>
  );
}

function TabGeneral({ datos, cargando }) {
  const [verMasReservas, setVerMasReservas] = useState(false);
  const [verMasClientes, setVerMasClientes] = useState(false);
  const LIMITE = 5;

  const estadoColor = {
    Pendiente: { bg: "#fff8e1", color: "#d97706" },
    Confirmada: { bg: "#e8f5e9", color: "#1a6b3c" },
    "En preparación": { bg: "#e3f2fd", color: "#1d4ed8" },
    "Lista para retiro": { bg: "#ede9fe", color: "#4f46e5" },
    Retirada: { bg: "#f0fdf4", color: "#059669" },
    Cancelada: { bg: "#fce4ec", color: "#dc2626" },
  };

  if (cargando || !datos) {
    return (
      <div>
        <div className="ar-kpi-grid">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}
        </div>
        <Skeleton height={260} />
      </div>
    );
  }

  const { resumen, clientes, actividad } = datos;
  const reservasList = actividad?.reservas ?? [];
  const clientesList = actividad?.clientes ?? [];
  const reservasVisibles = verMasReservas ? reservasList : reservasList.slice(0, LIMITE);
  const clientesVisibles = verMasClientes ? clientesList : clientesList.slice(0, LIMITE);

  const kpis = [
    { icono: <FiUsers size={22} />, titulo: "Clientes activos", valor: resumen?.clientes?.valor || 0, delay: 0 },
    { icono: <FiClipboard size={22} />, titulo: "Reservas activas", valor: resumen?.reservas?.valor || 0, delay: 80 },
    { icono: <FiPackage size={22} />, titulo: "Productos activos", valor: resumen?.productos?.valor || 0, delay: 160 },
    { icono: <FiTag size={22} />, titulo: "Usuarios totales", valor: resumen?.usuarios?.valor || 0, delay: 240 },
  ];

  return (
    <div className="ar-tab-content">
      <div className="ar-kpi-grid">
        {kpis.map((k) => <KpiCard key={k.titulo} {...k} />)}
      </div>

      <GraficoCard titulo="Tendencia de clientes — últimos 3 meses" delay={320}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={(clientes?.grafico || []).slice(-3)}>
            <defs>
              <linearGradient id="gradGeneral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PALETA_GENERAL[0]} stopOpacity={0.18} />
                <stop offset="95%" stopColor={PALETA_GENERAL[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<TooltipVivero />} />
            <Area type="monotone" dataKey="cantidad" name="Clientes"
              stroke={PALETA_GENERAL[0]} strokeWidth={2.5}
              fill="url(#gradGeneral)"
              dot={{ r: 4, fill: PALETA_GENERAL[0], strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GraficoCard>

      <div className="ar-actividad-grid">
        <GraficoCard titulo="Últimas reservas" delay={420}>
          <div className="ar-lista">
            {reservasVisibles.map((r) => {
              const est = estadoColor[r.estado] || { bg: "#e0e0e0", color: "#64748b" };
              return (
                <div key={r.idReserva} className="ar-lista__item">
                  <div className="ar-lista__info">
                    <span className="ar-lista__nombre">{r.cliente}</span>
                    <span className="ar-lista__sub">
                      {r.producto}
                      {r.tamanio && r.tamanio !== "Único" && ` · ${r.tamanio}`}
                    </span>
                  </div>
                  <div className="ar-lista__meta">
                    <span className="ar-badge ar-badge--estado"
                      style={{ background: est.bg, color: est.color }}>
                      {r.estado}
                    </span>
                    <span className="ar-lista__fecha">{r.fecha}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {reservasList.length > LIMITE && (
            <button className="ar-btn-ver-mas"
              style={{ borderColor: PALETA_GENERAL[0], color: PALETA_GENERAL[0] }}
              onClick={() => setVerMasReservas((v) => !v)}>
              {verMasReservas ? "Ver menos ▲" : `Ver más (${reservasList.length - LIMITE} más) ▼`}
            </button>
          )}
        </GraficoCard>

        <GraficoCard titulo="Últimos clientes registrados" delay={480}>
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
            <button className="ar-btn-ver-mas"
              style={{ borderColor: PALETA_GENERAL[0], color: PALETA_GENERAL[0] }}
              onClick={() => setVerMasClientes((v) => !v)}>
              {verMasClientes ? "Ver menos ▲" : `Ver más (${clientesList.length - LIMITE} más) ▼`}
            </button>
          )}
        </GraficoCard>
      </div>
    </div>
  );
}

function TabClientes({ datos, cargando }) {
  if (cargando || !datos) {
    return (
      <div className="ar-tab-content">
        <Skeleton /><Skeleton height={120} /><Skeleton height={280} />
      </div>
    );
  }

  const { clientes } = datos;
  const diffSemana = clientes.semanaActual - clientes.semanaAnterior;
  const pctSemana = clientes.semanaAnterior > 0
    ? Math.round((diffSemana / clientes.semanaAnterior) * 100)
    : 0;
  const subeSemana = diffSemana >= 0;

  return (
    <div className="ar-tab-content">
      <KpiCard icono={<FiUsers size={22} />} titulo="Total de clientes activos"
        valor={clientes.kpi} delay={0} />

      <GraficoCard titulo="Clientes nuevos — esta semana vs semana anterior" delay={100}>
        <div className="ar-semanas">
          <div className="ar-semanas__bloque ar-semanas__bloque--actual">
            <span className="ar-semanas__label">Esta semana</span>
            <span className="ar-semanas__numero" style={{ color: PALETA_CLIENTES[0] }}>
              {clientes.semanaActual}
            </span>
            <span className="ar-semanas__sub">clientes nuevos</span>
          </div>
          <div className="ar-semanas__centro">
            <span style={{ fontSize: "1.6rem" }}>{subeSemana ? "↑" : "↓"}</span>
            <span className="ar-semanas__pct"
              style={{ color: subeSemana ? "#059669" : "#dc2626" }}>
              {subeSemana ? "+" : ""}{pctSemana}%
            </span>
          </div>
          <div className="ar-semanas__bloque">
            <span className="ar-semanas__label">Semana anterior</span>
            <span className="ar-semanas__numero" style={{ color: "#64748b" }}>
              {clientes.semanaAnterior}
            </span>
            <span className="ar-semanas__sub">clientes nuevos</span>
          </div>
        </div>
      </GraficoCard>

      <GraficoCard titulo="Clientes registrados por mes" delay={200}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={clientes.grafico}>
            <defs>
              <linearGradient id="gradClientes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PALETA_CLIENTES[0]} stopOpacity={0.2} />
                <stop offset="95%" stopColor={PALETA_CLIENTES[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<TooltipVivero />} />
            <Area type="monotone" dataKey="cantidad" name="Clientes nuevos"
              stroke={PALETA_CLIENTES[0]} strokeWidth={2.5}
              fill="url(#gradClientes)"
              dot={{ r: 4, fill: PALETA_CLIENTES[0], strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
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
        <div key={i} className="ar-alertas-grupo__item" style={{ background: bg }}>
          <div className="ar-alertas-grupo__info">
            <div className="ar-alertas-grupo__dot" style={{ background: color }} />
            <div>
              <span className="ar-alertas-grupo__nombre">{prod.nombre}</span>
              <span className="ar-alertas-grupo__tamanio" style={{ color }}>
                {prod.tamanio}
              </span>
            </div>
          </div>
          <div className="ar-alertas-grupo__derecha">
            <span className="ar-badge" style={{ background: "#e0e0e0", color: "#1a6b3c" }}>
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
        <button onClick={() => setVerTodos(!verTodos)}
          style={{
            marginTop: 8, background: "none", border: `1px solid ${color}`,
            color, borderRadius: 8, padding: "4px 12px", cursor: "pointer",
            fontSize: "0.82rem", width: "100%"
          }}>
          {verTodos ? "Ver menos ▲" : `Ver todos (${lista.length}) ▼`}
        </button>
      )}
    </>
  );
}

function TabProductos({ datos, cargando }) {
  if (cargando || !datos) {
    return (
      <div className="ar-tab-content">
        <Skeleton /><Skeleton height={260} /><Skeleton height={300} />
        <Skeleton height={280} /><Skeleton height={320} />
      </div>
    );
  }

  const { productos } = datos;
  const totalStock = (productos.grafico ?? []).reduce((s, d) => s + d.stock, 0);

  return (
    <div className="ar-tab-content">
      <KpiCard icono={<FiPackage size={22} />} titulo="Productos activos en catálogo"
        valor={productos.kpi} delay={0} />

      <GraficoCard titulo="Distribución de stock por categoría" delay={100}>
        <div className="ar-pie-layout">
          <div className="ar-pie-layout__chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productos.grafico} dataKey="stock" nameKey="categoria"
                  cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  paddingAngle={3} strokeWidth={0}>
                  {(productos.grafico ?? []).map((_, i) => (
                    <Cell key={i} fill={PALETA_PRODUCTOS[i % PALETA_PRODUCTOS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} u.`]}
                  contentStyle={{
                    background: "#fff", border: "1.5px solid #0d9488",
                    borderRadius: 10, fontSize: 12
                  }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ar-pie-layout__leyenda">
            {(productos.grafico ?? []).map((d, i) => {
              const pct = Math.round((d.stock / totalStock) * 100);
              return (
                <div key={i} className="ar-pie-leyenda__item">
                  <div className="ar-pie-leyenda__punto"
                    style={{ background: PALETA_PRODUCTOS[i % PALETA_PRODUCTOS.length] }} />
                  <span className="ar-pie-leyenda__nombre">{d.categoria}</span>
                  <div className="ar-pie-leyenda__barra-bg">
                    <div className="ar-pie-leyenda__barra-fill"
                      style={{
                        width: `${pct}%`,
                        background: PALETA_PRODUCTOS[i % PALETA_PRODUCTOS.length]
                      }} />
                  </div>
                  <span className="ar-pie-leyenda__pct"
                    style={{ color: PALETA_PRODUCTOS[i % PALETA_PRODUCTOS.length] }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
            <p className="ar-pie-leyenda__total">
              Total en stock: <strong style={{ color: PALETA_PRODUCTOS[0] }}>
                {totalStock.toLocaleString("es-AR")} u.
              </strong>
            </p>
          </div>
        </div>
      </GraficoCard>

      <GraficoCard titulo="Stock total por categoría" delay={200}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={productos.grafico} layout="vertical"
            margin={{ left: 10, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
            <YAxis type="category" dataKey="categoria" tick={{ fontSize: 12 }} width={105} />
            <Tooltip content={<TooltipVivero />} />
            <Bar dataKey="stock" name="Unidades en stock" radius={[0, 8, 8, 0]}>
              {(productos.grafico ?? []).map((_, i) => (
                <Cell key={i} fill={PALETA_PRODUCTOS[i % PALETA_PRODUCTOS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GraficoCard>

      <GraficoCard titulo="Top 5 productos con más stock" delay={280}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={productos.top5} layout="vertical"
            margin={{ left: 10, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
            <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={150}
              tickFormatter={(v) => v.length > 20 ? v.slice(0, 19) + "…" : v} />
            <Tooltip content={<TooltipVivero />} />
            <Bar dataKey="stock" name="Unidades" radius={[0, 8, 8, 0]}>
              {(productos.top5 ?? []).map((_, i) => (
                <Cell key={i} fill={PALETA_PRODUCTOS[i % PALETA_PRODUCTOS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="ar-ranking">
          <div className="ar-ranking__header">
            {["#", "Producto", "Categoría", "Stock"].map((h, i) => (
              <span key={i} className="ar-ranking__th"
                style={{ textAlign: i === 3 ? "right" : "left" }}>{h}</span>
            ))}
          </div>
          {(productos.top5 ?? []).map((prod, i) => (
            <div key={i}
              className={`ar-ranking__row ${i % 2 === 0 ? "" : "ar-ranking__row--alt"}`}>
              <span className="ar-ranking__pos">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </span>
              <span className="ar-ranking__nombre">{prod.nombre}</span>
              <span className="ar-badge"
                style={{ background: "#e0e0e0", color: PALETA_PRODUCTOS[0] }}>
                {prod.categoria}
              </span>
              <div className="ar-ranking__stock">
                <span style={{ fontWeight: 700, color: PALETA_PRODUCTOS[0] }}>
                  {prod.stock}
                </span>
                <div className="ar-ranking__barra-bg">
                  <div className="ar-ranking__barra-fill"
                    style={{
                      width: `${Math.round((prod.stock / (productos.top5?.[0]?.stock ?? 1)) * 100)}%`,
                      background: PALETA_PRODUCTOS[i % PALETA_PRODUCTOS.length]
                    }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GraficoCard>

      <GraficoCard titulo="Alertas de stock por tamaño" delay={360}>
        <div className="ar-alertas-resumen">
          {[
            { label: "Sin stock", count: (productos.alertas?.sinStock ?? []).length, bg: "#fce4ec", color: "#dc2626" },
            { label: "Stock crítico", count: (productos.alertas?.stockCritico ?? []).length, bg: "#fff3e0", color: "#d97706" },
            { label: "Stock bajo", count: (productos.alertas?.stockBajo ?? []).length, bg: "#fff8e1", color: "#ca8a04" },
          ].map((item) => (
            <div key={item.label} className="ar-alertas-resumen__item"
              style={{ background: item.bg }}>
              <span className="ar-alertas-resumen__num" style={{ color: item.color }}>
                {item.count}
              </span>
              <span className="ar-alertas-resumen__label" style={{ color: item.color }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {[
          { titulo: "Sin stock", lista: productos.alertas?.sinStock ?? [], color: "#dc2626", bg: "#fce4ec", showStock: false },
          { titulo: "Stock crítico", lista: productos.alertas?.stockCritico ?? [], color: "#d97706", bg: "#fff3e0", showStock: true },
          { titulo: "Stock bajo", lista: productos.alertas?.stockBajo ?? [], color: "#ca8a04", bg: "#fff8e1", showStock: true },
        ].map((grupo) => grupo.lista.length > 0 && (
          <div key={grupo.titulo} className="ar-alertas-grupo">
            <p className="ar-alertas-grupo__titulo" style={{ color: grupo.color }}>
              {grupo.titulo} ({grupo.lista.length})
            </p>
            <ListaAlerta {...grupo} />
          </div>
        ))}
      </GraficoCard>
    </div>
  );
}

function TabReservas({ datos, cargando }) {
  if (cargando || !datos) {
    return (
      <div className="ar-tab-content">
        <Skeleton /><Skeleton height={300} /><Skeleton height={300} />
      </div>
    );
  }

  const { reservas } = datos;
  const maxReservas = reservas.top5Usuarios?.[0]?.total ?? 1;

  return (
    <div className="ar-tab-content">
      <KpiCard icono={<FiClipboard size={22} />}
        titulo="Reservas activas (pendiente, confirmada, en preparación, lista para retiro)"
        valor={reservas.kpi} delay={0} />

      <GraficoCard titulo="Reservas por estado — mensual" delay={150}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reservas.grafico} barCategoryGap="22%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<TooltipVivero />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="pendiente" name="Pendiente" fill={PALETA_RESERVAS[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="confirmada" name="Confirmada" fill={PALETA_RESERVAS[1]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="enPreparacion" name="En preparación" fill={PALETA_RESERVAS[2]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="listaParaRetiro" name="Lista para retiro" fill={PALETA_RESERVAS[3]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="retirada" name="Retirada" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelada" name="Cancelada" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GraficoCard>

      <GraficoCard titulo="Top 5 clientes con más reservas retiradas" delay={300}>
        <div className="ar-top5">
          {(reservas.top5Usuarios ?? []).map((u, i) => (
            <div key={i}
              className={`ar-top5__item ${i === 0 ? "ar-top5__item--lider" : ""}`}>
              <span className="ar-top5__pos">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </span>
              <div className="ar-avatar ar-avatar--grande">{u.avatar}</div>
              <div className="ar-top5__info">
                <span className="ar-top5__nombre">{u.nombre}</span>
                <div className="ar-top5__barra-bg">
                  <div className="ar-top5__barra-fill"
                    style={{
                      width: `${Math.round((u.total / maxReservas) * 100)}%`,
                      background: i === 0
                        ? `linear-gradient(90deg, ${PALETA_RESERVAS[0]}, ${PALETA_RESERVAS[2]})`
                        : PALETA_RESERVAS[i % PALETA_RESERVAS.length]
                    }} />
                </div>
              </div>
              <div className="ar-top5__contador">
                <span className="ar-top5__num"
                  style={{ color: i === 0 ? PALETA_RESERVAS[0] : "#64748b" }}>
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

function AdminReportes() {
  const [tabActiva, setTabActiva] = useState("general");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [datos, setDatos] = useState(null);

  const fetchDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const [clientes, productos, reservas, usuarios, actividad] = await Promise.all([
        axios.get("/dashboardReportes/clientes"),
        axios.get("/dashboardReportes/productos"),
        axios.get("/dashboardReportes/reservas"),
        axios.get("/dashboardReportes/usuarios"),
        axios.get("/dashboardReportes/actividad"),
      ]);

      const resumen = {
        clientes: { valor: clientes.data.kpi },
        productos: { valor: productos.data.kpi },
        reservas: { valor: reservas.data.kpi },
        usuarios: { valor: usuarios.data.kpi },
      };

      setDatos({
        clientes: clientes.data,
        productos: productos.data,
        reservas: reservas.data,
        usuarios: usuarios.data,
        actividad: actividad.data,
        resumen,
      });
    } catch (err) {
      console.error("Error al cargar reportes:", err);
      setError("No se pudieron cargar los reportes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  if (error) {
    return (
      <div className="ar-error">
        <p>{error}</p>
        <button className="ar-btn-primario" onClick={fetchDatos}>
          Reintentar
        </button>
      </div>
    );
  }

  const renderTab = () => {
    switch (tabActiva) {
      case "general": return <TabGeneral datos={datos} cargando={cargando} />;
      case "clientes": return <TabClientes datos={datos} cargando={cargando} />;
      case "productos": return <TabProductos datos={datos} cargando={cargando} />;
      case "reservas": return <TabReservas datos={datos} cargando={cargando} />;
      case "informes": return <TabInformes />;
      default: return null;
    }
  };

  return (
    <div className="ar-wrapper">
      <header className="ar-header">
        <div className="ar-header__izquierda">
          <div>
            <h2>Panel de Reportes</h2>
            <p className="ar-header__subtitulo">
              Métricas y análisis del negocio
            </p>
          </div>
        </div>
      </header>

      <nav className="ar-tabs">
        {TABS.map((tab) => (
          <button key={tab.id}
            className={`ar-tab ${tabActiva === tab.id ? "ar-tab--activo" : ""}`}
            onClick={() => setTabActiva(tab.id)}>
            <span>{tab.icono}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      <main>{renderTab()}</main>
    </div>
  );
}
export default AdminReportes;

function TabInformes() {
  const hoy = new Date().toISOString().split("T")[0];
  const haceMes = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [fechaDesde, setFechaDesde] = useState(haceMes);
  const [fechaHasta, setFechaHasta] = useState(hoy);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [analisisIA, setAnalisisIA] = useState("");
  const [cargandoIA, setCargandoIA] = useState(false);
  const [error, setError] = useState(null);
  const [presetActivo, setPresetActivo] = useState(null);

  const PRESETS = [
    // por algun motivo la busqueda comienza siempre con el dia de mañana. ARREGLAR ESO
    // hacer que estos presets realmente hagan la busqueda que dicen hacer
    // nuevos presets: año pasado (del 1/1/año al 31/12/año)
    // ver si agregamos otros presets
    // podemos hacer informes personalizados de lo que requiera el dueño, por ejemplo solo ventas, solo reservas, etc.
    { label: "Última semana", dias: 7 },
    { label: "Último mes", dias: 30 },
    { label: "3 meses", dias: 90 },
    { label: "Este año", dias: 365 },
  ];

  const aplicarPreset = (label, dias) => {
    const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setFechaDesde(desde);
    setFechaHasta(hoy);
    setDatos(null);
    setAnalisisIA("");
    setPresetActivo(label);
  };

  const formatPesos = (n) =>
    Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  const generarInforme = async (conIA = false) => {
    if (!fechaDesde || !fechaHasta) return;
    if (fechaDesde > fechaHasta) {
      setError("La fecha de inicio no puede ser mayor a la fecha de fin");
      return;
    }
    try {
      setCargando(true);
      setError(null);
      setAnalisisIA("");
      const { data } = await axios.get(
        `/dashboardReportes/informe?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
      );
      setDatos(data);
      if (conIA) {
        await analizarConIA(data);
      }
    } catch (err) {
      console.error("Error al generar informe:", err);
      setError("No se pudo generar el informe");
    } finally {
      setCargando(false);
    }
  };

  const analizarConIA = async (datosParam = null) => {
    const d = datosParam || datos;
    if (!d) return;
    try {
      setCargandoIA(true);
      setAnalisisIA("");

      const prompt = `Sos un asistente de análisis de negocio para un vivero llamado Patio 1220.
Analizá los siguientes datos del período ${d.periodo.desde} al ${d.periodo.hasta} y generá un resumen ejecutivo claro y útil para el dueño del negocio.
IMPORTANTE: Respondé en texto plano sin Markdown. No uses asteriscos, guiones como viñetas, ni símbolos especiales. Escribí los títulos de sección en MAYÚSCULAS seguidos de dos puntos y salto de línea. Separé los párrafos con una línea en blanco. Sé concreto, directo y útil. Respondé en español.

DATOS DEL PERÍODO:
- Total de reservas: ${d.resumenFinanciero.cantidadReservas}
- Total facturado (reservas retiradas): ${formatPesos(d.resumenFinanciero.totalFacturado)}
- Total esperado (reservas activas): ${formatPesos(d.resumenFinanciero.totalEsperado)}
- Total cobrado: ${formatPesos(d.resumenFinanciero.totalPagado)}
- Total pendiente de cobro: ${formatPesos(d.resumenFinanciero.totalSinPagar)}
- Reservas canceladas: ${d.resumenFinanciero.cantidadCanceladas} (${d.resumenFinanciero.tasaCancelacion}%)

RESERVAS POR ESTADO:
${d.porEstado.map(e => `- ${e.nombreEstado}: ${e.cantidad} reservas, ${formatPesos(e.monto)}`).join("\n")}

TOP 10 PRODUCTOS MÁS SOLICITADOS:
${d.productosDestacados.map((p, i) => `${i + 1}. ${p.nombreProducto}: ${p.cantidadVendida} unidades, ${formatPesos(p.montoTotal)}`).join("\n")}

EVOLUCIÓN SEMANAL:
${d.evolucionSemanal.map(s => `- Semana del ${s.semana}: ${s.cantidad} reservas, ${formatPesos(s.monto)}`).join("\n")}`;

      const { data } = await axios.post("/dashboardReportes/analizar-ia", { prompt });
      setAnalisisIA(data.texto);
    } catch (err) {
      console.error("Error al analizar con IA:", err);
      setAnalisisIA("Error al conectar con el asistente de IA");
    } finally {
      setCargandoIA(false);
    }
  };

  const exportarSoloIA = () => {
    if (!analisisIA) return;
    generarInformePDF(
      { ...datos, productosDestacados: [], porEstado: [], evolucionSemanal: [] },
      analisisIA,
      true
    );
  };

  const exportarPDF = () => {
    if (!datos) return;
    generarInformePDF(datos, analisisIA);
  };

  return (
    <div className="ar-tab-content">
      {/* Selector de período */}
      <GraficoCard titulo="Seleccionar período">
        <div className="d-flex flex-wrap gap-2 mb-3">
          {PRESETS.map((p) => (
            <button key={p.label} className="ar-btn-ver-mas"
              style={{
                borderColor: PALETA_GENERAL[0],
                color: presetActivo === p.label ? "#fff" : PALETA_GENERAL[0],
                background: presetActivo === p.label ? PALETA_GENERAL[0] : "transparent",
                width: "auto",
                padding: "4px 14px"
              }}
              onClick={() => aplicarPreset(p.label, p.dias)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="d-flex flex-wrap gap-3 align-items-end">
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>
              Desde
            </label>
            <input type="date" value={fechaDesde} max={fechaHasta}
              onChange={(e) => { setFechaDesde(e.target.value); setDatos(null); setAnalisisIA(""); setPresetActivo(null); }}
              style={{ border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "6px 10px", fontSize: "0.9rem" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>
              Hasta
            </label>
            <input type="date" value={fechaHasta} min={fechaDesde} max={hoy}
              onChange={(e) => { setFechaHasta(e.target.value); setDatos(null); setAnalisisIA(""); setPresetActivo(null); }}
              style={{ border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "6px 10px", fontSize: "0.9rem" }}
            />
          </div>
          <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
            <button className="ar-btn-primario"
              onClick={() => generarInforme(false)}
              disabled={cargando || cargandoIA}>
              {cargando ? "Generando..." : "Ver informe"}
            </button>
            {/* <button className="ar-btn-primario"
              style={{ background: "var(--color-verde-olivo)" }}
              onClick={() => generarInforme(true)}
              disabled={cargando || cargandoIA}>
              {cargandoIA ? "Analizando..." : "✦ Ver informe con análisis IA"}
            </button> */}
          </div>
        </div>
        {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: 8 }}>{error}</p>}
      </GraficoCard>

      {/* Resultados */}
      {datos && (
        <div id="informe-pdf">
          {/* Encabezado del informe */}
          <div style={{ background: PALETA_GENERAL[0], borderRadius: 16, padding: "1.5rem", color: "#fff", marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ color: "#fff", fontFamily: "var(--fuente-titulos)", margin: 0, fontSize: "1.4rem" }}>
                  Informe de período
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                  {new Date(datos.periodo.desde + "T00:00:00").toLocaleDateString("es-AR")} — {new Date(datos.periodo.hasta + "T00:00:00").toLocaleDateString("es-AR")}
                </p>
                {analisisIA && (
                  <p style={{ margin: "6px 0 0", fontSize: "0.82rem", opacity: 0.9, fontWeight: 700 }}>
                    ✓ Análisis con IA completado
                  </p>
                )}
              </div>
              <div className="no-print d-flex gap-2 flex-wrap">
                {!analisisIA && !cargandoIA && (
                  <button className="ar-btn-primario"
                    style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)" }}
                    onClick={() => analizarConIA(datos)}>
                    ✦ Analizar con IA
                  </button>
                )}
                {cargandoIA && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", opacity: 0.9 }}>
                    <div className="ar-ia-dot" /><div className="ar-ia-dot" /><div className="ar-ia-dot" />
                    Analizando...
                  </div>
                )}
                <button className="ar-btn-primario"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)" }}
                  onClick={exportarPDF}>
                  <FiDownload style={{ marginRight: 6 }} />
                  Exportar informe completo PDF
                </button>
                {analisisIA && (
                  <button className="ar-btn-primario"
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.5)" }}
                    onClick={exportarSoloIA}>
                    <FiDownload size={15} />
                    Exportar análisis IA
                  </button>
                )}
              </div>
            </div>

            {/* Análisis IA justo debajo de los botones */}
            {(analisisIA || cargandoIA) && (
              <div style={{ marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: "1px solid rgba(255,255,255,0.25)" }}>
                {cargandoIA ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
                    <div className="ar-ia-dot" /><div className="ar-ia-dot" /><div className="ar-ia-dot" />
                    Analizando datos...
                  </div>
                ) : (
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.92)", whiteSpace: "pre-wrap", margin: 0 }}>
                    {analisisIA}
                  </p>
                )}
              </div>
            )}
          </div>

          <br />

          {/* Resumen financiero */}
          <GraficoCard titulo="Resumen financiero" delay={100}>
            <div className="ar-kpi-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              {[
                { label: "Total reservas", valor: datos.resumenFinanciero.cantidadReservas, esMonto: false },
                { label: "Total facturado", valor: datos.resumenFinanciero.totalFacturado, esMonto: true },
                { label: "Total esperado", valor: datos.resumenFinanciero.totalEsperado, esMonto: true },
                { label: "Cobrado", valor: datos.resumenFinanciero.totalPagado, esMonto: true },
                { label: "Pendiente de cobro", valor: datos.resumenFinanciero.totalSinPagar, esMonto: true },
                { label: "Tasa de cancelación", valor: `${datos.resumenFinanciero.tasaCancelacion}%`, esMonto: false },
              ].map((item) => (
                <div key={item.label} className="ar-kpi ar-kpi--visible">
                  <div className="ar-kpi__valor" style={{ fontSize: "1.4rem", color: PALETA_GENERAL[0] }}>
                    {item.esMonto ? formatPesos(item.valor) : item.valor}
                  </div>
                  <div className="ar-kpi__titulo">{item.label}</div>
                </div>
              ))}
            </div>
          </GraficoCard>
          <br />
          {/* Desglose por estado */}
          <GraficoCard titulo="Reservas por estado" delay={150}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={datos.porEstado} layout="vertical" margin={{ left: 10, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="nombreEstado" tick={{ fontSize: 12 }} width={130} />
                <Tooltip content={<TooltipVivero />} />
                <Bar dataKey="cantidad" name="Reservas" radius={[0, 8, 8, 0]}>
                  {datos.porEstado.map((_, i) => (
                    <Cell key={i} fill={PALETA_RESERVAS[i % PALETA_RESERVAS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GraficoCard>
          <br />
          {/* Evolución semanal */}
          {datos.evolucionSemanal.length > 0 && (
            <GraficoCard titulo="Evolución semanal de reservas" delay={200}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={datos.evolucionSemanal}>
                  <defs>
                    <linearGradient id="gradInforme" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PALETA_GENERAL[1]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={PALETA_GENERAL[1]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<TooltipVivero />} />
                  <Area type="monotone" dataKey="cantidad" name="Reservas"
                    stroke={PALETA_GENERAL[1]} strokeWidth={2.5}
                    fill="url(#gradInforme)"
                    dot={{ r: 4, fill: PALETA_GENERAL[1], strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GraficoCard>
          )}
          <br />
          {/* Top productos */}
          <GraficoCard titulo="Productos más solicitados en el período" delay={250}>
            {datos.productosDestacados.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                No hay productos en el período seleccionado
              </p>
            ) : (
              <div className="ar-ranking">
                <div className="ar-ranking__header">
                  {["#", "Producto", "Unidades", "Monto"].map((h, i) => (
                    <span key={i} className="ar-ranking__th"
                      style={{ textAlign: i > 1 ? "right" : "left" }}>{h}</span>
                  ))}
                </div>
                {datos.productosDestacados.map((prod, i) => (
                  <div key={i}
                    className={`ar-ranking__row ${i % 2 === 0 ? "" : "ar-ranking__row--alt"}`}>
                    <span className="ar-ranking__pos">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                    </span>
                    <span className="ar-ranking__nombre">{prod.nombreProducto}</span>
                    <span style={{ textAlign: "right", fontWeight: 700, color: PALETA_GENERAL[0] }}>
                      {prod.cantidadVendida} u.
                    </span>
                    <span style={{ textAlign: "right", fontWeight: 700, color: PALETA_GENERAL[0] }}>
                      {formatPesos(prod.montoTotal)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GraficoCard>

          {/* Análisis IA */}
          {/* {(analisisIA || cargandoIA) && (
            <GraficoCard titulo="Análisis ejecutivo — Asistente IA">
              {cargandoIA ? (
                <div className="d-flex align-items-center gap-2" style={{ color: "#64748b" }}>
                  <div className="ar-ia-dot" /><div className="ar-ia-dot" /><div className="ar-ia-dot" />
                  <span style={{ fontSize: "0.9rem" }}>Analizando datos...</span>
                </div>
              ) : (
                <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "#2d3436", whiteSpace: "pre-wrap", margin: 0 }}>
                  {analisisIA}
                </p>
              )}
            </GraficoCard>
          )} */}
        </div>
      )}
    </div>
  );
}