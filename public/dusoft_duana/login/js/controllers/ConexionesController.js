define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ConexionesController', ['$scope', 'Usuario', "Request", "localStorageService",
        "$modal","AlertService", "$modalInstance","conexiones",
        function($scope, Usuario, Request, localStorageService, 
                 $modal, AlertService, $modalInstance, conexiones) {
            
            $scope.root = {
                conexiones : conexiones
            };
           
            
            $scope.listaConexiones = {
                data: 'root.conexiones',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                columnDefs: [
                    {
                        field: 'device', displayName: 'Dispositvo'
                    },
                    {
                        field: 'fecha_registro', displayName: 'Fecha'
                    }
                ]

            };
            
            $scope.cerrarSesiones = function() {
                var obj = {
                    session: {
                        usuario_id: "",
                        auth_token: ""
                    },
                    data: {
                        login: {
                            conexiones:$scope.root.conexiones
                        }
                    }
                };
                Request.realizarRequest("/cerrarSesiones", "POST", obj, function(datos) {
                    if (datos.status === 200) {
                        $scope.$emit("onLogin");
                       
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", datos.msj || "Ha ocurrido un error...");
                    }
                });

            };
            
    }]);
    
});
