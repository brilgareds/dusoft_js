//Controlador de la View verpedidosfarmacias.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('VerPedidosTempFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'FarmaciaVenta', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request, EmpresaPedido, FarmaciaVenta, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService, $modal) {

            var that = this;

            that.pedido = PedidoVenta.get();

            $scope.rootVerPedidosTempFarmacias = {};

            $scope.rootVerPedidosTempFarmacias.Empresa = EmpresaPedido;
            $scope.rootVerPedidosTempFarmacias.Pedido = PedidoVenta;

            $scope.rootVerPedidosTempFarmacias.paginas = 0;

            $scope.rootVerPedidosTempFarmacias.termino_busqueda = "";
            $scope.rootVerPedidosTempFarmacias.ultima_busqueda = {};
            $scope.rootVerPedidosTempFarmacias.paginaactual = 1;

            $scope.rootVerPedidosTempFarmacias.ultima_busqueda.seleccion = "";
            $scope.rootVerPedidosTempFarmacias.ultima_busqueda.termino_busqueda = "";

            $scope.rootVerPedidosTempFarmacias.seleccion = "FD";

            $scope.rootVerPedidosTempFarmacias.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.rootVerPedidosTempFarmacias.listado_farmacias = [];

            that.listarFarmacias = function() {

                var obj = {
                    session: $scope.rootVerPedidosTempFarmacias.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        $scope.rootVerPedidosTempFarmacias.listado_farmacias = data.obj.empresas;
                        //that.renderFarmacias(data.obj.empresas);
                    }

                });
            };
            
            $scope.obtenerParametrosTemp = function() {

                //valida si cambio el termino de busqueda
                if ($scope.rootVerPedidosTempFarmacias.ultima_busqueda.termino_busqueda !== $scope.rootVerPedidosTempFarmacias.termino_busqueda
                        || $scope.rootVerPedidosTempFarmacias.ultima_busqueda.seleccion !== $scope.rootVerPedidosTempFarmacias.seleccion)
                        /*if($scope.rootVerPedidosTempFarmacias.ultima_busqueda.termino_busqueda !== $scope.rootVerPedidosTempFarmacias.termino_busqueda
                         || $scope.rootVerPedidosTempFarmacias.ultima_busqueda.seleccion !== $scope.farmacia_seleccionada.get_farmacia_id())*/
                        {
                            $scope.rootVerPedidosTempFarmacias.paginaactual = 1;

                        }

                var obj = {
                    session: $scope.rootVerPedidosTempFarmacias.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: $scope.rootVerPedidosTempFarmacias.termino_busqueda,
                            empresa_id: $scope.rootVerPedidosTempFarmacias.seleccion,
                            //empresa_id: $scope.farmacia_seleccionada.get_farmacia_id(),
                            pagina_actual: $scope.rootVerPedidosTempFarmacias.paginaactual,
                            filtro: {}
                        }
                    }
                };

                return obj;
            };
            
            that.consultarEncabezadosPedidos = function(obj, callback) {

                var url = API.PEDIDOS.LISTADO_PEDIDOS_TEMPORALES_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Consulta exitosa: ", data.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(data);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                        
                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(data);
                        }
                    }
                });
            };

            $scope.onBuscarPedidosFarmaciasTemp = function(obj, paginando) {

                that.consultarEncabezadosPedidos(obj, function(data) {

                    $scope.rootVerPedidosTempFarmacias.ultima_busqueda = {
                        termino_busqueda: $scope.rootVerPedidosTempFarmacias.termino_busqueda,
                        seleccion: $scope.rootVerPedidosTempFarmacias.seleccion
                                //seleccion: $scope.farmacia_seleccionada.get_farmacia_id()
                    }

                    that.renderPedidosFarmacias(data.obj, paginando);

                });
            };

            that.renderPedidosFarmacias = function(data, paginando) {

                $scope.rootVerPedidosTempFarmacias.items = data.pedidos_farmacias.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.rootVerPedidosTempFarmacias.items === 0) {
                    if ($scope.rootVerPedidosTempFarmacias.paginaactual > 1) {
                        $scope.rootVerPedidosTempFarmacias.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron más registros");
                    return;
                }

                $scope.rootVerPedidosTempFarmacias.Empresa.vaciarPedidosTemporalesFarmacia();

                if (data.pedidos_farmacias.length > 0)
                {
                    $scope.rootVerPedidosTempFarmacias.Empresa.setCodigo(data.pedidos_farmacias[0].empresa_destino);
                }

                for (var i in data.pedidos_farmacias) {

                    var obj = data.pedidos_farmacias[i];

                    var pedido = that.crearPedido(obj);

                    $scope.rootVerPedidosTempFarmacias.Empresa.agregarPedidoTemporalFarmacia(pedido);

                }

            };

            that.crearPedido = function(obj) {

                var pedido = PedidoVenta.get();

                var datos_pedido = {
                    numero_pedido: '',
                    fecha_registro: '',
                    descripcion_estado_actual_pedido: '',
                    estado_actual_pedido: '',
                    estado_separacion: ''
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(PedidoVenta.TIPO_FARMACIA);

                pedido.setObservacion(obj.observacion);

                //pedido.setEnUso(obj.en_uso);

                var farmacia = FarmaciaVenta.get(
                        obj.farmacia_id,
                        obj.bodega,
                        obj.nombre_farmacia,
                        obj.nombre_bodega,
                        obj.centro_utilidad,
                        obj.nombre_centro_utilidad
                        );

                pedido.setFarmacia(farmacia);

                return pedido;
            };
            
            
            //Grid Lista Pedidos Temporales
            $scope.rootVerPedidosTempFarmacias.lista_pedidos_temporales_farmacias = {
                data: 'rootVerPedidosTempFarmacias.Empresa.getPedidosTemporalesFarmacia()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia'},
                    {field: 'farmacia.nombre_centro_utilidad', displayName: 'Centro Utilidad'},
                    {field: 'farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'observacion', displayName: 'Observación'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                        cellTemplate: ' <div>\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEditarPedidoFarmaciaTemp(row.entity)">\n\
                                                <span class="glyphicon glyphicon-pencil">Modificar</span>\n\
                                            </button>\n\
                                        </div>'
                    }

                ]

            };
            
            $scope.onEditarPedidoFarmaciaTemp = function(data) {
                
                PedidoVenta.pedidoseleccionado = "";

                var pedido = PedidoVenta.get();

                var datos_pedido = {
                    numero_pedido: '',
                    fecha_registro: '',
                    descripcion_estado_actual_pedido: '',
                    estado_actual_pedido: '',
                    estado_separacion: ''
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(2);
                pedido.setObservacion(data.observacion);

                var farmacia = FarmaciaVenta.get(
                        data.farmacia.farmacia_id,
                        data.farmacia.bodega_id,
                        data.farmacia.nombre_farmacia,
                        data.farmacia.nombre_bodega,
                        data.farmacia.centro_utilidad_id,
                        data.farmacia.nombre_centro_utilidad
                        );

                pedido.setFarmacia(farmacia);
                //Insertar aquí el pedido seleccionado para el singleton Empresa
                $scope.rootVerPedidosTempFarmacias.Empresa.setPedidoSeleccionado(pedido);

                //PedidoVenta.pedidoseleccionado = data.numero_pedido;

                $state.go('CreaPedidosFarmacias');
            };

            that.listarFarmacias();
            $scope.onBuscarPedidosFarmaciasTemp($scope.obtenerParametrosTemp());

        }]);
});



