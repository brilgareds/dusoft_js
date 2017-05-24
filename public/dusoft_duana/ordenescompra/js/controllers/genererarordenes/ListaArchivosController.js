
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ListaArchivosController', [
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
        "Usuario", "$sce","$modalInstance","archivos",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                 Sesion, $sce,$modalInstance, archivos) {

            var that = this;
            
            
            $scope.root = {
                archivos : archivos
            };
                
            $scope.listaArchivos = {
                data: 'root.archivos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter:true,
                columnDefs: [
                    {field: 'nombreProducto', displayName: 'Producto', width:"60%"},
                    {field: 'descripcionNovedad', displayName: 'Novedad', width:"30%"},
                    {field: '', displayName: 'Archivo', width:"10%", 
                        cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onDescargarArchivo(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-download-alt"></span></button>\
                                      </div>'
                    }
                ]
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de descarga
            * @params archivo<ArchivoNovedadOrdenCompra> 
            * @fecha 2017-05-05
            */
            $scope.onDescargarArchivo = function(archivo){
                $scope.visualizarReporte("/OrdenesCompras/Novedades/" + archivo.get_descripcion(), archivo.get_descripcion(), "download");
            };

            $scope.cerrarVentanaFactura = function(){

                $modalInstance.close();
            };
                
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});
