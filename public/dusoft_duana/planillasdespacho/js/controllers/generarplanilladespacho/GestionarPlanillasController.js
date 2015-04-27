
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {

    controllers.controller('GestionarPlanillasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "EmpresaPlanillaDespacho",
        "Ciudad",
        "Transportadora",
        "UsuarioPlanillaDespacho",
        "PlanillaDespacho",
        "Documento",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Empresa, Ciudad, Transportadora, UsuarioPlanilla, PlanillaDespacho, Documento, Sesion) {

            var that = this;
            $scope.Empresa = Empresa;

            $scope.Empresa.limpiar_ciudades();
            $scope.Empresa.limpiar_transportadoras();

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables 
            $scope.planilla = PlanillaDespacho.get();
            $scope.planilla.set_numero_guia(parseInt(localStorageService.get("numero_guia")) || 0);
            $scope.planilla.set_fecha_registro($filter('date')(new Date(), "dd/MM/yyyy"));

            $scope.datos_view = {
                termino_busqueda_ciudades: '',
                termino_busqueda_documentos: ''
            };

            $scope.datos_planilla = [];

            that.gestionar_consultas = function() {

                that.buscar_ciudades(function(ciudades) {

                    if ($scope.planilla.get_numero_guia() > 0)
                        that.render_ciudades(ciudades);

                    that.buscar_transportadoras(function() {

                        if ($scope.planilla.get_numero_guia() > 0) {
                            that.consultar_planilla_despacho(function(continuar) {
                                if (continuar) {
                                    $scope.consultar_documentos_planilla_despacho();
                                }
                            });
                        }
                    });
                });
            };

            $scope.listar_ciudades = function(termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_ciudades = termino_busqueda;
                that.buscar_ciudades(function(ciudades) {
                    that.render_ciudades(ciudades);
                });
            };

            that.buscar_ciudades = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ciudades: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_ciudades
                        }
                    }
                };

                Request.realizarRequest(API.CIUDADES.LISTAR_CIUDADES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        callback(data.obj.ciudades);
                    }
                });
            };

            that.render_ciudades = function(ciudades) {

                $scope.Empresa.limpiar_ciudades();
                ciudades.forEach(function(data) {

                    var ciudad = Ciudad.get(data.pais_id, data.nombre_pais, data.departamento_id, data.nombre_departamento, data.id, data.nombre_ciudad);
                    $scope.Empresa.set_ciudades(ciudad);
                });
            };

            $scope.seleccionar_ciudad = function() {

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
                    $scope.Empresa.set_transportadoras(transportadora);
                });
            };

            $scope.seleccionar_transportadora = function() {

            };

            $scope.buscador_documentos_planillas = function(ev) {
                if (ev.which == 13) {
                    $scope.consultar_documentos_planilla_despacho()
                }
            };

            that.consultar_planilla_despacho = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.CONSULTAR_PLANILLA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_planilla(data.obj.planillas_despachos[0]);
                        callback(true);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                });
            };

            that.render_planilla = function(datos) {

                var ciudad = Ciudad.get(datos.pais_id, datos.nombre_pais, datos.departamento_id, datos.nombre_departamento, datos.ciudad_id, datos.nombre_ciudad);
                var transportadora = Transportadora.get(datos.transportadora_id, datos.nombre_transportadora, datos.placa_vehiculo, datos.estado_transportadora);
                var usuario = UsuarioPlanilla.get(datos.usuario_id, datos.nombre_usuario);
                $scope.planilla = PlanillaDespacho.get(datos.id, transportadora, ciudad, datos.nombre_conductor, datos.observacion, usuario, datos.fecha_registro, datos.fecha_despacho, datos.estado, datos.descripcion_estado);
            };

            $scope.consultar_documentos_planilla_despacho = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.DOCUMENTOS_PLANILLA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_documentos(data.obj.planillas_despachos);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });

            };
            that.render_documentos = function(documentos) {

                $scope.planilla.limpiar_documentos();

                documentos.forEach(function(data) {

                    var documento = Documento.get(data.id, data.empresa_id, data.prefijo, data.numero, data.numero_pedido, data.cantidad_cajas, data.cantidad_neveras, data.temperatura_neveras, data.observacion, data.tipo);
                    documento.set_tercero(data.descripcion_destino);

                    $scope.planilla.set_documentos(documento);
                });

            };


            $scope.gestionar_documentos_bodega = function() {

                $scope.slideurl = "views/generarplanilladespacho/gestionardocumentosbodegas.html?time=" + new Date().getTime();
                $scope.$emit('gestionar_documentos_bodega');


            };

            $scope.cerrar_gestion_documentos_bodega = function() {

                $scope.$emit('cerrar_gestion_documentos_bodega', {animado: true});

                localStorageService.add("numero_guia", $scope.planilla.get_numero_guia());

                that.gestionar_consultas();

            };


            $scope.confirmar_despacho_planilla = function() {


                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>¿Desea despachar la <b>Guía No {{ planilla.get_numero_guia() }} </b> con destino a la ciudad de<br><b>{{ planilla.get_ciudad().get_nombre_ciudad() }}</b>?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelar_despacho()">Cancelar</button>\
                                        <button class="btn btn-primary" ng-click="aceptar_despacho()">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.aceptar_despacho = function() {
                            $scope.despachar_planilla_despacho();
                            $modalInstance.close();
                        };

                        $scope.cancelar_despacho = function() {
                            $modalInstance.close();
                        };
                    },
                    resolve: {
                        mensaje_sistema: function() {
                            return $scope.mensaje_sistema;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.despachar_planilla_despacho = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                        }
                    }
                };


                Request.realizarRequest(API.PLANILLAS.DESPACHAR_PLANILLA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $state.go('GestionarPlanillas');
                    }
                });
            };

            $scope.cancelar_planilla_despacho = function() {

                $state.go('GestionarPlanillas');
            };


            $scope.lista_documentos_bodega = {
                data: 'planilla.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'get_tercero()', displayName: 'Cliente', width: "35%"},
                    {field: 'get_descripcion()', displayName: 'Documento', width: "25%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Temp. Neveras', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ng-disabled="vista_previa" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            that.gestionar_consultas();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});