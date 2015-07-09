define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoIngreso', ["Documento" , "$filter", function(Empresa, $filter) {

            var DocumentoIngreso = Object.create(Empresa.getClass().prototype)

            DocumentoIngreso.ordenes_compras = [];
            DocumentoIngreso.proveedores = [];
            DocumentoIngreso.unidades_negocios = [];
            DocumentoIngreso.laboratorios = [];
            DocumentoIngreso.productos = [];
            DocumentoIngreso.observaciones_ordenes_compra = [];
            DocumentoIngreso.transportadoras = [];
            DocumentoIngreso.recepciones_mercancia = [];
            DocumentoIngreso.novedades_mercancia = [];


            // Ordenes de Compra
            DocumentoIngreso.set_ordenes_compras = function(orden_compra) {
                this.ordenes_compras.push(orden_compra);
            };

            DocumentoIngreso.get_ordenes_compras = function() {
                return this.ordenes_compras;
            };

            DocumentoIngreso.limpiar_ordenes_compras = function() {
                this.ordenes_compras = [];
            };

            // Proveedores
            DocumentoIngreso.set_proveedores = function(proveedor) {
                this.proveedores.push(proveedor);
            };

            DocumentoIngreso.get_proveedores = function() {
                return this.proveedores;
            };
            
            DocumentoIngreso.get_proveedor = function(codigo_proveedor_id) {
                
                var proveedor = $filter('filter')(this.get_proveedores(), {codigo_proveedor_id: parseInt(codigo_proveedor_id)}, true);
                
                return (proveedor.length > 0) ? proveedor[0] : {};
            };

            DocumentoIngreso.limpiar_proveedores = function() {
                this.proveedores = [];
            };

            // Unidades de Negocios
            DocumentoIngreso.set_unidades_negocios = function(unidad_negocio) {
                this.unidades_negocios.push(unidad_negocio);
            };

            DocumentoIngreso.get_unidades_negocios = function() {
                return this.unidades_negocios;
            };
            
            DocumentoIngreso.get_unidad_negocio = function(codigo) {
                
                var unidad_negocio = $filter('filter')(this.get_unidades_negocios(), {codigo: codigo}, true);
                
                return (unidad_negocio.length > 0) ? unidad_negocio[0] : {};
            };

            DocumentoIngreso.limpiar_unidades_negocios = function() {
                this.unidades_negocios = [];
            };
            
            // Laboratorios
            DocumentoIngreso.set_laboratorios = function(laboratorio) {
                this.laboratorios.push(laboratorio);
            };

            DocumentoIngreso.get_laboratorios = function() {
                return this.laboratorios;
            };

            DocumentoIngreso.limpiar_laboratorios = function() {
                this.laboratorios = [];
            };
            
            // Productos
            DocumentoIngreso.set_productos = function(producto) {
                this.productos.push(producto);
            };

            DocumentoIngreso.get_productos = function() {
                return this.productos;
            };

            DocumentoIngreso.limpiar_productos = function() {
                this.productos = [];
            };
                        
            // Observaciones Ordenes Compra
            DocumentoIngreso.set_observaciones = function(observaciones) {
                this.observaciones_ordenes_compra.push(observaciones);
            };

            DocumentoIngreso.get_observaciones = function() {
                return this.observaciones_ordenes_compra;
            };
            
            DocumentoIngreso.get_observacion = function(id) {
                
                var observacion = $filter('filter')(this.get_observaciones(), {id: parseInt(id)}, true);
                
                return (observacion.length > 0) ? observacion[0] : {};
            };

            DocumentoIngreso.limpiar_observaciones = function() {
                this.observaciones_ordenes_compra = [];
            };
            
            
            // Transportadoras
            DocumentoIngreso.set_transportadoras = function(transportadora) {
                this.transportadoras.push(transportadora);
            };

            DocumentoIngreso.get_transportadoras = function() {
                return this.transportadoras;
            };

            DocumentoIngreso.limpiar_transportadoras = function() {
                this.transportadoras = [];
            };
            
            
            // Novedades de mercancia
            DocumentoIngreso.set_novedades_mercancia = function(novedad) {
                this.novedades_mercancia.push(novedad);
            };

            DocumentoIngreso.get_novedades_mercancia = function() {
                return this.novedades_mercancia;
            };

            DocumentoIngreso.limpiar_novedades_mercancia = function() {
                this.novedades_mercancia = [];
            };
            
            
            // Recepciones de mercancia
            DocumentoIngreso.set_recepciones_mercancia = function(recepcion) {
                this.recepciones_mercancia.push(recepcion);
            };

            DocumentoIngreso.get_recepciones_mercancia = function() {
                return this.recepciones_mercancia;
            };

            DocumentoIngreso.limpiar_recepciones_mercancia = function() {
                this.recepciones_mercancia = [];
            };

            return DocumentoIngreso;
        }]);
});