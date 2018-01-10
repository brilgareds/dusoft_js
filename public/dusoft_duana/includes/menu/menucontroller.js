define(["angular", "js/controllers", "treemenu"], function(angular, controllers) {

    controllers.controller('menucontroller', ['$scope', '$rootScope', "$state", "Request","Usuario","socket",
        function($scope, $rootScope, $state,Request, Usuario, socket) {
            
            $scope.$on("nodeSelected", function(e, data) {
                
                var self = this;
                var parent = data.parent.replace( /^\D+/g, '');
                var url = data.url;
                
                
                //se valida si tiene una url
                if (url !== undefined || (url && url.length > 0)) {
                    //se valida si es un padre
                    
                    if (isNaN(parent)) {
                        url = "../" + url;
                        $scope.changelocation(url);
                        
                    } else {
                        //si no posee la propiedad parentname se coloca por default el nombre del modulo actual
                       // var parentname = (data.parentname === undefined) ? $rootScope.name : data.parentname;
                        var carpetaRaiz = data.carpetaRaiz;
                        
                        if(carpetaRaiz){
                            
                            if ($rootScope.name === carpetaRaiz) {
                                $state.go(data.url);
                            } else {
                                url = "../" + carpetaRaiz + "/#/" + url;
                                $scope.changelocation(url);
                            }
                            //se ecargar de cerrar cualquier slide que este abierto
                            $rootScope.$emit("cerrarslide", {animado:false});
                            
                        } else {
                           
                        }
                    }
                } else {
                   
                }
            });


            $scope.changelocation = function(url) {
                //el window location no deja setear el estado del menu por eso se debe cambiar con una milesima despues de hacer click
                socket.forceRemoveListener();
                var timer = setTimeout(function() {
                    window.location = url;
                    clearTimeout(timer);
                }, 100);
            };
            
            $rootScope.$on("modulosUsuario", function(e){
                
                $scope.Usuario = Usuario.getUsuarioActual();
                $scope.treedata = $scope.Usuario.getModulos();
                
                var timer = setTimeout(function(){
                    
                    $rootScope.$emit("inicializarDatosArbol");
                    clearTimeout(timer);
                }, 500);
            });
            
            
            /*Request.realizarRequest("../pages/tree.json","GET",{},function(data) {
                $scope.treedata = data;
            });*/


            $scope.titulo = "Menu de navegacion";
        }]);
});