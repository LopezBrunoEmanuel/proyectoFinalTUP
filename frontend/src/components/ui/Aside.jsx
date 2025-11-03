import { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Collapse, Container } from "react-bootstrap";
import "../../styles/aside.css";
import { FaTimesCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Aside = ({ filtrosTemporales, setFiltrosTemporales, filtrosAplicados, setFiltrosAplicados, setPaginaActual }) => {
    const [open, setOpen] = useState(true);

    return (
        <Container fluid className="aside-topbar-container">
            <div className="d-md-none text-center mb-3 mt-3">
                <Button
                    variant="outline-secondary"
                    onClick={() => setOpen(!open)}
                    aria-controls="filtros-collapse"
                    aria-expanded={open}
                >
                    {open ? "Ocultar filtros ▲" : "Mostrar filtros ▼"}
                </Button>
            </div>

            <Collapse in={open}>
                <div id="filtros-collapse" className="aside-topbar shadow-sm bg-light rounded py-3 px-4">
                    <Row className="gy-3 gx-3 align-items-center justify-content-between">
                        <Col xs={12} md={4} lg={3}>
                            <InputGroup className="position-relative buscador-container">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={filtrosTemporales.busqueda}
                                    onChange={(e) => {
                                        setFiltrosTemporales({ ...filtrosTemporales, busqueda: e.target.value });
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const busqueda = filtrosTemporales.busqueda.trim();
                                            if (busqueda.length === 0) return;
                                            setFiltrosAplicados({ ...filtrosTemporales });
                                            setPaginaActual(1);
                                            e.target.blur();
                                        }
                                    }}
                                />

                                {filtrosTemporales.busqueda && (
                                    <button type="button" className="clear-btn"
                                        onClick={() => {
                                            const nuevosFiltros = { ...filtrosTemporales, busqueda: "" };
                                            setFiltrosTemporales(nuevosFiltros);
                                            setFiltrosAplicados(nuevosFiltros);
                                            setPaginaActual(1);
                                        }}
                                    >
                                        <FaTimesCircle />
                                    </button>
                                )}
                            </InputGroup>
                        </Col>


                        <Col xs={6} md={3} lg={2}>
                            <Form.Select value={filtrosTemporales.categoria} onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, categoria: e.target.value })}>
                                <option value="">Todas las categorías</option>
                                <option value="planta">Plantas</option>
                                <option value="maceta">Macetas</option>
                                <option value="fertilizante">Fertilizantes</option>
                                <option value="herramienta">Herramientas</option>
                                <option value="otro">Otros</option>
                            </Form.Select>
                        </Col>

                        <Col xs={6} md={3} lg={2}>
                            <Form.Select value={filtrosTemporales.orden} onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, orden: e.target.value })}>
                                <option value="">Ordenar por...</option>
                                <option value="az">A-Z</option>
                                <option value="precioAsc">Menor precio</option>
                                <option value="precioDesc">Mayor precio</option>
                            </Form.Select>
                        </Col>

                        <Col xs={12} md={5} lg={4}>
                            <div className="d-flex justify-content-end align-items-center gap-3 flex-nowrap botones-filtros">

                                {/* Botón Aplicar */}
                                <Button
                                    variant="primary"
                                    className="btn-filtrar flex-grow-1 flex-md-grow-0"
                                    disabled={
                                        !filtrosTemporales.busqueda &&
                                        !filtrosTemporales.categoria &&
                                        !filtrosTemporales.orden
                                    }
                                    onClick={() => {
                                        setFiltrosAplicados({ ...filtrosTemporales });
                                        setPaginaActual(1);
                                    }}
                                >
                                    Aplicar
                                </Button>

                                {/* Botón Limpiar */}
                                <Button
                                    variant="outline-secondary"
                                    className="btn-limpiar flex-grow-1 flex-md-grow-0"
                                    disabled={
                                        !filtrosAplicados.busqueda &&
                                        !filtrosAplicados.categoria &&
                                        !filtrosAplicados.orden
                                    }
                                    onClick={() => {
                                        setFiltrosTemporales({ busqueda: "", categoria: "", orden: "" });
                                        setFiltrosAplicados({ busqueda: "", categoria: "", orden: "" });
                                        setPaginaActual(1);
                                    }}
                                >
                                    Limpiar filtros
                                </Button>

                            </div>
                        </Col>


                    </Row>
                </div>
            </Collapse>
        </Container>
    );
};

export default Aside;