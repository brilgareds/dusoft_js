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

            /*$scope.onBuscarSeleccionProducto = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootSeleccionProductoCliente.ultima_busqueda != $scope.rootSeleccionProductoCliente.termino_busqueda) {
                    $scope.rootSeleccionProductoCliente.paginaactual = 1;
                }
                
                console.log("ListadoProductos Vacio",$scope.rootSeleccionProductoCliente.listado_productos);
                
                for(var i=0; i<10; i++)
                {
                    //var pedido = Pedido.get();
                    //if($scope.rootSeleccionProductoCliente.tipo_cliente === 1) {
                    
                    var obj = {
                            codigo_producto: '123456'+i,
                            descripcion: 'TRIPARTYCINA X '+i,
                            cum: '102030'+i,
                            codigo_invima: 'INV-321098'+i,
                            iva: 16,
                            precio_regulado: '50'+i,
                            precio_venta: '60'+i,
                            existencia_bodega: '20'+i,
                            cantidad_disponible: '10'+i,
                            cantidad_solicitada: 0,
                            fila_activa: true,
                            tipo_boton: 'success',
                            etiqueta_boton: 'Incluir'
                    };

                    $scope.rootSeleccionProductoCliente.listado_productos.push(obj);

                    //}

                }
                
                $scope.renderGrid();
            };*/

            /*$scope.Disable = function(item) { 
			return item.fila_activa;
		};*/

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

                $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;

                $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.forEach(function(valor) {
                    if (valor.codigo_producto === row.entity.codigo_producto) {
                        $scope.rootSeleccionProductoFarmacia.no_incluir_producto = true;
                        return;
                    }
                });

                if ($scope.rootSeleccionProductoFarmacia.no_incluir_producto === false)
                {
                    that.insertarEncabezadoPedidoTemporal(function(insert_encabezado_exitoso) {
 
                        if(insert_encabezado_exitoso) {
                            that.insertarDetallePedidoTemporal(row);
                        } 
                    });
                }
            };
            
            //Función que inserta el encabezado del pedido temporal
            that.insertarEncabezadoPedidoTemporal = function(callback) {
                
                var obj_encabezado = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                            empresa_destino_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
                            centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
                            bodega_destino_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
                            observacion: $scope.rootSeleccionProductoFarmacia.observacion_encabezado
                        }
                    }
                };
                /* Fin - Objeto para inserción de Encabezado*/

                /* Inicio - Validar Existencia de encabezado */

                var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {
//                        console.log("ENCABEZADO: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
                        if (data.obj.numero_registros[0].count > 0) {

                            console.log("Ya existe éste registro en el encabezado");
                            if(callback !== undefined && callback !== "" && callback !== 0){
                                callback(true);
                            }
                        }
                        else {
                            /* Inicio - Inserción del Encabezado */

                            var url_encabezado = API.PEDIDOS.CREAR_PEDIDO_TEMPORAL;

                            Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

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
                        }
                    }
                    else {
                        console.log(data.msj);
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(false);
                        }
                    }
                });
            };
            
            
            that.insertarDetallePedidoTemporal = function(row) {
                //Cálculo de cantidad pendiente
                var cantidad_pendiente = row.entity.cantidad_solicitada - row.entity.disponibilidad_bodega;

                /* Inicio - Objeto para Inserción Detalle */
                var obj_detalle = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            numero_pedido: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim() + $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim() + row.entity.codigo_producto.trim(),
                            empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                            codigo_producto: row.entity.codigo_producto,
                            cantidad_solic: parseInt(row.entity.cantidad_solicitada),
                            tipo_producto_id: row.entity.tipo_producto_id,
                            cantidad_pendiente: (cantidad_pendiente < 0) ? '0' : cantidad_pendiente
                        }
                    }
                };
                /* Fin - Objeto para Inserción Detalle */

                /* Inicio - Validar existencia de producto en Detalle Pedido */

                var url_registros_detalle = API.PEDIDOS.EXISTE_REGISTRO_DETALLE_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
//                        console.log("DETALLE: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
                        if (data.obj.numero_registros[0].count > 0) {

                            console.log("Ya existe éste producto en el detalle");
                        }
                        else {

//                            console.log("Ingresando el detalle");

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

                            $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);

                            var longitud_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length;

                            var test_index = 0;

                            if (longitud_seleccionados > 1) {
                                test_index = 1;
                            }
                            else {
                                test_index = 0;
                            }

                            /*Inicio: Evitar Inserción por tipo Producto */
                            if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id !== row.entity.tipo_producto_id) {

                                var descripcion_tipo_anterior = "";
                                var descripcion_tipo_actual = "";

                                $scope.rootSeleccionProductoFarmacia.lista_tipo_productos.forEach(function(tipo_producto) {

                                    if (tipo_producto.tipo_producto_id === $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id) {
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

                                $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                            } /*Fin: Evitar Inserción por tipo Producto */
                            else { /*Inicio - Continuar con Inserción en Detalle*/

                                //if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length === 25) {
                                if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 25) {

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

                                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos;
                                $scope.$emit('cargarGridPrincipal', 1);

                                /* Inicio - Inserción del Detalle */

                                var url_detalle = API.PEDIDOS.CREAR_DETALLE_PEDIDO_TEMPORAL;

                                Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                                    if (data.status === 200) {
                                        console.log("Registro Insertado Exitosamente en Detalle: ", data.msj);
                                    }
                                    else {
                                        console.log("No se pudo Incluir éste produto: ",data.msj);
                                        
                                        $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                                        var obj_bloqueo = {
                                            session: $scope.rootSeleccionProductoFarmacia.session,
                                            data: {
                                                usuario_bloqueo: {
                                                    farmacia_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim(),
                                                    centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim(),
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
                            } /* Fin - Continuar con Inserción en Detalle*/
                        }
                    }
                    else {
                        console.log(data.msj);
                    }
                });
                /* Fin - Validar existencia de producto en Detalle Pedido */                
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
