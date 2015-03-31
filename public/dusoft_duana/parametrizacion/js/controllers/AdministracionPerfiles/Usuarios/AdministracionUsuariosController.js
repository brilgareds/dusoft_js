
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AdministracionUsuariosController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "UsuarioParametrizacion","$filter","Usuario",
        function(
                $scope, $rootScope, Request, $modal,
                API, socket, $timeout, 
                 AlertService, UsuarioParametrizacion, $filter, Usuario) {
                     
            $scope.rootUsuarios = {
                
            };
            
            $scope.rootUsuarios.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

             
            $scope.opciones_archivo = new Flow();
            //$scope.opciones_archivo.target = API.ORDENES_COMPRA.SUBIR_ARCHIVO_PLANO;
            $scope.opciones_archivo.testChunks = false;
            $scope.opciones_archivo.singleFile = true;
            $scope.opciones_archivo.query = {
                session: JSON.stringify($scope.rootUsuarios.session)
            };
            
            $scope.abrir = false;
            var fechaActual = new Date();
            
            
           // $scope.fecha = $filter('date')(fechaActual, "yyyy-MM-dd");
            
            
        }]);
});