
define(["angular", "js/models"], function (angular, models) {

    models.factory('Totales', [function () {


            function Totales() {
            };

            Totales.prototype.setIva = function (iva) {
                this.iva = iva;
            };

            Totales.prototype.getIva = function () {
                return this.iva;
            };
            
            Totales.prototype.setSubTotal = function (subtotal) {
                this.subtotal = subtotal;
            };

            Totales.prototype.getSubTotal = function () {
                return this.subtotal;
            };
            
            Totales.prototype.setTotal = function (total) {
                this.subtotal = total;
            };

            Totales.prototype.getTotal = function () {
                return this.total;
            };
            
            Totales.prototype.setImpuestoCree = function (impuestoCree) {
                this.impuestoCree = impuestoCree;
            };

            Totales.prototype.getImpuestoCree = function () {
                return this.impuestoCree;
            };
            
            Totales.prototype.setValorRetFte = function (valorRetFte) {
                this.valorRetFte = valorRetFte;
            };

            Totales.prototype.getValorRetFte = function () {
                return this.valorRetFte;
            };
            
            Totales.prototype.setValorRetIca = function (valorRetIca) {
                this.valorRetIca = valorRetIca;
            };

            Totales.prototype.getValorRetIca = function () {
                return this.valorRetIca;
            };
            
            Totales.prototype.setValorRetIva = function (valorRetIva) {
                this.valorRetIva = valorRetIva;
            };

            Totales.prototype.getValorRetIva = function () {
                return this.valorRetIva;
            };
            
            Totales.prototype.set_iva = function (_iva) {
                this._iva = _iva;
            };

            Totales.prototype.get_iva = function () {
                return this._iva;
            };
            
            Totales.prototype.set_subTotal= function (_subTotal) {
                this._subTotal = _subTotal;
            };

            Totales.prototype.get_subTotal = function () {
                return this._subTotal;
            };
            
            Totales.prototype.setCantidad= function (cantidad) {
                this.cantidad = cantidad;
            };

            Totales.prototype.getCantidad = function () {
                return this.cantidad;
            };
                       
            this.get = function () {
                return new Totales();
            };

            return this;

        }]);

});