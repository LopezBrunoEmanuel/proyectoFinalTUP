import { useState, useMemo } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useCarritoStore } from "../../store/useCarritoStore";
import { FaShoppingBag } from "react-icons/fa";
import "../../styles/producto-card.css";

const ProductoCard = ({ prod, onAgregar }) => {
    const { agregarAlCarrito, carrito } = useCarritoStore();

    // 🔍 Tamaños activos
    const tamaniosActivos = useMemo(() => {
        return prod.tamanios?.filter((t) => Number(t.activo) === 1) || [];
    }, [prod]);

    const esSinTamanios = Number(prod.tieneTamanios) === 0;
    const esUnicoTamanioActivo = tamaniosActivos.length === 1;

    // ⭐ Inicialización del tamaño seleccionado
    const [tamanioSeleccionado, setTamanioSeleccionado] = useState(() => {
        if (esSinTamanios) return "UNICO";
        if (esUnicoTamanioActivo) return tamaniosActivos[0].nombreTamanio;

        const primeroConStock = tamaniosActivos.find(
            (t) => Number(t.stock) > 0
        );
        return primeroConStock ? primeroConStock.nombreTamanio : "";
    });

    // ⭐ Cantidad seleccionada
    const [cantidad, setCantidad] = useState(0);

    // 🟢 Stock REAL (no depende del carrito)
    const stockReal = useMemo(() => {
        if (esSinTamanios) {
            return Number(prod.stock) || 0;
        }

        return tamaniosActivos.reduce(
            (acc, t) => acc + Number(t.stock || 0),
            0
        );
    }, [prod, tamaniosActivos, esSinTamanios]);


    // ⭐ Precio y stock dinámicos
    const { precioUnitario, stockDisponible } = useMemo(() => {
        if (esSinTamanios) {
            return {
                precioUnitario: Number(prod.precioBase),
                stockDisponible: Number(prod.stock),
            };
        }

        if (esUnicoTamanioActivo) {
            const t = tamaniosActivos[0];
            return {
                precioUnitario: Number(t.precio),
                stockDisponible: Number(t.stock),
            };
        }

        const t = tamaniosActivos.find(
            (t) => t.nombreTamanio === tamanioSeleccionado
        );

        if (!t) return { precioUnitario: 0, stockDisponible: 0 };

        return {
            precioUnitario: Number(t.precio),
            stockDisponible: Number(t.stock),
        };
    }, [
        prod,
        tamaniosActivos,
        tamanioSeleccionado,
        esSinTamanios,
        esUnicoTamanioActivo
    ]);


    // 🧮 Stock considerando lo que ya está en el carrito
    const enCarrito = carrito.find(
        (item) =>
            item.idProducto === prod.idProducto &&
            item.nombreTamanio ===
            (esSinTamanios || esUnicoTamanioActivo ? "UNICO" : tamanioSeleccionado)
    );

    const stockRestante = stockDisponible - (enCarrito?.cantidad || 0);

    // ➖➕ Cantidad
    const cambiarCantidad = (tipo) => {
        if (tipo === "sumar") {
            if (cantidad < stockRestante) setCantidad(cantidad + 1);
        } else {
            if (cantidad > 0) setCantidad(cantidad - 1);
        }
    };

    // 🛒 Agregar al carrito
    const handleAgregar = () => {
        if (cantidad <= 0) return;

        const payload = {
            idProducto: prod.idProducto,
            nombreProducto: prod.nombreProducto,
            nombreTamanio:
                esSinTamanios || esUnicoTamanioActivo
                    ? "UNICO"
                    : tamanioSeleccionado,
            precioUnitario,
            stockDisponible,
            imagenPrincipal: prod.imagenPrincipal,
        };

        agregarAlCarrito(payload, cantidad);
        setCantidad(0);

        if (onAgregar) onAgregar();
    };

    return (
        <Card className={`producto-card shadow-sm h-100 d-flex flex-column justify-content-between ${stockReal <= 0 ? "sin-stock" : ""}`}>
            {/* IMAGEN */}
            <Card.Img
                variant="top"
                src={prod.imagenPrincipal || "/placeholder.jpg"}
                alt={prod.nombreProducto}
                className="card-img-top"
            />

            <Card.Body className="producto-body text-center">
                {/* PARTE SUPERIOR: nombre, precio, select/espacio, stock */}
                <div className="zona-superior-flex d-flex flex-column align-items-center">
                    <Card.Title className="fw-semibold nombre-producto">
                        {prod.nombreProducto}
                    </Card.Title>

                    <p className="fw-bold precio-producto">${precioUnitario}</p>

                    <p className="text-muted small stock-producto">
                        Disponible: <strong>{stockRestante}</strong>
                        {/* Si en tu versión usás stockDisponible, cambiá acá solo el nombre de la variable */}
                    </p>
                    {Number(prod.tieneTamanios) === 1 && tamaniosActivos.length > 1 ? (
                        <Form.Select
                            className="select-tamanios"
                            value={tamanioSeleccionado}
                            onChange={(e) => {
                                setTamanioSeleccionado(e.target.value);
                                setCantidad(0);
                            }}
                        >
                            {tamaniosActivos.map((t) => (
                                <option
                                    key={t.nombreTamanio}
                                    value={t.nombreTamanio}
                                    disabled={Number(t.stock) <= 0}
                                >
                                    {t.nombreTamanio}
                                    {/* {t.stock > 0 ? `${t.stock} disponibles` : "(sin stock)"} */}
                                </option>
                            ))}
                        </Form.Select>
                    ) : (
                        <div className="espacio-reservado-select" />
                    )}

                </div>

                {/* PARTE INFERIOR: cantidad + botón agregar SIEMPRE ABAJO */}
                <div className="zona-inferior">
                    <div className="cantidad-container">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => cambiarCantidad("restar")}
                            disabled={cantidad <= 0}
                        >
                            -
                        </Button>

                        <Form.Control
                            type="number"
                            className="cantidad-input"
                            value={cantidad}
                            min={0}
                            max={stockRestante}
                            onChange={(e) => {
                                let value = parseInt(e.target.value) || 0;
                                if (value > stockRestante) value = stockRestante;
                                if (value < 0) value = 0;
                                setCantidad(value);
                            }}
                        />

                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => cambiarCantidad("sumar")}
                            disabled={cantidad >= stockRestante}
                        >
                            +
                        </Button>
                    </div>

                    <Button
                        className="btn-agregar d-flex align-items-center justify-content-center gap-2"
                        variant="outline-primary"
                        size="sm"
                        onClick={handleAgregar}
                        disabled={
                            cantidad <= 0 ||
                            stockRestante <= 0 ||
                            (!esSinTamanios &&
                                !esUnicoTamanioActivo &&
                                tamanioSeleccionado === "")
                        }
                    >
                        <span>Agregar</span> <FaShoppingBag />
                    </Button>
                </div>
            </Card.Body>

        </Card>
    );
};

export default ProductoCard;
