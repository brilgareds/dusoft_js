
define(["angular","js/models","includes/classes/Pedido"], function(angular, models, Pedido){

	models.factory('PedidoKardex', function(Pedido) {

		function PedidoKardex(datos){
			//constructor padre
			Pedido.getClass().call();
			this.setDatos(datos);
			this.cantidad_pendiente = datos.cantidad_pendiente || null;
			this.cantidad_solicitada = datos.cantidad_solicitada || null;
			this.usuario = datos.usuario || null;
		}

		//herencia
		PedidoKardex.prototype = Object.create(Pedido.getClass().prototype)

		this.get = function(datos){
			return new PedidoKardex(datos);
		}

		return this;
	});
});