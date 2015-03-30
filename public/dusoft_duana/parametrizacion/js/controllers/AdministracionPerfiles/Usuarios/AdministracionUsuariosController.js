
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AdministracionUsuariosController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$state", "AlertService", "UsuarioParametrizacion","$filter","Usuario",
        function(
                $scope, $rootScope, Request, $modal,
                API, socket, $timeout, $state,
                 AlertService, UsuarioParametrizacion, $filter, Usuario) {
                     
            var self = this;
            
            $scope.rootUsuario = {
                
            };
            
            $scope.rootUsuario.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

             
            $scope.opciones_archivo = new Flow();
            //$scope.opciones_archivo.target = API.ORDENES_COMPRA.SUBIR_ARCHIVO_PLANO;
            $scope.opciones_archivo.testChunks = false;
            $scope.opciones_archivo.singleFile = true;
            $scope.opciones_archivo.query = {
                session: JSON.stringify($scope.rootUsuario.session)
            };
            
            $scope.abrir = false;
            var fechaActual = new Date();
            
            
            self.inicializarUsuarioACrear = function() {
                $scope.rootUsuario.usuarioAGuardar = UsuarioParametrizacion.get();
            };
            
            
            $scope.onVolver = function(){
                $state.go("ListarUsuarios");
            };
            
            
            $scope.onGuardarUsuario = function(){
                console.log("usuario a guardar ",$scope.rootUsuario.usuarioAGuardar);
            };
           // $scope.fecha = $filter('date')(fechaActual, "yyyy-MM-dd");
            
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootUsuarios = {};
                $scope.$$watchers = null;
            });
            
        }]);
});