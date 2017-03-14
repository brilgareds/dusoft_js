ALTER TABLE "public"."terceros_proveedores"
  ADD COLUMN "excluir_fletes" CHAR(1);



CREATE TABLE "public"."divisas" (
  "id" SERIAL, 
  "codigo" VARCHAR(255) NOT NULL, 
  "descripcion" TEXT NOT NULL
) WITH OIDS;

ALTER TABLE "public"."divisas"
  ALTER COLUMN "id" SET STATISTICS 0;

ALTER TABLE "public"."divisas"
  ALTER COLUMN "codigo" SET STATISTICS 0;

ALTER TABLE "public"."divisas"
  ALTER COLUMN "descripcion" SET STATISTICS 0;


ALTER TABLE "public"."terceros_proveedores"
  ADD COLUMN "divisa_pago_id" INTEGER;


CREATE UNIQUE INDEX "divisas_id_key" ON "public"."divisas"
("id");

ALTER TABLE "public"."terceros_proveedores"
  ADD CONSTRAINT "terceros_proveedores_fk" FOREIGN KEY ("divisa_pago_id")
    REFERENCES "public"."divisas"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."terceros_proveedores"
  ADD COLUMN "divisa_factura_id" INTEGER;


ALTER TABLE "public"."terceros_proveedores"
  ADD CONSTRAINT "terceros_proveedores_fk1" FOREIGN KEY ("divisa_factura_id")
    REFERENCES "public"."divisas"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE "public"."terceros_proveedores"
  ADD COLUMN "codigo_ciuu" VARCHAR(255);