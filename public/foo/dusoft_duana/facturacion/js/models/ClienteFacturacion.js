
define(["angular","js/models"], function(angular, models){

	models.factory('ClienteFacturacion', function() {

		
		function Cliente(nombre, apellido, id){
			this.nombre = nombre;
			this.apellido = apellido;
			this.id = id;

			//console.log("este es el modelo de clientes facturacion con datos!!!!!!");
			//console.log(nombre + " " +apellido + " " +id);
		}

		Cliente.prototype.asignarCredencial = function(){
			this.credencial = Credencial.get();
		};

		this.get = function(nombre, apellido, id){
			return new Cliente(nombre,apellido, id);
		}

		return this;
	});
});