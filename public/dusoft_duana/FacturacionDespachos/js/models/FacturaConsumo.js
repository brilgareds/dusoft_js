
define(["angular", "js/models", "includes/classes/Factura"], function (angular, models) {

    models.factory('FacturaConsumo', ["Factura", function (Factura) {


            function FacturaConsumo(){
                Factura.getClass().call(this);
                this.detalle = [];
                this.documentos = [];
                this.id =0;
                this.empresaId = '';
                this.tercero = [];
                this.fechaRegistro = '';
                this.observaciones = '';
                this.valorTotal = '';
                this.valorSubTotal = '';
                this.tipoPago = '';
                this.fechaCorte = '';
            }
            
            FacturaConsumo.prototype = Object.create(Factura.getClass().prototype);
            
            FacturaConsumo.prototype.setId = function(id){
                this.id = id;
            };
            
            FacturaConsumo.prototype.getId = function(){
                return this.id;
            };
            FacturaConsumo.prototype.setEmpresaId = function(empresaId){
                this.empresaId = empresaId;
            };
            
            FacturaConsumo.prototype.getEmpresaId = function(){
                return this.empresaId;
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
            
            this.get = function () {
                return new FacturaConsumo();
            };

            return this;

        }]);

});