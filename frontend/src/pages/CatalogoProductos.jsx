import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useProductosStore } from "../store/useProductosStore";
import "../styles/producto-card.css";
import Aside from "../components/ui/Aside";
import MostrarProductos from "../components/ui/MostrarProductos";
import Paginador from "../components/ui/Paginador";

const CatalogoProductos = () => {
  const { productos, fetchProductos } = useProductosStore();

  const [paginaActual, setPaginaActual] = useState(1);
  const [filtrosTemporales, setFiltrosTemporales] = useState({
    busqueda: "",
    categoria: "",
    orden: "",
    soloDisponibles: false,
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    busqueda: "",
    categoria: "",
    orden: "",
    soloDisponibles: false,
  });

  const location = useLocation();

  const productosPorPagina = 12;

  /* -----------------------------------------------------------
     🔍 Obtener STOCK TOTAL DEL PRODUCTO
  ----------------------------------------------------------- */
  const getStockTotal = (prod) => {
    if (prod.tieneTamanios && Array.isArray(prod.tamanios)) {
      return prod.tamanios
        .filter((t) => Number(t.activo) === 1)
        .reduce((acc, t) => acc + Number(t.stock || 0), 0);
    }
    return Number(prod.stock || 0);
  };

  /* -----------------------------------------------------------
     💰 Obtener precio base para ORDENAMIENTO POR PRECIO
  ----------------------------------------------------------- */
  const getPrecioBaseOrden = (prod) => {
    if (!prod.tieneTamanios || !Array.isArray(prod.tamanios)) {
      return Number(prod.precioBase);
    }

    const tamaniosActivos = prod.tamanios.filter((t) => Number(t.activo) === 1);

    if (tamaniosActivos.length === 0) return Number(prod.precioBase);

    return Math.min(...tamaniosActivos.map((t) => Number(t.precio)));
  };

  /* -----------------------------------------------------------
     🔎 FILTRADOS
  ----------------------------------------------------------- */
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const activo = prod.activo === 1 || prod.activo === true;

      const coincideBusqueda = filtrosAplicados.busqueda
        ? prod.nombreProducto
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            filtrosAplicados.busqueda
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
        : true;

      const coincideCategoria = filtrosAplicados.categoria
        ? String(prod.idCategoria) === filtrosAplicados.categoria
        : true;

      const coincideDisponibilidad = filtrosAplicados.soloDisponibles
        ? getStockTotal(prod) > 0
        : true;

      return activo && coincideBusqueda && coincideCategoria && coincideDisponibilidad;
    });
  }, [productos, filtrosAplicados]);

  /* -----------------------------------------------------------
     📦 ORDENAMIENTO
  ----------------------------------------------------------- */
  const productosOrdenados = useMemo(() => {
    const arr = [...productosFiltrados];

    if (filtrosAplicados.orden === "az") {
      arr.sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto));
    } else if (filtrosAplicados.orden === "precioAsc") {
      arr.sort((a, b) => getPrecioBaseOrden(a) - getPrecioBaseOrden(b));
    } else if (filtrosAplicados.orden === "precioDesc") {
      arr.sort((a, b) => getPrecioBaseOrden(b) - getPrecioBaseOrden(a));
    }

    return arr;
  }, [productosFiltrados, filtrosAplicados.orden]);

  /* -----------------------------------------------------------
     📄 PAGINACIÓN
  ----------------------------------------------------------- */
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

  const productosVisibles = productosOrdenados.slice(indicePrimero, indiceUltimo);

  /* -----------------------------------------------------------
     🔄 FETCH INICIAL
  ----------------------------------------------------------- */
  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -----------------------------------------------------------
     🟢 CATEGORÍA DESDE EL HOME
  ----------------------------------------------------------- */
  useEffect(() => {
    if (location.state?.categoria) {
      const categoria = location.state.categoria;
      setFiltrosTemporales((prev) => ({ ...prev, categoria }));
      setFiltrosAplicados((prev) => ({ ...prev, categoria }));
      setPaginaActual(1);
    }
  }, [location.state]);

  /* -----------------------------------------------------------
     ↥ Scroll al subir
  ----------------------------------------------------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="productos-layout">
      <Aside
        filtrosTemporales={filtrosTemporales}
        setFiltrosTemporales={setFiltrosTemporales}
        filtrosAplicados={filtrosAplicados}
        setFiltrosAplicados={setFiltrosAplicados}
        setPaginaActual={setPaginaActual}
      />

      <div className="productos-main">
        {productosVisibles.length > 0 ? (
          <MostrarProductos productos={productosVisibles} />
        ) : (
          <div className="no-resultados">
            <h5>No se encontraron resultados para tu búsqueda</h5>
            <p>Intentá ajustar tu búsqueda usando los filtros</p>
          </div>
        )}

        <Paginador
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onChangePagina={setPaginaActual}
        />
      </div>
    </div>
  );
};

export default CatalogoProductos;
