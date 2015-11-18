
define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('validacionNumero', function() {
        return function(scope, element, attrs) {



            var keyCode = [8, 9, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 190,110];
            var contador =0;
            var arregloValoresCorrectos = [];
            element.on("keydown", function(event) {
           
                
               
                if ($.inArray(event.which, keyCode) == -1) {
                    scope.$apply(function() {
                       
                        event.preventDefault();
                    }); 
                    
                    event.preventDefault();
                
                }
                
                  element.on("blur", function(event) {
                      
                    //  arregloValoresCorrectos.push($.inArray(event.which, keyCode))
                      //console.log("TECLAS OK ", arregloValoresCorrectos);
                        
                      //var keyCode1 = [8, 9, 37]
                      $.inArray();
                         
                  });
                  
                  arregloValoresCorrectos = [];
                
                
            });
            
        };
    });

});
