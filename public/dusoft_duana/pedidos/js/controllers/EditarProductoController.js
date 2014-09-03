define(["angular", "js/controllers",'models/Cliente',
        'models/Pedido', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('EditarProductoController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'Empresa','Cliente',
         'Pedido', 'API',"socket", "AlertService","producto",

        function(   $scope, $rootScope, Request,
                    $modal, Empresa, Cliente,
                    Pedido, API, socket, AlertService,producto) {
            
           $producto = producto;
           

           $scope.lotes_producto = {
                data: 'DocumentoTemporal.getPedido().getProductos()',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Nombre Producto'},
                    {field: 'existencia_lotes', displayName: 'Existencia Lotes'},
                    {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field: 'observacion', displayName: "Observación"},
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
