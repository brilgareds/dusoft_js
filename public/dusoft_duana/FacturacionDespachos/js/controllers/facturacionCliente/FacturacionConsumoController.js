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
        $scope.notificarFacturaConsumo = 0;
        /*
         * Inicializacion de variables
         * @param {type} empresa
         * @param {type} callback
         * @returns {void}
         */
        that.init = function (callback) {
            $scope.paginaactual = 1;
            $scope.columnaSizeBusqueda = "col-md-3";
            var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
            var fecha_actual = new Date();
            $scope.root = {
                termino_busqueda: '',
                visibleBuscador:true,
                visibleBotonBuscador: true,
                fechaInicialPedidosCosmitet: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fechaFinalPedidosCosmitet: $filter('date')(fecha_actual, "yyyy-MM-dd"),            
                opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                vistaFacturacion:"",
                facturasTemporales: "",
                itemsFacturasTemporales: 0,
                vistas : [
                    {
                        id : 1,
                        descripcion : "Facturas Generadas"
                    },
                    {
                        id : 2,
                        descripcion : "Facturas Temporales"
                    }
                ],
                estadoBotones: ["glyphicon glyphicon-edit",
                    "glyphicon glyphicon-ok",
                    "fa fa-spinner fa-spin",
                    "glyphicon glyphicon-remove"
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
        
        $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
        $scope.columnaSizeBusqueda = "col-md-3";
        
        $scope.filtros = [
            {tipo: '', descripcion: "Todos"},
            {tipo: 'Nombre', descripcion: "Nombre"}
        ];
        $scope.filtro = $scope.root.filtros[0];
        
        $scope.onColumnaSize = function(tipo){
 
        };
        /**
         * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
         *              el tipo de documento seleccionado
         * @param {type} filtro
         * @returns {undefined}
         */
        $scope.onSeleccionFiltro = function (filtro) {

            $scope.filtro = filtro;
            $scope.root.termino_busqueda = '';
        };
        
        
        $scope.buscarClienteFacturaTemporal = function(event){
         
            if (event.which === 13 || event.which === 1) {

                that.listarFacturasTemporal();
            }
             
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
       
       
         /**
         * @author Cristian Ardila
         * @fecha 2017-08-25
         * +Descripcion Metodo encargado de invocar el servicio que consultara  
         *              las facturas en temporal
         */
        that.listarFacturasTemporal = function(){
            $scope.notificarFacturaConsumo = 0;   
            var obj = {
                session: $scope.session,
                data: {
                    listar_facturas_temporal: {
                        filtro: $scope.filtro,
                        terminoBusqueda: $scope.root.termino_busqueda, //$scope.root.numero,
                        paginaActual:$scope.paginaactual
                        
                    }
                }
            };
            
            facturacionClientesService.listarFacturasTemporal(obj,function(data){
                
                
                if(data.status === 200){
                    $scope.root.facturasTemporales = facturacionClientesService.renderCabeceraTmpFacturaConsumo(data.obj.listar_facturas_temporal);
                    $scope.root.itemsFacturasTemporales = data.obj.listar_facturas_temporal.length;
                }else{
                    AlertService.mostrarMensaje("warning", data.msj);
                }
                
            });
            
            
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Funcion encargada de generar el reporte de la factura
         * @fecha 15/06/2017
         * 
         */
        $scope.imprimirReporteFactura = function(entity){
           
            var obj = {                   
                session: $scope.session,
                data: {
                    imprimir_reporte_factura:{
                        empresaId:  entity.empresaId,
                        prefijo: entity.prefijo,
                        numero: entity.numero,
                        paginaActual: 1
                    }
                }
            };
                                   
            facturacionClientesService.imprimirReporteFactura(obj,function(data){
              
                if (data.status === 200) {
                    var nombre = data.obj.consulta_factura_generada_detalle.nombre_pdf;     
                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");          
                }
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
                {cellClass: "ngCellText", width: "5%", displayName: 'Factura', 
                cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_prefijo()}}- {{row.entity.get_numero()}}</p></div>'},
                {cellClass: "ngCellText", width: "25%", displayName: 'Cliente', 
                cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarTerceros()[0].getTipoId()}}- {{row.entity.mostrarTerceros()[0].getId()}}: {{ row.entity.mostrarTerceros()[0].getNombre()}}</p></div>'},
                {field: 'empresa',  cellClass: "ngCellText", width: "10%", displayName: 'Empresa'},
                {field: 'observaciones',  cellClass: "ngCellText", width: "15%", displayName: 'Observacion'},
                {field: 'fechaRegistro',  cellClass: "ngCellText", width: "5%", displayName: 'F. Reg'},
                {field: 'tipoPago',  cellClass: "ngCellText", width: "5%", displayName: 'Tipo pago'},
                {field: 'usuario',  cellClass: "ngCellText", width: "10%", displayName: 'Usuario'},
                {field: 'valorSubTotal',  cellClass: "ngCellText", width: "5%", displayName: 'Sub Total'},
                {field: 'valorTotal',  cellClass: "ngCellText", width: "5%", displayName: 'Total'},               
                {displayName: "Opc", width: "6%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.getEstadoFacturacion() == 0">\n\
                                   <a href="javascript:void(0);" ng-click="detalleFacturaTemporal(row.entity)" class= "glyphicon glyphicon-edit"> Modificar </a>\
                                </li>\
                                <li ng-if="row.entity.getEstadoFacturacion() == 1 ">\
                                   <a href="javascript:void(0);" ng-click="imprimirReporteFactura(row.entity)" class = "glyphicon glyphicon-print"> factura </a>\
                                </li>\
                           </ul>\
                      </div>'
                },
                {field: 'Estado facturacion',  cellClass: "ngCellText",  displayName: 'Estado facturacion', 
                cellTemplate: '<div class="col-xs-16 ">\n\
                    <p class="text-uppercase">{{row.entity.getDescripcionEstadoFacturacion()}}\n\
                <span ng-class="agregar_clase_facturacion(row.entity.getEstadoFacturacion())"></span></p></div>'}, 
                 
            ]
        };
        
        $scope.agregar_clase_facturacion = function(index) {
            return $scope.root.estadoBotones[index];
        };
        
        /**
         * +Descripcion Cristian Ardila
         * @fecha 2017-08-30
         * +Descripcion Metodo encargado de llevar al usuario a la vista donde 
         *              se agregaran productos al detalle del temporal de facturacion
         *              y posteriormente facturar
         */
        $scope.detalleFacturaTemporal = function(entity){   
            if(entity.getEstadoFacturacion() !=="0"){
                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El temporal ya ha sido facturado");
                return;
            };
            
            localStorageService.add("facturaTemporalCabecera",
            {
                nombre_tercero: entity.mostrarTerceros()[0].getNombre(),
                tipo_id_tercero: entity.mostrarTerceros()[0].getTipoId(),
                tercero_id: entity.mostrarTerceros()[0].getId(),
                contrato_cliente_id: entity.mostrarTerceros()[0].getContratoClienteId(),
                tipo_pago: entity.getTipoPagoId(),
                observaciones: entity.getObservaciones(),
                fecha_registro: entity.getFechaRegistro(),
                id_factura_xconsumo: entity.getId(),
                estado:0
            }); 
            $state.go("GuardarFacturaConsumo");
        };
        
        $scope.onCambiarVista = function(vista){
            $scope.root.vistaFacturacion = vista;
        };
                
        $scope.onBtnGenearFactura = function(){
            $state.go("GuardarFacturaConsumo");
        };
        
        /*
         * funcion para paginar anterior
         * @returns {lista datos}
         */
        $scope.paginaAnterior = function () {
            if ($scope.paginaactual === 1)
                return;
            $scope.paginaactual--;
            that.listarFacturasTemporal();
        };


        /*
         * funcion para paginar siguiente
         * @returns {lista datos}
         */
        $scope.paginaSiguiente = function () {
            $scope.paginaactual++;
            that.listarFacturasTemporal();
        };
        
        
        /**
         * @author Cristian Ardila
         * +Descripcion Funcion encargada de crear una ventana de notificaciones
         *              cuando la factura de cosmitet ya esta lista, al presionar click
         *              sobre la notificacion se abrira en una nueva pestaña el
         *              reporte de la factura
         * @fecha 2017-14-16
         */        
        that.notificarSolicitud = function(title, body, parametros) {
             
            webNotification.showNotification(title, {
                body: body,
                icon: '/images/logo.png',
                onClick: function onNotificationClicked() {},
                autoClose: 90000 //auto close the notification after 2 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
                if (error) {
                    window.alert('Error interno: ' + error.message);
                } else {

                    setTimeout(function hideNotification() {

                        hide(); //manually close the notification (you can skip this if you use the autoClose option)
                    }, 90000);
                }
            });
        };
        
        socket.on("onNotificarFacturacionXConsumoTerminada", function(datos) {
                          
            if(datos.status === 201){
                 
                that.notificarSolicitud("#Factura " + datos.obj[1]+" - " +datos.obj[2], 
                datos.msj.mensaje_bd + " - " + datos.msj.mensaje_ws
                );
                $scope.notificarFacturaConsumo++; 
                that.listarFacturasTemporal();
            }
            
            if(datos.status === 203){
                 
               AlertService.mostrarMensaje("warning", datos.msj); 
               that.listarFacturasTemporal();
            }
            
            if(datos.status === 500){   
                AlertService.mostrarMensaje("danger", datos.msj); 
                that.listarFacturasTemporal();
            }
                
        });
        
        if ($state.is("Despacho") === true) {
             
            var storageListaFacturasConsumo = localStorageService.get('listaFacturasConsumo');  
      
            if(storageListaFacturasConsumo){
                that.listarFacturasTemporal();
            }
        }
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
                        that.listarTiposTerceros();
                        //that.listarFacturasTemporal();
                    }
                }
            }
        });
        
 
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {            
            socket.remove(['onNotificarFacturacionTerminada','onNotificarFacturacionXConsumoTerminada']);  
            $scope.$$watchers = null;
            $scope.root.activarTabFacturasGeneradas = false;
            localStorageService.add("listaFacturaDespachoGenerada",null);
            localStorageService.add("localStorageService",null);
            $scope.root = null;
        });
    }]);
});
