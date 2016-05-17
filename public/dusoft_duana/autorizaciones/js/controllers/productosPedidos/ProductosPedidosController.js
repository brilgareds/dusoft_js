
define(["angular", "js/controllers", 'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('ProductosPedidosController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Pedido", "EmpresaAutorizacion",
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Pedido, Empresa) {

            var that = this;
            $scope.Empresa = Empresa.get();


            /**
             * +Descripcion: funcion que realiza la busqueda de los pedidos
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            that.buscarPedidos = function(termino, paginando) {
                $scope.hola = termino;
            };

            /**
             * +Descripcion: evento busca pedido
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onBuscarPedido = function(ev, terminoBusqueda) {
                if (ev.which === 13) {
                    that.buscarPedidos(terminoBusqueda);
                }
            };


            that.traerPedidos = function() {
                for (var i = 1; i < 11; i++) {
                    var datos = {};
                    datos.numero_pedido = i;
                    var pedido = Pedido.get();
                    pedido.setDatos(datos);
                    $scope.Empresa.agregarPedido(pedido);
                }
            };

            /**
             * +Descripcion: objeto ng-grid
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.lista_pedidos_clientes = {
                data: 'Empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'cliente', displayName: 'Cliente / Farmacia', width: "60%"},
                    {field: 'numero_pedido', displayName: 'Pedido', width: "10%"},
                    {field: 'estado', displayName: 'Estado', width: "15%"},
                    {field: 'fecha', displayName: 'Fecha', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" disabled ng-disabled="row.entity.separado"  ng-click="onAbrirVentana(row.entity)">\n\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\
                                       </div>'
                    }
                ]

            };

            /**
             * +Descripcion: metodo para navegar a la ventana detalle
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params pedido : numero del pedido
             * @returns {ventana}
             */
            that.mostrarDetalle = function(pedido) {
                localStorageService.add("pedidoCabecera",
                        {
                            numeroPedido: pedido.get_numero_pedido(),
                        });
                $state.go("AutorizacionesDetalle");
            };

            /**
             * +Descripcion: evento de la vista para pasar a la ventana detalle
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params pedido : numero del pedido
             * @returns {ventana}
             */
            $scope.onAbrirVentana = function(pedido) {
                that.mostrarDetalle(pedido);
            };

            that.traerPedidos();

        }]);
});