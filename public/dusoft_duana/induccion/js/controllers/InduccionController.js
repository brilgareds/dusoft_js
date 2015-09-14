define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('InduccionController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario','EmpresaInduccion',
                function ($scope, $rootScope, Request, API, AlertService, Sesion, EmpresaInduccion) {

                    var that = this;

                    $scope.session = {
                        usuario_id: Sesion.getUsuarioActual().getId(),
                        auth_token: Sesion.getUsuarioActual().getToken()
                    };
                   that.empresas = [];
                 
                    that.listarEmpresas = function (callback) {


                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_empresas: {
                                    pagina: 1

                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_EMPRESAS, "POST", obj, function (data) {
                           
                         
                            if (data.status === 200) {

                                AlertService.mostrarMensaje("info", data.msj);
                                $scope.empresas = data.obj.listar_empresas;
                               
                                for(var i in data.obj.listar_empresas){
                                   // console.log("Empresas ", data.obj.listar_empresas[i].razon_social);
                                     var empresas  = EmpresaInduccion.get(data.obj.listar_empresas[i].razon_social,data.obj.listar_empresas[i].empresa_id);
                                       
                                       that.empresas.push(empresas)
                                }
                                callback(true);
                            } else {


                                callback(false);
                            }
                        });

                    };


                    that.listarEmpresas(function(estado) { 
                            
                            if(estado){
                                console.log("IMPRIMA CENTROS DE UTILIDAD", that.empresas[0].getCodigo())
                            }else{
                                console.log("INTENTE DE NUEVO")
                            }
                    });
                }]);

});
