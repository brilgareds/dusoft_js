
define(["angular", "js/models", "includes/classes/Cliente"], function(angular, models) {

    models.factory('ClientePedido', ["Cliente", function(Cliente) {

            function ClientePedido(nombre, direccion, tipo_id, id, telefono) {
                Cliente.getClass().call(this, nombre, direccion, tipo_id, id, telefono);

                this.contrato_id = 0;
            }


            this.get = function(nombre, direccion, tipo_id, id, telefono) {
                return new ClientePedido(nombre, direccion, tipo_id, id, telefono);
            };

            ClientePedido.prototype = Object.create(Cliente.getClass().prototype);

            // Descripcion Completa
            ClientePedido.prototype.get_descripcion = function() {

                var descripcion = "";

                if (this.nombre_tercero !== "") {
                    descripcion = this.getTipoId() + " " + this.getId() + " - " + this.getNombre();
                }

                return descripcion;
            };

            // Ubicacion Completa
            ClientePedido.prototype.get_ubicacion = function() {

                var ubicacion = "";

                if (this.nombre_tercero !== "") {
                    ubicacion = this.getDireccion() + " (" + this.getMunicipio() + " - " + this.getDepartamento() + " ) ";
                }

                return ubicacion;
            };

            // Contrato
            ClientePedido.prototype.set_contrato = function(id) {

                this.contrato_id = id;
                return this;
            };

            ClientePedido.prototype.get_contrato = function() {

                return this.contrato_id;
            };

            return this;

        }]);
});