define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('FacturacionConsumoController',
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

       /**
       * @author Eduar Garcia
       * @fecha 11/07/2016
       * +Descripcion Funcion que permitira desplegar el popup datePicker
       *               de la fecha final
       * @param {type} $event
       */  
       $scope.abrir_fecha_final = function($event) {
           $event.preventDefault();
           $event.stopPropagation();
           $scope.root.datepicker_fecha_inicial = false;
           $scope.root.datepicker_fecha_final = true;

       };
       
        $scope.listarFacturasConsumo = {
            data: 'root.facturas_proceso',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'Factura',  cellClass: "ngCellText", width: "15%", displayName: 'Factura', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_prefijo()}}- {{row.entity.get_numero()}}</p></div>'},
                {field: 'Empresa',  cellClass: "ngCellText", width: "15%", displayName: 'Empresa', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_empresa()}}</p></div>'},
                {field: 'Fecha creacion',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha creacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_fecha_registro()}}</p></div>'},
                {field: 'Fecha Inicial',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha Inicial', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaInicial()}}</p></div>'},
                {field: 'Fecha final',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha final', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaFinal()}}</p></div>'},               
                {displayName: "Opc", cellClass: "txt-center dropdown-button",
                cellTemplate: '\
                <div class="btn-group">\
                    <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                    <ul class="dropdown-menu dropdown-options">\
                        <li ng-if="row.entity.get_numero() > 0 ">\
                            <a href="javascript:void(0);" ng-click="imprimirReporteFactura(row.entity,1)" class = "glyphicon glyphicon-print"> Imprimir factura </a>\
                        </li>\
                    </ul>\
                </div>'
                },
                {field: 'Estado facturacion',  cellClass: "ngCellText",  displayName: 'Estado facturacion', 
                cellTemplate: '<div class="col-xs-16 ">\n\
                    <p class="text-uppercase">{{row.entity.getDescripcionEstadoFacturacion()}}\n\
                <span ng-class="agregar_clase_formula(row.entity.getEstadoFacturacion())"></span></p></div>'}, 
            ]
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
