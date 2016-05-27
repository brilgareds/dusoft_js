
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

            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
             
             if($state.is("AutorizacionesProductos") === true){
                var estado = localStorageService.get("tabActivo");
                 if(estado.estadoTab === 1){
                   $scope.activarTabFarmacia = "true";                   
                 }else{
                   $scope.activarTabCliente = "true";  
                 }
                 $scope.tipoPedido=estado.estadoTab;
             };

            that.init = function(callback) {
                $scope.root = {};
                
                $scope.tipoPedido = 0;
                $scope.Empresa = Empresa.get();
                $scope.EmpresasProductos = [];
                $scope.paginaactual = 1;
                $scope.paginas = 0;
                $scope.items = 0;
                $scope.listarPedido = [];
                $scope.ultima_busqueda = "";
                $scope.listaEmpresas = [];
                $scope.empresa_seleccion = '';
                $scope.termino = "";
                $scope.empresa_seleccion = $scope.seleccion.codigo;                
                callback();
            };

            /**
             * +Descripcion: funcion que realiza la busqueda de los pedidos
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onAutorizacionTab = function(termino) {
                $scope.tipoPedido = termino;
                $scope.listarPedido = [];
               // listaTerceros = [];
                $scope.empresa_seleccion = $scope.seleccion.codigo;
                that.buscarProductosBloqueados("");
            };

            /**
             * +Descripcion: evento busca pedido
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onBuscarPedido = function(ev, terminoBusqueda) {
                if (ev.which === 13) {
                    $scope.termino = terminoBusqueda;
                    $scope.paginaactual = 1;
                    that.buscarProductosBloqueados(terminoBusqueda,true);
                    //listaTerceros = [];
                    // that.buscarPedidos(terminoBusqueda);
                }
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos las autorizaciones de productos en pedido
             */
            that.buscarProductosBloqueados = function(termino,paginando) {
                    
                if ($scope.ultima_busqueda !== $scope.termino) {
                    $scope.paginaactual = 1;
                }
                
                var obj = {
                    termino_busqueda: termino,
                    pagina_actual: $scope.paginaactual,
                    empresa_id: $scope.empresa_seleccion,
                    session: $scope.session,
                    tipo_pedido: $scope.tipoPedido,
                    detalle: '0'
                };
                AutorizacionPedidosService.buscarProductosBloqueados(obj, function(data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = $scope.termino;
                        that.renderProductos(data, paginando);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion:renderizar la consulta al modelo
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            that.renderProductos = function(data, paginando) {
                listaTerceros = [];
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
                                                        <span> Pendiente </span>\
                                                </button>\
                                                <button ng-if="!row.entity.obtenerPedidoPorPosiscion(0).getBoolPorAprobar()" class="btn btn-primary btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Revisado </span>\
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
                            tipoPedido: $scope.tipoPedido
                        });
                $state.go("AutorizacionesDetalle");
            };
            
             /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {pagina}
             */
             $scope.paginaAnterior = function() {
                if($scope.paginaactual === 1) return;
                $scope.paginaactual--;
                that.buscarProductosBloqueados($scope.termino, true);
            };
            
            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {pagina}
             */
            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                that.buscarProductosBloqueados($scope.termino, true);
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
                
                that.buscarProductosBloqueados("");
            });
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                // set localstorage
                localStorageService.add("AutorizacionesProductos", null);

            });
            

        }]);
});