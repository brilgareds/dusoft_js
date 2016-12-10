define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('dispensacionHcController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'EmpresaDispensacionHc',    
                "$timeout", 
                "$filter",
                "localStorageService",
                "$state",
                "dispensacionHcService","$modal","socket",
                function($scope, $rootScope, Request, API, AlertService, Usuario,
                        EmpresaDispensacionHc,
                        $timeout, $filter,localStorageService,$state,dispensacionHcService,$modal,socket) {

                var that = this;
                $scope.paginaactual = 1;
                var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
                var fecha_actual = new Date();
                
                $scope.root = {
                    termino_busqueda_proveedores: "",
                    fecha_inicial_aprobaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                    fecha_final_aprobaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),                 
                    empresaSeleccionada: '',
                    termino_busqueda:'',
                    estadoSesion: true,
                    items:0,
                    afiliados:[],
                    estadoBotones : [
                        "btn btn-danger btn-xs",
                        "btn btn-primary btn-xs",
                        "btn btn-danger btn-xs",
                        "btn btn-info btn-xs",
                        "btn btn-warning btn-xs",
                        "btn btn-success btn-xs",
                        "btn btn-warning btn-xs"
                    ],
                    opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                }; 
                $scope.root.estadoFormula = 0;
               
                that.cargar_permisos = function() {
                // Permisos ajustes formula              
                    $scope.root.permisos_ajustes = {
                        btn_ajustar_entrega_formula: {
                            'click': $scope.root.opciones.sw_ajustar_entrega_formula
                        }
                    };                
                };
                $scope.nuevoNumeroEntrega = "";
                /*
                 * Inicializacion de variables
                 * @param {type} empresa
                 * @param {type} callback
                 * @returns {void}
                 */
                that.init = function(empresa, callback) {
                    that.cargar_permisos();
                    $scope.root.empresaSeleccionada = EmpresaDispensacionHc.get("TODAS LAS EMPRESAS", -1);
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                    $scope.documentosAprobados = [];
                    that.centroUtilidad = [];
                    
                    $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";  
                    $scope.columnaSizeBusqueda = "col-md-3"; 
                    $scope.root.visibleBuscador = true;
                    $scope.root.visibleBotonBuscador = true;
                    
                    callback();
                };
                  
                  $scope.onSeleccionFiltro = function(filtro){
                      
                    $scope.root.filtro = filtro;
                    $scope.root.termino_busqueda = '';
                    $scope.root.visibleBuscador = true;
                    $scope.root.visibleListaEstados = false;
                    $scope.root.visibleBotonBuscador = true;
                };
                  
                
                 /**
                  * +Descripcion Filtros para tipo de documento
                  * 
                  **/
                  $scope.root.filtros = [                
                    {tipo: 'EV',descripcion: "Evolucion"},
                    {tipo: 'FO',descripcion: "Formula"} 
                  ];
                 
                  $scope.root.filtro = $scope.root.filtros[0]; 
                  $scope.onColumnaSize = function(tipo){

                    if(tipo === "AS" || tipo === "MS" || tipo === "CD"){
                        $scope.columnaSizeBusqueda = "col-md-4"; 
                    }else{
                        $scope.columnaSizeBusqueda = "col-md-3";
                    }
                      
                  };
                $scope.classCssSinDispensar = "success"; 
                $scope.classCssPendientes = "default";  
                $scope.checkearEstadoFormula = function(estado){
                    
                    console.log("checkearEstadoFormula ", estado);
                     if(estado ===0){
                        $scope.classCssSinDispensar = "success"; 
                        $scope.classCssPendientes = "default"; 
                     
                    }else{
                        $scope.classCssSinDispensar = "default"; 
                        $scope.classCssPendientes = "success";
                    }
                };
               /**
                * @author Cristian Ardila
                * @fecha 20/05/2016
                * +Descripcion Metodo el cual invocara el servicio que consulta
                *              todos los tipos de documentos
                * */
                that.listarTipoDocumentos = function(callback){
                    
                    var obj = {
                        session: $scope.session,
                        data: {
                            listar_tipo_documento:{

                            }
                        }
                    };
                
                    dispensacionHcService.listarTipoDocumentos(obj,function (data){
                       
                        if(data.status === 200){                        
                           $scope.tipoDocumentos =  dispensacionHcService.renderListarTipoDocumento(data.obj.listar_tipo_documento);
                           callback(true);
                        }else{                         
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                        }
                    
                    });
                   
                };
               
                /**
                 * @author Cristian Ardila
                 * @fecha 16/05/2016
                 * +Descripcion Metodo encargado de invocar el servicio que
                 *              listara todas las formulas medicas
                 */
                
                that.listarFormulasMedicas = function(parametro){
 
                    var obj = {};                               
                                      
                    if(parametro.estado === 1){
                        
                        $scope.root.termino_busqueda = parametro.evolucion;
                         obj = {                   
                            session: $scope.session,
                            data: {
                               listar_formulas: {
                                    filtro:parametro.filtro,
                                    terminoBusqueda: parametro.evolucion,//$scope.root.numero,
                                    empresaId:parametro.empresa,
                                    fechaInicial: $filter('date')($filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"), "yyyy-MM-dd") + " 00:00:00",
                                    fechaFinal:$filter('date')($filter('date')(fecha_actual, "yyyy-MM-dd"), "yyyy-MM-dd") + " 23:59:00",
                                    paginaActual:1,
                                    estadoFormula : parametro.estadoFormula
                               }
                           }    
                        };    
                                       
                    }
 
                    if(parametro.estado === 0){
                    
                        obj = {                   
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
                        
                    }
                     
                    dispensacionHcService.listarFormulas(obj, function(data){
                        $scope.root.afiliados = [];
                        
                        
                        if(data.status === 200) {  
                           
                           $scope.root.items = data.obj.listar_formulas.length;                              
                           $scope.root.afiliados = dispensacionHcService.renderListarFormulasMedicas(data.obj,1);
                           
                           /**
                            * +Descripcion: Se elimina el criterio de consulta de la formula que se
                            *               envia por memoria cuando se dispensa la entrega
                            *               y se dispensa pendientes
                            */
                           localStorageService.add("consultarFormula", null); 
                           localStorageService.add("consultarFormulaPendientes", null); 
                           localStorageService.add("formulaTodoPendiente", null); 
                           
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
                    
                    dispensacionHcService.listarFormulasPendientes(obj, function(data){
                         
                        if(data.status === 200) {       
                           $scope.root.items = data.obj.listar_formulas.length;                               
                           $scope.afiliadosFormulasPendientes =  dispensacionHcService.renderListarFormulasMedicas(data.obj,0);

                        }else{
                            $scope.afiliadosFormulasPendientes = null;
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        }
                    });
                };
                
                
                
               
                /**
                 * @author Cristian Ardila
                 * @fecha 04/02/2016
                 * +Descripcion Metodo encargado de invocar el servicio que
                 *              listara las formulas para dispensar
                 *  @parametros ($event = eventos del teclado)
                 *              (pendiente = 0 Formulas sin pendientes)
                 *              (pendiente = 1 Formulas con pendientes)
                 */ 
                $scope.buscarFormulas = function(event,pendiente){
                  
                    if (event.which === 13 || event.which === 1){     
                       
                        if(pendiente === 0){                    
                            that.listarFormulasMedicas({estado:0});                         
                        }else{
                            that.listarFormulasMedicasPendientes();                        
                        }                         
                     
                    }
                };
                     
                /*
                 * funcion para paginar anterior
                 * @returns {lista datos}
                 */
                $scope.paginaAnterior = function() {
                    if ($scope.paginaactual === 1)
                        return;
                    $scope.paginaactual--;
                    that.listarFormulasMedicas({estado:0});
                };


                /*
                 * funcion para paginar siguiente
                 * @returns {lista datos}
                 */
                $scope.paginaSiguiente = function() {
                    $scope.paginaactual++;
                    that.listarFormulasMedicas({estado:0});
                };
                    
                /*
                 * @author Cristian Ardila
                 * @fecha 24/05/2016
                 * +Descripcion Funcion encargada de cambiar de VIEW cuando 
                 *              se seleccione la opcion dispensacion
                 */
                $scope.dispensacionFormula = function(dispensar, pendientes) {

                        localStorageService.add("dispensarFormulaDetalle",{
                            evolucionId: dispensar.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(),//'91671'
                            filtro:$scope.root.filtro,
                            terminoBusqueda: $scope.root.termino_busqueda,//$scope.root.numero,
                            empresaId:$scope.root.empresaSeleccionada,
                            fechaInicial: $filter('date')($scope.root.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                            fechaFinal:$filter('date')($scope.root.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                            paginaActual:$scope.paginaactual,
                            estadoFormula : $scope.root.estadoFormula,
                            pacienteId: dispensar.getAfiliadoId(),
                            tipoIdPaciente: dispensar.getAfiliadoTipoId(),
                            pendientes: pendientes,
                            tipoEstadoFormula: dispensar.mostrarPacientes()[0].mostrarFormulas()[0].getEstadoEntrega()

                        });

                        $state.go('DispensarFormulaDetalle');
                 };
                 
                /**
                 * +Descripcion Metodo encargado de conceder privilegios de ajustes
                 *              del numero de entrega de una formula
                 */
                $scope.habilitar_modificacion_producto = function() {
                    return $scope.root.permisos_ajustes.btn_ajustar_entrega_formula;
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
                       {displayName: '#Evo',     width:"4%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId()'}, 
                       {displayName: '#Formula',       width:"5%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getNumeroFormula()'}, 
                       {displayName: 'Identificacion', width:"9%",
                        cellTemplate: "<div\n\
                                       <span ng-class=''></span>{{ row.entity.mostrarPacientes()[0].getTipoIdPaciente() }} {{ row.entity.mostrarPacientes()[0].getPacienteId() }}  </div>"}, 

                       {displayName: 'Paciente',       width: "10%",  
                        cellTemplate: "<div\n\
                                       <span ng-class=''></span>{{ row.entity.mostrarPacientes()[0].getNombres() }} {{ row.entity.mostrarPacientes()[0].getApellidos() }} </div>"},   
                       {displayName: 'F.Formulacion',  width:"8%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getFechaFormulacion()'}, 
                       {displayName: 'F.Finalizacion', width:"8%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getFechaFinalizacion()'}, 
                       {displayName: 'F.Entrega',      width:"7%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getFechaEntrega()'}, 
                        {displayName: '#Entregas',     width:"5%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getNumeroTotalEntregas()'}, 
                       {displayName: '#Entrega actual',width:"7%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual()'}, 



                       //{field: 'mostrarPacientes()[0].getMedico()', displayName: 'Medico', width:"9%"},    
                       {displayName: 'Plan',           width:"9%",field: 'mostrarPlanAtencion()[0].mostrarPlanes()[0].getDescripcion()'}, 
                       {displayName: 'Tipo',            width:"8%",field: 'mostrarPacientes()[0].mostrarFormulas()[0].getDescripcionTipoFormula()'},                            


                       {field: 'Ajuste', width: "7%", displayName: 'Ajuste',
                    cellTemplate: '<div class="col-xs-12 "> \
                                  <input type="text" \
                                   ng-model="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].numeroEntregaActual" \
                                   validacion-numero-entero \
                                   class="form-control grid-inline-input" \
                                   name="" \
                                   id="" \
                                   ng-disabled="row.entity.estadoProductoVencimiento == 1" ng-class=""\n\
                                   /> </div>'},
                        {displayName: "Opc", width:"5%", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                       <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                                       <ul class="dropdown-menu dropdown-options">\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].estadoEntrega == 0  && root.estadoFormula == 0">\n\
                                               <a href="javascript:void(0);" ng-click="dispensacionFormula(row.entity,0)" >Dispensaci&oacute;n </a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 1 && root.estadoFormula == 1 || row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 2 && root.estadoFormula == 1">\
                                               <a href="javascript:void(0);" ng-click="dispensacionFormula(row.entity,1)" >Pendientes </a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual() > 0 ">\
                                               <a href="javascript:void(0);" ng-click="listarTodoMedicamentosDispensados(row.entity)" class = "glyphicon glyphicon-print"> Todo </a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual() > 0\
                                                    && row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 1 || row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 2 ">\n\
                                               <a href="javascript:void(0);" ng-click="imprimirMedicamentosPendientes({evolucion: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(), \n\
                                                                                       tipoIdPaciente: row.entity.mostrarPacientes()[0].getTipoIdPaciente(), \n\
                                                                                       pacienteId: row.entity.mostrarPacientes()[0].getPacienteId()})" class = "glyphicon glyphicon-print" > Pendientes</a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual() > 0 ">\
                                               <a href="javascript:void(0);" ng-click="imprimirMedicamentosDispensados({evolucion: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(), \n\
                                                                                       tipoIdPaciente: row.entity.mostrarPacientes()[0].getTipoIdPaciente(), \n\
                                                                                       pacienteId: row.entity.mostrarPacientes()[0].getPacienteId()},0)" class = "glyphicon glyphicon-print" > Ultima entrega</a>\
                                            </li>\
                                             <li>\
                                               <a href="javascript:void(0);" ng-click="ventanaMovimientoFormulasPaciente({tipoIdPaciente: row.entity.mostrarPacientes()[0].getTipoIdPaciente(), \n\
                                                                                       pacienteId: row.entity.mostrarPacientes()[0].getPacienteId()})" class = "glyphicon glyphicon-folder-open" > Movimiento</a>\
                                             </li>\
                                             <li >\
                                               <a href="javascript:void(0);" ng-validate-events="{{ habilitar_modificacion_producto() }}"  ng-click="ventanaAjustarEntregaFormula({evolucion: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(), numero_entrega: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual()})" class = "glyphicon glyphicon-wrench" > Ajustar formula</a>\
                                             </li>\
                                       </ul>\
                                  </div>'
                       },
                        
                        {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getEstadoEntrega()', displayName: "Estado", 
                                cellClass: "txt-center",  width:"9%", 
                    cellTemplate: "<button type='button' \n\
                                    ng-class='agregar_clase_formula(row.entity.mostrarPacientes()[0].mostrarFormulas()[0].estadoEntrega)'> \n\
                                   <span ng-class=''></span>  {{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].descripcionEstadoEntrega}} </button>"}, 

                    ]
                }; 
                        
                // Agregar Clase de acuerdo al estado del pedido
                $scope.agregar_clase_formula = function(index) {
                    return $scope.root.estadoBotones[index];
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
                         {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getDescripcion()', displayName: 'Descripcion'},
                         {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getExistencia()', displayName: 'Cantidad', width:"9%"},        

                          {field: 'detalle', width: "6%",
                             displayName: "Opciones",
                             cellClass: "txt-center",
                             cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="descartarFormula(row.entity.mostrarPacientes()[0].mostrarFormulas()[0])"><span class="glyphicon glyphicon-zoom-in">Descatar</span></button></div>'

                         }
                     ]               
                 };
                     
                    
                /*
                 * @author Cristian Manuel Ardila
                 * +Descripcion Metodo invocado desde el grid de pendientes
                 *              el cual desplegara la ventana modal con 
                 *              las justificaciones para descartar un producto
                 *              pendiente
                 * @fecha 02/09/2016 DD/MM/YYYY
                 */
                $scope.descartarFormula = function(entity){

                    that.ventanaDescartarPendientesFormula(entity);

                };

                /**
                  * @author Cristian Ardila
                  * +Descripcion Metodo que desplegara una ventana encargada de 
                  *              listar los tipos de entrega de la formula
                */
                that.ventanaDescartarPendientesFormula = function(entity){

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: true,
                        keyboard: true,
                        templateUrl: 'views/dispensacionHc/descartarPendientesFormula.html',
                        scope: $scope,                  
                        controller: "descartarPendientesFormulaController",
                        windowClass: 'app-modal-window-smlg',
                        resolve: {
                                identificadorProductoPendiente: function() {
                                    return entity.mostrarProductos()[0].getIdentificadorDePendiente();
                                },
                                evolucion: function(){
                                    return entity.getEvolucionId();
                                }
                            }

                    };
                    var modalInstance = $modal.open($scope.opts);   

                        modalInstance.result.then(function(){
                            that.listarFormulasMedicasPendientes();
                        },function(){});                          

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
                    
                              
                /**
                * @author Cristian Ardila
                * +Descripcion Metodo encargado de imprimir el reporte de todas las 
                *              entregas que ha tenido la formula
                * @fecha 16/06/2016
                */
                $scope.listarTodoMedicamentosDispensados = function(entity){

                    var obj = {                   
                               session: $scope.session,
                               data: {
                                  listar_medicamentos_dispensados: {
                                       evolucion: entity.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(),
                                       tipoIdPaciente:entity.mostrarPacientes()[0].getTipoIdPaciente(),
                                       pacienteId: entity.mostrarPacientes()[0].getPacienteId()
                                  },
                                  lista_total_dispensaciones :{}

                              }    
                           };


                    var arregloEntregas = [];
                    var listaEntregasFormulas =[];
                    var totalDispensaciones;
                    dispensacionHcService.listarTotalDispensacionesFormula(obj, function(data){

                        if (data.status === 200) {

                            totalDispensaciones = data.obj.listar_medicamentos_dispensados;
                            totalDispensaciones.forEach(function(entregas){                                    
                                arregloEntregas.push(entregas.entrega);                                 
                            });

                            var unique=function(a){                                  
                                return function(){
                                    return arregloEntregas.filter(a)
                                };
                            }(function(a,b,c){

                                return c.indexOf(a,b+1)<0
                              });
        
                            var numeroDeEntregas = unique(arregloEntregas);
                                
                            for(var i=0; i<numeroDeEntregas.length; i++){                              
                                listaEntregasFormulas.push(dispensacionHcService.renderListartotalDispensacionesFormula(numeroDeEntregas[i],data.obj.listar_medicamentos_dispensados));
                            }

                          /**
                            * +descripcion Se almacenan todas las entregas de la formula
                            */
                            obj.data.lista_total_dispensaciones = listaEntregasFormulas;

                            dispensacionHcService.listarTodoMedicamentosDispensados(obj,function(data){
                                var nombre = data.obj.listar_medicamentos_dispensados.nombre_pdf;
                                $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                            });

                        }

                    });

                };          
                   
                /**
                 * @author Cristian Ardila
                 * +Descripcion Metodo encargado de imprimir el reporte de los medicamentos
                 *              pendientes para dispensar
                 * @fecha 16/06/2016
                 */
                 $scope.imprimirMedicamentosPendientes = function(entity){                          
                     that.imprimirMedicamentosPendientesLocalStorage(entity);
                 };

                 that.imprimirMedicamentosPendientesLocalStorage = function(parametro){                      
                     that.consultaMedicamentosPendientes(parametro);
                 };
                    
                /*
                 * @author Cristian Manuel Ardila
                 * +Descripcion Metodo encargado generar el reporte
                 * para consultar los medicamentos pendientes           
                 * @fecha  2016-10-12
                 */
                that.consultaMedicamentosPendientes = function(parametro){

                    var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_pendientes: {
                                evolucion: parametro.evolucion,
                                tipoIdPaciente:parametro.tipoIdPaciente,
                                pacienteId: parametro.pacienteId
                           }
                        }    
                    };    
                       
                    dispensacionHcService.listarMedicamentosPendientesPorDispensar(obj,function(data){
                        
                        if (data.status === 200) {
                            var nombre = data.obj.listar_medicamentos_pendientes.nombre_pdf;                    
                            $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                        }
                    });  
                };
        
                /**
                 * @author Cristian Ardila
                 * +Descripcion Metodo encargado de imprimir el reporte de los medicamentos
                 *              que quedaron pendientes para dispensar
                 * @fecha 16/06/2016
                 */
                $scope.imprimirMedicamentosDispensados = function(entity, estado){
                    that.consultaMedicamentosDispensados(entity,estado);              
                };
                     
                /*
                 * @author Cristian Manuel Ardila
                 * +Descripcion Metodo encargado generar el reporte
                 * para consultar los medicamentos dispensados           
                 * @fecha  2016-10-12
                 */
                that.consultaMedicamentosDispensados = function(parametro,estado){

                    var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_dispensados: {
                                evolucion: parametro.evolucion,
                                tipoIdPaciente:parametro.tipoIdPaciente,
                                pacienteId: parametro.pacienteId,
                                pendientes: estado
                           }
                       }    
                    };    
                    dispensacionHcService.listarMedicamentosDispensados(obj,function(data){
                            
                        if (data.status === 200) {
                            var nombre = data.obj.listar_medicamentos_dispensados.nombre_pdf;                          
                            $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                        }
                    });  
                };

                that.imprimirMedicamentosDispensadosLocalStorage = function(parametro, estado){

                        that.consultaMedicamentosDispensados(parametro, estado);
                };
                 
                /**
                * +DESCRIPCION SERVICIO EXCLUSIVO PARA ALMACENAR LAS FORMULAS EN LA TABLA
                *              DE DISPENSACION_ESTADOS
                */
                $scope.insertarFormulasDispensacionEstados = function(){

                   var obj = {                   
                                session: $scope.session,
                                data: {
                                   insertar_formulas_dispensacion_estados: {
                                        filtro:$scope.root.filtro,
                                        terminoBusqueda: $scope.root.termino_busqueda,
                                        estadoFormula: '0',
                                        fechaInicial: $filter('date')($scope.root.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                                        fechaFinal:   $filter('date')($scope.root.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                                   }
                               }    
                            };    
                    dispensacionHcService.insertarFormulasDispensacionEstados(obj,function(data){

                        if(data.status === 200){                        
                           AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                           that.listarFormulasMedicas({estado:0}); 
                        }else{                         
                           AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                        }


                    }); 

                };
                     
                /**
                * @author Cristian Ardila
                * +Descripcion ventana modal para registrar la autorizacion de dispensacion
                *              de un medicamento confrontado
                */
                $scope.ventanaMovimientoFormulasPaciente = function(detallePaciente){

                    console.log("movimientoFormulas ", detallePaciente);
                    $scope.opts = {
                        
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        windowClass: 'app-modal-window-xlg',                            
                        templateUrl: 'views/dispensacionHc/dispensacionMovimientoFormulasPaciente.html',
                        scope: $scope,                  
                        controller: "dispensacionMovimientoFormulasPacienteController",
                        resolve: {                                              
                                detallePaciente: function(){
                                    return detallePaciente;
                                }
                            }         
                    };
                    var modalInstance = $modal.open($scope.opts);   

                        modalInstance.result.then(function(){
                        },function(){});                          

                };

                /**
                 * @author Cristian Manuel Ardila
                 * +Descripcion Metodo encargado de invocar una ventana modal que
                 *              permitira ajustar la entrega de una formula
                 * @fecha 06/12/2016
                 */
                $scope.ventanaAjustarEntregaFormula = function(obj){              

                   if($scope.habilitar_modificacion_producto()){
                    var obj = {                   
                         session: $scope.session,
                         data: {
                            ajustar_numero_entrega_formula: {
                                 numero_entrega:obj.numero_entrega,
                                 evolucion:obj.evolucion,
                            }
                        }    
                     };

                     dispensacionHcService.ajustarNumeroEntregaFormula(obj,function(data){
                         console.log("data ", data);
                         if (data.status === 200) {
                             AlertService.mostrarMensaje("success", data.msj);
                         }else{
                             AlertService.mostrarMensaje("warning", data.msj);
                         }
                     });  

                   }else{
                        AlertService.mostrarMensaje("success", "El usuario no posee privilegios para realizar la accion");
                   }

                };        


                
                that.init(empresa, function() {

                    if(!Usuario.getUsuarioActual().getEmpresa()) {
                        $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene una empresa valida para dispensar formulas", tipo:"warning"});
                        AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
                    }else{                               
                        if(!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                            Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                            $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene un centro de utilidad valido para dispensar formulas.", tipo:"warning"});
                            AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                        }else{
                            if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                                $rootScope.$emit("onIrAlHome",{mensaje:"El usuario no tiene una bodega valida para dispensar formulas.", tipo:"warning"});
                                AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                            }else{                                
                                that.listarTipoDocumentos(function(){});    

                                var resultadoStorage = localStorageService.get("consultarFormula");      
                                var resultadoStoragePendientes = localStorageService.get("consultarFormulaPendientes");      
                                var resultadoStorageTodoPendiente = localStorageService.get("formulaTodoPendiente");      
 
                                if(resultadoStorage){
                                    that.listarFormulasMedicas({estado:1, 
                                                                evolucion:resultadoStorage.evolucion, 
                                                                filtro:resultadoStorage.filtro, 
                                                                empresa: resultadoStorage.empresa,
                                                                estadoFormula: '0'});
                                    that.imprimirMedicamentosPendientesLocalStorage(resultadoStorage);
                                    that.imprimirMedicamentosDispensadosLocalStorage(resultadoStorage,0);

                                }
 
                                if(resultadoStoragePendientes){
                                    $scope.root.estadoFormula = 1;
                                    that.listarFormulasMedicas({estado:1, 
                                                                evolucion:resultadoStoragePendientes.evolucion, 
                                                                filtro:resultadoStoragePendientes.filtro, 
                                                                empresa: resultadoStoragePendientes.empresa,
                                                                estadoFormula: '1'});

                                    that.imprimirMedicamentosPendientesLocalStorage(resultadoStoragePendientes);
                                    that.imprimirMedicamentosDispensadosLocalStorage(resultadoStoragePendientes,0);

                                }
 
                                if(resultadoStorageTodoPendiente){
                                    that.imprimirMedicamentosPendientesLocalStorage(resultadoStorageTodoPendiente); 
                                }
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
