import { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useProductosStore } from "../store/useProductosStore.js";
import "../styles/admin.css"
import { toast } from "./utils/alerts";
import ViewButton from "./buttons/ViewButton";
import EditButton from "./buttons/EditButton";
import DeleteButton from "./buttons/DeleteButton";
import AddNewButton from "./buttons/AddNewButton";
import VerProductoModal from "./modals/VerProductoModal";
import EditarProductoModal from "./modals/EditarProductoModal";
import AgregarProductoModal from "./modals/AgregarProductoModal.jsx";
import Paginador from "./ui/Paginador.jsx";

const CrudProductos = () => {
    const {
        productos,
        fetchProductos,
        isLoading,
        error,
        toggleActivo,
        filtros,
        setFiltroTexto,
        setFiltroCategoria,
        setFiltroEstado,
        setOrden,
        resetFiltros,
        paginaActual,
        productosPorPagina,
        setPaginaActual,
        resetPaginacion,
        clearProductoSeleccionado,
        setProductoSeleccionado,
    } = useProductosStore();

    const [showAddModal, setShowAddModal] = useState(false);
    const [modalActivo, setModalActivo] = useState(null);

    const handleOpenAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleAddSuccess = () => { toast("success", "Producto cargado exitosamente"); resetPaginacion() };

    const productosFiltrados = productos.filter((p) => {
        const texto = filtros.texto.toLowerCase();
        const coincideTexto =
            p.nombreProducto?.toLowerCase().includes(texto) ||
            p.descripcionProducto?.toLowerCase().includes(texto);

        const coincideCategoria =
            filtros.categoria === "todos" ||
            String(p.idCategoria) === filtros.categoria;

        const coincideEstado =
            filtros.estado === "todos" ||
            (filtros.estado === "activos" && p.activo) ||
            (filtros.estado === "inactivos" && !p.activo);

        return coincideTexto && coincideCategoria && coincideEstado;
    });

    const productosOrdenados = [...productosFiltrados].sort((a, b) => {
        const A = a[filtros.sortKey];
        const B = b[filtros.sortKey];
        if (A == null && B != null) return -1;
        if (A != null && B == null) return 1;
        if (A == null && B == null) return 0;

        if (typeof A === "string") {
            return filtros.sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        } else {
            return filtros.sortDir === "asc" ? A - B : B - A;
        }
    });

    // 🧮 Paginación
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;
    const productosPaginados = productosOrdenados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

    const getStockMostrar = (prod) => {
        if (prod.tieneTamanios && Array.isArray(prod.tamanios) && prod.tamanios.length) {
            const activos = prod.tamanios.filter(t => t.activo);
            return activos.reduce((acc, t) => acc + Number(t.stock || 0), 0);
        }

        return Number(prod.stock) || 0;
    };


    const getPrecioMostrar = (prod) => {
        if (prod.tieneTamanios && Array.isArray(prod.tamanios) && prod.tamanios.length) {

            // Filtrar SOLO los tamaños activos
            const activos = prod.tamanios.filter(t => t.activo);

            if (activos.length === 0) return "—"; // No hay tamaños activos

            const preciosValidos = activos
                .map(t => Number(t.precio))
                .filter(p => !isNaN(p) && p > 0);

            if (preciosValidos.length === 0) return "—";

            const min = Math.min(...preciosValidos);
            const max = Math.max(...preciosValidos);

            return min === max ? `$${min}` : `Desde $${min} / Hasta $${max}`;
        }

        return `$${prod.precioBase}`;
    };


    const getTamaniosMostrar = (prod) => {
        if (!prod.tieneTamanios) return "Único";

        const activos = Array.isArray(prod.tamanios)
            ? prod.tamanios.filter(t => t.activo)
            : [];

        const cantidad = activos.length;

        if (cantidad === 0) return "—";
        if (cantidad === 1) return "Único";

        return `${cantidad} tamaños`;
    };


    useEffect(() => {
        fetchProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="d-flex justify-content-start align-items-center gap-3 mb-3">
                <h2 className="mb-0">Listado de Productos</h2>
                <AddNewButton onOpenModal={handleOpenAddModal} />
            </div>

            <AgregarProductoModal
                show={showAddModal}
                onClose={handleCloseAddModal}
                onSaveSuccess={handleAddSuccess}
            />
            {/* 🔍 Filtros */}
            <div className="mb-3 p-3 border rounded bg-light">
                <div className="row g-2 align-items-center">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o descripción..."
                            value={filtros.texto}
                            onChange={(e) => setFiltroTexto(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filtros.categoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                        >
                            <option value="todos">Todas las categorías</option>
                            <option value="1">Plantas</option>
                            <option value="2">Macetas</option>
                            <option value="3">Fertilizantes</option>
                            <option value="4">Herramientas</option>
                            <option value="5">Otros</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filtros.estado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activos">Solo activos</option>
                            <option value="inactivos">Solo inactivos</option>
                        </select>
                    </div>

                    <div className="col-md-2 text-md-end text-center mt-2 mt-md-0">
                        <Button variant="outline-secondary" size="sm" onClick={() => { resetFiltros(); resetPaginacion() }}>
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            </div>

            <Table striped bordered hover responsive size="sm">
                <thead className="table-success text-center">
                    <tr>
                        <th role="button" onClick={() => setOrden("idProducto")}>
                            ID{" "}
                            {filtros.sortKey === "idProducto" && (filtros.sortDir === "asc" ? "▲" : "▼")}
                        </th>
                        <th role="button" onClick={() => setOrden("nombreProducto")}>
                            Nombre{" "}
                            {filtros.sortKey === "nombreProducto" &&
                                (filtros.sortDir === "asc" ? "▲" : "▼")}
                        </th>
                        {/* <th>Descripción</th> */}
                        <th role="button" onClick={() => setOrden("precioBase")}>
                            Precio{" "}
                            {filtros.sortKey === "precioBase" && (filtros.sortDir === "asc" ? "▲" : "▼")}
                        </th>
                        <th role="button" onClick={() => setOrden("stock")}>
                            Stock total{" "}
                            {filtros.sortKey === "stock" && (filtros.sortDir === "asc" ? "▲" : "▼")}
                        </th>
                        <th>Categoría</th>
                        <th>Estado</th>
                        <th>Tamaño</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {productosPaginados.map((prod) => (
                        <tr key={prod.idProducto}>
                            <td>{prod.idProducto}</td>
                            <td>{prod.nombreProducto}</td>
                            {/* <td>{prod.descripcionProducto}</td> */}
                            <td>{getPrecioMostrar(prod)}</td>
                            <td>{getStockMostrar(prod)}</td>
                            <td>
                                {prod.categoriaProducto || prod.idCategoria
                                    ? prod.categoriaProducto || `ID ${prod.idCategoria}`
                                    : "Sin categoría"}
                            </td>
                            <td>{prod.activo ? "Activo ✅" : "Inactivo ❌"}</td>
                            <td>{getTamaniosMostrar(prod)}</td>
                            <td>
                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <ViewButton
                                        producto={prod}
                                        onOpenModal={() => {
                                            setProductoSeleccionado(prod);
                                            setModalActivo("ver");
                                        }}
                                    />
                                    <EditButton
                                        producto={prod}
                                        onOpenModal={() => {
                                            setProductoSeleccionado(prod);
                                            setModalActivo("editar");
                                        }}
                                    />

                                    <DeleteButton
                                        idProducto={prod.idProducto}
                                        onDeleteSuccess={() => {
                                            toast("error", "Producto eliminado correctamente");
                                            resetPaginacion();
                                        }}
                                    />

                                    <Button
                                        size="sm"
                                        variant={
                                            prod.activo ? "outline-warning" : "outline-success"
                                        }
                                        onClick={async () => {
                                            try {
                                                const productoActualizado = await toggleActivo(
                                                    prod.idProducto
                                                );
                                                toast(
                                                    productoActualizado.activo
                                                        ? "success"
                                                        : "warning",
                                                    productoActualizado.activo
                                                        ? "Producto activado"
                                                        : "Producto desactivado"
                                                );
                                            } catch (error) {
                                                toast("error", "Error al cambiar estado del producto");
                                                console.log(error);
                                            }
                                        }}
                                    >
                                        {prod.activo ? "Desactivar" : "Activar"}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Paginador
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChangePagina={setPaginaActual}
            />
            <div className="text-center my-2">
                <span className="badge bg-secondary">
                    Página {paginaActual} de {totalPaginas || 1}
                </span>
            </div>
            <VerProductoModal
                show={modalActivo === "ver"}
                onClose={() => {
                    setModalActivo(null);
                    clearProductoSeleccionado();
                }}
            />

            <EditarProductoModal
                show={modalActivo === "editar"}
                onClose={() => {
                    setModalActivo(null);
                    clearProductoSeleccionado();
                }}
            />

        </div>
    );
};

export default CrudProductos;


// viejo componente de crud productos
// import { useState, useEffect } from "react";
// import Table from "react-bootstrap/Table";
// import ViewButton from "./buttons/ViewButton";
// import EditButton from "./buttons/EditButton";
// import DeleteButton from "./buttons/DeleteButton";
// import AddNewButton from "./buttons/AddNewButton";
// import Paginador from "../components/ui/Paginador"
// import { useProductosStore } from "../store/useProductosStore.js";
// import VerProductoModal from "./modals/VerProductoModal"
// import EditarProductoModal from "./modals/EditarProductoModal"
// import AgregarProductoModal from "./modals/AgregarProductoModal.jsx";

// const CrudProductos = () => {
//     const { productos, fetchProductos, isLoading, error } = useProductosStore();
//     const [showVerModal, setShowVerModal] = useState(false) // MODIFICAR DESDE EL BACK LO QUE CAMBIE PARA QUE FUNCIONE, SOLO SE TOCA EL USEEFFECT DE SHOW
//     const [showEditModal, setShowEditModal] = useState(false)
//     const [showAddModal, setShowAddModal] = useState(false)

//     const handleOpenVerModal = () => setShowVerModal(true)
//     const handleCloseVerModal = () => setShowVerModal(false)
//     const handleOpenEditModal = () => setShowEditModal(true)
//     const handleCloseEditModal = () => setShowEditModal(false)
//     const handleOpenAddModal = () => setShowAddModal(true)
//     const handleCloseAddModal = () => setShowAddModal(false)

//     useEffect(() => {
//         fetchProductos()
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     if (isLoading) return <p>Cargando productos...</p>;
//     if (error) return <p>{error}</p>;

//     return (
//         <div>
//             <div className="d-flex justify-content-start gap-3">
//                 <h2 className="mb-3">Listado de Productos</h2>
//                 <AddNewButton onOpenModal={handleOpenAddModal} />
//             </div>
//             <AgregarProductoModal show={showAddModal} onClose={handleCloseAddModal} />
//             <Table striped bordered hover size="sm">
//                 <thead>
//                     <tr>
//                         <th>#ID</th>
//                         <th>Nombre</th>
//                         <th>Descripción</th>
//                         <th>Precio</th>
//                         <th>Stock</th>
//                         <th>Categoría</th>
//                         <th>Dimensiones</th>
//                         <th>Acciones</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {productos.map((prod) => (
//                         <tr key={Number(prod.idProducto)}>
//                             <td>{prod.idProducto}</td>
//                             <td>{prod.nombreProducto}</td>
//                             <td>{prod.descripcionProducto}</td>
//                             <td>${prod.precioProducto}</td>
//                             <td>{prod.stockProducto}</td>
//                             <td>{prod.categoriaProducto}</td>
//                             <td>{prod.dimensionProducto}</td>
//                             <td>
//                                 <div className="d-flex justify-content-center gap-1">
//                                     <ViewButton producto={prod} onOpenModal={handleOpenVerModal} />
//                                     <EditButton producto={prod} onOpenModal={handleOpenEditModal} />
//                                     <DeleteButton idProducto={prod.idProducto} />
//                                 </div>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//             {/* <Paginador /> */}
//             <VerProductoModal show={showVerModal} onClose={handleCloseVerModal} />
//             <EditarProductoModal show={showEditModal} onClose={handleCloseEditModal} />
//         </div>
//     )
// }

// export default CrudProductos