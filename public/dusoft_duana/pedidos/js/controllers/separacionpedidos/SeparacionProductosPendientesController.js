
/*SeparacionProductosPendientesController 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductosPendientesController',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modalInstance", "localStorageService", "$state",
        function($scope,$rootScope,Request,API,socket,AlertService,
                 $modalInstance,localStorageService,$state){
                     
            $scope.cerrar = function(){
                $modalInstance.close();
            };         
            
            $scope.listarProductos = {
                data: 'myData',
                
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected:false,
                multiSelect:false,
                columnDefs: [
                    {field: 'pedido', displayName: 'Lote'},
                    {field: 'fechavencimiento', displayName: 'F. vencimiento'}
                   
                     
                ]
               
            };
            
            
        }
        
    ]);
});

