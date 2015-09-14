//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionProductosController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, localStorageService, $state) {


            var self = this;

            self.init = function(callback) {
                $scope.rootSeparacionClientes = {};
                $scope.paginaactual = 1;
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
                data: 'myData',
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
                    {field: 'pedido', displayName: 'Lote'},
                    {field: 'fechavencimiento', displayName: 'F. vencimiento'},
                    {field: 'existencia', displayName: 'Existencia'},
                    {field: 'disponible', width: "10%",
                        displayName: "Disponible"
                        
                    }
                     
                ],
               
            };
            
            
            $scope.listarProductos = {
                data: 'myData',
                
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected:false,
                multiSelect:false,
                columnDefs: [
                    {field: 'pedido', displayName: 'Lote'},
                    {field: 'fechavencimiento', displayName: 'F. vencimiento'},
                   
                     
                ],
               
            };
         
            /**
             * +Descripcion: metodo ejecutado por el slider para cambiar a la 
             * pagina donde se encuentran los documentos para despachar
             * 
             */
            $scope.showDetallePedidos = function() {

                $scope.slideurl = "views/separacionpedidos/separacionDetalle.html?time=" + new Date().getTime();
                $scope.$emit('showDetallePedidos');
             
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


            });

        }]);
});
