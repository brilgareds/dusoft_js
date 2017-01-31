
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoCliente', ["Pedido", function(Pedido) {

            function PedidoCliente(empresa_id, centro_utilidad_id, bodega_id) {
                Pedido.getClass().call(this);

                this.empresa_id = empresa_id || '';
                this.centro_utilidad_id = centro_utilidad_id || '';
                this.bodega_id = bodega_id || '';
                this.numero_cotizacion = 0;
                this.observacion = "";
                this.productos = [];
                this.subtotal = 0;
                this.valor_iva = 0;
                this.total = 0;
                this.tipo_producto = '';
                this.descripcion_tipo_producto = '';
                this.observacion_cartera = '';
                this.aprobado_cartera = '0';
                this.estado_cotizacion = '';
                this.descripcion_estado_cotizacion = '';
                this.estado ='0';
                this.tieneDespacho = false;
                this.despachoEmpresaId = "";
                this.despachoPrefijo = "";
                this.despachoNumero = 0;
                this.estadoSolicitud;
                this.tipoPedido;
                this.facturaFiscal;
                this.estadoFacturaFiscal;
                this.filtroEstadoFacturado = false;
            };

            PedidoCliente.prototype = Object.create(Pedido.getClass().prototype);

            
            //Escribiendo el estado de solicitud del pedido
            PedidoCliente.prototype.setEstadoSolicitud = function(estadoSolicitud) {
                this.estadoSolicitud = estadoSolicitud;
                return this;
            };
            
            //Obteniendo estado de solicitud del pedido
            PedidoCliente.prototype.getEstadoSolicitud = function() {
                
                return this.estadoSolicitud;
                
            };
            
            //estado
            PedidoCliente.prototype.setEstado = function(estado) {
                this.estado = estado;
                return this;
            };
            
            //estado
            PedidoCliente.prototype.getEstado = function() {
                
                return this.estado;
            };
            // Empresa
            PedidoCliente.prototype.set_empresa_id = function(empresa_id) {
                this.empresa_id = empresa_id;
                return this;
            };

            PedidoCliente.prototype.get_empresa_id = function() {
                return this.empresa_id;
            };

            // Centro Utilidad
            PedidoCliente.prototype.set_centro_utilidad_id = function(centro_utilidad_id) {
                this.centro_utilidad_id = centro_utilidad_id;
                return this;
            };

            PedidoCliente.prototype.get_centro_utilidad_id = function() {
                return this.centro_utilidad_id;
            };

            // Bodega
            PedidoCliente.prototype.set_bodega_id = function(bodega_id) {
                this.bodega_id = bodega_id;
                return this;
            };

            PedidoCliente.prototype.get_bodega_id = function() {
                return this.bodega_id;
            };

            // Numero Cotizacion
            PedidoCliente.prototype.set_numero_cotizacion = function(numero_cotizacion) {
                this.numero_cotizacion = numero_cotizacion;
                return this;
            };

            PedidoCliente.prototype.get_numero_cotizacion = function() {
                return this.numero_cotizacion;
            };

            // Vendedor
            PedidoCliente.prototype.set_vendedor = function(vendedor) {
                this.vendedor = vendedor;
                return this;
            };

            PedidoCliente.prototype.get_vendedor = function() {
                return this.vendedor;
            };

            // Observacion
            PedidoCliente.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
                return this;
            };

            PedidoCliente.prototype.get_observacion = function() {
                return this.observacion;
            };

            // Productos
            PedidoCliente.prototype.set_productos = function(producto) {
                this.productos.push(producto);
                return this;
            };

            PedidoCliente.prototype.get_productos = function() {
                return this.productos;
            };

            PedidoCliente.prototype.limpiar_productos = function() {
                this.productos = [];
            };

            // Subotal
            PedidoCliente.prototype.set_subtotal = function(subtotal) {
                this.subtotal = subtotal;
                return this;
            };

            PedidoCliente.prototype.get_subtotal = function() {

                var subtotal = 0;
                this.get_productos().forEach(function(producto) {
                    subtotal += parseFloat(producto.get_valor_total_sin_iva());
                });
                this.subtotal = subtotal;

                return this.subtotal;
            };

            // Valor I.V.A
            PedidoCliente.prototype.set_valor_iva = function(iva) {
                this.valor_iva = iva;
                return this;
            };

            PedidoCliente.prototype.get_valor_iva = function() {

                var valor_iva = 0;
                this.get_productos().forEach(function(producto) {
                    valor_iva += parseFloat(producto.get_valor_iva());
                });
                this.valor_iva = valor_iva;

                return this.valor_iva;
            };

            // Valor Total
            PedidoCliente.prototype.set_total = function(total) {
                this.total = total;
                return this;
            };

            PedidoCliente.prototype.get_total = function() {

                var total = 0;
                this.get_productos().forEach(function(producto) {
                    total += parseFloat(producto.get_valor_total_con_iva());
                });
                this.total = total;

                return this.total;
            };

            // Tipo Producto
            PedidoCliente.prototype.set_tipo_producto = function(tipo_producto) {
                this.tipo_producto = tipo_producto;
                return this;
            };

            PedidoCliente.prototype.get_tipo_producto = function() {
                return this.tipo_producto;
            };

            // Descripcion Tipo Producto
            PedidoCliente.prototype.set_descripcion_tipo_producto = function(descripcion_tipo_producto) {
                this.descripcion_tipo_producto = descripcion_tipo_producto;
                return this;
            };

            PedidoCliente.prototype.get_descripcion_tipo_producto = function() {
                return this.descripcion_tipo_producto;
            };            
            
            // Observacion Cartera
            PedidoCliente.prototype.set_observacion_cartera = function(observacion) {
                this.observacion_cartera = observacion;
                return this;
            };

            PedidoCliente.prototype.get_observacion_cartera = function() {
                return this.observacion_cartera;
            };
            
            // Aprobado Cartera
            PedidoCliente.prototype.set_aprobado_cartera = function(aprobacion) {
                this.aprobado_cartera = aprobacion;
                return this;
            };

            PedidoCliente.prototype.get_aprobado_cartera = function() {
                return this.aprobado_cartera;
            };
            
            // Descripcion estado actual pedido
            PedidoCliente.prototype.set_descripcion_estado_actual_pedido = function(descripcion_estado) {
                this.descripcion_estado_actual_pedido = descripcion_estado;
                return this;
            };

            PedidoCliente.prototype.get_descripcion_estado_actual_pedido = function() {
                return this.descripcion_estado_actual_pedido;
            };
            
            // Estado cotizacion
            PedidoCliente.prototype.set_estado_cotizacion = function(estado_cotizacion) {
                this.estado_cotizacion = estado_cotizacion;
                return this;
            };

            PedidoCliente.prototype.get_estado_cotizacion = function() {
                return this.estado_cotizacion;
            };
            
            // Descripcion estado cotizacion
            PedidoCliente.prototype.set_descripcion_estado_cotizacion = function(descripcion_estado) {
                this.descripcion_estado_cotizacion = descripcion_estado;
                return this;
            };

            PedidoCliente.prototype.get_descripcion_estado_cotizacion = function() {
                return this.descripcion_estado_cotizacion;
            };
            
            PedidoCliente.prototype.setTieneDespacho = function(tieneDespacho) {
                this.tieneDespacho = tieneDespacho;
                return this;
            };

            PedidoCliente.prototype.getTieneDespacho = function() {
                return this.tieneDespacho;
            };

            PedidoCliente.prototype.setDespachoEmpresaId = function(despachoEmpresaId) {
                this.despachoEmpresaId = despachoEmpresaId;
                return this;
            };

            PedidoCliente.prototype.getDespachoEmpresaId = function() {
                return this.despachoEmpresaId;
            };
            /**/
            PedidoCliente.prototype.setDespachoPrefijo = function(despachoPrefijo) {
                this.despachoPrefijo = despachoPrefijo;
                return this;
            };

            PedidoCliente.prototype.getDespachoPrefijo = function() {
                return this.despachoPrefijo;
            };
            /**/
            PedidoCliente.prototype.setDespachoNumero = function(despachoNumero) {
                this.despachoNumero = despachoNumero;
                return this;
            };

            PedidoCliente.prototype.getDespachoNumero = function() {
                return this.despachoNumero;
            };
            
            
            PedidoCliente.prototype.setTipoPedido = function(tipoPedido) {
                this.tipoPedido = tipoPedido;
                return this;
            };

            PedidoCliente.prototype.getTipoPedido = function() {
                return this.tipoPedido;
            };
            
            
            
            PedidoCliente.prototype.setFacturaFiscal = function(facturaFiscal) {
                this.facturaFiscal = facturaFiscal;
                return this;
            };

            PedidoCliente.prototype.getFacturaFiscal = function() {
                return this.facturaFiscal;
            };
            
            
            
            
            PedidoCliente.prototype.setEstadoFacturaFiscal = function(estadoFacturaFiscal) {
                this.estadoFacturaFiscal = estadoFacturaFiscal;
                return this;
            };

            PedidoCliente.prototype.getEstadoFacturaFiscal = function() {
                return this.estadoFacturaFiscal;
            };
            
            
            
            
             PedidoCliente.prototype.setFiltroEstadoFacturado = function(filtroEstadoFacturado) {
                this.filtroEstadoFacturado = filtroEstadoFacturado;
                return this;
            };

            PedidoCliente.prototype.getFiltroEstadoFacturado = function() {
                return this.filtroEstadoFacturado;
            };
            
            this.get = function(empresa_id, centro_utilidad_id, bodega_id) {
                return new PedidoCliente(empresa_id, centro_utilidad_id, bodega_id);
            };

            return this;
        }]);
});