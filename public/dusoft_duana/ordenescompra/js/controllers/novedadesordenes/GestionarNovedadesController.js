
define(["angular", "js/controllers", 'includes/slide/slideContent', 
    "controllers/novedadesordenes/GestionarNovedadProductoController",
], function(angular, controllers) {

    controllers.controller('GestionarNovedadesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "ProductoOrdenCompra",
        "NovedadOrdenCompra",
        "ObservacionOrdenCompra",
        "UsuarioOrdenCompra",
        "Usuario",
        "webNotification",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, OrdenCompra, Empresa, Proveedor, UnidadNegocio, Producto, Novedad, Observacion, Usuario, Sesion,webNotification) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables
            $scope.numero_orden = parseInt(localStorageService.get("numero_orden")) || 0;

            $scope.codigo_proveedor_id = '';
            $scope.unidad_negocio_id = '';
            $scope.observacion = '';
            $scope.descripcion_estado = '';
            $scope.producto_eliminar = '';
            $scope.cantidad_productos_orden_compra = 0;

            // Variables de Totales
            $scope.valor_subtotal = 0;
            $scope.valor_iva = 0;
            $scope.valor_total = 0;


            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;


            that.gestionar_consultas = function() {

                that.buscar_proveedores(function() {

                    that.buscar_unidades_negocio(function() {

                        that.gestionar_orden_compra();

                    });
                });
            };

            that.gestionar_orden_compra = function() {

                if ($scope.numero_orden > 0) {

                    $scope.buscar_orden_compra(function(continuar) {

                        if (continuar) {
                            $scope.buscar_detalle_orden_compra();
                        }
                    });
                }
            };

            $scope.buscar_orden_compra = function(callback) {

                var obj = {session: $scope.session, data: {ordenes_compras: {numero_orden: $scope.numero_orden}}};

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_ORDEN_COMPRA, "POST", obj, function(data) {

                    if (data.status === 200 && data.obj.orden_compra.length > 0) {

                        var datos = data.obj.orden_compra[0];

                        $scope.orden_compra = OrdenCompra.get(datos.numero_orden, datos.estado, datos.observacion, datos.fecha_registro);

                        var unidad_negocio = ($scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio).length > 0) ? $scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio) : UnidadNegocio.get(datos.codigo_unidad_negocio, datos.descripcion)

                        $scope.orden_compra.set_unidad_negocio(unidad_negocio);


                        $scope.orden_compra.set_proveedor($scope.Empresa.get_proveedor(datos.codigo_proveedor_id));
                        $scope.orden_compra.set_usuario(Usuario.get(datos.usuario_id, datos.nombre_usuario));
                        $scope.orden_compra.set_descripcion_estado(datos.descripcion_estado);

                        $scope.codigo_proveedor_id = $scope.orden_compra.get_proveedor().get_codigo_proveedor();
                        $scope.unidad_negocio_id = $scope.orden_compra.get_unidad_negocio().get_codigo();
                        $scope.observacion = $scope.orden_compra.get_observacion();
                        $scope.descripcion_estado = $scope.orden_compra.get_descripcion_estado();

                        // Totales                        
                        $scope.valor_subtotal = datos.subtotal;
                        $scope.valor_iva = datos.valor_iva;
                        $scope.valor_total = datos.total;

                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            $scope.buscar_detalle_orden_compra = function(termino, paginando) {

                var termino = termino || "";

                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.pagina_actual = 1;
                }


                var obj = {session: $scope.session, data: {ordenes_compras: {numero_orden: $scope.numero_orden, termino_busqueda: termino, pagina_actual: $scope.pagina_actual}}};

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_DETALLE_ORDEN_COMPRA_NOVEDADES, "POST", obj, function(data) {

                    $scope.ultima_busqueda = $scope.termino_busqueda;

                    if (data.status === 200) {

                        var lista_productos = data.obj.lista_productos;

                        $scope.cantidad_items = lista_productos.length;
                        if (paginando && $scope.cantidad_items === 0) {
                            if ($scope.pagina_actual > 0) {
                                $scope.pagina_actual--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }


                        $scope.orden_compra.limpiar_productos();

                        $scope.valor_subtotal = 0;
                        $scope.valor_iva = 0;
                        $scope.valor_total = 0;
                        var _productos = [];
                        lista_productos.forEach(function(data) {
                            var producto = Producto.get(data.codigo_producto, data.descripcion_producto, '', parseFloat(data.porc_iva).toFixed(2), data.valor);
                            producto.set_cantidad_seleccionada(data.cantidad_solicitada);

                            var novedad = Novedad.get(data.novedad_id, data.descripcion_novedad, Observacion.get(data.id_observacion, data.codigo_observacion, data.descripcion_observacion), data.cantidad_archivos);
                            
                            novedad.setDescripcionEntrada(data.descripcion_entrada);
                            // Set Novedad Producto
                            producto.set_id(data.item_id);
                            producto.set_novedad(novedad);

                            $scope.orden_compra.set_productos(producto);
                            
                            /*Evita que se sume los totales de productos que ya se sumaron, esto es debido a que las novedades pueden retornar
                              el mismo producto varias veces*/
                            if(_productos.indexOf(data.codigo_producto) === -1){
                                // Totales                        
                                $scope.valor_subtotal += data.subtotal;
                                $scope.valor_iva += data.valor_iva;
                                $scope.valor_total += data.total;
                                _productos.push(data.codigo_producto);
                            }

                        });

                        $scope.cantidad_productos_orden_compra = $scope.orden_compra.get_productos().length;
                    }
                });
            };

            that.buscar_proveedores = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: ""
                        }
                    }
                };

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_proveedores(data.obj.proveedores);

                        callback(true);
                    }
                });
            };

            that.buscar_unidades_negocio = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        unidades_negocio: {
                            termino_busqueda: ""
                        }
                    }
                };

                Request.realizarRequest(API.UNIDADES_NEGOCIO.LISTAR_UNIDADES_NEGOCIO, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_unidades_negocio(data.obj.unidades_negocio);

                        callback(true);
                    }
                });
            };


            $scope.buscador_productos_orden_compra = function(ev, termino_busqueda) {
                if (ev.which === 13) {
                    $scope.buscar_detalle_orden_compra(termino_busqueda);
                }
            };

            that.render_proveedores = function(proveedores) {

                $scope.Empresa.limpiar_proveedores();

                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            that.render_unidades_negocio = function(unidades_negocios) {

                $scope.Empresa.limpiar_unidades_negocios();

                unidades_negocios.forEach(function(data) {

                    var unidad_negocio = UnidadNegocio.get(data.codigo_unidad_negocio, data.descripcion, data.imagen);

                    $scope.Empresa.set_unidades_negocios(unidad_negocio);
                });
            };

            $scope.cancelar_orden_compra = function() {

                $state.go('ListarOrdenes');
            };

            $scope.lista_productos = {
                data: 'orden_compra.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: false,
                enableHighlighting: true,
                showFooter: true,
                footerTemplate: '   <div class="row col-md-12">\
                                        <div class="col-md-3 pull-right">\
                                            <table class="table table-clear">\
                                                    <tbody>\
                                                            <tr>\
                                                                    <td class="left"><strong>Subtotal</strong></td>\
                                                                    <td class="right">{{valor_subtotal | currency: "$ "}}</td>\
                                                            </tr>\
                                                            <tr>\
                                                                    <td class="left"><strong>I.V.A</strong></td>\
                                                                    <td class="right">{{valor_iva | currency: "$ "}}</td>\
                                                            </tr>\
                                                            <tr>\
                                                                    <td class="left"><strong>Total</strong></td>\
                                                                    <td class="right">{{valor_total | currency: "$ "}}</td>\
                                                            </tr>\
                                                    </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "120"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'novedad.get_observacion().get_descripcion()', displayName: "Novedad", width: "150",
                     cellTemplate:'<div class="ngCellText">{{row.entity.novedad.get_observacion().get_descripcion()}}</div>'},
                    {field: 'novedad.getDescripcionEntrada()', displayName:"F/Disponible", width:'150'},
                    {field: 'novedad.get_descripcion()', displayName: 'Observacion', width: "200"},
                    {field: 'novedad.get_cantidad_archivos()', displayName: 'Archivos', width: "80"},
                    {displayName: "Opciones..", cellClass: "txt-center dropdown-button", width:"150",
                        cellTemplate:'<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="novedades_producto_orden_compra(row, true);" >Agregar Novedad</a></li>\
                                                <li ng-if="row.entity.get_novedad().get_id() != \'\' " ><a href="javascript:void(0);" ng-click="novedades_producto_orden_compra(row)" >Modificar</a></li>\
                                                <li ng-if="row.entity.get_novedad().get_id() != \'\'"><a href="javascript:void(0);" ng-click="onEliminarNovedad(row.entity,0)" >Eliminar</a></li>\
                                            </ul>\
                                        </div>' }
                ]
            };
            
            $scope.onEliminarNovedad = function(producto){
                
                AlertService.mostrarVentanaAlerta("Eliminar", "Desea eliminar la novedad?", function(aceptar){
                  
                    if(aceptar){
                        var obj = {
                            session: $scope.session,
                            data: {
                                ordenes_compras: {
                                    novedadId: producto.get_novedad().get_id()
                                }
                            }
                        };

                        Request.realizarRequest(API.ORDENES_COMPRA.ELIMINAR_NOVEDAD, "POST", obj, function(data) {
                               $scope.buscar_detalle_orden_compra("");

                        });
                    }
                });
                
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton para crear una novedad en toda la orden, se toma el primer producto como referencia
             */
            $scope.onCrearNovedadGeneral = function(){
                
                var producto = angular.copy($scope.orden_compra.get_productos()[0]);
                
                if(!producto){
                    return;
                }
                
                producto.set_novedad(Novedad.get());
                var productos = $scope.orden_compra.get_productos();
                
                var row = {
                    entity : producto,
                    rowIndex : 0
                };
                  
                $scope.novedades_producto_orden_compra(row, true, true, productos);
                
            };
           
            $scope.novedades_producto_orden_compra = function(row, nuevaNovedad, todosLosProductos, productos) {
                
                var producto = row.entity;
                var index = row.rowIndex;
                
                producto.set_cantidad_seleccionada(producto.cantidad);
                $scope.producto_seleccionado = producto;

                $scope.opts = {
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    backdrop: 'static',
                    templateUrl: 'views/novedadesordenes/gestionarnovedadproducto.html',
                    controller: "GestionarNovedadProductoController",
                    scope: $scope,
                    resolve: {
                        index: function() {
                            return index;
                        }, 
                        producto: function(){
                            return producto;
                        },
                        nuevaNovedad:function(){
                            return nuevaNovedad;
                        },
                        todosLosProductos:function(){
                            return todosLosProductos;
                        },
                        productos:function(){
                            return productos
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
                
                modalInstance.result.then(function() {
                    $scope.buscar_detalle_orden_compra();

                }, function() {
                });
            };

            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                $scope.buscar_detalle_orden_compra($scope.termino_busqueda, true);
            };


            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                $scope.buscar_detalle_orden_compra($scope.termino_busqueda, true);
            };

            that.gestionar_consultas();


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});