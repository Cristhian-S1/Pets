import { pool } from "../app.js";

export const loginModelo = async (us_email, us_contrasena) => {
  const result = await pool.query(
    `select * from usuarios where us_email = $1 
        and us_contrasena = $2`,
    [us_email, us_contrasena]
  );
  return result.rows[0];
};

export async function registerCheck(us_email){
  const result = await pool.query(
    `SELECT us_id FROM usuarios WHERE us_email = $1`, [us_email]
  );
  return result.rows[0];
}

export async function register(us_nombre, us_email, us_contrasena, us_contacto){
  const result = await pool.query(
        `INSERT INTO usuarios (us_nombre, us_email, us_contrasena, us_contacto) 
              VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        us_nombre,
        us_email,
        us_contrasena,
        us_contacto,
      ]
  )
  return result.rows[0];
}