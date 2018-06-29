
define(["angular", "js/controllers",
    "models/generacionpedidos/pedidosclientes/Laboratorio",
    "models/generacionpedidos/pedidosclientes/Molecula"
], function(angular, controllers) {

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
        "Usuario", "Molecula", "$sce",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Laboratorio, Producto, Sesion, Molecula, $sce) {

            var that = this;
            
            that.estadoMultipleCotizacion = localStorageService.get("multiple_pedido");
            $rootScope.$on('gestionar_productos_clientesCompleto', function(e, parametros) {

                /**
                 * +Descripcion Menu desplegable para filtar en la busqueda de
                 *              un producto
                 */
                

                //$scope.seleccionar_tipo_producto($scope.datos_form.tipo_producto);
                //that.buscar_laboratorios();
                $scope.Empresa.limpiar_productos();
            });
            
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
                    producto_seleccionado: Producto.get(),
                    molecula: '', //Molecula.get('', ''),
                    laboratorioAvanzado: Laboratorio.get('', ''),
                    codigoProductoAvanzado: '',
                    nombreProductoAvanzado: '',
                    concentracionProductoAvanzado: '',
                    tipoBusqueda: 0
                };
                
            $rootScope.$on('cerrar_gestion_productos_clientesCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });

            // Gestionar Cotizaciones
            that.gestionar_cotizaciones = function(callback) {
                
                 localStorageService.add("cotizacion", null);
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
                var multiplePedido = localStorageService.get("multiple_pedido");
              
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido,
                            estadoMultiplePedido:  multiplePedido === null ? 0 : multiplePedido.multiple_pedido
                        }
                    }
                };

                //valida si la cantidad solicitada del producto en la cotizacion es mayor que 0
                if(obj.data.pedidos_clientes.cotizacion.productos[0].cantidad_solicitada > 0){

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
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "La cantidad solicitada no puede ser menor o igual a cero");
                }
            };

            // Insertar Productos a la Cotizacion
            that.insertar_detalle_cotizacion = function(callback) {
                 
                var productoSeleccionado = $scope.datos_form.producto_seleccionado;
                var precioVenta = Number(productoSeleccionado.get_precio_venta());
                var precioRegulado = Number(productoSeleccionado.get_precio_regulado());
                var costoCompra = Number(productoSeleccionado.getPrecioVentaAnterior());

                var valorIva = Number(productoSeleccionado.get_iva())
                var valorTotalIva = (precioVenta * valorIva) / 100;
                var precioVentaIva = precioVenta + valorTotalIva;

                productoSeleccionado.setPrecioVentaIva(precioVentaIva);
                                                

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido,
                            producto: $scope.datos_form.producto_seleccionado,
                            estadoMultiplePedido:  that.estadoMultipleCotizacion === null ? 0 : that.estadoMultipleCotizacion.multiple_pedido
                        }
                    }                
                };
                 
                Request.realizarRequest(API.PEDIDOS.CLIENTES.INSERTAR_DETALLE_COTIZACION, "POST", obj, function(data) {

                    $scope.datos_form.producto_seleccionado = Producto.get();

                   

                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", data.msj);
                        callback(true);
                         socket.remove(['onListarEstadoCotizacion']);
                    } else {
                         AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
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
                var valorIva = Number(productoSeleccionado.get_iva());
                var valorTotalIva = (precioVenta * valorIva) / 100;
                var precioVentaIva = precioVenta + valorTotalIva;

                productoSeleccionado.setPrecioVentaIva(precioVentaIva);


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

                    AlertService.mostrarMensaje("success", data.msj);

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            /*
             * @author Cristian Ardila
             * @fecha  04/03/2016
             * +Descripcion Funcion encargada de invocar los laboratorios
             */
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
                
                $scope.Pedido.tipo_producto = tipo_producto;
                
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
                
                if ($scope.datos_form.tipo_producto === '8')
                    $scope.datos_form.seleccion_tipo_producto = "- Nutricional -";
                
                if ($scope.datos_form.tipo_producto === '9')
                    $scope.datos_form.seleccion_tipo_producto = "- Gerencia -";
            };

            $scope.buscador_productos = function(ev, tipo) {
                $scope.datos_form.tipoBusqueda = tipo;
                if (ev.which === 13) {
                    that.buscar_productos_clientes();
                }

            };   

            $scope.onSeleccionFiltro = function(filtro) {
                $scope.rootSeleccionProducto.filtro = filtro;
            };

            that.buscar_productos_clientes = function() {
                
//                that.estadoMultipleCotizacion = localStorageService.get("multiple_pedido");
                 
//                 if($scope.Pedido.estadoMultiplePedido){
//                    if($scope.Pedido.estadoMultiplePedido !== that.estadoMultipleCotizacion.multiple_pedido){
//                        that.estadoMultipleCotizacion.multiple_pedido = parseInt($scope.Pedido.estadoMultiplePedido);
//                    }
//                }
                var obj = {};
                $scope.rootSeleccionProducto.filtro.numero = [$scope.Pedido.get_numero_pedido()];
                $scope.rootSeleccionProducto.filtro.tipo = 2;
                
                var pedidoFiltroBodega = localStorageService.get("pedido");
                    
                    if(pedidoFiltroBodega){
                        if(pedidoFiltroBodega.modifica_pedido === 1){

                             $scope.Pedido.set_bodega_id(pedidoFiltroBodega.bodega_pedido_id);
                        }
                    }
                    
                if ($scope.datos_form.tipoBusqueda === 1) {

                    obj = {                                 
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                empresa_id: $scope.Pedido.get_empresa_id(),
                                centro_utilidad_id: $scope.Pedido.get_centro_utilidad_id(),
                                bodega_id: $scope.Pedido.get_bodega_id(),
                                contrato_cliente_id: $scope.Pedido.getCliente().get_contrato(), //894
                                pagina_actual: $scope.datos_form.pagina_actual,
                                termino_busqueda: $scope.datos_form.termino_busqueda,
                                tipo_producto: $scope.Pedido.tipo_producto,//$scope.datos_form.tipo_producto,
                                numero_cotizacion: $scope.Pedido.get_numero_cotizacion(),
                                numero_pedido: $scope.Pedido.get_numero_pedido(),
                                filtro: $scope.rootSeleccionProducto.filtro,
                                //nuevo campos
                                molecula: $scope.datos_form.molecula,
                                laboratorio_id: $scope.datos_form.laboratorioAvanzado.id,
                                codigoProducto: $scope.datos_form.codigoProductoAvanzado,
                                descripcionProducto: $scope.datos_form.nombreProductoAvanzado,
                                concentracion: $scope.datos_form.concentracionProductoAvanzado,
                                tipoBusqueda: $scope.datos_form.tipoBusqueda,
                                estadoMultiplePedido: 0
                              //  estadoMultiplePedido: that.estadoMultipleCotizacion.multiple_pedido
                            }
                        }
                    };
                }



                if ($scope.datos_form.ultima_busqueda !== $scope.datos_form.termino_busqueda) {
                    $scope.datos_form.pagina_actual = 1;
                }
                //var estadoMultiplePedido = localStorageService.get("pedido");
                if ($scope.datos_form.tipoBusqueda === 0) {
                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                empresa_id: $scope.Pedido.get_empresa_id(),
                                centro_utilidad_id: $scope.Pedido.get_centro_utilidad_id(),
                                bodega_id: $scope.Pedido.get_bodega_id(),
                                contrato_cliente_id: $scope.Pedido.getCliente().get_contrato(), //894
                                pagina_actual: $scope.datos_form.pagina_actual,
                                termino_busqueda: $scope.datos_form.termino_busqueda,
                                tipo_producto: $scope.Pedido.tipo_producto,
                                numero_cotizacion: $scope.Pedido.get_numero_cotizacion(),
                                numero_pedido: $scope.Pedido.get_numero_pedido(),
                                filtro: $scope.rootSeleccionProducto.filtro,
                                //nuevo campos    
                                molecula: '',
                                laboratorio_id: $scope.datos_form.laboratorio.get_id(),
                                codigoProducto: '',
                                descripcionProducto: '',
                                concentracion: '',
                                tipoBusqueda: $scope.datos_form.tipoBusqueda,
                                estadoMultiplePedido:  that.estadoMultipleCotizacion === null ? 0 : that.estadoMultipleCotizacion.multiple_pedido
                                
                                
                            }
                        }
                    };
                }
                
                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_PRODUCTOS_CLIENTES, "POST", obj, function(data){

                    $scope.datos_form.ultima_busqueda = $scope.datos_form.termino_busqueda;
                  
                    if (data.status === 200) {

                        $scope.datos_form.cantidad_items = data.obj.pedidos_clientes.lista_productos.length;

                        if ($scope.datos_form.paginando && $scope.datos_form.cantidad_items === 0) {
                            if ($scope.datos_form.pagina_actual > 0) {
                                $scope.datos_form.pagina_actual--;
                            }
                            /*AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;*/
                        }
                        
                        that.render_productos(data.obj.pedidos_clientes.lista_productos);
                    }else{
                        
                        AlertService.mostrarMensaje("warning", data.msj.err);
                        return;
                        
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
                    producto.setContrato(data.contrato);
                    producto.set_cantidad_disponible(data.cantidad_disponible);
                    producto.setUnidadMedida(data.unidad_medida);
                    producto.setNombreBodega(data.nombre_bodega);
                    producto.setEmpresaIdProducto(data.empresa_id);
                    producto.setCentroUtilidadProducto(data.centro_utilidad);
                    producto.setBodegaProducto(data.bodega);
                    producto.setEstadoInvima(data.estado_invima);
                    
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
                 
                if ($scope.Pedido.get_productos().length >= 60)
                    return true;

            };

            /**
             * +Descripcion: Funcion encargada de setear el precio del produco
             *               en el objeto de Pedido al cual le seran asignados
             *               dichos productos
             * @param {type} producto
             */
            $scope.solicitar_producto = function(producto) {
             
                $scope.Pedido.limpiar_productos();

                //mensaje a mostrar cuando el producto tiene asociado un estado invima
                var estadoInvima =  producto.getEstadoInvima(); 
                var mensaje = "<div class='alert alert-danger' style='margin-bottom:0px;' role='alert'>\
                                   <div style='float: left;'><span class='glyphicon glyphicon-warning-sign' style='font-size: 5em;margin: 10px;' aria-hidden='true'></span></div>\
                                   <div>\
                                        <span> <strong>Producto:</strong> " + producto.getDescripcion() + " <br><strong> Estado: " + estadoInvima + "</strong></span>\
                                        <br><br>\
                                        <center><span>¿Desea seleccionar el producto?</span></center>\
                                    </div>\
                                </div>";

                if(producto.precio_venta > 0){

                        $scope.datos_form.producto_seleccionado = producto;

                        $scope.Pedido.set_productos(producto);

                        $scope.Pedido.set_tipo_producto($scope.datos_form.tipo_producto);

                        if ($scope.datos_form.tipo_producto === '') {
                            $scope.datos_form.tipo_producto = producto.get_tipo_producto();
                            $scope.Pedido.set_tipo_producto(producto.get_tipo_producto());
                        }

                        if ($scope.Pedido.get_numero_pedido() > 0) {
                            //OJO VOLVER A PONER
                            if(producto.get_cantidad_solicitada() > producto.get_cantidad_disponible() || producto.get_cantidad_disponible() === 0){
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "No hay disponibilidad suficiente para el producto");
                            }else{
                            //valida si el producto tiene asociado estado invima y muestra alerta {aceptar | cancelar}
                            if(estadoInvima !== null) {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", mensaje, function(respuesta){
                                    if(respuesta){
                                that.gestionar_pedidos();  
                            }
                                });
                        }else{
                                that.gestionar_pedidos();  
                            }
                        }
                    }else{
                        //valida si el producto tiene asociado estado invima y muestra alerta {aceptar | cancelar}
                        if(estadoInvima !== null) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", mensaje, function(respuesta){
                                if(respuesta){
                            that.gestionar_cotizaciones();
                        }
                            });
                        }else{
                            that.gestionar_cotizaciones();
                        }

                    }

                }else{
                  AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El precio de venta debe ser mayor a cero (0)");
                }
            
            };

            $scope.validarHtml = function(html) {
                var htmlValido = $sce.trustAsHtml(html);
                return htmlValido;
            };

            $scope.lista_productos = {
                data: 'Empresa.get_productos()',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                enableColumnResize: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: 140,
                        
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.get_tipo_producto() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.get_tipo_producto() == 2">A</span>\
                                                <span class="label label-info" ng-show="row.entity.get_tipo_producto() == 3">C</span>\
                                                <span class="label label-warning" ng-show="row.entity.get_tipo_producto() == 4">I</span>\
                                                <span class="label label-default" ng-show="row.entity.get_tipo_producto() == 5">Ne</span>\
                                                <span class="label label-info" ng-show="row.entity.get_tipo_producto() == 8">Nu</span>\
                                                <span class="label label-info" ng-show="row.entity.get_tipo_producto() == 9">Ge</span>\
                                                <span ng-cell-text >{{COL_FIELD}}</span>\
                                                <span class="glyphicon glyphicon-lock pull-right text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Nombre',
                        // cellTemplate: '<div class="ngCellText"   ng-class="col.colIndex()">{{row.entity.descripcion}} - {{row.entity.descripcionMolecula}}</div>'},
                        cellTemplate: "<div class='largeCell' ng-bind-html=\"validarHtml(row.entity.getDescripcion())\"></div>", width:450},
                    {field: 'nombreBodega', displayName: 'Bod', width: "50", 
                        cellTemplate:'<div class="ngCellText">\
                                        <span class="label label-primary"  ng-if="row.entity.getNombreBodega() == \'DUA\' "> {{row.entity.getNombreBodega()}}</span>\
                                        <span class="label label-success"  ng-if="row.entity.getNombreBodega() == \'COS\' "> {{row.entity.getNombreBodega()}}</span>\
                                      </div>'
                    },
                    {field: 'codigo_cum', displayName: 'Cum', width: "90", cellClass: "gridNumber"},
                    {field: '#Cod.invima/F.Ven',  displayName: '#Cod.invima/F.Ven', 
                        cellTemplate: '<div class="col-xs-16 ">\n\
                            <p class="text-uppercase">{{row.entity.codigo_invima}} / {{row.entity.fecha_vencimiento_invima}}</p></div>'},
                  
                    {field: 'get_precio_regulado()', displayName: '$ Regulado', width: "130", cellFilter: "currency:'$ '",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                           <span ng-if="row.entity.es_regulado()" class="label label-red" >R</span>\
                                           <span ng-cell-text class="pull-right" >{{COL_FIELD | currency}}</span>\
                                       </div>'},
                    {field: 'precio_venta', width: "150", displayName: "$ Venta", cellFilter: "number",
                        cellTemplate: '<div class="col-xs-12" > <input ng-if="!row.entity.sw_pactado" type="text" select-on-click\
                     ng-model="row.entity.precio_venta" \
                     validacion-numero-decimal\
                     ng-disabled = "row.entity.sw_pactado"\n\
                     class="form-control grid-inline-input" name="" id="" /> \n\
                     <div ng-if="row.entity.sw_pactado" class="ngCellText" >\n\
                        <span  ng-class="agregar_clase_tipo_producto(row.entity.tipo_producto)" class="pull-left" >\n\
                                                    PP\n\
                                                </span><span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\n\
                        </div></div>'
                    },
                    {field: 'iva', displayName: 'Iva', width: "80", cellClass: "gridNumber"},
                    {field: 'existencia', displayName: 'Stock', width: "60", cellClass: "gridNumber"},
                    {field: 'cantidad_disponible', displayName: 'Dispo.', width: "60", cellClass: "gridNumber"},
                    {field: 'cantidad_solicitada', width: "80", displayName: 'Cantidad',
                        cellTemplate: '<div class="col-xs-12"> \
                                      <input type="text" \
                                       ng-model="row.entity.cantidad_solicitada" \
                                       validacion-numero-entero \
                                       class="form-control grid-inline-input" \n\
                                       name="" id="" /> </div>'},
                    {width: "60", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '     <button  ng-disabled="validar_seleccion_producto()" class="btn btn-default btn-xs" ng-validate-events="{{ habilitar_seleccion_producto() }}" ng-click="solicitar_producto(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
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


            /*
             * @author Cristian Ardila
             * @fecha  04/03/2016
             * +Descripcion Funcion encargada de invocar el servicio que consulta
             *              las moleculas
             */
            that.buscar_moleculas = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        moleculas: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_moleculas
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_MOLECULA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        callback(data.obj.moleculas);
                    }
                });
            };
            that.render_moleculas = function(moleculas) {

                $scope.Empresa.limpiar_moleculas();
                var molecula = Molecula.get("", "-- TODOS --");
                $scope.Empresa.set_moleculas(moleculas);
                moleculas.forEach(function(data) {
                    molecula = Molecula.get(data.subclase_id, data.descripcion_molecula);
                    $scope.Empresa.set_moleculas(molecula);
                });

            };

            $scope.listar_moleculas = function(termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_moleculas = termino_busqueda;

                that.buscar_moleculas(function(moleculas) {
                  
                    that.render_moleculas(moleculas);
                });
            };




            /**
             * @author Cristian Manuel Ardila Troches
             * @fecha  04/03/2016
             * +Descripcion: Se desplegara una ventana modal con un formulario
             *               el cual permitira hacer una busqueda avanzada por
             *               producto
             * @param {type} cotizacion_pedido
             */
            $scope.busquedaAvanzadaProducto = function(cotizacion_pedido) {

                $scope.datos_view.pedido_seleccionado = cotizacion_pedido;

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generacionpedidos/pedidosclientes/formularioBusquedaAvanzadaProducto.html',
                    scope: $scope,
                    height: 300,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.cerrarVentanaBusquedaAvanzada = function() {

                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
            };


            that.buscar_laboratorios();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                
               
            });
        }]);
});
