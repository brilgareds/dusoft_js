define(["angular", "js/models", "includes/classes/Documento"], function (angular, models) {

    models.factory('FacturaConsumo', ["Documento", function (Documento) {


            function FacturaConsumo(bodegas_doc_id, prefijo, numero, fecha_registro){
                Documento.getClass().call(this, bodegas_doc_id, prefijo, numero, fecha_registro);
                this.detalle = [];
                this.documentos = [];
                this.id =0;
                this.empresa = '';
                this.terceros = [];
                this.fechaRegistro = '';
                this.observaciones = '';
                this.valorTotal = '';
                this.valorSubTotal = '';
                this.tipoPago = '';
                this.fechaCorte = '';
                this.usuario = '';
            }
            
            FacturaConsumo.prototype = Object.create(Documento.getClass().prototype);
            
            FacturaConsumo.prototype.setId = function(id){
                this.id = id;
            };
            
            FacturaConsumo.prototype.getId = function(){
                return this.id;
            };
            FacturaConsumo.prototype.setEmpresa = function(empresa){
                this.empresa = empresa;
            };
            
            FacturaConsumo.prototype.getEmpresa = function(){
                return this.empresa;
            };
            
            FacturaConsumo.prototype.setFechaRegistro = function(fechaRegistro){
                this.fechaRegistro = fechaRegistro;
            };
            
            FacturaConsumo.prototype.getFechaRegistro = function(){
                return this.fechaRegistro;
            };
            
            FacturaConsumo.prototype.setObservaciones = function(observaciones){
                this.observaciones = observaciones;
            };
            
            FacturaConsumo.prototype.getObservaciones = function(){
                return this.observaciones;
            };
            
            FacturaConsumo.prototype.setValorTotal = function(valorTotal){
                this.valorTotal = valorTotal;
            };
            
            FacturaConsumo.prototype.getValorTotal = function(){
                return this.valorTotal;
            };
            
            FacturaConsumo.prototype.setValorSubTotal = function(valorSubTotal){
                this.valorSubTotal = valorSubTotal;
            };
            
            FacturaConsumo.prototype.getValorSubTotal = function(){
                return this.valorSubTotal;
            };
            
            FacturaConsumo.prototype.setTipoPago = function(tipoPago){
                this.tipoPago = tipoPago;
            };
            
            FacturaConsumo.prototype.getTipoPago = function(){
                return this.tipoPago;
            };
            
            FacturaConsumo.prototype.setUsuario = function(usuario){
                this.usuario = usuario;
            };
            
            FacturaConsumo.prototype.getUsuario = function(){
                return this.usuario;
            };
            
            FacturaConsumo.prototype.agregarTerceros = function(terceros){
                this.terceros.push(terceros);
            };
            
            FacturaConsumo.prototype.mostrarTerceros = function(){
                return this.terceros;
            };
            
            this.get = function (numeroFactura, codigoProveedor,fechaRegistro,observacion) {
                return new FacturaConsumo(numeroFactura, codigoProveedor,fechaRegistro,observacion);
            };

            return this;

        }]);

});