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

/*ALTER TABLE system_usuarios_sesiones ADD lock_screen char(1) DEFAULT NULL;

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."lock_screen"
IS '0 = False, es decir No esta bloqueado, 1 = true, es decir esta bloqueado';*/

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

ALTER TABLE inv_bodegas_movimiento_tmp_despachos_clientes ADD estado char(1) DEFAULT '0';

---- ==================================================================================== ----
---- Agregar columna auditado a la tbla inv_bodegas_movimiento_tmp_d que indica si el producto  ha sido auditado

ALTER TABLE inv_bodegas_movimiento_tmp_despachos_clientes ADD observacion TEXT DEFAULT null;

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


-- tipo caja
ALTER TABLE inv_rotulo_caja ADD tipo char(1) DEFAULT '0';

COMMENT ON COLUMN "public"."inv_rotulo_caja"."tipo"
IS '0 = caja, 1 = nevera';

---- ==================================================================================== ----
---- Agregar columnas a tabla inv_bodegas_movimiento_tmp_d 

-- numero_caja
ALTER TABLE inv_bodegas_movimiento_tmp_d ADD numero_caja integer DEFAULT null;

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_tmp_d"."numero_caja"
IS ' Hace referencia al numero de la caja en donde va el producto';

ALTER TABLE "public"."inv_bodegas_movimiento_tmp_d"
  ADD COLUMN "tipo_caja" CHAR(1);

ALTER TABLE "public"."inv_bodegas_movimiento_tmp_d"
  ALTER COLUMN "tipo_caja" SET DEFAULT 0;

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_tmp_d"."tipo_caja"
IS '0 = caja, 1 = nevera';

---- ==================================================================================== ----

--- Agregar columnas a la tabla inv_bodegas_movimiento_d

ALTER TABLE "public"."inv_bodegas_movimiento_d"
  ADD COLUMN "numero_caja" INTEGER;

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_d"."numero_caja"
IS 'Hace referencia al numero de la caja en donde va el producto';

ALTER TABLE "public"."inv_bodegas_movimiento_d"
  ADD COLUMN "tipo_caja" CHAR(1);

ALTER TABLE "public"."inv_bodegas_movimiento_d"
  ALTER COLUMN "tipo_caja" SET DEFAULT 0;

COMMENT ON COLUMN "public"."inv_bodegas_movimiento_d"."tipo_caja"
IS '0 = caja, 1 = nevera';


--==============================================================================================



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
/*ALTER TABLE "public"."system_usuarios_sesiones" ADD device character varying(40) DEFAULT null;

COMMENT ON COLUMN "public"."system_usuarios_sesiones"."device"
IS 'Dispositivo desde donde se conectan al servidor';*/


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
---- Agregar columna tipo_producto a la tabla ventas_ordenes_pedidos_tmp para poder controlar que cotizaciones a clientes vayan por un solo tipo de producto


ALTER TABLE ventas_ordenes_pedidos_tmp ADD COLUMN tipo_producto varchar(1);

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos_tmp"."tipo_producto"
IS ' Indica que el pedido se hara solamente de ese tipo de producto inv_tipo_productos ';


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




ALTER TABLE "public"."solicitud_productos_a_bodega_principal_estado"
  ADD COLUMN "sw_terminado" CHAR(1);



ALTER TABLE "public"."ventas_ordenes_pedidos_estado"
  ADD COLUMN "sw_terminado" CHAR(1);




ALTER TABLE "public"."inv_rotulo_caja"
  ADD COLUMN "sw_despachado" CHAR(1);

ALTER TABLE "public"."inv_rotulo_caja"
  ALTER COLUMN "sw_despachado" SET DEFAULT 0;



----- roles y permisos -----

--ALMACENA LOS MODULOS DE LA APP
CREATE TABLE "public"."modulos" (
  "id" SERIAL, 
  "parent" INTEGER, 
  "nombre" VARCHAR(50), 
  "url" VARCHAR(50), 
  "parent_name" VARCHAR(50), 
  "icon" VARCHAR(250), 
  "state" VARCHAR(45), 
  "observacion" TEXT, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  "carpeta_raiz" VARCHAR(255), 
  CONSTRAINT "modulos_pkey" PRIMARY KEY("id")
) WITH OIDS;

COMMENT ON COLUMN "public"."modulos"."carpeta_raiz"
IS 'Nombre de la carpeta raiz del modulo';


CREATE TABLE "public"."modulos_empresas" (
  "id" SERIAL, 
  "empresa_id" CHAR(2), 
  "modulo_id" INTEGER, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  CONSTRAINT "modulos_empresas_idx" UNIQUE("modulo_id", "empresa_id"), 
  CONSTRAINT "modulos_empresas_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "modulos_empresas_fk" FOREIGN KEY ("empresa_id")
    REFERENCES "public"."empresas"("empresa_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "modulos_empresas_fk1" FOREIGN KEY ("modulo_id")
    REFERENCES "public"."modulos"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "modulos_empresas_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "modulos_empresas_fk3" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;



--ALMACENA LAS OPCIONES POR CADA MODULO
CREATE TABLE "public"."modulos_opciones" (
  "id" SERIAL, 
  "nombre" VARCHAR(50), 
  "alias" VARCHAR(50), 
  "modulo_id" INTEGER, 
  "observacion" TEXT, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP WITHOUT TIME ZONE, 
  "estado" CHAR(1) DEFAULT 1, 
  CONSTRAINT "modulos_opciones_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "modulos_opciones_fk" FOREIGN KEY ("modulo_id")
    REFERENCES "public"."modulos"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;


CREATE TABLE "public"."modulos_variables" (
  "id" SERIAL, 
  "nombre" VARCHAR(255), 
  "valor" VARCHAR(255), 
  "observacion" TEXT, 
  "modulo_id" INTEGER, 
  "estado" CHAR(1), 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  CONSTRAINT "modulos_variables_fk" FOREIGN KEY ("modulo_id")
    REFERENCES "public"."modulos"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "modulos_variables_fk1" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;


CREATE TABLE "public"."roles" (
  "id" SERIAL, 
  "empresa_id" CHAR(2), 
  "nombre" VARCHAR(50), 
  "observacion" TEXT, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  CONSTRAINT "roles_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "roles_fk" FOREIGN KEY ("empresa_id")
    REFERENCES "public"."empresas"("empresa_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_fk1" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_fk2" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

	
	
CREATE TABLE "public"."login_empresas" (
  "id" SERIAL NOT NULL, 
  "login_id" INTEGER, 
  "empresa_id" CHAR(2), 
  "predeterminado" CHAR(1), 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  "rol_id" INTEGER, 
  CONSTRAINT "login_empresas_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "login_empresa_fk" FOREIGN KEY ("login_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_empresa_fk1" FOREIGN KEY ("empresa_id")
    REFERENCES "public"."empresas"("empresa_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_empresa_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_empresa_fk3" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_empresas_fk" FOREIGN KEY ("rol_id")
    REFERENCES "public"."roles"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

ALTER TABLE "public"."login_empresas"
  ALTER COLUMN "login_id" SET STATISTICS 0;


CREATE TABLE "public"."login_modulos_empresas" (
  "id" SERIAL, 
  "login_empresas_id" INTEGER, 
  "modulo_id" INTEGER, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  CONSTRAINT "login_modulos_empresas_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "login_modulos_empresas_fk" FOREIGN KEY ("login_empresas_id")
    REFERENCES "public"."login_empresas"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_modulos_empresas_fk1" FOREIGN KEY ("modulo_id")
    REFERENCES "public"."modulos"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_modulos_empresas_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_modulos_empresas_fk3" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;




CREATE TABLE "public"."login_modulos_opciones" (
  "id" SERIAL, 
  "login_modulos_empresa_id" INTEGER, 
  "modulos_opcion_id" INTEGER, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  CONSTRAINT "login_modulos_opciones_id_key" UNIQUE("id"), 
  CONSTRAINT "login_modulos_opciones_fk" FOREIGN KEY ("login_modulos_empresa_id")
    REFERENCES "public"."login_modulos_empresas"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_modulos_opciones_fk1" FOREIGN KEY ("modulos_opcion_id")
    REFERENCES "public"."modulos_opciones"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_modulos_opciones_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_modulos_opciones_fk3" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

CREATE TABLE "public"."login_centros_utilidad_bodega" (
  "id" SERIAL, 
  "login_empresa_id" INTEGER, 
  "empresa_id" CHAR(2), 
  "centro_utilidad_id" CHAR(2), 
  "bodega_id" CHAR(2), 
  "predeterminado" CHAR(1), 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  CONSTRAINT "login_centros_utilidad_bodega_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "login_centros_utilidad_bodega_fk" FOREIGN KEY ("login_empresa_id")
    REFERENCES "public"."login_empresas"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE, 
  CONSTRAINT "login_centros_utilidad_bodega_fk1" FOREIGN KEY ("empresa_id")
    REFERENCES "public"."empresas"("empresa_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "login_centros_utilidad_bodega_fk3" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;




CREATE TABLE "public"."roles_modulos" (
  "id" SERIAL, 
  "rol_id" INTEGER, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  "modulos_empresas_id" INTEGER, 
  CONSTRAINT "roles_modulos_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "roles_modulos_fk" FOREIGN KEY ("rol_id")
    REFERENCES "public"."roles"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_modulos_fk1" FOREIGN KEY ("modulos_empresas_id")
    REFERENCES "public"."modulos_empresas"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_modulos_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_modulos_fk3" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;


CREATE TABLE "public"."roles_modulos_opciones" (
  "id" SERIAL, 
  "modulo_opcion_id" INTEGER, 
  "rol_modulo_id" INTEGER, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "usuario_id_modifica" INTEGER, 
  "fecha_modificacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  CONSTRAINT "roles_modulos_opciones_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "roles_modulos_opciones_fk" FOREIGN KEY ("modulo_opcion_id")
    REFERENCES "public"."modulos_opciones"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_modulos_opciones_fk1" FOREIGN KEY ("rol_modulo_id")
    REFERENCES "public"."roles_modulos"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_modulos_opciones_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "roles_modulos_opciones_fk3" FOREIGN KEY ("usuario_id_modifica")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;





CREATE TABLE "public"."system_usuarios_configuraciones" (
  "id" SERIAL, 
  "usuario_id" INTEGER, 
  "ruta_avatar" CHAR(250), 
  CONSTRAINT "system_usuarios_configuraciones_fk" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;


------ roles y permisos -----

/*****************************************************************/
/***************** PLANILAS DESPACHOS  ***************************/
/*****************************************************************/



/* Crear campo en tabla transportadoras */
ALTER TABLE "public"."inv_transportadoras"
  ADD COLUMN "placa_vehiculo" CHAR(6);

COMMENT ON COLUMN "public"."inv_transportadoras"."placa_vehiculo"
IS 'Placa del vehiculo';

/* Crear campo en tabla transportadoras */
ALTER TABLE "public"."inv_transportadoras"
  ADD COLUMN "sw_solicitar_guia" CHAR(1);

ALTER TABLE "public"."inv_transportadoras"
  ALTER COLUMN "sw_solicitar_guia" SET DEFAULT '0';

COMMENT ON COLUMN "public"."inv_transportadoras"."sw_solicitar_guia"
IS 'Solicita el numero de guia para transportadoras externas.
0=> No solicita el numero de guia
1=> Solcita el numero de guia';

/* Crear  tabla inv_planillas_despacho */
CREATE TABLE "public"."inv_planillas_despacho" (
  "id" SERIAL, 
  "inv_transportador_id" INTEGER NOT NULL, 
  "ciudad_id" VARCHAR(4) NOT NULL, 
  "nombre_conductor" VARCHAR(45) NOT NULL, 
  "observacion" TEXT, 
  "estado" CHAR(1) DEFAULT 1 NOT NULL, 
  "usuario_id" INTEGER NOT NULL, 
  "fecha_registro" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
  "fecha_despacho" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "pais_id" VARCHAR(4), 
  "departamento_id" VARCHAR(4), 
  "numero_guia_externo" VARCHAR(45), 
  CONSTRAINT "inv_planillas_despacho_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "inv_planillas_despacho_fk" FOREIGN KEY ("inv_transportador_id")
    REFERENCES "public"."inv_transportadoras"("transportadora_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_despacho_fk1" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_despacho_fk2" FOREIGN KEY ("pais_id", "departamento_id", "ciudad_id")
    REFERENCES "public"."tipo_mpios"("tipo_pais_id", "tipo_dpto_id", "tipo_mpio_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

COMMENT ON TABLE "public"."inv_planillas_despacho"
IS 'Permite almacenar la informacion general del despacho de los pedidos';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."inv_transportador_id"
IS 'Identificador de la tabla de transportadoras';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."ciudad_id"
IS 'Identificador de la ciudad';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."nombre_conductor"
IS 'Nombre del conductor';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."observacion"
IS 'Observacion de la planilla';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."estado"
IS '0 = Planilla Anulada
1 = Planilla Activa
2 = Planilla Despachada';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."usuario_id"
IS 'Usuario que realiza la planilla';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."fecha_registro"
IS 'Fecha en que se crea la planilla';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."fecha_despacho"
IS 'Fecha en que se despacha los pedidos de la planilla';

COMMENT ON COLUMN "public"."inv_planillas_despacho"."numero_guia_externo"
IS 'Numero guia cuando son transportadoras externas a la empresa';


/* Crear  tabla inv_planillas_detalle_farmacias */
CREATE TABLE "public"."inv_planillas_detalle_farmacias" (
  "id" SERIAL, 
  "inv_planillas_despacho_id" INTEGER NOT NULL, 
  "empresa_id" VARCHAR(2) NOT NULL, 
  "prefijo" VARCHAR(45) NOT NULL, 
  "numero" INTEGER NOT NULL, 
  "cantidad_cajas" INTEGER NOT NULL, 
  "cantidad_neveras" INTEGER DEFAULT 0 NOT NULL, 
  "temperatura_neveras" DOUBLE PRECISION, 
  "observacion" TEXT, 
  "usuario_id" INTEGER NOT NULL, 
  "fecha_registro" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT now(), 
  CONSTRAINT "inv_planillas_detalle_farmacias_fk" FOREIGN KEY ("inv_planillas_despacho_id")
    REFERENCES "public"."inv_planillas_despacho"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_detalle_farmacias_fk1" FOREIGN KEY ("empresa_id", "prefijo", "numero")
    REFERENCES "public"."inv_bodegas_movimiento_despachos_farmacias"("empresa_id", "prefijo", "numero")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_detalle_farmacias_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

COMMENT ON TABLE "public"."inv_planillas_detalle_farmacias"
IS 'Almacenas los documentos de farmacias despachados';

COMMENT ON COLUMN "public"."inv_planillas_detalle_farmacias"."inv_planillas_despacho_id"
IS 'Identificador de la planilla';

/* Crear  tabla inv_planillas_detalle_clientes */

CREATE TABLE "public"."inv_planillas_detalle_clientes" (
  "id" SERIAL, 
  "inv_planillas_despacho_id" INTEGER NOT NULL, 
  "empresa_id" VARCHAR(2) NOT NULL, 
  "prefijo" VARCHAR(45) NOT NULL, 
  "numero" INTEGER NOT NULL, 
  "cantidad_cajas" INTEGER NOT NULL, 
  "cantidad_neveras" INTEGER DEFAULT 0 NOT NULL, 
  "temperatura_neveras" DOUBLE PRECISION, 
  "observacion" TEXT, 
  "usuario_id" INTEGER NOT NULL, 
  "fecha_registro" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT now(), 
  CONSTRAINT "inv_planillas_detalle_clientes_fk" FOREIGN KEY ("inv_planillas_despacho_id")
    REFERENCES "public"."inv_planillas_despacho"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_detalle_clientes_fk1" FOREIGN KEY ("empresa_id", "prefijo", "numero")
    REFERENCES "public"."inv_bodegas_movimiento_despachos_clientes"("empresa_id", "prefijo", "numero")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_detalle_clientes_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

COMMENT ON TABLE "public"."inv_planillas_detalle_clientes"
IS 'Almacenas los documentos de clientes despachados';

COMMENT ON COLUMN "public"."inv_planillas_detalle_clientes"."inv_planillas_despacho_id"
IS 'Identificador de la planilla';

/* Crear  tabla inv_planillas_detalle_empresas */

CREATE TABLE "public"."inv_planillas_detalle_empresas" (
  "id" SERIAL, 
  "inv_planillas_despacho_id" INTEGER NOT NULL, 
  "empresa_id" VARCHAR(2) NOT NULL, 
  "prefijo" VARCHAR(45) NOT NULL, 
  "numero" INTEGER NOT NULL, 
  "cantidad_cajas" INTEGER NOT NULL, 
  "cantidad_neveras" INTEGER DEFAULT 0 NOT NULL, 
  "temperatura_neveras" DOUBLE PRECISION, 
  "observacion" TEXT, 
  "usuario_id" INTEGER NOT NULL, 
  "fecha_registro" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT now(), 
  CONSTRAINT "inv_planillas_detalle_empresas_fk" FOREIGN KEY ("inv_planillas_despacho_id")
    REFERENCES "public"."inv_planillas_despacho"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_detalle_empresas_fk1" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

COMMENT ON TABLE "public"."inv_planillas_detalle_empresas"
IS 'Almacenas los documentos de otras empresas despachados';

COMMENT ON COLUMN "public"."inv_planillas_detalle_empresas"."inv_planillas_despacho_id"
IS 'Identificador de la planilla';


ALTER TABLE inv_planillas_detalle_farmacias ADD CONSTRAINT inv_planillas_detalle_farmacias_unique UNIQUE (empresa_id, prefijo, numero);
ALTER TABLE inv_planillas_detalle_clientes ADD CONSTRAINT inv_planillas_detalle_clientes_unique UNIQUE (empresa_id, prefijo, numero);
ALTER TABLE inv_planillas_detalle_empresas ADD CONSTRAINT inv_planillas_detalle_empresas_unique UNIQUE (empresa_id, prefijo, numero);


/*==================== Recepciones Ordenes de Compra ===============================*/

/*==== Crear tabla de novedades =========*/

CREATE TABLE "public"."novedades_recepcion_mercancia" (
  "id" SERIAL, 
  "codigo" VARCHAR(3) NOT NULL, 
  "descripcion" VARCHAR NOT NULL, 
  "estado" CHAR(1) DEFAULT '1'::bpchar, 
  "fecha_registro" TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT now(), 
  "usuario_id" INTEGER, 
  CONSTRAINT "novedades_recepcion_mercancia_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "novedades_recepcion_mercancia_fk" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;


COMMENT ON COLUMN "public"."novedades_recepcion_mercancia"."codigo"
IS 'Codigo o identificador de la novedad';

COMMENT ON COLUMN "public"."novedades_recepcion_mercancia"."descripcion"
IS 'Descripcion de la novedad';

COMMENT ON COLUMN "public"."novedades_recepcion_mercancia"."estado"
IS 'Indica si esta 0=> Inactivo 1=> Activo';

COMMENT ON COLUMN "public"."novedades_recepcion_mercancia"."fecha_registro"
IS 'Fecha en que registró la novedad';

COMMENT ON COLUMN "public"."novedades_recepcion_mercancia"."usuario_id"
IS 'Usuario que ingresa el registro';


/* =================== Tabla para ingresar las recepciones de mercancia ============*/
CREATE TABLE "public"."recepcion_mercancia" (
  "id" SERIAL, 
  "empresa_id" VARCHAR(2) NOT NULL, 
  "codigo_proveedor_id" INTEGER NOT NULL, 
  "orden_pedido_id" INTEGER, 
  "inv_transportador_id" INTEGER, 
  "novedades_recepcion_id" INTEGER, 
  "numero_guia" VARCHAR(20) NOT NULL, 
  "numero_factura" VARCHAR(20) NOT NULL, 
  "cantidad_cajas" INTEGER DEFAULT 0, 
  "cantidad_neveras" INTEGER DEFAULT 0, 
  "temperatura_neveras" REAL, 
  "contiene_medicamentos" CHAR(1) DEFAULT 0, 
  "contiene_dispositivos" CHAR(1) DEFAULT 0, 
  "fecha_recepcion" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
  "fecha_registro" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
  CONSTRAINT "recepcion_mercancia_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "recepcion_mercancia_fk" FOREIGN KEY ("empresa_id")
    REFERENCES "public"."empresas"("empresa_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "recepcion_mercancia_fk1" FOREIGN KEY ("codigo_proveedor_id")
    REFERENCES "public"."terceros_proveedores"("codigo_proveedor_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "recepcion_mercancia_fk2" FOREIGN KEY ("orden_pedido_id")
    REFERENCES "public"."compras_ordenes_pedidos"("orden_pedido_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "recepcion_mercancia_fk3" FOREIGN KEY ("inv_transportador_id")
    REFERENCES "public"."inv_transportadoras"("transportadora_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "recepcion_mercancia_fk4" FOREIGN KEY ("novedades_recepcion_id")
    REFERENCES "public"."novedades_recepcion_mercancia"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;


COMMENT ON TABLE "public"."recepcion_mercancia"
IS 'Tabla para guardaar las recepciones de mercancias por ordenes de compras';

COMMENT ON COLUMN "public"."recepcion_mercancia"."empresa_id"
IS 'Identificador de la empresa';

COMMENT ON COLUMN "public"."recepcion_mercancia"."codigo_proveedor_id"
IS 'Codigo del proveedor';

COMMENT ON COLUMN "public"."recepcion_mercancia"."orden_pedido_id"
IS 'Numero de la orden de compra';

COMMENT ON COLUMN "public"."recepcion_mercancia"."novedades_recepcion_id"
IS 'Identificador de la novedad';

COMMENT ON COLUMN "public"."recepcion_mercancia"."numero_guia"
IS 'Numero de la guia de la transportadora';

COMMENT ON COLUMN "public"."recepcion_mercancia"."numero_factura"
IS 'Numero de la factura enviada por el proveedor';

COMMENT ON COLUMN "public"."recepcion_mercancia"."cantidad_cajas"
IS 'Cantidad de cajas enviadas';

COMMENT ON COLUMN "public"."recepcion_mercancia"."cantidad_neveras"
IS 'Cantidad neveras enviadas';

COMMENT ON COLUMN "public"."recepcion_mercancia"."temperatura_neveras"
IS 'Temperatura de las neveras';

COMMENT ON COLUMN "public"."recepcion_mercancia"."contiene_medicamentos"
IS 'Si el envio contiene medicamentos';

COMMENT ON COLUMN "public"."recepcion_mercancia"."contiene_dispositivos"
IS 'Si el envio contiene dispositivos medicos';

COMMENT ON COLUMN "public"."recepcion_mercancia"."fecha_recepcion"
IS 'Fecha en que se recepciona la mercancia';

COMMENT ON COLUMN "public"."recepcion_mercancia"."fecha_registro"
IS 'Fecha en que se realiza el registro';


ALTER TABLE "public"."recepcion_mercancia"
  ADD COLUMN "usuario_id" INTEGER;

ALTER TABLE "public"."recepcion_mercancia"
  ALTER COLUMN "usuario_id" SET NOT NULL;

COMMENT ON COLUMN "public"."recepcion_mercancia"."usuario_id"
IS 'Usuario que realiza la recepcion de la mercancia';


ALTER TABLE "public"."recepcion_mercancia"
  ADD COLUMN "estado" CHAR(1);

ALTER TABLE "public"."recepcion_mercancia"
  ALTER COLUMN "estado" SET DEFAULT '1';

COMMENT ON COLUMN "public"."recepcion_mercancia"."estado"
IS 'Indica si la recepcion esta 0=> Inactiva 1=> activa 2=> recepcion finalizada';

ALTER TABLE "public"."recepcion_mercancia"
  ADD COLUMN "hora_recepcion" TIME WITHOUT TIME ZONE;

ALTER TABLE "public"."recepcion_mercancia"
  ALTER COLUMN "hora_recepcion" SET DEFAULT null;

COMMENT ON COLUMN "public"."recepcion_mercancia"."hora_recepcion"
IS 'Hora exacta en que se hace la recepcion de la mercancia';


/* =================== Tabla para ingresar el detalle de las recepciones de mercancia ============*/

CREATE TABLE "public"."recepcion_mercancia_detalle" (
  "id" SERIAL, 
  "recepcion_mercancia_id" INTEGER NOT NULL, 
  "novedades_recepcion_id" INTEGER, 
  "codigo_producto" VARCHAR(50) NOT NULL, 
  "cantidad_recibida" INTEGER DEFAULT 0 NOT NULL, 
  "fecha_registro" TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
  "usuario_id" INTEGER NOT NULL, 
  CONSTRAINT "recepcion_mercancia_detalle_pkey" PRIMARY KEY("id"), 
  CONSTRAINT "recepcion_mercancia_detalle_fk" FOREIGN KEY ("recepcion_mercancia_id")
    REFERENCES "public"."recepcion_mercancia"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "recepcion_mercancia_detalle_fk1" FOREIGN KEY ("novedades_recepcion_id")
    REFERENCES "public"."novedades_recepcion_mercancia"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "recepcion_mercancia_detalle_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

COMMENT ON COLUMN "public"."recepcion_mercancia_detalle"."recepcion_mercancia_id"
IS 'Identificador de la recepcion de mercancia';

COMMENT ON COLUMN "public"."recepcion_mercancia_detalle"."novedades_recepcion_id"
IS 'Novedad de la recepcion';

COMMENT ON COLUMN "public"."recepcion_mercancia_detalle"."codigo_producto"
IS 'Codigo del producto de la orden de compra';

COMMENT ON COLUMN "public"."recepcion_mercancia_detalle"."cantidad_recibida"
IS 'Cantidad recibida en la recepcion de la mercancia';

COMMENT ON COLUMN "public"."recepcion_mercancia_detalle"."fecha_registro"
IS 'Fecha en que se registra el producto';

COMMENT ON COLUMN "public"."recepcion_mercancia_detalle"."usuario_id"
IS 'Usuario que ingresa el registro';



/* =================== Agregar campo fecha a la tabla temporal de pedidos farmacias ============*/

ALTER TABLE "public"."solicitud_pro_a_bod_prpal_tmp"
  ADD COLUMN "fecha_registro" TIMESTAMP(1) WITHOUT TIME ZONE;

ALTER TABLE "public"."solicitud_pro_a_bod_prpal_tmp"
  ALTER COLUMN "fecha_registro" SET DEFAULT now();


/* =================== Agregar campo fecha verificado a la tabla de ordenes de compra ============*/
ALTER TABLE "public"."compras_ordenes_pedidos"
  ADD COLUMN "fecha_verificado" DATE;

COMMENT ON COLUMN "public"."compras_ordenes_pedidos"."fecha_verificado"
IS 'Fecha en que se verifica la recepcion de la orden de compra';


ALTER TABLE "public"."inv_bodegas_movimiento_justificaciones_pendientes"
  ADD COLUMN "usuario_id" INTEGER;

ALTER TABLE "public"."inv_bodegas_movimiento_justificaciones_pendientes"
  ADD COLUMN "fecha_registro" TIMESTAMP(1) WITHOUT TIME ZONE;

ALTER TABLE "public"."inv_bodegas_movimiento_justificaciones_pendientes"
  ALTER COLUMN "fecha_registro" SET DEFAULT now();

ALTER TABLE "public"."inv_bodegas_movimiento_justificaciones_pendientes"
  ADD COLUMN "justificacion_auditor" TEXT;



-- guarda centro de utilidad y bodega de la empresa de donde sale el pedido (destino)

ALTER TABLE "public"."solicitud_productos_a_bodega_principal"
  ADD COLUMN "centro_destino" CHAR(2);


ALTER TABLE "public"."solicitud_productos_a_bodega_principal"
  ADD COLUMN "bodega_destino" CHAR(2);


ALTER TABLE "public"."solicitud_productos_a_bodega_principal"
  ADD CONSTRAINT "solicitud_productos_a_bodega_principal_fk" FOREIGN KEY ("empresa_destino", "centro_destino", "bodega_destino")
    REFERENCES "public"."bodegas"("empresa_id", "centro_utilidad", "bodega")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;


ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ADD COLUMN "centro_utilidad_id" CHAR(2);

ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ADD COLUMN "bodega_id" CHAR(2);


ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ADD CONSTRAINT "ventas_ordenes_pedidos_tmp_fk" FOREIGN KEY ("empresa_id", "centro_utilidad_id", "bodega_id")
    REFERENCES "public"."bodegas"("empresa_id", "centro_utilidad", "bodega")
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;


ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "centro_utilidad_id" CHAR(2);

ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "bodega_id" CHAR(2);


ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD CONSTRAINT "ventas_ordenes_pedidos_fk" FOREIGN KEY ("empresa_id", "centro_utilidad_id", "bodega_id")
    REFERENCES "public"."bodegas"("empresa_id", "centro_utilidad", "bodega")
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
    NOT DEFERRABLE;


COMMENT ON COLUMN "public"."ventas_ordenes_pedidos_tmp"."centro_utilidad_id"
IS 'centro utilidad origen';

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos_tmp"."bodega_id"
IS 'bodega origen';

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos"."centro_utilidad_id"
IS 'centro utilidad origen';

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos"."bodega_id"
IS 'bodega origen';


/*==== Agregar observacion cartera a tabala de  ventas_ordenes_pedidos_tmp =========*/

ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ADD COLUMN "observacion_cartera" TEXT;

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos_tmp"."observacion_cartera"
IS 'Observacion ingresada por cartera';

/* real */
ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "observacion_cartera" TEXT;

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos"."observacion_cartera"
IS 'Observacion ingresada por cartera';


ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "pedido_cliente_id_tmp" integer;

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos"."pedido_cliente_id_tmp"
IS 'Campo que almacenara la cotizacion del pedido';


ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "valor_total_cotizacion" numeric(15,2);

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos"."valor_total_cotizacion"
IS 'Campo que almacena el valor total de la cotizacion';


/*==== Agregar sw_aprobado_cartera a tabala de  ventas_ordenes_pedidos_tmp =========*/

/* tmp */
ALTER TABLE ventas_ordenes_pedidos ADD COLUMN tipo_producto varchar(1);
ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ADD COLUMN "sw_aprobado_cartera" CHAR(1);

ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ALTER COLUMN "sw_aprobado_cartera" SET DEFAULT '0';

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos_tmp"."sw_aprobado_cartera"
IS 'Indica si esta o no aprobado por cartera
0=> false => NO aprobado ; 1=> true=> Aprobado';

/* real */
ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "sw_aprobado_cartera" CHAR(1);

ALTER TABLE "public"."ventas_ordenes_pedidos"
  ALTER COLUMN "sw_aprobado_cartera" SET DEFAULT '0';

COMMENT ON COLUMN "public"."ventas_ordenes_pedidos"."sw_aprobado_cartera"
IS 'Indica si esta o no aprobado por cartera
0=> false => NO aprobado ; 1=> true=> Aprobado';

/* Eliminar campo tipo_producto de tablas ventas_ordenes_pedidos_d_tmp y ventas_ordenes_pedidos_d*/ 
ALTER TABLE "public"."ventas_ordenes_pedidos_d_tmp"
  DROP COLUMN "tipo_producto";

ALTER TABLE "public"."ventas_ordenes_pedidos_d"
  DROP COLUMN "tipo_producto";

---- ==================================================================================== ----
---- Agregar columna tipo_producto a la tabla ventas_ordenes_pedidos_tmp para poder controlar que cotizaciones a clientes vayan por un solo tipo de producto

-- tabla real 



COMMENT ON COLUMN "public"."ventas_ordenes_pedidos_tmp"."tipo_producto"
IS ' Indica que el pedido se hara solamente de ese tipo de producto inv_tipo_productos ';

ALTER TABLE "public"."solicitud_pro_a_bod_prpal_tmp" ADD COLUMN "cantidad_pendiente" INTEGER DEFAULT 0;


ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "centro_destino" CHAR(2); 

ALTER TABLE "public"."ventas_ordenes_pedidos"
  ADD COLUMN "bodega_destino" CHAR(2); 


ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ADD COLUMN "centro_destino" CHAR(2); 

ALTER TABLE "public"."ventas_ordenes_pedidos_tmp"
  ADD COLUMN "bodega_destino" CHAR(2); 

/* =================== Tabla para ingresar el encabezado de los documentos de devolucion ============*/
CREATE TABLE "public"."inv_planillas_farmacia_devolucion" (
  "id_inv_planilla_farmacia_devolucion" INTEGER SERIAL, 
  "empresa_id" CHAR(2) NOT NULL, 
  "centro_utilidad" CHAR(2) NOT NULL, 
  "bodega" VARCHAR(2) NOT NULL, 
  "id_empresa_destino" CHAR(2) NOT NULL, 
  "inv_transportador_id" INTEGER NOT NULL, 
  "nombre_conductor" VARCHAR(45) NOT NULL, 
  "observacion" TEXT, 
  "numero_guia_externo" VARCHAR(45), 
  "estado" CHAR(1) DEFAULT 1 NOT NULL, 
  "usuario_id" INTEGER NOT NULL, 
  "fecha_registro" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
  "fecha_despacho" TIMESTAMP(0), 
  CONSTRAINT "id_inv_planilla_farmacia_devolucionkey" PRIMARY KEY("id_inv_planilla_farmacia_devolucion"), 
  CONSTRAINT "inv_planillas_farmacia_devolucionfk" FOREIGN KEY ("inv_transportador_id")
    REFERENCES "public"."inv_transportadoras"("transportadora_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_farmacia_devolucionfk1" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_farmacia_devolucionfk2" FOREIGN KEY ("empresa_id", "centro_utilidad", "bodega")
    REFERENCES "public"."bodegas"("empresa_id", "centro_utilidad", "bodega")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_farmacia_devolucionfk3" FOREIGN KEY ("id_empresa_destino")
    REFERENCES "public"."empresas"("empresa_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

COMMENT ON TABLE "public"."inv_planillas_farmacia_devolucion"
IS 'Permite almacenar la informacion general de la devolucion';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."empresa_id"
IS 'Identificador de la empresa';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."centro_utilidad"
IS 'Identificador del centro de utilidad';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."bodega"
IS 'Identificador de la bodega';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."id_empresa_destino"
IS 'Identificador de la empresa';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."inv_transportador_id"
IS 'Identificador de la tabla de transportadoras';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."observacion"
IS 'Observacion de la planilla';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."numero_guia_externo"
IS 'Numero guia cuando son transportadoras externas a la empresa';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."estado"
IS '0 = Planilla Anulada
1 = Planilla Activa
2 = Planilla Despachada';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."usuario_id"
IS 'Usuario que realiza la planilla';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."fecha_registro"
IS 'Fecha en que se crea la planilla';

COMMENT ON COLUMN "public"."inv_planillas_farmacia_devolucion"."fecha_despacho"
IS 'Fecha que se crea al momento de realizar un despacho';



/* =================== Tabla para ingresar el detallado de los documentos de devolucion ============*/

/* Crear  tabla inv_planillas_detalle_farmacias */
CREATE TABLE "public"."inv_planillas_farmacia_devolucion_detalle" (
  "id_inv_planilla_farmacia_devolucion_detalle" SERIAL, 
  "id_inv_planilla_farmacia_devolucion" INTEGER NOT NULL, 
  "empresa_id" VARCHAR(2) NOT NULL, 
  "prefijo" VARCHAR(45) NOT NULL, 
  "numero" INTEGER NOT NULL, 
  "cantidad_cajas" INTEGER, 
  "cantidad_neveras" INTEGER DEFAULT 0, 
  "temperatura_neveras" DOUBLE PRECISION, 
  "observacion" TEXT, 
  "usuario_id" INTEGER NOT NULL, 
  "fecha_registro" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT now(), 
  CONSTRAINT "inv_planillas_farmacia_devolucion_detalle_fk" FOREIGN KEY ("id_inv_planilla_farmacia_devolucion")
    REFERENCES "public"."inv_planillas_farmacia_devolucion"("id_inv_planilla_farmacia_devolucion")
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE, 
  CONSTRAINT "inv_planillas_farmacia_devolucion_detalle_fk2" FOREIGN KEY ("usuario_id")
    REFERENCES "public"."system_usuarios"("usuario_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) WITH OIDS;

COMMENT ON TABLE "public"."inv_planillas_farmacia_devolucion_detalle"
IS 'Almacenas los documentos de farmacias devueltos';


ALTER TABLE "public"."observaciones_ordenes_compras"
  ADD COLUMN "tipo_entrada" 	character varying(2);

COMMENT ON COLUMN "public"."observaciones_ordenes_compras"."tipo_entrada"
IS 'Tipo de input usado en la interfaz 0 = fecha';


ALTER TABLE "public"."novedades_ordenes_compras"
  ADD COLUMN "descripcion_entreda_novedad" CHAR varying(255);

COMMENT ON COLUMN "public"."novedades_ordenes_compras"."descripcion_entreda_novedad"
IS 'Descripcion de la entrada de la novedad, fecha de disponibilidad, numero etc';


ALTER TABLE "public"."novedades_ordenes_compras"
  DROP CONSTRAINT "novedades_ordenes_compras_UNIQUE" RESTRICT;


COMMENT ON COLUMN "public"."compras_ordenes_pedidos"."estado"
IS 'Estado Orden de Compra 0 => Recibida (Ingresada en Bodega), 1 => Activa, 2 => Anulada , 3 => Recibido en bodega, 4 => Verificado en bodega, 5 => Bloqueada';

-- tabla para guardar la direccion de las bodegas destino de la orden
CREATE TABLE "public"."compras_ordenes_destino" (
  "id" SERIAL, 
  "orden_compra_id" INTEGER, 
  "empresa_id" CHAR(2), 
  "centro_utilidad" CHAR(2), 
  "bodega" CHAR(2)
) WITH OIDS;

ALTER TABLE "public"."compras_ordenes_destino"
  ALTER COLUMN "id" SET STATISTICS 0;


ALTER TABLE "public"."compras_ordenes_destino"
  ADD CONSTRAINT "ordenes_compra_destino_fk" FOREIGN KEY ("orden_compra_id")
    REFERENCES "public"."compras_ordenes_pedidos"("orden_pedido_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."compras_ordenes_destino"
  ADD CONSTRAINT "ordenes_compra_destino_fk1" FOREIGN KEY ("empresa_id", "centro_utilidad", "bodega")
    REFERENCES "public"."bodegas"("empresa_id", "centro_utilidad", "bodega")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


CREATE TABLE "public"."cronjobs" (
  "id" SERIAL, 
  "nombre" CHAR(40), 
  "descripcion" TEXT, 
  "estado" CHAR(1)
) WITH OIDS;