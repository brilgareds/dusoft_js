
define(["angular", "js/models"], function(angular, models) {

    models.factory('Producto', function() {

        function Producto(codigo_producto, descripcion, existencia) {
            this.codigo_producto = codigo_producto || "";
            this.descripcion = descripcion || "";
            this.existencia = existencia || 0;
            this.costoAnterior = 0;
            this.costo = 0;
            this.costoPenultimaCompra = 0;
            this.costoUltimaCompra = 0;
            this.precioVenta = 0;
            this.precioVentaAnterior = 0;
            this.precioMinimo = 0;
            this.precioMaximo = 0;
            this.contrato;
            this.estado;
            this.responsable = "";
            this.descripcionAccion = "";
            this.cantidadSolicitada = 0;
            this.cantidadActual = 0;
            this.fechaModificacion = "";
            this.codigoFormaFarmacologico = "";
            this.concentracion = 0;
            this.molecula = "";
            this.laboratorio = "";
        }
        
        
        Producto.prototype.setLaboratorio = function(laboratorio) {
            this.laboratorio = laboratorio;
        };

        Producto.prototype.getLaboratorio = function() {
            return this.laboratorio;
        };
        
        
        Producto.prototype.setMolecula = function(molecula) {
            this.molecula = molecula;
        };

        Producto.prototype.getMolecula = function() {
            return this.molecula;
        };
        
        Producto.prototype.setConcentracion = function(concentracion) {
            this.concentracion = concentracion;
        };

        Producto.prototype.getConcentracion = function() {
            return this.concentracion;
        };
        
        Producto.prototype.setCodigoFormaFarmacologico = function(codigoFormaFarmacologico) {
            this.codigoFormaFarmacologico = codigoFormaFarmacologico;
        };

        Producto.prototype.getCodigoFormaFarmacologico = function() {
            return this.codigoFormaFarmacologico;
        };
        
        
        Producto.prototype.setCodigoProducto = function(codigo) {
            this.codigo_producto = codigo;
        };

        Producto.prototype.getCodigoProducto = function() {
            return this.codigo_producto;
        };
        
        Producto.prototype.setEstado = function(estado) {
            this.estado = estado;
        };

        Producto.prototype.getEstado = function() {
            return this.estado;
        };
        
        Producto.prototype.setDescripcion = function(descripcion) {
            this.descripcion = descripcion;
        };

        Producto.prototype.getDescripcion = function() {
            return this.descripcion;
        };
        
         Producto.prototype.getExistencia = function() {
            return this.existencia;
        };

        Producto.prototype.setExistencia = function(existencia) {
            this.existencia = existencia;
        };
        
        Producto.prototype.setCosto= function(costo) {
            this.costo = costo;
            return this;
        };
        
        Producto.prototype.getCosto = function() {
            return this.costo;
        };
        
        Producto.prototype.setCostoAnterior = function(costoAnterior) {
            this.costoAnterior = costoAnterior;
            return this;
        };
        
        Producto.prototype.getCostoAnterior = function() {
            return this.costoAnterior;
        };
        
        
        Producto.prototype.setCostoPenultimaCompra= function(costoPenultimaCompra) {
            this.costoPenultimaCompra = costoPenultimaCompra;
            return this;
        };
        
        Producto.prototype.getCostoPenultimaCompra = function() {
            return this.costoPenultimaCompra;
        };
        
        Producto.prototype.setCostoUltimaCompra= function(costoUltimaCompra) {
            this.costoUltimaCompra = costoUltimaCompra;
            return this;
        };
        
        Producto.prototype.getCostoUltimaCompra = function() {
            return this.costoUltimaCompra;
        };
        
        
        Producto.prototype.setPrecioVenta= function(precioVenta) {
            this.precioVenta = precioVenta;
            return this;
        };
        
        Producto.prototype.getPrecioVenta = function() {
            return this.precioVenta;
        };
        
        Producto.prototype.setPrecioVentaAnterior = function(precioVentaAnterior) {
            this.precioVentaAnterior = precioVentaAnterior;
            return this;
        };
        
        Producto.prototype.getPrecioVentaAnterior = function() {
            return this.precioVentaAnterior;
        };
        
        
        Producto.prototype.setPrecioMinimo= function(precioMinimo) {
            this.precioMinimo = precioMinimo;
            return this;
        };
        
        Producto.prototype.getPrecioMinimo = function() {
            return this.precioMinimo;
        };
        
        Producto.prototype.setPrecioMaximo= function(precioMaximo) {
            this.precioMaximo = precioMaximo;
            return this;
        };
        
        Producto.prototype.getPrecioMaximo = function() {
            return this.precioMaximo;
        };
        
        
        Producto.prototype.setResponsable= function(responsable) {
            this.responsable = responsable;
            return this;
        };
        
        Producto.prototype.getResponsable = function() {
            return this.responsable;
        };
        
        Producto.prototype.setDescripcionAccion= function(descripcionAccion) {
            this.descripcionAccion = descripcionAccion;
            return this;
        };
        
        Producto.prototype.getDescripcionAccion = function() {
            return this.descripcionAccion;
        };

        Producto.prototype.setCantidadSolicitada= function(cantidadSolicitada) {
            this.cantidadSolicitada = cantidadSolicitada;
            return this;
        };
        
        Producto.prototype.getCantidadSolicitada = function() {
            return this.cantidadSolicitada;
        };
        
        
        Producto.prototype.setCantidadActual= function(cantidadActual) {
            this.cantidadActual = cantidadActual;
            return this;
        };
        
        Producto.prototype.getCantidadActual = function() {
            return this.cantidadActual;
        };
        
        Producto.prototype.setFechaModificacion= function(fechaModificacion) {
            this.fechaModificacion = fechaModificacion;
            return this;
        };
        
        Producto.prototype.getFechaModificacion = function() {
            return this.fechaModificacion;
        };
        
        Producto.prototype.setContrato= function(contrato) {
            this.contrato = contrato;
            return this;
        };
        
        Producto.prototype.getContrato = function() {
            return this.contrato;
        };
        
        this.get = function(codigo_producto, descripcion, existencia) {
            return new Producto(codigo_producto, descripcion, existencia);
        };
        
        this.getClass = function() {
            return Producto;
        };

        return this;
    });
});
