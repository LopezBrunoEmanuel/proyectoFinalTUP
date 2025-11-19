import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useProductosStore } from "../../store/useProductosStore";
import { toast } from "../utils/alerts";
import TamaniosInputs from "./TamaniosInputs";
import "../../styles/crud-modals.css";

const AgregarProductoModal = ({ show, onClose, onSaveSuccess }) => {
    const { addProducto } = useProductosStore();

    const [formData, setFormData] = useState({
        nombreProducto: "",
        descripcionProducto: "",
        precioBase: "",
        idCategoria: "",
        idProveedor: "",
        imagenPrincipal: "",
        tieneTamanios: false,
        activo: true,
        stock: ""
    });

    const [tamanios, setTamanios] = useState([]);

    // Manejar cambios
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ---------------------------
        // VALIDACIONES
        // ---------------------------

        // 1️⃣ Validación general: nombre
        if (!formData.nombreProducto.trim()) {
            toast("warning", "El producto debe tener un nombre");
            return;
        }

        // 2️⃣ SI NO tiene tamaños → validar precioBase y stock base
        if (!formData.tieneTamanios) {
            if (!formData.precioBase || Number(formData.precioBase) <= 0) {
                toast("warning", "Debes ingresar un Precio Base válido");
                return;
            }
            if (formData.stock === "" || Number(formData.stock) < 0) {
                toast("warning", "Debes ingresar un Stock válido");
                return;
            }
        }

        // 3️⃣ SI tiene tamaños → validar cada tamaño
        if (formData.tieneTamanios) {

            // Debe haber al menos un tamaño
            if (!Array.isArray(tamanios) || tamanios.length === 0) {
                toast("warning", "Debes agregar al menos un tamaño");
                return;
            }

            // Validar cada tamaño
            for (const t of tamanios) {
                if (!t.nombreTamanio || !t.nombreTamanio.trim()) {
                    toast("warning", "Todos los tamaños deben tener un nombre");
                    return;
                }
                if (t.precio === "" || Number(t.precio) <= 0) {
                    toast("warning", "Cada tamaño debe tener un precio válido (> 0)");
                    return;
                }
                if (t.stock === "" || Number(t.stock) < 0) {
                    toast("warning", "Cada tamaño debe tener un stock válido");
                    return;
                }
            }

            // Evitar NOMBRES DUPLICADOS
            const nombres = tamanios.map(t => t.nombreTamanio.trim().toLowerCase());
            const repetidos = nombres.some((n, i) => nombres.indexOf(n) !== i);
            if (repetidos) {
                toast("warning", "Los tamaños no pueden tener nombres repetidos");
                return;
            }
        }

        // NORMALIZACIÓN DEL PAYLOAD
        const productoNormalizado = {
            ...formData,
            precioBase: Number(formData.precioBase) || 0,
            idCategoria: formData.idCategoria === "" ? null : Number(formData.idCategoria),
            idProveedor:
                formData.idProveedor === "" || formData.idProveedor === null
                    ? null
                    : Number(formData.idProveedor),
            stock: Number(formData.stock) || 0,
            activo: formData.activo ? 1 : 0,
            tieneTamanios: formData.tieneTamanios ? 1 : 0,
            imagenPrincipal: (formData.imagenPrincipal || "").trim(),
            tamanios: formData.tieneTamanios ? tamanios : []
        };

        // ENVIO
        try {
            await addProducto(productoNormalizado);
            toast("success", "Producto agregado correctamente");

            if (onSaveSuccess) onSaveSuccess();

            // Resetear datos
            setFormData({
                nombreProducto: "",
                descripcionProducto: "",
                precioBase: "",
                idCategoria: "",
                idProveedor: "",
                imagenPrincipal: "",
                tieneTamanios: false,
                activo: true,
                stock: ""
            });
            setTamanios([]);

            onClose();
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            toast("error", "No se pudo agregar el producto");
        }
    };

    useEffect(() => {
        if (!show) {
            setFormData({
                nombreProducto: "",
                descripcionProducto: "",
                precioBase: "",
                idCategoria: "",
                idProveedor: "",
                imagenPrincipal: "",
                tieneTamanios: false,
                activo: true,
                stock: ""
            });
            setTamanios([]);
        }
    }, [show]);

    return (
        <Modal className="crud-modal" show={show} onHide={onClose} centered backdrop="static">
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
                        <Form.Label>Precio Base</Form.Label>
                        <Form.Control
                            type="number"
                            name="precioBase"
                            value={formData.precioBase}
                            onChange={handleChange}
                            required={!formData.tieneTamanios}
                            disabled={formData.tieneTamanios}
                            placeholder={formData.tieneTamanios ? "Deshabilitado (usa precios por tamaño)" : ""}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                            name="idCategoria"
                            value={formData.idCategoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar categoría...</option>
                            <option value="1">Planta</option>
                            <option value="2">Maceta</option>
                            <option value="3">Fertilizante</option>
                            <option value="4">Herramienta</option>
                            <option value="5">Otro</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Proveedor</Form.Label>
                        <Form.Control
                            type="number"
                            name="idProveedor"
                            value={formData.idProveedor}
                            onChange={handleChange}
                            placeholder="Ejemplo: 1 (opcional)"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>URL de imagen principal</Form.Label>
                        <Form.Control
                            type="text"
                            name="imagenPrincipal"
                            value={formData.imagenPrincipal}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock inicial</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required={!formData.tieneTamanios}
                            disabled={formData.tieneTamanios}
                            placeholder={formData.tieneTamanios ? "Deshabilitado (usa stock por tamaño)" : ""}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Tiene varios tamaños (S, M, L...)"
                            name="tieneTamanios"
                            checked={formData.tieneTamanios}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => ({
                                    ...prev,
                                    tieneTamanios: checked,
                                    // al activarlo limpiamos estos campos
                                    precioBase: checked ? "" : prev.precioBase,
                                    stock: checked ? "" : prev.stock,
                                }));
                                if (!checked) setTamanios([]); // si se desactiva, vaciar tamaños
                            }}
                        />
                    </Form.Group>


                    {formData.tieneTamanios && (
                        <TamaniosInputs tamanios={tamanios} setTamanios={setTamanios} />
                    )}


                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Producto activo"
                            name="activo"
                            checked={formData.activo}
                            onChange={(e) =>
                                setFormData({ ...formData, activo: e.target.checked })
                            }
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-center mt-3 gap-2">
                        <Button variant="danger" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit">
                            Guardar producto
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AgregarProductoModal;

// viejo modal de agregar producto
// import { useState } from "react"
// import { Modal, Form, Button } from "react-bootstrap"
// import { useProductosStore } from "../../store/useProductosStore"

// const AgregarProductoModal = ({ show, onClose }) => {
//     const { addProducto } = useProductosStore();

//     const [formData, setFormData] = useState({
//         nombreProducto: "",
//         descripcionProducto: "",
//         precioProducto: "",
//         stockProducto: "",
//         categoriaProducto: "",
//         imagenProducto: "",
//         dimensionProducto: ""
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const productoNormalizado = {
//             ...formData,
//             precioProducto: Number(formData.precioProducto),
//             stockProducto: Number(formData.stockProducto)
//         }

//         try {
//             await addProducto(productoNormalizado);
//             onClose();
//         } catch (error) {
//             console.error("Error al agregar el producto: ", error)
//         }
//     }

//     return (
//         <Modal show={show} onHide={onClose} centered backdrop="static">
//             <Modal.Header closeButton className="bg-dark text-white">
//                 <Modal.Title>Agregar Nuevo Producto</Modal.Title>
//             </Modal.Header>
//             <Modal.Body className="bg-dark text-white">
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Nombre</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="nombreProducto"
//                             value={formData.nombreProducto}
//                             onChange={handleChange}
//                             required
//                         />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Descripción</Form.Label>
//                         <Form.Control
//                             as="textarea"
//                             name="descripcionProducto"
//                             value={formData.descripcionProducto}
//                             onChange={handleChange}
//                         />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Precio</Form.Label>
//                         <Form.Control
//                             type="number"
//                             name="precioProducto"
//                             value={formData.precioProducto}
//                             onChange={handleChange}
//                             required
//                         />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Stock</Form.Label>
//                         <Form.Control
//                             type="number"
//                             name="stockProducto"
//                             value={formData.stockProducto}
//                             onChange={handleChange}
//                         />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Categoría</Form.Label>
//                         <Form.Select
//                             name="categoriaProducto"
//                             value={formData.categoriaProducto}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Seleccionar categoría...</option>
//                             <option value="planta">Planta</option>
//                             <option value="maceta">Maceta</option>
//                             <option value="fertilizante">Fertilizante</option>
//                             <option value="herramienta">Herramienta</option>
//                             <option value="otro">Otro</option>
//                         </Form.Select>
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>URL Imagen</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="imagenProducto"
//                             value={formData.imagenProducto}
//                             onChange={handleChange}
//                         />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Dimensiones</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="dimensionProducto"
//                             value={formData.dimensionProducto}
//                             onChange={handleChange}
//                         />
//                     </Form.Group>

//                     <div className="d-flex justify-content-center mt-3 gap-2">
//                         <Button variant="danger" onClick={onClose} className="me-2">
//                             Cancelar
//                         </Button>
//                         <Button variant="success" type="submit">
//                             Guardar producto
//                         </Button>
//                     </div>
//                 </Form>
//             </Modal.Body>
//         </Modal>
//     )
// }

// export default AgregarProductoModal