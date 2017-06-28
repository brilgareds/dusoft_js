
define(["angular", "js/models", "includes/classes/Vendedor"], function (angular, models) {

    models.factory('VendedorDespacho', ["Vendedor", function (Vendedor) {


            function VendedorDespacho(nombre, tipo_id_tercero, id, direccion, telefono) {
                Vendedor.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.email;
                this.tipoBloqueoId;
                this.documento = [];
                this.telefono;
            }

            VendedorDespacho.prototype = Object.create(Vendedor.getClass().prototype);

            
            VendedorDespacho.prototype.setNumeroTelefonico = function(telefono) {
                this.telefono = telefono;
            };
            
            VendedorDespacho.prototype.getNumeroTelefonico = function() {
                return this.telefono;
            };

            this.get = function (nombre, tipo_id_tercero, id, direccion, telefono) {
                return new VendedorDespacho(nombre, tipo_id_tercero, id, direccion, telefono);
            };
            
            
            

            return this;

        }]);

});