
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
        "ProductoIngreso",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Documento, Proveedor, OrdenCompra, Sesion,Producto) {

            var that = this;

            $scope.Empresa = Empresa;
            $scope.doc_tmp_id = "00000";

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
                $scope.buscar_productos_orden_compra();  
                that.listarParametros();
                that.listarGetDocTemporal();
                that.listarGetItemsDocTemporal();
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
            
            $scope.grabar_documento = function() {
              // that.guardarNewDocTmp(); //ok
              //that.listarBodegasMovimientoTemporal(); //ok
              that.listarParametros(); //ok
              that.listarGetItemsDocTemporal(); //OK
//              that.listarGetDocTemporal();
            };
            

            $scope.lista_productos_ingresados = {
                data: 'DocumentoIngreso.get_orden_compra().get_productos_ingresados()',
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
                                                        <th class="text-center">IMPTO CREE</th>\
                                                        <th class="text-center">VALOR TOTAL</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody>\
                                                    <tr>\
                                                        <td class="right">{{cantidadTotal}}</td> \
                                                        <td class="right">{{valorSubtotal | currency: "$ "}}</td> \
                                                        <td class="right">{{valorIva | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetFte | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetIca | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetIva | currency: "$ "}}</td> \
                                                        <td class="right">{{imptoCree | currency: "$ "}}</td> \
                                                        <td class="right">{{valorTotal | currency: "$ "}}</td> \
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'getDescripcion()', displayName: 'Descripcion'},
                    {field: 'get_lote()', displayName: 'Lote', width: "5%"},
                    {field: 'get_fecha_vencimiento()', displayName: 'Fecha Vencimiento', cellFilter: "date:\'dd-MM-yyyy\'", width: "10%"},
                    {field: 'get_cantidad_solicitada()', width: "7%", displayName: "Cantidad"},
                    {field: 'get_iva()', displayName: "I.V.A (%)", width: "5%"},
                    {field: 'get_porcentaje_gravamen()', displayName: '% Gravament', width: "5%"},
                    {field: 'get_valor_total()', displayName: 'Valor Total', width: "10%", cellFilter:'currency'},
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
            
           /////////////////////////////////////////////// 
              that.listarGetDocTemporal = function() {

                    var obj = {
                        session: $scope.session,
                        data: {
                            orden_pedido_id: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden()

                        }
                    };

                    Request.realizarRequest(API.I002.LISTAR_GET_DOC_TEMPORAL, "POST", obj, function(data) {

                        if (data.status === 200) {
                            that.renderGetDocTemporal(data.obj.listarGetDocTemporal);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("warning", data.msj);
                        }
                    });
                };
                
            
            $scope.valorRetFte =0;
            $scope.valorRetIca =0;
            $scope.valorRetIva =0;
            $scope.imptoCree =0;
           that.renderGetDocTemporal = function(docTemporal) {                 
                   $scope.DocumentoIngreso.get_orden_compra().set_retefuente(docTemporal[0].porcentaje_rtf);
                   $scope.DocumentoIngreso.get_orden_compra().set_reteica(docTemporal[0].porcentaje_ica);
                   $scope.DocumentoIngreso.get_orden_compra().set_reteiva(docTemporal[0].porcentaje_reteiva);
                   $scope.DocumentoIngreso.get_orden_compra().set_cree(docTemporal[0].porcentaje_cree);   
                  console.log("$scope.listarParametrosRetencion ",$scope.listarParametrosRetencion) 
                   $scope.imptoCree = docTemporal[0].porcentaje_cree;
                   $scope.valorRetFte = docTemporal[0].porcentaje_rtf;
                   $scope.valorRetIca = docTemporal[0].porcentaje_ica;
                   $scope.valorRetIva = docTemporal[0].porcentaje_reteiva;
                   $scope.doc_tmp_id = docTemporal[0].doc_tmp_id;
                   console.log("docTemporal::  ",docTemporal);
                            
            };
           ////////////////////////////
                
            
              that.listarGetItemsDocTemporal = function() {
                  
                var obj = {
                    session: $scope.session,
                    data: {
                          orden_pedido_id : $scope.DocumentoIngreso.get_orden_compra().get_numero_orden()                       
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_GET_ITEMS_DOC_TEMPORAL, "POST", obj, function(data) {
                    console.log("LISTAR_GET_ITEMS_DOC_TEMPORAL ",data);
                    if (data.status === 200) {         
                        that.renderGetDocItemTemporal(data.obj.listarGetItemsDocTemporal);
                    }
                    if (data.status === 500) {     
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            
             // Totales   
            $scope.valorIva =0;
            $scope.cantidadTotal =0;
            $scope.valorSubtotal =0;            
            $scope.valorTotal =0;
            
            that.renderGetDocItemTemporal = function(docItemTemporal) {
                
              docItemTemporal.forEach(function(data) {

                  var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.iva).toFixed(2), data.valor_unit, data.lote,data.fecha_vencimiento);
                  producto.set_cantidad_solicitada(data.cantidad);
                  producto.set_item_id(data.item_id);
                  producto.set_valor_total(data.valor_total);
                  producto.set_unidad_id(data.unidad_id);
                  producto.set_item_id_compras(data.item_id_compras);
                  producto.set_iva_total(data.iva_total);
                  producto.set_total_costo(data.total_costo);
                  producto.set_porcentaje_gravamen(data.porcentaje_gravamen);
                  $scope.DocumentoIngreso.get_orden_compra().set_productos_ingresados(producto);
                  
                  $scope.valorIvaTotal += data.iva_total;
                  $scope.cantidadTotal += data.cantidad;
                  $scope.valorSubtotal += data.valor_total;                  
                  $scope.valorTotal += data.total_costo;
                });
                   //$scope.DocumentoIngreso.get_orden_compra();
                  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",$scope.DocumentoIngreso.get_orden_compra());              
            };
            
              $scope.listarParametrosRetencion;
              that.listarParametros = function() {
                  
                var obj = {
                    session: $scope.session,
                    data: {
                            empresa_id:'03'
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_PARAMETROS_RETENCION, "POST", obj, function(data) {
                    console.log("LISTAR_PARAMETROS_RETENCION ",data);
                    if (data.status === 200) {         
                        that.renderListarParametros(data.obj.listarParametrosRetencion);
                    }
                    if (data.status === 500) {     
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            
            that.renderListarParametros = function(parametros) {               
                if (parametros[0].sw_rtf === '2' || parametros[0].sw_rtf === '3')
                     if ($scope.valorSubtotal >= parametros[0].base_rtf)
                       $scope.valorRetFte = $scope.valorSubtotal * ($scope.valorRetFte / 100);  
               
                if (parametros[0].sw_ica === '2' || parametros[0].sw_ica === '3')
                    if ($scope.valorSubtotal >= parametros[0].base_ica)
                        $scope.valorRetIca = $scope.valorSubtotal * ($scope.valorRetIca / 1000);

                if (parametros[0].sw_reteiva === '2' || parametros[0].sw_reteiva === '3')
                    if ($scope.valorSubtotal >= parametros[0].base_reteiva)
                        $scope.valorRetIva = $scope.valorIvaTotal * ($scope.valorRetIva / 100);
                
              
                if (!is_null($scope.imptoCree))
                {
                    $scope.imptoCree = (($scope.imptoCree/ 100) * $scope.valorSubtotal);
                }

                $scope.valorTotal  = ((((($scope.valorSubtotal + $scope.imptoCree) - $scope.valorRetFte) - $scope.valorRetIca) - $scope.valorRetIva) - $scope.imptoCree);
                         
                 console.log("parametros ",parametros);   //['sw_rtf']        
            };
            
            
              that.guardarNewDocTmp = function() {
                  
                var obj = {
                    session: $scope.session,
                    data: {
                            orden_pedido_id:$scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                            bodegas_doc_id:datos_documento.bodegas_doc_id,
                            observacion: $scope.DocumentoIngreso.observacion
                    }
                };

                Request.realizarRequest(API.I002.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {
                    console.log("guardarNewDocTmp ",data);
                    if (data.status === 200) {         
                        AlertService.mostrarMensaje("warning", data.msj);
                        $scope.doc_tmp_id =data.obj.movimiento_temporal_id;

                    }
                    if (data.status === 500) {     
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            
              that.listarBodegasMovimientoTemporal = function() {
                  
                var obj = {
                    session: $scope.session,
                    data: {                       
                            orden_pedido_id:$scope.DocumentoIngreso.get_orden_compra().get_numero_orden()                       
                          }
                };

                Request.realizarRequest(API.I002.LISTAR_INV_BODEGAS_MOVIMIENTO_TEMPORAL_ORDEN, "POST", obj, function(data) {
                    console.log("LISTAR_INV_BODEGAS_MOVIMIENTO_TEMPORAL_ORDEN ",data);
                    if (data.status === 200) {         
                      console.log("",data.status);
                    }
                    if (data.status === 500) {     
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };


                
                
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

              $scope.lista_productos_orden = {
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
                
                if(producto.get_fecha_vencimiento() === undefined || producto.get_fecha_vencimiento()===""){
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
                
                if(producto.get_fecha_vencimiento() === undefined || producto.get_fecha_vencmiento()===""){
                    disabled = true;
                }
                
                if(producto.get_valor_unitario() === undefined || producto.get_valor_unitario()==="" || producto.get_valor_unitario() <= 0 ){
                    disabled = true;
                }
                
                return disabled;
            };


            for (i = 0; i < 200; i++) {
                $scope.datos_view.listado.push({nombre: 'producto - ' + i});
            }


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});