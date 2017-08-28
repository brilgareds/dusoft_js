define(["angular", "js/controllers", "js/models/FacturaConsumo",
        "js/models/FacturaDetalleConsumo", "js/models/DocumentoDetalleConsumo"], function (angular, controllers) {

    var fo = controllers.controller('GuardarFacturaConsumoController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
        "$timeout",
        "$filter",
        "localStorageService",
        "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho","webNotification",
        "TerceroDespacho","FacturaConsumo","FacturaDetalleConsumo","DocumentoDetalleConsumo","DocumentoDespacho",
    function ($scope, $rootScope, Request, API, AlertService, Usuario,
            $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho,webNotification,
            TerceroDespacho, FacturaConsumo, FacturaDetalleConsumo, DocumentoDetalleConsumo, DocumentoDespacho) {
 
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
                documento:null,
                detalleDocumentoTmp: [],
                valorFacturaTemporal: {
                    valorTotal: 0,
                    valorSubTotal: 0,
                    valorTotalIva: 0
                }
            };
            $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            callback();
        };
        $scope.disabledDropDownCliente = false;
        $scope.disabledDropDownDocumento = true;
        
        /**
         * +Descripcion Grid que lista el detalle del efc seleccionado
         */
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
                {field: 'cantidadPendientePorFacturar',  cellClass: "ngCellText", width: "15%", displayName: 'Cant por facturar'},
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
                    ng-click="guardarTemporalFacturaConsumo(row.entity)" >\n\
                    <span ng-class="claseIconButton(row.entity)"></span></button>\
                    </div>'}
               
            ]
        };
        
        $scope.estadosProductosFacturados = [            
            "glyphicon glyphicon-ok",
            "glyphicon glyphicon-saved"
        ];
        $scope.claseIconButton = function(entity){
            
            return $scope.estadosProductosFacturados[entity.estadoEntrega];
             
        }
        
         /**
         * +Descripcion Grid que lista el detalle del efc seleccionado
         */
        $scope.listaDetalleDocumentoTmp = {
            data: 'root.detalleDocumentoTmp[0]',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'producto',  cellClass: "ngCellText", width: "15%", displayName: 'Producto'},
                {field: 'cantidadDespachada',  cellClass: "ngCellText", width: "15%", displayName: 'Cant a despachar'},
                {field: 'lote',  cellClass: "ngCellText", width: "15%", displayName: 'Lote'},
                {field: 'fechaVencimiento',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha vto'},
                {field: 'valorUnitario',  cellClass: "ngCellText", width: "10%", displayName: 'Valor unitario'},
                
                { displayName: "Opcion", cellClass: "txt-center",
                cellTemplate: '<button\
                    class="btn btn-default btn-xs" \n\
                    ng-validate-events="{{ habilitar_seleccion_producto() }}" \n\
                    ng-click="eliminarTemporalFacturaConsumo(row.entity)" ><span class="glyphicon glyphicon-remove"></span></button>\
                    </div>'}
               
            ]
        };
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo invocado cuando se selecciona el tipo de pago
         */
        $scope.seleccionarTipoPagoConsumo = function(tipoPago){
            $scope.tipoPagoFacturaConsumo = tipoPago;
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de invocar el servicio que eliminara
         *              un producto del detalle de la factura temporal
         * @fecha 10-08-2017 DD-MM-YYYY
         */
        $scope.eliminarTemporalFacturaConsumo = function(documento){
           
            var obj = {
                session: $scope.session,
                data: {
                    eliminar_producto_tmp: {
                        id: documento.id,
                        codigoProducto: documento.producto,
                        lote: documento.lote,
                        fechaVencimiento: documento.fechaVencimiento,
                        
                    }
                }
            };
            
            facturacionClientesService.eliminarProductoTemporalFacturaConsumo(obj,function(data){
                
                if(data.status === 200){
                    AlertService.mostrarMensaje("success", data.msj);
                    that.listarDetalleTmpFacturaConsumo();
                    $scope.onDocumentoSeleccionado();
                }else{
                    AlertService.mostrarMensaje("warning", data.msj);
                }
                
            });
        };
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de registrar en la tabla de temporal
         *              los productos del EFC a facturar
         */
        $scope.guardarTemporalFacturaConsumo = function(documento){
            
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
                    that.listarDetalleTmpFacturaConsumo();
                    $scope.onDocumentoSeleccionado();
                }else{
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            });
        };
        
       /**
        * @author Cristian Ardila
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
        
        $scope.onBtnVolverListaClientes = function(){
            localStorageService.add("listaFacturasConsumo",{active:true});                      
            $state.go('Despacho');     
        };
        
        $scope.generarFacturaXConsumo = function(){
            
            if(!$scope.root.documento){
                AlertService.mostrarMensaje("warning", "Para realizar la facturacion, debe seleccionar el cliente y el documento"); 
                return;
            }
            var obj = {
                session: $scope.session,
                data: {
                    generar_factura_consumo: {
                        empresa_id:$scope.root.documento.get_empresa(),
                        tipoTerceroId: $scope.root.cliente.getTipoId(),
                        terceroId:$scope.root.cliente.getId(),
                        contratoClienteId: $scope.root.cliente.contratoClienteId
                    }
                }
            };
            AlertService.mostrarVentanaAlerta("Generar factura por consumo", "Confirma que realizara la facturacion por consumo ? ",
                function (estadoConfirm) {
                    if (estadoConfirm) {
                        facturacionClientesService.generarFacturaXConsumo(obj, function(data){

                            if(data.status === 200){
                                AlertService.mostrarMensaje("success", data.msj); 
                                localStorageService.add("listaFacturaDespachoGenerada",
                                {
                                    active:true,  
                                    datos: data.obj.generar_factura_consumo[0],
                                    mensaje: data.obj.resultado_sincronizacion_ws.resultado
                                });                 
                                $state.go('Despacho');                       
                            }else{
                                AlertService.mostrarMensaje("warning", data.msj);
                            }
                        });           
                    }
                });
            
        };
        
        that.listarDetalleTmpFacturaConsumo = function(){
            $scope.root.detalleDocumentoTmp = [];
            var obj = {
                session: $scope.session,
                data: {
                    facturas_consumo: {
                        numero_documento: $scope.root.documento.get_numero(),
                        prefijo_documento: $scope.root.documento.get_prefijo(),
                        empresa_id:$scope.root.documento.get_empresa(),
                        tipoTerceroId: $scope.root.cliente.getTipoId(),
                        terceroId:$scope.root.cliente.getId()
                    }
                }
            };
            facturacionClientesService.consultarDetalleTemporalFacturaConsumo(obj, function(data){
                
                if(data.status === 200){
                    $scope.root.valorFacturaTemporal.valorTotal = data.obj.procesar_factura_cosmitet[0].valor_total;
                    $scope.root.valorFacturaTemporal.valorSubTotal = data.obj.procesar_factura_cosmitet[0].valor_sub_total;
                    $scope.root.valorFacturaTemporal.valorTotalIva = data.obj.procesar_factura_cosmitet[0].valor_total_iva;
                    
                    $scope.root.detalleDocumentoTmp.push(facturacionClientesService.renderDetalleTmpFacturaConsumo(data.obj.procesar_factura_cosmitet));
                    
                }else{
                    AlertService.mostrarMensaje("warning", data.msj);
                }
                    
            });
        };
        
        /**
         * +Descripcion Metodo encargado de listar el detalle del documento que
         *              se va a almacenar en temporal
         * @author Eduar Garcia
         * 
         */
        $scope.onDocumentoSeleccionado = function(){
            console.log("root >>> ", $scope.root.documento);
            
            var obj = {
                session: $scope.session,
                data: {
                    facturas_consumo: {
                        numero_documento: $scope.root.documento.get_numero(),
                        prefijo_documento: $scope.root.documento.get_prefijo(),
                        empresa_id:$scope.root.documento.get_empresa(),
                        tipoTerceroId: $scope.root.cliente.getTipoId(),
                        terceroId:$scope.root.cliente.getId(),
                        contratoClienteId: $scope.root.cliente.getContratoClienteId(),
                    }
                }
            };
           
            facturacionClientesService.obtenerDetallePorFacturar(obj,function(respuesta){
                if(respuesta.status === 200){
                    
                    $scope.root.documento.vaciarDetalle();
                    that.listarDetalleTmpFacturaConsumo();
                    var _documentos = respuesta.obj.detalle;
                    for(var i in _documentos){
                        var _documento = _documentos[i];
                     
                        var documento = DocumentoDetalleConsumo.get(_documento.codigo_producto, _documento.cantidad_despachada, _documento.lote, _documento.fecha_vencimiento);
                            
                            documento.setValorUnitario(_documento.valor_unitario);                          
                            documento.setCantidadPendientePorFacturar(_documento.cantidad_pendiente_por_facturar);                          
                            documento.setPorcIva(_documento.porc_iva);                          
                            documento.setEstadoEntrega(_documento.estado_entrega);                          
                            documento.setCantidadTmpDespachada(_documento.cantidad_tmp_despachada); 
                            documento.setCantidadNueva(parseInt(_documento.cantidad_despachada) - parseInt(_documento.cantidad_tmp_despachada));
                            $scope.root.documento.agregarDetalle(documento);
                    }
                }
                
            });
        };
        
        
        //$scope.listarDocumentos = function(busqueda){
            
            /*if(busqueda.length < 1){
                return;
            }*/
                        
          /*  that.listarDocumento(busqueda, function(data){
                
            });
                
        };*/
        
        that.listarDocumento = function(busqueda, callback){
            console.log("busqueda ", busqueda)
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
                $scope.root.documentos = [];
                
                if(data.status === 200){
                    $scope.disabledDropDownDocumento = false;
                    var _documentos = data.obj.facturas_consumo;
                    callback(_documentos);
                    
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
                }else{
                    $scope.disabledDropDownDocumento = true;
                }
            });
        };
        
        $scope.onListarDocumentosClientes = function(){
            $scope.root.documento = null;
            $scope.root.detalleDocumentoTmp = [];
            that.listarDocumento("", function(data){
                    
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
            
            that.listarCliente(busqueda, function(estado){
                
            });
            
        };
        
        that.listarCliente = function(busqueda, callback){
            
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
                    callback(true);
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
                        var lsTemp = localStorageService.get("facturaTemporalCabecera");
                        if(lsTemp){
                            $scope.disabledDropDownCliente = true;
                            $scope.tipoPagoFacturaConsumo = lsTemp.tipo_pago;
                            $scope.root.observacion = lsTemp.observaciones;
                            that.listarCliente(lsTemp.nombre_tercero, function(estado){
                                if(estado){
                                    $scope.root.cliente = TerceroDespacho.get(lsTemp.nombre_tercero, 
                                    lsTemp.tipo_id_tercero, 
                                    lsTemp.tercero_id,
                                    "",
                                    "");
                                    $scope.root.cliente.setContratoClienteId(lsTemp.contrato_cliente_id)
                                    
                                    that.listarDocumento("", function(data){
                                        console.log("data -------***>", data)
                                        $scope.root.documento = DocumentoDespacho.get(data[0].pedido_cliente_id, 
                                        data[0].prefijo,data[0].numero,data[0].fecha_registro,data[0].empresa_id);
                                        $scope.root.documento.set_empresa(data[0].empresa_id);
                                        $scope.onDocumentoSeleccionado();
                                    });                                                                      
                                }
                            });             
                        }
                    }
                }
            }
        });
         
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {            
            socket.remove(['onNotificarFacturacionTerminada']);  
            $scope.$$watchers = null;
            $scope.root.activarTabFacturasGeneradas = false;
            //localStorageService.add("listaFacturaDespachoGenerada",null);
            localStorageService.add("facturaTemporalCabecera",null);
            $scope.root = null;
        });
    }]);
});
