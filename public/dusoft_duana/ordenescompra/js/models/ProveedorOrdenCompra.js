
define(["angular", "js/models", "includes/classes/Proveedor"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('ProveedorOrdenCompra', ["Proveedor", function(Proveedor) {

            ProveedorOrdenCompra.prototype = Object.create(Proveedor.getClass().prototype)

            function ProveedorOrdenCompra(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {

                Proveedor.getClass().call(this, tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono);
            }


            this.get = function(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {
                return new ProveedorOrdenCompra(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono);
            };

            return this;
        }]);
});