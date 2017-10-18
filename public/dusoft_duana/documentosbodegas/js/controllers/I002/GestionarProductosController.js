
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout", "$filter",
        "AlertService", "localStorageService", "$state", "Laboratorio", "EmpresaIngreso", "ProductoIngreso",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, $filter, AlertService, localStorageService, $state, Laboratorio, Empresa, Producto) {

            var that = this;
            $scope.laboratorio_id = '';
            $scope.parametros = '';


            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {

                $scope.datos_form = {
                    listado_productos: [],
                    titulo: 'Buscar Productos'
                };


                $scope.parametros = parametros;

                $timeout(function() {
                    $scope.buscador_productos(true, '');
                    that.buscar_laboratorios();
                }, 3);

            });

            /*
             * Descripcion: lista todos los laboratorios existentes
             * @author Andres Mauricio Gonzalez
             * @fecha  05/06/2017
             * @param {type} termino
             */
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

            /*
             * Descripcion: lista todos los productos existentes
             * @author Andres Mauricio Gonzalez
             * @fecha  05/06/2017
             * @param {type} termino
             * @returns {undefined}
             */
            that.listarProductosParaAsignar = function(parametros) {
		console.log("parametros->>>>>>>>>>>>>>>>>>",parametros);
                var obj = {
                    session: $scope.session,
                    data: parametros
                };

                Request.realizarRequest(API.I002.LISTAR_PRODUCTOS_PARA_ASIGNAR, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.renderProductosParaAsignar(data.obj.listarProductosParaAsignar);
                    }
                });
            };

            that.renderProductosParaAsignar = function(productos) {
                $scope.datos_form.listado_productos = [];
                productos.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.porc_iva).toFixed(2));
                    producto.set_is_tmp(data.orden);
                    $scope.datos_form.listado_productos.push(producto);
                });
            };


            $scope.seleccionar_laboratorio = function(laboratorio) {
                $scope.laboratorio_id = "";
                if (laboratorio !== undefined)
                    $scope.laboratorio_id = laboratorio.get_id();
            };
	    $scope.filtroNombre= {nombre:"Seleccionar",id:-1};
	    
	    $scope.onSeleccionFiltro=function(filtro){
		console.log("Filtro:::::::",filtro);
		$scope.filtroNombre.nombre=filtro.nombre;
		$scope.filtroNombre.id=filtro.id;
	    };

            /*
             *
             */
            $scope.buscador_productos = function(event, termino_busqueda) {

                if (termino_busqueda !== undefined) {
                    if (termino_busqueda.length < 3) {
                        return;
                    }
                } else {
                    termino_busqueda = '';
                }
                var parametros = {
                    numero_orden: $scope.parametros[1].ordenCompra.numero_orden_compra,
                    empresa_id: $scope.parametros[1].empresa.getEmpresa().getCodigo(),
                    centro_utilidad: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
                    bodega: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
                    doc_tmp_id: $scope.doc_tmp_id,
                    descripcion: termino_busqueda,
                    tipoFiltro: $scope.filtroNombre.id,
                    fabricante_id: $scope.laboratorio_id
                };
                if (event.which === 13)
                    that.listarProductosParaAsignar(parametros);
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

            $scope.filtros = [
                {nombre: "Descripcion", id: '0'},
                {nombre: "Codigo", id: '1'}
//                {nombre: "Unidad venta", id: true},
//                {nombre: "Molecula", id: true}
            ];

            $scope.filtro = $scope.filtros[0];

            $scope.onSeleccionFiltros = function(filtro) {
                $scope.filtro = filtro;
            };

            $rootScope.$on('cerrar_gestion_productosCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });



            $scope.guardarProducto = function(producto) {
                var fecha_actual = new Date();
                fecha_actual = $filter('date')(new Date(fecha_actual), "dd/MM/yyyy");

                var fecha_vencimiento = $filter('date')(new Date(producto.fecha_vencimiento), "dd/MM/yyyy");
                var diferencia = $scope.restaFechas(fecha_actual, fecha_vencimiento);
                if (diferencia >= 0 && diferencia <= 45) {
                    AlertService.mostrarMensaje("warning", "Producto proximo a vencer");
                    return;
                }
		
		if($scope.doc_tmp_id==='00000'){
		   AlertService.mostrarMensaje("warning", "Debe crear primero el temporal");
                   return; 
		}
		console.log("scope.doc_tmp_id ",$scope.doc_tmp_id);

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

            that.insertarProductosFoc = function(parametro) {
                var termino = termino || "";
                var obj = {
                    session: $scope.session,
                    data: parametro
                };

                Request.realizarRequest(API.I002.CREAR_ITEM_FOC, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            $scope.abrir_fecha_vencimiento = function(producto, $event) {

                $event.preventDefault();
                $event.stopPropagation();

                producto.datepicker_fecha_inicial = true;
            };

            $scope.isTmp = function(entity) {
                var disabled = false;

                if (entity.get_is_tmp() === '1') {
                    disabled = true;
                }

                return disabled;
            };

            $scope.habilitarCheck = function(producto) {

                var disabled = false;

                if (producto.cantidad_ingresada === undefined || producto.cantidad_ingresada === "" || parseInt(producto.cantidad_ingresada) <= 0) {
                    disabled = true;
                }

                if (producto.valor_unit === undefined || producto.valor_unit === "" || parseInt(producto.valor_unit) <= 0) {
                    disabled = true;
                }

                if (producto.iva === undefined || producto.iva === "") {
                    disabled = true;
                }

                if (producto.lote === undefined || producto.lote === "") {
                    disabled = true;
                }

                if (producto.localizacion === undefined || producto.localizacion === "") {
                    disabled = true;
                }

                if (producto.localizacion === undefined || producto.localizacion === "") {
                    disabled = true;
                }

                if (producto.fecha_vencimiento === undefined || producto.fecha_vencimiento === "") {
                    disabled = true;
                }
                if (producto.justificacion === undefined || producto.justificacion === "") {
                    disabled = true;
                }

                return disabled;
            };

            $scope.lista_productos = {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo Producto', width: "7%", enableCellEdit: false},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "30%", enableCellEdit: false},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Cantidad', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero ng-disabled="isTmp(row.entity)" class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_valor_unit()', displayName: 'Valor Unitario', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.valor_unit" validacion-numero-decimal ng-disabled="isTmp(row.entity)" class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_iva()', displayName: 'IVA', width: "5%", enableCellEdit: true,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.iva"  ng-disabled="true" class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_lote()', displayName: 'Lote', width: "5%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.lote" class="form-control grid-inline-input" ng-disabled="isTmp(row.entity)" name="" id="" /> </div>'},
                    {field: 'get_local_prod()', displayName: 'Localización', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.localizacion" class="form-control grid-inline-input" ng-disabled="isTmp(row.entity)" name="" id="" /> </div>'},
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
                    {field: 'get_justificacion()', displayName: 'Justificacion', width: "12%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.justificacion" ng-disabled="isTmp(row.entity)"  class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "5%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="guardarProducto(row.entity)" ng-disabled="isTmp(row.entity);habilitarCheck(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {//ng-disabled="habilitar_ingreso_producto(row.entity)"
                $scope.$$watchers = null;
            });
        }]);
});