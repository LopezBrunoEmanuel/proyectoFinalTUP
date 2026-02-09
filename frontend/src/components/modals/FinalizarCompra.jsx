import { useState } from "react";
import { Card } from "react-bootstrap";
import { swalCustom } from "../../utils/customSwal";
import Logo from "../../assets/logopatio.png";
import "../../styles/finalizarcompra.css";

const FinalizarCompra = ({
  show,
  onClose,
  onReservaConfirmada,
  carrito = [],
  total = 0,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    telefono: "",
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirmarCompra = (e) => {
    e.preventDefault();

    swalCustom.fire({
      icon: "success",
      title: "Reserva confirmada 🌱",
      text: `Gracias ${formData.nombre} ${formData.apellido}. Nos contactaremos al email: ${formData.email}.`,
      confirmButtonText: "Aceptar",
    });

    onReservaConfirmada();
    onClose();
  };

  return (
    <div className="finalizar-overlay">
      <div className="finalizar-modal">
        <div className="text-center mb-3">
          <div className="finalizar-header">
            <img src={Logo} alt="Patio 1220" className="finalizar-logo" />
            <h3 className="mt-2">Patio 1220</h3>

            <p className="finalizar-subtitle">
              Completá tus datos para confirmar la reserva
            </p>
          </div>
        </div>

        <form onSubmit={handleConfirmarCompra} className="finalizar-grid">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🧾 RESUMEN DEL CARRITO */}
          <Card className="resumen-card">
            <Card.Body>
              <Card.Title>Resumen de productos</Card.Title>

              {carrito.map((item) => (
                <div key={item.key} className="resumen-item">
                  <span>
                    {item.nombreProducto} x{item.cantidad}
                  </span>
                  <span>
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr />

              <div className="resumen-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>

          <div className="finalizar-buttons full-width">
            <button type="submit" className="finalizar-confirm">
              Confirmar reserva
            </button>

            <button
              type="button"
              className="finalizar-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinalizarCompra;
