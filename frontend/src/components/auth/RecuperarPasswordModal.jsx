// import { useState } from "react";
// import "../../styles/modals/RecuperarPasswordModal.css";
// import axios from "axios";
// import { USUARIOS_URL } from "../../constants/constants";
// import { swalCustom } from "../../utils/customSwal";

// const RecuperarPasswordModal = ({ onClose, visible }) => {
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [checkNewPassword, setCheckNewPassword] = useState("");

//   if (!visible) return null;

//   const handleClose = () => {
//     setEmail("");
//     setNewPassword("");
//     setCheckNewPassword("");
//     onClose();
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       handleClose();
//     }
//   };

//   const handleReset = async () => {
//     if (!email || !newPassword || !checkNewPassword) {
//       swalCustom.fire({
//         icon: "warning",
//         title: "Faltan datos",
//         text: "Completá todos los campos"
//       })
//       return;
//     }

//     if (newPassword !== checkNewPassword) {
//       swalCustom.fire({
//         icon: "error",
//         title: "Las contraseñas no coinciden",
//         text: "Por favor, escribí la misma contraseña en ambos campos"
//       })
//       return;
//     }

//     try {
//       const { data } = await axios.put(`${USUARIOS_URL}/actualizar-password`, {
//         email,
//         nuevaPassword: newPassword,
//       })

//       if (data?.success) {
//         swalCustom.fire({
//           icon: "success",
//           title: "Listo",
//           text: "Contraseña actualizada con éxito!"
//         });
//         handleClose();
//         return;
//       }

//     } catch (error) {

//       const status = error?.response?.status;
//       const msg = status === 404 ? "No se encontró un usuario con ese mail" : status === 400 ? "Faltan datos o el formato es incorrecto" : "Error de servidor";

//       swalCustom.fire({
//         icon: "error",
//         title: "Error",
//         text: msg,
//       })
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
//         <h3>Restablecer contraseña</h3>

//         <input
//           type="email"
//           placeholder="Correo registrado"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Nueva contraseña"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Repite la contraseña"
//           value={checkNewPassword}
//           onChange={(e) => setCheckNewPassword(e.target.value)}
//         />

//         <div className="modal-buttons">
//           <button type="button" className="btn-confirm" onClick={handleReset}>
//             Actualizar
//           </button>
//           <button type="button" className="btn-cancel" onClick={handleClose}>
//             Cancelar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecuperarPasswordModal;

import { useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { USUARIOS_URL } from "../../constants/constants";
import { swalCustom } from "../../utils/customSwal";
import "../../styles/pages/login.css";

const RecuperarPasswordModal = ({ onClose, visible }) => {
  const [email, setEmail] = useState("");
  const [mailEnviado, setMailEnviado] = useState(false);

  const handleClose = () => {
    setEmail("");
    setMailEnviado(false);
    onClose();
  };

  const handleEnviarMail = async () => {
    if (!email) {
      swalCustom.fire({
        icon: "warning",
        title: "Falta el email",
        text: "Ingresá tu correo registrado",
      });
      return;
    }

    try {
      await axios.post(`${USUARIOS_URL}/forgot-password`, { email });

      setMailEnviado(true);
    } catch {
      swalCustom.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema. Intentá de nuevo más tarde.",
      });
    }
  };

  return (
    <Modal
      show={visible}
      onHide={handleClose}
      centered
      className="auth-recovery-modal"
    >
      <Modal.Body className="auth-recovery-body">
        {/* si el mail todavia no se mando mostramos el formulario */}
        {!mailEnviado ? (
          <>
            <h2
              className="auth-title"
              style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}
            >
              Recuperar
              <br />
              <em>contraseña</em>
            </h2>

            <div className="auth-divider" style={{ margin: "1rem 0 1.5rem" }}>
              <span className="auth-divider-icon">✦</span>
            </div>

            <p
              className="auth-label"
              style={{
                color: "#555",
                marginBottom: "1rem",
                fontSize: "0.95rem",
              }}
            >
              Ingresá tu correo y te mandamos un enlace para restablecer tu
              contraseña.
            </p>

            <div className="auth-field">
              <label className="auth-label">Correo registrado</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>

            <button
              className="auth-btn-primary"
              onClick={handleEnviarMail}
              style={{ marginTop: "0.5rem" }}
            >
              Enviar enlace
            </button>

            <div className="auth-separator">
              <span>o</span>
            </div>

            <button className="auth-btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
          </>
        ) : (
          // si el mail ya se mando mostramos este mensaje
          <>
            <h2
              className="auth-title"
              style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}
            >
              Revisá tu
              <br />
              <em>correo</em>
            </h2>

            <div className="auth-divider" style={{ margin: "1rem 0 1.5rem" }}>
              <span className="auth-divider-icon">✦</span>
            </div>

            <p
              style={{
                color: "#555",
                textAlign: "center",
                fontSize: "0.95rem",
              }}
            >
              Si <strong>{email}</strong> está registrado, vas a recibir un
              enlace para restablecer tu contraseña.
            </p>

            <p
              style={{
                color: "#888",
                textAlign: "center",
                fontSize: "0.85rem",
                marginTop: "0.5rem",
              }}
            >
              Revisá también la carpeta de spam.
            </p>

            <button
              className="auth-btn-primary"
              onClick={handleClose}
              style={{ marginTop: "1.5rem" }}
            >
              Entendido
            </button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RecuperarPasswordModal;
