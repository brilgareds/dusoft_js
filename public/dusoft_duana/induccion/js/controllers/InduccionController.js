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
                "ProductoInduccion", "AlertService",
                function($scope, $rootScope, Usuario, Request,
                        localStorageService, $modal, API,
                        EmpresaInduccion, CentroUtilidadesInduccion, BodegasInduccion, ProductoInduccion, AlertService) {

                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                    var that = this;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    
                    
                    //se valida que el usuario tenga centro de utilidad y bodega
                    //  $scope.personAsync = {selected : empresa};
                    // console.log(empresa.getNombre())
                    if (!empresa) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una empresa valida para consultar productos", tipo: "warning"});
                    } else if (!empresa.getCentroUtilidadSeleccionado()) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene un centro de utilidad valido para para consultar productos.", tipo: "warning"});
                    } else if (!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una bodega valida para consultar productos", tipo: "warning"});
                    }

                    
                    var centroUtilidad  = empresa.getCentroUtilidadSeleccionado();
                    var bodega = centroUtilidad.getBodegaSeleccionada();
                    $scope.root = {};
                    $scope.root.empresaSeleccionada = EmpresaInduccion.get(empresa.getNombre(), empresa.getCodigo());
                    
                    $scope.root.empresaSeleccionada.setCentroUtilidadSeleccionado(
                            CentroUtilidadesInduccion.get(centroUtilidad.getNombre(),centroUtilidad.getCodigo())
                     ).getCentroUtilidadSeleccionado().setBodegaSeleccionada(BodegasInduccion.get(bodega.getNombre(),bodega.getCodigo()))
                        
                    $scope.bodegaSeleccionada = null;
                    $scope.buscar = {descripcion: ''};
                    that.paginaactual = 1;
                  
 
                    /*
                     * 
                     * @param {type} selected
                     * @Author: Dusoft
                     * +Descripcion: metodo el cual se encarga de cargar el combobox
                     * empresa con todas las empresas disponibles
                     */
                    $scope.onListarEmpresa = function() {


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
                    
                 //   that.empresas = function()
                    
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
                    $scope.onSeleccionarEmpresa = function() {

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
                            $scope.root.empresaSeleccionada.agregarCentroUtilidad(centroUtilidad);

                        }
                    };

                    /*
                     * 
                     * @param {type} selected
                     * @Author: Cristian Ardila
                     * +Descripcion: metodo el cual se encarga de cargar el combobox
                     * con los centros de utilidades disponibles segun la empresa
                     */
                    $scope.onSeleccionarUtilidad = function() {
                        $scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado().vaciarBodegas()

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

                            $scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado().agregarBodega(bodega);


                        }
                    };



                    $scope.onListarProductos = function() {

                        that.paginaactual = 1;
                        that.listarProductos();
                    }
                    /*
                     * 
                     * @param {type} selected
                     * @Author: Dusoft
                     * +Descripcion: metodo el cual se encarga de cargar el el grid
                     * de productos
                     */
                    that.listarProductos = function() {

                        var empresaSeleccionada = $scope.root.empresaSeleccionada;


                        if (!empresaSeleccionada) {
                            AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa")



                        } else {
                            var centroUtilidadSeleccionado = empresaSeleccionada.getCentroUtilidadSeleccionado();
                            //   console.log($scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado())
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
                                                        pagina: that.paginaactual
                                                    }
                                        }
                                    };
                                    Request.realizarRequest(API.INDUCCION.LISTAR_PRODUCTOS, "POST", obj, function(data) {
                                        bodegaSeleccionada.vaciarProductos();
                                        $scope.productos = [];

                                        if (data.status === 200) {
                                            if (data.obj.listar_productos.length === 0) {
                                                that.paginaactual = 1;
                                            } else {
                                                that.renderListarProductos(data);
                                            }
                                        } else {
                                            AlertService.mostrarMensaje("warning", data.msj)
                                        }

                                    });

                                }

                            }

                        }


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

                            $scope.root.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegaSeleccionada().agregarProducto(producto);


                        }
                    };

                    $scope.onListarEmpresa();

                    $scope.listaProductos = {
                        data: 'root.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getProductos()',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        columnDefs: [
                            {field: 'getIva()', displayName: 'Iva', width: "35%"},
                            {field: 'getCosto()', displayName: 'Costo', width: "25%"},
                            {field: 'getPrecioVenta()', displayName: 'Venta', width: "10%"},
                            {field: 'getCodigoProducto()', displayName: 'Codigo producto', width: "10%"},
                            {field: 'getDescripcion()', displayName: 'Descripcion', width: "10%"},
                            {field: 'getExistencia()', displayName: 'Existencia', width: "10%"},
                            {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                                cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="confirmar_eliminar_documento_planilla(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                            }
                        ]
                    };
                    
                    $scope.onBuscarProductos = function($event){
                        
                        if($event.which === 13){
                             that.listarProductos();
                        }
                        
                        
                    }
                    //  $scope.listarProductos();

                    $scope.paginaAnterior = function() {
                        if (that.paginaactual === 1)
                            return;
                        that.paginaactual--;
                        that.listarProductos()
                        //buscarProductos(descripcion);..
                    };

                    $scope.paginaSiguiente = function() {
                        that.paginaactual++;
                        that.listarProductos()
                    };
                    
                    
                    that.listarProductos();
                }]);




});
