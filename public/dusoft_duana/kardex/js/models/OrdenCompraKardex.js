
define(["angular", "js/models", "includes/classes/OrdenCompra"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('OrdenCompraKardex', ["OrdenCompra", function(OrdenCompra) {

            OrdenCompraKardex.prototype = Object.create(OrdenCompra.getClass().prototype)

            function OrdenCompraKardex(numero_orden_compra) {

                OrdenCompra.getClass().call(this, numero_orden_compra);
                this.proveedor;
            }


            this.get = function(numero_orden_compra) {
                return new OrdenCompraKardex(numero_orden_compra);
            };

            OrdenCompraKardex.prototype.setProveedor = function(proveedor) {
                this.proveedor = proveedor;
            };

            OrdenCompraKardex.prototype.setDatos = function(datos) {
                
                console.log('==== Datos ====');
                console.log(datos);
                
                this.proveedor = datos.proveedor || null;
                this.cantidad_solicitada = datos.cantidad_solicitada || null;
                this.cantidad_pendiente = datos.cantidad_pendiente || null;
                this.usuario = datos.usuario || null;
            };

            return this;
        }]);
});