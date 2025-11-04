import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useCarritoStore } from "../../store/useCarritoStore";
import { useAuthStore } from "../../store/useAuthStore";
import { swalCustom } from "../../utils/customSwal";

const MainCarrito = () => {
  const {
    carrito,
    disminuirCantidad,
    aumentarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalCarrito,
  } = useCarritoStore();

  const { user } = useAuthStore();

  const total = typeof totalCarrito === "function" ? totalCarrito() : 0;

  const procesarPago = async () => {
    if (!carrito || carrito.length === 0) {
      return swalCustom.fire({
        icon: "info",
        title: "Carrito vacío",
        text: "Agrega productos antes de finalizar la compra.",
      });
    }

    if (!user) {
      return swalCustom.fire({
        icon: "warning",
        title: "Debes iniciar sesión para continuar",
        text: "Inicia sesión para poder completar tu compra.",
      });
    }

    const { value: datos } = await swalCustom.fire({
      title: "Datos de entrega",
      html: `
        <input id="direccion" class="swal2-input" placeholder="Dirección de entrega">
        <input id="telefono" class="swal2-input" placeholder="Teléfono de contacto">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Continuar",
      preConfirm: () => {
        const direccion = document.getElementById("direccion")?.value?.trim();
        const telefono = document.getElementById("telefono")?.value?.trim();
        if (!direccion || !telefono) {
          swalCustom.showValidationMessage(
            "Por favor completa todos los campos"
          );
          return false;
        }
        return { direccion, telefono };
      },
    });

    if (!datos) return;

    const resumen = carrito
      .map(
        (item) => `
        <tr>
          <td>${item.nombreProducto}</td>
          <td class="text-center">${item.cantidad}</td>
          <td class="text-end">$${Number(item.precioProducto).toFixed(2)}</td>
          <td class="text-end">$${(
            Number(item.precioProducto) * item.cantidad
          ).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const confirmacion = await swalCustom.fire({
      title: "Resumen de compra",
      html: `
        <p><strong>Cliente:</strong> ${
          user?.nombreUsuario || user?.nombre || "Usuario"
        }</p>
        <p><strong>Dirección:</strong> ${datos.direccion}</p>
        <p><strong>Teléfono:</strong> ${datos.telefono}</p>
        <div style="max-height:300px; overflow:auto; margin-top:0.5rem">
          <table class="table table-sm table-bordered">
            <thead>
              <tr>
                <th>Producto</th>
                <th class="text-center">Cant.</th>
                <th class="text-end">Precio</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>${resumen}</tbody>
          </table>
        </div>
        <h5 class="mt-2">Total: $${Number(total).toFixed(2)}</h5>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirmar compra",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      vaciarCarrito();
      await swalCustom.fire({
        icon: "success",
        title: "¡Compra realizada!",
        text: "Tu pedido fue procesado correctamente.",
      });
    } else {
      swalCustom.fire({
        icon: "info",
        title: "Compra cancelada",
        text: "Tu carrito se mantiene con los productos.",
      });
    }
  };

  return (
    <Container className="my-4 carrito-container">
      <h2 className="text-center mb-4">🛒 Tu carrito</h2>

      <div className="container mt-4">
        <h2>🛍️ Carrito de compras</h2>
        <ul>
          {carrito.map((item) => (
            <li key={item.idProducto} className="mb-2">
              <strong>{item.nombreProducto}</strong> — ${item.precioProducto} ×{" "}
              {item.cantidad}
              <div>
                <button onClick={() => disminuirCantidad(item.idProducto)}>
                  -
                </button>
                <button onClick={() => aumentarCantidad(item.idProducto)}>
                  +
                </button>
                <button onClick={() => eliminarDelCarrito(item.idProducto)}>
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
        <h4>Total: ${totalCarrito()}</h4>
      </div>

      {!carrito || carrito.length === 0 ? (
        <p className="text-center mt-4 text-muted">Tu carrito está vacío.</p>
      ) : (
        <>
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Subtotal</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((prod) => (
                <tr key={prod.idProducto}>
                  <td>{prod.nombreProducto}</td>
                  <td>${Number(prod.precioProducto).toFixed(2)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => disminuirCantidad(prod.idProducto)}
                        disabled={prod.cantidad <= 1}
                      >
                        −
                      </Button>
                      <span>{prod.cantidad}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => aumentarCantidad(prod.idProducto)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="text-end">
                    ${(Number(prod.precioProducto) * prod.cantidad).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarDelCarrito(prod.idProducto)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="mt-4 align-items-center">
            <Col md={6} className="text-start">
              <Button variant="outline-danger" onClick={vaciarCarrito}>
                Vaciar carrito
              </Button>
            </Col>
            <Col md={6} className="text-end">
              <h4>Total: ${Number(total).toFixed(2)}</h4>
              <Button variant="primary" className="ms-2" onClick={procesarPago}>
                Procesar pago
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default MainCarrito;
