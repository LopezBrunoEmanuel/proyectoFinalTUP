import "../../styles/buttons.css";
import { FaLeaf, FaShoppingCart, FaTrash, FaWhatsapp, FaPlus } from "react-icons/fa";

const BotonesPreview = () => {
    const botonesBase = [
        { clase: "btn-dorado", texto: "Dorado" },
        { clase: "btn-verde", texto: "Verde bosque" },
        { clase: "btn-rosa", texto: "Rosa" },
        { clase: "btn-outline", texto: "Outline dorado" },
        { clase: "btn-olivo", texto: "Verde olivo" },
        { clase: "btn-beige", texto: "Beige" },
        { clase: "btn-gris", texto: "Gris medio" },
        { clase: "btn-dorado-gradiente", texto: "Dorado degradado" },
        { clase: "btn-translucido", texto: "Translúcido" },
        { clase: "btn-outline-olivo", texto: "Outline olivo" },
        { clase: "btn-outline-rosa", texto: "Outline rosa" },
        { clase: "btn-texto", texto: "Texto simple →" },
        { clase: "btn-elevado", texto: "Elevado" },
    ];

    const botonesNuevos = [
        { clase: "btn-doble-dorado", texto: "Borde doble dorado" },
        { clase: "btn-verde-glow", texto: "Verde Glow" },
        { clase: "btn-rosa-pastel", texto: "Rosa pastel" },
        { clase: "btn-gradiente-olivo", texto: "Gradiente olivo" },
        { clase: "btn-glass", texto: "Glass efecto" },
        { clase: "btn-borde-animado", texto: "Borde animado" },
        { clase: "btn-invertido", texto: "Invertido" },
        { clase: "btn-circular", texto: <FaPlus /> },
        { clase: "btn-fade", texto: "Fade" },
        { clase: "btn-minimalista", texto: "Minimalista" },
    ];

    const botonesAnimados = [
        { clase: "btn-diagonal", texto: "Relleno diagonal" },
        { clase: "btn-gradiente-animado", texto: "Gradiente animado" },
        { clase: "btn-brillo", texto: "Brillo deslizante" },
        { clase: "btn-pulse", texto: "Pulsación suave" },
        { clase: "btn-lift", texto: "Hover levantado" },
        { clase: "btn-borde-expand", texto: "Borde expandido" },
        { clase: "btn-sombra-dinamica", texto: "Sombra dinámica" },
    ];

    return (
        <section
            style={{
                padding: "3rem 1rem",
                textAlign: "center",
                backgroundColor: "var(--color-beige-claro)",
                minHeight: "100vh",
            }}
        >
            <h1 style={{ color: "var(--color-verde-bosque)", marginBottom: "2rem" }}>
                Catálogo de botones — Patio 1220
            </h1>

            {/* === Grupo 1: Botones base === */}
            <h2 style={{ color: "var(--color-verde-bosque)", marginBottom: "1rem" }}>
                🎨 Botones base
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "1000px",
                    margin: "0 auto 3rem",
                }}
            >
                {botonesBase.map((b, i) => (
                    <div
                        key={i}
                        style={{
                            backgroundColor: "var(--color-blanco)",
                            borderRadius: "12px",
                            padding: "1.5rem 1rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                    >
                        <button className={`${b.clase} btn-lg`}>{b.texto}</button>
                        <p
                            style={{
                                fontSize: "0.85rem",
                                marginTop: "1rem",
                                color: "var(--color-gris-medio)",
                            }}
                        >
                            .{b.clase}
                        </p>
                    </div>
                ))}
            </div>

            {/* === Grupo 2: Nuevas variantes === */}
            <h2 style={{ color: "var(--color-verde-bosque)", marginBottom: "1rem" }}>
                ✨ Nuevas variantes
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "1000px",
                    margin: "0 auto 3rem",
                }}
            >
                {botonesNuevos.map((b, i) => (
                    <div
                        key={i}
                        style={{
                            backgroundColor: "var(--color-blanco)",
                            borderRadius: "12px",
                            padding: "1.5rem 1rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                    >
                        <button className={`${b.clase} btn-lg`}>{b.texto}</button>
                        <p
                            style={{
                                fontSize: "0.85rem",
                                marginTop: "1rem",
                                color: "var(--color-gris-medio)",
                            }}
                        >
                            .{b.clase}
                        </p>
                    </div>
                ))}
            </div>

            {/* === Grupo 3: Botones animados === */}
            <h2 style={{ color: "var(--color-verde-bosque)", marginBottom: "1rem" }}>
                ⚡ Botones animados
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "1000px",
                    margin: "0 auto",
                }}
            >
                {botonesAnimados.map((b, i) => (
                    <div
                        key={i}
                        style={{
                            backgroundColor: "var(--color-blanco)",
                            borderRadius: "12px",
                            padding: "1.5rem 1rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                    >
                        <button className={`${b.clase} btn-lg`}>{b.texto}</button>
                        <p
                            style={{
                                fontSize: "0.85rem",
                                marginTop: "1rem",
                                color: "var(--color-gris-medio)",
                            }}
                        >
                            .{b.clase}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BotonesPreview;
