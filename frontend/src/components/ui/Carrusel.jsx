// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../../assets/imgcarrusel1.jpg";
import img2 from "../../assets/imgcarrusel2.jpg";
import img3 from "../../assets/imgcarrusel3.jpg";
import "../../styles/carrusel.css";
import { fadeInUp, fadeInDown } from "../../animations/variants";

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

    // const slides2 = [
    //     {
    //         srcDesktop: img1Desktop,
    //         srcMobile: img1Mobile,
    //         title: "Paisajismo",
    //         text: "Diseñamos espacios verdes únicos.",
    //     },
    //     {
    //         srcDesktop: img2Desktop,
    //         srcMobile: img2Mobile,
    //         title: "Plantas",
    //         text: "Cuidamos la naturaleza en tu hogar."
    //     },
    //     {
    //         srcDesktop: img3Desktop,
    //         srcMobile: img3Mobile,
    //         title: "Jardinería",
    //         text: "Servicios personalizados y asesoramiento.",
    //     }
    // ];


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
                            {/* <picture>
                                <source media="(max-width: 768px)" srcSet={item.srcMobile} />
                                <source media="(min-width: 769px)" srcSet={item.srcDesktop} />
                                <motion.img
                                    className="d-block w-100 home__carrusel-img"
                                    src={item.srcDesktop}
                                    alt={item.title}
                                />
                            </picture> */}
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
