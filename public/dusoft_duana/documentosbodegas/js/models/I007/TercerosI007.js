
define(["angular", "js/models", "includes/classes/Tercero"], function (angular, models) {

    models.factory('TercerosI007', ["Tercero", function (Tercero) {


            function TercerosI007(nombre, tipo_id_tercero, id, direccion, telefono, pais, dv) {
                Tercero.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.dv = dv || "";
                this.pais = pais;
                this.tercero_id = id;
            }

            TercerosI007.prototype = Object.create(Tercero.getClass().prototype);
            
            TercerosI007.prototype.setPais = function (pais) {   
                this.pais = pais;
            };

            TercerosI007.prototype.getPais = function () {
                return this.pais;
            };
      
            TercerosI007.prototype.setDv = function (dv) {   
                this.dv = dv;
            };

            TercerosI007.prototype.getDv = function () {
                return this.dv;
            };
      
            TercerosI007.prototype.setTercero_id = function (tercero_id) {   
                this.tercero_id = tercero_id;
            };

            TercerosI007.prototype.getTercero_id = function () {
                return this.tercero_id;
            };

            this.get = function (nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv) {
                return new TercerosI007(nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv);
            };

            return this;

        }]);

});