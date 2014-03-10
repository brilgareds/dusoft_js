define(["angular","js/models"], function(angular, models){
	models.factory('Transporte', function() {
		function Transporte(nombre){
			this.nombre = nombre;
		}

		this.get = function(nombre){
			return new Transporte(nombre);
		}

		return this;
	});
});