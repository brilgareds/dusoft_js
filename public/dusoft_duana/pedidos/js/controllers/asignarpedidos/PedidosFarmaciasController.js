
define(["angular",
    "js/controllers",
    'controllers/asignarpedidos/asignacioncontroller',
    'models/asignacionpedidos/Farmacia',
    'models/auditoriapedidos/PedidoAuditoria'], function(angular, controllers) {

    controllers.controller('PedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'EmpresaPedido', 'Farmacia',
        'PedidoAuditoria', 'API', 'socket',
        'AlertService', "Usuario", "$filter",
        function($scope, $rootScope, Request, $modal, Empresa, Farmacia, PedidoAuditoria, API, socket, AlertService, Usuario, $filter) {

            $scope.Empresa = Empresa;
            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs"];
            $scope.pedidosSeleccionados = [];
            $scope.empresas = [];
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.permisosEstadoAsignacion=Usuario.getUsuarioActual().getModuloActual().opciones.sw_permiso_cambiar_estado_asignacion;
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            
            var fecha_actual = new Date();
            $scope.fecha_inicial_pedidos = $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd");
            $scope.fecha_final_pedidos = $filter('date')(fecha_actual, "yyyy-MM-dd");
            
            $scope.filtros = [
                {nombre: "Número", tipo_busqueda:0},
                {nombre: "Zona", tipo_busqueda: 1},
                {nombre: "Bodega", tipo_busqueda: 2}
            ];
            
            $scope.filtroBusqueda = $scope.filtros[0];
            
            $scope.onSeleccionFiltroPedido = function(filtro) {
                $scope.filtroBusqueda = filtro;
            }; 


            $scope.buscarPedidosFarmacias = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda.termino_busqueda !== $scope.termino_busqueda
                        || $scope.ultima_busqueda.seleccion !== $scope.seleccion) {
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: termino,
                            empresa_id: $scope.seleccion.getCodigo(),
                            pagina_actual: $scope.paginaactual,
                            filtro: {
                                fecha_inicial: $filter('date')($scope.fecha_inicial_pedidos, "yyyy-MM-dd") + " 00:00:00",
                                fecha_final: $filter('date')($scope.fecha_final_pedidos, "yyyy-MM-dd") + " 23:59:00",
                                busqueda:$scope.filtroBusqueda
                            }
                        }
                    }
                };

                if ($scope.estadoseleccionado !== undefined) {
                    obj.data.pedidos_farmacias.filtro[$scope.estadoseleccionado.estado] = true;
                }

                Request.realizarRequest(API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = {
                            termino_busqueda: $scope.termino_busqueda,
                            seleccion: $scope.seleccion
                        };
                        $scope.renderPedidosFarmacias(data.obj, paginando);
                    }

                });
            };

            $scope.listarEmpresas = function() {

                $scope.empresas = Usuario.getUsuarioActual().getEmpresasFarmacias();
            };


            $scope.lista_pedidos_farmacias = {
                data: 'Empresa.getPedidosFarmacia()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: '', cellClass: "checkseleccion", width: "3%",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccion(row)' ng-disabled='habilitar_asignacion_pedidos(row.entity)'  ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"},
                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass: "txt-center",
                        cellTemplate: "<button  ng-class='agregarClase(row.entity.estado_actual_pedido)'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>", width: "10%"},
                    {field: 'numero_pedido', displayName: 'Pedido', width: "80"},
                    {field: 'nombreSeparador', displayName:"Separador"},
                    {field: 'descripcionTipoPedido', displayName: 'Tipo Productos', width: "110"},
                    {field: 'farmacia.zona', displayName: 'Zona', width: "14%"},
                    {field: 'observacion', displayName: 'Observación'},
                    {field: 'farmacia.nombre_bodega', displayName: 'Bodega', width: "10%"},
                    {field: 'fecha_registro', displayName: "Fecha Registro", width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width:100,
                        cellTemplate: '<div class="btn-group">\
                                            <button ng-disabled="habilitar_opciones(row.entity)" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{opcionesModulo.btnCambiarEstadoPedidos}}" ng-click="modificar_estado_pedido_farmacia(row.entity);" >Cambiar Estado</a></li>\
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
                
                if (pedido.estado_actual_pedido === '10') {
                    disabled = true;
                }
                
                if (pedido.estado_separacion) {
                    disabled = true;
                }

                if (pedido.estado === '2') {
                    disabled = true;
                }

                return disabled;
            };

            $scope.habilitar_opciones = function(pedido) {

                var disabled = true;

                if (pedido.estado_actual_pedido === '1' || pedido.estado_actual_pedido === '8') {
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

            $scope.agregarClase = function(estado) {
                estado = parseInt(estado);
                if (estado === 6 || estado === 10) {
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
            
            
            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepicker_fecha_inicial = true;
                $scope.datepicker_fecha_final = false;

            };

            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepicker_fecha_inicial = false;
                $scope.datepicker_fecha_final = true;

            };



            //fin delegado grid pedidos //

            $scope.onPedidoSeleccionado = function(check, row) {

                row.selected = check;
                if (check) {
                    $scope.agregarPedido(row.entity);
                } else {

                    $scope.quitarPedido(row.entity);
                }

            },
                    $scope.quitarPedido = function(pedido) {
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido === pedido.numero_pedido) {
                        $scope.pedidosSeleccionados.splice(i, true);
                    }
                }
            };

            $scope.agregarPedido = function(pedido) {
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


            $scope.renderPedidosFarmacias = function(data, paginando) {
           
                $scope.items = data.pedidos_farmacias.length;
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
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
                cliente.setZona(obj.zona);
                pedido.setFarmacia(cliente);

                return pedido;
            };

            $scope.reemplazarPedidoEstado = function(pedido) {
                for (var i in $scope.Empresa.getPedidosFarmacia()) {
                    var _pedido = $scope.Empresa.getPedidosFarmacia()[i];

                    if (pedido.numero_pedido === _pedido.numero_pedido) {

                        _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                        _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                        _pedido.estado_separacion = pedido.estado_separacion;
                        break;
                    }
                }
            };

            $scope.modificar_estado_pedido_farmacia = function(row) {

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
                                    pedidos_farmacias: {
                                        numero_pedido: $scope.pedido_seleccionado.get_numero_pedido()
                                    }
                                }
                            };

                            Request.realizarRequest(API.PEDIDOS.ELIMIAR_RESPONSABLE_FARMACIA, "POST", obj, function(data) {

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
                    }]
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.cambiar_estado_pedido_farmacia = function() {



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
                            return API.PEDIDOS.ASIGNAR_RESPONSABLE_FARMACIA;
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


            //delegados del socket io
            socket.on("onListarPedidosFarmacias", function(datos) {
       
                if (datos.status === 200) {
                    var obj = datos.obj.pedidos_farmacias[0];
                    var pedido = $scope.crearPedido(obj);                    
                    $scope.reemplazarPedidoEstado(pedido);
                    AlertService.mostrarMensaje("success", "pedido Asignado Correctamente!");
                }
            });

            //evento widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                if (ev.which === 13) {
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


            $scope.seleccionEstado = function() {
                $scope.paginaactual = 1;
                $scope.buscarPedidosFarmacias($scope.termino_busqueda, true);
            };


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.Empresa.vaciarPedidosFarmacia();
                socket.remove(["onListarPedidosFarmacias"]);
            });


            $scope.buscarPedidosFarmacias("");
            $scope.listarEmpresas();


        }]);
});