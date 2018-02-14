
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('E009GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout", "$filter", "Usuario",
        "AlertService", "localStorageService", "$state", "EmpresaIngreso", "ProductoDevolucion",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, $filter, Sesion, AlertService, localStorageService, $state, Empresa, Producto) {

            var that = this;
            $scope.parametros = '';


            $rootScope.$on('gestionar_productosCompleto', function (e, parametros) {

                $scope.datos_form = {
                    listado_productos: [],
                    titulo: 'Buscar Productos'
                };


                $scope.parametros = parametros;

                $timeout(function () {
                    $scope.buscador_productos(true, '');
                }, 3);
            });


            /*
             * Descripcion: lista todos los productos existentes
             * @author Andres Mauricio Gonzalez
             * @fecha  05/06/2017
             * @param {type} termino
             * @returns {undefined}
             */
            that.listarProductos = function (parametros) {

                var obj = {
                    session: $scope.session,
                    data: parametros
                };

                Request.realizarRequest(API.E009.LISTAR_PRODUCTOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductos(data.obj.listarProductos);
                    }
                });
            };

            that.renderProductos = function (productos) {
                $scope.datos_form.listado_productos = [];
                productos.forEach(function (data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.existencia).toFixed(), data.tipo_producto_id, data.subClase);
                    $scope.datos_form.listado_productos.push(producto);
                });
            };

            $scope.filtroNombre = {nombre: "Seleccionar", id: -1};

            $scope.onSeleccionFiltro = function (filtro) {
                $scope.filtroNombre.nombre = filtro.nombre;
                $scope.filtroNombre.id = filtro.id;
            };

            /*
             *
             */
            $scope.buscador_productos = function (event, termino_busqueda) {
                if (termino_busqueda !== undefined) {
                    if (termino_busqueda.length < 3) {
                        return;
                    }
                } else {
                    termino_busqueda = '';
                }
                var parametros = {
                    empresa_id: $scope.parametros[1].empresa.getEmpresa().getCodigo(),
                    centro_utilidad: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
                    bodega: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
                    // doc_tmp_id: $scope.doc_tmp_id,
                    descripcion: termino_busqueda,
                    tipoFiltro: $scope.filtroNombre.id
                };
                if (event.which === 13)
                    that.listarProductos(parametros);
            };

            $scope.filtros = [
                {nombre: "Descripcion", id: '0'},
                {nombre: "Codigo", id: '1'},
                {nombre: "Molecula", id: '2'}
//                {nombre: "Unidad venta", id: true},
            ];

            $scope.filtro = $scope.filtros[0];

            $scope.onSeleccionFiltros = function (filtro) {
                $scope.filtro = filtro;
            };

            /*$rootScope.$on('cerrar_gestion_productosCompleto', function (e, parametros) {
                $scope.$$watchers = null;
            });*/



            $scope.guardarProducto = function (producto) {
                console.log("guardarProducto",producto );
                var fecha_actual = new Date();
                fecha_actual = $filter('date')(new Date(fecha_actual), "dd/MM/yyyy");

                var fecha_vencimiento = $filter('date')(new Date(producto.fecha_vencimiento), "dd/MM/yyyy");
                var diferencia = $scope.restaFechas(fecha_actual, fecha_vencimiento);
                if (diferencia >= 0 && diferencia <= 45) {
                    AlertService.mostrarMensaje("warning", "Producto proximo a vencer");
                    return;
                }

                if ($scope.doc_tmp_id === '00000') {
                    AlertService.mostrarMensaje("warning", "Debe crear primero el temporal");
                    return;
                }

                var valor = parseFloat(producto.valor_unit);
                var porcentaje = ((valor * producto.iva) / 100);
                var valorMasPorcentaje = valor + porcentaje;
                var total_costo = valorMasPorcentaje * producto.cantidad_ingresada;

                var parametro = {
                    empresaId: $scope.parametros[1].empresa.getEmpresa().getCodigo(),
                    centroUtilidad: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
                    bodega: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
                    codigoProducto: producto.codigo_producto,
                    cantidad: producto.cantidad_ingresada,
                    lote: producto.lote,
                    fechaVencimiento: producto.fecha_vencimiento,
                    docTmpId: $scope.doc_tmp_id,
                    porcentajeGravamen: producto.iva,
                    fechaIngreso: fecha_actual,
                    justificacionIngreso: producto.justificacion,
                    ordenPedidoId: $scope.parametros[1].ordenCompra.numero_orden_compra,
                    totalCosto: total_costo,
                    localProd: producto.localizacion,
                    itemId: '-1',
                    valorUnitarioCompra: producto.valor_unit,
                    valorUnitarioFactura: producto.valor_unit
                };
                that.insertarProductosFoc(parametro);
            };

            that.insertarProductosFoc = function (parametro) {
                var termino = termino || "";
                var obj = {
                    session: $scope.session,
                    data: parametro
                };

                Request.realizarRequest(API.I002.CREAR_ITEM_FOC, "POST", obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            $scope.abrir_fecha_vencimiento = function (producto, $event) {

                $event.preventDefault();
                $event.stopPropagation();

                producto.datepicker_fecha_inicial = true;
            };

            $scope.habilitarCheck = function (producto) {
                console.log("habilitarCheck",producto );
                var disabled = false;

                if (producto.cantidad === undefined || producto.cantidad === "" || parseInt(producto.cantidad) <= 0) {
                    disabled = true;
                }

                if (producto.lote === undefined || producto.lote === "") {
                    disabled = true;
                }

                if (producto.fecha_vencimiento === undefined || producto.fecha_vencimiento === "") {
                    disabled = true;
                }

                return disabled;
            };

            $scope.lista_productos_E009 = {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "10%", enableCellEdit: false,
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
                    {field: 'descripcion', displayName: 'Descripcion', width: "35%", enableCellEdit: false},
                    {field: 'subClase', displayName: 'Molecula', width: "15%", enableCellEdit: false},
                    {field: 'existencia', displayName: 'Existencias', width: "10%", enableCellEdit: false},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Cantidad', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_fecha_vencimiento()', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12" cambiar-foco >\
                                            <p class="input-group" cambiar-foco >\
                                                <input type="text" class="form-control grid-inline-input readonlyinput calendario"  \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencimiento" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="" show-weeks="false" toggle-weeks-text="#"/> \
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs btnCalendario" style="margin-top: 3px;" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},
                    {field: 'get_lote()', displayName: 'Lote', width: "7%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.lote" class="form-control grid-inline-input"  name="" id="" /> </div>'},
                    {width: "5%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="guardarProducto(row.entity)" ng-disabled="habilitarCheck(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {//ng-disabled="habilitar_ingreso_producto(row.entity)"
                $scope.$$watchers = null;
            });
        }]);
});