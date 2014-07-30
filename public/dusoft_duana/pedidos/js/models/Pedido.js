
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('Pedido', function() {


        //declare usermodel class
        function Pedido() {
            this.cliente;
            this.farmacia;
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
        };

        Pedido.prototype.setCliente = function(cliente) {
            this.cliente = cliente;
        };
        
        Pedido.prototype.setFarmacia = function(cliente) {
            this.farmacia = cliente;
        };

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new Pedido();
        };

        //just return the factory wrapper
        return this;

    });
});