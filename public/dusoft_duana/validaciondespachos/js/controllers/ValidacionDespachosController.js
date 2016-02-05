define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ValidacionDespachosController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'EmpresaAprobacionDespacho', 'CentroUtilidadInduccion', 'BodegaInduccion', 'ProductoInduccion','AprobacionDespacho',
                "$timeout", "$filter","localStorageService","$state","ValidacionDespachosService",
                function($scope, $rootScope, Request, API, AlertService, Usuario,
                        EmpresaAprobacionDespacho, CentroUtilidadInduccion, BodegaInduccion, ProductoInduccion, AprobacionDespacho,
                        $timeout, $filter,localStorageService,$state,ValidacionDespachosService) {

                var that = this;
                $scope.paginaactual = 1;
                var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                
                var fecha_actual = new Date();

                $scope.datos_view = {
                    termino_busqueda_proveedores: "",
                    fecha_inicial_aprobaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                    fecha_final_aprobaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                    prefijo: "",
                    numero: "",
                    items:0,
                    empresaSeleccionada: ''

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
                 * @author Cristian Ardila
                 * @fecha 05/02/2016
                 * +Descripcion funcion obtiene las empresas del servidor invocando
                 *              el servicio listarEmpresas de 
                 *              (ValidacionDespachosSerivice.js)
                 * @returns {json empresas}
                 */
                that.listarEmpresas = function(callback) {

                   ValidacionDespachosService.listarEmpresas($scope.session,$scope.datos_view.termino_busqueda_empresa, function(data){
                         
                      $scope.empresas = [];      
                      if (data.status === 200) {

                            that.render_empresas(data.obj.listar_empresas);
                            callback(true);
                       }else{
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

                   
                /**
                 * @author Cristian Ardila
                 * @fecha 04/02/2016
                 * +Descripcion Metodo encargado de invocar el servicio que
                 *              listara todos los despachos aprobados por parte
                 *              de la persona de seguridad
                 */
                
                that.listarDespachosAprobados = function(){
                    
                    var obj = {
                        
                       session: $scope.session,
                       prefijo:$scope.datos_view.prefijo,
                       numero: $scope.datos_view.numero,
                       empresa_id:$scope.datos_view.empresaSeleccionada,
                       fechaInicial: $filter('date')($scope.datos_view.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                       fechaFinal:$filter('date')($scope.datos_view.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                       paginaactual:$scope.paginaActual,
                       registroUnico: false
                        
                    };
               
                    ValidacionDespachosService.listarDespachosAprobados(obj,function(data){
                           if (data.status === 200) {

                                $scope.datos_view.items = data.obj.validacionDespachos.length;
                                that.renderListarDespachosAprobados(data);
                                
                           }else{
                                 AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                     });
                  };
                   
                
                   
                  that.renderListarDespachosAprobados = function(data){
                        
                        $scope.documentosAprobados = [];
                          for (var i in data.obj.validacionDespachos) {
                            var _documento = data.obj.validacionDespachos[i];
                            var documento = AprobacionDespacho.get(1, _documento.prefijo, _documento.numero, _documento.fecha_registro);
                            documento.setCantidadCajas(_documento.cantidad_cajas);
                            documento.setCantidadNeveras(_documento.cantidad_neveras);
                            documento.setCantidadNeveras(_documento.cantidad_neveras);
                            documento.setObservacion(_documento.observacion);
                            documento.setRazonSocial(_documento.razon_social);
                            documento.setEmpresaId(_documento.empresa_id);
                            documento.setUsuario(_documento.nombre);
                           $scope.documentosAprobados.push(documento);
                        }
                       
                    };
                    
                     /**
                      * @author Cristian Ardila
                      * @fecha 04/02/2016
                      * +Descripcion Metodo invocado desde los texfield de EFC y numero
                      * @param {type} event
                      */
                    $scope.cargarListarDespachosAprobados = function(event){
                       
                         if (event.which === 13) {
                             that.listarDespachosAprobados()
                         }
                      
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
                     * funcion para paginar anterior
                     * @returns {lista datos}
                     */
                    $scope.paginaAnterior = function() {
                        if ($scope.paginaactual === 1)
                            return;
                        $scope.paginaactual--;
                        that.listarDespachosAprobados();
                    };
                    
                    
                    /*
                     * funcion para paginar siguiente
                     * @returns {lista datos}
                     */
                    $scope.paginaSiguiente = function() {
                        $scope.paginaactual++;
                       that.listarDespachosAprobados();
                    };
                    
                    /*
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Funcion encargada de cambiar de GUI cuando 
                     *              se presiona el boton de detalle de la tabla
                     *              de datos
                     */
                    $scope.detalleDespachoAprobado = function(documentoAprobado) {
                          
                          localStorageService.add("validacionEgresosDetalle", 
                            {empresa: documentoAprobado.getEmpresaId(),
                             prefijo: documentoAprobado.getPrefijo(),
                             numero:  documentoAprobado.getNumero(),
                             estado:  1});
                          $state.go('ValidacionEgresosDetalle');
                     };
                    
                    /*
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Funcion encarhada de cambiar de GUI cuando 
                     *              se presiona el boton Aprobar despacho
                     */
                    $scope.formularioAprobarDespacho = function(){
                          localStorageService.add("validacionEgresosDetalle",{estado: 2});
                          $state.go('ValidacionEgresosDetalle');
                    };
                    
                   
                     /**
                      * +Descripcion Se visualiza la tabla con todas las aprobaciones
                      *              por parte del personal de seguridad
                      */
                     $scope.listaAprobaciones = {
                        data: 'documentosAprobados',
                         enableColumnResize: true,
                         enableRowSelection: false,
                         enableCellSelection: true,
                         enableHighlighting: true,
                        columnDefs: [
                            {field: 'getPrefijo()', displayName: 'prefijo', width:"25%"},
                            {field: 'getNumero()', displayName: 'Numero', width:"25%"},
                            {field: 'fecha_registro', displayName: 'Fecha Registro', width:"40%"},    
                            {field: 'detalle', width: "10%",
                                displayName: "Opciones",
                                cellClass: "txt-center",
                                cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="detalleDespachoAprobado(row.entity)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'

                            }
                        ]
                    };

                   
                    /**
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha iniciañ
                     * @param {type} $event
                     */   
                    $scope.abrir_fecha_inicial = function($event) {

                         $event.preventDefault();
                         $event.stopPropagation();
                         $scope.datos_view.datepicker_fecha_inicial = true;
                         $scope.datos_view.datepicker_fecha_final = false;

                     };
                
                    /**
                    * @author Cristian Ardila
                    * @fecha 04/02/2016
                    * +Descripcion Funcion que permitira desplegar el popup datePicker
                    *               de la fecha final
                    * @param {type} $event
                    */  
                    $scope.abrir_fecha_final = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.datos_view.datepicker_fecha_inicial = false;
                        $scope.datos_view.datepicker_fecha_final = true;

                    };

                     that.init(empresa, function() {            
                      
                            that.listarEmpresas(function(estado) {
                                that.listarDespachosAprobados();
                            });
                     });
                     
                     
                     $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                     $scope.$$watchers = null;
                    // set localstorage
                    
                     $scope.datos_view=null;
                     $scope.documentoDespachoAprobado=null;
                });

         }]);
});
