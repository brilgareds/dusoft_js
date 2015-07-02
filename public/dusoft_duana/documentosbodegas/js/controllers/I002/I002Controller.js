
define([ 
    "angular", 
    "js/controllers", 
    'includes/slide/slideContent',
     "controllers/I002/GestionarProductosController",
], function(angular, controllers) {

    controllers.controller('I002Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter) {

            var that = this;


            $scope.datos_view = {
            };
            
            
            $scope.seleccionar_productos = function(){
                
                $scope.slideurl = "views/I002/gestionarproductos.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos');
                
            };
            
            $scope.cerrar_seleccion_productos = function() {

                $scope.$emit('cerrar_gestion_productos', {animado: true});                
            };

            $scope.lista_productos_ingresados = {
                data: 'orden_compra.get_productos()',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFooter: true,
                footerTemplate: '   <div class="row col-md-12">\
                                        <div class="">\
                                            <table class="table table-clear text-center">\
                                                <thead>\
                                                    <tr>\
                                                        <th class="text-center" >CANTIDAD</th>\
                                                        <th class="text-center">SUBTOTAL</th>\
                                                        <th class="text-center">IVA</th>\
                                                        <th class="text-center">RET-FTE</th>\
                                                        <th class="text-center">RETE-ICA</th>\
                                                        <th class="text-center">RETE-IVA</th>\
                                                        <th class="text-center">VALOR TOTAL</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody>\
                                                    <tr>\
                                                        <td class="right">50</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'politicas', displayName: 'Políticas', width: "20%"},
                    {field: 'cantidad_seleccionada', width: "7%", displayName: "Cantidad"},
                    {field: 'iva', width: "7%", displayName: "I.V.A (%)"},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "10%", cellFilter: "currency:'$ '"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ng-disabled="vista_previa" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };
            
            $scope.lista_productos_no_autorizados = {
                data: 'orden_compra.get_productos()',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,                
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'politicas', displayName: 'Políticas', width: "20%"},
                    {field: 'cantidad_seleccionada', width: "7%", displayName: "Cantidad"},
                    {field: 'iva', width: "7%", displayName: "I.V.A (%)"},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "10%", cellFilter: "currency:'$ '"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ng-disabled="vista_previa" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});