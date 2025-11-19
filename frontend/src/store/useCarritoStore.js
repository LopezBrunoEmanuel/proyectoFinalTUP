import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCarritoStore = create(
  persist(
    (set, get) => ({
      carrito: [],

      // --------------------------------------------------------
      // 🛒 AGREGAR AL CARRITO (ahora distingue tamaños)
      // --------------------------------------------------------
      agregarAlCarrito: (producto, cantidad = 1) => {
        if (cantidad <= 0) return;

        const { carrito } = get();

        // Identificador único por producto + tamaño
        const key = `${producto.idProducto}-${producto.nombreTamanio}`;

        const existente = carrito.find((p) => p.key === key);

        const stockDisponible = producto.stockDisponible;

        // Si ya existe ese tamaño en el carrito
        if (existente) {
          const nuevaCantidad = existente.cantidad + cantidad;

          if (nuevaCantidad > stockDisponible) return;

          const actualizado = carrito.map((p) =>
            p.key === key ? { ...p, cantidad: nuevaCantidad } : p
          );

          return set({ carrito: actualizado });
        }

        // Si NO existe → agregar nuevo ítem
        if (cantidad > stockDisponible) cantidad = stockDisponible;

        const nuevoItem = {
          key,
          ...producto, // idProducto, nombreProducto, nombreTamanio, precioUnitario, stockDisponible, imagenPrincipal
          cantidad,
        };

        set({ carrito: [...carrito, nuevoItem] });
      },

      // --------------------------------------------------------
      // ➖ DISMINUIR CANTIDAD
      // --------------------------------------------------------
      disminuirCantidad: (idProducto, nombreTamanio, cantidad = 1) => {
        const { carrito } = get();
        const key = `${idProducto}-${nombreTamanio}`;

        const actualizado = carrito
          .map((p) =>
            p.key === key ? { ...p, cantidad: p.cantidad - cantidad } : p
          )
          .filter((p) => p.cantidad > 0); // eliminar si queda en 0

        set({ carrito: actualizado });
      },

      // --------------------------------------------------------
      // ➕ AUMENTAR CANTIDAD
      // --------------------------------------------------------
      aumentarCantidad: (idProducto, nombreTamanio, cantidad = 1) => {
        const { carrito } = get();
        const key = `${idProducto}-${nombreTamanio}`;

        const actualizado = carrito.map((p) =>
          p.key === key ? { ...p, cantidad: p.cantidad + cantidad } : p
        );

        set({ carrito: actualizado });
      },

      // --------------------------------------------------------
      // ❌ ELIMINAR ITEM DEL CARRITO
      // --------------------------------------------------------
      eliminarDelCarrito: (idProducto, nombreTamanio) => {
        const key = `${idProducto}-${nombreTamanio}`;

        set((state) => ({
          carrito: state.carrito.filter((p) => p.key !== key),
        }));
      },

      // --------------------------------------------------------
      // 🧹 VACIAR CARRITO
      // --------------------------------------------------------
      vaciarCarrito: () => set({ carrito: [] }),

      // --------------------------------------------------------
      // 💲 TOTAL DEL CARRITO
      // --------------------------------------------------------
      totalCarrito: () => {
        const { carrito } = get();
        return carrito.reduce(
          (total, p) => total + p.precioUnitario * p.cantidad,
          0
        );
      },

      // --------------------------------------------------------
      // 🔢 TOTAL DE ÍTEMS
      // --------------------------------------------------------
      totalItems: () => {
        const { carrito } = get();
        return carrito.reduce((acc, item) => acc + item.cantidad, 0);
      },
    }),
    {
      name: "carrito-storage",
      getStorage: () => localStorage,
    }
  )
);


// viejo codigo de carrito store
// import { create } from "zustand";
// import { persist } from "zustand/middleware"

// export const useCarritoStore = create( persist( (set, get) => ({
//     carrito:[],

//     agregarAlCarrito: (producto, cantidad = 1) => {
//         if (cantidad <=0) return;
//         const {carrito} = get()
//         const existente = carrito.find(p => p.idProducto === producto.idProducto) 

//         if (existente) {
//           const nuevaCantidad = existente.cantidad + cantidad;
//           if (nuevaCantidad > producto.stockProducto) {
//             return;
//           }
//           const actualizado = carrito.map(p => p.idProducto === producto.idProducto ? {...p, cantidad: nuevaCantidad} : p)
//           set({carrito: actualizado})
//         } else {
//           if (cantidad > producto.stockProducto) {
//             cantidad = producto.stockProducto
//           }
//             set({ carrito: [...carrito, {...producto, cantidad}] })
//         }
//     },

//     disminuirCantidad: (idProducto, cantidad = 1) => { // 🆕 nueva función
//     const { carrito } = get();
//     const actualizado = carrito
//       .map(p =>
//         p.idProducto === idProducto
//           ? { ...p, cantidad: p.cantidad - cantidad }
//           : p
//       )
//       .filter(p => p.cantidad > 0); // 🆕 elimina si cantidad ≤ 0
//     set({ carrito: actualizado });
//   },

//      aumentarCantidad: (idProducto, cantidad = 1) => { // 🆕 nueva función
//     const { carrito } = get();
//     const actualizado = carrito.map(p =>
//       p.idProducto === idProducto
//         ? { ...p, cantidad: p.cantidad + cantidad }
//         : p
//     );
//     set({ carrito: actualizado });
//   },


//     eliminarDelCarrito: (idProducto) => {
//         set((state) => ({
//             carrito: state.carrito.filter(p => p.idProducto !== idProducto),
//         }))
//     },

//     vaciarCarrito: () => set({carrito: []}),

//     totalCarrito: () => { // 🆕 nueva función
//     const { carrito } = get();
//     return carrito.reduce((total, p) => total + p.precioProducto * p.cantidad, 0);
//   },

//     totalItems: () => {
//       const { carrito } = get();
//       return carrito.reduce((acc, item) => acc + item.cantidad, 0)
//     }

// }),
//   {
//     name: "carrito-storage",
//     getStorage: () => localStorage,
//   }
// ));

