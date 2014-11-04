define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('EmpresaOrdenCompra', ["Empresa", function(Empresa) {

            EmpresaOrdenCompra.prototype = Object.create(Empresa.getClass().prototype)

            function EmpresaOrdenCompra(empresa_id, tipo_id, identificacion, nombre_empresa) {

                this.empresa_id = empresa_id;
                this.tipo_id = tipo_id;
                this.identificacion = identificacion;
                this.nombre = nombre_empresa;     
                
                this.ordenes_compras = [];
            }
            
            this.get = function(empresa_id, tipo_id, identificacion, nombre_empresa) {
                return new EmpresaOrdenCompra(empresa_id, tipo_id, identificacion, nombre_empresa);
            };
            
            EmpresaOrdenCompra.prototype.set_ordenes_compras = function(orden_compra) {
               this.ordenes_compras.push(orden_compra);
            };
            
            EmpresaOrdenCompra.prototype.get_ordenes_compras = function(orden_compra) {
               return this.ordenes_compras;
            };
            
            EmpresaOrdenCompra.prototype.limpiar_ordenes_compras = function() {
               this.ordenes_compras = [];
            };

            return this;
        }]);
});