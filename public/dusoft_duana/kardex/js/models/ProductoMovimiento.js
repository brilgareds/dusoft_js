
define(["angular","js/models","includes/classes/Producto"], function(angular, models, Producto){

	models.factory('ProductoMovimiento', ["Producto", function(Producto) {

		function ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva, descuadre){
			//constructor padre
			Producto.getClass().call(this,codigo,nombre, existencia);

			this.movimientos = [];
			this.pendientesFarmacia = [];
			this.pendientesClientes = [];
			this.pendientesOrdenes  = [];
			this.precio = precio;
			this.existencia_total = existencia_total;
			this.costo = costo;
			this.costo_ultima_compra = costo_ultima_compra;
			this.porc_iva = porc_iva;
			this.descuadre  = descuadre;
                        this.tipoProducto;
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

		ProductoMovimiento.prototype.agregarPendienteOrden = function(pendiente){
			this.pendientesOrdenes.push(pendiente);
		};

		ProductoMovimiento.prototype.getPendientesOrdenes = function(){
			return this.pendientesOrdenes;
		};	
                
                
                ProductoMovimiento.prototype.setTipoProductoId = function(tipoProducto){
                        this.tipoProducto = tipoProducto;
                };
                
                ProductoMovimiento.prototype.getTipoProductoId = function(){
                        return this.tipoProducto;
                };

		this.get = function(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva){
			return new ProductoMovimiento(codigo, nombre, existencia, precio, existencia_total, costo, costo_ultima_compra, porc_iva);
		};

		return this;
	}]);
});