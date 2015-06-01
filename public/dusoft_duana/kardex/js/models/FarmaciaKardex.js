
define(["angular","js/models","includes/classes/Farmacia"], function(angular, models, Farmacia){

	models.factory('FarmaciaKardex', ["Farmacia", function(Farmacia) {

		function FarmaciaKardex(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega){
			//constructor padre
			Farmacia.getClass().call(this,farmacia_id, null, nombre_farmacia, null);
		}

		//herencia
		FarmaciaKardex.prototype = Object.create(Farmacia.getClass().prototype);



		this.get = function(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega){
			return new FarmaciaKardex(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega);
		};

		return this;
	}]);
});