
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosClientesController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "Laboratorio",
        "ProductoPedidoCliente",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Laboratorio, Producto, Sesion) {

            var that = this;

            $rootScope.$on('gestionar_productos_clientesCompleto', function(e, parametros) {


                $scope.rootSeleccionProducto = {};
                $scope.rootSeleccionProducto.filtros = [
                    {nombre: "Descripcion", tipo_busqueda: 0},
                    {nombre: "Molecula", tipo_busqueda: 1},
                    {nombre: "Codigo", tipo_busqueda: 2}
                ];

                $scope.rootSeleccionProducto.filtro = $scope.rootSeleccionProducto.filtros[0];


                // Variables del View
                $scope.datos_form = {
                    clases_tipo_producto: ["", "label label-success", "label label-danger", "label label-info", "label label-warning", "label label-default"],
                    tipo_producto: $scope.Pedido.get_tipo_producto(),
                    seleccion_tipo_producto: '- Todos -',
                    paginando: false,
                    cantidad_items: 0,
                    termino_busqueda: "",
                    ultima_busqueda: "",
                    pagina_actual: 1,
                    laboratorio: Laboratorio.get('', ''),
                    producto_seleccionado: Producto.get()
                };

                $scope.seleccionar_tipo_producto($scope.datos_form.tipo_producto);
                that.buscar_laboratorios();
                //that.buscar_productos_clientes();
            });

            $rootScope.$on('cerrar_gestion_productos_clientesCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });

            // Gestionar Cotizaciones 
            that.gestionar_cotizaciones = function(callback) {

                if ($scope.Pedido.get_numero_cotizacion() === 0) {
                    //Crear Cotizacion y Agregar Productos
                    $scope.insertar_cabercera_cotizacion(function(continuar) {
                        if (continuar) {
                            that.insertar_detalle_cotizacion(function(resultado) {
                                if (resultado)
                                    that.buscar_productos_clientes();
                            });
                        }
                    });
                } else {
                    // Agregar Productos a la Cotizacion
                    that.insertar_detalle_cotizacion(function(resultado) {
                        if (resultado)
                            that.buscar_productos_clientes();
                    });
                }
            };

            // Gestionar Pedidos 
            that.gestionar_pedidos = function(callback) {

                that.insertar_detalle_pedido(function(resultado) {
                    if (resultado)
                        that.buscar_productos_clientes();
                });
            };

            // Insertar Encabezado Cotizacion
            $scope.insertar_cabercera_cotizacion = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.INSERTAR_COTIZACION, "POST", obj, function(data) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                    if (data.status === 200 && data.obj.pedidos_clientes.numero_cotizacion > 0) {

                        $scope.Pedido.set_numero_cotizacion(data.obj.pedidos_clientes.numero_cotizacion);
                        $scope.Pedido.set_tipo_producto($scope.datos_form.tipo_producto);

                        localStorageService.add("numero_cotizacion", $scope.Pedido.get_numero_cotizacion());
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            // Insertar Productos a la Cotizacion
            that.insertar_detalle_cotizacion = function(callback) {
                
                var productoSeleccionado = $scope.datos_form.producto_seleccionado;
                var precioVenta = Number(productoSeleccionado.get_precio_venta());
                var precioRegulado = Number(productoSeleccionado.get_precio_regulado());
                var costoCompra = Number(productoSeleccionado.getPrecioVentaAnterior());
              
                /**
                 * +Descripcion: Se validara si el producto seleccionado es regulado
                 *               
                 */
                if(productoSeleccionado.es_regulado()){
                    
                    /**
                     * +Descripcion: Se valida si el precio de venta es mayor al
                     *               precio regulado, por lo cual se emitira un
                     *               mensaje al usuario y se cancelara la operacion
                     */
                    if(precioVenta > precioRegulado){
                        
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El precio de venta esta por encima del regulado ");
                        
                        return;
                    }
                }
                
                
                 /**
                 * +Descripcion: Se validara si el producto seleccionado es regulado
                 *               
                 */
                if(!productoSeleccionado.es_regulado()){
                    
                    /**
                     * +Descripcion: Se valida si el precio de venta es mayor al
                     *               costo de compra, por lo cual se emitira un
                     *               mensaje al usuario y se cancelara la operacion
                     */
                    if(precioVenta < costoCompra){
                        
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El precio de venta esta por debajo del costo de compra");
                        
                        return;
                    }
                }
               
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido,
                            producto: $scope.datos_form.producto_seleccionado
                        }
                    }
                };
              
            
                Request.realizarRequest(API.PEDIDOS.CLIENTES.INSERTAR_DETALLE_COTIZACION, "POST", obj, function(data) {

                    $scope.datos_form.producto_seleccionado = Producto.get();

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            // Insertar Productos al pedido
            that.insertar_detalle_pedido = function(callback) {
                
                var productoSeleccionado = $scope.datos_form.producto_seleccionado;
                var precioVenta = Number(productoSeleccionado.get_precio_venta());
                var precioRegulado = Number(productoSeleccionado.get_precio_regulado());
                var costoCompra = Number(productoSeleccionado.getPrecioVentaAnterior());
           
                /**
                 * +Descripcion: Se validara si el producto seleccionado es regulado
                 *               
                 */
                if(productoSeleccionado.es_regulado()){
                    
                    /**
                     * +Descripcion: Se valida si el precio de venta es mayor al
                     *               precio regulado, por lo cual se emitira un
                     *               mensaje al usuario y se cancelara la operacion
                     */
                    if(precioVenta > precioRegulado){
                        
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El precio de venta esta por encima del regulado ");
                        
                        return;
                    }
                }
                
               /**
                 * +Descripcion: Se validara si el producto seleccionado es regulado
                 *               
                 */
                if(!productoSeleccionado.es_regulado()){
                    
                    /**
                     * +Descripcion: Se valida si el precio de venta es mayor al
                     *               costo de compra, por lo cual se emitira un
                     *               mensaje al usuario y se cancelara la operacion
                     */
                    if(precioVenta < costoCompra){
                        
                       AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El precio de venta esta por debajo del costo de compra");
                        
                        return;
                    }
                }
               
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            pedido: $scope.Pedido,
                            producto: $scope.datos_form.producto_seleccionado
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.INSERTAR_DETALLE_PEDIDO, "POST", obj, function(data) {

                    $scope.datos_form.producto_seleccionado = Producto.get();

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            // Laboratorios
            that.buscar_laboratorios = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        laboratorios: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_LABORATORIOS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_laboratorios(data.obj.laboratorios);
                    }
                });
            };

            that.render_laboratorios = function(laboratorios) {

                $scope.Empresa.limpiar_laboratorios();
                var laboratorio = Laboratorio.get("", "-- TODOS --");
                $scope.Empresa.set_laboratorios(laboratorio);
                laboratorios.forEach(function(data) {
                    laboratorio = Laboratorio.get(data.laboratorio_id, data.descripcion_laboratorio);
                    $scope.Empresa.set_laboratorios(laboratorio);
                });
            };

            $scope.seleccionar_laboratorio = function() {
                that.buscar_productos_clientes();
            };

            // Productos 
            $scope.seleccionar_tipo_producto = function(tipo_producto) {
                $scope.datos_form.tipo_producto = tipo_producto;
                $scope.datos_form.pagina_actual = 1;

                that.obtener_seleccion_tipo_producto();
                that.buscar_productos_clientes();
            };

            that.obtener_seleccion_tipo_producto = function() {

                $scope.datos_form.seleccion_tipo_producto = '';

                if ($scope.datos_form.tipo_producto === '')
                    $scope.datos_form.seleccion_tipo_producto = "- Todos -";
                if ($scope.datos_form.tipo_producto === '1')
                    $scope.datos_form.seleccion_tipo_producto = "- Normales -";
                if ($scope.datos_form.tipo_producto === '2')
                    $scope.datos_form.seleccion_tipo_producto = "- Alto Costo -";
                if ($scope.datos_form.tipo_producto === '3')
                    $scope.datos_form.seleccion_tipo_producto = "- Controlados -";
                if ($scope.datos_form.tipo_producto === '4')
                    $scope.datos_form.seleccion_tipo_producto = "- Insumos -";
                if ($scope.datos_form.tipo_producto === '5')
                    $scope.datos_form.seleccion_tipo_producto = "- Neveras -";
            };

            $scope.buscador_productos = function(ev) {


                if (ev.which === 13) {
                    that.buscar_productos_clientes();
                }

            };

            $scope.onSeleccionFiltro = function(filtro) {
                $scope.rootSeleccionProducto.filtro = filtro;
            };

            that.buscar_productos_clientes = function() {


                if ($scope.datos_form.ultima_busqueda !== $scope.datos_form.termino_busqueda) {
                    $scope.datos_form.pagina_actual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            empresa_id: $scope.Pedido.get_empresa_id(),
                            centro_utilidad_id: $scope.Pedido.get_centro_utilidad_id(),
                            bodega_id: $scope.Pedido.get_bodega_id(),
                            contrato_cliente_id: $scope.Pedido.getCliente().get_contrato(),//894
                            pagina_actual: $scope.datos_form.pagina_actual,
                            termino_busqueda: $scope.datos_form.termino_busqueda,
                            tipo_producto: $scope.datos_form.tipo_producto,
                            laboratorio_id: $scope.datos_form.laboratorio.get_id(),
                            numero_cotizacion: $scope.Pedido.get_numero_cotizacion(),
                            numero_pedido: $scope.Pedido.get_numero_pedido(),
                            filtro: $scope.rootSeleccionProducto.filtro
                        }
                    }
                };


                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_PRODUCTOS_CLIENTES, "POST", obj, function(data) {
                    
                    console.log("data ", data);
                    $scope.datos_form.ultima_busqueda = $scope.datos_form.termino_busqueda;

                    if (data.status === 200) {

                        $scope.datos_form.cantidad_items = data.obj.pedidos_clientes.lista_productos.length;

                        if ($scope.datos_form.paginando && $scope.datos_form.cantidad_items === 0) {
                            if ($scope.datos_form.pagina_actual > 0) {
                                $scope.datos_form.pagina_actual--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        that.render_productos(data.obj.pedidos_clientes.lista_productos);
                    }
                });
            };
            
            
            that.render_productos = function(productos) {
                
                  
                $scope.Empresa.limpiar_productos();

                productos.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, data.existencia, data.iva, data.tipo_producto_id, data.estado);
                    producto.set_descripcion_tipo_producto(data.descripcion_tipo_producto);
                    producto.set_codigo_cum(data.codigo_cum).set_codigo_invima(data.codigo_invima).set_fecha_vencimiento_invima(data.vencimiento_codigo_invima);
                    producto.set_regulado(data.sw_regulado).set_precio_regulado(data.precio_regulado);
                    producto.set_pactado(data.tiene_precio_pactado).set_precio_venta(data.precio_producto);
                    
                    producto.setPrecioVentaAnterior(data.costo_ultima_compra);
                  //setPrecioVentaAnterior 1101E0740001
                    producto.set_cantidad_disponible(data.cantidad_disponible);
                    $scope.Empresa.set_productos(producto);
                    
                    
                });


            };




            $scope.habilitar_seleccion_producto = function() {

                // Pedido
                if ($scope.Pedido.get_numero_pedido() > 0) {

                    if (!$scope.datos_view.opciones.sw_modificar_pedido)
                        return $scope.datos_view.permisos_pedidos.btn_modificar_pedidos;
                }

                // Cotizacion
                if (!$scope.datos_view.opciones.sw_crear_cotizacion)
                    return $scope.datos_view.permisos_cotizaciones.btn_crear_cotizaciones;

            };

            $scope.validar_seleccion_producto = function() {

                if ($scope.Pedido.get_productos().length >= 25)
                    return true;

            };

            $scope.solicitar_producto = function(producto) {

                var val = producto.precio_venta;
                var clean = val.replace(/[^0-9\.]/g, '');
                var decimalCheck = clean.split('');

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 4);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];

                    $scope.datos_form.producto_seleccionado = producto;

                    $scope.Pedido.set_productos(producto);

                    $scope.Pedido.set_tipo_producto($scope.datos_form.tipo_producto);

                    if ($scope.datos_form.tipo_producto === '') {
                        $scope.datos_form.tipo_producto = producto.get_tipo_producto();
                        $scope.Pedido.set_tipo_producto(producto.get_tipo_producto());
                    }

                    if ($scope.Pedido.get_numero_pedido() > 0) {

                        that.gestionar_pedidos();
                    } else {

                        that.gestionar_cotizaciones();
                    }

                }else{
                     AlertService.mostrarMensaje("danger", "El tipo de valor es errado");
                }
            };

          
            $scope.lista_productos = {
                data: 'Empresa.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-class="agregar_clase_tipo_producto(row.entity.tipo_producto)" >{{row.entity.get_abreviacion_tipo_producto()}}</span>\
                                            <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                        </div>'},
                    {field: 'getDescripcion()', displayName: 'Descripcion', enableCellEdit: false},
                    {field: 'get_codigo_cum()', displayName: 'CUM', width: "7%"},
                    {field: 'get_iva()', displayName: 'IVA', width: "50"},
                    {field: 'get_precio_regulado()', displayName: '$ Regulado', width: "130", cellFilter: "currency:'$ '",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.es_regulado()" class="label label-red" >R</span>\
                                            <span ng-cell-text class="pull-right" >{{COL_FIELD | currency}}</span>\
                                        </div>'},
                //    {field: 'get_precio_venta()', displayName: '$ Venta', width: "7%", cellFilter: "currency:'$ '",
                {field: 'precio_venta', width: "8%", displayName: "$ Venta", cellFilter: "number",
                     cellTemplate: '<div class="col-xs-12" > <input ng-if="!row.entity.sw_pactado" type="text" \
                     ng-model="row.entity.precio_venta" \
                     validacion-numero-decimal\
                     ng-disabled = "row.entity.sw_pactado"\n\
                     class="form-control grid-inline-input" name="" id="" /> \n\
                     <div ng-if="row.entity.sw_pactado" class="ngCellText" >\n\
                        <span  ng-class="agregar_clase_tipo_producto(row.entity.tipo_producto)" >\n\
                                                    CC\n\
                                                </span><span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\n\
                        </div></div>'
                    },
                   
                    
                    {field: 'get_existencia()', displayName: 'Stock', width: "5%"},
                    {field: 'get_cantidad_disponible()', displayName: 'Dispo.', width: "5%"},
                    {field: 'cantidad_solicitada', width: "7%", displayName: "Cantidad", cellFilter: "number",
                        cellTemplate: '<div class="col-xs-12"> \
                                      <input type="text" \
                                       ng-model="row.entity.cantidad_solicitada" \
                                       validacion-numero-entero \
                                       class="form-control grid-inline-input" \n\
                                       name="" id="" /> </div>'},
                    {width: "60", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-toolbar">\
                                            <button ng-if="row.entity.get_estado() == 0 " ng-disabled="validar_seleccion_producto()" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-lock"></span></button>\
                                            <button ng-if="row.entity.get_estado() == 1 " ng-disabled="validar_seleccion_producto()" class="btn btn-default btn-xs" ng-validate-events="{{ habilitar_seleccion_producto() }}" ng-click="solicitar_producto(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}

                ]
            };

            $scope.agregar_clase_tipo_producto = function(tipo_producto) {
                return $scope.datos_form.clases_tipo_producto[tipo_producto];
            };

            $scope.pagina_anterior = function() {
                $scope.datos_form.paginando = true;
                $scope.datos_form.pagina_actual--;
                that.buscar_productos_clientes();
            };

            $scope.pagina_siguiente = function() {
                $scope.datos_form.paginando = true;
                $scope.datos_form.pagina_actual++;
                that.buscar_productos_clientes();
            };




            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});