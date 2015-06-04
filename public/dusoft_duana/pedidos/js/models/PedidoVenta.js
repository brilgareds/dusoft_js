
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoVenta', ["Pedido", function(Pedido) {
            
        //constants
        this.TIPO_CLIENTE  = 1;
        this.TIPO_FARMACIA = 2; 
       
        
        function PedidoVenta() {
            Pedido.getClass().call(this);
            this.numero_cotizacion = "";
            this.valor_cotizacion = 0;
            this.valor_pedido = 0;
            this.lista_productos = [];
            this.tipo = 1;
            this.observacion = "";
            this.editable = true;
            this.encabezado_bloqueado = false;
            //Variable para permitir adicionar o cambiar Productos y modificar farmacia destino depués de generado el pedido
            this.modificacion_especial = false;
            this.vendedor = {};
            this.observacion_cartera = "";
            this.valor_total_sin_iva = 0;
            this.valor_total_con_iva = 0;
            
            this.despacho_empresa_id = "";
            this.despacho_prefijo = "";
            this.despacho_numero = "";
            this.tiene_despacho = false;
        };

        PedidoVenta.prototype = Object.create(Pedido.getClass().prototype);

//        PedidoVenta.prototype.setDatos = function(datos) {
//            
//            //Pedido.getClass().call(this, numero_pedido, nombre_vandedor, fecha_registro, descripcion_estado, descripcion_estado_actual_pedido, estado_actual_pedido, estado);
//            this.numero_cotizacion = datos.numero_cotizacion;
//            this.valor_cotizacion = datos.valor_cotizacion;
//        };
        
//        PedidoVenta.prototype.agregarProducto = function(producto) {
//            this.lista_productos.push(producto);
//        };

        PedidoVenta.prototype.setNumeroCotizacion = function(numero_cotizacion) {
            this.numero_cotizacion = numero_cotizacion;
        };
        
        PedidoVenta.prototype.getNumeroCotizacion = function() {
            return this.numero_cotizacion;
        };
        
        PedidoVenta.prototype.setValorCotizacion = function(valor_cotizacion) {
            this.valor_cotizacion = valor_cotizacion;
        };
        
        PedidoVenta.prototype.getValorCotizacion = function() {
            return this.valor_cotizacion;
        };
        
        PedidoVenta.prototype.setValorPedido = function(valor_pedido) {
            this.valor_pedido = valor_pedido;
        };
        
        PedidoVenta.prototype.getValorPedido = function() {
            return this.valor_pedido;
        }; 

        PedidoVenta.prototype.agregarProducto = function(producto) {
            this.lista_productos.unshift(producto);
        };

        PedidoVenta.prototype.obtenerProductos = function() {
            return this.lista_productos;
        };
        
        PedidoVenta.prototype.eliminarProducto = function(index) {
            return this.lista_productos.splice(index,1);
        };
        
        PedidoVenta.prototype.vaciarProductos = function() {
            this.lista_productos = [];
        };
        
        PedidoVenta.prototype.setTipo = function(tipo) {
            this.tipo = tipo;
        };
        
        PedidoVenta.prototype.getTipo = function() {
            return this.tipo;
        };
        
        PedidoVenta.prototype.setObservacion = function(observacion) {
            this.observacion = observacion;
        };
        
        PedidoVenta.prototype.getObservacion = function() {
            return this.observacion;
        };
        
        PedidoVenta.prototype.setEditable = function(valor_booleano) {
            this.editable = valor_booleano;
        };
        
        PedidoVenta.prototype.getEditable = function() {
            return this.editable;
        };
        
        PedidoVenta.prototype.setEncabezadoBloqueado = function(valor_booleano) {
            this.encabezado_bloqueado = valor_booleano;
        };
        
        PedidoVenta.prototype.getEncabezadoBloqueado = function() {
            return this.encabezado_bloqueado;
        };
        
        PedidoVenta.prototype.setModificacionEspecial = function(valor_booleano) {
            this.modificacion_especial = valor_booleano;
        };
        
        PedidoVenta.prototype.getModificacionEspecial = function() {
            return this.modificacion_especial;
        };

        PedidoVenta.prototype.setVendedor = function(vendedor) {
            this.vendedor = vendedor;
        };
        
        PedidoVenta.prototype.getVendedor = function() {
            return this.vendedor;
        };
        
        //this.observacion_cartera
        PedidoVenta.prototype.setObservacionCartera = function(observacion_cartera) {
            this.observacion_cartera = observacion_cartera;
        };
        
        PedidoVenta.prototype.getObservacionCartera = function() {
            return this.observacion_cartera;
        };
        
        PedidoVenta.prototype.setDespachoEmpresaId = function(despacho_empresa_id) {
            this.despacho_empresa_id = despacho_empresa_id;
        };
        
        PedidoVenta.prototype.getDespachoEmpresaId = function() {
            return this.despacho_empresa_id;
        };
        /**/
        PedidoVenta.prototype.setDespachoPrefijo = function(despacho_prefijo) {
            this.despacho_prefijo = despacho_prefijo;
        };
        
        PedidoVenta.prototype.getDespachoPrefijo = function() {
            return this.despacho_prefijo;
        };
        /**/
        PedidoVenta.prototype.setDespachoNumero = function(despacho_numero) {
            this.despacho_numero = despacho_numero;
        };
        
        PedidoVenta.prototype.getDespachoNumero = function() {
            return this.despacho_numero;
        };
        /**/
        
        //this.tiene_despacho
        
        PedidoVenta.prototype.setTieneDespacho = function(tiene_despacho) {
            this.tiene_despacho = tiene_despacho;
        };
        
        PedidoVenta.prototype.getTieneDespacho = function() {
            return this.tiene_despacho;
        };
        

        this.get = function() {
            return new PedidoVenta();
        };
        
        this.pedidoseleccionado = ""; //Tenerlo en cuenta para no usar rootScope y pasar valor de una vista a otra
        
        return this;
    }]);
});