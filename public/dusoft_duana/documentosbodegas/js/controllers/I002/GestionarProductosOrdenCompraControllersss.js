
define(["angular", "js/controllers","models/I002/Laboratorio","models/I002/EmpresaIngreso"], function(angular, controllers) {

    controllers.controller('GestionarProductosOrdenCompraController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        "ProductoIngreso","Laboratorio","EmpresaIngreso",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Producto,Laboratorio,Empresa) {

            var that = this;
            $scope.laboratorio_id = '';


            $rootScope.$on('gestionar_productos_orden_compraCompleto', function(e, parametros) {

                $scope.datos_form = {
                    titulo: 'Ingresar Productos Orden de Compra',
                    termino_busqueda: ""
                };
                $scope.buscar_productos_orden_compra();
                console.log("buscar_laboratorios----buscar_laboratorios");
                that.buscar_laboratorios();
            });

            $rootScope.$on('cerrar_gestion_productos_orden_compraCompleto', function(e, parametros) {
                console.log('======== cerrar_gestion_productos_orden_compraCompleto ======');
//                $scope.Empresa.limpiar_laboratorios();
                $scope.$$watchers = null;
            });

            // Productos 
            $scope.buscar_productos_orden_compra = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                            termino_busqueda: '',
                            pagina_actual: 1
                        }
                    }
                };

                Request.realizarRequest(API.I002.CONSULTAR_DETALLE_ORDEN_COMPRA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log('======== Productos ====');
                        console.log(data.obj.lista_productos);
                        that.render_productos(data.obj.lista_productos);

                    }
                });
            };

            that.render_productos = function(productos) {

//                $scope.Empresa.limpiar_productos();

                productos.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, parseFloat(data.porc_iva).toFixed(2), data.valor);
                    producto.set_cantidad_solicitada(data.cantidad_solicitada);

                    $scope.Empresa.set_productos(producto);
                });
            };
                        
            $scope.abrir_fecha_vencimiento = function(producto, $event) {

                $event.preventDefault();
                $event.stopPropagation();

                producto.datepicker_fecha_inicial = true;
            };
            
          /*  $scope.habilitar_ingreso_producto = function(producto) {

                var disabled = false;

                if(producto.get_lote() === undefined || producto.get_lote()===""){
                    disabled = true;
                }
                
                if(producto.get_fecha_vencimiento() === undefined || producto.get_fecha_vencimiento()===""){
                    disabled = true;
                }
                
                if(producto.get_valor_unitario() === undefined || producto.get_valor_unitario()==="" || producto.get_valor_unitario() <= 0 ){
                    disabled = true;
                }
                
                return disabled;
            };*/
                        
          /*  $scope.validar_ingreso_producto = function(producto) {

                var disabled = false;

                if(producto.get_lote() === undefined || producto.get_lote()===""){
                    disabled = true;
                }
                
                if(producto.get_fecha_vencimiento() === undefined || producto.get_fecha_vencimiento()===""){
                    disabled = true;
                }
                
                if(producto.get_valor_unitario() === undefined || producto.get_valor_unitario()==="" || producto.get_valor_unitario() <= 0 ){
                    disabled = true;
                }
                
                return disabled;
            };
            */
            
          
            $scope.lista_productos = {
                data: 'Empresa.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "10%", enableCellEdit: false},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "40%", enableCellEdit: false},
                    {field: 'get_cantidad_solicitada() | number : "0" ', displayName: 'Cantidad', width: "7%", enableCellEdit: false},
                    {displayName: 'Lote', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.lote" class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: 'Fecha. Vencimiento', width: "13%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12">\
                                            <p class="input-group">\
                                                <input type="text" class="form-control grid-inline-input readonlyinput" name="" id="" \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencimiento" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="" show-weeks="false" toggle-weeks-text="#"/> \
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs" style="margin-top: 3px;" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},                    
                    {field: 'nombre', displayName: 'Valor Unitario', width: "13%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"><input type="text" ng-model="row.entity.valor_unitario" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "8%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-disabled="habilitar_ingreso_producto(row.entity)" ng-click="ingresar_producto(row.entity)"><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };
            
            that.buscar_laboratorios = function(termino) {
             console.log("buscar_laboratorios ");
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
            
            $scope.seleccionar_laboratorio = function(laboratorio) {
                $scope.laboratorio_id = "";
                if (laboratorio !== undefined)
                    $scope.laboratorio_id = laboratorio.get_id();

                that.buscar_productos(true,$scope.termino_busqueda);
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
                            filtro:$scope.filtroe,
                            empresa_id: $scope.session.getUsuarioActual().getEmpresa().getCodigo(),
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
            
            that.render_laboratorios = function(laboratorios) {

                $scope.Empresa.limpiar_laboratorios();

                var laboratorio = Laboratorio.get("", "-- TODOS --");
                $scope.Empresa.set_laboratorios(laboratorio);

                laboratorios.forEach(function(data) {

                    laboratorio = Laboratorio.get(data.laboratorio_id, data.descripcion_laboratorio);
                    $scope.Empresa.set_laboratorios(laboratorio);
                });
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});