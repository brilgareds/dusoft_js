
define(["angular",
    "js/controllers",
    'controllers/asignarpedidos/asignacioncontroller',
    'models/asignacionpedidos/ClientePedido',
    'models/auditoriapedidos/PedidoAuditoria'], function(angular, controllers) {

    var fo = controllers.controller('PedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'EmpresaPedido', 'ClientePedido',
        'PedidoAuditoria', 'API', "socket", "$timeout",
        "AlertService", "Usuario", "localStorageService", "$state", "$filter",
        function($scope, $rootScope, Request, $modal, Empresa, Cliente, PedidoAuditoria, API, socket, $timeout, AlertService, Usuario, localStorageService,
        $state, $filter) {
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
            $scope.permisosEstadoAsignacion=Usuario.getUsuarioActual().getModuloActual().opciones.sw_permiso_cambiar_estado_asignacion;
            var fecha_actual = new Date();
      
            $scope.rootSeleccionPedido = {
                fecha_inicial_pedidos: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fecha_final_pedidos: $filter('date')(fecha_actual, "yyyy-MM-dd")
            };
            $scope.rootSeleccionPedido.filtros = [
                {nombre: "Numero", tipo_busqueda: 0},
                {nombre: "Cliente", tipo_busqueda: 1},
                {nombre: "Vendedor", tipo_busqueda: 2}
            ];
            $scope.rootSeleccionPedido.filtro = $scope.rootSeleccionPedido.filtros[0];
            
             $scope.onSeleccionFiltroPedido = function(filtro) {
                $scope.rootSeleccionPedido.filtro = filtro;
            }; 
           
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
                            bodega : Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().codigo,
                            filtro: {},
                            filtros: $scope.rootSeleccionPedido.filtro,
                            fecha_inicial: $filter('date')($scope.rootSeleccionPedido.fecha_inicial_pedidos, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.rootSeleccionPedido.fecha_final_pedidos, "yyyy-MM-dd") + " 23:59:00"
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
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: '', cellClass: "checkseleccion", width: "3%",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)'" +
                                " ng-disabled='habilitar_asignacion_pedidos(row.entity) || row.entity.estado ==4'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},
                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass: "txt-center",
                        cellTemplate: '<button type="button" ng-class="agregarClase(row.entity.estado_actual_pedido)"> \
			                 <span ng-if="row.entity.getEstado()==2" class="glyphicon glyphicon-remove-circle">\
			                    Anulado \
			                  </span>\
					  <span ng-if="row.entity.getEstado()!=2" ng-class="agregarRestriccion(row.entity.estado_separacion)">\
						{{row.entity.descripcion_estado_actual_pedido}} \
					  </span> \
					  </button>', width: "8%"},
                    {field: 'numero_pedido', displayName: 'Pedido', width: "80"},
                    {field: 'numero_pedido_multiple', displayName: 'Pedido Multiple', width: "12%"},
                    {field: 'descripcionTipoPedido', displayName: 'Tipo Productos', width: "110"},
                    {field: 'cliente.nombre_tercero', displayName: 'Cliente'},
                    {field: 'observacion', displayName: 'Observacion', width: "25%"},
                    {field: 'nombreSeparador', displayName:"Separador"},
                    {field: 'descripcion_estado', displayName: "Estado", width: "8%"},
                    {field: 'fecha_registro', displayName: "Fecha Registro", width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width:100,
                        cellTemplate: '<div class="btn-group">\
                                            <button ng-disabled="habilitar_opciones(row.entity)" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{opcionesModulo.btnCambiarEstadoPedidos}}" ng-click="modificar_estado_pedido_cliente(row.entity);"  >Cambiar Estado</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{opcionesModulo.btnCambiarEstadoPedidos}}" ng-click="desasignar_estado_pedido_cliente(row.entity);"  >Desasignar</a></li>\
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

                if (pedido.estado_actual_pedido === '5' && pedido.cliente.id !== '830023202' && pedido.cliente.id !== '830080649') {
                    disabled = false;
                }

                if (pedido.estado_actual_pedido === '8' && pedido.cliente.id !== '830023202' && pedido.cliente.id !== '830080649') {
                    disabled = false;
                }

                if (pedido.estado_actual_pedido === '9' && pedido.cliente.id !== '830023202' && pedido.cliente.id !== '830080649') {
                    disabled = false;
                }
                
                if (pedido.estado_actual_pedido === '10') {
                    disabled = true;
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
             
                if(!$scope.permisosEstadoAsignacion){
                    disabled = true;
                }

                return disabled;
            };

            // Agregar Clase de acuerdo al estado del pedido
            $scope.agregarClase = function(estado) {
                if (estado === '6' || estado === '10') {
                    
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
            
                row.selected = check;
                if (check) {
                    that.agregarPedido(row.entity);
                } else {

                    that.quitarPedido(row.entity);
                }

               
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
            };

            $scope.buscarSeleccion = function(row) {
                var pedido = row.entity;
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido === pedido.numero_pedido) {
                  
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
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

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
                                    $scope.close();
                                }
                            });
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.desasignar_estado_pedido_cliente = function(row) {

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
                                    <h4>Desea DESASIGNAR el pedido #' + $scope.pedido_seleccionado.get_numero_pedido() + '?? </h4> \
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="quitar_estado_pedido()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.quitar_estado_pedido = function() {

                            var obj = {
                                session: $scope.session,
                                data: {
                                    pedidos_clientes: {
                                        numero_pedido: $scope.pedido_seleccionado.get_numero_pedido()
                                    }
                                }
                            };

                            Request.realizarRequest(API.PEDIDOS.DESASIGNAR_PEDIDO_CLIENTE, "POST", obj, function(data) {

                                AlertService.mostrarMensaje("warning", data.msj);

                                if (data.status === 200) {

                                    $scope.pedido_seleccionado = null;
                                    $scope.close();
                                }
                            });
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.abrirModalAsignar = function() {

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
                $scope.pedidosSeleccionados = [];
                // $scope.buscarPedidosCliente("");
            });

            $rootScope.$on("cerrarSesion", $scope.cerrarSesion);


            //delegados del socket io
            socket.on("onListarPedidosClientes", function(datos) {
                
                if (datos.status === 200) {
                    var obj = datos.obj.pedidos_clientes[0];
                    var pedido = that.crearPedido(obj);
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
            
            $scope.buscarPedidosCliente=function(termino_busqueda){
               that.buscarPedidosCliente(termino_busqueda); 
            };

            $scope.seleccionEstado = function() {
                $scope.paginaactual = 1;
                that.buscarPedidosCliente($scope.termino_busqueda, true);
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.Empresa.vaciarPedidos();
                $scope.$$watchers = null;
            });
            
            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.rootSeleccionPedido.datepicker_fecha_inicial = true;
                $scope.rootSeleccionPedido.datepicker_fecha_final = false;

            };

            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.rootSeleccionPedido.datepicker_fecha_inicial = false;
                $scope.rootSeleccionPedido.datepicker_fecha_final = true;

            };

      

            //fin de eventos

            //se realiza el llamado a api para pedidos
            that.buscarPedidosCliente("");

        }]);
});