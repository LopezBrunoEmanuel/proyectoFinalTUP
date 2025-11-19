// 🪴 STORE DE PRODUCTOS (Zustand)
import { create } from "zustand";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  toggleActivoProducto,
} from "../services/productosServices.js";

export const useProductosStore = create((set, get) => ({
  productos: [],
  productoSeleccionado: null,
  isLoading: false,
  error: null,
  filtros: {
  texto: "",
  categoria: "todos",
  estado: "todos",
  sortKey: "idProducto",
  sortDir: "asc",
  },
  paginaActual: 1,
  productosPorPagina: 10,


  setPaginaActual: (pagina) => set({ paginaActual: pagina }),

  resetPaginacion: () => set({ paginaActual: 1 }),

  setFiltroTexto: (texto) =>
    set((state) => ({ filtros: { ...state.filtros, texto } })),

  setFiltroCategoria: (categoria) =>
    set((state) => ({ filtros: { ...state.filtros, categoria } })),

  setFiltroEstado: (estado) =>
    set((state) => ({ filtros: { ...state.filtros, estado } })),

  setOrden: (clave) =>
    set((state) => {
      const { sortKey, sortDir } = state.filtros;
        if (sortKey === clave) {
          return {
            filtros: {
              ...state.filtros,
              sortDir: sortDir === "asc" ? "desc" : "asc",
            },
          };
        }
      return {
        filtros: { ...state.filtros, sortKey: clave, sortDir: "asc" },
      };
    }
  ),

  resetFiltros: () =>
  set({
    filtros: {
      texto: "",
      categoria: "todos",
      estado: "todos",
      sortKey: "idProducto",
      sortDir: "asc",
    },
  }),

  clearProductoSeleccionado: () => set({productoSeleccionado: null}),

  // 🟢 Obtener todos los productos
  fetchProductos: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getProductos();
      set({ productos: data, isLoading: false });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      set({
        error: "No se pudieron cargar los productos",
        isLoading: false,
      });
    }
  },

  // 🟢 Agregar un producto
  addProducto: async (productoData) => {
    try {
      set({ isLoading: true, error: null });
      const nuevoProducto = await createProducto(productoData);
      const productosActuales = get().productos;
      set({
        productos: [...productosActuales, nuevoProducto],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      set({
        error: "No se pudo agregar el producto",
        isLoading: false,
      });
    }
  },

  // 🟢 Editar producto existente
  updateProducto: async (idProducto, productoData) => {
    try {
      set({ isLoading: true, error: null });
      const productoActualizado = await updateProducto(idProducto, productoData);

      const productosActuales = get().productos;
      const productoValido =
        productoActualizado && productoActualizado.idProducto
          ? productoActualizado
          : { ...productoData, idProducto: Number(idProducto) };

      const productosActualizados = productosActuales.map((prod) =>
        Number(prod.idProducto) === Number(idProducto) ? productoValido : prod
      );

      set({ productos: productosActualizados, isLoading: false });
    } catch (error) {
      console.error("Error al editar el producto:", error);
      set({
        error: "No se pudo editar el producto",
        isLoading: false,
      });
    }
  },

  // 🟢 Eliminar producto
  deleteProducto: async (idProducto) => {
    try {
      set({ isLoading: true, error: null });
      await deleteProducto(idProducto);

      set((state) => ({
        productos: state.productos.filter(
          (prod) => Number(prod.idProducto) !== Number(idProducto)
        ),
        isLoading: false,
      }));

      console.log(`🗑️ Producto ${idProducto} eliminado del store`);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      set({
        error: "No se pudo eliminar el producto",
        isLoading: false,
      });
    }
  },

  // 🟢 Cambiar estado activo/inactivo
  toggleActivo: async (idProducto) => {
    try {
      set({ isLoading: true });
      const { productos } = get();

      const productoActual = productos.find((p) => p.idProducto === idProducto);
      if (!productoActual) {
        console.warn("⚠️ Producto no encontrado en store");
        return;
      }

      const productoActualizado = await toggleActivoProducto(
        idProducto,
        productoActual.activo
      );

      const productosActuales = productos.map((p) =>
        p.idProducto === idProducto
          ? { ...p, activo: productoActualizado.activo }
          : p
      );

      set({ productos: productosActuales, isLoading: false });
      return productoActualizado;
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 🟢 Seleccionar producto
  setProductoSeleccionado: (producto) => {
    set({ productoSeleccionado: producto });
  },
}));

// este es el store viejo de productos
// // ACA SE MANEJA LA LOGICA (FUNCIONES) Y LOS ESTADOS
// // importa las funciones del service y las usa para devolver UI en componentes
// import {create} from "zustand"
// import { getProductos , createProducto , updateProducto , deleteProducto } from "../services/productosServices.js"

// export const useProductosStore = create ((set,get) => ({
//     productos: [],
//     productoSeleccionado: null,
//     isLoading: false,
//     error: null,

//     fetchProductos: async () => {
//         try {
//             set({ isLoading: true, error: null});
//             const data = await getProductos();
//             set ({productos: data, isLoading: false});
//         } catch (error) {
//             console.error("Error al obtener productos: ",error)
//             set ({error: "No se pudieron cargar los productos", isLoading: false})
//         }
//     },

//     addProducto: async (productoData) => {
//         try {
//             set({ isLoading: true, error: null});
//             const nuevoProducto = await createProducto(productoData);
//             const productosActuales = get().productos;
//             set ({productos:[...productosActuales, nuevoProducto], isLoading: false})
//         } catch (error) {
//             console.error("Error al agregar el producto: ",error)
//             set ({error: "No se pudo agregar el producto", isLoading: false})
//         }
//     },

//     // updateProducto: async (idProducto, productoData) => {
//     //     try {
//     //         set ({ isLoading: true, error: null });
//     //         const productoActualizado = await updateProducto(idProducto, productoData);
//     //         const productosActuales = get().productos;
//     //         const productosActualizados = productosActuales.map((prod) =>
//     //         prod.idProducto === idProducto ? productoActualizado : prod);
//     //         set({productos: productosActualizados, isLoading: false})
//     //     } catch (error) {
//     //         console.error("Error al editar el producto: ",error)
//     //         set ({error: "No se pudo editar el producto", isLoading: false})
//     //     }
//     // },

//     updateProducto: async (idProducto, productoData) => {
//   try {
//     set({ isLoading: true, error: null });
//     const productoActualizado = await updateProducto(idProducto, productoData);
//     const productosActuales = get().productos;
//     const productoValido =
//       productoActualizado && productoActualizado.idProducto
//         ? productoActualizado
//         : { ...productoData, idProducto: Number(idProducto) };
//     const productosActualizados = productosActuales.map((prod) =>
//       Number(prod.idProducto) === Number(idProducto) ? productoValido : prod
//     );
//     set({ productos: productosActualizados, isLoading: false });
//   } catch (error) {
//     console.error("Error al editar el producto:", error);
//     set({
//       error: "No se pudo editar el producto",
//       isLoading: false,
//     });
//   }
// },

//     deleteProducto: async (idProducto) => {
//         try {
//             set ({ isLoading: true, error: null });
//             await deleteProducto(idProducto);
//             const productosActuales = get().productos;
//             const productosActualizados = productosActuales.filter((prod) =>
//             prod.idProducto !== idProducto);
//             set ({ productos: productosActualizados, isLoading: false});
//         } catch (error) {
//             console.error("Error al eliminar el producto: ",error)
//             set ({error: "No se pudo eliminar el producto", isLoading: false})
//         }
//     },

//     setProductoSeleccionado: (producto) => {
//         set({ productoSeleccionado: producto});
//     }
// }))