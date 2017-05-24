
define(["angular", "js/controllers", 'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('HomologacionProductosController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', 'EmpresaKardex',
        'ProductoMovimiento', '$modal', "API",
        "AlertService", 'localStorageService', "Usuario",
        function($scope, $rootScope, Request,
                $filter, $state, Empresa, ProductoMovimiento,
                $modal, API, AlertService, localStorageService,
                Usuario) {

            var that = this;
            $scope.EmpresasProductos = [];
            $scope.paginaactual = 1;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";

            $scope.filtro = {};

            $scope.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.buscarProductos = function(termino_busqueda, paginando) {
                
                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                Request.realizarRequest(
                    API.KARDEX.LISTAR_HOMOLOGACION_PRODUCTOS,
                    "POST",
                    {
                        session: $scope.session,
                        data: {
                            productos: {
                                pagina: $scope.paginaactual,
                                empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                                termino_busqueda: termino_busqueda
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
                $scope.EmpresasProductos = [];
                $scope.items = data.lista_productos.length;
                
                for (var i in data.lista_productos) {
                    var obj = data.lista_productos[i];
                    
                    var producto = ProductoMovimiento.get(
                            obj.codigo_duana,
                            obj.descripcion_duana
                    ); 
            
                    producto.setDescripcionCodigoMedipol(obj.descripcion_medipol).
                    setCodigoMedipol(obj.codigo_medipol).setUbicacion(obj.torre);

                    $scope.EmpresasProductos.push(producto);
                }

            };


            $scope.listaProductos = {
                data: 'EmpresasProductos',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    //{field: 'getCodigoMedipol()', displayName: 'Código Medipol'},
                    {field: 'getDescripcionCodigoMedipol()', displayName: 'Producto Medipol'},
                    //{field: 'getCodigoProducto()', displayName: 'Código Duana'},
                    {field: 'getDescripcion()', displayName: 'Producto Duana'},
                    {field: 'getUbicacion()', displayName: 'Ubicación', width:"100"}
                ]

            };

            $scope.onBuscarProducto = function(ev, termino_busqueda) {
                if (ev.which === 13) {
                    $scope.paginaactual = 1;
                    $scope.buscarProductos(termino_busqueda);
                }
            };


            $scope.paginaAnterior = function() {
                if($scope.paginaactual === 1) return;
                $scope.paginaactual--;
                $scope.buscarProductos($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarProductos($scope.termino_busqueda, true);
            };

            //eventos del sistema
            $rootScope.$on("cerrarSesion", $scope.cerrarSesion);

            $scope.buscarProductos("");

        }]);
});