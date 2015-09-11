
/*SeparacionProductosPendientesController 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductosPendientesController',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        function($scope,$rootScope,Request,API,socket,AlertService,$modal,localStorageService,$state){
         
            console.log("Hola mundo");
        }
        
    ]);
});

