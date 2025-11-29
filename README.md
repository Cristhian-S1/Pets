# IMPORTANTE

DEFINIR EL archivo .ENV con los datos de su BD y la clave que desee para el JWT

- USER=nombre-queso
- HOST=localhost
- DATABASE=idk PASSWORD=clave-queso-www
- PORT=5432

- SECRET_JWT_KEY=clave-queso

# Pets

Repositorio de Backend para las mascotas perdidas.

# Comandos

npm install --> carga las dependencias

npm run dev --> ejecute el proyecto utilizando "nodemon" para cambios dinamicos en ejecucion, esto mediante el script que esta en el package.json

# Consideraciones

- CAMBIAR LOS DATOS DE CONEXION A SU PROPIA BASE DE DATOS POSTGRESQL
- api.http es un archivo para probar los endpoints y este requiere de la extencion REST Client.
- Se utiliza MVC con un middleware global
- No se utiliza Zod(validador de datos entrates, similar a class-validator usado en nestjs pero sin ORM) por simplicidad

# Esquema e inserts

```sql

drop table usuarios;
drop table publicacion;
drop table etiqueta;
drop table publicacion_etiqueta;
drop table comentario;
drop table foro;
drop table integrantes;
drop table reacciones;

create table usuarios (
   us_id         integer generated always as identity primary key,
   us_nombre     varchar(56),
   us_apellido   varchar(56),
   us_email      varchar(126) unique,
   us_contrasena varchar(254),
   us_contacto   integer
);

create table publicacion (
   pu_id          integer generated always as identity primary key,
   pu_titulo      varchar(126),
   pu_descripcion varchar(254),
   pu_image       varchar(254),
   pu_fecha       date,
   pu_eliminacion boolean,
   pu_estado      boolean,
   pu_ubicacion   varchar(254),

   us_id          integer,
   fo_id          integer
);

create table publicacion_imagen(
   pui_id integer generated always as identity primary key,
   pui_url varchar(254),

   pu_id integer
);

create table etiqueta (
   et_id     integer generated always as identity primary key,
   et_nombre varchar(56)
);

create table publicacion_etiqueta (
   puet_id integer generated always as identity primary key,

   et_id   integer,
   pu_id   integer
);

create table comentario (
   cm_id        integer generated always as identity primary key,
   cm_contenido varchar(254),
   cm_fecha     date,

   us_id        integer,
   pu_id        integer
);

create table foro (
   fo_id          integer generated always as identity primary key,
   fo_titulo      varchar(126),
   fo_descripcion varchar(254),
   fo_eliminacion boolean,

   us_id          integer
);

create table integrantes (
   in_id    integer generated always as identity primary key,
   in_fecha date,

   us_id    integer,
   fo_id    integer
);

-- Asociar restricciones para que un usuario solo reaccione
create table reacciones (
   re_id integer generated always as identity primary key,

   us_id integer,
   pu_id integer
);

-- Seccion de poblacion !

-- 1. Insertar 10 usuarios
INSERT INTO usuarios (us_nombre, us_apellido, us_email, us_contrasena, us_contacto) VALUES
('María', 'Gómez', 'maria@gomez.com', 'pass123', 911111111),
('Carlos', 'López', 'carlos@lopez.com', 'pass456', 922222222),
('Ana', 'Martínez', 'ana@martinez.com', 'pass789', 933333333),
('Pedro', 'Rodríguez', 'pedro@rodriguez.com', 'pass012', 944444444),
('Laura', 'Hernández', 'laura@hernandez.com', 'pass345', 955555555),
('Javier', 'Díaz', 'javier@diaz.com', 'pass678', 966666666),
('Isabel', 'Moreno', 'isabel@moreno.com', 'pass901', 977777777),
('Ricardo', 'Jiménez', 'ricardo@jimenez.com', 'pass234', 988888888),
('Elena', 'Torres', 'elena@torres.com', 'pass567', 999999999),
('Diego', 'Ramírez', 'diego@ramirez.com', 'pass890', 900000000);

-- 2. Insertar etiquetas
INSERT INTO etiqueta (et_nombre) VALUES
('Perro'), ('Gato'), ('Pequeño'), ('Mediano'), ('Grande'),
('Blanco'), ('Negro'), ('Marrón'), ('Dorado'), ('Siamés'),
('Pastor Alemán'), ('Persa'), ('Canario'), ('Loro');

-- 3. Insertar 2 foros
INSERT INTO foro (fo_titulo, fo_descripcion, fo_eliminacion, us_id) VALUES
('Foro Mascotas Bogotá', 'Comunidad de mascotas perdidas en Bogotá', false, 1),
('Foro Mascotas Medellín', 'Comunidad de mascotas perdidas en Medellín', false, 3);

-- 4. Insertar 12 publicaciones (4 asociadas a foros)
INSERT INTO publicacion (pu_titulo, pu_descripcion, pu_image, pu_fecha, pu_eliminacion, pu_estado, pu_ubicacion, us_id, fo_id) VALUES
('Bobby desaparecido', 'Perro pastor alemán perdido en parque nacional', 'https://example.com/bobby.jpg', '2023-05-10', false, false, 'Arica', 2, 1),
('Gato siamés extraviado', 'Max desapareció cerca del centro comercial', 'https://example.com/max.jpg', '2023-05-11', false, false,'Arica', 4, 1),
('Loro hablador', 'Perdió su jaula en el barrio Laureles', 'https://example.com/loro.jpg', '2023-05-12', false, false,'Arica', 5, 2),
('Canario amarillo', 'Voló de su jaula en Belén', 'https://example.com/canario.jpg', '2023-05-13', false, false,'Arica', 6, 2),
('Persa blanco', 'Se asustó con los fuegos artificiales', 'https://example.com/persa.jpg', '2023-05-14', false, false,'Arica', 7, NULL),
('Cachorro dorado', 'Extraviado en metro Estadio', 'https://example.com/cachorro.jpg', '2023-05-15', false, false,'Arica', 8, NULL),
('Gato negro', 'Visto última vez en jardín botánico', 'https://example.com/negro.jpg', '2023-05-16', false, false,'Arica', 9, NULL),
('Perro marrón', 'Desapareció en complejo deportivo', 'https://example.com/marron.jpg', '2023-05-17', false, false,'Arica', 10, NULL),
('Hámster', 'Escapó de su jaula en zona norte', 'https://example.com/hamster.jpg', '2023-05-18', false, false,'Arica', 1, NULL),
('Conejo enano', 'Se perdió en el parque de los pies descalzos', 'https://example.com/conejo.jpg', '2023-05-19', false, false,'Arica', 2, NULL),
('Tortuga', 'Desapareció del jardín de la casa', 'https://example.com/tortuga.jpg', '2023-05-20', false, false,'Arica', 3, NULL),
('Perro salchicha', 'Last seen near Universidad Nacional', 'https://example.com/salchicha.jpg', '2023-05-21', false, false,'Arica', 4, NULL);

-- 5. Asignar etiquetas a publicaciones
INSERT INTO publicacion_etiqueta (et_id, pu_id) VALUES
(11, 1), (5, 1), (8, 1),   -- Pastor Alemán, Grande, Marrón
(10, 2), (3, 2), (6, 2),   -- Siamés, Pequeño, Blanco
(14, 3), (3, 3),           -- Loro, Pequeño
(13, 4), (3, 4),           -- Canario, Pequeño
(12, 5), (6, 5),           -- Persa, Blanco
(9, 6), (3, 6),            -- Dorado, Pequeño
(2, 7), (7, 7),            -- Gato, Negro
(1, 8), (8, 8),            -- Perro, Marrón
(3, 9), (6, 9),            -- Pequeño, Blanco
(3, 10), (8, 10),          -- Pequeño, Marrón
(3, 11), (8, 11),          -- Pequeño, Marrón
(1, 12), (4, 12), (8, 12); -- Perro, Mediano, Marrón

-- 6. Insertar integrantes a foros
INSERT INTO integrantes (in_fecha, us_id, fo_id) VALUES
('2023-01-15', 1, 1), ('2023-01-16', 2, 1), ('2023-01-17', 3, 1), ('2023-01-18', 4, 1),
('2023-02-01', 3, 2), ('2023-02-02', 5, 2), ('2023-02-03', 6, 2), ('2023-02-04', 7, 2);

-- 7. Insertar comentarios (mínimo 2 por publicación)
INSERT INTO comentario (cm_contenido, cm_fecha, us_id, pu_id) VALUES
('Lo vi ayer en el parque', '2023-05-22', 3, 1),
('Contacten al número 311555555', '2023-05-23', 4, 1),
('Revisen en la perrera municipal', '2023-05-22', 5, 2),
('Acabo de publicar en redes', '2023-05-23', 6, 2),
('Estaba en el techo de mi casa', '2023-05-24', 7, 3),
('Lo tengo en mi jardín', '2023-05-25', 8, 3),
('Voló hacia el norte', '2023-05-24', 9, 4),
('Se posó en mi ventana', '2023-05-25', 10, 4),
('Merodea por el supermercado', '2023-05-26', 1, 5),
('Lo alimenté ayer', '2023-05-27', 2, 5),
('Está con collar azul', '2023-05-26', 3, 6),
('Duerme en el parqueadero', '2023-05-27', 4, 6),
('Juega con otros gatos', '2023-05-28', 5, 7),
('Tiene un cascabel', '2023-05-29', 6, 7),
('Corre hacia el sur', '2023-05-28', 7, 8),
('Tiene dueños buscándolo', '2023-05-29', 8, 8),
('Está en mi jardín', '2023-05-30', 9, 9),
('Comió de mi huerto', '2023-05-31', 10, 9),
('Salta muy alto', '2023-05-30', 1, 10),
('Se metió bajo la casa', '2023-05-31', 2, 10),
('Nadaba en la fuente', '2023-06-01', 3, 11),
('La vi en el barrio', '2023-06-02', 4, 11),
('Corría tras una pelota', '2023-06-01', 5, 12),
('Estaba en la tienda de mascotas', '2023-06-02', 6, 12);

-- 8. Insertar reacciones (mínimo 3 por publicación)
INSERT INTO reacciones (us_id, pu_id) VALUES
(1,1), (2,1), (3,1), (4,1),
(5,2), (6,2), (7,2), (8,2),
(9,3), (10,3), (1,3), (2,3),
(3,4), (4,4), (5,4), (6,4),
(7,5), (8,5), (9,5),
(10,6), (1,6), (2,6),
(3,7), (4,7), (5,7),
(6,8), (7,8), (8,8),
(9,9), (10,9), (1,9),
(2,10), (3,10), (4,10),
(5,11), (6,11), (7,11),
(8,12), (9,12), (10,12);

```

### Datos cargados en la base

- **Usuarios:** 10 usuarios con datos completos
- **Etiquetas:** 14 etiquetas relacionadas con características de animales
- **Foros:** 2 foros con diferentes administradores

**Publicaciones:**

- 12 publicaciones de mascotas perdidas
- 4 publicaciones asociadas a foros (2 por foro)
- 8 publicaciones sin foro
- **Publicación–Etiqueta:** relaciones múltiples para caracterizar cada animal

**Integrantes:** 4 usuarios en cada foro (8 registros total)  
**Comentarios:** 2 comentarios por publicación (24 en total)  
**Reacciones:** mínimo 3 reacciones por publicación (algunas tienen 4)

Todas las publicaciones están **activas** (`pu_estado = true`) y **no eliminadas** (`pu_eliminacion = false`).  
Las fechas están en orden cronológico y las imágenes usan URLs de ejemplo.
