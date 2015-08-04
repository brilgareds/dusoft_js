
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('Pedido', function() {


        //declare usermodel class
        function Pedido() {
            this.cliente;
            this.farmacia;
            this.descripcion = "";
        }

        // Pedidos
        Pedido.prototype.setDatos = function(datos) {
            this.numero_pedido = datos.numero_pedido || null;
            this.nombre_vendedor = datos.nombre_vendedor || datos.nombre_farmacia; // Se condiciona dependiendo del tipo de cliente si es farmacia o es cliente normal
            this.fecha_registro = datos.fecha_registro || null;
            this.descripcion_estado = datos.descripcion_estado || ''; // Se condiciona dependiendo del tipo de cliente si es farmacia o es cliente normal
            this.descripcion_estado_actual_pedido = datos.descripcion_estado_actual_pedido || null;
            this.estado_actual_pedido = datos.estado_actual_pedido || null;
            this.estado = datos.estado || null;
            this.estado_separacion = datos.estado_separacion || null;
        };


        Pedido.prototype.setNumeroPedido = function(numero_pedido){
            this.numero_pedido = numero_pedido;
        };

        Pedido.prototype.get_numero_pedido = function() {
            return this.numero_pedido;
        };
        
        Pedido.prototype.setCliente = function(cliente) {
            this.cliente = cliente;
        };
        
        Pedido.prototype.getCliente = function() {
            return this.cliente;
        };
        
        Pedido.prototype.setFarmacia = function(farmacia) {
            this.farmacia = farmacia;
        };
        
        Pedido.prototype.getFarmacia = function() {
            return this.farmacia;
        };
        
        Pedido.prototype.setFechaRegistro = function(fecha) {
            this.fecha_registro = fecha;
        };
        
        Pedido.prototype.getFechaRegistro = function() {
            return this.fecha_registro;
        };
        
        Pedido.prototype.setDescripcion = function(descripcion){
            this.descripcion = descripcion;
            return this;
        };

        Pedido.prototype.getDescripcion = function() {
            return this.descripcion;
        };

        this.getClass = function(){
            return Pedido;
        };

        this.get = function() {
            return new Pedido();
        };

        return this;

    });
});