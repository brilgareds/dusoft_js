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
            $scope.EmpresaOrigen = Usuario.getUsuarioActual().getEmpresa().getCodigo();
            
            $scope.Empresa.limpiar_transportadoras();

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                termino_busqueda_ciudades: '',
                termino_busqueda_documentos: ''
            };

            // Variables 
            $scope.planilla = PlanillaDespacho.get();
            $scope.planilla.set_numero_guia(parseInt(localStorageService.get("numero_guia")) || 0);
            $scope.planilla.set_fecha_registro($filter('date')(new Date(), "dd/MM/yyyy"));
            $scope.estadoNumeroGuia = true;


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

            /**
             * +Descripcion: Metodo encargado de invocar el metodo de las planillas
             * despachadas 
             * @returns {undefined}
             */
            that.gestionarConsultas = function() {

               
                that.buscarTransportadoras(function() {

                    if ($scope.planilla.get_numero_guia() > 0) {
                        that.consultarPlanillaDespacho(function(continuar) {
                            
                            if (continuar) {

                                $scope.consultarDocumentosPlanillaFarmacia();
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
            that.buscarTransportadoras = function(callback) {

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
                        that.renderTransportadoras(data.obj.transportadoras);
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
            that.renderTransportadoras = function(transportadoras) {


                $scope.Empresa.limpiar_transportadoras();
                transportadoras.forEach(function(data) {

                    var transportadora = Transportadora.get(data.id, data.descripcion, data.placa, data.estado);
                    transportadora.set_solicitar_guia(data.sw_solicitar_guia);

                    $scope.Empresa.set_transportadoras(transportadora);
                });
            };
           
            $scope.seleccionar_transportadora = function() {
          
                  if($scope.planilla.get_transportadora().get_id() === 4){
                      
                      $scope.estadoNumeroGuia = false;
                  }else{
                      $scope.estadoNumeroGuia = true;
                  }
                
            };

            that.consultarPlanillaDespacho = function(callback) {
                
                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_farmacia: {
                            planilla_id: $scope.planilla.get_numero_guia()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS_FARMACIAS.CONSULTAR_PLANILLA, "POST", obj, function(data) {


                    if (data.status === 200) {
                        that.renderPlanilla(data.obj.consultarPlanillaFarmacia[0]);
                        callback(true);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                });
            };

            that.renderPlanilla = function(datos) {
                
                var transportadora = Transportadora.get(datos.transportadora_id, datos.nombre_transportadora, datos.placa_vehiculo, datos.estado_transportadora);
                var usuario = UsuarioPlanilla.get(datos.usuario_id, datos.nombre_usuario);
                $scope.planilla = PlanillaDespacho.get(datos.id, transportadora, "", datos.nombre_conductor, datos.observacion, usuario, datos.fecha_registro, datos.fecha_despacho, datos.estado, datos.descripcion_estado);
                $scope.planilla.set_cantidad_cajas(datos.total_cajas);
                $scope.planilla.set_cantidad_neveras(datos.total_neveras);
                $scope.planilla.set_numero_guia_externo(datos.numero_guia_externo);
                $scope.planilla.set_empresa(Empresa.obtenerEmpresaPorCodigo(datos.id_empresa_destino));
             
              
            };
            
            /**
             * +Descripcion: Metodo que ejecuta el servicio encargado de mostrar
             * los documentos preparados en planilla
             * @author: Cristian Ardila
             */
            $scope.consultarDocumentosPlanillaFarmacia = function() {
               
                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_farmacia: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS_FARMACIAS.DOCUMENTOS_PLANILLA, "POST", obj, function(data) {
                        
                    if (data.status === 200) {
                        that.renderDocumentos(data.obj.planillas_farmacias);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });

            };
            that.renderDocumentos = function(documentos) {
               
                $scope.planilla.limpiar_documentos();

                documentos.forEach(function(data) {

                    var documento = Documento.get(data.id, data.empresa_id, data.prefijo, data.numero, data.numero_pedido, data.total_cajas, data.total_neveras, data.temperatura_neveras, data.observacion, data.tipo);
                    documento.set_tercero(data.descripcion_destino);

                    $scope.planilla.set_documentos(documento);

                });
               
            };

            /**
             * +Descripcion: Funcion que validara en la vista Gestionar planillas
             * farmacias, si todos los campos obligatorios estan diligenciados
             * y se es asi, el boton Buscar Remisiones se activara
             * @returns {disabled}
             */
            $scope.validar_btn_ingreso_documentos = function() {
                
                var disabled = false;
                // Validar que todos los campos esten diligenciados
                if ($scope.planilla.get_empresa() === null || $scope.planilla.get_transportadora() === undefined || 
                    $scope.planilla.get_nombre_conductor() === '' || $scope.planilla.get_observacion() === '' || $scope.planilla.get_estado() === '2')
                    disabled = true;

            
              if($scope.planilla.get_transportadora()!== undefined){
                    if ($scope.planilla.get_transportadora().get_id() === 4 && $scope.planilla.get_numero_guia_externo().length === 0){
                        disabled = true;
                }
              }
                return disabled;
            };
            
            /**
             * +Descripcion: metodo ejecutado por el slider para cambiar a la 
             * pagina donde se encuentran los documentos para despachar
             * 
             */
            $scope.gestionar_documentos_farmacia = function() {

                $scope.slideurl = "views/generarplanillafarmacia/gestionardocumentosfarmacia.html?time=" + new Date().getTime();
                $scope.$emit('gestionar_documentos_farmacia');
               
            };
            
            /**
             * +Descripcion: Metodo el cual despliega una ventana modal para
             * confirmar si se elimina o no un documento de la planilla
             * @author: Cristian Ardila
             * @param {type} documento
             */
            $scope.eliminarDocumentoPlanilla = function(documento) {

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
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.aceptar_eliminacion_documento = function() {
                            that.eliminarDocumentoPlanillaDevolucion();
                            $modalInstance.close();
                        };

                        $scope.cancelar_eliminacion_documento = function() {
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);

            };
            
            /**
             * +Descripcion: metodo encargado de ejecutar el servicio para eliminar
             * una documento asignado a una planilla
             * @author: Cristian Ardila
             * @returns {void}
             */
            that.eliminarDocumentoPlanillaDevolucion = function() {
             
                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_farmacia: {
                            planilla_id: $scope.planilla.get_numero_guia(), 
                            empresa_id: $scope.planilla.get_documento().get_empresa_id(),
                            prefijo: $scope.planilla.get_documento().get_prefijo(),
                            numero: $scope.planilla.get_documento().get_numero()
                            
                        }
                    }
                };
                
                Request.realizarRequest(API.PLANILLAS_FARMACIAS.ELIMINAR_DOCUMENTO, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);
                   
                    if (data.status === 200) {
                       
                       //Refrescar la grilla de los totales de caja y neveras
                        that.gestionarConsultas();
                       
                        $scope.planilla.set_documento('');
                        $scope.consultarDocumentosPlanillaFarmacia();
                    }
                });

            };
            /**
             * +Descripcion: Metodo encargado de cerrar el slider que reflieja
             * la grilla de los documentos que podran ser agregados a una planilla
             * @author: Cristian Ardila
             */
            $scope.cerrarRemisionesDocumentos = function() {
                that.gestionarConsultas(); 
                $scope.$emit('cerrar_gestion_documentos_bodega', {animado: true});
                $scope.estadoNumeroGuia = true;
                localStorageService.add("numero_guia", $scope.planilla.get_numero_guia());

            };

            /**
             * +Descripcion: Funcion encargada de pintar las opciones de despachar
             * y cancelar una devolucion
             * @author: Cristian Ardila
             */
            $scope.despacharPlanilla = function() {

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
                                        <h4>¿Desea despachar la <b>Guía No {{ planilla.get_numero_guia() }} </b> con destino a la bodega de<br><b>{{ planilla.get_empresa().getNombre() }}</b>?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelarDespacho()">Cancelar</button>\
                                        <button class="btn btn-primary" ng-click="aceptarDespacho()">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.aceptarDespacho = function() {
                            that.despachar_planilla_despacho();
                            $modalInstance.close();
                        };

                        $scope.cancelarDespacho = function() {
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);

            };

           
           /**
            * @author: Cristian Ardila
            * +Descripcion: Metodo que ejecuta el servicio para actualizar
            * el estado activo de una planilla a estado Despachado
            * @returns {void}
            */
            that.despachar_planilla_despacho = function() {
            
                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_farmacia: {
                            planilla_id: $scope.planilla.get_numero_guia()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS_FARMACIAS.DESPACHAR_PLANILLA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $state.go('GestionarPlanillasFarmacias');
                    }
                });
            };

           
            $scope.cancelarPlanillaFarmacia = function() {

                $state.go('GestionarPlanillasFarmacias');
            };
            
            /**
             * +Descripcion: Objeto que se invocara desde la vista para mostrar
             * una tabla con los documentos asignados a una planilla
             * @author: Cristian Ardila
             */
            $scope.listaDocumentosPlanillados = {
                data: 'planilla.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
               // showFooter: true,
                showFilter: true,
                footerTemplate: '<br><div class="row col-md-12">\
                                    <div class="col-md-3 pull-right">\
                                        <table class="table table-clear">\
                                            <tbody>\
                                                <tr>\
                                                    <td class="left"><strong>Total Cajas</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_cajas() }}</td>\
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
                    {field: 'get_prefijo_numero()', displayName: 'Documento', width: "25%"},
                    {field: 'get_prefijo_numero()', displayName: 'Documento', width: "1%", visible: false},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant. Cajas', width: "25%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Cant. Neveras', width: "20%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Temp. Neveras', width: "20%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",width: "10%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminarDocumentoPlanilla(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            that.validarEmpresa();

            that.obtenerEmpresas();

            that.gestionarConsultas();
           
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                localStorageService.remove("numero_guia");
              
            });
        }]);
});