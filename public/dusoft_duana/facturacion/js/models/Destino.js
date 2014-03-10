
define(["angular","js/models"], function(angular, models){
 

 	//declare usermodel wrapper 'factory'
    models.factory('Destino', function() {


    	//declare usermodel class
    	function Destino(){

    	}

	    //we return new instance of usermodel class  because factory is a singleton and we dont need like that
	    this.get = function(){
	    	return new Destino();
	    };


	    //just return the factory wrapper
	    return this;

	});
});