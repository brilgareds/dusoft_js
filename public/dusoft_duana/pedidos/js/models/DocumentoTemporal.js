
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('DocumentoTemporal', function() {


        //declare usermodel class
        function DocumentoTemporal() {
            this.pedido;
            this.separador;
            this.bodegas_doc_id = 0;
            this.documento_temporal_id = 0;
            this.auditor;
            //this.detalle_documento_temporal = [];
        }

        // Pedidos
        DocumentoTemporal.prototype.setDatos = function(datos) {
            this.estado_separacion = datos.estado_separacion;
            this.descripcion_estado_separacion = datos.descripcion_estado_separacion;
            this.fecha_separacion_pedido = datos.fecha_separacion_pedido;
            this.documento_temporal_id = datos.documento_temporal_id;
        };

        DocumentoTemporal.prototype.setPedido = function(pedido) {
            this.pedido = pedido;
        };
        
        DocumentoTemporal.prototype.setSeparador = function(separador) {
            this.separador = separador;
        };

        DocumentoTemporal.prototype.setAuditor = function(auditor) {
            this.auditor = auditor;
        };
        
        DocumentoTemporal.prototype.getPedido = function() {
            return this.pedido;
        }
        
        DocumentoTemporal.prototype.getSeparador = function () {
            return this.separador;
        }

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new DocumentoTemporal();
        };

        //just return the factory wrapper
        return this;

    });
});