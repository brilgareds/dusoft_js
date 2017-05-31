CREATE TABLE "public"."proceso_facturacion" (
  "id" INTEGER DEFAULT nextval('table2_id_seq'::regclass) NOT NULL, 
  "usuario_id" INTEGER, 
  "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "fecha_inicial" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "fecha_final" TIMESTAMP(0) WITHOUT TIME ZONE, 
  "estado" CHAR(1), 
  CONSTRAINT "table2_id_key" UNIQUE("id")
) WITH OIDS;

COMMENT ON COLUMN "public"."proceso_facturacion"."usuario_id"
IS 'Usuario que genera la facturacion';

COMMENT ON COLUMN "public"."proceso_facturacion"."fecha_creacion"
IS 'Fecha en que se inicia el proceso de crontab';

COMMENT ON COLUMN "public"."proceso_facturacion"."fecha_inicial"
IS 'Fecha inicial del rango de busqueda de documentos';

COMMENT ON COLUMN "public"."proceso_facturacion"."fecha_final"
IS 'Fecha final del rango de busqueda de documentos';

COMMENT ON COLUMN "public"."proceso_facturacion"."estado"
IS '{1 : "En proceso", 2: "Con error", 3:"Terminado"}';




CREATE TABLE "public"."proceso_facturacion_detalle" (
  "id" SERIAL, 
  "id_proceso" INTEGER, 
  "pedido" INTEGER, 
  "tercero_id" VARCHAR(32), 
  "tipo_id_tercero" VARCHAR(3)
) WITH OIDS;

ALTER TABLE "public"."proceso_facturacion_detalle"
  ALTER COLUMN "id" SET STATISTICS 0;