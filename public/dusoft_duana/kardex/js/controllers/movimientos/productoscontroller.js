
define(["angular", "js/controllers", 'includes/slide/slideContent', 
        "controllers/movimientos/MovimientoController", "includes/components/trasladoexistencias/TrasladoExistenciasController"], function(angular, controllers) {

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
            $scope.paginaactual = 1;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.listaEmpresas = [];
            $scope.listaCentroUtilidad = [];
            $scope.listaBodegas = [];
            $scope.slideurl = "";

            $scope.filtro = {};
            
            $scope.filtros = [
                {nombre : "Descripcion", tipo_busqueda:0}, 
                {nombre : "Molecula", tipo_busqueda:1},
                {nombre : "Codigo", tipo_busqueda:2}
            ];
            
            $scope.filtroProducto = $scope.filtros[0];
            
           
            $scope.fechainicial = $filter('date')(new Date("01/01/"  + fechaActual.getFullYear()), "yyyy-MM-dd");
            $scope.fechafinal = $filter('date')(fechaActual, "yyyy-MM-dd");
            $scope.abrirfechafinal = false;

            $scope.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            that.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            //permisos kardex
            $scope.opcionesModulo = {
                columnaCosto: {
                    'visible': that.opciones.sw_ver_costo
                },
                columnaCostoUltimaCompra: {
                    'visible': that.opciones.sw_costo_ultima_compra
                },
                columnaCP: {
                    'visible': that.opciones.sw_cp
                },
                columnaPrecioVenta: {
                    'visible': that.opciones.sw_precio_venta_clinica
                },
                modificarExistencias:that.opciones.sw_modificar_existencias
            };
            
          
            
            $scope.buscarProductos = function(termino_busqueda, paginando) {

                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
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
                
                $scope.filtroProducto.termino = termino_busqueda;
                
                Request.realizarRequest(
                        API.KARDEX.LISTAR_PRODUCTOS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                kardex: {
                                    termino_busqueda: $scope.filtroProducto,
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
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
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
                    
                    producto.setPrecioContratacion(obj.valor_pactado);
                    producto.setTipoProductoId(obj.tipo_producto_id);
                    producto.setCodigoCum(obj.codigo_cum);
                    producto.setPrecioRegulado(obj.precio_regulado);
                    producto.setDescripcionMolecula(obj.descripcion_molecula);
                    producto.setCodigoInvima(obj.codigo_invima);
                    producto.setEstado(obj.estado);
                    producto.setExistenciaMinima(obj.existencia_minima);
                    producto.setExistenciaMaxima(obj.existencia_maxima);
                    
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
                enableColumnResize:true,
               /* groups:['existencia'],
                aggregateTemplate: "<div ng-click='row.toggleExpand(); saveGroupState()' ng-style='rowStyle(row)' class='ngAggregate ng-scope' style='top: 0px; height: 48px; left: 0px;'>"+
                    "<span class='ngAggregateText ng-binding'>"+
                        "{{row.label CUSTOM_FILTERS}} ({{row.totalChildren()}} {{AggItemsLabel}})"+
                    "</span>"+
                    "<div ng-class=\"{ 'ngAggArrowCollapsed':row.collapsed, 'ngAggArrowExpanded':!row.collapsed}\"></div>"+
                    "<button class='pull-right' style='margin-right:100px;' ng-click='onSelect(row)'>S</button>"+
                "</div>",*/
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "170",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span ng-cell-text >{{COL_FIELD}} </span>\
                                                <span class="glyphicon glyphicon-lock text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Nombre', 
                     cellTemplate: '<div class="ngCellText"   ng-class="col.colIndex()">{{row.entity.descripcion}} - {{row.entity.descripcionMolecula}}</div>' },
                    {field: 'codigoCum', displayName: 'Cum', width:"90", cellClass :"gridNumber"},
                    {field: 'existencia', displayName: 'Stock', width:"80", cellClass :"gridNumber",
                     cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                        <span class="glyphicon glyphicon-arrow-down  pull-left" style="color:red;" \
                                            ng-if="row.entity.existenciaMinima >= row.entity.existencia && row.entity.existenciaMinima > 0 ">\
                                        </span>\
                                         <span class="glyphicon glyphicon-arrow-up pull-left" \
                                            ng-if="row.entity.existenciaMaxima <= row.entity.existencia && row.entity.existenciaMaxima > 0 ">\
                                        </span>\
                                         {{row.entity.existencia}}   \
                                    </div>'
                    },  
                    {field: 'precioRegulado', displayName: 'P.Reg', width:"80",  cellClass :"gridNumber"},
                    {field: 'costo', displayName: 'Costo', width:"80", visible:$scope.opcionesModulo.columnaCosto.visible, cellClass :"gridNumber"},
                    {field: 'costo_ultima_compra', width:"80", displayName: 'C.U.C', visible:$scope.opcionesModulo.columnaCostoUltimaCompra.visible, cellClass :"gridNumber"},
                    {field: 'codigoInvima', width:"100", displayName: 'Invima', cellClass :"gridNumber"},
                   // {field: 'precio', width:"150", displayName: 'CP', visible:that.opcionesModulo.columnaPrecioVenta.visible, cellClass :"gridNumber"},
                    {field: 'precioContratacion', displayName: 'CP',  width: "80",visible:$scope.opcionesModulo.columnaCP.visible, cellClass :"gridNumber" },
                    {field: 'porc_iva', displayName: 'Iva', width: "50", cellClass :"gridNumber"},
                    {field: 'movimiento', displayName: "", cellClass: "txt-center dropdown-button", width: "70", 
                        cellTemplate: '\
                                        <div ng-if="!opcionesModulo.modificarExistencias">\
                                            <button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button>\
                                        </div>\
                                        <div class="btn-group" ng-if="opcionesModulo.modificarExistencias">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onRowClick(row)">Ver movimiento</a>\
                                            </li>\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onTrearExistencias(row.entity)">Modificar lotes</a>\
                                            </li>\
                                        </ul>\
                                    </div>'
                    }]

            };
            
            
            $scope.onSelect = function(row){
                console.log(">>>>>>>>>>>>>>>>>>", row);
            };
            
            $scope.saveGroupState = function () {
                var groups = $scope.gridOptions.$gridScope.renderedRows;
                for (var i = 0; i < groups.length; i++) {
                     localStorage.setItem("taskListGroup_" + groups[i].label, groups[i].collapsed);
                }
             }

            $scope.onSeleccionFiltro = function(filtro){
                $scope.filtroProducto = filtro;
            };
            
            $scope.onTrearExistencias = function(producto){ 
                
                var empresa = Usuario.getUsuarioActual().getEmpresa();
                var centro  = empresa.getCentroUtilidadSeleccionado();
                
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: '../includes/components/trasladoexistencias/listadoexistencias.html',
                    controller: "TrasladoExistenciasController",
                    resolve: {
                        producto: function() {
                            return producto;
                        },
                        centroUtilidad: function() {
                            return  centro.getCodigo();
                        },
                        bodega: function() {
                            return centro.getBodegaSeleccionada().getCodigo();
                        },
                        empresaId:function(){
                            return empresa.getCodigo();
                        }
                    }
                };
                
                var modalInstance = $modal.open($scope.opts);
                
                modalInstance.result.then(function() {
                    console.log("refrescar producto");

                }, function() {
                    
                });
                
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


                            $scope.$emit('mostrardetallekardex', row.entity, data.obj);

                           if(data.obj.movimientos_producto.length === 0)
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El producto no tiene movimientos");

                        }
                    }
                );

            };
            
           /*
            * @Author: Eduar
            * +Descripcion: Handler del boton seleccionar empresa
            */
            $scope.onSeleccionarEmpresa = function(){
                $scope.opts = {
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    templateUrl:'views/movimientos/seleccionEmpresa.html',
                    scope: $scope,
                        controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                            $scope.onCerrar = function(acepto) {
                                $modalInstance.close();
                            };
                        }]
                    };

                  var modalInstance = $modal.open($scope.opts);
                  
                  modalInstance.result.then(function() {
                     $scope.paginaactual = 1;
                     $scope.buscarProductos($scope.termino_busqueda);

                  }, function() {
                      
                  });
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


                console.log($scope.fechainicial);
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