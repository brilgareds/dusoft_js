
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {

    controllers.controller('PedidosClientesController', [
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
                                                    <td class="left"><strong>Total Cajas</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_cajas() }}</td>    \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Total Neveras</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_neveras() }}</td>                                        \
                                                </tr>\
                                            </tbody>\
                                        </table>\
                                    </div>\
                                 </div>',
                columnDefs: [
                    {field: 'get_tercero()', displayName: 'Cliente', width: "35%"},
                    {field: 'get_descripcion()', displayName: 'Documento', width: "25%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Temp. Neveras', width: "10%"},
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