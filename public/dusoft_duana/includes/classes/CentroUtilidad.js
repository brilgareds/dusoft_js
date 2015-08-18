
define(["angular", "js/models"], function(angular, models) {

    models.factory('CentroUtilidad', function() {

        function CentroUtilidad (nombre, codigo) {
            this.nombre = nombre || "";
            this.codigo = codigo || "";
            this.bodegas = [];
            this.estado = false;
            this.empresaId = "";
            this.nombreEmpresa = "";
            this.bodega = undefined;
        };

        CentroUtilidad.prototype.setNombre = function(nombre) {
            this.nombre = nombre;
        };

        CentroUtilidad.prototype.getNombre = function() {
            return this.nombre;
        };

        CentroUtilidad.prototype.setCodigo = function(codigo) {
            this.codigo = codigo;
        };

        CentroUtilidad.prototype.getCodigo = function() {
            return this.codigo;
        };
        
        CentroUtilidad.prototype.setEstado = function(estado) {
            this.estado = estado;
        };

        CentroUtilidad.prototype.getEstado = function() {
            return this.estado;
        };
        
        CentroUtilidad.prototype.setEmpresaId = function(empresaId) {
            this.empresaId = empresaId;
        };

        CentroUtilidad.prototype.getEmpresaId = function() {
            return this.empresaId;
        };
        
        CentroUtilidad.prototype.setNombreEmpresa = function(nombreEmpresa) {
            this.nombreEmpresa = nombreEmpresa;
        };

        CentroUtilidad.prototype.getNombreEmpresa = function() {
            return this.nombreEmpresa;
        };
        
        CentroUtilidad.prototype.agregarBodega = function(bodega) {
            for(var i in this.bodegas){
                var _bodega = this.bodegas[i];
                
                if(_bodega.getCodigo() === bodega.getCodigo()){
                    return false;
                }
            }
            
            this.bodegas.push(bodega);
        };
        
        CentroUtilidad.prototype.obtenerBodegasSeleccionadas = function(){
           var bodegas = [];
           
           for(var i in this.bodegas){
               var bodega = this.bodegas[i];
               
               if(bodega.getEstado()){
                   bodegas.push(bodega);
               }
           }
           
           return bodegas;
        };
        
        CentroUtilidad.prototype.getBodegas = function() {
            return this.bodegas;
        };
        
        CentroUtilidad.prototype.vaciarBodegas = function() {
            this.bodegas = [];
        };

        CentroUtilidad.prototype.setBodegaSeleccionada = function(bodega) {
            this.bodega = bodega;
        };
        
        CentroUtilidad.prototype.getBodegaSeleccionada = function() {
            return this.bodega;
        };
        
        this.get = function(nombre, codigo) {
            return new CentroUtilidad(nombre, codigo);
        };

        this.getClass = function(){
            return CentroUtilidad;
        };

        return this;

    });
});