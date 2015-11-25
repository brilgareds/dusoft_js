
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
            
            $scope.filtros = [
                {nombre : "Descripcion", descripcionProducto:true},                
                {nombre : "Codigo", codigoProducto:true},
                {nombre : "Unidad venta", unidadVenta:true},
                {nombre : "Molecula", molecula:true}
            ];
            
            $scope.filtro  = $scope.filtros[0];
            

            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {

                that.buscar_productos();
                that.buscar_laboratorios();
            });

            $rootScope.$on('cerrar_gestion_productosCompleto', function(e, parametros) {

                $scope.Empresa.limpiar_productos();
                $scope.Empresa.limpiar_laboratorios();
                $scope.termino_busqueda = "";

                $scope.$$watchers = null;
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
                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.pagina_actual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra.get_numero_orden(),
                            filtro:$scope.filtro,
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
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


            $scope.gestionar_orden_compra = function(callback) {

                if ($scope.orden_compra.get_numero_orden() === 0) {
                    //Crear Orden de Compra y Agregar Productos
                    that.insertar_cabercera_orden_compra(function(continuar) {
                        if (continuar) {
                            that.insertar_detalle_orden_compra(function(resultado) {
                                callback(resultado);
                            });
                        }
                    });
                } else {
                    // Agregar Productos a Orden de Compra
                    that.insertar_detalle_orden_compra(function(resultado) {
                        callback(resultado);
                    });
                }

            };


            that.insertar_cabercera_orden_compra = function(callback) {
                var bodegaDestino = null;
                console.log("bodega seleccionada ", $scope.bodegaSeleccionada);
                if($scope.bodegaSeleccionada){
                    bodegaDestino = {
                        bodega : $scope.bodegaSeleccionada.getCodigo(),
                        empresaId : $scope.bodegaSeleccionada.getEmpresaId(),
                        centroUtilidad : $scope.bodegaSeleccionada.getCentroUtilidad()
                    };
                }
                
                
                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            unidad_negocio: $scope.orden_compra.get_unidad_negocio().get_codigo(),
                            codigo_proveedor: $scope.orden_compra.get_proveedor().get_codigo_proveedor(),
                            //empresa_id: '03',
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            observacion: $scope.orden_compra.get_observacion(),
                            bodegaDestino : bodegaDestino
                        }
                    }
                };


                Request.realizarRequest(API.ORDENES_COMPRA.CREAR_ORDEN_COMPRA, "POST", obj, function(data) {


                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200 && data.obj.numero_orden > 0) {
                        $scope.orden_compra.set_numero_orden(data.obj.numero_orden);
                        localStorageService.add("numero_orden", $scope.orden_compra.get_numero_orden());
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            that.insertar_detalle_orden_compra = function(callback) {

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

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            that.render_laboratorios = function(laboratorios) {

                $scope.Empresa.limpiar_laboratorios();

                var laboratorio = Laboratorio.get("", "-- TODOS --");
                $scope.Empresa.set_laboratorios(laboratorio);

                laboratorios.forEach(function(data) {

                    laboratorio = Laboratorio.get(data.laboratorio_id, data.descripcion_laboratorio);
                    $scope.Empresa.set_laboratorios(laboratorio);
                });
            };


            that.render_productos = function(productos) {

                $scope.Empresa.limpiar_productos();
                productos.forEach(function(data) {
                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, '', data.iva, data.costo_ultima_compra, data.tiene_valor_pactado, data.presentacion, data.cantidad);
                    producto.set_regulado(data.sw_regulado);
                    $scope.Empresa.set_productos(producto);
                });
            };


            $scope.buscador_productos = function(ev, termino_busqueda) {
                if (ev.which === 13) {
                    that.buscar_productos(termino_busqueda);
                }
            };


            $scope.seleccionar_laboratorio = function(laboratorio) {

                $scope.laboratorio_id = "";
                if (laboratorio !== undefined)
                    $scope.laboratorio_id = laboratorio.get_id();

                that.buscar_productos($scope.termino_busqueda);
            };


            $scope.lista_productos = {
                data: 'Empresa.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                //enableCellEditOnFocus: true,
                enableCellEdit: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "20%", enableCellEdit: false},
                    {field: 'descripcion', displayName: 'Descripcion', enableCellEdit: false},
                    /*{field: 'costo_ultima_compra', displayName: '$$ última compra..', width: "15%", cellFilter: "currency:'$ '", enableCellEdit: true,
                       editableCellTemplate: '<input ng-readonly="row.entity.tiene_valor_pactado == 1" placeholder="Costo ultima compra" ng-input="COL_FIELD" ng-model="COL_FIELD"  />',
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span class="label label-primary" ng-show="row.entity.regulado == 1" >Reg</span>\
                                            <span class="label label-danger" ng-show="row.entity.tiene_valor_pactado == 0">S.C</span>\
                                            <span class="label label-success" ng-show="row.entity.tiene_valor_pactado == 1">C.C</span>\
                                            <span ng-cell-text class="pull-right" >{{COL_FIELD | currency:"$ "}}</span>\
                                        </div>'},*/
                    {field: 'costo_ultima_compra', displayName: '$$ última compra..', width: "15%", cellFilter: "currency:'$ '", enableCellEdit: true,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span class="label label-primary" ng-show="row.entity.regulado == 1" >Reg</span>\
                                            <span class="label label-danger" ng-show="row.entity.tiene_valor_pactado == 0">S.C</span>\
                                            <span class="label label-success" ng-show="row.entity.tiene_valor_pactado == 1">C.C</span>\
                                            <span ng-cell-text class="pull-right" >{{COL_FIELD | currency:"$ "}}</span>\
                                        </div>'},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", enableCellEdit: true, cellFilter: "number"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center", enableCellEdit: false,
                        cellTemplate: '<div class="btn-toolbar">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto(row)" ><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="solicitar_producto(row)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };


            $scope.$on('ngGridEventEndCellEdit', function(event) {

            });

            $scope.solicitar_producto = function(row) {

                var producto = row.entity;

                if (parseInt(producto.cantidad) > 0 && parseFloat(producto.costo_ultima_compra) > 0) {
                    producto.set_cantidad_seleccionada(producto.cantidad);

                    $scope.producto_seleccionado = producto;

                    $scope.orden_compra.set_productos(producto);

                    $scope.gestionar_orden_compra(function(resultado) {

                        if (resultado) {
                            // Remover producto seleccionado
                            var index = row.rowIndex;
                            $scope.lista_productos.selectItem(index, false);
                            $scope.Empresa.get_productos().splice(index, 1);
                        }
                    });
                } else {
                    AlertService.mostrarMensaje("warning", "Cantidad solicitada o costo del producto es invalida");
                    return;
                }

            };


            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                that.buscar_productos($scope.termino_busqueda, true);
            };


            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                that.buscar_productos($scope.termino_busqueda, true);
            };


            $scope.calcular_valores_producto = function(row) {

                var producto = row.entity;
                var index = row.rowIndex;
                producto.set_cantidad_seleccionada(producto.cantidad);

                $scope.producto_seleccionado = producto;

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/genererarordenes/calcularvaloresproducto.html',
                    controller: "CalcularValoresProductoController",
                    scope: $scope,
                    resolve: {
                        index: function() {
                            return index;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            $scope.onSeleccionFiltro = function(filtro){
                $scope.filtro = filtro;
            };


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});