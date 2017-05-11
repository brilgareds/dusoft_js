
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory("FacturaProveedores",[function() {


            function FacturaProveedores(numeroFactura, codigoProveedor,fechaRegistro,observacion) {        
                
                this.numeroFactura = numeroFactura;
                this.codigoProveedor = codigoProveedor;
                this.fechaRegistro = fechaRegistro;
                this.observacion = observacion || '';
            }

            // Factura
            FacturaProveedores.prototype.setNumeroFactura = function(numeroFactura) {
                this.numeroFactura = numeroFactura;
            };

            FacturaProveedores.prototype.getNumeroFactura = function() {
                return this.numeroFactura;
            };
            
            FacturaProveedores.prototype.setCodigoProveedor = function(codigoProveedor) {
                this.codigoProveedor = codigoProveedor;
            };

            FacturaProveedores.prototype.getCodigoProveedor = function() {
                return this.codigoProveedor;
            };
            
            FacturaProveedores.prototype.setFechaRegistro = function(fechaRegistro) {
                this.fechaRegistro = fechaRegistro;
            };

            FacturaProveedores.prototype.getFechaRegistro = function() {
                return this.fechaRegistro;
            };
            
            FacturaProveedores.prototype.setObservacion = function(observacion) {
                this.observacion = observacion;
            };

            FacturaProveedores.prototype.getObservacion= function() {
                return this.observacion;
            };
            
            FacturaProveedores.prototype.setEstado = function(estado) {
                this.estado = estado;
            };

            FacturaProveedores.prototype.getEstado= function() {
                return this.estado;
            };
            
            FacturaProveedores.prototype.setMensaje = function(mensaje) {
                this.mensaje = mensaje;
            };

            FacturaProveedores.prototype.getMensaje= function() {
                return this.mensaje;
            };
            
            FacturaProveedores.prototype.setNombreUsuario = function(nombreUsuario) {
                this.nombreUsuario = nombreUsuario;
            };

            FacturaProveedores.prototype.getNombreUsuario= function() {
                return this.nombreUsuario;
            };
            
            FacturaProveedores.prototype.setEstado = function(estado) {
                this.estado = estado;
            };

            FacturaProveedores.prototype.getEstado= function() {
                return this.estado;
            };
            
            FacturaProveedores.prototype.setDescripcionEstado = function(descripcionEstado) {
                this.descripcionEstado = descripcionEstado;
            };

            FacturaProveedores.prototype.getDescripcionEstado = function() {
                return this.descripcionEstado;
            };
            
            FacturaProveedores.prototype.setdescripcionEstado = function(descripcionEstado) {
                this.descripcionEstado = descripcionEstado;
            };

            FacturaProveedores.prototype.getdescripcionEstado = function() {
                return this.descripcionEstado;
            };
            
            FacturaProveedores.prototype.setEmpresa = function(empresa) {
                this.empresa = empresa;
            };

            FacturaProveedores.prototype.getEmpresa= function() {
                return this.empresa;
            };
            
            FacturaProveedores.prototype.setCentroUtilidad = function(centroUtilidad) {
                this.centroUtilidad = centroUtilidad;
            };

            FacturaProveedores.prototype.getCentroUtilidad= function() {
                return this.centroUtilidad;
            };
            
            FacturaProveedores.prototype.setBodega = function(bodega) {
                this.bodega = bodega;
            };

            FacturaProveedores.prototype.getBodega= function() {
                return this.bodega;
            };
            
            FacturaProveedores.prototype.setValorDescuento = function(valorDescuento) {
                this.valorDescuento = valorDescuento;
            };

            FacturaProveedores.prototype.getValorDescuento= function() {
                return this.valorDescuento;
            };
            
            FacturaProveedores.prototype.setValorDescuento = function(valorDescuento) {
                this.valorDescuento = valorDescuento;
            };

            FacturaProveedores.prototype.getValorDescuento= function() {
                return this.valorDescuento;
            };
            
            FacturaProveedores.prototype.setUsuarioId = function(usuarioId) {
                this.usuarioId = usuarioId;
                return this;
            };

            FacturaProveedores.prototype.getUsuarioId = function() {
                return this.usuarioId;
            };
            
             FacturaProveedores.prototype.set_porcentaje_rtf = function(porcentaje_rtf) {
                this.porcentaje_rtf = porcentaje_rtf;
                return this;
            };

            FacturaProveedores.prototype.get_porcentaje_rtf = function() {
                return this.porcentaje_rtf;
            };
            
            FacturaProveedores.prototype.set_porcentaje_ica = function(porcentaje_ica) {
                this.porcentaje_ica = porcentaje_ica;
                return this;
            };

            FacturaProveedores.prototype.get_porcentaje_ica = function() {
                return this.porcentaje_ica;
            };
            
            FacturaProveedores.prototype.set_porcentaje_reteiva = function(porcentaje_reteiva) {
                this.porcentaje_reteiva = porcentaje_reteiva;
                return this;
            };

            FacturaProveedores.prototype.get_porcentaje_reteiva = function() {
                return this.porcentaje_reteiva;
            };
            
            // Instancia
            this.get = function(numeroFactura, codigoProveedor,fechaRegistro,observacion) {
                return new FacturaProveedores(numeroFactura, codigoProveedor,fechaRegistro,observacion);
            };

            return this;
        }]);
});