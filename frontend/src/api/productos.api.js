import axios from "./axiosConfig.js";

// este archivo se encarga de hablar con el servidor mediante http requests usando axios
// solo envia/recibe datos del servidor, no maneja estados, ni logica de negocio, ni UI.

// GET - Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await axios.get('/productos');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

// GET - Obtener producto por ID
export const getProductoPorId = async (idProducto) => {
  try {
    const response = await axios.get(`/productos/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

// POST - Crear producto
export const createProducto = async (productoData) => {
  try {
    const response = await axios.post('/productos', productoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

// PUT - Actualizar producto
export const updateProducto = async (idProducto, productoData) => {
  try {
    const response = await axios.put(`/productos/${idProducto}`, productoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

// DELETE - Eliminar producto
export const deleteProducto = async (idProducto) => {
  try {
    const response = await axios.delete(`/productos/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};

// PATCH - Cambiar estado activo/inactivo
export const toggleActivoProducto = async (idProducto, activoActual) => {
  try {
    const nuevoEstado = !activoActual;
    const response = await axios.patch(`/productos/${idProducto}/estado`, {
      activo: nuevoEstado,
    });
    return { idProducto, activo: nuevoEstado, mensaje: response.data.message };
  } catch (error) {
    console.error("Error al cambiar estado del producto:", error);
    throw error;
  }
};