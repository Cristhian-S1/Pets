import { pool } from "../app.js";

// Obtener los datos del perfil del usuario por ID
export async function obtenerPerfilUsuario(us_id) {
  const resultado = await pool.query(
    `
    SELECT 
      us_id,
      us_nombre,
      us_apellido,
      us_email,
      us_contacto
    FROM usuarios
    WHERE us_id = $1;
    `,
    [us_id]
  );

  return resultado.rows[0];
}

// (Opcional) Obtener todos los usuarios, por si listaras perfiles
export async function obtenerUsuarios() {
  const resultado = await pool.query(`
    SELECT 
      us_id,
      us_nombre,
      us_apellido,
      us_email,
      us_contacto
    FROM usuarios;
  `);

  return resultado.rows;
}
export async function actualizarPerfilUsuario(us_id, us_nombre, us_apellido, us_contacto) {
  try {
    const resultado = await pool.query(
      `UPDATE usuarios
       SET us_nombre = $1,
           us_apellido = $2,
           us_contacto = $3
       WHERE us_id = $4
       RETURNING us_id, us_nombre, us_apellido, us_email, us_contacto`,
      [us_nombre, us_apellido, us_contacto, us_id]
    );
    return resultado.rows[0]; // devuelve usuario actualizado
  } catch (error) {
    console.error("Error en modelo actualizarPerfilUsuario:", error);
    throw error;
  }
}