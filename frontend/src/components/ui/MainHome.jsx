import { Container, Row, Col, Button } from "react-bootstrap";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
    fadeInUp,
    fadeDelayed,
    staggerContainer,
    scaleIn,
    // fadeIn,
} from "../../animations/variants";
import "../../styles/main-home.css";

const MainHome = () => {

    return (
        <main className="home__main bg-light">
            {/* 🪴 Sección 1 - Introducción */}
            <section className="home__intro text-center py-5">
                <Container>
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.h2 variants={fadeInUp}>
                            Bienvenido a Patio 1220
                        </motion.h2>
                        <motion.p variants={fadeDelayed(0.2)}>
                            Donde cada planta cuenta una historia. Ofrecemos productos
                            naturales, asesoramiento profesional y un espacio para que
                            conectes con la naturaleza.
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            {/* 🌿 Sección 2 - Categorías destacadas */}
            <section className="home__categorias py-5">
                <Container>
                    <motion.h3
                        className="text-center mb-5 fw-semibold"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Categorías destacadas
                    </motion.h3>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Row className="g-4 justify-content-center">
                            {[
                                {
                                    nombre: "Plantas",
                                    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
                                },
                                {
                                    nombre: "Macetas",
                                    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
                                },
                                {
                                    nombre: "Fertilizantes",
                                    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
                                },
                                {
                                    nombre: "Herramientas",
                                    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
                                },
                            ].map((cat, i) => (
                                <Col xs={12} sm={6} md={3} key={i}>
                                    <motion.div
                                        className="home__categoria-card shadow-sm rounded overflow-hidden"
                                        variants={scaleIn}
                                    >
                                        <div
                                            className="home__categoria-img"
                                            style={{
                                                backgroundImage: `url(${cat.img})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                height: "180px",
                                            }}
                                        ></div>
                                        <div className="text-center py-3 bg-white">
                                            <h5 className="fw-semibold">{cat.nombre}</h5>
                                        </div>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                </Container>
            </section>

            {/* 🌻 Sección 3 - Beneficios */}
            <section className="home__beneficios py-5 bg-white">
                <Container>
                    <motion.h3
                        className="text-center mb-5 fw-semibold"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        ¿Por qué elegirnos?
                    </motion.h3>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Row className="g-4">
                            {[
                                {
                                    titulo: "Atención personalizada",
                                    desc: "Te ayudamos a elegir las plantas ideales para tu hogar o jardín.",
                                    icono: "🌼",
                                },
                                {
                                    titulo: "Productos de calidad",
                                    desc: "Seleccionamos cuidadosamente cada especie y accesorio.",
                                    icono: "🌿",
                                },
                                {
                                    titulo: "Envíos a domicilio",
                                    desc: "Llevamos la naturaleza directamente hasta tu puerta.",
                                    icono: "🚚",
                                },
                            ].map((item, i) => (
                                <Col xs={12} md={4} key={i}>
                                    <motion.div
                                        className="home__beneficio-card text-center p-4 rounded shadow-sm h-100"
                                        variants={fadeInUp}
                                    >
                                        <div className="home__beneficio-icono fs-1 mb-3">
                                            {item.icono}
                                        </div>
                                        <h5 className="fw-semibold mb-2">{item.titulo}</h5>
                                        <p className="text-muted">{item.desc}</p>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                </Container>
            </section>
        </main>
    );
};

export default MainHome;
