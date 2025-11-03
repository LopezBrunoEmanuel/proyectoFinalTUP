import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ViewButton from "./buttons/ViewButton";
import EditButton from "./buttons/EditButton";
import DeleteButton from "./buttons/DeleteButton";
import AddNewButton from "./buttons/AddNewButton";
import Paginador from "../components/ui/Paginador"
import { useProductosStore } from "../store/useProductosStore.js";
import VerProductoModal from "./modals/VerProductoModal"
import EditarProductoModal from "./modals/EditarProductoModal"
import AgregarProductoModal from "./modals/AgregarProductoModal.jsx";

const CrudProductos = () => {
    const { productos, fetchProductos, isLoading, error } = useProductosStore();
    const [showVerModal, setShowVerModal] = useState(false) // MODIFICAR DESDE EL BACK LO QUE CAMBIE PARA QUE FUNCIONE, SOLO SE TOCA EL USEEFFECT DE SHOW 
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)

    const handleOpenVerModal = () => setShowVerModal(true)
    const handleCloseVerModal = () => setShowVerModal(false)
    const handleOpenEditModal = () => setShowEditModal(true)
    const handleCloseEditModal = () => setShowEditModal(false)
    const handleOpenAddModal = () => setShowAddModal(true)
    const handleCloseAddModal = () => setShowAddModal(false)

    useEffect(() => {
        fetchProductos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="d-flex justify-content-start gap-3">
                <h2 className="mb-3">Listado de Productos</h2>
                <AddNewButton onOpenModal={handleOpenAddModal} />
            </div>
            <AgregarProductoModal show={showAddModal} onClose={handleCloseAddModal} />
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Dimensiones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((prod) => (
                        <tr key={Number(prod.idProducto)}>
                            <td>{prod.idProducto}</td>
                            <td>{prod.nombreProducto}</td>
                            <td>{prod.descripcionProducto}</td>
                            <td>${prod.precioProducto}</td>
                            <td>{prod.stockProducto}</td>
                            <td>{prod.categoriaProducto}</td>
                            <td>{prod.dimensionProducto}</td>
                            <td>
                                <div className="d-flex justify-content-center gap-1">
                                    <ViewButton producto={prod} onOpenModal={handleOpenVerModal} />
                                    <EditButton producto={prod} onOpenModal={handleOpenEditModal} />
                                    <DeleteButton idProducto={prod.idProducto} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* <Paginador /> */}
            <VerProductoModal show={showVerModal} onClose={handleCloseVerModal} />
            <EditarProductoModal show={showEditModal} onClose={handleCloseEditModal} />
        </div>
    )
}

export default CrudProductos