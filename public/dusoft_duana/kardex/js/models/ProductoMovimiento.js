
define(["angular","js/models","includes/classes/Producto"], function(angular, models, Producto){

	models.factory('ProductoMovimiento', function(Producto) {

		function ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva){
			//constructor padre
			Producto.getClass().call(this,codigo,nombre);

			this.movimientos = [];
			this.existencia = existencia;
			this.precio = precio;
			this.existencia_total = existencia_total;
			this.costo = costo;
			this.costo_ultima_compra = costo_ultima_compra;
			this.porc_iva = porc_iva;
		}

		//herencia
		ProductoMovimiento.prototype = Object.create(Producto.getClass().prototype)

		ProductoMovimiento.prototype.agregarMovimiento = function(movimiento){
			this.movimientos.push(movimiento);
		};

		ProductoMovimiento.prototype.getMovimientos = function(){
			return this.movimientos;
		};

		this.get = function(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva){
			return new ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva);
		}

		return this;
	});
});