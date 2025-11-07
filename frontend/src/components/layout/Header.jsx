import { useState, useEffect, useRef } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "../../styles/header.css";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
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
              <Nav.Link href="/productos" onClick={() => setExpanded(false)}>
                Productos
              </Nav.Link>
              <Nav.Link href="/servicios" onClick={() => setExpanded(false)}>
                Servicios
              </Nav.Link>
              <Nav.Link href="/tips" onClick={() => setExpanded(false)}>
                Tips y cuidados
              </Nav.Link>
              <Nav.Link
                href="/sobreNosotros"
                onClick={() => setExpanded(false)}
              >
                Sobre Nosotros
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
