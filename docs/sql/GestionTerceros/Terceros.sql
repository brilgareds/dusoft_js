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

/***************tablas ************************/

ALTER TABLE "public"."terceros"
  ADD COLUMN "genero_id" INTEGER;

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
  ADD COLUMN "estado_civil_id" INTEGER;

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