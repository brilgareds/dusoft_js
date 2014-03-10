
define(["angular","js/models"], function(angular, models){

	 models.factory('Empresa', function(Producto) {
	 	this.clientes = [];
		this.proveedores = [];


	    return this;

	});
});