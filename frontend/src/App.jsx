import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CatalogoProductos from "./pages/CatalogoProductos";
import Carrito from "./components/ui/Carrito";
import SobreNosotros from "./pages/SobreNosotros";
import Servicios from "./pages/Servicios";
import Perfil from "./pages/Perfil";
import Error from "./pages/Error";
import Tips from "./pages/Tips";
import "./App.css";
import Admin from "./pages/Admin";
import { useUIStore } from "./store/useUIStore";
import ScrollToTopButton from "./components/buttons/ScrollToTopButton";

function App() {
  const { showCarrito, cerrarCarrito } = useUIStore()
  return (
    <>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos" element={<CatalogoProductos />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/sobreNosotros" element={<SobreNosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/miPerfil" element={<Perfil />} />
          {/* <Route path="/carrito" element={<Carrito />} /> */}
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<Error />} />

          {/* Ruta solo para admin */}
          {/* <Route
            path="/admin/*"
            element={
              <RutaPrivada rolesPermitidos={["admin"]}>
                <Admin />
              </RutaPrivada>
            }
          /> */}
          {/* Ruta solo para empleado */}
          {/* <Route
            path="/empleado"
            element={
              <RutaPrivada rolesPermitidos={["empleado"]}>
                <Empleado />
              </RutaPrivada>
            }
          /> */}
        </Routes>
      </div>
      <Footer />
      <ScrollToTopButton />
      <Carrito show={showCarrito} handleClose={cerrarCarrito} />
    </>
  );
}

export default App;
