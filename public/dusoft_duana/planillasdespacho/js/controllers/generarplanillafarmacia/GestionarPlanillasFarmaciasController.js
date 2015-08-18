/**
 * 
 * @param {type} angular
 * @Author: Cristian Ardila
 * +Descripcion: COntrolador perteneciente a la vista (gestionarplanillasfarmacia.html)
 */
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {

    controllers.controller('GestionarPlanillasFarmaciasController', [
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
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Ciudad, Transportadora, UsuarioPlanilla, PlanillaDespacho, Documento, Usuario) {

            /*
             * 
             * @type variable global
             */
            var that = this;

            $scope.Empresa = Empresa;

            $scope.Empresa.limpiar_ciudades();
            $scope.Empresa.limpiar_transportadoras();

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                termino_busqueda_ciudades: '',
                termino_busqueda_documentos: '',
            };

            // Variables 
            $scope.planilla = PlanillaDespacho.get();
            $scope.planilla.set_numero_guia(parseInt(localStorageService.get("numero_guia")) || 0);
            $scope.planilla.set_fecha_registro($filter('date')(new Date(), "dd/MM/yyyy"));



            that.obtenerEmpresas = function() {

                var empresas = Usuario.getUsuarioActual().getEmpresasUsuario();

                $scope.Empresa.limpiar_empresas();

                empresas.forEach(function(empresa) {
                    $scope.Empresa.set_empresas(empresa);
                });

            };


            /**
             * type (Object)
             * +Descripcion: objeto que se enviara al controlador (GestionarDocumentosFarmaciaController.js
             * cuando se presione el boton (+Generar Planillas Farmacias), previamente se validara
             * cada una de las variables si se encuentran con contenido
             */
            that.validarEmpresa = function() {

                var empresa = Usuario.getUsuarioActual().getEmpresa();

                if (!empresa) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar una Empresa", tipo: "warning"});
                } else if (!empresa.getCentroUtilidadSeleccionado()) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar un Centro de Utilidad", tipo: "warning"});
                } else if (!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar una Bodega", tipo: "warning"});
                }
                
            };
            

            that.gestionar_consultas = function() {

                //  if ($scope.planilla.get_numero_guia() > 0)

                that.buscar_transportadoras(function() {

                    if ($scope.planilla.get_numero_guia() > 0) {
                        that.consultar_planilla_despacho(function(continuar) {
                            if (continuar) {
                                $scope.consultar_documentos_planilla_despacho();
                            }
                        });
                    }
                });

            };

            /**
             * @author Cristian Ardila
             * @param {string} termino_busqueda
             * +Descripcion: Metodo metodo que se encarga de realizar la peticion al
             * servidor consultando los trnasportadores
             */
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

            /**
             * @author Cristian Ardila
             * @param {Object} ciudades
             * +Descripcion: Metodo encargado de mapear el objecto json
             * de con la informacion de los transportadores contra el modelo trnasportadora
             */
            that.render_transportadoras = function(transportadoras) {


                $scope.Empresa.limpiar_transportadoras();
                transportadoras.forEach(function(data) {

                    var transportadora = Transportadora.get(data.id, data.descripcion, data.placa, data.estado);
                    transportadora.set_solicitar_guia(data.sw_solicitar_guia);

                    $scope.Empresa.set_transportadoras(transportadora);
                });
            };

            $scope.seleccionar_transportadora = function() {

            };





            $scope.buscador_documentos_planillas = function(ev) {
                if (ev.which === 13) {
                    $scope.consultar_documentos_planilla_despacho();
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
                $scope.planilla.set_cantidad_cajas(datos.total_cajas);
                $scope.planilla.set_cantidad_neveras(datos.total_neveras);
                $scope.planilla.set_numero_guia_externo(datos.numero_guia_externo);
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


            $scope.validar_btn_ingreso_documentos = function() {

                var disabled = false;

                // Validar que todos los campos esten diligenciados
                if ($scope.planilla.get_ciudad() === null || $scope.planilla.get_transportadora() === undefined || $scope.planilla.get_nombre_conductor() === '' || $scope.planilla.get_observacion() === '' || $scope.planilla.get_estado() === '2')
                    disabled = true;

                // Si la transportadora es externa solicita obligatoriamente el numero de guia    
                if ($scope.planilla.get_transportadora() !== undefined && $scope.planilla.get_transportadora().get_solicitar_guia() === '1') {
                    if ($scope.planilla.get_numero_guia_externo() === '')
                        disabled = true;
                }
                return disabled;
            };

            $scope.gestionar_documentos_farmacia = function() {

                    $scope.slideurl = "views/generarplanillafarmacia/gestionardocumentosfarmacia.html?time=" + new Date().getTime();
                    $scope.$emit('gestionar_documentos_farmacia');
                   
            };

            $scope.confirmar_eliminar_documento_planilla = function(documento) {

                $scope.planilla.set_documento(documento);

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
                                        <h4 ng-if="planilla.get_documentos().length === 1" ><b>¡Operacion Invalida!</b> La planilla no puede quedar sin documentos.</h4>\
                                        <h4 ng-if="planilla.get_documentos().length > 1">¿Eliminar documento <b>{{ planilla.get_documento().get_prefijo_numero() }}</b>?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelar_eliminacion_documento()">Cancelar</button>\
                                        <button class="btn btn-primary" ng-disabled="planilla.get_documentos().length === 1" ng-click="aceptar_eliminacion_documento()">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.aceptar_eliminacion_documento = function() {
                            $scope.eliminar_documento_planilla_despacho();
                            $modalInstance.close();
                        };

                        $scope.cancelar_eliminacion_documento = function() {
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.eliminar_documento_planilla_despacho = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                            empresa_id: $scope.planilla.get_documento().get_empresa_id(),
                            prefijo: $scope.planilla.get_documento().get_prefijo(),
                            numero: $scope.planilla.get_documento().get_numero(),
                            tipo: $scope.planilla.get_documento().get_tipo()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.ELIMINAR_DOCUMENTO, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.planilla.set_documento('');
                        $scope.consultar_documentos_planilla_despacho();
                    }
                });

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

            $scope.descargar_enviar_reporte = function() {

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
                    controller: function($scope, $modalInstance) {

                        $scope.descargar_reporte_pdf = function() {
                            $scope.generar_reporte($scope.planilla, true);
                            $modalInstance.close();
                        };

                        $scope.enviar_reporte_pdf_email = function() {
                            $scope.ventana_enviar_email($scope.planilla);
                            $modalInstance.close();
                        };

                        $scope.cancelar_generacion_reporte = function() {
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };



            $scope.cancelar_planilla_farmacia = function() {

                $state.go('GestionarPlanillasFarmacias');
            };

          //  console.log($scope.planilla.get_documentos());
            $scope.lista_documentos_bodega = {
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


            that.init = function() {

                that.validarEmpresa();
                
                that.obtenerEmpresas();

                that.gestionar_consultas();
            };

            that.init();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});