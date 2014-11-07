
define(["angular", "js/controllers",
    "models/EmpresaOrdenCompra",
    "models/OrdenCompraPedido",
    "models/ProductoOrdenCompra",
    "models/Laboratorio"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        "EmpresaOrdenCompra",
        "OrdenCompraPedido",
        "ProductoOrdenCompra",
        "Laboratorio",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Empresa, OrdenCompra, Producto, Laboratorio, Sesion) {

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

            // Variable para paginación
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;


            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {

                $scope.numero_orden = parametros[1].numero_orden;
                $scope.unidad_negocio_id = parametros[1].unidad_negocio_id;
                $scope.codigo_proveedor_id = parametros[1].codigo_proveedor_id;
                $scope.observacion = parametros[1].observacion;
                
                
                $scope.orden_compra = OrdenCompra.get($scope.numero_orden, 1, $scope.observacion, new Date());
                $scope.orden_compra.set_unidad_negocio($scope.Empresa.get_unidad_negocio($scope.unidad_negocio_id));
                $scope.orden_compra.set_proveedor($scope.Empresa.get_proveedor($scope.codigo_proveedor_id));
                
                
                console.log('=========== ORDEN COMPRA ==============');
                console.log($scope.orden_compra);
                

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
                            codigo_proveedor_id: $scope.codigo_proveedor_id,
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
            
            
            that.crear_orden_compra = function(cabecera, detalle){
                
            };
            
            that.generar_cabercera_orden_compra = function(cabecera){
                
            };
            
            that.generar_detalle_orden_compra = function(detalle){
                
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
                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, data.cantidad, data.iva, data.costo_ultima_compra, data.tiene_valor_pactado);
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
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto()" ><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                        </div>'}
                ]
            };

            
            $scope.$on('ngGridEventEndCellEdit', function(event) {

                var producto = event.targetScope.row.entity;
                producto.set_cantidad_seleccionada(event.targetScope.row.entity[event.targetScope.col.field]);
                
            });
            

            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                that.buscar_productos($scope.termino_busqueda, true);
            };

            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                that.buscar_productos($scope.termino_busqueda, true);
            };


            $scope.calcular_valores_producto = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/genererarordenes/calcularvaloresproducto.html',
                    controller: "CalcularValoresProductoController"
                };

                var modalInstance = $modal.open($scope.opts);
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});