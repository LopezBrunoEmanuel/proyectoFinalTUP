import { useEffect, useState } from 'react';
import { useProductosStore } from '../store/useProductosStore';
import "../styles/producto-card.css"
import Aside from '../components/ui/Aside';
import MostrarProductos from '../components/ui/MostrarProductos';
import Paginador from '../components/ui/Paginador';

const CatalogoProductos = () => {
  const { productos, fetchProductos } = useProductosStore()
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtrosTemporales, setFiltrosTemporales] = useState({
    busqueda: "",
    categoria: "",
    orden: "",
    soloDisponibles: false
  })
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    busqueda: "",
    categoria: "",
    orden: "",
    soloDisponibles: false
  })

  const productosPorPagina = 12
  const indiceUltimoProducto = paginaActual * productosPorPagina
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina
  const productosFiltrados = productos.filter((prod) => {
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
      ? prod.categoriaProducto === filtrosAplicados.categoria
      : true;

    const coincideDisponibilidad = filtrosAplicados.soloDisponibles
      ? prod.stockProducto > 0
      : true

    return coincideBusqueda && coincideCategoria && coincideDisponibilidad
  })

  const productosOrdenados = [...productosFiltrados]

  if (filtrosAplicados.orden === "az") {
    productosOrdenados.sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto))
  } else if (filtrosAplicados.orden === "precioAsc") {
    productosOrdenados.sort((a, b) => a.precioProducto - b.precioProducto)
  } else if (filtrosAplicados.orden === "precioDesc") {
    productosOrdenados.sort((a, b) => b.precioProducto - a.precioProducto)
  }
  const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina)

  const productosVisibles = productosOrdenados.slice(indicePrimerProducto, indiceUltimoProducto)

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="productos-layout">
      <Aside filtrosTemporales={filtrosTemporales} setFiltrosTemporales={setFiltrosTemporales} filtrosAplicados={filtrosAplicados} setFiltrosAplicados={setFiltrosAplicados} setPaginaActual={setPaginaActual} />
      <div className="productos-main">
        {productosVisibles.length > 0 ? (
          <MostrarProductos productos={productosVisibles} />
        ) : (
          <div className="no-resultados">
            <h5>No se encontraron resultados para tu búsqueda</h5>
            <p>Intentá ajustar tu búsqueda usando los filtros!</p>
          </div>
        )}
        <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} onChangePagina={setPaginaActual} />
      </div>
    </div>
  )
}

export default CatalogoProductos