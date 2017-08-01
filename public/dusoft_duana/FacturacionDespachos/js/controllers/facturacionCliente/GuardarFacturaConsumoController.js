define(["angular", "js/controllers", "js/models/FacturaConsumo",
        "js/models/FacturaDetalleConsumo", "js/models/DocumentoDetalleConsumo"], function (angular, controllers) {

    var fo = controllers.controller('GuardarFacturaConsumoController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
        "$timeout",
        "$filter",
        "localStorageService",
        "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho","webNotification",
        "TerceroDespacho","FacturaConsumo","FacturaDetalleConsumo","DocumentoDetalleConsumo",
    function ($scope, $rootScope, Request, API, AlertService, Usuario,
            $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho,webNotification,
            TerceroDespacho, FacturaConsumo, FacturaDetalleConsumo, DocumentoDetalleConsumo) {
 
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
                clientes:[],
                cliente:null,
                factura:null,
                documentos:[], 
                documento:null
            };
            $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            callback();
        };
        
        $scope.listaDetalleDocumento = {
            data: 'root.documento.getDetalle()',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'producto',  cellClass: "ngCellText", width: "15%", displayName: 'Producto'},
                {field: 'cantidaDespachada',  cellClass: "ngCellText", width: "15%", displayName: 'Cant despachada'},
                {field: 'cantidadFacturada',  cellClass: "ngCellText", width: "15%", displayName: 'Cant Facturada'},
                {field: 'cantidadPorFacturar',  cellClass: "ngCellText", width: "15%", displayName: 'Cant por facturar'},
                {field: 'lote',  cellClass: "ngCellText", width: "15%", displayName: 'Lote'},
                {field: 'fechaVencimiento',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha vto'},
                {field: 'cantidadAFacturar',  cellClass: "ngCellText", width: "15%", displayName: 'Cant a facturar', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaFinal()}}</p></div>'},

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
       
       /**
        * @author Eduar Garcia
        * @fecha 24/07/2016
        * +Descripcion Handler del dropdown al seleccionar un cliente
        * @param {type} $event
        */   
        $scope.onSeleccionarCliente = function(){
           
        };
  
        $scope.onCambiarVista = function(vista){
            $scope.root.vistaFacturacion = vista;
        };
                
        $scope.onBtnGenearFactura = function(){
            $state.go("GuardarFacturaConsumo");
        };
        
        $scope.onDocumentoSeleccionado = function(){
            console.log("root ", $scope.root.documento);
            
            var obj = {
                session: $scope.session,
                data: {
                    facturas_consumo: {
                        numero_documento: $scope.root.documento.get_numero(),
                        prefijo_documento: $scope.root.documento.get_prefijo(),
                        empresa_id:$scope.root.documento.get_empresa()
                    }
                }
            };
            
            facturacionClientesService.obtenerDetallePorFacturar(obj,function(respuesta){
                if(respuesta.status === 200){
                    $scope.root.documento.vaciarDetalle();
                    var _documentos = respuesta.obj.detalle;
                    for(var i in _documentos){
                        var _documento = _documentos[i];
                        var documento = DocumentoDetalleConsumo.get(_documento.codigo_producto, _documento.cantidad_despachada, _documento.lote, _documento.fecha_vencimiento);
                        $scope.root.documento.agregarDetalle(documento);
                    }
                }
                
            });
        };
        
        
        $scope.listarDocumentos = function(busqueda){
            if(busqueda.length < 3){
                return;
            }
                        
            var obj = {
                session: $scope.session,
                data: {
                    facturas_consumo: {
                        numeroDocumento: busqueda,
                        tipoTerceroId: $scope.root.cliente.getTipoId(),
                        terceroId:$scope.root.cliente.getId()
                    }
                }
            };
                        
            facturacionClientesService.listarDocumentos(obj, function(data){
                if(data.status === 200){
                    var _documentos = data.obj.facturas_consumo;
                    
                    
                    for(var i in _documentos){
                        var _documento = _documentos[i];
                        $scope.root.documentos.push(facturacionClientesService.renderDocumentosPrefijosClientes(
                            _documento.pedido_cliente_id, 
                            _documento.prefijo,
                            _documento.numero,
                            _documento.fecha_registro,
                            _documento.empresa_id
                        ));
                              
                    }
                }
            });
                
        };
        
        /**
        * @author Eduar Garcia
        * @fecha 21/07/2017
        * +Descripcion Permite consumir el API para listar clientes
        * @param {type} $event
        */ 
        $scope.listarClientes = function(busqueda){
            if(busqueda.length < 3){
                return;
            }
            
            var empresa =  Usuario.getUsuarioActual().getEmpresa();
            
            var obj = {
                session: $scope.session,
                data: {
                    listar_clientes: {
                        empresaId: empresa.getCodigo(),
                        terminoBusqueda: busqueda,
                        paginaActual: 1,
                        filtro:{
                            tipo: "Nombre"
                        }
                    }
                }
            };
                        
            facturacionClientesService.listarClientes(obj ,function(respuesta){
                if(respuesta.status === 200){
                    $scope.root.clientes = facturacionClientesService.renderTerceroDespacho(respuesta.obj.listar_clientes);
                    console.log($scope.root.clientes)
                }
                
            });
            
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
