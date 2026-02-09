

// export const swalCustom = Swal.mixin({
//   background: "rgba(255, 240, 245, 0.95)", // fondo rosado muy suave
//   color: "#2c2c2c",                         // texto oscuro
//   confirmButtonColor: "#ca1c73",            // tu color principal
//   cancelButtonColor: "#999",
//   buttonsStyling: true,
//   customClass: {
//     popup: "rounded-4 shadow-lg border border-pink-200", // bordes redondeados
//     confirmButton: "btn btn-pink text-white px-4 py-2",
//     cancelButton: "btn btn-secondary px-4 py-2",
//   },
// });

import Swal from "sweetalert2";

export const swalCustom = Swal.mixin({
  background: "var(--color-beige-claro)",  // fondo del modal
  color: "var(--color-verde-bosque)",      // texto verde bosque
  confirmButtonColor: "var(--color-dorado)", // botón OK dorado
  buttonsStyling: true,
  customClass: {
    popup: "rounded-4 shadow-lg border border-var(--color-verde-bosque) p-4", // borde verde bosque, sombra
    confirmButton: "text-white px-4 py-2", // texto blanco en botón dorado
    cancelButton: "btn btn-outline-success px-4 py-2", // si quieres cancel, verde bosque
    title: "fw-bold", // título en negrita
    content: "fs-6",  // opcional: tamaño del contenido
  },
});