define(["angular", "js/controllers", 'models/Separador'], function(angular, controllers) {

    controllers.controller('asignacioncontroller', [
        '$scope', '$rootScope', 'API', 
        '$modalInstance', "pedidosSeleccionados", "url",
        "Request", "Separador", "EmpresaPedido",
        "Usuario",

        function($scope, $rootScope, API, $modalInstance, pedidosSeleccionados, url, Request, Separador, Empresa,Usuario) {

            $scope.Empresa = Empresa;
            $scope.noAsignar = true;
            $scope.titulo = "Asignar Responsable";
            $scope.pedidosSeleccionados = pedidosSeleccionados;
            $scope.idAsignado;
            $scope.dialog = false;
            $scope.msg   = "";
            $scope.operario_id = false;
            var that = this;

            $scope.session = {
               usuario_id:Usuario.usuario_id,
               auth_token:Usuario.token
            };
            
            $modalInstance.result.then(function() {
                //on ok button press 
            }, function() {
                //on cancel button press
                console.log("Modal Closed");
            });


            $scope.valorSeleccionado = function(valor) {
                console.log('=== valorSeleccionado ===');
                console.log(valor);
                $scope.noAsignar = false;
                $scope.idAsignado = valor;
            };

            $scope.close = function() {
                $modalInstance.close();
            };


            $scope.realizarAsignacion = function() {

                //console.log($scope.pedidosSeleccionados);
                var pedidos = [];

                //recolectar array de pedidos seleccionados para enviar solo los ids
                for (var i  in $scope.pedidosSeleccionados) {
                    var pedido = $scope.pedidosSeleccionados[i];

                    pedidos.push(pedido.numero_pedido);
                }
                
                if(pedidos.length === 0){
                    $scope.dialog = true;
                    $scope.msg = "No hay pedidos seleccionados";
                    return;
                }

                var obj = {
                    session:$scope.session,
                    data:{
                        asignacion_pedidos:{
                            pedidos: pedidos,
                            estado_pedido: "1",
                            responsable: $scope.idAsignado
                        }
                    }
                };

                Request.realizarRequest(
                    url,
                    "POST",
                    obj,
                    function(data) {
                        if(data.status == 200){
                            $modalInstance.close();
                            $rootScope.$emit("refrescarPedidos");
                        }                  
                    }
                );
            };
            
            $scope.validarEstado = function(pedidosSeleccionados){

                
                 for (var i  in pedidosSeleccionados) {
                    var pedido = pedidosSeleccionados[i];
                    if((pedido.estado_actual_pedido !== '0' && pedido.estado_actual_pedido !== '1') || pedido.estado === '3' || pedido.estado_separacion){
                        console.log("pedido sacado ", pedido)
                        pedidosSeleccionados.splice(i, 1);
                        $scope.validarEstado(pedidosSeleccionados);
                        break;
                    }
                }
                
                return pedidosSeleccionados;
            };


            var obj = {
                session:$scope.session,
                data:{
                    lista_operarios:{
                        estado_registro:"1"
                    }
                }
            };


            Request.realizarRequest(API.TERCEROS.LISTAR_OPERARIOS, "POST", obj, function(data) {
                if(data.obj.lista_operarios){
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