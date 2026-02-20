import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/login.css";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import Logo from "../../assets/logopatio.png";
import { swalCustom } from "../../utils/customSwal";
import RecuperarPasswordModal from "./RecuperarPasswordModal";
import { LOGIN_URL } from "../../constants/constants";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await axios.post(LOGIN_URL, formData);

      if (!data?.user || !data.token) {
        swalCustom.fire({
          title: "Error",
          text: "Respuesta inválida del servidor",
          icon: "error",
        });
        return;
      }

      login(data.user, data.token);

      swalCustom.fire({
        title: "¡Bienvenido!",
        text: `Hola ${data.user.nombre}`,
        icon: "success",
      });

      navigate("/");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      const status = error?.response?.status;
      const msg = status === 401
        ? "Credenciales inválidas"
        : "Credenciales incorrectas o error del servidor";

      swalCustom.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>¡Bienvenido a Patio 1220!</h1>
        <p>
          Iniciá sesión para continuar explorando nuestros productos y disfrutar
          de todas las funcionalidades que tenemos para vos.
        </p>
      </div>

      <div className="login-right">
        <div className="bg-form border-form p-4">
          <img
            src={Logo}
            alt="Logo del sitio"
            className="img-fluid mx-auto d-block mb-3"
            style={{ width: "100px", height: "auto" }}
          />

          <h3 className="text-center mb-4 text-dark">Iniciar Sesión</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={formData.email.toLowerCase().trim()}
                onChange={handleChange}
                placeholder="Ingresá tu email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresá tu contraseña"
                required
              />
            </div>

            <div className="forgot-password text-center mb-3">
              <button
                type="button"
                className="btn btn-link forgot-pass p-0"
                onClick={() => setShowResetModal(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <hr />

            <div className="d-grid gap-2 mt-1">
              <button
                type="submit"
                className="btn btn-login mt-4"
                disabled={submitting}
              >
                {submitting ? "Ingresando..." : "Ingresar"}
              </button>
              <button
                type="button"
                className="btn btn-register mt-4"
                onClick={() => navigate("/register")}
                disabled={submitting}
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>

      <RecuperarPasswordModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
};

export default LoginForm;