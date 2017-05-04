
define([
    "angular",
    "js/controllers",
    
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
        "GeneralService",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Documento, Proveedor, OrdenCompra, Sesion, Producto, GeneralService) {

            var that = this;
            $scope.Empresa = Empresa;
            $scope.doc_tmp_id = "00000";
            $scope.valorRetFte = 0;
            $scope.valorRetIca = 0;
            $scope.valorRetIva = 0;
            $scope.imptoCree = 0;
            $scope.valorIva = 0;
            $scope.cantidadTotal = 0;
            $scope.valorSubtotal = 0;
            $scope.valorTotal = 0;
            $scope.total = 0;
            $scope.valorIvaTotal = 0;
            $scope.gravamen = 0;
            $scope.cantidadRecibida = 0;
            $scope.cantidadIngresada;
            $scope.entrar = "";
            $scope.listarParametrosRetencion;
            $scope.totalPorAutorizar;
            $scope.validarDesdeLink = false;            
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

            /****************************proverdores**********************************/
            
           // 
                        
                       
            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado listar todos los proveedores
             */
            $scope.listar_proveedores = function(termino_busqueda,termino) {
                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_proveedores = termino_busqueda;

                if(termino){
                that.buscar_proveedores(function(proveedores) {

                    that.render_proveedores(proveedores,false);
                });
                }else{
                    that.buscarProveedoresPorCodigo(function(proveedores) {

                    that.render_proveedores(proveedores,true);
                 });
                }
            };
          

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de buscar los proveedores en bd
             */
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
                        callback(data.obj.proveedores);
                    }
                });
            };
            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de buscar los proveedores en bd
             */
            that.buscarProveedoresPorCodigo = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_proveedores
                        }
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_PROVEEDORES_POR_CODIGO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        callback(data.obj.proveedores);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar el render de proveedores
             */
            that.render_proveedores = function(proveedores,porDefecto) {

                $scope.Empresa.limpiar_proveedores();

                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                    if(porDefecto){
                     $scope.DocumentoIngreso.set_proveedor(proveedor);
                     that.buscar_ordenes_compra();
                    }
                });
            };
            
            $scope.seleccionar_proveedor = function() {
                // Buscar Ordenes Compra del Proveedor Seleccionado
                that.buscar_ordenes_compra();
            };
            /*******************************************************************/

            /*************************Orden de Compra********************************/
            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar la busqueda de orden de compra
             */
            that.buscar_ordenes_compra = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            centroUtilidad: Sesion.getUsuarioActual().getEmpresa().centroUtilidad.codigo,
                            bodega: Sesion.getUsuarioActual().getEmpresa().centroUtilidad.bodega.codigo,
                            codigo_proveedor_id: $scope.DocumentoIngreso.get_proveedor().get_codigo(),
                            bloquearEstados:true
                        }
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_ORDENES_COMPRAS_PROVEEDOR, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_ordenes_compras(data.obj.ordenes_compras);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar el render de los datos de la orden de compra
             */
            that.render_ordenes_compras = function(ordenes_compras) {

                $scope.DocumentoIngreso.get_proveedor().limpiar_ordenes_compras();

                ordenes_compras.forEach(function(orden) {

                    var orden_compra = OrdenCompra.get(orden.numero_orden, orden.estado, orden.observacion, orden.fecha_registro);
                    $scope.DocumentoIngreso.get_proveedor().set_ordenes_compras(orden_compra);
                    if(datos_documento.datosAdicionales !== undefined)
                    if(datos_documento.datosAdicionales.orden === orden.numero_orden){                       
                      $scope.DocumentoIngreso.orden_compra=orden_compra;
                      $scope.seleccionar_orden_compra();
                    }
                });
            };


            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado listar getDotTemporal
             */
            that.listarGetDocTemporal = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden()

                    }
                };

                Request.realizarRequest(API.I002.LISTAR_GET_DOC_TEMPORAL, "POST", obj, function(data) {

                    if (data.status === 200) {

                        if (data.obj.listarGetDocTemporal.length > 0) {
                            that.renderGetDocTemporal(data.obj.listarGetDocTemporal, function(respuesta) {
                                callback(respuesta);
                            });
                        }
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar el render de los datos de GetDocTemporal
             */
            that.renderGetDocTemporal = function(docTemporal, callback) {
                $scope.DocumentoIngreso.get_orden_compra().set_retefuente(docTemporal[0].porcentaje_rtf);
                $scope.DocumentoIngreso.get_orden_compra().set_reteica(docTemporal[0].porcentaje_ica);
                $scope.DocumentoIngreso.get_orden_compra().set_reteiva(docTemporal[0].porcentaje_reteiva);
                $scope.DocumentoIngreso.get_orden_compra().set_cree(docTemporal[0].porcentaje_cree);
                $scope.DocumentoIngreso.set_observacion(docTemporal[0].observacion);
                $scope.imptoCree = docTemporal[0].porcentaje_cree;
                $scope.valorRetFte = docTemporal[0].porcentaje_rtf;
                $scope.valorRetIca = docTemporal[0].porcentaje_ica;
                $scope.valorRetIva = docTemporal[0].porcentaje_reteiva;
                $scope.doc_tmp_id = docTemporal[0].doc_tmp_id;
                callback(true);
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado listar GetItemsDocTemporal
             */
            that.listarGetItemsDocTemporal = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden()
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_GET_ITEMS_DOC_TEMPORAL, "POST", obj, function(data) {
                    if (data.status === 200) {
                        that.renderGetDocItemTemporal(data.obj.listarGetItemsDocTemporal, function(respuesta) {
                            callback(respuesta);
                        });
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar el render de los datos de GetDocItemTemporal
             */
            that.renderGetDocItemTemporal = function(docItemTemporal, callback) {
                $scope.DocumentoIngreso.get_orden_compra().limpiar_productos_ingresados();
                docItemTemporal.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.iva).toFixed(2), data.valor_unit, data.lote, data.fecha_vencimiento);
                    producto.set_cantidad_solicitada(data.cantidad);
                    producto.set_item_id(data.item_id);
                    producto.set_valor_total(data.valor_total);
                    producto.set_unidad_id(data.unidad_id);
                    producto.set_item_id_compras(data.item_id_compras);
                    producto.set_iva_total(data.iva_total);
                    producto.set_total_costo(data.total_costo);
                    producto.set_porcentaje_gravamen(data.porcentaje_gravamen);
                    $scope.DocumentoIngreso.get_orden_compra().set_productos_ingresados(producto);
                    $scope.gravamen += parseFloat(data.iva_total);
                    $scope.cantidadTotal += parseFloat(data.cantidad);
                    $scope.valorSubtotal += parseFloat(data.valor_total);
                    $scope.valorTotal += parseFloat(data.total_costo);
                });

                callback(true);
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado listar ProductosPorAutorizar
             */
            that.listarProductosPorAutorizar = function(callback) {
                
                if($scope.doc_tmp_id ===  "00000"){
                    return;
                }
                
                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                        empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo()
                    }
                };
                 
                Request.realizarRequest(API.I002.LISTAR_PRODUCTOS_POR_AUTORIZAR, "POST", obj, function(data) {
                    if (data.status === 200) {
                        that.renderListarProductosPorAutorizar(data.obj.listarProductosPorAutorizar, function(respuesta) {
                        //    callback(respuesta);
                        });
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };


            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar el render de los datos de ProductosPorAutorizar
             */
            that.renderListarProductosPorAutorizar = function(docItemTemporal, callback) {
                $scope.DocumentoIngreso.get_orden_compra().limpiar_productos_seleccionados();
                $scope.totalPorAutorizar=docItemTemporal.length;
                docItemTemporal.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.iva).toFixed(2), data.valor_unit, data.lote, data.fecha_vencimiento);
                    producto.set_cantidad_solicitada(data.cantidad);
                    producto.set_item_id(data.item_id);
                    producto.set_valor_total(data.total_costo);
                    producto.set_unidad_id(data.unidad_id);
                    producto.set_item_id_compras(data.item_id_compras);
                    producto.set_iva_total(data.iva_total);
                    producto.set_total_costo(data.total_costo);
                    producto.set_porcentaje_gravamen(data.porcentaje_gravamen);
                    $scope.DocumentoIngreso.get_orden_compra().set_productos_seleccionados(producto);

                });

                callback(true);
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado listar Parametros
             */
            that.listarParametros = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo()
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_PARAMETROS_RETENCION, "POST", obj, function(data) {
                    if (data.status === 200) {
                        that.renderListarParametros(data.obj.listarParametrosRetencion);
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar el render de los datos de ListarParametros
             */
            that.renderListarParametros = function(parametros) {
                
                if (parametros[0].sw_rtf === '2' || parametros[0].sw_rtf === '3')
                    if ($scope.valorSubtotal >= parseInt(parametros[0].base_rtf)){
                        $scope.valorRetFte = $scope.valorSubtotal * ($scope.valorRetFte / 100);
                    }else{
                      $scope.valorRetFte =0;  
                    }
                if (parametros[0].sw_ica === '2' || parametros[0].sw_ica === '3')
                    if ($scope.valorSubtotal >= parseInt(parametros[0].base_ica)){
                        $scope.valorRetIca = $scope.valorSubtotal * ($scope.valorRetIca / 1000);
                    }else{
                      $scope.valorRetIca =0;
                    }
                if (parametros[0].sw_reteiva === '2' || parametros[0].sw_reteiva === '3')
                    if ($scope.valorSubtotal >= parseInt(parametros[0].base_reteiva)){
                       $scope.valorRetIva = $scope.gravamen * ($scope.valorRetIva / 100);
                    }else{
                       $scope.valorRetIva =0;
                    }
                
                if ($scope.imptoCree != null && $scope.imptoCree !== undefined)
                {
                    $scope.imptoCree = (($scope.imptoCree / 100) * $scope.valorSubtotal);
                }else{
                    $scope.imptoCree = 0;
                }    
                $scope.total = ((((($scope.valorSubtotal + $scope.gravamen) - $scope.valorRetFte) - $scope.valorRetIca) - $scope.valorRetIva) - $scope.imptoCree);

            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de realizar el update y el insert  del detalle de la orden de Compra
             * parametros: variables 
             * createUpdate 0-crear, 1-Modificar
             */
            that.guardarModificarDetalleOrdenCompra = function(parametros, createUpdate, cantidadIngresada) {
                var ordenes_compras = {
                    numero_orden: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                    codigo_producto: parametros.codigo_producto,
                    cantidad_solicitada: cantidadIngresada,
                    valor: parametros.valor_unitario,
                    iva: parametros.iva,
                    modificar: createUpdate,
                    estado_documento: true,
                    item_id: parametros.item_id
                };
                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: ordenes_compras
                    }
                };

                Request.realizarRequest(API.I002.CREAR_DETALLE_ORDEN_COMPRA, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        that.refrescarVista();
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de realizar buscar productos_orden_compra
             * parametros: variables 
             */
            $scope.buscar_productos_orden_compra = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                            termino_busqueda: '',
                            filtro:'1',
                            pagina_actual: 1
                        }
                    }
                };

                Request.realizarRequest(API.I002.CONSULTAR_DETALLE_ORDEN_COMPRA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_productos(data.obj.lista_productos);

                    }
                    
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado realizar el render productos
             */
            that.render_productos = function(productos) {

                $scope.Empresa.limpiar_productos();
                
                productos.forEach(function(data) {
                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, parseFloat(data.porc_iva).toFixed(2), data.valor, data.lote_temp,data.fecha_vencimiento_temp);
                    if(data.cantidadpendiente > 0){
                    producto.set_cantidad_solicitada(data.cantidadpendiente);
                    }else{
                    producto.set_cantidad_solicitada(data.cantidad_solicitada);
                    }
                    producto.set_is_tmp(data.tmp);
                    producto.set_item_id(data.item_id);
                    producto.set_item_id_compras(data.item_id_compras);
                    producto.set_sw_autorizado(data.sw_autorizado);
                    producto.set_sw_estado(data.estadoproducto);
                    $scope.Empresa.set_productos(producto);

                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado crear el documento
             */
            that.crearDocumento = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            orden_pedido_id: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                            doc_tmp_id: $scope.doc_tmp_id,
                            usuario_id: Sesion.getUsuarioActual().getId()
                        }
                    }
                };

                Request.realizarRequest(API.I002.EXEC_CREAR_DOCUMENTOS, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                        
                        AlertService.mostrarMensaje("warning", data.msj);
                        that.buscar_ordenes_compra();
                        that.refrescarVista();
                        $scope.DocumentoIngreso.orden_compra="";
                        var nombre = data.obj.nomb_pdf;                        
                        setTimeout(function(){
                            $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                        },4000);
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de listar BodegasMovimientoTemporal
             */
            that.listarBodegasMovimientoTemporal = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden()
                    }
                };

                Request.realizarRequest(API.I002.LISTAR_INV_BODEGAS_MOVIMIENTO_TEMPORAL_ORDEN, "POST", obj, function(data) {
                    if (data.status === 200) {

                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de additemDocTemporal
             */
            that.additemDocTemporal = function(movimientos_bodegas) {

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: movimientos_bodegas
                    }
                };

                GeneralService.addItemDocTemporal(obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        that.refrescarVista();
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    if (data.status === 403) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            
            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de guardar NewDocTmp
             */
            that.guardarNewDocTmp = function() {
              
                if($scope.DocumentoIngreso.get_orden_compra().fecha_registro ===  undefined){
                    return;
                }
                  
                var obj = {
                    session: $scope.session,
                    data: {
                            orden_pedido_id:$scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                            bodegas_doc_id:datos_documento.bodegas_doc_id,
                            observacion: $scope.DocumentoIngreso.get_proveedor().get_ordenes_compras()[0].observacion
                    }
                };

                Request.realizarRequest(API.I002.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {
                    if (data.status === 200) {         
                        AlertService.mostrarMensaje("warning", data.msj);
                        $scope.doc_tmp_id =data.obj.movimiento_temporal_id;
                        $scope.isTmp();
                    }
                    if (data.status === 500) {     
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    if (data.status === 404) {     
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            /*******************************************************************/

            /******************************Eliminacion de datos*************************************/
            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de invocar el servicio que
             *              borra los productos del movimiento temporal
             */
            that.eliminarProductoMovimientoBodegaTemporal = function(parametro, callback) {
                var obj = {
                    session: $scope.session,
                    item_id: parametro.item_id
                };
                GeneralService.eliminarProductoMovimientoBodegaTemporal(obj, function(data) {

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema Eliminacion fallida: ", data.msj);
                        callback(false);

                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/04/2017
             * +Descripcion Metodo encargado de invocar el servicio que
             *              borra los DocTemporal
             */
            that.eliminarGetDocTemporal = function() {
                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                        doc_tmp_id: $scope.doc_tmp_id
                    }
                };
                GeneralService.eliminarGetDocTemporal(obj, function(data) {
                     if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        that.buscar_ordenes_compra();
                        that.refrescarVista();
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author Andres M. Gonzalez
             * @fecha 25/04/2017
             * +Descripcion Metodo encargado de eliminar Producto Movimiento Bodega Temporal
             */
            $scope.eliminar_producto = function(item_id) {

                parametro = {item_id: item_id};
                that.eliminarProductoMovimientoBodegaTemporal(parametro, function(condicional) {
                    if (condicional) {
                        that.refrescarVista();
                        AlertService.mostrarMensaje("warning", "El Producto fue Eliminado Correctamente!!");
                    }
                });

            };

            $scope.eliminar_documento = function() {
                that.eliminarGetDocTemporal();
            };

            that.borarrVariables = function() {
                $scope.doc_tmp_id = "00000";
                $scope.valorRetFte = 0;
                $scope.valorRetIca = 0;
                $scope.valorRetIva = 0;
                $scope.imptoCree = 0;
                $scope.valorIva = 0;
                $scope.cantidadTotal = 0;
                $scope.valorSubtotal = 0;
                $scope.valorTotal = 0;
                $scope.total = 0;
                $scope.valorIvaTotal = 0;
                $scope.gravamen = 0;
                $scope.totalPorAutorizar="";
            };

            /*******************************************************************/
            
            $scope.tabProductosOrden=function(){
                that.refrescarVista();
            };
            
            $scope.tabProductosPorAutorizar = function() {
                that.listarProductosPorAutorizar(function(respuesta) {
                });
            };

            $scope.cancelar_documento = function() {
                $state.go('DocumentosBodegas');
            };

            $scope.generar_documento = function() {
                that.crearDocumento();
            };

            $scope.grabar_documento = function() {
                that.guardarNewDocTmp(); //ok
                //that.listarBodegasMovimientoTemporal(); //ok
//              that.listarParametros(); //ok
//              that.listarGetItemsDocTemporal(); //OK
//              that.listarGetDocTemporal();
                //    that.crearDocumento(); ok
            };

            $scope.seleccionar_orden_compra = function() {

                that.borarrVariables();
                $scope.buscar_productos_orden_compra();
                that.listarGetDocTemporal(function(respuesta) {
                    if (respuesta) {
                        that.listarGetItemsDocTemporal(function(respuesta) {
                            if (respuesta) {
                                that.listarParametros();
                                that.listarProductosPorAutorizar();
                            }
                        });
                    }
                });
            };

            $scope.seleccionar_productos = function(opcion) {

                $scope.datos_view.btn_buscar_productos = opcion;

                if ($scope.datos_view.btn_buscar_productos === 0) {
                    $scope.slideurl = "views/I002/gestionarproductos.html?time=" + new Date().getTime();
                    $scope.$emit('gestionar_productos_orden_compra');
                }

                if ($scope.datos_view.btn_buscar_productos === 1) {
                    $scope.slideurl = "views/I002/gestionarproductos.html?time=" + new Date().getTime();
                    $scope.$emit('gestionar_productos', {ordenCompra: $scope.DocumentoIngreso.get_orden_compra(), empresa: Sesion.getUsuarioActual()});
                }
            };

            that.refrescarVista = function() {

                that.borarrVariables();

                $scope.buscar_productos_orden_compra();
                $scope.Empresa.limpiar_productos();
                $scope.DocumentoIngreso.get_orden_compra().limpiar_productos_ingresados();
                $scope.DocumentoIngreso.get_orden_compra().limpiar_productos_seleccionados();

                that.listarGetDocTemporal(function(respuesta) {

                    if (respuesta) {

                        that.listarGetItemsDocTemporal(function(respuesta) {

                            if (respuesta) {

                                that.listarParametros();
                                that.listarProductosPorAutorizar();
                            }
                        });
                    }
                });
            };

            /*
             * retorna la diferencia entre dos fechas
             */
            $scope.restaFechas = function(f1, f2)
            {
                var aFecha1 = f1.split('/');
                var aFecha2 = f2.split('/');
                var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
                var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
                var dif = fFecha2 - fFecha1;
                var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
                return dias;
            };


            $scope.habilitar_btn_productos = function() {

                var disabled = false;

                if ($scope.DocumentoIngreso.get_proveedor() === undefined || $scope.DocumentoIngreso.get_proveedor() === "") {
                    disabled = true;
                }

                if ($scope.DocumentoIngreso.get_orden_compra() === undefined || $scope.DocumentoIngreso.get_orden_compra() === "") {
                    disabled = true;
                }
                
                return disabled;
            };

            // Desplegar slider para gestionar productos


            // Cerrar slider para gestionar productos
            $scope.cerrar_seleccion_productos = function() {

                if ($scope.datos_view.btn_buscar_productos === 0)
                    $scope.$emit('cerrar_gestion_productos_orden_compra', {animado: true});

                if ($scope.datos_view.btn_buscar_productos === 1)
                    $scope.$emit('cerrar_gestion_productos', {animado: true});
                
                that.refrescarVista();
            };

            $scope.btn_eliminar_producto = function(fila) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="cerrar()">&times;</button>\
                                    <h4 class="modal-title">MENSAJE DEL SISTEMA</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el siguiente producto?</h4>\
                                    <h5>' + fila.descripcion + '</h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="cerrar()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar_eliminar_producto()" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar_eliminar_producto = function() {
                            $scope.eliminar_producto(fila.item_id);
                            $modalInstance.close();
                        };

                        $scope.cerrar = function() {
                            $modalInstance.close();
                        };

                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            $scope.solicitar_aprobacion = function(fila) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="cerrar()">&times;</button>\
                                    <h4 class="modal-title">MENSAJE DEL SISTEMA</h4>\
                                </div>\
                                    <div class="modal-body">\
                                     <div ng-if="'+fila.validacionprecio+'">\
                                        <h4>El Precio Unitario $'+fila.valor_unitario_ingresado+' es Mayor al de la Orden de Compra $'+fila.valor_unitario+'</h4>\
                                    </div>\
                                     <div ng-if="'+fila.validacionfecha+'">\
                                        <h4>El Producto esta Proximo a Vencer '+fila.fecha_vencimiento_formato+'</h4>\
                                    </div>\
                                      <h4>Desea solicitar Autorizacion?</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="cerrar()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar_guardar_producto()" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar_guardar_producto = function() {
                            fila.valor_unit=fila.valor_unitario_ingresado;                           
                            $scope.guardarProducto(fila);
                            $modalInstance.close();
                        };

                        $scope.cerrar = function() {
                            $modalInstance.close();
                        };

                    }
                };
                var modalInstance = $modal.open($scope.opts);
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

            $scope.btnAdicionarNuevoLote = function(entity) {
                $scope.producto = entity;
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Agregar Cantidad para Nuevo Lote</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <table class="table table-condensed" width="100%">\
                                        <thead>\
                                            <tr>\
                                                <td width="25%">Codigo</td>\
                                                <td width="55%">Descripción</td>\
                                                <td width="20%">Cantidad</td>\
                                            </tr>\
                                        <thead>\
                                        <tbody>\
                                            <tr>\
                                                <td>{{producto.codigo_producto}}</td>\
                                                <td>{{producto.descripcion}}</td>\
                                                <td><div class="col-xs-12"> <input type="text" size="30" class="form-control grid-inline-input" ng-keyup="validarNumeroIngresado(producto.cantidad_solicitada)" ng-model="cantidadIngresada" name="" id=""  placeholder="< {{producto.cantidad_solicitada}}" validacion-numero-entero required /></div></td>\
                                            </tr>\
                                        </tbody>\
                                    </table>\
                                    <div ng-if="validarNumeroIngresado(producto.cantidad_solicitada)" >\
                                        <div class="alert alert-danger">{{entrar}}: {{producto.cantidad_solicitada}}</div> \
                                     </div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">Cancelar</button>\
                                    <button class="btn btn-primary" ng-click="crearNuevoLote(producto,0,cantidadIngresada)" ng-disabled="validarNumeroIngresado(producto.cantidad_solicitada)" >Agregar</button>\
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

                        $scope.validarNumeroIngresado = function(cantidad) {
                            if ($scope.cantidadIngresada > 0 && $scope.cantidadIngresada < cantidad) {
                                return false;
                            } else if ($scope.cantidadIngresada === 0) {
                                $scope.entrar = "La Cantidad debe ser menor a ";
                                $scope.cantidadIngresada = "";
                                return true;
                            } else {
                                $scope.entrar = "La Cantidad debe ser mayor a 0 y menor que ";
                                $scope.cantidadIngresada = "";
                                return true;
                            }
                        };

                        $scope.crearNuevoLote = function(producto, createUpdate, cantidadIngresada) {
                            that.guardarModificarDetalleOrdenCompra(producto, createUpdate, cantidadIngresada);
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };


            $scope.lista_productos_ingresados = {
                data: 'DocumentoIngreso.get_orden_compra().get_productos_ingresados()',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFooter: true,
                showFilter: true,
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
                                                        <td class="right">{{gravamen | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetFte | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetIca | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetIva | currency: "$ "}}</td> \
                                                        <td class="right">{{imptoCree | currency: "$ "}}</td> \
                                                        <td class="right">{{total | currency: "$ "}}</td> \
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
                    {field: 'get_cantidad_solicitada()', width: "7%", displayName: "Cantidad",cellFilter: "number"},
                    {field: 'get_iva()', displayName: "Valor IVA", width: "5%"},
                    {field: 'get_porcentaje_gravamen()', displayName: '% Gravament', width: "5%"},
                    {field: 'get_valor_total()', displayName: 'Valor Total', width: "10%", cellFilter: 'currency'},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };

            $scope.lista_productos_no_autorizados = {
                data: 'DocumentoIngreso.get_orden_compra().get_productos_seleccionados()',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo Producto', width: "10%"},
                    {field: 'getDescripcion()', displayName: 'Descripcion'},
                    {field: 'get_lote()', displayName: 'Lote', width: "5%"},
                    {field: 'get_fecha_vencimiento()', displayName: 'Fecha Vencimiento', cellFilter: "date:\'dd-MM-yyyy\'", width: "10%"},
                    {field: 'get_cantidad_solicitada()', width: "7%", displayName: "Cantidad" },
                    {field: 'get_iva()', displayName: "I.V.A (%)", width: "5%"},
                    {field: 'get_porcentaje_gravamen()', displayName: '% Gravament', width: "5%"},
                    {field: 'get_valor_total()', displayName: 'Valor Total', width: "10%", cellFilter: 'currency'},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'}
                ]
            };

            $scope.ingresar_producto = function(productos) {
                
                var fecha_actual = new Date();
                fecha_actual = $filter('date')(new Date(fecha_actual), "dd/MM/yyyy");
                var fecha_vencimiento = $filter('date')(new Date(productos.fecha_vencimiento), "dd/MM/yyyy");

                var diferencia = $scope.restaFechas(fecha_actual, fecha_vencimiento);

                if (parseInt(productos.cantidadActual) <= 0 || productos.cantidadActual.trim() === "") {
                    AlertService.mostrarMensaje("warning", "La cantidad debe ser mayor 0");
                    return;
                }
                
                if (parseInt(productos.cantidadActual) > parseInt(productos.cantidad_solicitada)) {
                    AlertService.mostrarMensaje("warning", "La Cantidad Ingresada debe ser menor o igual a la Cantidad de la Orden");
                    return;
                }

                if (productos.lote.trim() === "") {
                    AlertService.mostrarMensaje("warning", "Debe ingresar el lote");
                    return;
                }

                if (productos.localizacion.trim() === "") {
                    AlertService.mostrarMensaje("warning", "Debe ingresar el lote");
                    return;
                }

                if (productos.localizacion.trim() === "") {
                    AlertService.mostrarMensaje("warning", "Debe ingresar la Localizacion");
                    return;
                }
                
                if (diferencia < 0) {
                    AlertService.mostrarMensaje("warning", "Producto vencido");
                    return;
                }
                
                
                if (productos.valor_unitario_ingresado > (productos.valor_unitario+0.999) || diferencia >= 0 && diferencia <= 45) {
                    var mensaje="";
                    var validacionprecio=false;
                    var validacionfecha=false;
                    if (productos.valor_unitario_ingresado > productos.valor_unitario){
                      mensaje = " - El Precio Unitario es Mayor al de la Orden de Compra";
                      validacionprecio=true;
                    }
                    if (diferencia >= 0 && diferencia <= 45) {
                     mensaje += " - Producto Proximo a Vencer";    
                     validacionfecha=true;
                    }
                    
                    //AlertService.mostrarMensaje("warning",mensaje); 
                    productos.validacionfecha=validacionfecha;
                    productos.validacionprecio=validacionprecio;
                    productos.justificacionIngreso=mensaje;
                    productos.fecha_vencimiento_formato=fecha_vencimiento;
                    $scope.solicitar_aprobacion(productos);
                    return;
                }

                var total_costo_ped = productos.cantidadActual * (productos.valor_unitario_ingresado + (productos.valor_unitario_ingresado * productos.iva) / 100);
                var movimientos_bodegas = {
                    doc_tmp_id: $scope.doc_tmp_id,
                    bodegas_doc_id: datos_documento.bodegas_doc_id,
                    codigo_producto: productos.codigo_producto,
                    cantidad: productos.cantidadActual,
                    porcentaje_gravamen: productos.iva,
                    total_costo: total_costo_ped,
                    fecha_vencimiento: productos.fecha_vencimiento,
                    lote: productos.lote,
                    localizacion: productos.localizacion,
                    total_costo_ped: '0',
                    valor_unitario: '0',
                    usuario_id: $scope.session.usuario_id,
                    item_id_compras: productos.item_id,
                };
               
                that.additemDocTemporal(movimientos_bodegas);
            };


            $scope.lista_productos_orden = {
                data: 'Empresa.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "8%", enableCellEdit: false},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "40%", enableCellEdit: false},
                    {field: 'get_cantidad_solicitada() | number : "0" ', displayName: 'Cantidad', width: "5%", enableCellEdit: false},
                    {displayName: 'Cant. Recibida', width: "7%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco> <input type="text" ng-disabled="validarTmp(row.entity)"  value="{{row.entity.cantidad_solicitada}}" ng-model="row.entity.cantidadActual" validacion-numero-entero class="form-control grid-inline-input" name="cantidad" id="cantidad" /></div>'},
                    {displayName: 'Lote', width: "7%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text"  ng-disabled="validarTmp(row.entity)"  ng-model="row.entity.lote" class="form-control grid-inline-input" name="lote" id="lote" /> </div>'},
                    {displayName: 'Localización', width: "5%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-disabled="validarTmp(row.entity)"  ng-model="row.entity.localizacion" class="form-control grid-inline-input" name="localizacion" id="localizacion" /> </div>'},
                    {displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12" cambiar-foco >\
                                            <p class="input-group" cambiar-foco  >\
                                                <input type="text" class="form-control grid-inline-input readonlyinput calendario"  \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencimiento" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" clear-text="Borrar" current-text="Hoy" show-weeks="false" toggle-weeks-text="#"/> \
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs btnCalendario" style="margin-top: 3px;" ng-disabled="validarTmp(row.entity)" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},
                    {field: 'nombre', displayName: 'Valor Unitario', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco><input type="text" ng-model="row.entity.valor_unitario_ingresado" ng-disabled="validarTmp(row.entity)" validacion-numero-decimal class="form-control grid-inline-input" name="valorUnitario" id="valorUnitario" /> </div>'},
                    {width: "8%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group" cambiar-foco >\
                                            <div ng-if="!validarAutorz(row.entity)" cambiar-foco>\
                                                <button  class="btn btn-danger btn-xs btnClick" ng-disabled="validarTmp(row.entity)"  ><span class="glyphicon glyphicon-time"></span></button>\
                                            </div>\
                                            <div ng-if="validarAutorz(row.entity)"  cambiar-foco>\
                                                <div ng-if="!validarTmp(row.entity)">\
                                                  <div ng-if="!validarCantidadAdicion(row.entity)" cambiar-foco >\
                                                     <button class="btn btn-default btn-xs btnClick" ng-disabled="habilitar_ingreso_producto(row.entity)" ng-click="ingresar_producto(row.entity)" id="ingreproducto"><span class="glyphicon glyphicon-ok"></span></button>\
                                                     <button class="btn btn-success btn-xs " ng-disabled="habilitar_ingreso_lote(row.entity)" ng-click="btnAdicionarNuevoLote(row.entity)" id="agregarlote"><span class="glyphicon glyphicon-plus-sign"></span></button>\
                                                   </div>\
                                                  <div ng-if="validarCantidadAdicion(row.entity)" cambiar-foco >\
                                                     <button class="btn btn-default btn-xs btnClick" ng-disabled="habilitar_ingreso_producto(row.entity)" ng-click="ingresar_producto(row.entity)" id="ingreproducto" ><span class="glyphicon glyphicon-ok"></span></button>\
                                                     <button class="btn btn-danger btn-xs " ng-disabled="validarTmp(row.entity)"  id="agregarlote"><span class="glyphicon glyphicon-minus-sign" ></span></button>\
                                                  </div>\
                                                </div>\
                                                <div ng-if="validarTmp(row.entity)" cambiar-foco>\
                                                   <button class="btn btn-success btn-xs btnClick" ng-disabled="validarTmp(row.entity)" id="ingreproducto" ><span class="glyphicon glyphicon-ok red"></span></button>\
                                                   <button class="btn btn-danger btn-xs " ng-disabled="validarTmp(row.entity)" id="agregarlote"><span class="glyphicon glyphicon-minus-sign" ></span></button>\
                                                </div>\
                                            </div>\
                                        </div>'}
                ]
            };

            $scope.abrir_fecha_vencimiento = function(producto, $event) {

                $event.preventDefault();
                $event.stopPropagation();

                producto.datepicker_fecha_inicial = true;
            };

            $scope.isNoTmp = function() {
                var disabled = false;       
                if ($scope.doc_tmp_id === "00000" && $scope.DocumentoIngreso.get_orden_compra() === undefined) {
                    disabled = true;
                }
                return disabled;
            };
            
            $scope.isTmp = function() {
                var disabled = false;

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }
                return disabled;
            };
            
            $scope.isGenerarDocumento=function(){
               var disabled = false;
               if ($scope.DocumentoIngreso.get_orden_compra().get_productos_ingresados().length > 0) {
                    disabled = true;
                }
               return disabled;
            };

            $scope.habilitar_ingreso_lote = function(producto) {
                var disabled = false;
                if (producto.get_is_tmp() === true) {
                    disabled = true;
                }
                return disabled;
            };

            $scope.habilitar_ingreso_producto = function(producto) {

                var disabled = false;

                if (producto.get_is_tmp() === true) {
                    disabled = true;
                }

                if (producto.cantidadActual === undefined || producto.cantidadActual === "" || parseInt(producto.cantidadActual) <= 0) {
                    disabled = true;
                }

                if (producto.localizacion === undefined || producto.localizacion === "") {
                    disabled = true;
                }

                if (producto.get_lote() === undefined || producto.get_lote() === "") {
                    disabled = true;
                }

                if (producto.get_fecha_vencimiento() === undefined || producto.get_fecha_vencimiento() === "") {
                    disabled = true;
                }

                if (producto.get_valor_unitario() === undefined || producto.get_valor_unitario() === "" || producto.get_valor_unitario() <= 0) {
                    disabled = true;
                }

                return disabled;
            };
            
            $scope.validarEstado = function(producto) {
               var disabled = false;
               if(producto.get_sw_estado() === false){
                  disabled = true;
               } 
               return disabled;
            };
            
            $scope.validarTmp = function(producto) {

                var disabled = false;

                if (producto.get_is_tmp() === true && producto.get_item_id() === producto.get_item_id_compras()) {
                    disabled = true;
                }

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }
                
//                if(producto.get_sw_estado() === false){
//                  disabled = true;
//                } 

                return disabled;
            };
            
            $scope.validarAutorz = function(producto) {

                var disabled = true;

                if (producto.get_sw_autorizado() === '0') {
                    disabled = false;
                }
                
                return disabled;
            };

            $scope.validarCantidadAdicion = function(producto) {

                var disabled = false;

                if (producto.get_cantidad_solicitada() < 2) {
                    disabled = true;
                }

                return disabled;
            };


            $scope.validar_ingreso_producto = function(producto) {

                var disabled = false;

                if (producto.get_is_tmp() === true) {
                    disabled = true;
                }

                if (producto.get_lote() === undefined || producto.get_lote() === "") {
                    disabled = true;
                }

                if (producto.get_fecha_vencimiento() === undefined || producto.get_fecha_vencimiento() === "") {
                    disabled = true;
                }

                if (producto.get_valor_unitario() === undefined || producto.get_valor_unitario() === "" || producto.get_valor_unitario() <= 0) {
                    disabled = true;
                }

                return disabled;
            };
            
            $scope.guardarProducto = function(producto) {
                
                var fecha_actual = new Date();
                fecha_actual = $filter('date')(new Date(fecha_actual), "dd/MM/yyyy");
                var valor=parseInt(producto.valor_unit);
                var porcentaje=((valor * producto.iva) / 100);
                var valorMasPorcentaje=valor+porcentaje;                
                var total_costo = valorMasPorcentaje * producto.cantidad_solicitada;
                
                var parametro={//Usuario.getUsuarioActual().getEmpresa()
                    empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                    centroUtilidad: Sesion.getUsuarioActual().getEmpresa().centroUtilidad.codigo,
                    bodega: Sesion.getUsuarioActual().getEmpresa().centroUtilidad.bodega.codigo,
                    codigoProducto : producto.codigo_producto,
                    cantidad : producto.cantidad_solicitada,
                    lote: producto.lote,
                    fechaVencimiento: producto.fecha_vencimiento,
                    docTmpId: $scope.doc_tmp_id,
                    porcentajeGravamen: producto.iva,
                    fechaIngreso: fecha_actual,
                    justificacionIngreso: producto.justificacionIngreso,
                    ordenPedidoId: $scope.DocumentoIngreso.get_orden_compra().get_numero_orden(),
                    totalCosto: total_costo,
                    localProd: producto.localizacion,
                    itemId: producto.item_id,
                    valorUnitarioCompra: producto.valor_unit,
                    valorUnitarioFactura: producto.valor_unit,
                    session: $scope.session
                };     
                GeneralService.insertarProductosFoc(parametro,function(respuesta){
                   that.refrescarVista();
                 });
             };
                          
            $scope.Empresa.limpiar_productos();       
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                
            });
            
            if(datos_documento.datosAdicionales !== undefined){
                $scope.listar_proveedores(datos_documento.datosAdicionales.codigo_proveedor_id,false); 
                $scope.validarDesdeLink=true;
            }else{
                $scope.validarDesdeLink=false;
            }
            
        }]); 
});