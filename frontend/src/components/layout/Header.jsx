import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Collapse } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "../../styles/components/header.css";
import { useAuthStore } from "../../store/authStore.js";
import { useUIStore } from "../../store/uiStore.js"
import { useCarritoStore } from "../../store/carritoStore.js"

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false)
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
    setProfileExpanded(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
        setProfileExpanded(false);
      }
    };

    if (expanded || profileExpanded) {
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
  }, [expanded, profileExpanded]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) {
        setProfileExpanded(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navItem = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15,
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
        onToggle={(nextExpanded) => {
          setExpanded(nextExpanded);
          if (profileExpanded) setProfileExpanded(false);
        }}
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
            <button
              type="button"
              className="icon-link btn btn-link p-0 border-0 d-lg-none"
              onClick={() => {
                setProfileExpanded((prev) => {
                  const next = !prev;
                  if (next) setExpanded(false);
                  return next;
                });
              }}
              aria-expanded={profileExpanded}
            >
              <FaUserCircle size={22} />
            </button>
            <div className="d-none d-lg-flex align-items-center">
              <NavDropdown
                align="end"
                id="perfil-dropdown-desktop"
                className="perfil-dropdown-desktop"
                title={<FaUserCircle size={22} />}
              >
                {user ? (
                  <>
                    <NavDropdown.Item as={NavLink} to="/miPerfil">
                      Mi perfil
                    </NavDropdown.Item>
                    {(user?.rol === "admin" || user?.rol === "empleado") && (
                      <NavDropdown.Item as={NavLink} to="/admin">
                        Admin
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Cerrar sesión
                    </NavDropdown.Item>
                  </>
                ) : (
                  <NavDropdown.Item as={NavLink} to="/login">
                    Iniciar sesión
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </div>
          </div>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="order-lg-3"
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
                  style={{ display: "inline-block" }}
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
          <Collapse in={profileExpanded} mountOnEnter unmountOnExit>
            <div className="navbar-collapse d-lg-none">
              <Nav className="mx-auto flex-column text-center mt-3">
                {user ? (
                  <>
                    <NavLink
                      to="/miPerfil"
                      className="nav-link"
                      onClick={() => setProfileExpanded(false)}
                    >
                      Mi perfil
                    </NavLink>
                    {(user?.rol === "admin" || user?.rol === "empleado") && (
                      <NavLink
                        to="/admin"
                        className="nav-link"
                        onClick={() => setProfileExpanded(false)}
                      >
                        Admin
                      </NavLink>
                    )}
                    <button
                      type="button"
                      className="nav-link btn btn-link p-0"
                      onClick={handleLogout}
                      style={{ textDecoration: "none" }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="nav-link"
                    onClick={() => setProfileExpanded(false)}
                  >
                    Iniciar sesión
                  </NavLink>
                )}
              </Nav>
            </div>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
