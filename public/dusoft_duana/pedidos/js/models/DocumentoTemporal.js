
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('DocumentoTemporal', function() {


        //declare usermodel class
        function DocumentoTemporal() {
            this.pedido;
            this.separador;
            this.detalle_documento_temporal = [];
        }

        // Pedidos
        DocumentoTemporal.prototype.setDatos = function(datos) {
            this.estado_separacion = datos.estado_separacion;
            this.descripcion_estado_separacion = datos.descripcion_estado_separacion;
            this.fecha_separacion_pedido = datos.fecha_separacion_pedido;
        };

        DocumentoTemporal.prototype.setPedido = function(pedido) {
            this.pedido = pedido;
        };
        
        DocumentoTemporal.prototype.setSeparador = function(separador) {
            this.separador = separador;
        };
        
        DocumentoTemporal.prototype.setDetalleDocumentoTemporal = function(detalle_documento_temporal) {
            this.detalle_documento_temporal = detalle_documento_temporal;
        };
        
        
        // Operaciones para manejo de lista de detalle_documento_temporal
        DocumentoTemporal.prototype.agregarDetalleDocumentoTemporal = function(detalle_documento_temporal) {
            this.detalle_documento_temporal.push(detalle_documento_temporal);
        }

        DocumentoTemporal.prototype.getDetalleDocumentoTemporal = function() {
            return this.detalle_documento_temporal;
        }

        DocumentoTemporal.prototype.vaciarDetalleDocumentoTemporal = function() {
            this.detalle_documento_temporal = [];
        }

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new DocumentoTemporal();
        };

        //just return the factory wrapper
        return this;

    });
});