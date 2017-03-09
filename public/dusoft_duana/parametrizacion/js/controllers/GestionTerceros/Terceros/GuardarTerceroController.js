define(["angular", 
    "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('GuardarTerceroController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal) {
                     
            var self = this;
            
            $scope.root = {
                tiposNaturaleza:[
                    {
                        codigo:"0",
                        descripcion:"Natural"
                    },
                    {
                        codigo:"1",
                        descripcion:"Juridica"
                    }
                ]
            };
            
            $scope.root.tipoNaturaleza =  $scope.root.tiposNaturaleza[0];
            
            var self = this;
            
            $scope.onCambiarNaturaleza = function(){
                console.log("tipo naturaleza ", $scope.root.tipoNaturaleza);
            };

            

        }]);
        
});
