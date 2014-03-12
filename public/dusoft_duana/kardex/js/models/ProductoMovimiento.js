
define(["angular","js/models","includes/classes/Producto"], function(angular, models, Producto){

	models.factory('ProductoMovimiento', function(Producto) {

		function ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva, descuadre){
			//constructor padre
			Producto.getClass().call(this,codigo,nombre);

			this.movimientos = [];
			this.pendientesFarmacia = [];
			this.pendientesClientes = [];
			this.existencia = existencia;
			this.precio = precio;
			this.existencia_total = existencia_total;
			this.costo = costo;
			this.costo_ultima_compra = costo_ultima_compra;
			this.porc_iva = porc_iva;
			this.descuadre  = descuadre;
		}

		//herencia
		ProductoMovimiento.prototype = Object.create(Producto.getClass().prototype);

		ProductoMovimiento.prototype.agregarMovimiento = function(movimiento){
			this.movimientos.push(movimiento);
		};

		ProductoMovimiento.prototype.getMovimientos = function(){
			return this.movimientos;
		};

		
		ProductoMovimiento.prototype.agregarPendienteFarmacia = function(pendiente){
			this.pendientesFarmacia.push(pendiente);
		};		

		ProductoMovimiento.prototype.getPendientesFarmacia = function(pendiente){
			return this.pendientesFarmacia;
		};	

		ProductoMovimiento.prototype.setDescuadre = function(descuadre){
			this.descuadre = descuadre;
		};

		ProductoMovimiento.prototype.agregarPendienteCliente = function(pendiente){
			this.pendientesClientes.push(pendiente);
		};

		ProductoMovimiento.prototype.getPendientesClientes = function(){
			return this.pendientesClientes;
		};		

		this.get = function(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva){
			return new ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva);
		}

		return this;
	});
});