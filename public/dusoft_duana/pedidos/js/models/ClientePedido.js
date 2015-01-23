
define(["angular", "js/models", "includes/classes/Cliente"], function(angular, models) {

    models.factory('ClientePedido', ["Cliente", function(Cliente) {

        function ClientePedido(nombre, direccion, tipo_id, id, telefono) {
            Cliente.getClass().call(this,nombre, direccion, tipo_id, id, telefono);
            
            this.identificacion;
            this.ubicacion;
        }

        this.get = function(nombre, direccion, tipo_id, id, telefono) {
            return new ClientePedido(nombre, direccion, tipo_id, id, telefono);
        }

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
        
        return this;

    }]);
});