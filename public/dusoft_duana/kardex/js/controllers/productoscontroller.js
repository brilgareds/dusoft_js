
define(["angular", "js/controllers", '../../../../includes/slide/slideContent', "controllers/MovimientoController"], function(angular, controllers) {

    var fo = controllers.controller('productoscontroller', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', 'Empresa',
        'ProductoMovimiento', '$modal', "API",
        "AlertService", 'localStorageService', "Usuario",
        "socket",
        function($scope, $rootScope, Request, $filter, $state, Empresa, ProductoMovimiento, $modal, API, AlertService, localStorageService, Usuario, socket) {

            $scope.Empresa = Empresa;
            var fechaActual = new Date();
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.paginaactual = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda  = "";

            $scope.slideurl = "views/kardex.html";


          //  $scope.fechainicial = new Date((fechaActual.getMonth() + 1)+"/01/" + (fechaActual.getFullYear() -1));
            $scope.fechainicial = new Date("01/01/" + fechaActual.getFullYear());
            $scope.fechafinal = fechaActual;
            $scope.abrirfechafinal = false;
            
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.buscarProductos = function(termino_busqueda,paginando) {

                if($scope.ultima_busqueda != $scope.termino_busqueda){
                    $scope.paginaactual = 0;
                }

                Request.realizarRequest(
                        API.KARDEX.LISTAR_PRODUCTOS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                kardex: {
                                    termino_busqueda: termino_busqueda,
                                    pagina_actual:$scope.paginaactual 
                                }
                            }
                        },
                function(data) {
                    if (data.status == 200) {
                        $scope.ultima_busqueda = $scope.termino_busqueda;
                        $scope.renderProductos(data.obj, paginando);
                    }
                }
                );
            };

            $scope.renderProductos = function(data, paginando) {


                $scope.items = data.lista_productos.length;
                //se valida que hayan registros en una siguiente pagina
                if(paginando && $scope.items == 0){
                    if($scope.paginaactual > 0){
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning","No se encontraron mas registros");
                    return;
                }

                $scope.Empresa.vaciarProductos();
                $scope.paginas = (data.lista_productos.length / 10);
                $scope.items = data.lista_productos.length;
                for (var i in data.lista_productos) {
                    var obj = data.lista_productos[i];
                    var producto = ProductoMovimiento.get(
                            obj.codigo_producto,
                            obj.nombre_producto,
                            obj.existencia,
                            obj.precio_venta,
                            obj.existencia_total,
                            obj.costo,
                            obj.costo_ultima_compra,
                            obj.porc_iva,
                            obj.descuadre
                    );

                    $scope.Empresa.agregarProducto(
                            producto
                    );
                }

            };


            $scope.gridOptions = {
                data: 'Empresa.getProductos()',
                multiSelect: false,
                enableHighlighting:true,
                /*afterSelectionChange:function(row){
                    if(row.selected){
                        $scope.onRowClick(row)
                    }
                },*/
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width: "10%"},
                    {field: 'descripcion', displayName: 'Nombre'},
                    {field: 'existencia', displayName: 'Existencia', width: "7%"},
                    {field: 'costo', displayName: 'Costo', width: "7%"},
                    {field: 'costo_ultima_compra', displayName: 'Costo Ultima Compra', width: "12%"},
                    {field: 'precio', displayName: 'Precio', width: "7%"},
                    {field: 'porc_iva', displayName: 'Iva', width: "5%"},
                    {field: 'movimiento', displayName: "Movimiento", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'}]

            };


            $scope.onRowClick = function(row) {
                console.log($filter('date')($scope.fechainicial, "yyyy-MM-dd"));
                console.log($filter('date')($scope.fechafinal, "yyyy-MM-dd"));
                $scope.slideurl = "views/kardex.html?time="+new Date().getTime();;

                if ($scope.fechafinal == null || $scope.fechainicial == null) {
                    AlertService.mostrarMensaje("danger", "Las fechas son invalidas");
                    return;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        kardex: {
                            fecha_inicial: $filter('date')($scope.fechainicial, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.fechafinal, "yyyy-MM-dd")+ " 23:59:00",
                            codigo_producto: row.entity.codigo_producto
                        }
                    }
                };

                Request.realizarRequest(
                        API.KARDEX.OBTENER_MOVIMIENTO,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status == 200) {
                                if (data.obj.movimientos_producto.length > 0) {
                                    $scope.$emit('mostrarslide', row.entity, data.obj);
                                } else {
                                    AlertService.mostrarMensaje("warning", "El producto no tiene movimientos");
                                }

                            }
                        }
                );

            };

            $scope.cerrar = function() {
                $scope.$emit('cerrarslide');
            };

            //eventos

            //eventos de widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                if (ev.which == 13) {
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
                if($scope.fechainicial > $scope.fechafinal){
                    console.log($scope.fechafinal)
                    $scope.fechafinal = $scope.fechainicial;
                }
                
                
            };

            $scope.fechafinalselected = function() {
                $scope.fechainicial = $scope.fechafinal;
            };


            $scope.paginaAnterior = function(){
                $scope.paginaactual--;
                $scope.buscarProductos($scope.termino_busqueda,true);
            };

            $scope.paginaSiguiente = function(){
                $scope.paginaactual++;
                $scope.buscarProductos($scope.termino_busqueda,true);
            };

            //eventos del sistema
            $rootScope.$on("cerrarSesion", $scope.cerrarSesion);

            $scope.buscarProductos("");


        }]);
});