
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
    "models/TerceroAutorizacion",
    "models/PedidoAutorizacion",
    "models/ProductoAutorizacion",
    "models/Autorizacion",
], function(angular, controllers) {

    controllers.controller('ProductosPedidosController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Pedido", "Empresa",
        "PedidoAutorizacion", "ProductoAutorizacion",
        "TerceroAutorizacion", "Autorizacion",
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Pedido, Empresa,
                PedidoAutorizacion, Producto,
                TerceroAutorizacion, Autorizacion) {

            var that = this;

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            that.init = function(callback) {
                $scope.root = {};
                $scope.listarPedido = [];
                $scope.tipoPedido = '0';
                $scope.Empresa = Empresa.get();
                $scope.EmpresasProductos = [];
                $scope.paginas = 0;
                $scope.items = 0;
                $scope.paginaactual = 1;
                $scope.termino_busqueda = "";
                $scope.ultima_busqueda = "";
                $scope.listaEmpresas = [];
                $scope.empresa_seleccion = '';

                callback();

            };



            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();

            /**
             * +Descripcion: funcion que realiza la busqueda de los pedidos
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onAutorizacionTab = function(termino) {
                $scope.tipoPedido = termino;
                $scope.empresa_seleccion = $scope.seleccion.codigo;
                $scope.buscarProductosBloqueados('51163', 1);
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
                    //   $scope.Empresa.agregarPedido(pedido);//estaba bien
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
                            session: $scope.session,
                            data: {
                                autorizaciones: {
                                    termino_busqueda: $scope.termino,
                                    pagina_actual: $scope.paginaactual,
                                    empresa_id: $scope.empresa_seleccion,
                                    tipo_pedido: $scope.tipoPedido
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


            var listaTerceros = [];
            $scope.renderProductos = function(data, paginando) {

                $scope.items = data.listarProductosBloqueados.length;

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

                    var objt = data.listarProductosBloqueados[i];
                    console.log("->>>>>>", objt);
                    var autorizacion = Autorizacion.get(objt.autorizaciones_productos_pedidos_id);
                    autorizacion.setFechaVerificacion(objt.fecha_verificacion);
                    autorizacion.setResponsable(objt.usuario_verifica);
                    autorizacion.setEstado(objt.estado);
                    autorizacion.setNombreEstado(objt.estado_verificado);

                    var producto = Producto.get(objt.codigo_producto, objt.descripcion_producto, objt.numero_unidades);
                    producto.setAutorizacion(autorizacion);

                    var pedidoAutorizacion = PedidoAutorizacion.get();
                    var datos = {};
                    datos.numero_pedido = objt.pedido_id;
                    datos.fecha_registro = objt.fecha_solicitud;
                    pedidoAutorizacion.setDatos(datos);
                    pedidoAutorizacion.setTipoPedido(objt.tipo_pedido);
                    pedidoAutorizacion.setFechaSolicitud(objt.fecha_solicitud);
                    pedidoAutorizacion.setPorAprobar(objt.poraprobacion);
                    pedidoAutorizacion.setProductos(producto);





                    var terceros = TerceroAutorizacion.get(objt.nombre_tercero, objt.tipo_id_tercero, objt.tercero_id);
                    terceros.agregarPedido(pedidoAutorizacion);
                    listaTerceros.push(terceros);
                }
                $scope.listarPedido = listaTerceros;
                console.log("TerceroAutorizacion->>>>>>", $scope.listarPedido);

            };
            /**
             * +Descripcion: objeto ng-grid
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.lista_pedidos_clientes = {
                data: 'listarPedido',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getNombre()', displayName: 'Cliente / Farmacia', width: "60%"},
                    {field: 'obtenerPedidoPorPosiscion(0).get_numero_pedido()', displayName: 'Pedido', width: "10%"},
                    {field: 'obtenerPedidoPorPosiscion(0).getPorAprobar()', displayName: 'Estado', width: "15%"},
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

            that.init(function() {


            });
            that.traerPedidos();
            that.prueba();
        }]);
});