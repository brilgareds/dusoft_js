define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('dispensacionHcController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'EmpresaDispensacionHc', 'CentroUtilidadInduccion', 'BodegaInduccion', 'ProductoInduccion','AprobacionDespacho',
                "$timeout", "$filter","localStorageService","$state",
                "dispensacionHcService","FormulaHc","PacienteHc","EpsAfiliadosHc","PlanesRangosHc","PlanesHc","TipoDocumentoHc","ProductosHc",
                function($scope, $rootScope, Request, API, AlertService, Usuario,
                        EmpresaDispensacionHc, CentroUtilidadInduccion, BodegaInduccion, ProductoInduccion, AprobacionDespacho,
                        $timeout, $filter,localStorageService,$state,dispensacionHcService,
                        FormulaHc,PacienteHc,EpsAfiliadosHc,PlanesRangosHc,PlanesHc,TipoDocumentoHc,ProductosHc) {

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
                    empresaSeleccionada: '',
                    termino_busqueda:'',
                    estadoSesion: true

                }; 
                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                that.init = function(empresa, callback) {
                    $scope.root = {};
                    $scope.root.empresaSeleccionada = EmpresaDispensacionHc.get("TODAS LAS EMPRESAS", -1);
                    $scope.root.empresaNombre;
                    $scope.root.estadoFormula = 1;
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
                    $scope.filtros = [                
                    {descripcion: "Formula", tipo_id_tercero: 'FO'},
                    {descripcion: "Evolucion", tipo_id_tercero: 'EV'}
                    ];
                    
                  /**
                    * +Descripcion Filtros para tipo de documento
                    * 
                    **/
                    $scope.filtrosTipoDocumento = [                   
                    {nombre: "Adulto sin identificacion", filtroFormula: true},
                    {nombre: "Cedula de ciudadania", filtroFormula: true},
                    {nombre: "Cedula de extranjeria", filtroFormula: true},
                    {nombre: "Menor sin identificacion", filtroFormula: true},
                    {nombre: "Farmacia medmfen", filtroFormula: true},
                    {nombre: "N. Identificacion tributario", filtroFormula: true},
                    {nombre: "Pasaporte", filtroFormula: true},
                    {nombre: "Registro civil", filtroFormula: true},
                    {nombre: "Tarjeta identidad", filtroFormula: true},
                    ];
                    
                    $scope.filtro = $scope.filtros[0];
                    
                   //Deja en estado visible el buscador
                    $scope.visibleBuscador = true;
                    $scope.visibleBotonBuscador = true;
                    
                    callback();
                };
                   
                    $scope.onSeleccionFiltro = function(filtro) {

                    $scope.filtro = filtro;
                    $scope.datos_view.termino_busqueda = '';

                    $scope.visibleBuscador = true;
                    $scope.visibleListaEstados = false;
                    $scope.visibleBotonBuscador = true;


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
                        
                        var _tipoDocumento = TipoDocumentoHc.get(tipoDocumento[i].tipo, tipoDocumento[i].descripcion);
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

                   dispensacionHcService.listarEmpresas($scope.session,$scope.datos_view.termino_busqueda_empresa, function(data){
                         
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
                           listar_empresas: {
                                prefijo:$scope.datos_view.prefijo,
                                numero: $scope.datos_view.numero,//$scope.datos_view.numero,
                                empresa_id:$scope.datos_view.empresaSeleccionada,
                                fechaInicial: $filter('date')($scope.datos_view.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                                fechaFinal:$filter('date')($scope.datos_view.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                                paginaActual:$scope.paginaactual
                                
                           }
                       }    
                    };
                    
                    dispensacionHcService.listarFormulas(obj, function(data){
                            
                           if(data.status === 200) {       
                               $scope.datos_view.items = data.obj.listar_formulas.length;                              
                               that.renderListarFormulasMedicas(data.obj);
                                
                           }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                    });
                };
                 /**
                  * +Descripcion Metodo encargado de mapear la formula
                  */
                 that.renderListarFormulasMedicas = function(formulas){

                      $scope.afiliados = [];
                      
                          for (var i in formulas.listar_formulas) {
                            var _formula = formulas.listar_formulas[i];
                            
                            //Se crea el objeto afiliados
                            var afiliados = EpsAfiliadosHc.get(_formula.tipo_id_paciente,_formula.paciente_id,_formula.plan_id)
                            
                            var plan = PlanesHc.get(_formula.plan_id,_formula.plan_descripcion);
                            var planesAtencion  = PlanesRangosHc.get('','');
                                planesAtencion.agregarPlanes(plan);
                               
                            //Se crea el objeto paciente
                            var paciente = PacienteHc.get(_formula.tipo_id_paciente,
                                                        _formula.paciente_id,_formula.apellidos,_formula.nombres)
                                paciente.setMedico(_formula.nombre);
                                paciente.setTipoBloqueoId(_formula.tipo_bloqueo_id);  
                                paciente.setBloqueo(_formula.bloqueo);  
                              
                            //Se crea el objeto formula
                            var formula = FormulaHc.get(_formula.evolucion_id,_formula.numero_formula,_formula.tipo_formula, 
                                                      _formula.transcripcion_medica,
                                                     _formula.descripcion_tipo_formula,
                                                   _formula.fecha_registro,
                                                  _formula.fecha_finalizacion,
                                                _formula.fecha_formulacion);
                                                      
                              
                         //El paciente tiene su formula
                         paciente.agregarFormulas(formula);
                         
                         //debe ser afiliado el paciente
                         afiliados.agregarPacientes(paciente);
                         afiliados.agregarPlanAtencion(planesAtencion);
                         
                         //Se almacenan los afiliados
                         $scope.afiliados.push(afiliados);
                        }
                    //  console.log("Todo -->", ($scope.afiliados));
                      //console.log("Afiliados -->", $scope.afiliados[0].mostrarPacientes());
                     // console.log("Afiliados -->",                       $scope.afiliados[0].mostrarPlanAtencion()[0].mostrarPlanes()[0].getDescripcion());
                      //console.log("afiliados[0].mostrarPlanAtencion() -->", $scope.afiliados[0]);
                      //console.log("afiliados[0].mostrarPacientes() -->",    $scope.afiliados[0].mostrarPacientes()[0].mostrarFormulas());
                     // console.log("afiliados[0].mostrarPacientes() -->",    $scope.afiliados[0].mostrarPacientes()[0].mostrarPlanAtencion());
                    /*  console.log("PacienteHc ", $scope.formulasMedicas);
                      console.log("PacienteHc ----->", $scope.formulasMedicas[0].mostrarFormulas()[0].getEvolucionId());*/
                      //console.log("EpsAfiliadosHc 1 ", $scope.afiliados[0].mostrarPacientes());
                      //console.log("EpsAfiliadosHc 2 ", $scope.afiliados[0]);
                      //$scope.formulasMedicas[0].formulasHc
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
                       prefijo:$scope.datos_view.prefijo,
                       numero: $scope.datos_view.numero,//$scope.datos_view.numero,
                       empresa_id:$scope.datos_view.empresaSeleccionada,
                       fechaInicial: $filter('date')($scope.datos_view.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                       fechaFinal:$filter('date')($scope.datos_view.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                       paginaactual:$scope.paginaactual,
                       registroUnico: false
                        
                    };
                    dispensacionHcService.listarFormulasPendientes($scope.session,$scope.datos_view.termino_busqueda_empresa, function(data){
                            
                           if(data.status === 200) {       
                               $scope.datos_view.items = data.obj.listar_formulas_pendientes.length;                              
                               that.renderListarFormulasMedicasPendientes(data.obj);
                                
                           }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                    });
                };
                
                 /**
                  * +Descripcion Metodo encargado de mapear las formula pendientes
                  */
                 that.renderListarFormulasMedicasPendientes = function(formulas){

                      $scope.afiliadosFormulasPendientes = [];
                      
                          for (var i in formulas.listar_formulas_pendientes) {
                           var _formula = formulas.listar_formulas_pendientes[i];
                            
                           //Se crea el objeto afiliados
                            var afiliados = EpsAfiliadosHc.get(_formula.tipo_id_paciente,_formula.paciente_id,_formula.plan_id)
                           
                            //Se crea el objeto paciente
                            var paciente = PacienteHc.get(_formula.tipo_id_paciente,
                                                        _formula.paciente_id,_formula.apellidos,_formula.nombres);
                                paciente.setEdad(_formula.edad);
                                paciente.setResidenciaDireccion(_formula.residencia_direccion);
                                paciente.setResidenciaTelefono(_formula.residencia_telefono);
                                paciente.setSexo(_formula.sexo);
                           
                              
                            //Se crea el objeto formula
                            var formula = FormulaHc.get(_formula.evolucion_id,_formula.numero_formula,'', '','', '', '','');
                                                      
                            var Productos  = ProductosHc.get(_formula.codigo_medicamento,_formula.descripcion, _formula.cantidad);            
                                                  
                                formula.agregarProductos(Productos);                 
                              
                         //El paciente tiene su formula
                         paciente.agregarFormulas(formula);
                         
                         //debe ser afiliado el paciente
                         afiliados.agregarPacientes(paciente);
                         /*afiliados.agregarPlanAtencion(planesAtencion);*/
                         
                         //Se almacenan los afiliados
                         $scope.afiliadosFormulasPendientes.push(afiliados);
                        }
                        
                //   console.log("$scope.afiliadosFormulasPendientes ", JSON.stringify($scope.afiliadosFormulasPendientes))     
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
                       numero: $scope.datos_view.numero,//$scope.datos_view.numero,
                       empresa_id:$scope.datos_view.empresaSeleccionada,
                       fechaInicial: $filter('date')($scope.datos_view.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                       fechaFinal:$filter('date')($scope.datos_view.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                       paginaactual:$scope.paginaactual,
                       registroUnico: false
                        
                    };
                   
                    dispensacionHcService.listarDespachosAprobados(obj,function(data){
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
                       
                        if($scope.filtro.nombre === "Prefijo"){
                           $scope.datos_view.numero = ""; 
                           $scope.datos_view.prefijo = $scope.datos_view.termino_busqueda;
                        }
                        
                        if($scope.filtro.nombre === "Numero"){
                           $scope.datos_view.prefijo = "";
                           $scope.datos_view.numero = $scope.datos_view.termino_busqueda;
                        }
                             that.listarDespachosAprobados()
                      
                     };
                   
                     
                     $scope.buscarFormulas = function(event){
                         
                        /* 
                              if($scope.filtro.nombre === "Prefijo"){
                                 $scope.datos_view.numero = ""; 
                                 $scope.datos_view.prefijo = $scope.datos_view.termino_busqueda;
                               }
                        
                              if($scope.filtro.nombre === "Numero"){
                                 $scope.datos_view.prefijo = "";
                                 $scope.datos_view.numero = $scope.datos_view.termino_busqueda;
                               }
                             that.listarDespachosAprobados()
                         }*/
                        if (event.which === 13) {      
                              if($scope.root.estadoFormula === '0'){
                                  that.listarFormulasMedicasPendientes();
                              }

                              if($scope.root.estadoFormula === '1'){
                                  that.listarFormulasMedicas();
                              }
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
                    $scope.detalleDespachoAprobado = function(dispensar) {
                          
                          console.log("dispensar ", dispensar)
                         /* localStorageService.add("validacionEgresosDetalle", 
                            {empresa: documentoAprobado.getEmpresaId(),
                             prefijo: documentoAprobado.getPrefijo(),
                             numero:  documentoAprobado.getNumero(),
                             estado:  1});*/
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
                     $scope.listaFormulas = {
                        data: 'afiliados',
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
                               
                           
                            {field: 'detalle', width: "6%",
                                displayName: "Opciones",
                                cellClass: "txt-center",
                                cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="detalleDespachoAprobado(row.entity)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'

                            }
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
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getNumeroFormula()', displayName: '# Formula', width:"9%"}, 
                            {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getCodigoProducto()', displayName: 'Codigo', width:"9%"},
                             {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getDescripcion()', displayName: 'Descripcion', width:"9%"},
                             {field: 'mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0].getExistencia()', displayName: 'Cantidad', width:"9%"},
                            {field: 'detalle', width: "6%",
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
                                 $scope.datos_view.estadoSesion = false;
                                 that.listarTipoDocumentos(function(estado){
                   
                                 });
                                 that.listarEmpresas(function(estado) {
                                    that.listarDespachosAprobados();
                                    that.listarFormulasMedicas();
                                    that.listarFormulasMedicasPendientes();
                                });                                  
                                }   
                            }
                         }                        
                     });
                     
                     
                     $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                     $scope.$$watchers = null;
                    // set localstorage
                    
                     $scope.datos_view=null;
                   
                });

         }]);
});
