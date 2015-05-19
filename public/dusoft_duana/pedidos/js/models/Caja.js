
define(["angular", "js/models"], function(angular, models) {


    models.factory('Caja', [function() {


        function Caja(numero, tipo) {
            this.valida = false;
            this.numero = numero || 0;
            this.tipo = tipo || undefined;
        }
        
        Caja.prototype.setNumero = function(numero) {
            this.numero = numero;
        };
        
        Caja.prototype.getNumero = function() {
            return this.numero;
        };
        
        Caja.prototype.setValida = function(valida) {
            this.valida = valida;
        };
        
        Caja.prototype.esValida = function() {
            return this.valida;
        };
        
        Caja.prototype.setTipo = function(tipo) {
            this.tipo = tipo;
        };
        
        Caja.prototype.getTipo = function(cadena) {
            if(cadena){
                if(this.tipo === 0){
                    
                    return "Caja";
                    
                } else if(this.tipo === 1){
                    
                    return "Nevera";
                    
                } else {
                    return undefined;
                }
                
            }
            return this.tipo;
        };

        this.get = function(numero, tipo) {
            return new Caja(numero, tipo);
        };

        return this;

    }]);
});
