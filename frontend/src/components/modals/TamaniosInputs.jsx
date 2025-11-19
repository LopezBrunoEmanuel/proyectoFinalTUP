import { Button, Row, Col, Form } from "react-bootstrap";

const TamaniosInputs = ({ tamanios, setTamanios }) => {

    const agregarTamanio = () => {
        setTamanios([
            ...tamanios,
            { nombreTamanio: "", precio: "", stock: "", activo: true }
        ]);
    };

    const eliminarTamanio = (index) => {
        setTamanios(tamanios.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const nuevos = [...tamanios];

        nuevos[index] = {
            ...nuevos[index],
            [field]: field === "activo" ? Boolean(value) : value,
        };

        setTamanios(nuevos);
    };


    return (
        <div className="mb-3">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold">Tamaños</Form.Label>
                <Button size="sm" variant="outline-success" onClick={agregarTamanio}>
                    + Añadir tamaño
                </Button>
            </div>

            {/* Sin tamaños */}
            {tamanios.length === 0 && (
                <p className="text-muted fst-italic">No hay tamaños agregados</p>
            )}

            {/* Lista de tamaños */}
            {tamanios.map((t, i) => (
                <Row
                    key={i}
                    className={`g-2 align-items-center mb-3 p-2 rounded border ${t.activo ? "border-light" : "border-danger bg-dark bg-opacity-25"
                        }`}
                >
                    {/* Botón eliminar (izquierda) */}
                    <Col xs={12} md={1} className="text-center">
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => eliminarTamanio(i)}
                        >
                            ✕
                        </Button>
                    </Col>

                    {/* Nombre */}
                    <Col md={3}>
                        <Form.Control
                            type="text"
                            placeholder="Nombre (ej. Chico, M, XL...)"
                            value={t.nombreTamanio}
                            onChange={(e) => handleChange(i, "nombreTamanio", e.target.value)}
                            className={!t.activo ? "opacity-50" : ""}
                        />
                    </Col>

                    {/* Precio */}
                    <Col md={2}>
                        <Form.Control
                            type="number"
                            placeholder="Precio"
                            value={t.precio}
                            onChange={(e) => handleChange(i, "precio", e.target.value)}
                            className={!t.activo ? "opacity-50" : ""}
                        />
                    </Col>

                    {/* Stock */}
                    <Col md={2}>
                        <Form.Control
                            type="number"
                            placeholder="Stock"
                            value={t.stock}
                            onChange={(e) => handleChange(i, "stock", e.target.value)}
                            className={!t.activo ? "opacity-50" : ""}
                        />
                    </Col>

                    {/* Checkbox Activo */}
                    <Col md={3} className="text-center">
                        <Form.Check
                            type="checkbox"
                            label={t.activo ? "Activo" : "Inactivo"}
                            checked={t.activo ?? true}
                            onChange={(e) =>
                                handleChange(i, "activo", e.target.checked)
                            }
                        />
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default TamaniosInputs;
