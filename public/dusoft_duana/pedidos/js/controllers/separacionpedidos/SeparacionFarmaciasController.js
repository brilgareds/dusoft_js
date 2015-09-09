//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionFarmaciasController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal) {


            var self = this;

            self.init = function(callback) {
                $scope.rootSeparacionFarmacias = {};
                $scope.paginaactualFarmacias = 1;
                callback();
            };


            /**
             * +Descripcion: Datos de prueba
             */
            $scope.myData = [
                {pedido: 50, farmacia: "FAMRACIAS DUANA - MAN PALO GRANDE", bodega: "MAN PALO GRANDE", cantidad: 60},
                {pedido: 50, farmacia: "FAMRACIAS DUANA - MAN PALO GRANDE", bodega: "PEÑITAS ", cantidad: 60},
                {pedido: 50, farmacia: "FAMRACIAS DUANA - MAN PALO GRANDE", bodega: "Ixon", cantidad: 60},
                {pedido: 50, farmacia: "FAMRACIAS DUANA - MAN PALO GRANDE", bodega: "Fabio", cantidad: 60},
                {pedido: 50, farmacia: "FAMRACIAS DUANA - MAN PALO GRANDE", bodega: "Alex", cantidad: 60}
            ];

            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  farmacias y pedidos temporales farmacias
             */
            $scope.pedidosFarmacias = {
                data: 'myData',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'pedido', displayName: 'Pedido No'},
                    {field: 'farmacia', displayName: 'Farmacia'},
                    {field: 'bodega', displayName: 'Bodega'},
                    {field: 'cantidad', width: "10%"},
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
               
                if ($scope.paginaactualFarmacias === 1)
                    return;
                $scope.paginaactualFarmacias--;
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
                
                $scope.paginaactualFarmacias++;

                /* that.traerDocumentosFarmacias(function() {
                 });*/
            };


            /*
             * @Author: Eduar
             * +Descripcion: Funcion utilizada para destruir las referencias del controlador ejemplo la variable rootSeparacionFarmacias
             */
            $scope.$on('$destroy', function iVeBeenDismissed() {
                console.log("goodbye SeparacionFarmaciasController");
                $scope.rootSeparacionFarmacias = null;
            });

            self.init(function() {

            });



        }]);
});
