
define(["angular", "js/controllers",
    "models/OrdenCompraPedido",
    "models/EmpresaOrdenCompra",
    "models/ProveedorOrdenCompra",
    "models/UnidadNegocio",
    "models/UsuarioOrdenCompra",
], function(angular, controllers) {

    controllers.controller('ListarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "UsuarioOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, OrdenCompra, Empresa, Proveedor, UnidadNegocio, Usuario, Sesion) {

            var that = this;

            $scope.Empresa = Empresa.get();

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };

            // Variables
            var fecha_actual = new Date()
            $scope.fecha_inicial = $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd");
            $scope.fecha_final = $filter('date')(fecha_actual, "yyyy-MM-dd");

            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;


            $scope.buscar_ordenes_compras = function(termino, paginando) {

                var termino = termino || "";

                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.pagina_actual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            fecha_inicial: $filter('date')($scope.fecha_inicial, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.fecha_final, "yyyy-MM-dd") + " 23:59:00",
                            termino_busqueda: termino,
                            pagina_actual: $scope.pagina_actual
                        }
                    }
                };

                console.log('=== Request ===');
                console.log(obj);

                Request.realizarRequest(API.ORDENES_COMPRA.LISTAR_ORDENES_COMPRAS, "POST", obj, function(data) {

                    $scope.ultima_busqueda = $scope.termino_busqueda;

                    if (data.status === 200) {

                        $scope.cantidad_items = data.obj.ordenes_compras.length;

                        if (paginando && $scope.cantidad_items === 0) {
                            if ($scope.pagina_actual > 0) {
                                $scope.pagina_actual--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }


                        that.render_ordenes_compras(data.obj.ordenes_compras);
                    }
                });
            };

            that.render_ordenes_compras = function(ordenes_compras) {

                console.log('====== Resultado Request ======');
                console.log(ordenes_compras);

                $scope.Empresa.limpiar_ordenes_compras();

                ordenes_compras.forEach(function(orden) {

                    var orden_compra = OrdenCompra.get(orden.numero_orden, orden.estado, orden.observacion, orden.fecha_registro);

                    orden_compra.setProveedor(Proveedor.get(orden.tipo_id_proveedor, orden.nit_proveedor, orden.codigo_proveedor_id, orden.nombre_proveedor, orden.direccion_proveedor, orden.telefono_proveedor));

                    orden_compra.setUnidadNegocio(UnidadNegocio.get(orden.codigo_unidad_negocio, orden.descripcion_unidad_negocio, orden.imagen));

                    orden_compra.setUsuario(Usuario.get(orden.usuario_id, orden.nombre_usuario));

                    $scope.Empresa.set_ordenes_compras(orden_compra);

                });

                console.log('======= Objetos OC ========');
                console.log($scope.Empresa);

            };

            $scope.buscador_ordenes_compras = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscar_ordenes_compras(termino_busqueda);
                }
            };

            $scope.lista_ordenes_compras = {
                data: 'Empresa.get_ordenes_compras()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_orden_compra', displayName: '# Orden', width: "7%"},
                    {field: 'proveedor.nombre_tercero', displayName: 'Proveedor'},
                    {field: 'proveedor.direccion', displayName: 'Ubicacion', width: "20%"},
                    {field: 'proveedor.telefono', displayName: 'Telefono', width: "10%"},
                    {field: 'fecha_registro', displayName: "F. Registro", width: "7%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="#" ng-click="gestionar_orden_compra()" >Modificar</a></li>\
                                                <li><a href="#">Imprimir</a></li>\
                                                <li><a href="#">Enviar Email</a></li>\
                                                <li class="divider"></li>\
                                                <li><a href="#">Inactivar</a></li>\
                                                <li><a href="#">Eliminar</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };

            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                $scope.buscar_ordenes_compras($scope.termino_busqueda, true);
            };

            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                $scope.buscar_ordenes_compras($scope.termino_busqueda, true);
            };

            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                console.log($scope.fecha_inicial)
            };

            $scope.gestionar_orden_compra = function() {
                $state.go('GestionarOrdenCompra');
            };

            $scope.buscar_ordenes_compras();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});