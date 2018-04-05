
define(["angular", "js/models", "includes/classes/Tercero"], function (angular, models) {

    models.factory('Clientes', ["Tercero", function (Tercero) {


            function Clientes(nombre, tipo_id_tercero, id, direccion, telefono, pais, dv) {
                Tercero.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.dv = dv || "";
                this.pais = pais;
            }

            Clientes.prototype = Object.create(Tercero.getClass().prototype);
            
            Clientes.prototype.setPais = function (pais) {   
                this.pais = pais;
            };

            Clientes.prototype.getPais = function () {
                return this.pais;
            };
      
            Clientes.prototype.setDv = function (dv) {   
                this.dv = dv;
            };

            Clientes.prototype.getDv = function () {
                return this.dv;
            };

            this.get = function (nombre, tipo_id_tercero, id, direccion, telefono, pais, dv) {
                return new Clientes(nombre, tipo_id_tercero, id, direccion, telefono, pais, dv);
            };

            return this;

        }]);

});