/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(["angular", "js/models", "includes/classes/Documento"], function (angular, models) {

    models.factory('AprobacionDespacho', ["Documento", function (Documento) {


            function AprobacionDespacho(bodegas_doc_id, prefijo, numero, fecha_registro) {
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
                this.usuario;
                
            };
            

            AprobacionDespacho.prototype = Object.create(Documento.getClass().prototype);
            
            
            
            AprobacionDespacho.prototype.setRazonSocial = function (razon_social) {
               this.razon_social = razon_social;
            };
            AprobacionDespacho.prototype.getRazonSocial = function () {
                return this.razon_social;
            };
            
            AprobacionDespacho.prototype.setUsuario = function (usuario) {
               this.usuario = usuario;
            };
            AprobacionDespacho.prototype.getUsuario = function () {
                return this.usuario;
            };
            
            
            
            AprobacionDespacho.prototype.setObservacion = function (observacion) {
                 this.observacion = observacion;
            };
            
            AprobacionDespacho.prototype.getObservacion = function () {
                return this.observacion;
            };
            
            AprobacionDespacho.prototype.setCantidadCajas = function (cantidadCajas) {
                this.cantidadCajas = cantidadCajas;
            };
            AprobacionDespacho.prototype.getCantidadCajas = function () {
                return this.cantidadCajas;
            };
            
            
            AprobacionDespacho.prototype.setCantidadNeveras = function (cantidadNeveras) {
                this.cantidadNeveras = cantidadNeveras;
            };
            AprobacionDespacho.prototype.getCantidadNeveras = function () {
                return this.cantidadNeveras;
            };



            AprobacionDespacho.prototype.setEstado = function (estado) {
                this.estado = estado;
            };
            AprobacionDespacho.prototype.getEstado = function() {
                return this.estado;
            };

            
           
            this.get = function (bodegas_doc_id, prefijo, numero, fecha_registro) {
                return new AprobacionDespacho(bodegas_doc_id, prefijo, numero, fecha_registro);
            };

            return this;

        }]);

});

