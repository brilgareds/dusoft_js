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
                opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                vistaFacturacion:"",
                facturasTemporales: "",
                vistas : [
                    {
                        id : 1,
                        descripcion : "Facturas Generadas"
                    },
                    {
                        id : 2,
                        descripcion : "Facturas Temporales"
                    }
                ]
            };
            $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.root.vistaSeleccionada = $scope.root.vistas[0];
            
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
       
       /* $scope.listarFacturasConsumo = {
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
        };*/
        
         /**
         * @author Cristian Ardila
         * @fecha 2017-08-25
         * +Descripcion Metodo encargado de invocar el servicio que consultara  
         *              las facturas en temporal
         */
        that.listarFacturasTemporal = function(){
            console.log("*******that.listarFacturasTemporal************");
            console.log("*******that.listarFacturasTemporal************");
            console.log("*******that.listarFacturasTemporal************");
            
            var obj = {
                session: $scope.session,
                data: {
                    listar_facturas_temporal: {
                        tipo_id_tercero: '',
                        tercero_id: ''
                        
                    }
                }
            };
            
            facturacionClientesService.listarFacturasTemporal(obj,function(data){
                
                
                if(data.status === 200){
                    $scope.root.facturasTemporales = facturacionClientesService.renderCabeceraTmpFacturaConsumo(data.obj.listar_facturas_temporal);
                }else{
                    AlertService.mostrarMensaje("warning", data.msj);
                }
                
                console.log("data >>>> ", $scope.root.facturasTemporales)
            });
            
            
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Grid que listara todos los temporales de las facturas
         * @fecha 25/08/2017
         */
        $scope.listarFacturasConsumoTemporales = {
            data: 'root.facturasTemporales',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [
                {cellClass: "ngCellText", width: "25%", displayName: 'Cliente', 
                cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarTerceros()[0].getTipoId()}}- {{row.entity.mostrarTerceros()[0].getId()}}: {{ row.entity.mostrarTerceros()[0].getNombre()}}</p></div>'},
                {field: 'empresa',  cellClass: "ngCellText", width: "10%", displayName: 'Empresa'},
                {field: 'observaciones',  cellClass: "ngCellText", width: "15%", displayName: 'Observacion'},
                {field: 'fechaRegistro',  cellClass: "ngCellText", width: "15%", displayName: 'F. Reg'},
                {field: 'tipoPago',  cellClass: "ngCellText", width: "5%", displayName: 'Tipo pago'},
                {field: 'usuario',  cellClass: "ngCellText", width: "15%", displayName: 'Usuario'},
                {field: 'valorSubTotal',  cellClass: "ngCellText", width: "5%", displayName: 'Sub Total'},
                {field: 'valorTotal',  cellClass: "ngCellText", width: "5%", displayName: 'Total'},
                {displayName: "Opc", width: "5%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<div class="btn-group">\
                           <button ng-click="detalleFacturaTemporal(row.entity)" \n\
                                class="btn btn-default btn-xs dropdown-toggle" \n\
                                data-toggle="dropdown" title="Ver detalle">\n\
                            <span class="glyphicon glyphicon-list"></span> Ingresar</button>\
                      </div>'
                },
                 
            ]
        };
        
        $scope.detalleFacturaTemporal = function(entity){           
            
            localStorageService.add("facturaTemporalCabecera",
            {
                nombre_tercero: entity.mostrarTerceros()[0].getNombre(),
                tipo_id_tercero: entity.mostrarTerceros()[0].getTipoId(),
                tercero_id: entity.mostrarTerceros()[0].getId(),
                contrato_cliente_id: entity.mostrarTerceros()[0].getContratoClienteId(),
                tipo_pago: entity.getTipoPagoId(),
                observaciones: entity.getObservaciones()
            }); 
            $state.go("GuardarFacturaConsumo");
        };
        
        $scope.onCambiarVista = function(vista){
            console.log("cambiar vista ", vista)
            $scope.root.vistaFacturacion = vista;
        };
                
        $scope.onBtnGenearFactura = function(){
            $state.go("GuardarFacturaConsumo");
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
  
                        that.listarFacturasTemporal();
                    }
                }
            }
        });
        
 
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {            
            socket.remove(['onNotificarFacturacionTerminada']);  
            $scope.$$watchers = null;
            $scope.root.activarTabFacturasGeneradas = false;
            localStorageService.add("listaFacturaDespachoGenerada",null);
            localStorageService.add("localStorageService",null);
            $scope.root = null;
        });
    }]);
});
