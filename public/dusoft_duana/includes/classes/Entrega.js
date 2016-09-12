
define(["angular", "js/models"], function(angular, models) {

    models.factory('Entrega', function() {

        function Entrega () {
           
          
            //this.clientes = []; 
            //this.proveedores = [];
        };

        Entrega.prototype.setNumeroEntrega = function(numeroEntrega) {
            this.numeroEntrega = numeroEntrega;
        };

        Entrega.prototype.getNumeroEntrega = function() {
            return this.numeroEntrega;
        };
        
        

        this.get = function(numeroEntrega) {
            return new Entrega(numeroEntrega);
        };

        this.getClass = function(){
            return Entrega;
        };

        return this;

    });
});