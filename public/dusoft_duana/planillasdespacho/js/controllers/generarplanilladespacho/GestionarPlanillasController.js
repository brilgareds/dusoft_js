
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
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Empresa, Ciudad, Transportadora, UsuarioPlanilla, PlanillaDespacho, Sesion) {

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
            
            console.log('=== Planilla =====');
            console.log($scope.planilla);

            $scope.datos_view = {
                //ciudad_seleccionada: Ciudad.get(),
                //transportadora_seleccionada: Transportadora.get(),
                termino_busqueda_ciudades: ''
            };

            $scope.datos_planilla = [];

            that.gestionar_consultas = function() {

                that.buscar_ciudades(function(ciudades) {

                    if ($scope.planilla.get_numero_guia() > 0)
                        that.render_ciudades(ciudades);

                    that.buscar_transportadoras(function() {

                        if ($scope.planilla.get_numero_guia() > 0) {
                            that.consultar_planilla_despacho();
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
                //$scope.planilla.set_ciudad($scope.datos_view.ciudad_seleccionada);
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
                //$scope.planilla.set_transportadora($scope.datos_view.transportadora_seleccionada);
            };

            that.consultar_planilla_despacho = function() {
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
                    }
                });

            };

            that.render_planilla = function(datos) {

                var ciudad = Ciudad.get(datos.pais_id, datos.nombre_pais, datos.departamento_id, datos.nombre_departamento, datos.ciudad_id, datos.nombre_ciudad);
                var transportadora = Transportadora.get(datos.transportadora_id, datos.nombre_transportadora, datos.placa_vehiculo, datos.estado_transportadora);
                var usuario = UsuarioPlanilla.get(datos.usuario_id, datos.nombre_usuario);
                $scope.planilla = PlanillaDespacho.get(datos.id, transportadora, ciudad, datos.nombre_conductor, datos.observacion, usuario, datos.fecha_registro, datos.fecha_despacho, datos.estado, datos.descripcion_estado);                                
            };

            $scope.buscar_documentos_bodega = function() {

                console.log('==============================');
                console.log('== buscar_documentos_bodega ==');
                console.log('==============================');
                for (i = 0; i < 30; i++) {
                    $scope.datos_planilla.push({nombre_cliente: 'nombre_cliente_' + i, documento: 'EFC ' + i, cajas: i, neveras: i, temperatura_neveras: i});
                }
            };
            $scope.gestionar_documentos_bodega = function() {

                $scope.slideurl = "views/generarplanilladespacho/gestionardocumentosbodegas.html?time=" + new Date().getTime();
                $scope.$emit('gestionar_documentos_bodega');
            };

            $scope.cerrar_gestion_documentos_bodega = function() {

                $scope.$emit('cerrar_gestion_documentos_bodega', {animado: true});
            };

            $scope.lista_documentos_bodega = {
                data: 'datos_planilla',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_cliente', displayName: 'Cliente', width: "35%"},
                    {field: 'documento', displayName: 'Documento', width: "25%"},
                    {field: 'cajas', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'neveras', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'temperatura_neveras', displayName: 'Temp. Neveras', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ng-disabled="vista_previa" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.cancelar_planilla_despacho = function() {

                $state.go('GestionarPlanillas');
            };

            that.gestionar_consultas();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});