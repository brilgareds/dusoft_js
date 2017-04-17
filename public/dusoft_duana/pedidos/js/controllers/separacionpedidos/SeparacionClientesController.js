//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionClientesController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "$state",
        "PedidoAuditoria", "Cliente","SeparacionService",
        "EmpresaPedido", "Usuario",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, $state,
                PedidoAuditoria,Cliente, SeparacionService,
                EmpresaPedido, Usuario) {


            var self = this;

            self.init = function(callback) {
                $scope.rootSeparacionClientes = {};
                $scope.rootSeparacionClientes.paginaActual = 1;
                $scope.rootSeparacionClientes.terminoBusqueda = "";
                $scope.rootSeparacionClientes.empresa = EmpresaPedido;
                $scope.rootSeparacionClientes.filtroPedido = {};
                callback();
            };

            
            /*
             * @Author: Eduar
             * @param {Boolean} esTemporal
             * +Descripcion: Trae los pedidos asignados al tercero o los que estan en separacion
             */
            self.traerPedidosAsignados = function(esTemporal, callback) {
                var filtro = {};
                filtro.estado = (esTemporal)? {temporales : true} : {asignados : true};
                var empresa = Usuario.getUsuarioActual().getEmpresa(); 
               
                filtro.estado.empresa = {
                    empresaId:empresa.getCodigo(),
                    centroUtilidad:empresa.getCentroUtilidadSeleccionado().getCodigo(),
                    bodega:empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                };
                
                console.log("filtro pára buascar cliente ", filtro);
                SeparacionService.traerPedidosAsignadosClientes($scope.root.session, filtro,
                $scope.rootSeparacionClientes.paginaActual, $scope.rootSeparacionClientes.terminoBusqueda, function(pedidos){
                    if(pedidos && pedidos.length > 0){
                        //console.log("$scope.rootSeparacionClientes.empresa", $scope.rootSeparacionClientes.empresa);
                        EmpresaPedido.setPedidos(pedidos);
                        
                     
                        
                    }
                });
                
                
            };
            

            /*
             * @Author: Eduar
             * +Descripcion: Funcion utilizada para destruir las referencias del controlador ejemplo la variable rootSeparacionClientes
             */
            $scope.$on('$destroy', function iVeBeenDismissed() {
                EmpresaPedido.vaciarPedidos();
                $scope.rootSeparacionClientes = null;
            });


            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  clientes y pedidos temporales clientes
             */
            $scope.pedidos = {
                data: 'rootSeparacionClientes.empresa.getPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'numero_pedido', displayName: 'Pedido No',width:100},
                    {field: 'cliente.nombre_tercero', displayName: 'Cliente', 
                        cellClass: "ngCellText",
                        cellTemplate: '<div>{{row.entity.cliente.getTipoId()}} {{row.entity.cliente.getId()}} - {{row.entity.cliente.nombre_tercero}}</div>'},
                    {field: 'cantidadProductos', displayName: 'Productos', width:100},
                    {field: 'Detalle', width: "5%",
                        displayName: "Detalle",
                        cellClass: "txt-center",
                        cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="detallePedido(row.entity, rootSeparacionClientes.filtroPedido)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'

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
                $scope.rootSeparacionClientes.filtroPedido = {temporal:$scope.root.esTemporal};
                self.traerPedidosAsignados($scope.root.esTemporal, function(){
                    
                });
            });

        }]);
});
