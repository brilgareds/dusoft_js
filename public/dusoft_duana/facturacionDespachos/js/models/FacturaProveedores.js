
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
            
            FacturaProveedores.prototype.setNombreProveedor = function(nombreProveedor) {
                this.nombreProveedor = nombreProveedor;
            };

            FacturaProveedores.prototype.getNombreProveedor= function() {
                return this.nombreProveedor;
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
            
            FacturaProveedores.prototype.setValorFactura = function(valorFactura) {
                this.valorFactura = valorFactura;
            };

            FacturaProveedores.prototype.getValorFactura= function() {
                return this.valorFactura;
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
            
            FacturaProveedores.prototype.setObservacionSincronizacion = function(observacionSincronizacion) {
                this.observacionSincronizacion = observacionSincronizacion;
                return this;
            };

            FacturaProveedores.prototype.getObservacionSincronizacion = function() {
                return this.observacionSincronizacion;
            };
            
            FacturaProveedores.prototype.setSubTotal = function(subTotal) {
                this.subTotal = subTotal;
                return this;
            };

            FacturaProveedores.prototype.getSubTotal = function() {
                return this.subTotal;
            };
            
            
            FacturaProveedores.prototype.setSaldo = function(saldo) {
                this.saldo = saldo;
                return this;
            };

            FacturaProveedores.prototype.getSaldo = function() {
                return this.saldo;
            };
            
            FacturaProveedores.prototype.setGravamen = function(gravamen) {
                this.gravamen = gravamen;
                return this;
            };

            FacturaProveedores.prototype.getGravamen = function() {
                return this.gravamen;
            };
            
            FacturaProveedores.prototype.setIdentificacion = function(identificacion) {
                this.identificacion = identificacion;
                return this;
            };

            FacturaProveedores.prototype.getIdentificacion = function() {
                return this.identificacion;
            };
            
            FacturaProveedores.prototype.setSwClaseFactura = function(swClaseFactura) {
                this.swClaseFactura = swClaseFactura;
                return this;
            };

            FacturaProveedores.prototype.getSwClaseFactura = function() {
                return this.swClaseFactura;
            };
            
            FacturaProveedores.prototype.setTipoFactura = function(tipoFactura) {
                this.tipoFactura = tipoFactura;
                return this;
            };

            FacturaProveedores.prototype.getTipoFactura = function() {
                return this.tipoFactura;
            };
            
            FacturaProveedores.prototype.setPrefijo = function(prefijo) {
                this.prefijo = prefijo;
                return this;
            };

            FacturaProveedores.prototype.getPrefijo = function() {
                return this.prefijo;
            };
            
            
            FacturaProveedores.prototype.setTipoTercero = function(tipoTercero) {
                this.tipoTercero = tipoTercero;
                return this;
            };

            FacturaProveedores.prototype.getTipoTercero = function() {
                return this.tipoTercero;
            };
	    
            
            FacturaProveedores.prototype.setTerceroId = function(terceroId) {
                this.terceroId = terceroId;
                return this;
            };

            FacturaProveedores.prototype.getTerceroId = function() {
                return this.terceroId;
            };
            
            // Instancia
            this.get = function(numeroFactura, codigoProveedor,fechaRegistro,observacion) {
                return new FacturaProveedores(numeroFactura, codigoProveedor,fechaRegistro,observacion);
            };

            return this;
        }]);
});