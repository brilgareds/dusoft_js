
define(["angular", "js/models"], function(angular, models) {

    models.factory('CentroUtilidad', function() {

        function CentroUtilidad (nombre, codigo) {
            this.nombre = nombre || "";
            this.codigo = codigo || "";
            this.bodegas = [];
            //this.clientes = []; 
            //this.proveedores = [];
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
        
        CentroUtilidad.prototype.agregarBodega = function(bodega) {
            for(var i in this.bodegas){
                var _bodega = this.bodegas[i];
                
                if(_bodega.getCodigo() === bodega.getCodigo()){
                    return false;
                }
            }
            
            this.bodegas.push(bodega);
        };
        
        CentroUtilidad.prototype.getBodegas = function() {
            return this.bodegas;
        };
        
        CentroUtilidad.prototype.vaciarBodegas = function() {
            this.bodegas = [];
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