define(["angular","js/models"], function(angular, models){

	models.factory('Excursion', function() {
		function Excursion(nombre){
			this.nombre = nombre;
		}

		this.get = function(nombre){
			return new Excursion(nombre);
		}

		return this;
	});
});