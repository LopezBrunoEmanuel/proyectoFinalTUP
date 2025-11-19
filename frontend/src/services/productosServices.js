// 🌱 productosServices.js
// Gestiona las peticiones HTTP al backend (v3)
import axios from "axios";
import { PRODUCTOS_URL } from "../constants/constants.js";

// 🟢 Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await axios.get(PRODUCTOS_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

// 🟢 Crear producto nuevo
export const createProducto = async (productoData) => {
  try {
    // Importante: el backend espera estos campos (v3)
    // nombreProducto, descripcionProducto, precioBase, idCategoria, imagenPrincipal, activo, tieneTamanios
    const response = await axios.post(PRODUCTOS_URL, productoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

// 🟢 Actualizar producto existente
export const updateProducto = async (idProducto, productoData) => {
  try {
    const response = await axios.put(`${PRODUCTOS_URL}/${idProducto}`, productoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

// 🟢 Eliminar producto
export const deleteProducto = async (idProducto) => {
  try {
    const response = await axios.delete(`${PRODUCTOS_URL}/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};

// 🟡 Alternar estado activo/inactivo del producto
export const toggleActivoProducto = async (idProducto, activoActual) => {
  try {
    const nuevoEstado = !activoActual;
    const response = await axios.patch(`${PRODUCTOS_URL}/${idProducto}/estado`, {
      activo: nuevoEstado,
    });

    // ⚙️ el backend solo devuelve un mensaje, no el producto actualizado
    // devolvemos un objeto con los datos mínimos para actualizar el store
    return { idProducto, activo: nuevoEstado, mensaje: response.data.message };
  } catch (error) {
    console.error("❌ Error al cambiar estado del producto:", error);
    throw error;
  }
};
// export const toggleActivoProducto = async (idProducto) => {
//   try {
//     const response = await axios.patch(`${PRODUCTOS_URL}/${idProducto}/estado`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al cambiar el estado del producto:", error);
//     throw error;
//   }
// };

// service viejo de productos
// // ACA SOLO SE MANEJAN PETICIONES HTTP -> habla con el backend para pedir y con prod.store para exportarle
// // funciones que llevaria el crud: get, create, update, delete y exportarlas
// import {PRODUCTOS_URL} from "../constants/constants.js"
// import axios from "axios"

// export const getProductos = async ()=> {
//     try {
//         const response = await axios.get(PRODUCTOS_URL)
//         return response.data;
//     } catch (error) {
//         console.error("Error al obtener los productos: ",error)
//         throw error;
//     }
// }

// export const createProducto = async (productoData) => {
//     try {
//         const response = await axios.post(PRODUCTOS_URL, productoData)
//         return response.data
//     } catch (error) {
//         console.error("Error al crear el producto: ",error)
//         throw error;
//     }
// }

// export const updateProducto = async (idProducto, productoData) => {
//     try {
//         const response = await axios.put(`${PRODUCTOS_URL}/${idProducto}`, productoData)
//         return response.data
//     } catch (error) {
//         console.error("Error al actualizar el producto: ",error)
//         throw error;
//     }
// }

// export const deleteProducto = async (idProducto) => {
//     try {
//         const response = await axios.delete(`${PRODUCTOS_URL}/${idProducto}`)
//         return response.data
//     } catch (error) {
//         console.error("Error al eliminar el producto: ",error)
//         throw error;
//     }
// }