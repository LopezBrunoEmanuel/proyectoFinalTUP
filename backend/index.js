import express from "express";
import cors from "cors";
import "dotenv/config"

import productosRoutes from "./routes/productos.routes.js"
import usuariosRoutes from "./routes/usuarios.routes.js"
import loginRoutes from "./routes/login.routes.js";

const app = express();

app.use((req,res,next)=>{
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});
app.use(cors());
app.use(express.json());
app.use("/productos", productosRoutes)
app.use("/usuarios", usuariosRoutes)
app.use("/api/login", loginRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Bienvenido a la db del vivero Patio1220");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});