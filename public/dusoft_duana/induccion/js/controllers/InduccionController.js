define(["angular", "js/controllers", "models/EmpresaInduccion", "models/CentroUtilidadesInduccion","models/BodegasInduccion"], function(angular, controllers) {

    controllers.controller('InduccionController', ['$scope', 'Usuario', "Request",
                                                   "localStorageService","$modal", 
                                                   "API", "EmpresaInduccion", 
                                                   "CentroUtilidadesInduccion","BodegasInduccion",
        function($scope, Usuario, Request, 
                 localStorageService, $modal, API, 
                 EmpresaInduccion, CentroUtilidadesInduccion,BodegasInduccion) {
           
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.empresaSeleccionada;
            $scope.centroUtilidadSeleccionado;
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

                    $scope.empresas = [];

                    for (var i in data.obj.listar_empresas) {

                        var _empresa = data.obj.listar_empresas[i];
                        var empresa = EmpresaInduccion.get(_empresa.razon_social, _empresa.id);

                        $scope.empresas.push(empresa);


                    }
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
            $scope.seleccionarCentroUtilidadesEmpresa = function(id_empresa) {


                for (var i in $scope.empresas) {

                    if ($scope.empresas[i].getCodigo() === id_empresa) {
                        $scope.empresaSeleccionada = $scope.empresas[i];
                        break;
                    }
                }

                Request.realizarRequest(
                        API.INDUCCION.LISTAR_CENTRO_UTILIDADES,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                induccion: {
                                    id_empresa: $scope.empresaSeleccionada.getCodigo(),
                                }
                            }
                        },
                function(data) {

                    for (var i in data.obj.listar_centro_utilidad) {

                        var _centroUtilidad = data.obj.listar_centro_utilidad[i];
                        var centroUtilidad = CentroUtilidadesInduccion.get(_centroUtilidad.centro_utilidad, _centroUtilidad.descripcion);

                        $scope.empresaSeleccionada.agregarCentroUtilidad(centroUtilidad);

                    }
                   
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
            $scope.seleccionarBodegas = function(centros_utilidad) {

               
               $scope.empresaSeleccionada.seleccionarCentroUtilidad(centros_utilidad);
               var centroUtilidadSeleccionado = $scope.empresaSeleccionada.getCentroUtilidadSeleccionado();
                Request.realizarRequest(
                        API.INDUCCION.LISTAR_BODEGAS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                induccion: {
                                   
                                   centros_utilidad: centroUtilidadSeleccionado.getNombre()
                                }
                            }
                        },
                function(data) {
                    
                     for (var i in data.obj.listar_bodegas) {

                        var _Bodega = data.obj.listar_bodegas[i];
                        
                        var bodega = BodegasInduccion.get(_Bodega.bodega, _Bodega.descripcion);
                      
                        centroUtilidadSeleccionado.agregarBodega(bodega);
    
                    }
                  
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
