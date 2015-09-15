//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionProductosController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        "SeparacionService","Usuario","EmpresaPedido","LoteProductoPedido",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, localStorageService, $state,
                SeparacionService, Usuario, EmpresaPedido, LoteProductoPedido) {


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
            self.seleccionarProductoPorPosicion = function(){
                var pedido = EmpresaPedido.getPedidoSeleccionado();
                var producto = pedido.getProductos()[$scope.rootSeparacion.paginaactual];
                pedido.setProductoSeleccionado(producto);
                
                if(!producto){
                    return;
                }
                
                pedido.setProductoSeleccionado(producto);
                self.traerLotesProducto(function(){
                });

            };

            /**
             * +Descripcion: metodo para desplegar la ventana modal de
             * cantidades en la separacion
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * @returns {undefined}
             */
             self.ventanaCantidad = function() {
                 
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    
                    templateUrl: 'views/separacionpedidos/separacionVentanaCantidad.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.cerrarVentanaCantidadCaja = function() {
                            $modalInstance.close();
                            
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
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
                   console.log("EmpresaPedido.getPedidoSeleccionado", EmpresaPedido.getPedidoSeleccionado())
                   callback();
                  // self.traerDocumentoTemporal();
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
            
            self.traerDocumentoTemporal = function(){
                SeparacionService.traerDocumentoTemporal($scope.rootSeparacion.session, $scope.rootSeparacion.pedido, function(){
                    
                });
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
                afterSelectionChange:function(rowItem){
                     if(rowItem.selected){
                         self.ventanaCantidad();
                     }
                },
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected:false,
                multiSelect:false,
                columnDefs: [
                    {field: 'codigo_lote', displayName: 'Lote'},
                    {field: 'fecha_vencimiento', displayName: 'F. vencimiento'},
                    {field: 'existencia_actual', displayName: 'Existencia'},
                    {field: 'disponible', width: "10%",
                        displayName: "Disponible"
                        
                    }
                     
                ]
               
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
                self.seleccionarProductoPorPosicion();
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
                self.seleccionarProductoPorPosicion();
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
            
            
            /*
             * @Author: Eduar
             * +Descripcion: Funcion utilizada para destruir las referencias del controlador ejemplo la variable rootSeparacionClientes
             */
            $scope.$on('$destroy', function iVeBeenDismissed() {
                console.log("goodbye SeparacionClientesController");
                $scope.rootSeparacionClientes = null;
            });

            self.init(function() {
               if(Object.keys(EmpresaPedido.getPedidoSeleccionado()).length === 0){
                   self.gestionarPedido(function(){
                       self.seleccionarProductoPorPosicion();
                   });
               } else {
                   self.renderDescripcionPedido();
                   self.seleccionarProductoPorPosicion();
               }

            });

        }]);
});