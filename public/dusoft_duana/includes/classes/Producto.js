
define(["angular","js/models"], function(angular, models){

	 models.factory('Producto', function() {

		function Producto(codigo_producto, descripcion){
			this.codigo_producto = codigo_producto;
			this.descripcion = descripcion;
		}

		Producto.prototype.setCodigoProducto = function(codigo) {
			this.codigo_producto = codigo;
		};

		Producto.prototype.setDescripcion = function(descripcion) {
			this.descripcion = descripcion;
		};

		Producto.prototype.getCodigoProducto = function() {
			return this.codigo_producto;
		};

		Producto.prototype.getDescripcion = function(id) {
			return descripcion;
		};


		this.getClass = function(){
			return Producto;
		}


	    return this;

	});
});
