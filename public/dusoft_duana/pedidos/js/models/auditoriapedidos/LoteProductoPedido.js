
define(["angular", "js/models", "includes/classes/Lote"], function(angular, models) {


    models.factory('LoteProductoPedido', ["Lote", function(Lote) {


        function LoteProductoPedido(codigo_lote, fecha_vencimiento) {
            Lote.getClass().call(this,codigo_lote, fecha_vencimiento);
            this.existencia_actual = 0;
            this.disponible = 0;
            this.item_id = 0;
            this.cantidad_ingresada = 0;
            this.cantidad_pendiente = 0;
            this.justificacion_separador = "";
            this.justificacion_auditor = "";
            this.seleccionado = false;
            this.numero_caja = 0;
            this.auditado = "0";
            this.tipoCaja;
            
            this.separado = false;
            this.cantidad = 0;
        }

        LoteProductoPedido.prototype = Object.create(Lote.getClass().prototype);
        
        LoteProductoPedido.prototype.setTipoCaja = function(tipoCaja){
            this.tipoCaja = tipoCaja;
        };
        
        LoteProductoPedido.prototype.getTipoCaja = function(){
            return this.tipoCaja;
        };
        
        LoteProductoPedido.prototype.setSeleccionado = function(seleccionado){
            this.seleccionado = seleccionado;
        };
        
        LoteProductoPedido.prototype.getSeleccionado = function(){
            return this.seleccionado;
        };
        
        
        LoteProductoPedido.prototype.setNumeroCaja = function(numero_caja){
            this.numero_caja = numero_caja;
        };
        
        LoteProductoPedido.prototype.getNumeroCaja = function(){
            return this.numero_caja;
        };
        
        
        LoteProductoPedido.prototype.setExistenciaActual = function(existencia_actual){
            this.existencia_actual = existencia_actual;
            return this;
        };
        
        LoteProductoPedido.prototype.getExistenciaActual = function(){
            return this.existencia_actual;
        };
        
        LoteProductoPedido.prototype.setDisponible = function(disponible) {
            this.disponible = disponible;
            return this;
        };
        
        LoteProductoPedido.prototype.getDisponible = function() {
            return this.disponible;
        }; 
                
        LoteProductoPedido.prototype.setItemId = function(itemId) {
            this.item_id = itemId;
            return this;
        };
        
        LoteProductoPedido.prototype.getItemId = function() {
            return this.item_id;
        };        
       
        LoteProductoPedido.prototype.setSeparado = function(separado) {
            this.separado = separado;
            return this;
        };
        
        LoteProductoPedido.prototype.getSeparado = function() {
            return this.separado;
        }; 
       
        LoteProductoPedido.prototype.setCantidadIngresada = function(cantidad_ingresada) {
            this.cantidad_ingresada = cantidad_ingresada;
            return this;
        };
        
        LoteProductoPedido.prototype.getCantidadIngresada = function() {
            return this.cantidad_ingresada;
        }; 
        
        LoteProductoPedido.prototype.setCantidad = function(cantidad) {
            this.cantidad = cantidad;
            return this;
        };
        
        LoteProductoPedido.prototype.getCantidad = function() {
            return this.cantidad;
        }; 
        
        

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function(codigo_lote, fecha_vencimiento) {
            return new LoteProductoPedido(codigo_lote, fecha_vencimiento);
        };

        //just return the factory wrapper
        return this;

    }]);
});
