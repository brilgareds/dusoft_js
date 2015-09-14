//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers", 
    'includes/slide/slideContent', 'controllers/separacionpedidos/SeparacionFarmaciasController',
    'controllers/separacionpedidos/SeparacionClientesController'], function(angular, controllers) {

    var fo = controllers.controller('ContenedorSeparacionController', [
        '$scope', '$rootScope', 'Usuario', 'Request', 'API',
        "socket", "AlertService", "$modal","$state","SeparacionService",
        "localStorageService","EmpresaPedido",
        function($scope, $rootScope, Usuario, Request,
                API, socket, AlertService, $modal,$state, SeparacionService,
                localStorageService, EmpresaPedido) {
             
             
             
            var self = this;
             
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite inicializar el controlador
             */
             self.init = function(callback){ 
                $scope.root = {};
                $scope.root.esTemporal = false;
                $scope.root.vistas = [
                    {path:"separacionclientes.html", nombre:"Asignacion Clientes", tipo:"Clientes"},
                    {path:"separacionfarmacias.html", nombre:"Asignacion Farmacias", tipo:"Farmacias"},
                    {path:"separacionclientes.html", nombre:"Temporales Clientes", tipoTemporal:"Clientes"},
                    {path:"separacionfarmacias.html", nombre:"Temporales Farmacias", tipoTemporal:"Farmacias"}
                ];
                
                $scope.root.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                callback();
             };
             
            /*
             * @Author: Eduar
             * @param {String} vista
             * @param {Boolen} esTemporal
             * +Descripcion: Funcion privada que permite llamar el view apartir del parametro esTemporal
             */
             self.modificarVista = function(esTemporal){
                $scope.root.esTemporal = esTemporal;
                $scope.root.vista.fullPath = "views/separacionpedidos/"+$scope.root.vista.path+"?time=" + new Date().getTime();
             };
             
            /*
             * @Author: Eduar
             * @param {String} vista
             * @param {Boolen} esTemporal
             * +Descripcion: Handler de los dropdown de los tabs de navegacion
             */
             $scope.onCambiarVista = function(vista, esTemporal){
                $scope.root.vista = vista;
                self.modificarVista(esTemporal); 
             };
             
             self.init(function(){
                $scope.root.vista = $scope.root.vistas[0];
                 
                self.modificarVista(false);     
             });
             
           /**
             * +Descripcion: Conduce a la vista encargada de separar los productos
             * @param {type} producto
             */
            $scope.detallePedido = function(pedido, filtroPedido) {
                filtroPedido.numeroPedido = pedido.get_numero_pedido();
                filtroPedido.tipoPedido  = pedido.getTipo();
                EmpresaPedido.setPedidoSeleccionado(pedido);
                localStorageService.set("pedidoSeparacion", filtroPedido);
                $state.go("SeparacionProducto");
            };
            
            

            /**
             * +Descripcion: Conduce a la vista principal 
             * @param {type} producto
             */
            $scope.retornarPaginaInicio = function() {

                $state.go("SeparacionPedidos");
            };

             /*
             * @Author: Eduar
             * +Descripcion: Evento que se dispara cuando la url cambia, es util liberar memoria en este punto
             */
             $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.root = {};
                $scope.$$watchers = null;
            });


        }]);
});
