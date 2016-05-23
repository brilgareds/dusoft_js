
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
            $scope.hola = "";
            $scope.Empresa = Empresa.get();
            $scope.pedido = "";
            $scope.fechaSolicitud = "";
            $scope.nombreTercero = "";
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();


            that.init = function(callback) {
                $scope.root = {};
                $scope.listarPedido = [];
                $scope.tipoPedido = '0';
                $scope.EmpresasProductos = [];
                $scope.paginas = 0;
                $scope.items = 0;
                $scope.paginaactual = 1;
                $scope.termino_busqueda = "";
                $scope.ultima_busqueda = "";
                $scope.listaEmpresas = [];
                $scope.termino = "";
                $scope.empresa_seleccion = $scope.seleccion.codigo;

                $scope.pedido = filtroPedido.numeroPedido.pedidos[0].numero_pedido;
                $scope.fechaSolicitud = filtroPedido.numeroPedido.pedidos[0].fechaSolicitud;
                $scope.nombreTercero = filtroPedido.numeroPedido.nombre;
                $scope.buscarProductosBloqueados();
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
                    autorizacionId: autorizacionId,
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


            that.traerPedidos = function() {
                for (var i = 1; i < 11; i++) {
                    var datos = {};
                    datos.numero_pedido = i;
                    var pedido = Pedido.get();
                    pedido.setDatos(datos);
                    $scope.Empresa.agregarPedido(pedido);
                }
            };


            /**
             * @author Andres M. Gonzalez
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos las autorizaciones de productos en pedido
             */
            $scope.buscarProductosBloqueados = function() {

                var obj = {
                    termino_busqueda: $scope.pedido,
                    pagina_actual: $scope.paginaactual,
                    empresa_id: $scope.empresa_seleccion,
                    session: $scope.session,
                    detalle: '1',
                    tipo_pedido: $scope.tipoPedido
                };

                AutorizacionPedidosService.buscarProductosBloqueados(obj, function(data) {
                    if (data.status === 200) {
                        that.renderProductos(data, 1);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };


            $scope.verificarAutorizacion = function(objs) {
                console.log("verificarAutorizacionverificarAutorizacionverificarAutorizacionverificarAutorizacion");
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
                                console.log("GGGGGGGGGGGGGGGGGGGG", data.obj.verificarAutorizacionProductos.length);
                                if (data.obj.verificarAutorizacionProductos.length > 0) {
                                    $scope.modificarAutorizacion(objs);
                                } else {
                                    $scope.insertarAutorizacion(objs);
                                }
                            }
                        }
                );
            };

            $scope.modificarAutorizacion = function(objs) {
                console.log("");
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
                        API.AUTORIZACIONES.MODIFICAR_AUTORIZACION_PRODUCTOS,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                console.log("modificarAAAAAAAAAAAA");
                                return;//refrescar
                            }
                        }
                );
            };

            $scope.insertarAutorizacion = function(objs) {
                console.log("insertarAutorizacion");
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
                        API.AUTORIZACIONES.INSERTAR_AUTORIZACION_PRODUCTOS,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                console.log("insertarAutorizacionAAAAAAAAAAAA");
                                return;//refrescar
                            }
                        }
                );
            };



            var listaTerceros = [];
            that.renderProductos = function(data, paginando) {
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
                    console.log("->>>>>>", objt);
                    var autorizacion = Autorizacion.get(objt.autorizaciones_productos_pedidos_id);
                    autorizacion.setFechaVerificacion(objt.fecha_verificacion);
                    autorizacion.setResponsable(objt.usuario_verifica);
                    autorizacion.setNombreVerifica(objt.nombre);
                    autorizacion.setEstado(objt.estado);
                    autorizacion.setNombreEstado(objt.estado_verificado);

                    var producto = Producto.get(objt.codigo_producto, objt.descripcion_producto, objt.numero_unidades);
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
                console.log("TerceroAutorizacion->>>>>>", $scope.listarPedido);

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
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].estado_verificado', displayName: 'Estado', width: "10%"},
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].descripcion', displayName: 'Producto', width: "40%"},
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].cantidad', displayName: 'Cantidad', width: "10%"},
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].fechaVerificacion', displayName: 'Fecha', width: "10%"},
                    {field: 'obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].nombreVerifica', displayName: 'Responsable', width: "20%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Pendiente<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="onEstdoPedido(1,row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].autorizacionId)" >Aprobar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="onEstdoPedido(2,row.entity.obtenerPedidoPorPosiscion(0).productos[0].autorizacion[0].autorizacionId)" >Denegar</a></li>\
                                             </ul>\
                                       </div>'
                    },
                    {displayName: "Detalle", cellClass: "txt-center dropdown-button",
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" disabled ng-disabled="row.entity.separado"  ng-click="onAbrirVentana(row.entity)">\n\
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
                $state.go("AutorizacionesProductos");
            };

            /**
             * +Descripcion: metodo para navegar a la ventana detalle de cada aprobacion o denegacion
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params pedido : numero del pedido
             * @returns {ventana}
             */
            that.mostrarDetalle = function(pedido) {
                localStorageService.add("verificacionCabecera",
                        {
                            pedidoId: pedido,
                            empresaId: $scope.empresa_seleccion
                        });
                $state.go("DetalleVerificacion");
            };

            /**
             * +Descripcion: evento de la vista para pasar a la ventana detalle de cada aprobacion o denegacion
             * @author Andres M Gonzalez
             * @fecha: 21/05/2016
             * @params pedido : numero del pedido
             * @returns {ventana}
             */
            $scope.onAbrirVentana = function(pedido) {
                that.mostrarDetalle(pedido);
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
            });
            //  that.buscarProductosBloqueados(filtroPedido, 1);

        }]);
});