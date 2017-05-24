
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoDespacho', ["Pedido", function(Pedido) {

            function PedidoDespacho(empresa_id, centro_utilidad_id, bodega_id) {
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
                this.fechaRegistro;
                this.documento = [];
                this.vendedor = [];
                this.seleccionado;
                this.prefijoNumero = "";
                this.documentoSeleccionado = [];
            };

            PedidoDespacho.prototype = Object.create(Pedido.getClass().prototype);
            
            PedidoDespacho.prototype.setPrefijoNumero = function(prefijoNumero) {
                this.prefijoNumero = prefijoNumero;
                return this;
            };
            
            PedidoDespacho.prototype.setFechaRegistro = function(fechaRegistro) {
                this.fechaRegistro = fechaRegistro;
                return this;
            };
            
             PedidoDespacho.prototype.getFechaRegistro = function() {
                return this.fechaRegistro;
            };
            
            
            PedidoDespacho.prototype.setSeleccionado = function(seleccionado) {
                this.seleccionado = seleccionado;
                return this;
            };
            
             PedidoDespacho.prototype.getSeleccionado = function() {
                return this.seleccionado;
            };
            
            //Escribiendo el estado de solicitud del pedido
            PedidoDespacho.prototype.setEstadoSolicitud = function(estadoSolicitud) {
                this.estadoSolicitud = estadoSolicitud;
                return this;
            };
            
            //Obteniendo estado de solicitud del pedido
            PedidoDespacho.prototype.getEstadoSolicitud = function() {
                
                return this.estadoSolicitud;
                
            };
            
            //estado
            PedidoDespacho.prototype.setEstado = function(estado) {
                this.estado = estado;
                return this;
            };
            
            //estado
            PedidoDespacho.prototype.getEstado = function() {
                
                return this.estado;
            };
            // Empresa
            PedidoDespacho.prototype.set_empresa_id = function(empresa_id) {
                this.empresa_id = empresa_id;
                return this;
            };

            PedidoDespacho.prototype.get_empresa_id = function() {
                return this.empresa_id;
            };

            // Centro Utilidad
            PedidoDespacho.prototype.set_centro_utilidad_id = function(centro_utilidad_id) {
                this.centro_utilidad_id = centro_utilidad_id;
                return this;
            };

            PedidoDespacho.prototype.get_centro_utilidad_id = function() {
                return this.centro_utilidad_id;
            };

            // Bodega
            PedidoDespacho.prototype.set_bodega_id = function(bodega_id) {
                this.bodega_id = bodega_id;
                return this;
            };

            PedidoDespacho.prototype.get_bodega_id = function() {
                return this.bodega_id;
            };

            // Numero Cotizacion
            PedidoDespacho.prototype.set_numero_cotizacion = function(numero_cotizacion) {
                this.numero_cotizacion = numero_cotizacion;
                return this;
            };

            PedidoDespacho.prototype.get_numero_cotizacion = function() {
                return this.numero_cotizacion;
            };

            // Vendedor
            PedidoDespacho.prototype.set_vendedor = function(vendedor) {
                this.vendedor = vendedor;
                return this;
            };

            PedidoDespacho.prototype.get_vendedor = function() {
                return this.vendedor;
            };

            // Observacion
            PedidoDespacho.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
                return this;
            };

            PedidoDespacho.prototype.get_observacion = function() {
                return this.observacion;
            };

            // Productos
            PedidoDespacho.prototype.set_productos = function(producto) {
                this.productos.push(producto);
                return this;
            };

            PedidoDespacho.prototype.get_productos = function() {
                return this.productos;
            };

            PedidoDespacho.prototype.limpiar_productos = function() {
                this.productos = [];
            };

            // Subotal
            PedidoDespacho.prototype.set_subtotal = function(subtotal) {
                this.subtotal = subtotal;
                return this;
            };

            PedidoDespacho.prototype.get_subtotal = function() {

                var subtotal = 0;
                this.get_productos().forEach(function(producto) {
                    subtotal += parseFloat(producto.get_valor_total_sin_iva());
                });
                this.subtotal = subtotal;

                return this.subtotal;
            };

            // Valor I.V.A
            PedidoDespacho.prototype.set_valor_iva = function(iva) {
                this.valor_iva = iva;
                return this;
            };

            PedidoDespacho.prototype.get_valor_iva = function() {

                var valor_iva = 0;
                this.get_productos().forEach(function(producto) {
                    valor_iva += parseFloat(producto.get_valor_iva());
                });
                this.valor_iva = valor_iva;

                return this.valor_iva;
            };

            // Valor Total
            PedidoDespacho.prototype.set_total = function(total) {
                this.total = total;
                return this;
            };

            PedidoDespacho.prototype.get_total = function() {

                var total = 0;
                this.get_productos().forEach(function(producto) {
                    total += parseFloat(producto.get_valor_total_con_iva());
                });
                this.total = total;

                return this.total;
            };

            // Tipo Producto
            PedidoDespacho.prototype.set_tipo_producto = function(tipo_producto) {
                this.tipo_producto = tipo_producto;
                return this;
            };

            PedidoDespacho.prototype.get_tipo_producto = function() {
                return this.tipo_producto;
            };

            // Descripcion Tipo Producto
            PedidoDespacho.prototype.set_descripcion_tipo_producto = function(descripcion_tipo_producto) {
                this.descripcion_tipo_producto = descripcion_tipo_producto;
                return this;
            };

            PedidoDespacho.prototype.get_descripcion_tipo_producto = function() {
                return this.descripcion_tipo_producto;
            };            
            
            // Observacion Cartera
            PedidoDespacho.prototype.set_observacion_cartera = function(observacion) {
                this.observacion_cartera = observacion;
                return this;
            };

            PedidoDespacho.prototype.get_observacion_cartera = function() {
                return this.observacion_cartera;
            };
            
            // Aprobado Cartera
            PedidoDespacho.prototype.set_aprobado_cartera = function(aprobacion) {
                this.aprobado_cartera = aprobacion;
                return this;
            };

            PedidoDespacho.prototype.get_aprobado_cartera = function() {
                return this.aprobado_cartera;
            };
            
            // Descripcion estado actual pedido
            PedidoDespacho.prototype.set_descripcion_estado_actual_pedido = function(descripcion_estado) {
                this.descripcion_estado_actual_pedido = descripcion_estado;
                return this;
            };
            
            PedidoDespacho.prototype.get_descripcion_estado_actual_pedido = function() {
                return this.descripcion_estado_actual_pedido;
            };
            
            // Estado cotizacion
            PedidoDespacho.prototype.set_estado_cotizacion = function(estado_cotizacion) {
                this.estado_cotizacion = estado_cotizacion;
                return this;
            };

            PedidoDespacho.prototype.get_estado_cotizacion = function() {
                return this.estado_cotizacion;
            };
            
            // Descripcion estado cotizacion
            PedidoDespacho.prototype.set_descripcion_estado_cotizacion = function(descripcion_estado) {
                this.descripcion_estado_cotizacion = descripcion_estado;
                return this;
            };

            PedidoDespacho.prototype.get_descripcion_estado_cotizacion = function() {
                return this.descripcion_estado_cotizacion;
            };
            
            PedidoDespacho.prototype.setTieneDespacho = function(tieneDespacho) {
                this.tieneDespacho = tieneDespacho;
                return this;
            };

            PedidoDespacho.prototype.getTieneDespacho = function() {
                return this.tieneDespacho;
            };

            PedidoDespacho.prototype.setDespachoEmpresaId = function(despachoEmpresaId) {
                this.despachoEmpresaId = despachoEmpresaId;
                return this;
            };

            PedidoDespacho.prototype.getDespachoEmpresaId = function() {
                return this.despachoEmpresaId;
            };
            /**/
            PedidoDespacho.prototype.setDespachoPrefijo = function(despachoPrefijo) {
                this.despachoPrefijo = despachoPrefijo;
                return this;
            };

            PedidoDespacho.prototype.getDespachoPrefijo = function() {
                return this.despachoPrefijo;
            };
            /**/
            PedidoDespacho.prototype.setDespachoNumero = function(despachoNumero) {
                this.despachoNumero = despachoNumero;
                return this;
            };

            PedidoDespacho.prototype.getDespachoNumero = function() {
                return this.despachoNumero;
            };
            
            
            PedidoDespacho.prototype.setTipoPedido = function(tipoPedido) {
                this.tipoPedido = tipoPedido;
                return this;
            };

            PedidoDespacho.prototype.getTipoPedido = function() {
                return this.tipoPedido;
            };
            
            
            
            PedidoDespacho.prototype.setFacturaFiscal = function(facturaFiscal) {
                this.facturaFiscal = facturaFiscal;
                return this;
            };

            PedidoDespacho.prototype.getFacturaFiscal = function() {
                return this.facturaFiscal;
            };
            
            
            
            
            PedidoDespacho.prototype.setEstadoFacturaFiscal = function(estadoFacturaFiscal) {
                this.estadoFacturaFiscal = estadoFacturaFiscal;
                return this;
            };

            PedidoDespacho.prototype.getEstadoFacturaFiscal = function() {
                return this.estadoFacturaFiscal;
            };
            
            
            
            
            PedidoDespacho.prototype.setFiltroEstadoFacturado = function(filtroEstadoFacturado) {
                this.filtroEstadoFacturado = filtroEstadoFacturado;
                return this;
            };

            PedidoDespacho.prototype.getFiltroEstadoFacturado = function() {
                return this.filtroEstadoFacturado;
            };
            
            
            PedidoDespacho.prototype.getPrefijoNumero = function() {
                return this.prefijoNumero;
               
            };
            
            this.get = function(empresa_id, centro_utilidad_id, bodega_id) {
                return new PedidoDespacho(empresa_id, centro_utilidad_id, bodega_id);
            };
            
            
            PedidoDespacho.prototype.agregarDocumentos = function (documento) {
                this.documento.push(documento);
            };

            PedidoDespacho.prototype.vaciarDocumentos = function () {
                this.documento = [];
            }

            PedidoDespacho.prototype.mostrarFacturas = function () {
                return this.documento;
            };
            
            
            PedidoDespacho.prototype.agregarDocumentosSeleccionados = function (documentoSeleccionado) {                
                this.documentoSeleccionado.push(documentoSeleccionado);               
            };

            PedidoDespacho.prototype.vaciarDocumentosSeleccionados = function () {
                this.documentoSeleccionado = [];
            };

            PedidoDespacho.prototype.mostrarDocumentosSeleccionados = function () {
                return this.documentoSeleccionado;
            };
            
            PedidoDespacho.prototype.agregarVendedor = function (vendedor) {
                this.vendedor.push(vendedor);
            };

            PedidoDespacho.prototype.vaciarVendedor = function () {
                this.vendedor = [];
            }

            PedidoDespacho.prototype.mostrarVendedor = function () {
                return this.vendedor;
            };


            return this;
        }]);
});