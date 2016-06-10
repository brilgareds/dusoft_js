define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ReportesController', ['$scope', 'Usuario', "Request", "localStorageService", "API", "AlertService", "$modal",
        function($scope, Usuario, Request, localStorageService, API, AlertService, $modal) {

            var that = this;
            $scope.root = {};

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
             that.init = function(callback) {  
                callback();
            };

             /**
             * +Descripcion: obtener configuracion de reportes
             * @author Andres M Gonzalez
             * @fecha: 09/06/2016
             * @returns {objeto}
             */
            that.listarReportes = function() {                
                var obj = {
                    session: $scope.root.session,
                    data: {
                        configuracion: {
                            reporte: "DR"
                        }
                    }
                };
                Request.realizarRequest(
                        API.ADMIN.OBTENER_REPORTES,
                        "POST",
                        obj,
                        function(data) {
                            if (data.status === 200) {
                                console.log("OBTENER_REPORTES",data);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        }
                );
            };
            
              that.init(function() {
                that.listarReportes();
            });    
            

        }]);
});
