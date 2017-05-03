
define(["angular", "js/models", "includes/classes/Tercero"], function (angular, models) {

    models.factory('TerceroDespacho', ["Tercero", function (Tercero) {


            function TerceroDespacho(nombre, tipo_id_tercero, id, direccion, telefono) {
                Tercero.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.email;
                this.tipoBloqueoId;
                this.documento = [];
            }

            TerceroDespacho.prototype = Object.create(Tercero.getClass().prototype);

            TerceroDespacho.prototype.setEmail = function (email) {
                this.email = email;
            };

            TerceroDespacho.prototype.getEmail = function () {
                return this.email;
            };

            TerceroDespacho.prototype.setTipoBloqueoId = function (tipoBloqueoId) {
                this.tipoBloqueoId = tipoBloqueoId;
            };

            TerceroDespacho.prototype.getTipoBloqueoId = function () {
                return this.tipoBloqueoId;
            };

            TerceroDespacho.prototype.agregarDocumentos = function (documento) {
                this.documento.push(documento);
            };

            TerceroDespacho.prototype.vaciarDocumentos = function () {
                this.documento = [];
            }

            TerceroDespacho.prototype.mostrarFacturas = function () {
                return this.documento;
            };


            this.get = function (nombre, tipo_id_tercero, id, direccion, telefono) {
                return new TerceroDespacho(nombre, tipo_id_tercero, id, direccion, telefono);
            };

            return this;

        }]);

});