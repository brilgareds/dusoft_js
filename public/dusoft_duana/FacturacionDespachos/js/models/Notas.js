
define(["angular", "js/models"], function (angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory("Notas", [function () {


            function Notas(numeroNota, numeroFactura, fechaRegistroNota, fechaRegistroFactura) {

                this.numeroNota = numeroNota;
                this.numeroFactura = numeroFactura;
                this.fechaRegistroFactura = fechaRegistroFactura;
                this.fechaRegistroNota = fechaRegistroNota;
            }

            // Nota
            Notas.prototype.setNumeroNota = function (numeroNota) {
                this.numeroNota = numeroNota;
            };

            Notas.prototype.getNumeroNota = function () {
                return this.numeroNota;
            };

            // Factura
            Notas.prototype.setNumeroFactura = function (numeroFactura) {
                this.numeroFactura = numeroFactura;
            };

            Notas.prototype.getNumeroFactura = function () {
                return this.numeroFactura;
            };

            Notas.prototype.setFechaRegistroNota = function (fechaRegistroNota) {
                this.fechaRegistroNota = fechaRegistroNota;
            };

            Notas.prototype.getFechaRegistroNota = function () {
                return this.fechaRegistroNota;
            };

            Notas.prototype.setFechaRegistroFactura = function (fechaRegistroFactura) {
                this.fechaRegistroFactura = fechaRegistroFactura;
            };

            Notas.prototype.getFechaRegistroFactura = function () {
                return this.fechaRegistroFactura;
            };

            Notas.prototype.setNombreTercero = function (nombreTercero) {
                this.nombreTercero = nombreTercero;
            };

            Notas.prototype.getNombreTercero = function () {
                return this.nombreTercero;
            };

            Notas.prototype.setEstado = function (estado) {
                this.estado = estado;
            };

            Notas.prototype.getEstado = function () {
                return this.estado;
            };

            Notas.prototype.setDescripcionEstado = function (descripcionEstado) {
                this.descripcionEstado = descripcionEstado;
            };

            Notas.prototype.getDescripcionEstado = function () {
                return this.descripcionEstado;
            };

//            Notas.prototype.setValorDescuento = function(valorDescuento) {
//                this.valorDescuento = valorDescuento;
//            };
//
//            Notas.prototype.getValorDescuento= function() {
//                return this.valorDescuento;
//            };

            Notas.prototype.setValorNota = function (valorNota) {
                this.valorNota = valorNota;
            };

            Notas.prototype.getValorNota = function () {
                return this.valorNota;
            };

            Notas.prototype.setValorFactura = function (valorFactura) {
                this.valorFactura = valorFactura;
            };

            Notas.prototype.getValorFactura = function () {
                return this.valorFactura;
            };
//            
//             Notas.prototype.set_porcentaje_rtf = function(porcentaje_rtf) {
//                this.porcentaje_rtf = porcentaje_rtf;
//                return this;
//            };
//
//            Notas.prototype.get_porcentaje_rtf = function() {
//                return this.porcentaje_rtf;
//            };
//            
//            Notas.prototype.set_porcentaje_ica = function(porcentaje_ica) {
//                this.porcentaje_ica = porcentaje_ica;
//                return this;
//            };
//
//            Notas.prototype.get_porcentaje_ica = function() {
//                return this.porcentaje_ica;
//            };
//            
//            Notas.prototype.set_porcentaje_reteiva = function(porcentaje_reteiva) {
//                this.porcentaje_reteiva = porcentaje_reteiva;
//                return this;
//            };
//
//            Notas.prototype.get_porcentaje_reteiva = function() {
//                return this.porcentaje_reteiva;
//            };
//            
//            Notas.prototype.setSubTotal = function(subTotal) {
//                this.subTotal = subTotal;
//                return this;
//            };
//
//            Notas.prototype.getSubTotal = function() {
//                return this.subTotal;
//            };


            Notas.prototype.setSaldo = function (saldo) {
                this.saldo = saldo;
                return this;
            };

            Notas.prototype.getSaldo = function () {
                return this.saldo;
            };
            
            Notas.prototype.setConcepto = function(concepto) {
                this.concepto = concepto;
                return this;
            };

            Notas.prototype.getsetConcepto = function() {
                return this.concepto;
            };

            Notas.prototype.setIdentificacion = function (identificacion) {
                this.identificacion = identificacion;
                return this;
            };

            Notas.prototype.getIdentificacion = function () {
                return this.identificacion;
            };

            Notas.prototype.setTipoNota = function (tipoNota) {
                this.tipoNota = tipoNota;
                return this;
            };

            Notas.prototype.getTipoNota = function () {
                return this.tipoNota;
            };

            Notas.prototype.setPrefijo = function (prefijo) {
                this.prefijo = prefijo;
                return this;
            };

            Notas.prototype.getPrefijo = function () {
                return this.prefijo;
            };


            Notas.prototype.setTipoTercero = function (tipoTercero) {
                this.tipoTercero = tipoTercero;
                return this;
            };

            Notas.prototype.getTipoTercero = function () {
                return this.tipoTercero;
            };


            Notas.prototype.setTerceroId = function (terceroId) {
                this.terceroId = terceroId;
                return this;
            };

            Notas.prototype.getTerceroId = function () {
                return this.terceroId;
            };

            // Instancia
            this.get = function (numeroNota, numeroFactura, fechaRegistroNota, fechaRegistroFactura) {
                return new Notas(numeroNota, numeroFactura, fechaRegistroNota, fechaRegistroFactura);
            };

            return this;
        }]);
});