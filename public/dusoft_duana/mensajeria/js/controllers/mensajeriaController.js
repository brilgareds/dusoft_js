
define(["angular", "js/controllers",
], function (angular, controllers) {

    controllers.controller('mensajeriaController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "Mensaje",
        "Usuario",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Mensaje, Sesion) {

            var that = this;
            
            $scope.tinymceOptionsTabla = {
                menubar: false,
                toolbar: 'code',
                height: 250

            };

            that.init = function (callback) {

                $scope.session = {
                    usuario_id: Sesion.getUsuarioActual().getId(),
                    auth_token: Sesion.getUsuarioActual().getToken()
                };
                $scope.datos_view = {
                    termino_busqueda: ''
                };

                $scope.filtros = [
                    {nombre: "Asunto", id: 1},
                    {nombre: "Descripcion", id: 2}

                ];
                $scope.filtro = $scope.filtros[0];
                $scope.onSeleccionFiltro = function (filtro) {

                    $scope.filtro = filtro;
                    $scope.datos_view.termino_busqueda = '';

                };

                // Variable para paginacion
                $scope.paginas = 0;
                $scope.cantidad_items = 0;
                $scope.termino_busqueda = "";
                $scope.pagina_actual = 1;


                $scope.buscar_mensajes_usuario();
                callback();
            };

            $scope.crear_mensaje = function () {

                $state.go('CrearMensaje');

            };

            $scope.buscador_mensajes = function (ev) {

                if (ev.which == 13) {
                    $scope.buscar_mensajes_usuario();
                }
            };

            $scope.buscar_mensajes_usuario = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        termino_busqueda: $scope.datos_view.termino_busqueda,
                        filtro: $scope.filtro.id,
                        paginaActual: $scope.pagina_actual
                    }
                };

                Request.realizarRequest(API.MENSAJES.LISTAR_MENSAJES_TOTAL, "POST", obj, function (data) {

                    if (data.status === 200) {
                        $scope.cantidad_items = data.obj.mensajes.length;

                        if ($scope.cantidad_items === 0) {
                            AlertService.mostrarMensaje("warning", "no se encontraron registros");
                        }
                        that.renderMensajesUsuario(data.obj.mensajes);
                    }
                });
            };

            that.renderMensajesUsuario = function (mensajes) {

                $scope.datos_view.listado_mensajes = [];
                mensajes.forEach(function (data) {
                    var mensaje = Mensaje.get(data.actualizacion_id, data.usuario_id, data.asunto, data.descripcion, data.fecha_registro, data.fecha_validez);
                    mensaje.setCantidadLectores(data.cantidad_lectores);
                    mensaje.setPerfiles(data.perfiles);
                    mensaje.setNombreUsuario(data.nombre);
                    $scope.datos_view.listado_mensajes.push(mensaje);
                });
            };

            $scope.lista_mensajes = {
                data: 'datos_view.listado_mensajes',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                rowHeight: 50,
                columnDefs: [
                    {field: 'getAsunto()', displayName: 'Asunto', width: "20%"},
                    {field: 'getFechaRegistro()', displayName: 'Fecha Registro', width: "8%"},
                    {field: 'getFechaValidez()', displayName: "Fecha Validez", width: "8%"},
                    {field: 'getNombreUsuario()', displayName: 'Creador', width: "20%"},
                    {field: 'getDescripcion()', displayName: 'Detalle', width: "12%",
                        cellClass: "txt-center dropdown-button", cellTemplate: '<div class="btn-group">\
                     <button class="btn btn-default btn-xs" ng-click="verMensaje(row.entity)">Vista Previa <span class="glyphicon glyphicon-edit"></span></button>\
                 </div>'
                    },
                    {field: 'getPerfiles()', displayName: 'Perfiles', width: "20%"},
                    {displayName: 'Leido', width: "5%", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                     <p ng-hide="!validacionLectores(row.entity)">No<span></span></p>\
                     <button class="btn btn-default btn-xs" ng-hide="validacionLectores(row.entity)" ng-click="mostrarLectores(row.entity)">Si <span class="glyphicon glyphicon-edit"></span></button>\
                 </div>'
                    }
//                    ,
//                    {displayName: "Editar", width: "7%", cellClass: "txt-center dropdown-button",
//                        cellTemplate: '<div class="btn-group">\
//                     <p>Modificar<span></span></p>\
//                     </div>'}
                ]
            };

            $scope.validacionLectores = function (mensaje) {
                var disabled = true;

                if (mensaje.cantidad_lectores > 0) {
                    disabled = false;
                }
                return disabled;
            };

            $scope.verMensaje = function (mensaje) {

                AlertService.mostrarVentanaMensajeria(mensaje.asunto, mensaje.descripcion, 0);
            };

            $scope.mostrarLectores = function (mensaje) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-xs-lg',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/listarLectores.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                            that.listarLectores = function () {

                                var obj = {
                                    session: $scope.session,
                                    data: {
                                        id: mensaje.id
                                    }
                                };

                                Request.realizarRequest(API.MENSAJES.CONSULTAR_LECTURAS_MENSAJES, "POST", obj, function (data) {

                                    if (data.status === 200) {
                                        $scope.lectores = data.obj.lectores;
                                    }
                                });
                            };


                            that.listarLectores();

                            $scope.cerrar = function () {
                                $modalInstance.close();
                            };

                            $scope.listaLectores = {
                                data: 'lectores',
                                enableColumnResize: false,
                                enableRowSelection: false,
                                enableCellSelection: true,
                                enableHighlighting: true,
                                showFilter: true,
                                columnDefs: [
                                    {field: 'nombre', width: "60%", displayName: 'Nombre Usuario', cellClass: "ngCellText"},
                                    {field: 'fecha', width: "40%", displayName: 'Fecha Lectura', cellClass: "ngCellText"}

                                ]
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);


            };

            $scope.pagina_anterior = function () {
                if ($scope.paginaactual === 1)
                    return;
                $scope.pagina_actual--;
                $scope.buscar_mensajes_usuario($scope.termino_busqueda, true);
            };

            $scope.pagina_siguiente = function () {
                $scope.pagina_actual++;
                $scope.buscar_mensajes_usuario($scope.termino_busqueda, true);
            };

            that.init(function () {
            });

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});