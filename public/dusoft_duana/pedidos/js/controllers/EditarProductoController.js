define(["angular", "js/controllers",'models/Cliente',
        'models/PedidoAuditoria', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('EditarProductoController', [
        '$scope', '$rootScope', 'Request', 
        '$modalInstance', 'Empresa','Cliente',
         'PedidoAuditoria', 'API',"socket", "AlertService",
         "producto", "Usuario", "pedido","LoteProductoPedido",

        function(   $scope, $rootScope, Request,
                    $modalInstance, Empresa, Cliente,
                    PedidoAuditoria, API, socket, AlertService, 
                    producto, Usuario, pedido, LoteProductoPedido) {
            
           $scope.producto = angular.copy(producto);
           $scope.pedido   = angular.copy(pedido);
           $scope.lotes    = [];
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

           $modalInstance.opened.then(function() {
               var obj = {
                    session:$scope.session,
                    data:{
                        pedidos: {
                            numero_pedido: $scope.pedido.numero_pedido,
                            codigo_producto: $scope.producto.codigo_producto,
                            identificador: ($scope.pedido.tipo == 1)?"CL":"FM",
                            limite:100,
                            empresa_id:"03"
                        }
                    }
                };

               Request.realizarRequest(API.PEDIDOS.DISPONIBILIDAD, "POST", obj, function(data) {

                    if(data.status === 200){
                       var lotes = data.obj.existencias_producto;
                       for(var i in lotes){
                            $scope.agregarLote(lotes[i]);
                       }

                    } 
                });
           });

            $modalInstance.result.finally(function() {
                $scope.producto = {};
                $scope.lotes = [];
            });
            

           $scope.agregarLote = function(data){
                var lote = LoteProductoPedido.get(data.lote, data.fecha_vencimiento);
                lote.existencia_actual = data.existencia_actual;
                $scope.lotes.push(
                    lote
                );
           }

           $scope.lotes_producto = {
                data: 'lotes',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_lote', displayName: 'Código Lote'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento'},
                    {field: 'existencia_actual', displayName: 'Existencia'},
                    {field: 'cantidad_solicitada', displayName: 'Disponible'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEditarLote(row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in">Editar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };
            
            $scope.onEditarLote = function(row){
                console.log(row.entity);
                if(row.entity.codigo_lote == $scope.producto.lote.codigo_lote
                    && row.entity.fecha_vencimiento == $scope.producto.lote.fecha_vencimiento) {
                    return;
                }

                row.entity.selected = true
                $scope.producto.lote = row.entity;
                $scope.producto.cantidad_separada = 0;
            };

        }]);

});
