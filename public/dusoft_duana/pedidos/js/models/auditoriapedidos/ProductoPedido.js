
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoPedido', ["Producto", function(Producto) {

        function ProductoPedido(codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible, molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia, existencia_disponible, cantidad_pendiente) {
            Producto.getClass().call(this,codigo,nombre, existencia);
            this.precio = precio || 0;
            this.cantidad_solicitada = cantidad_solicitada || 0;
            this.cantidad_separada = cantidad_ingresada || 0;
            this.observacion = observacion_cambio || "";
            this.disponible = disponible || 0;
            this.molecula = molecula || "";
            this.existencia_farmacia = existencia_farmacia || "";
            this.tipo_producto_id = tipo_producto_id || "";
            this.total_existencias_farmacia = total_existencias_farmacia || "";
            this.existencia_disponible = existencia_disponible || "";
            this.cantidad_pendiente = cantidad_pendiente || "";
            
            //Campos exclusivos pedido clientes
            this.codigo_cum = "";
            this.codigo_invima = "";
            this.codigo_barra = "";
            this.vencimiento_codigo_invima = "";
            this.iva = 0;
            this.precio_regulado = 0;
            this.precio_venta_anterior = 0;
            this.costo_ultima_compra = 0;
            this.total_sin_iva = 0;
            this.total_con_iva = 0;
            this.estado = 0;
            this.es_regulado = 0;
            this.tiene_precio_contrato = false;
            this.en_farmacia_seleccionada = true;
            
            //propiedades pendientes
            this.existencia_lotes = "";
            this.porcentaje_gravament = "0";
            this.cantidad_despachada = 0;
            this.cantidad_solicitada_real = 0;
            
            //Objeto Lote
            this.lote = {};
            this.lotesSeleccionados = [];

            this.valorUnitario = 0;
            this.justificacion = "";
            this.valorIva = 0;
            this.valorUnitarioConIva = 0;
            this.itemId = 0;

            this.descripcionEstado = "";

            this.numeroCaja = 0;
            this.codigo = codigo;
            this.descripcion = nombre;
            this.tipo;
            this.tipoCajaId;
            this.pedido;
            this.descripcionAutorizacion = "";
            
        }

        ProductoPedido.prototype = Object.create(Producto.getClass().prototype);
        
        ProductoPedido.prototype.setPedido = function (tipo) {
             this.tipo = tipo;
        };

        ProductoPedido.prototype.getPedido = function () {
            return this.pedido;
        };
        
        ProductoPedido.prototype.setTipo = function (tipo) {
             this.tipo = tipo;
        };

        ProductoPedido.prototype.getTipo = function () {
            return this.tipo;
        };
        
        ProductoPedido.prototype.setTipoCajaId = function (tipoCajaId) {
             this.tipoCajaId = tipoCajaId;
        };

        ProductoPedido.prototype.getTipoCajaId = function () {
            return this.tipoCajaId;
        };
        
        
        
        ProductoPedido.prototype.setLote = function(lote) {
            this.lote = lote;
        };
        
        ProductoPedido.prototype.getLote = function() {
            return this.lote;
        };
        
        ProductoPedido.prototype.getCantidadSeparada = function() {
            return this.cantidad_separada;
        };
        
      
        
        ProductoPedido.prototype.getDescripcionProducto = function() {
            return this.descripcion;
        };
        
        ProductoPedido.prototype.getCodigoProducto = function() {
            return this.codigo;
        };
        
        ProductoPedido.prototype.setCantidadSolicitada = function(cantidad_solicitada) {
            this.cantidad_solicitada = cantidad_solicitada;
            return this;
        };
        
        ProductoPedido.prototype.getCantidadSolicitada = function() {
            return this.cantidad_solicitada;
        };        

        ProductoPedido.prototype.setItemId = function(itemId) {
            this.itemId = itemId;
            return this;
        };
        
        ProductoPedido.prototype.getItemId = function() {
            return this.itemId;
        };
        
        
        ProductoPedido.prototype.setDisponible = function(disponible) {
            this.disponible = disponible;
            return this;
        };
        
        ProductoPedido.prototype.getDisponible = function() {
            return this.disponible;
        };   
        
        
        ProductoPedido.prototype.setCantidadPendiente = function(cantidad_pendiente) {
            this.cantidad_pendiente = cantidad_pendiente;
            return this;
        };
        
        ProductoPedido.prototype.getCantidadPendiente = function() {
            return this.cantidad_pendiente;
        };      
        
        ProductoPedido.prototype.setValorUnitario = function(valorUnitario) {
            this.valorUnitario = valorUnitario;
            return this;
        };
        
        ProductoPedido.prototype.getValorUnitario = function() {
            return this.valorUnitario;
        };  
        

        ProductoPedido.prototype.setPorcentajeGravament = function(porcentaje_gravament) {
            this.porcentaje_gravament = porcentaje_gravament;
            return this;
        };
        
        ProductoPedido.prototype.getPorcentajeGravament = function() {
            return this.porcentaje_gravament;
        }; 
        

        ProductoPedido.prototype.setCodigoCum = function(codigo_cum) {
            this.codigo_cum = codigo_cum;
        };
        
        ProductoPedido.prototype.getCodigoCum = function() {
            return this.codigo_cum;
        };
        
        ProductoPedido.prototype.setCodigoInvima = function(codigo_invima) {
            this.codigo_invima = codigo_invima;
        };
        
        ProductoPedido.prototype.getCodigoInvima = function() {
            return this.codigo_invima;
        };
        
        //this.vencimiento_codigo_invima
        ProductoPedido.prototype.setVencimientoCodigoInvima = function(vencimiento_codigo_invima) {
            this.vencimiento_codigo_invima = vencimiento_codigo_invima;
        };
        
        ProductoPedido.prototype.setCodigoBarras = function(codigo_barra) {
           this.codigo_barra = codigo_barra;
        };
        
        ProductoPedido.prototype.getCodigoBarras = function() {
          return this.codigo_barra;
        };
        
        ProductoPedido.prototype.getVencimientoCodigoInvima = function() {
            return this.vencimiento_codigo_invima;
        };
        
        ProductoPedido.prototype.setIva = function(iva) {
            this.iva = iva;
        };
        
        ProductoPedido.prototype.getIva = function() {
            return this.iva;
        };
        
        ProductoPedido.prototype.setPrecioRegulado = function(precio_regulado) {
            this.precio_regulado = precio_regulado;
        };
        
        ProductoPedido.prototype.getPrecioRegulado = function() {
            return this.precio_regulado;
        };
        
        ProductoPedido.prototype.setPrecioVentaAnterior = function(precio_venta_anterior) {
            this.precio_venta_anterior = precio_venta_anterior;
        };
        
        ProductoPedido.prototype.getPrecioVentaAnterior = function() {
            return this.precio_venta_anterior;
        };
        
        ProductoPedido.prototype.setCostoUltimaCompra = function(costo_ultima_compra) {
            this.costo_ultima_compra = costo_ultima_compra;
        };
        
        ProductoPedido.prototype.getCostoUltimaCompra = function() {
            return this.costo_ultima_compra;
        };
        
        ProductoPedido.prototype.setTotalSinIva = function() {
            this.total_sin_iva = parseFloat(this.precio) * parseInt(this.cantidad_solicitada);
            this.total_sin_iva = this.total_sin_iva.toFixed(2);
        };
        ProductoPedido.prototype.getTotalSinIva = function() {
            return this.total_sin_iva;
        };
        
        ProductoPedido.prototype.setTotalConIva = function() {
            this.total_con_iva = (parseFloat(this.precio) + ((parseFloat(this.precio)*parseFloat(this.iva))/100)) * parseInt(this.cantidad_solicitada);            
            this.total_con_iva = this.total_con_iva.toFixed(2);
        };
        
        
        
        ProductoPedido.prototype.getTotalConIva = function() {
            return this.total_con_iva;
        };
        
        ProductoPedido.prototype.setEstado = function(estado) {
            this.estado = estado;
        };
        
        ProductoPedido.prototype.getEstado = function() {
            return this.estado;
        };
        
        ProductoPedido.prototype.setDescripcionEstado = function(descripcionEstado) {
            this.descripcionEstado = descripcionEstado;
        };
        
        ProductoPedido.prototype.getDescripcionEstado = function() {
            return this.descripcionEstado;
        };
        
        
        ProductoPedido.prototype.setEsRegulado = function(valor) {
            this.es_regulado = valor; // 0: No es regulado, 1: Es regulado
        };
        
        ProductoPedido.prototype.getEsRegulado = function() {
            return this.es_regulado;
        };        
        
        ProductoPedido.prototype.setTienePrecioContrato = function(valor) {
            this.tiene_precio_contrato = valor;
        };
        
        ProductoPedido.prototype.getTienePrecioContrato = function() {
            return this.tiene_precio_contrato;
        };  
        
        ProductoPedido.prototype.setEnFarmaciaSeleccionada = function(valor) {
            this.en_farmacia_seleccionada = valor;
        };
        
        ProductoPedido.prototype.getEnFarmaciaSeleccionada = function() {
            return this.en_farmacia_seleccionada;
        };  
        
        ProductoPedido.prototype.agregarLote = function(lote) {
            this.lotesSeleccionados.push(lote);
        };
        
        ProductoPedido.prototype.vaciarLotes = function() {
            this.lotesSeleccionados = [];
        };
        
        ProductoPedido.prototype.getLotesSeleccionados = function() {
            return this.lotesSeleccionados;
        };
        
        ProductoPedido.prototype.setJustificacion = function(justificacion) {
            this.justificacion = justificacion;
        };  
        
        ProductoPedido.prototype.getJustificacion = function() {
            return this.justificacion;
        };

        ProductoPedido.prototype.setValorIva = function(valorIva) {
            this.valorIva = valorIva;
        };  
        
        ProductoPedido.prototype.getValorIva = function() {
            return this.valorIva;
        };
        
        ProductoPedido.prototype.setValorUnitarioConIva = function(valorUnitarioConIva) {
            this.valorUnitarioConIva = valorUnitarioConIva;
        };  
        
        ProductoPedido.prototype.getValorUnitarioConIva = function() {
            return this.valorUnitarioConIva;
        };
             
        
        
        /**
         * +Descripcion Numero caja this.numeroCaja
         * @returns {Number}
         */
        ProductoPedido.prototype.setNumeroCaja = function(numeroCaja) {
           
            this.numeroCaja = numeroCaja === null?0: numeroCaja;
            
        };  
        
        ProductoPedido.prototype.getNumeroCaja = function() {
            return this.numeroCaja;
        };
        
        ProductoPedido.prototype.setDescripcionAutorizacion = function(descripcionAutorizacion) {
            this.descripcionAutorizacion = descripcionAutorizacion;
        };  
        
        ProductoPedido.prototype.getDescripcionAutorizacion = function() {
            return this.descripcionAutorizacion;
        };
        
        ProductoPedido.prototype.obtenerCantidadSeleccionada = function() {
            var cantidad = 0;
            for(var i in this.lotesSeleccionados){
                var lote = this.lotesSeleccionados[i];
                if(lote.seleccionado){
                      cantidad += parseInt(this.lotesSeleccionados[i].cantidad_ingresada);
                }
            }
            
            return cantidad;
        };
        
        ProductoPedido.prototype.obtenerCantidadSeleccionadaPorLote = function(codigo_lote) {
            var cantidad = 0;
            for(var i in this.lotesSeleccionados){
                var lote = this.lotesSeleccionados[i];
                if(lote.seleccionado && lote.codigo_lote === codigo_lote){
                      cantidad += parseInt(this.lotesSeleccionados[i].cantidad_ingresada);
                }
            }
            
            return cantidad;
        };
        
        ProductoPedido.prototype.obtenerCantidadPendientePorLote = function(codigo_lote) {
            var cantidad = 0;
            for(var i in this.lotesSeleccionados){
                var lote = this.lotesSeleccionados[i];
                if(lote.seleccionado && lote.codigo_lote === codigo_lote){
                      cantidad += parseInt(this.lotesSeleccionados[i].cantidad_pendiente);
                }
            }
            
            return cantidad;
        };

        this.get = function(codigo, nombre, existencia, precio,
                                cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible,
                                molecula, existencia_farmacia, tipo_producto_id,
                                total_existencias_farmacia, existencia_disponible, cantidad_pendiente
                           ) {
            
            return new ProductoPedido(codigo, nombre, existencia, precio,
                                        cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible,
                                        molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia,
                                        existencia_disponible, cantidad_pendiente
                                     );
        };

        return this;
    }]);
});