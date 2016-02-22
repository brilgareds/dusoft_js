
define(["angular",
    "js/controllers",
    'controllers/asignarpedidos/asignacioncontroller',
    'models/asignacionpedidos/ClientePedido',
    'models/auditoriapedidos/PedidoAuditoria'], function(angular, controllers) {

    var fo = controllers.controller('PedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'EmpresaPedido', 'ClientePedido',
        'PedidoAuditoria', 'API', "socket", "$timeout",
        "AlertService", "Usuario", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, Empresa, Cliente, PedidoAuditoria, API, socket, $timeout, AlertService, Usuario, localStorageService, $state) {
            $scope.Empresa = Empresa;
            Empresa.setNombre("Duana");

            $scope.pedidosSeleccionados = [];
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            var that = this;

            //var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs"];

            that.buscarPedidosCliente = function(termino, paginando) {
                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            termino_busqueda: termino,
                            pagina_actual: $scope.paginaactual,
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                            filtro: {}
                        }
                    }
                };

                if ($scope.estadoseleccionado !== undefined) {
                    obj.data.pedidos_clientes.filtro[$scope.estadoseleccionado.estado] = true;
                }


                Request.realizarRequest(API.PEDIDOS.LISTAR_PEDIDOS, "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;
                    if (data.status === 200) {

                        that.renderPedidosCliente(data.obj, paginando);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            that.renderPedidosCliente = function(data, paginando) {

                $scope.items = data.pedidos_clientes.length;
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
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

                    if (pedido.numero_pedido === _pedido.numero_pedido) {
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
                columnDefs: [
                    {field: '', cellClass: "checkseleccion", width: "3%",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)'" +
                                " ng-disabled='habilitar_asignacion_pedidos(row.entity) || row.entity.estado ==4'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},
                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass: "txt-center",
                        cellTemplate: "<button type='button' ng-class='agregarClase(row.entity.estado_actual_pedido)'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>", width: "10%"},
                    {field: 'numero_pedido', displayName: 'Pedido', width: "5%"},
                    {field: 'cliente.nombre_tercero', displayName: 'Cliente', width: "30%"},
                    {field: 'nombre_vendedor', displayName: 'Vendedor', width: "25%"},
                    {field: 'descripcion_estado', displayName: "Estado", width: "10%"},
                    {field: 'fecha_registro', displayName: "Fecha Registro", width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button ng-disabled="habilitar_opciones(row.entity)" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{opcionesModulo.btnCambiarEstadoPedidos}}" ng-click="modificar_estado_pedido_cliente(row.entity);"  >Cambiar Estado</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]

            };

            $scope.habilitar_asignacion_pedidos = function(pedido) {

                var disabled = true;

                if (pedido.estado_actual_pedido === '0') {
                    disabled = false;
                }

                if (pedido.estado_actual_pedido === '1') {
                    disabled = false;
                }

                if (pedido.estado_actual_pedido === '5') {
                    disabled = false;
                }

                if (pedido.estado_actual_pedido === '8') {
                    disabled = false;
                }

                if (pedido.estado_separacion) {
                    disabled = true;
                }

                if (pedido.estado === '0' || pedido.estado === '2') {
                    disabled = true;
                }

                return disabled;
            };

            $scope.habilitar_opciones = function(pedido) {

                var disabled = true;

                if (pedido.estado_actual_pedido === '1') {
                    disabled = false;
                }

                if (pedido.estado_separacion) {
                    disabled = true;
                }

                if (pedido.estado === '2') {
                    disabled = true;
                }

                return disabled;
            };

            // Agregar Clase de acuerdo al estado del pedido
            $scope.agregarClase = function(estado) {

                if (estado === 6) {
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
                /* console.log("agregar!!!!!");
                 console.log(check);
                 console.log(row);*/

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
                    if (_pedido.numero_pedido === pedido.numero_pedido) {
                        $scope.pedidosSeleccionados.splice(i, true);
                        break;
                    }
                }
            };

            that.agregarPedido = function(pedido) {
                //valida que no exista el pedido en el array
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido === pedido.numero_pedido) {
                        return false;
                    }
                }

                $scope.pedidosSeleccionados.push(pedido);
                console.log("guardando pedido ", $scope.pedidosSeleccionados);
            };

            $scope.buscarSeleccion = function(row) {
                var pedido = row.entity;
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido === pedido.numero_pedido) {
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

            $scope.modificar_estado_pedido_cliente = function(row) {

                $scope.pedido_seleccionado = row;

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea Cambiar el estado del pedido #' + $scope.pedido_seleccionado.get_numero_pedido() + '?? </h4> \
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="cambiar_estado_pedido()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.cambiar_estado_pedido = function() {

                            var obj = {
                                session: $scope.session,
                                data: {
                                    pedidos_clientes: {
                                        numero_pedido: $scope.pedido_seleccionado.get_numero_pedido()
                                    }
                                }
                            };

                            Request.realizarRequest(API.PEDIDOS.ELIMINAR_RESPONSABLE_CLIENTE, "POST", obj, function(data) {

                                AlertService.mostrarMensaje("warning", data.msj);

                                if (data.status === 200) {

                                    $scope.pedido_seleccionado = null;
                                    $modalInstance.close();
                                }
                            });
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.abrirModalAsignar = function() {
                console.log($scope.pedidosSeleccionados, " pedidos seleccionados ", $scope.pedidosSeleccionados.length);

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/asignarpedidos/modal-asignacion.html',
                    controller: "asignacioncontroller",
                    resolve: {
                        pedidosSeleccionados: function() {
                            return $scope.pedidosSeleccionados;
                        },
                        url: function() {
                            return API.PEDIDOS.ASIGNAR_RESPONSABLE_CLIENTE;
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
                
                console.log("socket >>>>>>>>>>>>>>>>>> onListarPedidosClientes ");
                if (datos.status === 200) {
                    var obj = datos.obj.pedidos_clientes[0];
                    var pedido = that.crearPedido(obj);
                    console.log("objecto del socket");
                    console.log(obj);
                    that.reemplazarPedidoEstado(pedido);
                    AlertService.mostrarMensaje("success", "pedido Asignado Correctamente!");

                }
            });



            //eventos de widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                //Empresa.getPedidos()[0].numero_pedido = 0000;
                if (ev.which === 13) {
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


            $scope.seleccionEstado = function() {
                $scope.paginaactual = 1;
                that.buscarPedidosCliente($scope.termino_busqueda, true);
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.Empresa.vaciarPedidos();
                $scope.$$watchers = null;
            });



            //fin de eventos

            //se realiza el llamado a api para pedidos
            that.buscarPedidosCliente("");

        }]);
});