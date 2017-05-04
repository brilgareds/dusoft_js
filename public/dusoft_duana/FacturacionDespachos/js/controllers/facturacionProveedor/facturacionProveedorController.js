define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('facturacionProveedorController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService","facturacionProveedoresService","EmpresaDespacho",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService,facturacionProveedoresService,EmpresaDespacho) {

                 
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
                        pedidosSeleccionados : [],
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
                     * @author Andres Mauricio Gonzalez
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarProveedores = function () {

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
                         
                        facturacionProveedoresService.listarOrdenCompraProveedores(obj, function (data) {
                            $scope.root.clientes = [];
                            if (data.status === 200) { 
                                   $scope.root.ordenProveedores = facturacionProveedoresService.renderOrdenesComprasProveedores(data.obj.listarOrdenesCompraProveedor);
                                   
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                          
                        });
                        
                    };
                    
                    /**
                     * +Descripcion Se visualiza la tabla con todos los clientes
                     */
                    $scope.listaProveedores = {
                        data: 'root.ordenProveedores',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        columnDefs: [

                            {field: '#OC', width: "7%", displayName: '#OC', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_numero_orden()}}</p></div>'},
                           
                            {field: '#Recepcion', width: "7%", displayName: '#Recepcion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_recepcion_parcial()}}</p></div>'},
                            
                            {field: 'Documento Recepción', width: "9%", displayName: 'Documento Recepción', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_prefijo()}}-{{row.entity.get_numero()}}</p></div>'},
                            
                            {field: 'Proveedor', width: "25%", displayName: 'Proveedor', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_nombre_proveedor()}}</p></div>'},
                                                        
                            {field: 'Fecha', width: "5%", displayName: 'Fecha', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro() | date:"dd-MM-yyyy"}}</p></div>'},
                            
                            {field: 'Usuario', width: "13%", displayName: 'Usuario', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.get_nombre_usuario()}}</p></div>'},
                            
                            {field: 'Observación', width: "24%", displayName: 'Observación', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getObservacion()}}</p></div>'},
                            
                            {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
                                cellTemplate: ' <div class="row">\
                                                 <button class="btn btn-default btn-xs" ng-click="onAbrirVentana()">\
                                                     <span class="glyphicon glyphicon-search"></span>\
                                                 </button>\
                                               </div>'
                            },
                            
                            {field: '', cellClass: "checkseleccion", width: "5%", 
                                cellTemplate: "<input type='checkbox' class='checkpedido' ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-checked='buscarSeleccion(row)' ng-model='row.seleccionado' />"}
                        ]
                    };
                    
                    $scope.onPedidoSeleccionado = function(check, row) {
                        row.selected = check;
                        if (check) {
                            that.agregarPedido(row.entity);
                        } else {
                            that.quitarPedido(row.entity);
                        }
                    };
                    
                     that.quitarPedido = function(pedido) {
                            for (var i in $scope.root.pedidosSeleccionados) {
                                var _pedido = $scope.root.pedidosSeleccionados[i];
                                if (_pedido.recepcion_parcial === pedido.recepcion_parcial) {//numero_orden_compra
                                    $scope.root.pedidosSeleccionados.splice(i, true);
                                    break;
                                }
                            }
                        };

                        that.agregarPedido = function(pedido) {
                            for (var i in $scope.root.pedidosSeleccionados) {
                                var _pedido = $scope.root.pedidosSeleccionados[i];
                                if (_pedido.recepcion_parcial === pedido.recepcion_parcial || _pedido.prefijo !== pedido.prefijo) {
                                    if(_pedido.prefijo !== pedido.prefijo){
                                    AlertService.mostrarMensaje("warning", "Se deben Facturar Documentos con el mismo prefijo");
                                    alert("Se deben Facturar Documentos con el mismo prefijo");
                                    }
                                    return false;
                                }
                            }
                            console.log("QWE",pedido);
                            $scope.root.pedidosSeleccionados.push(pedido);
                        };

                        $scope.buscarSeleccion = function(row) {
                            var pedido = row.entity;
                            for (var i in $scope.root.pedidosSeleccionados) {
                                var _pedido = $scope.root.pedidosSeleccionados[i];
                                if (_pedido.recepcion_parcial === pedido.recepcion_parcial) {
                                    console.log("AAAAAAAAAAAAAAAAAAAAAAa");
                                    row.selected = true;
                                    return true;
                                }
                            }

                            row.selected = false;
                            return false;
                        };
                    
                    /**
                    * +Descripcion: metodo para navegar a la ventana detalle de cada aprobacion o denegacion
                    * @author Andres M Gonzalez
                    * @fecha: 11/05/2016
                    * @params pedido : numero del pedido
                    * @returns {ventana}
                    */
                   that.mostrarDetalle = function(codigoProducto) {
                       localStorageService.add("verificacionDetalle",
                               {
                                   pedidoId: '23133'
                               });
                       $state.go("DetalleRecepcionParcial");
                   };
                   
                    /**
                    * +Descripcion: evento de la vista para pasar a la ventana detalle de cada aprobacion o denegacion
                    * @author Andres M Gonzalez
                    * @fecha: 03/05/2017
                    * @params pedido : numero del pedido
                    * @returns {ventana}
                    */
                   $scope.onAbrirVentana = function() {
                       that.mostrarDetalle();
                   };
                    
                   
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 03/05/2017
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              listara los clientes para facturar
                     *  @parametros ($event = eventos del teclado)
                     *              (pendiente = 0 Formulas sin pendientes)
                     *              (pendiente = 1 Formulas con pendientes)
                     */
                    $scope.buscarClientesFactura = function (event) {

                        if (event.which === 13) {

                            that.listarProveedores();
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
                                    that.listarProveedores();
                                }
                            }
                        }
                    });



                    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                        $scope.$$watchers = null;
                        $scope.root.pedidosSeleccionados = []; 
                        $scope.root = null;

                    });

                }]);
});
