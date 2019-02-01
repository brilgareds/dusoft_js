
define(["angular", "js/models", "includes/classes/Tercero"], function (angular, models) {

    models.factory('ClientesAAC1', ["Tercero", function (Tercero) {


            function ClientesAAC1(nombre, tipo_id_tercero, id, direccion, telefono, pais, dv) {
                Tercero.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.dv = dv || "";
                this.pais = pais;
                this.tercero_id = id;
            }

            ClientesAAC1.prototype = Object.create(Tercero.getClass().prototype);
            
            ClientesAAC1.prototype.setPais = function (pais) {   
                this.pais = pais;
            };

            ClientesAAC1.prototype.getPais = function () {
                return this.pais;
            };
      
            ClientesAAC1.prototype.setDv = function (dv) {   
                this.dv = dv;
            };

            ClientesAAC1.prototype.getDv = function () {
                return this.dv;
            };
      
            ClientesAAC1.prototype.setTercero_id = function (tercero_id) {   
                this.tercero_id = tercero_id;
            };

            ClientesAAC1.prototype.getTercero_id = function () {
                return this.tercero_id;
            };

            this.get = function (nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv) {
                return new ClientesAAC1(nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv);
            };

            return this;

        }]);

});