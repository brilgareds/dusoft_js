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
        'ProductoPedidoFarmacia', "$timeout","PedidosFarmaciasService","CentroUtilidadPedidoFarmacia","BodegaPedidoFarmacia",
        function($scope, $rootScope, Request, 
                 EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                 API, socket, AlertService,
                 $state, Usuario, localStorageService, $modal,
                 ProductoPedidoFarmacia, $timeout, PedidosFarmaciasService,CentroUtilidadPedidoFarmacia,BodegaPedidoFarmacia) {
                     
            
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
            
            /*             
             * @Author: AMGT
             * @param {type} data
             * +Descripcion: Se crea la variable bodegaMultiple para identificar que se va a sacar productos de multiples bodegas.
             */
            if ($state.is("GuardarPedidoTemporal") === true) {
                var resultadoStorage = localStorageService.get("bodegaMultiple"); 
                $scope.root.bodegaMultiple=resultadoStorage;
                $scope.root.bodegaMultiple.bools=resultadoStorage.multiple===1?true:false;
                if($scope.root.bodegaMultiple.bools){                   
                    
                    var empresa = EmpresaPedidoFarmacia.get(
                        Usuario.getUsuarioActual().getEmpresa().nombre,
                        Usuario.getUsuarioActual().getEmpresa().codigo
                    );
                        
                       
                   var centroUtilidad = CentroUtilidadPedidoFarmacia.get(Usuario.getUsuarioActual().getEmpresa().centroUtilidad.getNombre(),
                                                                         Usuario.getUsuarioActual().getEmpresa().centroUtilidad.getCodigo());
                                                                       
                   var bodega = BodegaPedidoFarmacia.get(Usuario.getUsuarioActual().getEmpresa().centroUtilidad.bodega.getNombre(),
                       Usuario.getUsuarioActual().getEmpresa().centroUtilidad.bodega.getCodigo());
                       centroUtilidad.bodega = bodega;                                        
                       empresa.centroUtilidad = centroUtilidad ; 
                       centroUtilidad.agregarBodega(bodega);    
                       empresa.agregarCentroUtilidad(centroUtilidad);
                       $scope.root.pedido.setFarmaciaOrigen(empresa);
               
                }
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
                                                    <span class="label label-info"    ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                    <span class="label label-info"    ng-show="row.entity.getTipoProductoId() == 8">Nu</span>\
                                                    <span ng-cell-text >{{COL_FIELD}}</span>\
                                                </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "50%"},
                    {field: 'bodega', displayName: 'Bodega',visible:$scope.root.bodegaMultiple.bools,width:400,
                        cellTemplate : ' <div class="col-xs-6">\n\
                                            {{row.entity.getNombreBodega()}} \n\
                                         </div>'
                    },
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
                            setCantidadSolicitada(_producto.cantidad_solicitada).
                            setNombreBodega(_producto.nombre_bodega).
                            setEmpresaOrigenProducto(_producto.empresa_origen_producto).
                            setCentroUtilidadOrigenProducto(_producto.centro_utilidad_origen_producto).
                            setBodegaOrigenProducto(_producto.bodega_origen_producto);
                    
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
                console.log("empresa ", empresa);
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

                controller = ["$scope", "$modalInstance", function($scope, $modalInstance) {

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                    
                    $scope.onConfirmarEliminarProducto = function(){
                        $modalInstance.close();
                        //se crea esta funcion debido a que se requiere enviar un broadcast en el scope del base mas no del scope del modal
                        self.onConfirmarEliminarProducto(producto, index);
                    };
                }];

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
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

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
                    }]
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
             * @param {String} titulo
             * @param {String} mensaje
             * +Descripcion: Mensaje de alerta
             */
            self.mostrarAlertaSeleccionProducto = function(titulo, mensaje) {
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">' + titulo + '</h4>\
                                    </div>\
                                    <div class="modal-body row">\
                                    <div class="col-md-12">\
                                    <h4>' + mensaje + '</h4>\
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
         };
            
            /*
             * @Author: Eduar
             * @param {$event} ev
             * @param {Row} row 
             * +Descripcion: Handler del text input para modificar cantidad
             */
            $scope.onModificarCantidad = function(ev, row) {
            $scope.root.codigo_producto = row.entity.codigo_producto;

            if (ev.which === 13)
            {
                self.buscarProductos(function(disponible) {
                    console.log("$scope.root.disponibilidad  ", disponible);
                    if (row.entity.getCantidadIngresada() > disponible) {
                        self.mostrarAlertaSeleccionProducto("Diponibilidad del Producto", "<p align='justify'> La cantidad ingresada " + row.entity.getCantidadIngresada() + " es mayor a <br> la disponible " + disponible + "</p>");
                        row.entity.setCantidadIngresada(0);
                        return;
                    }
                    var cantidad = parseInt(row.entity.getCantidadIngresada());
                    $scope.$broadcast("onEditarCantidad", row.entity);
                    });
                }
            };
            
 /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: metodo que hace la peticion para traer los productos de la empresa seleccionada en el pedido
             */
            self.buscarProductos = function(callback) {
               
                $scope.root.filtro={'termino_busqueda' : $scope.root.codigo_producto,'pedidosNoIncluirDisponibilidad': [$scope.root.pedido.get_numero_pedido()]};
                //$scope.rootSeleccionProductoFarmacia.filtro.tipo_producto = $scope.rootSeleccionProductoFarmacia.tipoProducto;
                var empresa = Usuario.getUsuarioActual().getEmpresa();
                var obj = {
                    session: $scope.root.session,
                    data: {
                        productos: {
                            pagina_actual: 1,
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                            centro_utilidad_id: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            empresa_destino_id: $scope.root.pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_destino_id: $scope.root.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_destino_id: $scope.root.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            filtro: $scope.root.filtro
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.LISTAR_PRODUCTOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {    
                    console.log("",data.obj.lista_productos[0].disponibilidad_bodega);
                    if (data.status === 200) {
                         if (callback) {
                             callback(data.obj.lista_productos[0].disponibilidad_bodega);
                            }
                        //    $scope.root.disponibilidad=data.obj.lista_productos[0].disponibilidad_bodega;
                      //self.renderPendiente(data.obj.lista_productos[0].disponibilidad_bodega);
                    }else{
                         $scope.root.disponibilidad=0;
                    }
                });
            };
            
            self.renderPendiente = function(data) {
               $scope.root.disponibilidad=data;
            };
            
           $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.root.mostrarSeleccionProductoCompleto();
                $scope.$$watchers = null;
                $scope.root = {};
                console.log("eliminando base");

            });

            
            
        }]);
});
