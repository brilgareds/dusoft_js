define(["angular", "js/models"], function(angular, models) {

    models.factory('PlanillaDespacho', [function() {

            function PlanillaDespacho(id, transportadora, ciudad, nombre_conductor, observacion, usuario, fecha_registro, fecha_despacho, estado, descripcion_estado) {
                this.id = id;
                this.transportadora = transportadora;
                this.ciudad = ciudad;
                this.nombre_conductor = nombre_conductor || '';
                this.observacion = observacion || '';
                this.usuario = usuario;
                this.fecha_registro = fecha_registro || '';
                this.fecha_despacho = fecha_despacho || '';
                this.estado = estado || '1'; // 0 Anulada - 1 Activa - 2 Despachada
                this.descripcion_estado = descripcion_estado || 'Activa'; // 0 Anulada - 1 Activa - 2 Despachada                
                this.cantidad_cajas = '';
                this.cantidad_neveras = '';
                this.numero_guia_externo = '';
                this.documento = '';
                this.documentos = [];
                this.empresa = "";
            }

            this.get = function(id, transportadora, ciudad, nombre_conductor, observacion, usuario, fecha_registro, fecha_despacho, estado, descripcion_estado) {
                return new PlanillaDespacho(id, transportadora, ciudad, nombre_conductor, observacion, usuario, fecha_registro, fecha_despacho, estado, descripcion_estado);
            };

            
            
            PlanillaDespacho.prototype.set_numero_guia = function(numero_guia) {
                this.id = numero_guia;
            };

            PlanillaDespacho.prototype.set_transportadora = function(transportadora) {
                this.transportadora = transportadora;
            };

            PlanillaDespacho.prototype.set_ciudad = function(ciudad) {
                this.ciudad = ciudad;
            };

            PlanillaDespacho.prototype.set_usuario = function(usuario) {
                this.usuario = usuario;
            };

            PlanillaDespacho.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            PlanillaDespacho.prototype.set_documento = function(documento) {
                this.documento = documento;
            };

            PlanillaDespacho.prototype.set_documentos = function(documento) {
                this.documentos.push(documento);
            };

            PlanillaDespacho.prototype.set_cantidad_cajas = function(cantidad_cajas) {
                this.cantidad_cajas = cantidad_cajas;
            };

            PlanillaDespacho.prototype.set_cantidad_neveras = function(cantidad_neveras) {
                this.cantidad_neveras = cantidad_neveras;
            };

            PlanillaDespacho.prototype.set_numero_guia_externo = function(numero_guia_externo) {
                this.numero_guia_externo = numero_guia_externo || '';
            };
            
            PlanillaDespacho.prototype.set_empresa = function(empresa) {
                this.empresa = empresa;
            };

            PlanillaDespacho.prototype.get_numero_guia = function() {
                return this.id;
            };
            PlanillaDespacho.prototype.get_transportadora = function() {
                return this.transportadora;
            };

            PlanillaDespacho.prototype.get_ciudad = function() {
                return this.ciudad;
            };

            PlanillaDespacho.prototype.get_nombre_conductor = function() {
                return this.nombre_conductor;
            };

            PlanillaDespacho.prototype.get_observacion = function() {
                return this.observacion;
            };

            PlanillaDespacho.prototype.get_usuario = function() {
                return this.usuario;
            };

            PlanillaDespacho.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };

            PlanillaDespacho.prototype.get_fecha_despacho = function() {
                return this.fecha_despacho;
            };

            PlanillaDespacho.prototype.get_estado = function() {
                return this.estado;
            };

            PlanillaDespacho.prototype.get_descripcion_estado = function() {
                return this.descripcion_estado;
            };

            PlanillaDespacho.prototype.get_documento = function() {
                return this.documento;
            };

            PlanillaDespacho.prototype.get_documentos = function() {
                return this.documentos;
            };

            PlanillaDespacho.prototype.limpiar_documentos = function() {
                this.documentos = [];
            };

            PlanillaDespacho.prototype.get_cantidad_cajas = function() {
                return this.cantidad_cajas;
            };

            PlanillaDespacho.prototype.get_cantidad_neveras = function() {
                return this.cantidad_neveras;
            };

            PlanillaDespacho.prototype.get_numero_guia_externo = function() {
                return this.numero_guia_externo;
            };
            
            PlanillaDespacho.prototype.get_empresa = function() {
                return this.empresa;
            };

            return this;
        }]);
});