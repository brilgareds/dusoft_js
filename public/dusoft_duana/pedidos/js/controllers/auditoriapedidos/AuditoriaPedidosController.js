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
   // "controllers/auditoriapedidos/AuditoriaDespachos",
    "controllers/auditoriapedidos/EditarProductoController"], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Cliente', 'Farmacia', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "ProductoPedido", "LoteProductoPedido",
        "$modal", 'Auditor', 'Usuario',"localStorageService","AuditoriaDespachoService",
        function($scope, $rootScope, Request,
                Empresa, Cliente, Farmacia,
                PedidoAuditoria, Separador, DocumentoTemporal,
                API, socket, AlertService,
                ProductoPedido, LoteProductoPedido, $modal, Auditor, Usuario, localStorageService, AuditoriaDespachoService) {

            $scope.Empresa = Empresa;
            var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
            
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

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

            //permisos auditoria
            $scope.opcionesModulo = {
                btnAuditarClientes: {
                    'click': opciones.sw_auditar_clientes
                },
                btnAuditarFarmacias: {
                    'click': opciones.sw_auditar_farmacias
                }
            };


           /* var obj = {
                session: $scope.session,
                data: {
                    documento_temporal: {
                        documento_temporal_id: 1,
                        usuario_id: 1350,
                        filtro: {busqueda: true},
                        numero_pedido: 8000
                    }
                }
            };*/


            var that = this;

            $scope.buscarPedidosSeparados = function(obj, tipo, paginando, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES;

                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;
                    
                    if (data.obj && data.obj.documentos_temporales !== undefined) {
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
                var multiple=obj.es_pedido_origen? obj.es_pedido_origen: obj.es_pedido_destino? obj.es_pedido_destino : obj.es_pedido_final?  obj.es_pedido_final : 'No Multiple';
                pedido.setPedidoMultiple(multiple);
                
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

console.log("*****",documento_temporal);
                return documento_temporal;
            };
            
           $scope.obtenerDocumento = function(numero, tipo){
                var documentos = Empresa.getDocumentoTemporal(tipo);
                for(var i in documentos){
                    var documento = documentos[i];
                    if(documento.getPedido().get_numero_pedido() === numero){
                        return documento;
                    }
                }
            };


            $scope.renderPedidosSeparados = function(data, paginando, tipo) {

                var items = data.documentos_temporales.length;
                var evento = (tipo === 1) ? "Cliente" : "Farmacia";


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
                producto_pedido_separado.observacionJustificacionSeparador = obj.observacion_justificacion_separador; 
                                               

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
                            obj.codigo_producto, obj.descripcion_producto, obj.existencia_bodega, 0, obj.cantidad_solicitada,
                            obj.cantidad_ingresada, obj.observacion_cambio
                    );
                    
                    producto.setNumeroCaja(obj.numero_caja);
                    
                    var lote = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);
                    lote.item_id = obj.item_id;
                    lote.setExistenciaActual(obj.existencia_actual);
                    
                    
                    if((parseInt(lote.getExistenciaActual()) <  parseInt(obj.cantidad_ingresada)) ||
                      (parseInt(producto.getExistencia()) <  parseInt(obj.cantidad_ingresada))){
                         lote.setTieneExistencia(false);
                     }

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
            
            var msj = "Favor tener en cuenta que la caja es la número:  "+row.entity.getNumeroCaja();
            
            AlertService.mostrarVentanaAlerta("Mensaje del sistema", msj, function(aceptar){

               if(!aceptar){
                   return;
               }

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

           });

        };

        $scope.onCerrarCaja = function(caja, tipoPedido) {
            var url = API.DOCUMENTOS_TEMPORALES.GENERAR_ROTULO;
            var obj = {
                session: $scope.session,
                data: {
                    documento_temporal: {
                        documento_temporal_id: caja.documento_temporal_id,
                        numero_caja: caja.numero_caja,
                        tipo: caja.tipo,
                        tipo_pedido: tipoPedido
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
            
           that.sincronizarDocumento = function(documento, despacho){
                var obj = {
                    session: $scope.session,
                    documento: {
                        prefijo_documento : despacho.prefijo_documento,
                        numero_documento : despacho.numero_documento,
                        bodega_destino : (documento.pedido.tipo !== 1) ? documento.pedido.farmacia.bodega_id : documento.bodega_id,
                        empresa_id: despacho.empresa_id,
                        tipo_pedido:documento.pedido.tipo,
                        numero_pedido : documento.pedido.numero_pedido,
                        background: true
                    }
                };
                

                AuditoriaDespachoService.sincronizarDocumento(obj, function(data){
                    if(data.status === 200){
                        //AlertService.mostrarMensaje("success", "Documento sincronizado correctamente");
                    }
                });
                
            };
            
            that.mostrarVentanaPendientesInvalidos = function(pendientes){
                

                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: 'views/auditoriapedidos/pendientesInvalidos.html',
                    controller:["$scope", "pendientes", "$modalInstance", function($scope, pendientes, $modalInstance){
                            
                            $scope.pendientes = pendientes;
                            
                            $scope.listadoPendientes = {
                                data: 'pendientes',
                                enableColumnResize: true,
                                enableRowSelection: false,
                                showFilter: true,
                                enableHighlighting:true,
                                size:'sm',
                                columnDefs: [
                                    {field: 'codigo_producto', displayName: 'Codigo', width:120},
                                    {field: 'descripcion_producto', displayName: 'Descripcion'},
                                    {field: 'cantidad_solicitada', displayName: 'Solicitado', width:100},
                                    {field: 'cantidad_ingresada', displayName: 'Ingresado', width:100}

                                ]

                            };
                            
                            $scope.onCerrar = function(){
                                $modalInstance.close();
                            };
                            
                            
                    }],
                    resolve: {
                        pendientes: function() {
                            return pendientes;
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);

            };
           
            
            $scope.generarDocumento = function(documento) { 
                var url = API.DOCUMENTOS_TEMPORALES.GENERAR_DESPACHO;

                if (documento.pedido.tipo === documento.pedido.TIPO_FARMACIA) {
                    url = API.DOCUMENTOS_TEMPORALES.GENERAR_DESPACHO_FARMACIA;
                }
//console.log('url', url);
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: documento.pedido.numero_pedido,
                            documento_temporal_id: documento.documento_temporal_id,
                            auditor_id: documento.auditor.operario_id,
                            usuario_id: documento.separador.usuario_id,
                            bodega_documento_id : documento.getBodegasDocId(),
                            bodega: documento.bodega_id
                        }
                    }
                };
                //console.log('url', url);


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
                            controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            }]
                        };
                       
                         //var modalInstance = $modal.open($scope.opts);
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
                                var detallado = data.obj.movimientos_bodegas.datos_documento;
                                
                                    /**
                                     * @fecha: 26/10/2015
                                     * +Descripcion: Se envia el detallado del documento el cual se
                                     * pintara en una plantilla html y se imprimira posteriormente
                                     * @author Cristian Ardila
                                     */
                                    localStorageService.set("DocumentoDespachoImprimir",detallado);
                                   $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                                   
                                   that.sincronizarDocumento(documento, $scope.documento_generado);
                            }

                        });


                    } else if(parseInt(data.status) !== 500 ) {
                       
                        var movimientos_bodegas = data.obj.movimientos_bodegas;
                        $scope.productosNoAuditados = [];
                        $scope.productosPendientes = [];
                        $scope.cajasSinCerrar = [];

                        var productosNoAuditados = [];
                        
                        
                        if(movimientos_bodegas.productos_pendientes_invalidos && movimientos_bodegas.productos_pendientes_invalidos.length > 0){
                            
                            that.mostrarVentanaPendientesInvalidos(movimientos_bodegas.productos_pendientes_invalidos);
                            return;
                        }
                        
                         AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                        if (documento, movimientos_bodegas.productos_no_auditados !== undefined) {
                            that.renderDetalleDocumentoTemporal(documento, movimientos_bodegas.productos_no_auditados.concat(movimientos_bodegas.productos_pendientes), 2);
                        } /*else if(documento, movimientos_bodegas.productosSinExistencias !== undefined){
                            // that.renderDetalleDocumentoTemporal(documento, movimientos_bodegas.productosSinExistencias, 2);
                            
                            //Señala los productos que no tienen existencias debido a traslados realizados en los lotes
                            for(var i in $scope.productosAuditados){
                                var _producto = $scope.productosAuditados[i];
                                for(var ii in movimientos_bodegas.productosSinExistencias){
                                    
                                    var _productoSinExistencia = movimientos_bodegas.productosSinExistencias[ii];
                                    if(_producto.getCodigoProducto() === _productoSinExistencia.codigo_producto && 
                                       _producto.getLote().getCodigo() === _productoSinExistencia.lote &&
                                       _producto.getLote().getFechaVencimiento() === _productoSinExistencia.fecha_vencimiento){
                                            //console.log("producto sin existencia ", _productoSinExistencia);
                                            _producto.getLote().setTieneExistencia(false);
                                            _producto.getLote().setExistenciaActual(_productoSinExistencia.existencia_actual);
                                            _producto.setExistencia(_productoSinExistencia.existencia_bodega);
                                    }
                                }
                                
                            }
                        }*/
                        
                        

                        if (movimientos_bodegas.cajas_no_cerradas) {
                            $scope.cajasSinCerrar = movimientos_bodegas.cajas_no_cerradas;
                        }
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error generando el documento, favor revisar los productos auditados.");
                        $rootScope.$emit("productoAuditado",{},documento);
                    }
                });
            };

            
            
            $scope.ejecutar = true;
            socket.on("onNotificarGenerarI002", function (datos) {
                
                var bodega=empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().codigo;
                //console.log("bodega ",bodega);
                var timer = setTimeout(function () {
                    //se valida la bodega para que no se genere ICD desde DUANA a Cosmitet  
                    //sw_origen_destino 1 pedido multiple generado automatic desde cosmitet bodega 06
                    //sw_origen_destino 0 pedido multiple generado automatic desde Duana bodega 03
                    if (datos.parametros.status === 200 && $scope.ejecutar && datos.parametros.data.sw_estado === '0' && ((bodega === '03' && datos.parametros.data.sw_origen_destino === 1) || (bodega === '06' && datos.parametros.data.sw_origen_destino === 0) || (bodega === '06' && datos.parametros.data.sw_origen_destino === 1) ) ) {
                        $scope.ejecutar = false;
                        var cotizacion ={
                            id_orden_cotizacion_origen : datos.parametros.data.id_orden_cotizacion_origen,
                            id_orden_cotizacion_destino : datos.parametros.data.id_orden_cotizacion_destino
                        }
                        that.generarIngresoI002(datos.parametros.data, function (asd) {                           
                            that.ejecutarDocumento(datos.parametros.data.numero_orden, datos.parametros.data.numero_pedido, datos.parametros.data.sw_origen_destino, datos.parametros.data.productos,datos.parametros.data.sw_tipo_pedido,cotizacion);
                        });
                    }
                    clearTimeout(timer);
                }, 0);
            });
            
            that.generarIngresoI002=function(data,callback){
                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: data.numero_orden,
//                        bodegas_doc_id : data.sw_origen_destino == 1? '1542' : '80',
                        bodegas_doc_id : data.sw_origen_destino == 1? '1541' : '80',
                        observacion:  data.parametros.encabezado.observacion
                    }
                };

                Request.realizarRequest(API.I002.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function(datas) {
                    if (datas.status === 200) {
                        $scope.doc_tmp_id=datas.obj.movimiento_temporal_id;
                        generarIngresoDetalleI002(data,0,function(){
                           
                            callback(true);
                        });


                    }
                    if (datas.status === 500) {
                        AlertService.mostrarMensaje("warning", datas.msj);
                    }
                    if (datas.status === 404) {
                        AlertService.mostrarMensaje("warning", datas.msj);
                    }
                });                
            };
            
            function generarIngresoDetalleI002(data,index,callback){
                if(data.productos[index] === undefined){
                   callback(false);
                   return;
                }

                var productos = data.productos[index];
                var productosActas = data.productosActas[index];
             
                     var movimientos_bodegas = {
                        doc_tmp_id: $scope.doc_tmp_id,
                        bodegas_doc_id: data.sw_origen_destino == 1? '1542' : '80',
                        codigo_producto: productos.codigo_producto,
                        cantidad: productos.cantidad,
                        porcentaje_gravamen: productos.porcentaje_gravamen,
                        total_costo: productos.valor_unitario*productos.cantidad,
                        fecha_vencimiento: productos.fecha_vencimiento,
                        lote: productos.lote,
                        localizacion: 'NA',
                        total_costo_ped: '0',
                        valor_unitario: '0',
                        usuario_id: $scope.session.usuario_id,
                        item_id_compras: productosActas.item_id
                     }; 
                     
                    
                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: movimientos_bodegas
                    }
                };
                
                Request.realizarRequest(API.I002.ADD_ITEM_DOC_TEMPORAL, "POST", obj, function(datos) {                   
                    index++;
                    generarIngresoDetalleI002(data,index,callback);
                 });               
            };
            
            that.ejecutarDocumento = function(orden, pedido, sw_origen_destino, productos,swTipoPedido,cotizacion){
                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            orden_pedido_id: orden,
                            doc_tmp_id: $scope.doc_tmp_id,
                            usuario_id: $scope.session.usuario_id
                        }
                    }
                };
         
                Request.realizarRequest(API.I002.EXEC_CREAR_DOCUMENTOS, "POST", obj, function(data) {

                   if (data.status === 200) {
                			var nombre = data.obj.nomb_pdf;
                			setTimeout(function() {
                			    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                			}, 4000);

                        //pasa el pedido cliente Duana a pedido farmacia Cosmitet
                        //console.log("swTipoPedidoswTipoPedidoswTipoPedido ",swTipoPedido);
                
                  
                        if(swTipoPedido === '0'){

                            var obj = {
                                session: $scope.session,
                                data: {
                                    numero_pedido : pedido,
                                    productos : productos
                                }
                            };

                            Request.realizarRequest(API.PEDIDOS.CLIENTES.PEDIDO_CLIENTE_A_PEDIDO_FARMACIA, "POST", obj, function(data) {
                                //console.log('PEDIDO_CLIENTE_A_PEDIDO_FARMACIA ',data);
                                    var obj = {
                                        session: $scope.session,
                                        data: {
                                                id_orden_pedido_final: data.obj.pedido.solicitud_prod_a_bod_ppal_det_id,
                                                id_orden_cotizacion_origen: cotizacion.id_orden_cotizacion_origen
                                        }
                                    };
                                    Request.realizarRequest(API.PEDIDOS.CLIENTES.ACTUALIZAR_PEDIDO_MULTIPLE_CLIENTE, "POST", obj, function(data) {
                                        
                                     });
                            });
                        }

                        if(swTipoPedido === '1'){

                            var obj = {
                                session: $scope.session,
                                data: {
                                    numero_pedido : pedido,
                                    sw_origen_destino : sw_origen_destino
                                }
                            };
                            //console.log('obj.data', obj.data);

                            //Ingresan productos provenientes de Cosmitet entonces se crear un pedido cliente en Duana basado en el pedido cliente cosmitet que generó este ingreso.
                            Request.realizarRequest(API.PEDIDOS.CLIENTES.DUPLICAR_PEDIDO, "POST", obj, function(data) {
                                //console.log('la data que llega de ducplicar el pedido', data);
                                //console.log('DUPLICAR_PEDIDO ',data);
                                var obj = {
                                        session: $scope.session,
                                        data: {
                                                id_orden_pedido_final: data.obj.pedido.numero_pedido,
                                                id_orden_cotizacion_origen: cotizacion.id_orden_cotizacion_origen
                                        }
                                    };
                                    Request.realizarRequest(API.PEDIDOS.CLIENTES.ACTUALIZAR_PEDIDO_MULTIPLE_CLIENTE, "POST", obj, function(data) {
                                        
                                     });
                            });
                        }
                                  
                    }
		    
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
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
                   console.log("onListarDocumentosTemporalesClientes");
                if (data.status === 200) {
                    var temporal = data.obj.documento_temporal_clientes[0];
                    var empresa = Usuario.getUsuarioActual().getEmpresa(); 
 
                    if(empresa.getCodigo() === temporal.empresa_id && 
                       empresa.getCentroUtilidadSeleccionado().getCodigo() === temporal.centro_destino && 
                       empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo() === temporal.bodega_destino){
                   

                        $scope.notificacionclientes++;
                        for (var i in data.obj.documento_temporal_clientes) {
                            var obj = data.obj.documento_temporal_clientes[i];
                            var documento_temporal = that.crearDocumentoTemporal(obj, 1);
                            documento_temporal.esDocumentoNuevo = true;
                            $scope.Empresa.agregarDocumentoTemporal(documento_temporal, 1);

                        }
                    }
                    
                }
            });

            socket.on("onListarDocumentosTemporalesFarmacias", function(data) {
                console.log("onListarDocumentosTemporalesFarmacias");
                if (data.status === 200) {
                    
                    var temporal = data.obj.documento_temporal_farmacias[0];
                    var empresa = Usuario.getUsuarioActual().getEmpresa(); 
 
                    if(empresa.getCodigo() === temporal.empresa_destino && 
                       empresa.getCentroUtilidadSeleccionado().getCodigo() === temporal.centro_destino && 
                       empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo() === temporal.bodega_destino){
                   
                        $scope.notificacionfarmacias++;
                        for (var i in data.obj.documento_temporal_farmacias) {
                            var obj = data.obj.documento_temporal_farmacias[i];
                            var documento_temporal = that.crearDocumentoTemporal(obj, 2);
                            documento_temporal.esDocumentoNuevo = true;
                            $scope.Empresa.agregarDocumentoTemporal(documento_temporal, 2);

                        }
                   
                    }
                    
                }
            });
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                socket.remove(["onListarDocumentosTemporalesFarmacias", "onListarDocumentosTemporalesClientes"]);
            });
        }]);
});
