
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory("FacturaDetalle",[function() {


            function FacturaDetalle() {        
                
            }

            // Factura
            FacturaDetalle.prototype.setNumeroFactura = function(numeroFactura) {
                this.numeroFactura = numeroFactura;
            };

            FacturaDetalle.prototype.getNumeroFactura = function() {
                return this.numeroFactura;
            };
            
            FacturaDetalle.prototype.setFechaRegistro = function(fechaRegistro) {
                this.fechaRegistro = fechaRegistro;
            };

            FacturaDetalle.prototype.getFechaRegistro = function() {
                return this.fechaRegistro;
            };
            
            
            FacturaDetalle.prototype.setEstado = function(estado) {
                this.estado = estado;
            };

            FacturaDetalle.prototype.getEstado= function() {
                return this.estado;
            };
            
                       
            FacturaDetalle.prototype.setEmpresa = function(empresa) {
                this.empresa = empresa;
            };

            FacturaDetalle.prototype.getEmpresa= function() {
                return this.empresa;
            };
            
            FacturaDetalle.prototype.setCentroUtilidad = function(centroUtilidad) {
                this.centroUtilidad = centroUtilidad;
            };

            FacturaDetalle.prototype.getCentroUtilidad= function() {
                return this.centroUtilidad;
            };
            
            FacturaDetalle.prototype.setBodega = function(bodega) {
                this.bodega = bodega;
            };

            FacturaDetalle.prototype.getBodega= function() {
                return this.bodega;
            };
            
            
            FacturaDetalle.prototype.setUsuarioId = function(usuarioId) {
                this.usuarioId = usuarioId;
                return this;
            };

            FacturaDetalle.prototype.getUsuarioId = function() {
                return this.usuarioId;
            };
            
             FacturaDetalle.prototype.set_porcentaje_rtf = function(porcentaje_rtf) {
                this.porcentaje_rtf = porcentaje_rtf;
                return this;
            };

            FacturaDetalle.prototype.get_porcentaje_rtf = function() {
                return this.porcentaje_rtf;
            };
            
            FacturaDetalle.prototype.set_porcentaje_ica = function(porcentaje_ica) {
                this.porcentaje_ica = porcentaje_ica;
                return this;
            };

            FacturaDetalle.prototype.get_porcentaje_ica = function() {
                return this.porcentaje_ica;
            };
            
            FacturaDetalle.prototype.set_porcentaje_reteiva = function(porcentaje_reteiva) {
                this.porcentaje_reteiva = porcentaje_reteiva;
                return this;
            };

            FacturaDetalle.prototype.get_porcentaje_reteiva = function() {
                return this.porcentaje_reteiva;
            };

            
            // Instancia
            this.get = function() {
                return new FacturaDetalle();
            };

            return this;
        }]);
});