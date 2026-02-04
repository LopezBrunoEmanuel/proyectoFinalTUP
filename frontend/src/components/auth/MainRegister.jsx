import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";
import axios from "axios";
import { swalCustom } from "../../utils/customSwal";
import Logo from "../../assets/logopatio.png";
import { USUARIOS_URL } from "../../constants/constants";

const MainRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    confirmarPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      swalCustom.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Por favor, escribí la misma contraseña en ambos campos",
      });
      return;
    }

    //PAYLOAD LIMPIO (sin confirmarPass)
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      password: formData.password
    }

    try {
      await axios.post(USUARIOS_URL, payload);

      swalCustom.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Ya podés iniciar sesión con tu cuenta",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);

      //si el back devuelve 409 (por mail existente), entonces mandamos el mensaje:
      const status = error?.response?.status;
      const msg = status === 409 ? "El email ya está registrado. Probá iniciar sesión con otro email." : "No se pudo registrar el usuario";

      swalCustom.fire({
        icon: "error",
        title: "Error",
        text: msg,
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
              <label htmlFor="nombre" className="form-label text-dark">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresá tu nombre"
                required
              />

              <label htmlFor="apellido" className="form-label text-dark">
                Apellido
              </label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ingresá tu apellido"
                required
              />

              <label htmlFor="email" className="form-label text-dark">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresá tu email"
                required
              />

              <label htmlFor="telefono" className="form-label text-dark">
                Teléfono
              </label>
              <input
                type="text"
                className="form-control"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingresá tu teléfono"
                required
              />

              <label
                htmlFor="direccion"
                className="form-label text-dark"
              >
                Dirección
              </label>
              <input
                type="text"
                className="form-control"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ingresá tu dirección"
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
