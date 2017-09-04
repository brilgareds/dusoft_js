
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('Pedido', function() {


        //declare usermodel class
        function Pedido() {
            this.cliente;
            this.farmacia;
            this.descripcion = "";
            this.numero_pedido;
            this.nombre_vendedor;
            this.fecha_registro ;
            this.descripcion_estado;
            this.descripcion_estado_actual_pedido;
            this.estado_actual_pedido;
            this.estado;
            this.estado_separacion;
            this.descripcionTipoPedido = "";
            this.tipoPedido = "";
            this.nombreSeparador = "";
            this.estadoMultiplePedido = "";
            this.observacion = "";
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
            this.descripcionTipoPedido = datos.descripcion_tipo_producto || "";
            this.nombreSeparador = datos.nombre_separador || "";
            this.observacion = datos.observacion || "";
        };
        
        
        Pedido.prototype.setObservacion = function(observacion){
            this.observacion = observacion;
            return this;
        };
        
        Pedido.prototype.getObservacion = function(){
            return this.observacion;
        };
        
        Pedido.prototype.setDescripcionTipoPedido = function(descripcionTipoPedido){
            this.descripcionTipoPedido = descripcionTipoPedido;
            return this;
        };
        
        Pedido.prototype.getDescripcionTipoPedido = function(){
            return this.descripcionTipoPedido;
        };
        
        Pedido.prototype.setTipoPedido = function(tipoPedido){
            this.tipoPedido = tipoPedido;
            return this;
        };
        
        Pedido.prototype.getTipoPedido = function(){
            return this.tipoPedido;
        };

        Pedido.prototype.setNumeroPedido = function(numero_pedido){
            this.numero_pedido = numero_pedido;
            return this;
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
        
        Pedido.prototype.setEstado = function(estado){
            this.estado = estado;
            return this;
        };

        Pedido.prototype.getEstado = function() {
            return this.estado;
        };
        
        Pedido.prototype.setEstadoActualPedido = function(estadoActualPedido){
            this.estado_actual_pedido = estadoActualPedido;
            return this;
        };

        Pedido.prototype.getEstadoActualPedido = function() {
            return this.estado_actual_pedido;
        };
        
        
        Pedido.prototype.setEstadoSeparacion = function(estado_separacion){
            this.estado_separacion = estado_separacion;
            return this;
        };

        Pedido.prototype.getEstadoSeparacion = function() {
            return this.estado_separacion;
        };
        
        
        
        Pedido.prototype.setEstadoMultiplePedido = function(estadoMultiplePedido){
            this.estadoMultiplePedido = estadoMultiplePedido;
            return this;
        };

        Pedido.prototype.getEstadoMultiplePedido = function() {
            return this.estadoMultiplePedido;
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