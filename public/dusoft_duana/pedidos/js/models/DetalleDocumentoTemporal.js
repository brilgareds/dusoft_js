
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('DetalleDocumentoTemporal', function() {


        //declare usermodel class
        function DetalleDocumentoTemporal() {
            
        }

        // Pedidos
        DetalleDocumentoTemporal.prototype.setDatos = function(datos) {
//            this.estado_separacion = datos.estado_separacion;
//            this.descripcion_estado_separacion = datos.descripcion_estado_separacion;
//            this.fecha_separacion_pedido = datos.fecha_separacion_pedido;
            this.codigo_producto = datos.codigo_producto;
            this.nombre_producto = datos.descripcion_producto;
            this.existencia_lotes = "";
            this.cantidad_pedida = datos.cantidad_solicitada;
            this.cantidad_separada = datos.cantidad_ingresada;
            this.lote = datos.lote;
            this.fecha_vencimiento = datos.fecha_vencimiento;
            this.observacion = datos.observacion_cambio;
        };

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new DetalleDocumentoTemporal();
        };

        //just return the factory wrapper
        return this;

    });
});