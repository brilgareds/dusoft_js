
define(["angular", "js/controllers", 'includes/slide/slideContent', "controllers/movimientos/MovimientoController"], function(angular, controllers) {

    var fo = controllers.controller('productoscontroller', [
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
            var fechaActual = new Date();
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.paginaactual = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.listaEmpresas = [];
            $scope.listaCentroUtilidad = [];
            $scope.listaBodegas = [];
            $scope.slideurl = "";

            $scope.filtro = {};
            
           
            $scope.fechainicial = $filter('date')(new Date("05/01/" + fechaActual.getFullYear()), "yyyy-MM-dd");
            $scope.fechafinal = $filter('date')(fechaActual, "yyyy-MM-dd");
            $scope.abrirfechafinal = false;

            $scope.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            that.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            
            //permisos kardex
            that.opcionesModulo = {
                columnaCosto: {
                    'visible': that.opciones.sw_ver_costo
                },
                columnaCostoUltimaCompra: {
                    'visible': that.opciones.sw_costo_ultima_compra
                },
                columnaPrecioVenta: {
                    'visible': that.opciones.sw_precio_venta_clinica
                }        
            };

            $scope.buscarProductos = function(termino_busqueda, paginando) {

                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 0;
                }

                if ($scope.filtro.empresa_seleccion === "") {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar una empresa");
                    return;
                }


                if ($scope.filtro.centro_seleccion === "") {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar un centro de utilidad");
                    return;
                }

                if ($scope.filtro.bodega_seleccion === "") {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar una bodega");
                    return;
                }
                Request.realizarRequest(
                        API.KARDEX.LISTAR_PRODUCTOS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                kardex: {
                                    termino_busqueda: termino_busqueda,
                                    pagina_actual: $scope.paginaactual,
                                    empresa_id: $scope.filtro.empresa_seleccion,
                                    centro_utilidad: $scope.filtro.centro_seleccion,
                                    bodega_id: $scope.filtro.bodega_seleccion
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
                    if ($scope.paginaactual > 0) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }
                console.log(data.lista_productos)
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
                    
                    producto.setPrecioContratacion(obj.precio);
                    producto.setTipoProductoId(obj.tipo_producto_id);
                    
                    $scope.Empresa.agregarProducto(
                            producto
                    );
                    
                }

            };


            $scope.gridOptions = {
                data: 'Empresa.getProductos()',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "130",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span ng-cell-text >{{COL_FIELD}}</span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Nombre'},
                    {field: 'existencia', displayName: 'Existencia', width:"100", cellClass :"gridNumber"},
                    {field: 'costo', displayName: 'Costo', width:"150", visible:that.opcionesModulo.columnaCosto.visible, cellClass :"gridNumber"},
                    {field: 'costo_ultima_compra', width:"150", displayName: 'Costo Ultima Compra', visible:that.opcionesModulo.columnaCostoUltimaCompra.visible, cellClass :"gridNumber"},
                   // {field: 'precio', width:"150", displayName: 'CP', visible:that.opcionesModulo.columnaPrecioVenta.visible, cellClass :"gridNumber"},
                    {field: 'precioContratacion', displayName: 'Precio'},
                    {field: 'porc_iva', displayName: 'Iva', width: "100", cellClass :"gridNumber"},
                    {field: 'movimiento', displayName: "Movimiento", cellClass: "txt-center", width: "100", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'}]

            };


            $scope.onRowClick = function(row) {
                
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

            that.consultarCentrosUtilidadPorEmpresa = function(callback) {

                $scope.listaCentroUtilidad = [];
                $scope.listaBodegas = [];
                $scope.filtro.centro_seleccion = "";
                $scope.filtro.bodega_seleccion = "";

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            empresa_id: $scope.filtro.empresa_seleccion
                        }
                    }
                };

                Request.realizarRequest(API.KARDEX.CENTROS_UTILIDAD_EMPRESAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("centros de utilidad ", data);
                        for (var i in data.obj.centros_utilidad) {
                            var centroUtilidad = CentroUtilidad.get(
                                    data.obj.centros_utilidad[i].descripcion,
                                    data.obj.centros_utilidad[i].centro_utilidad_id
                            );

                            $scope.listaCentroUtilidad.push(centroUtilidad);
                        }
                        if (callback)
                            callback();
                    }

                });
            };


            that.consultarBodegasPorEmpresa = function(callback) {

                $scope.listaBodegas = [];
                var obj = {
                    session: $scope.session,
                    data: {
                        bodegas: {
                            empresa_id: $scope.filtro.empresa_seleccion,
                            centro_utilidad_id: $scope.filtro.centro_seleccion
                        }
                    }
                };

                Request.realizarRequest(API.KARDEX.BODEGAS_EMPRESA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        for (var i in data.obj.bodegas) {
                            var bodega = Bodega.get(
                                    data.obj.bodegas[i].descripcion,
                                    data.obj.bodegas[i].bodega_id
                            );

                            $scope.listaBodegas.push(bodega);
                        }
                        if (callback)
                            callback();
                    }
                });
            };

            $scope.onEmpresaSeleccionada = function() {
                that.consultarCentrosUtilidadPorEmpresa();
            };

            $scope.onCentroSeleccionado = function() {
                that.consultarBodegasPorEmpresa();
            };

            $scope.cerrar = function() {
                $scope.$emit('cerrardetallekardex');
            };

            //eventos

            //eventos de widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                if (ev.which === 13) {
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
                    that.consultarCentrosUtilidadPorEmpresa(function() {

                        $timeout(function() {
                            $scope.filtro.centro_seleccion = '1 ';
                            that.consultarBodegasPorEmpresa(function() {

                                $timeout(function() {
                                    $scope.filtro.bodega_seleccion = '03';
                                    $scope.buscarProductos("");
                                });

                            });
                        });


                    });
                  
                });

            });


        }]);
});