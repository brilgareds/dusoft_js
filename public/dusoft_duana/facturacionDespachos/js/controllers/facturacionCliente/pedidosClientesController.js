define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('pedidosClientesController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho) {
 
                    var that = this;
                    $scope.paginaactual = 1;
                    $scope.paginaactualFacturasGeneradas = 1;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

                    $scope.root = {
                        empresaSeleccionada: '',
                        termino_busqueda: '',
                        estadoSesion: true,
                        items_pedidos_clientes: 0,
                        pedidos_clientes: [],
                        pedidosSeleccionados: [],
                        documentoSeleccionados: [],
                        documentosSeleccionadosFiltrados: [],
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


                    $scope.root.filtro = $scope.root.filtros[0];
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
                    that.listarPedidosClientes = function () {
                       /* console.log("******listarPedidosClientes*********");
                        console.log("******listarPedidosClientes*********");
                        console.log("******listarPedidosClientes*********");*/
                        
                        var resultadoStorage = localStorageService.get("clientePedidoDespacho"); 
                         
                        if(resultadoStorage){
                            var obj = {
                                session: $scope.session,
                                data: {                               
                                    listar_pedidos_clientes: {
                                        terminoBusqueda: $scope.root.termino_busqueda, //$scope.root.numero,
                                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                                        paginaActual: $scope.paginaactual,
                                        tipoIdTercero: resultadoStorage.tipoIdTercero,
                                        terceroId: resultadoStorage.terceroId,
                                        pedidoMultipleFarmacia: '0'
                                    }
                                }
                            };

                            facturacionClientesService.listarPedidosClientes(obj, function (data) {
                                $scope.root.pedidos_clientes = [];
                                var prefijosDocumentos = [];
                                var pedidoClientes = [];
                                var prefijo = [{pedido:57751,prefijo:'EFC',numeracion:145706},{pedido:57751,prefijo:'EFC',numeracion:145707}]
                                if (data.status === 200) {

                                    $scope.root.items_pedidos_clientes = data.obj.listar_pedidos_clientes.length;
                                    console.log("data.obj.listar_pedidos_clientes ", data.obj.listar_pedidos_clientes)
                                    pedidoClientes = facturacionClientesService.renderDocumentosClientes(data.obj.listar_pedidos_clientes, 1);
                                    
                                    /**
                                     * +Descripcion Se recorren los prefijos y se
                                     *              almacenan en un arreglo
                                     */
                                    data.obj.lista_prefijos.forEach(function(rowPrefijos){
                                        
                                        rowPrefijos.forEach(function(rowPrefijosB){
                                            prefijosDocumentos.push(rowPrefijosB)
                                        
                                        });
                                      
                                    }) 
                                    
                                    /**
                                     * +Descripcion Lista de los pedidos que estan listos
                                     *              para facturarse
                                     */
                                    prefijosDocumentos.forEach(function(resultado){
                                          
                                        pedidoClientes.forEach(function(row){                                                                                                
                                            if(resultado.pedido_cliente_id === row.pedidos[0].numero_cotizacion){
                                                //console.log("row ", row.pedidos[0]);
                                                row.pedidos[0].prefijoNumero += " ( " + resultado.prefijo+" - "+ resultado.numero +")";
                                                 row.pedidos[0].agregarDocumentos(facturacionClientesService.renderDocumentosPrefijosClientes(
                                                    row.pedidos[0].numero_cotizacion, 
                                                    resultado.prefijo,
                                                    resultado.numero,
                                                    row.pedidos[0].fechaRegistro,
                                                    resultado.empresa_id))
                                            }                                             
                                        });                                        
                                    });
                                    
                                    $scope.root.pedidos_clientes = pedidoClientes;
                                    
                                } else {
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                }

                            });
                        }
                    };
 
                    /**
                     * +Descripcion Se visualiza la tabla con todos los clientes
                     */
                    $scope.listaClientes = {
                        data: 'root.pedidos_clientes',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        columnDefs: [

                            {field: '#Pedido', cellClass: "ngCellText", width: "15%", displayName: '#Pedido', 
                                cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].get_numero_cotizacion()}}</p></div>'},

                            {field: 'Vendedor', cellClass: "ngCellText", width: "25%", displayName: 'Vendedor', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].mostrarVendedor()[0].getTipoId()}}- {{row.entity.mostrarPedidos()[0].mostrarVendedor()[0].getId()}}: {{ row.entity.mostrarPedidos()[0].mostrarVendedor()[0].getNombre()}}</p></div>'},

                            {field: '#Fecha', cellClass: "ngCellText", width: "15%", displayName: '#Fecha', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].getFechaRegistro()}}</p></div>'},

                            //{field: '#Documento',  cellClass: "ngCellText", width: "25%", displayName: '#Factura', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].getPrefijoNumero()}}</p></div>'},
                            //{field: '#Documento',  cellClass: "ngCellText", width: "25%", displayName: '#Factura', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].mostrarFacturas()}}</p></div>'},
                            
                            
                            {filed: 'PRUEBA', 
                                cellClass: "ngCellText", 
                                width: "25%", 
                                displayName: '#Factura',
                                cellTemplate: '<ul >\
                                    <li class="listaPrefijos" ng-repeat="item in row.entity.mostrarPedidos()[0].mostrarFacturas()" >\
                                      <input type="checkbox"\n\
                                       ng-click="onDocumentoSeleccionado($event.currentTarget.checked,this)"> {{item.prefijo}} - {{item.numero}} <br> \
                                    </li>\
                                  </ul>'},
                            {displayName: "Opc", cellClass: "txt-center dropdown-button",
                                cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li>\n\
                                   <a href="javascript:void(0);" ng-click="generarFacturaIndividual(row.entity)" class= "glyphicon glyphicon-refresh"> Generar factura individual </a>\
                                </li>\
                                <li ng-if="row.entity.mostrarPedidos()[0].mostrarFacturas()[0].get_numero() > 0 ">\
                                   <a href="javascript:void(0);" ng-click="listarTodoMedicamentosDispensados(row.entity)" class = "glyphicon glyphicon-print"> Imprimir pedido </a>\
                                </li>\
                                <li ng-if="row.entity.mostrarPedidos()[0].mostrarFacturas()[0].get_numero() > 0 ">\
                                   <a href="javascript:void(0);" ng-click="listarTodoMedicamentosDispensados(row.entity)" class = "glyphicon glyphicon-print"> Imprimir documento </a>\
                                </li>\
                           </ul>\
                      </div>'
                            },
                           
                            {field: '', cellClass: "checkseleccion", width: "3%",
                                cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)'" +
                                        " ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"}, 
                        ]
                    };

                    that.quitarPedido = function (pedido) {
                        
                        for (var i in $scope.root.pedidosSeleccionados) {
                            var _pedido = $scope.root.pedidosSeleccionados[i];
                            if (_pedido.mostrarPedidos()[0].get_numero_cotizacion() === pedido.mostrarPedidos()[0].get_numero_cotizacion()) {
                                $scope.root.pedidosSeleccionados.splice(i, true);
                                break;
                            }
                        }
                    };

                    that.agregarPedido = function (pedido) {
                        //valida que no exista el pedido en el array
                        for (var i in $scope.root.pedidosSeleccionados) {
                            var _pedido = $scope.root.pedidosSeleccionados[i];
                            if (_pedido.mostrarPedidos()[0].get_numero_cotizacion() === pedido.mostrarPedidos()[0].get_numero_cotizacion()) {
                                return false;
                            }
                        }
                        $scope.root.pedidosSeleccionados.push(pedido);
                    };


                    $scope.onPedidoSeleccionado = function (check, row) {
                        
                        row.selected = check;
                        if (check) {
                            that.agregarPedido(row.entity);
                        } else {

                            that.quitarPedido(row.entity);
                        }
 
                    };


                    
                    $scope.buscarSeleccion = function (row) {
                        var pedido = row.entity;
                        
                        for (var i in $scope.pedidosSeleccionados) {
                            var _pedido = $scope.pedidosSeleccionados[i];
                            if (_pedido.mostrarPedidos()[0].get_numero_cotizacion() === pedido.mostrarPedidos()[0].get_numero_cotizacion()) {
                                row.selected = true;
                                return true;
                            }
                        }

                        row.selected = false;
                        return false;
                    };
                    
                    
                    
                    /**
                     * +Descripcion Metodo encargados del checkbox para seleccionar
                     *              un documento
                     */
                    /*************************************************************/
                    /*************************************************************/
                    /*************************************************************/
                    /*************************************************************/
                    
                    that.quitarDocumento = function (documento) {
                        
                        for(var i in $scope.root.documentoSeleccionados) {
                            var _documento = $scope.root.documentoSeleccionados[i];
                            if (_documento.prefijo === documento.prefijo && _documento.numero === documento.numero) {
                                $scope.root.documentoSeleccionados.splice(i, true);
                                break;
                            }  
                        }
                       
                    }; 

                    that.agregarDocumento = function (documento) {
                       
                        for(var i in $scope.root.documentoSeleccionados) {
                            var _documento = $scope.root.documentoSeleccionados[i];
                            if(_documento.prefijo === documento.prefijo && _documento.numero === documento.numero) {
                                return false;
                            }  
                        }
                        $scope.root.documentoSeleccionados.push(documento);
                      
                    }; 


                    $scope.onDocumentoSeleccionado = function (check, row) {
                       // console.log("row ", row)
                        row.selected = check;
                        
                        if (check) {
                            that.agregarDocumento(row.item);
                        }else {

                            that.quitarDocumento(row.item);
                        }
 
                    }; 
                   
                    /**
                     * +Descripcion Metodo encargado de invocar el servicio
                     *              que generara las facturas agrupadas
                     * @author Cristian Ardila
                     * @fecha 2017-08-05
                     */
                    $scope.generarFacturasAgrupadas = function () {
                        
                        var resultadoStorage = localStorageService.get("clientePedidoDespacho");

                        if (resultadoStorage) {
                            
                            if ($scope.root.pedidosSeleccionados.length > 1) {

                                var parametros = {
                                    terminoBusqueda: $scope.root.termino_busqueda, //$scope.root.numero,
                                    empresaSeleccionada: $scope.root.empresaSeleccionada,
                                    paginaActual: $scope.paginaactual,
                                    tipoIdTercero: resultadoStorage.tipoIdTercero,
                                    terceroId: resultadoStorage.terceroId,
                                    tipoPagoFactura: $scope.tipoPagoFactura,
                                    pedidosSeleccionados: $scope.root.pedidosSeleccionados,
                                    facturacionCosmitet: '0',
                                    session: $scope.session,
                                    AlertService: AlertService,
                                    documentoSeleccionados: $scope.root.documentoSeleccionados
                                };
                           
                                facturacionClientesService.generarFacturasAgrupadasCompleta(parametros, function (data) {
                                    /**
                                     * +Descripcion si se genera la factura satisfacturiamente,
                                     *              el sistema activara la vista que lista las facturas generadas
                                     *              haciendo referencia a la factura reciente
                                     */
                                    if (data.status === 200) {

                                        localStorageService.add("listaFacturaDespachoGenerada",
                                            {active: true,
                                            datos: data.obj.generar_factura_agrupada[0],
                                            mensaje: data.obj.resultado_sincronizacion_ws.resultado}
                                        );
                                        $state.go('Despacho');
                                        AlertService.mostrarMensaje("warning", data.msj);
                                    }
                                    if (data.status === 404) {
                                        AlertService.mostrarMensaje("warning", data.msj);
                                    }
                                    if (data.status === 409) {
                                        AlertService.mostrarMensaje("danger", data.msj);
                                    }
                                    if (data.status === 500) {
                                        AlertService.mostrarMensaje("danger", data.msj);
                                    }
                                }); 
                                
                            }else{
                                AlertService.mostrarMensaje("warning", "Debe seleccionar mas de dos pedidos");
                            }
                        }
                    };
                    
                   
                    /**
                     * @author Cristian Ardila
                     * +Descripcion Metodo encargado de generar una factura individual
                     * @fecha 2017-05-09
                     */
                    $scope.generarFacturaIndividual = function (pedido) {
                          
                        var resultadoStorage = localStorageService.get("clientePedidoDespacho"); 
                        
                        if(resultadoStorage){                           
                        
                            var parametros = {
                                pedido:pedido,
                                tipoIdTercero:resultadoStorage.tipoIdTercero,
                                terceroId:resultadoStorage.terceroId,
                                AlertService:AlertService,
                                documentoSeleccionados:$scope.root.documentoSeleccionados,
                                session:$scope.session,
                                terminoBusqueda:$scope.root.termino_busqueda,
                                empresaSeleccionada:$scope.root.empresaSeleccionada,
                                paginaactual:$scope.paginaactual,
                                tipoPagoFactura:$scope.tipoPagoFactura,
                                facturacionCosmitet: 0
                            };
                                       
                            facturacionClientesService.generarFacturaIndividualCompleta(parametros, function (data) {
                                            
                                /**
                                 * +Descripcion si se genera la factura satisfacturiamente,
                                 *              el sistema activara la vista que lista las facturas generadas
                                 *              haciendo referencia a la factura reciente
                                 */
                                if (data.status === 200) {  
                                    localStorageService.add("listaFacturaDespachoGenerada",
                                        {active:true, 
                                        datos:data.obj.generar_factura_individual[0],
                                        mensaje:data.obj.resultado_sincronizacion_ws.resultado}
                                    );
                                    $state.go('Despacho');                                          
                                    AlertService.mostrarMensaje("warning", data.msj);
                                }
                                if(data.status === 404){
                                    AlertService.mostrarMensaje("warning", data.msj);
                                }
                                if(data.status === 409){
                                    AlertService.mostrarMensaje("danger", data.msj);
                                }
                                if(data.status === 500){
                                    AlertService.mostrarMensaje("danger", data.msj);
                                }
                            });                                            
                        }
                                               
                    };
                     
                    $scope.seleccionarTipoPago = function(tipoPago){
                        $scope.tipoPagoFactura = tipoPago;
                    };
                    /**
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              listara los clientes para facturar
                     *  @parametros ($event = eventos del teclado)
                     */
                    $scope.buscarClientesFactura = function (event) {

                        if (event.which === 13 || event.which === 1) {

                            that.listarPedidosClientes();
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
                        that.listarPedidosClientes();
                    };


                    /*
                     * funcion para paginar siguiente
                     * @returns {lista datos}
                     */
                    $scope.paginaSiguiente = function () {
                        $scope.paginaactual++;
                        that.listarPedidosClientes();
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

                                    that.listarPedidosClientes();
                                     
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
