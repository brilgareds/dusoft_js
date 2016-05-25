
define(["angular", "js/models","includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaAutorizacion',['Empresa', function(Empresa) { 
       
       function EmpresaAutorizacion(nombre, codigo){
           Empresa.getClass().call(this,nombre, codigo);
       }
       
        EmpresaAutorizacion.prototype = Object.create(Empresa.getClass().prototype);
       
        EmpresaAutorizacion.prototype.pedidos = [];


        EmpresaAutorizacion.prototype.setClientes = function() {

        };

        EmpresaAutorizacion.prototype.agregarPedido = function(pedidos) {
            this.pedidos.push(pedidos);
        };

        EmpresaAutorizacion.prototype.getPedidos = function() {
            return this.pedidos;
        };

        EmpresaAutorizacion.prototype.vaciarPedidos = function() {
            this.pedidos = [];
        };
        
        this.get = function(nombre, codigo){
            return new EmpresaAutorizacion(nombre, codigo);
        };


        return this;

    }]);
});