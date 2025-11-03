import { useState } from 'react';
import { Card, Col, Row, Button, Form } from 'react-bootstrap';
import "../../styles/producto-card.css"
import { useCarritoStore } from "../../store/useCarritoStore"
import VerProductoModal from '../modals/VerProductoModal';
import ViewButton from '../buttons/ViewButton';
import img from "../../assets/imgcarrusel2.jpg"

const MostrarProductos = ({ productos }) => {
    const [showVerModal, setShowVerModal] = useState(false)
    const [cantidades, setCantidades] = useState({})

    const handleOpenShowModal = () => setShowVerModal(true)
    const handleCloseVerModal = () => setShowVerModal(false)
    const { agregarAlCarrito } = useCarritoStore()

    const handleCambiarCantidad = (idProducto, accion, stock) => {
        setCantidades((prev) => {
            const actual = prev[idProducto] || 1;
            if (accion === "sumar" && actual < stock) return { ...prev, [idProducto]: actual + 1 }
            if (accion === "restar" && actual > 1) return { ...prev, [idProducto]: actual - 1 }
            return prev;
        })
    }
    const handleAgregarAlCarrito = (prod) => {
        const cantidad = cantidades[prod.idProducto] || 1
        agregarAlCarrito(prod, cantidad)
    }

    return (
        <div className="cards-container">
            <Row xs={2} md={4} className="g-4">
                {productos.map((prod) => (
                    <Col key={prod.idProducto}>
                        <Card className="producto-card shadow-sm h-100">
                            <Card.Img
                                variant="top"
                                src={img}
                                alt={prod.nombreProducto}
                                className="card-img-top"
                            />
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <Card.Title>{prod.nombreProducto}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {prod.categoriaProducto.charAt(0).toUpperCase() +
                                            prod.categoriaProducto.slice(1)}
                                    </Card.Text>
                                    <Card.Text className="fw-bold text-success">
                                        ${prod.precioProducto}
                                    </Card.Text>
                                </div>

                                <div className="botones-cards d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                                    {/* 🔍 Ver producto */}
                                    <ViewButton producto={prod} onOpenModal={handleOpenShowModal} />

                                    <div className="cantidad-container d-flex align-items-center gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleCambiarCantidad(prod.idProducto, "restar", prod.stockProducto)}
                                            disabled={(cantidades[prod.idProducto] || 1) <= 1}
                                        >
                                            −
                                        </Button>

                                        <Form.Control
                                            type="number"
                                            className="cantidad-input"
                                            value={cantidades[prod.idProducto] || 1}
                                            min={1}
                                            max={prod.stockProducto}
                                            onChange={(e) => {
                                                let nuevaCantidad = parseInt(e.target.value) || 1;
                                                if (nuevaCantidad < 1) nuevaCantidad = 1;
                                                if (nuevaCantidad > prod.stockProducto) nuevaCantidad = prod.stockProducto;
                                                setCantidades((prev) => ({ ...prev, [prod.idProducto]: nuevaCantidad }));
                                            }}
                                        />

                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleCambiarCantidad(prod.idProducto, "sumar", prod.stockProducto)}
                                            disabled={(cantidades[prod.idProducto] || 1) >= prod.stockProducto}
                                        >
                                            +
                                        </Button>
                                    </div>


                                    {/* 🛒 Agregar al carrito */}
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleAgregarAlCarrito(prod)}
                                    >
                                        🛒
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <VerProductoModal show={showVerModal} onClose={handleCloseVerModal} />
        </div>
    )
}

export default MostrarProductos