define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaOrdenCompra', ["Empresa" , "$filter", function(Empresa, $filter) {

            var EmpresaOrdenCompra = Object.create(Empresa.getClass().prototype)

            EmpresaOrdenCompra.ordenes_compras = [];
            EmpresaOrdenCompra.proveedores = [];
            EmpresaOrdenCompra.unidades_negocios = [];
            EmpresaOrdenCompra.laboratorios = [];
            EmpresaOrdenCompra.productos = [];
            EmpresaOrdenCompra.observaciones_ordenes_compra = [];


            // Ordenes de Compra
            EmpresaOrdenCompra.set_ordenes_compras = function(orden_compra) {
                this.ordenes_compras.push(orden_compra);
            };

            EmpresaOrdenCompra.get_ordenes_compras = function() {
                return this.ordenes_compras;
            };

            EmpresaOrdenCompra.limpiar_ordenes_compras = function() {
                this.ordenes_compras = [];
            };

            // Proveedores
            EmpresaOrdenCompra.set_proveedores = function(proveedor) {
                this.proveedores.push(proveedor);
            };

            EmpresaOrdenCompra.get_proveedores = function() {
                return this.proveedores;
            };
            
            EmpresaOrdenCompra.get_proveedor = function(codigo_proveedor_id) {
                
                var proveedor = $filter('filter')(this.get_proveedores(), {codigo_proveedor_id: parseInt(codigo_proveedor_id)}, true);
                
                return (proveedor.length > 0) ? proveedor[0] : {};
            };

            EmpresaOrdenCompra.limpiar_proveedores = function() {
                this.proveedores = [];
            };

            // Unidades de Negocios
            EmpresaOrdenCompra.set_unidades_negocios = function(unidad_negocio) {
                this.unidades_negocios.push(unidad_negocio);
            };

            EmpresaOrdenCompra.get_unidades_negocios = function() {
                return this.unidades_negocios;
            };
            
            EmpresaOrdenCompra.get_unidad_negocio = function(codigo) {
                
                var unidad_negocio = $filter('filter')(this.get_unidades_negocios(), {codigo: codigo}, true);
                
                return (unidad_negocio.length > 0) ? unidad_negocio[0] : {};
            };

            EmpresaOrdenCompra.limpiar_unidades_negocios = function() {
                this.unidades_negocios = [];
            };
            
            // Laboratorios
            EmpresaOrdenCompra.set_laboratorios = function(laboratorio) {
                this.laboratorios.push(laboratorio);
            };

            EmpresaOrdenCompra.get_laboratorios = function() {
                return this.laboratorios;
            };

            EmpresaOrdenCompra.limpiar_laboratorios = function() {
                this.laboratorios = [];
            };
            
            // Productos
            EmpresaOrdenCompra.set_productos = function(producto) {
                this.productos.push(producto);
            };

            EmpresaOrdenCompra.get_productos = function() {
                return this.productos;
            };

            EmpresaOrdenCompra.limpiar_productos = function() {
                this.productos = [];
            };
                        
            // Observaciones Ordenes Compra
            EmpresaOrdenCompra.set_observaciones = function(observaciones) {
                this.observaciones_ordenes_compra.push(observaciones);
            };

            EmpresaOrdenCompra.get_observaciones = function() {
                return this.observaciones_ordenes_compra;
            };
            
            EmpresaOrdenCompra.get_observacion = function(id) {
                
                var observacion = $filter('filter')(this.get_observaciones(), {id: parseInt(id)}, true);
                
                return (observacion.length > 0) ? observacion[0] : {};
            };

            EmpresaOrdenCompra.limpiar_observaciones = function() {
                this.observaciones_ordenes_compra = [];
            };

            return EmpresaOrdenCompra;
        }]);
});