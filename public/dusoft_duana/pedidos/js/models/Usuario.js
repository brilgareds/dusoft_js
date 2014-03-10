define(["angular","js/models", 'models/Empleado'], function(angular, models){
	models.factory('Usuario', function(Empleado) {
		function Usuario(nombre){
			console.log(this.nombre)
		}

		this.get = function(nombre){
			return new Usuario(nombre);
		}

		Usuario.prototype = Empleado.get();

		return this;
	});
});