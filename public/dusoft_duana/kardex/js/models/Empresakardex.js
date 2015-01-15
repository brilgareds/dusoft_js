
define(["angular", "js/models","includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaKardex',['Empresa', function(Empresa) {
       
       function EmpresaKardex(nombre, codigo){
           Empresa.getClass().call(this,nombre, codigo);
       }
       
        EmpresaKardex.prototype = Object.create(Empresa.getClass().prototype);
       
        EmpresaKardex.prototype.productos = [];


        EmpresaKardex.prototype.setClientes = function() {

        };

        EmpresaKardex.prototype.agregarProducto = function(producto) {
            this.productos.push(producto);
        };

        EmpresaKardex.prototype.getProductos = function() {
            return this.productos;
        };

        EmpresaKardex.prototype.vaciarProductos = function() {
            this.productos = [];
        };
        
        this.get = function(nombre, codigo){
            return new EmpresaKardex(nombre, codigo);
        };


        return this;

    }]);
});