
define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('E009Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        "EmpresaIngreso",
        "DocumentoIngreso",
        "ProveedorIngreso",
        "OrdenCompraIngreso",
        "Usuario",
        "ProductoIngreso",
        "E009Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Empresa, Documento, Proveedor, OrdenCompra, Sesion, Producto, E009Service) {

            var that = this;


            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };


            that.init = function (callback) {
                $scope.root = {};
                $scope.selectedBodega = '';
                callback();
            };


            that.buscarBodega = function (callback) {
                var obj = {
                    session: $scope.session
                };
                E009Service.buscarBodega(obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.listarBodegas);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };
            that.init(function () {
                that.buscarBodega(function (data) {
                    $scope.bodegas = data;
                });
            });

        }]);
});