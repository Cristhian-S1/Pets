import { Router } from "express";
import {
  crearPublicacion,
  getPublicaciones, 
  getAllPostsController, 
  getAllTagsController,
} from "../controller/publicacion.controller.js";
import { protegido, login, register } from "../controller/auth.controller.js";
import { verificarToken } from "../verificador.token.js";

export const petsRouter = Router();

//Si escoguiste http://localhost:3000/publicaciones, Omedeto! Aca puedes usar o definir las rutas a los endpoints
petsRouter.post("/publicaciones/crear", verificarToken, crearPublicacion);
petsRouter.get("/publicaciones", getPublicaciones);

petsRouter.get("/posts", getAllPostsController);
petsRouter.get("/tags", getAllTagsController);

petsRouter.post("/auth/login", login);
petsRouter.post("/auth/register", register);
petsRouter.get("/auth/protegido", verificarToken, protegido);
