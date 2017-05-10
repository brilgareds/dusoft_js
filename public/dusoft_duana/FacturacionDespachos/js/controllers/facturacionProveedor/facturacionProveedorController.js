define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('facturacionProveedorController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService","facturacionProveedoresService","EmpresaDespacho","Usuario",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService,facturacionProveedoresService,EmpresaDespacho,Sesion) {

                 
                    var that = this;
                    $scope.paginaactual = 1;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    var fecha_actual = new Date();
                    that.recepcionesId="";
                    that.total=0;
                    $scope.format= 'dd-MM-yyyy'
                    $scope.root = {
                        totalFactura:0,
                        totalDescuento:0,
                        fechaVencimiento:$filter('date')(fecha_actual, "yyyy-MM-dd"),
                        fechaFactura:$filter('date')(fecha_actual, "yyyy-MM-dd"),
                        numeroFactura:"",
                        descripcionFija:"",
                        descripcionFactura:"",
                        descripcionFija:"",
                        termino_busqueda_proveedores: "",
                        fecha_inicial_aprobaciones:"", //$filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                        fecha_final_aprobaciones:"",//$filter('date')(fecha_actual, "yyyy-MM-dd"),
                        empresaSeleccionada: '',
                        termino_busqueda: '',
                        estadoSesion: true,
                        items: 0,
                        productosRecepcion:[],
                        clientes: [],
                        pedidosSeleccionados : [],
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
                        {tipo: 'Nombre', descripcion: "Nombre"}
                        
                    ];

                    $scope.root.filtro = $scope.root.filtros[0];

                    $scope.onColumnaSize = function (tipo) {

                        if (tipo === "AS" || tipo === "MS" || tipo === "CD") {
                            $scope.columnaSizeBusqueda = "col-md-4";
                        } else {
                            $scope.columnaSizeBusqueda = "col-md-3";
                        }

                    };

                    $scope.onSeleccionFiltro = function (filtro) {

                        $scope.root.filtro = filtro;
                        $scope.root.termino_busqueda = '';
                        $scope.root.visibleBuscador = true;
                        $scope.root.visibleListaEstados = false;
                        $scope.root.visibleBotonBuscador = true;
                    };


                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha iniciañ
                     * @param {type} $event
                     */
                    $scope.abrir_fecha_inicial = function ($event) {

                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.root.datepicker_fecha_inicial = true;
                        $scope.root.datepicker_fecha_final = false;
                        $scope.root.datepicker_fechaFactura = false;
                        $scope.root.datepicker_fechaVencimiento = false;

                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha final
                     * @param {type} $event
                     */
                    $scope.abrir_fecha_final = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.root.datepicker_fecha_inicial = false;
                        $scope.root.datepicker_fecha_final = true;
                        $scope.root.datepicker_fechaFactura = false;
                        $scope.root.datepicker_fechaVencimiento = false;

                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha final
                     * @param {type} $event
                     */
                    $scope.abrir_fechaFactura = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.root.datepicker_fecha_inicial = false;
                        $scope.root.datepicker_fecha_final = false;
                        $scope.root.datepicker_fechaFactura = true;
                        $scope.root.datepicker_fechaVencimiento = false;

                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha final
                     * @param {type} $event
                     */
                    $scope.abrir_fechaVencimiento = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.root.datepicker_fecha_inicial = false;
                        $scope.root.datepicker_fecha_final = false;
                        $scope.root.datepicker_fechaFactura = false;
                        $scope.root.datepicker_fechaVencimiento = true;

                    };
                    
                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara 
                     *              los tipos de terceros
                     * @author Andres Mauricio Gonzalez
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarTiposTerceros = function () {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_tipo_terceros: {

                                }
                            }
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
                     * @author Andres Mauricio Gonzalez
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarRecepcionProductos = function (dato,callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                detalleRecepcionParcial: {
                                    recepcion_parcial_id:dato.recepcion_parcial,
                                    paginaActual: '1',
                                    empresa_id:Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                                    porcentajeCree:dato.get_porcentaje_cree(),
                                    porcentajeRtf:dato.get_porcentaje_rtf(),
                                    porcentajeIca:dato.get_porcentaje_ica(),
                                    porcentajeReteiva:dato.get_porcentaje_reteiva(),
                                }
                            }
                        };
                         
                        facturacionProveedoresService.detalleRecepcion(obj, function (data) {
                            $scope.root.clientes = [];
                            if (data.status === 200) { 
                              var resultado=[];
                              $scope.root.productosRecepcion = facturacionProveedoresService.renderProductosRecepcion(data.obj.detalleRecepcionParcial);
                              console.log("$scope.root.productosRecepcion",dato);
                              $scope.root.Totales = facturacionProveedoresService.renderTotales(data.obj.detalleRecepcionParcial);
                              resultado['detalle']=$scope.root.productosRecepcion;
                              resultado['total']=$scope.root.Totales;
                              resultado['recepcion_parcial']=dato;
                              callback(resultado);    
                            } else {
                              AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                              callback(true);
                            }
                          
                        });
                        
                    };
                    
                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara 
                     *              los tipos de terceros
                     * @author Andres Mauricio Gonzalez
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarProveedores = function () {
                        var inicioFecha="";
                        var finFecha="";
                        
                        if($scope.root.termino_busqueda===''){
                            return;
                        }
                        if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                            $scope.paginaactual = 1;
                        }
                        
                        if($scope.root.fecha_inicial_aprobaciones !== ""){
                            var mes=$scope.root.fecha_inicial_aprobaciones.getMonth()+1;
                            inicioFecha = $scope.root.fecha_inicial_aprobaciones.getDate()+"/"+mes+"/"+$scope.root.fecha_inicial_aprobaciones.getFullYear();
                        }
                        
                        if($scope.root.fecha_final_aprobaciones !== ""){
                            var mes=$scope.root.fecha_final_aprobaciones.getMonth()+1;
                            finFecha = $scope.root.fecha_final_aprobaciones.getDate()+"/"+mes+"/"+$scope.root.fecha_final_aprobaciones.getFullYear();
                        }
                        
                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_clientes: {
                                    filtro:$scope.root.filtro,
                                    terminoBusqueda: $scope.root.termino_busqueda,
                                    empresaId:$scope.root.empresaSeleccionada.getCodigo(),
                                    fechaInicio:inicioFecha,
                                    fechaFin:finFecha,
                                    paginaActual:$scope.paginaactual
                                }
                            }
                        };
                         
                        facturacionProveedoresService.listarOrdenCompraProveedores(obj, function (data) {
                            $scope.root.clientes = [];
                            if (data.status === 200) { 
                                $scope.root.items = data.obj.listarOrdenesCompraProveedor.length;  
                                $scope.ultima_busqueda = $scope.termino_busqueda;
                                $scope.root.ordenProveedores = facturacionProveedoresService.renderOrdenesComprasProveedores(data.obj.listarOrdenesCompraProveedor);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                          
                        });
                        
                    };
                    
            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 10/05/2017
             * @returns {pagina}
             */
             $scope.paginaAnterior = function() {
                if($scope.paginaactual === 1) return;
                $scope.paginaactual--;
                that.listarProveedores();
            };
            
            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 10/05/2017
             * @returns {pagina}
             */
            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                that.listarProveedores();
            };
                    
                    /**
                     * +Descripcion Se visualiza la tabla con todos los clientes
                     */
                    $scope.listaProductos = {
                        data: 'root.productosRecepcion',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        showFooter: true,
                        enableHighlighting: true,
                        footerTemplate: '   <div class="row col-md-12">\
                                        <div class="">\
                                            <table class="table table-clear text-center">\
                                                <thead>\
                                                    <tr>\
                                                        <th class="text-center" >CANTIDAD</th>\
                                                        <th class="text-center">SUBTOTAL</th>\
                                                        <th class="text-center">IVA</th>\
                                                        <th class="text-center">RET-FTE</th>\
                                                        <th class="text-center">RETE-ICA</th>\
                                                        <th class="text-center">RETE-IVA</th>\
                                                        <th class="text-center">IMPTO CREE</th>\
                                                        <th class="text-center">VALOR TOTAL</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody>\
                                                    <tr>\
                                                        <td class="right">{{root.Totales.cantidad}}</td> \
                                                        <td class="right">{{root.Totales._subTotal | currency:"$"}}</td> \
                                                        <td class="right">{{root.Totales._iva | currency:"$"}}</td> \
                                                        <td class="right">{{root.Totales.valorRetFte | currency:"$"}}</td> \
                                                        <td class="right">{{root.Totales.valorRetIca | currency:"$"}}</td> \
                                                        <td class="right">{{root.Totales.valorRetIva | currency:"$"}}</td> \
                                                        <td class="right">{{root.Totales.impuestoCree | currency:"$"}}</td> \
                                                        <td class="right">{{root.Totales.subtotal | currency:"$"}}</td> \
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                        columnDefs: [

                            {field: 'Codigo Producto', width: "10%", displayName: 'Codigo Producto',cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getCodigoProducto()}}</p></div>'},
                           
                            {field: 'Descripcion', width: "40%", displayName: 'Descripcion',cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcion()}}</p></div>'},
                            
                            {field: 'Cantidad', width: "10%", displayName: 'Cantidad',cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_cantidad_solicitada()}}</p></div>'},
                            
                            {field: 'Valor', width: "10%", displayName: 'Valor', cellClass: "ngCellText",cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_valor_unitario()| currency:"$"}}</p></div>'},
                                                        
                            {field: '%Iva', width: "5%", displayName: '%Iva',cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_iva()}}</p></div>'},
                            
                            {field: 'Lote', width: "5%", displayName: 'Lote',cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.get_lote()}}</p></div>'},
                            
                            {field: 'Fecha Vencimiento', width: "10%",cellClass: "ngCellText", displayName: 'Fecha Vencimiento', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_fecha_vencmiento()| date:"dd-MM-yyyy"}}</p></div>'},
                            
                            {field: 'SubTotal', width: "10%", displayName: 'SubTotal', cellClass: "ngCellText",cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_cantidad_solicitada() * row.entity.get_valor_unitario()| currency:"$"}}</p></div>'},
                            
                           ]
                    };//ng-click="onAbrirVentana()"
                    
                    /**
                     * +Descripcion Se visualiza la tabla con todos los clientes
                     */
                    $scope.listaProveedores = {
                        data: 'root.ordenProveedores',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        columnDefs: [

                            {field: '#OC', width: "7%", displayName: '#OC', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_numero_orden()}}</p></div>'},
                           
                            {field: '#Recepcion', width: "7%", displayName: '#Recepcion',cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_recepcion_parcial()}}</p></div>'},
                            
                            {field: 'Documento Recepción', width: "9%", displayName: 'Documento Recepción', cellClass: "ngCellText",cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_prefijo()}}-{{row.entity.get_numero()}}</p></div>'},
                            
                            {field: 'Proveedor', width: "25%", displayName: 'Proveedor', cellClass: "ngCellText",cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_nombre_proveedor()}}</p></div>'},
                                                        
                            {field: 'Fecha', width: "5%", displayName: 'Fecha', cellClass: "ngCellText",cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro()}}</p></div>'},
                            
                            {field: 'Usuario', width: "13%", displayName: 'Usuario', cellClass: "ngCellText",cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.get_nombre_usuario()}}</p></div>'},
                            
                            {field: 'Observación', width: "24%", displayName: 'Observación',cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getObservacion()}}</p></div>'},
                            
                            {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
                                cellTemplate: ' <div class="row">\
                                                 <button class="btn btn-default btn-xs" ng-click="ver_detalleRecepcion(row.entity)">\
                                                     <span class="glyphicon glyphicon-search"></span>\
                                                 </button>\
                                               </div>'
                            },
                            
                            {field: '', cellClass: "checkseleccion", width: "5%", 
                                cellTemplate: '<input ng-hide="validarFacturados(row.entity.getNumeroRecepciones())" type="checkbox" class="checkpedido" ng-click="onPedidoSeleccionado($event.currentTarget.checked,row)" ng-checked="buscarSeleccion(row)" ng-model="row.seleccionado" />'}
                        ]
                    };//ng-click="onAbrirVentana()" 
                    
                    $scope.validarFacturados = function(dato){
                        var estado=true;
                        if(dato>0){
                          estado=false;
                        }              
                        return estado;
                    };
                        
                    $scope.ver_detalleRecepcion = function(fila) {
                        that.listarRecepcionProductos(fila,function(resultado){
                        });
                        $scope.ver_recepcion(fila);
                    };
                    
                    $scope.ver_recepcion = function(fila) {
                        console.log("fila:::",fila);
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-xlg-ls',   
                            keyboard: true,
                            cellClass: "ngCellText",
                            template: ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="cerrar()">&times;</button>\
                                                <h4 class="modal-title"><b>RECEPCIONES PARCIALES</b></h4>\
                                                <div class="form-group">\
                                                             <div class="col-sm-6">\
                                                                <b><h5>'+fila.nombre_proveedor+'</h5></b>\
                                                             </div>\
                                                             <div class="col-sm-3">\
                                                              <b> OC# <h6>'+fila.numero_orden_compra+'</h6></b>\
                                                             </div>\
                                                             <div class="col-sm-3">\
                                                               <b>Recepción# <h6>'+fila.recepcion_parcial+'</h6></b>\
                                                             </div>\
                                                 </div>\
                                            </div>\
                                                <div class="modal-body">\
                                                <div class="table-responsive" style="clear:both; height: 500 px;">\
                                                    <div class="gridStylea grid-responsive" ng-grid="listaProductos" ></div>\
                                                </div>  \
                                                </div>\
                                            <div class="modal-footer">\
                                                <button class="btn btn-warning" ng-click="cerrar()">Cerrar</button>\
                                            </div>',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {

                                $scope.cerrar = function() {
                                    $modalInstance.close();
                                };

                            }
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };
                    
                    $scope.root.numeroFactura="";
                    that.recepcionesId ="";
                    
                    $scope.onFacturas = function(fila) {                      
                        that.recepcionesSeleccionadas(function(respuesta){
                            if(respuesta){
                             that.facturasRecepciones(fila);
                            }
                        });                        
                    };
                    
                    that.facturasRecepciones = function(fila) {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-ls-ls',   
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="cerrar()">&times;</button>\
                                                <h4 class="modal-title">RECEPCIONES PARCIALES</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                               <div class="row">\
                                                        <div class="form-group">\
                                                             <div class="col-sm-12">\
                                                               <h4>'+that.proveedor+'</h4>\
                                                             </div>\
                                                        </div>\
                                                        <div class="form-group">\
                                                             <div class="col-sm-12">\
                                                              <b>Recepción: </b> '+that.recepcionesId+'\
                                                             </div>\
                                                        </div>\
                                                        <div class="form-group">\
                                                             <div class="col-sm-4">\
                                                              <label>Fecha Factura:</label>\
                                                             </div>\
                                                             <div class="col-sm-8">\
                                                                <p class="input-group">\
                                                                    <input type="text" class="form-control readonlyinput" \
                                                                     datepicker-popup="{{format}}" \
                                                                     ng-model="root.fechaFactura"\ is-open="root.datepicker_fechaFactura" \
                                                                     min="minDate"   \
                                                                     readonly  close-text="Cerrar" \
                                                                     ng-change="" \
                                                                     clear-text="Borrar" \
                                                                     current-text="Hoy" \
                                                                     placeholder="Fecha Factura" \
                                                                     show-weeks="false" \
                                                                     toggle-weeks-text="#"  />\
                                                                        <span class="input-group-btn">\
                                                                               <button class="btn btn-default" ng-click="abrir_fechaFactura($event);"> \
                                                                               <i class="glyphicon glyphicon-calendar"></i></button>\
                                                                        </span>\
                                                                </p>\
                                                             </div>\
                                                        </div>\
                                                        <div class="form-group">\
                                                             <div class="col-sm-4">\
                                                              <label>Fecha de Radicación:</label>\
                                                             </div>\
                                                             <div class="col-sm-8">\
                                                                <p class="input-group">\
                                                                    <input type="text" class="form-control readonlyinput" \
                                                                     datepicker-popup="{{format}}" \
                                                                     ng-model="root.fechaVencimiento"\ is-open="root.datepicker_fechaVencimiento" \
                                                                     min="minDate"   \
                                                                     readonly  close-text="Cerrar" \
                                                                     ng-change="" \
                                                                     clear-text="Borrar" \
                                                                     current-text="Hoy" \
                                                                     placeholder="Fecha Vencimiento" \
                                                                     show-weeks="false" \
                                                                     toggle-weeks-text="#"  />\
                                                                        <span class="input-group-btn">\
                                                                               <button class="btn btn-default" ng-click="abrir_fechaVencimiento($event);"> \
                                                                               <i class="glyphicon glyphicon-calendar"></i></button>\
                                                                        </span>\
                                                                </p>\
                                                             </div>\
                                                        </div>\
                                                        <div class="form-group">\
                                                             <div class="col-sm-4">\
                                                              <label>Numero Factura:</label>\
                                                             </div>\
                                                             <div class="col-sm-8">\
                                                                    <input type="text" validacion-numero-entero ng-model="root.numeroFactura"  class="form-control grid-inline-input" required="required" >\
                                                                </div>\
                                                        </div>\
                                                        <div class="form-group">\
                                                            <div class="col-sm-4">\
                                                              <label>Valor Total Factura:</label>\
                                                             </div>\
                                                             <div class="col-sm-8">\
                                                              <input type="text" ng-model="root.totalFactura" class="form-control grid-inline-input" required="required" >\
                                                             </div>\
                                                        </div>\
                                                       <div class="form-group">\
                                                            <div class="col-sm-4">\
                                                               <label>Total de Descuento:</label>\
                                                            </div>\
                                                            <div class="col-sm-8">\
                                                              <input type="text" ng-model="root.totalDescuento" class="form-control grid-inline-input">\
                                                            </div>\
                                                       </div>\
                                                       <div class="form-group">\
                                                            <div class="col-sm-4">\
                                                              <label>Observacion:</label>\
                                                            </div>\
                                                            <div class="col-sm-8">\
                                                              <textarea class="form-control" ng-model="root.descripcionFija"  col-xs-6" rows="4" ></textarea>\
                                                              <textarea class="form-control" ng-model="root.descripcionFactura"  col-xs-6" rows="4" ></textarea>\
                                                           </div>\
                                                       </div>\
                                               </div>\
                                              </div>\
                                            </div>\
                                            <div class="modal-footer">\
                                                <button class="btn btn-primary" ng-disabled="{{root.pedidosSeleccionados.length}}==0" ng-click="facturar()">Facturar</button>\
                                                <button class="btn btn-warning" ng-click="cerrar()">Cerrar</button>\
                                            </div>',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {

                                $scope.facturar = function() {
                                    
                                    var fechaFactura = new Date($scope.root.fechaFactura);
                                    var fechaVencimiento = new Date($scope.root.fechaVencimiento);
                                                                        
                                    var fFactura = new Date(fechaFactura.getFullYear()+0, fechaFactura.getMonth()+1, fechaFactura.getDate()+1); //31 de diciembre de 2015
                                    var fVencimiento = new Date(fechaVencimiento.getFullYear()+0, fechaVencimiento.getMonth()+1, fechaVencimiento.getDate()+1); //30 de noviembre de 2014

                                    if(fFactura > fVencimiento){
                                     AlertService.mostrarVentanaAlerta("Mensaje del sistema", "La Fecha de Radicacion no puede ser menor a la Fecha Factura");
                                     return;
                                    } 
                                    
                                    if($scope.root.numeroFactura.trim() === ""){
                                     AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el Numero de Factura");
                                     return;
                                    }   
                                    
                                    if($scope.root.totalDescuento < 0){
                                     AlertService.mostrarVentanaAlerta("Mensaje del sistema", "No Es Posible Valores Negativos En El Descuento");
                                     return;
                                    }
                                    
                                    if(($scope.root.descripcionFactura).trim() !== ""){
                                     AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe Ingresar una Observacion");
                                     return;
                                    }
                                    
                                    if(($scope.root.descripcionFactura).length <= 6){
                                     AlertService.mostrarVentanaAlerta("Mensaje del sistema", "La Observacion debe contener mas de 6 caracteres");
                                     return;
                                    }
                                    
                                    var parametros={
                                        recepciones: $scope.root.pedidosSeleccionados,
                                        fechaFactura: $scope.root.fechaFactura,
                                        fechaVencimeinto: $scope.root.fechaVencimiento,
                                        totalFactura: $scope.root.totalFactura,
                                        numroFactura: $scope.root.numeroFactura,
                                        totalDescuento: $scope.root.totalDescuento,
                                        descripcionFactura : $scope.root.descripcionFactura,
                                        descripcionFija : $scope.root.descripcionFija
                                    };
                                    that.insertarFacturaProveedor(parametros);
                                    that.borrarVariables();
                                    $modalInstance.close();
                                };
                                
                                $scope.cerrar = function() {
                                    that.borrarVariables();
                                   // that.listarProveedores();
                                    $modalInstance.close();
                                };

                            }
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };
                    
                    
                       /**
                     * +Descripcion Metodo encargado de invocar el servicio
                     *           guarda la factura de proveedores
                     * @author Andres Mauricio Gonzalez
                     * @fecha 08/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.insertarFacturaProveedor = function (parametros) {
                        var empresa = Sesion.getUsuarioActual().getEmpresa().getCodigo();
                        var centroUtilidad = Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo();
                        var bodega = Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo();
                        var obj = {
                            session: $scope.session,
                            data: {
                                facturaProveedor: {
                                    empresaId: empresa,
                                    centroUtilidad: centroUtilidad,
                                    bodega: bodega,
                                    parmetros:parametros
                                }
                            }
                        };
                       
                        facturacionProveedoresService.insertarFactura(obj, function (data) {
                            
                            if (data.status === 200) { 
                                that.listarProveedores();
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura Creada Correctamente");
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });                        
                    };
                    
                    
                    that.recepcionesSeleccionadas=function(callback){
                        $scope.root.totalFactura=0;
                        $scope.root.descripcionFija="";
                        that.recepcionesId="";
                        that.proveedor="";
                        that.total=0;
                        var i=0;
                        var salto= "";
                        $scope.root.pedidosSeleccionados.forEach(function(data) {                        
                           that.listarRecepcionProductos(data,function(resultado){
                                that.recepcionesId +="<label class='btn btn-success btn btn-default btn-xs'>"+data.recepcion_parcial+"</label> ";
                                that.proveedor="<b>"+data.nombre_proveedor+"</b>";                                
                                $scope.root.totalFactura +=parseInt(resultado['total'].subtotal);
                                $scope.root.descripcionFija += salto+"- "+ data.get_observacion();
                                salto= "\n";
                                if($scope.root.pedidosSeleccionados.length-1 === i){
                                 callback(true);
                                }
                                i++;
                            });
                        });
                    };
                    
                    that.borrarVariables=function(){
                       
                        $scope.root.pedidosSeleccionados=[];
                        $scope.root.pedidosSeleccionados=[];
                        $scope.root.fechaFactura=$filter('date')(fecha_actual, "yyyy-MM-dd");
                        $scope.root.fechaVencimiento=$filter('date')(fecha_actual, "yyyy-MM-dd");
                        $scope.root.totalFactura="";
                        $scope.root.numeroFactura="";
                        $scope.root.totalDescuento="";
                        $scope.root.descripcionFactura="";
                        $scope.root.descripcionFija="";
                    };
                    
                    $scope.onPedidoSeleccionado = function(check, row) {
                        row.selected = check;
                        if (check) {
                            that.agregarPedido(row.entity);
                        } else {
                            that.quitarPedido(row.entity);
                        }
                    };
                    
                     that.quitarPedido = function(pedido) {
                            for (var i in $scope.root.pedidosSeleccionados) {
                                var _pedido = $scope.root.pedidosSeleccionados[i];
                                if (_pedido.recepcion_parcial === pedido.recepcion_parcial) {//numero_orden_compra
                                    $scope.root.pedidosSeleccionados.splice(i, true);
                                    break;
                                }
                            }
                        };

                        that.agregarPedido = function(pedido) {
                            for (var i in $scope.root.pedidosSeleccionados) {
                                var _pedido = $scope.root.pedidosSeleccionados[i];
                                if (_pedido.recepcion_parcial === pedido.recepcion_parcial || _pedido.prefijo !== pedido.prefijo) {
                                    if(_pedido.prefijo !== pedido.prefijo){
                                    AlertService.mostrarMensaje("warning", "Se deben Facturar Documentos con el mismo prefijo");                                 
                                    }
                                    return false;
                                }
                            }
                            $scope.root.pedidosSeleccionados.push(pedido);
                        };

                        $scope.buscarSeleccion = function(row) {
                            var pedido = row.entity;
                            for (var i in $scope.root.pedidosSeleccionados) {
                                var _pedido = $scope.root.pedidosSeleccionados[i];
                                if (_pedido.recepcion_parcial === pedido.recepcion_parcial) {
                                    row.selected = true;
                                    return true;
                                }
                            }

                            row.selected = false;
                            return false;
                        };
                    
                    /**
                    * +Descripcion: metodo para navegar a la ventana detalle de cada aprobacion o denegacion
                    * @author Andres M Gonzalez
                    * @fecha: 11/05/2016
                    * @params pedido : numero del pedido
                    * @returns {ventana}
                    */
                   that.mostrarDetalle = function(codigoProducto) {
                       localStorageService.add("verificacionDetalle",
                               {
                                   pedidoId: '23133'
                               });
                       $state.go("DetalleRecepcionParcial");
                   };
                   
                    /**
                    * +Descripcion: evento de la vista para pasar a la ventana detalle de cada aprobacion o denegacion
                    * @author Andres M Gonzalez
                    * @fecha: 03/05/2017
                    * @params pedido : numero del pedido
                    * @returns {ventana}
                    */
                   $scope.onAbrirVentana = function() {
                       that.mostrarDetalle();
                   };
                    
                   
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 03/05/2017
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              listara los clientes para facturar
                     *  @parametros ($event = eventos del teclado)
                     *              (pendiente = 0 Formulas sin pendientes)
                     *              (pendiente = 1 Formulas con pendientes)
                     */
                    $scope.buscarClientesFactura = function (event) {

                        if (event.which === 13) {

                            that.listarProveedores();
                        }
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
                                    that.listarProveedores();
                                }
                            }
                        }
                    });



                    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                        $scope.$$watchers = null;
                        $scope.root.pedidosSeleccionados = []; 
                        $scope.root = null;

                    });

                }]);
});
