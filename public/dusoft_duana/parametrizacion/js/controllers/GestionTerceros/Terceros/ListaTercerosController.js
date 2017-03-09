define(["angular", 
    "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('ListaTercerosController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal) {
                     
            var self = this;
            
            $scope.root = {};
            var self = this;
            
            
            $scope.listaTerceros = {
                data: 'usuarios',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: true,
                columnDefs: [
                    {field: 'nombre_usuario', displayName: 'Nombre'},
                    {field: 'usuario', displayName: 'Identificación'},
                    {field: 'usuario', displayName: 'Dirección'}
                ]

            };
            
            
            $scope.onIrVistaGuardarTercero = function(){
                console.log(">>>>>>>>>>>>>>>>>>>")
                $state.go("GuardarTercero");
                
            };

            

        }]);
        
});
