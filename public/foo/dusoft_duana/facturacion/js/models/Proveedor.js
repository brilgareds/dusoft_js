
define(["angular","js/models"], function(angular, models){

	 models.factory('Proveedor', function(Transporte, Excursion, Hospedaje) {

		function Proveedor(nombre, tipo){
			this.nombre = nombre;
			this.tipo   = tipo;
			this.servicios = [];
			
			for(var i= 1; i <= 4; i++){

				if(tipo == 1){
					this.servicios.push(
						Transporte.get("Transporte"+1)
					);
				} else if(tipo == 2){
					this.servicios.push(
						Excursion.get("Excursion"+1)
					);
				} else {
					this.servicios.push(
						Hospedaje.get("Hospedaje"+1)
					);
				}
	
			}

			
		}

		this.get = function(nombre, tipo){
	    	return new Proveedor(nombre, tipo);
	    };

	    return this;

	});
});