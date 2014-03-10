
define(["angular","js/models"], function(angular, models, Empleado){

	 models.factory('Cliente', function(Empleado) {

		function Cliente(nombre){
			this.nombre = nombre;
		}

		this.get = function(nombre, tipo){
	    	return new Cliente(nombre, tipo);
	    }

	    return this;

	});
});