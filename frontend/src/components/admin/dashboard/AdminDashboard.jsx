import { useNavigate } from "react-router-dom";
import "../../../styles/admin/admin.css";
import { FiTag, FiClipboard, FiUsers, FiBarChart2 } from "react-icons/fi";
import { FaHandsHelping } from "react-icons/fa";

const CARDS = [
    {
        key: "productos",
        title: "Productos",
        Icon: FiTag,
        to: "/admin/productos",
        desc: "Gestionar catálogo",
        enabled: true,
    },
    {
        key: "servicios",
        title: "Servicios",
        Icon: FaHandsHelping,
        to: "/admin/servicios",
        desc: "Gestionar servicios",
        enabled: false,
    },
    {
        key: "usuarios",
        title: "Usuarios",
        Icon: FiUsers,
        to: "/admin/usuarios",
        desc: "Roles y accesos",
        enabled: true,
    },
    {
        key: "reservas",
        title: "Reservas",
        Icon: FiClipboard,
        to: "/admin/reservas",
        desc: "Gestionar reservas",
        enabled: true,
    },
    {
        key: "reportes",
        title: "Reportes",
        Icon: FiBarChart2,
        to: "/admin/reportes",
        desc: "Métricas clave",
        enabled: false,
    },
];

const AdminDashboardPage = () => {
    const navigate = useNavigate();

    return (
        <section className="admin-page">
            <div className="admin-cardsGrid">
                {CARDS.map((card) => {
                    const { key, title, Icon, to, desc, enabled } = card;
                    return (

                        <button
                            key={key}
                            type="button"
                            className={`admin-squareCard ${enabled ? "" : "is-disabled"}`}
                            onClick={() => enabled && navigate(to)}
                            disabled={!enabled}
                            title={enabled ? `Ir a ${title}` : "Próximamente"}
                        >
                            <div className="admin-squareCard__iconWrap" aria-hidden="true">
                                <Icon className="admin-squareCard__icon" />
                            </div>

                            <div className="admin-squareCard__title">{title}</div>

                            <div className="admin-squareCard__desc">{desc}</div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default AdminDashboardPage;
