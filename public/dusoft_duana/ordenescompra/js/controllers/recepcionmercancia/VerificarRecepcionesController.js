
define(["angular", "js/controllers"
], function(angular, controllers) {

    controllers.controller('VerificarRecepcionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "EmpresaOrdenCompra",
        "Transportadora",
        "ProveedorOrdenCompra",
        "NovedadRecepcion",
        "RecepcionMercancia",
        "OrdenCompraPedido",
        "ProductoOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Transportadora, Proveedor, Novedad, Recepcion, OrdenCompra, Producto, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables
            $scope.recepcion = Recepcion.get(Sesion.getUsuarioActual().getEmpresa().getCodigo(), parseInt(localStorageService.get("numero_recepcion")) || 0);

            $scope.datos_view = {
                termino_busqueda_proveedores: '',
                lista_productos: []
            };


            that.gestionar_consultas = function() {

                that.buscar_transportadoras(function() {

                    that.buscar_proveedores(function() {

                        that.buscar_novedades_mercancia(function() {

                            that.buscar_recepcion_mercancia(function() {

                                that.buscar_productos_recepcion();
                            });
                        });
                    });
                });
            };

            //=========== Transportadora =============
            that.buscar_transportadoras = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        transportadoras: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.TRANSPORTADORAS.LISTAR_TRANSPORTADORAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_transportadoras(data.obj.transportadoras);
                    }
                    callback();
                });
            };

            that.render_transportadoras = function(transportadoras) {

                $scope.Empresa.limpiar_transportadoras();

                transportadoras.forEach(function(data) {

                    var transportadora = Transportadora.get(data.id, data.descripcion, data.placa, data.estado);
                    transportadora.set_solicitar_guia(data.sw_solicitar_guia);

                    $scope.Empresa.set_transportadoras(transportadora);
                });
            };

            $scope.seleccionar_transportadora = function(recepcion) {

            };

            //=========== Proveeedores =============
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

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_proveedores(data.obj.proveedores);
                    }
                    callback();
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
            };

            //======== Novedades Recepcion Mercancia =========
            that.buscar_novedades_mercancia = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        novedades_mercancia: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.NOVEDADES_MERCANCIA.LISTAR_NOVEDADES_MERCANCIA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_novedades_mercancia(data.obj.novedades_mercancia);
                    }
                    callback();
                });
            };

            that.render_novedades_mercancia = function(novedades) {

                $scope.Empresa.limpiar_novedades_mercancia();

                novedades.forEach(function(novedad) {

                    var novedad_mercancia = Novedad.get(novedad.id, novedad.codigo, novedad.descripcion, novedad.estado);

                    $scope.Empresa.set_novedades_mercancia(novedad_mercancia);
                });

            };

            //======== Novedades Recepcion Mercancia =========
            that.buscar_recepcion_mercancia = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            recepcion_id: $scope.recepcion.get_numero_recepcion()
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_RECEPCION_MERCANCIA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        
                        that.render_recepcion_mercancia(data.obj.ordenes_compras.recepcion_mercancia);
                    }
                    callback();
                });
            };

            that.render_recepcion_mercancia = function(recepciones) {

                recepciones.forEach(function(data) {
                    
                    var recepcion = Recepcion.get(data.empresa_id, data.id, data.fecha_registro, data.estado);                                        
                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion_proveedor, data.telefono_proveedor);
                    var transportadora = Transportadora.get(data.inv_transportador_id, data.nombre_transportadora, '', data.estado_transportadora);
                    var orden_compra = OrdenCompra.get(data.numero_orden);
                    var novedad_mercancia = Novedad.get(data.novedades_recepcion_id, data.codigo_novedad, data.descripcion_novedad, data.estado_novedad);

                    recepcion.set_numero_guia(data.numero_guia);
                    recepcion.set_numero_factura(data.numero_factura);
                    recepcion.set_cantidad_cajas(data.cantidad_cajas);
                    recepcion.set_cantidad_neveras(data.cantidad_neveras);
                    recepcion.set_temperatura_neveras(data.temperatura_neveras);
                    recepcion.set_hora_ingreso(data.hora_recepcion);
                    recepcion.set_fecha_ingreso(data.fecha_recepcion);
                    recepcion.set_descripcion_estado(data.descripcion_estado);

                    if (data.contiene_medicamentos === '1')
                        recepcion.set_contiene_medicamentos();

                    if (data.contiene_dispositivos === '1')
                        recepcion.set_contiene_dispositivos();

                    recepcion.set_proveedor(proveedor);
                    recepcion.set_transportadora(transportadora);
                    recepcion.set_orden_compra(orden_compra);
                    recepcion.set_novedad(novedad_mercancia);

                    $scope.recepcion = recepcion;
                });

            };

            //=========== Productos de la recepcion =============
            that.buscar_productos_recepcion = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            recepcion_id: $scope.recepcion.get_numero_recepcion()
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_PRODUCTOS_RECEPCION_MERCANCIA, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_productos(data.obj.ordenes_compras.recepcion_mercancia);
                    }
                });
            };

            that.render_productos = function(lista_productos) {

                lista_productos.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto);
                    var novedad = Novedad.get(data.novedades_recepcion_id, data.codigo_novedad, data.descripcion_novedad, data.estado_novedad);

                    producto.set_cantidad_seleccionada(data.cantidad_solicitada);
                    producto.set_cantidad_recibida(data.cantidad_recibida);
                    producto.set_novedad_recepcion(novedad);

                    $scope.recepcion.get_orden_compra().set_productos(producto);
                });
            };

            $scope.verificar_producto = function(producto) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            recepcion_mercancia: $scope.recepcion,
                            producto_mercancia: producto
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.INGRESAR_PRODUCTOS_MERCANCIA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);
                });
            };


            $scope.finalizar_recepcion_mercancia = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>¿ Desea Finalizar la recepcion No. {{ recepcion.get_numero_recepcion() }} </b>?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelar_finalizacion()">Cancelar</button>\
                                        <button class="btn btn-primary" ng-click="aceptar_finalizacion()">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.aceptar_finalizacion = function() {
                            $scope.finalizar_recepcion();
                            $modalInstance.close();
                        };

                        $scope.cancelar_finalizacion = function() {
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.cancelar_recepcion = function() {
                $state.go('ListarRecepciones');
            };

            $scope.finalizar_recepcion = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            recepcion_mercancia: $scope.recepcion
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.FINALIZAR_RECEPCION, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        
                        $state.go('ListarRecepciones');
                    }
                });

            };

            $scope.deshabilitar_acciones = function(){
                var disabled = false ;
                
                if($scope.recepcion.get_estado()==='0' || $scope.recepcion.get_estado()==='2' ){
                    disabled = true;
                }
                
                return disabled;
            };
                       


            $scope.lista_productos = {
                data: 'recepcion.get_orden_compra().get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "35%"},
                    {field: 'get_cantidad_seleccionada()', displayName: 'Cnt.', width: "5%"},
                    {field: 'get_cantidad_recibida()', displayName: 'Rec.', width: "15%",
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-disabled="deshabilitar_acciones()" ng-model="row.entity.cantidad_recibida" class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: "Novedad", cellClass: "dropdown-button",
                        cellTemplate: '<div class="row">\
                                            <div class="col-md-12">  \
                                                <ui-select ng-disabled="deshabilitar_acciones()" ng-model="row.entity.novedad_recepcion" theme="select2" class="col-md-12">\
                                                    <ui-select-match  placeholder="Seleccionar Novedad">{{ $select.selected.get_codigo_descripcion() }}</ui-select-match>\
                                                    <ui-select-choices repeat="novedad in Empresa.get_novedades_mercancia() | filter:$select.search">\
                                                        {{ novedad.get_codigo_descripcion() }}\
                                                    </ui-select-choices>\
                                                </ui-select>\
                                            </div>\
                                        </div>'
                    },
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "15%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-disabled="deshabilitar_acciones() || row.entity.cantidad_recibida == \'\' || row.entity.cantidad_recibida == \'0\'" ng-click="verificar_producto(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };

            that.gestionar_consultas();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});