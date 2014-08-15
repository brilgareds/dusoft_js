define(["angular", "js/controllers", 'controllers/asignacioncontroller','models/Cliente', 'models/Pedido'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'Empresa','Cliente',
         'Pedido', 'API',"socket", "$timeout", 
         "AlertService","Usuario", "localStorageService",

        function($scope, $rootScope, Request, $modal, Empresa, Cliente, Pedido, API, socket, $timeout, AlertService,Usuario,localStorageService) {
            
            $scope.numero_pedido = '3020912';
            $scope.detalle_pedido_separado = [];
            $scope.nombre_cliente = 'PACO';
            $scope.nombre_separador = 'PEPE';
            $scope.fecha_registro = '14-08-2014';
            
            $scope.cerrar = function(){
               $scope.$emit('cerrarslide');
            };
            
            $rootScope.$on("mostrarslide", function(e, pedido) {
                console.log("controlador de detalle recibio el pedido");
                console.log(pedido);
                $scope.numeroPedido = pedido.numero_pedido;
                $scope.nombre_cliente = pedido.nombre_cliente;
                $scope.nombre_separador = pedido.nombre_separador;
                $scope.fecha_registro = pedido.fecha_registro;
                console.log("El número del pedido es: ",$scope.numeroPedido);
            });
            
//            $rootScope.$apply(function(e, pedido){
//                $scope.numero_pedido.push({nombre: pedido.numero_pedido});
//            });
            
            //informacion temporal
            for(var i=0; i < 5; i++){
                
                var estado = '';
                
                if(i%2)
                    estado = 'Terminado';
                else
                    estado = 'En Proceso';
                
                var detalle = {
                    codigo_producto : '30102001_'+i,
                    nombre_producto: 'ASPARTAME_'+i+' CAJA X '+i*10+' PFIZER',
                    existencia_lotes: i*3,
                    cantidad_pedida: i*100,
                    cantidad_separada: i*100,
                    lote: '67789840'+i,
                    fecha_vencimiento: '12-08-2015',
                    observacion: 'Observación '+i
                };
                 //$scope.Empresa.agregarPedido(pedido);
                 
                 //Se adiciona aquí porque no coincipen los campos con los de pedido asociado a la empresa
                 $scope.detalle_pedido_separado.push(detalle);
                 
            }
            
            
            $scope.detalle_pedido_separado_cliente = {
                //data: 'Empresa.getPedidos()',
                data: 'detalle_pedido_separado',
                enableColumnResize: true,
                enableRowSelection:false,
                //enableSorting:false,
                /*rowTemplate: '<div " style="height: 100%" ng-class="{red: !row.getProperty(\'isUploaded\')}" rel="{{row.entity.numero_pedido}}" ng-click="rowClicked($event, row)">' + 
                    '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell "  >' +
                      '<div ng-cell ></div>' +
                    '</div>' +
                 '</div>',*/
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'nombre_producto', displayName: 'Nombre Producto'},
                    {field: 'existencia_lotes', displayName: 'Existencia Lotes'},
                    {field: 'cantidad_pedida', displayName: 'Cantidad Pedida'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote', displayName: 'Lote'},
                    {field: 'fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field: 'observacion', displayName: "Observación"}
                ]

            };
            
            


        }]);
    
//        controllers.directive("test", function() {
//            return {
//                restrict: "A",
//                scope: {
//                    name: '@'
//                },
////                    link: function(scope, element, attrs) {
////                        scope.$watch("name", function(value) {
////                            if (angular.isDefined(value))
////                                var replaceName = value.replace(/[ \/]+/g, "_")
////                                    .toLowerCase();
////                            var tag = 'heading ="Separado Pedido N° ' + 
////                                    replaceName;
////                            element.replaceWith(tag);
////                        });
////                    }
//
//                    link: function(scope, element, attrs) {
//
//                            // this will replace the value of your image source
//                            var setHeading = function() {
////                                if (angular.isDefined(value))
////                                var replaceName = value.replace(/[ \/]+/g, "_")
////                                    .toLowerCase();
//                                element.attr('heading','3020913');
//                            };
//
//                            // this will observe if there is changes on your name directive
//                            // and will trigger the function setImageSRC above
//                            attrs.$observe('name',setHeading);
//
//                     }
//
//                };
//            }
//            );    
//        controller.directive('encabezado.detalle', function() {
//		return {
//			template: "<tab heading=\'Producto Separado N°"+{{ numeroPedido }}+'\'">'
//		}
//	}); 
});
