
define(["angular","js/models"], function(angular, models){

	models.factory('Producto', function() {

		function Producto(codigo, nombre, existencia, precio){
			this.nombre = nombre;
			this.codigo = codigo;
			this.existencia = existencia;
			this.precio = precio;

		}


		this.get = function(codigo, nombre, existencia, precio){
			return new Producto(codigo, nombre, existencia, precio);
		}

		return this;
	});
});