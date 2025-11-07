import { create } from "zustand";
import { persist } from "zustand/middleware"

export const useCarritoStore = create( persist( (set, get) => ({
    carrito:[],

    agregarAlCarrito: (producto, cantidad = 1) => {
        if (cantidad <=0) return;
        const {carrito} = get()
        const existente = carrito.find(p => p.idProducto === producto.idProducto) 

        if (existente) {
          const nuevaCantidad = existente.cantidad + cantidad;
          if (nuevaCantidad > producto.stockProducto) {
            return;
          }
          const actualizado = carrito.map(p => p.idProducto === producto.idProducto ? {...p, cantidad: nuevaCantidad} : p)
          set({carrito: actualizado})
        } else {
          if (cantidad > producto.stockProducto) {
            cantidad = producto.stockProducto
          }
            set({ carrito: [...carrito, {...producto, cantidad}] })
        }
    },

    disminuirCantidad: (idProducto, cantidad = 1) => { // 🆕 nueva función
    const { carrito } = get();
    const actualizado = carrito
      .map(p =>
        p.idProducto === idProducto
          ? { ...p, cantidad: p.cantidad - cantidad }
          : p
      )
      .filter(p => p.cantidad > 0); // 🆕 elimina si cantidad ≤ 0
    set({ carrito: actualizado });
  },

     aumentarCantidad: (idProducto, cantidad = 1) => { // 🆕 nueva función
    const { carrito } = get();
    const actualizado = carrito.map(p =>
      p.idProducto === idProducto
        ? { ...p, cantidad: p.cantidad + cantidad }
        : p
    );
    set({ carrito: actualizado });
  },


    eliminarDelCarrito: (idProducto) => {
        set((state) => ({
            carrito: state.carrito.filter(p => p.idProducto !== idProducto),
        }))
    },

    vaciarCarrito: () => set({carrito: []}),

    totalCarrito: () => { // 🆕 nueva función
    const { carrito } = get();
    return carrito.reduce((total, p) => total + p.precioProducto * p.cantidad, 0);
  },

    totalItems: () => {
      const { carrito } = get();
      return carrito.reduce((acc, item) => acc + item.cantidad, 0)
    }

}),
  {
    name: "carrito-storage",
    getStorage: () => localStorage,
  }
));

