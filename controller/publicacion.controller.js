import * as modeloPublicacion from "../models/publicacion.model.js";
import jwt from "jsonwebtoken";
import { pool } from "../app.js";

//Tenemos muchas opciones, entre ellas se va a variar entre constantes con funciones anonimas asincronicas o funciones declaradas aincronicas
//Un simple retorno de las publicaciones
export const getPublicaciones = async (req, res) => {
  try {
    const publicaciones = await modeloPublicacion.obtenerPublicaciones();

    if (!publicaciones || publicaciones.length === 0) {
      return res.status(404).json({
        cod: 404,
        msj: "Problema al obtener las publicaciones.",
        datos: null,
      });
    }

    res.status(200).json({ cod: 200, msj: "Exito", datos: publicaciones });
  } catch (error) {
    console.error("Error obteniendo publicaciones: ", error);
    res.status(500).json({
      cod: 500,
      msj: "Error obteniendo las publicaciones",
      datos: null,
    });
  }
};

export async function crearPublicacion(req, res) {
  const cliente = await pool.connect();
  try {
    const {
      pu_titulo,
      pu_descripcion,
      pu_imagen,
      pu_ubicacion,
      pu_imagenes,
      pu_etiquetas,
    } = req.body;

    if (!pu_titulo || !pu_descripcion || !pu_imagen || !pu_ubicacion) {
      return res
        .status(400)
        .json({ cod: 400, msj: "Datos incompletos", datos: null });
    }

    await cliente.query("begin");

    const publicacion = await modeloPublicacion.insertarPublicacion(
      cliente,
      pu_titulo,
      pu_descripcion,
      pu_imagen,
      pu_ubicacion,
      req.id
    );

    let imagenes = [];
    if (Array.isArray(pu_imagenes) && pu_imagenes.length > 0) {
      imagenes = await modeloPublicacion.insertarImagenes(
        cliente,
        publicacion.pu_id,
        pu_imagenes
      );
    }

    let etiquetas = [];
    if (Array.isArray(pu_etiquetas) && pu_etiquetas.length > 0) {
      etiquetas = await modeloPublicacion.insertarEtiquetas(
        cliente,
        publicacion.pu_id,
        pu_etiquetas
      );
    }

    await cliente.query("commit");

    res.status(201).json({
      cod: 201,
      msj: "Publicacion creada!",
      datos: { ...publicacion, imagenes, etiquetas },
    });
  } catch (error) {
    await cliente.query("rollback");
    console.error("Error al crear una publicacion", error);
    res
      .status(500)
      .json({ cod: 500, msj: "Error al crear una publicacion", datos: null });
  } finally {
    cliente.release();
  }
}

export async function getAllTagsController(req, res) {
  try {
    const resultado = await modeloPublicacion.getAllTags();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function obtenerDetalles(req, res) {
  try {
    const { pu_id } = req.params;

    const detalles = await modeloPublicacion.visualizarDetalles(pu_id);

    if (!detalles || detalles.length === 0) {
      return res.status(404).json({
        cod: 404,
        msj: "Problema al obtener los detalles.",
        datos: null,
      });
    }

    const imagenes = await modeloPublicacion.obtenerListaImagenes(pu_id);

    if (!imagenes) {
      return res.status(404).json({
        cod: 404,
        msj: "Problema al obtener las imagenes.",
        datos: null,
      });
    }

    const etiquetas = await modeloPublicacion.obtenerListaEtiquetas(pu_id);

    if (!etiquetas || etiquetas.length === 0) {
      return res.status(404).json({
        cod: 404,
        msj: "Problema al obtener las etiquetas.",
        datos: null,
      });
    }

    res.status(200).json({
      cod: 200,
      msj: "Exito",
      datos: { ...detalles, imagenes, etiquetas },
    });
  } catch (error) {
    console.error("Error obteniendo los detalles de la publicacion: ", error);
    res.status(500).json({
      cod: 500,
      msj: "Error obteniendo los detalles",
      datos: null,
    });
  }
}

export const getAllPostsController = async (req, res) => {
  try {
    const publicaciones = await modeloPublicacion.getAllPosts();
    res.json(publicaciones);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
};
