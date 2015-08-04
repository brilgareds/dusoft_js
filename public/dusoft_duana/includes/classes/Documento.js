define(["angular", "js/models"], function(angular, models) {

    models.factory('Documento', function() {

        function Documento(bodegas_doc_id, prefijo, numero, fecha_registro) {

            this.bodegas_doc_id = bodegas_doc_id;
            this.prefijo = prefijo || "";
            this.numero = numero || "";
            this.fecha_registro = fecha_registro || "";
        }
        ;
        
        Documento.prototype.set_fecha_registro = function(fecha_registro) {
            this.fecha_registro = fecha_registro;
            return this;
        };
        
        Documento.prototype.set_empresa = function(empresa) {
            this.empresa = empresa;
            return this;
        };

        Documento.prototype.set_centro_utilidad = function(centro_utilidad) {
            this.centro_utilidad = centro_utilidad;
            return this;
        };

        Documento.prototype.set_bodega = function(bodega) {
            this.bodega = bodega;
            return this;
        };

        Documento.prototype.set_descripcion = function(descripcion) {
            this.descripcion = descripcion;
            return this;
        };
        

        Documento.prototype.set_tipo = function(tipo) {
            this.tipo = tipo; // I002
            return this;
        };

        Documento.prototype.set_tipo_clase_documento = function(tipo_clase_documento) {
            this.tipo_clase_documento = tipo_clase_documento; //"EGRESO POR PRESTAMO A OTRAS ENTIDADES"
            return this;
        };
        
        
        Documento.prototype.set_tipo_movimiento = function(tipo_movimiento) {
            this.tipo_movimiento = tipo_movimiento; // E o I
            return this;
        };

        Documento.prototype.set_bodegas_doc_id = function(bodegas_doc_id) {
            this.bodegas_doc_id = bodegas_doc_id;
            return this;
        };

        Documento.prototype.set_observaciones = function(observaciones) {
            this.observaciones = observaciones;
            return this;
        };
        
        
         Documento.prototype.get_fecha_registro = function() {
            return this.fecha_registro;
        };
        
        Documento.prototype.get_prefijo = function() {
            return this.prefijo;
        };
        
        Documento.prototype.get_numero = function() {
            return this.numero;
        };
        
        
        Documento.prototype.get_empresa = function() {
            return this.empresa;
        };

        Documento.prototype.get_centro_utilidad = function() {
            return this.centro_utilidad;
        };

        Documento.prototype.get_bodega = function() {
            return this.bodega;
        };

        Documento.prototype.get_descripcion = function() {
            return this.descripcion;
        };
        
        Documento.prototype.get_tipo_clase_documento = function() {
            return this.tipo_clase_documento;
        };
        
        Documento.prototype.get_tipo = function() {
            return this.tipo;
        };

        Documento.prototype.get_tipo_movimiento = function() {
            return this.tipo_movimiento;
        };

        Documento.prototype.get_bodegas_doc_id = function() {
            return this.bodegas_doc_id;
        };

        Documento.prototype.get_observaciones = function() {
            return this.observaciones;
        };
        
        

        this.getClass = function() {
            return Documento;
        };

        return this;

    });
});