import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";
import { swalCustom } from "../../utils/customSwal";

const MainRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    apellidoUsuario: "",
    emailUsuario: "",
    telefonoUsuario: "",
    direccionUsuario: "",
    passwordUsuario: "",
    rol: "cliente",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      await axios.post("http://localhost:3000/api/usuarios", formData);

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
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        paddingTop: "50px",
        paddingBottom: "50px",
      }}
    >
      <div
        className="bg-form card shadow p-4 border-pink"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4 text-dark">Registrate</h3>
        <form onSubmit={handleSubmit} className="form">
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
              Telefono
            </label>
            <input
              type="text"
              className="form-control"
              id="telefonoUsuario"
              name="telefonoUsuario"
              value={formData.telefonoUsuario}
              onChange={handleChange}
              placeholder="Ingresá tu nombre"
              required
            />
            <label htmlFor="direccionUsuario" className="form-label text-dark">
              Dirección
            </label>
            <input
              type="text"
              className="form-control"
              id="direccionUsuario"
              name="direccionUsuario"
              value={formData.direccionUsuario}
              onChange={handleChange}
              placeholder="Ingresá tu nombre"
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
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-pink mt-4">
              Registrarme
            </button>
            <button type="submit" className="btn btn-pink mt-4" onClick={handleVolver}>
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainRegister;
