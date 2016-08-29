
define(["angular", "js/models", "includes/classes/Vendedor"], function(angular, models) {

    models.factory('VendedorPedidoCliente', ["Vendedor", function(Vendedor) {

            function VendedorPedidoCliente(nombre, tipo_id, id, telefono) {
                Vendedor.getClass().call(this, nombre, tipo_id, id, telefono);
            }
            ;

            VendedorPedidoCliente.prototype = Object.create(Vendedor.getClass().prototype);

            this.get = function(nombre, tipo_id, id, telefono) {
                return new VendedorPedidoCliente(nombre, tipo_id, id, telefono);
            };

            // Descripcion Completa
            VendedorPedidoCliente.prototype.get_descripcion = function() {

                var descripcion = "";

                if (this.nombre_tercero !== "") {
                    descripcion = this.getTipoId() + " " + this.getId() + " - " + this.getNombre();
                }

                return descripcion;
            };

            return this;
        }]);
});