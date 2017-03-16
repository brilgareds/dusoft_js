/* tablas */

CREATE TABLE "public"."genero" (
  "id" SERIAL, 
  "descripcion" TEXT NOT NULL
) WITH OIDS;

ALTER TABLE "public"."genero"
ALTER COLUMN "descripcion" SET STATISTICS 0;



CREATE TABLE "public"."estado_civil" (
  "id" SERIAL, 
  "descripcion" TEXT NOT NULL
) WITH OIDS;

ALTER TABLE "public"."estado_civil"
  ALTER COLUMN "descripcion" SET STATISTICS 0;


CREATE TABLE "public"."tipo_organizacion" (
  "id" SERIAL, 
  "descripcion" TEXT NOT NULL
) WITH OIDS;

ALTER TABLE "public"."tipo_organizacion"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."tipo_organizacion"
  ALTER COLUMN "descripcion" SET STATISTICS 0;

CREATE TABLE "public"."nomenclatura_direccion" (
  "id" SERIAL, 
  "descripcion" TEXT NOT NULL
) WITH OIDS;

ALTER TABLE "public"."nomenclatura_direccion"
  ALTER COLUMN "descripcion" SET STATISTICS 0;


CREATE TABLE "public"."tipos_telefono" (
  "id" SERIAL, 
  "descripcion" TEXT NOT NULL
) WITH OIDS;


CREATE TABLE "public"."tipos_linea_telefonica" (
  "id" INTEGER, 
  "descripcion" VARCHAR(20) NOT NULL
) WITH OIDS;

ALTER TABLE "public"."tipos_linea_telefonica"
  ALTER COLUMN "descripcion" SET STATISTICS 0;

CREATE TABLE "public"."tercero_telefonos" (
  "id" SERIAL, 
  "tipo_id_tercero" CHAR(3), 
  "tercero_id" CHAR(32), 
  "tipo_telefono_id" INTEGER, 
  "tipo_linea_telefonica_id" INTEGER, 
  "numero" VARCHAR(20)
) WITH OIDS;

ALTER TABLE "public"."tercero_telefonos"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."tercero_telefonos"
  ALTER COLUMN "tipo_id_tercero" SET STATISTICS 0;

ALTER TABLE "public"."tercero_telefonos"
  ALTER COLUMN "tercero_id" SET STATISTICS 0;

ALTER TABLE "public"."tercero_telefonos"
  ALTER COLUMN "tipo_telefono_id" SET STATISTICS 0;

ALTER TABLE "public"."tercero_telefonos"
  ALTER COLUMN "tipo_linea_telefonica_id" SET STATISTICS 0;

ALTER TABLE "public"."tercero_telefonos"
  ALTER COLUMN "numero" SET STATISTICS 0;   


ALTER TABLE "public"."tercero_telefonos"
  ADD CONSTRAINT "tercero_telefonos_fk" FOREIGN KEY ("tipo_id_tercero", "tercero_id")
    REFERENCES "public"."terceros"("tipo_id_tercero", "tercero_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


CREATE UNIQUE INDEX "tipos_telefono_id_key" ON "public"."tipos_telefono"
("id");

ALTER TABLE "public"."tercero_telefonos"
  ADD CONSTRAINT "tercero_telefonos_fk1" FOREIGN KEY ("tipo_telefono_id")
    REFERENCES "public"."tipos_telefono"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


CREATE UNIQUE INDEX "tipos_linea_telefonica_id_key" ON "public"."tipos_linea_telefonica"
("id");

ALTER TABLE "public"."tercero_telefonos"
  ADD CONSTRAINT "tercero_telefonos_fk2" FOREIGN KEY ("tipo_linea_telefonica_id")
    REFERENCES "public"."tipos_linea_telefonica"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


CREATE TABLE "public"."tipos_correo" (
  "id" SERIAL, 
  "descripcion" TEXT NOT NULL
) WITH OIDS;

ALTER TABLE "public"."tipos_correo"
  ALTER COLUMN "descripcion" SET STATISTICS 0;



CREATE TABLE "public"."tipos_redes_sociales" (
  "id" SERIAL, 
  "descripcion" TEXT
) WITH OIDS;

ALTER TABLE "public"."tipos_redes_sociales"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."tipos_redes_sociales"
  ALTER COLUMN "descripcion" SET STATISTICS 0;


CREATE TABLE "public"."tipos_contacto" (
  "id" SERIAL, 
  "descripcion" TEXT
) WITH OIDS;

ALTER TABLE "public"."tipos_contacto"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."tipos_contacto"
  ALTER COLUMN "descripcion" SET STATISTICS 0;

CREATE TABLE "public"."terceros_contactos" (
  "id" SERIAL, 
  "tipo_id_tercero" CHAR(3), 
  "tercero_id" CHAR(32), 
  "tipo_contacto_id" INTEGER, 
  "nombre" VARCHAR(255), 
  "telefono" VARCHAR(255), 
  "correo" VARCHAR(255), 
  "descripcion" TEXT
) WITH OIDS;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "tipo_id_tercero" SET STATISTICS 0;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "tercero_id" SET STATISTICS 0;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "tipo_contacto_id" SET STATISTICS 0;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "nombre" SET STATISTICS 0;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "telefono" SET STATISTICS 0;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "correo" SET STATISTICS 0;

ALTER TABLE "public"."terceros_contactos"
  ALTER COLUMN "descripcion" SET STATISTICS 0;


ALTER TABLE "public"."terceros_contactos"
  ADD CONSTRAINT "terceros_contactos_fk" FOREIGN KEY ("tipo_id_tercero", "tercero_id")
    REFERENCES "public"."terceros"("tipo_id_tercero", "tercero_id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


CREATE UNIQUE INDEX "tipos_contacto_id_key" ON "public"."tipos_contacto"
("id");

ALTER TABLE "public"."terceros_contactos"
  ADD CONSTRAINT "terceros_contactos_fk1" FOREIGN KEY ("tipo_contacto_id")
    REFERENCES "public"."tipos_contacto"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

CREATE TABLE "public"."tipo_direccion" (
  "id" SERIAL, 
  "descripcion" TEXT
) WITH OIDS;

ALTER TABLE "public"."tipo_direccion"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."tipo_direccion"
  ALTER COLUMN "descripcion" SET STATISTICS 0;

/***************tablas ************************/

ALTER TABLE "public"."terceros"
  ADD COLUMN "genero_id" INTEGER;

ALTER TABLE "public"."terceros"
  ADD COLUMN "estado_civil_id" INTEGER;

CREATE UNIQUE INDEX "genero_id_key" ON "public"."genero"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk" FOREIGN KEY ("genero_id")
    REFERENCES "public"."genero"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


CREATE UNIQUE INDEX "estado_civil_id_key" ON "public"."estado_civil"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk1" FOREIGN KEY ("estado_civil_id")
    REFERENCES "public"."estado_civil"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."terceros"
  ADD COLUMN "tipo_organizacion_id" INTEGER;

CREATE UNIQUE INDEX "tipo_organizacion_id_key" ON "public"."tipo_organizacion"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk2" FOREIGN KEY ("tipo_organizacion_id")
    REFERENCES "public"."tipo_organizacion"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."terceros"
  ADD COLUMN "fecha_expedicion_documento" TIMESTAMP(0) WITHOUT TIME ZONE;

ALTER TABLE "public"."terceros"
  ADD COLUMN "fecha_expiracion" TIMESTAMP(0) WITHOUT TIME ZONE;




ALTER TABLE "public"."terceros"
  ADD COLUMN "fecha_nacimiento" TIMESTAMP(0) WITHOUT TIME ZONE;

ALTER TABLE "public"."terceros"
  ADD COLUMN "razon_social" TEXT;


ALTER TABLE "public"."terceros"
  ADD COLUMN "nombre_comercial" TEXT;


ALTER TABLE "public"."terceros"
  ADD COLUMN "descripcion" TEXT;


ALTER TABLE "public"."terceros"
  ADD COLUMN "nomenclatura_direccion1" INTEGER;

CREATE UNIQUE INDEX "nomenclatura_direccion_id_key" ON "public"."nomenclatura_direccion"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk3" FOREIGN KEY ("nomenclatura_direccion1")
    REFERENCES "public"."nomenclatura_direccion"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."terceros"
  ADD COLUMN "nomenclatura_descripcion1" TEXT;

ALTER TABLE "public"."terceros"
  ADD COLUMN "nomenclatura_direccion2" INTEGER;


ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk4" FOREIGN KEY ("nomenclatura_direccion2")
    REFERENCES "public"."nomenclatura_direccion"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE "public"."terceros"
  ADD COLUMN "nomenclatura_descripcion2" TEXT;


ALTER TABLE "public"."terceros"
  ADD COLUMN "numero_predio" TEXT;

ALTER TABLE "public"."terceros"
  ADD COLUMN "barrio" TEXT;

ALTER TABLE "public"."terceros"
  ADD COLUMN "tipo_correo_id" INTEGER;


CREATE UNIQUE INDEX "tipos_correo_id_key" ON "public"."tipos_correo"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk5" FOREIGN KEY ("tipo_correo_id")
    REFERENCES "public"."tipos_correo"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."terceros"
  ADD COLUMN "tipo_red_social_id" INTEGER;


CREATE UNIQUE INDEX "tipos_redes_sociales_id_key" ON "public"."tipos_redes_sociales"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk6" FOREIGN KEY ("tipo_red_social_id")
    REFERENCES "public"."tipos_redes_sociales"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."terceros"
  ADD COLUMN "tipo_direccion_id" INTEGER;

CREATE UNIQUE INDEX "tipo_direccion_id_key" ON "public"."tipo_direccion"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk7" FOREIGN KEY ("tipo_direccion_id")
    REFERENCES "public"."tipo_direccion"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;



ALTER TABLE "public"."nomenclatura_direccion"
  ADD COLUMN "codigo" VARCHAR(10);

ALTER TABLE "public"."nomenclatura_direccion"
  ALTER COLUMN "codigo" SET NOT NULL;


CREATE TABLE "public"."nacionalidad" (
  "id" SERIAL, 
  "descripcion" VARCHAR(255) NOT NULL
) WITH OIDS;

ALTER TABLE "public"."nacionalidad"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."nacionalidad"
  ALTER COLUMN "descripcion" SET STATISTICS 0;

ALTER TABLE "public"."terceros"
  ADD COLUMN "tipo_nacionalidad" INTEGER;


CREATE UNIQUE INDEX "nacionalidad_id_key" ON "public"."nacionalidad"
("id");

ALTER TABLE "public"."terceros"
  ADD CONSTRAINT "terceros_fk8" FOREIGN KEY ("tipo_nacionalidad")
    REFERENCES "public"."nacionalidad"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;