
define(["angular", "js/controllers", 'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('AutorizacionDetalleController', [
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
            var filtroPedido = localStorageService.get("pedidoCabecera");
            
            $scope.hola = "q";
            $scope.Empresa = Empresa.get();
            $scope.pedido=filtroPedido.numeroPedido;

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
           
           
         
           
           
           $scope.lista_detalle_pedidos = {
                data: 'Empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'esado', displayName: 'Estado', width: "10%"},
                    {field: 'producto', displayName: 'Pruducto', width: "45%"},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%"},
                    {field: 'fecha', displayName: 'Fecha', width: "10%"},
                    {field: 'responsable', displayName: 'Responsable', width: "20%"},
                    {
                        displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Estado<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li ng-if="row.entity.get_estado_cotizacion() != \'0\' " ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_modificar_cotizaciones }}" ng-click="modificar_cotizacion_cliente(row.entity)" >Aprobar</a></li>\
                                                <li ng-if="row.entity.get_estado_cotizacion() != \'0\' " ><a href="javascript:void(0);"  ng-click="solicitarAutorizacion(row.entity)" >Denegar</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]

            };
            
            
             /**
             * +Descripcion: metodo para volver a la ventana inicial
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {ventana}
             */
            that.volverAPedido = function() {
                $state.go("AutorizacionesProductos");
            };

            $scope.onVolver = function() {
                console.log("WERTY");
                that.volverAPedido();
            };
           
           
           
            that.traerPedidos();

        }]);
});