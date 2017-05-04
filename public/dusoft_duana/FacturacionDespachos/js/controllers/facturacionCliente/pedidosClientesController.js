define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('pedidosClientesController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho",
    function ($scope, $rootScope, Request, API, AlertService, Usuario,
            $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho) {

        console.log("pedidosClientesController");
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
