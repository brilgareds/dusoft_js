
define(["angular", "js/models"], function(angular, models) {

    models.factory('Empresa', function() {

        function Empresa(nombre, codigo) {
            this.nombre = nombre || "";
            this.codigo = codigo || "";
            this.centrosUtilidad = [];
            this.centroUtilidad = undefined;
            //this.clientes = []; 
            //this.proveedores = [];
        };

        Empresa.prototype.setNombre = function(nombre) {
            this.nombre = nombre;
        };

        Empresa.prototype.getNombre = function() {
            return this.nombre;
        };

        Empresa.prototype.setCodigo = function(codigo) {
            this.codigo = codigo;
        };

        Empresa.prototype.getCodigo = function() {
            return this.codigo;
        };
        
        Empresa.prototype.setCentroUtilidadSeleccionado = function(centroUtilidad) {
            this.centroUtilidad = centroUtilidad;
            return this;
        };
        
        Empresa.prototype.setCentrosUtilidad = function(centrosUtilidad) {
            this.centrosUtilidad  =  centrosUtilidad;
        };
        
        Empresa.prototype.getCentroUtilidadSeleccionado = function() {
            return this.centroUtilidad;
        };
        
        Empresa.prototype.agregarCentroUtilidad = function(centroUtilidad) {
            
            this.centrosUtilidad.push(centroUtilidad);
        };
        
        Empresa.prototype.agregarCentroSiNoExiste = function(centroUtilidad) {
            for(var i in this.centrosUtilidad){
                var _centroUtilidad = this.centrosUtilidad[i];
                if(_centroUtilidad.getCodigo() === centroUtilidad.getCodigo()){                    
                    return false;
                }
            }
            
            this.centrosUtilidad.push(centroUtilidad);
        };
        
        Empresa.prototype.getCentrosUtilidad = function() {
            return this.centrosUtilidad;
        };
        
        Empresa.prototype.vaciarCentrosUtilidad = function() {
            this.centrosUtilidad = [];
        };

        this.get = function(nombre, codigo) {
            return new Empresa(nombre, codigo);
        };

        this.getClass = function(){
            return Empresa;
        };

        return this;

    });
});