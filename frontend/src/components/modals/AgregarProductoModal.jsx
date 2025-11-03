import { useState } from "react"
import { Modal, Form, Button } from "react-bootstrap"
import { useProductosStore } from "../../store/useProductosStore"

const AgregarProductoModal = ({ show, onClose }) => {
    const { addProducto } = useProductosStore();

    const [formData, setFormData] = useState({
        nombreProducto: "",
        descripcionProducto: "",
        precioProducto: "",
        stockProducto: "",
        categoriaProducto: "",
        imagenProducto: "",
        dimensionProducto: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productoNormalizado = {
            ...formData,
            precioProducto: Number(formData.precioProducto),
            stockProducto: Number(formData.stockProducto)
        }

        try {
            await addProducto(productoNormalizado);
            onClose();
        } catch (error) {
            console.error("Error al agregar el producto: ", error)
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Agregar Nuevo Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombreProducto"
                            value={formData.nombreProducto}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descripcionProducto"
                            value={formData.descripcionProducto}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            type="number"
                            name="precioProducto"
                            value={formData.precioProducto}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="stockProducto"
                            value={formData.stockProducto}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                            name="categoriaProducto"
                            value={formData.categoriaProducto}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar categoría...</option>
                            <option value="planta">Planta</option>
                            <option value="maceta">Maceta</option>
                            <option value="fertilizante">Fertilizante</option>
                            <option value="herramienta">Herramienta</option>
                            <option value="otro">Otro</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>URL Imagen</Form.Label>
                        <Form.Control
                            type="text"
                            name="imagenProducto"
                            value={formData.imagenProducto}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Dimensiones</Form.Label>
                        <Form.Control
                            type="text"
                            name="dimensionProducto"
                            value={formData.dimensionProducto}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-center mt-3 gap-2">
                        <Button variant="danger" onClick={onClose} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit">
                            Guardar producto
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AgregarProductoModal