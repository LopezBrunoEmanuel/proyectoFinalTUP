import { useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { useProductosStore } from "../../store/useProductosStore";
import MostrarProductos from "./MostrarProductos";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { fadeInUp, fadeDelayed, fadeIn, staggerContainer } from "../../animations/variants";
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
    // const destacados = productos.filter((p) => p.stockProducto > 0).slice(0, 4);

    // con esto ahora mostramos 4 productos al azar (1 de cada categoria)
    // a futuro se modificara p/ mostrar los que verdaderamente sean mas relevantes o los que se elijan destacar a proposito
    const obtenerProductoAleatorio = (categoriaId) => {
        const filtrados = productos.filter(
            (p) => p.activo && String(p.idCategoria) === String(categoriaId)
        )

        if (filtrados.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * filtrados.length)
        return filtrados[randomIndex]
    }

    const destacados = [
        obtenerProductoAleatorio(1), //planta
        obtenerProductoAleatorio(2), // maceta 
        obtenerProductoAleatorio(3), // fertilzante
        obtenerProductoAleatorio(4) // herramienta
    ].filter(Boolean) // elimina nulls (si es que una categoria no tiene productos)

    return (
        <section className="home__destacados py-5">
            <Container>
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

                </motion.div>

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

                <motion.div
                    variants={fadeDelayed(0.3)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="home__destacados-boton text-center mt-4"
                >
                    <Button
                        variant="outline-success"
                        size="lg"
                        onClick={() => navigate("/productos")}
                    >
                        Ver más productos <FaArrowRight />
                    </Button>
                </motion.div>
            </Container>
        </section>
    );
};

export default ProductosDestacados;
