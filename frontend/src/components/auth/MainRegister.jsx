import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";
import axios from "axios";
import { swalCustom } from "../../utils/customSwal";
import Logo from "../../assets/logopatio.png";

const MainRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    apellidoUsuario: "",
    emailUsuario: "",
    telefonoUsuario: "",
    direccionUsuario: "",
    passwordUsuario: "",
    confirmarPassword: "",
    rolUsuario: "cliente",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passwordUsuario !== formData.confirmarPassword) {
      swalCustom.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Por favor, escribí la misma contraseña en ambos campos",
      });
      return;
    }
    try {
      await axios.post("http://localhost:3000/usuarios", formData);

      swalCustom.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Ya podés iniciar sesión con tu cuenta",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      swalCustom.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el usuario",
      });
    }
  };

  const handleVolver = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      {/* Lado izquierdo */}
      <div className="register-left">
        <h1>¡Unite a nuestra comunidad!</h1>
        <p>
          Registrate para acceder a promociones exclusivas y descubrir todo lo
          que tenemos para ofrecerte. ¡Tu nueva experiencia comienza acá!
        </p>
      </div>

      {/* Lado derecho */}
      <div className="register-right">
        <div className="bg-form p-4 border-form">
          <img
            src={Logo}
            alt="Logo del sitio"
            className="img-fluid mx-auto d-block mb-3"
            style={{ width: "100px", height: "auto" }}
          />

          <h3 className="text-center mb-4 text-dark">Registrate</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label text-dark">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreUsuario"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                placeholder="Ingresá tu nombre"
                required
              />

              <label htmlFor="apellidoUsuario" className="form-label text-dark">
                Apellido
              </label>
              <input
                type="text"
                className="form-control"
                id="apellidoUsuario"
                name="apellidoUsuario"
                value={formData.apellidoUsuario}
                onChange={handleChange}
                placeholder="Ingresá tu apellido"
                required
              />

              <label htmlFor="emailUsuario" className="form-label text-dark">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="emailUsuario"
                name="emailUsuario"
                value={formData.emailUsuario}
                onChange={handleChange}
                placeholder="Ingresá tu email"
                required
              />

              <label htmlFor="telefonoUsuario" className="form-label text-dark">
                Teléfono
              </label>
              <input
                type="text"
                className="form-control"
                id="telefonoUsuario"
                name="telefonoUsuario"
                value={formData.telefonoUsuario}
                onChange={handleChange}
                placeholder="Ingresá tu teléfono"
                required
              />

              <label
                htmlFor="direccionUsuario"
                className="form-label text-dark"
              >
                Dirección
              </label>
              <input
                type="text"
                className="form-control"
                id="direccionUsuario"
                name="direccionUsuario"
                value={formData.direccionUsuario}
                onChange={handleChange}
                placeholder="Ingresá tu dirección"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="passwordUsuario" className="form-label text-dark">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="passwordUsuario"
                name="passwordUsuario"
                value={formData.passwordUsuario}
                onChange={handleChange}
                placeholder="Ingresá tu contraseña"
                required
              />
              <label
                htmlFor="confirmarPassword"
                className="form-label text-dark mt-2"
              >
                Escribí nuevamente tu contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmarPassword"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                placeholder="Repetí tu contraseña"
                required
              />
            </div>

            <div className="d-grid gap-2 mt-5">
              <button type="submit" className="btn btn-registrarse">
                Registrarme
              </button>
              <hr />
              <br />
              <button
                type="button"
                className="btn btn-volver"
                onClick={handleVolver}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainRegister;
