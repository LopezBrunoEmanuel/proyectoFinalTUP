import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Offcanvas, Button, Row, Col, Image, Form } from "react-bootstrap";
import {
  FaRegTrashAlt,
  FaCheck,
  FaShoppingBag,
  FaArrowLeft,
} from "react-icons/fa";
import { useCarritoStore } from "../../store/useCarritoStore";
import "../../styles/carrito.css";
import img from "../../assets/imgcarrusel2.jpg";
import FinalizarCompra from "../modals/FinalizarCompra";
import { useAuthStore } from "../../store/useAuthStore";
import { swalCustom } from "../../utils/customSwal";

const Carrito = ({ show, handleClose }) => {
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  //reserva compra
  const [showReservarCompra, setShowReservarCompra] = useState(false);

  const {
    carrito,
    eliminarDelCarrito,
    vaciarCarrito,
    disminuirCantidad,
    aumentarCantidad,
  } = useCarritoStore();

  //authstore
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  // 🧮 Total del carrito
  const total = carrito.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0,
  );

  useEffect(() => {
    const handleClickOutside = () => setConfirmarEliminar(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // const [showFinalizarCompra, setShowFinalizarCompra] = useState(false);

  const handleFinalizarCompra = () => {
    if (!user) {
      swalCustom.fire({
        icon: "warning",
        title: "Atención",
        text: "Debes iniciar sesión para poder reservar los productos",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    handleClose();
    setShowReservarCompra(true);

    setShowReservarCompra(true);
  };

  //finalizar reserva
  const handleReservaConfirmada = () => {
    vaciarCarrito();
    setShowReservarCompra(false);
    handleClose();
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header>
          <Offcanvas.Title>
            <button onClick={handleClose}>
              <FaArrowLeft />
            </button>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* 🛍️ Carrito vacío */}
          {carrito.length === 0 ? (
            <div className="carrito-vacio text-center mt-5">
              <FaShoppingBag size={50} className="mb-3 text-muted" />
              <h5 className="fw-semibold text-muted mb-3">
                ¡Tu carrito está vacío!
              </h5>
              <p className="text-secondary mb-4">
                Descubrí nuestras plantas y productos para llenar tu espacio de
                vida.
              </p>

              <button
                className="btn-volver"
                onClick={() => {
                  handleClose();
                  setTimeout(() => navigate("/productos"), 300);
                }}
              >
                Visita la tienda
              </button>
            </div>
          ) : (
            <>
              {/* 🛒 ITEMS DEL CARRITO */}
              {carrito.map((item) => (
                // console.log("ITEM EN CARRITO:", item),
                <div
                  key={item.key}
                  className="carrito-item mb-3 p-2 rounded shadow-sm"
                >
                  <Row className="align-items-center">
                    {/* Imagen */}
                    <Col xs={3} className="text-center">
                      <Image
                        src={item.imagenPrincipal || img}
                        alt={item.nombreProducto}
                        fluid
                        rounded
                        className="carrito-item-img"
                      />
                    </Col>

                    {/* Detalles */}
                    <Col xs={9}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          {/* Nombre del producto */}
                          <p className="mb-1 fw-semibold nombre-prod">
                            {item.nombreProducto}
                          </p>

                          {/* Tamaño (si corresponde) */}
                          <small className="text-muted d-block">
                            Tamaño: {item.nombreTamanio}
                          </small>

                          {/* Precio */}
                          <small className="text-muted d-block">
                            Precio por unidad: ${item.precioUnitario}
                          </small>
                        </div>

                        {/* Botón eliminar */}
                        <Button
                          variant="link"
                          className="p-0 text-danger btn-eliminar"
                          onClick={() =>
                            eliminarDelCarrito(
                              item.idProducto,
                              item.nombreTamanio,
                            )
                          }
                        >
                          <FaRegTrashAlt />
                        </Button>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex align-items-center gap-2">
                          {/* Botón restar */}
                          <Button
                            variant={
                              confirmarEliminar === item.key
                                ? "danger"
                                : "outline-secondary"
                            }
                            size="sm"
                            style={{
                              minWidth:
                                confirmarEliminar === item.key
                                  ? "70px"
                                  : "32px",
                              transition: "all 0.25s ease",
                            }}
                            className="btn-cantidad"
                            onClick={(e) => {
                              e.stopPropagation();

                              if (item.cantidad > 1) {
                                disminuirCantidad(
                                  item.idProducto,
                                  item.nombreTamanio,
                                  1,
                                );
                              } else if (confirmarEliminar === item.key) {
                                eliminarDelCarrito(
                                  item.idProducto,
                                  item.nombreTamanio,
                                );
                                setConfirmarEliminar(null);
                              } else {
                                setConfirmarEliminar(item.key);
                              }
                            }}
                          >
                            {confirmarEliminar === item.key ? "Eliminar" : "-"}
                          </Button>

                          {/* Input cantidad */}
                          <Form.Control
                            type="number"
                            value={item.cantidad}
                            min="1"
                            readOnly
                            className="text-center cantidad-input"
                          />

                          {/* Botón sumar */}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            style={{ minWidth: "32px" }}
                            className="btn-cantidad"
                            onClick={() =>
                              aumentarCantidad(
                                item.idProducto,
                                item.nombreTamanio,
                                1,
                              )
                            }
                            disabled={item.cantidad >= item.stockDisponible}
                          >
                            +
                          </Button>
                        </div>

                        {/* Subtotal */}
                        <p className="fw-bold mb-0 precio-item">
                          ${(item.precioUnitario * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}

              {/* Total y botones */}
              <hr />
              <div className="mt-3">
                <h5 className="text-end fw-bold mb-3">
                  Total: ${total.toFixed(2)}
                </h5>

                <Button
                  variant="secondary d-flex align-items-center justify-content-center gap-2 mb-2"
                  className="w-100"
                  onClick={vaciarCarrito}
                >
                  <span>Vaciar carrito</span> <FaRegTrashAlt />
                </Button>

                <Button
                  variant="success d-flex align-items-center justify-content-center gap-2"
                  className="w-100"
                  onClick={handleFinalizarCompra}
                >
                  <span>Finalizar Reserva</span> <FaCheck />
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <FinalizarCompra
        show={showReservarCompra}
        onClose={() => setShowReservarCompra(false)}
        onReservaConfirmada={handleReservaConfirmada}
        carrito={carrito}
        total={total}
      />
    </>
  );
};

export default Carrito;

// viejo codigo de carrito
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Offcanvas, Button, Row, Col, Image, Form } from "react-bootstrap";
// import { FaRegTrashAlt, FaCheck, FaShoppingCart, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
// import { useCarritoStore } from "../../store/useCarritoStore";
// import "../../styles/carrito.css"; // 👈 nuevo CSS
// import img from "../../assets/imgcarrusel2.jpg";

// const Carrito = ({ show, handleClose }) => {
//     const [confirmarEliminar, setConfirmarEliminar] = useState(null)
//     const { carrito, eliminarDelCarrito, vaciarCarrito, disminuirCantidad, aumentarCantidad } = useCarritoStore();
//     const navigate = useNavigate();

//     const total = carrito.reduce(
//         (acc, item) => acc + item.precioProducto * item.cantidad,
//         0
//     );

//     useEffect(() => {
//         const handleClickOutside = () => setConfirmarEliminar(null)
//         document.addEventListener("click", handleClickOutside)
//         return () => document.removeEventListener("click", handleClickOutside)
//     }, [])

//     return (
//         <Offcanvas show={show} onHide={handleClose} placement="end">
//             <Offcanvas.Header>
//                 <Offcanvas.Title><button onClick={handleClose} ><FaArrowLeft /></button></Offcanvas.Title>
//             </Offcanvas.Header>

//             <Offcanvas.Body>
//                 {carrito.length === 0 ? (
//                     <div className="carrito-vacio text-center mt-5">
//                         <FaShoppingBag size={50} className="mb-3 text-muted" />
//                         <h5 className="fw-semibold text-muted mb-3">¡Tu carrito está vacío!</h5>
//                         <p className="text-secondary mb-4">
//                             Descubrí nuestras plantas y productos para llenar tu espacio de vida.
//                         </p>

//                         <button
//                             className="btn-volver"
//                             onClick={() => {
//                                 handleClose();
//                                 setTimeout(() => navigate("/productos"), 300);
//                             }}
//                         >
//                             Visita la tienda
//                         </button>
//                     </div>
//                 ) : (
//                     <>
//                         {carrito.map((item) => (
//                             <div key={item.idProducto} className="carrito-item mb-3 p-2 rounded shadow-sm">
//                                 <Row className="align-items-center">
//                                     {/* Imagen */}
//                                     <Col xs={3} className="text-center">
//                                         <Image
//                                             src={img}
//                                             alt={item.nombreProducto}
//                                             fluid
//                                             rounded
//                                             className="carrito-item-img"
//                                         />
//                                     </Col>

//                                     {/* Detalles del producto */}
//                                     <Col xs={9}>
//                                         <div className="d-flex justify-content-between align-items-start">
//                                             <div>
//                                                 <p className="mb-1 fw-semibold nombre-prod">{item.nombreProducto}</p>
//                                                 <small className="text-muted d-block">
//                                                     Precio por unidad: ${item.precioProducto}
//                                                 </small>
//                                             </div>
//                                             <Button
//                                                 variant="link"
//                                                 className="p-0 text-danger btn-eliminar"
//                                                 onClick={() => eliminarDelCarrito(item.idProducto)}
//                                             >
//                                                 <FaRegTrashAlt />
//                                             </Button>
//                                         </div>

//                                         {/* Controles de cantidad */}
//                                         <div className="d-flex align-items-center justify-content-between mt-2">
//                                             <div className="d-flex align-items-center gap-2">
//                                                 <Button
//                                                     variant={confirmarEliminar === item.idProducto ? "danger" : "outline-secondary"}
//                                                     size="sm"
//                                                     style={{
//                                                         minWidth: confirmarEliminar === item.idProducto ? "70px" : "32px",
//                                                         transition: "all 0.25s ease",
//                                                     }}
//                                                     className="btn-cantidad"
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         if (item.cantidad > 1) {
//                                                             disminuirCantidad(item.idProducto, 1);
//                                                         } else if (confirmarEliminar === item.idProducto) {
//                                                             eliminarDelCarrito(item.idProducto);
//                                                             setConfirmarEliminar(null);
//                                                         } else {
//                                                             setConfirmarEliminar(item.idProducto);
//                                                         }
//                                                     }}
//                                                 >
//                                                     {confirmarEliminar === item.idProducto ? "Eliminar" : "-"}
//                                                 </Button>

//                                                 <Form.Control
//                                                     type="number"
//                                                     value={item.cantidad}
//                                                     min="1"
//                                                     readOnly
//                                                     className="text-center cantidad-input"
//                                                 />

//                                                 <Button
//                                                     variant="outline-secondary"
//                                                     size="sm"
//                                                     style={{ minWidth: "32px" }}
//                                                     className="btn-cantidad"
//                                                     onClick={() => aumentarCantidad(item.idProducto)}
//                                                     disabled={item.cantidad >= item.stockProducto}
//                                                 >
//                                                     +
//                                                 </Button>
//                                             </div>

//                                             <p className="fw-bold mb-0 precio-item">
//                                                 ${(item.precioProducto * item.cantidad).toFixed(2)}
//                                             </p>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </div>
//                         ))}

//                         {/* Total y botones */}
//                         <hr />
//                         <div className="mt-3">
//                             <h5 className="text-end fw-bold mb-3">Total: ${total.toFixed(2)}</h5>

//                             <Button
//                                 variant="secondary d-flex align-items-center justify-content-center gap-2 mb-2"
//                                 className="w-100"
//                                 onClick={vaciarCarrito}
//                             >
//                                 <span>Vaciar carrito</span> <FaRegTrashAlt />
//                             </Button>

//                             <Button
//                                 variant="success d-flex align-items-center justify-content-center gap-2"
//                                 className="w-100"
//                             >
//                                 <span>Finalizar compra</span> <FaCheck />
//                             </Button>
//                         </div>
//                     </>
//                 )}
//             </Offcanvas.Body>
//         </Offcanvas>

//     );
// };

// export default Carrito;
