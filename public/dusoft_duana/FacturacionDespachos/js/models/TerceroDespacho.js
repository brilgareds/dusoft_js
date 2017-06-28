
define(["angular", "js/models", "includes/classes/Tercero"], function (angular, models) {

    models.factory('TerceroDespacho', ["Tercero", function (Tercero) {


            function TerceroDespacho(nombre, tipo_id_tercero, id, direccion, telefono) {
                Tercero.getClass().call(this, nombre, tipo_id_tercero, id, direccion, telefono);
                this.email;
                this.tipoBloqueoId;
                this.pedidos = [];
                this.ubicacion;
            }

            TerceroDespacho.prototype = Object.create(Tercero.getClass().prototype);
            
            TerceroDespacho.prototype.setUbicacion = function (ubicacion) {   
                this.ubicacion = ubicacion;
            };

            TerceroDespacho.prototype.getUbicacion = function () {
                return this.ubicacion;
            };


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
            
            TerceroDespacho.prototype.agregarPedidos = function (pedidos) {
                this.pedidos.push(pedidos);
            };

            TerceroDespacho.prototype.vaciarPedidos = function () {
                this.pedidos = [];
            }

            TerceroDespacho.prototype.mostrarPedidos = function () {
                return this.pedidos;
            };

            this.get = function (nombre, tipo_id_tercero, id, direccion, telefono) {
                return new TerceroDespacho(nombre, tipo_id_tercero, id, direccion, telefono);
            };

            return this;

        }]);

});