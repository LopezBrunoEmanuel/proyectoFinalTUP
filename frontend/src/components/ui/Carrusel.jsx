// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../../assets/imgcarrusel1.jpg";
import img2 from "../../assets/imgcarrusel2.jpg";
import img3 from "../../assets/imgcarrusel3.jpg";
import "../../styles/carrusel.css";
import { fadeInUp, fadeInDown, fadeIn } from "../../animations/variants";

const Carrusel = () => {
    const slides = [
        {
            src: img1,
            title: "Plantas",
            text: "Cuidamos la naturaleza en tu hogar.",
        },
        {
            src: img2,
            title: "Paisajismo",
            text: "Diseñamos espacios verdes únicos.",
        },
        {
            src: img3,
            title: "Jardinería",
            text: "Servicios personalizados y asesoramiento.",
        },
    ];

    return (
        <div className="home__carrusel">
            <Carousel fade interval={3500} pause={false}>
                {slides.map((item, index) => (
                    <Carousel.Item key={index}>
                        <motion.img
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            className="d-block w-100 home__carrusel-img"
                            src={item.src}
                            alt={item.title}
                        />

                        {/* Animación coordinada en el texto */}
                        <motion.div
                            className="home__carrusel-caption"
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h3 variants={fadeInDown}>{item.title}</motion.h3>
                            <motion.p variants={fadeInUp}>{item.text}</motion.p>
                        </motion.div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Carrusel;
