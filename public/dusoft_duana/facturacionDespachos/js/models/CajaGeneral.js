
define(["angular", "js/models"], function(angular, models) {

    models.factory('CajaGeneral', [function() {

            function CajaGeneral(cajaId, empresa, centroUtilidad) {
                this.cajaId = cajaId;
                this.empresa = empresa;
                this.centroUtilidad = centroUtilidad;
            }

            CajaGeneral.prototype.setCajaId = function(cajaId) {
                this.cajaId = cajaId;
            };

            CajaGeneral.prototype.getCajaId = function() {
                return this.cajaId;
            };

            CajaGeneral.prototype.setEmpresa = function(empresa) {
                this.empresa = empresa;
            };

            CajaGeneral.prototype.getEmpresa = function() {
                return this.empresa;
            };

            CajaGeneral.prototype.setCentroUtilidad = function(centroUtilidad) {
                this.centroUtilidad = centroUtilidad;
            };

            CajaGeneral.prototype.getCentroUtilidad = function() {
                return this.centroUtilidad;
            };

            CajaGeneral.prototype.setDescripcionCaja = function(descripcionCaja) {
                this.descripcionCaja = descripcionCaja;
            };

            CajaGeneral.prototype.getDescripcionCaja = function() {
                return this.descripcionCaja;
            };

            CajaGeneral.prototype.setNombreEmpresa = function(nombreEmpresa) {
                this.nombreEmpresa = nombreEmpresa;
            };

            CajaGeneral.prototype.getNombreEmpresa = function() {
                return this.nombreEmpresa;
            };

            CajaGeneral.prototype.setNombreCentroUtilidad = function(nombreCentroUtilidad) {
                this.nombreCentroUtilidad = nombreCentroUtilidad;
            };

            CajaGeneral.prototype.getNombreCentroUtilidad = function() {
                return this.nombreCentroUtilidad;
            };

            CajaGeneral.prototype.setCuentaTipoId = function(cuentaTipoId) {
                this.cuentaTipoId = cuentaTipoId;
            };

            CajaGeneral.prototype.getCuentaTipoId = function() {
                return this.cuentaTipoId;
            };

            CajaGeneral.prototype.setPrefijoFacContado = function(prefijoFacContado) {
                this.prefijoFacContado = prefijoFacContado;
            };

            CajaGeneral.prototype.getPrefijoFacContado = function() {
                return this.prefijoFacContado;
            };

            CajaGeneral.prototype.setPrefijoFacCredito = function(prefijoFacCredito) {
                this.prefijoFacCredito = prefijoFacCredito;
            };

            CajaGeneral.prototype.getPrefijoFacCredito = function() {
                return this.prefijoFacCredito;
            };

            CajaGeneral.prototype.setConceptoCaja = function(conceptoCaja) {
                this.conceptoCaja = conceptoCaja;
            };

            CajaGeneral.prototype.getConceptoCaja = function() {
                return this.conceptoCaja;
            };

            this.get = function(cajaId, empresa, centroUtilidad) {
                return new CajaGeneral(cajaId, empresa, centroUtilidad);
            };
	    
            return this;

        }]);

});