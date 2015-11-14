
define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('validacionNumero', function() {
        return function(scope, element, attrs) {



            var keyCode = [8, 9, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 190,110];
            var contador =0;
            element.on("keydown", function(event) {
                
             /*if(event.which !== 110){
          
             if(event.which === 110){
                 
                 contador++;
                 
                 if(contador >1){
                     keyCode.splice(keyCode.length-1,1);
                     contador=0;
                 }
                
              }
             }  */
              
            /* 
             
          
               //console.log("contador", contador);
                //console.log('====================');
                //console.log('== Texto == ', element.val());
                //console.log(' == isNaN ==', isNaN(element.val()));
                /*console.log((event.which <= 13 || (event.which >= 48 && event.which <= 57) || event.which == 46 || event.which == 45));
                 console.log(event.which);  */



                /*if (!(event.which >= 48 && event.which <= 57)) {
                 scope.$apply(function() {
                 event.preventDefault();
                 });
                 event.preventDefault();
                 }*/
                
                //console.log($.inArray(event.which,keyCode));
                if ($.inArray(event.which, keyCode) == -1) {
                    scope.$apply(function() {
                        //scope.$eval(attrs.onlyNum);
                        event.preventDefault();
                    });
                    event.preventDefault();
                }
              
               
         
            });
            
        };
    });

});
