
define(["angular", "js/models"], function(angular, models) {

    models.factory('ReportesGenerados',["$filter", function($filter) {
            
       function ReportesGenerados(estado_reportes_id) {
            this.estado_reportes_id=estado_reportes_id;
        };

        ReportesGenerados.prototype.setEstadoReportesId = function(estado_reportes_id){
        	this.estado_reportes_id = estado_reportes_id;
        };
        
        ReportesGenerados.prototype.getEstadoReportesId = function(){
        	return this.estado_reportes_id;
        };        
        
        ReportesGenerados.prototype.setNombreReporte = function(nombre_reporte){
        	this.nombre_reporte = nombre_reporte;
        };
        
        ReportesGenerados.prototype.getNombreReporte = function(){
        	return this.nombre_reporte;
        };        
        
        ReportesGenerados.prototype.setNombreArchivo = function(nombre_archivo){
        	this.nombre_archivo = nombre_archivo;
        };
        
        ReportesGenerados.prototype.getNombreArchivo = function(){
        	return this.nombre_archivo;
        };
        
        ReportesGenerados.prototype.setFechaInicio = function(fecha_inicio){
        	this.fecha_inicio = fecha_inicio;
        };
        
        ReportesGenerados.prototype.getFechaInicio = function(){
        	return this.fecha_inicio;
        };
        
        ReportesGenerados.prototype.setFechaFin = function(fecha_fin){
        	this.fecha_fin = fecha_fin;
        };
        
        ReportesGenerados.prototype.getFechaFin = function(){
        	return this.fecha_fin;
        };
        
        ReportesGenerados.prototype.setEstado = function(estado){
        	this.estado = estado;
        };
        
        ReportesGenerados.prototype.getEstado = function(){
        	return this.estado;
        };
        
        ReportesGenerados.prototype.setUsuarioId = function(usuario_id){
        	this.usuario_id = usuario_id;
        };
        
        ReportesGenerados.prototype.getUsuarioId = function(){
        	return this.usuario_id;
        };
        
        ReportesGenerados.prototype.setParametrosBusqueda = function(parametros_de_busqueda){
        	this.parametros_de_busqueda = parametros_de_busqueda;
        };
        
        ReportesGenerados.prototype.getParametrosBusqueda = function(){
        	return this.parametros_de_busqueda;
        };

        this.get = function(estado_reportes_id) {
            return new ReportesGenerados(estado_reportes_id);
        };

        return this;
    }]);    
});