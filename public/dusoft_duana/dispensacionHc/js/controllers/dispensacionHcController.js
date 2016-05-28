define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('dispensacionHcController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'EmpresaDispensacionHc', 
                'CentroUtilidadInduccion', 
                'BodegaInduccion', 
                "$timeout", 
                "$filter",
                "localStorageService",
                "$state",
                "dispensacionHcService",
                "FormulaHc","PacienteHc","EpsAfiliadosHc","PlanesRangosHc","PlanesHc","TipoDocumentoHc",
                function($scope, $rootScope, Request, API, AlertService, Usuario,
                        EmpresaDispensacionHc, CentroUtilidadInduccion, BodegaInduccion,
                        $timeout, $filter,localStorageService,$state,dispensacionHcService,
                        FormulaHc,PacienteHc,EpsAfiliadosHc,PlanesRangosHc,PlanesHc,TipoDocumentoHc) {

                var that = this;
                $scope.paginaactual = 1;
                var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
                var fecha_actual = new Date();
                var justificacion = ['Error de formulacion', 'Error de digitacion', 'Confrontado'];
               
                $scope.root = {
                    termino_busqueda_proveedores: "",
                    fecha_inicial_aprobaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                    fecha_final_aprobaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                    afiliados:[],
                    items:0,
                    empresaSeleccionada: '',
                    termino_busqueda:'',
                    estadoSesion: true,
                    justificacion : justificacion[0]
                }; 
                $scope.root.estadoFormula = 0;
                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                that.init = function(empresa, callback) {
                   
                    $scope.root.empresaSeleccionada = EmpresaDispensacionHc.get("TODAS LAS EMPRESAS", -1);
                    $scope.root.empresaNombre;
                    
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                    $scope.documentosAprobados = [];
                    that.centroUtilidad = [];
                    
                    $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";                  
                  /**
                    * +Descripcion Filtros para tipo de documento
                    * 
                    **/
                    $scope.root.filtros = [                
                    {tipo: 'FO',descripcion: "Formula"},
                    {tipo: 'EV',descripcion: "Evolucion"}
                    ];
                 
                    $scope.root.filtro = $scope.root.filtros[0];
                    
                   //Deja en estado visible el buscador
                    $scope.root.visibleBuscador = true;
                    $scope.root.visibleBotonBuscador = true;
                    
                    callback();
                };
                   
                  $scope.onSeleccionFiltro = function(filtro) {

                    $scope.root.filtro = filtro;
                    $scope.root.termino_busqueda = '';

                    $scope.root.visibleBuscador = true;
                    $scope.root.visibleListaEstados = false;
                    $scope.root.visibleBotonBuscador = true;

                };
                
                
               /**
                * @author Cristian Ardila
                * @fecha 20/05/2016
                * +Descripcion Metodo el cual invocara el servicio que consulta
                *              todos los tipos de documentos
                * */
               that.listarTipoDocumentos = function(callback){
                    
                   dispensacionHcService.listarTipoDocumentos($scope.session,function (data){
                      
                      $scope.tipoDocumentos = []; 
                    
                      if(data.status === 200){
                          
                          that.renderListarTipoDocumento(data.obj.listar_tipo_documento);
                          callback(true);
                      }else{
                          
                          callback(false);
                      }
                   });
                   
               };
               
               that.renderListarTipoDocumento = function(tipoDocumento){
                   
                   for(var i in tipoDocumento){
                     
                        var _tipoDocumento = TipoDocumentoHc.get(tipoDocumento[i].tipo_id_tercero, tipoDocumento[i].descripcion);
                         $scope.tipoDocumentos.push(_tipoDocumento);
                   }
                   console.log("TIpos de coumentos ", $scope.tipoDocumentos);
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

                   dispensacionHcService.listarEmpresas($scope.session,$scope.root.termino_busqueda_empresa, function(data){
                         
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
                         var _empresa = EmpresaDispensacionHc.get(empresas[i].razon_social, empresas[i].empresa_id);
                         $scope.empresas.push(_empresa);
                    }
                };

                /**
                 * @author Cristian Ardila
                 * @fecha 16/05/2016
                 * +Descripcion Metodo encargado de invocar el servicio que
                 *              listara todas las formulas medicas
                 */
                
                that.listarFormulasMedicas = function(){
                    
                     var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_formulas: {
                                filtro:$scope.root.filtro,
                                terminoBusqueda: $scope.root.termino_busqueda,//$scope.root.numero,
                                empresaId:$scope.root.empresaSeleccionada,
                                fechaInicial: $filter('date')($scope.root.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                                fechaFinal:$filter('date')($scope.root.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                                paginaActual:$scope.paginaactual,
                                estadoFormula : $scope.root.estadoFormula
                           }
                       }    
                    };
                    
                    dispensacionHcService.listarFormulas(obj, function(data){
                      
                           if(data.status === 200) {       
                               $scope.root.items = data.obj.listar_formulas.length;                              
                               $scope.root.afiliados = dispensacionHcService.renderListarFormulasMedicas(data.obj,1);
                           }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                          
                    });
                };
                
                 
                  /**
                 * @author Cristian Ardila
                 * @fecha 16/05/2016
                 * +Descripcion Metodo encargado de invocar el servicio que
                 *              listara todas las formulas medicas pendientes
                 */
                that.listarFormulasMedicasPendientes = function(){
                    $scope.afiliadosFormulasPendientes;
                   var obj = {
                        
                       session: $scope.session,
                       prefijo:$scope.root.prefijo,
                       numero: $scope.root.numero,//$scope.root.numero,
                       empresa_id:$scope.root.empresaSeleccionada,
                       fechaInicial: $filter('date')($scope.root.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                       fechaFinal:$filter('date')($scope.root.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                       paginaactual:$scope.paginaactual,
                       registroUnico: false
                        
                    };
                    dispensacionHcService.listarFormulasPendientes($scope.session,$scope.root.termino_busqueda_empresa, function(data){
                            
                            console.log("data ", data)
                           if(data.status === 200) {       
                               $scope.root.items = data.obj.listar_formulas.length;                               
                              $scope.afiliadosFormulasPendientes =  dispensacionHcService.renderListarFormulasMedicas(data.obj,0);
                                
                           }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                    });
                };
                
                
                
               
                /**
                 * @author Cristian Ardila
                 * @fecha 04/02/2016
                 * +Descripcion Metodo encargado de invocar el servicio que
                 *              listara todos los despachos aprobados por parte
                 *              de la persona de seguridad
                 */ 
                $scope.buscarFormulas = function(event){

                   if (event.which === 13) {  

                         //if($scope.root.estadoFormula === '0'){
                         that.listarFormulasMedicas();
                            // that.listarFormulasMedicasPendientes();
                         //}

                         /* if($scope.root.estadoFormula === '1'){
                             that.listarFormulasMedicasPendientes();
                         }
                       */
                   }
                };
                     
                    /*
                     * funcion ejecuta listarCentroUtilidad
                     * @returns {lista CentroUtilidad}
                     */
                    $scope.onSeleccionarEmpresa = function(empresa_Nombre) {
                        if (empresa_Nombre.length < 3) {
                            return;
                        }
                        $scope.root.termino_busqueda_empresa = empresa_Nombre;
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
                        that.listarFormulasMedicas();
                    };
                    
                    
                    /*
                     * funcion para paginar siguiente
                     * @returns {lista datos}
                     */
                    $scope.paginaSiguiente = function() {
                        $scope.paginaactual++;
                       that.listarFormulasMedicas();
                    };
                    
                    /*
                     * @author Cristian Ardila
                     * @fecha 24/05/2016
                     * +Descripcion Funcion encargada de cambiar de VIEW cuando 
                     *              se seleccione la opcion dispensacion
                     */
                    $scope.dispensacionFormula = function(dispensar) {
                          
                         
                          localStorageService.add("dispensarFormulaDetalle",{
                                evolucionId: dispensar.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(),//'91671'
                                filtro:$scope.root.filtro,
                                terminoBusqueda: $scope.root.termino_busqueda,//$scope.root.numero,
                                empresaId:$scope.root.empresaSeleccionada,
                                fechaInicial: $filter('date')($scope.root.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                                fechaFinal:$filter('date')($scope.root.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                                paginaActual:$scope.paginaactual,
                                estadoFormula : $scope.root.estadoFormula
                           
                    
                          });
                             
                          $state.go('DispensarFormulaDetalle');
                     };
                    
                    /*
                     * @author Cristian Ardila
                     * @fecha 24/05/2016
                     * +Descripcion Funcion encargada de cambiar de VIEW cuando 
                     *              se seleccione la opcion dispensacion
                     */
                    $scope.dispensacionFormulaPendientes = function(dispensar) {
                          console.log("dispensar ", dispensar) 
                       
                     };
                   
                   
                     /**
                      * +Descripcion Se visualiza la tabla con todas las aprobaciones
                      *              por parte del personal de seguridad
                      */
                     $scope.listaFormulas = {
                        data: 'root.afiliados',
                         enableColumnResize: true,
                         enableRowSelection: false,
                         enableCellSelection: true,
                         enableHighlighting: true,
                        columnDefs: [
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId()', displayName: '# Evolucion', width:"9%"}, 
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getNumeroFormula()', displayName: '# Formula', width:"9%"}, 
                            {displayName: 'Identificacion', width:"9%",
                             cellTemplate: "<div\n\
                                            <span ng-class=''></span>{{ row.entity.mostrarPacientes()[0].getTipoIdPaciente() }} {{ row.entity.mostrarPacientes()[0].getPacienteId() }} </div>"}, 
                           
                            {displayName: 'Paciente', width:"9%",
                             cellTemplate: "<div\n\
                                            <span ng-class=''></span>{{ row.entity.mostrarPacientes()[0].getNombres() }} {{ row.entity.mostrarPacientes()[0].getApellidos() }} </div>"},   
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getFechaFormulacion()', displayName: 'F. Formulacion', width:"9%"}, 
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getFechaFinalizacion()', displayName: 'F. Finalizacion', width:"9%"},                              
                            {field: 'mostrarPacientes()[0].getMedico()', displayName: 'Medico', width:"9%"},    
                            {field: 'mostrarPlanAtencion()[0].mostrarPlanes()[0].getDescripcion()', displayName: 'Plan', width:"9%"}, 
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getDescripcionTipoFormula()', displayName: 'Tipo', width:"9%"}, 
                               
                            
                            {displayName: "Opcion", cellClass: "txt-center dropdown-button",
                             cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                 <li><a href="javascript:void(0);" ng-click="dispensacionFormula(row.entity)" >Dispensaci&oacute;n</a></li>\
                                                 <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 0"><a href="javascript:void(0);" ng-click="dispensacionFormulaPendientes(row.entity)" >Pendientes</a></li>\
                                             </ul>\
                                       </div>'
                             },
                            
                        ]
                    };

                   /**
                      * +Descripcion Se visualiza la tabla con todas las aprobaciones
                      *              por parte del personal de seguridad
                      */
                     $scope.listaFormulasPendientes = {
                        data: 'afiliadosFormulasPendientes',
                         enableColumnResize: true,
                         enableRowSelection: false,
                         enableCellSelection: true,
                         enableHighlighting: true,
                        columnDefs: [
                        {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId()', displayName: '# Evolucion', width:"9%"}, 
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getNumeroFormula()', displayName: '# Formula', width:"9%"}, 
                            {displayName: 'Identificacion', width:"9%",
                             cellTemplate: "<div\n\
                                            <span ng-class=''></span>{{ row.entity.mostrarPacientes()[0].getTipoIdPaciente() }} {{ row.entity.mostrarPacientes()[0].getPacienteId() }} </div>"}, 
                           
                            {displayName: 'Paciente', width:"9%",
                             cellTemplate: "<div\n\
                                            <span ng-class=''></span>{{ row.entity.mostrarPacientes()[0].getNombres() }} {{ row.entity.mostrarPacientes()[0].getApellidos() }} </div>"},   
                            {field: 'mostrarPacientes()[0].getEdad()', displayName: 'Edad', width:"9%"}, 
                            {field: 'mostrarPacientes()[0].getSexo()', displayName: 'Sexo', width:"9%"}, 
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getCodigoProducto()', displayName: 'Codigo', width:"9%"},
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getDescripcion()', displayName: 'Descripcion', width:"9%"},
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getExistencia()', displayName: 'Cantidad', width:"9%"},        
                            {displayName: "Justificacion", cellClass: "txt-center dropdown-button",
                             cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">{{root.justificacion}}<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                            <li><a href="javascript:void(0);" ng-click="seleccionarJustificacion(0)" >Error Formulaci&oacute;n</a></li>\
                                            <li><a href="javascript:void(0);" ng-click="seleccionarJustificacion(1)" >Error de Digitaci&oacute;n</a></li>\
                                            <li><a href="javascript:void(0);" ng-click="seleccionarJustificacion(2)" >Confrontado</a></li>\
                                           </ul>\
                                       </div>'
                             },
                             {field: 'detalle', width: "6%",
                                displayName: "Opciones",
                                cellClass: "txt-center",
                                cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="dispensacionFormula(row.entity)"><span class="glyphicon glyphicon-zoom-in">Descatar</span></button></div>'

                            }
                        ]
                    };
                    
                   
                    $scope.seleccionarJustificacion = function(index){
                        
                        $scope.root.justificacion = justificacion[index];
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
                         $scope.root.datepicker_fecha_inicial = true;
                         $scope.root.datepicker_fecha_final = false;

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
                        $scope.root.datepicker_fecha_inicial = false;
                        $scope.root.datepicker_fecha_final = true;

                    };

                     that.init(empresa, function() {            
                         
                        
                         
                         if(!Usuario.getUsuarioActual().getEmpresa()){
                             AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
                         }else {
                          
                            if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado()||
                                Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {

                                AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");

                            }else{
                               
                                if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) { 
                                    
                                    AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                                }else{
                                 $scope.root.estadoSesion = false;
                                 that.listarTipoDocumentos(function(estado){
                   
                                 });
                                 that.listarEmpresas(function(estado) {
                                
                                   // that.listarFormulasMedicas();
                                   // that.listarFormulasMedicasPendientes();
                                });                                  
                                }   
                            }
                         }                        
                     });
                     
                     
                     $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                     $scope.$$watchers = null;
                    // set localstorage
                    
                     $scope.root=null;
                   
                });

         }]);
});
