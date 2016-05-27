define(["angular", "js/services"], function(angular, services) {


    services.factory('AutorizacionPedidosService',
            ['$rootScope', 'Request', 'API',
                "Usuario", "$modal", "localStorageService", function($rootScope, Request, API,
                        $modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: Andres Mauricio Gonzalez T.
                     * @fecha 05/02/2016
                     * +Descripcion: lista el detall de las autorizaciones
                     */
                    self.buscarProductosBloqueados = function(obj, callback) {

                        Request.realizarRequest(
                                API.AUTORIZACIONES.LISTAR_PRODUCTOS_BLOQUEADOS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        autorizaciones: {
                                            termino_busqueda: obj.termino_busqueda,
                                            pagina_actual: obj.pagina_actual,
                                            empresa_id: obj.empresa_id,
                                            tipo_pedido: obj.tipo_pedido,
                                            detalle: obj.detalle
                                        }
                                    }
                                },
                        function(data) {
                           
                            callback(data);
                        }
                        );

                    };





//                    self.renderProductos = function(data, paginando) {
//                        var listaTerceros = [];
//                        self.items = data.listarProductosBloqueados.length;
//
////                se valida que hayan registros en una siguiente pagina
//                        if (paginando && self.items === 0) {
//                            if (self.paginaactual > 1) {
//                                self.paginaactual--;
//                            }
//                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
//                            return;
//                        }
//
//                        self.EmpresasProductos = [];
//                        self.paginas = (data.listarProductosBloqueados.length / 10);
//                        self.items = data.listarProductosBloqueados.length;
//
//                        for (var i in data.listarProductosBloqueados) {
//
//                            var objt = data.listarProductosBloqueados[i];
//
//                            var autorizacion = Autorizacion.get(objt.autorizaciones_productos_pedidos_id);
//                            autorizacion.setFechaVerificacion(objt.fecha_verificacion);
//                            autorizacion.setResponsable(objt.usuario_verifica);
//                            autorizacion.setEstado(objt.estado);
//                            autorizacion.setNombreEstado(objt.estado_verificado);
//
//                            var producto = Producto.get(objt.codigo_producto, objt.descripcion_producto, objt.numero_unidades);
//                            producto.setAutorizacion(autorizacion);
//
//                            var pedidoAutorizacion = PedidoAutorizacion.get();
//                            var datos = {};
//                            datos.numero_pedido = objt.pedido_id;
//                            datos.fecha_registro = objt.fecha_solicitud;
//                            pedidoAutorizacion.setDatos(datos);
//                            pedidoAutorizacion.setTipoPedido(objt.tipo_pedido);
//                            pedidoAutorizacion.setFechaSolicitud(objt.fecha_solicitud);
//                            pedidoAutorizacion.setPorAprobar(objt.poraprobacion);
//                            pedidoAutorizacion.setBoolPorAprobar(objt.poraprobacion);
//                            pedidoAutorizacion.setProductos(producto);
//
//                            var terceros = TerceroAutorizacion.get(objt.nombre_tercero, objt.tipo_id_tercero, objt.tercero_id);
//                            terceros.agregarPedido(pedidoAutorizacion);
//                            listaTerceros.push(terceros);
//                        }
//                        return listaTerceros;
//                    };


                    return this;
                }]);
});