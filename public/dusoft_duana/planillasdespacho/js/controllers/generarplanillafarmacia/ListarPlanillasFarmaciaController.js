
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('ListarPlanillasFarmaciaController', [
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

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables
            var fecha_actual = new Date();

            // numero de guia
            localStorageService.add("numero_guia", 0);

            $scope.datos_view = {
                termino_busqueda: '',
                fecha_inicial: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fecha_final: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                datepicker_fecha_final: false
            };
            
            $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-2  pull-right";
            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;

            $scope.filtros = [
                {nombre: "Guia", filtroGuia: true},
                {nombre: "Transportador", filtroTransportador: true},
                {nombre: "Estado", filtroEstado: true}
            ];
            $scope.filtro = $scope.filtros[0];

            //Deja en estado visible el buscador
            $scope.visibleBuscador = true;
            $scope.visibleBotonBuscador = true;
            
            $scope.onSeleccionFiltro = function(filtro) {
               
                $scope.filtro = filtro;
                $scope.datos_view.termino_busqueda = '';
                if (filtro.nombre === "Estado") {
                    $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-2  pull-right";
                    $scope.visibleBuscador = false;
                    $scope.visibleListaEstados = true;
                    $scope.visibleBotonBuscador = false;
                } else {
                    $scope.visibleBuscador = true;
                    $scope.visibleListaEstados = false;
                    $scope.visibleBotonBuscador = true;
                }
                 
                 if(filtro.nombre === "Transportador"){
                      $scope.contenedorBuscador = "col-sm-3 col-md-3 col-lg-3  pull-right";
                 }
                
            };


            $scope.filtrosEstados = [
                {nombre: "Anulada", estado: 0},
                {nombre: "Activa", estado: 1},
                {nombre: "Despachada", estado: 2}
            ];

            $scope.filtroEstado = $scope.filtrosEstados[0];

            $scope.onSeleccionEstadoFiltro = function(filtrosEstados) {
                $scope.visibleBotonBuscador = false;
                $scope.filtroEstado = filtrosEstados;
                $scope.datos_view.termino_busqueda = filtrosEstados.estado;
                $scope.buscar_planillas_despacho($scope.datos_view.termino_busqueda);
               
            };
            /**
             * @author Cristian Ardila
             * @param {evento} ng-keypress
             * +Descripcion: metodo que buscara la planilla de devolucion
             * y la filtrara por conductor cuando se ejecute enter dentro del
             * campo de texto
             */
            $scope.buscador_planillas_despacho = function(ev) {

                if (ev.which === 13) {
                    $scope.buscar_planillas_despacho();
                }
            };

            /**
             * @author Cristian Ardila
             * @param {N/N}
             * +Descripcion: Funcion que se encarga de hacer la peticion al
             * servidor y consulta el detallado de la planilla de devolucion
             */
            $scope.buscar_planillas_despacho = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        listar_planillas_farmacias: {
                            fecha_inicial: $filter('date')($scope.datos_view.fecha_inicial, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.datos_view.fecha_final, "yyyy-MM-dd") + " 23:59:00",
                            filtro: $scope.filtro,
                            termino_busqueda: $scope.datos_view.termino_busqueda,
                            pagina: $scope.pagina_actual,
                            
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS_FARMACIAS.LISTAR_PLANILLAS_FARMACIAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_planillas(data.obj.listar_planillas_farmacias);
                    }
                });
            };

            /**
             * 
             * @param {Object} detallado de planillas de devolucion
             * @returns {void}
             * +Descripcion: funcion encargada de aplicar el mapeo objeto-relacional
             * del detallado de planillas de devolucion
             */
            that.render_planillas = function(planillas) {


                $scope.Empresa.limpiar_planillas();
                $scope.cantidad_items = planillas.length;


                planillas.forEach(function(data) {

                    var ciudad = Ciudad.get(data.pais_id, data.nombre_pais, data.departamento_id, data.nombre_departamento, data.ciudad_id, data.nombre_ciudad);
                    var transportadora = Transportadora.get(data.transportadora_id, data.nombre_transportadora, data.placa_vehiculo, data.estado_transportadora);
                    var usuario = UsuarioPlanilla.get(data.usuario_id, data.nombre_usuario);


                    var planilla = PlanillaDespacho.get(data.id, transportadora, ciudad, data.nombre_conductor, data.observacion, usuario, data.fecha_registro, data.fecha_despacho, data.estado, data.descripcion_estado);
                    planilla.set_empresa(data.empresa_origen);
                    planilla.set_cantidad_cajas(data.total_cajas);
                    planilla.set_cantidad_neveras(data.total_neveras);
                    $scope.Empresa.set_planillas(planilla);
                });


            };

            /**
             * @author Cristian Ardila
             * @param {evento} ng-click
             * +Descripcion: funcion encargada de ejecutar al momento de
             * desplegar el date picker para la fecha inicial
             */
            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = true;
                $scope.datos_view.datepicker_fecha_final = false;

            };

            /**
             * @author Cristian Ardila
             * @param {evento} ng-click
             * +Descripcion: funcion encargada de ejecutar al momento de
             * desplegar el date picker para la fecha final
             */
            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = false;
                $scope.datos_view.datepicker_fecha_final = true;

            };

            /**
             * @author Cristian Ardila
             * +Descripcion: variable $scope la cual dibujara en la view 
             * (listarplanillasfarmacia.html)la gridview con el detalle de 
             * las devoluciones
             */
            $scope.lista_planillas_farmacia = {
                data: 'Empresa.get_planillas()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'get_numero_guia()', displayName: '# Guía', width: "5%"},
                    {field: 'get_transportadora().get_descripcion()', displayName: 'Transportador', width: "15%"},
                    {field: 'get_empresa()', displayName: 'Farmacia', width: "20%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'get_descripcion_estado()', displayName: "Estado", width: "12%"},
                    {field: 'get_fecha_registro()', displayName: "F. Registro", width: "11%"},
                    {field: 'get_fecha_despacho()', displayName: "F. Despacho", width: "11%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",width: "7%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="gestionar_planilla_farmacias(row.entity,true)" >Modificar</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };

           


            /**
             * @author Cristian Ardila
             * @param {string} planilla_despacho
             * @param {string} opcion
             * +Descripcion: metodo encargado de cambiar de vista
             * para generar las planillas farmacias (origen)vista listarplanillasfarmacia.html
             * (destino) vista gestionarplanillasfarmacia
             */
            $scope.gestionar_planilla_farmacias = function(planilla_despacho, opcion) {


                localStorageService.add("numero_guia", 0);

                if (opcion) {

                    // Modificar Planilla
                    localStorageService.add("numero_guia", planilla_despacho.get_numero_guia());
                }

                $state.go('CrearPlanillaFarmacia');

            };

            /**
             * @param {N/N}
             * @author Cristian Ardila
             * @returns {int} paginaactual
             * +Descripcion: funcion que se invoca al presionar click
             * en el boton izquiero (<) del paginador del gridview
             * y aumentara en 1 la pagina actual, refrescando la gridview
             * del detalle de devolucion
             */
            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                $scope.buscar_planillas_despacho($scope.termino_busqueda, true);
            };

            /**
             * @param {N/N}
             * @author Cristian Ardila
             * @returns {int} paginaactual
             * +Descripcion: funcion que se invoca al presionar click
             * en el boton derecho (>) del paginador del gridview
             * y aumentara en 1 la pagina actual, refrescando la gridview
             * del detalle de devolucion
             */
            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                $scope.buscar_planillas_despacho($scope.termino_busqueda, true);
            };

            $scope.buscar_planillas_despacho();

            /**
             * +Descripcion: evento encargado de limpiar las variables de la clase
             */
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                //localStorageService.remove("numero_guia");
               // $scope.datos_view = null;
            });

        }]);
});