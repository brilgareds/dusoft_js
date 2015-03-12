
define(["angular", "js/models", "includes/classes/Cliente"], function(angular, models) {

    models.factory('ClientePedido', ["Cliente", function(Cliente) {

        function ClientePedido(nombre, direccion, tipo_id, id, telefono) {
            Cliente.getClass().call(this,nombre, direccion, tipo_id, id, telefono);
            
            this.identificacion;
            this.ubicacion;
            this.contrato_id;
            this.tipo_bloqueo_id;
        }

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
            return new ClientePedido(nombre, direccion, tipo_id, id, telefono);
        };

        ClientePedido.prototype = Object.create(Cliente.getClass().prototype);
        
        ClientePedido.prototype.setIdentificacion = function() {
            this.identificacion = this.tipo_id_tercero+"-"+this.id;
        };
        
        ClientePedido.prototype.getIdentificacion = function() {
            return this.identificacion;
        };
        
        ClientePedido.prototype.setUbicacion = function() {
            this.ubicacion = this.pais+"-"+this.departamento+"-"+this.municipio;
        };
        
        ClientePedido.prototype.getUbicacion = function() {
            return this.ubicacion;
        };
        
        ClientePedido.prototype.setContratoId = function(contrato_id) {
            this.contrato_id = contrato_id;
        };
        
        ClientePedido.prototype.getContratoId = function() {
            return this.contrato_id;
        };
        
        ClientePedido.prototype.setTipoBloqueoId = function(tipo_bloqueo_id) {
            this.tipo_bloqueo_id = tipo_bloqueo_id;
        };
        
        ClientePedido.prototype.getTipoBloqueoId = function() {
            return this.tipo_bloqueo_id;
        };
        
        return this;

    }]);
});