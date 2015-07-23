define(["angular", "js/controllers",
    "models/EmpresaInduccion",
    "models/CentroUtilidadesInduccion",
    "models/BodegasInduccion",
    "models/ProductoInduccion"], function(angular, controllers) {

    controllers.controller('InduccionController',
            ['$scope', 'Usuario', "Request",
                "localStorageService", "$modal",
                "API", "EmpresaInduccion",
                "CentroUtilidadesInduccion", "BodegasInduccion",
                "ProductoInduccion", "AlertService",
                function($scope, Usuario, Request,
                        localStorageService, $modal, API,
                        EmpresaInduccion, CentroUtilidadesInduccion, BodegasInduccion, ProductoInduccion, AlertService) {

                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                    var that = this;
                    $scope.empresaSeleccionada;
                    $scope.centroUtilidadSeleccionado;
                    $scope.bodegaSeleccionada;

                    /*
                     * 
                     * @param {type} selected
                     * @Author: Dusoft
                     * +Descripcion: metodo el cual se encarga de cargar el combobox
                     * empresa con todas las empresas disponibles
                     */
                    $scope.listarEmpresa = function() {

                        var obj = {
                            session: $scope.session,
                            data: {induccion: {}}
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_EMPRESAS, "POST", obj, function(data) {

                            $scope.empresas = [];
                            if (data.status === 200) {
                                that.renderListarEmpresa(data);
                            } else {
                                  AlertService.mostrarMensaje("warning", data.msj)
                            }
                        });
                    };

                    /**
                     * 
                     * @param {type} data
                     * @returns {undefined}
                     * +Descripcion: funcion que procesara la informacion de la 
                     * lista de empresas de formato JSON y la mapeara con la
                     * entidad EmpresaInduccion.js
                     */
                    that.renderListarEmpresa = function(data) {

                        for (var i in data.obj.listar_empresas) {

                            var _empresa = data.obj.listar_empresas[i];
                            var empresa = EmpresaInduccion.get(_empresa.razon_social, _empresa.empresa_id);

                            $scope.empresas.push(empresa);
                        }
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
                        var obj = {
                            session: $scope.session,
                            data: {
                                induccion: {
                                    idempresa: $scope.empresaSeleccionada.getCodigo(),
                                }
                            }
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_CENTRO_UTILIDADES, "POST", obj, function(data) {

                            if (data.status === 200) {
                                that.renderCentroUtilidad(data);
                            } else {
                                 AlertService.mostrarMensaje("warning", data.msj)
                            }

                        });
                    };
                    /**
                     * 
                     * @param {type} data
                     * @returns {undefined}
                     * +Descripcion: funcion que procesara la informacion de la 
                     * lista de centros de utilidad de formato JSON y la mapeara con la
                     * entidad CentroUtilidadInduccion.js
                     */
                    that.renderCentroUtilidad = function(data) {

                        for (var i in data.obj.listar_centro_utilidad) {

                            var _centroUtilidad = data.obj.listar_centro_utilidad[i];
                            var centroUtilidad = CentroUtilidadesInduccion.get(_centroUtilidad.descripcion, _centroUtilidad.centro_utilidad);
                            $scope.empresaSeleccionada.agregarCentroUtilidad(centroUtilidad);

                        }
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
                        $scope.centroUtilidadSeleccionado = $scope.empresaSeleccionada.getCentroUtilidadSeleccionado()
                        
                        var obj = {
                            session: $scope.session,
                            data: {
                                induccion: {
                                    centros_utilidad: $scope.centroUtilidadSeleccionado.getCodigo()
                                }
                            }
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_BODEGAS, "POST", obj, function(data) {

                            if (data.status === 200) {
                                that.renderListarBodega(data);
                            } else {
                                 AlertService.mostrarMensaje("warning", data.msj)
                            }
                        });
                    };

                    /**
                     * 
                     * @param {type} data
                     * @returns {undefined}
                     * +Descripcion: funcion que procesara la informacion de la 
                     * lista de bodegas de formato JSON y la mapeara con la
                     * entidad BodegasInduccion.js
                     */
                    that.renderListarBodega = function(data) {

                        for (var i in data.obj.listar_bodegas) {

                            var _Bodega = data.obj.listar_bodegas[i];
                            
                            var bodega = BodegasInduccion.get(_Bodega.descripcion, _Bodega.bodega);
                           
                            $scope.empresaSeleccionada.getCentroUtilidadSeleccionado().agregarBodega(bodega);
               
                        }
                    };
                    /*
                     * 
                     * @param {type} selected
                     * @Author: Dusoft
                     * +Descripcion: metodo el cual se encarga de cargar el combobox
                     * empresa con todas las empresas disponibles
                     */
                    $scope.listarProductos = function() {
                       
                        $scope.empresaSeleccionada.getCentroUtilidadSeleccionado().seleccionarBodega('03');
                      
                        var obj = {
                            session: $scope.session,
                            data: {induccion:
                                        {
                                            empresaId: $scope.empresaSeleccionada.getCodigo(),
                                            centroUtilidad: $scope.centroUtilidadSeleccionado.getCodigo(),
                                            bodega: $scope.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegaSeleccionado().getCodigo(),
                                            descripcion: 'aceta'
                                        }
                            }
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_PRODUCTOS, "POST", obj, function(data) {

                            $scope.productos = [];
                            if (data.status === 200) {
                                that.renderListarProductos(data);
                            } else {
                                AlertService.mostrarMensaje("warning", data.msj)
                            }

                        });

                    };

                    /**
                     * 
                     * @param {type} data
                     * @returns {undefined}
                     * +Descripcion: funcion que procesara la informacion de la 
                     * lista de bodegas de formato JSON y la mapeara con la
                     * entidad BodegasInduccion.js
                     */
                    that.renderListarProductos = function(data) {

                        for (var i in data.obj.listar_productos) {

                            var _producto = data.obj.listar_productos[i];

                            var producto = ProductoInduccion.get(_producto.codigo_producto, _producto.descripcion, _producto.existencia);

                            producto.setIva(_producto.porc_iva).setCosto(_producto.costo).setPrecioVenta(_producto.precio_venta);

                            $scope.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegaSeleccionado().agregarProducto(producto);
                              
                           
                        }
                    };
                    $scope.listarEmpresa();
                    //  $scope.listarProductos();


                }]);
});
