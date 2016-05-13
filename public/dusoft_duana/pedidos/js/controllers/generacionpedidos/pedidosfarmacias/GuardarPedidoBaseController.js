//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers", 
    'includes/slide/slideContent',
    "models/generacionpedidos/pedidosfarmacias/FarmaciaPedido",
    "models/generacionpedidos/pedidosfarmacias/CentroUtilidadPedidoFarmacia",
    "models/generacionpedidos/pedidosfarmacias/BodegaPedidoFarmacia",
    "models/generacionpedidos/pedidosfarmacias/ProductoPedidoFarmacia",
    "controllers/generacionpedidos/pedidosfarmacias/GuardarPedidoController",
    "controllers/generacionpedidos/pedidosfarmacias/GuardarPedidoTemporalController",
    "controllers/generacionpedidos/pedidosfarmacias/SeleccionProductoController",
    "services/generacionpedidos/pedidosfarmacias/PedidosFarmaciasService"], function(angular, controllers) {

    controllers.controller('GuardarPedidoBaseController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaPedido', 'PedidoFarmacia',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal',
        'ProductoPedidoFarmacia', "$timeout","PedidosFarmaciasService",
        function($scope, $rootScope, Request, 
                 EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                 API, socket, AlertService,
                 $state, Usuario, localStorageService, $modal,
                 ProductoPedidoFarmacia, $timeout, PedidosFarmaciasService) {
                     
            
            var self = this;
            $scope.root = {};
            $scope.root.empresasDestino = angular.copy(Usuario.getUsuarioActual().getEmpresasFarmacias());
            $scope.root.empresasOrigen = [angular.copy(Usuario.getUsuarioActual().getEmpresa())];
            //handler slide
            $scope.root.mostrarSeleccionProductoCompleto;
                        
            $scope.root.pedido = PedidoFarmacia.get();
            $scope.root.servicio = PedidosFarmaciasService;
            $scope.root.filtroGrid = { filterText: '', useExternalFilter: false };
            
            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
                        
            $scope.root.lista_productos = {
                data: 'root.pedido.getProductosSeleccionados()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting:true,
                multiSelect: false,
                showFilter:true,
                filterOptions:$scope.root.filtroGrid,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width:150,
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                    <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                    <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                    <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                    <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                    <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                    <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                                </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "50%"},
                    {field: 'getCantidadSolicitada()', displayName: 'Solicitado'},
                    {field: 'getCantidadPendiente()', displayName: 'Pendiente'},
                    {field: 'nueva_cantidad', displayName: 'Modificar Cantidad',visible:false,
                                cellTemplate: ' <div class="col-xs-12">\n\
                                                    <input ng-disabled="!root.servicio.opciones.sw_modificar_pedido" type="text" validacion-numero-entero class="form-control grid-inline-input"'+
                                                    'ng-keyup="onModificarCantidad($event, row)" ng-model="row.entity.cantidadIngresada" />\
                                                </div>'
                    },
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "5%",
                            cellTemplate: ' <div class="row">\
                                                <button class="btn btn-default btn-xs" ng-click="onEliminarProducto(row.entity, row.rowIndex)" ng-validate-events="{{root.servicio.getOpcionesModulo(root.pedido).btnEliminarPedidoTemporal}}">\
                                                    <span class="glyphicon glyphicon-remove"></span>\n\
                                                </button>\
                                            </div>'
                        }
                ]
            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite hacer render en los dropdown de las empreas destino y origen
             */
            $scope.renderEncabezado = function(data){
                $scope.seleccionarEmpresaPedido(false, data.empresa_destino, data.centro_destino, data.bodega_destino);
                $scope.seleccionarEmpresaPedido(true, data.farmacia_id, data.centro_utilidad, data.bodega || data.bodega_id);
                $scope.root.pedido.setValido(true).setDescripcion(data.observacion);
            };
            
            
            /*
             * @Author: Eduar
             * @param {Object} data
             * +Descripcion: Permite hacer render en los dropdown de las empreas destino y origen
             */
            $scope.renderDetalle = function(_productos){
                
                for (var i in _productos) {
                    var _producto = _productos[i];
                    var producto = ProductoPedidoFarmacia.get(_producto.codigo_producto, _producto.descripcion_producto).
                            setCantidadPendiente(_producto.cantidad_pendiente).
                            setTipoProductoId(_producto.tipo_producto_id).
                            setCantidadSolicitada(_producto.cantidad_solicitada);
                    
                    $scope.root.pedido.setTipoPedido(_producto.tipo_producto_id);
                    $scope.root.pedido.agregarProductoSeleccionado(producto);

                }
                
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: handler para la seleccion de la empresa origen
             */
            
            $scope.onEmpresaOrigenSeleccionada = function(){
                //aseguramos que el tipo de empresa sea EmpresaPedidoFarmacia
                var empresa = EmpresaPedidoFarmacia.get(
                        $scope.root.pedido.getFarmaciaOrigen().getNombre(),
                        $scope.root.pedido.getFarmaciaOrigen().getCodigo()
                );
                    
                empresa.setCentrosUtilidad($scope.root.pedido.getFarmaciaOrigen().getCentrosUtilidad());
                $scope.root.pedido.setFarmaciaOrigen(empresa);
                
            };
            
            
            /*
             * @Author: Eduar
             * +Descripcion: handler para la seleccion de la empresa destino
             */
            
            $scope.onEmpresaDestinoSeleccionada = function(){
                
                //aseguramos que el tipo de empresa sea EmpresaPedidoFarmacia
                var empresa = EmpresaPedidoFarmacia.get(
                        $scope.root.pedido.getFarmaciaDestino().getNombre(),
                        $scope.root.pedido.getFarmaciaDestino().getCodigo()
                );
                    
                empresa.setCentrosUtilidad($scope.root.pedido.getFarmaciaDestino().getCentrosUtilidad());
                $scope.root.pedido.setFarmaciaDestino(empresa);
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: handler para la seleccion de la bodega
             */
            
            $scope.onBodegaSeleccionada = function(){
                console.log("bodega seleccionada ");
                $scope.root.pedido.setValido($scope.habilitarIncluirProductos());
                
                //El evento que se dispara es escuchado por el controlador de pedido temporal
                if($scope.root.pedido.getValido()){
                    $scope.$broadcast("onBodegaSeleccionada");
                }
            };
            
            /*
             * @Author: Eduar
             * @param {boolean} esDestino
             * @param {string} empresaId
             * @param {string} centroUtilidad
             * @param {string} bodega
             * +Descripcion: permite seleccionar la empresa, centro utilidad y bodega de un pedido existente
             */  
            $scope.seleccionarEmpresaPedido = function(esDestino, empresaId, centroUtilidad, bodega){
                
                if(!empresaId || !centroUtilidad || !bodega) {
                   return false;
                }
                
                var empresa = $scope.obtenerEmpresa(esDestino, empresaId, centroUtilidad);
                var centro  = $scope.obtenerCentroUtilidad(esDestino, empresaId, centroUtilidad);
                var bodega  = $scope.obtenerBodega(esDestino, empresaId, centroUtilidad, bodega);
                
                
                if(!centro){
                    console.log("no se pudo obtener el centro con los argumenos ", arguments);
                    return false;
                }
                
                if(esDestino){
                    $scope.root.pedido.setFarmaciaDestino(empresa);
                    $scope.root.pedido.getFarmaciaDestino().setCentroUtilidadSeleccionado(centro).getCentroUtilidadSeleccionado().
                    setBodegaSeleccionada(bodega);
                } else {
                    $scope.root.pedido.setFarmaciaOrigen(empresa);
                    $scope.root.pedido.getFarmaciaOrigen().setCentroUtilidadSeleccionado(centro).getCentroUtilidadSeleccionado().
                    setBodegaSeleccionada(bodega);
                }
            };
            
             /*
             * @Author: Eduar
             * @param {boolean} esDestino
             * @param {string} empresaId
             * return {EmpresaPedidoFarmacia} empresa
             * +Descripcion: Retorna la empresa del pedido consultado
             */   
            $scope.obtenerEmpresa = function(esDestino, empresaId){
                var empresas = (esDestino) ? $scope.root.empresasDestino :$scope.root.empresasOrigen;
                for(var i in empresas){
                    if(empresas[i].getCodigo() === empresaId ){
                        return empresas[i];
                    }
                }
                
            };
            
            /*
             * @Author: Eduar
             * @param {boolean} esDestino
             * @param {string} empresaId
             * @param {string} centroId
             * return {CentroUtilidadPedidoFarmacia} empresa
             * +Descripcion: Retorna el centro  de utilidad del pedido consultado
             */
            $scope.obtenerCentroUtilidad = function(esDestino, empresaId, centroId){
               
                var empresa = $scope.obtenerEmpresa(esDestino, empresaId);
                var centros  = empresa.getCentrosUtilidad();
                for(var i in centros){
                    var centro = centros[i];
                    if(centro.getCodigo() === centroId ){
                        return centro;
                    }
                }
                
            };
            
            /*
             * @Author: Eduar
             * @param {boolean} esDestino
             * @param {string} empresaId
             * @param {string} centroId
             * @param {string} bodegaId
             * return {BodegaPedidoFarmacia} bodega
             * +Descripcion: Retorna la bodega  de utilidad del pedido consultado
             */
            $scope.obtenerBodega = function(esDestino, empresaId, centroId, bodegaId){
               if(!empresaId || !centroId || !bodegaId) {
                   return false;
               }
               
                var centro = $scope.obtenerCentroUtilidad(esDestino, empresaId, centroId);
                
                if(!centro){
                    console.log("no se pudo obtener el centro con los argumenos ", arguments);
                    return false;
                }
                
                var bodegas  = centro.getBodegas();
                for(var i in bodegas){
                    var bodega = bodegas[i];
                    if(bodega.getCodigo().trim() === bodegaId.trim() ){
                        return bodega;
                    }
                }
                
            };
            
            /*
             * @Author: Eduar
             * return {boolean} 
             * +Descripcion: Valida si la empresa origen/destino tiene centro utilidad y bodega seleccionados
             */
            
            $scope.habilitarIncluirProductos = function(){
                
                if(!$scope.root.pedido.getFarmaciaDestino() || !$scope.root.pedido.getFarmaciaOrigen()){
                    return false;
                }
                
                var centroDestino = $scope.root.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado();
                var centroOrigen  = $scope.root.pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado();
                
                if((centroDestino && centroDestino.getBodegaSeleccionada()) && (centroOrigen && centroOrigen.getBodegaSeleccionada()) ){
                    return true;
                } else {
                    return false;
                }
            };

            
            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} producto
             * @param {int} index
             * +Descripcion: Handler del grid para eliminar un producto de un pedido o pedido temporal
             */
            $scope.onEliminarProducto = function(producto, index){
                
               var template = ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el producto '+producto.getDescripcion()+'? </h4> \
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-success" ng-click="close()">No</button>\
                                    <button class="btn btn-warning" ng-click="onConfirmarEliminarProducto()">Si</button>\
                                </div>';

                controller = function($scope, $modalInstance) {

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                    
                    $scope.onConfirmarEliminarProducto = function(){
                        $modalInstance.close();
                        //se crea esta funcion debido a que se requiere enviar un broadcast en el scope del base mas no del scope del modal
                        self.onConfirmarEliminarProducto(producto, index);
                    };
                };

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };

                var modalInstance = $modal.open($scope.opts);
                
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Realiza la peticion al api para generar pdf
             */
            self.generarPdf = function(){
                
                var pedido = $scope.root.pedido;
                var farmaciaDestino = pedido.getFarmaciaDestino();
                var farmaciaOrigen  = pedido.getFarmaciaOrigen();
                
                var url = API.PEDIDOS.FARMACIAS.GENERAR_PDF_PEDIDO;

                var obj = {
                    session: $scope.root.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido(),
                            farmaciaOrigen:farmaciaOrigen,
                            farmaciaDestino:farmaciaDestino
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var nombre = data.obj.reporte_pedido.nombre_reporte;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                    }  else {
                        AlertService.mostrarMensaje("warning", "Error generando el pdf");
                    }
                });
            };
            
            
            self.ventanaEnviarEmail = function() {
                var pedido = $scope.root.pedido;
                PedidosFarmaciasService.ventanaEnviarEmail($scope.root.session, pedido,function(err, archivo){
                    if(err.err){
                        AlertService.mostrarMensaje("warning", err.msj);
                    } else if(archivo) {
                        $scope.visualizarReporte("/reports/" + archivo, archivo, "_blank");
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton generar pdf
             */
            $scope.onGenerarReporte = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="cancelar_generacion_reporte()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                            <div class="btn-group" role="group">\
                                              <button type="button" class="btn btn-success" ng-click="descargarReportePdf()" ><span class="glyphicon glyphicon-cloud-download"></span> Descargar PDF</button>\
                                            </div>\
                                            <div class="btn-group" role="group">\
                                              <button type="button" class="btn btn-primary" ng-click="enviarReportePdfEmail()" ><span class="glyphicon glyphicon-send"></span> Enviar por Email</button>\
                                            </div>\
                                        </div>\
                                    </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.descargarReportePdf = function() {
                            self.generarPdf();
                            $modalInstance.close();
                        };

                        $scope.enviarReportePdfEmail = function() {
                            self.ventanaEnviarEmail();
                            $modalInstance.close();
                        };

                        $scope.cancelar_generacion_reporte = function() {
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            
            $scope.deshabilitarSeleccionEmpresa = function(){
                
                if(!$scope.root.pedido){
                    return true;
                }
                
                if($scope.root.pedido.getEsTemporal()){
                    return true;
                }
                                
                if($scope.root.pedido.get_numero_pedido()){
                    return true;
                }
                
                return false;
            };
            
            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} producto
             * @param {int} index
             * +Descripcion: Funcion que emite el evento para eliminar un producto
             */
            self.onConfirmarEliminarProducto = function(producto, index){
                if($scope.root.pedido.getEsTemporal()){
                    console.log("eliminar temporal ");
                    $scope.$broadcast('onEliminarProductoTemporal', producto, index);
                } else if($scope.root.pedido.get_numero_pedido()) {
                    console.log("eliminar pedido real");
                    $scope.$broadcast('onEliminarProducto', producto, index);
                }
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton de finalizar
             */
            $scope.onVolverListadoPedidos = function(){
                $state.go("ListarPedidosFarmacias");
            };
            
            /*
             * @Author: Eduar
             * @param {$event} ev
             * @param {Row} row 
             * +Descripcion: Handler del text input para modificar cantidad
             */
            $scope.onModificarCantidad = function(ev, row) {
                if (ev.which === 13) {
                    var cantidad = parseInt(row.entity.getCantidadIngresada());
                    //Se comenta validacion por solicitud de guardar registro de logs cuando se modifique las cantidades
                    //if (cantidad > 0) {
                        //Emite el evento al controlador GuardarPedidoController
                        $scope.$broadcast("onEditarCantidad", row.entity);
                    //} else if(cantidad === 0 && $scope.root.pedido.getProductosSeleccionados().length === 1 ){
                      //  $scope.$broadcast("onAnularPendiente", row.entity);
                    //}
                }
            };
            
           $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.root.mostrarSeleccionProductoCompleto();
                $scope.$$watchers = null;
                $scope.root = {};
                console.log("eliminando base");

            });

            
            
        }]);
});
