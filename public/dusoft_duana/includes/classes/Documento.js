define(["angular", "js/models"], function(angular, models) {

    models.factory('Documento', function() {
 
        function Documento(id, prefijo, numero, fecha_registro) {
            
            this.id = id;
            this.prefijo = prefijo || "";
            this.numero = numero || "";
            this.fecha_registro = fecha_registro || "";            
        };

        this.get = function(id, prefijo, numero, fecha_registro) {
            return new Documento(id, prefijo, numero, fecha_registro);
        };
        
        this.set_empresa = function(empresa) {
            this.empresa = empresa;
            return this;
        };
        
        this.set_centro_utilidad = function(centro_utilidad) {
            this.centro_utilidad = centro_utilidad;
            return this;
        };
        
        this.set_bodega = function(bodega) {
             this.bodega = bodega;
            return this;
        };
        
        this.set_tipo = function(tipo) {
             this.tipo = tipo;
            return this;
        };
        
        this.set_tipo_movimiento = function(tipo_movimiento) {
             this.tipo_movimiento = tipo_movimiento;
            return this;
        };
        
        this.set_bodegas_doc_id = function(bodegas_doc_id) {
             this.bodegas_doc_id = bodegas_doc_id;
            return this;
        };
        
        this.set_observaciones = function(observaciones) {
             this.observaciones = observaciones;
            return this;
        };
        
        this.get_empresa = function() {
            return this.empresa ;
        };
        
        this.get_centro_utilidad = function() {
            return this.centro_utilidad ;
        };
        
        this.get_bodega = function() {
             return this.bodega;
        };
        
        this.get_tipo = function() {
             return this.tipo;
        };
        
        this.get_tipo_movimiento = function() {
             return this.tipo_movimiento;
        };
        
        this.get_bodegas_doc_id = function() {
             return this.bodegas_doc_id;
        };
        
        this.get_observaciones = function() {
             return this.observaciones;
        };

        
        this.getClass = function(){
            return Documento;
        };

        return this;

    });
});