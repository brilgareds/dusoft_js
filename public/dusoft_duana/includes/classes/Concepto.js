
define(["angular", "js/models"], function(angular, models) {

    models.factory('Concepto', function() {

        function Concepto(conceptoId) {
            this.conceptoId = conceptoId;
	    this.valorUnitario = 0;
        }
        ;

        Concepto.prototype.setConceptoId = function(conceptoId) {
            this.conceptoId = conceptoId;
        };

        Concepto.prototype.getConceptoId = function() {
            return this.conceptoId;
        };

        Concepto.prototype.setEmpresa = function(empresa) {
            this.empresa = empresa;
        };

        Concepto.prototype.getEmpresa = function() {
            return this.empresa;
        };

        Concepto.prototype.setCentroUtilidad = function(centroUtilidad) {
            this.centroUtilidad = centroUtilidad;
        };

        Concepto.prototype.getCentroUtilidad = function() {
            return this.centroUtilidad;
        };

        Concepto.prototype.setCantidad = function(cantidad) {
            this.cantidad = cantidad;
        };

        Concepto.prototype.getCantidad = function() {
            return this.cantidad;
        };

        Concepto.prototype.setPrecio = function(precio) {
            this.precio = precio;
        };

        Concepto.prototype.getPrecio = function() {
            return this.precio;
        };

        Concepto.prototype.setDescripcionConcepto = function(descripcionConcepto) {
            this.descripcionConcepto = descripcionConcepto;
        };

        Concepto.prototype.getDescripcionConcepto = function() {
            return this.descripcionConcepto;
        };

        Concepto.prototype.setDescripcionGrupo = function(descripcionGrupo) {
            this.descripcionGrupo = descripcionGrupo;
        };

        Concepto.prototype.getDescripcionGrupo = function() {
            return this.descripcionGrupo;
        };

        Concepto.prototype.setDescripcion = function(descripcion) {
            this.descripcion = descripcion;
        };

        Concepto.prototype.getDescripcion = function() {
            return this.descripcion;
        };

        Concepto.prototype.setPorcentajeGravamen = function(porcentajeGravamen) {
            this.porcentajeGravamen = porcentajeGravamen;
        };

        Concepto.prototype.getPorcentajeGravamen = function() {
            return this.porcentajeGravamen;
        };

        Concepto.prototype.setGrupoConcepto = function(grupoConcepto) {
            this.grupoConcepto = grupoConcepto;
        };

        Concepto.prototype.getGrupoConcepto = function() {
            return this.grupoConcepto;
        };

        Concepto.prototype.setTipoIdTercero = function(tipoIdTercero) {
            this.tipoIdTercero = tipoIdTercero;
        };

        Concepto.prototype.getTipoIdTercero = function() {
            return this.tipoIdTercero;
        };

        Concepto.prototype.setIdTercero = function(idTercero) {
            this.idTercero = idTercero;
        };

        Concepto.prototype.getIdTercero = function() {
            return this.idTercero;
        };

        Concepto.prototype.setRcConceptoId = function(rcConceptoId) {
            this.rcConceptoId = rcConceptoId;
        };

        Concepto.prototype.getRcConceptoId = function() {
            return this.rcConceptoId;
        };

        Concepto.prototype.setSwTipo = function(swTipo) {
            this.swTipo = swTipo;
        };

        Concepto.prototype.getSwTipo = function() {
            return this.swTipo;
        };

        Concepto.prototype.setValorTotal = function(valorTotal) {
            this.valorTotal = valorTotal;
        };

        Concepto.prototype.getValorTotal = function() {
            return this.valorTotal;
        };
	
        Concepto.prototype.setValorUnitario = function(valorUnitario) {
            this.valorUnitario = valorUnitario;
        };

        Concepto.prototype.getValorUnitario = function() {
	    if(this.valorUnitario > 0){
	       return this.valorUnitario;
	    }else{
		return this.valorTotal-this.valorGravamen;
	    }
            
        };

        Concepto.prototype.setValorGravamen = function(valorGravamen) {
            this.valorGravamen = valorGravamen;
        };

        Concepto.prototype.getValorGravamen = function() {
            return this.valorGravamen;
        };

        Concepto.prototype.setTipoPagoId = function(tipoPagoId) {
            this.tipoPagoId = tipoPagoId;
        };

        Concepto.prototype.getTipoPagoId = function() {
            return this.tipoPagoId;
        };

        Concepto.prototype.getTipoPagoDescripcion = function() {
            var tipo = "";
            if (this.tipoPagoId === 1) {
                tipo = "Efectivo";
            }
            if (this.tipoPagoId === 2) {
                tipo = "Credito";
            }
            if (this.tipoPagoId === 3) {
                tipo = "Cheque";
            }
            return tipo;
        };

        this.get = function(conceptoId) {
            return new (conceptoId);
        };

        this.getClass = function() {
            return Concepto;
        };

        return this;

    });
});