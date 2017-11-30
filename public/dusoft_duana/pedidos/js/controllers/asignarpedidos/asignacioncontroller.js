define(["angular", "js/controllers", 'models/asignacionpedidos/Separador'], function(angular, controllers) {

    controllers.controller('asignacioncontroller', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', "pedidosSeleccionados", "url",
        "Request", "Separador", "EmpresaPedido",
        "Usuario", "AlertService",
        function($scope, $rootScope, API, $modalInstance, pedidosSeleccionados, url, Request, Separador, Empresa, Usuario, AlertService) {

            $scope.Empresa = Empresa;
            $scope.noAsignar = true;
            $scope.titulo = "Asignar Responsable";
            $scope.pedidosSeleccionados = pedidosSeleccionados;
            $scope.dialog = false;
            $scope.msg = "";
            $scope.operario;
            var that = this;
            
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $modalInstance.result.then(function() {
                //on ok button press 
            }, function() {
                //on cancel button press
               
            });


            $scope.valorSeleccionado = function() {
  
                $scope.noAsignar = false;
            };

            $scope.close = function() {
                $modalInstance.close();
            };


            $scope.realizarAsignacion = function() {

      
                var pedidos = [];

                //recolectar array de pedidos seleccionados para enviar solo los ids
                for (var i  in $scope.pedidosSeleccionados) {
                    var pedido = $scope.pedidosSeleccionados[i];

                    pedidos.push(pedido.numero_pedido);
                }

                if (pedidos.length === 0) {
                    $scope.dialog = true;
                    $scope.msg = "No hay pedidos seleccionados";
                    return;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        asignacion_pedidos: {
                            pedidos: pedidos,
                            estado_pedido: "1",
                            responsable: $scope.operario.operario_id
                        }
                    }
                };

                Request.realizarRequest(
                        url,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                $modalInstance.close();
                                $rootScope.$emit("refrescarPedidos");
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        }
                );
            };

            $scope.validarEstado = function(pedidosSeleccionados) {


                for (var i  in pedidosSeleccionados) {
                    var pedido = pedidosSeleccionados[i];
                    if ((pedido.estado_actual_pedido !== '0' && pedido.estado_actual_pedido !== '1' && 
                         pedido.estado_actual_pedido !== '5' && pedido.estado_actual_pedido !== '8' )||
                         pedido.estado === '2' || pedido.estado_separacion) {
                        pedidosSeleccionados.splice(i, 1);
                        $scope.validarEstado(pedidosSeleccionados);
                        break;
                    }
                }

                return pedidosSeleccionados;
            };


            var obj = {
                session: $scope.session,
                data: {
                    lista_operarios: {
                        estado_registro: "1"
                    }
                }
            };


            Request.realizarRequest(API.TERCEROS.LISTAR_OPERARIOS, "POST", obj, function(data) {
                if (data.obj.lista_operarios) {
                    var listado = data.obj.lista_operarios;
                    Empresa.vaciarSeparadores();
                    var data = data.obj;

                    for (var i in listado) {

                        var obj = listado[i];

                        var separador = Separador.get(
                                obj.nombre_operario,
                                obj.operario_id,
                                obj.total_pedidos_asignados
                        );

                        $scope.Empresa.agregarSeparador(
                                separador
                        );
                    }
                } else {
                    $scope.dialog = true;
                    $scope.msg = "No hay responsables disponibles";
                }


            });

            $scope.validarEstado($scope.pedidosSeleccionados);



        }]);
});