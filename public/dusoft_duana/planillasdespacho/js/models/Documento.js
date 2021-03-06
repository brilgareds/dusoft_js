define(["angular", "js/models"], function(angular, models) {

    models.factory('Documento', [function() {

            function Documento(id, empresa_id, prefijo, numero, numero_pedido, cantidad_cajas, cantidad_neveras, cantidad_bolsas, temperatura_neveras, observacion, tipo) {
                this.id = id || 0;
                this.tercero = '';
                this.empresa_id = empresa_id;
                this.prefijo = prefijo;
                this.numero = numero;
                this.numero_pedido = numero_pedido;
                this.cantidad_cajas = cantidad_cajas || '';
                this.cantidad_neveras = cantidad_neveras || '';
                this.cantidad_bolsas = cantidad_bolsas || '';
                this.cantidad_cajas_auditadas = 0;
                this.cantidad_neveras_auditadas = 0;
                this.cantidad_bolsas_auditadas = 0;
                this.temperatura_neveras = temperatura_neveras || '';
                this.observacion = observacion || '';                
                this.tipo = tipo;   
                this.fecha_registro;
                this.seleccionado = false;
            }

            this.get = function(id, empresa_id, prefijo, numero, numero_pedido, cantidad_cajas, cantidad_neveras, cantidad_bolsas, temperatura_neveras, observacion, tipo) {
                return new Documento(id, empresa_id, prefijo, numero, numero_pedido, cantidad_cajas, cantidad_neveras, cantidad_bolsas, temperatura_neveras, observacion, tipo);
            };

            Documento.prototype.set_empresa_id = function(empresa_id) {
                this.empresa_id = empresa_id;
            };
            
            Documento.prototype.set_temperatura_neveras = function(temperatura) {
                this.temperatura_neveras = temperatura;
            };
            
            Documento.prototype.set_tercero = function(tercero) {
                this.tercero = tercero;
            };
            
            Documento.prototype.set_cantidad_cajas_auditadas = function(cantidad) {
                this.cantidad_cajas_auditadas = cantidad;
            };
            
            Documento.prototype.set_cantidad_neveras_auditadas = function(cantidad) {
                this.cantidad_neveras_auditadas = cantidad;
            };
            
            Documento.prototype.set_cantidad_bolsas_auditadas = function(cantidad) {
                this.cantidad_bolsas_auditadas = cantidad;
            };
            
            Documento.prototype.set_observacion = function(observacion) {
                return this.observacion = observacion;
            };
            
            
            
            Documento.prototype.get_id = function() {
                return this.id;
            };
            
            Documento.prototype.get_tercero = function() {
                return this.tercero;
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
                var pedido = (this.get_numero_pedido()) ? ' ( No. Pedido ' + this.get_numero_pedido() + ' )' : "";
                return this.get_prefijo_numero() + pedido;
            };

            Documento.prototype.get_numero_pedido = function() {
                return this.numero_pedido;
            };

            Documento.prototype.get_cantidad_cajas = function() {
                
                if( isNaN(parseInt(this.cantidad_cajas)) ){
                    this.cantidad_cajas = 0;
                }
                return this.cantidad_cajas;
            };

            Documento.prototype.get_cantidad_neveras = function() {
              
                 if( isNaN(parseInt(this.cantidad_neveras)) ){
              
                    this.cantidad_neveras = 0;
                }
                return this.cantidad_neveras;
            };

            Documento.prototype.get_cantidad_bolsas = function() {
              
                 if( isNaN(parseInt(this.cantidad_bolsas)) ){
              
                    this.cantidad_bolsas = 0;
                }
                return this.cantidad_bolsas;
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
            
            Documento.prototype.get_cantidad_cajas_auditadas = function() {
                return this.cantidad_cajas_auditadas;
            };
            
            Documento.prototype.get_cantidad_neveras_auditadas = function() {
                return this.cantidad_neveras_auditadas;
            };
            
            Documento.prototype.get_cantidad_bolsas_auditadas = function() {
                return this.cantidad_bolsas_auditadas;
            };
            
            Documento.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };
            
            Documento.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            Documento.prototype.getSeleccionado = function() {
                return this.seleccionado;
            };
            
            Documento.prototype.setSeleccionado = function(seleccionado) {
                this.seleccionado = seleccionado ;
            };
            
            return this;
        }]);
});