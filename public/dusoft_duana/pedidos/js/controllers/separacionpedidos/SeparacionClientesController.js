//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionClientesController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "$state",
        "PedidoAuditoria", "Cliente","SeparacionService",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, $state,
                PedidoAuditoria,Cliente, SeparacionService) {


            var self = this;

            self.init = function(callback) {
                $scope.rootSeparacionClientes = {};
                $scope.rootSeparacionClientes.paginaActual = 1;
                $scope.rootSeparacionClientes.terminoBusqueda = "";
                $scope.rootSeparacionClientes.listaPedidos = [];
                callback();
            };

            
            /*
             * @Author: Eduar
             * @param {Boolean} esTemporal
             * +Descripcion: Trae los pedidos asignados al tercero o los que estan en separacion
             */
            self.traerPedidosAsignados = function(esTemporal, callback) {
                var filtro = (esTemporal)? {temporales : true} : {asignados : true};
                   
                SeparacionService.traerPedidosAsignadosClientes($scope.root.session, filtro,
                $scope.rootSeparacionClientes.paginaActual, $scope.rootSeparacionClientes.terminoBusqueda, function(pedidos){
                    
                    if(pedidos){
                        $scope.rootSeparacionClientes.listaPedidos = pedidos;
                    }
                });
                
                
            };
            

            /*
             * @Author: Eduar
             * +Descripcion: Funcion utilizada para destruir las referencias del controlador ejemplo la variable rootSeparacionClientes
             */
            $scope.$on('$destroy', function iVeBeenDismissed() {
                console.log("goodbye SeparacionClientesController");
                $scope.rootSeparacionClientes = null;
            });


            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  clientes y pedidos temporales clientes
             */
            $scope.pedidos = {
                data: 'rootSeparacionClientes.listaPedidos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_pedido', displayName: 'Pedido No',width:100},
                    {field: 'cliente.nombre_tercero', displayName: 'Cliente', 
                        cellClass: "ngCellText",
                        cellTemplate: '<div>{{row.entity.cliente.getTipoId()}} {{row.entity.cliente.getId()}} - {{row.entity.cliente.nombre_tercero}}</div>'},
                    {field: 'cantidadProductos', displayName: 'Productos', width:100},
                    {field: 'Detalle', width: "5%",
                        displayName: "Detalle",
                        cellClass: "txt-center",
                        cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="detallePedido(row.entity)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'

                    }
                ]
            };


            /**
             * @param {N/N}
             * @author Cristian Ardila
             * @returns {int} paginaactual
             * +Descripcion: funcion que se invoca al presionar click
             * en el boton izquiero (<) del paginador del gridview
             * y aumentara en 1 la pagina actual, refrescando la gridview
             * de los documentos
             */
            $scope.paginaAnteriorClientes = function() {
                if ($scope.rootSeparacionClientes.paginaActual === 1)
                    return;
                 $scope.rootSeparacionClientes.paginaActual--;
                /* that.traerDocumentosFarmacias(function() {
                 });*/
            };

            /**
             * @param {N/N}
             * @author Cristian Ardila
             * @returns {int} paginaactual
             * +Descripcion: funcion que se invoca al presionar click
             * en el boton derecho (>) del paginador del gridview
             * y aumentara en 1 la pagina actual, refrescando la gridview
             * de los documentos
             */
            $scope.paginaSiguienteClientes = function() {

                 $scope.rootSeparacionClientes.paginaActual++;

                 self.traerPedidosAsignados($scope.root.esTemporal, function(){
                    
                 });
            };
            
            $scope.onBuscarPedidos = function(event){
                if(event.which === 13){
                    self.traerPedidosAsignados($scope.root.esTemporal, function(){
                    
                    });
                }
            };

            self.init(function() {
                self.traerPedidosAsignados($scope.root.esTemporal, function(){
                    
                });
            });

        }]);
});
