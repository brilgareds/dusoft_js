define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('EmpresaOrdenCompra', ["Empresa", function(Empresa) {

            var EmpresaOrdenCompra = Object.create(Empresa.getClass().prototype)

            /*function EmpresaOrdenCompra(empresa_id, tipo_id, identificacion, nombre_empresa) {
             
             this.empresa_id = empresa_id;
             this.tipo_id = tipo_id;
             this.identificacion = identificacion;
             this.nombre = nombre_empresa;
             
             this.ordenes_compras = [];
             this.proveedores = [];
             }
             
             this.get = function(empresa_id, tipo_id, identificacion, nombre_empresa) {
             return new EmpresaOrdenCompra(empresa_id, tipo_id, identificacion, nombre_empresa);
             };*/

            EmpresaOrdenCompra.ordenes_compras = [];
            EmpresaOrdenCompra.proveedores = [];

            EmpresaOrdenCompra.set_ordenes_compras = function(orden_compra) {
                this.ordenes_compras.push(orden_compra);
            };

            EmpresaOrdenCompra.get_ordenes_compras = function() {
                return this.ordenes_compras;
            };

            EmpresaOrdenCompra.limpiar_ordenes_compras = function() {
                this.ordenes_compras = [];
            };

            EmpresaOrdenCompra.set_proveedores = function(proveedor) {
                this.proveedores.push(proveedor);
            };

            EmpresaOrdenCompra.get_proveedores = function() {
                return this.proveedores;
            };

            EmpresaOrdenCompra.limpiar_proveedores = function() {
                this.proveedores = [];
            };

            return EmpresaOrdenCompra;
        }]);
});