import "dotenv/config";
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const header = req.headers.authorization || "";
const [scheme, token] = header.split(" ");

if (scheme !== "Bearer" || !token) {
    return res.status(401).json({error: "Falta token (Bearer)"});
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
        idUsuario: decoded.sub,
        rol: decoded.rol,
    }

    return next();
} catch (err) {
  console.log("[AUTH VERIFY ERROR]", err?.name, err?.message);
  return res.status(401).json({ error: "Token invalido o expirado" });
}




}