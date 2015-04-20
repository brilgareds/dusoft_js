
define(["angular", "js/models"], function(angular, models) {

    models.factory('Empresa', function() {

        function Empresa(nombre, codigo) {
            this.nombre = nombre || "";
            this.codigo = codigo || "";
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

        this.get = function(nombre, codigo) {
            return new Empresa(nombre, codigo);
        };

        this.getClass = function(){
            return Empresa;
        };

        return this;

    });
});