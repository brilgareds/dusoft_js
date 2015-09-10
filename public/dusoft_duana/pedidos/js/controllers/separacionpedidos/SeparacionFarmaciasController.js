//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionFarmaciasController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal","PedidoAuditoria","Farmacia",
        "SeparacionService",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, 
                PedidoAuditoria, Farmacia, SeparacionService) {


            var self = this;

            self.init = function(callback) {
                $scope.rootSeparacionFarmacias = {};
                $scope.rootSeparacionFarmacias = {};
                $scope.rootSeparacionFarmacias.paginaActual = 1;
                $scope.rootSeparacionFarmacias.terminoBusqueda = "";
                $scope.rootSeparacionFarmacias.listaPedidos = [];
                callback();
            };
            
            
            /*
             * @Author: Eduar
             * @param {Boolean} esTemporal
             * +Descripcion: Trae los pedidos asignados al tercero o los que estan en separacion
             */
            self.traerPedidosAsignados = function(esTemporal, callback) {
                
                var filtro = (esTemporal)? {temporales : true} : {asignados : true};

                SeparacionService.traerPedidosAsignadosFarmacias($scope.root.session, filtro,
                $scope.rootSeparacionFarmacias.paginaActual, $scope.rootSeparacionFarmacias.terminoBusqueda, function(pedidos){
                    
                    if(pedidos){
                        $scope.rootSeparacionFarmacias.listaPedidos = pedidos;
                    }
                });
            };
            
            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  farmacias y pedidos temporales farmacias
             */
            $scope.pedidosFarmacias = {
                data: 'rootSeparacionFarmacias.listaPedidos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_pedido', displayName: 'Pedido No'},
                    {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia'},
                    {field: 'farmacia.nombre_bodega', displayName: 'Bodega'},
                   {field: 'cantidadProductos', displayName: 'Productos', width:100},
                    {field: 'detalle', width: "10%",
                        displayName: "Cantidad",
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
            $scope.paginaAnteriorFarmacias = function() {
               
                if ($scope.rootSeparacionFarmacias.paginaActual === 1)
                    return;
                $scope.rootSeparacionFarmacias.paginaActual--;
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
            $scope.paginaSiguienteFarmacias = function() {
                
                $scope.rootSeparacionFarmacias.paginasActual++;

                /* that.traerDocumentosFarmacias(function() {
                 });*/
            };


            /*
             * @Author: Eduar
             * +Descripcion: Funcion utilizada para destruir las referencias del controlador ejemplo la variable rootSeparacionFarmacias
             */
            $scope.$on('$destroy', function iVeBeenDismissed() {
                $scope.rootSeparacionFarmacias = null;
            });

            self.init(function() {
                self.traerPedidosAsignados($scope.root.esTemporal, function(){
                    
                });
            });



        }]);
});
