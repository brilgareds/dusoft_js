define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('InduccionController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario', 'EmpresaInduccion', 'CentroUtilidadInduccion',
                function ($scope, $rootScope, Request, API, AlertService, Usuario, EmpresaInduccion, CentroUtilidadInduccion) {

                    var that = this;
/////////////////////////////////////////////////
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
//////////////////////////listar empresas ///////////////////
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

                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };
///////////////////////////////listar centros utilidad/////////////////////
                    that.listarCentroUtilidad = function (callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listarCentroUtilidad: {
                                    empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_CENTROS_UTILIDAD, "POST", obj, function (data) {

                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);
                                for (var i in data.obj.listarCentroUtilidad) {
                                    var centroUtilidades = CentroUtilidadInduccion.get(data.obj.listarCentroUtilidad[i].descripcion, data.obj.listarCentroUtilidad[i].centro_utilidad);
                                    $scope.root.empresaSeleccionada.agregarCentroUtilidad(centroUtilidades);
                                }
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };
///////////////////////////////////////////////////////
///////////////////////////////listar bodegas/////////////////////
                    that.listarCentroUtilidad = function (callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listarBodega: {
                                   // empresaId: $scope.root.centroUtilidadSeleccionada.getCodigo(),
                                    centroUtilidad: $scope.root.centroUtilidadSeleccionada.getCodigo(),
                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_CENTROS_UTILIDAD, "POST", obj, function (data) {

                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);
                                for (var i in data.obj.listarCentroUtilidad) {
                                    var centroUtilidades = CentroUtilidadInduccion.get(data.obj.listarCentroUtilidad[i].descripcion, data.obj.listarCentroUtilidad[i].centro_utilidad);
                                    $scope.root.empresaSeleccionada.agregarCentroUtilidad(centroUtilidades);
                                }
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };
///////////////////////////////////////////////////////
                    $scope.onSeleccionarEmpresa = function () {
                        that.listarCentroUtilidad(function () {
                        });
                    };
//////////////////////////////////////////////////////////
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
/////////////////////////////////////////////////////////               
                    that.init(empresa, function () {
                        that.listarEmpresas(function (estado) {
                            if (estado) {
                                that.listarCentroUtilidad(function () {
                                });
                            }
                        });
                    })
                    
                    
                    
////////////////////////////////
                }]);
});
