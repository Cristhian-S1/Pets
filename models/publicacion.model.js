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
    LEFT JOIN publicacion p ON u.us_id = p.us_id
    GROUP BY 
        p.pu_id, us_nombre_completo, u.us_contacto
  `);
  return resultado.rows;
}

export async function getAllTags() {
  const resultado = await pool.query(`select * from etiqueta`);
  return resultado.rows;
}
