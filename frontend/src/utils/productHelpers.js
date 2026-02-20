// Helper para obtener el precio a mostrar
export const getPrecioMostrar = (producto) => {
  if (!producto || !producto.tamanios || producto.tamanios.length === 0) {
    return null;
  }

  // Filtrar tamaños activos
  const tamaniosActivos = producto.tamanios.filter((t) => t.activo);

  // Si NO tiene tamaños activos → retornar null (no mostrar precio)
  if (tamaniosActivos.length === 0) {
    return null;
  }

  // Si tiene 1 solo tamaño activo → retornar su precio
  if (tamaniosActivos.length === 1) {
    const precio = parseFloat(tamaniosActivos[0].precio);
    return isNaN(precio) || precio <= 0 ? null : precio;
  }

  // Si tiene múltiples tamaños activos → calcular rango
  const precios = tamaniosActivos
    .map((t) => parseFloat(t.precio))
    .filter((p) => !isNaN(p) && p > 0);

  if (precios.length === 0) return null;

  const min = Math.min(...precios);
  const max = Math.max(...precios);

  // Si todos tienen el mismo precio
  if (min === max) return min;

  // Retornar objeto con rango
  return { min, max, texto: `Desde $${min.toFixed(2)} hasta $${max.toFixed(2)}` };
};

// Helper para renderizar precio (usar en JSX)
export const renderPrecio = (precio) => {
  if (precio === null || precio === undefined) return "N/A";

  // Si es un número simple
  if (typeof precio === "number") {
    return `$${precio.toFixed(2)}`;
  }

  // Si es un objeto con rango
  if (precio && precio.texto) {
    return precio.texto;
  }

  return "N/A";
};

// Helper para obtener el stock total (SOLO de tamaños activos)
export const getStockMostrar = (producto) => {
  if (!producto || !producto.tamanios || producto.tamanios.length === 0) {
    return 0;
  }

  return producto.tamanios
    .filter((t) => t.activo)
    .reduce((sum, t) => sum + (parseInt(t.stock) || 0), 0);
};

// Helper para verificar si tiene tamaños activos
export const tieneTamaniosActivos = (producto) => {
  if (!producto || !producto.tamanios || producto.tamanios.length === 0) {
    return false;
  }
  return producto.tamanios.some((t) => t.activo);
};