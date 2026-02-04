import { useState } from "react";
import "../../styles/recuperarPasswordModal.css";
import axios from "axios";
import { USUARIOS_URL } from "../../constants/constants";
import { swalCustom } from "../../utils/customSwal";

const RecuperarPasswordModal = ({ onClose, visible }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkNewPassword, setCheckNewPassword] = useState("");

  if (!visible) return null;

  const handleClose = () => {
    setEmail("");
    setNewPassword("");
    setCheckNewPassword("");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleReset = async () => {
    if (!email || !newPassword || !checkNewPassword) {
      swalCustom.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Completá todos los campos"
      })
      return;
    }

    if (newPassword !== checkNewPassword) {
      swalCustom.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Por favor, escribí la misma contraseña en ambos campos"
      })
      return;
    }

    try {
      const { data } = await axios.put(`${USUARIOS_URL}/actualizar-password`, {
        email,
        nuevaPassword: newPassword,
      })

      if (data?.success) {
        swalCustom.fire({
          icon: "success",
          title: "Listo",
          text: "Contraseña actualizada con éxito!"
        });
        handleClose();
        return;
      }

    } catch (error) {

      const status = error?.response?.status;
      const msg = status === 404 ? "No se encontró un usuario con ese mail" : status === 400 ? "Faltan datos o el formato es incorrecto" : "Error de servidor";

      swalCustom.fire({
        icon: "error",
        title: "Error",
        text: msg,
      })
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Restablecer contraseña</h3>

        <input
          type="email"
          placeholder="Correo registrado"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Repite la contraseña"
          value={checkNewPassword}
          onChange={(e) => setCheckNewPassword(e.target.value)}
        />

        <div className="modal-buttons">
          <button type="button" className="btn-confirm" onClick={handleReset}>
            Actualizar
          </button>
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPasswordModal;
