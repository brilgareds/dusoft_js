
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
                this.prefijoNumero;
                this.mensaje1;
                this.mensaje2;
                this.mensaje3;
            }

            DocumentoDespacho.prototype = Object.create(Documento.getClass().prototype);
            
            DocumentoDespacho.prototype.setMensaje1 = function(mensaje1){
                this.mensaje1 = mensaje1;
            };
            
            DocumentoDespacho.prototype.setMensaje2 = function(mensaje2){
                this.mensaje2 = mensaje2;
            };
            
            DocumentoDespacho.prototype.setMensaje3 = function(mensaje3){
                this.mensaje3 = mensaje3;
            };
            
            DocumentoDespacho.prototype.setPrefijoNumero = function(prefijoNumero){
                this.prefijoNumero = prefijoNumero;
            };
            
            DocumentoDespacho.prototype.setValor = function(valor){
                this.valor = valor;
            };
            
            DocumentoDespacho.prototype.setSaldo = function(saldo){
                this.saldo = saldo;
            };
            
            DocumentoDespacho.prototype.setDescripcionEstado = function(descripcionEstado){
                this.descripcionEstado = descripcionEstado;
            };
            
            DocumentoDespacho.prototype.setEstadoSincronizacion = function(estadoSincronizacion){
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
            
            DocumentoDespacho.prototype.getEstadoSincronizacion = function(){
                return this.estadoSincronizacion;
            };
            
            DocumentoDespacho.prototype.getFechaFactura = function(){
                return this.fechaFactura;
            };
            
            DocumentoDespacho.prototype.getFechaVencimientoFactura = function(){
                return this.fechaVencimientoFactura;
            };
            
            DocumentoDespacho.prototype.getPrefijoNumero = function(){
                return this.prefijoNumero;
            };
            
            DocumentoDespacho.prototype.getMensaje1 = function(){
                return this.mensaje1;
            };
            
            DocumentoDespacho.prototype.getMensaje2 = function(){
                return this.mensaje2;
            };
            
            DocumentoDespacho.prototype.getMensaje3 = function(){
                return this.mensaje3;
            };
            
            this.get = function (bodegas_doc_id, prefijo, numero, fecha_registro) {
                return new DocumentoDespacho(bodegas_doc_id, prefijo, numero, fecha_registro);
            };

            return this;

        }]);

});