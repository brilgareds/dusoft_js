define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('facturacionClientesController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService","EmpresaDespacho",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService,EmpresaDespacho) {

                    console.log("facturacionClientesController");
                    var that = this;
                    $scope.paginaactual = 1;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    var fecha_actual = new Date();

                    $scope.root = {
                        termino_busqueda_proveedores: "",
                        fecha_inicial_aprobaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                        fecha_final_aprobaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                        empresaSeleccionada: '',
                        termino_busqueda: '',
                        estadoSesion: true,
                        items: 0,
                        clientes: [],
                        estadoBotones: [
                            "btn btn-danger btn-xs",
                            "btn btn-primary btn-xs",
                            "btn btn-danger btn-xs",
                            "btn btn-info btn-xs",
                            "btn btn-warning btn-xs",
                            "btn btn-success btn-xs",
                            "btn btn-warning btn-xs"
                        ],
                        opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                    };

                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                    that.init = function (empresa, callback) {
                        
                      
                        // that.cargar_permisos();
                        $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };
                        $scope.documentosAprobados = [];
                        that.centroUtilidad = [];

                        $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
                        $scope.columnaSizeBusqueda = "col-md-3";
                        $scope.root.visibleBuscador = true;
                        $scope.root.visibleBotonBuscador = true;

                        callback();
                    };

                    $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
                    $scope.columnaSizeBusqueda = "col-md-3";
                    $scope.root.filtros = [
                        {tipo: 'Nombre', descripcion: "Nombre"}
                        
                    ];

                    $scope.root.filtro = $scope.root.filtros[0];

                    $scope.onColumnaSize = function (tipo) {

                        if (tipo === "AS" || tipo === "MS" || tipo === "CD") {
                            $scope.columnaSizeBusqueda = "col-md-4";
                        } else {
                            $scope.columnaSizeBusqueda = "col-md-3";
                        }

                    };

                    $scope.onSeleccionFiltro = function (filtro) {

                        $scope.root.filtro = filtro;
                        $scope.root.termino_busqueda = '';
                        $scope.root.visibleBuscador = true;
                        $scope.root.visibleListaEstados = false;
                        $scope.root.visibleBotonBuscador = true;
                    };


                    /**
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha iniciañ
                     * @param {type} $event
                     */
                    $scope.abrir_fecha_inicial = function ($event) {

                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.root.datepicker_fecha_inicial = true;
                        $scope.root.datepicker_fecha_final = false;

                    };

                    /**
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha final
                     * @param {type} $event
                     */
                    $scope.abrir_fecha_final = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.root.datepicker_fecha_inicial = false;
                        $scope.root.datepicker_fecha_final = true;

                    };
                    
                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara 
                     *              los tipos de terceros
                     * @author Cristian Ardila
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarTiposTerceros = function () {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_tipo_terceros: {

                                }
                            }
                        };
                       
                        facturacionClientesService.listarTiposTerceros(obj, function (data) {
                            
                            if (data.status === 200) { 
                                $scope.tipoTercero = facturacionClientesService.renderListarTipoTerceros(data.obj.listar_tipo_terceros);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });
                        
                    };
                    
                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara 
                     *              los tipos de terceros
                     * @author Cristian Ardila
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarClientes = function () {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_clientes: {
                                    filtro:$scope.root.filtro,
                                    terminoBusqueda: $scope.root.termino_busqueda,//$scope.root.numero,
                                    empresaId:$scope.root.empresaSeleccionada.getCodigo(),
                                    paginaActual:$scope.paginaactual
                                }
                            }
                        };
                         
                        facturacionClientesService.listarClientes(obj, function (data) {
                            $scope.root.clientes = [];
                            if (data.status === 200) { 
                                 $scope.root.clientes  = facturacionClientesService.renderTerceroDespacho(data.obj.listar_clientes);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                          
                        });
                        
                    };
                    
                    /**
                     * +Descripcion Se visualiza la tabla con todos los clientes
                     */
                    $scope.listaClientes = {
                        data: 'root.clientes',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        columnDefs: [

                            

                            {field: 'Identificacion', width: "15%", displayName: 'Cliente', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoId()}}- {{row.entity.getId()}}</p></div>'},
                            
                            {field: 'Cliente',  displayName: 'Identificacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombre()}}</p></div>'},
                            
                            {field: 'Ubicacion', width: "15%", displayName: 'Ubicacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.getPais()}} - {{ row.entity.getDepartamento()}} - {{ row.entity.getMunicipio()}}</p></div>'},

                            {displayName: 'Direccion', width: "10%", cellTemplate: '<div class="col-xs-16 "><p class="text-lowercase">{{ row.entity.getDireccion() }}</p> </div>'},

                            {displayName: 'Telefono', width: "10%", cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.getTelefono()}}</p></div>'},

                            {displayName: 'Op', width: "10%", cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual()}} - {{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroTotalEntregas()}}</p></div>'},
                        ]
                    };

                    /**
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              listara los clientes para facturar
                     *  @parametros ($event = eventos del teclado)
                     *              (pendiente = 0 Formulas sin pendientes)
                     *              (pendiente = 1 Formulas con pendientes)
                     */
                    $scope.buscarClientesFactura = function (event) {

                        if (event.which === 13) {

                            that.listarClientes();
                        }
                    };
                    /**
                     * +Descripcion Metodo principal, el cual cargara el modulo
                     *              siempre y cuando se cumplan las restricciones
                     *              de empresa, centro de utilidad y bodega
                     */
                    that.init(empresa, function () {

                        if (!Usuario.getUsuarioActual().getEmpresa()) {
                            $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una empresa valida para dispensar formulas", tipo: "warning"});
                            AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
                        } else {
                            if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                                    Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                                $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene un centro de utilidad valido para dispensar formulas.", tipo: "warning"});
                                AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                            } else {
                                if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                                    $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una bodega valida para dispensar formulas.", tipo: "warning"});
                                    AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                                } else {
                                    that.listarTiposTerceros();
                                    that.listarClientes();
                                }
                            }
                        }
                    });



                    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                        $scope.$$watchers = null;

                        $scope.root = null;

                    });

                }]);
});
