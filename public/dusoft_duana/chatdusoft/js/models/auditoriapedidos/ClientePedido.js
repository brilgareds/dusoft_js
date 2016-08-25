
define(["angular", "js/models", "includes/classes/Cliente"], function(angular, models) {

    models.factory('ClientePedido', ["Cliente", function(Cliente) {

        function ClientePedido(nombre, direccion, tipo_id, id, telefono) {
            Cliente.getClass().call(this,nombre, direccion, tipo_id, id, telefono);
            
            this.identificacion;
            this.ubicacion;
            this.contrato_id = 0;
            this.estado_contrato;
            this.email;
            this.contrato_vigente;
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
            this.contrato_id = contrato_id || 0;
        };
        
        ClientePedido.prototype.getContratoId = function() {
            return this.contrato_id;
        };
        
        ClientePedido.prototype.setEstadoContrato = function(estado_contrato) {
            this.estado_contrato = estado_contrato;
        };
        
        ClientePedido.prototype.getEstadoContrato = function() {
            return this.estado_contrato;
        };
        
        ClientePedido.prototype.setEmail = function(email) {
            this.email = email;
        };
        
        ClientePedido.prototype.getEmail = function() {
            return this.email;
        };
        
        //this.contrato_vigente
        ClientePedido.prototype.setContratoVigente = function(contrato_vigente) {
            this.contrato_vigente = contrato_vigente;
        };
        
        ClientePedido.prototype.getContratoVigente = function() {
            return this.contrato_vigente;
        };
        
        return this;

    }]);
});