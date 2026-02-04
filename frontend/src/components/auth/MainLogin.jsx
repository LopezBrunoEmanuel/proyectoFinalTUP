import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import Logo from "../../assets/logopatio.png";
import { swalCustom } from "../../utils/customSwal";
import RecuperarPasswordModal from "../../components/modals/RecuperarPasswordModal";
import { BASE_URL } from "../../constants/constants";

const MainLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showResetModal, setShowResetModal] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${BASE_URL}/api/login`, formData);
      console.log("Respuesta del servidor:", data);

      if (!data?.user) {
        swalCustom.fire({
          title: "Error",
          text: "Credenciales inválidas",
          icon: "error",
        });
        return;
      }

      login(data.user);

      swalCustom.fire({
        title: "¡Bienvenido!",
        text: `Hola ${data.user.nombre}`,
        icon: "success",
      });

      // cuando se cree el boton de panel de admin, hay que quitar los navigate asi solo dirija a inicio
      switch (data.user.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "empleado":
          navigate("/admin");
          break;
        case "cliente":
          navigate("/");
          break;
        default:
          swalCustom.fire("Error", "Rol desconocido", "error");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      const status = error?.response?.status;
      const msg = status === 401 ? "Credenciales inválidas" : "Credenciales incorrectas o error del servidor"

      swalCustom.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowResetModal(true);
  };

  return (
    <div className="login-container">
      {/* Sección izquierda */}
      <div className="login-left">
        <h1>¡Bienvenido a Patio 1220!</h1>
        <p>
          Iniciá sesión para continuar explorando nuestros productos y disfrutar
          de todas las funcionalidades que tenemos para vos.
        </p>
      </div>

      {/* Lado derecho con formulario */}
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
              <label htmlFor="email" className="form-label text-dark">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresá tu email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark">
                Contraseña
              </label>
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

            <div className="d-grid gap-2 mt-1">
              <button type="submit" className="btn btn-login mt-4">
                Ingresar
              </button>
              <hr />
              <div className="forgot-password text-center mb-3">
                <a href="#" onClick={handleForgotPassword}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <button
                type="button"
                className="btn btn-register mt-4"
                onClick={handleRegisterClick}
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

export default MainLogin;
