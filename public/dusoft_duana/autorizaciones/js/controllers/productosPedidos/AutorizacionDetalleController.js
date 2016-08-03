
define(["angular", "js/controllers",
    'includes/slide/slideContent',
    "includes/classes/Empresa",
    "models/TerceroAutorizacion",
    "models/PedidoAutorizacion",
    "models/ProductoAutorizacion",
    "models/Autorizacion", ], function(angular, controllers) {

    controllers.controller('AutorizacionDetalleController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Pedido", "Empresa", "AutorizacionPedidosService",
        "PedidoAutorizacion", "ProductoAutorizacion",
        "TerceroAutorizacion", "Autorizacion",
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Pedido, Empresa, AutorizacionPedidosService,
                PedidoAutorizacion, Producto,
                TerceroAutorizacion, Autorizacion) {

            var that = this;
            var filtroPedido = localStorageService.get("pedidoCabecera");
            var listaTerceros = [];
            $scope.Empresa = Empresa.get();
            $scope.pedido = "";
            $scope.fechaSolicitud = "";
            $scope.nombreTercero = "";
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.paginaactual = 1;


            that.init = function(callback) {
                $scope.root = {};
                $scope.listarPedido = [];
                $scope.tipoPedido = filtroPedido.tipoPedido;
                $scope.EmpresasProductos = [];                
                $scope.termino_busqueda = "";
                $scope.ultima_busqueda = "";
                $scope.listaEmpresas = [];
                $scope.termino = "";
                $scope.empresa_seleccion = $scope.seleccion.codigo;
                $scope.termino = filtroPedido.numeroPedido.pedidos[0].numero_pedido;
                $scope.pedido = filtroPedido.numeroPedido.pedidos[0].numero_pedido;
                $scope.fechaSolicitud = filtroPedido.numeroPedido.pedidos[0].fechaSolicitud;
                $scope.nombreTercero = filtroPedido.numeroPedido.nombre;                
                callback();

            };

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /**
             * +Descripcion: funcion para cambiar estado al producto
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {}
             */
            that.denegarPedidos = function(estado, autorizacionId) {
                var objs = {
                    estado: estado,
                    autorizacionId: autorizacionId
                }
                $scope.verificarAutorizacion(objs);
            };

            /**
             * +Descripcion: evento para cambiar estado al producto
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {}
             */
            $scope.onEstdoPedido = function(estado, autorizacionId) {
                that.denegarPedidos(estado, autorizacionId);
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos las autorizaciones de productos en pedido
             */
            that.buscarProductosBloqueados = function(termino,paginando) {
                
                 if ($scope.ultima_busqueda !== $scope.termino) {
                    $scope.paginaactual = 1;
                }
                
                var obj = {
                    termino_busqueda: $scope.termino,
                    pagina_actual: $scope.paginaactual,
                    empresa_id: $scope.empresa_seleccion,
                    session: $scope.session,
                    detalle: '1',
                    tipo_pedido: $scope.tipoPedido
                };

                AutorizacionPedidosService.buscarProductosBloqueados(obj, function(data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = $scope.termino;
                        that.renderProductos(data, paginando);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion: obtener los datos enviados por el servidor
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.verificarAutorizacion = function(objs) {
                var obj = {
                        session: $scope.session,
                        data: {
                                autorizarProductos: {
                                  estado: objs.estado,
                                  autorizacionId: objs.autorizacionId
                                }
                              }
                          };

                Request.realizarRequest(
                        API.AUTORIZACIONES.VERIFICAR_AUTORIZACION_PRODUCTOS,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                if (data.obj.verificarAutorizacionProductos.length > 0) {
                                    $scope.modificarAutorizacion(objs);
                                    
                                } else {
                                    $scope.insertarAutorizacion(objs);
                                }                                
                            }
                        }
                );
            };

            /**
             * +Descripcion: modificar la autorizacion
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.modificarAutorizacion = function(objs) {
                var obj = {
                    session: $scope.session,
                    data: {
                        autorizarProductos: {
                            estado: objs.estado,
                            autorizacionId: objs.autorizacionId,
                            numeroPedido: $scope.pedido,
                            tipoPedido: $scope.tipoPedido
                        }
                    }
                };

                Request.realizarRequest(
                        API.AUTORIZACIONES.MODIFICAR_AUTORIZACION_PRODUCTOS,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                that.buscarProductosBloqueados($scope.termino, true);
                            }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        }
                );
            };

            /**
             * +Descripcion: insertar la autorizacion
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.insertarAutorizacion = function(objs) {
                var obj = {
                    session: $scope.session,
                    data: {
                        autorizarProductos: {
                            estado: objs.estado,
                            autorizacionId: objs.autorizacionId,
                            numeroPedido: $scope.pedido,
                            tipoPedido: $scope.tipoPedido
                        }
                    }
                };

                Request.realizarRequest(
                        API.AUTORIZACIONES.INSERTAR_AUTORIZACION_PRODUCTOS,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                that.buscarProductosBloqueados($scope.termino, true);
                            }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        }
                );
            };

            /**
             * +Descripcion:renderizar la consulta al modelo
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            that.renderProductos = function(data, paginando) {
                listaTerceros = [];
                $scope.items = data.obj.listarProductosBloqueados.length;

//                se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.EmpresasProductos = [];
                $scope.paginas = (data.obj.listarProductosBloqueados.length / 10);
                $scope.items = data.obj.listarProductosBloqueados.length;

                for (var i in data.obj.listarProductosBloqueados) {

                    var objt = data.obj.listarProductosBloqueados[i];
                    var autorizacion = Autorizacion.get(objt.autorizaciones_productos_pedidos_id);
                    autorizacion.setFechaVerificacion(objt.fecha_verificacion);
                    autorizacion.setResponsable(objt.usuario_verifica);
                    autorizacion.setNombreVerifica(objt.nombre);
                    autorizacion.setEstado(objt.estado);
                    autorizacion.setNombreEstado(objt.estado_verificado);

                    var producto = Producto.get(objt.codigo_producto, objt.descripcion_producto, objt.numero_unidades);
                    producto.setEstado(objt.estado_productos);
                    producto.setAutorizacion(autorizacion);

                    var pedidoAutorizacion = PedidoAutorizacion.get();
                    var datos = {};
                    datos.numero_pedido = objt.pedido_id;
                    datos.fecha_registro = objt.fecha_solicitud;
                    pedidoAutorizacion.setDatos(datos);
                    pedidoAutorizacion.setTipoPedido(objt.tipo_pedido);
                    pedidoAutorizacion.setFechaSolicitud(objt.fecha_solicitud);
                    pedidoAutorizacion.setPorAprobar(objt.poraprobacion);
                    pedidoAutorizacion.setBoolPorAprobar(objt.poraprobacion);
                    pedidoAutorizacion.setProductos(producto);

                    var terceros = TerceroAutorizacion.get(objt.nombre_tercero, objt.tipo_id_tercero, objt.tercero_id);
                    terceros.agregarPedido(pedidoAutorizacion);
                    listaTerceros.push(terceros);
                }
                $scope.listarPedido = listaTerceros;
            };

            /**
             * +Descripcion: objeto ng-grid
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             */
            $scope.lista_detalle_pedidos = {
                data: 'listarPedido',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'opciones', displayName: "Estado Actual", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==2" class="btn btn-danger btn-xs" >\
                                                    <i class="glyphicon glyphicon-remove"></i>\n\
                                                        <span> Denegado</span>\
                                                </button>\
                                                <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==1" class="btn btn-primary btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Aprobado</span>\
                                                </button>\
                                                <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==0" class="btn btn-warning btn-xs" >\
                                                    <i class="glyphicon glyphicon-warning-sign"></i>\
                                                    <span> Pendiente </span>\
                                                </button>\
                                            </div>'
                    },//obtenerPedidoPorPosiscion(0).productos[0].descripcion
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].codigo_producto', displayName: 'Codigo', width: "8%"},
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].descripcion', displayName: 'Descripción', width: "32%"},
                  
                    {field: 'Estado', displayName: 'Estado Producto', cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].estado==0" class="btn btn-danger btn-xs" >\
                                                    <i class="glyphicon glyphicon-remove"></i>\n\
                                                        <span> Inactivo</span>\
                                                </button>\
                                                <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].estado==1" class="btn btn-primary btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Activo</span>\
                                                </button>\
                                        </div>'
                    },                    
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].cantidad', displayName: 'Cantidad', width: "7%"},
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].fechaVerificacion', displayName: 'Fecha', width: "10%"},
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].nombreVerifica', displayName: 'Responsable', width: "10%"},
                    {displayName: "Estado", cellClass: "txt-center dropdown-button",width: "8%",
                        cellTemplate: '<div class="btn-group">\
                                            <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==0" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Pendiente <span class="caret"></span></button>\
                                            <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==1" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Aprobado <span class="caret"></span></button>\
                                            <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==2" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Denegado <span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==0 || row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==2" ><a href="javascript:void(0);" ng-click="onEstdoPedido(1,row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].autorizacionId)" >Aprobar</a></li>\
                                                <li ng-if="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==0 || row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==1" ><a href="javascript:void(0);" ng-click="onEstdoPedido(2,row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].autorizacionId)" >Denegar</a></li>\
                                             </ul>\
                                       </div>'
                    },
                    {displayName: "Detalle", cellClass: "txt-center dropdown-button",width: "5%",
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" disabled ng-disabled="row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado==0"  ng-click="onAbrirVentana(row.entity.obtenerPedidoPorPosiscion(0).productos[0].codigo_producto)">\n\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\
                                       </div>'
                    }
                ]

            };


            /**
             * +Descripcion: funcion para volver a la pagina principal
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {ventana}
             */
            that.volverAPedido = function() {
                var activo='';
                $state.go("AutorizacionesProductos");                
                localStorageService.add("tabActivo",{estadoTab:$scope.tipoPedido});
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
                            pedidoId: $scope.termino,
                            empresaId: $scope.empresa_seleccion,
                            codigoProducto: codigoProducto,
                            tipoPedido: $scope.tipoPedido,
                            fechaPedido: $scope.fechaSolicitud,
                            nombreTercero: $scope.nombreTercero
                        });
                $state.go("DetalleVerificacion");
            };
            
             /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {pagina}
             */
             $scope.paginaAnterior = function() {
                if($scope.paginaactual === 1) return;
                $scope.paginaactual--;
                that.buscarProductosBloqueados($scope.termino, true);
            };
            
            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {pagina}
             */
            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                that.buscarProductosBloqueados($scope.termino, true);
            };

            /**
             * +Descripcion: evento de la vista para pasar a la ventana detalle de cada aprobacion o denegacion
             * @author Andres M Gonzalez
             * @fecha: 21/05/2016
             * @params pedido : numero del pedido
             * @returns {ventana}
             */
            $scope.onAbrirVentana = function(codigoProducto) {
                that.mostrarDetalle(codigoProducto);
            };

            /**
             * +Descripcion: evento de la vista para volver a la pagina principal
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             */
            $scope.onVolver = function() {
                that.volverAPedido();
            };

            that.init(function() {
                that.buscarProductosBloqueados($scope.termino);
            });
            
        }]);
});