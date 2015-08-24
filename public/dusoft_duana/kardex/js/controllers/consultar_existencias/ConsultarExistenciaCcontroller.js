
define(["angular", "js/controllers", 'includes/slide/slideContent', "controllers/movimientos/MovimientoController"], function(angular, controllers) {

    var fo = controllers.controller('ConsultarExistenciaCcontroller', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', 'EmpresaKardex',
        'ProductoMovimiento', '$modal', "API",
        "AlertService", 'localStorageService', "Usuario",
        "socket", "CentroUtilidad", "Bodega", "$timeout",
        function($scope, $rootScope, Request,
                $filter, $state, Empresa, ProductoMovimiento,
                $modal, API, AlertService, localStorageService,
                Usuario, socket, CentroUtilidad, Bodega, $timeout) {

            var that = this;
            $scope.Empresa = Empresa.get("DUANA LTDA", "03");
            $scope.EmpresasProductos = [];
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.paginaactual = 1;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.listaEmpresas = [];

            $scope.filtro = {};

            $scope.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.buscarProductos = function(termino_busqueda, paginando) {
                
                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                if ($scope.filtro.empresa_seleccion === "") {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar una empresa");
                    return;
                }


                Request.realizarRequest(
                        API.KARDEX.CONSULTAR_EXISTENCIAS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                kardex: {
                                    termino_busqueda: termino_busqueda,
                                    pagina_actual: $scope.paginaactual,
                                    empresa_id: ($scope.filtro.empresa_seleccion === '-1')? "" : $scope.filtro.empresa_seleccion
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


                $scope.items = data.lista_productos.length;
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.EmpresasProductos = [];
                $scope.paginas = (data.lista_productos.length / 10);
                $scope.items = data.lista_productos.length;
                
                for (var i in data.lista_productos) {
                    var obj = data.lista_productos[i];
                    
                    var producto = ProductoMovimiento.get(
                            obj.codigo_producto,
                            obj.descripcion_producto,
                            obj.existencia
                    );
                        
                    var centro = CentroUtilidad.get(obj.centro);
                    var bodega = Bodega.get(obj.bodega);
                    centro.agregarBodega(bodega);
                    producto.setTipoProductoId(obj.tipo_producto_id);
                    
                    var empresa = Empresa.get(obj.razon_social, obj.empresa_id);
                    empresa.setCentroUtilidadSeleccionado(centro);

                    $scope.EmpresasProductos.push({
                         empresa:empresa,
                         producto:producto
                    });
                }

            };


            $scope.listaProductos = {
                data: 'EmpresasProductos',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'empresa.nombre', displayName: 'Empresa'},
                    {field: 'empresa.getCentroUtilidadSeleccionado().getNombre()', displayName: 'Centro Utilidad'},
                    {field: 'empresa.getCentroUtilidadSeleccionado().getBodegas()[0].getNombre()', displayName: 'Farmacia'},
                    {field: 'producto.codigo_producto', displayName: 'Código', width: "130",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.producto.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.producto.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.producto.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.producto.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.producto.getTipoProductoId() == 5">Ne</span>\
                                                <span ng-cell-text >{{COL_FIELD}}</span>\
                                            </div>'
                    },
                    {field: 'producto.descripcion', displayName: 'Nombre', width:500},
                    {field: 'producto.existencia', displayName: 'Existencia', width: "10%", cellClass :"gridNumber"}
                ]

            };

            that.traerEmpresas = function(callback) {

                $scope.listaEmpresas = [];

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_farmacias:{
                            permisos_kardex:true
                        }
                    }
                };

                Request.realizarRequest(API.KARDEX.LISTAR_EMPRESAS_FARMACIAS, "POST", obj, function(data) {
                    $scope.listaEmpresas.push(Empresa.get("TODAS LAS EMPRESAS",-1));
                    if (data.status === 200) {
                        for (var i in data.obj.empresas) {
                            var empresa = Empresa.get(
                                    data.obj.empresas[i].razon_social,
                                    data.obj.empresas[i].empresa_id
                             );

                            $scope.listaEmpresas.push(empresa);
                        }

                        if (callback)
                            callback();
                    }

                });

            };


            $scope.onEmpresaSeleccionada = function() {
               // that.consultarCentrosUtilidadPorEmpresa();
            };


            //eventos

            //eventos de widgets
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



            that.traerEmpresas(function() {
                $timeout(function() {
                    $scope.filtro.empresa_seleccion = '03';
                     $scope.buscarProductos("");
                });

            });


        }]);
});