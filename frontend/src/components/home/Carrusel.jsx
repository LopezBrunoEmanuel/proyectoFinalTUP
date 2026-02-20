// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../../assets/images/carrusel/imgcarrusel1.jpg";
import img2 from "../../assets/images/carrusel/imgcarrusel2.jpg";
import img3 from "../../assets/images/carrusel/imgcarrusel3.jpg";
import "../../styles/components/carrusel.css";
import { fadeInUp, fadeInDown } from "../../animations/variants.js";

const Carrusel = () => {
    const slides = [
        {
            src: img1,
            title: "Paisajismo",
            text: "Diseñamos espacios verdes únicos.",
        },
        {
            src: img2,
            title: "Plantas",
            text: "Cuidamos la naturaleza en tu hogar.",
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
                        <div className="home__carrusel-slide">
                            <motion.img
                                className="d-block w-100 home__carrusel-img"
                                src={item.src}
                                alt={item.title}
                            />
                        </div>

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
