import { Router } from "express";
import {
  crearPublicacion,
  getPublicaciones,
  getAllPostsController,
  getAllTagsController,
  obtenerDetalles,
  obtenerPublicacionesPorUsuario,
  cambiarEstadoPublicacion
} from "../controller/publicacion.controller.js";
import { actualizarPerfil, perfilUsuario } from "../controller/usuario.controller.js";
import { protegido, login, register } from "../controller/auth.controller.js";
import { verificarToken } from "../verificador.token.js";

export const petsRouter = Router();

//Si escoguiste http://localhost:3000/publicaciones, Omedeto! Aca puedes usar o definir las rutas a los endpoints
petsRouter.post("/publicaciones/crear", verificarToken, crearPublicacion);
petsRouter.get("/publicaciones", getPublicaciones);
petsRouter.get("/verDetalles/:pu_id", obtenerDetalles);
petsRouter.get("/perfil", verificarToken, perfilUsuario);
petsRouter.put("/perfil", verificarToken, actualizarPerfil);


petsRouter.get("/posts", getAllPostsController);
petsRouter.get("/my-posts", verificarToken, obtenerPublicacionesPorUsuario);
petsRouter.put("/my-posts/:pu_id", verificarToken, cambiarEstadoPublicacion);
petsRouter.get("/tags", getAllTagsController);

petsRouter.post("/auth/login", login);
petsRouter.post("/auth/register", register);
petsRouter.get("/auth/protegido", verificarToken, protegido);
