
define(["angular", "js/models", "includes/classes/Proveedor"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('ProveedorIngreso', ["Proveedor", function(Proveedor) {

            ProveedorIngreso.prototype = Object.create(Proveedor.getClass().prototype)

            function ProveedorIngreso(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {

                Proveedor.getClass().call(this, tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono);
                
                this.ordenes_compra = [];
            }


            this.get = function(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {
                return new ProveedorIngreso(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono);
            };
            
            // Orden de Compra
            ProveedorIngreso.prototype.set_ordenes_compras = function(orden_compra) {
                this.ordenes_compra.push(orden_compra);
            };

            ProveedorIngreso.prototype.get_ordenes_compras = function() {
                return this.ordenes_compra;
            };
            
            ProveedorIngreso.prototype.limpiar_ordenes_compras = function() {
                this.ordenes_compra = [];
            };
            
            return this;
        }]);
});