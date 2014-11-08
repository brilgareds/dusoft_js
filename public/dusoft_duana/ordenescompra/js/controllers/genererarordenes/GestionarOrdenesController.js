
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
            $scope.numero_orden = localStorageService.get("numero_orden") || 0;
            $scope.codigo_proveedor_id = '';
            $scope.unidad_negocio_id = '';
            $scope.observacion = '';
            $scope.producto_eliminar = '';


            that.gestionar_consultas = function() {

                that.buscar_proveedores(function() {

                    that.buscar_unidades_negocio(function() {

                        that.gestionar_orden_compra();

                    });
                });
            };

            that.gestionar_orden_compra = function() {

                if ($scope.numero_orden > 0) {

                    $scope.buscar_orden_compra(function(continuar) {

                        if (continuar) {
                            that.buscar_detalle_orden_compra();
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

                        var unidad_negocio = ($scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio).length > 0) ? $scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio) : UnidadNegocio.get(datos.codigo_unidad_negocio, datos.descripcion)

                        //$scope.orden_compra.set_unidad_negocio($scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio));
                        $scope.orden_compra.set_unidad_negocio(unidad_negocio);


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

            that.buscar_detalle_orden_compra = function() {

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

            that.buscar_proveedores = function(callback) {

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

            that.buscar_unidades_negocio = function(callback) {

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

            $scope.eliminar_producto = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra.get_numero_orden(),
                            codigo_producto: $scope.producto_eliminar.getCodigoProducto()
                        }
                    }
                };

                console.log('===== Producto a eliminar ==========');
                console.log(obj);
                //return;
                Request.realizarRequest(API.ORDENES_COMPRA.ELIMINAR_PRODUCTO_ORDEN_COMPRA, "POST", obj, function(data) {

                    console.log('===== Resultado de eliminar ==========');
                    console.log(data);

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        that.buscar_detalle_orden_compra();
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

                $scope.numero_orden = $scope.orden_compra.get_numero_orden();

                //Consultar detalle de Orden de Compra
                if ($scope.numero_orden > 0) {
                    that.buscar_detalle_orden_compra();
                }
            };

            $scope.cancelar_orden_compra = function() {

                $state.go('ListarOrdenes');
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
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "15%", cellFilter: "currency:'$ '"},
                    {field: 'cantidad_seleccionada', width: "7%", displayName: "Cantidad"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };


            $scope.eliminar_producto_orden_compra = function(row) {

                var producto = row.entity;
                $scope.producto_eliminar = producto;

                //that.eliminar_producto();
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el producto?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Codigo.</h4>\
                                    <h5> {{ producto_eliminar.getCodigoProducto() }}</h5>\
                                    <h4>Descripcion.</h4>\
                                    <h5> {{ producto_eliminar.getDescripcion() }} </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        console.log('========= Scope =========');
                        console.log($scope.producto_eliminar);

                        $scope.confirmar = function() {
                            console.log('=========== Click confirmar ==========');
                            $scope.eliminar_producto();
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            console.log('=========== close confirmar ==========');
                            $modalInstance.close();
                        };

                    },
                    resolve: {
                        producto_eliminar: function() {
                            return $scope.producto_eliminar;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };


            //that.buscar_proveedores();
            //that.buscar_unidades_negocio();
            //that.gestionar_orden_compra();
            that.gestionar_consultas();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});