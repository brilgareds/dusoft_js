define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('GuardarTutorialController', ['$scope', '$rootScope', 'AlertService', 'Usuario', "$timeout",
        "$filter", "localStorageService",
        "$state", "$modalInstance",
        "socket", "TutorialH", "TiposTutorial",
        "API", "Request",
        function ($scope, $rootScope, AlertService, Usuario, $timeout,
                $filter, localStorageService, $state, $modalInstance, socket, TutorialH, TiposTutorial,
                API, Request) {
                    
            var self = this;
            
            
            $modalInstance.result.then(function() {
                $scope.root = null;

            }, function() {
            });
            
            self.init = function(){
                
                $scope.root = {
                    session: {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    },
                    tiposTutoriales : [
                        TiposTutorial.get("0", "Videos")
                       // TiposTutorial.get("1", "Archivos")
                    ],
                    tutorial:TutorialH.get(),
                    files: []
                };
            };
            
           /**
            * @author Eduar Garcia
            * +Metodo que consume el api para subir el archivo
            * @fecha 02-06-2017
            */
            self.subirArchivo = function(){
                var fd = new FormData();
                fd.append("file", $scope.root.files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify( 
                    {
                        tutoriales: {
                            tutorial : $scope.root.tutorial,
                            empresa_id : Usuario.getUsuarioActual().getEmpresa().getCodigo()
                        }
                    }
                ));
                
                Request.subirArchivo(API.TUTORIALES.SUBIR_ARCHIVO_TUTORIAL, fd, function(respuesta) {
                    $scope.close();
                });
            };
           
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de guardar tutorial
            * @fecha 02-06-2017
            */
            $scope.onGuardarTutorial = function() {
                
                var tag = $scope.root.tutorial.getTag();
                
               /* if(!tag.match(/^#/)){
                    $scope.root.tutorial.setTag("#"+tag);
                }*/
                
                var obj = {
                    session: $scope.root.session,
                    data:{
                        tutoriales: {
                            tutorial : $scope.root.tutorial,
                            empresa_id : Usuario.getUsuarioActual().getEmpresa().getCodigo()
                        }
                    }
                };

                Request.realizarRequest(API.TUTORIALES.GUARDAR_TUTORIAL, "POST", obj, function(data) {
                                        
                    if(data.status === 200){
                        $scope.root.tutorial.setId(data.obj.tutorial[0]);
                        $scope.root.tutorial.setUsuarioId(Usuario.getUsuarioActual().getId());
                        self.subirArchivo();
                    } else if(data.status !== 500) {
                         AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error...");
                    }
                    
                });

            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de subir archivo
            * @fecha 02-06-2017
            */
            $scope.onArchivoSeleccionado = function(files) {
                
               
                $scope.root.files = files;
                
            };
         
            $scope.close = function () {
                $modalInstance.close();
            };

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                $scope.root = null;
            });
            
            
            self.init();

        }
 
    ]);

});