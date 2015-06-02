define(["angular", "js/models"], function(angular, models) {

    models.factory('RecepcionMercancia', [function() {

            function RecepcionMercancia(empresa_id, numero_recepcion) {
                this.empresa_id = empresa_id;
                this.numero_recepcion = numero_recepcion;
            }

            this.get = function(empresa_id, numero_recepcion) {
                return new RecepcionMercancia(empresa_id, numero_recepcion);
            };

            RecepcionMercancia.prototype.set_numero_recepcion = function(numero_recepcion) {
                this.numero_recepcion = numero_recepcion;
            };

            RecepcionMercancia.prototype.set_empresa_id = function(empresa_id) {
                this.empresa_id = empresa_id;
            };

            RecepcionMercancia.prototype.set_proveedor = function(proveedor) {
                this.proveedor = proveedor;
            };

            RecepcionMercancia.prototype.set_orden_compra = function(orden_compra) {
                this.orden_compra = orden_compra;
            };

            RecepcionMercancia.prototype.set_transportadora = function(transportadora) {
                this.transportadora = transportadora;
            };

            RecepcionMercancia.prototype.set_novedad = function(novedad) {
                this.novedad = novedad;
            };

            RecepcionMercancia.prototype.set_numero_guia = function(numero_guia) {
                this.numero_guia = numero_guia;
            };

            RecepcionMercancia.prototype.set_numero_factura = function(numero_factura) {
                this.numero_factura = numero_factura;
            };

            RecepcionMercancia.prototype.set_cantidad_cajas = function(cantidad_cajas) {
                this.cantidad_cajas = cantidad_cajas;
            };

            RecepcionMercancia.prototype.set_cantidad_neveras = function(cantidad_neveras) {
                this.cantidad_neveras = cantidad_neveras;
            };

            RecepcionMercancia.prototype.set_temperatura_neveras = function(temperatura_neveras) {
                this.temperatura_neveras = temperatura_neveras;
            };

            RecepcionMercancia.prototype.set_contiene_medicamentos = function() {
                this.contiene_dispositivos = false;
                this.contiene_medicamentos = true;
            };

            RecepcionMercancia.prototype.set_contiene_dispositivos = function() {
                this.contiene_dispositivos = true;
                this.contiene_medicamentos = false;
            };

            RecepcionMercancia.prototype.set_fecha_ingreso = function(fecha_ingreso) {
                this.fecha_ingreso = fecha_ingreso;
            };



            RecepcionMercancia.prototype.get_numero_recepcion = function() {
                return this.numero_recepcion;
            };

            RecepcionMercancia.prototype.get_empresa_id = function() {
                return this.empresa_id;
            };

            RecepcionMercancia.prototype.get_proveedor = function() {
                return this.proveedor;
            };

            RecepcionMercancia.prototype.get_orden_compra = function() {
                return this.orden_compra;
            };

            RecepcionMercancia.prototype.get_transportadora = function() {
                return this.transportadora;
            };

            RecepcionMercancia.prototype.get_novedad = function() {
                return this.novedad;
            };

            RecepcionMercancia.prototype.get_numero_guia = function() {
                return this.numero_guia;
            };

            RecepcionMercancia.prototype.get_numero_factura = function() {
                return this.numero_factura;
            };

            RecepcionMercancia.prototype.get_cantidad_cajas = function() {
                return this.cantidad_cajas;
            };

            RecepcionMercancia.prototype.get_cantidad_neveras = function() {
                return this.cantidad_neveras;
            };

            RecepcionMercancia.prototype.get_temperatura_neveras = function() {
                return this.temperatura_neveras;
            };

            RecepcionMercancia.prototype.get_contiene_medicamentos = function() {
                return this.contiene_medicamentos;
            };

            RecepcionMercancia.prototype.get_contiene_dispositivos = function() {
                return this.contiene_dispositivos;
            };

            RecepcionMercancia.prototype.get_fecha_ingreso = function() {
                return this.fecha_ingreso;
            };

            return this;
        }]);
});