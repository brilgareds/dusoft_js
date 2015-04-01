
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('ListarPlanillasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Sesion) {

            var that = this;

            // Variables
            var fecha_actual = new Date()
            $scope.fecha_inicial = $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd");
            $scope.fecha_final = $filter('date')(fecha_actual, "yyyy-MM-dd");
            $scope.datepicker_fecha_final = false;

            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;



            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };

            $scope.datos_planilla = [];

            $scope.buscar_planillas_despacho = function(termino, paginando) {

                console.log('===============================');
                console.log('== buscar_planillas_despacho ==');
                console.log('===============================');

                for (i = 0; i < 30; i++) {
                    $scope.datos_planilla.push({numero_guia: i, transportador: 'transporatdor_' + i, ciudad: 'ciudad_' + i, cajas: i, neveras: i, estado: 'estado_' + i, fecha: 'fecha_' + i});
                }
            };

            $scope.buscador_planillas_despacho = function(ev, termino_busqueda) {
                if (ev.which == 13) {

                    console.log('=================================');
                    console.log('== buscador_planillas_despacho ==');
                    console.log('=================================');

                    $scope.buscar_planillas_despacho(termino_busqueda);
                }
            };

            $scope.crear_planilla_despacho = function() {

                console.log('=============================');
                console.log('== crear_planilla_despacho ==');
                console.log('=============================');

                $state.go('CrearPlanilla');

            };

            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepicker_fecha_inicial = true;
                $scope.datepicker_fecha_final = false;

            };

            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepicker_fecha_inicial = false;
                $scope.datepicker_fecha_final = true;

            };

            $scope.lista_planillas_despachos = {
                data: 'datos_planilla',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_guia', displayName: '# Guía', width: "10%"},
                    {field: 'transportador', displayName: 'Transportador', width: "25%"},
                    {field: 'ciudad', displayName: 'Ciudad Despacho', width: "15%"},
                    {field: 'cajas', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'neveras', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'estado', displayName: "Estado", width: "15%"},
                    {field: 'fecha', displayName: "Fecha Salida", width: "9%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="modificar_planilla_despacho(row.entity,0)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="generar_reporte(row.entity,0)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-disabled="true" ng-click="enviar_email(row.entity,0)" >Enviar por Email</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };

            $scope.modificar_planilla_despacho = function(orden_compra) {
                console.log('=================================');
                console.log('== modificar_planilla_despacho ==');
                console.log('=================================');
                
                $state.go('ModificarPlanilla');
            };

            $scope.generar_reporte = function(orden_compra) {
                console.log('=============================');
                console.log('== generar_reporte ==');
                console.log('=============================');
            };

            $scope.enviar_email = function(orden_compra) {
                console.log('=============================');
                console.log('== enviar_email ==');
                console.log('=============================');
            };

            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                $scope.buscar_planillas_despacho($scope.termino_busqueda, true);
            };

            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                $scope.buscar_planillas_despacho($scope.termino_busqueda, true);
            };

            $scope.buscar_planillas_despacho();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});