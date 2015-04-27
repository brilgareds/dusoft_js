
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AdministracionController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$modalInstance", "operario", "accion", "AlertService", "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, $modalInstance, operario, accion, AlertService, Usuario) {


            $scope.titulo_modulo= "Administracion de Operarios de Bodega";
            $scope.operario = angular.copy(operario);
            $scope.operario.activo = Boolean(Number(operario.estado));
            $scope.usuarios = [];
            $scope.usuario = {};
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


            $scope.listado_usuarios = {
                data: 'usuarios',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: true,
                 afterSelectionChange:function(rowItem){
                     rowItem.entity.seleccionado = rowItem.selected;
                     $scope.loginSeleccionado(rowItem.entity);
                },
                columnDefs: [
                    {field: 'nombre_usuario', displayName: 'Nombre'},
                    {field: 'usuario', displayName: 'Usuario'}
                ]

            };

            
            
            $modalInstance.opened.then(function() {
                $timeout(function(){
                    
                    $scope.session = {
                          usuario_id: Usuario.getUsuarioActual().getId(),
                          auth_token: Usuario.getUsuarioActual().getToken()
                     };

                     Request.realizarRequest(API.USUARIOS.LISTAR_USUARIOS, "POST", { session: $scope.session, data: { lista_usuarios : { termino_busqueda: '' , estado_registro : '1' } }}, function(data) {

                         var lista_usuarios = data.obj.lista_usuarios;

                         $scope.usuarios = [];

                         var data = data.obj;
                         for (var i in lista_usuarios) {

                             var obj = lista_usuarios[i];

                             var usuario = {id: obj.usuario_id, nombre_usuario: obj.nombre, usuario: obj.usuario, estado: obj.activo};
                             
                             
                             if(usuario.id === $scope.operario.usuario_id){
                                 usuario.seleccionado = true;
                                 $scope.usuario = usuario;
                             }

                             $scope.usuarios.push(usuario);
                         }
                     });
                }, 400);
                
           });
            

            $scope.realizarAccion = function() {
                if (accion == '1') {
                    $scope.modificarOperario();
                } else {
                    $scope.crearOperario();
                }
            };


            $scope.crearOperario = function() {

                Request.realizarRequest(API.TERCEROS.CREAR_OPERARIOS, "POST", { session: $scope.session, data: { operario : $scope.operario }} , function(data) {

                    if (data.status === 500) {
                        $scope.alert = true;
                        $scope.msg = data.msj;

                    }
                    if (data.status === 200) {
                        $rootScope.$emit('listarOperariosBodega', data);
                        $scope.close();
                        AlertService.mostrarMensaje("success", "Operario creado correctamente!");
                    }
                });

            };

            $scope.modificarOperario = function() {

                Request.realizarRequest(API.TERCEROS.MODIFICAR_OPERARIOS, "POST", { session: $scope.session, data: { operario : $scope.operario }} , function(data) {
                    if (data.status === 500) {
                        $scope.alert = true;
                        $scope.msg = data.msj;
                    }
                    if (data.status === 200) {
                        $rootScope.$emit('listarOperariosBodega', data);
                        $scope.close();
                        AlertService.mostrarMensaje("success", "Operario modificado correctamente!");
                    }
                });
            };
            
            $scope.loginSeleccionado = function(usuario){
                $scope.operario.usuario_id = usuario.id;
                $scope.usuario = usuario;
            };
            
            $scope.onEstadoChange = function(){
                $scope.operario.estado = Number($scope.operario.activo);
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


            
        }]);
});