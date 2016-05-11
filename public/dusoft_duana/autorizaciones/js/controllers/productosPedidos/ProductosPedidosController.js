
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

            $scope.hola = "q";
            $scope.Empresa = Empresa.get();

            that.buscarPedidosCliente = function(termino, paginando) {
                $scope.hola = termino;
            };

            $scope.onBuscarPedido = function(ev, termino_busqueda) {
                if (ev.which === 13) {
                    that.buscarPedidosCliente(termino_busqueda);
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


            $scope.lista_pedidos_clientes = {
                data: 'Empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'clinte', displayName: 'Cliente / Farmacia', width: "60%"},
                    {field: 'numero_pedido', displayName: 'Pedido', width: "10%"},
                    {field: 'estado', displayName: 'Estado', width: "15%"},
                    {field: 'fecha', displayName: 'Fecha', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" disabled ng-disabled="row.entity.separado"  ng-click="onAbrirVentana(row.entity)">\n\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\
                                     </div>'
                    }
                ]

            };

            /**
             * +Descripcion: metodo para pasar a la ventana detalle
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {ventana}
             */
            that.mostrarDetalle = function(pedido) {
                localStorageService.add("pedidoCabecera",
                        {
                            numeroPedido: pedido.get_numero_pedido(),
//                            pedidoClinteFarmacia: documentoAprobado.getPrefijo()
                        });
                $state.go("AutorizacionesDetalle");
            };

            $scope.onAbrirVentana = function(pedido) {
                that.mostrarDetalle(pedido);
            };
           
           
            that.traerPedidos();

        }]);
});