
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory("Factura",[function() {


            function Factura(numeroFactura, codigoProveedor,fechaRegistro,observacion) {        
                
                this.numeroFactura = numeroFactura;
                this.codigoProveedor = codigoProveedor;
                this.fechaRegistro = fechaRegistro;
                this.observacion = observacion || '';
                this.detalle = [];
            }

            // Factura
            Factura.prototype.setNumeroFactura = function(numeroFactura) {
                this.numeroFactura = numeroFactura;
            };

            Factura.prototype.getNumeroFactura = function() {
                return this.numeroFactura;
            };
            
            Factura.prototype.setFechaRegistro = function(fechaRegistro) {
                this.fechaRegistro = fechaRegistro;
            };

            Factura.prototype.getFechaRegistro = function() {
                return this.fechaRegistro;
            };
            
            Factura.prototype.setObservacion = function(observacion) {
                this.observacion = observacion;
            };

            Factura.prototype.getObservacion= function() {
                return this.observacion;
            };
            
            Factura.prototype.setEstado = function(estado) {
                this.estado = estado;
            };

            Factura.prototype.getEstado= function() {
                return this.estado;
            };
            
            Factura.prototype.setMensaje = function(mensaje) {
                this.mensaje = mensaje;
            };

            Factura.prototype.getMensaje= function() {
                return this.mensaje;
            };
            
            Factura.prototype.setNombreUsuario = function(nombreUsuario) {
                this.nombreUsuario = nombreUsuario;
            };

            Factura.prototype.getNombreUsuario= function() {
                return this.nombreUsuario;
            };
            
            
            Factura.prototype.setDescripcionEstado = function(descripcionEstado) {
                this.descripcionEstado = descripcionEstado;
            };

            Factura.prototype.getDescripcionEstado = function() {
                return this.descripcionEstado;
            };
            
                       
            Factura.prototype.setEmpresa = function(empresa) {
                this.empresa = empresa;
            };

            Factura.prototype.getEmpresa= function() {
                return this.empresa;
            };
            
            Factura.prototype.setCentroUtilidad = function(centroUtilidad) {
                this.centroUtilidad = centroUtilidad;
            };

            Factura.prototype.getCentroUtilidad= function() {
                return this.centroUtilidad;
            };
            
            Factura.prototype.setBodega = function(bodega) {
                this.bodega = bodega;
            };

            Factura.prototype.getBodega= function() {
                return this.bodega;
            };
            
            Factura.prototype.setValorDescuento = function(valorDescuento) {
                this.valorDescuento = valorDescuento;
            };

            Factura.prototype.getValorDescuento= function() {
                return this.valorDescuento;
            };
            
            Factura.prototype.setValorFactura = function(valorFactura) {
                this.valorFactura = valorFactura;
            };

            Factura.prototype.getValorFactura= function() {
                return this.valorFactura;
            };
            
            Factura.prototype.setUsuarioId = function(usuarioId) {
                this.usuarioId = usuarioId;
                return this;
            };

            Factura.prototype.getUsuarioId = function() {
                return this.usuarioId;
            };
            
             Factura.prototype.set_porcentaje_rtf = function(porcentaje_rtf) {
                this.porcentaje_rtf = porcentaje_rtf;
                return this;
            };

            Factura.prototype.get_porcentaje_rtf = function() {
                return this.porcentaje_rtf;
            };
            
            Factura.prototype.set_porcentaje_ica = function(porcentaje_ica) {
                this.porcentaje_ica = porcentaje_ica;
                return this;
            };

            Factura.prototype.get_porcentaje_ica = function() {
                return this.porcentaje_ica;
            };
            
            Factura.prototype.set_porcentaje_reteiva = function(porcentaje_reteiva) {
                this.porcentaje_reteiva = porcentaje_reteiva;
                return this;
            };

            Factura.prototype.get_porcentaje_reteiva = function() {
                return this.porcentaje_reteiva;
            };
            
            Factura.prototype.setObservacionSincronizacion = function(observacionSincronizacion) {
                this.observacionSincronizacion = observacionSincronizacion;
                return this;
            };

            Factura.prototype.getObservacionSincronizacion = function() {
                return this.observacionSincronizacion;
            };
            
            Factura.prototype.agregarDetalle = function (detalle) {
                this.detalle.push(detalle);
            };

            Factura.prototype.vaciarDetalle = function () {
                this.detalle = [];
            };
            
            // Instancia
            this.get = function(numeroFactura, codigoProveedor,fechaRegistro,observacion) {
                return new Factura(numeroFactura, codigoProveedor,fechaRegistro,observacion);
            };

            return this;
        }]);
});