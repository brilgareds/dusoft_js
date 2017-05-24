define(["angular", 
    "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('GuardarProveedorController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal) {
                     
            var self = this;
            
            $scope.root = {

            };
            
            var self = this;
            
            $scope.root.tiposPago = [
                {descripcion: "Abono"},
                {descripcion: "Cheque"}
            ];
            
            /**
            * @author Eduar Garcia
            * +Descripcion handler del boton crear provedor o el boton de editar proveedor
            * @params obj: {pagina, termino_busqueda}
            * @fecha 2017-03-15
            */
            $scope.onIrVistaGuardarProveedor = function(){
                $state.go("GuardarProveedor");
            };
            
            $scope.onBtnCancelar = function(){
                $state.go("Terceros");
            };

        }]);
        
});
