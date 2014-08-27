define(["angular", "js/controllers", 'controllers/asignacioncontroller','models/Farmacia', 'models/Pedido', 'models/Separador', 'models/DocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoFarmaciaController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'Empresa','Farmacia',
         'Pedido', 'API',"socket", "$timeout", 
         "AlertService","Usuario", "localStorageService",
         "Separador", "DocumentoTemporal",

        function($scope, $rootScope, Request, $modal, Empresa, Cliente, Pedido, API, socket, $timeout, AlertService, Usuario, localStorageService, Separador, DocumentoTemporal) {
            
            $scope.numero_pedido = '3020912';
            $scope.detalle_pedido_separado = [];
            $scope.nombre_cliente = 'PACO';
            $scope.nombre_separador = 'PEPE';
            $scope.fecha_separacion = '14-08-2014';
            
            $scope.cerrar = function(){
               $scope.$emit('cerrarslide');
            };
            
            $rootScope.$on("mostrarslide", function(e, documento_temporal) {
                
//                console.log("Documento Temporal Recibido: ",documento_temporal);
                
//                $scope.numeroPedido = documento_temporal.pedido.numero_pedido;
//                $scope.nombre_cliente = documento_temporal.pedido.cliente.nombre_tercero;
//                $scope.nombre_separador = documento_temporal.separador.nombre_operario;
//                $scope.fecha_separacion = documento_temporal.fecha_separacion_pedido;
//
//                
//                console.log("El número del pedido es: ",$scope.numeroPedido);
//                console.log("El nombre Cliente es: ",$scope.nombre_cliente);
//                console.log("El nombredel Separador es: ",$scope.nombre_separador);
//                console.log("La fecha de separación es: ",$scope.fecha_separacion);
                
                
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            numero_pedido: documento_temporal.pedido.numero_pedido
                        }
                    }
                };
                
                /* Inicio Request */
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_CLIENTES, "POST", obj, function(data) {
                        //console.log("Info Documento desde Server: ", data);
//                    if(data.status == 200) { 
//                        $scope.ultima_busqueda = {
//                            termino_busqueda: $scope.termino_busqueda,
//                            seleccion: $scope.seleccion
//                        }
//                        
//                        if(data.obj.documentos_temporales != undefined) {
//                            $scope.renderPedidosSeparadosFarmacia(data.obj, paginando);
//                        }
//                    }
                    
                });
                /* Fin Request */
                
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

});
