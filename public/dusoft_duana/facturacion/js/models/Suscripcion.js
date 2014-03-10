define(["angular","js/models"], function(angular, models){

	models.factory('Suscripcion', function(Actividad) {

		function Suscripcion(nombre, tipo){
			this.actividades = [];
			this.nombre = nombre;
			this.tipo   = tipo;

			var precio = 1000;
			if(tipo == 2){
				precio = 5000;
			} else if(tipo == 3) {
				precio = 10000;
			}

			this.crearActividades();
			return;
			this.cuota  = new Cuota(precio);
		}

		Suscripcion.prototype.crearActividades = function(){

			for(var ii =0; ii < 10; ii++){
				this.actividades.push(
					Actividad.get("actividad "+this.tipo, this.tipo)
				);
			}

			//console.log(this.actividades);
		};


		Suscripcion.prototype.agregarActividad = function(actividad){
			this.actividades.push(actividad);
		};

		Suscripcion.prototype.setActividades = function(actividades){
			this.actividades = actividades;
		};

		this.get = function(nombre, tipo){
			return new Suscripcion(nombre, tipo);
		}

		return this;
	});
});
