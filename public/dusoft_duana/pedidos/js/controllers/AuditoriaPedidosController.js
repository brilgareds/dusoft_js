define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoAuditoria', 'models/Separador', 'models/Auditor',
        'models/DocumentoTemporal', "controllers/AuditoriaPedidosClientesController","controllers/AuditoriaPedidosFarmaciasController",
        "controllers/EditarProductoController"], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'Farmacia', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "ProductoPedido", "LoteProductoPedido",
        "$modal", 'Auditor','Usuario',
        function($scope, $rootScope, Request, 
                 Empresa, Cliente, Farmacia, 
                 PedidoAuditoria, Separador, DocumentoTemporal,
                 API, socket, AlertService,
                 ProductoPedido, LoteProductoPedido, $modal, Auditor, Usuario) {

            $scope.Empresa = Empresa;

            $scope.session = {
               usuario_id:Usuario.usuario_id,
               auth_token:Usuario.token
            };

            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.productosAuditados = [];
            $scope.productosNoAuditados = [];
            $scope.productosPendientes = [];
            $scope.notificacionclientes = 0;
            $scope.notificacionfarmacias = 0;
            $scope.filtro = {
                codigo_barras:false
            };


            var that = this;

            $scope.buscarPedidosSeparados = function(obj, tipo, paginando, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES;

                if(tipo == 2){
                    url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;
                    
                    if(data.obj.documentos_temporales != undefined) {
                        callback(data.obj, paginando, tipo);
                    }

                });

            };


            that.crearDocumentoTemporal = function(obj, tipo) {
                //console.log("datos obj ",obj)
                var documento_temporal = DocumentoTemporal.get();
                documento_temporal.setDatos(obj);

                var pedido = PedidoAuditoria.get(obj);
                pedido.setDatos(obj);
                pedido.setTipo(tipo);
                
                if(tipo == 1){
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



            $scope.renderPedidosSeparados = function(data, paginando, tipo) {
                
                var items = data.documentos_temporales.length;
                var evento = (tipo == 1)?"Cliente":"Farmacia";
                
                $scope.$broadcast("onPedidosSeparadosRender"+evento, items);

                //se valida que hayan registros en una siguiente pagina
                if (paginando && items == 0) {
                    $scope.$broadcast("onPedidosSeparadosNoEncotrados"+evento, items);
                    return;
                }
                
                $scope.Empresa.vaciarDocumentoTemporal(tipo);

                for (var i in data.documentos_temporales) {

                    var obj = data.documentos_temporales[i];
                    
                    var documento_temporal = that.crearDocumentoTemporal(obj,tipo);
                   // documento_temporal.esDocumentoNuevo = true;  
                    $scope.Empresa.agregarDocumentoTemporal(documento_temporal, tipo);
                }
            };



            //logica detalle

            $scope.buscarDetalleDocumentoTemporal = function(obj, paginando,tipo, callback){
                var url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_CLIENTES;

                if(tipo == 2){
                    url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                /* Fin Objeto a enviar*/
                /* Inicio Request */
                Request.realizarRequest(url, "POST", obj, function(data) {
                     
                    if(data.status == 200) { 
                        //console.log("detalle ", data)
                        if(data.obj.documento_temporal != undefined) {
                            callback(data, paginando);
                        }
                    }
                });
                /* Fin Request */
                
            };

            that.buscarProductosSeparadosEnDocumento = function(obj, tipo, callback){

                var url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_PRODUCTOS_AUDITADOS_CLIENTE;

                if(tipo == 2){
                    url = API.DOCUMENTOS_TEMPORALES.CONSULTAR_PRODUCTOS_AUDITADOS_FARMACIA;
                }
                
                 Request.realizarRequest(url, "POST", obj, function(data) {
                     
                    if(data.status == 200) { 

                        if(data.obj.movimientos_bodegas != undefined) {
                            callback(data);
                        }
                    }
                });
            };

            that.renderDetalleDocumentoTemporal = function(documento , productos) {
                //Vaciar el listado de Productos

                documento.getPedido().vaciarProductos();

                for (var i in productos) {

                    var obj = productos[i];
                    
                    var producto_pedido_separado = this.crearProductoPedidoDocumentoTemporal(obj);
                    
                    documento.getPedido().agregarProducto(producto_pedido_separado);

                    //console.log("DOCUMENTO TEMPORAL CON PRODUCTOS DE PEDIDO INGRESADOS",productos);
                }
            };


            $scope.onKeyDocumentosSeparadosPress = function(ev, termino_busqueda, documento, params, tipo){
                

                that.buscarProductosSeparadosEnDocumento(params, tipo ,function(data){
                    if(data.status == 200){
                        var productos = data.obj.movimientos_bodegas.lista_productos_auditados;
                        console.log("productos encontrados ",productos);

                        that.renderDetalleDocumentoTemporal(documento , productos);
                    }
                });
            };

            that.crearProductoPedidoDocumentoTemporal = function(obj) {

                var lote_pedido = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);
                lote_pedido.justificacion_separador = obj.justificacion || "";
                lote_pedido.justificacion_auditor = obj.justificacion_auditor || "";
                lote_pedido.item_id = obj.item_id;
        
                var producto_pedido_separado = ProductoPedido.get(  obj.codigo_producto, obj.descripcion_producto, "",
                                                                    "", obj.cantidad_solicitada, obj.cantidad_ingresada,
                                                                    obj.observacion_cambio);
                                                                    
                producto_pedido_separado.setLote(lote_pedido);
                
                
                //console.log("Estructura del Objeto Producto", producto_pedido_separado, obj);
                
                return producto_pedido_separado;

            };


              //Trae el Listado de Documentos de Usuario
            $scope.traerListadoDocumentosUsuario = function(obj, callback) {

                
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {
                    
                    if(data.status == 200){
                        callback(data);
                    }

                });
                
            };


            $scope.validarDocumentoUsuario = function(obj, tipo, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_CLIENTES;

                if(tipo == 2){
                    url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    callback(data);
                    if(data.status === 200){
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
                
                /* Fin Request */
            };

            $scope.esDocumentoBodegaValido = function(bodega_id){
                return (!bodega_id > 0)?false:true
            };


            $scope.onEditarRow = function(documento, row){
                console.log("ediar producto ", row.entity);
                var producto =  row.entity;
                $scope.opts = {
                    //backdrop: true,
                    size: 1000,
                    backdropClick: true,
                    backdrop :'static',
                    dialogFade: true,
                    keyboard: true,
                    dialogClass:"editarproductomodal",
                    templateUrl: 'views/editarproducto.html',
                    controller: "EditarProductoController",
                    resolve :{
                          documento : function(){
                            return documento;
                          },
                          producto : function(){
                              return producto;
                          }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
            };


             $scope.traerProductosAuditatos = function(obj){

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_PRODUCTOS_AUDITADOS, "POST", obj, function(data) {
                    
                    if(data.status == 200){
                        console.log(data, "productos auditados");
                        that.renderProductosAuditados(data.obj.movimientos_bodegas.lista_productos_auditados, $scope.productosAuditados);
                    }

                });
                
            };

            that.renderProductosAuditados = function(data, arreglo){

                for(var i in data){
                    var obj = data[i];
                    var producto = ProductoPedido.get(
                        obj.codigo_producto, obj.descripcion_producto,0,0,obj.cantidad_solicitada,
                        obj.cantidad_ingresada, obj.observacion_cambio
                    );
                    var lote = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);
                    lote.item_id = obj.item_id;

                    producto.setLote(lote);

                    arreglo.push(producto);
                }

                console.log("productos auditados  ======", arreglo)

            };


            that.sacarProductoAuditados = function(_producto){
                var count = 0;
                for(var i in $scope.productosAuditados){
                    var producto = $scope.productosAuditados[i];
                    console.log("producto buscando ", producto , " cont ", _producto);
                    if(producto.codigo_producto == _producto.codigo_producto){
                        $scope.productosAuditados.splice(count,1);
                        break;
                    }
                    count++;
                }
            };


            $scope.onEliminarProductoAuditado = function(DocumentoTemporal, row){
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            item_id: row.entity.lote.item_id,
                            auditado: false,
                            numero_caja:0,
                            documento_temporal_id:DocumentoTemporal.documento_temporal_id,
                            codigo_producto:row.entity.codigo_producto,
                            cantidad_pendiente:0,
                            justificacion_auditor:"",
                            existencia:""
                        }
                    }
                };

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.AUDITAR_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {

                    if(data.status === 200){
                       that.sacarProductoAuditados(row.entity); 
                       AlertService.mostrarMensaje("success", data.msj);
                       var params ={
                            session:$scope.session,
                            data : {
                                documento_temporal:{
                                    documento_temporal_id:DocumentoTemporal.documento_temporal_id,
                                    usuario_id:DocumentoTemporal.separador.usuario_id
                                }
                            }
                        };
                        
                        $scope.traerProductosAuditatos(params);

                    } 
                });

            };

            $scope.generarDocumento = function(documento){
                
                var url = API.DOCUMENTOS_TEMPORALES.GENERAR_DESPACHO;

                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal:{
                            numero_pedido:documento.pedido.numero_pedido,
                            documento_temporal_id:documento.documento_temporal_id,
                            auditor_id:documento.auditor.operario_id,
                            usuario_id:documento.separador.usuario_id
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    
                    if(data.status == 200){
                        console.log("respuesta al generar documento "+data); 
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                         AlertService.mostrarMensaje("warning", data.msj);
                        var movimientos_bodegas = data.obj.movimientos_bodegas;
                        $scope.productosNoAuditados = [];
                        $scope.productosPendientes  = [];
                        that.renderProductosAuditados(movimientos_bodegas.productos_no_auditados, $scope.productosNoAuditados);
                        that.renderProductosAuditados(movimientos_bodegas.productos_pendientes, $scope.productosPendientes);
                    }

                });

            };


            $scope.$on("onDetalleCerrado",function(){
                $scope.productosAuditados = [];
                $scope.productosNoAuditados = [];
                $scope.productosPendientes = [];
            });

            socket.on("onListarDocumentosTemporalesClientes",function(data){
                console.log("onListarDocumentosTemporalesClientes", data);
                if(data.status == 200){
                    $scope.notificacionclientes++;
                    for(var i in data.obj.documento_temporal_clientes){
                        var obj = data.obj.documento_temporal_clientes[i];
                        var documento_temporal = that.crearDocumentoTemporal(obj,1);
                        documento_temporal.esDocumentoNuevo = true;
                        $scope.Empresa.agregarDocumentoTemporal(documento_temporal, 1);
                        console.log("object added client ",obj );
                    }
                }
            });

             socket.on("onListarDocumentosTemporalesFarmacias",function(data){
                console.log("onListarDocumentosTemporalesFarmacias", data);
                if(data.status == 200){
                    $scope.notificacionfarmacias++;
                    for(var i in data.obj.documento_temporal_farmacias){
                        var obj = data.obj.documento_temporal_farmacias[i];
                        var documento_temporal = that.crearDocumentoTemporal(obj,2);
                        documento_temporal.esDocumentoNuevo = true;
                        $scope.Empresa.agregarDocumentoTemporal(documento_temporal, 2);
                         console.log("object added client ",obj );
                    }
                }
            });

        }]);
});
