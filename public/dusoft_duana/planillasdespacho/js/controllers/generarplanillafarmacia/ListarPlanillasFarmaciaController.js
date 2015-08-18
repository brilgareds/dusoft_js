
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

            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;

            /**
             * @author Cristian Ardila
             * @param {evento} ng-keypress
             * +Descripcion: metodo que buscara la planilla de devolucion
             * y la filtrara por conductor cuando se ejecute enter dentro del
             * campo de texto
             */
            $scope.buscador_planillas_despacho = function(ev) {
                
                if (ev.which == 13) {
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
                            fecha_inicial: $scope.datos_view.fecha_inicial + " 00:00:00",
                            fecha_final: $scope.datos_view.fecha_final + " 23:59:00",
                            termino_busqueda: $scope.datos_view.termino_busqueda
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
                
                planillas.forEach(function(data) {
                    //console.log(data)
                    var ciudad = Ciudad.get(data.pais_id, data.nombre_pais, data.departamento_id, data.nombre_departamento, data.ciudad_id, data.nombre_ciudad);
                    var transportadora = Transportadora.get(data.transportadora_id, data.nombre_transportadora, data.placa_vehiculo, data.estado_transportadora);
                    var usuario = UsuarioPlanilla.get(data.usuario_id, data.nombre_usuario);
                   
                    
                    
                    //(data.empresa_origen);
                    var planilla = PlanillaDespacho.get(data.id, transportadora, ciudad, data.nombre_conductor, data.observacion, usuario, data.fecha_registro, data.fecha_despacho, data.estado, data.descripcion_estado);
                     planilla.set_empresa(data.empresa_origen);
                    planilla.set_cantidad_cajas(data.total_cajas);
                    planilla.set_cantidad_neveras(data.total_neveras);
                    $scope.Empresa.set_planillas(planilla);
                });
                
                console.log($scope.Empresa.get_planillas())
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
                columnDefs: [
                    {field: 'get_numero_guia()', displayName: '# Guía', width: "5%"},
                    {field: 'get_transportadora().get_descripcion()', displayName: 'Transportador', width: "15%"},
                    {field: 'get_empresa()', displayName: 'Farmacia', width: "15%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'get_descripcion_estado()', displayName: "Estado", width: "15%"},
                    {field: 'get_fecha_registro()', displayName: "F. Registro", width: "9%"},
                    {field: 'get_fecha_despacho()', displayName: "F. Despacho", width: "9%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="gestionar_planilla_farmacias(row.entity,true)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="generar_reporte(row.entity,false)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ validar_envio_email(row.entity) }}" ng-click="ventana_enviar_email(row.entity)" >Enviar por Email</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };
            
            $scope.validar_envio_email = function(planilla){
                return {'click': planilla.get_estado() == '2'};
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
            });

        }]);
});