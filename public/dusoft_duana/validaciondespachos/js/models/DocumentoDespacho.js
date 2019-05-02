define(["angular", "js/models", "includes/classes/Documento"], function (angular, models) {

    models.factory('DocumentoDespacho', ["Documento", function (Documento, $filter) {

            function DocumentoDespacho(bodegas_doc_id, prefijo, numero, empresaId) {

                this.bodegas_doc_id = bodegas_doc_id;
                this.prefijo = prefijo || "";
                this.numero = numero || "";
                this.fechaRegistro;
                this.numeroPedido;
                this.seleccionado = false;
                this.cantidadCajas = 0;
                this.cantidadNeveras = 0;
                this.cantidadBolsas = 0;
                this.empresaId = empresaId;
                this.estado = 0;
                this.estadoDocumento;
                this.estadoPedido;
                this.tipo;
            }

            this.get = function (bodegas_doc_id, prefijo, numero, empresaId) {
                return new DocumentoDespacho(bodegas_doc_id, prefijo, numero, empresaId);
            };

            DocumentoDespacho.prototype = Object.create(Documento.getClass().prototype);


            DocumentoDespacho.prototype.getEstadoDocumento = function () {
                return this.estadoDocumento;
            };

            DocumentoDespacho.prototype.setEstadoDocumento = function (estadoDocumento) {
                this.estadoDocumento = estadoDocumento;
            };

            DocumentoDespacho.prototype.getEstado = function () {
                return this.estado;
            };

            DocumentoDespacho.prototype.setEstado = function (estado) {
                this.estado = estado;
            };

            DocumentoDespacho.prototype.getTipo = function () {
                return this.tipo;
            };

            DocumentoDespacho.prototype.setTipo = function (tipo) {
                this.tipo = tipo;
            };

            DocumentoDespacho.prototype.getEstadoPedido = function () {
                return this.estadoPedido;
            };

            DocumentoDespacho.prototype.setEstadoPedido = function (estadoPedido) {
                this.estadoPedido = estadoPedido;
            };

            DocumentoDespacho.prototype.getFechaRegistro = function () {
                return this.fechaRegistro;
            };

            DocumentoDespacho.prototype.setFechaRegistro = function (fechaRegistro) {
                this.fechaRegistro = fechaRegistro;
            };


            DocumentoDespacho.prototype.getCantidadCajas = function () {
                return this.cantidadCajas;
            };

            DocumentoDespacho.prototype.setCantidadCajas = function (cantidadCajas) {
                this.cantidadCajas = cantidadCajas;
            };

            DocumentoDespacho.prototype.getCantidadNeveras = function () {
                return this.cantidadNeveras;
            };

            DocumentoDespacho.prototype.setCantidadNeveras = function (cantidadNeveras) {
                this.cantidadNeveras = cantidadNeveras;
            };

            DocumentoDespacho.prototype.getCantidadBolsas = function () {
                return this.cantidadBolsas;
            };

            DocumentoDespacho.prototype.setCantidadBolsas = function (cantidadBolsas) {
                this.cantidadBolsas = cantidadBolsas;
            };

            DocumentoDespacho.prototype.getNumeroPedido = function () {
                return this.numeroPedido;
            };

            DocumentoDespacho.prototype.setNumeroPedido = function (numeroPedido) {
                this.numeroPedido = numeroPedido;
            };

            DocumentoDespacho.prototype.get_empresa_id = function () {
                return this.empresaId;
            };

            DocumentoDespacho.prototype.set_documentos = function (documento) {
                this.documentos.push(documento);
            };

            DocumentoDespacho.prototype.get_documentos = function () {
                return this.documentos;
            };

            DocumentoDespacho.prototype.limpiar_documentos = function () {
                return this.documentos = [];
            };

            DocumentoDespacho.prototype.getSeleccionado = function () {
                return this.seleccionado;
            };

            DocumentoDespacho.prototype.setSeleccionado = function (seleccionado) {
                this.seleccionado = seleccionado;
            };




            return this;
        }]);
});