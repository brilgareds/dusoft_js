define(["angular", "js/models", "includes/classes/Cliente"], function(angular, models) {

    models.factory('ClientePlanillaDespacho', ["Cliente", "$filter", function(Cliente, $filter) {

            function ClientePlanillaDespacho(nombre, direccion, tipo_id, id, telefono) {
                Cliente.getClass().call(this, nombre, direccion, tipo_id, id, telefono);               
                
            }

            this.get = function(nombre, direccion, tipo_id, id, telefono) {
                return new ClientePlanillaDespacho(nombre, direccion, tipo_id, id, telefono);
            };
            
            this.getClass = function(){
                return ClientePlanillaDespacho;
            };

            ClientePlanillaDespacho.prototype = Object.create(Cliente.getClass().prototype);

            ClientePlanillaDespacho.documentos = [];

            ClientePlanillaDespacho.prototype.set_documentos = function(documento) {
                this.documentos.push(documento);
            };

            ClientePlanillaDespacho.prototype.get_documentos = function() {
                return this.documentos;
            };
            
            ClientePlanillaDespacho.prototype.limpiar_documentos = function() {
                return this.documentos = [];
            };
            
            
            return this;
        }]);
});

