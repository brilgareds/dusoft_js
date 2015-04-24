
define(["angular", "js/models"], function(angular, models) {

    models.factory('Bodega', function() {

        function Bodega (nombre, codigo) {
            this.nombre = nombre || "";
            this.codigo = codigo || "";
            this.estado = false;
            //this.clientes = []; 
            //this.proveedores = [];
        };

        Bodega.prototype.setNombre = function(nombre) {
            this.nombre = nombre;
        };

        Bodega.prototype.getNombre = function() {
            return this.nombre;
        };
        
        Bodega.prototype.setEstado = function(estado) {
            this.estado = estado;
        };

        Bodega.prototype.getEstado = function() {
            return this.estado;
        };

        Bodega.prototype.setCodigo = function(codigo) {
            this.codigo = codigo;
        };

        Bodega.prototype.getCodigo = function() {
            return this.codigo;
        };

        this.get = function(nombre, codigo) {
            return new Bodega(nombre, codigo);
        };

        this.getClass = function(){
            return Bodega;
        };

        return this;

    });
});