define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('InduccionController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario', 'EmpresaInduccion', 'CentroUtilidadInduccion', 'BodegaInduccion', 'ProductoInduccion',
                function ($scope, $rootScope, Request, API, AlertService, Usuario, EmpresaInduccion, CentroUtilidadInduccion, BodegaInduccion, ProductoInduccion) {

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
                        var empresa = $scope.root.empresaSeleccionada;
                        var obj = {
                            session: $scope.session,
                            data: {
                                listarBodegas: {
                                    pagina: 2,
                                    empresaId: empresa.getCodigo(),
                                    centroUtilidadId: empresa.getCentroUtilidadSeleccionado().getCodigo()
                                }
                            }
                        };
                        console.log("bodega scope:", $scope.root);
                        Request.realizarRequest(API.INDUCCION.LISTAR_BODEGAS, "POST", obj, function (data) {


                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);

                                for (var i in data.obj.listar_Bodega) {
                                    var bodega = BodegaInduccion.get(data.obj.listar_Bodega[i].descripcion, data.obj.listar_Bodega[i].bodega);
                                    empresa.getCentroUtilidadSeleccionado().agregarBodega(bodega);
                                }
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };
                    var getProducto;
                    $scope.paginaactual = 1;
                    that.listarProducto = function (callback) {

//                        if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
//                            $scope.paginaactual = 1;
//                        }
                        var empresa = $scope.root.empresaSeleccionada;

                        var obj = {
                            session: $scope.session,
                            data: {
                                listarProducto: {
                                    pagina: $scope.paginaactual,
                                    empresaId: empresa.getCodigo(),
                                    centroUtilidadId: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                                    bodegaId: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().getCodigo(),
                                    nombreProducto: $scope.termino_busqueda
                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_PRODUCTOS, "POST", obj, function (data) {
                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);
                                empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().vaciarProducto();
                                for (var i in data.obj.listar_Producto) {
                                    var obj = data.obj.listar_Producto[i];
                                    var producto = ProductoInduccion.get(obj.descripcion,obj.centro_utilidad);
                                    empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().agregarProducto(producto);
                                    getProducto = empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().getProducto();
                                    $scope.renderProductos(data.obj);
                                }
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };

                    ////
                  $scope.buscarProductos = function(termino_busqueda, paginando) {
                
                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                if (empresa.getCodigo() === "") {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar una empresa");
                    return;
                }


                Request.realizarRequest(
                        API.INDUCCION.LISTAR_PRODUCTOS,
                        "POST",
                        {
                            session: $scope.session,
                            data: {
                                listarProducto: {
                                    pagina: $scope.paginaactual,
                                    empresaId: empresa.getCodigo(),
                                    centroUtilidadId: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                                    bodegaId: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().getCodigo(),
                                    nombreProducto: $scope.termino_busqueda
                                }
                            }
                        },
                function(data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = $scope.termino_busqueda;
                        $scope.renderProductos(data.obj, paginando);
                    }
                }
                );
            };

            $scope.renderProductos = function(data, paginando) {


                $scope.items = data.listar_Producto.length;
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.EmpresasProductos = [];
                $scope.paginas = (data.listar_Producto.length / 10);
                $scope.items = data.listar_Producto.length;
                
                for (var i in data.listar_Producto) {
                    var obj = data.listar_Producto[i];
                    
                    var producto = ProductoInduccion.get(
                            obj.descripcion,
                            obj.centro_utilidad
                    );
                        
               //     producto.get(obj.tipo_producto_id);
                }

            };

                    /////


                    $scope.onSeleccionarEmpresa = function () {

                        that.listarCentroUtilidad(function () {

                        });
                    };

                    $scope.onSeleccionarCentroUtilidad = function () {

                        that.listarBodegas(function () {

                        });
                    };

                    $scope.onSeleccionarProducto = function () {

                        that.listarProducto(function () {

                        });
                    };


                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

                    that.init(empresa, function () {
                        that.listarEmpresas(function (estado) {
                            if (estado) {
                            }
                        });
                    })

                    $scope.paginaAnterior = function () {
                        if ($scope.paginaactual === 1)
                            return;
                        $scope.paginaactual--;
                        that.listarProducto(function () {
                        });
                    };

                    $scope.paginaSiguiente = function () {
                        $scope.paginaactual++;
                        that.listarProducto(function () {
                        });
                    };

                    $scope.lista_productos_movimientos = {
                        data: 'root.empresaSeleccionada.centroUtilidadSeleccionado.getBodegaSeleccionado().getProducto()',
                        multiSelect: false,
                        enableHighlighting: true,
                        enableRowSelection: false,
                        filterOptions: $scope.filterOptions,
                        showFilter: true,
                        //sortInfo: {fields: ['fecha'], directions: ['desc']},
                        columnDefs: [
                            {field: 'codigo_producto', displayName: 'CODIGO PRODUCTO', width: "15%"},
                            {field: 'existencia', displayName: 'EXISTENCIA', width: "85%"}
                        ]
                    };
                }]);
});
