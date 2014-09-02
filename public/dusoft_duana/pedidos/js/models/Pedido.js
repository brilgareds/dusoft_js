
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('Pedido', function() {


        //declare usermodel class
        function Pedido() {
            this.cliente;
            this.farmacia;
            this.productos = [];
        }

        // Pedidos
        Pedido.prototype.setDatos = function(datos) {
            this.numero_pedido = datos.numero_pedido;
            this.nombre_vendedor = datos.nombre_vendedor || datos.nombre_farmacia; // Se condiciona dependiendo del tipo de cliente si es farmacia o es cliente normal
            this.fecha_registro = datos.fecha_registro;
            this.descripcion_estado = datos.descripcion_estado || ''; // Se condiciona dependiendo del tipo de cliente si es farmacia o es cliente normal
            this.descripcion_estado_actual_pedido = datos.descripcion_estado_actual_pedido;
            this.estado_actual_pedido = datos.estado_actual_pedido;
            this.estado = datos.estado;
            this.estado_separacion = datos.estado_separacion;
        };

        Pedido.prototype.setCliente = function(cliente) {
            this.cliente = cliente;
        };
        
        Pedido.prototype.setFarmacia = function(cliente) {
            this.farmacia = cliente;
        };
        
        Pedido.prototype.agregarProducto = function(productos) {
            this.productos.push(productos);
        };
        
        Pedido.prototype.getProductos = function() {
            return this.productos;
        }
        
        Pedido.prototype.vaciarProductos = function(productos) {
            this.productos = [];
        };

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new Pedido();
        };

        //just return the factory wrapper
        return this;

    });
});