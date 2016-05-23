
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
        "Pedido", "Empresa", "AutorizacionPedidosService",
        "PedidoAutorizacion", "ProductoAutorizacion",
        "TerceroAutorizacion", "Autorizacion",
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Pedido, Empresa, AutorizacionPedidosService,
                PedidoAutorizacion, Producto,
                TerceroAutorizacion, Autorizacion) {

            var that = this;
            var listaTerceros = [];
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
                $scope.termino = "";
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
                $scope.listarPedido = [];
                listaTerceros = [];
                $scope.empresa_seleccion = $scope.seleccion.codigo;
                $scope.buscarProductosBloqueados();
            };

            /**
             * +Descripcion: evento busca pedido
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onBuscarPedido = function(ev, terminoBusqueda) {
                if (ev.which === 13) {
                    console.log("buscar_pedido termino: ", terminoBusqueda);
                    $scope.termino = terminoBusqueda;
                    $scope.buscarProductosBloqueados();
                    listaTerceros = [];
                    // that.buscarPedidos(terminoBusqueda);
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
                $scope.buscarProductosBloqueados();
            };


            /**
             * @author Andres M. Gonzalez
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos las autorizaciones de productos en pedido
             */
            $scope.buscarProductosBloqueados = function() {

                var obj = {
                    termino_busqueda: $scope.termino,
                    pagina_actual: $scope.paginaactual,
                    empresa_id: $scope.empresa_seleccion,
                    session: $scope.session,
                    tipo_pedido: $scope.tipoPedido,
                    detalle: '0'
                };

                AutorizacionPedidosService.buscarProductosBloqueados(obj, function(data) {
                    if (data.status === 200) {
                        that.renderProductos(data, 1);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };




            that.renderProductos = function(data, paginando) {
                console.log("AAAAAA1>>>>", data.obj.listarProductosBloqueados);
                console.log("AAAAAA2>>>>", paginando);
                $scope.items = data.obj.listarProductosBloqueados.length;

//                se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.EmpresasProductos = [];
                $scope.paginas = (data.obj.listarProductosBloqueados.length / 10);
                $scope.items = data.obj.listarProductosBloqueados.length;

                for (var i in data.obj.listarProductosBloqueados) {

                    var objt = data.obj.listarProductosBloqueados[i];
                    console.log("->>>>>>", objt);
//                    var autorizacion = Autorizacion.get(objt.autorizaciones_productos_pedidos_id);
//                    autorizacion.setFechaVerificacion(objt.fecha_verificacion);
//                    autorizacion.setResponsable(objt.usuario_verifica);
//                    autorizacion.setEstado(objt.estado);
//                    autorizacion.setNombreEstado(objt.estado_verificado);
//
//                    var producto = Producto.get(objt.codigo_producto, objt.descripcion_producto, objt.numero_unidades);
//                    producto.setAutorizacion(autorizacion);

                    var pedidoAutorizacion = PedidoAutorizacion.get();
                    var datos = {};
                    datos.numero_pedido = objt.pedido_id;
                    datos.fecha_registro = objt.fecha_solicitud;
                    pedidoAutorizacion.setDatos(datos);
                    pedidoAutorizacion.setTipoPedido(objt.tipo_pedido);
                    pedidoAutorizacion.setFechaSolicitud(objt.fecha_solicitud);
                    pedidoAutorizacion.setPorAprobar(objt.poraprobacion);
                    pedidoAutorizacion.setBoolPorAprobar(objt.poraprobacion);
                    //  pedidoAutorizacion.setProductos(producto);

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
                enableHighlighting: true,
                columnDefs: [
                    {field: 'opciones', displayName: "Estado Actual", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).getBoolPorAprobar()" class="btn btn-warning btn-xs" >\
                                                    <i class="glyphicon glyphicon-warning-sign"></i>\n\
                                                        <span>Pendiente</span>\
                                                </button>\
                                                <button ng-if="!row.entity.obtenerPedidoPorPosiscion(0).getBoolPorAprobar()" class="btn btn-primary btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Revisado</span>\
                                                </button>\
                                            </div>'
                    },
                    {field: 'getNombre()', displayName: 'Cliente / Farmacia', width: "60%"},
                    {field: 'obtenerPedidoPorPosiscion(0).get_numero_pedido()', displayName: 'Pedido', width: "10%"},
                    {field: 'obtenerPedidoPorPosiscion(0).getFechasolicitud()', displayName: 'Fecha', width: "10%"},
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
                            numeroPedido: pedido,
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