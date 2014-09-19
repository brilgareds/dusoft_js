
define(["angular","js/models","includes/classes/ClienteBase"], function(angular, models, ClienteBase){

	models.factory('ClienteKardex', ["ClienteBase", function(ClienteBase) {

		function ClienteKardex(nombre, direccion, tipo_id, id, telefono){
			//constructor padre
			ClienteBase.getClass().call(this,nombre, direccion, tipo_id, id, telefono);
		}

		//herencia
		ClienteKardex.prototype = Object.create(ClienteBase.getClass().prototype)


		this.get = function(nombre, direccion, tipo_id, id, telefono){
			return new ClienteKardex(nombre, direccion, tipo_id, id, telefono);
		}

		return this;
	}]);
});