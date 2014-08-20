
define(["angular", "js/controllers", 'controllers/asignacioncontroller','models/Cliente', 'models/Pedido'], function(angular, controllers) {

    var fo = controllers.controller('PedidosClientesController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'Empresa','Cliente',
         'Pedido', 'API',"socket", "$timeout", 
         "AlertService","Usuario", "localStorageService",

        function($scope, $rootScope, Request, $modal, Empresa, Cliente, Pedido, API, socket, $timeout, AlertService,Usuario,localStorageService) {

            $scope.Empresa = Empresa;
            $scope.pedidosSeleccionados = [];
            $scope.session = {
               usuario_id:Usuario.usuario_id,
               auth_token:Usuario.token
            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda  = "";
            $scope.paginaactual = 0;

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            


            $scope.buscarPedidosCliente = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if($scope.ultima_busqueda != $scope.termino_busqueda){
                    $scope.paginaactual = 0;
                }

                var obj = {
                    session:$scope.session,
                    data:{
                        pedidos_clientes:{
                            termino_busqueda:termino,
                            pagina_actual:$scope.paginaactual
                        }
                    }
                };

               

                Request.realizarRequest(API.PEDIDOS.LISTAR_PEDIDOS, "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;
                    $scope.renderPedidosCliente(data.obj, paginando);
                    //Mostrar data en consola
                    console.log("Información de la data: ",data);
                });
            };

            $scope.renderPedidosCliente = function(data, paginando) {

                $scope.items = data.pedidos_clientes.length;
                //se valida que hayan registros en una siguiente pagina
                if(paginando && $scope.items == 0){
                    if($scope.paginaactual > 0){
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning","No se encontraron mas registros");
                    return;
                }

                $scope.Empresa.vaciarPedidos();
               

                for (var i in data.pedidos_clientes) {

                    var obj = data.pedidos_clientes[i];
                    //console.log(obj);
                    var pedido = $scope.crearPedido(obj);

                    $scope.Empresa.agregarPedido(
                        pedido
                    );


                }

            };

            $scope.crearPedido = function(obj){
                var pedido = Pedido.get();
                pedido.setDatos(obj);

                var cliente = Cliente.get(
                    obj.nombre_cliente,
                    obj.direccion_cliente,
                    obj.tipo_id_cliente,
                    obj.identificacion_cliente,
                    obj.telefono_cliente
                );

                pedido.setCliente(cliente);

                return pedido;
            };

            $scope.reemplazarPedidoEstado = function(pedido){
                for(var i in $scope.Empresa.getPedidos()){
                    var _pedido = $scope.Empresa.getPedidos()[i];

                    if(pedido.numero_pedido == _pedido.numero_pedido){
                        _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                        _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                        break;
                    }
                }
            };


            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_clientes = {
                data: 'Empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection:false,
                //enableSorting:false,
                /*rowTemplate: '<div " style="height: 100%" ng-class="{red: !row.getProperty(\'isUploaded\')}" rel="{{row.entity.numero_pedido}}" ng-click="rowClicked($event, row)">' + 
                    '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell "  >' +
                      '<div ng-cell ></div>' +
                    '</div>' +
                 '</div>',*/
                columnDefs: [
                    {field: '', cellClass:"checkseleccion", width:"60", 
                    cellTemplate:"<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)' ng-disabled='row.entity.estado_actual_pedido != 0 && row.entity.estado_actual_pedido != 1 || row.entity.estado == 3'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},
                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass:"txt-center",
                    cellTemplate: '<div ng-class="agregarClase(row.entity.estado_actual_pedido)" >{{row.entity.descripcion_estado_actual_pedido}}</div>'},
                    {field: 'numero_pedido', displayName: 'Numero Pedido'},
                    {field: 'cliente.nombre_cliente', displayName: 'Cliente'},
                    {field: 'cliente.direccion_cliente', displayName: 'Ubicacion'},
                    {field: 'cliente.telefono_cliente', displayName: 'Telefono'},
                    {field: 'nombre_vendedor', displayName: 'Vendedor'},
                    {field: 'descripcion_estado', displayName: "Estado"},
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
            }; 


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
            };

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

            //fin delegado grid

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
                            return API.PEDIDOS.ASIGNAR_RESPONSABLE_CLIENTE
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

            $rootScope.$on("cerrarSesion",$scope.cerrarSesion);


            //delegados del socket io
            socket.on("onListarPedidosClientes", function(datos){
                if(datos.status == 200){
                    var obj    = datos.obj.pedidos_clientes[0];
                    var pedido = $scope.crearPedido(obj);
                    console.log("objecto del socket");
                    console.log(pedido)
                    $scope.reemplazarPedidoEstado(pedido);
                     AlertService.mostrarMensaje("success","pedido Asignado Correctamente!");

                }
            });

            

            //eventos de widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                //Empresa.getPedidos()[0].numero_pedido = 0000;
                if (ev.which == 13) {
                    $scope.buscarPedidosCliente(termino_busqueda);
                }
            };

            $scope.paginaAnterior = function(){
                $scope.paginaactual--;
                $scope.buscarPedidosCliente($scope.termino_busqueda,true);
            };

            $scope.paginaSiguiente = function(){
                $scope.paginaactual++;
                $scope.buscarPedidosCliente($scope.termino_busqueda,true);
            };



            //fin de eventos

            //se realiza el llamado a api para pedidos
           $scope.buscarPedidosCliente("");

        }]);
});