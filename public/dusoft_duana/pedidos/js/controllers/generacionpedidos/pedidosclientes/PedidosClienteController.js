
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {

    controllers.controller('PedidosClienteController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "$filter",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter) {

            var that = this;


            $scope.buscar_productos = function() {

                $scope.slideurl = "views/generacionpedidos/pedidosclientes/gestionarproductosclientes.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos_clientes');
            };
            
            $scope.cerrar_busqueda_productos = function() {                

                $scope.$emit('cerrar_gestion_productos_clientes',{animado: true});
            };

            $scope.lista_productos = {
                data: 'planilla.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                showFooter: true,
                footerTemplate: '<div class="row col-md-12">\
                                    <div class="col-md-3 pull-right">\
                                        <table class="table table-clear">\
                                            <tbody>\
                                                <tr>\
                                                    <td class="left"><strong>Subtotal</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_cajas() }}</td>    \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>I.V.A</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_neveras() }}</td>                                        \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Total</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_neveras() }}</td>                                        \
                                                </tr>\
                                            </tbody>\
                                        </table>\
                                    </div>\
                                 </div>',
                columnDefs: [
                    {field: 'get_tercero()', displayName: 'Codigo', width: "35%"},
                    {field: 'get_descripcion()', displayName: 'Descripcion', width: "25%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant.', width: "10%"},
                    {field: 'get_cantidad_neveras()', displayName: 'I.V.A', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Vlr. Unit', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Subtotal', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Total', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="confirmar_eliminar_documento_planilla(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});