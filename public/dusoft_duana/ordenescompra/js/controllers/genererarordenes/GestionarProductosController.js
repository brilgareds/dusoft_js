
define(["angular", "js/controllers",
    "models/EmpresaOrdenCompra",
    "models/OrdenCompraPedido",
    "models/ProductoOrdenCompra",
    "models/Laboratorio",
    "models/UsuarioOrdenCompra", ], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        "EmpresaOrdenCompra",
        "OrdenCompraPedido",
        "ProductoOrdenCompra",
        "Laboratorio",
        "UsuarioOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Empresa, OrdenCompra, Producto, Laboratorio, Usuario, Sesion) {

            var that = this;
            $scope.Empresa = Empresa;
            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };
            //variables
            $scope.laboratorio_id = '';
            $scope.codigo_proveedor_id = '';
            $scope.producto_seleccionado = '';

            // Variable para paginación
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;
            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {


                /*console.log(parametros[1]);
                console.log($scope.orden_compra);
                return
                var numero_orden = parametros[1].numero_orden;
                var unidad_negocio_id = parametros[1].unidad_negocio_id;
                var codigo_proveedor_id = parametros[1].codigo_proveedor_id;
                var observacion = parametros[1].observacion;

                $scope.orden_compra = OrdenCompra.get(numero_orden, 1, observacion, new Date());
                $scope.orden_compra.set_unidad_negocio($scope.Empresa.get_unidad_negocio(unidad_negocio_id));
                $scope.orden_compra.set_proveedor($scope.Empresa.get_proveedor(codigo_proveedor_id));
                $scope.orden_compra.set_usuario(Usuario.get(Sesion.usuario_id));*/
                

                that.buscar_laboratorios();
                that.buscar_productos();
            });

            that.buscar_laboratorios = function(termino) {

                var termino = termino || "";
                var obj = {
                    session: $scope.session,
                    data: {
                        laboratorios: {
                            termino_busqueda: termino
                        }
                    }
                };


                Request.realizarRequest(API.LABORATORIOS.LISTAR_LABORATORIOS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_laboratorios(data.obj.laboratorios);
                    }
                });
            };


            that.buscar_productos = function(termino, paginando) {

                var termino = termino || "";
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.pagina_actual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            empresa_id: '03',
                            codigo_proveedor_id: $scope.orden_compra.get_proveedor().get_codigo_proveedor(),
                            laboratorio_id: $scope.laboratorio_id,
                            termino_busqueda: termino,
                            pagina_actual: $scope.pagina_actual
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.LISTAR_PRODUCTOS, "POST", obj, function(data) {

                    $scope.ultima_busqueda = $scope.termino_busqueda;
                    if (data.status === 200) {

                        $scope.cantidad_items = data.obj.lista_productos.length;
                        if (paginando && $scope.cantidad_items === 0) {
                            if ($scope.pagina_actual > 0) {
                                $scope.pagina_actual--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        that.render_productos(data.obj.lista_productos);
                    }
                });
            };


            that.gestionar_orden_compra = function() {

                if ($scope.orden_compra.get_numero_orden() === 0) {
                    //Crear Orden de Compra y Agregar Productos
                    that.insertar_cabercera_orden_compra(function(continuar) {
                        if (continuar) {
                            that.insertar_detalle_orden_compra();
                        }
                    });
                } else {
                    // Agregar Productos a Orden de Compra
                    that.insertar_detalle_orden_compra();
                }

            };


            that.insertar_cabercera_orden_compra = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            unidad_negocio: $scope.orden_compra.get_unidad_negocio().get_codigo(),
                            codigo_proveedor: $scope.orden_compra.get_proveedor().get_codigo_proveedor(),
                            empresa_id: '03',
                            observacion: $scope.orden_compra.get_observacion()
                        }
                    }
                };


                Request.realizarRequest(API.ORDENES_COMPRA.CREAR_ORDEN_COMPRA, "POST", obj, function(data) {


                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200 && data.obj.numero_orden > 0) {
                        $scope.orden_compra.set_numero_orden(data.obj.numero_orden);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            that.insertar_detalle_orden_compra = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra.get_numero_orden(),
                            codigo_producto: $scope.producto_seleccionado.getCodigoProducto(),
                            cantidad_solicitada: $scope.producto_seleccionado.get_cantidad_seleccionada(),
                            valor: $scope.producto_seleccionado.get_costo(),
                            iva: $scope.producto_seleccionado.get_iva()
                        }
                    }
                };


                Request.realizarRequest(API.ORDENES_COMPRA.CREAR_DETALLE_ORDEN_COMPRA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);
                });
            };


            that.render_laboratorios = function(laboratorios) {

                $scope.Empresa.limpiar_laboratorios();
                laboratorios.forEach(function(data) {

                    var laboratorio = Laboratorio.get(data.laboratorio_id, data.descripcion_laboratorio);
                    $scope.Empresa.set_laboratorios(laboratorio);
                });
            };


            that.render_productos = function(productos) {

                $scope.Empresa.limpiar_productos();
                productos.forEach(function(data) {
                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, data.cantidad, data.iva, data.costo_ultima_compra, data.tiene_valor_pactado, data.presentacion);
                    $scope.Empresa.set_productos(producto);
                });
            };


            $scope.buscador_productos = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    that.buscar_productos(termino_busqueda);
                }
            };


            $scope.seleccionar_laboratorio = function() {
                that.buscar_productos($scope.termino_busqueda);
            };


            $scope.lista_productos = {
                data: 'Empresa.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "20%"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "15%", cellFilter: "currency:'$ '"},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", enableCellEdit: true, cellFilter: "number"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-toolbar">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto(row.entity)" ><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="solicitar_producto(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };


            $scope.$on('ngGridEventEndCellEdit', function(event) {

                //var producto = event.targetScope.row.entity;
                //producto.set_cantidad_seleccionada(event.targetScope.row.entity[event.targetScope.col.field]);
            });

            $scope.solicitar_producto = function(producto) {

                producto.set_cantidad_seleccionada(producto.cantidad);

                $scope.producto_seleccionado = producto;

                $scope.orden_compra.set_productos(producto);

                that.gestionar_orden_compra();
            };


            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                that.buscar_productos($scope.termino_busqueda, true);
            };


            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                that.buscar_productos($scope.termino_busqueda, true);
            };


            $scope.calcular_valores_producto = function(producto) {


                producto.set_cantidad_seleccionada(producto.cantidad);

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/genererarordenes/calcularvaloresproducto.html',
                    controller: "CalcularValoresProductoController",
                    resolve: {
                        producto_seleccionado: function() {
                            return producto;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };


            /*$scope.cerrar = function() {

                $scope.$emit('cerrar_gestion_productos', {animado: true});

            };*/


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});