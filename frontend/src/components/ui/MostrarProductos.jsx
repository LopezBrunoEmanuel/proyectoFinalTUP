import { useState } from 'react';
import { Card, Col, Row, Button, Form } from 'react-bootstrap';
import "../../styles/producto-card.css"
import { useCarritoStore } from "../../store/useCarritoStore"
import VerProductoModal from '../modals/VerProductoModal';
import ViewButton from '../buttons/ViewButton';
import img from "../../assets/imgcarrusel2.jpg"

const MostrarProductos = ({ productos }) => {
    // const [showVerModal, setShowVerModal] = useState(false)
    const [cantidades, setCantidades] = useState({})

    // const handleOpenShowModal = () => setShowVerModal(true)
    // const handleCloseVerModal = () => setShowVerModal(false)
    const { agregarAlCarrito } = useCarritoStore()

    const handleCambiarCantidad = (idProducto, accion, stock) => {
        setCantidades((prev) => {
            const actual = prev[idProducto] || 0;
            if (accion === "sumar" && actual < stock) return { ...prev, [idProducto]: actual + 1 }
            if (accion === "restar" && actual > 0) return { ...prev, [idProducto]: actual - 1 }
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
                        <Card className={`producto-card shadow-sm h-100 d-flex flex-column justify-content-between ${prod.stockProducto === 0 ? "sin-stock" : ""}`}>

                            {/* IMAGEN */}
                            <Card.Img
                                variant="top"
                                src={img}
                                alt={prod.nombreProducto}
                                className="card-img-top"
                            />

                            {/* BODY */}
                            <Card.Body className="text-center d-flex flex-column align-items-center justify-content-between flex-grow-1">
                                {/* NOMBRE */}
                                <Card.Title className="fw-semibold mb-2 nombre-producto">
                                    {prod.nombreProducto}
                                </Card.Title>

                                {/* PRECIO */}
                                <p className="fw-bold mb-1 precio-producto">
                                    ${prod.precioProducto}
                                </p>

                                {/* STOCK */}
                                <p className="text-muted small mb-1 stock-producto">
                                    Stock: {prod.stockProducto}
                                </p>

                                {/* CATEGORÍA */}
                                {/* <p className="text-muted small categoria-text mb-3">
                                    {"- " + prod.categoriaProducto.charAt(0).toUpperCase() + prod.categoriaProducto.slice(1) + " -"}
                                </p> */}

                                {/* BOTONES */}
                                <div className="botones-cards d-flex justify-content-center align-items-center flex-wrap gap-2">
                                    {/* 🔍 Ver producto */}
                                    {/* <ViewButton producto={prod} onOpenModal={handleOpenShowModal} /> */}

                                    {/* 🔢 Cantidad */}
                                    <div className="cantidad-container d-flex align-items-center gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleCambiarCantidad(prod.idProducto, "restar", prod.stockProducto)}
                                            disabled={prod.stockProducto === 0 || (cantidades[prod.idProducto] || 0) <= 0}
                                        >
                                            -
                                        </Button>

                                        <Form.Control
                                            type="number"
                                            className="cantidad-input"
                                            value={cantidades[prod.idProducto] ?? 0}
                                            min={0}
                                            max={prod.stockProducto}
                                            onChange={(e) => {
                                                let nuevaCantidad = parseInt(e.target.value) || 0;
                                                if (nuevaCantidad < 0) nuevaCantidad = 0;
                                                if (nuevaCantidad > prod.stockProducto) nuevaCantidad = prod.stockProducto;
                                                setCantidades((prev) => ({ ...prev, [prod.idProducto]: nuevaCantidad }));
                                            }}
                                        // disabled={prod.stockProducto === 0}
                                        />

                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleCambiarCantidad(prod.idProducto, "sumar", prod.stockProducto)}
                                            disabled={prod.stockProducto === 0 || (cantidades[prod.idProducto] || 1) >= prod.stockProducto}
                                        >
                                            +
                                        </Button>
                                    </div>

                                    {/* 🛒 Agregar al carrito */}
                                    <Button
                                        className='btn-agregar'
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleAgregarAlCarrito(prod)}
                                        disabled={prod.stockProducto === 0 || !cantidades[prod.idProducto] || (cantidades[prod.idProducto]) < 1}
                                    >
                                        Agregar al carrito
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>


                    </Col>
                ))}
            </Row>
            {/* <VerProductoModal show={showVerModal} onClose={handleCloseVerModal} /> */}
        </div>
    )
}

export default MostrarProductos