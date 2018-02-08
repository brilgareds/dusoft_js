define(["angular", "js/services"], function (angular, services) {


    services.factory('AutorizacionPedidosService',
            ['$rootScope', 'Request', 'API',
                "Usuario", "$modal", "localStorageService", function ($rootScope, Request, API,
                        $modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: Cristian Ardila
                     * @fecha 05/02/2016
                     * +Descripcion: consulta todas las empresas de acuerdo al texto
                     *               ingresado
                     */
                    self.listarEmpresas = function (session, termino_busqueda_empresa, callback) {
                        var obj = {
                            session: session,
                            data: {
                                listar_empresas: {
                                    pagina: 1,
                                    empresaName: termino_busqueda_empresa
                                }
                            }
                        };
                        Request.realizarRequest(API.DEVOLUCIONESFARMACIA.LISTAR_EMPRESAS, "POST", obj, function (data) {

                            callback(data);
                        });
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