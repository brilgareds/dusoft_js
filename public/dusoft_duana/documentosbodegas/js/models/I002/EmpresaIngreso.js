define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaIngreso', ["Empresa" , "$filter", function(Empresa, $filter) {

            var EmpresaIngreso = Object.create(Empresa.getClass().prototype)

            EmpresaIngreso.proveedores = [];
            EmpresaIngreso.documentos = [];
            EmpresaIngreso.productos = [];

            // Proveedores
            EmpresaIngreso.set_proveedores = function(proveedor) {
                this.proveedores.push(proveedor);
            };

            EmpresaIngreso.get_proveedores = function() {
                return this.proveedores;
            };

            EmpresaIngreso.limpiar_proveedores = function() {
                this.proveedores = [];
            };
            
            // Documentos
            EmpresaIngreso.set_documentos = function(orden_compra) {
                this.documentos.push(orden_compra);
            };

            EmpresaIngreso.get_documentos = function() {
                return this.documentos;
            };

            EmpresaIngreso.limpiar_documentos = function() {
                this.documentos = [];
            };

            // Productos
            EmpresaIngreso.set_productos = function(proveedor) {
                this.productos.push(proveedor);
            };

            EmpresaIngreso.get_productos = function() {
                return this.productos;
            };
            
            EmpresaIngreso.limpiar_productos = function() {
                this.productos = [];
            };
            
            // Laboratorios
            EmpresaIngreso.set_laboratorios = function(laboratorio) {
                this.laboratorios.push(laboratorio);
            };

            EmpresaIngreso.get_laboratorios = function() {
                return this.laboratorios;
            };

            EmpresaIngreso.limpiar_laboratorios = function() {
                this.laboratorios = [];
            };
            

            return EmpresaIngreso;
        }]);
});