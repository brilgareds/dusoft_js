
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
            
            ProveedorOrdenCompra.prototype.get_codigo_proveedor = function() {
               
               return this.codigo_proveedor_id;
            };
            
            ProveedorOrdenCompra.prototype.get_nombre = function() {
               
               var nombre_proveedor = this.tipo_id_tercero +' '+ this.id + ' - ' + this.nombre_tercero;
                
               return nombre_proveedor;
            };

            return this;
        }]);
});