import { Card, Form, Row, Col, Button } from "react-bootstrap";

const CardModificarPassword = ({ isOpen, onEdit, onCancel, onSubmit, security, onChange, className = "" }) => {
    return (
        <Card className={`mp-card ${className}`}>
            <Card.Body className="mp-card-body">
                <div className="mp-card-head">
                    <h5 className="mp-card-h5">Cambio de contraseña</h5>

                    {!isOpen && (
                        <button
                            type="button"
                            className="mp-text-action"
                            onClick={onEdit}
                            aria-label="Cambiar contraseña"
                            title="Cambiar contraseña"
                        >
                            Editar
                        </button>
                    )}

                    {isOpen && (
                        <button
                            type="button"
                            className="mp-text-action"
                            onClick={onCancel}
                            aria-label="Cancelar"
                            title="Cancelar"
                        >
                            Cancelar
                        </button>
                    )}
                </div>

                <div className="mp-divider" />

                {!isOpen && (
                    <div className="mp-security-note mt-3">
                        <small className="text-muted">
                            Cambia tu <b>contraseña</b> aqui
                        </small>
                    </div>
                )}

                {isOpen && (
                    <Form onSubmit={onSubmit} className="mt-3">
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Contraseña actual</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="passwordActual"
                                        value={security.passwordActual}
                                        onChange={onChange}
                                        placeholder="Contraseña actual"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nueva contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="nuevaPassword"
                                        value={security.nuevaPassword}
                                        onChange={onChange}
                                        placeholder="Contraseña nueva"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Repetir nueva contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmarNuevaPassword"
                                        value={security.confirmarNuevaPassword}
                                        onChange={onChange}
                                        placeholder="Contraseña nueva"
                                    />
                                </Form.Group>
                            </Col>

                            <Form.Text className="mp-pass-rules text-muted">
                                La nueva contraseña debe tener:
                                <ul className="mp-pass-rules-list">
                                    <li>
                                        Entre <b>6</b> y <b>30</b> caracteres.
                                    </li>
                                    <li>
                                        Al menos <b>1</b> mayúscula.
                                    </li>
                                    <li>
                                        Al menos <b>1</b> minúscula.
                                    </li>
                                    <li>
                                        Al menos <b>1</b> número.
                                    </li>
                                    <li>
                                        Al menos <b>1</b> símbolo (ej: !@#...).
                                    </li>
                                    <li>Sin espacios</li>
                                </ul>
                            </Form.Text>
                        </Row>

                        <div className="mp-actions mt-3">
                            <Button variant="primary" type="submit" className="mp-btn">
                                Actualizar contraseña
                            </Button>
                            <Button
                                variant="secondary"
                                type="button"
                                className="mp-btn"
                                onClick={onCancel}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                )}
            </Card.Body>
        </Card>
    );
};

export default CardModificarPassword;