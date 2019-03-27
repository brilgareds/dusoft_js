define(["angular", "js/models", "includes/classes/Cliente"], function(angular, models) {

    models.factory('ClienteDocumento', ["Cliente", "$filter", function(Cliente, $filter) {

            function ClienteDocumento(nombre, direccion, tipo_id, id, telefono) {
                Cliente.getClass().call(this, nombre, direccion, tipo_id, id, telefono);               
                
            }

            this.get = function(nombre, direccion, tipo_id, id, telefono) {
                return new ClienteDocumento(nombre, direccion, tipo_id, id, telefono);
            };
            
            this.getClass = function(){
                return ClienteDocumento;
            };

            ClienteDocumento.prototype = Object.create(Cliente.getClass().prototype);

            ClienteDocumento.documentos = [];

            ClienteDocumento.prototype.set_documentos = function(documento) {
                this.documentos.push(documento);
            };

            ClienteDocumento.prototype.get_documentos = function() {
                return this.documentos;
            };
            
            ClienteDocumento.prototype.limpiar_documentos = function() {
                return this.documentos = [];
            };
            
            
            return this;
        }]);
});

