
define(["angular", "js/controllers", 'models/Usuario', 'controllers/asignacioncontroller', 'models/Farmacia', 'models/Pedido'], function(angular, controllers) {

    controllers.controller('PedidosFarmaciasController', ['$scope','$rootScope', '$http', '$modal', 'Empresa', 'Usuario', 'Farmacia', 'Pedido', 'API',
        'socket','AlertService',
        function($scope, $rootScope, $http, $modal, Empresa, Usuario, Farmacia, Pedido, API, socket, AlertService) {


            $scope.Empresa = Empresa;
            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            $scope.pedidosSeleccionados = [];
            $scope.empresas = [];
            $scope.seleccion = "FD";

            $scope.realizarRequest = function(url, params, callback) {
                $http({method: 'GET', url: url, params: params}).
                    success(function(data, status, headers, config) {
                    callback(data);
                }).
                 error(function(data, status, headers, config) {
                    console.log("request error");
                    console.log(status);
                });
            };


            $scope.buscarPedidosFarmacias = function(termino) {
                // console.log($scope.seleccion);
                $scope.realizarRequest(API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS, {termino_busqueda:termino, empresa_id:$scope.seleccion}, function(data) {
                    if(data.status == 200){
                        $scope.renderPedidosFarmacias(data.obj);
                    }
                    
                });
            };

            $scope.listarEmpresas = function(){
                 $scope.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, {usuario_id:1350}, function(data) {
                    
                    if(data.status == 200){
                        $scope.empresas = data.obj.empresas;
                        //console.log(JSON.stringify($scope.empresas))
                    }
                });
            };


            $scope.lista_pedidos_farmacias = {
                data: 'Empresa.getPedidosFarmacia()',
                enableColumnResize: true,
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [
                    {field: '', cellClass:"checkseleccion", width:"60",
                    cellTemplate:"<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)' ng-disabled='row.entity.estado_actual_pedido != 0 && row.entity.estado_actual_pedido != 1'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},
                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass:"estadoPedido",
                    cellTemplate: '<div  ng-class="agregarClase(row.entity.estado_actual_pedido)">{{row.entity.descripcion_estado_actual_pedido}}</div>'},
                    {field: 'numero_pedido', displayName: 'Numero Pedido'},
                    {field: '', displayName: 'Zona'},
                    {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia'},
                    {field: 'farmacia.nombre_bodega', displayName: 'Bodega'},
                   
                    {field: 'fecha_registro', displayName: "Fecha Registro"}
                ]

            };


            $scope.agregarClase = function(estado){
                return estados[estado];
            };


            //fin delegado grid pedidos //

            $scope.onPedidoSeleccionado = function(check, row){
                console.log("agregar!!!!!");
                console.log(check)
                console.log(row);

                row.selected = check;
                if(check){
                    $scope.agregarPedido(row.entity);
                } else {
                   
                    $scope.quitarPedido(row.entity);
                }
                
                console.log($scope.pedidosSeleccionados);
            },  

            $scope.quitarPedido = function(pedido){
                for(var i in $scope.pedidosSeleccionados){
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if(_pedido.numero_pedido == pedido.numero_pedido){
                        $scope.pedidosSeleccionados.splice(i,true);
                    }
                }
            };  

            $scope.agregarPedido = function(pedido){
                //valida que no exista el pedido en el array
                for(var i in $scope.pedidosSeleccionados){
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if(_pedido.numero_pedido == pedido.numero_pedido){
                        return false;
                    }
                }

                $scope.pedidosSeleccionados.push(pedido);
            },

            $scope.buscarSeleccion = function(row){
                var pedido = row.entity;
                for(var i in $scope.pedidosSeleccionados){
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if(_pedido.numero_pedido == pedido.numero_pedido){
                        //console.log("buscarSeleccion encontrado **************");
                        //console.log(pedido);
                        row.selected = true;
                        return true;
                    }
                }
                row.selected = false;
                return false;
            };


            $scope.renderPedidosFarmacias = function(data) {
               // console.log(data);

                $scope.Empresa.vaciarPedidosFarmacia();

                for (var i in data.pedidos_farmacias) {

                    var obj = data.pedidos_farmacias[i];
                    var pedido = $scope.crearPedido(obj);

                    $scope.Empresa.agregarPedidoFarmacia(pedido);
                }
            };


            $scope.crearPedido = function(obj){
                var pedido = Pedido.get();
                pedido.setDatos(obj);

                var cliente = Farmacia.get(obj.farmacia_id, obj.bodega_id, obj.nombre_farmacia, obj.nombre_bodega);

                pedido.setFarmacia(cliente);

                return pedido;
            };

            $scope.reemplazarPedidoEstado = function(pedido){
                for(var i in $scope.Empresa.getPedidosFarmacia()){
                    var _pedido = $scope.Empresa.getPedidosFarmacia()[i];

                    if(pedido.numero_pedido == _pedido.numero_pedido){
                        
                        console.log(pedido.numero_pedido);
                        _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                        _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                        break;
                    }
                }
            };


            $scope.abrirModalAsignar = function() {


                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/modal-asignacion.html',
                    controller: "asignacioncontroller",
                    resolve: {
                        pedidosSeleccionados: function() {
                            return $scope.pedidosSeleccionados;
                        },
                        url:function(){
                            return API.PEDIDOS.ASIGNAR_RESPONSABLE_FARMACIA
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);


            };


             //eventos

            //delegados del sistema
            $rootScope.$on("refrescarPedidos",function(){
                console.log("refrescar pedidos listened");
                $scope.pedidosSeleccionados = [];
               // $scope.buscarPedidosCliente("");
            });


            //delegados del socket io
            socket.on("onListarPedidosFarmacias", function(datos){
                //console.log(datos);
                if(datos.status == 200){
                    var obj    = datos.obj.pedidos_farmacias[0];
                    var pedido = $scope.crearPedido(obj);
                    console.log("objecto del socket");
                    console.log(pedido)
                    $scope.reemplazarPedidoEstado(pedido);
                    AlertService.mostrarMensaje("success","pedido Asignado Correctamente!");
                }
            });

            //evento widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscarPedidosFarmacias(termino_busqueda);
                }
            };

            $scope.valorSeleccionado = function(valor){
               
                $scope.buscarPedidosFarmacias("");
            };



            $scope.buscarPedidosFarmacias("");
            $scope.listarEmpresas();


        }]);
});