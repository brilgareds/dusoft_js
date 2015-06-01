define(["angular", "js/models"], function(angular, models) {

    models.factory('Transportadora', [function() {

            function Transportadora(id, descripcion, placa, estado) {
                this.id = id;
                this.descripcion = descripcion;
                this.placa = placa || '';
                this.estado = estado;
                this.solicitar_guia = '';
            }

            this.get = function(id, descripcion, placa, estado) {
                return new Transportadora(id, descripcion, placa, estado);
            };

            Transportadora.prototype.set_solicitar_guia = function(solicitar_guia) {
                this.solicitar_guia = solicitar_guia;
            };

            Transportadora.prototype.get_id = function() {
                return this.id;
            };

            Transportadora.prototype.get_nombre = function() {

                return this.descripcion;
            };

            Transportadora.prototype.get_descripcion = function() {
                if (this.placa !== '')
                    return this.descripcion + ' (' + this.placa + ')';
                else
                    return this.descripcion;
            };

            Transportadora.prototype.get_placa = function() {
                return this.placa;
            };

            Transportadora.prototype.get_estado = function() {
                return this.estado;
            };

            Transportadora.prototype.get_solicitar_guia = function() {
                return this.solicitar_guia;
            };

            return this;
        }]);
});