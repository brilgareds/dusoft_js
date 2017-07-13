define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('GuardarFacturaConsumoController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
        "$timeout",
        "$filter",
        "localStorageService",
        "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho","webNotification",
    function ($scope, $rootScope, Request, API, AlertService, Usuario,
            $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho,webNotification) {
 
        var that = this;
        
        /*
         * Inicializacion de variables
         * @param {type} empresa
         * @param {type} callback
         * @returns {void}
         */
        that.init = function (callback) {
            $scope.paginaactual = 1;
            var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
            var fecha_actual = new Date();
            $scope.root = {
                fechaInicialPedidosCosmitet: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fechaFinalPedidosCosmitet: $filter('date')(fecha_actual, "yyyy-MM-dd"),            
                opciones: Usuario.getUsuarioActual().getModuloActual().opciones
            };
            $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            callback();
        };
        
        $scope.listaDocumentos = {
            data: 'root.facturas_proceso',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'Factura',  cellClass: "ngCellText", width: "15%", displayName: 'Producto', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_prefijo()}}- {{row.entity.get_numero()}}</p></div>'},
                {field: 'Empresa',  cellClass: "ngCellText", width: "15%", displayName: 'Cant despachada', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_empresa()}}</p></div>'},
                {field: 'Fecha creacion',  cellClass: "ngCellText", width: "15%", displayName: 'Cant Facturada', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_fecha_registro()}}</p></div>'},
                {field: 'Fecha Inicial',  cellClass: "ngCellText", width: "15%", displayName: 'Cant por facturar', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaInicial()}}</p></div>'},
                {field: 'Fecha final',  cellClass: "ngCellText", width: "15%", displayName: 'Lote', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaFinal()}}</p></div>'},
                {field: 'Fecha final',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha vto', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaFinal()}}</p></div>'},
                {field: 'Fecha final',  cellClass: "ngCellText", width: "15%", displayName: 'Cant a facturar', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaFinal()}}</p></div>'},

            ]
        };
        
      /**
        * @author Eduar Garcia
        * @fecha 11/07/2016
        * +Descripcion Funcion que permitira desplegar el popup datePicker
        *               de la fecha inicio
        * @param {type} $event
        */   
       $scope.abrir_fecha_inicial = function($event) {

           $event.preventDefault();
           $event.stopPropagation();
           $scope.root.datepicker_fecha_inicial = true;
           $scope.root.datepicker_fecha_final = false;

       };

  
        $scope.onCambiarVista = function(vista){
            $scope.root.vistaFacturacion = vista;
        };
                
        $scope.onBtnGenearFactura = function(){
            $state.go("GuardarFacturaConsumo");
        };
        
        
        $scope.listarDocumentos = function(busqueda){
            if(busqueda.length < 3){
                return;
            }
            console.log("busqueda ", busqueda);
        };
        

        /**
         * +Descripcion Metodo principal, el cual cargara el modulo
         *              siempre y cuando se cumplan las restricciones
         *              de empresa, centro de utilidad y bodega
         */
        that.init(function () {

            if (!Usuario.getUsuarioActual().getEmpresa()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una empresa valida para ingresar a la aplicacion", tipo: "warning"});
                AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
            } else {
                if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                        Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene un centro de utilidad valido para ingresar a la aplicacion", tipo: "warning"});
                    AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                } else {
                    if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una bodega valida para ingresar a la aplicacion", tipo: "warning"});
                        AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                    } else {
  
                        
                    }
                }
            }
        });
        
 
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {            
            socket.remove(['onNotificarFacturacionTerminada']);  
            $scope.$$watchers = null;
            $scope.root.activarTabFacturasGeneradas = false;
            localStorageService.add("listaFacturaDespachoGenerada",null);
            $scope.root = null;
        });
    }]);
});
