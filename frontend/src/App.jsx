import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CatalogoProductos from "./pages/CatalogoProductos";
import Carrito from "./components/ui/Carrito";
import Servicios from "./pages/Servicios";
import MiPerfil from "./pages/MiPerfil";
import Error from "./pages/Error";
import Tips from "./pages/Tips";
import RutaPublica from "./components/rutas/RutaPublica";
import RutaPrivada from "./components/rutas/RutaPrivada";
import "./App.css";
import Admin from "./pages/Admin";
import { useUIStore } from "./store/useUIStore";
import ScrollToTopButton from "./components/buttons/ScrollToTopButton";

function App() {
  const { showCarrito, cerrarCarrito } = useUIStore();
  return (
    <>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <RutaPublica>
                <Login />
              </RutaPublica>
            }
          />
          <Route
            path="/register"
            element={
              <RutaPublica>
                <Register />
              </RutaPublica>
            }
          />
          <Route path="/productos" element={<CatalogoProductos />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/miPerfil" element={<MiPerfil />} />
          <Route path="*" element={<Error />} />

          <Route
            path="/admin"
            element={<RutaPrivada rolesPermitidos={["admin", "empleado"]} />}
          >
            <Route index element={<Admin />} />
          </Route>
        </Routes>
      </div>
      <Footer />
      <ScrollToTopButton />
      <Carrito show={showCarrito} handleClose={cerrarCarrito} />
    </>
  );
}

export default App;
