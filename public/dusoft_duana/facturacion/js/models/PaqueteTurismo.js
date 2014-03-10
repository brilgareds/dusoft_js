define(["angular","js/models"], function(angular, models){

	 models.factory('PaqueteTurismo', function() {

		function PaqueteTurismo(){

		}

		this.get = function(){
	    	return new PaqueteTurismo();
	    };

	    return this;

	});
});