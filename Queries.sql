---- ==================================================================================== ----


---- ==================================================================================== ----
---- Creacion de la tabla para el manejo de las sessiones de usuarios
CREATE TABLE system_usuarios_sesiones (
    id serial,
    usuario_id integer,
    socket_id character varying(40),
    token text,        
    fecha_registro timestamp without time zone DEFAULT now(),
    CONSTRAINT "system_usuarios_sesiones_index01" PRIMARY KEY(id),
    CONSTRAINT "foreign_key01" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
);


COMMENT ON TABLE "public"."system_usuarios_sesiones"
IS 'Tabla que Registra las Sesiones de los Usuarios';

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."id"
IS 'Identificador y llave primaria del registro';

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."usuario_id"
IS 'Identificador del Usuario ';

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."socket_id"
IS 'Socket Asociado a la conexion del Usuario';

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."token"
IS 'Token de Autenticacion de la Sesion';

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."fecha_registro"
IS 'Fecha Registro';

---- ==================================================================================== ----


---- ==================================================================================== ----
---- Agreagr Usuarios id a la tabla de Operarios Bodegas

ALTER TABLE operarios_bodega ADD usuario_id integer DEFAULT NULL;

ALTER TABLE operarios_bodega ADD estado character(1) DEFAULT 1;

COMMENT ON COLUMN "public"."operarios_bodega"."usuario_id"
IS 'Usuario del Sistema al que corresponde el Operario de Bodega';

ALTER TABLE operarios_bodega ADD CONSTRAINT operarios_bodega_system_usuarios_fkey FOREIGN KEY (usuario_id) REFERENCES system_usuarios(usuario_id) ON UPDATE CASCADE ON DELETE CASCADE;

---- ==================================================================================== ----


---- ==================================================================================== ----
---- Crear tabla de zonas 

CREATE TABLE "public"."zonas_bodegas" (
  "id" SERIAL,   
  "descripcion" VARCHAR(10) NOT NULL, 
  "estado" character(1) DEFAULT 1,
  CONSTRAINT "zonas_bodegas_pkey" PRIMARY KEY("id")
) WITHOUT OIDS;

COMMENT ON TABLE "public"."zonas_bodegas"
IS 'Tabla donde se guardan las zonas de las bodegas';

COMMENT ON COLUMN "public"."zonas_bodegas"."id"
IS 'Identificador (PK) de la zona';

COMMENT ON COLUMN "public"."zonas_bodegas"."descripcion"
IS 'Descripcion de la Zona';

COMMENT ON COLUMN "public"."zonas_bodegas"."estado"
IS 'Estado de la Zona 0-Inactiva, 1-Activa';

--- Registro de la tabla zonas_bodegas

INSERT INTO "public"."zonas_bodegas" ("id", "descripcion", "estado")
VALUES (1, 'Bogotá', '1');

INSERT INTO "public"."zonas_bodegas" ("id", "descripcion", "estado")
VALUES (2, 'Cali', '1');

INSERT INTO "public"."zonas_bodegas" ("id", "descripcion", "estado")
VALUES (3, 'Costa', '1');

INSERT INTO "public"."zonas_bodegas" ("id", "descripcion", "estado")
VALUES (4, 'Medellín', '1');

---- ==================================================================================== ----


---- ==================================================================================== ----
---- Agregar columna zona_id a la tabla de bodegas

	
ALTER TABLE bodegas 
ADD COLUMN zona_id INTEGER;

COMMENT ON COLUMN "bodegas"."zona_id" 
	IS 'Identificador (FK) de la zona a la que pertence la bodega (farmacia)';

ALTER TABLE bodegas ADD CONSTRAINT bodega_zona_id_fkey
    FOREIGN KEY (zona_id)
    REFERENCES public.zonas_bodegas(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

---- ==================================================================================== ----


---- ==================================================================================== ----
---- Agregar columna email a la tbla de usuarios

ALTER TABLE system_usuarios ADD email character varying(60) DEFAULT NULL;

COMMENT ON COLUMN "public"."system_usuarios"."email"
IS 'Correo Electronico del Usuario';
---- ==================================================================================== ----


---- ==================================================================================== ----
---- Agregar columna lock_screen a la tbla de usuarios

ALTER TABLE system_usuarios_sesiones ADD lock_screen char(1) DEFAULT NULL;

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."lock_screen"
IS '0 = False, es decir No esta bloqueado, 1 = true, es decir esta bloqueado';

---- ==================================================================================== ----
---- Agregar columna estado a la tbla tmp de despacho farmacias inv_bodegas_movimiento_tmp_despachos_farmacias 

ALTER TABLE inv_bodegas_movimiento_tmp_despachos_farmacias ADD estado char(1) DEFAULT '0';

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_tmp_despachos_farmacias"."estado"
IS '0 = Indica que el documento esta siendo separado , 1 = Indica que el documento se ha terminado de separar correctamente, 2 = Docuemnto esta siendo auditado ';

---- ==================================================================================== ----
---- Agregar columna estado a la tbla tmp de despacho clientes inv_bodegas_movimiento_tmp_despachos_farmacias 

ALTER TABLE inv_bodegas_movimiento_tmp_despachos_clientes ADD estado char(1) DEFAULT '0';

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_tmp_despachos_clientes"."estado"
IS '0 = Indica que el documento esta siendo separado , 1 = Indica que el documento se ha terminado de separar correctamente, 2 = Docuemnto esta siendo auditado ';

---- ==================================================================================== ----
---- Agregar columna auditado a la tbla inv_bodegas_movimiento_tmp_d que indica si el producto  ha sido auditado

ALTER TABLE inv_bodegas_movimiento_tmp_d ADD auditado char(1) DEFAULT '0';

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_tmp_d"."auditado"
IS ' Indica si el producto ha sido auditado o no 0 = false Producto No Auditado, 1 = true Product Auditado ';

---- ==================================================================================== ----
---- Agregar columnas a tabla inv_rotulo_caja 

-- numero_caja
ALTER TABLE inv_rotulo_caja ADD numero_caja integer DEFAULT null;

COMMENT ON COLUMN "public"."inv_rotulo_caja"."numero_caja"
IS ' Hace referencia al numero de la caja ';

-- caja_cerrada
ALTER TABLE inv_rotulo_caja ADD caja_cerrada char(1) DEFAULT '0';

COMMENT ON COLUMN "public"."inv_rotulo_caja"."caja_cerrada"
IS ' Determina si la caja esta cerrada 0= FALSE 1= TRUE ';

-- imprimio_rotulo 
ALTER TABLE inv_rotulo_caja ADD imprimio_rotulo char(1) DEFAULT '0';

COMMENT ON COLUMN "public"."inv_rotulo_caja"."imprimio_rotulo"
IS ' Determina si se imprimió rotulo 0= FALSE 1= TRUE ';


---- ==================================================================================== ----
---- Agregar columnas a tabla inv_bodegas_movimiento_tmp_d 

-- numero_caja
ALTER TABLE inv_bodegas_movimiento_tmp_d ADD numero_caja integer DEFAULT null;

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_tmp_d"."numero_caja"
IS ' Hace referencia al numero de la caja en donde va el producto';

---- ==================================================================================== ----
---- Agregar columnas a tabla inv_bodegas_movimiento_tmp_justificaciones_pendientes 

-- justificacion_auditor
ALTER TABLE inv_bodegas_movimiento_tmp_justificaciones_pendientes ADD justificacion_auditor TEXT DEFAULT null;

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_tmp_justificaciones_pendientes"."justificacion_auditor"
IS 'Justificacion del auditor';


---- ==================================================================================== ----
---- Agregar columna a tabla solicitud_Bodega_principal_aux 

-- observacion
ALTER TABLE "public"."solicitud_bodega_principal_aux" ADD observacion TEXT DEFAULT null;

COMMENT ON COLUMN "public"."solicitud_bodega_principal_aux"."observacion"
IS 'Observacion del pedido';


---- ==================================================================================== ----
---- Agregar columna a tabla system_usuarios_sesiones 

-- device
ALTER TABLE "public"."system_usuarios_sesiones" ADD device character varying(40) DEFAULT null;

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."device"
IS 'Dispositivo desde donde se conectan al servidor';


---- ==================================================================================== ----
---- Agregar columna a tabla compras_ordenes_pedidos 

-- sw_orden_compra_finalizada
ALTER TABLE "public"."compras_ordenes_pedidos" ADD sw_orden_compra_finalizada char(1) DEFAULT '0';

COMMENT ON COLUMN "public"."compras_ordenes_pedidos"."sw_orden_compra_finalizada"
IS 'Indica si la orden ya fue digitada completamente 0=>false (Orde Compra en proceso de digitacion) 1=>true (Orden Compra Finalizada) ';


---- ==================================================================================== ----
---- Agregar Comentario a  tabla compras_ordenes_pedidos 

COMMENT ON COLUMN "public"."compras_ordenes_pedidos"."estado"
IS 'Estado Orden de Compra 0 => Recibida (Ingresada en Bodega), 1 => Activa, 2 => Anulada ';


---- ==================================================================================== ----
---- Crear Tabla observaciones_ordenes_compras

CREATE TABLE "public"."observaciones_ordenes_compras" (
  "id" SERIAL, 
  "codigo" CHAR(4) NOT NULL, 
  "descripcion" VARCHAR(60) NOT NULL, 
  "usuario_id" INTEGER NOT NULL,
  "fecha_registro" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
  CONSTRAINT "observaciones_ordenes_compras_pkey" PRIMARY KEY("id"),
   FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
) WITHOUT OIDS;

COMMENT ON TABLE "public"."observaciones_ordenes_compras"
IS 'Tabla de las observaciones de los detalles de ordenes de compras';

COMMENT ON COLUMN "public"."observaciones_ordenes_compras"."id"
IS 'Identificador (PK) de la obsevación';

COMMENT ON COLUMN "public"."observaciones_ordenes_compras"."codigo"
IS 'Código de la observación';

COMMENT ON COLUMN "public"."observaciones_ordenes_compras"."descripcion"
IS 'Descripción de la observación';

COMMENT ON COLUMN "public"."observaciones_ordenes_compras"."usuario_id"
IS 'Usuario que registra la observacion';

COMMENT ON COLUMN "public"."observaciones_ordenes_compras"."fecha_registro"
IS 'Fecha de Registro';


---- ==================================================================================== ----
---- Crear Tabla novedades_ordenes_compras

CREATE TABLE "public"."novedades_ordenes_compras" (
  "id" SERIAL, 
  "item_id" INTEGER NOT NULL,   
  "observacion_orden_compra_id" INTEGER NOT NULL, 
  "descripcion" TEXT, 
  "fecha_posible_envio" DATE, 
  "usuario_id" INTEGER NOT NULL,
  "fecha_registro" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
  CONSTRAINT "novedades_ordenes_compras_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "novedades_ordenes_compras_item_id_fkey" FOREIGN KEY ("item_id")
    REFERENCES "public"."compras_ordenes_pedidos_detalle"("item_id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE, 
  CONSTRAINT "novedades_ordenes_compras_observacion_orden_compra_id_fkey" FOREIGN KEY ("observacion_orden_compra_id")
    REFERENCES "public"."observaciones_ordenes_compras"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
) WITHOUT OIDS;

COMMENT ON TABLE "public"."novedades_ordenes_compras"
IS 'Tabla que relaciona los detalles de las ordenes de compra con las observaciones (de detalle) de ordenes de compras';

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."id"
IS 'Identificación (PK) de la novedad (del detalle) de la orden de compra';

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."item_id"
IS 'Identificador del producto en la orden de compra';

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."observacion_orden_compra_id"
IS 'Identificador de la observación (de detalle) de orden de compra';

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."descripcion"
IS 'Descripción de la novedad';

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."fecha_posible_envio"
IS 'Fecha posible envío (en el caso de que el campo "observacion_orden_compra_id" sea igual a "1" es decir "Agotado")';

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."usuario_id"
IS 'Usuario que realiza la novedad';

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."fecha_registro"
IS 'Fecha en que se realiza la novedad';


ALTER TABLE novedades_ordenes_compras ADD CONSTRAINT "novedades_ordenes_compras_UNIQUE" UNIQUE ("item_id");

---- ==================================================================================== ----
---- Crear Tabla archivos novedades_ordenes_compras

CREATE TABLE "public"."archivos_novedades_ordenes_compras" (
  "id" serial NOT NULL, 
  "novedad_orden_compra_id" INTEGER NOT NULL, 
  "nombre_archivo" VARCHAR(50) NOT NULL, 
  "descripcion_archivo" TEXT , 
  "usuario_id" INTEGER NOT NULL,
  "fecha_registro" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
  CONSTRAINT "archivos_novedades_ordenes_compras_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "archivos_novedades_ordenes_compras_novedad_orden_compra_id_fkey" FOREIGN KEY ("novedad_orden_compra_id")
    REFERENCES "public"."novedades_ordenes_compras"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
    FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
) WITHOUT OIDS;

COMMENT ON TABLE "public"."archivos_novedades_ordenes_compras"
IS 'Tabla que relaciona los archivos adjuntos con las novedades (de los detalles) de las ordenes de compra';

COMMENT ON COLUMN "public"."archivos_novedades_ordenes_compras"."id"
IS 'Identificación (PK) del archivo adjunto de la novedad (del detalle) de la orden de compra';

COMMENT ON COLUMN "public"."archivos_novedades_ordenes_compras"."novedad_orden_compra_id"
IS 'Identificador de la novedad (del detalle) de la orden de compra';

COMMENT ON COLUMN "public"."archivos_novedades_ordenes_compras"."nombre_archivo"
IS 'Nombre del archivo adjunto';

COMMENT ON COLUMN "public"."archivos_novedades_ordenes_compras"."usuario_id"
IS 'Usuario que registra el archivo';

COMMENT ON COLUMN "public"."archivos_novedades_ordenes_compras"."fecha_registro"
IS 'Fech en que se registra el archivo';


---- ================================================================================================== ----
---- Crea columna en_uso para encabezado de pedido Farmacias y Clientes

ALTER TABLE solicitud_productos_a_bodega_principal ADD en_uso INTEGER DEFAULT 0;

COMMENT ON COLUMN "public"."solicitud_productos_a_bodega_principal"."en_uso"
IS 'Estado de bloqueo si el pedido está siendo visto en la tablet. 1 => bloqueado, 0 => libre' ;

ALTER TABLE ventas_ordenes_pedidos ADD en_uso INTEGER DEFAULT 0;

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos"."en_uso"
IS 'Estado de bloqueo si el pedido está siendo visto en la tablet. 1 => bloqueado, 0 => libre' ;
