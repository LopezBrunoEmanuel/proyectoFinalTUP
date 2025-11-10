import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import "../../styles/buttons.css"; // Reutilizamos tus estilos de botones
import "../../styles/scroll-to-top.css"; // archivo solo para posicionamiento

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <button
            className="btn-dorado scroll-to-top"
            onClick={scrollToTop}
            aria-label="Volver arriba"
        >
            <FaArrowUp />
        </button>
    );
};

export default ScrollToTopButton;
