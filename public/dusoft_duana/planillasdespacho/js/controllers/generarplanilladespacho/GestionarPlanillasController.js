
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function (angular, controllers) {

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
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Empresa, Ciudad, Transportadora, UsuarioPlanilla, PlanillaDespacho, Documento, Sesion) {

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
                termino_busqueda_documentos: '',
                docSeleccionados: []
            };
            $scope.datos_view.prefijosPlanilla = [
                {prefijo: 'I', descripcion: "INSUMOS"},
                {prefijo: 'M', descripcion: "MEDICAMENTOS"},
                {prefijo: 'N', descripcion: "NUTRICION"}
            ];

            $scope.datos_planilla = [];

            that.gestionar_consultas = function () {

//                that.buscar_ciudades(function (ciudades) {
//
//                    if ($scope.planilla.get_numero_guia() > 0)
//                        that.render_ciudades(ciudades);

                that.buscar_transportadoras(function () {

                    if ($scope.planilla.get_numero_guia() > 0) {
                        that.consultar_planilla_despacho(function (continuar) {
                            if (continuar) {
                                $scope.consultar_documentos_planilla_despacho();
                            }
                        });
                    }
                });
//                });
            };

            $scope.gestionar_consultas = function () {
                that.gestionar_consultas();
            };

            $scope.listar_ciudades = function (termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_ciudades = termino_busqueda;
                that.buscar_ciudades(function (ciudades) {
                    that.render_ciudades(ciudades);
                });
            };

            that.buscar_ciudades = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ciudades: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_ciudades
                        }
                    }
                };

                Request.realizarRequest(API.CIUDADES.LISTAR_CIUDADES, "POST", obj, function (data) {

                    if (data.status === 200) {
                        callback(data.obj.ciudades);
                    }
                });
            };

            that.render_ciudades = function (ciudades) {

                $scope.Empresa.limpiar_ciudades();
                ciudades.forEach(function (data) {

                    var ciudad = Ciudad.get(data.pais_id, data.nombre_pais, data.departamento_id, data.nombre_departamento, data.id, data.nombre_ciudad);
                    $scope.Empresa.set_ciudades(ciudad);
                });
            };

            $scope.seleccionar_ciudad = function () {

            };

            that.buscar_transportadoras = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        transportadoras: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.TRANSPORTADORAS.LISTAR_TRANSPORTADORAS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_transportadoras(data.obj.transportadoras);
                        callback(true);
                    }
                });
            };

            that.render_transportadoras = function (transportadoras) {


                $scope.Empresa.limpiar_transportadoras();
                transportadoras.forEach(function (data) {

                    var transportadora = Transportadora.get(data.id, data.descripcion, data.placa, data.estado);
                    transportadora.set_solicitar_guia(data.sw_solicitar_guia);

                    $scope.Empresa.set_transportadoras(transportadora);
                });
            };

            $scope.seleccionar_transportadora = function () {
                $scope.planilla.set_numero_placa_externo($scope.planilla.transportadora.placa);
            };

            $scope.buscador_documentos_planillas = function (ev) {
                if (ev.which === 13) {
                    $scope.consultar_documentos_planilla_despacho();
                }
            };

            that.consultar_planilla_despacho = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.CONSULTAR_PLANILLA, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_planilla(data.obj.planillas_despachos[0]);
                        callback(true);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                });
            };

            that.render_planilla = function (datos) {

//                var ciudad = Ciudad.get(datos.pais_id, datos.nombre_pais, datos.departamento_id, datos.nombre_departamento, datos.ciudad_id, datos.nombre_ciudad);
                var ciudad = '';
                var transportadora = Transportadora.get(datos.transportadora_id, datos.nombre_transportadora, datos.placa_vehiculo, datos.estado_transportadora);
                var usuario = UsuarioPlanilla.get(datos.usuario_id, datos.nombre_usuario);
                var tipo_planilla = {};

                if (datos.tipo_planilla === 'M') {
                    tipo_planilla = {prefijo: 'M', descripcion: "MEDICAMENTOS"};
                } else if (datos.tipo_planilla === 'I') {
                    tipo_planilla = {prefijo: 'I', descripcion: "INSUMOS"};
                } else if (datos.tipo_planilla === 'N') {
                    tipo_planilla = {prefijo: 'N', descripcion: "NUTRICION"};
                }
                $scope.planilla = PlanillaDespacho.get(datos.id, transportadora, ciudad, datos.nombre_conductor, datos.observacion, usuario, datos.fecha_registro,
                        datos.fecha_despacho, datos.estado, datos.descripcion_estado, tipo_planilla);
                $scope.planilla.set_cantidad_cajas(datos.total_cajas);
                $scope.planilla.set_cantidad_neveras(datos.total_neveras);
                $scope.planilla.set_cantidad_bolsas(datos.total_bolsas);
                $scope.planilla.set_numero_guia_externo(datos.numero_guia_externo);
                $scope.planilla.set_numero_placa_externo(datos.numero_placa_externo);
            };

            $scope.consultar_documentos_planilla_despacho = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.DOCUMENTOS_PLANILLA, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_documentos(data.obj.planillas_despachos);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });

            };

            that.render_documentos = function (documentos) {

                $scope.planilla.limpiar_documentos();

                documentos.forEach(function (data) {

                    var documento = Documento.get(data.id, data.empresa_id, data.prefijo, data.numero, data.numero_pedido, data.cantidad_cajas, data.cantidad_neveras, data.cantidad_bolsas, data.temperatura_neveras, data.observacion, data.tipo);
                    documento.set_tercero(data.descripcion_destino);
                    documento.lio_id = data.lio_id;

                    $scope.planilla.set_documentos(documento);
                });

            };

            $scope.validar_btn_ingreso_documentos = function () {

                var disabled = false;

                // Validar que todos los campos esten diligenciados
                if (/*$scope.planilla.get_ciudad() === null ||*/ $scope.planilla.get_transportadora() === undefined || $scope.planilla.get_nombre_conductor() === '' || $scope.planilla.get_observacion() === '' || $scope.planilla.get_estado() === '2')
                    disabled = true;

                // Si la transportadora es externa solicita obligatoriamente el numero de guia    
                if ($scope.planilla.get_transportadora() !== undefined && $scope.planilla.get_transportadora().get_solicitar_guia() === '1') {
                    if ($scope.planilla.get_numero_guia_externo() === '')
                        disabled = true;
                }
                return disabled;
            };

            $scope.gestionar_documentos_bodega = function () {

                $scope.slideurl = "views/generarplanilladespacho/gestionardocumentosbodegas.html?time=" + new Date().getTime();
                $scope.$emit('gestionar_documentos_bodega');


            };

            $scope.confirmar_eliminar_documento_planilla = function () {

//                $scope.planilla.set_documento(documento);

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
                                        <h4>¿Eliminar documentos?</h4>\
                                        <!--h4>¿Eliminar documento <b>{{ planilla.get_documento().get_prefijo_numero() }}</b>?</h4-->\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelar_eliminacion_documento()">Cancelar</button>\
                                        <button class="btn btn-primary" ng-click="aceptar_eliminacion_documento(datos_view.docSeleccionados)">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                            $scope.aceptar_eliminacion_documento = function (elementos) {
                                $scope.eliminar_documento_planilla_despacho(elementos);
                                $modalInstance.close();
                            };

                            $scope.cancelar_eliminacion_documento = function () {
                                $modalInstance.close();
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.eliminar_documento_planilla_despacho = function (elementos) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                            elementos: elementos
                        }
                    }
                };
                
                Request.realizarRequest(API.PLANILLAS.ELIMINAR_DOCUMENTO, "POST", obj, function (data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.planilla.set_documento('');
                        $scope.consultar_documentos_planilla_despacho();
                    }
                });

            };

            $scope.cerrar_gestion_documentos_bodega = function () {

                $scope.$emit('cerrar_gestion_documentos_bodega', {animado: true});

                localStorageService.add("numero_guia", $scope.planilla.get_numero_guia());

                that.gestionar_consultas();

            };

            $scope.confirmar_despacho_planilla = function () {


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
                                        <h4>¿Desea despachar la <b>Guía No {{ planilla.get_numero_guia() }} </b> ?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelar_despacho()">Cancelar</button>\
                                        <button class="btn btn-primary" ng-click="aceptar_despacho()">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                            $scope.aceptar_despacho = function () {
                                $scope.despachar_planilla_despacho();
                                $modalInstance.close();
                            };

                            $scope.cancelar_despacho = function () {
                                $modalInstance.close();
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.despachar_planilla_despacho = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia()
                        }
                    }
                };


                Request.realizarRequest(API.PLANILLAS.DESPACHAR_PLANILLA, "POST", obj, function (data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $state.go('GestionarPlanillas');
                    }
                });
            };

            $scope.descargar_enviar_reporte = function () {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="cancelar_generacion_reporte()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                            <div class="btn-group" role="group">\
                                              <button type="button" class="btn btn-success" ng-click="descargar_reporte_pdf()" ><span class="glyphicon glyphicon-cloud-download"></span> Descargar PDF</button>\
                                            </div>\
                                            <div class="btn-group" role="group">\
                                              <button type="button" class="btn btn-primary" ng-click="enviar_reporte_pdf_email()" ><span class="glyphicon glyphicon-send"></span> Enviar por Email</button>\
                                            </div>\
                                        </div>\
                                    </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                            $scope.descargar_reporte_pdf = function () {
                                $scope.generar_reporte($scope.planilla, true);
                                $modalInstance.close();
                            };

                            $scope.enviar_reporte_pdf_email = function () {
                                $scope.ventana_enviar_email($scope.planilla);
                                $modalInstance.close();
                            };

                            $scope.cancelar_generacion_reporte = function () {
                                $modalInstance.close();
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.cancelar_planilla_despacho = function () {

                $state.go('GestionarPlanillas');
            };

            $scope.lista_documentos_bodega = {
                data: 'planilla.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                showFooter: true,
                footerTemplate: '<div class="row col-md-12">\
                                    <div class="btn-group pull-right">\
                                        <button class="btn btn-default btn-xs" ng-click="confirmar_eliminar_documento_planilla()" ng-disabled="planilla.get_estado()==\'2\' || datos_view.docSeleccionados.length < 1" ><span class="glyphicon glyphicon-remove">Eliminar</span></button>\
                                    </div>\
                                </div>\
                                <br>\
                                <hr>\
                                <div class="row col-md-12">\
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
                                                <tr>\
                                                    <td class="left"><strong>Total Bolsas</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_bolsas() }}</td>                                        \
                                                </tr>\
                                            </tbody>\
                                        </table>\
                                    </div>\
                                 </div>',
                columnDefs: [
                    {field: 'get_tercero()', displayName: 'Cliente', width: "25%"},
                    {field: 'get_descripcion()', displayName: 'Documento', width: "20%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'get_cantidad_bolsas()', displayName: 'Cant. Bolsas', width: "10%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Temp. Neveras', width: "10%"},
                    {displayName: "Modificar", width: "7%", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="modificar_documento_planilla(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-pencil"></span></button>\
                                        </div>'
                    },
                    {field: '', cellClass: "checkseleccion", width: "5%",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-click='onDocSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"}
                ]
            };

            $scope.modificar_documento_planilla = function (docSelec) {
                var documentos = $scope.planilla.get_documentos();
                var DocsLio = [];
                documentos.forEach(function (documento) {

                    if (documento.lio_id !== null && documento.lio_id === docSelec.lio_id) {
                        DocsLio.push(documento);
                    }
                });

                if (DocsLio.length > 0) {

                    that.mostrarVentanaLiosModificar(DocsLio);

                } else {
                    that.verModificarUnico(docSelec);
                }


            };


            $scope.onDocSeleccionado = function (check, row) {

                row.selected = check;
                if (check) {
                    that.agregarEFC(row.entity);
                } else {

                    that.quitarEFC(row.entity);
                }

            };

            that.quitarEFC = function (doc) {
                for (var i in $scope.datos_view.docSeleccionados) {
                    var _doc = $scope.datos_view.docSeleccionados[i];
                    if (_doc.prefijo === doc.prefijo && _doc.numero === doc.numero) {
                        $scope.datos_view.docSeleccionados.splice(i, true);
                        break;
                    }
                }
            };

            that.agregarEFC = function (doc) {
                $scope.datos_view.docSeleccionados.push(doc);
            };


            that.mostrarVentanaLiosModificar = function (documentos) {
                $scope.opts = {
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: 'views/generarplanilladespacho/gestionarLios.html',
                    controller: "GestionarLiosController",
                    scope: $scope,
                    resolve: {
                        documentos: function () {
                            return documentos;
                        },
                        tipo: function () {
                            return 4;
                        },
                        numeroGuia: function () {
                            return $scope.planilla.get_numero_guia();
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);

            };

            that.verModificarUnico = function (datos) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-ls-xlg-ls',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/generarplanilladespacho/modificarDocumentos.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                            $scope.DocModificar = datos;

                            $scope.cerrar = function () {
                                $modalInstance.close();
                            };

                            /**
                             * +Descripcion Metodo encargado de validar la activacion del boton guardar
                             * @author German Galvis
                             * @fecha 27/04/2019 DD/MM/YYYY
                             * @returns {undefined}
                             */
                            $scope.habilitarGuardar = function () {
                                var disabled = false;

                                if ($scope.DocModificar.cantidad_cajas === undefined || $scope.DocModificar.cantidad_cajas === "" || parseInt($scope.DocModificar.cantidad_cajas) < 0) {
                                    disabled = true;
                                } else if ($scope.DocModificar.cantidad_neveras === undefined || $scope.DocModificar.cantidad_neveras === "" || parseInt($scope.DocModificar.cantidad_neveras) < 0) {
                                    disabled = true;
                                } else if ($scope.DocModificar.cantidad_bolsas === undefined || $scope.DocModificar.cantidad_bolsas === "" || parseInt($scope.DocModificar.cantidad_bolsas) < 0) {
                                    disabled = true;
                                } else if (parseInt($scope.DocModificar.cantidad_cajas) == 0 && parseInt($scope.DocModificar.cantidad_neveras) == 0 && parseInt($scope.DocModificar.cantidad_bolsas) == 0) {
                                    disabled = true;
                                }

                                return disabled;
                            };


                            $scope.guardarDoc = function () {

                                var obj = {
                                    session: $scope.session,
                                    data: {
                                        documento: $scope.DocModificar,
                                        tipo: $scope.DocModificar.tipo
                                    }
                                };

                                Request.realizarRequest(API.PLANILLAS.MODIFICAR_DOCUMENTO_PLANILLA, "POST", obj, function (data) {

                                    if (data.status === 200) {
                                        AlertService.mostrarMensaje("warning", data.msj);
                                        that.gestionar_consultas();
                                        $modalInstance.close();

                                    } else {
                                        AlertService.mostrarMensaje("warning", data.msj);
                                    }
                                });

                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);


            };

            $scope.actualizar_planilla_despacho = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            transportador_id: $scope.planilla.get_transportadora().get_id(),
                            nombre_conductor: $scope.planilla.get_nombre_conductor(),
                            observacion: $scope.planilla.get_observacion(),
                            numero_guia_externo: $scope.planilla.get_numero_guia_externo(),
                            numero_placa_externo: $scope.planilla.get_numero_placa_externo(),
                            tipo_planilla: $scope.planilla.tipo_planilla.prefijo,
                            numeroPlanilla: $scope.planilla.get_numero_guia()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.MODIFICAR_PLANILLA, "POST", obj, function (data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                });
            };


            that.gestionar_consultas();

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});