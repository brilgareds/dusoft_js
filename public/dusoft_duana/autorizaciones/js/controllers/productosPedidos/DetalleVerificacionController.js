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
            var filtroPedido = localStorageService.get("verificacionDetalle");
            var listaAutorizacion = [];

            $scope.pedido = "";
            $scope.fechaSolicitud = "";
            $scope.nombreTercero = "";
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();

            var termino = {
                tipoPedido: filtroPedido.tipoPedido,
                pedidoId: filtroPedido.pedidoId,
                empresaId: filtroPedido.empresaId,
                codigoProducto: filtroPedido.codigoProducto
            }

            that.init = function(callback) {
                $scope.root = {};
                $scope.listarVerificacion(termino);
                $scope.pedido = filtroPedido.pedidoId;
                $scope.empresaId = filtroPedido.empresaId;
                $scope.codigoProducto = filtroPedido.codigoProducto;
                $scope.fechaSolicitud = filtroPedido.fechaPedido;
                $scope.tipoPedido = filtroPedido.tipoPedido;
                $scope.nombreTercero = filtroPedido.nombreTercero;
                callback();

            };

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /**
             * +Descripcion: obtener los datos enviados por el servidor
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.listarVerificacion = function(objs) {
                var obj = {
                    session: $scope.session,
                    data: {
                        verificacion: {
                            tipoPedido: objs.tipoPedido,
                            pedidoId: objs.pedidoId,
                            empresaId: objs.empresaId,
                            codigoProducto: objs.codigoProducto
                        }
                    }
                };
                Request.realizarRequest(
                        API.AUTORIZACIONES.LISTAR_VERIFICACION_PRODUCTOS,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                that.renderProductos(data, 1);
                            } else {
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
                $scope.items = data.obj.listarVerificacionProductos.length;

//                se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }
//
                $scope.EmpresasProductos = [];
                $scope.paginas = (data.obj.listarVerificacionProductos.length / 10);
                $scope.items = data.obj.listarVerificacionProductos.length;
//
                for (var i in data.obj.listarVerificacionProductos) {
//
                    var objt = data.obj.listarVerificacionProductos[i];
                    var autorizacion = Autorizacion.get(objt.autorizaciones_productos_pedidos_id);
                    autorizacion.setFechaVerificacion(objt.fecha_verificacion);
                    autorizacion.setResponsable(objt.usuario_verifica);
                    autorizacion.setNombreVerifica(objt.nombre);
                    autorizacion.setEstado(objt.estado);
                    autorizacion.setNombreEstado(objt.estado_verificado);
                    var producto = Producto.get(objt.codigo_producto, objt.descripcion_producto, objt.numero_unidades);
                    producto.setAutorizacion(autorizacion);

                    listaAutorizacion.push(producto);
                }
                $scope.listarPedido = listaAutorizacion;
//
            };

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
                    {field: 'opciones', displayName: "Estado Actual", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.autorizacion[0].estado==2" class="btn btn-danger btn-xs" >\
                                                    <i class="glyphicon glyphicon-remove"></i>\n\
                                                        <span> Denegado</span>\
                                                </button>\
                                                <button ng-if="row.entity.autorizacion[0].estado==1" class="btn btn-primary btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Aprobado</span>\
                                                </button>\
                                            </div>'
                    },
                    {field: 'getDescripcion()', displayName: 'Producto', width: "40%"},
                    {field: 'getCantidad()', displayName: 'Cantidad', width: "10%"},
                    {field: 'autorizacion[0].fechaVerificacion', displayName: 'Fecha', width: "10%"},
                    {field: 'autorizacion[0].nombreVerifica', displayName: 'Responsable', width: "30%"}
                ]

            };


            /**
             * +Descripcion: funcion para volver a la pagina principal
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {ventana}
             */
            that.volverAPedido = function() {
                $state.go("AutorizacionesDetalle");
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

        }]);
});