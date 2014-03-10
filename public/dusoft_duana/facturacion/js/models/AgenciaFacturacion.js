
define(["angular","js/models"], function(angular, models){

	 models.factory('AgenciaFacturacion', function() {
	 	this.clientes = [];
		this.proveedores = [];

		this.sayHello = function(){
			console.log("este es el controlador agenciafacturacion hablalo camilo")
		}

		this.agregarCliente= function(cliente){
			this.clientes.push(cliente);
		}

		this.agregarProveedor= function(proveedor){
			this.proveedores.push(proveedor);
		}

		this.obtenerSuscripcionPorTipo= function(tipo){
			for(var i = 0; i <= this.suscripciones.length; i++){
				var suscripcion = this.suscripciones[i];

				if(suscripcion){
					//console.log(suscripcion);
					if(tipo == suscripcion.tipo){
						return suscripcion;
					}
				}
			}
		}

	    return this;

	});
});