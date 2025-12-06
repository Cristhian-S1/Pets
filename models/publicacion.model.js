import { pool } from "../app.js";

//El pool es la variable definida en app.js para conectarse al esquema postgresql

//Consultas, logicas, validacioes, todo lo maneja el modelo!
//No usamos ORM por simplicidad ante lo que ofrece las consultas SQL, DI NO A ORM!
export const obtenerPublicaciones = async () => {
  const resultado = await pool.query(`select pu_id, pu_titulo,
       pu_descripcion,
       pu_image,
       pu_fecha,
       pu_estado,
       pu_ubicacion,
       us_nombre,
       us_contacto
  from publicacion
  join usuarios
using ( us_id )
 where pu_eliminacion is false;`);
  return resultado.rows;
};

export async function insertarPublicacion(
  cliente,
  pu_titulo,
  pu_descripcion,
  pu_imagen,
  pu_ubicacion,
  us_id
) {
  const resultado = await cliente.query(
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

export async function insertarImagenes(cliente, pu_id, urls) {
  const results = [];

  for (const url of urls) {
    const { rows } = await cliente.query(
      `INSERT INTO publicacion_imagen (pu_id, pui_url)
       VALUES ($1, $2)
       RETURNING *;`,
      [pu_id, url]
    );
    results.push(rows[0]);
  }

  return results;
}

export async function insertarEtiquetas(cliente, pu_id, etiquetas) {
  const results = [];

  for (const et_id of etiquetas) {
    const { rows } = await cliente.query(
      `INSERT INTO publicacion_etiqueta (pu_id, et_id)
       VALUES ($1, $2)
       RETURNING *;`,
      [pu_id, et_id]
    );
    results.push(rows[0]);
  }

  return results;
}

export async function getAllTags() {
  const resultado = await pool.query(`select * from etiqueta`);
  return resultado.rows;
}

export async function visualizarDetalles(pu_id) {
  const resultado = await pool.query(
    `select pu_id, pu_titulo, 
    pu_descripcion, pu_image, pu_fecha, pu_estado, pu_ubicacion from publicacion
where pu_id = $1`,
    [pu_id]
  );

  return resultado.rows[0];
}

export async function obtenerListaImagenes(pu_id) {
  const resultado = await pool.query(
    `select * from publicacion_imagen where pu_id = $1`,
    [pu_id]
  );

  return resultado.rows;
}

export async function obtenerListaEtiquetas(pu_id) {
  const resultado = await pool.query(
    `select et_nombre from etiqueta
join publicacion_etiqueta using(et_id) where pu_id = $1`,
    [pu_id]
  );

  return resultado.rows;
}

export async function getAllPosts() {
  const resultado = await pool.query(`
    SELECT 
        p.*,
        u.us_nombre AS us_nombre_completo,
        u.us_contacto,
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'et_id', et.et_id,
                        'et_nombre', et.et_nombre
                    )
                )
                FROM etiqueta et
                WHERE et.et_id IN (
                    SELECT pe.et_id
                    FROM publicacion_etiqueta pe
                    WHERE pe.pu_id = p.pu_id
                )
            ), '[]'
        ) AS etiquetas
    FROM usuarios u 
    JOIN publicacion p ON u.us_id = p.us_id
    GROUP BY 
        p.pu_id, us_nombre_completo, u.us_contacto
        order by pu_fecha desc
  `);
  return resultado.rows;
}


export async function obtenerPublicacionesPorUsuario(cliente, idUsuario) {
  const query = `
    SELECT
        p.pu_id, p.pu_titulo, p.pu_descripcion, p.pu_image, p.pu_ubicacion,
        p.pu_fecha, p.us_id,p.pu_estado
    FROM 
        publicacion p
    WHERE 
        p.us_id = $1
    ORDER BY 
        p.pu_fecha DESC;
  `;

  const res = await cliente.query(query, [idUsuario]);
  return res.rows;
}

export async function actualizarEstadoPublicacion(pu_id, pu_estado) {
  try {
    const resultado = await pool.query(
      `UPDATE publicacion
       SET pu_estado = $1
       WHERE pu_id = $2
       RETURNING pu_id, pu_estado`,
      [pu_estado, pu_id]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error("Error en modelo actualizarEstadoPublicacion:", error);
    throw error;
  }
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