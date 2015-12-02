
define(["angular", "js/controllers",
    "models/ProductoOrdenCompra",
    "models/OrdenCompraPedido",
    "models/ProductoOrdenCompra",
    "includes/classes/Empresa",
    "models/AutorizacionOrdenCompra",
    "models/LoteOrdenCompra",
    "models/EmpresaOrdenCompra",
    "controllers/autorizaciones/AutorizarOrdenesComprasController"
], function(angular, controllers) {
    controllers.controller('ListarAutorizacionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "OrdenCompraPedido",
        "ProductoOrdenCompra",
        "Usuario",
        "Empresa",
        "LoteOrdenCompra",
        "AutorizacionOrdenCompra",
        "EmpresaOrdenCompra",
        function($scope, $rootScope, Request,
                $modal, API, socket,
                OrdenCompra, Producto, Usuario, Empresa, Lote, Autorizacion, empresaOrdenCompra) {

            var that = this;  
             
            $scope.datos_view = {
                termino_busqueda: ""
            };

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /*
             * Inicializacion de variables
             * @param {type} empresa
             * @param {type} callback
             * @returns {void}
             */
            that.init = function() {
                $scope.root = {};
                $scope.root.Empresa = Empresa;
                $scope.root.empresaOrdenCompra = empresaOrdenCompra;
                $scope.root.paginaactual = 1;
                $scope.root.rootAutorizacion = {};
                $scope.empresas = []; 
                $scope.root.paginas = 0;
                $scope.root.items = 0;
                $scope.root.terminoBusqueda = "";
                $scope.root.ultimaBusqueda = "";
                $scope.root.ultimofiltro = "";
                $scope.root.ultimaempresa = "";                
                that.buscarAutorizacionesCompras(function() {
                });  
            };
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();


            /*
             * @Author: AMGT
             * +Descripcion: selecciona la empresa del usuario actual.
             */
            $scope.listarEmpresas = function() {
                $scope.empresas = Usuario.getUsuarioActual().getEmpresasFarmacias();
            };
            $scope.listarEmpresas();


            /*
             * @Author: AMGT
             * +Descripcion: lista para escoger busqueda, por numero orden de pedido o por producto.
             */
            $scope.filtros = [
                {nombre: "Orden", selec: '0'},
                {nombre: "Producto", selec: '1'}
            ];          
            
            /*
             * @Author: AMGT
             * +Descripcion: metodo que selecciona el filtro
             */
            $scope.filtro = $scope.filtros[0];
            $scope.onSeleccionFiltro = function(filtro) {
                $scope.filtro = filtro;
            };
            
            /*
             * @Author: AMGT
             * +Descripcion: remueve los listeners
             */
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                socket.removeAllListeners();
            });

            /*
             * @Author: AMGT
             * +Descripcion: handler del combo de empresas
             */
            $scope.onBuscarPedidos = function() {
                $scope.rootPedidosFarmacias.paginaactual = 1;
                self.buscarPedidos();
            };

            /*
             * @Author: AMGT
             * +Descripcion: grilla donde se encuentran las ordenes para autorizar
             */
            $scope.lista_autorizacion_compras = {
                data: 'root.empresaOrdenCompra.listarAutorizaciones()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'ordenSeleccionada.get_numero_orden()', displayName: '# Orden', width: "5%"},
                    {field: 'ordenSeleccionada.getFechaIngreso()', displayName: 'F. Ingreso', cellFilter: "date:\'yyyy-MM-dd\'", width: "5%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.getCodigoProducto()', displayName: "Codigo Producto", width: "7%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.getDescripcion()', displayName: "Producto", width: "15%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.lote.getCodigo()', displayName: "Lote", width: "6%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.lote.getFechaVencimiento()', displayName: "F. Vencimiento", cellFilter: "date:\'yyyy-MM-dd\'", width: "6%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.get_cantidad_recibida()', displayName: "Cantidad", width: "4%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.getValorUnitarioCompra()', displayName: "Valor Compra", width: "7%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.getValorUnitarioFactura()', displayName: "Valor Factura", width: "7%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.getTotalCosto()', displayName: "Total", width: "7%"},
                    {field: 'ordenSeleccionada.getLocalizacion()', displayName: "Localización", width: "5%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.getNombreUsuarioIngreso()', displayName: "Usuario Solicitante", width: "7%"},
                    {field: 'ordenSeleccionada.productoSeleccionado.getJustificacionIngreso()', displayName: "Justificación", width: "14%"},
                    {displayName: "Autorización", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="onAbrirVentanaAutorizacionOrdenesCompras(row.entity,1);" >Autorizar</a></li>\
                                                <li class="divider"></li>\
                                                <li><a href="javascript:void(0);" ng-click="onAbrirVentanaAutorizacionOrdenesCompras(row.entity,0);" >No Autorizar</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };


            /*
             * @Author: AMGT
             * +Descripcion: abre la ventana de autorizaciones ordenes compras
             */
            $scope.onAbrirVentanaAutorizacionOrdenesCompras = function(modeloAutorizacion, banderaAutorizacion) {

                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "autorizarordenesmodal",
                    templateUrl: 'views/autorizaciones/autorizarordenes.html',
                    controller: "AutorizarOrdenesComprasController",
                    resolve: {
                        modeloAutorizacion: function() {
                            return modeloAutorizacion;
                        },
                        banderaAutorizacion: function() {
                            return banderaAutorizacion;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function() {
                    that.buscarAutorizacionesCompras(function() {
                    });
                }, function() {
                });
            };

            /*
             * @Author: AMGT
             * +Descripcion: lista las autorizaciones cuando se realiza una accion en la vista
             */
            $scope.listarAutorizaciones = function() {
                that.buscarAutorizacionesCompras(function() {
                });
            };

            /*
             * @Author: AMGT
             * +Descripcion: lista las autorizaciones cuando se escucha un evento de la vista
             */
            $scope.listarAutorizacionesEvent = function($event) {
                if ($event.which === 13) {
                    that.buscarAutorizacionesCompras(function() {
                    });
                }
            };

            /*
             * @Author: AMGT
             * @param {object} obj
             * @param {function} callback
             * +Descripcion: Metodo encargado de consultar los las autorizaciones de ordenes de compra
             */
            that.consultarAutorizacionesCompras = function(obj, callback) {

                var url = API.ORDENES_COMPRA.LISTAR_AUTORIZACIONES_COMPRAS;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    $scope.root.ultimabusqueda = $scope.root.terminoBusqueda;
                    $scope.root.ultimofiltro = $scope.filtro.selec;
                    $scope.root.ultimaempresa = $scope.seleccion.getCodigo();
                    callback(data);

                });
            };


            /*
             * @Author: AMGT
             * +Descripcion: funcion que realiza la consulta al servidor
             */
            that.buscarAutorizacionesCompras = function( ) {
                //valida si cambio el termino de busqueda
                if ($scope.root.ultima_busqueda !== $scope.root.terminoBusqueda || $scope.root.ultimofiltro !== $scope.filtro.selec || $scope.root.ultimaempresa !== $scope.seleccion.getCodigo()) {
                    $scope.root.paginaactual = 1;
                }
                var obj = {
                    session: $scope.session,
                    data: {
                        listar_autorizaciones: {
                            empresa: $scope.seleccion.getCodigo(),
                            terminoBusqueda: $scope.root.terminoBusqueda,
                            filtro: $scope.filtro.selec,
                            paginaActual: $scope.root.paginaactual
                        }
                    }
                };
                $scope.root.empresaOrdenCompra.vaciarOrdenCompra();
                that.consultarAutorizacionesCompras(obj, function(data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = {
                            termino_busqueda: $scope.termino_busqueda,
                            seleccion: $scope.seleccion
                        };
                        that.renderAutorizacionCompras(data.obj.ordenes_compras, $scope.root.paginas);
                    }

                });
            };

            /*
             * @Author: AMGT
             * @param {object} obj
             * @param {function} callback
             * +Descripcion: Asigna los valores de la consulta a los objetos definifos
             */
            that.renderAutorizacionCompras = function(autorizacion, paginando) {
                for (var i in autorizacion) {

                    var lote = Lote.get(autorizacion[i].lote, autorizacion[i].fecha_vencimiento);
                    var producto = Producto.get(autorizacion[i].codigo_producto, autorizacion[i].producto, null, null, null, null, null, null);
                    producto.set_cantidad_recibida(autorizacion[i].cantidad);
                    producto.setPorcentajeGravamen(autorizacion[i].porcentaje_gravamen);
                    producto.setTotalCosto(autorizacion[i].total_costo);
                    producto.setValorUnitarioFactura(autorizacion[i].valor_unitario_factura);
                    producto.setValorUnitarioCompra(autorizacion[i].valor_unitario_compra);
                    producto.setLote(lote);
                    producto.setUsuarioIngreso(autorizacion[i].usuario_id);
                    producto.setNombreUsuarioIngreso(autorizacion[i].usuario_ingreso);
                    producto.setJustificacionIngreso(autorizacion[i].justificacion_ingreso);
                    producto.setDocTmpId(autorizacion[i].doc_tmp_id);
                    producto.setItemId(autorizacion[i].item_id);
                    producto.setLocalProd(autorizacion[i].local_prod);
                    var orden = OrdenCompra.get(autorizacion[i].orden_pedido_id, null, null, null, null);
                    orden.setProductoSeleccionado(producto);
                    orden.setFechaIngreso(autorizacion[i].fecha_ingreso);
                    orden.setLocalizacion(autorizacion[i].local_prod);
                    var autorizaciones = Autorizacion.get(orden, autorizacion[i].empresa_id, autorizacion[i].centro_utilidad, autorizacion[i].bodega);
                    autorizaciones.setUsuarioIdAutorizador(autorizacion[i].usuario_id_autorizador);
                    autorizaciones.setNombreAutorizador(autorizacion[i].nombre_autorizador);
                    autorizaciones.setJustificacion(autorizacion[i].observacion_autorizacion);//
                    autorizaciones.setSwAutorizado(autorizacion[i].sw_autorizado);//
                    autorizaciones.setSwNoAutorizado(autorizacion[i].sw_no_autoriza);//
                    autorizaciones.setUsuarioIdAutorizador2(autorizacion[i].usuario_id_autorizador_2);
                    autorizaciones.setNombreAutorizador2(autorizacion[i].nombre_autorizador2);
                    autorizaciones.setJustificacion2(autorizacion[i].observacion_autorizacion);
                    autorizaciones.setSwAutorizado2(autorizacion[i].sw_autorizado);
                    $scope.root.empresaOrdenCompra.agregarAutorizaciones(autorizaciones);
                }
            };
            that.init();
            
             $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                $scope.root = {};
            });
            
        }]);
});