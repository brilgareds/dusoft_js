
define(["angular", "js/controllers", "js/models", "js/directive/renderusuarios"], function(angular, controllers) {

    controllers.controller('AdministracionController', ['$scope', '$rootScope', '$http', '$modal', 'API',
        "socket", "$timeout", "$modalInstance", "operario", "accion", "AlertService", 
        function($scope, $rootScope, $http, $modal, API, socket, $timeout, $modalInstance, operario, accion,AlertService) {


            $scope.operario = angular.copy(operario);
            $scope.usuarios = [];

            $scope.alert = false;
            $scope.msg = "";


            if (accion == '1') {
                $scope.titulo = "Modificar Operario de Bodega";
                $scope.label_btn = "Modificar";
                $scope.operario.estado = operario.estado;
            } else {
                $scope.titulo = "Crear Operario de Bodega";
                $scope.label_btn = "Crear";
                $scope.operario.estado = '1';
            }

            $scope.realizarRequest = function(url, method, params, callback) {

                // console.log(params)

                var requestObj = {method: method, url: url}

                if (method == "GET") {
                    requestObj.params = params;
                } else {
                    requestObj.data = params;
                    requestObj.headers = {'Content-Type': 'application/json'};
                }


                $http(requestObj).success(function(data, status, headers, config) {
                    callback(data);
                }).error(function(data, status, headers, config) {
                    $scope.dialog = true;
                    $scope.msg = "Se a generado un error";
                    callback(data);
                });
            };



            $scope.loginSeleccionado = function() {

            };

            $scope.realizarAccion = function() {
                if (accion == '1') {
                    $scope.modificarOperario();
                } else {
                    $scope.crearOperario();
                }
            };


            $scope.crearOperario = function() {

                $scope.realizarRequest(API.TERCEROS.CREAR_OPERARIOS, "POST", {operario: $scope.operario}, function(data) {

                    if (data.status === 500) {
                        $scope.alert = true;
                        $scope.msg = data.msj;

                    }
                    if (data.status === 200) {
                        $rootScope.$emit('listarOperariosBodega', data);
                        $scope.close();
                        AlertService.mostrarMensaje("success","Operario creado correctamente!");
                    }
                });

            };

            $scope.modificarOperario = function() {
                
                $scope.realizarRequest(API.TERCEROS.MODIFICAR_OPERARIOS, "POST", {operario: $scope.operario}, function(data) {
                    if (data.status === 500) {
                        $scope.alert = true;
                        $scope.msg = data.msj;
                    }
                    if (data.status === 200) {
                        $rootScope.$emit('listarOperariosBodega', data);
                        $scope.close();
                        AlertService.mostrarMensaje("success","Operario modificado correctamente!");
                    }
                });
            };

            $scope.validarEstado = function() {
                return true;
            };

            $scope.close = function() {
                $modalInstance.close();
            };

            $scope.closeAlert = function() {
                $scope.alert = false;
            };

            $scope.realizarRequest(API.USUARIOS.LISTAR_USUARIOS, "GET", {estado_registro: '1'}, function(data) {

                var lista_usuarios = data.obj.lista_usuarios;

                $scope.usuarios = [];

                var data = data.obj;

                for (var i in lista_usuarios) {

                    var obj = lista_usuarios[i];

                    var usuario = {id: obj.usuario_id, nombre_usuario: obj.nombre, usuario: obj.usuario, estado: obj.activo}

                    $scope.usuarios.push(usuario);
                }

                $rootScope.$emit("datosrecibidos",$scope.usuarios);

            });


        }]);
});