
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
            var fechaActual = new Date();
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.paginaactual = 1;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.listaEmpresas = [];
            $scope.listaCentroUtilidad = [];
            $scope.listaBodegas = [];
            $scope.slideurl = "";

            $scope.filtro = {};

            //  $scope.fechainicial = new Date((fechaActual.getMonth() + 1)+"/01/" + (fechaActual.getFullYear() -1));
            $scope.fechainicial = $filter('date')(new Date("01/01/" + fechaActual.getFullYear()), "yyyy-MM-dd");
            $scope.fechafinal = $filter('date')(fechaActual, "yyyy-MM-dd");
            $scope.abrirfechafinal = false;

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
                /*afterSelectionChange:function(row){
                 if(row.selected){
                 $scope.onRowClick(row)
                 }
                 },*/
                columnDefs: [
                    {field: 'empresa.nombre', displayName: 'Empresa'},
                    {field: 'empresa.getCentroUtilidadSeleccionado().getNombre()', displayName: 'Centro Utilidad'},
                    {field: 'empresa.getCentroUtilidadSeleccionado().getBodegas()[0].getNombre()', displayName: 'Farmacia'},
                    {field: 'producto.codigo_producto', displayName: 'Codigo', width: "10%"},
                    {field: 'producto.descripcion', displayName: 'Nombre', width:500},
                    {field: 'producto.existencia', displayName: 'Existencia', width: "10%"}]

            };


            $scope.onRowClick = function(row) {
                //console.log($filter('date')($scope.fechainicial, "yyyy-MM-dd"));
                //console.log($filter('date')($scope.fechafinal, "yyyy-MM-dd"));
                $scope.slideurl = "views/movimientos/kardex.html?t=" + new Date().getTime();

                if ($scope.fechafinal === null || $scope.fechainicial === null) {
                    AlertService.mostrarMensaje("danger", "Las fechas son invalidas");
                    return;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        kardex: {
                            fecha_inicial: $filter('date')($scope.fechainicial, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.fechafinal, "yyyy-MM-dd") + " 23:59:00",
                            codigo_producto: row.entity.codigo_producto,
                            empresa_id: $scope.filtro.empresa_seleccion,
                            centro_utilidad: $scope.filtro.centro_seleccion,
                            bodega_id: $scope.filtro.bodega_seleccion
                        }
                    }
                };

                Request.realizarRequest(
                        API.KARDEX.OBTENER_MOVIMIENTO,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                if (data.obj.movimientos_producto.length > 0) {

                                    /*console.log('===== data.obj ======');
                                     console.log(data.obj);*/

                                    $scope.$emit('mostrardetallekardex', row.entity, data.obj);
                                } else {
                                    AlertService.mostrarMensaje("warning", "El producto no tiene movimientos");
                                }

                            }
                        }
                );

            };

            that.traerEmpresas = function(callback) {

                $scope.listaEmpresas = [];
                $scope.listaCentroUtilidad = [];
                $scope.listaBodegas = [];

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

            $scope.onCentroSeleccionado = function() {
            };

            $scope.cerrar = function() {
                $scope.$emit('cerrardetallekardex');
            };

            //eventos

            //eventos de widgets
            $scope.onBuscarProducto = function(ev, termino_busqueda) {
                if (ev.which === 13) {
                    $scope.paginaactual = 1;
                    $scope.buscarProductos(termino_busqueda);
                }
            };

            $scope.abrirFechaInicial = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.abrirfechainicial = true;
                $scope.abrirfechafinal = false;


                console.log($scope.fechainicial)
            };

            $scope.abrirFechaFinal = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.abrirfechafinal = true;
                $scope.abrirfechainicial = false;
            };

            $scope.fechainicialselected = function() {
                if ($scope.fechainicial > $scope.fechafinal) {
                    console.log($scope.fechafinal);
                    $scope.fechafinal = $scope.fechainicial;
                }


            };

            $scope.fechafinalselected = function() {
                $scope.fechainicial = $scope.fechafinal;
            };


            $scope.paginaAnterior = function() {
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
                    $timeout(function() {
                        $scope.filtro.centro_seleccion = '1 ';

                            $timeout(function() {
                                $scope.filtro.bodega_seleccion = '03';
                                $scope.buscarProductos("");
                            });

                    });
                });

            });


        }]);
});