import { Modal, ListGroup, Card, Button, Badge } from "react-bootstrap";
import { useProductosStore } from "../../store/useProductosStore";
import "../../styles/crud-modals.css"

const VerProductoModal = ({ show, onClose }) => {

    const { productoSeleccionado } = useProductosStore();

    // 🛑 Si no hay producto seleccionado, no renderizamos nada
    if (!productoSeleccionado) return null;

    // 🖼 Imagen
    const imagenSrc =
        productoSeleccionado.imagenPrincipal?.trim()
            ? productoSeleccionado.imagenPrincipal
            : "/placeholder.png";

    // 📝 Descripción
    const descripcion =
        productoSeleccionado.descripcionProducto || "Sin descripción";

    // 📦 Categorías estáticas
    const categorias = {
        1: "Planta",
        2: "Maceta",
        3: "Fertilizante",
        4: "Herramienta",
        5: "Otro",
    };

    const categoriaNombre = categorias[productoSeleccionado.idCategoria] || "Desconocida";

    // 🟦 Tamaños seguros
    const tamanios = Array.isArray(productoSeleccionado.tamanios)
        ? productoSeleccionado.tamanios
        : [];

    // 🟦 Filtrar solo tamaños activos
    const tamaniosActivos = tamanios.filter(t =>
        t ? (("activo" in t) ? Boolean(Number(t.activo)) : true) : false
    );

    const hasTamanios = productoSeleccionado.tieneTamanios;
    const cantidadActivos = tamaniosActivos.length;

    // 🟩 Tamaño único real
    const tamanioUnico = hasTamanios && cantidadActivos === 1
        ? tamaniosActivos[0]
        : null;

    // Mostrar tamaño único solo si tiene algún dato útil
    const debeMostrarTamanioUnico =
        !!tamanioUnico &&
        (
            (tamanioUnico.nombreTamanio && tamanioUnico.nombreTamanio.trim() !== "") ||
            (tamanioUnico.precio != null && tamanioUnico.precio !== 0) ||
            (tamanioUnico.stock != null && tamanioUnico.stock !== 0)
        );

    // 🟦 Filtrar tamaños que realmente tienen datos válidos
    const tamaniosConDatos = hasTamanios
        ? tamaniosActivos.filter(t =>
            (t.nombreTamanio && t.nombreTamanio.trim() !== "") ||
            (t.precio != null && t.precio !== 0) ||
            (t.stock != null && t.stock !== 0)
        )
        : [];

    // Mostrar tabla solo si hay más de 1 tamaño con datos
    const debeMostrarTablaTamanios =
        hasTamanios && tamaniosConDatos.length > 1;

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

                            {Boolean(hasTamanios) && cantidadActivos > 0 && (
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

                            {/* SIN TAMAÑOS → PRECIO y STOCK del producto base */}
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

                {/* 🟩 BLOQUE: Tamaño único */}
                {debeMostrarTamanioUnico && (
                    <Card className="bg-dark text-white mt-3 p-3 border border-success">
                        <h5 className="mb-2">Tamaño único</h5>

                        {tamanioUnico.nombreTamanio && (
                            <p><strong>Nombre:</strong> {tamanioUnico.nombreTamanio}</p>
                        )}

                        {tamanioUnico.precio != null && tamanioUnico.precio !== 0 && (
                            <p><strong>Precio:</strong> ${tamanioUnico.precio}</p>
                        )}

                        {tamanioUnico.stock != null && tamanioUnico.stock !== 0 && (
                            <p><strong>Stock:</strong> {tamanioUnico.stock}</p>
                        )}
                    </Card>
                )}

                {/* 🟦 BLOQUE: Tabla de múltiples tamaños */}
                {Boolean(debeMostrarTablaTamanios) && (
                    <div className="mt-3">
                        <h5 className="text-center mb-3">Tamaños disponibles</h5>

                        <table className="table table-dark table-striped text-center">
                            <thead>
                                <tr>
                                    {tamaniosConDatos.some(t => t.nombreTamanio) && <th>Nombre</th>}
                                    {tamaniosConDatos.some(t => t.precio != null && t.precio !== 0) && <th>Precio</th>}
                                    {tamaniosConDatos.some(t => t.stock != null && t.stock !== 0) && <th>Stock</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {tamaniosConDatos.map((t, i) => (
                                    <tr key={i}>
                                        {t.nombreTamanio && <td>{t.nombreTamanio}</td>}
                                        {(t.precio != null && t.precio !== 0) && <td>${t.precio}</td>}
                                        {(t.stock != null && t.stock !== 0) && <td>{t.stock}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* BOTÓN CERRAR */}
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
