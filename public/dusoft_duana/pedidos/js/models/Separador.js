
define(["angular","js/models"], function(angular, models, Empleado){

	 models.factory('Separador', function(Empleado) {

		function Separador(nombre, id){
			this.nombre_operario = nombre;
			this.operario_id = id;
		}

		Separador.prototype.setOperarioId = function(id) {
			this.operario_id = id;
		};

		Separador.prototype.setNombre = function(nombre) {
			this.nombre_operario = nombre;
		};

		Separador.prototype.setUsuarioId = function(id) {
			this.usuario_id = id;
		};

		Separador.prototype.setUsuarioId = function(id) {
			this.usuario_id = id;
		};

		Separador.prototype.getPropiedades = function(id) {
			var obj = {};

			obj.operario_id = this.operario_id;
			obj.nombre      = this.nombre_operario;

			return obj;
		};


		this.get = function(nombre, id){
	    	return new Separador(nombre, id);
	    }

	    return this;

	});
});



