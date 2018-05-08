define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoBodega', ["Documento" , "$filter", function(Documento, $filter) {

            function DocumentoBodega(id, prefijo, numero, fecha_registro) {
                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoBodega.prototype = Object.create(Documento.getClass().prototype);
            
            DocumentoBodega.torres = [];
            
            
            this.get = function(id, prefijo, numero, fecha_registro) {                
                return new DocumentoBodega(id, prefijo, numero, fecha_registro);
            };
            
            DocumentoBodega.prototype.getArchivo = function() {
               return this.archivo;
            };

            DocumentoBodega.prototype.setArchivo = function(archivo) {
                this.archivo = archivo;
            };
            
            DocumentoBodega.prototype.getPrefijoNumero = function() {
               return this.prefijoNumero;
            };

            DocumentoBodega.prototype.setPrefijoNumero = function(prefijoNumero) {
                this.prefijoNumero = prefijoNumero;
            };
            
            DocumentoBodega.prototype.getTerceroId = function() {
               return this.terceroId;
            };

            DocumentoBodega.prototype.setTerceroId = function(terceroId) {
                this.terceroId = terceroId;
            };
            
            DocumentoBodega.prototype.getTipoTercero = function() {
               return this.tipoTercero;
            };

            DocumentoBodega.prototype.setTipoTercero = function(tipoTercero) {
                this.tipoTercero = tipoTercero;
            };
            
            DocumentoBodega.prototype.getNumeroFactura = function() {
               return this.numeroFactura;
            };

            DocumentoBodega.prototype.setNumeroFactura = function(numeroFactura) {
                this.numeroFactura = numeroFactura;
            };
            
            DocumentoBodega.prototype.getPrefijoFactura = function() {
               return this.prefijoFactura;
            };

            DocumentoBodega.prototype.setPrefijoFactura = function(prefijoFactura) {
                this.prefijoFactura = prefijoFactura;
            };
            
                        // torres
            DocumentoBodega.set_torres = function(torre) {
                this.torres.push(torre);
            };

            DocumentoBodega.get_torres = function() {
                return this.torres;
            };

            DocumentoBodega.limpiar_torres = function() {
                this.torres = [];
            };
            
            
            return this;
        }]);
});