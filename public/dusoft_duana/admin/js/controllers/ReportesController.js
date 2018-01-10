define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ReportesController', ['$scope', 'Usuario', "Request", "localStorageService", "API", "AlertService", "$modal",
        function($scope, Usuario, Request, localStorageService, API, AlertService, $modal) {

            var that = this;
            $scope.root = {};

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
             that.init = function(callback) {  
                callback();
            };

             /**
             * +Descripcion: obtener configuracion de reportes
             * @author Andres M Gonzalez
             * @fecha: 09/06/2016
             * @returns {objeto}
             */
            that.listarReportes = function() {                
                var obj = {
                    session: $scope.root.session,
                    data: {
                        configuracion: {
                            reporte: "DR"
                        }
                    }
                };
                Request.realizarRequest(
                        API.ADMIN.OBTENER_CONFIGURACION_REPORTE,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                              
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        }
                );
            };
            
            that.render=function(data){
                reporte_admin = [];
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
                    var pedidoAutorizacion = PedidoAutorizacion.get();
                    var datos = {};
                    datos.numero_pedido = objt.pedido_id;
                    datos.fecha_registro = objt.fecha_solicitud;
                    pedidoAutorizacion.setDatos(datos);
                    pedidoAutorizacion.setTipoPedido(objt.tipo_pedido);
                    pedidoAutorizacion.setFechaSolicitud(objt.fecha_solicitud);
                    pedidoAutorizacion.setPorAprobar(objt.poraprobacion);
                    pedidoAutorizacion.setBoolPorAprobar(objt.poraprobacion);
                    //  pedidoAutorizacion.setProductos(producto);

                    var terceros = TerceroAutorizacion.get(objt.nombre_tercero, objt.tipo_id_tercero, objt.tercero_id);
                    terceros.agregarPedido(pedidoAutorizacion);
                    reporte_admin.push(terceros);
                }
                $scope.reporte_admin = listaTerceros;
            };
            
              that.init(function() {
                that.listarReportes();
            });    
            

        }]);
});
