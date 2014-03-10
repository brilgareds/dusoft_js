define(["angular", "js/controllers", 'models/Separador'], function(angular, controllers) {

    controllers.controller('asignacioncontroller', ['$scope', '$rootScope', 'API', '$modalInstance', "pedidosSeleccionados", "url", "$http", "Separador", "Empresa",
        function($scope, $rootScope, API, $modalInstance, pedidosSeleccionados, url, $http, Separador, Empresa) {

            $scope.Empresa = Empresa;
            $scope.noAsignar = true;
            $scope.titulo = "Asignar Responsable";
            $scope.pedidosSeleccionados = pedidosSeleccionados;
            $scope.idAsignado;
            $scope.dialog = false;
            $scope.msg   = "";
            $scope.operario_id = false;

            $modalInstance.result.then(function() {
                //on ok button press 
            }, function() {
                //on cancel button press
                console.log("Modal Closed");
            });




            $scope.realizarRequest = function(url, method, params, callback) {

               // console.log(params)

                var requestObj = {
                    method:method,
                    url:url
                }

                if(method == "GET"){
                    requestObj.params = params;
                } else {
                    requestObj.data = params;
                    requestObj.headers =  {'Content-Type': 'application/json'};
                }


                $http(requestObj).
                    success(function(data, status, headers, config) {
                    callback(data);
                }).
                error(function(data, status, headers, config) {
                    $scope.dialog = true;
                    $scope.msg   = "Se a generado un error";
                    callback(data);
                }); 

            };


            $scope.valorSeleccionado = function(valor) {
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



                $scope.realizarRequest(
                    url,
                    "POST",
                    {
                        pedidos: pedidos,
                        estado_pedido: "1",
                        responsable: $scope.idAsignado,
                        usuario: 1350
                    },
                    function(data) {
                        //console.log(data)
                        if(data.status == 200){
                            $modalInstance.close();
                            $rootScope.$emit("refrescarPedidos");
                        }                  
                    }
                );
            };


            $scope.realizarRequest(API.TERCEROS.LISTAR_OPERARIOS, "GET", {estado_registro:"1"}, function(data) {

                Empresa.vaciarSeparadores();
                var data = data.obj;

                for (var i in data.lista_operarios) {

                    var obj = data.lista_operarios[i];

                    var separador = Separador.get(
                        obj.nombre_operario,
                        obj.operario_id
                    );

                    $scope.Empresa.agregarSeparador(
                        separador
                    );
                }

            });



        }]);
});