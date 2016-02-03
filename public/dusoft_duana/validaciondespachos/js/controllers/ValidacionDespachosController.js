define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ValidacionDespachosController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'EmpresaAprobacionDespacho', 'CentroUtilidadInduccion', 'BodegaInduccion', 'ProductoInduccion','AprobacionDespacho',
                "$timeout", "$filter","localStorageService","$state",
                function($scope, $rootScope, Request, API, AlertService, Usuario,
                        EmpresaAprobacionDespacho, CentroUtilidadInduccion, BodegaInduccion, ProductoInduccion, AprobacionDespacho,
                        $timeout, $filter,localStorageService,$state) {

                    var that = this;
                    var bodegaSS = 0;
                    $scope.paginaactual = 1;
                    var producto = 0;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    $scope.codigo_empresa_id = '';
                    var fecha_actual = new Date();
                    
                    $scope.datos_view = {
                        termino_busqueda_proveedores: "",
                        fecha_inicial_aprobaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                        fecha_final_aprobaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                    };
                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                    that.init = function(empresa, callback) {
                        $scope.root = {};
                        $scope.root.empresaSeleccionada = EmpresaAprobacionDespacho.get("TODAS LAS EMPRESAS", -1);
                        $scope.root.empresaNombre;
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };
                        $scope.documentosAprobados = [];
                        that.centroUtilidad = [];

                        callback();

                        


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

                        Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
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
                            var _empresa = EmpresaAprobacionDespacho.get(empresas[i].razon_social, empresas[i].empresa_id);
                            $scope.empresas.push(_empresa);
                        }
                    };

                   


                   

                 that.listarDespachosAprobados = function(){
                        
                         if ($scope.datos_view.ultima_busqueda_cotizaciones !== $scope.datos_view.termino_busqueda_cotizaciones) {
                             $scope.datos_view.pagina_actual_cotizaciones = 1;
                         }

                        var obj = {
                            session: $scope.session,
                            data: {
                                validacionDespachos: {
                                    empresa_id: $scope.codigo_empresa_id,
                                    fecha_inicial: $filter('date')($scope.datos_view.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                                    fecha_final: $filter('date')($scope.datos_view.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                                    termino_busqueda: $scope.datos_view.termino_busqueda_cotizaciones,
                                    pagina_actual: $scope.datos_view.pagina_actual_cotizaciones
                                    
                                }
                            }
                        };
                           
                        Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_DESPACHOS_APROBADOS, "POST", obj, function(data) {

                            if (data.status === 200) {
                               
                               that.renderListarDespachosAprobados(data);
                               
                            } else {
                                AlertService.mostrarMensaje("warning", data.msj)
                            }
                        });
                    
                    };
                    
                   
                    that.renderListarDespachosAprobados = function(data){
                        
                          for (var i in data.obj.validacionDespachos) {
                            var _documento = data.obj.validacionDespachos[i];
                            var documento = AprobacionDespacho.get(1, _documento.prefijo, _documento.numero, _documento.fecha_registro);
                            documento.setCantidadCajas(_documento.cantidad_cajas);
                            documento.setCantidadNeveras(_documento.cantidad_neveras);
                            documento.setCantidadNeveras(_documento.cantidad_neveras);
                            documento.setObservacion(_documento.observacion);
                            documento.setRazonSocial(_documento.razon_social);
                            documento.setUsuario(_documento.nombre);
                           $scope.documentosAprobados.push(documento);
                        }
                        
                       
                    }
                    
                    
 

                    //////////////////////////// 

                    that.onGenerarPdfRotulo = $rootScope.$on("onGenerarPdfRotulo", function(e, paginaactual, empresa, centroUtilidad, bodega, producto) {
                        $scope.onImprimirRotulo(paginaactual, empresa, centroUtilidad, bodega, producto);
                    });

                  
                  
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

                 

                    /*
                     * funcion ejecuta listarBodegas
                     * @returns {lista Bodegas}
                     */
                    $scope.onSeleccionarCentroUtilidad = function() {
                        that.listarBodegas(function() {

                        });
                    };

                    /*
                  

                    /*
                     * funcion asigana variable global bodegaSS a 1
                     * @returns {lista Producto}
                     */
                    $scope.onSeleccionarTodas = function() {
                        bodegaSS = 1;
                    };

                    that.init(empresa, function() {
                       
                        that.listarEmpresas(function(estado) {
                            
                            if (estado) {
                            }
                        });
                        
                        that.listarDespachosAprobados();
                    })

                    /*
                     * funcion para paginar anterior
                     * @returns {lista datos}
                     */
                    $scope.paginaAnterior = function() {
                        if ($scope.paginaactual === 1)
                            return;
                        $scope.paginaactual--;
                       
                    };

                    /*
                     * funcion para paginar siguiente
                     * @returns {lista datos}
                     */
                    $scope.paginaSiguiente = function() {
                        $scope.paginaactual++;
                       
                    };
                    
                    $scope.detalleDespachoAprobado = function(documentoAprobado) {

                          localStorageService.add("validacionEgresosDetalle", {documentoAprobado: documentoAprobado});
                          $state.go('ValidacionEgresosDetalle');
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

                  
                     $scope.listaAprobaciones = {
                        data: 'documentosAprobados',
                         enableColumnResize: true,
                         enableRowSelection: false,
                         enableCellSelection: true,
                         enableHighlighting: true,
                        columnDefs: [
                            //{field: 'getRazonSocial()', displayName: 'Empresa', width:"20%"},
                            {field: 'prefijo', displayName: 'prefijo', width:"25%"},
                            {field: 'numero', displayName: 'Numero', width:"25%"},
                            {field: 'fecha_registro', displayName: 'Fecha Registro', width:"40%"},
                            /*{field: 'getCantidadCajas()', displayName: 'Cantidad cajas', width:"4%"},
                            {field: 'getCantidadNeveras()', displayName: 'Cantidad neveras', width:"4%"},
                            {field: 'estado', displayName: 'Estado', width:"5%"},
                            {field: 'observacion', displayName: 'Observacion', width:"30%"},
                            {field: 'getUsuario()', displayName: 'Usuario', width:"10%"},*/
                            {field: 'detalle', width: "10%",
                                displayName: "Opciones",
                                cellClass: "txt-center",
                                cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="detalleDespachoAprobado(row.entity, rootSeparacionFarmacias.filtroPedido)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'

                            }
                        ]
                    };

                   
                   
               $scope.abrir_fecha_inicial = function($event) {

                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.datos_view.datepicker_fecha_inicial = true;
                    $scope.datos_view.datepicker_fecha_final = false;

                };

                $scope.abrir_fecha_final = function($event) {

                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.datos_view.datepicker_fecha_inicial = false;
                    $scope.datos_view.datepicker_fecha_final = true;

                };

                }]);
});
