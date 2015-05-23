//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoClienteController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'ProductoPedido',
        'PedidoVenta', 'API', "socket",
        "AlertService", '$state', 'Usuario',
        '$modal',
        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, ProductoPedido, PedidoVenta, API, socket, AlertService, $state, Usuario, $modal) {

            $scope.expreg = new RegExp("^[0-9]*$");
            
            var that = this;

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
                $scope.$emit('cerrarseleccionproducto', {animado:true});
                
                $scope.limpiarProductosEmpresa();
                
                $scope.rootSeleccionProductoCliente = {};
            };
            
            $rootScope.$on("mostrarseleccionproducto_cliente", function(e, tipo_cliente, cliente) {

                $scope.rootSeleccionProductoCliente = {};
                
                $scope.rootSeleccionProductoCliente.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
                $scope.rootSeleccionProductoCliente.Empresa = EmpresaPedido;
                $scope.rootSeleccionProductoCliente.tipo_cliente = tipo_cliente;
                $scope.rootSeleccionProductoCliente.cliente = cliente;
                $scope.rootSeleccionProductoCliente.no_incluir_producto = false; //NUEVO
                $scope.rootSeleccionProductoCliente.bloquear_eliminar = false; //NUEVO
                $scope.rootSeleccionProductoCliente.bloqueo_contrato = false; //NUEVO

                $scope.rootSeleccionProductoCliente.paginas = 0;
                $scope.rootSeleccionProductoCliente.items = 0;
                
                $scope.rootSeleccionProductoCliente.laboratorio = "";
                $scope.rootSeleccionProductoCliente.concentracion = "";
                $scope.rootSeleccionProductoCliente.termino_busqueda = "";

                $scope.rootSeleccionProductoCliente.ultima_busqueda = {};
                $scope.rootSeleccionProductoCliente.paginaactual = 1;
                
                $scope.rootSeleccionProductoCliente.tipoProducto = '0';
                
/**/
                /* Inicio - Consulta Tipo Producto */

                var obj_tipo_producto = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        tipo_producto: {}
                    }
                }

                var url_tipo_producto = API.PEDIDOS.LISTADO_TIPO_PRODUCTOS;

                Request.realizarRequest(url_tipo_producto, "POST", obj_tipo_producto, function(data) {

                    if (data.status === 200) {
                        $scope.rootSeleccionProductoCliente.lista_tipo_productos = data.obj.lista_tipo_productos;
                    }
                    else {
                        console.log("Error al consultar Tipo Productos", data.msj);
                    }
                });

                /* Fin - Consulta Tipo Producto */
/**/                
                $scope.rootSeleccionProductoCliente.pedido_cliente_id_tmp = '';
                $scope.lista_productos = {};

                $scope.onBuscarSeleccionProducto($scope.obtenerParametros(),"");
            });
            
            $scope.obtenerParametros = function(filtro) {

                //valida si cambio el termino de busqueda
                if ($scope.rootSeleccionProductoCliente.ultima_busqueda.termino_busqueda !== $scope.rootSeleccionProductoCliente.termino_busqueda) {
                    $scope.rootSeleccionProductoCliente.paginaactual = 1;
                }
                
                var seleccion = {
                    buscar_todo: true,
                    buscar_por_codigo: false,
                    buscar_por_molecula: false,
                    buscar_por_descripcion: false
                };
                
                if(filtro !== undefined) {
                    
                    if(filtro === 0)
                        seleccion.buscar_todo = true;
                    
                    if(filtro === 1) {
                        seleccion.buscar_todo = false,
                        seleccion.buscar_por_codigo = true;
                    }
                    
                    if(filtro === 2) {
                        seleccion.buscar_todo = false
                        seleccion.buscar_por_molecula = true;
                    }
                    
                    if(filtro === 3) {
                        seleccion.buscar_todo = false
                        seleccion.buscar_por_descripcion = true;
                    }
                }
                
                console.log(">>>>> Usuario Datos: ", Usuario.getUsuarioActual().empresa.codigo);

                var obj = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        productos: {
                            laboratorio: $scope.rootSeleccionProductoCliente.laboratorio,
                            concentracion: $scope.rootSeleccionProductoCliente.concentracion,
                            termino_busqueda: $scope.rootSeleccionProductoCliente.termino_busqueda,
                            pagina_actual: $scope.rootSeleccionProductoCliente.paginaactual,
                            empresa_id: Usuario.getUsuarioActual().empresa.codigo,//$scope.rootSeleccionProductoCliente.de_empresa_id,
                            centro_utilidad_id: '1 ',//$scope.rootSeleccionProductoCliente.de_centro_utilidad_id,
                            bodega_id: '03',//$scope.rootSeleccionProductoCliente.de_bodega_id,
                            tipo_producto: $scope.rootSeleccionProductoCliente.tipoProducto,
                            contrato_cliente_id: $scope.rootSeleccionProductoCliente.cliente.contrato_id,
                            pedido_cliente_id_tmp: '0', //$scope.rootSeleccionProductoCliente.pedido_cliente_id_tmp
                            filtro: seleccion
                        }
                    }
                };

                return obj;
            };    
            
            
            $scope.onBuscarSeleccionProducto = function(obj, paginando) {

                
                //that.renderGrid();
                
                var url = API.PEDIDOS.LISTAR_PRODUCTOS_CLIENTES;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        $scope.rootSeleccionProductoCliente.ultima_busqueda = {
                            termino_busqueda: $scope.rootSeleccionProductoCliente.termino_busqueda
                        };
                        
                        console.log("Consulta Exitosa! : ", data.msj);
                        
                        that.renderProductos(data.obj, paginando);
                    }
                    else{
                        console.log("Error en consulta de Productos: ", data.msj);
                    }

                });

                that.renderGrid();
            }; 
            
            that.renderProductos = function(data, paginando) {

                $scope.rootSeleccionProductoCliente.items = data.lista_productos.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.rootSeleccionProductoCliente.items === 0) {
                    if ($scope.rootSeleccionProductoCliente.paginaactual > 1) {
                        $scope.rootSeleccionProductoCliente.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron más registros");
                    return;
                }

                $scope.rootSeleccionProductoCliente.Empresa.vaciarProductos();
                
                if($scope.rootSeleccionProductoCliente.cliente.contrato_id > 0){
                    
                    //console.log("Mayor que cero")
                
                    $scope.rootSeleccionProductoCliente.bloqueo_contrato = true;
                }
                else {
                    $scope.rootSeleccionProductoCliente.bloqueo_contrato = false;
                    
                    //console.log("Valor Cero")
                }
                
                var producto_obj = {};
                
                data.lista_productos.forEach(function(producto){
                    
                    producto_obj = that.crearProducto(producto);
                    
                    $scope.rootSeleccionProductoCliente.Empresa.agregarProducto(producto_obj);
                    
                });

            };     

            that.crearProducto = function(obj) {
                
                var array_precio = obj.precio_contrato.split('@');
                var tiene_precio_contrato = false;
                var precio_contrato = parseFloat(array_precio[0]);
                
                console.log(">>>> ANTES DE READONLY: ");
                console.log(">>>> Objeto Precio: ", obj.precio_contrato);
                console.log(">>>> PRECIO ARRAY: ", array_precio);
                if(array_precio[1] === 'readonly'){
                    tiene_precio_contrato = true;
                    console.log(">>>> READONLY: ",array_precio[1]);
                }
                
                var producto = ProductoPedido.get(
                                    obj.codigo_producto,        //codigo_producto
                                    obj.nombre_producto,        //descripcion
                                    obj.existencia,             //existencia
                                    precio_contrato,            //precio
                                    0,                          //cantidad_solicitada
                                    0,                          //cantidad_separada
                                    '',                         //observacion_cambio
                                    obj.disponible,             //disponible
                                    obj.molecula_descripcion,   //molecula
                                    '',                         //existencia_farmacia
                                    obj.tipo_producto_id,       //tipo_producto_id
                                    '',                         //total_existencias_farmacia
                                    '',                         //existencia_disponible
                                    ''                          //cantidad_pendiente
                                );
                
                producto.cantidad_solicitada = "";
                
                producto.setCodigoCum(obj.codigo_cum);

                producto.setCodigoInvima(obj.codigo_invima);
                
                producto.setVencimientoCodigoInvima(obj.vencimiento_codigo_invima);

                producto.setIva(obj.porc_iva);

                producto.setEsRegulado(obj.sw_regulado);
                
                producto.setTienePrecioContrato(tiene_precio_contrato);
                
                producto.setPrecioRegulado(obj.precio_regulado);
                
                producto.setPrecioVentaAnterior(obj.precio_venta_anterior);
                
                producto.setCostoUltimaCompra(parseFloat(obj.costo_ultima_compra));
                
                producto.setEstado(obj.estado);

                return producto;
            };            
 
            /*  Construcción de Grid    */
            
            that.renderGrid = function() {
            
                $scope.rootSeleccionProductoCliente.lista_productos = {    
                    data: 'rootSeleccionProductoCliente.Empresa.getProductos()',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: false,
                    enableHighlighting: true,
                    showFilter: true,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Cód. Producto', width: "10%",
                            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                                <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                            </div>'
                        },
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'codigo_cum', displayName: 'CUM', width: "7%"},
                        {field: 'codigo_invima', displayName: 'Código Invima', width: "9%"},
                        {field: 'vencimiento_codigo_invima', displayName: 'Ven. Invim', width: "6%"},
                        {field: 'iva', displayName: 'Iva', width: "4%"},
                        {field: 'precio_regulado', displayName: '$ Regulado', width: "7%",
                            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getEsRegulado() == 1" >R</span>\
                                                <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                            </div>'
                        },
                        {field: 'precio', displayName: 'Precio Venta', width: "12%",
                            cellTemplate: ' <div class="col-xs-12">\
                                                <!--<span class="label label-info" ng-show="row.entity.getTienePrecioContrato() == true">C</span>-->\
                                                <input type="text" ng-disabled = "row.entity.getTienePrecioContrato()" ng-model="row.entity.precio" validacion-numero class="form-control grid-inline-input "'+
                                                'ng-keyup=""/>\
                                            </div>'},
                        {field: 'existencia', displayName: 'Existencia', width: "6%"},
                        {field: 'disponible', displayName: 'Disponible', width: "6%"},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad', enableCellEdit: false, width: "7%",
                            cellTemplate: ' <div class="col-xs-12">\n\
                                                <input type="text" ng-model="row.entity.cantidad_solicitada" validacion-numero-entero class="form-control grid-inline-input"'+
                                                'ng-keyup="onTeclaIngresaProducto($event, row)"/>\n\
                                            </div>'
                        },
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                            cellTemplate: ' <div class="row">\n\
                                                <button ng-if="row.entity.estado==1" class="btn btn-default btn-xs" ng-click="onIncluirProducto(row)" '+
                                                ' ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null || !expreg.test(row.entity.cantidad_solicitada)">\n\
                                                    <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\n\
                                                </button>\n\
                                                <button ng-if="row.entity.estado==0" ng-disabled=true class="btn btn-default btn-xs" ng-click="" '+
                                                ' ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null || !expreg.test(row.entity.cantidad_solicitada)">\n\
                                                    <span class="glyphicon glyphicon-lock"> Bloqueado</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]/*,
                    sortInfo: {
                        fields: ['disponible', 'descripcion'],
                        directions: ['desc','asc']
                    }*/
                };

                $scope.rootSeleccionProductoCliente.lista_productos_seleccionados = {    
                    data: 'rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().obtenerProductos()',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableHighlighting: true,
                    //showFilter: true,
                    multiSelect: false,
                            
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Cód. Producto', width: "9%",
                            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                    <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                                    <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                                    <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                                    <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                                    <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                                    <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                                </div>'
                        },
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada', width: "10%"},
                        {field: 'iva', displayName: 'Iva', width: "8%"},
                        {field: 'precio', displayName: 'Precio Unitario', cellFilter: "currency:'$ '", width: "10%"},
                        {field: 'total_sin_iva', displayName: 'Total Sin Iva', cellFilter: "currency:'$ '", width: "10%"},
                        {field: 'total_con_iva', displayName: 'Total Con Iva', cellFilter: "currency:'$ '", width: "10%"},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                            cellTemplate: ' <div class="row">\n\
                                                <button ng-if="rootSeleccionProductoCliente.bloquear_eliminar == false" class="btn btn-danger btn-xs" ng-click="onEliminarSeleccionado(row)">\n\
                                                    <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                                </button>\n\
                                                <button ng-if="rootSeleccionProductoCliente.bloquear_eliminar == true" ng-disabled="true" class="btn btn-danger btn-xs" ng-click="">\n\
                                                    <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ] 

                };
            };
            

            //Inserta producto presionando ENTER
            $scope.onTeclaIngresaProducto = function(ev, row) {

                if (ev.which === 13) {
                    if (parseInt(row.entity.cantidad_solicitada) > 0) {
                        that.insertarProducto(row);
                    }
                }
            };
            
            //Inserta producto presionando Botón
            $scope.onIncluirProducto = function(row) {
                
                if(parseInt(row.entity.precio) === 0){
                    
                    /*Ventana Modal - Inicio*/
                    var template = '<div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>El producto con código '+row.entity.codigo_producto+' tiene precio Cero (0).\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                    </div>';

                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: template,
                        scope: $scope,
                        controller: controller
                    };

                    var modalInstance = $modal.open($scope.opts);
                    /*Ventana Modal - Fin*/
                        
                }
                else {
                    that.insertarProducto(row);
                }
            };
            
            //Ejecuta operaciones conjuntas de Inserción del producto en pedido temporal
            that.insertarProducto = function(row) {

                $scope.rootSeleccionProductoCliente.no_incluir_producto = false;
                
                var vendedor = $scope.rootSeleccionProductoCliente.Empresa.getVendedorSeleccionado();
                    
                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().setVendedor(vendedor);
                    
                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().obtenerProductos().forEach(function(valor) {

                    if (valor.codigo_producto === row.entity.codigo_producto) {
                        
                        $scope.rootSeleccionProductoCliente.no_incluir_producto = true;
                        
                        /*Ventana Modal - Inicio*/
                        var template = ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <h4>El producto con código '+row.entity.codigo_producto+' ya está incluido  en la <br> cotización.\n\
                                                        Eliminelo y vuelva a incluirlo si quiere modificar <br> valores. </h4> \
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                                </div>';

                        controller = function($scope, $modalInstance) {

                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        };

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: template,
                            scope: $scope,
                            controller: controller
                        };

                        var modalInstance = $modal.open($scope.opts);
                        /*Ventana Modal - Fin*/
                        return;
                    }

                });
                
                if(parseFloat(row.entity.precio) < row.entity.costo_ultima_compra) {
                    
                    $scope.rootSeleccionProductoCliente.no_incluir_producto = true;

                    /*Ventana Modal validacion costo última compra - Inicio*/
                    var template = ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Mensaje del Sistema</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <h4>El precio está por debajo del valor de costo de la última compra. <br> \n\
                                                    El producto de código '+row.entity.codigo_producto+' tuvo un último costo de <br>\n\
                                                    $'+row.entity.costo_ultima_compra+'. </h4> \
                                            </div>\
                                            <div class="modal-footer">\
                                                <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                            </div>';

                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: template,
                        scope: $scope,
                        controller: controller
                    };

                    var modalInstance = $modal.open($scope.opts);
                    /*Ventana Modal validacion costo última compra - Fin*/
                    return;
                        
                }
                
                if(row.entity.getEsRegulado() === '1') {
                    if(parseFloat(row.entity.precio) > row.entity.getPrecioRegulado()) {
                        
                        $scope.rootSeleccionProductoCliente.no_incluir_producto = true;

                        /*Ventana Modal validacion costo última compra - Inicio*/
                        var template = ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <h4>El precio está por encima del valor de precio regulado. <br> \n\
                                                        El producto de código '+row.entity.getCodigoProducto()+' tiene el precio regulado <br>\n\
                                                        $'+row.entity.getPrecioRegulado()+'. </h4> \
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                                </div>';

                        controller = function($scope, $modalInstance) {

                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        };

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: template,
                            scope: $scope,
                            controller: controller
                        };

                        var modalInstance = $modal.open($scope.opts);
                        /*Ventana Modal validacion costo última compra - Fin*/
                        return;                          
                    }
                }

                if ($scope.rootSeleccionProductoCliente.no_incluir_producto === false)
                {
                    if( $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== ''
                        && $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined )
                    {    
                        var numero_cotizacion = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                        
                        that.consultarEstadoCotizacion(numero_cotizacion, function(estado_cotizacion){
                            
                            if (estado_cotizacion === '1' || estado_cotizacion === '2') {
                            
                                $scope.rootSeleccionProductoCliente.bloquear_eliminar = false;
                                that.insertarDetalleCotizacion(row);
                            
                            }
                            else {
                                //Avisar la no posibilidad de modiificar porque se ha convertido en Pedido
                                $scope.opts = {
                                    backdrop: true,
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    template: ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Aviso: </h4>\
                                                </div>\
                                                <div class="modal-body row">\
                                                    <div class="col-md-12">\
                                                        <h4 >La Cotización ' + numero_cotizacion + ' se ha convertido en Pedido. No puede modificarse!</h4>\
                                                    </div>\
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                                </div>',
                                    scope: $scope,
                                    controller: function($scope, $modalInstance) {
                                        $scope.close = function() {
                                            $modalInstance.close();
                                        };
                                    }
                                };

                                var modalInstance = $modal.open($scope.opts);
                            }
                        }); // Fin - that.consultarEstadoCotizacion

                    }
                    else if ($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido() !== ''
                        && $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined)
                    {

                        var numero_pedido = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido();
                        
                        that.consultarEstadoPedido(numero_pedido, function(estado_pedido, estado_separacion){

                            if ((estado_pedido === '0' || estado_pedido === '1') && !estado_separacion) {
                                //Ejecuta la Inclusión del Producto
                                $scope.rootSeleccionProductoCliente.bloquear_eliminar = false;
                                that.insertarDetallePedido(row);
                            } //Fin IF estado_pedido
                            else {
                                //Muestra Alerta explicando porqué no puede eliminar
                                $scope.opts = {
                                    backdrop: true,
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    template: ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Aviso: </h4>\
                                                </div>\
                                                <div class="modal-body row">\
                                                    <div class="col-md-12">\
                                                        <h4 >El Pedido ' + numero_pedido + ' ya está siendo separado o en proceso de <br>despacho. No puede modificarse!</h4>\
                                                    </div>\
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                                </div>',
                                    scope: $scope,
                                    controller: function($scope, $modalInstance) {
                                        $scope.close = function() {
                                            $modalInstance.close();
                                        };
                                    }
                                };

                                var modalInstance = $modal.open($scope.opts);
                            }

                        }); //Fin consultarEstadoPedido  

                    }
                    else if($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion() === ''
                        || $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion() === undefined){
                        
                        that.insertarEncabezadoCotizacion(function(insert_encabezado_exitoso) {

                            if(insert_encabezado_exitoso) {
                                $scope.rootSeleccionProductoCliente.bloquear_eliminar = false;
                                that.insertarDetalleCotizacion(row);
                            } 
                        });
                    }
                }
            };
            
/**/
            //Consulta Estado de la Cotización
            that.consultarEstadoCotizacion = function(numero_cotizacion, callback){
                
                //Objeto para consulta de encabezado pedido
                var obj = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        estado_cotizacion: {
                            numero_cotizacion: numero_cotizacion,
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTA_ESTADO_COTIZACION;

                Request.realizarRequest(url, "POST", obj, function(data_estado) {

                    if (data_estado.status === 200) {
                        console.log("Consulta exitosa: ", data_estado.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {

                            var estado = data_estado.obj.resultado_consulta[0].estado;
                            
                            callback(estado);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data_estado.msj);
                    }
                });
                
            };
/**/
            
            //Función que inserta el encabezado del la cotización
            that.insertarEncabezadoCotizacion = function(callback) {
                
                if($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion() === "") {

                    var obj_encabezado = {
                        session: $scope.rootSeleccionProductoCliente.session,
                        data: {
                            cotizacion_encabezado: {

                                empresa_id: $scope.rootSeleccionProductoCliente.Empresa.getCodigo(),
                                tipo_id_tercero: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getCliente().tipo_id_tercero,
                                tercero_id: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getCliente().id,
                                tipo_id_vendedor: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getVendedor().getTipoId(),
                                vendedor_id: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getVendedor().getId(),
                                estado: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().estado,
                                observaciones: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().observacion

                            }
                        }
                    };
                    /* Fin - Objeto para inserción de Encabezado*/

                    /* Inicio - Inserción del Encabezado */

                    var url_encabezado = API.PEDIDOS.CREAR_COTIZACION;

                    Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                        if (data.status === 200) {
                            console.log("Registro Insertado Exitosamente en Encabezado: ", data.msj);
                            
                            var pedido_cliente_id_tmp = data.obj.resultado_consulta[0].pedido_cliente_id_tmp;
                            var fecha_registro = data.obj.resultado_consulta[0].fecha_registro;
                            
                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().setNumeroCotizacion(pedido_cliente_id_tmp);
                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().fecha_registro = fecha_registro;
                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().setEncabezadoBloqueado(true);

                            if(callback !== undefined && callback !== "" && callback !== 0){
                                callback(true);
                            }
                        }
                        else {
                            console.log(data.msj);
                            if(callback !== undefined && callback !== "" && callback !== 0){
                                callback(false);
                            }
                        }
                    });
                    /* Fin - Inserción del Encabezado */
                }
                else{
                    console.log("Cotización Existente - Continua Inserción Detalle");
                    callback(true);
                }
            };
            
            //INSERTA DETALLE DE PEDIDO PREVIAMANTE CREADO POR COTIZACIÓN
            that.insertarDetallePedido = function (row) {
                
                //insertar_detalle_pedido = function(numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, callback)
                
                //Cálculo de cantidad pendiente
                var cantidad_pendiente = row.entity.cantidad_solicitada - row.entity.disponible;

                /* Inicio - Objeto para Inserción Detalle */
                var obj_detalle = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        detalle_pedido: {
                            
                            numero_pedido: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido(),
                            codigo_producto: row.entity.codigo_producto,
                            porc_iva: row.entity.iva,
                            numero_unidades: parseInt(row.entity.cantidad_solicitada),
                            valor_unitario: row.entity.precio,
                            tipo_producto: row.entity.tipo_producto_id
                        }
                    }
                };

                /*** ELEMENTO INSERTADO - INICIO ***/
                var producto = ProductoPedido.get(
                                    row.entity.codigo_producto,      //codigo_producto
                                    row.entity.descripcion,          //descripcion
                                    0,                               //existencia **hasta aquí heredado
                                    parseFloat(row.entity.precio),      //precio
                                    parseInt(row.entity.cantidad_solicitada),  //cantidad_solicitada
                                    0,                               //cantidad_separada
                                    "",                              //observacion
                                    "",                              //disponible
                                    row.entity.molecula, //molecula
                                    "",                              //existencia_farmacia
                                    row.entity.tipo_producto_id,     //tipo_producto_id
                                    "",                              //total_existencias_farmacia
                                    "",                              //existencia_disponible
                                    (cantidad_pendiente < 0) ? '0' : cantidad_pendiente      //cantidad_pendiente
                                );
                                    
                producto.setCodigoCum(row.entity.getCodigoCum());
                producto.setCodigoInvima(row.entity.getCodigoInvima());
                producto.setVencimientoCodigoInvima(row.entity.getVencimientoCodigoInvima());
                producto.setIva(parseFloat(row.entity.getIva()));
                producto.setPrecioRegulado(row.entity.getPrecioRegulado());
                producto.setPrecioVentaAnterior(row.entity.getPrecioVentaAnterior());
                producto.setCostoUltimaCompra(row.entity.getCostoUltimaCompra());
                producto.setTotalSinIva();
                producto.setTotalConIva();
                producto.setEstado(row.entity.getEstado());

                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                //Restricción Tipo Producto
/**/
                var longitud_seleccionados = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.length;

                var test_index = 0;

                if (longitud_seleccionados > 1) {
                    test_index = 1;
                }
                else {
                    test_index = 0;
                }

                /*Inicio: Evitar Inserción por tipo Producto */
                if ($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id !== row.entity.tipo_producto_id) {

                    var descripcion_tipo_anterior = "";
                    var descripcion_tipo_actual = "";

                    $scope.rootSeleccionProductoCliente.lista_tipo_productos.forEach(function(tipo_producto) {

                        if (tipo_producto.tipo_producto_id === $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id) {
                            descripcion_tipo_anterior = tipo_producto.descripcion;
                        }
                        if (tipo_producto.tipo_producto_id === row.entity.tipo_producto_id) {
                            descripcion_tipo_actual = tipo_producto.descripcion;
                        }
                    });

                    var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>No se puede incluir un producto de ' + descripcion_tipo_actual + ' en un pedido de ' + descripcion_tipo_anterior + ' </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                    </div>';

                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: template,
                        scope: $scope,
                        controller: controller
                    };

                    var modalInstance = $modal.open($scope.opts);

                    $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                }
/**/
                else {//ELSE Restricción tipo_producto
                    if ($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.length === 25) {

                        var template = ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Mensaje del Sistema</h4>\
                                        </div>\
                                        <div class="modal-body">\
                                            <h4>Usted ha llegado a los 25 productos para éste Pedido ! </h4> \
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                        </div>';

                        controller = function($scope, $modalInstance) {

                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        };

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: template,
                            scope: $scope,
                            controller: controller
                        };

                        var modalInstance = $modal.open($scope.opts);

                    }

                    /* Fin - Inserción de objeto en grid de seleccionados */
                    //Aquí se debe cambiar la asignación. Como se usa un objeto, tal vez no sea necesaria ...

                    $scope.$emit('cargarGridPrincipal', $scope.rootSeleccionProductoCliente.bloquear_eliminar);

                    /* Inicio - Inserción del Detalle */

                    var url_detalle = API.PEDIDOS.INSERTAR_DETALLE_PEDIDO_CLIENTE;

                    Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                        if (data.status === 200) {
                            console.log("Registro Insertado Exitosamente en Detalle: ", data.msj);
                            
                            //Se toma la fecha del registro
                            //var fecha_registro = data.obj.resultado_consulta[0].fecha_registro;
                            
                            //$scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().setFechaRegistro(fecha_registro);

                            //Sumar Parcial de Total Con IVA y Sin IVA
                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_sin_iva += parseFloat(producto.getTotalSinIva());
                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_con_iva += parseFloat(producto.getTotalConIva());
                        }
                        else {
                            console.log("No se pudo Incluir éste produto: ",data.msj);

                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                            var obj_bloqueo = {
                                session: $scope.rootSeleccionProductoCliente.session,
                                data: {
                                    usuario_bloqueo: {
                                        farmacia_id: '03',
                                        centro_utilidad_id: '1 ',
                                        codigo_producto: row.entity.codigo_producto.trim()
                                    }
                                }
                            };

                            var url_bloqueo = API.PEDIDOS.BUSCAR_USUARIO_BLOQUEO;

                            Request.realizarRequest(url_bloqueo, "POST", obj_bloqueo, function(data) {

                                if (data.status === 200) {

                                    console.log("Consulta de usuario bloqueante exitosa: ", data.msj);

    //                                var template = ' <div class="modal-header">\
    //                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
    //                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
    //                                                </div>\
    //                                                <div class="modal-body">\
    //                                                    <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por el usuario '+
    //                                                    '('+data.obj.datos_usuario[0].usuario_id+') '+data.obj.datos_usuario[0].nombre+' </h4> \
    //                                                </div>\
    //                                                <div class="modal-footer">\
    //                                                    <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
    //                                                </div>';
    //
    //                                controller = function($scope, $modalInstance) {
    //
    //                                    $scope.close = function() {
    //                                        $modalInstance.close();
    //                                    };
    //                                };
    //
    //                                $scope.opts = {
    //                                    backdrop: true,
    //                                    backdropClick: true,
    //                                    dialogFade: false,
    //                                    keyboard: true,
    //                                    template: template,
    //                                    scope: $scope,
    //                                    controller: controller
    //                                };
    //
    //                                var modalInstance = $modal.open($scope.opts);

                                }
                                else {
                                    console.log("Consulta de usuario bloqueante fallida: ", data.msj);

                                    var template = ' <div class="modal-header">\
                                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                    </div>\
                                                    <div class="modal-body">\
                                                        <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por otro usuario </h4> \
                                                    </div>\
                                                    <div class="modal-footer">\
                                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                                    </div>';

                                    controller = function($scope, $modalInstance) {

                                        $scope.close = function() {
                                            $modalInstance.close();
                                        };
                                    };

                                    $scope.opts = {
                                        backdrop: true,
                                        backdropClick: true,
                                        dialogFade: false,
                                        keyboard: true,
                                        template: template,
                                        scope: $scope,
                                        controller: controller
                                    };

                                    var modalInstance = $modal.open($scope.opts);
                                }
                            });

                        }

                    });
                    /* Fin - Inserción del Detalle */             
                } //Fin ELSE Restricción tipo_producto
                /*** ELEMENTO INSERTADO - FIN ***/
            };
            
            //INSERTAR DETALLE DE COTIZACIÓN
            that.insertarDetalleCotizacion = function(row) {
                //Cálculo de cantidad pendiente
                var cantidad_pendiente = row.entity.cantidad_solicitada - row.entity.disponible;

                /* Inicio - Objeto para Inserción Detalle */
                var obj_detalle = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        cotizacion_detalle: {
                            
                            pedido_cliente_id_tmp: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion(),
                            codigo_producto: row.entity.codigo_producto,
                            porc_iva: row.entity.iva,
                            numero_unidades: parseInt(row.entity.cantidad_solicitada),
                            valor_unitario: row.entity.precio,
                            tipo_producto: row.entity.tipo_producto_id
                    
                        }
                    }
                };
                
                console.log(">>>> Datos para la base de datos: ",obj_detalle);
                /* Fin - Objeto para Inserción Detalle */

                /* Inicio - Inserción de objeto en grid de seleccionados */

                var producto = ProductoPedido.get(
                                    row.entity.codigo_producto,      //codigo_producto
                                    row.entity.descripcion,          //descripcion
                                    0,                               //existencia **hasta aquí heredado
                                    parseFloat(row.entity.precio),      //precio
                                    parseInt(row.entity.cantidad_solicitada),  //cantidad_solicitada
                                    0,                               //cantidad_separada
                                    "",                              //observacion
                                    "",                              //disponible
                                    row.entity.molecula, //molecula
                                    "",                              //existencia_farmacia
                                    row.entity.tipo_producto_id,     //tipo_producto_id
                                    "",                              //total_existencias_farmacia
                                    "",                              //existencia_disponible
                                    (cantidad_pendiente < 0) ? '0' : cantidad_pendiente      //cantidad_pendiente
                                );
                                    
                producto.setCodigoCum(row.entity.getCodigoCum());
                producto.setCodigoInvima(row.entity.getCodigoInvima());
                producto.setVencimientoCodigoInvima(row.entity.getVencimientoCodigoInvima());
                producto.setIva(parseFloat(row.entity.getIva()));
                producto.setPrecioRegulado(row.entity.getPrecioRegulado());
                producto.setPrecioVentaAnterior(row.entity.getPrecioVentaAnterior());
                producto.setCostoUltimaCompra(row.entity.getCostoUltimaCompra());
                producto.setTotalSinIva();
                producto.setTotalConIva();
                producto.setEstado(row.entity.getEstado());

                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                //Restricción tipo_pedido de aquí hacia abajo
/**/
                var longitud_seleccionados = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.length;

                var test_index = 0;

                if (longitud_seleccionados > 1) {
                    test_index = 1;
                }
                else {
                    test_index = 0;
                }

                /*Inicio: Evitar Inserción por tipo Producto */
                if ($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id !== row.entity.tipo_producto_id) {

                    var descripcion_tipo_anterior = "";
                    var descripcion_tipo_actual = "";

                    $scope.rootSeleccionProductoCliente.lista_tipo_productos.forEach(function(tipo_producto) {

                        if (tipo_producto.tipo_producto_id === $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id) {
                            descripcion_tipo_anterior = tipo_producto.descripcion;
                        }
                        if (tipo_producto.tipo_producto_id === row.entity.tipo_producto_id) {
                            descripcion_tipo_actual = tipo_producto.descripcion;
                        }
                    });

                    var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>No se puede incluir un producto de ' + descripcion_tipo_actual + ' en una cotización de ' + descripcion_tipo_anterior + ' </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                    </div>';

                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: template,
                        scope: $scope,
                        controller: controller
                    };

                    var modalInstance = $modal.open($scope.opts);

                    $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                }
/**/            else {//ELSE Restricción tipo_pedido
                    if ($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.length === 25) {

                        var template = ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Mensaje del Sistema</h4>\
                                        </div>\
                                        <div class="modal-body">\
                                            <h4>Usted ha llegado a los 25 productos para éste Pedido ! </h4> \
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                        </div>';

                        controller = function($scope, $modalInstance) {

                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        };

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: template,
                            scope: $scope,
                            controller: controller
                        };

                        var modalInstance = $modal.open($scope.opts);

                    }
                    /* Fin - Inserción de objeto en grid de seleccionados */

                    //Aquí se debe cambiar la asignación. Como se usa un objeto, tal vez no sea necesaria ...

                    $scope.$emit('cargarGridPrincipal', $scope.rootSeleccionProductoCliente.bloquear_eliminar);

                    /* Inicio - Inserción del Detalle */

                    var url_detalle = API.PEDIDOS.INSERTAR_DETALLE_COTIZACION;

                    Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                        if (data.status === 200) {
                            console.log("Registro Insertado Exitosamente en Detalle: ", data.msj);
                            
                            //console.log(">>> Dato Retorno INSERT Detalle Cotización: ", data);
                            
                            //Se toma la fecha del registro
                            //var fecha_registro = data.obj.resultado_consulta[0].fecha_registro;
                            
                            //$scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().setFechaRegistro(fecha_registro);

                            //Sumar Parcial de Total Con IVA y Sin IVA
                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_sin_iva += parseFloat(producto.getTotalSinIva());
                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_con_iva += parseFloat(producto.getTotalConIva());
                        }
                        else {
                            console.log("No se pudo Incluir éste produto: ",data.msj);

                            $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                            var obj_bloqueo = {
                                session: $scope.rootSeleccionProductoCliente.session,
                                data: {
                                    usuario_bloqueo: {
                                        farmacia_id: '03',
                                        centro_utilidad_id: '1 ',
                                        codigo_producto: row.entity.codigo_producto.trim()
                                    }
                                }
                            };

                            var url_bloqueo = API.PEDIDOS.BUSCAR_USUARIO_BLOQUEO;

                            Request.realizarRequest(url_bloqueo, "POST", obj_bloqueo, function(data) {

                                if (data.status === 200) {

                                    console.log("Consulta de usuario bloqueante exitosa: ", data.msj);

                                    console.log(" >>>>#####>>>> Resultado Consulta Usuario Bloqueo: ", data);

    //                                var template = ' <div class="modal-header">\
    //                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
    //                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
    //                                                </div>\
    //                                                <div class="modal-body">\
    //                                                    <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por el usuario '+
    //                                                    '('+data.obj.datos_usuario[0].usuario_id+') '+data.obj.datos_usuario[0].nombre+' </h4> \
    //                                                </div>\
    //                                                <div class="modal-footer">\
    //                                                    <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
    //                                                </div>';
    //
    //                                controller = function($scope, $modalInstance) {
    //
    //                                    $scope.close = function() {
    //                                        $modalInstance.close();
    //                                    };
    //                                };
    //
    //                                $scope.opts = {
    //                                    backdrop: true,
    //                                    backdropClick: true,
    //                                    dialogFade: false,
    //                                    keyboard: true,
    //                                    template: template,
    //                                    scope: $scope,
    //                                    controller: controller
    //                                };
    //
    //                                var modalInstance = $modal.open($scope.opts);

                                }
                                else {
                                    console.log("Consulta de usuario bloqueante fallida: ", data.msj);

                                    var template = ' <div class="modal-header">\
                                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                    </div>\
                                                    <div class="modal-body">\
                                                        <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por otro usuario </h4> \
                                                    </div>\
                                                    <div class="modal-footer">\
                                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                                    </div>';

                                    controller = function($scope, $modalInstance) {

                                        $scope.close = function() {
                                            $modalInstance.close();
                                        };
                                    };

                                    $scope.opts = {
                                        backdrop: true,
                                        backdropClick: true,
                                        dialogFade: false,
                                        keyboard: true,
                                        template: template,
                                        scope: $scope,
                                        controller: controller
                                    };

                                    var modalInstance = $modal.open($scope.opts);
                                }
                            });

                        }

                    });
                    /* Fin - Inserción del Detalle */ 
                }//Fin ELSE Restricción tipo_producto
            };
            
            that.consultarEstadoPedido = function(numero_pedido, callback){
                
                var obj = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        estado_pedido: {
                            numero_pedido: numero_pedido,
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTA_ESTADO_PEDIDO;

                Request.realizarRequest(url, "POST", obj, function(data_estado) {

                    if (data_estado.status === 200) {
                        console.log("Consulta exitosa: ", data_estado.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {

                            var estado_pedido = data_estado.obj.resultado_consulta[0].estado_pedido;
                            var estado_separacion = data_estado.obj.resultado_consulta[0].estado_separacion;
                            
                            callback(estado_pedido, estado_separacion);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data_estado.msj);
                    }
                });
                
            };
            
            $scope.onEliminarSeleccionado = function(row){
                
                var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>Seguro desea eliminar el producto '+row.entity.codigo_producto+' - '+row.entity.descripcion+' ? </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">No</button>\
                                        <button class="btn btn-primary" ng-click="aceptaEliminar()" ng-disabled="" >Si</button>\
                                    </div>';

                controller = function($scope, $modalInstance) {

                    $scope.aceptaEliminar = function() {
                        
                        //Se acepta eliminar y se procede
                        that.eliminarSeleccionado(row);

                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                };

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };

                var modalInstance = $modal.open($scope.opts);
                
            };
            
            /* Eliminar producto seleccionado - Inicio */
            that.eliminarSeleccionado = function(row) {

                if ($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().obtenerProductos().length === 1)
                {

                    $scope.rootSeleccionProductoCliente.bloquear_eliminar = true;
                    //Mensaje: Solo queda un producto. La cotización debe tener al menos un producto. No puede eliminar éste.
                    var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>Solo queda un producto en el detalle y debe haber al menos uno. <br>No puede eliminar más productos. </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                    </div>';

                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: template,
                        scope: $scope,
                        controller: controller
                    };

                    var modalInstance = $modal.open($scope.opts);                            
                }
                else {

                    if($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined)
                    {
                        var numero_cotizacion = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                        
                        that.consultarEstadoCotizacion(numero_cotizacion, function(estado_cotizacion){
                            
                            if (estado_cotizacion === '1' || estado_cotizacion === '2') {
                                that.eliminarDetalleCotizacion(row);
                            }
                            else {
                                /**/
                                $scope.opts = {
                                    backdrop: true,
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    template: ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Aviso: </h4>\
                                                </div>\
                                                <div class="modal-body row">\
                                                    <div class="col-md-12">\
                                                        <h4 >La Cotización ' + numero_cotizacion + ' se ha convertido en Pedido. No puede Modificarse!</h4>\
                                                    </div>\
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                                </div>',
                                    scope: $scope,
                                    controller: function($scope, $modalInstance) {
                                        $scope.close = function() {
                                            $modalInstance.close();
                                        };
                                    }
                                };

                                var modalInstance = $modal.open($scope.opts);
                                /**/
                            }
                        });
                    }
                    else if($scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido() !== ''
                        && $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined)
                    {
                        
                        var numero_pedido = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido();
                        
                        that.consultarEstadoPedido(numero_pedido, function(estado_pedido, estado_separacion){

                            if ((estado_pedido === '0' || estado_pedido === '1') && !estado_separacion) {
                                //Ejecuta la eliminación
                                that.eliminarDetallePedido(row);
                            } //Fin IF estado_pedido
                            else {
                                //Muestra Alerta explicando porqué no puede eliminar
                                $scope.opts = {
                                    backdrop: true,
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    template: ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Aviso: </h4>\
                                                </div>\
                                                <div class="modal-body row">\
                                                    <div class="col-md-12">\
                                                        <h4 >El Pedido ' + numero_pedido + ' ya está siendo separado o en proceso de <br>despacho. No puede modificarse!</h4>\
                                                    </div>\
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                                </div>',
                                    scope: $scope,
                                    controller: function($scope, $modalInstance) {
                                        $scope.close = function() {
                                            $modalInstance.close();
                                        };
                                    }
                                };

                                var modalInstance = $modal.open($scope.opts);
                            }

                        }); //Fin consultarEstadoPedido    
                    }
                }                        
            };            
            /* Eliminar producto seleccionado - Fin */
            
            //Eliminar Detalle Cotización
            that.eliminarDetalleCotizacion = function(row){
                
                var obj_detalle = {
                        session: $scope.rootSeleccionProductoCliente.session,
                        data: {
                            eliminar_detalle_cotizacion: {
                                numero_cotizacion: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getNumeroCotizacion(),
                                codigo_producto: row.entity.codigo_producto
                            }
                        }
                    };
                    /* Fin - Objeto para Eliminar Registro del Detalle */

                    /* Inicio - Borrado de registro en Detalle Pedido */

                var url_eliminar_detalle_cotizacion = API.PEDIDOS.ELIMINAR_REGISTRO_DETALLE_COTIZACION;

                Request.realizarRequest(url_eliminar_detalle_cotizacion, "POST", obj_detalle, function(data) {

                    if (data.status == 200) {
                        console.log("Eliminación de detalle Exitosa: ", data.msj);
                        $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_sin_iva -= parseFloat(row.entity.total_sin_iva);
                        $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_con_iva -= parseFloat(row.entity.total_con_iva);                        
                        $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().eliminarProducto(row.rowIndex);
                    }
                    else
                    {
                        console.log("Eliminación Detalle Fallida: ", data.msj);
                    }
                });
                    
            };
            
            //Eliminar Detalle Pedido
            that.eliminarDetallePedido = function(row){
                
                var obj_detalle = {
                        session: $scope.rootSeleccionProductoCliente.session,
                        data: {
                            eliminar_detalle_pedido: {
                                numero_pedido: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().get_numero_pedido(),
                                codigo_producto: row.entity.codigo_producto
                            }
                        }
                    };
                    /* Fin - Objeto para Eliminar Registro del Detalle */

                    /* Inicio - Borrado de registro en Detalle Pedido */

                var url_eliminar_detalle_pedido = API.PEDIDOS.ELIMINAR_REGISTRO_DETALLE_PEDIDO;

                Request.realizarRequest(url_eliminar_detalle_pedido, "POST", obj_detalle, function(data) {

                    if (data.status == 200) {
                        console.log("Eliminación de detalle Exitosa: ", data.msj);
                        $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_sin_iva -= parseFloat(row.entity.total_sin_iva);
                        $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().valor_total_con_iva -= parseFloat(row.entity.total_con_iva);                        
                        $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().eliminarProducto(row.rowIndex);
                    }
                    else
                    {
                        console.log("Eliminación Detalle Fallida: ", data.msj);
                    }
                });
                    
            };            
            
            $scope.limpiarProductosEmpresa = function() {
                $scope.rootSeleccionProductoCliente.Empresa.vaciarProductos();
            };
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
 
                //Este evento no funciona para los Slides, así que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes líneas son efectivas si se usa la view sin el slide

                $scope.rootSeleccionProductoCliente = {};

            });
            
            //eventos de widgets
            $scope.onTeclaBuscarSeleccionProducto = function(ev) {

                 if (ev.which == 13) {
                     $scope.onBuscarSeleccionProducto($scope.obtenerParametros());
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.rootSeleccionProductoCliente.paginaactual--;
                 $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootSeleccionProductoCliente.paginaactual++;
                 $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), true);
            };

            $scope.valorSeleccionado = function() {

            };

        }]);
});
