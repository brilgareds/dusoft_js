
define(["angular", "js/models", "includes/classes/Proveedor"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('ProveedorIngreso', ["Proveedor", function(Proveedor) {

            ProveedorIngreso.prototype = Object.create(Proveedor.getClass().prototype)

            function ProveedorIngreso(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {

                Proveedor.getClass().call(this, tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono);
            }


            this.get = function(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {
                return new ProveedorIngreso(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono);
            };
            
            return this;
        }]);
});