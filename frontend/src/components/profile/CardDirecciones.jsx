import { Card, Form, Row, Col, Button } from "react-bootstrap";

const CardDirecciones = ({ className = "" }) => {
    return (
        <Card className={`mp-card mt-4 mb-4 ${className}`}>
            <Card.Body className="mp-card-body">
                <div className="mp-card-head">
                    <h5 className="mp-card-h5">Dirección</h5>

                    <button
                        type="button"
                        className="mp-text-action"
                        aria-label="Editar dirección"
                        title="Editar dirección"
                    >
                        Editar
                    </button>
                </div>

                <div className="mp-divider" />

                <Form className="mt-3">
                    <Row className="g-3">
                        <Col md={8}>
                            <Form.Group>
                                <Form.Label>Calle</Form.Label>
                                <Form.Control
                                    readOnly
                                    className="mp-control-readonly"
                                    placeholder="Calle"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Número</Form.Label>
                                <Form.Control
                                    readOnly
                                    className="mp-control-readonly"
                                    placeholder="Altura"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Provincia</Form.Label>
                                <Form.Control
                                    readOnly
                                    className="mp-control-readonly"
                                    placeholder="Provincia"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Ciudad</Form.Label>
                                <Form.Control
                                    readOnly
                                    className="mp-control-readonly"
                                    placeholder="Ciudad"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Código postal</Form.Label>
                                <Form.Control
                                    readOnly
                                    className="mp-control-readonly"
                                    placeholder="Código postal"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Descripción / Referencia</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    readOnly
                                    className="mp-control-readonly"
                                    placeholder="Casa de dos pisos, portón verde, etc."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                <div className="mp-actions mt-3">
                    <Button variant="primary" type="submit" className="mp-btn">
                        Actualizar direccion
                    </Button>
                    <Button variant="secondary" type="button" className="mp-btn">
                        Cancelar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CardDirecciones;
