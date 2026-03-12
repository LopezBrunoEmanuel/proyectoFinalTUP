import jsPDF from "jspdf";

export const generarComprobantePDF = (idReserva, productos, total, tipoEntrega, metodoPago, user) => {
    const doc = new jsPDF();

    // ── Constantes de layout ───────────────────────────────────────
    const PAGE_WIDTH   = 210;
    const PAGE_HEIGHT  = 297;
    const MARGIN       = 14;
    const CONTENT_W    = PAGE_WIDTH - MARGIN * 2;   // 182px de ancho útil

    // Columnas de la tabla (posición X de cada una)
    // Ancho total disponible: 182px
    // Producto: 85px | Cant: 20px | Precio unit: 40px | Subtotal: 37px
    const COL = {
        producto:    MARGIN,           // x=14  — arranca en el margen
        cantidad:    MARGIN + 87,      // x=101
        precio:      MARGIN + 112,     // x=126
        subtotal:    PAGE_WIDTH - MARGIN, // x=196 — alineado a la derecha
    };

    // ── Colores ────────────────────────────────────────────────────
    const VERDE       = [40, 167, 69];
    const GRIS_OSCURO = [51, 51, 51];
    const GRIS_TEXTO  = [80, 80, 80];
    const GRIS_LINEA  = [220, 220, 220];
    const BLANCO      = [255, 255, 255];

    // ── Helper: nueva página con encabezado de continuación ────────
    // Se llama automáticamente cuando "y" está cerca del borde inferior
    const nuevaPagina = () => {
        doc.addPage();

        // Mini-header verde para que se vea que es continuación
        doc.setFillColor(...VERDE);
        doc.rect(0, 0, PAGE_WIDTH, 14, "F");

        doc.setTextColor(...BLANCO);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Patio 1220", MARGIN, 9);
        doc.text(`Reserva #${idReserva} — continuación`, PAGE_WIDTH - MARGIN, 9, { align: "right" });

        return 24; // y inicial de la nueva página
    };

    // ── Helper: verificar si hay espacio, si no crear nueva página ─
    // "alturaNecesaria" es cuántos px necesita el próximo elemento
    const checkPagina = (y, alturaNecesaria = 10) => {
        if (y + alturaNecesaria > PAGE_HEIGHT - 20) {
            return nuevaPagina();
        }
        return y;
    };

    // ══════════════════════════════════════════════════════════════
    // PÁGINA 1 — ENCABEZADO PRINCIPAL
    // ══════════════════════════════════════════════════════════════
    doc.setFillColor(...VERDE);
    doc.rect(0, 0, PAGE_WIDTH, 28, "F");

    doc.setTextColor(...BLANCO);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Patio 1220", MARGIN, 13);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Comprobante de Reserva", MARGIN, 22);

    // Número de reserva a la derecha
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`#${idReserva}`, PAGE_WIDTH - MARGIN, 18, { align: "right" });

    // ── DATOS DE LA RESERVA ────────────────────────────────────────
    let y = 40;

    doc.setTextColor(...GRIS_OSCURO);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Datos de la reserva", MARGIN, y);

    y += 8;
    doc.setDrawColor(...GRIS_LINEA);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 7;

    const fechaHoy = new Date().toLocaleDateString("es-AR", {
        day:    "2-digit",
        month:  "2-digit",
        year:   "numeric",
        hour:   "2-digit",
        minute: "2-digit",
    });

    const entregaTexto = tipoEntrega === "retiro_local" ? "Retiro en local" : "Envío a domicilio";

    // Helper para imprimir una fila "Etiqueta:    valor"
    // La etiqueta ocupa hasta x=65, el valor arranca en x=70
    const imprimirFila = (label, valor) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...GRIS_OSCURO);
        doc.text(`${label}:`, MARGIN, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...GRIS_TEXTO);
        doc.text(String(valor), 70, y);

        y += 7;
    };

    imprimirFila("Cliente",          `${user.nombre} ${user.apellido}`);
    imprimirFila("Email",            user.email);
    imprimirFila("Fecha de reserva", fechaHoy);
    imprimirFila("Tipo de entrega",  entregaTexto);
    imprimirFila("Método de pago",   metodoPago);

    // ══════════════════════════════════════════════════════════════
    // TABLA DE PRODUCTOS
    // ══════════════════════════════════════════════════════════════
    y += 6;
    y = checkPagina(y, 30); // necesitamos al menos 30px para el título + encabezado

    doc.setTextColor(...GRIS_OSCURO);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detalle de productos", MARGIN, y);

    y += 6;
    doc.setDrawColor(...GRIS_LINEA);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 6;

    // ── Encabezado de la tabla ─────────────────────────────────────
    const HEADER_H = 8;
    doc.setFillColor(245, 245, 245);
    doc.rect(MARGIN, y - 4, CONTENT_W, HEADER_H, "F");

    doc.setFontSize(9);
    doc.setTextColor(...GRIS_OSCURO);
    doc.setFont("helvetica", "bold");
    doc.text("Producto",     COL.producto + 2, y + 1);
    doc.text("Cant.",        COL.cantidad,     y + 1);
    doc.text("Precio unit.", COL.precio,       y + 1);
    doc.text("Subtotal",     COL.subtotal,     y + 1, { align: "right" });

    y += HEADER_H + 2;

    // ── Filas de productos ─────────────────────────────────────────
    const FILA_H = 9; // altura de cada fila

    productos.forEach((item, index) => {
        // Antes de cada fila verificamos si queda espacio
        // Necesitamos FILA_H para la fila + ~30px para el total al final
        y = checkPagina(y, FILA_H + 35);

        // Fondo alternado para mejor lectura
        if (index % 2 === 0) {
            doc.setFillColor(252, 252, 252);
            doc.rect(MARGIN, y - 5, CONTENT_W, FILA_H, "F");
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...GRIS_TEXTO);

        // Nombre del producto — si es muy largo lo cortamos con doc.splitTextToSize
        const nombreCompleto = item.nombreTamanio && item.nombreTamanio !== "Único"
            ? `${item.nombreProducto} (${item.nombreTamanio})`
            : item.nombreProducto;

        // Limitamos el nombre a 85px de ancho para que no pise la columna Cant.
        const nombreRecortado = doc.splitTextToSize(nombreCompleto, 83);
        doc.text(nombreRecortado[0], COL.producto + 2, y); // solo la primera línea

        // Cantidad — centrada en su columna
        doc.text(
            String(item.cantidad),
            COL.cantidad + 8, // +8 para centrarlo visualmente
            y
        );

        // Precio unitario — alineado a la derecha dentro de su columna
        doc.text(
            `$${Number(item.precioUnitario).toFixed(2)}`,
            COL.precio + 38, // borde derecho de la columna precio
            y,
            { align: "right" }
        );

        // Subtotal — alineado a la derecha
        const subtotal = item.subtotal ?? item.precioUnitario * item.cantidad;
        doc.text(
            `$${Number(subtotal).toFixed(2)}`,
            COL.subtotal,
            y,
            { align: "right" }
        );

        y += FILA_H;

        // Línea separadora entre filas
        doc.setDrawColor(240, 240, 240);
        doc.line(MARGIN, y - 2, PAGE_WIDTH - MARGIN, y - 2);
    });

    // ══════════════════════════════════════════════════════════════
    // TOTAL
    // ══════════════════════════════════════════════════════════════
    y = checkPagina(y, 24);

    y += 4;
    doc.setDrawColor(...GRIS_LINEA);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 8;

    // Caja verde del total — arranca en x=125 para que sea más ancha
    doc.setFillColor(...VERDE);
    doc.rect(125, y - 6, PAGE_WIDTH - MARGIN - 125, 11, "F");

    doc.setTextColor(...BLANCO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOTAL:",                              129, y + 1);
    doc.text(`$${Number(total).toFixed(2)}`, COL.subtotal, y + 1, { align: "right" });

    // ── PIE DE PÁGINA ──────────────────────────────────────────────
    y += 20;
    y = checkPagina(y, 16);

    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("Este comprobante es válido como constancia de reserva.", MARGIN, y);
    doc.text("El pago se realizará en el momento del retiro o entrega.", MARGIN, y + 5);

    // Guardar con nombre descriptivo
    doc.save(`comprobante-reserva-${idReserva}.pdf`);
};