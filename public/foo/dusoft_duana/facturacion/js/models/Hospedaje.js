define(["angular","js/models"], function(angular, models){
	models.factory('Hospedaje', function() {
		function Hospedaje(nombre){
			this.nombre = nombre;
		}

		this.get = function(nombre){
			return new Hospedaje(nombre);
		}

		return this;
	});
});