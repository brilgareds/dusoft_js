
define(["angular", "js/models", "includes/classes/Tercero"], function (angular, models) {

    models.factory('ClientesE007', ["Tercero", function (Tercero) {


            function ClientesE007(nombre, tipo_id_tercero, id, direccion, telefono, pais, dv) {
                Tercero.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.dv = dv || "";
                this.pais = pais;
                this.tercero_id = id;
            }

            ClientesE007.prototype = Object.create(Tercero.getClass().prototype);
            
            ClientesE007.prototype.setPais = function (pais) {   
                this.pais = pais;
            };

            ClientesE007.prototype.getPais = function () {
                return this.pais;
            };
      
            ClientesE007.prototype.setDv = function (dv) {   
                this.dv = dv;
            };

            ClientesE007.prototype.getDv = function () {
                return this.dv;
            };
      
            ClientesE007.prototype.setTercero_id = function (tercero_id) {   
                this.tercero_id = tercero_id;
            };

            ClientesE007.prototype.getTercero_id = function () {
                return this.tercero_id;
            };

            this.get = function (nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv) {
                return new ClientesE007(nombre, tipo_id_tercero, tercero_id, direccion, telefono, pais, dv);
            };

            return this;

        }]);

});