
/* global G */

define(["angular", "js/controllers",
], function (angular, controllers) {

    controllers.controller('crearMensajeController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "Mensaje",
        "Usuario",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Mensaje, Sesion) {

            var that = this;
            var fechaActual = new Date();

            $scope.fechafinal = $filter('date')(fechaActual, "yyyy-MM-dd");

            $scope.abrirFechaFinal = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.abrirfechafinal = true;
            };

            $scope.tinymceModel = '';

            $scope.setContent = function () {
                $scope.tinymceModel = '';
                $scope.datos_view.perfil = '';
                $scope.datos_view.empresaSeleccionada = '';
                $scope.datos_view.perfilesSeleccionados = [];
                $scope.datos_view.perfilesSeleccionadosLetras = "";
                $scope.asunto = '';
            };

            $scope.tinymceOptions = {
                selector: "textarea",
                height: 300,
                theme: 'modern',
                plugins: 'print preview fullpage searchreplace autolink directionality  visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern',
                toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                image_advtab: true,
                templates: [
                    {title: 'Test template 1', content: 'Test 1'},
                    {title: 'Test template 2', content: 'Test 2'}
                ]
            };

            $scope.validacionCrearMensaje = function () {
                var disabled = true;

                if ($scope.tinymceModel.length > 0) {
                    disabled = false;
                }
                return disabled;
            };

//            $scope.tinymceOptionsTabla = {
//                menubar: false,
//                toolbar: 'code',
//                height: 250
//
//            };

            that.init = function (callback) {

                $scope.session = {
                    usuario_id: Sesion.getUsuarioActual().getId(),
                    auth_token: Sesion.getUsuarioActual().getToken()
                };
                $scope.datos_view = {
                    perfil: '',
                    empresaSeleccionada: '',
                    perfilesSeleccionados: [],
                    perfilesSeleccionadosLetras: ""
                };

                $scope.abrirfechafinal = false;
                $scope.asunto = '';

                callback();
            };

            $scope.volver = function () {

                $state.go('GestionarMensajes');

            };

            $scope.onBuscarPerfiles = function () {
                $scope.datos_view.perfil = null;
                that.buscarPerfiles();
            };

            that.buscarPerfiles = function () {
//                var usuario = Sesion.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: $scope.datos_view.empresaSeleccionada
                    }
                };
                Request.realizarRequest(API.MENSAJES.CONSULTAR_PERFILES, "POST", obj, function (data) {
                    if (data.status === 200) {
                        $scope.listPerfiles = data.obj.perfiles;
                        $scope.listPerfiles.push({perfil_id: -1, descripcion: 'Todos'});
//                        callback(data.obj.perfiles);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            that.buscarEmpresas = function (callback) {
                var obj = {
                    session: $scope.session,
                    data: {
                    }
                };
                Request.realizarRequest(API.MENSAJES.CONSULTAR_EMPRESAS, "POST", obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.listarEmpresas);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            $scope.boton_agregar_perfil = function () {

                if ($scope.datos_view.perfil) {
                    $scope.datos_view.perfil.obligatorio = false;
                    $scope.datos_view.perfilesSeleccionados.push($scope.datos_view.perfil);

                    if ($scope.datos_view.perfilesSeleccionadosLetras !== '') {
                        $scope.datos_view.perfilesSeleccionadosLetras += ", " + $scope.datos_view.perfil.descripcion;
                    } else {
                        $scope.datos_view.perfilesSeleccionadosLetras = $scope.datos_view.perfil.descripcion;
                    }


                }

            };

            $scope.guardarMensaje = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        usuario_id: $scope.session.usuario_id,
                        mensaje: $scope.tinymceModel,
                        fecha_fin: $filter('date')($scope.fechafinal, "yyyy-MM-dd") + " 23:59:00",
                        asunto: $scope.asunto,
                        listado: $scope.datos_view.perfilesSeleccionados
                    }
                };

                Request.realizarRequest(API.MENSAJES.INGRESAR_MENSAJE, "POST", obj, function (data) {
                    if (data.status === 200) {
                        $scope.setContent();
                        AlertService.mostrarMensaje("warning", "Registro Exitoso");

                    }
                });
            };

            that.init(function () {
//                that.buscarPerfiles(function (data) {
//                    $scope.listPerfiles = data;
//                });
                that.buscarEmpresas(function (data) {
                    $scope.listEmpresas = data;
                });
            });

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});