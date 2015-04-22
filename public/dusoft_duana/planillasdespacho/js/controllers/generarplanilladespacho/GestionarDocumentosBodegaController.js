
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
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Empresa, ClientePlanilla, FarmaciaPlanilla, Sesion) {

            var that = this;



            $rootScope.$on('gestionar_documentos_bodegaCompleto', function(e, parametros) {

                $scope.datos_view = {
                    opcion_predeterminada: "0",
                    termino_busqueda: ''
                };

                $scope.datos_clientes_farmacias = [];
                $scope.datos_documentos_bodega = [];

                $scope.seleccionar_cliente_farmacia();
            });

            $rootScope.$on('cerrar_gestion_documentos_bodegaCompleto', function(e, parametros) {

                $scope.$$watchers = null;
            });


            $scope.datos_clientes_farmacias = [];
            $scope.datos_documentos_bodega = [];

            $scope.buscador_cliente_farmacia = function(ev) {

                if (ev.which == 13) {
                    $scope.seleccionar_cliente_farmacia();
                }
            };

            $scope.seleccionar_cliente_farmacia = function() {

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

                that.documentos_bodega_clientes();
            };

            that.render_clientes = function(clientes) {

                $scope.Empresa.limpiar_clientes();

                clientes.forEach(function(data) {

                    var cliente = ClientePlanilla.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);
                    $scope.Empresa.set_clientes(cliente);
                });

                $scope.datos_clientes_farmacias = $scope.Empresa.get_clientes();

            };

            that.documentos_bodega_clientes = function() {

                $scope.datos_documentos_bodega = [];

                for (i = 0; i < 30; i++) {
                    $scope.datos_documentos_bodega.push({documento_bodega: 'EFC Clientes' + i});
                }
            };

            that.buscar_farmacias = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            empresa_id: '03',
                            pais_id: $scope.planilla.get_ciudad().get_pais_id(),
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.CENTROS_UTILIDAD.LISTAR_CENTROS_UTILIDAD, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_centros_utilidad(data.obj.centros_utilidad);

                    }
                });

                that.documentos_bodega_farmacias();
            };

            that.render_centros_utilidad = function(centros_utilidad) {

                $scope.Empresa.limpiar_farmacias();

                centros_utilidad.forEach(function(data) {

                    var farmacia = FarmaciaPlanilla.get(data.descripcion, data.centro_utilidad_id);
                    $scope.Empresa.set_farmacias(farmacia);
                });

                $scope.datos_clientes_farmacias = $scope.Empresa.get_farmacias();
            };

            that.documentos_bodega_farmacias = function() {

                $scope.datos_documentos_bodega = [];

                for (i = 0; i < 30; i++) {
                    $scope.datos_documentos_bodega.push({documento_bodega: 'EFC Farmacias' + i});
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
                                            <button class="btn btn-default btn-xs"  ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.lista_remisiones_bodega = {
                data: 'datos_documentos_bodega',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'documento_bodega', displayName: 'Documento Bodega', width: "85%"},
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