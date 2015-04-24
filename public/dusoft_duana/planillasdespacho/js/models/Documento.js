define(["angular", "js/models"], function(angular, models) {

    models.factory('Documento', [function() {

            function Documento(id, empresa_id, prefijo, numero, numero_pedido, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, tipo) {
                this.id = id || 0;
                this.empresa_id = empresa_id;
                this.prefijo = prefijo;
                this.numero = numero;
                this.numero_pedido = numero_pedido;
                this.cantidad_cajas = cantidad_cajas || 0;
                this.cantidad_neveras = cantidad_neveras || 0;
                this.temperatura_neveras = temperatura_neveras || 0;
                this.observacion = observacion || '';
                this.tipo = tipo;
            }

            this.get = function(id, empresa_id, prefijo, numero, numero_pedido, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, tipo) {
                return new Documento(id, empresa_id, prefijo, numero, numero_pedido, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, tipo);
            };

            Documento.prototype.get_id = function() {
                return this.id;
            };
            
            Documento.prototype.get_empresa_id = function() {
                return this.empresa_id;
            };
            
            Documento.prototype.get_prefijo = function() {
                return this.prefijo;
            };
            
            Documento.prototype.get_numero = function() {
                return this.numero;
            };
            
            Documento.prototype.get_prefijo_numero = function() {
                return this.prefijo + '-' + this.numero;
            };
            
            Documento.prototype.get_descripcion = function() {
                return this.get_prefijo_numero() + ' ( No. Pedido '+ this.get_numero_pedido() + ' )' ;
            };
            
            Documento.prototype.get_numero_pedido = function() {
                return this.numero_pedido;
            };
            
            Documento.prototype.get_cantidad_cajas = function() {
                return this.cantidad_cajas;
            };
            
            Documento.prototype.get_cantidad_neveras = function() {
                return this.cantidad_neveras;
            };
            
            Documento.prototype.get_temperatura_neveras = function() {
                return this.temperatura_neveras;
            };
            
            Documento.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            Documento.prototype.get_tipo = function() {
                return this.tipo;
            };
            
            return this;
        }]);
});