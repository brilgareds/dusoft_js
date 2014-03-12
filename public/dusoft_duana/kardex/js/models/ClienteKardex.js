
define(["angular","js/models","includes/classes/Cliente"], function(angular, models, Cliente){

	models.factory('ClienteKardex', function(Cliente) {

		function ClienteKardex(nombre, direccion, tipo_id, id, telefono){
			//constructor padre
			Cliente.getClass().call(this,nombre, direccion, tipo_id, id, telefono);
		}

		//herencia
		ClienteKardex.prototype = Object.create(Cliente.getClass().prototype)


		this.get = function(nombre, direccion, tipo_id, id, telefono){
			return new ClienteKardex(nombre, direccion, tipo_id, id, telefono);
		}

		return this;
	});
});