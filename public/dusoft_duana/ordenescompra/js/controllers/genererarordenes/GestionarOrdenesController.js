
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "controllers/genererarordenes/GestionarProductosController",
    "controllers/genererarordenes/CalcularValoresProductoController",
    "models/BodegaOrdenCompra",
], function(angular, controllers) {

    controllers.controller('GestionarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "ProductoOrdenCompra",
        "UsuarioOrdenCompra",
        "Usuario",
        "BodegaOrdenCompra",
        function($scope, $rootScope, Request, 
                 $modal, API, socket, $timeout, 
                 AlertService, localStorageService, $state, 
                 $filter, OrdenCompra, Empresa, 
                 Proveedor, UnidadNegocio, Producto, 
                 Usuario, Sesion, BodegaOrdenCompra) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables
            $scope.numero_orden = parseInt(localStorageService.get("numero_orden")) || 0;
            $scope.vista_previa = (localStorageService.get("vista_previa") === '1') ? true : false;

            $scope.codigo_proveedor_id = '';
            $scope.unidad_negocio_id = '';
            $scope.observacion = '';
            $scope.observacion_contrato = '';
            $scope.descripcion_estado = '';
            $scope.producto_eliminar = '';
            $scope.cantidad_productos_orden_compra = 0;

            $scope.activar_tab = {tab_productos: true, tab_cargar_archivo: false};

            // Variables de Totales
            $scope.valor_subtotal = 0;
            $scope.valor_iva = 0;
            $scope.valor_total = 0;

            $scope.datos_view = {
                termino_busqueda_proveedores: "",
                usuario:Sesion.getUsuarioActual()
            };

            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;
            $scope.progresoArchivo = 0;
            
            $scope.orden_compra = OrdenCompra.get();
            
            that.opciones = Sesion.getUsuarioActual().getModuloActual().opciones;
            
            $scope.opcionesModulo = {
                btnModificarCantidad:{
                    'click': that.opciones.sw_modificar_orden
                }
            };
            
            
            that.set_orden_compra = function() {

                //$scope.orden_compra = OrdenCompra.get($scope.numero_orden, 1, $scope.observacion, new Date());
                $scope.orden_compra.set_numero_orden($scope.numero_orden).setEstado(1).
                setObservacion($scope.observacion).setFechaRegistro(new Date());
        
                $scope.orden_compra.set_unidad_negocio($scope.Empresa.get_unidad_negocio($scope.unidad_negocio_id));
                $scope.orden_compra.set_proveedor($scope.Empresa.get_proveedor($scope.codigo_proveedor_id.get_codigo_proveedor()));
                $scope.orden_compra.set_usuario(Usuario.get(Sesion.usuario_id));
                $scope.orden_compra.set_descripcion_estado('Activa');

            };

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

                            if (!$scope.vista_previa)
                                $scope.finalizar_orden_compra(false);
                        }
                    });
                }
            };
            
            that.buscarBodegas = function(terminoBusqueda){
                
                var obj = {
                    session: $scope.session,
                    data: {
                        bodegas: {
                            termino: terminoBusqueda
                        }
                    }
                };

                Request.realizarRequest(API.BODEGAS.BUSCAR_BODEGAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.renderBodegas(data.obj);
                    }
                });
            };
            
            that.renderBodegas = function(data){
                 $scope.Empresa.vaciarBodegas();
                 var _bodegas = data.bodegas || null;
                 
                 
                 for(var i in _bodegas){
                     var _bodega = _bodegas[i];
                     var bodega = BodegaOrdenCompra.get(_bodega.descripcion, _bodega.bodega_id);
                     bodega.setEmpresaId(_bodega.empresa_id).setCentroUtilidad(_bodega.centro_utilidad).
                     setUbicacion(_bodega.ubicacion);
                     
                     $scope.Empresa.agregarBodega(bodega);
                 }                 
            };
            
            that.guardarBodegaDestino = function(borrar, callback){
                var bodegaSeleccionada = $scope.orden_compra.getBodegaSeleccionada();
                var bodegaDestino = {
                    bodega : bodegaSeleccionada.getCodigo(),
                    empresaId : bodegaSeleccionada.getEmpresaId(),
                    centroUtilidad : bodegaSeleccionada.getCentroUtilidad(),
                    ordenCompraId : $scope.numero_orden
                };
                
                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            bodegaDestino: bodegaDestino,
                            borrarBodega : borrar
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.GUARDAR_BODEGA, "POST", obj, function(data) {

                    if (data.status === 200) {
                         AlertService.mostrarMensaje("warning", "Orden Modificada correctamente");
                         if(callback){
                            callback();
                         }
                    }
                });
            };

            $scope.buscar_orden_compra = function(callback) {

                var obj = {session: $scope.session, data: {ordenes_compras: {numero_orden: $scope.numero_orden}}};

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_ORDEN_COMPRA, "POST", obj, function(data) {
                    
                     
                    
                    if (data.status === 200 && data.obj.orden_compra.length > 0) {

                        var datos = data.obj.orden_compra[0];

                        $scope.orden_compra = OrdenCompra.get(datos.numero_orden, datos.estado, datos.observacion, datos.fecha_registro, datos.observacion_contrato);

                        var unidad_negocio = ($scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio).length > 0) ? $scope.Empresa.get_unidad_negocio(datos.codigo_unidad_negocio) : UnidadNegocio.get(datos.codigo_unidad_negocio, datos.descripcion)

                        $scope.orden_compra.set_unidad_negocio(unidad_negocio);


                        $scope.orden_compra.set_proveedor($scope.Empresa.get_proveedor(datos.codigo_proveedor_id));
                        $scope.orden_compra.set_usuario(Usuario.get(datos.usuario_id, datos.nombre_usuario));
                        $scope.orden_compra.set_descripcion_estado(datos.descripcion_estado);

                        //$scope.codigo_proveedor_id = $scope.orden_compra.get_proveedor().get_codigo_proveedor();
                        $scope.codigo_proveedor_id = $scope.orden_compra.get_proveedor();
                        //$scope.unidad_negocio_id = $scope.orden_compra.get_unidad_negocio().get_codigo();
                        $scope.unidad_negocio_id = $scope.orden_compra.get_unidad_negocio();
                        $scope.observacion_contrato = $scope.orden_compra.get_observacion_contrato();
                        $scope.observacion = $scope.orden_compra.get_observacion();
                        $scope.descripcion_estado = $scope.orden_compra.get_descripcion_estado();

                        // Totales                        
                        $scope.valor_subtotal = datos.subtotal;
                        $scope.valor_iva = datos.valor_iva;
                        $scope.valor_total = datos.total;
                        
                        // Bodega destino
                        
                        if(datos.bodega_destino){
                            var bodegaSeleccionada = BodegaOrdenCompra.get(datos.descripcion_bodega_destino, datos.bodega_destino);
                            bodegaSeleccionada.setEmpresaId(datos.empresa_destino).setCentroUtilidad(datos.centro_utilidad_destino).
                            setUbicacion(datos.ubicacion_bodega_destino);
                            
                            $scope.orden_compra.setBodegaSeleccionada(bodegaSeleccionada);
                        }

                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };
            
            $scope.onSeleccionBodega = function(bodegaSeleccionada){
                
                $scope.orden_compra.setBodegaSeleccionada(bodegaSeleccionada);
                
                if ($scope.numero_orden > 0) {
                    that.guardarBodegaDestino(false);
                }
            };
            
            $scope.onRemoverDestino = function(){
                if ($scope.numero_orden > 0 && $scope.orden_compra.getBodegaSeleccionada()) {
                    that.guardarBodegaDestino(true, function(){
                        $scope.orden_compra.setBodegaSeleccionada(null);
                    });
                }
            };
            
            $scope.buscar_detalle_orden_compra = function(termino, paginando) {

                var termino = termino || "";

                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.pagina_actual = 1;
                }


                var obj = {session: $scope.session, data: {ordenes_compras: {numero_orden: $scope.numero_orden, termino_busqueda: termino, pagina_actual: $scope.pagina_actual}}};

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_DETALLE_ORDEN_COMPRA, "POST", obj, function(data) {

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

                        lista_productos.forEach(function(data) {

                            var producto = Producto.get(data.codigo_producto, data.descripcion_producto, '', parseFloat(data.porc_iva).toFixed(2), data.valor);
                            producto.set_cantidad_seleccionada(data.cantidad_solicitada);
                            producto.setCantidadPendiente(data.cantidadpendiente);
                            producto.set_politicas(data.politicas_producto);
                            producto.setTieneValorPactado(data.tiene_valor_pactado);

                            $scope.orden_compra.set_productos(producto);


                            // Totales                        
                            $scope.valor_subtotal += data.subtotal;
                            $scope.valor_iva += data.valor_iva;
                            $scope.valor_total += data.total;

                        });

                        $scope.cantidad_productos_orden_compra = $scope.orden_compra.get_productos().length;
                    }
                });
            };
            
            
            $scope.onBuscarBodegas = function(terminoBusqueda){
                if(terminoBusqueda.length < 3){
                    return;
                }
                
                that.buscarBodegas(terminoBusqueda);
                
            };

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

                        if ($scope.numero_orden > 0)
                            that.render_proveedores(data.obj.proveedores);

                        //callback(true);
                        callback(data.obj.proveedores);
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

            $scope.eliminar_producto = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra.get_numero_orden(),
                            codigo_producto: $scope.producto_eliminar.getCodigoProducto()
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.ELIMINAR_PRODUCTO_ORDEN_COMPRA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.buscar_detalle_orden_compra();
                    }
                });
            };

            that.modificar_unidad_negocio = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra.get_numero_orden(),
                            unidad_negocio: $scope.unidad_negocio_id
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.MODIFICAR_UNIDAD_NEGOCIO, "POST", obj, function(data) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                    if (data.status === 200) {

                        $scope.orden_compra.set_unidad_negocio($scope.Empresa.get_unidad_negocio($scope.unidad_negocio_id));
                    } else {
                        $scope.unidad_negocio_id = $scope.orden_compra.get_unidad_negocio().get_codigo();
                    }
                });
            };


            $scope.finalizar_orden_compra = function(finalizar_orden_compra) {
                
               
                if($scope.orden_compra.get_estado() === '3' || $scope.orden_compra.get_estado() === '4'){
                    return;
                }
                

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra.get_numero_orden(),
                            finalizar_orden_compra: finalizar_orden_compra
                        }
                    }
                };


                Request.realizarRequest(API.ORDENES_COMPRA.FINALIZAR_ORDEN_COMPRA, "POST", obj, function(data) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                    if (data.status === 200) {
                        if (finalizar_orden_compra)
                            $scope.cancelar_orden_compra();
                    }
                });
            };


            that.insertar_cabercera_orden_compra = function(callback) {
                var bodegaDestino = null;
                    
                var bodegaSeleccionada = $scope.orden_compra.getBodegaSeleccionada();
                        
                if(bodegaSeleccionada){
                    bodegaDestino = {
                        bodega : bodegaSeleccionada.getCodigo(),
                        empresaId : bodegaSeleccionada.getEmpresaId(),
                        centroUtilidad : bodegaSeleccionada.getCentroUtilidad()
                    };
                }
                
                var empresa = Sesion.getUsuarioActual().getEmpresa();
                
                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            unidad_negocio: $scope.orden_compra.get_unidad_negocio().get_codigo(),
                            codigo_proveedor: $scope.orden_compra.get_proveedor().get_codigo_proveedor(),
                            //empresa_id: '03',
                            empresa_id: empresa.getCodigo(),
                            observacion: $scope.orden_compra.get_observacion(),
                            bodegaDestino : bodegaDestino,
                            empresa_pedido : empresa.getCodigo(),
                            centro_utilidad_pedido : empresa.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_pedido : empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                        }
                    }
                };


                Request.realizarRequest(API.ORDENES_COMPRA.CREAR_ORDEN_COMPRA, "POST", obj, function(data) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                    if (data.status === 200 && data.obj.numero_orden > 0) {
                        $scope.orden_compra.set_numero_orden(data.obj.numero_orden);
                        localStorageService.add("numero_orden", $scope.orden_compra.get_numero_orden());
                        $scope.numero_orden = $scope.orden_compra.get_numero_orden();
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            $scope.buscador_productos_orden_compra = function(ev, termino_busqueda) {
                if (ev.which == 13) {
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

            $scope.buscar_productos = function() {
                
             /*   var objAuditoria = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            unidad_negocio: "2",
                            codigo_proveedor: "1156",
                            empresa_id: "03",
                            observacion: "Nueva orden de compra",
                            bodegaDestino : {bodega: "F6", centroUtilidad: "2", empresaId: "F6"},
                            productos:[
                                {codigo_producto: "131M0680160", cantidad: "100", costo: "5700.00"},
                                {codigo_producto: "150D0131450", cantidad: "100", costo: "0.00"},
                                {codigo_producto: "1115A1710540", cantidad: "100", costo: "333.33"}
                            ]
                        }
                    }
                }; 
                
                Request.realizarRequest(API.ORDENES_COMPRA.GENERAR_ORDEN_COMPRA_AUDITORIA, "POST", objAuditoria, function(data) {
                    
                    console.log("[subir_archivo_plano]: data ", data)
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                     
                });*/
                if ($scope.numero_orden === 0) {

                    that.set_orden_compra();
                }


                $scope.slideurl = "views/genererarordenes/gestionarproductos.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos');
            };



            $scope.seleccionar_unidad_negocio = function(unidad) {

                 $scope.unidad_negocio_id = unidad.get_codigo();
                 
                if ($scope.numero_orden > 0) {
                    // Actualizar unidad de negocio
                    that.modificar_unidad_negocio();
                }
            };

            $scope.seleccionar_proveedor = function(proveedor) {               
                //$scope.codigo_proveedor_id = proveedor.get_codigo_proveedor();
                $scope.codigo_proveedor_id = proveedor;
            };

            $scope.modificar_observacion = function() {

                if ($scope.numero_orden > 0 && $scope.observacion !== '' && $scope.observacion !== $scope.orden_compra.get_observacion()) {
                    // Actualizar Observacion

                    var obj = {
                        session: $scope.session,
                        data: {
                            ordenes_compras: {
                                numero_orden: $scope.orden_compra.get_numero_orden(),
                                observacion: $scope.observacion
                            }
                        }
                    };


                    Request.realizarRequest(API.ORDENES_COMPRA.MODIFICAR_OBSERVACION, "POST", obj, function(data) {

                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                        if (data.status === 200) {
                            $scope.orden_compra.set_observacion($scope.observacion);
                        }
                    });
                }
            };

            $scope.cerrar = function() {

                $scope.$emit('cerrar_gestion_productos', {animado: true});

                $scope.numero_orden = $scope.orden_compra.get_numero_orden();

                //Consultar detalle de Orden de Compra
                if ($scope.numero_orden > 0) {
                    $scope.buscar_detalle_orden_compra();
                }
            };

            $scope.cancelar_orden_compra = function() {

                $state.go('ListarOrdenes');
            };

            $scope.lista_productos = {
                data: 'orden_compra.get_productos()',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFooter: true,
                footerTemplate: '   <div class="row col-md-12">\
                                        <div class="col-md-3 pull-right">\
                                            <table class="table table-clear">\
                                                    <tbody>\
                                                            <tr>\
                                                                    <td class="left"><strong>Subtotal</strong></td>\
                                                                    <td class="right">{{valor_subtotal | currency: "$ "}}</td>    \
                                                            </tr>\
                                                            <tr>\
                                                                    <td class="left"><strong>I.V.A</strong></td>\
                                                                    <td class="right">{{valor_iva | currency: "$ "}}</td>                                        \
                                                            </tr>\
                                                            <tr>\
                                                                    <td class="left"><strong>Total</strong></td>\
                                                                    <td class="right">{{valor_total | currency: "$ "}}</td>  \
                                                            </tr>\
                                                    </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: 'politicas', displayName: 'Políticas', width: "10%"},
                    {field: 'cantidad_seleccionada', width: "7%", displayName: "Cantidad Solicitada", enableCellEdit:that.opciones.sw_modificar_orden},
                    {field: 'cantidadPendiente', displayName: 'Cantidad Pendiente', width: "10%"},                    
                    {field: 'iva', width: "7%", displayName: "I.V.A (%)"},
                   // {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "10%", cellFilter: "currency:'$ '", enableCellEdit:that.opciones.sw_modificar_orden, editableCellTemplate: '<input ng-readonly="row.entity.tiene_valor_pactado == 1" placeholder="Costo ultima compra" ng-input="COL_FIELD" ng-model="COL_FIELD" />'},
                   {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "10%", cellFilter: "currency:'$ '", enableCellEdit:that.opciones.sw_modificar_orden},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center dropdown-button",
                        cellTemplate:'<div class="btn-toolbar">\
                                        <button class="btn btn-default btn-xs" ng-validate-events="{{opcionesModulo.btnModificarCantidad}}"\
                                           ng-click="modificarDetalle(row.entity)"  ><span class="glyphicon glyphicon-ok"></span></button>\
                                        <button class="btn btn-default btn-xs"  ng-click="eliminar_producto_orden_compra(row)"><span class="glyphicon glyphicon-remove"></span></button>\
                                       </div>'
                    }
                    
                ]
            };
            
            $scope.modificarDetalle = function(producto){
               
               
               
                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra.get_numero_orden(),
                            codigo_producto: producto.getCodigoProducto(),
                            cantidad_solicitada: producto.get_cantidad_seleccionada(),
                            valor: producto.get_costo(),
                            iva: producto.get_iva(),
                            modificar:true
                        }
                    }
                };


                Request.realizarRequest(API.ORDENES_COMPRA.CREAR_DETALLE_ORDEN_COMPRA, "POST", obj, function(data) {


                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "Modificación realizada");
                        $scope.buscar_detalle_orden_compra("",1);
                    } else {
                        AlertService.mostrarMensaje("warning", "Se ha generado un error");
                    }
                });
                
            };

            $scope.eliminar_producto_orden_compra = function(row) {

                var producto = row.entity;
                $scope.producto_eliminar = producto;


                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el producto?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Codigo.</h4>\
                                    <h5> {{ producto_eliminar.getCodigoProducto() }}</h5>\
                                    <h4>Descripcion.</h4>\
                                    <h5> {{ producto_eliminar.getDescripcion() }} </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.eliminar_producto();
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    }],
                    resolve: {
                        producto_eliminar: function() {
                            return $scope.producto_eliminar;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                $scope.buscar_detalle_orden_compra($scope.termino_busqueda, true);
            };


            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                $scope.buscar_detalle_orden_compra($scope.termino_busqueda, true);
            };


            $scope.opciones_archivo = new Flow();
            $scope.opciones_archivo.target = API.ORDENES_COMPRA.SUBIR_ARCHIVO_PLANO;
            $scope.opciones_archivo.testChunks = false;
            $scope.opciones_archivo.singleFile = true;
            $scope.opciones_archivo.query = {
                session: JSON.stringify($scope.session)
            };



            $scope.cargar_archivo_plano = function($flow) {

                $scope.opciones_archivo = $flow;
            };

            $scope.subir_archivo_plano = function() {
                
                $scope.progresoArchivo = 1; 
               
                if ($scope.numero_orden > 0) {
                    // Solo Subir Plano
                    $scope.opciones_archivo.opts.query.data = JSON.stringify({
                        ordenes_compras: {
                            //empresa_id: '03',
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            numero_orden: $scope.numero_orden,
                            codigo_proveedor_id: $scope.codigo_proveedor_id.get_codigo_proveedor()
                        }
                    });

                    $scope.opciones_archivo.upload();

                } else {
                    // Crear OC y subir plano

                    that.set_orden_compra();

                    that.insertar_cabercera_orden_compra(function(continuar) {

                        if (continuar) {

                            $scope.opciones_archivo.opts.query.data = JSON.stringify({
                                ordenes_compras: {
                                    //empresa_id: '03',
                                    empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                                    numero_orden: $scope.numero_orden,
                                    codigo_proveedor_id: $scope.codigo_proveedor_id.get_codigo_proveedor()
                                }
                            });

                            $scope.opciones_archivo.upload();
                        }
                    });
                } 
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Evento que actualiza la barra de progreso
             */
           socket.on("onNotificarProgresoArchivoPlanoOrdenes", function(datos) {
                $scope.progresoArchivo = datos.porcentaje;
            }); 
            
            

            $scope.respuesta_archivo_plano = function(file, message) {
                //$scope.progresoArchivo = 1;
                var data = (message !== undefined) ? JSON.parse(message) : {};
                if (data.status === 200) {
                    
                    $timeout(function(){
                        
                        $scope.opciones_archivo.cancel();

                        $scope.buscar_detalle_orden_compra();

                        $scope.activar_tab.tab_productos = true;
                        $scope.progresoArchivo = 0;
                        $scope.productos_validos = data.obj.ordenes_compras.productos_validos;
                        $scope.productos_invalidos = data.obj.ordenes_compras.productos_invalidos;
                        
                        if($scope.productos_invalidos.length === 0){
                            return;
                        }

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Listado Productos </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >Lista Productos INVALIDOS.</h4>\
                                                <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                                    <div class="list-group">\
                                                        <a ng-repeat="producto in productos_invalidos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                            {{ producto.codigo_producto}} - {{producto.error}}\
                                                        </a>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                        </div>',
                            scope: $scope,
                            controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    },500);

                } else {
                    $scope.opciones_archivo.cancel();
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            };

            that.gestionar_consultas();

            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                $scope.Empresa.limpiar_proveedores();
                socket.remove(["onNotificarProgresoArchivoPlanoOrdenes", "onListarOrdenesCompras"]);
            });

        }]);
});