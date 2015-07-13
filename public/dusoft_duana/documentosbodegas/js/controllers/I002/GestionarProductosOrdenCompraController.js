
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosOrdenCompraController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        "ProductoIngreso",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Producto) {

            var that = this;


            $rootScope.$on('gestionar_productos_orden_compraCompleto', function(e, parametros) {

                $scope.datos_form = {
                    titulo: 'Ingresar Productos Orden de Compra',
                    termino_busqueda: ""
                };

                $scope.buscar_productos_orden_compra();
            });

            $rootScope.$on('cerrar_gestion_productos_orden_compraCompleto', function(e, parametros) {
                console.log('======== cerrar_gestion_productos_orden_compraCompleto ======');
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

                $scope.Empresa.limpiar_productos();

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
            
            $scope.habilitar_ingreso_producto = function(producto) {

                var disabled = false;

                if(producto.get_lote() === undefined || producto.get_lote()===""){
                    disabled = true;
                }
                
                if(producto.get_fecha_vencmiento() === undefined || producto.get_fecha_vencmiento()===""){
                    disabled = true;
                }
                
                if(producto.get_valor_unitario() === undefined || producto.get_valor_unitario()==="" || producto.get_valor_unitario() <= 0 ){
                    disabled = true;
                }
                
                return disabled;
            };
                        
            $scope.validar_ingreso_producto = function(producto) {

                var disabled = false;

                if(producto.get_lote() === undefined || producto.get_lote()===""){
                    disabled = true;
                }
                
                if(producto.get_fecha_vencmiento() === undefined || producto.get_fecha_vencmiento()===""){
                    disabled = true;
                }
                
                if(producto.get_valor_unitario() === undefined || producto.get_valor_unitario()==="" || producto.get_valor_unitario() <= 0 ){
                    disabled = true;
                }
                
                return disabled;
            };
            
            $scope.ingresar_producto = function(producto){
                console.log('======== ingresar_producto =======');
                console.log(producto);
            };
            
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
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencmiento" is-open="row.entity.datepicker_fecha_inicial" \
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

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});