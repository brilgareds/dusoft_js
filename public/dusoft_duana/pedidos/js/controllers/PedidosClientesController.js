
define(["angular", "js/controllers", 'controllers/asignacioncontroller', 'models/Cliente', 'models/PedidoAuditoria'], function(angular, controllers) {

    var fo = controllers.controller('PedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'Empresa', 'Cliente',
        'PedidoAuditoria', 'API', "socket", "$timeout",
        "AlertService", "Usuario", "localStorageService","$state",
        function($scope, $rootScope, Request, $modal, Empresa, Cliente, PedidoAuditoria, API, socket, $timeout, AlertService, Usuario, localStorageService, $state) {
            console.log("cliente controller ======")
            $scope.Empresa = Empresa;
            Empresa.setNombre("Duana");

            $scope.pedidosSeleccionados = [];
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            var that = this;

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            console.log("watcher here 1 ==== >",$scope.$$watchers)

            that.buscarPedidosCliente = function(termino, paginando) {
                console.log("watcher here 2 ==== >",$scope.$$watchers, $scope.$$watchers)
                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            termino_busqueda: termino,
                            pagina_actual: $scope.paginaactual,
                            filtro: {}
                        }
                    }
                };

                if($scope.estadoseleccionado != ""){
                    obj.data.pedidos_clientes.filtro[$scope.estadoseleccionado] = true;
                }


                Request.realizarRequest(API.PEDIDOS.LISTAR_PEDIDOS, "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;
                    that.renderPedidosCliente(data.obj, paginando);
                    //Mostrar data en consola
                    console.log("Información de la data: ", data);
                });
            };

            that.renderPedidosCliente = function(data, paginando) {

                $scope.items = data.pedidos_clientes.length;
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items == 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.Empresa.vaciarPedidos();


                for (var i in data.pedidos_clientes) {

                    var obj = data.pedidos_clientes[i];
                    //console.log(obj);
                    var pedido = that.crearPedido(obj);

                    $scope.Empresa.agregarPedido(
                        pedido
                    );


                }

            };

            that.crearPedido = function(obj) {
                var pedido = PedidoAuditoria.get();
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

            that.reemplazarPedidoEstado = function(pedido) {
                for (var i in $scope.Empresa.getPedidos()) {
                    var _pedido = $scope.Empresa.getPedidos()[i];

                    if (pedido.numero_pedido == _pedido.numero_pedido) {
                        _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                        _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                        _pedido.estado_separacion = pedido.estado_separacion;
                        
                        break;
                    }
                }
            };


            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_clientes = {
                data: 'Empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                //enableSorting:false,
                //rowTemplate: '<div " style="height: 100%" ng-class="{red: !row.getProperty(\'isUploaded\')}" rel="{{row.entity.numero_pedido}}" ng-click="rowClicked($event, row)">' + 
                // '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell "  >' +
                // '<div ng-cell ></div>' +
                // '</div>' +
                // '</div>', /*<input-check ng-model="row.entity.selected" ng-click="onEditarLote(row)"> />*/
                columnDefs: [
                   /* {field: '', cellClass: "checkseleccion", width: "60",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)' ng-disabled='row.entity.estado_actual_pedido != 0 && row.entity.estado_actual_pedido != 1 || row.entity.estado == 3 || row.entity.estado_separacion'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},*/
                   {field: '', cellClass: "checkseleccion", width: "60",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)'"+
                                     " ng-disabled='row.entity.estado_actual_pedido != 0 && row.entity.estado_actual_pedido != 1 || row.entity.estado == 3 || "+
                                     "row.entity.estado_separacion'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},

                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass: "txt-center",
                        //cellTemplate: '<div ng-class="agregarClase(row.entity.estado_actual_pedido)" >{{row.entity.descripcion_estado_actual_pedido}}</div>'},
                        cellTemplate: "<button type='button' ng-class='agregarClase(row.entity.estado_actual_pedido)'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},
                    {field: 'numero_pedido', displayName: 'Numero Pedido'},
                    {field: 'cliente.nombre_tercero', displayName: 'Cliente'},
                    {field: 'cliente.direccion_cliente', displayName: 'Ubicacion'},
                    {field: 'cliente.telefono_cliente', displayName: 'Telefono'},
                    {field: 'nombre_vendedor', displayName: 'Vendedor'},
                    {field: 'descripcion_estado', displayName: "Estado"},
                    {field: 'fecha_registro', displayName: "Fecha Registro"}

                ]

            };

            // Agregar Clase de acuerdo al estado del pedido
            $scope.agregarClase = function(estado) {

                if(estado == 6){
                    return estados[1];
                }

                return estados[estado];
            };

            // Agregar Restriccion de acuerdo al estado de asigancion del pedido
            $scope.agregarRestriccion = function(estado_separacion) {
                
                var clase = "";
                if (estado_separacion)
                    clase = "glyphicon glyphicon-lock";

                return clase;
            };


            //fin delegado grid pedidos //

            $scope.onPedidoSeleccionado = function(check, row) {
                console.log("agregar!!!!!");
                console.log(check)
                console.log(row);

                row.selected = check;
                if (check) {
                    that.agregarPedido(row.entity);
                } else {

                    that.quitarPedido(row.entity);
                }

                console.log($scope.pedidosSeleccionados);
            };


            that.quitarPedido = function(pedido) {
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
                        $scope.pedidosSeleccionados.splice(i, true);
                        break;
                    }
                }
            };

            that.agregarPedido = function(pedido) {
                //valida que no exista el pedido en el array
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
                        return false;
                    }
                }

                $scope.pedidosSeleccionados.push(pedido);
            };

            $scope.buscarSeleccion = function(row) {
                var pedido = row.entity;
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
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
                        url: function() {
                            return API.PEDIDOS.ASIGNAR_RESPONSABLE_CLIENTE
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);

            };

            //eventos

            //delegados del sistema
            $rootScope.$on("refrescarPedidos", function() {
                console.log("refrescar pedidos listened");
                $scope.pedidosSeleccionados = [];
                // $scope.buscarPedidosCliente("");
            });

            $rootScope.$on("cerrarSesion", $scope.cerrarSesion);


            //delegados del socket io
            socket.on("onListarPedidosClientes", function(datos) {
                if (datos.status == 200) {
                    var obj = datos.obj.pedidos_clientes[0];
                    var pedido = that.crearPedido(obj);
                    console.log("objecto del socket");
                    console.log(obj)
                    that.reemplazarPedidoEstado(pedido);
                    AlertService.mostrarMensaje("success", "pedido Asignado Correctamente!");

                }
            });



            //eventos de widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                //Empresa.getPedidos()[0].numero_pedido = 0000;
                if (ev.which == 13) {
                    that.buscarPedidosCliente(termino_busqueda);
                }
            };

            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                that.buscarPedidosCliente($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                that.buscarPedidosCliente($scope.termino_busqueda, true);
            };


            $scope.seleccionEstado = function(){
                $scope.paginaactual = 1;
                that.buscarPedidosCliente($scope.termino_busqueda, true);
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               $scope.Empresa.vaciarPedidos();
               console.log("watcher here 3 ==== >",$scope.$$watchers)
               $scope.$$watchers = null;
               console.log("watcher here 4 ==== >",$scope.$$watchers)
            });



            //fin de eventos

            //se realiza el llamado a api para pedidos
            that.buscarPedidosCliente("");

        }]);
});