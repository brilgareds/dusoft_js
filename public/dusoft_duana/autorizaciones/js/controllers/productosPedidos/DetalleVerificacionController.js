define(["angular", "js/controllers",
    'includes/slide/slideContent',
    "includes/classes/Empresa",
    "models/TerceroAutorizacion",
    "models/PedidoAutorizacion",
    "models/ProductoAutorizacion",
    "models/Autorizacion", ], function(angular, controllers) {

    controllers.controller('DetalleVerificacionController', [
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
            var filtroPedido = localStorageService.get("verificacionCabecera");

            $scope.Empresa = Empresa.get();
            $scope.pedido = "";
            $scope.fechaSolicitud = "";
            $scope.nombreTercero = "";
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            var termino = {
                tipoPedido: 0,
                pedidoId: 57169,
                empresaId: '03'
            }

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

                $scope.listarVerificacion(termino);

                $scope.empresa_seleccion = $scope.seleccion.codigo;

                $scope.pedido = filtroPedido.numeroPedido.pedidos[0].numero_pedido;
                $scope.fechaSolicitud = filtroPedido.numeroPedido.pedidos[0].fechaSolicitud;
                $scope.nombreTercero = filtroPedido.numeroPedido.nombre;

                callback();

            };

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };





            $scope.listarVerificacion = function(objs) {
                var obj = {
                    session: $scope.session,
                    data: {
                        verificacion: {
                            estado: objs.estado,
                            pedidoId: objs.pedidoId
                        }
                    }
                };

                Request.realizarRequest(
                        API.AUTORIZACIONES.LISTAR_VERIFICACION,
                        "POST",
                        obj,
                        function(data) {
                            console.log("QQQQQQQQQQQQQQQQQQ", data);
                        }
                );
            };


//            var listaTerceros = [];
//            that.renderProductos = function(data, paginando) {
//                $scope.items = data.obj.listarProductosBloqueados.length;
//
////                se valida que hayan registros en una siguiente pagina
//                if (paginando && $scope.items === 0) {
//                    if ($scope.paginaactual > 1) {
//                        $scope.paginaactual--;
//                    }
//                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
//                    return;
//                }
//
//                $scope.EmpresasProductos = [];
//                $scope.paginas = (data.obj.listarProductosBloqueados.length / 10);
//                $scope.items = data.obj.listarProductosBloqueados.length;
//
//                for (var i in data.obj.listarProductosBloqueados) {
//
//                    var objt = data.obj.listarProductosBloqueados[i];
//                    console.log("->>>>>>", objt);
//                    var autorizacion = Autorizacion.get(objt.autorizaciones_productos_pedidos_id);
//                    autorizacion.setFechaVerificacion(objt.fecha_verificacion);
//                    autorizacion.setResponsable(objt.usuario_verifica);
//                    autorizacion.setNombreVerifica(objt.nombre);
//                    autorizacion.setEstado(objt.estado);
//                    autorizacion.setNombreEstado(objt.estado_verificado);
//
//                    var producto = Producto.get(objt.codigo_producto, objt.descripcion_producto, objt.numero_unidades);
//                    producto.setAutorizacion(autorizacion);
//
//                    var pedidoAutorizacion = PedidoAutorizacion.get();
//                    var datos = {};
//                    datos.numero_pedido = objt.pedido_id;
//                    datos.fecha_registro = objt.fecha_solicitud;
//                    pedidoAutorizacion.setDatos(datos);
//                    pedidoAutorizacion.setTipoPedido(objt.tipo_pedido);
//                    pedidoAutorizacion.setFechaSolicitud(objt.fecha_solicitud);
//                    pedidoAutorizacion.setPorAprobar(objt.poraprobacion);
//                    pedidoAutorizacion.setBoolPorAprobar(objt.poraprobacion);
//                    pedidoAutorizacion.setProductos(producto);
//
//                    var terceros = TerceroAutorizacion.get(objt.nombre_tercero, objt.tipo_id_tercero, objt.tercero_id);
//                    terceros.agregarPedido(pedidoAutorizacion);
//                    listaTerceros.push(terceros);
//                }
//                $scope.listarPedido = listaTerceros;
//                console.log("TerceroAutorizacion->>>>>>", $scope.listarPedido);
//
//            };

            /**
             * +Descripcion: objeto ng-grid
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             */
            $scope.lista_detalle_verificados = {
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