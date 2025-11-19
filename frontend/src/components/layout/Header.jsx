import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "../../styles/header.css";
import { useAuthStore } from "../../store/useAuthStore";
import { useUIStore } from "../../store/useUIStore"
import { useCarritoStore } from "../../store/useCarritoStore"

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { abrirCarrito } = useUIStore()
  const { vaciarCarrito } = useCarritoStore()
  const totalItems = useCarritoStore((state) => (state.carrito || []).reduce((acc, item) => acc + (item?.cantidad || 0), 0))

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    vaciarCarrito();
    setExpanded(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [expanded]);

  // Animaciones para cada ítem del menú
  const navItem = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15, // pequeño delay progresivo
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };


  return (
    <div className="header" ref={navbarRef}>
      <Navbar
        expand="lg"
        data-bs-theme="dark"
        className="bg-body-tertiary"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Navbar.Brand href="/">Patio 1220</Navbar.Brand>

          <div className="navbar-icons order-lg-2">
            <div className="cart-icon-container position-relative">
              <button
                type="button"
                className="icon-link btn btn-link p-0 border-0 position-relative"
                onClick={abrirCarrito}
              >
                <FaShoppingCart size={22} />
                {totalItems > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: "0.7rem",
                      minWidth: "18px",
                      minHeight: "18px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {user ? (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Nav.Link href="/miPerfil" className="icon-link">
                <FaUserCircle />
              </Nav.Link>
            )}
          </div>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="order-lg-3"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />

          <Navbar.Collapse id="basic-navbar-nav" className="order-lg-1">
            <Nav className="mx-auto">
              {[
                { to: "/", text: "Inicio" },
                { to: "/productos", text: "Productos" },
                { to: "/servicios", text: "Servicios" },
                { to: "/tips", text: "Tips y cuidados" },
              ].map((item, i) => (
                <motion.div
                  key={item.to}
                  custom={i}
                  variants={navItem}
                  initial="hidden"
                  animate="visible"
                  style={{ display: "inline-block" }} // 🔑 mantiene el layout horizontal
                >
                  <NavLink
                    to={item.to}
                    className="nav-link"
                    onClick={() => setExpanded(false)}
                  >
                    {item.text}
                  </NavLink>
                </motion.div>
              ))}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
