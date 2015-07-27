define(["angular", "js/controllers",
    "models/EmpresaInduccion",
    "models/CentroUtilidadesInduccion",
    "models/BodegasInduccion",
    "models/ProductoInduccion"], function(angular, controllers) {

    controllers.controller('InduccionController',
            ['$scope', '$rootScope', 'Usuario', "Request",
                "localStorageService", "$modal",
                "API", "EmpresaInduccion",
                "CentroUtilidadesInduccion", "BodegasInduccion",
                "ProductoInduccion", "AlertService", "$state", "InduccionService",
                function($scope, $rootScope, Usuario, Request,
                        localStorageService, $modal, API,
                        EmpresaInduccion, CentroUtilidadesInduccion, BodegasInduccion, ProductoInduccion, AlertService, $state, InduccionService) {

                    var that = this;
                    //$rootScope.$emit("evento", {foo:"bar"});

                    //         console.log(InduccionService)
                    /*
                     * @param 
                     * {Object} empresa: 
                     * {Object} centroUtilidad:
                     * {Object} bodega:
                     * {function} callback: 
                     * @Author: Cristian Ardila
                     * +Descripcion: metodo el cual se encarga de inicializar
                     * las variables encargadas de cargar la view
                     */
                    that.init = function(empresa, centroUtilidad, bodega, callback) {

                        $scope.root = {};
                        $scope.root.empresaSeleccionada = EmpresaInduccion.get(empresa.getNombre(), empresa.getCodigo());

                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };

                        $scope.buscar = {descripcion: ''};
                        that.paginaactual = 1;

                        $scope.root.empresaSeleccionada.setCentroUtilidadSeleccionado(
                                CentroUtilidadesInduccion.get(centroUtilidad.getNombre(), centroUtilidad.getCodigo())
                                ).getCentroUtilidadSeleccionado().setBodegaSeleccionada(BodegasInduccion.get(bodega.getNombre(), bodega.getCodigo()));
                        callback();
                    }

                    /*
                     * 
                     * @param {N/N}
                     * @Author: Cristian Ardila
                     * +Descripcion: metodo el cual se encarga de cargar el combobox
                     * empresa con todas las empresas disponibles
                     */
                    $scope.onListarEmpresa = function() {
                        that.traerEmpresas(function() {
                        });
                    };

                    /**
                     * 
                     * @param {function} callback
                     * @Author: Cristian Ardila
                     * @returns {void}
                     * +Descripcion: funcion encargada de ejecutar la peticion
                     * al servidos para consultar las empresas activas
                     */
                    that.traerEmpresas = function(callback) {

                        var obj = {
                            session: $scope.session,
                            data: {induccion: {}}
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_EMPRESAS, "POST", obj, function(data) {

                            $scope.empresas = [];
                            if (data.status === 200) {
                                that.renderListarEmpresa(data);
                                callback();
                            } else {
                                AlertService.mostrarMensaje("warning", data.msj)
                            }
                        });
                    };

                    /**
                     * 
                     * @param {JSON} data
                     * @returns {void}
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
                     * @param {N/N} 
                     * @Author: Cristian Ardila
                     * @returns {void}
                     * +Descripcion: metodo handler el cual se comunicara con la
                     * vista y carga el combobox con los centros de utilidades 
                     * disponibles segun la empresa
                     */
                    $scope.onSeleccionarEmpresa = function() {
                        that.traerCentroUtilidad(function() {
                        });
                    };

                    /**
                     * @param {function} callback
                     * @Author: Cristian Ardila
                     * @returns {void}
                     * +Descripcion: funcion encargada de ejecutar las peticiones
                     * al servidor y traer todos los centros de utilidad disponibles
                     * segun la empresa
                     */
                    that.traerCentroUtilidad = function(callback) {
                        $scope.root.empresaSeleccionada.vaciarCentroUtilidad();
                        var obj = {
                            session: $scope.session,
                            data: {
                                induccion: {
                                    idempresa: $scope.root.empresaSeleccionada.getCodigo(),
                                }
                            }
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_CENTRO_UTILIDADES, "POST", obj, function(data) {

                            if (data.status === 200) {
                                that.renderCentroUtilidad(data);
                                callback();
                            } else {
                                AlertService.mostrarMensaje("warning", data.msj)
                            }

                        });
                    }

                    /**
                     * 
                     * @param {JSON} data
                     * @Author: Cristian Ardila
                     * @returns {void}
                     * +Descripcion: funcion que procesara la informacion de la 
                     * lista de centros de utilidad de formato JSON y la mapeara con la
                     * entidad CentroUtilidadInduccion.js
                     */
                    that.renderCentroUtilidad = function(data) {

                        for (var i in data.obj.listar_centro_utilidad) {

                            var _centroUtilidad = data.obj.listar_centro_utilidad[i];
                            var centroUtilidad = CentroUtilidadesInduccion.get(_centroUtilidad.descripcion, _centroUtilidad.centro_utilidad);
                            $scope.root.empresaSeleccionada.agregarCentroUtilidad(centroUtilidad);

                        }
                    };

                    /*
                     * 
                     * @param {N/N} 
                     * @Author: Cristian Ardila
                     * @returns {void}
                     *+Descripcion: metodo handler el cual se comunicara con la
                     * vista y carga el combobox con las bodegas disponibles
                     * segun el centro de utilidad
                     */
                    $scope.onSeleccionarUtilidad = function() {
                        $scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado().vaciarBodegas()
                        that.traerBodega(function() {

                        });
                    };

                    /**
                     * 
                     * @param {function} callback
                     * @Author: Cristian Ardila
                     * @returns {void}
                     * +Descripcion: funcion encargada de ejecutar las peticiones
                     * al servidor y traer todas las bodegas disponibles segun
                     * el centro de utilidad
                     */
                    that.traerBodega = function(callback) {

                        var centroUtilidadSeleccionado = $scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado()
                        var obj = {
                            session: $scope.session,
                            data: {
                                induccion: {
                                    centros_utilidad: centroUtilidadSeleccionado.getCodigo()
                                }
                            }
                        };
                        Request.realizarRequest(API.INDUCCION.LISTAR_BODEGAS, "POST", obj, function(data) {

                            if (data.status === 200) {
                                that.renderListarBodega(data);
                                callback();
                            } else {
                                AlertService.mostrarMensaje("warning", data.msj)
                            }
                        });
                    }
                    /**
                     * 
                     * @param {JSON} data:
                     * @Author: Cristian Ardila
                     * @returns {void}
                     * +Descripcion: funcion que procesara la informacion de la 
                     * lista de bodegas de formato JSON y la mapeara con la
                     * entidad BodegasInduccion.js
                     */
                    that.renderListarBodega = function(data) {

                        for (var i in data.obj.listar_bodegas) {

                            var _Bodega = data.obj.listar_bodegas[i];

                            var bodega = BodegasInduccion.get(_Bodega.descripcion, _Bodega.bodega);

                            $scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado().agregarBodega(bodega);


                        }
                    };

                    /*
                     * 
                     * @param {type} selected
                     * @Author: Cristian Ardila
                     * @returns {void}
                     *+Descripcion: metodo handler el cual se comunicara con la
                     * vista y carga el componente gridview
                     */
                    $scope.onListarProductos = function() {

                        that.paginaactual = 1;
                        that.traerProductos(function() {

                        });
                    }

                    /*
                     * 
                     * @param {type} selected
                     * @Author: Cristian Ardila
                     * @returns {void}
                     * +Descripcion: metodo el cual se encarga ejecutar 
                     * las peticiones al servidor y traer los productos
                     */
                    that.traerProductos = function(callback) {

                        var empresaSeleccionada = $scope.root.empresaSeleccionada;

                        if (!empresaSeleccionada) {
                            AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa")

                        } else {
                            var centroUtilidadSeleccionado = empresaSeleccionada.getCentroUtilidadSeleccionado();

                            if (!centroUtilidadSeleccionado) {

                                AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad")

                            } else {

                                var bodegaSeleccionada = centroUtilidadSeleccionado.getBodegaSeleccionada();

                                if (!bodegaSeleccionada) {

                                    AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega")
                                } else {


                                    var obj = {
                                        session: $scope.session,
                                        data: {
                                            induccion:
                                                    {
                                                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                                                        centroUtilidad: centroUtilidadSeleccionado.getCodigo(),
                                                        bodega: bodegaSeleccionada.getCodigo(),
                                                        descripcion: $scope.buscar.descripcion,
                                                        pagina: that.paginaactual,
                                                        codigoProducto: ''
                                                    }
                                        }
                                    };

                                    InduccionService.consultarDetalleProducto(
                                            API.INDUCCION.LISTAR_PRODUCTOS,
                                            obj,
                                            function(data) {
                                                bodegaSeleccionada.vaciarProductos();
                                                if (data.status === 200) {

                                                    if (data.obj.listar_productos.length === 0) {
                                                        that.paginaactual = 1;
                                                    } else {
                                                        that.renderListarProductos(data);
                                                        callback();

                                                    }
                                                } else {
                                                    AlertService.mostrarMensaje("warning", data.msj)
                                                }

                                            }
                                    );
                                    /*      Request.realizarRequest(API.INDUCCION.LISTAR_PRODUCTOS, "POST", obj, function(data) {
                                     
                                     bodegaSeleccionada.vaciarProductos();
                                     $scope.productos = [];
                                     
                                     if (data.status === 200) {
                                     console.log(data.obj.listar_productos.length)
                                     if (data.obj.listar_productos.length === 0) {
                                     that.paginaactual = 1;
                                     } else {
                                     that.renderListarProductos(data);
                                     callback();
                                     }
                                     } else {
                                     AlertService.mostrarMensaje("warning", data.msj)
                                     }
                                     });*/
                                }//Llave que cierra el ELSE que valida la (bodegaSeleccionada)

                            }//Llave que cierra el ELSE que valida el(centroUtilidadSeleccionado)

                        }//Llave que cierra el ELSE que valida la (empresaSeleccionada)

                    };//Llave que cierra la funcion


                    /**
                     * 
                     * @param {JSON} data
                     * @author Cristian Ardila
                     * @returns {void}
                     * +Descripcion: funcion que procesara la informacion de la 
                     * lista de bodegas de formato JSON y la mapeara con la
                     * entidad BodegasInduccion.js
                     */
                    that.renderListarProductos = function(data) {

                        for (var i in data.obj.listar_productos) {

                            var _producto = data.obj.listar_productos[i];

                            var producto = ProductoInduccion.get(_producto.codigo_producto, _producto.descripcion, _producto.existencia);

                            producto.setIva(_producto.porc_iva).setCosto(_producto.costo).setPrecioVenta(_producto.precio_venta);

                            $scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegaSeleccionada().agregarProducto(producto);


                        }
                    };


                    $scope.detalleProducto = function(producto) {


                        var empresaSeleccionada = $scope.root.empresaSeleccionada;
                        var centroUtilidadSeleccionado = empresaSeleccionada.getCentroUtilidadSeleccionado();
                        var bodegaSeleccionada = centroUtilidadSeleccionado.getBodegaSeleccionada();

                        var obj = {
                            url: API.INDUCCION.LISTAR_PRODUCTOS,
                            data: {
                                induccion:
                                        {
                                            empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                                            centroUtilidad: centroUtilidadSeleccionado.getCodigo(),
                                            bodega: bodegaSeleccionada.getCodigo(),
                                            descripcion: $scope.buscar.descripcion,
                                            pagina: 1,
                                            codigoProducto: producto.codigo_producto
                                        }
                            }
                        };

                        console.log("producto ", producto.codigo_producto, " obj ", obj);
                        localStorageService.set("productoInduccion", obj);
                        $state.go("DetalleProductos");

                    };


                    $scope.retornarPaginaInicio = function() {

                        $state.go("ListarProductos");
                    };


                    /**
                     * @author Cristian Ardila
                     * +Descripcion: objeto ng-grid
                     */
                    $scope.gridListaProductos = {
                        data: 'root.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getProductos()',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        columnDefs: [
                            {field: 'getIva()', displayName: 'Iva', width: "15%"},
                            {field: 'getCosto()', displayName: 'Costo', width: "10%"},
                            {field: 'getPrecioVenta()', displayName: 'Venta', width: "10%"},
                            {field: 'getCodigoProducto()', displayName: 'Codigo producto', width: "15%"},
                            {field: 'getDescripcion()', displayName: 'Descripcion', width: "25%"},
                            {field: 'getExistencia()', displayName: 'Existencia', width: "15%"},
                            {field: 'getExistencia()',
                                displayName: "Detalle",
                                cellClass: "txt-center",
                                cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="detalleProducto(row.entity)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'

                            }
                        ]
                    };

                    /** 
                     * @param {keypress} $event
                     * @author Cristian Ardila
                     * @returns {void}
                     * +Descripcion: function que se invoca al digitar la tecla 
                     * enter en el campo de texto (buscar producto)
                     */
                    $scope.onBuscarProductos = function($event) {

                        if ($event.which === 13) {
                            that.traerProductos(function() {

                            });
                        }
                    };

                    /**
                     * @param {N/N}
                     * @author Cristian Ardila
                     * @returns {int} paginaactual
                     * +Descripcion: funcion que se invoca al presionar click
                     * en el boton izquiero (<) del paginador del gridview
                     * y aumentara en 1 la pagina actual, refrescando la gridview
                     * de los productos
                     */
                    $scope.paginaAnterior = function() {
                        if (that.paginaactual === 1)
                            return;
                        that.paginaactual--;
                        that.traerProductos(function() {
                        });
                    };

                    /**
                     * @param {N/N}
                     * @author Cristian Ardila
                     * @returns {int} paginaactual
                     * +Descripcion: funcion que se invoca al presionar click
                     * en el boton derecho (>) del paginador del gridview
                     * y aumentara en 1 la pagina actual, refrescando la gridview
                     * de los productos
                     */
                    $scope.paginaSiguiente = function() {
                        that.paginaactual++;
                        that.traerProductos(function() {
                        });
                    };


                    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                        $scope.root = {};
                        $scope.$$watchers = null;
                    });


                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    //console.log(empresa)
                    var centroUtilidad;
                    var bodega;
                    if (!empresa) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una empresa valida para consultar productos", tipo: "warning"});

                    } else if (!empresa.getCentroUtilidadSeleccionado()) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene un centro de utilidad valido para para consultar productos.", tipo: "warning"});

                    } else if (!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una bodega valida para consultar productos", tipo: "warning"});

                    } else {


                        centroUtilidad = empresa.getCentroUtilidadSeleccionado();
                        bodega = empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()
                        console.log(bodega);
                        that.init(empresa, centroUtilidad, bodega, function() {
                            that.traerEmpresas(function() {
                                that.traerCentroUtilidad(function() {
                                    that.traerBodega(function() {
                                        that.traerProductos(function() {
                                        });
                                    });
                                });
                            });
                        });
                    }


                }]);

});
