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
                 $scope.filtro = $scope.filtros[0];
                 $scope.justificacion = $scope.justificaciones[0];
                callback();
            };
            
            $scope.onSeleccionJustificacion = function(justificacion) {
                $scope.justificacion = justificacion;
            }

           
            $scope.onSeleccionFiltros = function(justificacion) {
                $scope.filtro = justificacion;
            }
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
            $scope.separacionProducto = {
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
            $scope.paginaAnterior = function() {
                if ($scope.paginaactual === 1)
                    return;
                $scope.paginaactual--;
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
            $scope.paginaSiguiente = function() {

                $scope.paginaactual++;
                /* that.traerDocumentosFarmacias(function() {
                 });*/
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
