define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaIngreso', ["Empresa" , "$filter", function(Empresa, $filter) {

            var EmpresaIngreso = Object.create(Empresa.getClass().prototype)

            EmpresaIngreso.ordenes_compras = [];
            EmpresaIngreso.proveedores = [];
            EmpresaIngreso.unidades_negocios = [];
            EmpresaIngreso.laboratorios = [];
            EmpresaIngreso.productos = [];
            EmpresaIngreso.observaciones_ordenes_compra = [];
            EmpresaIngreso.transportadoras = [];
            EmpresaIngreso.recepciones_mercancia = [];
            EmpresaIngreso.novedades_mercancia = [];


            // Ordenes de Compra
            EmpresaIngreso.set_ordenes_compras = function(orden_compra) {
                this.ordenes_compras.push(orden_compra);
            };

            EmpresaIngreso.get_ordenes_compras = function() {
                return this.ordenes_compras;
            };

            EmpresaIngreso.limpiar_ordenes_compras = function() {
                this.ordenes_compras = [];
            };

            // Proveedores
            EmpresaIngreso.set_proveedores = function(proveedor) {
                this.proveedores.push(proveedor);
            };

            EmpresaIngreso.get_proveedores = function() {
                return this.proveedores;
            };
            
            EmpresaIngreso.get_proveedor = function(codigo_proveedor_id) {
                
                var proveedor = $filter('filter')(this.get_proveedores(), {codigo_proveedor_id: parseInt(codigo_proveedor_id)}, true);
                
                return (proveedor.length > 0) ? proveedor[0] : {};
            };

            EmpresaIngreso.limpiar_proveedores = function() {
                this.proveedores = [];
            };

            // Unidades de Negocios
            EmpresaIngreso.set_unidades_negocios = function(unidad_negocio) {
                this.unidades_negocios.push(unidad_negocio);
            };

            EmpresaIngreso.get_unidades_negocios = function() {
                return this.unidades_negocios;
            };
            
            EmpresaIngreso.get_unidad_negocio = function(codigo) {
                
                var unidad_negocio = $filter('filter')(this.get_unidades_negocios(), {codigo: codigo}, true);
                
                return (unidad_negocio.length > 0) ? unidad_negocio[0] : {};
            };

            EmpresaIngreso.limpiar_unidades_negocios = function() {
                this.unidades_negocios = [];
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
            
            // Productos
            EmpresaIngreso.set_productos = function(producto) {
                this.productos.push(producto);
            };

            EmpresaIngreso.get_productos = function() {
                return this.productos;
            };

            EmpresaIngreso.limpiar_productos = function() {
                this.productos = [];
            };
                        
            // Observaciones Ordenes Compra
            EmpresaIngreso.set_observaciones = function(observaciones) {
                this.observaciones_ordenes_compra.push(observaciones);
            };

            EmpresaIngreso.get_observaciones = function() {
                return this.observaciones_ordenes_compra;
            };
            
            EmpresaIngreso.get_observacion = function(id) {
                
                var observacion = $filter('filter')(this.get_observaciones(), {id: parseInt(id)}, true);
                
                return (observacion.length > 0) ? observacion[0] : {};
            };

            EmpresaIngreso.limpiar_observaciones = function() {
                this.observaciones_ordenes_compra = [];
            };
            
            
            // Transportadoras
            EmpresaIngreso.set_transportadoras = function(transportadora) {
                this.transportadoras.push(transportadora);
            };

            EmpresaIngreso.get_transportadoras = function() {
                return this.transportadoras;
            };

            EmpresaIngreso.limpiar_transportadoras = function() {
                this.transportadoras = [];
            };
            
            
            // Novedades de mercancia
            EmpresaIngreso.set_novedades_mercancia = function(novedad) {
                this.novedades_mercancia.push(novedad);
            };

            EmpresaIngreso.get_novedades_mercancia = function() {
                return this.novedades_mercancia;
            };

            EmpresaIngreso.limpiar_novedades_mercancia = function() {
                this.novedades_mercancia = [];
            };
            
            
            // Recepciones de mercancia
            EmpresaIngreso.set_recepciones_mercancia = function(recepcion) {
                this.recepciones_mercancia.push(recepcion);
            };

            EmpresaIngreso.get_recepciones_mercancia = function() {
                return this.recepciones_mercancia;
            };

            EmpresaIngreso.limpiar_recepciones_mercancia = function() {
                this.recepciones_mercancia = [];
            };

            return EmpresaIngreso;
        }]);
});