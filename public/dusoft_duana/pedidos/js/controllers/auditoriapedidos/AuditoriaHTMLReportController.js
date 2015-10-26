//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent',
    'models/auditoriapedidos/ClientePedido',
    'models/auditoriapedidos/PedidoAuditoria',
    'models/auditoriapedidos/Separador',
    'models/auditoriapedidos/Auditor',
    'models/auditoriapedidos/DocumentoTemporal',
    'models/auditoriapedidos/Caja',
    "controllers/auditoriapedidos/AuditoriaPedidosClientesController",
    "controllers/auditoriapedidos/AuditoriaPedidosFarmaciasController",
    "controllers/auditoriapedidos/EditarProductoController"], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaHTMLReportController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Cliente', 'Farmacia', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "ProductoPedido", "LoteProductoPedido",
        "$modal", 'Auditor', 'Usuario', "localStorageService", "$state",
        function($scope, $rootScope, Request,
                Empresa, Cliente, Farmacia,
                PedidoAuditoria, Separador, DocumentoTemporal,
                API, socket, AlertService,
                ProductoPedido, LoteProductoPedido, $modal, Auditor, Usuario, localStorageService, $state) {

            $scope.Empresa = Empresa;

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.DatosDocumentoDespachado="";
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.productosAuditados = [];
            $scope.productosNoAuditados = [];
            $scope.productosPendientes = [];
            $scope.cajasSinCerrar = [];
            $scope.notificacionclientes = 0;
            $scope.notificacionfarmacias = 0;
            $scope.activarTabFarmacias = false;
            $scope.filtro = {
                codigo_barras: false
            };


            var opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
     
            var dattta = {"encabezado":
                           {"fecha_registro":"24-10-2015 10:07 am",
                            "prefijo":"EDFM",
                            "numero":8129,
                            "numero_pedido":103395,
                            "estado_pedido":"2",
                            "tipo_movimiento":"E",
                            "tipo_clase_documento":"EGRESOS DESPACHOS DE BODEGA",
                            "descripcion":"DESPACHOS A FARMACIAS MEDMFEN",
                            "tipo_doc_bodega_id":"E008",
                            "nombre_usuario":"MAURICIO BARRIOS",
                            "nombre_empresa_destino":"DUANA & CIA LTDA.",
                            "nombre_bodega_destino":"BODEGA DUANA",
                            "nombre_centro_utilidad":"DUANA",
                            "usuario_imprime":"MAURICIO BARRIOS",
                            "fecha_impresion":"24-10-2015 10:07 AM",
                            "fecha_pedido":"24-10-2015 10:05 AM"
                            },
                        "detalle":[
                    {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0},
                 {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0},
                    {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0},
                    {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0},
                    {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0},
                    {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0},
                    {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0},
                    {"codigo_producto":"1101I0850001",
                        "lote":"888","cantidad":5,
                        "fecha_vencimiento":"08-09-2016",
                        "descripcion":"PARALGEN",
                        "unidad_id":"1",
                        "contenido_unidad_venta":"8MG",
                        "descripcion_unidad":"TABLETA",
                        "codigo_invima":"2014M-0015006",
                        "codigo_cum":"20063873-01",
                        "nombre":"PARALGEN 8MG TABLETA | CAJA X 10. LEGRAND",
                        "iva":0,
                        "valor_unitario_iva":4335.4,
                        "valor_total_iva":21677,
                        "valor_unit_1":4335.4,
                        "iva_1":0,
                        "valor_total_1":21677,
                        "iva_total_1":0}
                ],
                        "adicionales":{"tipo_de_despacho":{"valor":"FARMACIAS","titulo":"TIPO DE DESPACHO"},"cliente":{"valor":"03 - DUANA & CIA LTDA. ::: BODEGA DUANA","titulo":"CLIENTE"}},"serverUrl":"http://localhost:3000/"};
             
            //$scope.DatosDocumentoDespachado = localStorageService.get("DocumentoDespachoImprimir");
            $scope.DatosDocumentoDespachado = dattta;
            //permisos auditoria
            $scope.opcionesModulo = {
                btnAuditarClientes: {
                    'click': opciones.sw_auditar_clientes
                },
                btnAuditarFarmacias: {
                    'click': opciones.sw_auditar_farmacias
                }
            };
            

            var obj = {
                session: $scope.session,
                data: {
                    documento_temporal: {
                        documento_temporal_id: 1,
                        usuario_id: 1350,
                        filtro: {busqueda: true},
                        numero_pedido: 8000
                    }
                }
            };


            var that = this;

            $scope.buscarPedidosSeparados = function(obj, tipo, paginando, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES;

                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;

                    if (data.obj.documentos_temporales !== undefined) {
                        callback(data.obj, paginando, tipo);
                    }

                });

            };


            that.crearDocumentoTemporal = function(obj, tipo) {

                var documento_temporal = DocumentoTemporal.get();
                documento_temporal.setDatos(obj);

                var pedido = PedidoAuditoria.get(obj);
                pedido.setDatos(obj);
                pedido.setTipo(tipo);

                documento_temporal.empresa_id = obj.empresa_id;
                documento_temporal.centro_utilidad = obj.centro_utilidad || '1';
                documento_temporal.bodega_id = obj.bodega_id || '03';


                if (tipo === 1) {
                    var cliente = Cliente.get(
                            obj.nombre_cliente,
                            obj.direccion_cliente,
                            obj.tipo_id_cliente,
                            obj.identificacion_cliente,
                            obj.telefono_cliente
                            );

                    pedido.setCliente(cliente);

                } else {
                    var farmacia = Farmacia.get(
                            obj.farmacia_id,
                            obj.bodega_id,
                            obj.nombre_farmacia,
                            obj.nombre_bodega
                            );

                    pedido.setFarmacia(farmacia);
                }


                documento_temporal.setPedido(pedido);

                var separador = Separador.get();
                separador.setDatos(obj.responsables);

                var auditor = Auditor.get();
                auditor.setDatos(obj.responsables);

                documento_temporal.setSeparador(separador);
                documento_temporal.setAuditor(auditor);


                return documento_temporal;
            };

            $scope.obtenerDocumento = function(numero, tipo) {
                var documentos = Empresa.getDocumentoTemporal(tipo);
                for (var i in documentos) {
                    var documento = documentos[i];
                    if (documento.getPedido().get_numero_pedido() === numero) {
                        return documento;
                    }
                }
            };


            $scope.renderPedidosSeparados = function(data, paginando, tipo) {

                var items = data.documentos_temporales.length;
                var evento = (tipo === 1) ? "Cliente" : "Farmacia";

                // console.log("documentos de ", evento, data.documentos_temporales);

                //se valida que hayan registros en una siguiente pagina
                if (paginando && items === 0) {
                    $scope.$broadcast("onPedidosSeparadosNoEncotrados" + evento, items);
                    return;
                }

                $scope.Empresa.vaciarDocumentoTemporal(tipo);

                for (var i in data.documentos_temporales) {

                    var obj = data.documentos_temporales[i];

                    var documento_temporal = that.crearDocumentoTemporal(obj, tipo);
                    // documento_temporal.esDocumentoNuevo = true;  
                    $scope.Empresa.agregarDocumentoTemporal(documento_temporal, tipo);
                }
                $scope.$broadcast("onPedidosSeparadosRender" + evento, items);

            };



            //logica detalle

            $scope.buscarDetalleDocumentoTemporal = function(obj, paginando, tipo, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_CLIENTES;

                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        if (data.obj.documento_temporal !== undefined) {
                            callback(data, paginando);
                        }
                    }
                });

            };


            that.buscarProductosSeparadosEnDocumento = function(obj, tipo, callback) {

                var url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_PRODUCTOS_AUDITADOS_CLIENTE;

                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_PRODUCTOS_AUDITADOS_FARMACIA;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        if (data.obj.movimientos_bodegas !== undefined) {
                            callback(data);
                        }
                    }
                });
            };

            that.renderDetalleDocumentoTemporal = function(documento, productos, tipo) {
                //Vaciar el listado de Productos

                documento.getPedido().vaciarProductos();

                for (var i in productos) {

                    var obj = productos[i];

                    var producto_pedido_separado = this.crearProductoPedidoDocumentoTemporal(obj, tipo);

                    documento.getPedido().agregarProducto(producto_pedido_separado, true);

                }

            };


            $scope.onKeyDocumentosSeparadosPress = function(ev, documento, params, tipo) {


                that.buscarProductosSeparadosEnDocumento(params, tipo, function(data) {
                    if (data.status === 200) {
                        var productos = data.obj.movimientos_bodegas.lista_productos_auditados;


                        that.renderDetalleDocumentoTemporal(documento, productos, 1);
                    }
                });
            };

            that.crearProductoPedidoDocumentoTemporal = function(obj, tipo) {

                var lote_pedido = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);


                if (tipo === 1) {
                    var justificaciones = obj.justificaciones[0] || {};
                    lote_pedido.justificacion_separador = justificaciones.observacion || "";
                    lote_pedido.justificacion_auditor = justificaciones.justificacion_auditor || "";
                } else {
                    lote_pedido.justificacion_separador = obj.justificacion || "";
                    lote_pedido.justificacion_auditor = obj.justificacion_auditor || "";
                }


                lote_pedido.cantidad_pendiente = obj.cantidad_pendiente || 0;
                lote_pedido.item_id = obj.item_id;

                var producto_pedido_separado = ProductoPedido.get(obj.codigo_producto, obj.descripcion_producto, "",
                        obj.valor_unitario, obj.cantidad_solicitada, obj.cantidad_ingresada,
                        obj.observacion_cambio);

                producto_pedido_separado.porcentaje_gravament = obj.porcentaje_iva || 0;
                producto_pedido_separado.cantidad_pendiente = obj.cantidad_pendiente;
                producto_pedido_separado.cantidad_despachada = obj.cantidad_despachada;
                producto_pedido_separado.cantidad_solicitada = producto_pedido_separado.cantidad_solicitada - obj.cantidad_despachada;
                producto_pedido_separado.cantidad_solicitada_real = obj.cantidad_solicitada;


                producto_pedido_separado.setLote(lote_pedido);



                return producto_pedido_separado;

            };


            //Trae el Listado de Documentos de Usuario
            $scope.traerListadoDocumentosUsuario = function(obj, callback) {


                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        callback(data);
                    }

                });

            };


            $scope.validarDocumentoUsuario = function(obj, tipo, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_CLIENTES;

                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    callback(data);
                });

                /* Fin Request */
            };

            $scope.esDocumentoBodegaValido = function(bodega_id) {
                return (!bodega_id > 0) ? false : true;
            };


            $scope.onAbrirVentanaLotes = function(documento, documento_despacho, row) {

                //almacenar lotes del mismo producto
                var productos = [];
                var producto = row.entity;

                for (var i in documento.getPedido().getProductos()) {

                    var _producto = documento.getPedido().getProductos()[i];

                    if (_producto.codigo_producto === producto.codigo_producto) {

                        _producto.lote.cantidad_ingresada = _producto.cantidad_separada;
                        productos.push(_producto);
                    }

                }


                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: 'views/auditoriapedidos/editarproducto.html',
                    controller: "EditarProductoController",
                    resolve: {
                        documento: function() {
                            return documento;
                        },
                        producto: function() {
                            return producto;
                        },
                        productos: function() {
                            return  productos;
                        },
                        documento_despacho: function() {
                            return documento_despacho;
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);

            };


            $scope.traerProductosAuditatos = function(obj) {

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_PRODUCTOS_AUDITADOS, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.renderProductosAuditados(data.obj.movimientos_bodegas.lista_productos_auditados, $scope.productosAuditados);
                    }

                });

            };

            that.renderProductosAuditados = function(data, arreglo) {

                for (var i in data) {
                    var obj = data[i];
                    var producto = ProductoPedido.get(
                            obj.codigo_producto, obj.descripcion_producto, 0, 0, obj.cantidad_solicitada,
                            obj.cantidad_ingresada, obj.observacion_cambio
                            );
                    var lote = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);
                    lote.item_id = obj.item_id;

                    producto.setLote(lote);

                    arreglo.push(producto);
                }


            };


            that.sacarProductoAuditados = function(_producto) {
                var count = 0;
                for (var i in $scope.productosAuditados) {
                    var producto = $scope.productosAuditados[i];
                    if (producto.codigo_producto === _producto.codigo_producto && producto.lote.item_id === _producto.lote.item_id) {
                        $scope.productosAuditados.splice(count, 1);
                        break;
                    }
                    count++;
                }
            };


            $scope.onEliminarProductoAuditado = function(DocumentoTemporal, row) {


                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            item_id: row.entity.lote.item_id,
                            auditado: false,
                            numero_caja: 0,
                            documento_temporal_id: DocumentoTemporal.documento_temporal_id,
                            codigo_producto: row.entity.codigo_producto,
                            cantidad_pendiente: 0,
                            justificacion_auditor: "",
                            existencia: "",
                            usuario_id: DocumentoTemporal.separador.usuario_id
                        }
                    }
                };

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.AUDITAR_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.sacarProductoAuditados(row.entity);
                        AlertService.mostrarMensaje("success", data.msj);

                    }
                });

            };

            $scope.onCerrarCaja = function(caja) {
                var url = API.DOCUMENTOS_TEMPORALES.GENERAR_ROTULO;
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: caja.documento_id,
                            numero_caja: caja.numero_caja,
                            tipo: caja.tipo
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        caja.caja_cerrada = '1';

                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error al cerrar la caja");
                    }
                });
            };



            that.sacarCaja = function(caja) {
                for (var i in $scope.cajasSinCerrar) {
                    var _caja = $scope.cajasSinCerrar[i];

                    if (_caja.numero_caja === caja.numero_caja && caja.documento_id === _caja.documento_id) {

                        $scope.cajasSinCerrar.splice(i, 1);
                        break;
                    }
                }
            };


          
           $scope.cambiar = function(){
                that.detalladoProductosInduccion = localStorageService.get("productoInduccion");
                console.log(  that.detalladoProductosInduccion );
                
                $scope.saludo = that.detalladoProductosInduccion;
                
              // $state.go("DocumentoDespacho");
              //  window.open("#/DocumentoDespacho");
           };
           
           
           
            $scope.generarDocumento = function(documento) {
              
                localStorageService.set("productoInduccion", "objasasasasasa");
               
                console.log("$scope.saludo ", $scope.saludo)
                var txt;
                var r = confirm("Press a button!");
                if (r == true) {
                    txt = "You pressed OK!";
                       $scope.saludo = "HOLASSSSSS"; 
                } else {
                    txt = "You pressed Cancel!";
                }
                alert(txt)
                 
                //  localStorageService.set("Prueba", obj);
                // $state.go("DocumentoDespacho");
                  



                var url = API.DOCUMENTOS_TEMPORALES.GENERAR_DESPACHO;

                if (documento.pedido.tipo === documento.pedido.TIPO_FARMACIA) {
                    url = API.DOCUMENTOS_TEMPORALES.GENERAR_DESPACHO_FARMACIA;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: documento.pedido.numero_pedido,
                            documento_temporal_id: documento.documento_temporal_id,
                            auditor_id: documento.auditor.operario_id,
                            usuario_id: documento.separador.usuario_id
                        }
                    }
                };


                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        $scope.productosNoAuditados = [];
                        $scope.productosPendientes = [];
                        $scope.cajasSinCerrar = [];
                        $scope.productosAuditados = [];


                        $scope.$broadcast("onRefrescarListadoPedidos");

                        $scope.$broadcast("cerrarDetalleCliente");

                        $scope.$broadcast("cerrarDetalleFarmacia");

                        $scope.documento_generado = data.obj.movimientos_bodegas;
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            size: 'sm',
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Generación de documento</h4>\
                                    </div>\
                                    <div class="modal-body row">\
                                        El documento {{documento_generado.prefijo_documento}} {{documento_generado.numero_documento}} ha sido generado.\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                    </div>',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            }
                        };
                        var modalInstance = $modal.open($scope.opts);


                        //generar el pdf
                        var obj = {
                            session: $scope.session,
                            data: {
                                movimientos_bodegas: {
                                    empresa: $scope.documento_generado.empresa_id,
                                    numero: $scope.documento_generado.numero_documento,
                                    prefijo: $scope.documento_generado.prefijo_documento
                                }
                            }
                        };
                        Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_DOCUMENTO_DESPACHO, "POST", obj, function(data) {
                            if (data.status === 200) {
                                var nombre = data.obj.movimientos_bodegas.nombre_pdf;
                                $scope.visualizarReporte("/reports/" + nombre, nombre, "download");
                            }

                        });


                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                        var movimientos_bodegas = data.obj.movimientos_bodegas;
                        $scope.productosNoAuditados = [];
                        $scope.productosPendientes = [];
                        $scope.cajasSinCerrar = [];

                        var productosNoAuditados = [];

                        if (documento, movimientos_bodegas.productos_no_auditados !== undefined) {
                            that.renderDetalleDocumentoTemporal(documento, movimientos_bodegas.productos_no_auditados.concat(movimientos_bodegas.productos_pendientes), 2);
                        }


                        if (movimientos_bodegas.cajas_no_cerradas) {
                            $scope.cajasSinCerrar = movimientos_bodegas.cajas_no_cerradas;
                        }
                    }

                });

            };
            /**
             * +Descripcion: metodo que se emite al auditar un producto prosiguiendo
             * a consultar los productos auditados
             */
            $rootScope.$on("productoAuditado", function(e, producto, DocumentoTemporal) {
                if (DocumentoTemporal.getPedido() === undefined) {
                    return;
                }
                DocumentoTemporal.getPedido().vaciarProductos();
                $scope.productosAuditados = [];

                var params = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: DocumentoTemporal.documento_temporal_id,
                            usuario_id: DocumentoTemporal.separador.usuario_id
                        }
                    }
                };

                $scope.traerProductosAuditatos(params);

            });

            $rootScope.$on("onGenerarPdfRotulo", function(e, tipo, numero_pedido, numero_caja, tipoCaja) {
                $scope.onImprimirRotulo(tipo, numero_pedido, numero_caja, tipoCaja);
            });


            $scope.onImprimirRotulo = function(tipo, numero_pedido, numero_caja, tipoCaja) {

                var url = API.DOCUMENTOS_TEMPORALES.IMPRIMIR_ROTULO_CLIENTES;

                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.IMPRIMIR_ROTULO_FARMACIAS;
                }


                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: numero_pedido,
                            numero_caja: numero_caja,
                            tipo: tipoCaja
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var nombre_reporte = data.obj.movimientos_bodegas.nombre_reporte;

                        $scope.visualizarReporte("/reports/" + nombre_reporte, "Rotulo_" + numero_caja, "download");
                    } else {

                    }
                });
            };


            $scope.$on("onDetalleCerrado", function() {

                $scope.productosAuditados = [];
                $scope.productosNoAuditados = [];
                $scope.productosPendientes = [];
                $scope.cajasSinCerrar = [];
            });

            socket.on("onListarDocumentosTemporalesClientes", function(data) {

                if (data.status === 200) {
                    $scope.notificacionclientes++;
                    for (var i in data.obj.documento_temporal_clientes) {
                        var obj = data.obj.documento_temporal_clientes[i];
                        var documento_temporal = that.crearDocumentoTemporal(obj, 1);
                        documento_temporal.esDocumentoNuevo = true;
                        $scope.Empresa.agregarDocumentoTemporal(documento_temporal, 1);

                    }
                }
            });

            socket.on("onListarDocumentosTemporalesFarmacias", function(data) {

                if (data.status === 200) {
                    $scope.notificacionfarmacias++;
                    for (var i in data.obj.documento_temporal_farmacias) {
                        var obj = data.obj.documento_temporal_farmacias[i];
                        var documento_temporal = that.crearDocumentoTemporal(obj, 2);
                        documento_temporal.esDocumentoNuevo = true;
                        $scope.Empresa.agregarDocumentoTemporal(documento_temporal, 2);

                    }
                }
            });
        }]);
});
