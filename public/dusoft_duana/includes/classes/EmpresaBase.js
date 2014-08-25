
define(["angular", "js/models"], function(angular, models) {

    models.factory('EmpresaBase', function() {

        function EmpresaBase() {
            this.nombre = "";
            this.codigo = "";
            this.clientes = []; 
            this.proveedores = [];
        };

        EmpresaBase.prototype.setNombre = function(nombre) {
            this.nombre = nombre;
        };

        EmpresaBase.prototype.getNombre = function() {
            return this.nombre;
        };

        EmpresaBase.prototype.setCodigo = function(codigo) {
            this.codigo = codigo;
        };

        EmpresaBase.prototype.getCodigo = function() {
            return this.codigo;
        };

        this.get = function() {
            return new EmpresaBase();
        };

        this.getClass = function(){
            return EmpresaBase;
        };

        return this;

    });
});