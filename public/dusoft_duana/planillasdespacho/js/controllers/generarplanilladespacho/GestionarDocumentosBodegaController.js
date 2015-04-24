
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
                    opcion_predeterminada: "0", // 0 = farmacias 1 = clientes
                    termino_busqueda: '',
                    termino_busqueda_documentos: '',
                    tercero_seleccionado: FarmaciaPlanilla.get() // tercero_seleccionado es una Farmacia por ser la opcion_predeterminada = 0
                };

                $scope.datos_clientes_farmacias = [];
                $scope.datos_documentos_bodega = [];

                $scope.seleccionar_cliente_farmacia();
            });

            $rootScope.$on('cerrar_gestion_documentos_bodegaCompleto', function(e, parametros) {

                $scope.datos_view = null;
                $scope.$$watchers = null;
            });


            $scope.datos_clientes_farmacias = [];
            $scope.datos_documentos_bodega = [];

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
                            empresa_id: '03',
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
                        movimientos_bodegas: {
                            empresa_id: '03',
                            tipo_id: $scope.datos_view.tercero_seleccionado.getTipoId(),
                            tercero_id: $scope.datos_view.tercero_seleccionado.getId(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.DOCUMENTOS.LISTAR_DOCUMENTOS_CLIENTES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_documentos(data.obj.movimientos_bodegas);
                    }
                });
            };

            that.documentos_bodega_farmacias = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            empresa_id: '03',
                            farmacia_id: $scope.datos_view.tercero_seleccionado.get_empresa_id(),
                            centro_utilidad_id: $scope.datos_view.tercero_seleccionado.getCodigo(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.DOCUMENTOS.LISTAR_DOCUMENTOS_FARMACIAS, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_documentos(data.obj.movimientos_bodegas);
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
                    {field: '', displayName: 'Cajas', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: '', displayName: 'Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: '', displayName: '°C Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" validacion-numero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs"  ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});