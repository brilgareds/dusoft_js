
define(["angular", "js/models", "includes/classes/Tercero"], function (angular, models) {

    models.factory('ClientesABC1', ["Tercero", function (Tercero) {


            function ClientesABC1(nombre, tipo_id_tercero, id, direccion, telefono, pais, dv) {
                Tercero.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.dv = dv || "";
                this.pais = pais;
                this.tercero_id = id;
            }

            ClientesABC1.prototype = Object.create(Tercero.getClass().prototype);
            
            ClientesABC1.prototype.setPais = function (pais) {   
                this.pais = pais;
            };

            ClientesABC1.prototype.getPais = function () {
                return this.pais;
            };
      
            ClientesABC1.prototype.setDv = function (dv) {   
                this.dv = dv;
            };

            ClientesABC1.prototype.getDv = function () {
                return this.dv;
            };
      
            ClientesABC1.prototype.setTercero_id = function (tercero_id) {   
                this.tercero_id = tercero_id;
            };

            ClientesABC1.prototype.getTercero_id = function () {
                return this.tercero_id;
            };

            this.get = function (nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv) {
                return new ClientesABC1(nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv);
            };

            return this;

        }]);

});