import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductoCard from './ProductoCard.jsx';
import Carrito from "../carrito/Carrito.jsx"

const ProductosList = ({ productos }) => {
    const [showCarrito, setShowCarrito] = useState(false);

    const handleOpenCarrito = () => setShowCarrito(true);
    const handleCloseCarrito = () => setShowCarrito(false);

    return (
        <div className="cards-container">

            <Carrito show={showCarrito} handleClose={handleCloseCarrito} />

            <Row xs={2} sm={2} md={3} lg={4} className="g-4">
                {productos.map((prod) => (
                    <Col key={prod.idProducto}>
                        <ProductoCard
                            prod={prod}
                            onAgregar={handleOpenCarrito}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductosList;