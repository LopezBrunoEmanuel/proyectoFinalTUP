import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import "../styles/miPerfil.css";
import CardDatosUsuario from "../components/profile/CardDatosUsuario";
import CardModificarPassword from "../components/profile/CardModificarPassword";
// import CardDirecciones from "../components/profile/CardDirecciones";
import { api } from "../services/api.js";

function getInitialData(u) {
    return {
        nombre: u?.nombre || "",
        apellido: u?.apellido || "",
        telefono: u?.telefono || "",
        direccion: u?.direccion || "",
    };
}

function getInitialSecurity() {
    return {
        passwordActual: "",
        nuevaPassword: "",
        confirmarNuevaPassword: "",
    };
}

const MiPerfil = () => {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [initialData, setInitialData] = useState(() => getInitialData(user));
    const [formData, setFormData] = useState(() => getInitialData(user));
    const [security, setSecurity] = useState(() => getInitialSecurity());
    const [uiMsg, setUiMsg] = useState({ type: "", text: "" });

    useEffect(() => {
        const data = getInitialData(user);
        setInitialData(data);
        setFormData(data);
        setSecurity(getInitialSecurity());
        setIsEditing(false);
        setIsChangingPassword(false);
    }, [user]);

    const hasProfileChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

    const handleEditStart = () => {
        setUiMsg({ type: "", text: "" });
        setIsChangingPassword(false);
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setFormData(initialData);
        setUiMsg({ type: "", text: "" });
        setIsEditing(false);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!hasProfileChanges) {
            setUiMsg({ type: "info", text: "No hay cambios para guardar." })
            return;
        }

        try {
            const { data } = await api.put("/usuarios/me", formData);

            if (!data?.success || !data?.user) {
                setUiMsg({ type: "danger", text: "Respuesta invalida del servidor al actualizar el perfil." });
                return;
            }

            updateUser(data.user);

            const updated = getInitialData(data.user);
            setInitialData(updated);
            setFormData(updated);

            setIsEditing(false);
            setUiMsg({ type: "success", text: "Perfil actualizado con exito." });
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error) {
            const status = error?.response?.status;
            const backendMsg = error?.response?.data?.message;

            const msg = backendMsg || (status === 401 ? "Seson invalida o expirada. Volve a iniciar sesion." : "No se pudo actualizar el perfil.");
            setUiMsg({ type: "danger", text: msg });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const togglePasswordSection = () => {
        setUiMsg({ type: "", text: "" });
        setIsEditing(false);
        setIsChangingPassword((v) => !v);
        setSecurity(getInitialSecurity());
    };

    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setSecurity((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setUiMsg({ type: "", text: "" });

        const { passwordActual, nuevaPassword, confirmarNuevaPassword } = security;

        if (!passwordActual || !nuevaPassword || !confirmarNuevaPassword) {
            setUiMsg({ type: "danger", text: "Completa todos los campos" });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (nuevaPassword !== confirmarNuevaPassword) {
            setUiMsg({ type: "danger", text: "La contraseña debe contener entre 8 y 30 caracteres" });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (/\s/.test(nuevaPassword)) {
            setUiMsg({ type: "danger", text: "La contraseña no puede contener espacios" });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            const { data } = await api.put("/usuarios/me/password", { passwordActual, nuevaPassword });

            if (!data?.success) {
                setUiMsg({ type: "danger", text: "Respuesta invalida del servidoral actualizar la contraseña" });
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            setSecurity(getInitialSecurity());
            setIsChangingPassword(false);
            setUiMsg({ type: "success", text: "Contraseña actualizada con exito." });
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error) {
            const status = error?.response?.status;
            const backendMsg = error?.response?.data?.message;
            const msg = backendMsg || (status === 401 ? "Contraseña actual incorrecta." : status === 400 ? "Datos inválidos. Revisá los campos." : "No se pudo actualizar la contraseña.")

            setUiMsg({ type: "danger", text: msg });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="mi-perfil-page">
            <Container className="mi-perfil-container">
                {/* Header de página */}
                <div className="mi-perfil-header">
                    <div>
                        <h1 className="mi-perfil-title">Mi perfil</h1>
                        <p className="mi-perfil-subtitle">
                            Administrá tu información personal y de contacto.
                        </p>
                    </div>

                    <div className="mi-perfil-status">
                        <span className="status-pill text-secondary">{user.rol}</span>

                        {user.activo ? (
                            <span className="status-pill text-secondary">Cuenta activa</span>
                        ) : (
                            <span className="status-pill status-bad text-danger">Cuenta inactiva</span>
                        )}
                    </div>
                </div>

                {uiMsg.text && (
                    <Alert
                        variant={uiMsg.type || "info"}
                        className="mi-perfil-alert"
                        dismissible
                        onClose={() => setUiMsg({ type: "", text: "" })}
                    >
                        {uiMsg.text}
                    </Alert>
                )}

                <Row className="g-4">
                    {/* Col izquierda: identidad */}
                    <Col lg={4}>
                        <Card className="mp-card mp-card-sticky">
                            <Card.Body>
                                <div className="mp-identity">
                                    <div className="mp-avatar" aria-hidden="true">
                                        {(() => {
                                            const nombre = String(user?.nombre || "").trim();
                                            const apellido = String(user?.apellido || "").trim();

                                            const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : "";
                                            const inicialApellido = apellido ? apellido.charAt(0).toUpperCase() : "";

                                            if (inicialNombre && inicialApellido) return `${inicialNombre}${inicialApellido}`;
                                            if (inicialNombre) return inicialNombre;
                                            return "U";
                                        })()}
                                    </div>

                                    <div className="mp-identity-text">
                                        <div className="mp-name">
                                            {formData.nombre || user.nombre}
                                            {formData.apellido ? ` ${formData.apellido}` : ""}
                                        </div>

                                        {/* Email SIEMPRE en minúsculas */}
                                        <div className="mp-email">{String(user.email || "").toLowerCase()}</div>
                                    </div>
                                </div>

                                <div className="mp-divider" />

                                <div className="mp-readonly">
                                    <div className="mp-readonly-row">
                                        <span className="mp-label">Email</span>
                                        <span className="mp-value mp-email-value">
                                            {String(user.email || "").toLowerCase()}
                                        </span>
                                    </div>

                                    <div className="mp-readonly-row">
                                        <span className="mp-label">Rol</span>
                                        <span className="mp-value">{user.rol}</span>
                                    </div>

                                    <div className="mp-readonly-row">
                                        <span className="mp-label">Estado</span>
                                        <span className="mp-value">{user.activo ? "Activo" : "Inactivo"}</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Col derecha */}
                    <Col lg={8}>
                        <CardDatosUsuario
                            isEditing={isEditing}
                            onEditStart={handleEditStart}
                            onCancel={handleEditCancel}
                            onSubmit={handleProfileSubmit}
                            formData={formData}
                            onChange={handleProfileChange}
                            hasChanges={hasProfileChanges}
                        />

                        <CardModificarPassword
                            className="mt-4"
                            isChangingPassword={isChangingPassword}
                            onToggle={togglePasswordSection}
                            onSubmit={handlePasswordSubmit}
                            security={security}
                            onChange={handleSecurityChange}
                        />

                        {/* <CardDirecciones className="mt-4 mb-4" /> */}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MiPerfil;
