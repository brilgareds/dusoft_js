define(["angular", "js/controllers",'models/Cliente',
        'models/PedidoAuditoria', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('EditarProductoController', [
        '$scope', '$rootScope', 'Request', 
        '$modalInstance', 'Empresa','Cliente',
         'PedidoAuditoria', 'API',"socket", "AlertService","producto",

        function(   $scope, $rootScope, Request,
                    $modalInstance, Empresa, Cliente,
                    PedidoAuditoria, API, socket, AlertService,producto) {
            
           $scope.producto = producto;
           console.log("producto ",producto)


           $modalInstance.opened.then(function() {
                //Pedidos/consultarDisponibilidad
                /*obj.put("operario_id", "19");
                obj.put("empresa_id", "03");
                obj.put("identificador", (pedido.getTipoPedido() == 1)?"CL":"FM");
                obj.put("numero_pedido", pedido.getNumero());
                obj.put("limite", 20);
                obj.put("codigo_producto", producto.getCodigo());*/
               Request.realizarRequest(API.PEDIDOS.DISPONIBILIDAD, "POST", {}, function(data) {

                    /*if(data.status === 200){
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }*/
                });
           });
                       

           $scope.lotes_producto = {
                data: 'DocumentoTemporal.getPedido().getProductos()',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Lote'},
                    {field: 'descripcion', displayName: 'Fecha Vencimiento'},
                    {field: 'existencia_lotes', displayName: 'Existencia'},
                    {field: 'cantidad_solicitada', displayName: 'Disponible'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEditarRow(row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in">Editar</span>\n\
                                            </button>\n\
                                            <button class="btn btn-default btn-xs" ng-click="onRowClick(row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };
            

        }]);

});
