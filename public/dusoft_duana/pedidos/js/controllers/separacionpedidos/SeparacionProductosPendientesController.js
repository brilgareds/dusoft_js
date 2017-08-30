
/*SeparacionProductosPendientesController 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductosPendientesController',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modalInstance", "localStorageService", "$state",
        "pedido", "$filter",
        function($scope,$rootScope,Request,API,socket,AlertService,
                 $modalInstance,localStorageService,$state, pedido,
                 $filter){
                     
            var self = this;
           
            
           self.init = function(){
               $scope.rootListaProductos = {};
               $scope.rootListaProductos.pedido = pedido;
               $scope.rootListaProductos.productos = angular.copy(pedido.getProductos());
               $scope.rootListaProductos.filtro = { codigoBarras : false, termino : "" };
              
                console.log("productos ", $scope.rootListaProductos.productos);
           } ;
            
            
           self.onSeleccionProducto = function(producto){
                var index = -1;
                
                for(var i in pedido.getProductos()){
                    var _producto = pedido.getProductos()[i];
                    
                    if(_producto.getCodigoProducto() === producto.getCodigoProducto()){
                        
                        index = i;
                        break;
                    }
                }
                
               $scope.$emit("onMostarProductoEnPosicion", index);
               $scope.cerrar();
            };
                     
            $scope.cerrar = function(){
                $modalInstance.close();
            };         
            
            $scope.listarProductos = {
                data: 'rootListaProductos.productos',
                afterSelectionChange:function(rowItem){
                     if(rowItem.selected){
                         self.onSeleccionProducto(rowItem.entity);
                     }
                },
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected:false,
                multiSelect:false,
                showFilter: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width:100},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'cantidad_solicitada', displayName:"Solic", width:100},
                    {field: 'cantidad_pendiente', displayName:"Pend", width:100},
                    {field: 'justificacion', displayName:"Justificacion", width:150}
                     
                ]
               
            };
            
            $scope.onFiltrarProducto = function(){
                $scope.rootListaProductos.productos = angular.copy(pedido.getProductos());
                
                var productos = $filter('filter')($scope.rootListaProductos.productos, {codigo_producto:$scope.rootListaProductos.filtro.termino});
                
                $scope.rootListaProductos.productos = productos;
                
               
              
            };
            
            self.init();

        }
        
    ]);
});

