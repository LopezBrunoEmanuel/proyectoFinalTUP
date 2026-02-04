import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { fadeInUp, fadeDelayed, staggerContainer, scaleIn } from "../../animations/variants";
import "../../styles/main-home.css";

const MainHome = () => {
    const navigate = useNavigate();

    return (
        <main className="home__main bg-light">
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

            <section className="home__categorias py-5">
                <Container>
                    <motion.h3
                        className="text-center mb-5 fw-semibold"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Categorías
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
                                    categoria: "1",
                                    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRip7IjQ47SH4_AP2wW8n4LycLV7FmGtODduw&s",
                                },
                                {
                                    nombre: "Macetas",
                                    categoria: "2",
                                    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTU02NOrRTmSRVAVDq5fXPhQ2XVoqeOmhH4w&s",
                                },
                                {
                                    nombre: "Fertilizantes",
                                    categoria: "3",
                                    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4nr1XsOX2GSXp4G24UwjJQM4bjTFul-IuGw&s",
                                },
                                {
                                    nombre: "Herramientas",
                                    categoria: "4",
                                    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpMKE07ZrQ2slIfG6Wd0XXpsa0gIWD--vSYA&s",
                                },
                            ].map((cat, i) => (
                                <Col xs={12} sm={6} md={3} key={i}>
                                    <motion.div
                                        className="home__categoria-card shadow-sm rounded overflow-hidden"
                                        variants={scaleIn}
                                        onClick={() => {
                                            const categoria = cat.categoria; navigate("/productos", { state: { categoria } })
                                        }}
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
                                    titulo: "Crea tu propia huerta",
                                    desc: "Seleccionamos cuidadosamente cada especie y accesorio para vos.",
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
