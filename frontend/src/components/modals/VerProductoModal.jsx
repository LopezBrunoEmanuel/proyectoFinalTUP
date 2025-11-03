import { Modal, ListGroup, Card, Button } from 'react-bootstrap'
import { useProductosStore } from '../../store/useProductosStore';

const VerProductoModal = ({ show, onClose }) => {
    const { productoSeleccionado } = useProductosStore();

    if (!productoSeleccionado) return null;

    return (
        <Modal show={show} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>#{productoSeleccionado.idProducto}: {productoSeleccionado.nombreProducto}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <Card className="bg-dark text-white text-center border-0">
                    <Card.Body>
                        <img
                            src={productoSeleccionado.imagenProducto}
                            alt={productoSeleccionado.nombreProducto}
                            className="mx-auto d-block"
                            style={{
                                maxHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                marginBottom: "10px"
                            }}
                        />
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-secondary text-white">Precio: ${productoSeleccionado.precioProducto}</ListGroup.Item>
                            <ListGroup.Item className="bg-secondary text-white">Cantidad en stock: {productoSeleccionado.stockProducto}</ListGroup.Item>
                            <ListGroup.Item className="bg-secondary text-white">Categoria: {productoSeleccionado.categoriaProducto}</ListGroup.Item>
                            <ListGroup.Item className="bg-secondary text-white">Dminesiones: {productoSeleccionado.dimensionProducto}</ListGroup.Item>
                            <ListGroup.Item className="bg-secondary text-white">Descripción: {productoSeleccionado.descripcionProducto}</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
                <Button variant='secondary' onClick={onClose} style={{ display: "block", margin: "auto" }}>Cerrar</Button>
            </Modal.Body>
        </Modal>
    )
}

export default VerProductoModal

// OPCION 2 DE MODAL
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import { useProductosStore } from "../../store/useProductosStore.js";

// const VerProductoModal = ({ show, onClose }) => {
//     const { productoSeleccionado } = useProductosStore();

//     if (!productoSeleccionado) return null; // Si no hay producto, no renderiza nada

//     return (
//         <Modal show={show} onHide={onClose} centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>Detalles del producto</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <img
//                     src={productoSeleccionado.imagenProducto}
//                     alt={productoSeleccionado.nombreProducto}
//                     className="mx-auto d-block"
//                     style={{
//                         maxHeight: "200px",
//                         objectFit: "cover",
//                         borderRadius: "10px",
//                         marginBottom: "10px"
//                     }}
//                 />
//                 <p><strong>ID:</strong> {productoSeleccionado.idProducto}</p>
//                 <p><strong>Nombre:</strong> {productoSeleccionado.nombreProducto}</p>
//                 <p><strong>Descripción:</strong> {productoSeleccionado.descripcionProducto}</p>
//                 <p><strong>Precio:</strong> ${productoSeleccionado.precioProducto}</p>
//                 <p><strong>Stock:</strong> {productoSeleccionado.stockProducto}</p>
//                 <p><strong>Categoría:</strong> {productoSeleccionado.categoriaProducto}</p>
//                 <p><strong>Dimensiones:</strong> {productoSeleccionado.dimensionProducto}</p>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onClose}>
//                     Cerrar
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default VerProductoModal;
