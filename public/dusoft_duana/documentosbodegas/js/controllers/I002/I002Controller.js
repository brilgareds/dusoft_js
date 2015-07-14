
define([
    "angular",
    "js/controllers",
    'includes/slide/slideContent',
    "models/I002/EmpresaIngreso",
    "models/I002/DocumentoIngreso",
    "models/I002/ProveedorIngreso",
    "models/I002/OrdenCompraIngreso",
    "models/I002/ProductoIngreso",
    "controllers/I002/GestionarProductosOrdenCompraController",
    "controllers/I002/GestionarProductosController",
], function(angular, controllers) {

    controllers.controller('I002Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "EmpresaIngreso",
        "DocumentoIngreso",
        "ProveedorIngreso",
        "OrdenCompraIngreso",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Documento, Proveedor, OrdenCompra, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            var datos_documento = localStorageService.get("documento_bodega_I002");
            $scope.DocumentoIngreso = Documento.get(datos_documento.bodegas_doc_id, datos_documento.prefijo, datos_documento.numero, $filter('date')(new Date(), "dd/MM/yyyy"));
            $scope.DocumentoIngreso.set_proveedor(Proveedor.get());

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables 
            $scope.datos_view = {
                listado: [],
                termino_busqueda_proveedores: "",
                btn_buscar_productos: ""
            };


            // Proveedores
            $scope.listar_proveedores = function(termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_proveedores = termino_busqueda;

                that.buscar_proveedores(function(proveedores) {

                    that.render_proveedores(proveedores);
                });
            };

            that.buscar_proveedores = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_proveedores
                        }
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        //that.render_proveedores(data.obj.proveedores);
                        callback(data.obj.proveedores);
                    }
                });
            };

            that.render_proveedores = function(proveedores) {

                $scope.Empresa.limpiar_proveedores();

                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            $scope.seleccionar_proveedor = function() {
                // Buscar Ordenes Compra del Proveedor Seleccionado
                that.buscar_ordenes_compra();
            };

            //=========== Ordenes Compra =============
            that.buscar_ordenes_compra = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            codigo_proveedor_id: $scope.DocumentoIngreso.get_proveedor().get_codigo()
                        }
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_ORDENES_COMPRAS_PROVEEDOR, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_ordenes_compras(data.obj.ordenes_compras);
                    }
                });
            };

            that.render_ordenes_compras = function(ordenes_compras) {

                $scope.DocumentoIngreso.get_proveedor().limpiar_ordenes_compras();

                ordenes_compras.forEach(function(orden) {

                    var orden_compra = OrdenCompra.get(orden.numero_orden, orden.estado, orden.observacion, orden.fecha_registro);

                    $scope.DocumentoIngreso.get_proveedor().set_ordenes_compras(orden_compra);
                });
            };

            $scope.seleccionar_orden_compra = function() {

            };


            $scope.habilitar_btn_productos = function() {

                var disabled = false;

                if ($scope.DocumentoIngreso.get_proveedor() === undefined || $scope.DocumentoIngreso.get_proveedor() === "") {
                    disabled = true;
                }

                if ($scope.DocumentoIngreso.get_orden_compra() === undefined || $scope.DocumentoIngreso.get_orden_compra() === "") {
                    disabled = true;
                }

                if ($scope.DocumentoIngreso.get_observacion() === undefined || $scope.DocumentoIngreso.get_observacion() === "") {
                    disabled = true;
                }
                
                return disabled;
            };

            // Desplegar slider para gestionar productos
            $scope.seleccionar_productos = function(opcion) {

                $scope.datos_view.btn_buscar_productos = opcion;

                if ($scope.datos_view.btn_buscar_productos === 0) {
                    $scope.slideurl = "views/I002/gestionarproductos.html?time=" + new Date().getTime();
                    $scope.$emit('gestionar_productos_orden_compra');
                }

                if ($scope.datos_view.btn_buscar_productos === 1) {
                    $scope.slideurl = "views/I002/gestionarproductos.html?time=" + new Date().getTime();
                    $scope.$emit('gestionar_productos');
                }
            };

            // Cerrar slider para gestionar productos
            $scope.cerrar_seleccion_productos = function() {

                if ($scope.datos_view.btn_buscar_productos === 0)
                    $scope.$emit('cerrar_gestion_productos_orden_compra', {animado: true});

                if ($scope.datos_view.btn_buscar_productos === 1)
                    $scope.$emit('cerrar_gestion_productos', {animado: true});
            };

            $scope.btn_eliminar_producto = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="cerrar()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el producto?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar producto?</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="cerrar()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar_eliminar_producto()" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar_eliminar_producto = function() {
                            $scope.eliminar_producto();
                            $modalInstance.close();
                        };

                        $scope.cerrar = function() {
                            $modalInstance.close();
                        };

                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.eliminar_producto = function() {
                AlertService.mostrarMensaje("warning", "Producto Eliminado Correctamente");
            };

            $scope.btn_eliminar_documento = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.eliminar_documento();
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.eliminar_documento = function() {
                $state.go('DocumentosBodegas');
            };

            $scope.cancelar_documento = function() {
                $state.go('DocumentosBodegas');
            };

            $scope.generar_documento = function() {
                $state.go('DocumentosBodegas');
            };

            $scope.lista_productos_ingresados = {
                data: 'datos_view.listado',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFooter: true,
                footerTemplate: '   <div class="row col-md-12">\
                                        <div class="">\
                                            <table class="table table-clear text-center">\
                                                <thead>\
                                                    <tr>\
                                                        <th class="text-center" >CANTIDAD</th>\
                                                        <th class="text-center">SUBTOTAL</th>\
                                                        <th class="text-center">IVA</th>\
                                                        <th class="text-center">RET-FTE</th>\
                                                        <th class="text-center">RETE-ICA</th>\
                                                        <th class="text-center">RETE-IVA</th>\
                                                        <th class="text-center">VALOR TOTAL</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody>\
                                                    <tr>\
                                                        <td class="right">50</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                        <td class="right">$0.00{{valor_subtotal | currency: "$ "}}</td> \
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                columnDefs: [
                    {field: 'nombre', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'politicas', displayName: 'Políticas', width: "20%"},
                    {field: 'cantidad_seleccionada', width: "7%", displayName: "Cantidad"},
                    {field: 'iva', width: "7%", displayName: "I.V.A (%)"},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "10%", cellFilter: "currency:'$ '"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };

            $scope.lista_productos_no_autorizados = {
                data: 'datos_view.listado',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'politicas', displayName: 'Políticas', width: "20%"},
                    {field: 'cantidad_seleccionada', width: "7%", displayName: "Cantidad"},
                    {field: 'iva', width: "7%", displayName: "I.V.A (%)"},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "10%", cellFilter: "currency:'$ '"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_eliminar_producto(row)" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };


            for (i = 0; i < 200; i++) {
                $scope.datos_view.listado.push({nombre: 'producto - ' + i});
            }


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});