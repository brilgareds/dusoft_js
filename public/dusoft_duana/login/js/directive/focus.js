define(["angular","js/directive"], function(angular, directive){

   directive.directive('xngFocus', function($timeout) {
	    return {
	    	link:function(scope, element, attrs) {

	                
                scope.$watch(attrs.xngFocus, 
		         function (newValue) { 
		         	if(newValue){
		         		 scope.$evalAsync(function() {
		                    $timeout(function() {
			                    element[0].focus();
			                });
		                });
		         	}
		         },true); 
		    	  
		    }
	    }   
	});

});