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
                fecha_corte: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"), 
                observacion: '',
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
                {field: 'cantidadDespachada',  cellClass: "ngCellText", width: "15%", displayName: 'Cant a despachar'},
                {field: 'cantidadTmpDespachada',  cellClass: "ngCellText", width: "15%", displayName: 'Cant Facturada'},
                {field: 'cantidadFacturada',  cellClass: "ngCellText", width: "15%", displayName: 'Cant por facturar'},
                {field: 'lote',  cellClass: "ngCellText", width: "15%", displayName: 'Lote'},
                {field: 'fechaVencimiento',  cellClass: "ngCellText", width: "10%", displayName: 'Fecha vto'},
                {displayName: 'Cantidad', width: "10%", 
                         cellTemplate: '<div class="col-xs-12 " cambiar-foco> \
                                       <input type="text" \
                                        validacion-numero-entero \
                                        class="form-control grid-inline-input" \
                                        ng-model = "row.entity.cantidadNueva" \
                                        ng-disabled = "row.entity.cantidadDespachada === row.entity.cantidadTmpDespachada "\
                                        name="" \
                                        id="" \
                                        /> </div>'},
                {width: "5%", displayName: "Opcion", cellClass: "txt-center",
                cellTemplate: '<button\
                    ng-disabled="row.entity.cantidadDespachada === row.entity.cantidadTmpDespachada " \n\
                    class="btn btn-default btn-xs" \n\
                    ng-validate-events="{{ habilitar_seleccion_producto() }}" \n\
                    ng-click="guardarTemporalFacturaConsumo(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                    </div>'}
               
            ]
        };
        
        $scope.seleccionarTipoPagoConsumo = function(tipoPago){
            $scope.tipoPagoFacturaConsumo = tipoPago;
        };
        
        $scope.guardarTemporalFacturaConsumo = function(documento){
            
            if(documento.cantidadNueva > documento.cantidadDespachada){
                AlertService.mostrarMensaje("warning", "La cantidad nueva no debe ser mayor a la cantidad a despachar");
                return;
            }
            var obj = {
                session: $scope.session,
                data: {
                    facturas_consumo: {
                        empresaId: $scope.root.documento.empresa,
                        tipoIdTercero: $scope.root.cliente.tipo_id_tercero,
                        terceroId: $scope.root.cliente.id,
                        documentoId:'1',
                        observacion: $scope.root.observacion,
                        fechaCorte: $filter('date')($scope.root.fecha_corte, "yyyy-MM-dd") + " 00:00:00",
                        estado:1,
                        tipoPago: $scope.tipoPagoFacturaConsumo,
                        documentos: {
                            pedido:$scope.root.documento.bodegas_doc_id,
                            empresa: $scope.root.documento.empresa,
                            prefijo: $scope.root.documento.prefijo,
                            numero: $scope.root.documento.numero
                        },
                        documentoDetalle: documento
                    }
                }
            };
            
            facturacionClientesService.generarTemporalFacturaConsumo(obj,function(data){
                
                if(data.status === 200){
                    AlertService.mostrarMensaje("success", data.msj);
                }else{
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            });
        };
       /**
        * @author Eduar Garcia
        * @fecha 11/07/2016
        * +Descripcion Funcion que permitira desplegar el popup datePicker
        *               de la fecha corte
        * @param {type} $event
        */   
       
        $scope.abrir_fecha_corte = function($event) {

           $event.preventDefault();
           $event.stopPropagation();
           $scope.datepicker_fecha_corte = true;
          

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
            console.log("root >>> ", $scope.root.documento);
            
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
                            
                            documento.setValorUnitario(_documento.valor_unitario);                          
                            documento.setPorcIva(_documento.porc_iva);                          
                            documento.setCantidadTmpDespachada(_documento.cantidad_tmp_despachada); 
                            documento.setCantidadNueva(parseInt(_documento.cantidad_despachada) - parseInt(_documento.cantidad_tmp_despachada));
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
