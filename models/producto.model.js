import { pool } from "../app.js";

//El pool es la variable definida en app.js para conectarse al esquema postgresql

//Consultas, logicas, validacioes, todo lo maneja el modelo!
//No usamos ORM por simplicidad ante lo que ofrece las consultas SQL, DI NO A ORM!
export const obtenerPublicaciones = async () => {
  const resultado = await pool.query(`select pu_titulo,
       pu_descripcion,
       pu_image,
       pu_fecha,
       pu_estado,
       pu_ubicacion,
       us_nombre
       || ' '
       || us_apellido as nombre,
       us_contacto
  from publicacion
  join usuarios
using ( us_id )
 where pu_eliminacion is false;`);
  return resultado.rows;
};

export async function insertarPublicacion(
  pu_titulo,
  pu_descripcion,
  pu_imagen,
  pu_ubicacion,
  us_id
) {
  const resultado = await pool.query(
    `insert into publicacion (   
   pu_titulo,
   pu_descripcion,
   pu_image,
   pu_fecha,
   pu_eliminacion,
   pu_estado,
   pu_ubicacion,
   us_id,
   fo_id) values($1, $2, $3, current_date, false, false,$4, $5, null) returning *`,
    [pu_titulo, pu_descripcion, pu_imagen, pu_ubicacion, us_id]
  );

  return resultado.rows[0];
}
