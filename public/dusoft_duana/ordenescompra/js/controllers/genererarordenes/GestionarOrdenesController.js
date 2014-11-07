
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "controllers/genererarordenes/GestionarProductosController",
    "controllers/genererarordenes/CalcularValoresProductoController"
], function(angular, controllers) {

    controllers.controller('GestionarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "ProductoOrdenCompra",
        "UsuarioOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, OrdenCompra, Empresa, Proveedor, UnidadNegocio, Producto, Usuario, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };

            // Variables
            $scope.numero_orden = 0;
            $scope.codigo_proveedor_id = '';
            $scope.unidad_negocio_id = '';
            $scope.observacion = '';


            $scope.gestionar_consultas = function() {

                $scope.buscar_proveedores(function() {

                    $scope.buscar_unidades_negocio(function() {

                        $scope.gestionar_orden_compra();

                    });
                });
            };

            $scope.gestionar_orden_compra = function() {

                if ($scope.numero_orden > 0) {

                    $scope.buscar_orden_compra(function(continuar) {

                        if (continuar) {
                            $scope.buscar_detalle_orden_compra();
                        }
                    });
                }
            };

            $scope.buscar_orden_compra = function(callback) {

                var obj = {session: $scope.session, data: {ordenes_compras: {numero_orden: $scope.numero_orden}}};

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_ORDEN_COMPRA, "POST", obj, function(data) {

                    if (data.status === 200 && data.obj.orden_compra.length > 0) {

                        var datos = data.obj.orden_compra[0];

                        $scope.orden_compra = OrdenCompra.get(datos.numero_orden, datos.estado, datos.observacion, datos.fecha_registro);
                        $scope.orden_compra.set_unidad_negocio($scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio));
                        $scope.orden_compra.set_proveedor($scope.Empresa.get_proveedor(datos.codigo_proveedor_id));
                        $scope.orden_compra.set_usuario(Usuario.get(datos.usuario_id, datos.nombre_usuario));

                        $scope.codigo_proveedor_id = $scope.orden_compra.get_proveedor().get_codigo_proveedor();
                        $scope.unidad_negocio_id = $scope.orden_compra.get_unidad_negocio().get_codigo();
                        $scope.observacion = $scope.orden_compra.get_observacion();

                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            $scope.buscar_detalle_orden_compra = function() {

                var obj = {session: $scope.session, data: {ordenes_compras: {numero_orden: $scope.numero_orden}}};

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_DETALLE_ORDEN_COMPRA, "POST", obj, function(data) {

                    if (data.status === 200) {

                        var lista_productos = data.obj.lista_productos;

                        $scope.orden_compra.limpiar_productos();

                        lista_productos.forEach(function(data) {

                            var producto = Producto.get(data.codigo_producto, data.descripcion_producto, '', data.porc_iva, data.valor);                            
                            producto.set_cantidad_seleccionada(data.cantidad_solicitada);
                            $scope.orden_compra.set_productos(producto);
                        });
                    }
                });
            };

            $scope.buscar_proveedores = function(callback) {



                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: ""
                        }
                    }
                };

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_proveedores(data.obj.proveedores);

                        callback(true);
                    }
                });
            };

            $scope.buscar_unidades_negocio = function(callback) {



                var obj = {
                    session: $scope.session,
                    data: {
                        unidades_negocio: {
                            termino_busqueda: ""
                        }
                    }
                };

                Request.realizarRequest(API.UNIDADES_NEGOCIO.LISTAR_UNIDADES_NEGOCIO, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_unidades_negocio(data.obj.unidades_negocio);

                        callback(true);
                    }
                });
            };

            that.render_proveedores = function(proveedores) {

                $scope.Empresa.limpiar_proveedores();

                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            that.render_unidades_negocio = function(unidades_negocios) {

                $scope.Empresa.limpiar_unidades_negocios();

                unidades_negocios.forEach(function(data) {

                    var unidad_negocio = UnidadNegocio.get(data.codigo_unidad_negocio, data.descripcion, data.imagen);

                    $scope.Empresa.set_unidades_negocios(unidad_negocio);
                });
            };

            $scope.buscar_productos = function() {

                if ($scope.numero_orden === 0) {

                    $scope.orden_compra = OrdenCompra.get($scope.numero_orden, 1, $scope.observacion, new Date());
                    $scope.orden_compra.set_unidad_negocio($scope.Empresa.get_unidad_negocio($scope.unidad_negocio_id));
                    $scope.orden_compra.set_proveedor($scope.Empresa.get_proveedor($scope.codigo_proveedor_id));
                    $scope.orden_compra.set_usuario(Usuario.get(Sesion.usuario_id));
                }


                $scope.slideurl = "views/genererarordenes/gestionarproductos.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos');
            };



            $scope.seleccionar_unidad_negocio = function() {

                if ($scope.numero_orden > 0) {
                    // Actualizar unidad de negocio
                }
            };

            $scope.seleccionar_proveedor = function() {

                if ($scope.numero_orden > 0) {
                    // Actualizar proveedor : OJO, los precios de los productos puede cambiar
                }

            };


            $scope.cerrar = function() {

                $scope.$emit('cerrar_gestion_productos', {animado: true});

                console.log('========== Cerrando Productos ===========');
                console.log($scope.orden_compra);

                $scope.numero_orden = $scope.orden_compra.get_numero_orden();

                //Consultar detalle de Orden de Compra
                if ($scope.numero_orden > 0) {
                    $scope.buscar_detalle_orden_compra();
                }
            };

            $scope.lista_productos = {
                data: 'orden_compra.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                showFooter: true,
                //footerTemplate: '<div style="width: 200px; display: inline-block;">{{getTotal(0)}}</div><div style="width: 200px; display: inline-block;">{{total2}}</div><div style="width: 200px; display: inline-block;">{{total3}}</div>',
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "20%"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "15%"},
                    {field: 'cantidad_seleccionada', width: "7%", displayName: "Cantidad", enableCellEdit: true},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto()" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };

            //$scope.buscar_proveedores();
            //$scope.buscar_unidades_negocio();
            //$scope.gestionar_orden_compra();
            $scope.gestionar_consultas();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});