//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent', "controllers/separacionpedidos/SeparacionProductoCantidadController"], function(angular, controllers) {

    var fo = controllers.controller('SeparacionProductosController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        "SeparacionService","Usuario","EmpresaPedido","LoteProductoPedido",
        "DocumentoTemporal","PedidoAuditoria","Cliente","Farmacia","ProductoPedido",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, localStorageService, $state,
                SeparacionService, Usuario, EmpresaPedido, LoteProductoPedido,
                DocumentoTemporal, PedidoAuditoria, Cliente, Farmacia,ProductoPedido) {


            var self = this;

            self.init = function(callback) {
                $scope.rootSeparacion = {};
                
                $scope.rootSeparacion.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                $scope.rootSeparacion.empresa = EmpresaPedido;
                $scope.rootSeparacion.paginaactual = 0;
                $scope.rootSeparacion.nombreCliente = "";
                $scope.rootSeparacion.documento;
                
                $scope.justificaciones = [
                    {nombre: "Guia", id: 1},
                    {nombre: "Transportador", id: 2},
                    {nombre: "Estado", id: 3}
                ];
                $scope.filtros = [
                    {nombre: "Listar productos", id: 1},
                    {nombre: "Refrescar", id: 2}

                ];
                  $scope.tipos = [
                    {nombre: "Tipo 1", id: 1},
                    {nombre: "Tipo 2", id: 2},
                    {nombre: "Tipo 3", id: 3}
                ];
                 $scope.tipo = $scope.tipos[0];
                 $scope.filtro = $scope.filtros[0];
                 $scope.justificacion = $scope.justificaciones[0];
                 callback();
            };
                   
             /**
               * +Descripcion: metodo para desplegar la ventana modal de
               * cantidades en la separacion
               * @author Cristian Ardila
               * @fecha: 10/09/2015
               * @returns {undefined}
               */
             self.ventanaListarProductos = function() {
                 
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    
                    templateUrl: 'views/separacionpedidos/separacionAsignacionListarProductos.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.cerrarListarProductos = function() {
                            $modalInstance.close();
                            
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            
            /*
             * @author Eduar Garcia
             * permite mostar un producto en determinada posicion
             */
            self.seleccionarProductoPorPosicion = function(callback){
                var pedido = EmpresaPedido.getPedidoSeleccionado();
                var producto = pedido.getProductos()[$scope.rootSeparacion.paginaactual];
                pedido.setProductoSeleccionado(producto);
                
                if(!producto){
                    callback(false);
                    return;
                }
                
                pedido.setProductoSeleccionado(producto);
                self.traerLotesProducto(function(){
                    if(callback){
                        callback(true);
                    }
                });

            };

            /**
             * +Descripcion: metodo para desplegar la ventana modal de
             * cantidades en la separacion
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * @returns {undefined}
             */
             self.ventanaCantidad = function(lote) {
                $scope.ventana = true;
                var pedido =  EmpresaPedido.getPedidoSeleccionado();
                var producto = pedido.getProductoSeleccionado().setLote(lote);
                
                var opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    templateUrl: 'views/separacionpedidos/separacionVentanaCantidad.html',
                    scope: $scope,
                    controller: 'SeparacionProductoCantidadController',
                    resolve: {
                        pedido:function(){
                            return pedido;
                        }
                    }
                };
                var modalInstance = $modal.open(opts);
                
                modalInstance.result.then(function() {

                }, function() {
                    self.traerDocumentoTemporal(function(){

                    });
                });
            };
            
           /**
             * @author Eduar Garcia
             * +Descripcion: Renderiza descripcion del pedido
             */
            self.renderDescripcionPedido = function(){
                 var pedido = EmpresaPedido.getPedidoSeleccionado();
                 
                 if(pedido.getTipo() === '1'){
                    $scope.rootSeparacion.nombreCliente = pedido.getCliente().getNombre(); 
                 } else {
                     
                    $scope.rootSeparacion.nombreCliente = pedido.getFarmacia().get_nombre_farmacia() 
                                                          +" -- "+ pedido.getFarmacia().getNombreBodega();
                 }
            };
            
            /**
             * @author Eduar Garcia
             * +Descripcion: Permite consultar el pedido en caso de recargar la pagina
             */
            self.gestionarPedido = function(callback){
                var filtroPedido =  localStorageService.get("pedidoSeparacion");
                var filtro = {};
                filtro.estado = (filtroPedido.temporal)? {temporales : true} : {asignados : true};
                filtro.estado.numeroPedido = true;
                
                var metodo = "traerPedidosAsignadosClientes";
                
                if(filtroPedido.tipoPedido === '2'){
                    metodo = "traerPedidosAsignadosFarmacias";
                } 
                
                SeparacionService[metodo]($scope.rootSeparacion.session, filtro, 1, filtroPedido.numeroPedido, function(pedidos){
                   EmpresaPedido.setPedidoSeleccionado((pedidos.length > 0)? pedidos[0] : null);
                   self.renderDescripcionPedido();
                   callback();
               });
            };
            
           /**
             * @author Eduar Garcia
             * @param{function} callback
             * +Descripcion: Realiza la peticion al api para traer los lotes del producto
             */
            self.traerLotesProducto = function(callback){
                var pedido = EmpresaPedido.getPedidoSeleccionado();
                var producto =  pedido.getProductos()[$scope.rootSeparacion.paginaactual];
                var url = API.SEPARACION_PEDIDOS.CONSULTAR_DISPONIBILIDAD;
                
                var obj = {
                    session: $scope.rootSeparacion.session,
                    data: {
                        pedidos: {
                            empresa_id: pedido.getEmpresaDestino(),
                            centro_utilidad_id: pedido.getCentroDestino(),
                            bodega_id: pedido.getBodegaDestino(),
                            identificador:(pedido.getTipo() === "1")?"CL":"FM",
                            numero_pedido: pedido.get_numero_pedido(),
                            limite:25,
                            codigo_producto:producto.getCodigoProducto()
                        }
                    }
                };
                

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                      self.serealizarLotesProductos(data.obj);
                      callback(true);
                    } else {
                        callback(false);
                    }
                });
            };
            
            /**
             * @author Eduar Garcia
             * +Descripcion: Serializa los lotes del producto
             */
            self.serealizarLotesProductos = function(datos){
                var pedido = EmpresaPedido.getPedidoSeleccionado();
                var producto = pedido.getProductoSeleccionado();
                var lotes = datos.existencias_producto;
                
                producto.vaciarLotes();
                                
                var disponible = (datos.disponibilidad_bodega)? parseInt(datos.disponibilidad_bodega):0;
                for(var i in lotes){
                    var _lote = lotes[i];
                    var lote = LoteProductoPedido.get(_lote.lote, _lote.fecha_vencimiento);
                    lote.setDisponible(disponible).setExistenciaActual(_lote.existencia_actual);
                    producto.agregarLote(lote);
                }
                
            };
            
            /**
             * @author Eduar Garcia
             * +Descripcion: Realiza la peticion al API para traer el temporal de un pedido
             */
            self.traerDocumentoTemporal = function(callback){
               var url = API.SEPARACION_PEDIDOS.CLIENTES.CONSULTAR_TEMPORAL_CLIENTES;
               var pedido = EmpresaPedido.getPedidoSeleccionado();
                
               if(pedido.getTipo() === '2'){
                   url = API.SEPARACION_PEDIDOS.FARMACIAS.CONSULTAR_TEMPORAL_FARMACIAS;
               }
               
               var obj = {
                    session: $scope.rootSeparacion.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
               };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                      if(self.serializacionTemporal(data.obj.documento_temporal)){
                          
                            self.marcarSeparados();
                      }
                      callback(); 

                    } else {
                        callback(false);
                    }
                });
            };
            
            
            self.marcarSeparados = function(){
                
                //No hay temporal disponible
                if(!$scope.rootSeparacion.documento){
                    return;
                }
                
                var producto = EmpresaPedido.getPedidoSeleccionado().getProductoSeleccionado();                
                var lotes = producto.getLotesSeleccionados();
                var pedido = $scope.rootSeparacion.documento.getPedido();
                for(var i in lotes){
                    var lote = lotes[i];
                    
                    for(var ii in pedido.getProductos()){
                        var _producto = pedido.getProductos()[ii];
                        var _lote = _producto.getLotesSeleccionados()[0];
                        if(_lote.getCodigo() === lote.getCodigo() && _lote.getFechaVencimiento() === lote.getFechaVencimiento()
                           && _producto.getCodigoProducto() === producto.getCodigoProducto()){
                            lote.setSeparado(true);
                            break;
                        }
                        
                    }
                }
                
            };
            
             /**
             * @author Eduar Garcia
             * @param{Object} temporal
             * +Descripcion: Serializa el temporal del producto
             */
            self.serializacionTemporal = function(temporal){
                var pedido = EmpresaPedido.getPedidoSeleccionado();
                
                if(temporal && temporal.length > 0){
                    var doc = temporal[0];
                    
                    $scope.rootSeparacion.documento = DocumentoTemporal.get();
                    $scope.rootSeparacion.documento.setdocumentoTemporalId(doc.documento_temporal_id || doc.doc_tmp_id).
                    setBodegasDocId(doc.bodegas_doc_id).setFechaRegistro(doc.fecha_registro);
            
                    var _pedido = PedidoAuditoria.get();
                    _pedido.setNumeroPedido(doc.numero_pedido).//setEstado(doc.estado).
                    setTipo(pedido.getTipo());
                    pedido.setTemporalId(doc.documento_temporal_id);  
            
                    if(_pedido.getTipo() === '1'){
                        var cliente = Cliente.get(doc.nombre_cliente, doc.direccion_cliente, doc.tipo_id_cliente, doc.identificacion_cliente);
                        _pedido.setCliente(cliente);
                    } else {
                        var farmacia = Farmacia.get(
                            doc.farmacia_id, doc.bodega_id, doc.nombre_farmacia, 
                            doc.nombre_bodega, doc.centro_utilidad
                        );

                        _pedido.setFarmacia(farmacia);
                    }
                    
                    var productos = doc.lista_productos;
                    
                    _pedido.agregarDetallePedido(ProductoPedido, productos, true, LoteProductoPedido);
                    
                    $scope.rootSeparacion.documento.setPedido(_pedido);
                    
                    return true;
                }
                
                return false;
            };
            
            /**
             * +Descripcion: Datos de prueba
             */
            $scope.myData = [
                {pedido: 50, fechavencimiento: "20/08/2015", existencia: 60, disponible: 50},
                {pedido: 50, fechavencimiento: "20/08/2015", existencia: 60, disponible: 50},
                {pedido: 50, fechavencimiento: "20/08/2015", existencia: 60, disponible: 50},
                {pedido: 50, fechavencimiento: "20/08/2015", existencia: 60, disponible: 50},
                {pedido: 50, fechavencimiento: "20/08/2015", existencia: 60, disponible: 50}
            ];
            
            
            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  clientes y pedidos temporales clientes
             */
            $scope.separacionProducto = {
                data: 'rootSeparacion.empresa.getPedidoSeleccionado().getProductoSeleccionado().getLotesSeleccionados()',
                /*afterSelectionChange:function(rowItem){
                     if(rowItem.selected){
                         self.ventanaCantidad(rowItem.entity);
                     }
                },*/
                enableColumnResize: true,
                enableRowSelection: false,
                keepLastSelected:false,
                multiSelect:false,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "50",
                     cellTemplate: ' <input-check   ng-model="row.entity.separado" disabled />'},
                    {field: 'codigo_lote', displayName: 'Lote'},
                    {field: 'fecha_vencimiento', displayName: 'F. vencimiento'},
                    {field: 'existencia_actual', displayName: 'Existencia'},
                    {field: 'disponible', width: "10%", displayName: "Disponible"},
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: 40,
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" disabled ng-disabled="row.entity.separado"  ng-click="onSeleccion(row.entity)">\n\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\n\
                                     </div>'
                    }
                     
                ]
               
            };
            
            
           $scope.onSeleccion = function(lote){
                self.ventanaCantidad(lote);
           };
            
           /**
             * @author Eduar Garcia
             * +Descripcion: Permite seleccionar un producto en el arreglo del pedido
             *  clientes y pedidos temporales clientes
             */
            
            $scope.listarProductos = {
                data: 'myData',
                
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected:false,
                multiSelect:false,
                columnDefs: [
                    {field: 'pedido', displayName: 'Lote'},
                    {field: 'fechavencimiento', displayName: 'F. vencimiento'}
                   
                     
                ]
               
            };
            
            /*
             * @author Eduar Garcia
             * +Descripcion: Handler del boton  siguiete
             */            
            $scope.onSiguiente = function(){
                var cantidadProductos = EmpresaPedido.getPedidoSeleccionado().getProductos().length - 1;
                
                if($scope.rootSeparacion.paginaactual === cantidadProductos){
                    $scope.mostrarDetallePedidos();
                    return;
                }
                
                $scope.rootSeparacion.paginaactual++;
                self.seleccionarProductoPorPosicion(function(){
                    self.marcarSeparados();
                });
            };
            
            /*
             * @author Eduar Garcia
             * +Descripcion: Handler del boton anterior
             */  
            $scope.onAnterior = function(){
                if($scope.rootSeparacion.paginaactual === 0){
                    return;
                }
                $scope.rootSeparacion.paginaactual--;
                self.seleccionarProductoPorPosicion(function(){
                    self.marcarSeparados();
                });
            };
            
            /**
             * +Descripcion: metodo ejecutado por el slider para cambiar a la 
             * pagina donde se encuentran los documentos para despachar
             * 
             */
            $scope.mostrarDetallePedidos = function() {
                

                $scope.slideurl = "views/separacionpedidos/separacionDetalle.html?time=" + new Date().getTime();
                $scope.$emit('mostrarDetallePedidos');
             
            };
            
                        
            $scope.onSeleccionTipo = function(tipo) {
                $scope.tipo = tipo;
            };
            
            $scope.onSeleccionJustificacion = function(justificacion) {
                $scope.justificacion = justificacion;
            };

           
            $scope.onSeleccionFiltros = function(justificacion) {
                $scope.filtro = justificacion;
                
                self.ventanaListarProductos();
            };
            
            

            self.init(function() {
                if($scope.ventana){
                    return;
                }
                
               if(Object.keys(EmpresaPedido.getPedidoSeleccionado()).length === 0){
                   self.gestionarPedido(function(){
                       self.seleccionarProductoPorPosicion(function(completo){
                            self.traerDocumentoTemporal(function(){

                            });
                       });
                   });
               } else {
                   self.renderDescripcionPedido();
                   self.seleccionarProductoPorPosicion(function(completo){
                       
                        self.traerDocumentoTemporal(function(){

                        });
                   });
               }

            });

        }]);
});