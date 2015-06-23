define(["angular", "js/models"], function(angular, models) {
    models.factory('Detalle', function() {

        function Detalle(detalle) {
            this.objectodetalle = detalle;
            this.detalle = "";

            this.armarStringDetalle();
        }

        Detalle.prototype.armarStringDetalle = function() {

            for (var i in this.objectodetalle) {
                this.detalle += "<p><strong>" + i + "</strong> " + this.objectodetalle[i] || "" + "</p>";
            }

        };

        Detalle.prototype.getDetalle = function() {
            return this.detalle;
        };

        Detalle.prototype.setDetalle = function(detalle) {
            this.detalle = detalle;
            return this;
        };

        this.get = function(detalle) {
            return new Detalle(detalle);
        };

        return this;
    });
});