//Controlador de la View verpedidosfarmacias.html

define(["angular",
    "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('ListaPedidosTemporalesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaPedido', 'PedidoFarmacia',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        "CentroUtilidadPedidoFarmacia", "BodegaPedidoFarmacia", "PedidosFarmaciasService",
        function($scope, $rootScope, Request, EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                API, socket, AlertService, $state, Usuario, localStorageService, $modal,
                CentroUtilidadPedidoFarmacia, BodegaPedidoFarmacia, PedidosFarmaciasService) {
            var self = this;

            $scope.rootPedidosTempFarmacias = {};

            var self = this;

            $scope.rootPedidosTempFarmacias.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootPedidosTempFarmacias.paginaactual = 1;

            $scope.rootPedidosTempFarmacias.termino_busqueda = "";

            /*Se comenta debido a que no se requiere la empresa actual del usuaio, si no farmacias duana
             * var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
            $scope.rootPedidosTempFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(empresa.getNombre(), empresa.getCodigo());*/
            $scope.rootPedidosTempFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get("FARMACIA DUANA", 'FD');


            $scope.rootPedidosTempFarmacias.lista_pedidos_temporales_farmacias = {
                data: 'rootPedidosTempFarmacias.empresaSeleccionada.obtenerPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting:true,
                columnDefs: [
                    {field: 'farmaciaDestino.nombre_farmacia', displayName: 'Farmacia', width: "15%"},
                    {field: 'farmaciaDestino.getCentroUtilidadSeleccionado().getNombre()', displayName: 'Centro Utilidad', width: "15%"},
                    {field: 'farmaciaDestino.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getNombre()', displayName: 'Bodega', width: "15%"},
                    {field: 'getDescripcion()', displayName: 'Observación'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li><a href="javascript:void(0);" ng-click="onEditarPedidoTemporal(row.entity)" ng-validate-events="{{root.servicio.getOpcionesModulo().btnModificarPedido}}">Modificar</a></li>\
                                            <li class="divider"></li>\
                                            <li><a href="javascript:void(0);" ng-validate-events="{{root.servicio.getOpcionesModulo(row.entity).btnEliminarPedidoTemporal}}" ng-click="onEliminarPedidoTemporal(row.entity, row.entity)" >Eliminar</a></li>\
                                        </ul>\n\
                                        </div>'
                    }

                ]

            };

            /*
             * @Author: Eduar
             * +Descripcion: function helper que prepara los parametros y hace el llamado para buscar los encabezados de pedidos de farmacia temporales
             * depende de self.consultarEncabezados() y self.renderPedidos()
             */

            self.buscarPedidos = function(callback) {
                
                var obj = {
                    session: $scope.rootPedidosTempFarmacias.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: $scope.rootPedidosTempFarmacias.termino_busqueda,
                            empresa_id: $scope.rootPedidosTempFarmacias.empresaSeleccionada.getCodigo(),
                            pagina_actual: $scope.rootPedidosTempFarmacias.paginaactual,
                            filtro: {}
                        }
                    }
                };

                self.consultarEncabezadosPedidos(obj, function(data) {
             
                    if (data.status === 200) {

                        /*las empresas del usuario (de la session) son de tipo Empresa, por lo tanto se requiere asegurar 
                         que sean de tipo EmpresaPedidoFarmacia para acceder a los metodos 
                         de esta ultima*/

                        $scope.rootPedidosTempFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(
                                $scope.rootPedidosTempFarmacias.empresaSeleccionada.getNombre(),
                                $scope.rootPedidosTempFarmacias.empresaSeleccionada.getCodigo()
                        );

                        $scope.rootPedidosTempFarmacias.empresaSeleccionada.vaciarPedidos();
                        self.renderPedidos(data.obj.pedidos_farmacias);

                        if (callback) {
                            callback(true);
                        }
                        
                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error");
                    }
                });
            };


            /*
             * @Author: Eduar
             * @param {object} obj
             * @param {function} callback
             * +Descripcion: Metodo encargado de consultar los encabezados de los pedidos de farmacia
             */

            self.consultarEncabezadosPedidos = function(obj, callback) {

                var url = API.PEDIDOS.LISTADO_PEDIDOS_TEMPORALES_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    callback(data);

                });
            };


            /*
             * @Author: Eduar
             * @param {Array<object>} pedidos
             * +Descripcion: metodo encargado de serializar el json de pedidos, depende de self.crearPedido()
             */

            self.renderPedidos = function(data) {
                for (var i in data) {
                    var obj = data[i];
                    var pedido = PedidosFarmaciasService.crearPedido(obj);
                    pedido.setEsTemporal(true);
                    $scope.rootPedidosTempFarmacias.empresaSeleccionada.agregarPedido(pedido);
                }

            };
            
                        
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * @param {index} index
             * +Descripcion: eliminar detalle de pedido de temporales
             */
            
            self.eliminarDetallePedidoTemporal = function(pedido, index) {
                var farmacia = pedido.getFarmaciaDestino();
                
                var obj_detalle = {
                    session: $scope.rootPedidosTempFarmacias.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: farmacia.get_farmacia_id(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                        }
                    }
                };

                var url_eliminar_detalle = API.PEDIDOS.FARMACIAS.ELIMINAR_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                       
                        //Eliminación encabezado temporal
                       self.buscarPedidos();

                    }
                    else
                    {
                        
                    }
                });
            };

            /*
             * @Author: Eduar
             * +Descripcion: handler del combo de empresas
             */

            $scope.onBuscarPedidos = function() {
       
                $scope.rootPedidosTempFarmacias.paginaactual = 1;
                self.buscarPedidos();
            };


            /*
             * @Author: Eduar
             * @param {Object} event
             * +Descripcion: handler del text input para buscar pedidos por descripcion
             */
            $scope.onCampoBuscarPedidos = function(event) {
                if (event.which === 13) {
                    $scope.rootPedidosTempFarmacias.paginaactual = 1;
                    self.buscarPedidos();
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: function helper que permite paginar
             */
            $scope.paginaAnterior = function() {
                if ($scope.rootPedidosTempFarmacias.paginaactual === 1) {
                    return;
                }

                $scope.rootPedidosTempFarmacias.paginaactual--;
                self.buscarPedidos();
            };

            /*
             * @Author: Eduar
             * +Descripcion: function helper que permite paginar
             */
            $scope.paginaSiguiente = function() {
                $scope.rootPedidosTempFarmacias.paginaactual++;
                self.buscarPedidos(function(resultado) {
                    if (!resultado) {
                        $scope.rootPedidosTempFarmacias.paginaactual--;
                    }
                });
            };
            
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * @param {index} index
             * +Descripcion: handler de la opcion de eliminar en el grid de temoprales
             */

            $scope.onEliminarPedidoTemporal = function(pedido, index) {

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

                controller = ["$scope", "$modalInstance", function($scope, $modalInstance) {

                    $scope.eliminarPedidoTemporal = function() {

                        self.eliminarDetallePedidoTemporal(pedido, index);
                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
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
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler de la opcion modificar pedido temporal
             */
            
            $scope.onEditarPedidoTemporal = function(pedido) {
                var farmacia = pedido.getFarmaciaDestino();
                localStorageService.set("pedidotemporal", {
                    farmacia:farmacia.get_farmacia_id(),
                    centroUtilidad:farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                    bodega:farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                });
                
                $state.go('GuardarPedidoTemporal');
             
             };
             
            
            localStorageService.remove("pedidotemporal");
            self.buscarPedidos();

        }]);

});
