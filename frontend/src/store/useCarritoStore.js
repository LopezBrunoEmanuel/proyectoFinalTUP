import { create } from "zustand";

export const useCarritoStore = create((set, get) => ({
    carrito:[],

    agregarAlCarrito: (producto, cantidad = 1) => {
        if (cantidad <=0) return;
        const {carrito} = get()
        const existente = carrito.find(p => p.idProducto === producto.idProducto) 

        if (existente) {
            const actualizado = carrito.map(p => p.idProducto === producto.idProducto ? {...p, cantidad: p.cantidad + cantidad}
                : p
            )
            set({carrito: actualizado})
        } else {
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


}));

