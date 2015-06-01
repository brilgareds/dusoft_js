
define(["angular", "js/controllers"
], function(angular, controllers) {

    controllers.controller('GestionarRecepcionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "EmpresaOrdenCompra",
        "RecepcionMercancia",
        "ProveedorOrdenCompra",
        "Transportadora",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Recepcion, Proveedor, Transportadora, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables 
            $scope.recepcion = Recepcion.get();

            $scope.datos_view = {
                termino_busqueda_proveedores: '',
                btn_agregar_eliminar_registro: true,
                disabled_agregar_eliminar_registro: true,
                recepciones: []
            };



            $scope.listar_proveedores = function(termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_proveedores = termino_busqueda;

                that.buscar_proveedores(function(proveedores) {

                    that.render_proveedores(proveedores);
                });
            };

            that.buscar_proveedores = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_proveedores
                        }
                    }
                };

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {

                        callback(data.obj.proveedores);
                    }
                });
            };

            that.render_proveedores = function(proveedores) {

                $scope.Empresa.limpiar_proveedores();

                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            $scope.seleccionar_proveedor = function() {
                console.log($scope.recepcion);
            };

            that.buscar_transportadoras = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        transportadoras: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.TRANSPORTADORAS.LISTAR_TRANSPORTADORAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_transportadoras(data.obj.transportadoras);
                        callback(true);
                    }
                });
            };

            that.render_transportadoras = function(transportadoras) {


                $scope.Empresa.limpiar_transportadoras();
                transportadoras.forEach(function(data) {

                    var transportadora = Transportadora.get(data.id, data.descripcion, data.placa, data.estado);
                    transportadora.set_solicitar_guia(data.sw_solicitar_guia);

                    $scope.Empresa.set_transportadoras(transportadora);
                });
            };

            $scope.agregar_eliminar_registro = function() {

                if ($scope.datos_view.btn_agregar_eliminar_registro) {
                    $scope.agregar_registro();
                    $scope.datos_view.btn_agregar_eliminar_registro = false;
                } else {
                    $scope.eliminar_registro();
                    $scope.datos_view.btn_agregar_eliminar_registro = true;
                }
            };

            $scope.agregar_registro = function() {

                $scope.datos_view.recepciones.push({
                    disabled_btn: false,
                    class_btn_add: 'glyphicon glyphicon-plus',
                    fn_btn_add: $scope.agregar_anexo
                });
            };

            $scope.eliminar_registro = function() {

                $scope.datos_view.recepciones.pop();
            };

            $scope.agregar_anexo = function(row) {

                row.disabled_btn = true;

                $scope.datos_view.disabled_agregar_eliminar_registro = true;

                $scope.datos_view.recepciones.push({
                    disabled_btn: false,
                    class_btn_add: 'glyphicon glyphicon-minus',
                    fn_btn_add: $scope.eliminar_anexo
                });
            };

            $scope.eliminar_anexo = function() {
                $scope.datos_view.recepciones.pop();

                var row = $scope.datos_view.recepciones[$scope.datos_view.recepciones.length - 1];
                row.disabled_btn = false;

                $scope.datos_view.disabled_agregar_eliminar_registro = true;
            };

            $scope.crear_recepcion = function(row) {

                $scope.datos_view.disabled_agregar_eliminar_registro = false;
                $scope.datos_view.btn_agregar_eliminar_registro = true;

                row.disabled_btn = true;
            };

            $scope.cancelar_recepcion = function() {
                $state.go('ListarRecepciones');
            };

            $scope.finalizar_recepcion = function() {
                $state.go('ListarRecepciones');
            };

            $scope.agregar_registro();
            that.buscar_transportadoras();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});