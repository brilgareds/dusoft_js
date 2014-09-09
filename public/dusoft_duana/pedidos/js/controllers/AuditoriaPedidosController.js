define(["angular", "js/controllers",'../../../../includes/slide/slideContent',
        'models/Cliente', 'models/PedidoAuditoria', 'models/Separador', 'models/Auditor',
        'models/DocumentoTemporal', "controllers/AuditoriaPedidosClientesController","controllers/AuditoriaPedidosFarmaciasController",
        "controllers/EditarProductoController"], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'Farmacia', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "ProductoPedido", "LoteProductoPedido",
        "$modal", 'Auditor',
        function($scope, $rootScope, Request, 
                 Empresa, Cliente, Farmacia, 
                 PedidoAuditoria, Separador, DocumentoTemporal,
                 API, socket, AlertService,
                 ProductoPedido, LoteProductoPedido, $modal, Auditor) {

            $scope.Empresa = Empresa;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.productosAuditados = [];

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


            $scope.crearDocumentoTemporal = function(obj, tipo) {
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
                    
                    var documento_temporal = $scope.crearDocumentoTemporal(obj,tipo);

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

            $scope.renderDetalleDocumentoTemporal = function(documento , data, paginando) {
                //Vaciar el listado de Productos
                documento.getPedido().vaciarProductos();

                for (var i in data.lista_productos) {

                    var obj = data.lista_productos[i];
                    
                    var producto_pedido_separado = $scope.crearProductoPedidoDocumentoTemporal(obj);
                    
                    documento.getPedido().agregarProducto(producto_pedido_separado);

                   // console.log("DOCUMENTO TEMPORAL CON PRODUCTOS DE PEDIDO INGRESADOS",documento);
                }
            };

            $scope.crearProductoPedidoDocumentoTemporal = function(obj) {

                var lote_pedido = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);
                lote_pedido.item_id = obj.item_id;
        
                var producto_pedido_separado = ProductoPedido.get(  obj.codigo_producto, obj.descripcion_producto, "",
                                                                    "", obj.cantidad_solicitada, obj.cantidad_ingresada,
                                                                    obj.observacion_cambio);
                                                                    
                producto_pedido_separado.setLote(lote_pedido);
                
                
                console.log("Estructura del Objeto Producto", producto_pedido_separado);
                
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
                    dialogFade: false,
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
                        $scope.renderProductosAuditados(data.obj.movimientos_bodegas.lista_productos_auditados);
                    }

                });
                
            };

            $scope.renderProductosAuditados = function(data){

                for(var i in data){
                    var obj = data[i];
                    var producto = ProductoPedido.get(
                        obj.codigo_producto, obj.descripcion_producto,0,0,0,
                        obj.cantidad_ingresada, obj.observacion_cambio
                    );
                    var lote = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);
                    lote.item_id = obj.item_id;

                    producto.setLote(lote);

                    $scope.productosAuditados.push(producto);
                }

                console.log("productos auditados  ======", $scope.productosAuditados)

            };

            $scope.$on("onDetalleCerrado",function(){
                $scope.productosAuditados = [];
            });


        }]);
});
