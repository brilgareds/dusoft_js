//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionClientesController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "$state",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, $state) {


            var self = this;

            self.init = function(callback) {
                $scope.rootSeparacionClientes = {};
                $scope.paginaactualClientes = 1;
                callback();
            };



            self.traerPedidosTemporales = function() {
                console.log("traer pedidos temporales SeparacionClientesController");
            };

            self.traerPedidosAsignados = function() {
                console.log("traer pedidos asignados SeparacionClientesController");
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
             * +Descripcion: Datos de prueba
             */
            $scope.myData = [
                {pedido: 50, operario: "Moroni", cantidad: 60},
                {pedido: 50, operario: "Gomez", cantidad: 60},
                {pedido: 50, operario: "Ixon", cantidad: 60},
                {pedido: 50, operario: "Fabio", cantidad: 60},
                {pedido: 50, operario: "Alex", cantidad: 60}
            ];

            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  clientes y pedidos temporales clientes
             */
            $scope.pedidos = {
                data: 'myData',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'pedido', displayName: 'Pedido No'},
                    {field: 'operario', displayName: 'Operario'},
                    {field: 'cantidad', displayName: 'Cantidad'},
                    {field: 'Detalle', width: "10%",
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
                if ($scope.paginaactualClientes === 1)
                    return;
                $scope.paginaactualClientes--;
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

                $scope.paginaactualClientes++;

                /* that.traerDocumentosFarmacias(function() {
                 });*/
            };

            self.init(function() {

                if ($scope.root.esTemporal) {
                    self.traerPedidosTemporales();
                } else {
                    self.traerPedidosAsignados();
                }
            });

        }]);
});
