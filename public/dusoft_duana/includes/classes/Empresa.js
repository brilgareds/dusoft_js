
define(["angular", "js/models"], function(angular, models) {

    models.factory('Empresa', function() {

        function Empresa() {
            this.nombre = "";
            this.codigo = "";
            this.clientes = []; 
            this.proveedores = [];
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

        this.get = function() {
            return new Empresa();
        };

        this.getClass = function(){
            return Empresa;
        };

        return this;

    });
});