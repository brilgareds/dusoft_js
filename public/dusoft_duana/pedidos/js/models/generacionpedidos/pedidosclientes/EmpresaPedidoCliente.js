define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaPedidoCliente', ["Empresa" , "$filter", function(Empresa, $filter) {

            var EmpresaPedidoCliente = Object.create(Empresa.getClass().prototype)

            EmpresaPedidoCliente.clientes = [];
            EmpresaPedidoCliente.sedes = [];
            EmpresaPedidoCliente.vendedores = [];
            EmpresaPedidoCliente.cotizaciones = [];
            EmpresaPedidoCliente.pedidos = [];
            EmpresaPedidoCliente.laboratorios = [];
            EmpresaPedidoCliente.moleculas = [];
            EmpresaPedidoCliente.productos = [];


            // Clientes
            EmpresaPedidoCliente.set_clientes = function(cliente) {
                this.clientes.push(cliente);
            };

            EmpresaPedidoCliente.get_clientes = function() {
                return this.clientes;
            };

            EmpresaPedidoCliente.limpiar_clientes = function() {
                this.clientes = [];
            };
            // sedes
            EmpresaPedidoCliente.set_sedes = function(sedes) {
                this.sedes.push(sedes);
            };

            EmpresaPedidoCliente.get_sedes = function() {
                return this.sedes;
            };

            EmpresaPedidoCliente.limpiar_sedes = function() {
                this.sedes = [];
            };
            
            // Vendedores
            EmpresaPedidoCliente.set_vendedores = function(vendedor) {
                this.vendedores.push(vendedor);
            };

            EmpresaPedidoCliente.get_vendedores = function() {
                return this.vendedores;
            };

            EmpresaPedidoCliente.limpiar_vendedores = function() {
                this.vendedores = [];
            };
            
            
            // Cotizaciones
            EmpresaPedidoCliente.set_cotizaciones = function(cotizacion) {
                this.cotizaciones.push(cotizacion);
            };

            EmpresaPedidoCliente.get_cotizaciones = function() {
                return this.cotizaciones;
            };

            EmpresaPedidoCliente.limpiar_cotizaciones = function() {
                this.cotizaciones = [];
            };
            
            
            // Pedidos
            EmpresaPedidoCliente.set_pedidos = function(pedido) {
                this.pedidos.push(pedido);
            };

            EmpresaPedidoCliente.get_pedidos = function() {
                return this.pedidos;
            };

            EmpresaPedidoCliente.limpiar_pedidos = function() {
                this.pedidos = [];
            };
            
            // Productos
            EmpresaPedidoCliente.set_productos = function(producto) {
                this.productos.push(producto);
            };

            EmpresaPedidoCliente.get_productos = function() {
                return this.productos;
            };

            EmpresaPedidoCliente.limpiar_productos = function() {
                this.productos = [];
            };

            // Laboratorios
            EmpresaPedidoCliente.set_laboratorios = function(laboratorio) {
                this.laboratorios.push(laboratorio);
            };

            EmpresaPedidoCliente.get_laboratorios = function() {
                return this.laboratorios;
            };
            
            EmpresaPedidoCliente.limpiar_laboratorios = function() {
                this.laboratorios = [];
            };
            
            // Laboratorios
            EmpresaPedidoCliente.set_moleculas = function(molecula) {
                this.moleculas.push(molecula);
            };
            EmpresaPedidoCliente.get_moleculas = function() {
                return this.moleculas;
            };
            EmpresaPedidoCliente.limpiar_moleculas = function() {
                this.moleculas = [];
            };
            
            
            // Set Default values
            EmpresaPedidoCliente.set_default = function() {
                this.limpiar_clientes();
                this.limpiar_vendedores();
                this.limpiar_cotizaciones();
                this.limpiar_pedidos();
                this.limpiar_productos();
                this.limpiar_laboratorios();  
            };
            

            return EmpresaPedidoCliente;
        }]);
});