
define(["angular", "js/controllers","models/I002/Laboratorio","models/I002/EmpresaIngreso","models/I002/ProductoIngreso",], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state","Laboratorio","EmpresaIngreso","ProductoIngreso",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,Laboratorio,Empresa,Producto) {

            var that = this;
            $scope.laboratorio_id = '';
            $scope.parametros = '';


            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {

                $scope.datos_form = {
                    listado_productos: [],
                    titulo : 'Buscar Productos'
                };
                
//                console.log('======== gestionar_productosCompleto ======');
//                console.log($scope.datos_form);
//                console.log("parametros__",parametros);
//                console.log("numero_orden_compra__",parametros[1].ordenCompra.numero_orden_compra);
//                console.log("$scope.Empresa__",parametros[1].empresa.getEmpresa().getCodigo());
//                console.log("$scope.centro__",parametros[1].empresa.getEmpresa().centroUtilidad.codigo);
//                console.log("$scope.bodega__",parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo);
                 $scope.parametros = parametros;
    
                $timeout(function() {
                    $scope.buscador_productos(true,'');
                    that.buscar_laboratorios();
                }, 3);

            });
            
             that.buscar_laboratorios = function(termino) {
//             console.log("buscar_laboratorios ");
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
            
             that.listarProductosParaAsignar = function(parametros) {
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
            
            that.renderProductosParaAsignar = function(productos){
                
                productos.forEach(function(data) {
                 var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.porc_iva).toFixed(2));               
                 $scope.datos_form.listado_productos.push(producto);
                 });
                 console.log("listado_productos ",$scope.datos_form.listado_productos);
            };
            
//             $scope.buscar_productos = function() {
//
//                for (i = 0; i < 5; i++) {
//                    $scope.datos_form.listado_productos.push({nombre: 'producto - ' + i});
//                }
//
//            };
            
            
            $scope.seleccionar_laboratorio = function(laboratorio) {
                $scope.laboratorio_id = "";
                if (laboratorio !== undefined)
                    $scope.laboratorio_id = laboratorio.get_id();
//console.log("scope.laboratorio_id  ",$scope.laboratorio_id);
               // that.buscar_productos(true,$scope.termino_busqueda);
            };
            
            /*
             * 
             */
            $scope.buscador_productos=function(event, termino_busqueda){
                if (termino_busqueda.length < 3) {
                    return;
                }                
                var parametros = {
                    numero_orden: $scope.parametros[1].ordenCompra.numero_orden_compra,
                    empresa_id:$scope.parametros[1].empresa.getEmpresa().getCodigo(),
                    centro_utilidad:$scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
                    bodega:$scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
                    doc_tmp_id:$scope.doc_tmp_id,
                    descripcion:termino_busqueda,
                    tipoFiltro:'0',                
                    fabricante_id:$scope.laboratorio_id               
                };
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
                {nombre : "Descripcion", descripcionProducto:true},                
                {nombre : "Codigo", codigoProducto:true},
                {nombre : "Unidad venta", unidadVenta:true},
                {nombre : "Molecula", molecula:true}
            ];
            
            $scope.filtro  = $scope.filtros[0];  
            
            $scope.onSeleccionFiltros = function(filtro){
                $scope.filtro = filtro;
            };

            $rootScope.$on('cerrar_gestion_productosCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });

           

            $scope.abrir_fecha_vencimiento = function(producto, $event) {

                $event.preventDefault();
                $event.stopPropagation();

                producto.datepicker_fecha_inicial = true;
            };

            $scope.lista_productos= {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo Producto', width: "10%", enableCellEdit: false},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "30%", enableCellEdit: false},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Cantidad', width: "7%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_valor_unit()', displayName: 'Valor Unitario', width: "9%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_iva()', displayName: 'IVA', width: "5%", enableCellEdit: false},
                    {field: 'get_lote()', displayName: 'Lote', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_local_prod()', displayName: 'Localización', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.localizacion" class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_fecha_vencimiento()', displayName: 'Fecha. Vencimiento', width: "12%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12">\
                                            <p class="input-group">\
                                                <input type="text" class="form-control grid-inline-input readonlyinput" name="" id="" \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_inicial" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="" show-weeks="false" toggle-weeks-text="#"/> \
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs" style="margin-top: 3px;" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},                    
                    {field: 'get_justificacion()', displayName: 'Justificacion', width: "13%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.justificacion"  class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ng-disabled="vista_previa" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});