
define(["angular","js/models"], function(angular, models){
 

 	//declare usermodel wrapper 'factory'
    models.factory('Pedido', function() {

    	
    	//declare usermodel class
    	function Pedido(){

    	}

    	Pedido.prototype.setDatos = function(datos){
    		this.numero_pedido 		= datos.numero_pedido;
    		this.nombre_cliente     = datos.nombre_cliente;
    		this.direccion_cliente  = datos.direccion_cliente;
    		this.telefono_cliente   = datos.telefono_cliente;
    		this.nombre_vendedor    = datos.nombre_vendedor;
    		this.fecha_registro 	= datos.fecha_registro;
    	}

	    //we return new instance of usermodel class  because factory is a singleton and we dont need like that
	    this.get = function(){
	    	return new Pedido();
	    };

	    //just return the factory wrapper
	    return this;

	});
});