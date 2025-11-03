import { create } from "zustand";

export const useCarritoStore = create((set, get) => ({
    carrito:[],

    agregarAlCarrito: (producto, cantidad) => {
        const {carrito} = get()
        const existente = carrito.find(p => p.idProducto === producto.idProducto) 

        if (existente) {
            const actualizado = carrito.map(p => p.idProducto === p.idProducto ? {...p, cantidad: p.cantidad + cantidad}
                : p
            )
            set({carrito: actualizado})
        } else {
            set({ carrito: [...carrito, {...producto, cantidad}] })
        }
    },

    eliminarDelCarrito: (idProducto) => {
        set((state) => ({
            carrito: state.carrito.filter(p => p.idProducto !== idProducto),
        }))
    },

    vaciarCarrito: () => set({carrito: []})
}));