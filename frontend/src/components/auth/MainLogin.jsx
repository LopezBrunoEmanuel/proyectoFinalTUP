// import { useState } from "react";
// import { Form, Button, Alert } from "react-bootstrap";
// import "../../styles/login.css";

// import BackgroundImage from "../../assets/images/background.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
// import Swal from "sweetalert2";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import Logo from "../../assets/logopatio.png";
import { swalCustom } from "../../utils/customSwal";

// const MainLogin = () => {
// const [inputUsername, setInputUsername] = useState("");
// const [inputPassword, setInputPassword] = useState("");

// const [show, setShow] = useState(false);
// const [loading, setLoading] = useState(false);

// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setLoading(true);
//   await delay(500);
//   console.log(`Username :${inputUsername}, Password :${inputPassword}`);
//   if (inputUsername !== "admin" || inputPassword !== "admin") {
//     setShow(true);
//   }
//   setLoading(false);
// };

// const handlePassword = () => {};

// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

const MainLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    emailUsuario: "",
    passwordUsuario: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/login",
        formData
      );

      if (!data.user) {
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

      switch (data.user.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "empleado":
          navigate("/empleado");
          break;
        case "cliente":
          navigate("/");
          break;
        default:
          swalCustom.fire("Error", "Rol desconocido", "error");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      swalCustom.fire({
        title: "Error",
        text: "Credenciales incorrectas o error del servidor",
        icon: "error",
      });
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    // <div className="sign-in__wrapper">
    //   {/* Overlay */}
    //   <div className="sign-in__backdrop"></div>
    //   {/* Form */}
    //   <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
    //     {/* Header */}
    //     <img
    //       className="img-thumbnail mx-auto d-block mb-2"
    //       src={Logo}
    //       alt="logo"
    //     />
    //     <div className="h4 mb-2 text-center">Iniciar Sesión</div>
    //     {/* ALert */}
    //     {show ? (
    //       <Alert
    //         className="mb-2"
    //         variant="danger"
    //         onClose={() => setShow(false)}
    //         dismissible
    //       >
    //         Incorrect username or password.
    //       </Alert>
    //     ) : (
    //       <div />
    //     )}
    //     <Form.Group className="mb-2" controlId="username">
    //       <Form.Label>Usuario</Form.Label>
    //       <Form.Control
    //         type="text"
    //         value={inputUsername}
    //         placeholder="Usuario"
    //         onChange={(e) => setInputUsername(e.target.value)}
    //         required
    //       />
    //     </Form.Group>
    //     <Form.Group className="mb-2" controlId="password">
    //       <Form.Label>Contraseña</Form.Label>
    //       <Form.Control
    //         type="password"
    //         value={inputPassword}
    //         placeholder="Contraseña"
    //         onChange={(e) => setInputPassword(e.target.value)}
    //         required
    //       />
    //     </Form.Group>
    //     <Form.Group className="mb-2" controlId="checkbox">
    //       <Form.Check type="checkbox" label="Recordarme" />
    //     </Form.Group>
    //     {!loading ? (
    //       <Button className="w-100" variant="primary" type="submit">
    //         Log In
    //       </Button>
    //     ) : (
    //       <Button className="w-100" variant="primary" type="submit" disabled>
    //         Logging In...
    //       </Button>
    //     )}
    //     <div className="d-grid justify-content-end">
    //       <Button
    //         className="text-muted px-0"
    //         variant="link"
    //         onClick={handlePassword}
    //       >
    //         ¿Olvidaste tu contraseña?
    //       </Button>
    //     </div>
    //   </Form>
    // </div>
    <div
      className="d-flex align-items-center justify-content-center "
      style={{
        paddingTop: "50px",
        paddingBottom: "50px",
      }}
    >
      <div
        className="bg-form card shadow p-4 border-pink"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <img
          src={Logo}
          alt="Logo del sitio"
          className="img-fluid mx-auto d-block mb-3"
          style={{ width: "100px", height: "auto" }}
        />

        <h3 className="text-center mb-4 text-dark">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="emailUsuario" className="form-label text-dark">
              Email
            </label>
            <input
              type="text"
              className="form-control"
              id="emailUsuario"
              name="emailUsuario"
              value={formData.emailUsuario}
              onChange={handleChange}
              placeholder="Ingresá tu email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordUasuario" className="form-label text-dark">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="passwordUsuario"
              name="passwordUsuario"
              value={formData.passwordUsuario}
              onChange={handleChange}
              placeholder="Ingresá tu contrasena"
              required
            />
          </div>
          <div className="d-grid gap-2 mt-5">
            <button type="submit" className="btn btn-pink">
              Ingresar
            </button>
            <button
              type="button"
              className="btn btn-register"
              onClick={handleRegisterClick}
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainLogin;
