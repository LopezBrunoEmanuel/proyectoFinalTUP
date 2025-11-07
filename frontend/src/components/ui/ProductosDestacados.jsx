import { useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { useProductosStore } from "../../store/useProductosStore";
import MostrarProductos from "./MostrarProductos";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
    fadeInUp,
    fadeDelayed,
    fadeIn,
    staggerContainer,
} from "../../animations/variants";
import "../../styles/productos-destacados.css";

const ProductosDestacados = () => {
    const { productos, fetchProductos } = useProductosStore();
    const navigate = useNavigate();

    // Trae productos al montar si aún no están cargados
    useEffect(() => {
        if (productos.length === 0) {
            fetchProductos();
        }
    }, [productos, fetchProductos]);

    // Solo mostramos los primeros 4 productos disponibles
    const destacados = productos.filter((p) => p.stockProducto > 0).slice(0, 4);

    return (
        <section className="home__destacados py-5">
            <Container>
                {/* 🌿 Título y descripción */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-4"
                >
                    <motion.h2
                        className="home__destacados-titulo"
                        variants={fadeInUp}
                    >
                        Productos destacados
                    </motion.h2>

                    <motion.p
                        className="home__destacados-texto"
                        variants={fadeDelayed(0.2)}
                    >
                        Una selección de nuestras plantas y accesorios más elegidos 🌿
                    </motion.p>
                </motion.div>

                {/* 🌱 Lista de productos */}
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {destacados.length > 0 ? (
                        <Row className="justify-content-center">
                            <MostrarProductos productos={destacados} />
                        </Row>
                    ) : (
                        <p className="text-center text-muted">
                            No hay productos destacados por el momento.
                        </p>
                    )}
                </motion.div>

                {/* 🌸 Botón de acción */}
                <motion.div
                    variants={fadeDelayed(0.3)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mt-4"
                >
                    <Button
                        variant="outline-success"
                        size="lg"
                        onClick={() => navigate("/productos")}
                    >
                        Ver todos los productos
                    </Button>
                </motion.div>
            </Container>
        </section>
    );
};

export default ProductosDestacados;
