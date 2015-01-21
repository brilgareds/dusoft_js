//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', 'Usuario', 'ProductoPedido', '$modal', 'FarmaciaVenta',
        function($scope, $rootScope, Request, EmpresaPedido, Cliente, PedidoVenta, API, socket, AlertService, $state, Usuario, ProductoPedido, $modal, FarmaciaVenta) {

            $scope.expreg = new RegExp("^[0-9]*$");

            var that = this;

           // $scope.$on('cargarGridSeleccionadoSlide', function(event/*, mass*/) {
                //Recibimos la GRID del PADRE: -> mass
                //$scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = mass;

                //console.log("EL CONTENIDO RECIBIDO ES: ", mass);

                /*if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados) {

                    console.log("Listado desde MASS: ", $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados);

                    $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.forEach(function(valor) {
                        console.log("Código Producto: ", valor.codigo_producto);
                        console.log("Cantidad Solicitada: ", valor.cantidad_solicitada);
                    });
                }*/

           // });

            $scope.cerrar = function() {
                $scope.$emit('cerrarseleccionproducto', {animado: true});

                $scope.rootSeleccionProductoFarmacia = {};
            };

            $rootScope.$on("mostrarseleccionproducto", function(e, tipo_cliente, datos_de, datos_para, observacion, pedido) {

//                console.log("Pedido desde CrearPedidoFarmacia: ", pedido);

                $scope.rootSeleccionProductoFarmacia = {};
                
                //Arreglo para convenciones de tipo_producto
                /*$scope.rootSeleccionProductoFarmacia.convenciones_tipo_producto = [
                                {val:1,txt:'Normales', label:'label label-success'},
                                {val:2,txt:'Alto Costo', label:'label label-danger'},
                                {val:3,txt:'Controlados', label:'label label-warning'},
                                {val:4,txt:'Insumos', label:'label label-default'},
                                {val:5,txt:'Nevera', label:'label label-info'}
                            ];*/
                
                //Variable Tipo Producto
                $scope.rootSeleccionProductoFarmacia.tipoProducto = '0';

                $scope.rootSeleccionProductoFarmacia.Empresa = EmpresaPedido;

                $scope.rootSeleccionProductoFarmacia.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };

                $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;

                $scope.rootSeleccionProductoFarmacia.tipo_cliente = tipo_cliente;

                $scope.rootSeleccionProductoFarmacia.items = 0;
                $scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.paginaactual = 1;

                $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {};
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda = "";

                $scope.rootSeleccionProductoFarmacia.de_empresa_id = datos_de.empresa_id;
                $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id = datos_de.centro_utilidad_id;
                $scope.rootSeleccionProductoFarmacia.de_bodega_id = datos_de.bodega_id;

                $scope.rootSeleccionProductoFarmacia.para_empresa_id = datos_para.empresa_id;
                $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id = datos_para.centro_utilidad_id;
                $scope.rootSeleccionProductoFarmacia.para_bodega_id = datos_para.bodega_id;

                /* Inicio - Consulta Tipo Producto */

                var obj_tipo_producto = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        tipo_producto: {}
                    }
                }

                var url_tipo_producto = API.PEDIDOS.LISTADO_TIPO_PRODUCTOS;

                Request.realizarRequest(url_tipo_producto, "POST", obj_tipo_producto, function(data) {

                    if (data.status === 200) {
                        $scope.rootSeleccionProductoFarmacia.lista_tipo_productos = data.obj.lista_tipo_productos;
                    }
                    else {
                        console.log("Error al consultar Tipo Productos", data.msj);
                    }
                });

                /* Fin - Consulta Tipo Producto */

                $scope.rootSeleccionProductoFarmacia.listado_productos = [];
                //$scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = [];//Eliminar
                //$scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos

                $scope.rootSeleccionProductoFarmacia.observacion_encabezado = observacion;
                $scope.rootSeleccionProductoFarmacia.pedido = pedido;
                
                that.actualizarEncabezadoPedidoTemporal();

                $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), "");
            });

            $scope.obtenerParametros = function() {

                //valida si cambio el termino de busqueda
                if ($scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda !== $scope.rootSeleccionProductoFarmacia.termino_busqueda) {
                    $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                }

                var obj = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        productos: {
                            termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda,
                            pagina_actual: $scope.rootSeleccionProductoFarmacia.paginaactual,
                            empresa_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
                            empresa_destino_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                            centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                            bodega_destino_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                            tipo_producto: $scope.rootSeleccionProductoFarmacia.tipoProducto,
                            filtro: {}
                        }
                    }
                };

                return obj;
            };

            $scope.onBuscarSeleccionProducto = function(obj, paginando) {

                var url = API.PEDIDOS.LISTAR_PRODUCTOS_FARMACIAS;

//                console.log("Antes de listar Productos ... ");

                Request.realizarRequest(url, "POST", obj, function(data) {

//                    console.log("Después de obtener Data ... ");
//
//                    console.log("Datos Listado Productos: ", data);

                    if (data.status === 200) {

                        $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {
                            termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda
                        };

                        that.renderProductosFarmacia(data.obj, paginando);
                    }

                });

                that.renderGrid();
            };

            that.renderProductosFarmacia = function(data, paginando) {

                $scope.rootSeleccionProductoFarmacia.items = data.lista_productos.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.rootSeleccionProductoFarmacia.items === 0) {
                    if ($scope.rootSeleccionProductoFarmacia.paginaactual > 1) {
                        $scope.rootSeleccionProductoFarmacia.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron más registros");
                    return;
                }

                $scope.rootSeleccionProductoFarmacia.listado_productos = data.lista_productos;

            };

            /* Por el momento se dascarta ésta función */
            that.crearProducto = function(obj) {

                var producto = {
                    codigo_producto: obj.codigo_producto,
                    descripcion: obj.nombre_producto,
                    molecula: obj.descripcion_molecula,
                    existencia_farmacia: obj.existencias_farmacia,
                    existencia_bodega: obj.existencia,
                    total_existencias_farmacias: obj.total_existencias_farmacias,
                    existencia_disponible: obj.disponibilidad_bodega,
                    cantidad_solicitada: 0,
                    fila_activa: true,
                    tipo_boton: 'success',
                    etiqueta_boton: 'Incluir'
                };

                return producto;
            };

            /*  Construcción de Grid    */

            that.renderGrid = function() {

                $scope.lista_productos = {
                    data: 'rootSeleccionProductoFarmacia.listado_productos',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: false,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código', width: "10%",
                            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                                <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                            </div>'
                        },
                        {field: 'nombre_producto', displayName: 'Descripción', width: "37%"},
                        //{field: 'descripcion_molecula', displayName: 'Molécula'},
                        {field: 'existencias_farmacia', displayName: 'Exist. Farmacia', width: "8%"},
                        {field: 'total_existencias_farmacias', displayName: 'Total Exist. Farmacia', width: "11%"},
                        {field: 'existencia', displayName: 'Exist. Bodega', width: "8%"},
                        {field: 'disponibilidad_bodega', displayName: 'Disponible'/*, width: "6%"*/},
                        {field: 'cantidad_solicitada', displayName: 'Solicitado', enableCellEdit: false, width: "10%",
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
                    //data: 'rootSeleccionProductoFarmacia.listado_productos_seleccionados',
                    data: 'rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código', width: "9%",
                            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                    <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                                    <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                                    <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                                    <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                                    <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                                    <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                                </div>'
                        },
                        {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                        {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                        {field: 'cantidad_pendiente', displayName: 'Pendiente'},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-default btn-xs" ng-click="onEliminarSeleccionado(row)">\n\
                                                    <span class="glyphicon glyphicon-remove"> Eliminar</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]
                };
            };

            //Inserta producto presionando Botón
            $scope.onIncluirProducto = function(row) {
                that.insertarProducto(row);
            };

            //Inserta producto presionando ENTER
            $scope.onTeclaIngresaProducto = function(ev, row) {
//                console.log("Key Evento: ", ev.which);
                if (ev.which === 13) {
                    if (parseInt(row.entity.cantidad_solicitada) > 0) {
                        that.insertarProducto(row);
                    }
                }
            };

            //Función que actualizar la observación si ya existe un encabezado
            that.actualizarEncabezadoPedidoTemporal = function() {
                
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

                /* Inicio - Validar Existencia de encabezado */

                var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {
                        
                        console.log(data.msj);

                        if (data.obj.numero_registros[0].count > 0) {
                            
                            //Actualizar
                            var url_actualizar_encabezado = API.PEDIDOS.ACTUALIZAR_ENCABEZADO_TEMPORAL_PEDIDO_FARMACIA;
                            
                            Request.realizarRequest(url_actualizar_encabezado, "POST", obj_encabezado, function(data_update) {
                                
                                if(data_update.status === 200) {
                                    
                                    console.log(data_update.msj);
                                    
                                }
                                else {
                                    console.log(data_update.msj);
                                }
                            });
                        }
                        else {
                            console.log(">>>>> Encabezado Vacío");
                        }
                    }
                    else {
                        console.log(data.msj);
                    }
                });
                
                /* Fin - Validar Existencia de encabezado */
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
                                        console.log(data.msj);
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

            $scope.onEliminarSeleccionado = function(row) {

                $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
                
                $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().eliminarProducto(row.rowIndex);
                //$scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.splice(row.rowIndex, 1);
                
                //$scope.rootSeleccionProductoFarmacia.pedido.eliminarProducto(row.rowIndex);

                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos;
                //
                $scope.$emit('cargarGridPrincipal', 1);

                /* Inicio - Objeto para Eliminar Registro del Detalle */
                var obj_detalle = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                            codigo_producto: row.entity.codigo_producto,
                        }
                    }
                };
                /* Fin - Objeto para Eliminar Registro del Detalle */

                /* Inicio - Borrado de registro en Detalle Pedido */

                var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_REGISTRO_DETALLE_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                    if (data.status == 200) {
                        console.log("Eliminación de detalle Exitosa: ", data.msj);

                        /* Para desarrollar aquí: Si la grid está vacia, eliminar el encabezado */
                        
                        //console.log("Longitud de Productos Seleccionados en Grid: ", $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_producto.length);
                        //console.log("Longitud Grid Seleccionados", $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length);

                        //if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length === 0)
                        if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
                        {
                            var obj_encabezado = {
                                session: $scope.rootSeleccionProductoFarmacia.session,
                                data: {
                                    pedidos_farmacias: {
                                        empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                                        centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                                        bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                                    }
                                }
                            };
                            var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                            Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                                if (data.status == 200) {
                                    console.log("Eliminación de encabezado Exitosa: ", data.msj);
                                }
                                else
                                {
                                    console.log("Eliminación de encabezado Fallida: ", data.msj);
                                }
                            });

                        }
                    }
                    else
                    {
                        console.log("Eliminación Detalle Fallida: ", data.msj);
                    }
                });

            };

            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                //Este evento no funciona para los Slides, asi que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes lineas son efectivas si se usa la view sin el slide

                $scope.rootSeleccionProductoFarmacia = {};

            });

            //eventos de widgets
            $scope.onTeclaBuscarSeleccionProducto = function(ev) {

                if (ev.which == 13) {
//                    console.log("Término Búsqueda: ", $scope.rootSeleccionProductoFarmacia.termino_busqueda);
                    $scope.onBuscarSeleccionProducto($scope.obtenerParametros());
                }
            };

            $scope.paginaAnterior = function() {
                $scope.rootSeleccionProductoFarmacia.paginaactual--;
                $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                $scope.rootSeleccionProductoFarmacia.paginaactual++;
                $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), true);
            };
            
           /* $scope.onTipoProducto = function($event, valor) {
                $scope.rootSeleccionProductoFarmacia.tipoProducto = valor;
            };*/

        }]);
});
