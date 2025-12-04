// controller/usuario.controller.js
import * as modeloUsuario from "../models/usuario.model.js";

// Obtener perfil
export async function perfilUsuario(req, res) {
  try {
    const userId = req.id; // ID del token

    const datos = await modeloUsuario.obtenerPerfilUsuario(userId);

    if (!datos) {
      return res.status(404).json({ cod: 404, msj: "Usuario no encontrado", datos: null });
    }

    return res.json({ cod: 200, msj: "Perfil obtenido", datos });
  } catch (error) {
    console.error("Error en perfilUsuario: ", error);
    return res.status(500).json({ cod: 500, msj: "Error al obtener perfil", datos: null });
  }
}

// Actualizar perfil
export const actualizarPerfil = async (req, res) => {
  try {
    const userId = req.id; // ID del token
    const { us_nombre, us_apellido, us_contacto } = req.body; // correo NO se toca

    const datosActualizados = await modeloUsuario.actualizarPerfilUsuario(
      userId,
      us_nombre,
      us_apellido,
      us_contacto
    );

    res.json({ cod: 200, msj: "Perfil actualizado", datos: datosActualizados });
  } catch (error) {
    console.error("Error en actualizarPerfil: ", error);
    res.status(500).json({ cod: 500, msj: "Error actualizando perfil", datos: null });
  }
};
