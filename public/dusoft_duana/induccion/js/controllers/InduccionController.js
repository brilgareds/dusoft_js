define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('InduccionController', ['$scope', 'Usuario', "Request", "localStorageService", "$modal", "API",
        function($scope, Usuario, Request, localStorageService, $modal, API) {

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /*
             * 
             * @param {type} selected
             * @Author: Dusoft
             * +Descripcion: metodo el cual se encarga de cargar el combobox
             * empresa con todas las empresas disponibles
             */
            $scope.listarEmpresa = function() {
                
                Request.realizarRequest(
                        API.INDUCCION.LISTAR_EMPRESAS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                induccion: {
                                }
                            }
                        },
                function(data) {

                    $scope.empresas = data.obj.listar_empresas;
                }
                );
                    
            };
            /*
             * 
             * @param {type} selected
             * @Author: Cristian Ardila
             * +Descripcion: metodo el cual se encarga de cargar el combobox
             * con los centros de utilidades disponibles segun la empresa
             */
            $scope.selectActionCntroUtliddsEmprsa = function(id_empresa) {


                Request.realizarRequest(
                        API.INDUCCION.LISTAR_CENTRO_UTILIDADES,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                induccion: {
                                    id_empresa: id_empresa,
                                }
                            }
                        },
                function(data) {


                    $scope.centroUtilidad = data.obj.listar_centro_utilidad;

                }
                );
            };


            /*
             * 
             * @param {type} selected
             * @Author: Cristian Ardila
             * +Descripcion: metodo el cual se encarga de cargar el combobox
             * con los centros de utilidades disponibles segun la empresa
             */
            $scope.selectActionBodegas = function(centros_utilidad) {

                Request.realizarRequest(
                        API.INDUCCION.LISTAR_BODEGAS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                induccion: {
                                    centros_utilidad: centros_utilidad,
                                }
                            }
                        },
                function(data) {

                    $scope.bodega = data.obj.listar_bodegas;
                }
                );
            };


            $scope.listarEmpresa();





            $scope.title = "Prueba";
            $scope.empleados = [
                {
                    nombre: 'Ana',
                    paterno: 'uzman',
                    materno: 'uzman',
                    primerDia: new Date(),
                    salario: 12000,
                    telefono: '55968569563',
                    bono: 1.456986
                },
                {
                    nombre: 'Adrian',
                    paterno: 'lopez',
                    materno: 'pez',
                    primerDia: new Date(),
                    salario: 12000,
                    telefono: '55968569563',
                    bono: 1.456986
                },
                {
                    nombre: 'Manuel',
                    paterno: 'rdila',
                    materno: 'roches',
                    primerDia: new Date(),
                    salario: 18000,
                    telefono: '55968569563',
                    bono: 1.456986
                },
            ];

            $scope.ordenarPor = function(orden) {

                $scope.ordenSeleccionado = orden;
            };















        }]);
});
