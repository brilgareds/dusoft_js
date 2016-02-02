define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ValidacionDespachosController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'EmpresaInduccion', 'CentroUtilidadInduccion', 'BodegaInduccion', 'ProductoInduccion',
                "$timeout",
                function($scope, $rootScope, Request, API, AlertService, Usuario,
                        EmpresaInduccion, CentroUtilidadInduccion, BodegaInduccion, ProductoInduccion,
                        $timeout) {

                    var that = this;
                    var bodegaSS = 0;
                    $scope.paginaactual = 1;
                    var producto = 0;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    $scope.codigo_empresa_id = '';
                    $scope.datos_view = {
                        termino_busqueda_proveedores: ""
                    };
                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                    that.init = function(empresa, callback) {
                        $scope.root = {};
                        $scope.root.empresaSeleccionada = EmpresaInduccion.get("TODAS LAS EMPRESAS", -1);
                        $scope.root.empresaNombre;
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };

                        that.centroUtilidad = [];

                        callback();

                        $timeout(function() {
                        }, 3000);


                    };

                    /*
                     * funcion obtiene las empresas del servidor
                     * @returns {json empresas}
                     */
                    that.listarEmpresas = function(callback) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_empresas: {
                                    pagina: 1,
                                    empresaName: $scope.datos_view.termino_busqueda_empresa
                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_EMPRESAS, "POST", obj, function(data) {
                            $scope.empresas = [];
                            if (data.status === 200) {
                                AlertService.mostrarMensaje("info", data.msj);
                                that.render_empresas(data.obj.listar_empresas);
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };


                    that.render_empresas = function(empresas) {
                        for (var i in empresas) {
                            var _empresa = EmpresaInduccion.get(empresas[i].razon_social, empresas[i].empresa_id);
                            $scope.empresas.push(_empresa);
                        }
                    };

                    /*
                     * funcion obtiene las centros de utilidad del servidor
                     * @returns {json centros de utilidad}
                     */
                    that.listarCentroUtilidad = function(callback) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                listarCentroUtilidad: {
                                    empresaId: $scope.root.empresaSeleccionada.getCodigo()
                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_CENTROS_UTILIDAD, "POST", obj, function(data) {
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


                    /*
                     * funcion obtiene las Bodegas del servidor
                     * @returns {json centros de utilidad}
                     */
                    that.listarBodegas = function(callback) {

                        var empresa = $scope.root.empresaSeleccionada;
                        var obj = {
                            session: $scope.session,
                            data: {
                                listarBodegas: {
                                    pagina: 1,
                                    empresaId: empresa.getCodigo(),
                                    centroUtilidadId: empresa.getCentroUtilidadSeleccionado().getCodigo()
                                }
                            }
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_BODEGAS, "POST", obj, function(data) {


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




                    /*
                     * funcion obtiene las Productos del servidor
                     * @returns {json Productos}
                     */
                    that.listarProducto = function(callback) {

                        var empresa = $scope.root.empresaSeleccionada;

                        if (empresa.getCodigo() === -1) {
                            AlertService.mostrarMensaje("warning", "Debe seleccionar una empresa");
                            return;
                        }
                        if (bodegaSS === 0) {
                            AlertService.mostrarMensaje("warning", "Debe seleccionar una Bodega");
                            return;
                        }
                        if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                            $scope.paginaactual = 1;
                        }

                        empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().vaciarProducto();
                        var obj = {
                            session: $scope.session,
                            data: {
                                listarProducto: {
                                    pagina: $scope.paginaactual,
                                    empresaId: (empresa.getCodigo() === '-1') ? "" : empresa.getCodigo(),
                                    centroUtilidadId: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                                    bodegaId: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().getCodigo(),
                                    nombreProducto: $scope.termino_busqueda
                                }
                            }
                        };

                        Request.realizarRequest(API.INDUCCION.LISTAR_PRODUCTOS, "POST", obj, function(data) {
                            if (data.status === 200) {
                                $scope.ultima_busqueda = $scope.termino_busqueda;
                                $scope.items = data.obj.listar_Producto.length

                                if ($scope.items === 0) {
                                    if ($scope.paginaactual > 1) {
                                        $scope.paginaactual--;
                                    }
                                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                                    return;
                                } else {
                                    AlertService.mostrarMensaje("info", data.msj);
                                }
//                                
                                for (var i in data.obj.listar_Producto) {
                                    var obj = data.obj.listar_Producto[i];
                                    var producto = ProductoInduccion.get(obj.codigo_producto, obj.descripcion, '0');
                                    empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().agregarProducto(producto);
                                }
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };


                    //////////////////////////// 

                    that.onGenerarPdfRotulo = $rootScope.$on("onGenerarPdfRotulo", function(e, paginaactual, empresa, centroUtilidad, bodega, producto) {
                        $scope.onImprimirRotulo(paginaactual, empresa, centroUtilidad, bodega, producto);
                    });

                    function validar() {
                        var empresa = $scope.root.empresaSeleccionada;
                        if ((empresa.getCodigo() === '-1') ? "" : empresa.getCodigo() == "") {
                            AlertService.mostrarMensaje("info", "Seleccione la Empresa ");
                            return false;
                        }

                        try {
                            if (empresa.getCentroUtilidadSeleccionado().getCodigo() === undefined) {
                                //AlertService.mostrarMensaje("info", "Seleccione la Empresa");
                            }
                        }
                        catch (err) {
                            AlertService.mostrarMensaje("info", "Seleccione la Empresa" + err.message);
                            return false;
                        }
                        try {
                            if (empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().getCodigo() === undefined) {
                               // AlertService.mostrarMensaje("info", "Seleccione la Bodega");
                            }
                        }
                        catch (err) {
                            AlertService.mostrarMensaje("info", "Seleccione la Bodega" + err.message);
                            return false;
                        }
                        if ($scope.termino_busqueda == "") {
                            AlertService.mostrarMensaje("info", "Digite el termino de Busqueda");
                            return false;
                        }
                        return true;
                    }

                    $scope.onImprimirRotulo = function() {
                        var empresa = $scope.root.empresaSeleccionada;
                        var url = API.INDUCCION.IMPRIMIR_PRODUCTOS;
                        if (validar()) {
                            var obj = {
                                session: $scope.session,
                                data: {
                                    documento_temporal: {
                                        pagina: "",
                                        empresaId: (empresa.getCodigo() === '-1') ? "" : empresa.getCodigo(),
                                        centroUtilidadId: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                                        bodegaId: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionado().getCodigo(),
                                        nombreProducto: $scope.termino_busqueda,
                                        pdf: $scope.pdf
                                    }
                                }
                            };

                            Request.realizarRequest(url, "POST", obj, function(data) {
                                if (data.status === 200) {
                                    var nombre_reporte = data.obj.imprimir_productos.nombre_reporte;
                                    console.log("reporte generado")
                                    $scope.visualizarReporte("/reports/" + nombre_reporte, nombre_reporte, "download");
                                } else {

                                }
                            });
                        }
                    };
                    ////////////////
                    $scope.seleccionar_empresa = function(empresa) {
                        $scope.codigo_empresa_id = empresa;
                    };
                    ////////////////////////////////////        
                    /*
                     * funcion ejecuta listarCentroUtilidad
                     * @returns {lista CentroUtilidad}
                     */
                    $scope.onSeleccionarEmpresa = function(empresa_Nombre) {

                        if (empresa_Nombre.length < 3) {
                            return;
                        }
                        $scope.datos_view.termino_busqueda_empresa = empresa_Nombre;
                        that.listarEmpresas(function() {
                        });

                    };

                    $scope.seleccionar_Empresas = function(codigo_empresa_id) {
                        $scope.root.empresaSeleccionada = codigo_empresa_id;
                        that.listarCentroUtilidad(function() {
                        });
                    };

                    /*
                     * funcion ejecuta listarBodegas
                     * @returns {lista Bodegas}
                     */
                    $scope.onSeleccionarCentroUtilidad = function() {
                        that.listarBodegas(function() {

                        });
                    };

                    /*
                     * funcion ejecuta listarProducto
                     * @returns {lista Producto}
                     */
                    $scope.onSeleccionarProducto = function($event) {
                        $scope.paginaactual = 1;
                        console.log("evento: ", $event);
                        if ($event.which === 13) {
                            producto = 1;
                            that.listarProducto(function() {
                            });
                        }
                    };

                    /*
                     * funcion asigana variable global bodegaSS a 1
                     * @returns {lista Producto}
                     */
                    $scope.onSeleccionarTodas = function() {
                        bodegaSS = 1;
                    };

                    that.init(empresa, function() {
                        console.log("empresa_init::::: ", $scope.seleccionada);
                        that.listarEmpresas(function(estado) {
                            if (estado) {
                            }
                        });
                    })

                    /*
                     * funcion para paginar anterior
                     * @returns {lista datos}
                     */
                    $scope.paginaAnterior = function() {
                        if ($scope.paginaactual === 1)
                            return;
                        $scope.paginaactual--;
                        that.listarProducto(function() {
                        });
                    };

                    /*
                     * funcion para paginar siguiente
                     * @returns {lista datos}
                     */
                    $scope.paginaSiguiente = function() {
                        $scope.paginaactual++;
                        that.listarProducto(function() {
                        });
                    };

                    /*
                     * funcion asignar datos y dar formato a tabla
                     * @returns {tabla con datos}
                     */
                    $scope.lista_productos_movimientos = {
                        data: 'root.empresaSeleccionada.centroUtilidadSeleccionado.getBodegaSeleccionado().getProducto()',
                        multiSelect: false,
                        enableHighlighting: true,
                        enableRowSelection: false,
                        filterOptions: $scope.filterOptions,
                        showFilter: true,
                        sortInfo: {fields: ['descripcion'], directions: ['asc']},
                        columnDefs: [
                            {field: 'codigo_producto', displayName: 'CODIGO PRODUCTO', width: "15%"},
                            {field: 'descripcion', displayName: 'DESCRIPCIÓN', width: "85%"}
                        ]
                    };

                    /////////graficos//////
                    $scope.exampleData = [{
                            key: "Enero",
                            y: 129
                        }, {
                            key: "Febrero",
                            y: 200
                        }, {
                            key: "Marzo",
                            y: 150
                        }, {
                            key: "Abril",
                            y: 80
                        }, {
                            key: "Mayo",
                            y: 200
                        }, {
                            key: "Junio",
                            y: 120
                        }, {
                            key: "Julio",
                            y: 150
                        },
                        {
                            key: "Agosto",
                            y: 80
                        },
                        {
                            key: "Septiembre",
                            y: 90
                        },
                        {
                            key: "Octubre",
                            y: 1200
                        },
                        {
                            key: "Noviembre",
                            y: 120
                        },
                        {
                            key: "Diciembre",
                            y: 110
                        }
                    ];


                    $scope.xFunction = function() {
                        return function(d) {
                            return d.key;
                        };
                    };

                    $scope.yFunction = function() {
                        return function(d) {
                            return d.y;
                        };
                    };

                    $scope.descriptionFunction = function() {
                        return function(d) {
                            return d.key;
                        };
                    };

                    $scope.toolTipContentFunction = function() {
                        return function(key, x, y, e, graph) {
                            return  '<h4>' + key + '</h4>' +
                                    '<p>' + y + ' en ' + x + '</p>';
                        };
                    };

                    ///////////////////////

                }]);
});
