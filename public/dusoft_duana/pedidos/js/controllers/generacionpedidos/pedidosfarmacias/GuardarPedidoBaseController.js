//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers", 
    'includes/slide/slideContent',
    "models/generacionpedidos/pedidosfarmacias/FarmaciaPedido",
    "models/generacionpedidos/pedidosfarmacias/CentroUtilidadPedidoFarmacia",
    "models/generacionpedidos/pedidosfarmacias/BodegaPedidoFarmacia",
    "models/generacionpedidos/pedidosfarmacias/ProductoPedidoFarmacia",
    "controllers/generacionpedidos/pedidosfarmacias/GuardarPedidoController",
    "controllers/generacionpedidos/pedidosfarmacias/GuardarPedidoTemporalController",
    "controllers/generacionpedidos/pedidosfarmacias/SeleccionProductoController"], function(angular, controllers) {

    var fo = controllers.controller('GuardarPedidoBaseController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaPedido', 'PedidoFarmacia',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal',
        'ProductoPedidoFarmacia', "$timeout",
        function($scope, $rootScope, Request, 
                 EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                 API, socket, AlertService,
                 $state, Usuario, localStorageService, $modal,
                 ProductoPedidoFarmacia, $timeout) {

            var self = this;
            $scope.root = {};
            $scope.root.empresasDestino = angular.copy(Usuario.getUsuarioActual().getEmpresasFarmacias());
            $scope.root.empresasOrigen = [angular.copy(Usuario.getUsuarioActual().getEmpresa())];
            //handler slide
            $scope.root.mostrarSeleccionProductoCompleto;
                        
            $scope.root.pedido = PedidoFarmacia.get();
            
            
            $scope.root.lista_productos = {
                data: 'root.pedido.getProductosSeleccionados()',
                enableColumnResize: true,
                enableRowSelection: false,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "9%",
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                    <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                    <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                    <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                    <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                    <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                    <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                                </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                    {field: 'getCantidadSolicitada()', displayName: 'Solicitado'},
                    {field: 'getCantidadPendiente()', displayName: 'Pendiente'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "5%",
                            cellTemplate: ' <div class="row">\
                                                <button class="btn btn-default btn-xs" ng-click="onEliminarProducto(row.entity, row.rowIndex)">\
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
                $scope.seleccionarEmpresaPedido(false, data.empresa_destino, data.centro_destino, data.bogega_destino);
                $scope.seleccionarEmpresaPedido(true, data.farmacia_id, data.centro_utilidad, data.bodega);
                $scope.root.pedido.setEsTemporal(true).setValido(true).setDescripcion(data.observacion);
                console.log("es temporal ", $scope.root.pedido.getEsTemporal())
            };
            
            
            /*
             * @Author: Eduar
             * @param {Object} data
             * +Descripcion: Permite hacer render en los dropdown de las empreas destino y origen
             */
            $scope.renderDetalle = function(data){
                var _productos = data.obj.listado_productos;
                
                for (var i in _productos) {
                    var _producto = _productos[i];
                    var producto = ProductoPedidoFarmacia.get(_producto.codigo_producto, _producto.descripcion).
                            setCantidadPendiente(_producto.cantidad_pendiente).
                            setTipoProductoId(_producto.tipo_producto_id).
                            setCantidadSolicitada(_producto.cantidad_solicitada);

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
                
                var empresa = $scope.obtenerEmpresa(esDestino, empresaId, centroUtilidad);
                var centro  = $scope.obtenerCentroUtilidad(esDestino, empresaId, centroUtilidad);
                var bodega  = $scope.obtenerBodega(esDestino, empresaId, centroUtilidad, bodega);
                
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
               
                var centro = $scope.obtenerCentroUtilidad(esDestino, empresaId, centroId);
                var bodegas  = centro.getBodegas();
                for(var i in bodegas){
                    var bodega = bodegas[i];
                    if(bodega.getCodigo() === bodegaId ){
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
             * +Descripcion: Handler del boton de finalizar
             */
            $scope.onIncluirProductos = function(event) {
                $scope.slideurl = "views/generacionpedidos/pedidosfarmacias/seleccionproducto.html?time=" + new Date().getTime();
                $scope.$emit('mostrarSeleccionProducto');
                
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
             * @param {ProductoPedidoFarmacia} producto
             * @param {int} index
             * +Descripcion: Funcion que emite el evento para eliminar un producto
             */
            self.onConfirmarEliminarProducto = function(producto, index){
                if($scope.root.pedido.getEsTemporal()){
                    $scope.$broadcast('onEliminarProductoTemporal', producto, index);
                }
            };
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton de finalizar
             */
            $scope.onVolverListadoPedidos = function(){
                $state.go("ListarPedidosFarmacias");
            };
            
           $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.root.mostrarSeleccionProductoCompleto();
                $scope.$$watchers = null;
                $scope.root = {};
                console.log("eliminando base");

            });

            
            /*that.pedido = PedidoVenta.get();

            $scope.rootCreaPedidoFarmacia = {};
            
            $scope.rootCreaPedidoFarmacia.Empresa = EmpresaPedido;

            $scope.rootCreaPedidoFarmacia.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootCreaPedidoFarmacia.paginas = 0;
            $scope.rootCreaPedidoFarmacia.items = 0;
            $scope.rootCreaPedidoFarmacia.termino_busqueda = "";
            $scope.rootCreaPedidoFarmacia.ultima_busqueda = "";
            $scope.rootCreaPedidoFarmacia.paginaactual = 1;

            $scope.rootCreaPedidoFarmacia.bloquear_tab = true; 
            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;

            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;

            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = true;
            
            //Variable para control de Modificación Especial
            //$scope.rootCreaPedidoFarmacia.modificacion_especial = true;
            $scope.rootCreaPedidoFarmacia.invalidos_mod_especial = 0;
            $scope.rootCreaPedidoFarmacia.incluir_mod_especial = true;

            $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = false;

            $scope.rootCreaPedidoFarmacia.tab_estados = {tab1: true, tab2: false};

            $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = 0;
            $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = 0;
            $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = 0;
            $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = "0,";
            
            $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux = "0,";
            
            $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_anterior = '0';
            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_anterior = '0';

            $scope.rootCreaPedidoFarmacia.de_lista_empresas = [];
            $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad = [];
            $scope.rootCreaPedidoFarmacia.de_lista_bodegas = [];
            $scope.rootCreaPedidoFarmacia.para_lista_empresas = [];
            $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
            $scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];

            $scope.rootCreaPedidoFarmacia.titulo_tab_1= "";
            $scope.rootCreaPedidoFarmacia.titulo_tab_2= "";
            $scope.rootCreaPedidoFarmacia.observacion = "";
            

           
           //$scope.rootCreaPedidoFarmacia.empresasDestino = Usuario.getUsuarioActual().getEmpresa().getCentrosUtilidad();
           $scope.rootCreaPedidoFarmacia.empresasDestino = Usuario.getUsuarioActual().getEmpresasFarmacias();
           
           $scope.rootCreaPedidoFarmacia.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
           
           $scope.rootCreaPedidoFarmacia.opcionesModulo = {
                btnGuardarTemporal: {
                    'click': $scope.rootCreaPedidoFarmacia.opciones.sw_generar_pedido
                },
                btnGenerarPedido: {
                    'click': $scope.rootCreaPedidoFarmacia.opciones.sw_generar_pedido
                },
                btnCargarPlano: {
                    'click': $scope.rootCreaPedidoFarmacia.opciones.sw_cargar_plano
                }        
            };
            
            $scope.rootCreaPedidoFarmacia.pedido = {numero_pedido: ""};
            

            //Inicio - Creación de Pedido y Empresa Vacia
            if($scope.rootCreaPedidoFarmacia.Empresa.pedidosFarmacias.length === 0){
                var datos_pedido = {
                            numero_pedido: "",
                            fecha_registro: "",
                            descripcion_estado_actual_pedido: "",
                            estado_actual_pedido: "",
                            estado_separacion: ""
                        };

                that.pedido.setDatos(datos_pedido);
                that.pedido.setTipo(2);
                that.pedido.setObservacion("");
                //that.pedido.setEnUso(0);

                var farmacia = FarmaciaVenta.get();

                that.pedido.setFarmacia(farmacia);

                $scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(that.pedido);
            }
            //Fin - Creación de Pedido y Empresa Vacia



            that.consultarEmpresasDe = function(callback) {

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                       //$scope.rootCreaPedidoFarmacia.de_lista_empresas = data.obj.empresas;
                        $scope.rootCreaPedidoFarmacia.de_lista_empresas = [];
                        for(var i in data.obj.empresas){
                            if(data.obj.empresas[i].empresa_id === Usuario.getUsuarioActual().getEmpresa().getCodigo()){
                                $scope.rootCreaPedidoFarmacia.de_lista_empresas.push(data.obj.empresas[i]);
                                break;
                            }
                        }
                                                
                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });

            };

            that.consultarCentrosUtilidadDe = function(empresa_id, callback) {
                
                if(empresa_id !== undefined && empresa_id !== ""){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = empresa_id;
                }

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        centro_utilidad: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CENTROS_UTILIDAD_EMPRESAS_GRUPO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad = data.obj.centros_utilidad;

                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });
            };

            that.consultarBodegaDe = function(empresa_id, centro_utilidad_id, callback) {
                
                if(empresa_id !== undefined && empresa_id !== ""){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = empresa_id;
                }
                
                if(centro_utilidad_id !== undefined && centro_utilidad_id !== ""){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = centro_utilidad_id;
                }

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        bodegas: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.BODEGAS_EMPRESAS_GRUPO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_bodegas = data.obj.bodegas;

                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });
            };


            that.consultarEmpresasPara = function(callback) {
                
                $scope.rootCreaPedidoFarmacia.para_lista_empresas = [];
                
                var para_lista_empresas = [];
                
                $scope.rootCreaPedidoFarmacia.empresasDestino.forEach(function(obj){

                    obj_empresa = {
                        empresa_id: obj.codigo,
                        nombre_empresa: obj.nombre
                    };
                    
                    para_lista_empresas.push(obj_empresa);
                    

                    
                });
                
                $scope.rootCreaPedidoFarmacia.para_lista_empresas = para_lista_empresas;
                
                if(callback !== undefined && callback !== ""){
                    callback();
                }
                

            };

            that.consultarCentrosUtilidadPara = function(empresa_id, callback) {
                
                var para_seleccion_empresa = "";
                
                var para_lista_centro_utilidad = [];
                $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
                //$scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
                //$scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];
                
                if(empresa_id !== undefined && empresa_id !== ""){
                    para_seleccion_empresa = empresa_id;
                }
                else{
                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
                        para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux.split(',')[0];
                    }
                    else {
                        para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',')[0];
                        //console.log("para_seleccion_empresa in function: ", para_seleccion_empresa);
                    }
                }
                    
                $scope.rootCreaPedidoFarmacia.empresasDestino.forEach(function(obj){
                    
                    if(para_seleccion_empresa === obj.codigo) {
                        
                        //Recorrer la lista de Centros de Utilidad
                        obj.centrosUtilidad.forEach(function(centro){
                            
                            obj_centro_utilidad = {
                                centro_utilidad_id: centro.codigo,
                                nombre_centro_utilidad: centro.nombre
                            };                            
                            
                            para_lista_centro_utilidad.push(obj_centro_utilidad);
                            
                        });

                        
                    }
                    
                });
                
                $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = para_lista_centro_utilidad;
                
                if(callback !== undefined && callback !== ""){
                    callback();
                }

            };
            
            that.consultarBodegaPara = function(empresa_id, centro_utilidad_id, callback) {
                
                var para_seleccion_empresa = "";
                var para_seleccion_centro_utilidad = "";
                
                var para_lista_bodegas = [];
                $scope.rootCreaPedidoFarmacia.para_lista_bodegas  = [];
                
                if(empresa_id !== undefined && empresa_id !== ""){
                    para_seleccion_empresa = empresa_id;
                } else {
                    
                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
                        para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux.split(',')[0];
                    }
                    else {
                        para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',')[0];
                    }
                }
                
                if(centro_utilidad_id !== undefined && centro_utilidad_id !== ""){
                    para_seleccion_centro_utilidad = centro_utilidad_id;
                }
                else{
                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
                        para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux.split(',')[0];
                    }
                    else {
                        para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',')[0];
                    }
                }
                
                
                $scope.rootCreaPedidoFarmacia.empresasDestino.forEach(function(obj){
                    
                    if(para_seleccion_empresa === obj.codigo) {
                        
                        obj.centrosUtilidad.forEach(function(centro){
                            
                            if(para_seleccion_centro_utilidad === centro.codigo) {
                                
                                centro.bodegas.forEach(function(bodega){
                                    
                                    obj_bodega = {
                                        bodega_id: bodega.codigo,
                                        nombre_bodega: bodega.nombre
                                    };
                                    
                                    para_lista_bodegas.push(obj_bodega);
                                    
                                });
                            }
                            
                        });
                        

                    }
                    
                });
                                
                $scope.rootCreaPedidoFarmacia.para_lista_bodegas = para_lista_bodegas;
                
                
                if(callback !== undefined && callback !== ""){
                    callback();
                }

            };


            $scope.$on('cargarGridPrincipal', function(event, valor) {

                if ($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length > 0) {
                    $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                    $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                }
                else {
                    $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
                    $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                }

                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                        && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0] !== '0'
                        && $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0] !== '0' && $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0] !== '0'
                        && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0) {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                }
                else {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                }

            });

            that.buscarPedido = function(termino, paginando) {

                console.log("Visualizacion Empresas Destino: >>>>>>>>>>>>>>>>>>>>>>> ", $scope.rootCreaPedidoFarmacia.empresasDestino);

                //valida si cambio el termino de busqueda
                if ($scope.rootCreaPedidoFarmacia.ultima_busqueda !== $scope.rootCreaPedidoFarmacia.termino_busqueda) {
                    $scope.rootCreaPedidoFarmacia.paginaactual = 1;
                }

                if (PedidoVenta.pedidoseleccionado !== "") {
                    
//                    console.log("Singleton Empresa: ", $scope.rootCreaPedidoFarmacia.Empresa);

                    //console.log(">>>>>>>>>>>>>>>>> ESTADO ACTUAL DEL PEDIDO: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    console.log(">>> CASO 1");
                    //Información Cargada desde Listado de Pedidos
                    
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Detalle Pedido";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;

                    $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = PedidoVenta.pedidoseleccionado;

                    localStorageService.set("pedidoseleccionado", PedidoVenta.pedidoseleccionado);
                    
                    that.cargarInformacionPedido();

                }
                else if (localStorageService.get("pedidoseleccionado")) {
                    
                    
                    //console.log(">>>>>>>>>>>>>>>>> ESTADO ACTUAL DEL PEDIDO: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    console.log(">>> CASO 2");
                    //Información Cargada desde la Recarga del Pedido
                    
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Detalle Pedido";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;
                    
                    if (localStorageService.get("pedidoseleccionado").length > 0) {
                        $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = localStorageService.get("pedidoseleccionado");
                    }
                    
                    that.recargarInformacionPedido();
                }
                else if (PedidoVenta.pedidoseleccionado === "" && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id !==0
                            && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id !== ""){
                        
                    console.log(">>> CASO 3");
                    //Información Cargada desde Listado Pedidos Temporales
                        
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Incluir Producto Manual";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "Cargar Archivo Plano";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = false;
                    
                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = $scope.rootCreaPedidoFarmacia.Empresa.getCodigo();
                    $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = '1 ';
                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = '03';
                    
                    var para_farmacia_id = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id;
                    var nombre_farmacia = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_farmacia;
                    var para_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id;
                    var nombre_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_centro_utilidad;
                    var para_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.bodega_id;
                    var nombre_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_bodega;                    
                    

                    that.consultarEmpresasDe(function(){

                        var de_empresa_id = $scope.rootCreaPedidoFarmacia.Empresa.getCodigo();

                        that.consultarCentrosUtilidadDe(de_empresa_id, function(){

                            that.consultarBodegaDe(de_empresa_id, '1 ', function(){

                                that.consultarEmpresasPara(function(){
                                    
                                    $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = para_farmacia_id+","+nombre_farmacia;

                                    that.consultarCentrosUtilidadPara(para_farmacia_id, function(){

                                        $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = para_centro_utilidad+","+nombre_centro_utilidad;

                                        that.consultarBodegaPara(para_farmacia_id, para_centro_utilidad, function(){
                                            
                                            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = para_bodega+","+nombre_bodega;
                                            
                                            that.consultarEncabezadoPedidoTemporal(function(consulta_encabezado_exitosa){

                                                if(consulta_encabezado_exitosa){
                                                    
                                                    
                                                    var array_farmacia = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",");
                                                    var array_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",");
                                                    var array_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",");
                                                    
                                                    that.consultarDetallePedidoTemporal(array_farmacia, array_centro_utilidad, array_bodega, function(){
                                                    
                                                        if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                                                            && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_farmacia_id !== 0
                                                            && para_centro_utilidad !== 0 && para_bodega !== 0
                                                            && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
                                                        {

                                                            $scope.rootCreaPedidoFarmacia.bloquear_tab = false;
                                                            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = false;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;

                                                        }
                                                        else{
                                                            $scope.rootCreaPedidoFarmacia.bloquear_tab = false;
                                                            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = false;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                                                        }


                                                    });
                                                }

                                            });
                                            
                                        });
                                    });
                                });

                            });

                        });
                    });


                }
                else {
                    
                    console.log(">>>>>>>>>>>>>>>>> ESTADO ACTUAL DEL PEDIDO: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Incluir Producto Manual";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "Cargar Archivo Plano";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = false;
                    
                    that.consultarEmpresasDe();
                    that.consultarEmpresasPara();
                    
                }

            };
            
            that.cargarInformacionPedido = function(){

                var para_farmacia_id = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id;
                var para_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id;;
                var para_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.bodega_id;
                
                var nombre_farmacia = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_farmacia;
                var nombre_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_centro_utilidad;
                var nombre_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_bodega;
                
                var de_empresa_id = $scope.rootCreaPedidoFarmacia.Empresa.getCodigo();

                $scope.rootCreaPedidoFarmacia.observacion = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().observacion;

                that.consultarEmpresasDe(function(){

                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = de_empresa_id;

                    that.consultarCentrosUtilidadDe(de_empresa_id, function(){

                        $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = '1 ';

                        that.consultarBodegaDe(de_empresa_id, '1 ', function(){

                            $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = '03';

                            that.consultarEmpresasPara(function(){

                                if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
                                    $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux = para_farmacia_id+","+nombre_farmacia;
                                    $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = para_farmacia_id+","+nombre_farmacia;
                                }
                                else {
                                    $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = para_farmacia_id+","+nombre_farmacia;
                                }

                                that.consultarCentrosUtilidadPara(para_farmacia_id, function(){
                                    
                                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
                                        $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux = para_centro_utilidad+","+nombre_centro_utilidad;
                                        $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                                        $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = para_centro_utilidad+","+nombre_centro_utilidad;
                                    }
                                    else {
                                        $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = para_centro_utilidad+","+nombre_centro_utilidad;
                                    }

                                    that.consultarBodegaPara(para_farmacia_id, para_centro_utilidad, function(){
                                        
                                        if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
                                            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux = para_bodega+","+nombre_bodega;
                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                                            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = para_bodega+","+nombre_bodega;
                                        }
                                        else {
                                            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = para_bodega+","+nombre_bodega;
                                        }
   
                                        
//                                        angular.copy($scope.rootCreaPedidoFarmacia.para_seleccion_empresa,$scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux);
//                                        angular.copy($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad,$scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux);
//                                        angular.copy($scope.rootCreaPedidoFarmacia.para_seleccion_bodega,$scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux);
                                    });
                                });
                            });

                        });

                    });
                });


                $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;
                $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;

                $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;



                var obj_detalle = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CONSULTAR_DETALLE_PEDIDO_FARMACIA, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {

                        //crear detalle en el objeto
                        
                        console.log(">>>>>>>>>>>>>>>>> DATA DETALLE PEDIDO: ", data);
                        
                        data.obj.detalle_pedido.forEach(function(registro){

                            var producto = ProductoPedido.get(
                                                registro.codigo_producto,        //codigo_producto
                                                registro.descripcion,            //descripcion
                                                0,                               //existencia **hasta aquí heredado
                                                0,                               //precio
                                                registro.cantidad_solicitada,    //cantidad_solicitada
                                                0,                               //cantidad_separada
                                                "",                              //observacion
                                                "",                              //disponible
                                                "",                              //molecula
                                                "",                              //existencia_farmacia
                                                registro.tipo_producto_id,          //tipo_producto_id
                                                "",                              //total_existencias_farmacia
                                                "",                              //existencia_disponible
                                                (registro.cantidad_pendiente <= 0) ? '0' : registro.cantidad_pendiente      //cantidad_pendiente --(registro.cantidad_pendiente <= 0) ? 0 : registro.cantidad_pendiente -- registro.cantidad_pendiente
                                            );
                                                
                            //En éste punto setear valor que indica si el producto se encuentra en la farmacia destino (sólo cuando se hace modificación especial de la misma)
                            //Este código tal vez no deba ir aquí. Debe ir en la función de validación de la selección de farmacia, centro_utilidad y bodega
//                            if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
//                                
//                                that.consultarProductoEnFarmacia(para_farmacia_id, para_centro_utilidad, para_bodega, registro.codigo_producto, function(existe){
//                                    if(existe)
//                                        producto.setEnFarmacia(true);
//                                });
//                                
//                            }
//                            if( $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()
//                                && $scope.rootCreaPedidoFarmacia.invalidos_mod_especial === 0) {
//                                $scope.rootCreaPedidoFarmacia.incluir_mod_especial = true;
//                            }
                                                
                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                                                
                        });
                    }
                    else{

                    }
                });
            };            
            
            
            that.consultarEncabezadoPedidoFinal = function(numero_pedido, callback){
                
                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA;
                
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if(data.status === 200) {
                        
                        console.log("Consulta exitosa: ", data.msj);
                        
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(data);
                        }
                    }
                    else{
                        console.log("Error en la consulta: ", data.msj);
                    }
                });
            };
            
            //Función para recargar todos los datos del pedido si se hace 'reload'
            that.recargarInformacionPedido = function(){
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.pedido.numero_pedido;

                that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){

                        console.log("Consulta exitosa: ", data);

                        //Variables para creación de Farmacia más adelante
                        var para_farmacia_id = data.obj.encabezado_pedido[0].farmacia_id;
                        var para_centro_utilidad = data.obj.encabezado_pedido[0].centro_utilidad;
                        var para_bodega = data.obj.encabezado_pedido[0].bodega;
                        var de_empresa_id = data.obj.encabezado_pedido[0].empresa_destino;
                        var de_centro = data.obj.encabezado_pedido[0].centro_destino;
                        var de_bodega = data.obj.encabezado_pedido[0].bodega_destino;
                        
                        //Crea empresa - setCodigo
                        $scope.rootCreaPedidoFarmacia.Empresa.setCodigo(de_empresa_id);
                        
                        console.log("empresa destino >>>>>>>>>>>> ", de_empresa_id);
                        
                        var pedido = PedidoVenta.get();
                        
                        var datos_pedido = {
                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                            fecha_registro: data.obj.encabezado_pedido[0].fecha_registro,
                            descripcion_estado_actual_pedido: "",
                            estado_actual_pedido: data.obj.encabezado_pedido[0].estado,
                            estado_separacion: ""
                        };

                        pedido.setDatos(datos_pedido);
                        pedido.setTipo(2);
                        pedido.setObservacion(data.obj.encabezado_pedido[0].observacion);
                        //pedido.setEnUso(data.obj.encabezado_pedido[0].en_uso);

                        $scope.rootCreaPedidoFarmacia.observacion = data.obj.encabezado_pedido[0].observacion;
                        that.consultarEmpresasDe(function(){
                            $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = de_empresa_id;

                            that.consultarCentrosUtilidadDe(de_empresa_id, function(){

                                $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = de_centro;

                                that.consultarBodegaDe(de_empresa_id, de_centro, function(){

                                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = de_bodega;

                                    that.consultarEmpresasPara(function(){

                                        var nombre_empresa = "";

                                        $scope.rootCreaPedidoFarmacia.para_lista_empresas.forEach(function(empresa){
                                            if(empresa.empresa_id === para_farmacia_id){
                                                nombre_empresa = empresa.nombre_empresa;
                                            }
                                        });

                                        $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = para_farmacia_id+","+nombre_empresa;

                                        that.consultarCentrosUtilidadPara(para_farmacia_id, function(){

                                            var nombre_centro_utilidad = "";

                                            $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad.forEach(function(centro_utilidad){
                                                if(centro_utilidad.centro_utilidad_id === para_centro_utilidad){
                                                    nombre_centro_utilidad = centro_utilidad.nombre_centro_utilidad;
                                                }
                                            });

                                            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = para_centro_utilidad+","+nombre_centro_utilidad;

                                            that.consultarBodegaPara(para_farmacia_id, para_centro_utilidad, function(){

                                                var nombre_bodega = "";

                                                $scope.rootCreaPedidoFarmacia.para_lista_bodegas.forEach(function(bodega){
                                                    if(bodega.bodega_id === para_bodega){
                                                        nombre_bodega = bodega.nombre_bodega;
                                                    }
                                                });

                                                $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = para_bodega+","+nombre_bodega;
                                                
                                                //Creación objeto farmacia
                                                var farmacia = FarmaciaVenta.get(
                                                        para_farmacia_id,
                                                        para_bodega,
                                                        nombre_empresa,
                                                        nombre_bodega,
                                                        para_centro_utilidad,
                                                        nombre_centro_utilidad
                                                );

                                                pedido.setFarmacia(farmacia);
                                                
                                                $scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(pedido);
                                                

                                                var obj_detalle = {
                                                    session: $scope.rootCreaPedidoFarmacia.session,
                                                    data: {
                                                        pedidos_farmacias: {
                                                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                                                        }
                                                    }
                                                };

                                                Request.realizarRequest(API.PEDIDOS.CONSULTAR_DETALLE_PEDIDO_FARMACIA, "POST", obj_detalle, function(data) {

                                                    if (data.status === 200) {

                                                        data.obj.detalle_pedido.forEach(function(registro){

                                                            var producto = ProductoPedido.get(
                                                                            registro.codigo_producto,        //codigo_producto
                                                                            registro.descripcion,            //descripcion
                                                                            0,                               //existencia **hasta aquí heredado
                                                                            0,                               //precio
                                                                            registro.cantidad_solicitada,    //cantidad_solicitada
                                                                            0,                               //cantidad_separada
                                                                            "",                              //observacion
                                                                            "",                              //disponible
                                                                            "",                              //molecula
                                                                            "",                              //existencia_farmacia
                                                                            registro.tipo_producto_id,       //tipo_producto_id
                                                                            "",                              //total_existencias_farmacia
                                                                            "",                              //existencia_disponible
                                                                            (registro.cantidad_pendiente <= 0) ? '0' : registro.cantidad_pendiente      //cantidad_pendiente
                                                                        );

                                                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                                                        });
                                                    }
                                                    else{
                                                        console.log("Error en la consulta del detalle: ", data.msj);
                                                    }
                                                });

                                            });
                                        });
                                    });

                                });


                            });
                        });

                        $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;
                        $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                        $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;

                        $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                        $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;

                        

//                    }
//                    else {
//                        console.log("Error en la consulta: ", data.msj);
//                    }

                });

                 
            };
            

            //Grid para pedidos ya generados
            $scope.rootCreaPedidoFarmacia.detalle_pedido_generado = {
                data: 'rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: false,
                enableHighlighting: true,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "9%"},
                    {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente'},
                    {field: 'nueva_cantidad', displayName: 'Modificar Cantidad', width: "10%",
                                cellTemplate: ' <div class="col-xs-12">\n\
                                                    <input type="text" ng-model="row.entity.nueva_cantidad" validacion-numero-entero class="form-control grid-inline-input"'+
                                                    'ng-keyup="onTeclaModificarCantidad($event, row)" ng-model="row.entity.cantidad_ingresada" ng-disabled="!rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()" />\n\
                                                </div>'
                    },
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "13%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onModificarCantidad(row)" ng-disabled="row.entity.nueva_cantidad<=0 || row.entity.nueva_cantidad==null || !expreg.test(row.entity.nueva_cantidad) || rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido !=0 || !rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()">\n\
                                                <span class="glyphicon glyphicon-pencil">Modificar</span>\n\
                                            </button>\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarProducto(row)" ng-disabled="rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido !=0 || !rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()">\n\
                                                <span class="glyphicon glyphicon-remove">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]
            };
            
            //rootCreaPedidoFarmacia.detalle_pedido_modificable
            $scope.rootCreaPedidoFarmacia.detalle_pedido_modificable = {
                data: 'rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: false,
                enableHighlighting: true,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "9%",
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                            <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                            <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                            <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                            <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                            <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta pull-right" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "37%",
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'cantidad_solicitada', displayName: 'Solicitado',
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta pull-right" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'cantidad_pendiente', displayName: 'Pendiente',
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta pull-right" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'nueva_cantidad', displayName: 'Modificar Cantidad', width: "10%",
                                cellTemplate: ' <div class="col-xs-12">\n\
                                                    <input type="text" ng-model="row.entity.nueva_cantidad" validacion-numero-entero class="form-control grid-inline-input"'+
                                                    'ng-keyup="onTeclaModificarCantidad($event, row)" ng-model="row.entity.cantidad_ingresada" ng-disabled="!rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()" />\n\
                                                </div>'
                    },
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "13%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onModificarCantidad(row)" ng-disabled="row.entity.nueva_cantidad<=0 || row.entity.nueva_cantidad==null || !expreg.test(row.entity.nueva_cantidad) || rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido !=0 || !rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()">\n\
                                                <span class="glyphicon glyphicon-pencil">Modificar</span>\n\
                                            </button>\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarProducto(row)" ng-disabled="rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido !=0 || !rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()">\n\
                                                <span class="glyphicon glyphicon-remove">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]
            };
            //Grid Pedidos Farmacias
//            $scope.rootCreaPedidoFarmacia.lista_productos = {
//                data: 'rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
//                enableColumnResize: true,
//                enableRowSelection: false,
//                multiSelect: false,
//                columnDefs: [
//                    {field: 'codigo_producto', displayName: 'Código', width: "9%",
//                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
//                                            <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
//                                            <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
//                                            <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
//                                            <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
//                                            <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
//                                            <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
//                                        </div>'
//                    },
//                    {field: 'descripcion', displayName: 'Descripción', width: "37%"},
//                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
//                    {field: 'cantidad_pendiente', displayName: 'Pendiente'}
//                ]
//            };
            
            $scope.onTeclaModificarCantidad = function(ev, row) {
//                console.log("Key Evento: ", ev.which);
                if (ev.which === 13) {
                    if (parseInt(row.entity.nueva_cantidad) > 0) {
                        $scope.onModificarCantidad(row);
                    }
                }
            };
            
            
            $scope.onModificarCantidad = function(row){
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido;
                
                that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){

                    //$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().setEnUso(data.obj.encabezado_pedido[0].en_uso);
                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
                    //console.log(">>>> Modificar - Estado del Pedido: ", data.obj.encabezado_pedido[0].estado);
                    //console.log(">>>> Scope Modificar - Estado del Pedido: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){
                    
                        if(row.entity.nueva_cantidad >= row.entity.cantidad_solicitada){

                            var template = ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Mensaje del Sistema</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <h4>La Nueva Cantidad debe ser Menor a la Actual ! </h4> \
                                            </div>\
                                            <div class="modal-footer">\
                                                <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                            </div>';

                            controller = function($scope, $modalInstance) {

                                $scope.close = function() {
                                    $modalInstance.close();
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


                        }
                        else{

                                var template = ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <h4>Seguro desea bajar la cantidad de '+row.entity.cantidad_solicitada+' a '+row.entity.nueva_cantidad+' ? </h4> \
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                                    <button class="btn btn-primary" ng-click="modificarCantidad()" ng-disabled="" >Si</button>\
                                                </div>';

                            controller = function($scope, $modalInstance) {

                                $scope.modificarCantidad = function() {
                                    //that.verificarEstadoPedido(function(){

                                        that.modificarValoresCantidad(
                                            $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                                            row.entity
                                        );
                                    //}    
                                    //);

                                    $modalInstance.close();
                                };

                                $scope.close = function() {
                                    $modalInstance.close();
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
                        }
                    }
                    else{
                        //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Aviso: </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
                                            </div>\
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
                    }
                });
            };
            
            that.verificarEstadoPedido = function(callback){
                
                obj_verificar = {
                    session:$scope.rootCreaPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            termino_busqueda: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            pagina_actual: $scope.rootCreaPedidoFarmacia.paginaactual,
                            filtro:{}
                        }
                    }
                };
                
                console.log("Número Pedido:", $scope.rootCreaPedidoFarmacia.pedido.numero_pedido);
                console.log("Empresa ID:", $scope.rootCreaPedidoFarmacia.para_seleccion_empresa);
                console.log("Página Actual:", $scope.rootCreaPedidoFarmacia.paginaactual);
                
                var url = API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj_verificar, function(data) {

                    if(data.status === 200) {

                       if((data.obj.pedidos_farmacias[0].estado_actual_pedido !== '0' )|| data.obj.pedidos_farmacias[0].estado_separacion !== null){
                           //No se debe hacer Modificación
                           
                            var template = '<div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Mensaje del Sistema</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <!--<h4>El pedido se encuentra en estado de separación y ya no puede modificarse !!</h4>--> \
                                                <h4>El pedido ha sido asignado y/o está siendo separado. Ya no puede modificarse !!</h4>\
                                            </div>\
                                            <div class="modal-footer">\
                                                <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                            </div>';

                            controller = function($scope, $modalInstance) {

                                $scope.close = function() {
                                    $modalInstance.close();
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

                       }
                       else{
                           // Se puede hacer modificación o eliminación
                           if(callback !== undefined && callback !== ""){
                               callback();
                           }
                       }
                    }
                    else{
                        console.log("No se pudo realizar la consulta", data.msj);
                    }

                });

            };
            
            that.modificarValoresCantidad = function(numero_pedido, data){
                
                var solicitado_inicial = data.cantidad_solicitada;
                var pendiente_inicial = data.cantidad_pendiente;
                
                var diferencia_cantidad = 0;
                var nuevo_pendiente = 0;

                diferencia_cantidad = data.cantidad_solicitada - data.nueva_cantidad;

                data.cantidad_solicitada = data.nueva_cantidad;
                
                data.nueva_cantidad = "";

                nuevo_pendiente = data.cantidad_pendiente - diferencia_cantidad;

                if(nuevo_pendiente >= 0){
                    data.cantidad_pendiente = nuevo_pendiente;
                }
                else{
                    data.cantidad_pendiente = 0;
                }

                
                obj_modificar = {
                    session:$scope.rootCreaPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            numero_pedido: parseInt(numero_pedido),
                            codigo_producto: data.codigo_producto,
                            cantidad_solicitada: parseInt(data.cantidad_solicitada),
                            cantidad_pendiente: parseInt(data.cantidad_pendiente)
                        }
                    }
                };
                
                var url = API.PEDIDOS.ACTUALIZAR_CANTIDADES_DETALLE_PEDIDO_FARMACIA;
                
                Request.realizarRequest(url, "POST", obj_modificar, function(data) {

                    if(data.status === 200) {
                        console.log("Actualización Exitosa: ", data.msj);
                    }
                    else {
                        console.log("Actualización Falló: ", data.msj);
                        data.cantidad_solicitada = solicitado_inicial;
                        data.cantidad_pendiente = pendiente_inicial;
                    }
                }            };
            
            $scope.onEliminarProducto = function(row){
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido;
                
                that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){

                    //$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().setEnUso(data.obj.encabezado_pedido[0].en_uso);
                    
                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
                    
                    //console.log(">>>>>> Eliminar - Estado del Pedido: ", data.obj.encabezado_pedido[0].estado);

                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){ 
                
                        var template = '<div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Mensaje del Sistema</h4>\
                                        </div>\
                                        <div class="modal-body">\
                                            <h4>Seguro desea eliminar el producto '+row.entity.codigo_producto+' ? </h4> \
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-warning" ng-click="close()">No</button>\
                                            <button class="btn btn-primary" ng-click="eliminarProducto()" ng-disabled="" >Si</button>\
                                        </div>';

                        controller = function($scope, $modalInstance) {

                            $scope.eliminarProducto = function() {
                                //that.verificarEstadoPedido(function(){

                                    that.eliminarProductoPedido(
                                        $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                                        row.entity,
                                        row.rowIndex
                                    );
                                //}    
                                //);

                                $modalInstance.close();
                            };

                            $scope.close = function() {
                                $modalInstance.close();
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
                    }
                    else{
                        //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Aviso: </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
                                            </div>\
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
                    }
                });
            };
            
            that.eliminarProductoPedido = function(numero_pedido, data, index){
                
                if ($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().obtenerProductos().length === 1) {

                    //--$scope.rootSeleccionProductoFarmacia.bloquear_eliminar = true;
                    //Mensaje: Solo queda un producto. La cotización debe tener al menos un producto. No puede eliminar éste.
                    var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>Solo queda un producto en el detalle y debe haber al menos uno. <br>No puede eliminar más productos. </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                    </div>';

                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
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
                }
                else {
                    obj_eliminar = {
                        session:$scope.rootCreaPedidoFarmacia.session,
                        data:{
                            pedidos_farmacias:{
                                numero_pedido: parseInt(numero_pedido),
                                codigo_producto: data.codigo_producto
                            }
                        }
                    };

                    var url = API.PEDIDOS.ELIMINAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA;

                    Request.realizarRequest(url, "POST", obj_eliminar, function(data) {

                        if(data.status === 200) {
                            console.log("Eliminación Exitosa: ", data.msj);

                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().eliminarProducto(index);
                        }
                        else {
                            console.log("Eliminación Falló: ", data.msj);
                        }
                    });

                }
            };            

            //Grid Pedidos Farmacias
            $scope.rootCreaPedidoFarmacia.lista_productos = {
                data: 'rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "9%",
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                    <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                                    <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                                    <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                                    <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                                    <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                                    <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                                </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente'}
                ]
            };



            $scope.onIncluirProductosEspecial = function(tipo_cliente) {
                
                //console.log(">> Empresa Objeto: ", $scope.rootCreaPedidoFarmacia.Empresa);
                
                $scope.slideurl = "views/generarpedidos/seleccionproductofarmacia.html?time=" + new Date().getTime();
                


                var datos_de = {
                    empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                    bodega_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega
                };

//                var datos_para = {
//                    empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux.split(",")[0],
//                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux.split(",")[0],
//                    bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux.split(",")[0]
//                };

//                var observacion = $scope.rootCreaPedidoFarmacia.observacion;
//                
//                var datos_pedido = {
//                        numero_pedido: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().get_numero_pedido(),
//                        fecha_registro: "",
//                        descripcion_estado_actual_pedido: "",
//                        estado_actual_pedido: "",
//                        estado_separacion: ""
//                    };

//                that.pedido.setDatos(datos_pedido);
//                that.pedido.setTipo(2);
//                that.pedido.setObservacion($scope.rootCreaPedidoFarmacia.observacion);
                
                //Creación objeto farmacia
//                var farmacia = FarmaciaVenta.get(
//                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux.split(",")[0]),
//                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux.split(",")[0]),
//                        $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux.split(",")[1],
//                        $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux.split(",")[1],
//                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux.split(",")[0]),
//                        $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux.split(",")[1]
//                );
//
//                that.pedido.setFarmacia(farmacia);

                //$scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(that.pedido);

                $scope.$emit('mostrarseleccionproductoEspecial', tipo_cliente, datos_de, $scope.rootCreaPedidoFarmacia.Empresa);

            };            
            
            
            that.consultarEncabezadoPedidoTemporal = function(callback){
                
                var obj_encabezado = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                        }
                    }
                };
                
                console.log("Objeto Consulta Encabezado: ",obj_encabezado);

                var url_consultar_encabezado = API.PEDIDOS.CONSULTAR_ENCABEZADO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_consultar_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {                
                        
                        console.log("La consulta del encabezado fue exitosa: ", data.msj);
                        console.log("Consulta Encabezado: ", data);
                        

                        var datos_pedido = {
                            numero_pedido: "",
                            fecha_registro: "",
                            descripcion_estado_actual_pedido: "",
                            estado_actual_pedido: "",
                            estado_separacion: ""
                        };

                        that.pedido.setDatos(datos_pedido);
                        that.pedido.setTipo(2);

                        if(data.obj.encabezado_pedido.length > 0){
                            that.pedido.setObservacion(data.obj.encabezado_pedido[0].observacion); //Falta consulta de pedido
                            $scope.rootCreaPedidoFarmacia.observacion = that.pedido.getObservacion();
                        }

                        //Creación objeto farmacia
                        var farmacia = FarmaciaVenta.get(
                                parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0]),
                                parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]),
                                $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[1],
                                $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[1],
                                parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0]),
                                $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[1]
                        );

                        that.pedido.setFarmacia(farmacia);

                        $scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(that.pedido);

                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(true);
                        }
                    }
                    else{
                        console.log("La consulta del encabezado falló: ", data.msj);
                        
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(false);
                        }
                    }
                });
            };
            
            that.consultarDetallePedidoTemporal = function(para_seleccion_empresa, para_seleccion_centro_utilidad, para_seleccion_bodega, callback){

                var obj_detalle = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: para_seleccion_empresa[0],
                            centro_utilidad_id: para_seleccion_centro_utilidad[0],
                            bodega_id: para_seleccion_bodega[0]
                        }
                    }
                };

                
                console.log(">>>>Objeto consulta Detalle: ",obj_detalle);

                var url_productos_detalle = API.PEDIDOS.LISTAR_DETALLE_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_productos_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        
                        console.log("Consulta del detalle exitosa! ", data.msj);
                        
                        if (data) {
                            console.log("Datos consulta Detalle: ",data);
                            //console.log("Productos en BD: ", data.obj);
                            //$scope.rootCreaPedidoFarmacia.listado_productos = data.obj.listado_productos;

                            //crear detalle en el objeto

                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().vaciarProductos();

                            data.obj.listado_productos.forEach(function(registro){

                                var producto = ProductoPedido.get(
                                                    registro.codigo_producto,        //codigo_producto
                                                    registro.descripcion,            //descripcion
                                                    0,                               //existencia **hasta aquí heredado
                                                    0,                               //precio
                                                    registro.cantidad_solicitada,    //cantidad_solicitada
                                                    0,                               //cantidad_separada
                                                    "",                              //observacion
                                                    "",                              //disponible
                                                    "",                              //molecula
                                                    "",                              //existencia_farmacia
                                                    registro.tipo_producto_id,       //tipo_producto_id
                                                    "",                              //total_existencias_farmacia
                                                    "",                              //existencia_disponible
                                                    (registro.cantidad_pendiente <= 0) ? '0' : registro.cantidad_pendiente      //cantidad_pendiente
                                                );

                                $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                            });


                            //Desabilitar carga de archivo plano si hay producto en la grid cuando hay pedido almacenado en BD
                            if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                                    && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0'
                                    && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
                            {

                                $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                                $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                            }
                            else {

                                $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                                $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                            }
                        }
                        
                        if(callback !== undefined && callback !== "" && callback !== 0)
                        {
                            callback();
                        }
                    }
                    else{
                        console.log("Consulta del detalle fallida ", data.msj);
                        
                        if(callback !== undefined && callback !== "" && callback !== 0)
                        {
                            callback();
                        }
                    }
                });  
                
            };

            $scope.valorSeleccionado = function(valor) {
                
                console.log("centro seleccionado destino ");
                console.log("Valor Seleccionado: ", valor);
                console.log("Empresa Sel: ", $scope.rootCreaPedidoFarmacia.para_seleccion_empresa);
                console.log("Centro Utilidad Sel: ",$scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad);
                console.log("Bodega Sel: ",$scope.rootCreaPedidoFarmacia.para_seleccion_bodega);

                var para_seleccion_empresa = ['0'];
                var para_seleccion_centro_utilidad = ['0'];
                var para_seleccion_bodega = ['0'];
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa && valor === 1){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = 0;
                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = 0;
                }
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad && valor === 2){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = 0;
                }
                
                //Pone en blanco los dos campos siguientes a la selección de la Farmacia (Centro Utilidad y Bodega)
                if ($scope.rootCreaPedidoFarmacia.para_seleccion_empresa && valor === 4)
                {
                    //$scope.rootCreaPedidoFarmacia.para_lista_empresas = [];
                    //$scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
                    //$scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];
                    $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = '0,';
                    $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = '0,';
                }

                //Pone en blanco el campo siguiente a la selección del Centro Utilidad (Bodega)
                if ($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad && valor === 5)
                {
                    //$scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
                    //$scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];
                    $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = '0,';
                }
                
                
                //Arreglos de dos valores: Valor y Descripción. Si ingresa en alguno de los If anteriores los valores se modifican a Cero
                //para Centro Utilidad y Bodega. En caso contrario toman el valor seleccionado en el listado según la consulta.
                para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',');
                para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',');
                para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(',');
                

                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0)
                {
                    that.consultarCentrosUtilidadDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                }

                if ($scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0)
                {
                    that.consultarBodegaDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                }


                if (para_seleccion_empresa[0] !== '0')
                {
                    //$scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
                    //$scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];
                    console.log("consultar centros de utiliad")
                    that.consultarCentrosUtilidadPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;                    
                }

                if (para_seleccion_centro_utilidad[0] !== '0')
                {   
                    //$scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];
                    that.consultarBodegaPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                }


                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                        && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                        && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0')
                {
                    $scope.rootCreaPedidoFarmacia.bloquear_tab = false;
                    $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = false;

                    //Consultar Información de Encabezado de Pedido Temporal
                    
                    that.consultarEncabezadoPedidoTemporal(function(consulta_encabezado_exitosa){
                        
                        if(consulta_encabezado_exitosa){
                            that.consultarDetallePedidoTemporal(para_seleccion_empresa, para_seleccion_centro_utilidad, para_seleccion_bodega);
                        }
                        
                    });
                }

                //Desabilitar carga de archivo plano si hay producto en la grid cuando no hay un pedido temporal almacenado en BD
                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                        && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                        && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0'
                        && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
                {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                }
                else {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                }

            };
            
            $scope.valorSeleccionadoEspecial = function(valor) {

                var para_seleccion_empresa = ['0'];
                var para_seleccion_centro_utilidad = ['0'];
                var para_seleccion_bodega = ['0'];
                
                //$scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                //$scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                
                console.log("para_seleccion_empresa_aux: ",$scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux);
                console.log("para_seleccion_centro_utilidad_aux: ",$scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux);
                console.log("para_seleccion_bodega_aux: ",$scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux);
                
                //Pone en blanco los dos campos siguientes a la selección de la Farmacia (Centro Utilidad y Bodega)
                if ($scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux && valor === 4)
                {
                    $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux = '0,';
                    $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux = '0,';
                    
                    //New Change
                    //$scope.rootCreaPedidoFarmacia.invalidos_mod_especial = 0;
                    //$scope.rootCreaPedidoFarmacia.total_mod_especial = 0;
                    $scope.rootCreaPedidoFarmacia.incluir_mod_especial = false;
                }

                //Pone en blanco el campo siguiente a la selección del Centro Utilidad (Bodega)
                if ($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux && valor === 5)
                {
                    $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux = '0,';
                    //New Change
                    $scope.rootCreaPedidoFarmacia.incluir_mod_especial = false;
                }
                
                //Arreglos de dos valores: Valor y Descripción. Si ingresa en alguno de los If anteriores los valores se modifican a Cero
                //para Centro Utilidad y Bodega. En caso contrario toman el valor seleccionado en el listado según la consulta.
                para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux.split(',');
                para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux.split(',');
                para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux.split(',');


                if (para_seleccion_empresa[0] !== '0')
                {
                    that.consultarCentrosUtilidadPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                }

                if (para_seleccion_centro_utilidad[0] !== '0')
                {
                    that.consultarBodegaPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                }

                //En éste punto setear valor que indica si el producto se encuentra en la farmacia destino (sólo cuando se hace modificación especial de la misma)
                //Este código tal vez no deba ir aquí. Debe ir en la función de validación de la selección de farmacia, centro_utilidad y bodega
                
                //if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()) {
                    
                if(valor === 6) {    
                    
                    //Recorrer Listado Productos y asignar el valor de "EnFarmacia"
                    var listado_productos = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().obtenerProductos();
                    var total_productos = listado_productos.length;
                    
                    //New Change
                    $scope.rootCreaPedidoFarmacia.invalidos_mod_especial = 0;
                    $scope.rootCreaPedidoFarmacia.total_mod_especial = 0;
                    
                    console.log(">>> farmacia_id: ", para_seleccion_empresa[0]);
                    console.log(">>> centro_utilidad: ", para_seleccion_centro_utilidad[0]);
                    console.log(">>> bodega: ", para_seleccion_bodega[0]);
                    
                    listado_productos.forEach(function(producto){
                        that.consultarProductoEnFarmacia(para_seleccion_empresa[0], para_seleccion_centro_utilidad[0], para_seleccion_bodega[0], producto.codigo_producto, function(existe){
                            
                            //console.log("producto.codigo_producto: ", producto.codigo_producto);
                            
                            //console.log(">>Existe:", existe);
                            
                            $scope.rootCreaPedidoFarmacia.total_mod_especial++;
                            
                            console.log(">>Contador Total",$scope.rootCreaPedidoFarmacia.total_mod_especial);
                            
                            if(existe) {
                                producto.setEnFarmaciaSeleccionada(true);
                            }
                            else {
                                producto.setEnFarmaciaSeleccionada(false);
                                $scope.rootCreaPedidoFarmacia.invalidos_mod_especial++;
                                
                                console.log(">>Contador Invalidos",$scope.rootCreaPedidoFarmacia.invalidos_mod_especial);
                            }
                            
                            //console.log("Valor Booleano: ", producto.getEnFarmaciaSeleccionada());
                            if($scope.rootCreaPedidoFarmacia.total_mod_especial === total_productos && $scope.rootCreaPedidoFarmacia.invalidos_mod_especial === 0) {
                                
                                //Actualizar la información del Pedido en la BD
                                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().get_numero_pedido();
                                
                                that.actualizarEncabezadoPedidoDefinitivo(numero_pedido, para_seleccion_empresa[0], para_seleccion_centro_utilidad[0], para_seleccion_bodega[0], function(){});
                            }
                            
                            if($scope.rootCreaPedidoFarmacia.invalidos_mod_especial === 0)
                                $scope.rootCreaPedidoFarmacia.incluir_mod_especial = true;
                            else
                                $scope.rootCreaPedidoFarmacia.incluir_mod_especial = false;
                            
                        });
                    });
                    
                    console.log(">>Contador",$scope.rootCreaPedidoFarmacia.invalidos_mod_especial);
                    
//                    if($scope.rootCreaPedidoFarmacia.invalidos_mod_especial === 0)
//                        $scope.rootCreaPedidoFarmacia.incluir_mod_especial = true;
//                    else
//                        $scope.rootCreaPedidoFarmacia.incluir_mod_especial = false;
                    
                }
                //}
            };
            
            that.consultarProductoEnFarmacia = function(farmacia_id, centro_utilidad, bodega, codigo_producto, callback){
                
                var url = API.PEDIDOS.CONSULTAR_PRODUCTO_EN_FARMACIA;

                var obj_detalle = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        productos_farmacias: {
                            empresa_id: farmacia_id,
                            centro_utilidad: centro_utilidad,
                            bodega: bodega,
                            codigo_producto: codigo_producto
                        }
                    }
                };
                
                Request.realizarRequest(url, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        
                        var cantidad_registros = data.obj.resultado_consulta[0].cantidad_registros;
                        
                        console.log("Cantidad Registros: ",cantidad_registros);
                        
                        
                        if(callback !== undefined && callback !== "") {
                            if(cantidad_registros > 0){
                                callback(true);
                            }
                            else {
                                callback(false);
                            }
                        }
                        
                        return;
                    }
                    else {
                        console.log("Mensaje Sistema: ", data.msj);
                        console.log("Consulta Fallida: ",data);
                        
                        if(callback !== undefined && callback !== "") {
                            callback(false);
                        }
                        
                        return;
                    }
                });
                
            };

            that.actualizarEncabezadoPedidoDefinitivo = function(numero_pedido, farmacia_id, centro_utilidad, bodega){
                
                console.log("Actualizar Pedido");
                
                //NOTA: Validar que el pedido no esté asignado antes de hacer la modificación
                
                that.verificarEstadoPedido(function(){
                
                    var url = API.PEDIDOS.ACTUALIZAR_ENCABEZADO_PEDIDO_DEFINITIVO;

                    var obj_detalle = {
                        session: $scope.rootCreaPedidoFarmacia.session,
                        data: {
                            farmacia_destino: {
                                numero_pedido: numero_pedido,
                                farmacia_id: farmacia_id,
                                centro_utilidad: centro_utilidad,
                                bodega: bodega
                            }
                        }
                    };

                    Request.realizarRequest(url, "POST", obj_detalle, function(data) {

                        if (data.status === 200) {
                            //Si la transacción es Correcta, Actualizar los valores de PARA en el objeto Empresa y en las variables globales respectivas
                            $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux;
                            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux;
                            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux;

                            var para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_aux.split(',');
                            var para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_aux.split(',');
                            var para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega_aux.split(',');

    //                        console.log("Actualiza Objeto Empresa:");
    //                        console.log(para_seleccion_empresa);
    //                        console.log(para_seleccion_centro_utilidad);
    //                        console.log(para_seleccion_bodega);

                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id = para_seleccion_empresa[0];
                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_farmacia = para_seleccion_empresa[1];
                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id = para_seleccion_centro_utilidad[0];
                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_centro_utilidad = para_seleccion_centro_utilidad[1];
                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.bodega_id = para_seleccion_bodega[0];
                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_bodega = para_seleccion_bodega[1];

                            console.log("Actualización Exitosa!", data.msj);

                            $scope.opts = {
                                backdrop: true,
                                backdropClick: true,
                                dialogFade: false,
                                keyboard: true,
                                template: ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Aviso: </h4>\
                                            </div>\
                                            <div class="modal-body row">\
                                                <div class="col-md-12">\
                                                    <h4 >Encabezado del Pedido # '+numero_pedido+' ha sido Modificado!</h4>\
                                                </div>\
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

                            return;
                        }
                        else {

                            console.log("Error en Actualización!", data.msj);

                            $scope.opts = {
                                backdrop: true,
                                backdropClick: true,
                                dialogFade: false,
                                keyboard: true,
                                template: ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Aviso: </h4>\
                                            </div>\
                                            <div class="modal-body row">\
                                                <div class="col-md-12">\
                                                    <h4 >No pudo actualizarse el Pedido # '+numero_pedido+'</h4>\
                                                </div>\
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

                            return;
                        }
                    });
                
                }); //FIN VERIFICAR ESTADO PEDIDO
            };

            $scope.generarPedidoFarmacia = function() {
                
                var tipo_producto_anterior = '0';
                var generar_pedido = 0;
                
                $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.forEach(function(producto){
                    
                    if(producto.tipo_producto_id !== tipo_producto_anterior && tipo_producto_anterior !== '0'){

                            generar_pedido++;

                    }
                    
                    tipo_producto_anterior = producto.tipo_producto_id;
                    
                });
                
                if(generar_pedido === 0) {


                    var obj_encabezado = {
                        session: $scope.rootCreaPedidoFarmacia.session,
                        data: {
                            pedidos_farmacias: {
                                empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0],
                                observacion: $scope.rootCreaPedidoFarmacia.observacion,
                                tipo_pedido: 0 //Pedido Normal. Pedido General tiene un valor de 1
                            }
                        }
                    };


                    var url_encabezado = API.PEDIDOS.INSERTAR_PEDIDO_FARMACIA_DEFINITIVO;

                    Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                        if (data.status === 200) {
                            console.log("Encabezado Ingresado : ", data.msj);

                            var numero_pedido_generado = data.obj.numero_pedido[0].solicitud_prod_a_bod_ppal_id;

                            var obj_detalle = {
                                session: $scope.rootCreaPedidoFarmacia.session,
                                data: {
                                    detalle_pedidos_farmacias: {
                                        numero_pedido: numero_pedido_generado,
                                        empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                        centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                        bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                    }
                                }
                            };


                            var url_detalle = API.PEDIDOS.INSERTAR_DETALLE_PEDIDO_FARMACIA_DEFINITIVO;

                            Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                                if (data.status === 200) {
                                    console.log("Detalle Ingresado : ", data.msj);
                                    PedidoVenta.pedidoseleccionado = numero_pedido_generado;
                                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido = numero_pedido_generado;
                                    $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = PedidoVenta.pedidoseleccionado;
                                    
//***************--------          //Revisar si ésta línea es realmente útil para habilitar botones de Modificar y eliminar
                                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = 0;
                                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().setEditable(true);
                                    //console.log(">>>>> Valor de Editable Pedido: ", $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable());

                                    var obj_detalle = {
                                        session: $scope.rootCreaPedidoFarmacia.session,
                                        data: {
                                            detalle_pedidos_farmacias: {
                                                empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                                centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                                bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                            }
                                        }
                                    };


                                    var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_DETALLE_PEDIDO_FARMACIA_TEMPORAL_COMPLETO;

                                    Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                                        if (data.status === 200) {
                                            console.log("Eliminación de detalle Exitosa: ", data.msj);

                                            //Se asignan los valores de la Grid de pedidos temporales a la Grid del Pedido Generado
                                            //$scope.rootCreaPedidoFarmacia.listado_productos = []; //La grid puede ser diferente pero el objeto igual.
                                            $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true; //Activa la visibilidad de la grid de pedido definitivo
                                            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true; //Bloquea botón generar pedido
                                            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true; //Bloquear botón incluir producto

                                            //Eliminación de encabezado
                                            var obj_encabezado = {
                                                session: $scope.rootCreaPedidoFarmacia.session,
                                                data: {
                                                    pedidos_farmacias: {
                                                        empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                                        centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                                        bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                                    }
                                                }
                                            };
                                            var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                                            Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                                                if (data.status === 200) {
                                                    console.log("Eliminación de encabezado Exitosa: ", data.msj);
                                                }
                                                else
                                                {
                                                    console.log("Eliminación de encabezado Fallida: ", data.msj);
                                                }
                                            });
                                        }
                                        else
                                        {
                                            console.log("Eliminación Detalle Fallida: ", data.msj);
                                        }
                                    });

                                }
                                else {
                                    console.log("Detalle No Ingresado : ", data.msj);
                                }
                            });

                        }
                        else {
                            console.log("Encabezado No Ingresado : ", data.msj);
                        }
                    });

                }
                else{
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Aviso: </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >No se puede Generar el Pedido. Tiene productos de diferente tipo!</h4>\
                                            </div>\
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
                }
            };

            $scope.setTabActivo = function(number, callback) {

                if (number === 1)
                {
                    $scope.rootCreaPedidoFarmacia.tab_estados.tab1 = true;
                    if(callback !== undefined && callback !== "" && callback !== 0){
                        callback();
                    }
                }

                if (number === 2)
                {
                    $scope.rootCreaPedidoFarmacia.tab_estados.tab2 = true;
                    if(callback !== undefined && callback !== "" && callback !== 0){
                        callback();
                    }
                }

            };

            $scope.abrirViewVerPedidosFarmacias = function()
            {
                that.actualizarEncabezadoPedidoTemporal();
                $state.go('VerPedidosFarmacias'); //Crear la URL para éste acceso y relacionarlo con el botón de "Cancelar en la View"
            };
            
            //Función que actualizar la observación si ya existe un encabezado
            that.actualizarEncabezadoPedidoTemporal = function() {
                
                var obj_encabezado = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0],
                            empresa_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                            centro_utilidad_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                            bodega_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega,
                            observacion: $scope.rootCreaPedidoFarmacia.observacion
                        }
                    }
                };


                var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {
                        
                        console.log(data.msj);

                        if (data.obj.numero_registros[0].count > 0) {
                            
                            //Actualizar
                            var url_actualizar_encabezado = API.PEDIDOS.ACTUALIZAR_ENCABEZADO_TEMPORAL_PEDIDO_FARMACIA;
                            
                            Request.realizarRequest(url_actualizar_encabezado, "POST", obj_encabezado, function(data_update) {
                                
                                if(data_update.status === 200) {
                                    
                                    console.log(data_update.msj);
                                    
                                }
                                else {
                                    console.log(data_update.msj);
                                }
                            });
                        }
                        else {
                            console.log(">>>>> Encabezado Vacío");
                        }
                    }
                    else {
                        console.log(data.msj);
                    }
                });
                
            };

            $scope.onEliminarPedidoTemporal = function(){
                var template = '<div class="modal-header">\
                                      <button type="button" class="close" ng-click="close()">&times;</button>\
                                      <h4 class="modal-title">Mensaje del Sistema</h4>\
                                  </div>\
                                  <div class="modal-body">\
                                      <h4>Seguro desea eliminar el Pedido Temporal ? </h4> \
                                  </div>\
                                  <div class="modal-footer">\
                                      <button class="btn btn-warning" ng-click="close()">No</button>\
                                      <button class="btn btn-primary" ng-click="eliminarPedidoTemporal()">Si</button>\
                                  </div>';

                  controller = function($scope, $modalInstance) {

                    $scope.eliminarPedidoTemporal = function() {

                        that.eliminarPedidoTemporal();
                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
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

            that.eliminarPedidoTemporal = function(){

                //Eliminación Detalle Temporal
                var obj_detalle = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                        }
                    }
                };
                
                var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_DETALLE_PEDIDO_FARMACIA_TEMPORAL_COMPLETO;

                Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        console.log("Eliminación del detalle Exitosa: ", data.msj);
                        
                        //Eliminación encabezado temporal
                        var obj_encabezado = {
                            session: $scope.rootCreaPedidoFarmacia.session,
                            data: {
                                pedidos_farmacias: {
                                    empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                    bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                }
                            }
                        };

                        var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                        Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                            if (data.status === 200) {
                                console.log("Eliminación de encabezado Exitosa: ", data.msj);
                                $state.go('VerPedidosFarmacias');
                            }
                            else{
                                console.log("Eliminación de encabezado Fallida: ", data.msj);
                            }
                        });
                        
                        
                    }
                    else
                    {
                        console.log("Eliminación del detalle Fallida: ", data.msj);
                    }
                });
            };

            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.rootCreaPedidoFarmacia = {};
                $scope.$$watchers = null;
                localStorageService.remove("pedidoseleccionado");

            });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {

            });

            $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

            });

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            });
            
            
            //Función que inserta el encabezado del pedido temporal
            that.insertarEncabezadoPedidoTemporal = function(callback) {
                
                var obj_encabezado = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {                            
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0],
                            empresa_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                            centro_utilidad_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                            bodega_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega,
                            observacion: $scope.rootCreaPedidoFarmacia.observacion
                        }
                    }
                };
                
                //console.log(">>> obj_encabezado: ", obj_encabezado);


                var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {
                        //console.log("ENCABEZADO: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
                        if (data.obj.numero_registros[0].count > 0) {

                            console.log("Ya existe éste registro en el encabezado");
                            if(callback !== undefined && callback !== "" && callback !== 0){
                                callback(true);
                            }
                        }
                        else {

                            var url_encabezado = API.PEDIDOS.CREAR_PEDIDO_TEMPORAL;

                            Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                                if (data.status === 200) {
                                    console.log("Registro Insertado Exitosamente en Encabezado");

                                    if(callback !== undefined && callback !== "" && callback !== 0){
                                        callback(true);
                                    }
                                }
                                else {
                                    console.log(data.msj);
                                    if(callback !== undefined && callback !== "" && callback !== 0){
                                        callback(false);
                                    }
                                }
                            });
                        }
                    }
                    else {
                        console.log(data.msj);
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(false);
                        }
                    }
                });
            };

            $scope.rootCreaPedidoFarmacia.opciones_archivo = new Flow();
            $scope.rootCreaPedidoFarmacia.opciones_archivo.target = API.PEDIDOS.ARCHIVO_PLANO_PEDIDO_FARMACIA;
            $scope.rootCreaPedidoFarmacia.opciones_archivo.testChunks = false;
            $scope.rootCreaPedidoFarmacia.opciones_archivo.singleFile = true;
            $scope.rootCreaPedidoFarmacia.opciones_archivo.query = {
                session: JSON.stringify($scope.rootCreaPedidoFarmacia.session)
            };

            $scope.cargar_archivo_plano = function($flow) {

                $scope.rootCreaPedidoFarmacia.opciones_archivo = $flow;
            };

            $scope.subir_archivo_plano = function() {
                    
                    that.insertarEncabezadoPedidoTemporal(function(insert_encabezado_exitoso) {

                        if (insert_encabezado_exitoso) {

                            $scope.rootCreaPedidoFarmacia.opciones_archivo.opts.query.data = JSON.stringify({
                                
                                pedido_farmacia: {
                                    empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                                    bodega_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega,
                                    empresa_para: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                    centro_utilidad_para: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],                                    
                                    bodega_para: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                }

                            });

                            $scope.rootCreaPedidoFarmacia.opciones_archivo.upload();
                        }
                    });
            };

            $scope.respuesta_archivo_plano = function(file, message) {
                
                var para_seleccion_empresa = [];
                var para_seleccion_centro_utilidad = [];
                var para_seleccion_bodega = [];

                var data = (message !== undefined) ? JSON.parse(message) : {};


                if (data.status === 200) {

                    $scope.rootCreaPedidoFarmacia.opciones_archivo.cancel();
                    
                    if ($scope.rootCreaPedidoFarmacia.para_seleccion_empresa)
                    {
                        para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',');
                    }

                    if ($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad)
                    {
                        para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',');
                    }

                    if ($scope.rootCreaPedidoFarmacia.para_seleccion_bodega)
                    {
                        para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(',');
                    }
                    
                    
                    that.ventana_modal_no_validos(data, function(){
                        $scope.setTabActivo(1, function(){
                        
                            //Trae detalle de productos cargados del archivo
                            that.consultarDetallePedidoTemporal(para_seleccion_empresa, para_seleccion_centro_utilidad, para_seleccion_bodega);
                        });
                    });
                    

                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            };
            
            that.ventana_modal_no_validos = function(data, callback){
                
                $scope.productos_validos = data.obj.pedido_farmacia_detalle.productos_validos;
                $scope.productos_invalidos = data.obj.pedido_farmacia_detalle.productos_invalidos;

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Listado Productos </h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <h4 >Lista Productos INVALIDOS.</h4>\
                                        <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                            <div class="list-group">\
                                                <a ng-repeat="producto in productos_invalidos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                    {{ producto.codigo_producto}}\
                                                </a>\
                                            </div>\
                                        </div>\
                                    </div>\
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
                
                callback();
            };
            
            $scope.generarPdfPedidoFarmacia = function(){
                
                var nombre_empresa_origen = "";
                var nombre_centro_utilidad_origen = "";
                var nombre_bodega_origen = "";
                
                $scope.rootCreaPedidoFarmacia.de_lista_empresas.forEach(function(empresa){
                    if(empresa.empresa_id === $scope.rootCreaPedidoFarmacia.Empresa.getCodigo()){
                        nombre_empresa_origen = empresa.razon_social;
                    }
                });
                
                $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad.forEach(function(centro_utilidad){
                    if(centro_utilidad.centro_utilidad_id === $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad){
                        nombre_centro_utilidad_origen = centro_utilidad.descripcion;
                    }
                });
                
                $scope.rootCreaPedidoFarmacia.de_lista_bodegas.forEach(function(bodega){
                    if(bodega.bodega_id === $scope.rootCreaPedidoFarmacia.de_seleccion_bodega){
                        nombre_bodega_origen = bodega.descripcion;
                    }
                });
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido;

                var obj_pdf = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        encabezado_pedido_farmacia: {
                            numero_pedido: numero_pedido,
                            empresa_origen_id: $scope.rootCreaPedidoFarmacia.Empresa.getCodigo(), //Nuevo
                            empresa_origen: nombre_empresa_origen,
                            centro_utilidad_origen: nombre_centro_utilidad_origen,
                            bodega_origen: nombre_bodega_origen,
                            empresa_destino_id: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id, //Nuevo
                            empresa_destino: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_farmacia,//$scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[1],
                            centro_utilidad_destino_id: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id, //Nuevo
                            centro_utilidad_destino: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_centro_utilidad,
                            bodega_destino_id: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.bodega_id, //Nuevo
                            bodega_destino: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_bodega,
                            fecha_registro: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().fecha_registro,
                            observacion: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getObservacion()
                        },
                        detalle_pedido_farmacia: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos
                    }
                };

//                console.log("Fecha Registro: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().fecha_registro);
//                console.log("Observación: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getObservacion);
//                console.log("Objeto PDF: ",obj_pdf);

                var url_imprimir_dedido_pdf = API.PEDIDOS.IMPRIMIR_PEDIDO_FARMACIA;

                Request.realizarRequest(url_imprimir_dedido_pdf, "POST", obj_pdf, function(data) {

                    if (data.status === 200) {
                        //console.log("Eliminación de detalle Exitosa: ", data.msj);
                        var nombre_archivo_temporal = data.obj.reporte_pedido.nombre_reporte;
//                        console.log("Exito: ", data.msj);
//                        console.log("Data Resultado Temporal: ",data);
//                        console.log("Nombre PDF: ", nombre_archivo_temporal); //public/reports/
                        $scope.visualizarReporte("/reports/"+nombre_archivo_temporal, "Pedido: "+numero_pedido, "download");
                    }
                    else{
                        console.log("Error: ", data.msj);
                    }
                });
            };
            

            that.crearPedido = function(obj) {

                var pedido = PedidoVenta.get();

                var datos_pedido = {
                    numero_pedido: obj.numero_pedido,
                    fecha_registro: obj.fecha_registro,
                    descripcion_estado_actual_pedido: obj.descripcion_estado_actual_pedido,
                    estado_actual_pedido: obj.estado_actual_pedido,
                    estado_separacion: obj.estado_separacion
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(PedidoVenta.TIPO_FARMACIA);

                pedido.setObservacion(obj.observacion);

                //pedido.setEnUso(obj.en_uso);

                var farmacia = FarmaciaVenta.get(
                        obj.farmacia_id,
                        obj.bodega_id,
                        obj.nombre_farmacia,
                        obj.nombre_bodega,
                        obj.centro_utilidad,
                        obj.nombre_centro_utilidad
                        );

                pedido.setFarmacia(farmacia);

                return pedido;
            };

            //referencia del socket io
            socket.on("onListarPedidosFarmacias", function(datos) {

                if (datos.status == 200) {
                    var obj = datos.obj.pedidos_farmacias[0];
                    var pedido = that.crearPedido(obj);

                    that.reemplazarPedidoEstado(pedido);
                    AlertService.mostrarMensaje("success", "pedido Asignado Correctamente!");

                }
            });
            
            
            that.reemplazarPedidoEstado = function(pedido) {
                
                if($scope.rootCreaPedidoFarmacia.Empresa != undefined){
                
                    for (var i in $scope.rootCreaPedidoFarmacia.Empresa.getPedidosFarmacia()) {
                        var _pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidosFarmacia()[i];

                        if (pedido.numero_pedido == _pedido.numero_pedido) {
                            _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                            _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                            _pedido.estado_separacion = pedido.estado_separacion;

                            break;
                        }
                    }
                
                }
                
            };
       
            that.buscarPedido("");*/

        }]);
});
