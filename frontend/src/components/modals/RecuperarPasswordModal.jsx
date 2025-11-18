import { useState } from "react";
import "../../styles/recuperarPasswordModal.css";
import axios from "axios";

const RecuperarPasswordModal = ({ onClose, visible }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!visible) return null;

  const handleClose = () => {
    setEmail("");
    setNewPassword("");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleReset = async () => {
    if (!email || !newPassword) {
      alert("Completá todos los campos");
      return;
    }

    try {
      const { data } = await axios.put(
        "http://localhost:3000/usuarios/actualizar-password",
        { emailUsuario: email, nuevaPassword: newPassword }
      );

      if (data.error) {
        alert(data.error);
        return;
      }

      alert("Contraseña actualizada con éxito");
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
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
        <div className="modal-buttons">
          <button type="button" className="btn-confirm" onClick={handleReset}>
            Actualizar
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPasswordModal;
