
define(["angular", "js/models", "includes/classes/Documento"], function (angular, models) {

    models.factory('DocumentoDespacho', ["Documento", function (Documento) {


            function DocumentoDespacho(bodegas_doc_id, prefijo, numero, fecha_registro){
                Documento.getClass().call(this, bodegas_doc_id, prefijo, numero, fecha_registro);
                this.valor;
                this.saldo;
                this.estadoSincronizacion;
                this.descripcionEstado;    
                this.fechaFactura;
                this.fechaVencimientoFactura;
            }

            DocumentoDespacho.prototype = Object.create(Documento.getClass().prototype);

            DocumentoDespacho.prototype.setValor = function(valor){
                this.valor = valor;
            };
            
            DocumentoDespacho.prototype.setSaldo = function(saldo){
                this.saldo = saldo;
            };
            
            DocumentoDespacho.prototype.setDescripcionEstado = function(descripcionEstado){
                this.descripcionEstado = descripcionEstado;
            };
            
            DocumentoDespacho.prototype.setEstadoSincronizaciono = function(estadoSincronizacion){
                this.estadoSincronizacion = estadoSincronizacion;
            };
            
            DocumentoDespacho.prototype.setFechaFactura = function(fechaFactura){
                this.fechaFactura = fechaFactura;
            };
            
            DocumentoDespacho.prototype.setFechaVencimientoFactura = function(fechaVencimientoFactura){
                this.fechaVencimientoFactura = fechaVencimientoFactura;
            };
            
            DocumentoDespacho.prototype.getValor = function(){
                return this.valor;
            };
            
            DocumentoDespacho.prototype.getSaldo = function(){
                return this.saldo;
            };
            
            DocumentoDespacho.prototype.getDescripcionEstado = function(){
                return this.descripcionEstado;
            };
            
            DocumentoDespacho.prototype.getEstadoSincronizaciono = function(){
                return this.estadoSincronizacion;
            };
            
            DocumentoDespacho.prototype.getFechaFactura = function(){
                return this.fechaFactura;
            };
            
            DocumentoDespacho.prototype.getFechaVencimientoFactura = function(){
                return this.fechaVencimientoFactura;
            };
            
            
            this.get = function (bodegas_doc_id, prefijo, numero, fecha_registro) {
                return new DocumentoDespacho(bodegas_doc_id, prefijo, numero, fecha_registro);
            };

            return this;

        }]);

});