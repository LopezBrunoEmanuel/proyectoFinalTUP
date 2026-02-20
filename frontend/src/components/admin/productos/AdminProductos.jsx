import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Table, Button, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import { FiEye, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiPlus } from "react-icons/fi";
import { useProductosStore } from "../../../store/productosStore";
import { getPrecioMostrar, renderPrecio, getStockMostrar } from "../../../utils/productHelpers";
import { toast } from "../../../utils/alerts";
import Swal from "sweetalert2";
import Paginador from "../../../components/common/Paginador";
import "../../../styles/admin/admin.css";

const AdminProductos = () => {
    const navigate = useNavigate();
    const { productos, loading, fetchProductos, toggleActivo, deleteProducto } = useProductosStore();

    const [filtros, setFiltros] = useState({
        texto: "",
        categoria: "",
        estado: "",
    });

    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 10;

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
        setPaginaActual(1);
    };

    const productosFiltrados = productos.filter((producto) => {
        const coincideTexto =
            !filtros.texto ||
            producto.nombreProducto.toLowerCase().includes(filtros.texto.toLowerCase()) ||
            producto.idProducto.toString().includes(filtros.texto);

        const coincideCategoria = !filtros.categoria || producto.idCategoria?.toString() === filtros.categoria;

        const coincideEstado =
            filtros.estado === "" ||
            (filtros.estado === "activo" && producto.activo) ||
            (filtros.estado === "inactivo" && !producto.activo);

        return coincideTexto && coincideCategoria && coincideEstado;
    });

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;
    const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

    const handleToggle = async (producto) => {
        try {
            await toggleActivo(producto.idProducto);
            toast(
                !producto.activo ? "success" : "warning",
                !producto.activo ? "Producto activado" : "Producto desactivado"
            );
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            toast("error", "Error al cambiar estado del producto");
        }
    };

    const handleEliminar = async (producto) => {
        const result = await Swal.fire({
            title: "¿Eliminar producto?",
            text: `Se eliminará "${producto.nombreProducto}" y todos sus tamaños`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteProducto(producto.idProducto);
            toast("success", "Producto eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            toast("error", "No se pudo eliminar el producto");
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
                <p className="mt-3">Cargando productos...</p>
            </Container>
        );
    }

    return (
        <div className="admin-productos-page">
            <Container fluid className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestión de Productos</h2>
                    <Button variant="success" onClick={() => navigate("/admin/productos/nuevo")}>
                        <FiPlus className="me-2" />
                        Nuevo Producto
                    </Button>
                </div>

                <Card className="mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Buscar</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="texto"
                                        value={filtros.texto}
                                        onChange={handleFiltroChange}
                                        placeholder="Nombre o ID..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Categoría</Form.Label>
                                    <Form.Select name="categoria" value={filtros.categoria} onChange={handleFiltroChange}>
                                        <option value="">Todas</option>
                                        <option value="1">Plantas</option>
                                        <option value="2">Macetas</option>
                                        <option value="3">Fertilizantes</option>
                                        <option value="4">Herramientas</option>
                                        <option value="5">Otros</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select name="estado" value={filtros.estado} onChange={handleFiltroChange}>
                                        <option value="">Todos</option>
                                        <option value="activo">Activos</option>
                                        <option value="inactivo">Inactivos</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body className="p-0">
                        <Table hover responsive className="mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Categoría</th>
                                    <th>Tamaños</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosPaginados.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted">
                                            No hay productos que coincidan con los filtros
                                        </td>
                                    </tr>
                                ) : (
                                    productosPaginados.map((producto) => (
                                        <tr key={producto.idProducto}>
                                            <td>#{producto.idProducto}</td>
                                            <td>
                                                <strong>{producto.nombreProducto}</strong>
                                                {producto.destacado && (
                                                    <Badge bg="warning" text="dark" className="ms-2">
                                                        Destacado
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="text-success">
                                                <strong>{renderPrecio(getPrecioMostrar(producto))}</strong>
                                            </td>
                                            <td>{getStockMostrar(producto)}</td>
                                            <td>{producto.categoriaNombre || "-"}</td>
                                            <td>
                                                {producto.tamanios?.length > 0 ? (
                                                    <span>
                                                        {producto.tamanios.length === 1
                                                            ? producto.tamanios[0].nombreTamanio
                                                            : `${producto.tamanios.length} tamaños`}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg={producto.activo ? "success" : "secondary"}>
                                                    {producto.activo ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => navigate(`/admin/productos/${producto.idProducto}`)}
                                                        title="Ver detalle"
                                                    >
                                                        <FiEye />
                                                    </Button>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => navigate(`/admin/productos/${producto.idProducto}/editar`)}
                                                        title="Editar"
                                                    >
                                                        <FiEdit2 />
                                                    </Button>
                                                    <Button
                                                        variant={producto.activo ? "outline-warning" : "outline-success"}
                                                        size="sm"
                                                        onClick={() => handleToggle(producto)}
                                                        title={producto.activo ? "Desactivar" : "Activar"}
                                                    >
                                                        {producto.activo ? <FiToggleRight /> : <FiToggleLeft />}
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleEliminar(producto)}
                                                        title="Eliminar"
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Paginador
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onChangePagina={setPaginaActual}
                />

                <div className="mt-3 text-center text-muted">
                    <small>
                        Mostrando {indiceInicio + 1} - {Math.min(indiceFin, productosFiltrados.length)} <br /> de {productosFiltrados.length} productos
                        {productosFiltrados.length !== productos.length && ` (${productos.length} totales)`}
                    </small>
                </div>
            </Container>
        </div>
    );
};

export default AdminProductos;