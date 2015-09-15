define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('InduccionController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario', 'EmpresaInduccion', 'CentroUtilidadInduccion','BodegaInduccion',
                function ($scope, $rootScope, Request, API, AlertService, Usuario, EmpresaInduccion, CentroUtilidadInduccion,BodegaInduccion) {

                    var that = this;


                    that.init = function (empresa, callback) {
                        $scope.root = {};
                        $scope.root.empresaSeleccionada = EmpresaInduccion.get(empresa.getNombre(), empresa.getCodigo());
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };

                        that.centroUtilidad = [];

                        callback();
                    };

                    /**
                     * +Descripcion:
                     * @author:
                     * @fecha:
                     * @param {type} callback
                     * @returns {void}
                     */
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
                            $scope.empresas = [];
                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);

                                for (var i in data.obj.listar_empresas) {
                                    var _empresa = EmpresaInduccion.get(data.obj.listar_empresas[i].razon_social, data.obj.listar_empresas[i].empresa_id);
                                    $scope.empresas.push(_empresa);
                                }
                                console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE:", data.obj.listar_empresas);
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };




                    that.listarCentroUtilidad = function (callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listarCentroUtilidad: {
                                    empresaId: $scope.root.empresaSeleccionada.getCodigo()

                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_CENTROS_UTILIDAD, "POST", obj, function (data) {
                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);

                                for (var i in data.obj.listar_CentroUtilidad) {
                                    var centroUtilidades = CentroUtilidadInduccion.get(data.obj.listar_CentroUtilidad[i].descripcion, data.obj.listar_CentroUtilidad[i].centro_utilidad);
                                    $scope.root.empresaSeleccionada.agregarCentroUtilidad(centroUtilidades);
                                }


                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };


                    that.listarBodegas = function (callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listarBodegas: {
                                    pagina: 1
//                                    empresaId: $scope.root.empresaSeleccionada.getCodigo()
//                                    empresaId: $scope.root.empresaSeleccionada.centroUtilidadSeleccionado.getCodigo(),
                                            // centroUtilidad: $scope.root.centroUtilidadSeleccionado.getCodigo(),
                                }
                            }
                        };
                                console.log("bodega scope:", $scope.root);
                        Request.realizarRequest(API.INDUCCION.LISTAR_BODEGAS, "POST", obj, function (data) {
                            
                            var empresa=$scope.root.empresaSeleccionada;
//                            console.log("bodega BBBBBBBBBBBBBBBBBBBBBBBBBB:", empresa.centroUtilidadSeleccionado());
                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);

                                for (var i in data.obj.listar_Bodega) {
                                    var bodega = BodegaInduccion.get(data.obj.listar_Bodega[i].descripcion, data.obj.listar_Bodega[i].centro_utilidad);
                                    empresa.getCentroUtilidadSeleccionado().agregarBodega(bodega);
                                }
                              

                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };
                    
                    
                    $scope.onSeleccionarEmpresa = function () {

                        that.listarCentroUtilidad(function () {

                        });
                    };
                    
                    $scope.onSeleccionarCentroUtilidad= function () {

                        that.listarBodegas(function () {

                        });
                    };


                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

                    that.init(empresa, function () {

                        that.listarEmpresas(function (estado) {

                            if (estado) {
                               

                            }
                        });
                    })

                }]);



});