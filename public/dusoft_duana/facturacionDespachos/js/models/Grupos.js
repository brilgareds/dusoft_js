
define(["angular", "js/models"], function(angular, models) {

    models.factory('Grupos', [function() {


            function Grupos(gruposConcepto, descripcion) {
                this.gruposConcepto = gruposConcepto;
                this.descripcion = descripcion;
            }
            ;

            Grupos.prototype.setGruposConcepto = function(gruposConcepto) {
                this.gruposConcepto = gruposConcepto;
            };

            Grupos.prototype.getGruposConcepto = function() {
                return this.gruposConcepto;
            };

            Grupos.prototype.setDescripcion = function(descripcion) {
                this.descripcion = descripcion;
            };

            Grupos.prototype.getDescripcion = function() {
                return this.descripcion;
            };

            Grupos.prototype.setDescripcionConcepto = function(descripcionConcepto) {
                this.descripcionConcepto = descripcionConcepto;
            };

            Grupos.prototype.getDescripcionConcepto = function() {
                return this.descripcionConcepto;
            };

            Grupos.prototype.setPrecio = function(precio) {
                this.precio = precio;
            };

            Grupos.prototype.getPrecio = function() {
                return this.precio;
            };

            Grupos.prototype.setPorcentajeGravamen = function(porcentajeGravamen) {
                this.porcentajeGravamen = porcentajeGravamen;
            };

            Grupos.prototype.getPorcentajeGravamen = function() {
                return this.porcentajeGravamen;
            };

            Grupos.prototype.setSwPrecioManual = function(swPrecioManual) {
                this.swPrecioManual = swPrecioManual;
            };

            Grupos.prototype.getSwPrecioManual = function() {
                return this.swPrecioManual;
            };

            Grupos.prototype.setSwCantidad = function(swCantidad) {
                this.swCantidad = swCantidad;
            };

            Grupos.prototype.getSwCantidad = function() {
                return this.swCantidad;
            };

            Grupos.prototype.setConceptoId = function(conceptoId) {
                this.conceptoId = conceptoId;
            };

            Grupos.prototype.getConceptoId = function() {
                return this.conceptoId;
            };

            this.get = function(GruposConcepto, descripcion) {
                return new Grupos(GruposConcepto, descripcion);
            };

            return this;

        }]);

});