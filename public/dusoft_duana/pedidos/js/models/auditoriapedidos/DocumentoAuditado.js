/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(["angular", "js/models", "includes/classes/Documento"], function (angular, models) {

    models.factory('DocumentoAuditado', ["Documento", function (Documento) {

            function DocumentoAuditado(bodegas_doc_id, prefijo, numero, fecha_registro, razon_social) {
                Documento.getClass().call(this, bodegas_doc_id, prefijo, numero, fecha_registro);
                 
                this.bodegas_doc_id = bodegas_doc_id;
                this.prefijo = prefijo;
                this.numero = numero;
                this.fecha_registro = fecha_registro;
                this.cantidadCajas = 0;
                this.cantidadNeveras = 0;
                this.estado =0;
                this.observacion;
                this.razon_social;
                this.empresaId;
                this.usuario;
                this.razon_social;
                this.productos = [];
                
            };
            

            DocumentoAuditado.prototype = Object.create(Documento.getClass().prototype);
            
            
            DocumentoAuditado.prototype.getPrefijo = function () {
                return this.prefijo;
            };
            
            DocumentoAuditado.prototype.getNumero = function () {
                return this.numero;
            };
            
            
            
            DocumentoAuditado.prototype.setEmpresaId = function (empresaId) {
               this.empresaId = empresaId;
            };
            
            DocumentoAuditado.prototype.getEmpresaId = function () {
                return this.empresaId;
            };
            
            DocumentoAuditado.prototype.setRazonSocial = function (razon_social) {
               this.razon_social = razon_social;
            };
            
            DocumentoAuditado.prototype.getRazonSocial = function () {
                return this.razon_social;
            };
            
            DocumentoAuditado.prototype.setUsuario = function (usuario) {
               this.usuario = usuario;
            };
            DocumentoAuditado.prototype.getUsuario = function () {
                return this.usuario;
            };
        
            DocumentoAuditado.prototype.setObservacion = function (observacion) {
                 this.observacion = observacion;
            };
            
            DocumentoAuditado.prototype.getObservacion = function () {
                return this.observacion;
            };
            
            DocumentoAuditado.prototype.setCantidadCajas = function (cantidadCajas) {
                this.cantidadCajas = cantidadCajas;
            };
            DocumentoAuditado.prototype.getCantidadCajas = function () {
                return this.cantidadCajas;
            };    
            DocumentoAuditado.prototype.setCantidadNeveras = function (cantidadNeveras) {
                this.cantidadNeveras = cantidadNeveras;
            };
            DocumentoAuditado.prototype.getCantidadNeveras = function () {
                return this.cantidadNeveras;
            };
            DocumentoAuditado.prototype.setEstado = function (estado) {
                this.estado = estado;
            };
            DocumentoAuditado.prototype.getEstado = function() {
                return this.estado;
            };
            
            DocumentoAuditado.prototype.agregarProductos = function (centro) {
                this.productos.push(centro);
            };

            DocumentoAuditado.prototype.obtenerProductos = function () {
                return this.productos;
            };
     
            this.get = function (bodegas_doc_id, prefijo, numero, fecha_registro) {
                return new DocumentoAuditado(bodegas_doc_id, prefijo, numero, fecha_registro);
            };

            return this;

        }]);

});




