
define(["angular", "js/controllers", 'controllers/asignacioncontroller', 'models/Farmacia', 'models/PedidoAuditoria'], function(angular, controllers) {

    controllers.controller('PedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'Empresa', 'Farmacia',
        'PedidoAuditoria', 'API', 'socket',
        'AlertService', "Usuario",
        function($scope, $rootScope, Request, $modal, Empresa, Farmacia, PedidoAuditoria, API, socket, AlertService, Usuario) {

            $scope.Empresa = Empresa;
            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            $scope.pedidosSeleccionados = [];
            $scope.empresas = [];
            $scope.seleccion = "FD";
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;


            $scope.buscarPedidosFarmacias = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda.termino_busqueda != $scope.termino_busqueda
                        || $scope.ultima_busqueda.seleccion != $scope.seleccion) {
                    $scope.paginaactual = 1;
                }

                console.log($scope.ultima_busqueda);
                console.log($scope.termino_busqueda + " " + $scope.seleccion)

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: termino,
                            empresa_id: $scope.seleccion,
                            pagina_actual: $scope.paginaactual,
                            filtro:{}
                        }
                    }
                };

                if($scope.estadoseleccionado != ""){
                    obj.data.pedidos_farmacias.filtro[$scope.estadoseleccionado] = true;
                }

                Request.realizarRequest(API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS, "POST", obj, function(data) {
                    if (data.status == 200) {
                        $scope.ultima_busqueda = {
                            termino_busqueda: $scope.termino_busqueda,
                            seleccion: $scope.seleccion
                        }
                        $scope.renderPedidosFarmacias(data.obj, paginando);
                    }

                });
            };

            $scope.listarEmpresas = function() {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    if (data.status == 200) {
                        $scope.empresas = data.obj.empresas;
                        //console.log(JSON.stringify($scope.empresas))
                    }
                });
            };


            $scope.lista_pedidos_farmacias = {
                data: 'Empresa.getPedidosFarmacia()',
                enableColumnResize: true,
                enableColumnResize: true,
                        enableRowSelection: false,
                columnDefs: [
                    {field: '', cellClass: "checkseleccion", width: "60",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)' ng-disabled='row.entity.estado_actual_pedido != 0 && row.entity.estado_actual_pedido != 1 || row.entity.estado_separacion'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},
                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass: "txt-center",
                        //cellTemplate: '<div  ng-class="agregarClase(row.entity.estado_actual_pedido)">{{row.entity.descripcion_estado_actual_pedido}}</div>'},
                        cellTemplate: "<button type='button' ng-class='agregarClase(row.entity.estado_actual_pedido)'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},                        
                    {field: 'numero_pedido', displayName: 'Numero Pedido'},
                    {field: 'farmacia.nombre_farmacia', displayName: 'Zona'},
                    {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia'},
                    {field: 'farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'fecha_registro', displayName: "Fecha Registro"}
                ]

            };


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
                    $scope.agregarPedido(row.entity);
                } else {

                    $scope.quitarPedido(row.entity);
                }

                console.log($scope.pedidosSeleccionados);
            },
            

            $scope.quitarPedido = function(pedido) {
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
                        $scope.pedidosSeleccionados.splice(i, true);
                    }
                }
            };

            $scope.agregarPedido = function(pedido) {
                //valida que no exista el pedido en el array
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
                        return false;
                    }
                }

                $scope.pedidosSeleccionados.push(pedido);
            },
            

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


            $scope.renderPedidosFarmacias = function(data, paginando) {
                // console.log(data);
                $scope.items = data.pedidos_farmacias.length;
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items == 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.Empresa.vaciarPedidosFarmacia();

                for (var i in data.pedidos_farmacias) {

                    var obj = data.pedidos_farmacias[i];
                    var pedido = $scope.crearPedido(obj);

                    $scope.Empresa.agregarPedidoFarmacia(pedido);
                }
            };


            $scope.crearPedido = function(obj) {
                var pedido = PedidoAuditoria.get();
                pedido.setDatos(obj);

                var cliente = Farmacia.get(obj.farmacia_id, obj.bodega_id, obj.nombre_farmacia, obj.nombre_bodega);

                pedido.setFarmacia(cliente);

                return pedido;
            };

            $scope.reemplazarPedidoEstado = function(pedido) {
                for (var i in $scope.Empresa.getPedidosFarmacia()) {
                    var _pedido = $scope.Empresa.getPedidosFarmacia()[i];

                    if (pedido.numero_pedido == _pedido.numero_pedido) {

                        console.log(pedido.numero_pedido);
                        _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                        _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                        _pedido.estado_separacion = pedido.estado_separacion;                        
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
                        url: function() {
                            return API.PEDIDOS.ASIGNAR_RESPONSABLE_FARMACIA
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


            //delegados del socket io
            socket.on("onListarPedidosFarmacias", function(datos) {
                //console.log(datos);
                if (datos.status == 200) {
                    var obj = datos.obj.pedidos_farmacias[0];
                    var pedido = $scope.crearPedido(obj);
                    console.log("objecto del socket");
                    console.log(pedido)
                    $scope.reemplazarPedidoEstado(pedido);
                    AlertService.mostrarMensaje("success", "pedido Asignado Correctamente!");
                }
            });

            //evento widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscarPedidosFarmacias(termino_busqueda);
                }
            };

            $scope.valorSeleccionado = function(valor) {

                $scope.buscarPedidosFarmacias("");
            };


            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                $scope.buscarPedidosFarmacias($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarPedidosFarmacias($scope.termino_busqueda, true);
            };


            $scope.seleccionEstado = function(){
                $scope.paginaactual = 1;
                $scope.buscarPedidosFarmacias($scope.termino_busqueda, true);
            };


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               $scope.Empresa.vaciarPedidosFarmacia();
            });


            $scope.buscarPedidosFarmacias("");
            $scope.listarEmpresas();


        }]);
});