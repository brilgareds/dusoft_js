
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
            this.esDocumentoNuevo = false;
            this.usuario_id = 0;
            this.empresa_id = 0;
            this.centro_utilidad = 0;
            this.bodega_id = 0;
            
            this.fechaRegistro;
            //this.detalle_documento_temporal = [];
        }

        // Pedidos
        DocumentoTemporal.prototype.setDatos = function(datos) {
            this.estado_separacion = datos.estado_separacion;
            this.descripcion_estado_separacion = datos.descripcion_estado_separacion;
            this.fecha_separacion_pedido = datos.fecha_separacion_pedido;
            this.documento_temporal_id = datos.documento_temporal_id;
            this.usuario_id = datos.usuario_id;
        };

        DocumentoTemporal.prototype.getPedido = function() {
            return this.pedido;
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
        
        
        DocumentoTemporal.prototype.getSeparador = function () {
            return this.separador;
        };
        
        DocumentoTemporal.prototype.setdocumentoTemporalId = function (documento_temporal_id) {
            this.documento_temporal_id = documento_temporal_id;
        };
        
        DocumentoTemporal.prototype.getdocumentoTemporalId = function () {
            return this.documento_temporal_id;
        };
        
        DocumentoTemporal.prototype.setBodegasDocId = function (bodegas_doc_id) {
            this.bodegas_doc_id = bodegas_doc_id;
            return this;
        };
        
        DocumentoTemporal.prototype.getBodegasDocId = function () {
            return this.bodegas_doc_id;
        };
        
        
        
        DocumentoTemporal.prototype.setFechaRegistro = function (fechaRegistro) {
            this.fechaRegistro = fechaRegistro;
            return this;
        };
        
        DocumentoTemporal.prototype.getFechaRegistro = function () {
            return this.fechaRegistro;
        };
        

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new DocumentoTemporal();
        };

        //just return the factory wrapper
        return this;

    });
});