
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('GestionarDocumentosBodegaController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Sesion) {

            var that = this;

            $scope.opcion_predeterminada = "0";

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };


            $rootScope.$on('gestionar_documentos_bodegaCompleto', function(e, parametros) {


            });

            $rootScope.$on('cerrar_gestion_documentos_bodegaCompleto', function(e, parametros) {



                $scope.$$watchers = null;
            });


            $scope.datos_clientes_farmacias = [];
            $scope.datos_documentos_bodega = [];

            $scope.seleccionar_cliente_farmacia = function() {

                console.log('==================================');
                console.log('== seleccionar_cliente_farmacia ==');
                console.log($scope.opcion_predeterminada);
                console.log('==================================');

                if ($scope.opcion_predeterminada === "0") {
                    that.buscar_farmacias();
                }

                if ($scope.opcion_predeterminada === "1") {
                    that.buscar_clientes();
                }


            };

            that.buscar_clientes = function() {

                $scope.datos_clientes_farmacias = [];

                for (i = 0; i < 30; i++) {
                    $scope.datos_clientes_farmacias.push({nombre: 'nombre_cliente_' + i});
                }

                that.documentos_bodega_clientes();
            };

            that.documentos_bodega_clientes = function() {

                $scope.datos_documentos_bodega = [];

                for (i = 0; i < 30; i++) {
                    $scope.datos_documentos_bodega.push({documento_bodega: 'EFC Clientes' + i});
                }
            };

            that.buscar_farmacias = function() {

                $scope.datos_clientes_farmacias = [];

                for (i = 0; i < 30; i++) {
                    $scope.datos_clientes_farmacias.push({nombre: 'nombre_farmacia_' + i});
                }
                that.documentos_bodega_farmacias();
            };

            that.documentos_bodega_farmacias = function() {

                $scope.datos_documentos_bodega = [];

                for (i = 0; i < 30; i++) {
                    $scope.datos_documentos_bodega.push({documento_bodega: 'EFC Farmacias' + i});
                }
            };

            $scope.lista_clientes_farmacias = {
                data: 'datos_clientes_farmacias',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre', width: "85%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs"  ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.lista_remisiones_bodega = {
                data: 'datos_documentos_bodega',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'documento_bodega', displayName: 'Documento Bodega', width: "85%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs"  ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };


            $scope.seleccionar_cliente_farmacia();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});