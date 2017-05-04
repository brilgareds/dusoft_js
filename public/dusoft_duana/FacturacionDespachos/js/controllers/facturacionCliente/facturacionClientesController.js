define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('facturacionClientesController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho",
    function ($scope, $rootScope, Request, API, AlertService, Usuario,
            $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho) {

        console.log("facturacionClientesController");
        var that = this;
        $scope.paginaactual = 1;
        $scope.paginaactualFacturasGeneradas = 1;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

        $scope.root = {
            termino_busqueda_proveedores: "",
            termino_busqueda_pedido: "",
            termino_busqueda_nombre: "",
            termino_busqueda_prefijo: "",
            empresaSeleccionada: '',
            termino_busqueda: '',
            termino_busqueda_fg: '',
            estadoSesion: true,
            items: 0,
            items_facturas_generadas: 0,
            clientes: [],
            facturas_generadas: [],
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
            {tipo: '', descripcion: "Todos"},
            {tipo: 'Nombre', descripcion: "Nombre"}
        ];
        
        $scope.root.filtrosPrefijos = [
            {tipo: '', descripcion: "Todos"},
            {tipo: 'Nombre', descripcion: "Nombre"}
        ];

        $scope.root.filtro = $scope.root.filtros[0];
        $scope.root.filtroPrefijo = $scope.root.filtrosPrefijos[0];
        
        $scope.onColumnaSize = function (tipo) {
 
        };
        
        /**
         * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
         *              el tipo de documento seleccionado
         * @param {type} filtro
         * @returns {undefined}
         */
        $scope.onSeleccionFiltro = function (filtro) {

            $scope.root.filtro = filtro;
            $scope.root.termino_busqueda = '';
        };

        /**
         * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
         *              el tipo de prefijo
         * @param {type} filtro
         * @returns {undefined}
         */
        $scope.onSeleccionFiltroPrefijos = function (filtroPrefijo) {

            $scope.root.filtroPrefijo = filtroPrefijo;
            //$scope.root.termino_busqueda_fg = '';       
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
                data: {listar_tipo_terceros:{}}
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
        that.listarPrefijosFacturas = function () {

            var obj = {
                session: $scope.session,
                data: {
                    listar_prefijos:{
                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                    }
                }
            };

            facturacionClientesService.listarPrefijosFacturas(obj, function (data) {

                if (data.status === 200) {
                     
                    $scope.tipoPrefijoFactura = facturacionClientesService.renderListarTipoTerceros(data.obj.listar_prefijos);
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
                        filtro: $scope.root.filtro,
                        terminoBusqueda: $scope.root.termino_busqueda, //$scope.root.numero,
                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                        paginaActual: $scope.paginaactual
                    }
                }
            };

            facturacionClientesService.listarClientes(obj, function (data) {
                $scope.root.clientes = [];
                if (data.status === 200) {
                    $scope.root.items = data.obj.listar_clientes.length;
                    $scope.root.clientes = facturacionClientesService.renderTerceroDespacho(data.obj.listar_clientes);
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }

            });

        };



        /**
         * +Descripcion Metodo encargado de invocar el servicio que listara 
         *              las facturas generadas
         * @author Cristian Ardila
         * @fecha 03/05/2017 DD/MM/YYYY
         * @returns {undefined}
         */
        that.listarFacturasGeneradas = function () {
             
            var obj = {
                session: $scope.session,
                data: {
                    listar_facturas_generadas: {
                        filtro: $scope.root.filtro,
                        terminoBusqueda: $scope.root.termino_busqueda_fg.length > 0 ? $scope.root.termino_busqueda_fg : '', //$scope.root.termino_busqueda, //$scope.root.numero, 900766903
                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                        paginaActual: $scope.paginaactualFacturasGeneradas,
                        numero: $scope.root.termino_busqueda_prefijo.length > 0 ? $scope.root.termino_busqueda_prefijo: '', //52146
                        prefijo: $scope.root.filtroPrefijo,
                        tipoIdTercero: $scope.root.filtro,
                        pedidoClienteId: $scope.root.termino_busqueda_pedido.length > 0 ? $scope.root.termino_busqueda_pedido: '',
                        nombreTercero: $scope.root.termino_busqueda_nombre.length > 0 ? $scope.root.termino_busqueda_nombre: '',

                    }
                }
            };
             
            facturacionClientesService.listarFacturasGeneradas(obj, function (data) {
                $scope.root.facturas_generadas = [];
                if (data.status === 200) {
                    console.log("listarFacturasGeneradas =  ", data)
                    $scope.root.items_facturas_generadas = data.obj.listar_facturas_generadas.length;
                    $scope.root.facturas_generadas = facturacionClientesService.renderDocumentosClientes(data.obj.listar_facturas_generadas);
                    
                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }

            });

        };
        
        
        $scope.listarPedidosClientes = function() {

           /* localStorageService.add("dispensarFormulaDetalle",{
                evolucionId: dispensar.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(),//'91671'
                filtro:$scope.root.filtro,
                terminoBusqueda: $scope.root.termino_busqueda,//$scope.root.numero,
                empresaId:$scope.root.empresaSeleccionada,
                fechaInicial: $filter('date')($scope.root.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                fechaFinal:$filter('date')($scope.root.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                paginaActual:$scope.paginaactual,
                estadoFormula : $scope.root.estadoFormula,
                pacienteId: dispensar.getAfiliadoId(),
                tipoIdPaciente: dispensar.getAfiliadoTipoId(),
                pendientes: pendientes,
                tipoEstadoFormula: dispensar.mostrarPacientes()[0].mostrarFormulas()[0].getEstadoEntrega()

            });
*/              
            $state.go('PedidosClientesDespacho');
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

                {field: 'Cliente', displayName: 'Cliente', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombre()}}</p></div>'},

                {field: 'Ubicacion', width: "15%", displayName: 'Ubicacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.getPais()}} - {{ row.entity.getDepartamento()}} - {{ row.entity.getMunicipio()}}</p></div>'},

                {displayName: 'Direccion', width: "10%", cellTemplate: '<div class="col-xs-16 "><p class="text-lowercase">{{ row.entity.getDireccion() }}</p> </div>'},

                {displayName: 'Telefono', width: "10%", cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.getTelefono()}}</p></div>'},

                {displayName: "Opc", width: "6%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<div class="btn-group">\
                           <button ng-click="listarPedidosClientes()" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" title="Crear factura"><span class="glyphicon glyphicon-list"></span> Factura</button>\
                      </div>'
                },
            ]
        };


        /**
         * @author Cristian Ardila
         * +Descripcion Se visualizan los registros con todas las facturas
         *              generadas
         * @fecha 03-05-2017 DD-MM-YYYY
         */
        $scope.listaFacturasGeneradas = {
            data: 'root.facturas_generadas',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: '#Factura', width: "5%", displayName: '#Factura', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarFacturas()[0].get_prefijo()}}- {{row.entity.mostrarFacturas()[0].get_numero()}}</p></div>'},

                {field: 'Identificacion', width: "8%", displayName: 'Identificacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoId()}}- {{row.entity.getId()}}</p></div>'},

                {field: 'Cliente', displayName: 'Cliente', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombre()}}</p></div>'},

                {field: 'Ubicacion', width: "10%", displayName: 'Ubicacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.getPais()}} - {{ row.entity.getDepartamento()}} - {{ row.entity.getMunicipio()}}</p></div>'},

                {displayName: 'Telefono', width: "8%", cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.getTelefono()}}</p></div>'},

                {field: 'Vendedor', width: "13%", displayName: 'Vendedor', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarFacturas()[0].mostrarVendedor()[0].getTipoId()}}- {{row.entity.mostrarFacturas()[0].mostrarVendedor()[0].getId()}}: {{ row.entity.mostrarFacturas()[0].mostrarVendedor()[0].getNombre()}}</p></div>'},

                {field: 'F.Factura', width: "10%", displayName: 'F.Factura', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturas()[0].getFechaFactura()}} </p></div>'},

                {field: 'F.Ven', width: "5%", displayName: 'F.Ven', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturas()[0].getFechaVencimientoFactura()}} </p></div>'},

                {field: 'Valor/saldo', width: "12%", displayName: 'Valor/saldo', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturas()[0].getValor()}} / {{ row.entity.mostrarFacturas()[0].getSaldo()}} </p></div>'},

                {field: 'Estado', width: "8%", displayName: 'Estado', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturas()[0].getDescripcionEstado()}}</p></div>'},

                {displayName: "Opc", width: "6%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.mostrarFacturas()[0].getEstadoSincronizaciono() > 0">\n\
                                   <a href="javascript:void(0);" ng-click="dispensacionFormula(row.entity,0)" class= "glyphicon glyphicon-refresh"> Sincronizar </a>\
                                </li>\
                                <li ng-if="row.entity.mostrarFacturas()[0].get_numero() > 0 ">\
                                   <a href="javascript:void(0);" ng-click="listarTodoMedicamentosDispensados(row.entity)" class = "glyphicon glyphicon-print"> Imprimir factura </a>\
                                </li>\
                           </ul>\
                      </div>'
                },
            ]
        };
        /**
         * @author Cristian Ardila
         * @fecha 04/02/2016
         * +Descripcion Metodo encargado de invocar el servicio que
         *              listara los clientes para facturar
         *  @parametros ($event = eventos del teclado)
         */
        $scope.buscarClientesFactura = function (event) {

            if (event.which === 13) {

                that.listarClientes();
            }
        };


        /**
         * @author Cristian Ardila
         * @fecha 04/02/2016
         * +Descripcion Metodo encargado de invocar el servicio que
         *              listara las facturas que ya han sido generadas
         *  @parametros ($event = eventos del teclado)
         */
        $scope.buscarFacturaGenerada = function (event) {
            if (event.which === 13) {
                that.listarFacturasGeneradas();
            } 
           
        };
        /*
         * funcion para paginar anterior
         * @returns {lista datos}
         */
        $scope.paginaAnterior = function () {
            if ($scope.paginaactual === 1)
                return;
            $scope.paginaactual--;
            that.listarClientes();
        };


        /*
         * funcion para paginar siguiente
         * @returns {lista datos}
         */
        $scope.paginaSiguiente = function () {
            $scope.paginaactual++;
            that.listarClientes();
        };



        /*
         * +Descripcion funcion para paginar anterior en la lista de facturas
         *              generadas
         * @returns {lista datos}
         */
        $scope.paginaAnteriorFG = function () {
            if ($scope.paginaactualFacturasGeneradas === 1)
                return;
            $scope.paginaactualFacturasGeneradas--;
            that.listarClientes();
        };


        /*
         * +Descripcion funcion para paginar siguiente en la lista
         *              de facturas generadas
         * @returns {lista datos}
         */
        $scope.paginaSiguienteFG = function () {
            $scope.paginaactualFacturasGeneradas++;
            that.listarFacturasGeneradas();
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
                        that.listarPrefijosFacturas();
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
