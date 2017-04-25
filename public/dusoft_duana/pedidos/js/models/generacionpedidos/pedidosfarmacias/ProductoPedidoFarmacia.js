
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoPedidoFarmacia', ["Producto", function(Producto) {

        function ProductoPedidoFarmacia(codigo, nombre, existencia) {
            Producto.getClass().call(this,codigo,nombre, existencia);
            
            this.swVende = false;
            this.grupoContratacionId = 0;
            this.nivelAutorizacionId = 0;
            this.grupoId = 0;
            this.subclaseId = 0;
            this.porcIva = 0;
            this.tipoProductoId = 0;
            this.existenciasFarmacia = 0;
            this.totalExistenciasFarmacias = 0;
            this.disponibilidadBodega = 0;
            this.cantidadSolicitada = 0;
            this.estado;
            this.enFarmaciaSeleccionada = false;
            this.cantidadPendiente = 0;
            this.cantidadIngresada = 0;
            this.nombreBodega = "";
            this.empresaOrigenProducto = "";
            this.centroUtilidadOrigenProducto = "";
            this.bodegaOrigenProducto = "";
            this.mensajeError = "";
        }

        ProductoPedidoFarmacia.prototype = Object.create(Producto.getClass().prototype);
        
        ProductoPedidoFarmacia.prototype.setSwVende = function(swVende) {
            this.swVende = swVende;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getSwVende = function() {
            return this.swVende;
        };
        
        ProductoPedidoFarmacia.prototype.setGrupoContratacionId = function(grupoContratacionId) {
            this.grupoContratacionId = grupoContratacionId;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getGrupoContratacionId = function() {
            return this.grupoContratacionId;
        };

        ProductoPedidoFarmacia.prototype.setNivelAutorizacionId = function(nivelAutorizacionId) {
            this.nivelAutorizacionId = nivelAutorizacionId;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getNivelAutorizacionId = function() {
            return this.nivelAutorizacionId;
        };
        
        ProductoPedidoFarmacia.prototype.setGrupoId = function(grupoId) {
            this.grupoId = grupoId;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getGrupoId = function() {
            return this.grupoId;
        };
        
        ProductoPedidoFarmacia.prototype.setSubclaseId = function(subclaseId) {
            this.subclaseId = subclaseId;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getSubclaseId = function() {
            return this.subclaseId;
        };
        
        ProductoPedidoFarmacia.prototype.setPorcIva = function(porcIva) {
            this.porcIva = porcIva;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getPorcIva = function() {
            return this.porcIva;
        };
        
        ProductoPedidoFarmacia.prototype.setTipoProductoId = function(tipoProductoId) {
            this.tipoProductoId = tipoProductoId;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getTipoProductoId = function() {
            return this.tipoProductoId;
        };
        
        ProductoPedidoFarmacia.prototype.setExistenciasFarmacia = function(existenciasFarmacia) {
            this.existenciasFarmacia = existenciasFarmacia;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getExistenciasFarmacia = function() {
            return this.existenciasFarmacia;
        };
        
        ProductoPedidoFarmacia.prototype.setTotalExistenciasFarmacias = function(totalExistenciasFarmacias) {
            this.totalExistenciasFarmacias = totalExistenciasFarmacias;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getTotalExistenciasFarmacias = function() {
            return this.totalExistenciasFarmacias;
        };
        
        ProductoPedidoFarmacia.prototype.setDisponibilidadBodega = function(disponibilidadBodega) {
            this.disponibilidadBodega = disponibilidadBodega;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getDisponibilidadBodega = function() {
            return this.disponibilidadBodega;
        };
        
        ProductoPedidoFarmacia.prototype.setCantidadSolicitada = function(cantidadSolicitada) {
            this.cantidadSolicitada = cantidadSolicitada;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getCantidadSolicitada = function() {
            return parseInt(this.cantidadSolicitada);
        };
        
        ProductoPedidoFarmacia.prototype.setCantidadPendiente = function(cantidadPendiente) {
            this.cantidadPendiente = cantidadPendiente;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getCantidadPendiente = function() {
            return this.cantidadPendiente;
        };
        
        ProductoPedidoFarmacia.prototype.setCantidadIngresada = function(cantidadIngresada) {
            this.cantidadIngresada = parseInt(cantidadIngresada);
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getCantidadIngresada = function() {
            return this.cantidadIngresada;
        };
        
        ProductoPedidoFarmacia.prototype.setEstado = function(estado) {
            this.estado = estado;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getEstado = function() {
            return this.estado;
        };
        
        
        ProductoPedidoFarmacia.prototype.setMensajeError = function(mensajeError) {
            this.mensajeError = mensajeError;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getMensajeError = function() {
            return this.mensajeError;
        };
        
        ProductoPedidoFarmacia.prototype.setEnFarmaciaSeleccionada = function(enFarmaciaSeleccionada) {
            this.enFarmaciaSeleccionada = Boolean(Number(enFarmaciaSeleccionada));
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getEnFarmaciaSeleccionada = function() {
            return this.enFarmaciaSeleccionada;
        };
        
        ProductoPedidoFarmacia.prototype.setNombreBodega = function(nombreBodega) {
            this.nombreBodega = nombreBodega;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getNombreBodega = function() {
            return this.nombreBodega;
        };
        //
        ProductoPedidoFarmacia.prototype.setEmpresaOrigenProducto = function(empresaOrigenProducto) {
            this.empresaOrigenProducto = empresaOrigenProducto;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getEmpresaOrigenProducto = function() {
            return this.empresaOrigenProducto;
        };
        ///
       ProductoPedidoFarmacia.prototype.setCentroUtilidadOrigenProducto = function(centroUtilidadOrigenProducto) {
            this.centroUtilidadOrigenProducto = centroUtilidadOrigenProducto;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getCentroUtilidadOrigenProducto = function() {
            return this.centroUtilidadOrigenProducto;
        };
        //
        ProductoPedidoFarmacia.prototype.setBodegaOrigenProducto = function(bodegaOrigenProducto) {
            this.bodegaOrigenProducto = bodegaOrigenProducto;
            return this;
        };
        
        ProductoPedidoFarmacia.prototype.getBodegaOrigenProducto = function() {
            return this.bodegaOrigenProducto;
        };
        
        this.get = function(codigo, nombre, existencia) {
            
            return new ProductoPedidoFarmacia(codigo, nombre, existencia);
        };

        return this;
    }]);
});