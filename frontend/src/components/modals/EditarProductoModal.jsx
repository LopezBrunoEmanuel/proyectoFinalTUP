import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useProductosStore } from "../../store/useProductosStore.js";
import { toast } from "../utils/alerts";
import TamaniosInputs from "./TamaniosInputs.jsx";
import "../../styles/crud-modals.css";

const EditarProductoModal = ({ show, onClose }) => {
    const { productoSeleccionado, updateProducto, resetPaginacion } = useProductosStore();
    const [tamanios, setTamanios] = useState([])
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

    // Cargar los datos al abrir el modal
    useEffect(() => {
        if (show && productoSeleccionado) {

            setFormData({
                nombreProducto: productoSeleccionado.nombreProducto || "",
                descripcionProducto: productoSeleccionado.descripcionProducto || "",
                precioBase: productoSeleccionado.precioBase ?? "",
                idCategoria: productoSeleccionado.idCategoria ?? "",
                idProveedor: productoSeleccionado.idProveedor ?? "",
                imagenPrincipal: productoSeleccionado.imagenPrincipal || "",
                tieneTamanios: !!productoSeleccionado.tieneTamanios,
                activo: !!productoSeleccionado.activo,
                stock: productoSeleccionado.stock ?? 0
            });

            if (productoSeleccionado.tieneTamanios) {
                setTamanios(productoSeleccionado.tamanios || [])
            } else {
                setTamanios([])
            }
        }
    }, [show, productoSeleccionado]);

    // Limpiar campos del modal al cerrar
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
            setTamanios([])
        }
    }, [show]);

    // Manejar cambios de inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Caso especial: activar / desactivar producto
        if (name === "activo") {
            const nuevoActivo = checked;

            // Actualizo estado del producto
            setFormData(prev => ({
                ...prev,
                activo: nuevoActivo
            }));

            // Si el producto pasa a INACTIVO => desactivar todos los tamaños
            if (!nuevoActivo) {
                setTamanios(prev =>
                    prev.map(t => ({
                        ...t,
                        activo: false
                    }))
                );
            }

            // Si el producto pasa a ACTIVO, NO modificamos los tamaños
            // (respetamos los estados individuales previos)

            return; // IMPORTANTE: cortamos acá
        }

        // Caso normal para cualquier otro campo
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Normaliza valores para comparar
    const normalizarProductoParaComparar = (src) => {
        const campos = [
            "nombreProducto",
            "descripcionProducto",
            "precioBase",
            "idCategoria",
            "idProveedor",
            "imagenPrincipal",
            "tieneTamanios",
            "activo",
            "stock",
        ];

        const out = {};
        for (const campo of campos) {
            let valor = src?.[campo];

            if (valor === null || valor === undefined) valor = "";

            if (["precioBase", "idCategoria", "idProveedor", "stock"].includes(campo)) {
                const num = Number(valor);
                out[campo] = Number.isNaN(num) ? 0 : num;
            } else if (["tieneTamanios", "activo"].includes(campo)) {
                out[campo] = !!valor;
            } else {
                out[campo] = String(valor).trim();
            }
        }
        return out;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!productoSeleccionado) return;

        if (!formData.tieneTamanios) {
            if (!formData.precioBase || Number(formData.precioBase) <= 0) {
                toast("warning", "Debes ingresar un Precio Base válido");
                return;
            }
            if (!formData.stock || Number(formData.stock) < 0) {
                toast("warning", "Debes ingresar un Stock válido");
                return;
            }
        }

        if (formData.tieneTamanios) {
            if (!Array.isArray(tamanios) || tamanios.length === 0) {
                toast("warning", "Debes agregar al menos un tamaño");
                return;
            }

            for (const t of tamanios) {
                if (!t.nombreTamanio || !t.nombreTamanio.trim()) {
                    toast("warning", "Todos los tamaños deben tener un nombre");
                    return;
                }
                if (t.precio === "" || Number(t.precio) <= 0) {
                    toast("warning", "El precio de cada tamaño debe ser > 0");
                    return;
                }
                if (t.stock === "" || Number(t.stock) < 0) {
                    toast("warning", "El stock de cada tamaño debe ser válido");
                    return;
                }
            }
        }

        const productoNormalizado = {
            ...formData,
            precioBase: Number(formData.precioBase) || 0,
            idCategoria: formData.idCategoria === "" ? null : Number(formData.idCategoria),
            stock: Number(formData.stock) || 0,
            idProveedor:
                formData.idProveedor === "" || formData.idProveedor === null
                    ? null
                    : Number(formData.idProveedor),
            tieneTamanios: !!formData.tieneTamanios,
            activo: !!formData.activo,
            imagenPrincipal: (formData.imagenPrincipal || "").trim(),
        }

        if (formData.tieneTamanios) {
            productoNormalizado.tamanios = tamanios.map(t => ({
                ...t,
                activo: t.activo ?? true   // 🔥 si no viene, lo setea en true
            }));
        } else {
            productoNormalizado.tamanios = []
        }

        // console.log("ANTES DE COMPARAR:");
        // console.log("productoSeleccionado.tamanios:", productoSeleccionado.tamanios);
        // console.log("tamanios nuevos:", tamanios);


        // 1️⃣ comparar campos simples
        const nuevoCmp = normalizarProductoParaComparar(productoNormalizado);
        const viejoCmp = normalizarProductoParaComparar(productoSeleccionado);
        let huboCambios = Object.keys(nuevoCmp).some((k) => nuevoCmp[k] !== viejoCmp[k]);

        // console.log("🟣 Entrando a comparación de tamaños…");
        // 2️⃣ si tiene tamaños, comparar también los tamaños
        if (formData.tieneTamanios) {
            const normalizarArrayTamanios = (arr = []) =>
                (arr || [])
                    .map(t => ({
                        nombreTamanio: (t.nombreTamanio || "").trim().toLowerCase(),
                        precio: Number(t.precio),
                        stock: Number(t.stock),
                        activo: Boolean(t.activo)
                    }))
                    // ordenamos por nombre para evitar problemas de orden
                    .sort((a, b) => a.nombreTamanio.localeCompare(b.nombreTamanio));

            const tamaniosViejosNorm = normalizarArrayTamanios(productoSeleccionado.tamanios);
            const tamaniosNuevosNorm = normalizarArrayTamanios(tamanios);

            const jsonViejo = JSON.stringify(tamaniosViejosNorm);
            const jsonNuevo = JSON.stringify(tamaniosNuevosNorm);
            // console.log("🔍 JSON viejo:", jsonViejo);
            // console.log("🔍 JSON nuevo:", jsonNuevo);

            if (jsonViejo !== jsonNuevo) {
                huboCambios = true;
            }
        }

        if (!huboCambios) {
            toast("warning", "No se realizaron modificaciones");
            onClose();
            return;
        }

        try {
            await updateProducto(productoSeleccionado.idProducto, productoNormalizado);
            toast("info", "Cambios realizados con éxito");
            resetPaginacion();
            onClose();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            toast("error", "Ocurrió un error al guardar los cambios");
        }
    };

    if (!productoSeleccionado) return null;

    return (
        <Modal className="crud-modal" show={show} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Editar Producto</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-white">
                <Form onSubmit={handleSubmit}>
                    {/* Nombre */}
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

                    {/* Descripción */}
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descripcionProducto"
                            value={formData.descripcionProducto}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Precio */}
                    {!formData.tieneTamanios && (
                        <Form.Group className="mb-3">
                            <Form.Label>Precio Base</Form.Label>
                            <Form.Control
                                type="number"
                                name="precioBase"
                                value={formData.precioBase}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    )}

                    {/* Stock */}
                    {!formData.tieneTamanios && (
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                            />
                        </Form.Group>
                    )}

                    {/* Categoría */}
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

                    {/* Proveedor */}
                    <Form.Group className="mb-3">
                        <Form.Label>Proveedor (ID)</Form.Label>
                        <Form.Control
                            type="number"
                            name="idProveedor"
                            value={formData.idProveedor}
                            onChange={handleChange}
                            placeholder="Ej: 1"
                        />
                    </Form.Group>

                    {/* Imagen */}
                    <Form.Group className="mb-3">
                        <Form.Label>URL Imagen Principal</Form.Label>
                        <Form.Control
                            type="text"
                            name="imagenPrincipal"
                            value={formData.imagenPrincipal}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Checkboxs */}
                    {/* Checkbox de tamaños */}
                    <Form.Group className="mb-3 d-flex align-items-center gap-2">
                        <Form.Check
                            type="checkbox"
                            name="tieneTamanios"
                            checked={formData.tieneTamanios}
                            onChange={handleChange}
                            label="Tiene varios tamaños (S, M, L...)"
                        />
                    </Form.Group>
                    {/* Checkboxs de estado de producto (activo/ianctivo) */}
                    <Form.Group className="mb-3 d-flex align-items-center gap-2">
                        <Form.Check
                            type="checkbox"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                            label="Activo (visible en catálogo)"
                        />
                    </Form.Group>

                    {/* Form de nuevos tamaños */}
                    {formData.tieneTamanios && (
                        <TamaniosInputs tamanios={tamanios} setTamanios={setTamanios} />
                    )}

                    {/* Botones */}
                    <div className="d-flex justify-content-center mt-3 gap-2">
                        <Button variant="danger" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit">
                            Guardar cambios
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditarProductoModal;

// viejo modal edtar producto
// import { useState, useEffect } from "react"
// import { Modal, Form, Button } from "react-bootstrap"
// import { useProductosStore } from "../../store/useProductosStore.js"

// const EditarProductoModal = ({ show, onClose }) => {
//     const { productoSeleccionado, updateProducto } = useProductosStore();
//     const [formData, setFormData] = useState({
//         nombreProducto: "",
//         descripcionProducto: "",
//         precioProducto: "",
//         stockProducto: "",
//         categoriaProducto: "",
//         imagenProducto: "",
//         dimensionProducto: ""
//     });

//     useEffect(() => {
//         if (show && productoSeleccionado) {
//             setFormData(productoSeleccionado)
//         };
//     }, [productoSeleccionado, show])

//     useEffect(() => {
//         if (!show) {
//             setFormData({
//                 nombreProducto: "",
//                 descripcionProducto: "",
//                 precioProducto: "",
//                 stockProducto: "",
//                 categoriaProducto: "",
//                 imagenProducto: "",
//                 dimensionProducto: ""
//             })
//         }
//     }, [show])

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }))
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const productoNormalizado = {
//             ...formData,
//             precioProducto: Number(formData.precioProducto),
//             stockProducto: Number(formData.stockProducto),
//         };

//         await updateProducto(formData.idProducto, productoNormalizado);
//         onClose();
//     }

//     if (!productoSeleccionado) return null;


//     return (
//         <Modal show={show} onHide={onClose} centered backdrop="static">
//             <Modal.Header closeButton className="bg-dark text-white">
//                 <Modal.Title>Editar Producto</Modal.Title>
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
//                         <Form.Label>URL de Imagen</Form.Label>
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
//                             Guardar cambios
//                         </Button>
//                     </div>
//                 </Form>
//             </Modal.Body>
//         </Modal>
//     )
// }

// export default EditarProductoModal