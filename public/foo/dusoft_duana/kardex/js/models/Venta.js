define(["angular","js/models"], function(angular, models){

	models.factory('Venta', function() {
		function Venta(nombre, tipo){
			this.nombre = nombre;
			this.tipo   = tipo;
		}

		this.get = function(nombre, tipo){
			return new Venta(nombre, tipo);
		}

		return this;
	});
});