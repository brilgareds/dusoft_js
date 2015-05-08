
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('GestionarDocumentosBodegaController', [
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
        "EmpresaPlanillaDespacho",
        "ClientePlanillaDespacho",
        "FarmaciaPlanillaDespacho",
        "Documento",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Empresa, ClientePlanilla, FarmaciaPlanilla, Documento, Sesion) {

            var that = this;



            $rootScope.$on('gestionar_documentos_bodegaCompleto', function(e, parametros) {

                $scope.datos_view = {
                    opcion_predeterminada: "0", // 0 = farmacias 1 = clientes 2 = Otras Empresas
                    termino_busqueda: '',
                    termino_busqueda_documentos: '',
                    tercero_seleccionado: FarmaciaPlanilla.get(), // tercero_seleccionado es una Farmacia por ser la opcion_predeterminada = 0
                    documento_seleccionado: Documento.get()
                };

                $scope.datos_clientes_farmacias = [];

                $scope.seleccionar_cliente_farmacia();

            });

            $rootScope.$on('cerrar_gestion_documentos_bodegaCompleto', function(e, parametros) {

                $scope.datos_view = null;
                $scope.$$watchers = null;

            });


            $scope.buscador_cliente_farmacia = function(ev) {

                if (ev.which == 13) {
                    $scope.seleccionar_cliente_farmacia();
                }
            };

            $scope.buscador_documentos = function(ev) {

                if (ev.which == 13) {
                    $scope.buscar_documentos_bodega($scope.datos_view.tercero_seleccionado);
                }
            };

            $scope.seleccionar_cliente_farmacia = function() {

                $scope.datos_view.tercero_seleccionado.limpiar_documentos();
                //$scope.datos_view.termino_busqueda = '';
                $scope.datos_view.termino_busqueda_documentos = '';
                $scope.datos_view.documento_seleccionado = Documento.get();

                if ($scope.datos_view.opcion_predeterminada === "0") {
                    that.buscar_farmacias();
                }

                if ($scope.datos_view.opcion_predeterminada === "1") {
                    that.buscar_clientes();
                }

            };

            that.buscar_clientes = function() {


                var obj = {
                    session: $scope.session,
                    data: {
                        clientes: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            pais_id: $scope.planilla.get_ciudad().get_pais_id(),
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.CLIENTES.LISTAR_CLIENTES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_clientes(data.obj.listado_clientes);

                    }
                });
            };

            that.render_clientes = function(clientes) {

                $scope.Empresa.limpiar_clientes();

                clientes.forEach(function(data) {

                    var cliente = ClientePlanilla.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);
                    $scope.Empresa.set_clientes(cliente);
                });

                $scope.datos_clientes_farmacias = $scope.Empresa.get_clientes();

            };

            that.buscar_farmacias = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            pais_id: $scope.planilla.get_ciudad().get_pais_id(),
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.CENTROS_UTILIDAD.LISTAR_CENTROS_UTILIDAD, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_farmacias(data.obj.centros_utilidad);

                    }
                });
            };

            that.render_farmacias = function(farmacias) {

                $scope.Empresa.limpiar_farmacias();

                farmacias.forEach(function(data) {

                    var farmacia = FarmaciaPlanilla.get(data.empresa_id, data.centro_utilidad_id, data.descripcion);
                    $scope.Empresa.set_farmacias(farmacia);
                });

                $scope.datos_clientes_farmacias = $scope.Empresa.get_farmacias();
            };


            $scope.buscar_documentos_bodega = function(tercero) {

                $scope.datos_view.tercero_seleccionado = tercero;
                //$scope.datos_view.termino_busqueda_documentos = '';

                if ($scope.datos_view.opcion_predeterminada === "0") {
                    that.documentos_bodega_farmacias();
                }

                if ($scope.datos_view.opcion_predeterminada === "1") {
                    that.documentos_bodega_clientes();
                }
            };

            that.documentos_bodega_clientes = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            tipo_id: $scope.datos_view.tercero_seleccionado.getTipoId(),
                            tercero_id: $scope.datos_view.tercero_seleccionado.getId(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.LISTAR_DOCUMENTOS_CLIENTES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_documentos(data.obj.planillas_despachos);
                    }
                });
            };

            that.documentos_bodega_farmacias = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            farmacia_id: $scope.datos_view.tercero_seleccionado.get_empresa_id(),
                            centro_utilidad_id: $scope.datos_view.tercero_seleccionado.getCodigo(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.LISTAR_DOCUMENTOS_FARMACIAS, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_documentos(data.obj.planillas_despachos);
                    }
                });
            };

            that.render_documentos = function(documentos) {

                $scope.datos_view.tercero_seleccionado.limpiar_documentos();

                documentos.forEach(function(data) {

                    var documento = Documento.get(0, data.empresa_id, data.prefijo, data.numero, data.numero_pedido);
                    $scope.datos_view.tercero_seleccionado.set_documentos(documento);
                });

            };

            $scope.validar_ingreso_documento = function(documento) {

                var disabled = false;

                // Validar que el prefijo y el numero del documento esten presentes
                if (documento.get_prefijo() === undefined || documento.get_numero() === undefined) {
                    return true;
                }

                if (documento.get_prefijo() == '' || documento.get_numero() == '' || documento.get_numero() === 0) {
                    return true;
                }

                // Validar que las cantidad de cajas no sean 0 o vacias                                
                if (documento.get_cantidad_cajas() === '' || documento.get_cantidad_cajas() === 0) {
                    disabled = true;
                }

                // Validar que si ingresar neveras, obligatoriamente ingresen la temperatura de la nevera
                if (documento.get_cantidad_neveras() !== '' && documento.get_cantidad_neveras() !== 0) {
                    disabled = false;
                    if (documento.get_temperatura_neveras() === '') {
                        disabled = true;
                    }
                }

                return disabled;
            };

            $scope.seleccionar_documento_planilla = function(documento) {

                $scope.datos_view.documento_seleccionado = documento;

                that.gestionar_planilla_despacho();
            };

            $scope.seleccionar_documento_otras_empresas = function() {

                $scope.datos_view.documento_seleccionado.set_empresa_id(Sesion.getUsuarioActual().getEmpresa().getCodigo());

                that.gestionar_planilla_despacho();

            };

            $scope.aceptar_documentos_bodegas = function() {

                if ($scope.datos_view.opcion_predeterminada === "2") {

                    $scope.datos_view.documento_seleccionado.set_empresa_id(Sesion.getUsuarioActual().getEmpresa().getCodigo());

                    that.gestionar_planilla_despacho(function(continuar) {
                        if (continuar)
                            $scope.cerrar_gestion_documentos_bodega();
                    });
                } else {
                    $scope.cerrar_gestion_documentos_bodega();
                }
            };


            that.gestionar_planilla_despacho = function(callback) {

                $scope.planilla.set_documento($scope.datos_view.documento_seleccionado);

                if ($scope.planilla.get_numero_guia() === 0) {

                    that.generar_planilla_despacho(function(continuar) {

                        if (continuar) {

                            that.ingresar_documentos_planilla(function(continuar) {

                                if (callback)
                                    callback(continuar);
                            });
                        } else {
                            if (callback)
                                callback(continuar);
                        }
                    });
                } else {
                    that.ingresar_documentos_planilla(function(continuar) {
                        if (callback)
                            callback(continuar);
                    });
                }
            };

            $scope.lista_clientes_farmacias = {
                data: 'datos_clientes_farmacias',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'getNombre()', displayName: 'Nombre', width: "85%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="buscar_documentos_bodega(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.lista_remisiones_bodega = {
                data: 'datos_view.tercero_seleccionado.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'get_descripcion()', displayName: 'Documento Bodega', width: "30%"},
                    {field: 'cantidad_cajas', displayName: 'Cajas', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'cantidad_neveras', displayName: 'Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_neveras" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'temperatura_neveras', displayName: '°C Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.temperatura_neveras" validacion-numero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="seleccionar_documento_planilla(row.entity)" ng-disabled="validar_ingreso_documento(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };

            that.generar_planilla_despacho = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            pais_id: $scope.planilla.get_ciudad().get_pais_id(),
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
                            transportador_id: $scope.planilla.get_transportadora().get_id(),
                            nombre_conductor: $scope.planilla.get_nombre_conductor(),
                            observacion: $scope.planilla.get_observacion(),
                            numero_guia_externo: $scope.planilla.get_numero_guia_externo()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.GENERAR_PLANILLA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.planilla.set_numero_guia(data.obj.numero_guia);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            that.ingresar_documentos_planilla = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                            empresa_id: $scope.planilla.get_documento().get_empresa_id(),
                            prefijo: $scope.planilla.get_documento().get_prefijo(),
                            numero: $scope.planilla.get_documento().get_numero(),
                            cantidad_cajas: $scope.planilla.get_documento().get_cantidad_cajas(),
                            cantidad_neveras: $scope.planilla.get_documento().get_cantidad_neveras(),
                            temperatura_neveras: $scope.planilla.get_documento().get_temperatura_neveras(),
                            observacion: $scope.planilla.get_documento().get_observacion(),
                            tipo: $scope.datos_view.opcion_predeterminada
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.INGRESAR_DOCUMENTOS, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.planilla.set_documentos($scope.datos_view.documento_seleccionado);
                        $scope.datos_view.documento_seleccionado = Documento.get();

                        $scope.buscar_documentos_bodega($scope.datos_view.tercero_seleccionado);

                        callback(true);
                    } else {
                        callback(false);
                    }
                });

            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});