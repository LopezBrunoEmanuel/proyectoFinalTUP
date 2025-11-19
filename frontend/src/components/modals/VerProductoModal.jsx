import { Modal, ListGroup, Card, Button, Badge } from "react-bootstrap";
import { useProductosStore } from "../../store/useProductosStore";
import "../../styles/crud-modals.css"

const VerProductoModal = ({ show, onClose }) => {

    const { productoSeleccionado } = useProductosStore();

    // 🛑 PRIMERO: si no hay producto, no seguimos
    if (!productoSeleccionado) return null;

    // 🔵 Imagen
    const imagenSrc =
        productoSeleccionado.imagenPrincipal?.trim()
            ? productoSeleccionado.imagenPrincipal
            : "/placeholder.png";

    // 🔵 Descripción fallback
    const descripcion =
        productoSeleccionado.descripcionProducto || "Sin descripción";

    // 🔵 Categorías estáticas
    const categorias = {
        1: "Planta",
        2: "Maceta",
        3: "Fertilizante",
        4: "Herramienta",
        5: "Otro",
    };
    const categoriaNombre = categorias[productoSeleccionado.idCategoria] || "Desconocida";

    // 🟦 Tamaños seguros → ahora sí podemos usarlos
    const tamanios = Array.isArray(productoSeleccionado.tamanios)
        ? productoSeleccionado.tamanios
        : [];

    // 🟦 Filtrar solo tamaños activos (activo puede venir como true/false/"1"/0/etc)
    const tamaniosActivos = tamanios.filter(t =>
        t && ("activo" in t) ? Boolean(Number(t.activo)) : true
    );

    const hasTamanios = productoSeleccionado.tieneTamanios;
    const cantidadActivos = tamaniosActivos.length;

    return (
        <Modal className="crud-modal" show={show} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>
                    #{productoSeleccionado.idProducto}: {productoSeleccionado.nombreProducto}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-white">

                {/* CARD PRINCIPAL */}
                <Card className="bg-dark text-white text-center border-0">
                    <Card.Body>

                        <img
                            src={imagenSrc}
                            alt={productoSeleccionado.nombreProducto}
                            className="mx-auto d-block"
                            style={{
                                maxHeight: "230px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                marginBottom: "15px",
                                border: "2px solid #4CAF50",
                            }}
                        />

                        {/* Badges */}
                        <h5 className="mt-2 mb-3">
                            {productoSeleccionado.activo ? (
                                <Badge bg="success">Activo</Badge>
                            ) : (
                                <Badge bg="secondary">Inactivo</Badge>
                            )}

                            {/* Badge de tamaños → solo si hay al menos uno activo */}
                            {hasTamanios && cantidadActivos > 0 && (
                                <Badge bg="info" className="ms-2">
                                    {cantidadActivos === 1
                                        ? "Tamaño único"
                                        : `${cantidadActivos} tamaños`}
                                </Badge>
                            )}
                        </h5>

                        {/* INFO GENERAL */}
                        <ListGroup variant="flush" className="text-start">

                            <ListGroup.Item className="bg-secondary text-white">
                                🏷️ <strong>Categoría:</strong> {categoriaNombre}
                            </ListGroup.Item>

                            <ListGroup.Item className="bg-secondary text-white">
                                📝 <strong>Descripción:</strong> {descripcion}
                            </ListGroup.Item>

                            {/* SIN TAMAÑOS → PRECIO Y STOCK BASE */}
                            {!hasTamanios && (
                                <>
                                    <ListGroup.Item className="bg-secondary text-white">
                                        💰 <strong>Precio:</strong> ${productoSeleccionado.precioBase}
                                    </ListGroup.Item>

                                    <ListGroup.Item className="bg-secondary text-white">
                                        📦 <strong>Stock:</strong> {productoSeleccionado.stock}
                                    </ListGroup.Item>
                                </>
                            )}
                        </ListGroup>
                    </Card.Body>
                </Card>

                {/* 1 SOLO TAMAÑO ACTIVO → CARD ESPECIAL */}
                {hasTamanios && cantidadActivos === 1 && (
                    <Card className="bg-dark text-white mt-3 p-3 border border-success">
                        <h5 className="mb-2">Tamaño único</h5>
                        <p><strong>Nombre:</strong> {tamaniosActivos[0]?.nombreTamanio || "—"}</p>
                        <p><strong>Precio:</strong> ${tamaniosActivos[0]?.precio || 0}</p>
                        <p><strong>Stock:</strong> {tamaniosActivos[0]?.stock || 0}</p>
                    </Card>
                )}

                {/* >1 tamaño → TABLA COMPLETA */}
                {hasTamanios && cantidadActivos > 1 && (
                    <div className="mt-3">
                        <h5 className="text-center mb-3">Tamaños disponibles</h5>
                        <table className="table table-dark table-striped text-center">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tamaniosActivos.map((t, i) => (
                                    <tr key={i}>
                                        <td>{t.nombreTamanio}</td>
                                        <td>${t.precio}</td>
                                        <td>{t.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="text-center mt-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default VerProductoModal;


// viejo modal ver producto
// import { Modal, ListGroup, Card, Button } from 'react-bootstrap'
// import { useProductosStore } from '../../store/useProductosStore';

// const VerProductoModal = ({ show, onClose }) => {
//     const { productoSeleccionado } = useProductosStore();

//     if (!productoSeleccionado) return null;

//     return (
//         <Modal show={show} onHide={onClose} centered backdrop="static">
//             <Modal.Header closeButton className="bg-dark text-white">
//                 <Modal.Title>#{productoSeleccionado.idProducto}: {productoSeleccionado.nombreProducto}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body className="bg-dark text-white">
//                 <Card className="bg-dark text-white text-center border-0">
//                     <Card.Body>
//                         <img
//                             src={productoSeleccionado.imagenProducto}
//                             alt={productoSeleccionado.nombreProducto}
//                             className="mx-auto d-block"
//                             style={{
//                                 maxHeight: "200px",
//                                 objectFit: "cover",
//                                 borderRadius: "10px",
//                                 marginBottom: "10px"
//                             }}
//                         />
//                         <ListGroup variant="flush">
//                             <ListGroup.Item className="bg-secondary text-white">Precio: ${productoSeleccionado.precioProducto}</ListGroup.Item>
//                             <ListGroup.Item className="bg-secondary text-white">Cantidad en stock: {productoSeleccionado.stockProducto}</ListGroup.Item>
//                             <ListGroup.Item className="bg-secondary text-white">Categoria: {productoSeleccionado.categoriaProducto}</ListGroup.Item>
//                             <ListGroup.Item className="bg-secondary text-white">Dminesiones: {productoSeleccionado.dimensionProducto}</ListGroup.Item>
//                             <ListGroup.Item className="bg-secondary text-white">Descripción: {productoSeleccionado.descripcionProducto}</ListGroup.Item>
//                         </ListGroup>
//                     </Card.Body>
//                 </Card>
//                 <Button variant='secondary' onClick={onClose} style={{ display: "block", margin: "auto" }}>Cerrar</Button>
//             </Modal.Body>
//         </Modal>
//     )
// }

// export default VerProductoModal

// // OPCION 2 DE MODAL
// // import Modal from "react-bootstrap/Modal";
// // import Button from "react-bootstrap/Button";
// // import { useProductosStore } from "../../store/useProductosStore.js";

// // const VerProductoModal = ({ show, onClose }) => {
// //     const { productoSeleccionado } = useProductosStore();

// //     if (!productoSeleccionado) return null; // Si no hay producto, no renderiza nada

// //     return (
// //         <Modal show={show} onHide={onClose} centered>
// //             <Modal.Header closeButton>
// //                 <Modal.Title>Detalles del producto</Modal.Title>
// //             </Modal.Header>
// //             <Modal.Body>
// //                 <img
// //                     src={productoSeleccionado.imagenProducto}
// //                     alt={productoSeleccionado.nombreProducto}
// //                     className="mx-auto d-block"
// //                     style={{
// //                         maxHeight: "200px",
// //                         objectFit: "cover",
// //                         borderRadius: "10px",
// //                         marginBottom: "10px"
// //                     }}
// //                 />
// //                 <p><strong>ID:</strong> {productoSeleccionado.idProducto}</p>
// //                 <p><strong>Nombre:</strong> {productoSeleccionado.nombreProducto}</p>
// //                 <p><strong>Descripción:</strong> {productoSeleccionado.descripcionProducto}</p>
// //                 <p><strong>Precio:</strong> ${productoSeleccionado.precioProducto}</p>
// //                 <p><strong>Stock:</strong> {productoSeleccionado.stockProducto}</p>
// //                 <p><strong>Categoría:</strong> {productoSeleccionado.categoriaProducto}</p>
// //                 <p><strong>Dimensiones:</strong> {productoSeleccionado.dimensionProducto}</p>
// //             </Modal.Body>
// //             <Modal.Footer>
// //                 <Button variant="secondary" onClick={onClose}>
// //                     Cerrar
// //                 </Button>
// //             </Modal.Footer>
// //         </Modal>
// //     );
// // };

// // export default VerProductoModal;
