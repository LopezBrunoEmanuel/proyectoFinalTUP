// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/pages/register.css";
// import axios from "axios";
// import { swalCustom } from "../../utils/customSwal";
// import Logo from "../../assets/logopatio.png";
// import { REGISTER_URL } from "../../constants/constants";
// import { Spinner } from "react-bootstrap";

// const RegisterForm = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     nombre: "",
//     apellido: "",
//     email: "",
//     telefono: "",
//     password: "",
//     confirmarPassword: "",
//   });

//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmarPassword) {
//       swalCustom.fire({
//         icon: "error",
//         title: "Las contraseñas no coinciden",
//         text: "Por favor, escribí la misma contraseña en ambos campos",
//       });
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const payload = {
//         nombre: formData.nombre,
//         apellido: formData.apellido,
//         email: formData.email.toLowerCase().trim(),
//         telefono: formData.telefono || null,
//         password: formData.password,
//       };

//       await axios.post(REGISTER_URL, payload);

//       swalCustom.fire({
//         icon: "success",
//         title: "¡Registro exitoso!",
//         text: "Tu cuenta fue creada. Ya podés iniciar sesión.",
//       });

//       navigate("/login");

//     } catch (error) {
//       console.error("Error al registrar:", error);
//       const status = error?.response?.status;
//       const msg = status === 409
//         ? "El email ya está registrado. Probá con otro email."
//         : "No se pudo registrar el usuario";

//       swalCustom.fire({ icon: "error", title: "Error", text: msg });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="register-container">
//       <div className="register-left">
//         <h1>¡Unite a nuestra comunidad!</h1>
//         <p>
//           Registrate para acceder a promociones exclusivas y descubrir todo lo
//           que tenemos para ofrecerte. ¡Tu nueva experiencia comienza acá!
//         </p>
//       </div>

//       <div className="register-right">
//         <div className="bg-form p-4 border-form">
//           <img
//             src={Logo}
//             alt="Logo del sitio"
//             className="img-fluid mx-auto d-block mb-3"
//             style={{ width: "100px", height: "auto" }}
//           />

//           <h3 className="text-center mb-4 text-dark">Registrate</h3>

//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="nombre" className="form-label text-dark">Nombre *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="nombre"
//                 name="nombre"
//                 value={formData.nombre}
//                 onChange={handleChange}
//                 placeholder="Ingresá tu nombre"
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="apellido" className="form-label text-dark">Apellido *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="apellido"
//                 name="apellido"
//                 value={formData.apellido}
//                 onChange={handleChange}
//                 placeholder="Ingresá tu apellido"
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="email" className="form-label text-dark">Email *</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Ingresá tu email"
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="telefono" className="form-label text-dark">
//                 Teléfono <span className="text-muted">(opcional)</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="telefono"
//                 name="telefono"
//                 value={formData.telefono}
//                 onChange={handleChange}
//                 placeholder="Ingresá tu teléfono"
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="password" className="form-label text-dark">Contraseña *</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Ingresá tu contraseña"
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="confirmarPassword" className="form-label text-dark">
//                 Confirmar contraseña *
//               </label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="confirmarPassword"
//                 name="confirmarPassword"
//                 value={formData.confirmarPassword}
//                 onChange={handleChange}
//                 placeholder="Repetí tu contraseña"
//                 required
//               />
//             </div>

//             <div className="d-grid gap-2 mt-4">
//               <button
//                 type="submit"
//                 className="btn btn-registrarse"
//                 disabled={submitting}
//               >
//                 {submitting ? (
//                   <>
//                     <Spinner animation="border" size="sm" className="me-2" />
//                     Registrando...
//                   </>
//                 ) : "Registrarme"}
//               </button>
//               <hr />
//               <button
//                 type="button"
//                 className="btn btn-volver"
//                 onClick={() => navigate("/login")}
//                 disabled={submitting}
//               >
//                 Volver
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { swalCustom } from "../../utils/customSwal";
import Logo from "../../assets/logopatio.png";
import { REGISTER_URL } from "../../constants/constants";
import "../../styles/pages/login.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "", apellido: "", email: "",
    telefono: "", password: "", confirmarPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmarPassword) {
      swalCustom.fire({ icon: "error", title: "Las contraseñas no coinciden", text: "Por favor, escribí la misma contraseña en ambos campos" });
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(REGISTER_URL, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email.toLowerCase().trim(),
        telefono: formData.telefono || null,
        password: formData.password,
      });
      swalCustom.fire({ icon: "success", title: "¡Registro exitoso!", text: "Tu cuenta fue creada. Ya podés iniciar sesión." });
      navigate("/login");
    } catch (error) {
      const status = error?.response?.status;
      const msg = status === 409 ? "El email ya está registrado." : "No se pudo registrar el usuario";
      swalCustom.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <img src={Logo} alt="Patio 1220" className="auth-logo" />
          <span className="auth-brand-name">Patio 1220</span>
        </div>

        <h1 className="auth-title">
          Creá tu<br /><em>cuenta</em>
        </h1>

        <div className="auth-divider">
          <span className="auth-divider-icon">✦ registro ✦</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre + Apellido en fila */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.25rem" }}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="nombre">Nombre</label>
              <input className="auth-input" type="text" id="nombre" name="nombre"
                value={formData.nombre} onChange={handleChange} placeholder="Juan" required />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="apellido">Apellido</label>
              <input className="auth-input" type="text" id="apellido" name="apellido"
                value={formData.apellido} onChange={handleChange} placeholder="García" required />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Correo electrónico</label>
            <input className="auth-input" type="email" id="email" name="email"
              value={formData.email} onChange={handleChange} placeholder="tu@email.com" required />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="telefono">Teléfono <span style={{ opacity: 0.45, fontWeight: 300 }}>(opcional)</span></label>
            <input className="auth-input" type="text" id="telefono" name="telefono"
              value={formData.telefono} onChange={handleChange} placeholder="+54 11 0000-0000" />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Contraseña</label>
            <input className="auth-input" type="password" id="password" name="password"
              value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmarPassword">Confirmá la contraseña</label>
            <input className="auth-input" type="password" id="confirmarPassword" name="confirmarPassword"
              value={formData.confirmarPassword} onChange={handleChange} placeholder="••••••••" required />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={submitting}>
            {submitting ? "Registrando..." : "Crear cuenta"}
          </button>

          <div className="auth-separator"><span>¿ya tenés cuenta?</span></div>

          <button type="button" className="auth-btn-secondary"
            onClick={() => navigate("/login")} disabled={submitting}>
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;