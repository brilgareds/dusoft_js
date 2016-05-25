
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

            /**
             * +Descripcion: funcion para cambiar estado al producto
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {}
             */
            that.denegarPedidos = function(estado) {
                $scope.hola = estado;
            };
            
            /**
             * +Descripcion: evento para cambiar estado al producto
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {}
             */
            $scope.onEstdoPedido = function(ev, estado) {
               that.denegarPedidos(estado);                
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
             */
           $scope.lista_detalle_pedidos = {
                data: 'Empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'estado', displayName: 'Estado', width: "10%"},
                    {field: 'producto', displayName: 'Pruducto', width: "40%"},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%"},
                    {field: 'fecha', displayName: 'Fecha', width: "10%"},
                    {field: 'responsable', displayName: 'Responsable', width: "20%"},
                    {
                        displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Estado<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a  ng-click="onEstdoPedido(1)" >Aprobar</a></li>\
                                                <li><a  ng-click="onEstdoPedido(0)" >Denegar</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]

            };
            
            
             /**
             * +Descripcion: funcion para volver a la pagina principal
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {ventana}
             */
            that.volverAPedido = function() {
                $state.go("AutorizacionesProductos");
            };
            
            /**
             * +Descripcion: evento de la vista para volver a la pagina principal 
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             */
            $scope.onVolver = function() {
                that.volverAPedido();
            };
           
            that.traerPedidos();

        }]);
});