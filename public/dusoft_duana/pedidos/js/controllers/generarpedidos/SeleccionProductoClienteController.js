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
            
            $scope.$on('cargarGridSeleccionadoSlide', function(event, mass) {
                
                console.log("Recibimos la GRID del PADRE: ",mass)
                $scope.rootSeleccionProductoCliente.listado_productos_seleccionados = mass;
                //$scope.rootSeleccionProductoCliente.listado_productos = [];
                //alert("Recibe Grid Padre");
                
            });

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
                $scope.$emit('cerrarseleccionproducto', {animado:true});

                $scope.rootSeleccionProductoCliente = {};
            };
            
            $rootScope.$on("mostrarseleccionproducto", function(e, tipo_cliente, cliente) {

                $scope.rootSeleccionProductoCliente = {};
                
                $scope.rootSeleccionProductoCliente.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };
                
                $scope.rootSeleccionProductoCliente.Empresa = EmpresaPedido;
                $scope.rootSeleccionProductoCliente.tipo_cliente = tipo_cliente;
                $scope.rootSeleccionProductoCliente.cliente = cliente;
                $scope.rootSeleccionProductoCliente.no_incluir_producto = false; //NUEVO
                
                console.log(">>>>>>>>>> Información Cliente: ", cliente);

                $scope.rootSeleccionProductoCliente.paginas = 0;
                $scope.rootSeleccionProductoCliente.items = 0;
                $scope.rootSeleccionProductoCliente.termino_busqueda = "";
                $scope.rootSeleccionProductoCliente.ultima_busqueda = {};
                $scope.rootSeleccionProductoCliente.paginaactual = 1;
                //$scope.numero_pedido = "";
                //$scope.obj = {};
                $scope.rootSeleccionProductoCliente.listado_productos = [];
                $scope.rootSeleccionProductoCliente.listado_productos_seleccionados = [];
                
                //Nueva Línea - Hay que construir de nuevo éste objeto destruido en último llamado.
                //$scope.rootSeleccionProductoCliente.listado_productos = [];
                
                $scope.rootSeleccionProductoCliente.pedido_cliente_id_tmp = '';
                $scope.lista_productos = {};
                
                
                console.log(">>>>>>>>>>>>> Antes de onBuscarSeleccionProducto");
                $scope.onBuscarSeleccionProducto($scope.obtenerParametros(),"");
            });
            
            /**/
            $scope.obtenerParametros = function() {

                //valida si cambio el termino de busqueda
                if ($scope.rootSeleccionProductoCliente.ultima_busqueda.termino_busqueda !== $scope.rootSeleccionProductoCliente.termino_busqueda) {
                    $scope.rootSeleccionProductoCliente.paginaactual = 1;
                }

                var obj = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        productos: {
                            termino_busqueda: $scope.rootSeleccionProductoCliente.termino_busqueda,
                            pagina_actual: $scope.rootSeleccionProductoCliente.paginaactual,
                            empresa_id: '03',//$scope.rootSeleccionProductoCliente.de_empresa_id,
                            centro_utilidad_id: '1 ',//$scope.rootSeleccionProductoCliente.de_centro_utilidad_id,
                            bodega_id: '03',//$scope.rootSeleccionProductoCliente.de_bodega_id,
                            tipo_producto: '0', //$scope.rootSeleccionProductoCliente.tipoProducto,
                            contrato_cliente_id: $scope.rootSeleccionProductoCliente.cliente.contrato_id,
                            pedido_cliente_id_tmp: '0' //$scope.rootSeleccionProductoCliente.pedido_cliente_id_tmp
                        }
                    }
                };

                return obj;
            };    
            
            /*Nuevo ->*/
            
            $scope.onBuscarSeleccionProducto = function(obj, paginando) {

                
                //that.renderGrid();
                
                var url = API.PEDIDOS.LISTAR_PRODUCTOS_CLIENTES;
                
                console.log(">>>>> Parámetros enviados: ", obj);

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        $scope.rootSeleccionProductoCliente.ultima_busqueda = {
                            termino_busqueda: $scope.rootSeleccionProductoCliente.termino_busqueda
                        };
                        console.log(">>>> Datos de la consulta de Productos Clientes: ", data);
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
                
                var producto_obj = {};
                
                data.lista_productos.forEach(function(producto){
                    
                    producto_obj = that.crearProducto(producto);
                    
                    $scope.rootSeleccionProductoCliente.Empresa.agregarProducto(producto_obj);
                    
                });
                
                //console.log(">>>>>>>> Listado Clientes: ", $scope.rootSeleccionCliente.Empresa.getClientes());

            };     

            that.crearProducto = function(obj) {
                
                //console.log(">>>>>> Seleccion Cliente - Datos Creación Cliente: ",obj);
                
                var producto = ProductoPedido.get(
                                    obj.codigo_producto,        //codigo_producto
                                    obj.nombre_producto,        //descripcion
                                    obj.existencia,             //existencia
                                    obj.precio_contrato,        //precio
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
                
                producto.setCodigoCum(obj.codigo_cum);

                producto.setCodigoInvima(obj.codigo_invima);

                producto.setIva(obj.porc_iva);

                producto.setPrecioRegulado(obj.precio_regulado);

                return producto;
            };            

            /**/
 
            /*  Construcción de Grid    */
            
            that.renderGrid = function() {
            
                $scope.lista_productos = {    
                    data: 'rootSeleccionProductoCliente.Empresa.getProductos()',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código Producto'},
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'codigo_cum', displayName: 'CUM'},
                        {field: 'codigo_invima', displayName: 'Código Invima'},
                        {field: 'iva', displayName: 'Iva'},
                        {field: 'precio_regulado', displayName: 'Precio Regulado'},
                        {field: 'precio', displayName: 'Precio Venta'},
                        {field: 'existencia', displayName: 'Existencia'},
                        {field: 'disponible', displayName: 'Disponible'},
                        //{field: 'cantidad_solicitada', displayName: 'Cantidad', enableCellEdit: true},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad', enableCellEdit: false, width: "10%",
                            cellTemplate: ' <div class="col-xs-12">\n\
                                                <input type="text" ng-model="row.entity.cantidad_solicitada" validacion-numero class="form-control grid-inline-input"'+
                                                'ng-keyup="onTeclaIngresaProducto($event, row)"/>\n\
                                            </div>'
                        },
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "6%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-default btn-xs" ng-click="onIncluirProducto(row)" '+
                                                ' ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null || !expreg.test(row.entity.cantidad_solicitada)">\n\
                                                    <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]
                };

                $scope.lista_productos_seleccionados = {    
                    data: 'rootSeleccionProductoCliente.listado_productos_seleccionados',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    //enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                            
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código Producto'},
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                        {field: 'iva', displayName: 'Iva'},
                        {field: 'precio_venta', displayName: 'Precio Unitario'},
                        {field: 'total_sin_iva', displayName: 'Total Sin Iva'},
                        {field: 'total_con_iva', displayName: 'Total Con Iva'},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-danger btn-xs" ng-click="onRowClick2(row)">\n\
                                                    <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]

                };
            };
            
            /*I-NUEVO*/
            //Inserta producto presionando ENTER
            $scope.onTeclaIngresaProducto = function(ev, row) {
//                console.log("Key Evento: ", ev.which);
                if (ev.which === 13) {
                    if (parseInt(row.entity.cantidad_solicitada) > 0) {
                        that.insertarProducto(row);
                    }
                }
            };
            
            //Inserta producto presionando Botón
            $scope.onIncluirProducto = function(row) {
                that.insertarProducto(row);
            };
            
            //Ejecuta operaciones conjuntas de Inserción del producto en pedido temporal
            that.insertarProducto = function(row) {

                $scope.rootSeleccionProductoCliente.no_incluir_producto = false;
                
                var vendedor = $scope.rootSeleccionProductoCliente.Empresa.getVendedorSeleccionado();
                
                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().setTipoIdVendedor(vendedor.tipo_id_tercero);
                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().setVendedorId(vendedor.id);

                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.forEach(function(valor) {
                    if (valor.codigo_producto === row.entity.codigo_producto) {
                        $scope.rootSeleccionProductoCliente.no_incluir_producto = true;
                        return;
                    }
                });

                if ($scope.rootSeleccionProductoCliente.no_incluir_producto === false)
                {
                    that.insertarEncabezadoPedidoTemporal(function(insert_encabezado_exitoso) {
 
                        /*if(insert_encabezado_exitoso) {
                            that.insertarDetallePedidoTemporal(row);
                        } */
                    });
                }
            };
            
            //Función que inserta el encabezado del pedido temporal
            that.insertarEncabezadoPedidoTemporal = function(callback) {
                
                var pedido = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado();
                /* empresa_id, tipo_id_tercero, tercero_id, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones */
                
                var obj_encabezado = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        cotizacion_encabezado: {
                            
                            empresa_id: $scope.rootSeleccionProductoCliente.Empresa.getCodigo(),
                            tipo_id_tercero: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getCliente().tipo_id_tercero,
                            tercero_id: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getCliente().id,
                            tipo_id_vendedor: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getTipoIdVendedor(),
                            vendedor_id: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().getVendedorId(),
                            estado: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().estado,
                            observaciones: $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().observacion
                    
                    
                            /*empresa_id: $scope.rootSeleccionProductoCliente.para_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoCliente.para_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoCliente.para_bodega_id,
                            empresa_destino_id: $scope.rootSeleccionProductoCliente.de_empresa_id,
                            centro_utilidad_destino_id: $scope.rootSeleccionProductoCliente.de_centro_utilidad_id,
                            bodega_destino_id: $scope.rootSeleccionProductoCliente.de_bodega_id,
                            observacion: $scope.rootSeleccionProductoCliente.observacion_encabezado*/
                        }
                    }
                };
                /* Fin - Objeto para inserción de Encabezado*/

                /* Inicio - Inserción del Encabezado */
                
                console.log(">>> lA iNFORMACION para el Encabezado (obj_encabezado) es: ", obj_encabezado);

                var url_encabezado = API.PEDIDOS.CREAR_COTIZACION;

                Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {
                    
                    console.log(">>>>>>>>>> Lo datos enviados son: ", data);

                    if (data.status === 200) {
                        console.log("Registro Insertado Exitosamente en Encabezado");

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
            };
            
            
            that.insertarDetallePedidoTemporal = function(row) {
                //Cálculo de cantidad pendiente
                var cantidad_pendiente = row.entity.cantidad_solicitada - row.entity.disponibilidad_bodega;

                /* Inicio - Objeto para Inserción Detalle */
                var obj_detalle = {
                    session: $scope.rootSeleccionProductoCliente.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            numero_pedido: $scope.rootSeleccionProductoCliente.para_empresa_id.trim() + $scope.rootSeleccionProductoCliente.para_centro_utilidad_id.trim() + row.entity.codigo_producto.trim(),
                            empresa_id: $scope.rootSeleccionProductoCliente.para_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoCliente.para_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoCliente.para_bodega_id,
                            codigo_producto: row.entity.codigo_producto,
                            cantidad_solic: parseInt(row.entity.cantidad_solicitada),
                            tipo_producto_id: row.entity.tipo_producto_id,
                            cantidad_pendiente: (cantidad_pendiente < 0) ? '0' : cantidad_pendiente
                        }
                    }
                };
                /* Fin - Objeto para Inserción Detalle */

                /* Inicio - Inserción de objeto en grid de seleccionados */

                var producto = ProductoPedido.get(
                                    row.entity.codigo_producto,        //codigo_producto
                                    row.entity.nombre_producto,            //descripcion
                                    0,                               //existencia **hasta aquí heredado
                                    0,                               //precio
                                    row.entity.cantidad_solicitada,    //cantidad_solicitada
                                    0,                               //cantidad_separada
                                    "",                              //observacion
                                    "",                              //disponible
                                    "",                              //molecula
                                    "",                              //existencia_farmacia
                                    row.entity.tipo_producto_id,          //tipo_producto_id
                                    "",                              //total_existencias_farmacia
                                    "",                              //existencia_disponible
                                    (cantidad_pendiente < 0) ? '0' : cantidad_pendiente      //cantidad_pendiente
                                );

                $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().agregarProducto(producto);

                //if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length === 25) {
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
                $scope.rootSeleccionProductoCliente.listado_productos_seleccionados = $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos;
                $scope.$emit('cargarGridPrincipal', 1);

                /* Inicio - Inserción del Detalle */

                var url_detalle = API.PEDIDOS.CREAR_DETALLE_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        console.log("Registro Insertado Exitosamente en Detalle: ", data.msj);
                    }
                    else {
                        console.log("No se pudo Incluir éste produto: ",data.msj);

                        $scope.rootSeleccionProductoCliente.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                        var obj_bloqueo = {
                            session: $scope.rootSeleccionProductoCliente.session,
                            data: {
                                usuario_bloqueo: {
                                    farmacia_id: $scope.rootSeleccionProductoCliente.para_empresa_id.trim(),
                                    centro_utilidad_id: $scope.rootSeleccionProductoCliente.para_centro_utilidad_id.trim(),
                                    codigo_producto: row.entity.codigo_producto.trim()
                                }
                            }
                        };

                        var url_bloqueo = API.PEDIDOS.BUSCAR_USUARIO_BLOQUEO;

                        Request.realizarRequest(url_bloqueo, "POST", obj_bloqueo, function(data) {

                            if (data.status === 200) {

                                console.log("Consulta de usuario bloqueante exitosa: ", data.msj);

                                var template = ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por el usuario '+
                                                    '('+data.obj.datos_usuario[0].usuario_id+') '+data.obj.datos_usuario[0].nombre+' </h4> \
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
            };            
            
            
            /*F-NUEVO*/
            
            $scope.onRowClick1 = function(row) {
                
                //console.log(row.entity);
                if($scope.rootSeleccionProductoCliente.listado_productos[row.rowIndex].fila_activa !== false){
                
                    $scope.rootSeleccionProductoCliente.listado_productos[row.rowIndex].fila_activa = false; 
                    $scope.rootSeleccionProductoCliente.listado_productos[row.rowIndex].tipo_boton = 'warning';
                    $scope.rootSeleccionProductoCliente.listado_productos[row.rowIndex].etiqueta_boton = 'Listo';
                    
                    console.log("Row Listado Origen: ", row);

                    var obj_sel = {
                            codigo_producto: row.entity.codigo_producto,
                            descripcion: row.entity.descripcion,
                            cantidad_solicitada: row.entity.cantidad_solicitada,
                            iva: row.entity.iva,
                            precio_venta: row.entity.precio_venta,
                            total_sin_iva: row.entity.cantidad_solicitada*row.entity.precio_venta, //cantidad*precio_venta
                            total_con_iva: row.entity.cantidad_solicitada*row.entity.precio_venta + row.entity.cantidad_solicitada*row.entity.precio_venta*row.entity.iva/100, //cantidad*precio_venta + cantidad*precio_venta*iva
                            sourceIndex: row.rowIndex
                    };

                    //$scope.listado_productos_seleccionados.push(obj_sel); // adiciona al final
                    //$scope.listado_productos_seleccionados.unshift(obj_sel); // adiciona al comienzo
                    $scope.rootSeleccionProductoCliente.listado_productos_seleccionados.unshift(row.entity);

                    $scope.$emit('cargarGridPrincipal', $scope.rootSeleccionProductoCliente.listado_productos_seleccionados);
                }
            };
            
            $scope.onRowClick2 = function(row) {
                    
//                $scope.listado_productos[row.entity.sourceIndex].fila_activa = true;
//                $scope.listado_productos[row.entity.sourceIndex].tipo_boton = 'success';
//                $scope.listado_productos[row.entity.sourceIndex].etiqueta_boton = 'Incluir';
                
                console.log("Row de Seleccionados: ", row);
                
                row.entity.fila_activa = true;
                row.entity.tipo_boton = 'success';
                row.entity.etiqueta_boton = 'incluir';

                $scope.rootSeleccionProductoCliente.listado_productos_seleccionados.splice(row.rowIndex,1);
                
                $scope.$emit('cargarGridPrincipal', $scope.rootSeleccionProductoCliente.listado_productos_seleccionados);
                
            };
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
 
                //Este evento no funciona para los Slides, así que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes líneas son efectivas si se usa la view sin el slide

//                $scope.listado_productos_farmacias = [];
//                $scope.listado_productos_clientes = [];
                $scope.rootSeleccionProductoCliente = {};

            });
            
            //eventos de widgets
            $scope.onTeclaBuscarSeleccionProducto = function(ev) {
                 //if(!$scope.buscarSeleccionProducto($scope.DocumentoTemporal.bodegas_doc_id)) return;

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
            
            //$scope.buscarSeleccionProducto("");

        }]);
});
