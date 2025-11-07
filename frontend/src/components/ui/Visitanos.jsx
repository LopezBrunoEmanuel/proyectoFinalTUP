import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import {
    fadeInUp,
    fadeDelayed,
    staggerContainer,
    scaleIn,
} from "../../animations/variants";
import "../../styles/visitanos.css";

const Visitanos = () => {
    const navigate = useNavigate();

    return (
        <section className="home__visitanos text-center py-5">
            <Container>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="home__visitanos-titulo mb-3"
                        variants={fadeInUp}
                    >
                        🌱 Visitá nuestro vivero y llevate naturaleza a casa
                    </motion.h2>

                    <motion.p
                        className="home__visitanos-texto mb-4"
                        variants={fadeDelayed(0.2)}
                    >
                        Te esperamos con la mejor atención, asesoramiento personalizado y
                        una gran variedad de plantas, macetas y artículos de jardinería.
                    </motion.p>

                    <motion.div variants={scaleIn}>
                        <Button
                            variant="success"
                            size="lg"
                            className="home__visitanos-boton m-2"
                            onClick={() => navigate("/contacto")}
                        >
                            Contactanos <FaWhatsapp />
                        </Button>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
};

export default Visitanos;
