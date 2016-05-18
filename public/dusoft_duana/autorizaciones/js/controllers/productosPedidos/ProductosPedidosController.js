
define(["angular", "js/controllers", 'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('ProductosPedidosController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Pedido", "EmpresaAutorizacion",
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Pedido, Empresa) {

            var that = this;
            $scope.root = {};
            $scope.Empresa = Empresa.get();

            $scope.EmpresasProductos = [];
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.paginaactual = 1;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.listaEmpresas = [];
            $scope.empresa_seleccion = '';

            /**
             * +Descripcion: funcion que realiza la busqueda de los pedidos
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            that.buscarPedidos = function(termino, paginando) {
                $scope.hola = termino;
            };

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /**
             * +Descripcion: evento busca pedido
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onBuscarPedido = function(ev, terminoBusqueda) {
                if (ev.which === 13) {
                    that.buscarPedidos(terminoBusqueda);
                }
            };


            that.traerPedidos = function() {
                for (var i = 1; i < 11; i++) {
                    var datos = {};
                    datos.numero_pedido = i;
                    var pedido = Pedido.get();
                    pedido.setDatos(datos);
                    $scope.Empresa.agregarPedido(pedido);
                }
            };

            that.prueba = function() {

                $scope.empresa_seleccion = '03';
                $scope.tipo_pedido = '0';
                $scope.buscarProductosBloqueados('51163', 1);

            };

            $scope.buscarProductosBloqueados = function(termino_busqueda, paginando) {

                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                if ($scope.empresa_seleccion === "") {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar una empresa");
                    return;
                }

                $scope.paginaactual = paginando;
                $scope.termino = termino_busqueda;

                Request.realizarRequest(
                        API.AUTORIZACIONES.LISTAR_PRODUCTOS_BLOQUEADOS,
                        "POST",
                        {
                            session: $scope.root.session,
                            data: {
                                autorizaciones: {
                                    termino_busqueda: $scope.termino,
                                    pagina_actual: $scope.paginaactual,
                                    empresa_id: $scope.empresa_seleccion,
                                    tipo_pedido: $scope.tipo_pedido
                                }
                            }
                        },
                function(data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = $scope.termino_busqueda;
                        $scope.renderProductos(data.obj, paginando);
                    }
                }
                );
            };

            $scope.renderProductos = function(data, paginando) {

                $scope.items = data.listarProductosBloqueados.length;
                console.log("dataaaaaaaaaaaaaaaaaa", data.listarProductosBloqueados);
                console.log("$scope.itemssssssssssssssssssssssssss", $scope.items);

//                se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.EmpresasProductos = [];
                $scope.paginas = (data.listarProductosBloqueados.length / 10);
                $scope.items = data.listarProductosBloqueados.length;

                for (var i in data.listarProductosBloqueados) {
                    var obj = data.listarProductosBloqueados[i];

                    var producto = ProductoMovimiento.get(
                            obj.codigo_producto,
                            obj.descripcion_producto,
                            obj.existencia
                            );

                    var centro = CentroUtilidad.get(obj.centro);
                    var bodega = Bodega.get(obj.bodega);
                    centro.agregarBodega(bodega);
                    producto.setTipoProductoId(obj.tipo_producto_id);

                    var empresa = Empresa.get(obj.razon_social, obj.empresa_id);
                    empresa.setCentroUtilidadSeleccionado(centro);

                    $scope.EmpresasProductos.push({
                        empresa: empresa,
                        producto: producto
                    });
                }

            };
            /**
             * +Descripcion: objeto ng-grid
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.lista_pedidos_clientes = {
                data: 'Empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'cliente', displayName: 'Cliente / Farmacia', width: "60%"},
                    {field: 'numero_pedido', displayName: 'Pedido', width: "10%"},
                    {field: 'estado', displayName: 'Estado', width: "15%"},
                    {field: 'fecha', displayName: 'Fecha', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" disabled ng-disabled="row.entity.separado"  ng-click="onAbrirVentana(row.entity)">\n\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\
                                       </div>'
                    }
                ]

            };

            /**
             * +Descripcion: metodo para navegar a la ventana detalle
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params pedido : numero del pedido
             * @returns {ventana}
             */
            that.mostrarDetalle = function(pedido) {
                localStorageService.add("pedidoCabecera",
                        {
                            numeroPedido: pedido.get_numero_pedido(),
                        });
                $state.go("AutorizacionesDetalle");
            };

            /**
             * +Descripcion: evento de la vista para pasar a la ventana detalle
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params pedido : numero del pedido
             * @returns {ventana}
             */
            $scope.onAbrirVentana = function(pedido) {
                that.mostrarDetalle(pedido);
            };

            that.traerPedidos();
            that.prueba();

        }]);
});