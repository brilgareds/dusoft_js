define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('dispensacionRealizarEntregaController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',    
            "$timeout", 
            "$filter",
            "localStorageService",
            "$state",
            "dispensacionHcService","$modalInstance","socket","estadoEntregaFormula","estadoTodoPendiente","tipoEstadoFormula","webNotification",
        function($scope, $rootScope, Request, API, AlertService, Usuario,                     
                $timeout, $filter,localStorageService,$state,dispensacionHcService,
                $modalInstance,socket,estadoEntregaFormula, estadoTodoPendiente,tipoEstadoFormula,webNotification) {

        var that = this;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
        var seleccionTipoFormula;
        $scope.root = { observacion:''}; 
        
     
        /*
         * Inicializacion de variables
         * @param {type} empresa
         * @param {type} callback
         * @returns {void}
         */
        that.init = function(empresa, callback) {

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };


            callback();
        };
                  
        
      /**
        * @author Cristian Ardila
        * @fecha 09/06/2016 (MM/DD/YYYY)
        * +Descripcion Metodo el cual invocara el servicio que consulta
        *              todos los tipos de formulas
        * */
        that.listarTipoFormulas = function(){

            var obj = {
                session: $scope.session,
                data: {
                    listar_tipo_formula:{

                    }
                }
            };

            dispensacionHcService.listarTipoFormula(obj,function(data){
             
                if(data.status === 200){                        
                   $scope.tipoFormula =  dispensacionHcService.renderListarTipoDocumento(data.obj.listar_tipo_formula);
                  
                }else{                         
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                }
               
            });

        };
        $scope.btnEntregaFormula = true;
        /**
         * @author Cristian Ardila
         * +Descripcion Se visualiza la tabla con los tipos de formulas
         * @fecha 25/05/2016
         */
        $scope.listaTiposFormulas = {
            data: 'tipoFormula',
            afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $scope.btnEntregaFormula = false;
                        that.onSeleccionTipoFormula(rowItem.entity);
                        
                    }else{
                        $scope.btnEntregaFormula = true;
                        that.onSeleccionTipoFormula(undefined);
                    }
                },
            enableColumnResize: true,
            enableRowSelection: true,
            keepLastSelected: false,
            multiSelect: false,
            columnDefs: [
                {field: 'descripcion', displayName: 'Descripcion'},              
            ],
            
        };
         
        that.onSeleccionTipoFormula = function(entity){
            seleccionTipoFormula = entity;
        };
        
        /**
         * @author Cristian Ardila
         * Descripcion Metodo encargado de consultar previamente la cabecera de la formula
         *              para obtener el detalle del paciente y una vez consultados
         *              se dispone a invocar los metodos dependiente del estado 
         *              de la variable 
         *              estadoEntregaFormula = 0
         *              Si la variable estadoTodoPendiente es = 1 
         *              se invocara el metodo
         *              dispensacionNormal: Se dispensa la formula en su estado natural
         *              si no se invocara el metodo
         *              guardarTodoPendiente: Se dejan pendientes todos los medicamentos de la formula
         *              
         *              estadoEntregaFormula = 1
         *              dispensacionPendientes Se dispensan los medicamentos pendientes
         * @author Cristian Ardila
         */
        that.realizarEntregaFormula = function(){
            
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");          
            var parametroCabecera = { 
                session: $scope.session,
                data: {
                   cabecera_formula: {
                        evolucion: resultadoStorage.evolucionId
                   }
               } 
            }
             
             dispensacionHcService.obtenerCabeceraFormula(parametroCabecera,function(data){
                
                $scope.cerrarVentana();
                $state.go('DispensacionHc');
                AlertService.mostrarMensaje("warning", data.msj);
                if(data.status === 500){                       
                   AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                }
 
                socket.on("onNotificarCabeceraFormula", function(datos) {

                    if(datos.status === 201){
                        AlertService.mostrarMensaje("success", datos.msj);
                    }
                    
                    console.log("$scope.root.observacion ", $scope.root.observacion);
                    if(datos.status === 200){
                        
                        var obj = {                   
                            session: $scope.session,
                            data: {
                               realizar_entrega_formula: {
                                    variable: 'ParametrizacionReformular',
                                    evolucionId: resultadoStorage.evolucionId,                    
                                    empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(), 
                                    bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                                    observacion: $scope.root.observacion + " No. Formula: " + datos.obj.cabecera_formula[0].numero_formula
                                                 +" No. Evolucion: "+ resultadoStorage.evolucionId 
                                                 + " Paciente " + datos.obj.cabecera_formula[0].tipo_id_paciente + " " + datos.obj.cabecera_formula[0].paciente_id
                                                 + " "+ datos.obj.cabecera_formula[0].nombres
                                                 + " "+ datos.obj.cabecera_formula[0].apellidos,
                                    todoPendiente:0,
                                    tipoFormula: seleccionTipoFormula,
                                    tipoEstadoFormula: tipoEstadoFormula,
                                    tipoIdPaciente:datos.obj.cabecera_formula[0].tipo_id_paciente,
                                    pacienteId: datos.obj.cabecera_formula[0].paciente_id

                               }
                            }    
                        };  
                         if(estadoEntregaFormula === 0){

                            if(estadoTodoPendiente === 1){
                                that.dispensacionNormal(obj);
                            }else{
                                that.guardarTodoPendiente(obj);
                            }
                        }                   

                        if(estadoEntregaFormula === 1){
                            that.dispensacionPendientes(obj);
                        }
                    }                    
                }); 
           /* dispensacionHcService.obtenerCabeceraFormula(parametroCabecera,function(data){
                
                
                if(data.status === 200){                   
                    
                    var obj = {                   
                        session: $scope.session,
                        data: {
                           realizar_entrega_formula: {
                                variable: 'ParametrizacionReformular',
                                evolucionId: resultadoStorage.evolucionId,                    
                                empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(), 
                                bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                                observacion: $scope.root.observacion + " No. Formula: " + data.obj.cabecera_formula[0].numero_formula
                                             +" No. Evolucion: "+ resultadoStorage.evolucionId 
                                             + " Paciente " + data.obj.cabecera_formula[0].tipo_id_paciente + " " + data.obj.cabecera_formula[0].paciente_id
                                             + " "+ data.obj.cabecera_formula[0].nombres
                                             + " "+ data.obj.cabecera_formula[0].apellidos,
                                todoPendiente:0,
                                tipoFormula: seleccionTipoFormula,
                                tipoEstadoFormula: tipoEstadoFormula

                           }
                        }    
                    };  
           
                    if(estadoEntregaFormula === 0){
                
                        if(estadoTodoPendiente === 1){
                            that.dispensacionNormal(obj);
                        }else{
                            that.guardarTodoPendiente(obj);
                        }
                    }                   
           
                    if(estadoEntregaFormula === 1){
                        that.dispensacionPendientes(obj);
                    }
                                      
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }*/
            });  
           
        };
        
        
        
        /**
         * @author Cristian Ardila
         * @fecha  2016/08/03
         * +Descripcion Metodo el cual invocara el servicio que permitira realizar
         *              todo el proceso pertinente para dispensar una formula con
         *              pendientes
         *             
         */
        that.guardarTodoPendiente = function(obj){
            var evolucionStorage = localStorageService.get("dispensarFormulaDetalle");
            dispensacionHcService.guardarTodoPendiente(obj,function(data){
              
                if(data.status === 200){                   
                    AlertService.mostrarMensaje("success", data.msj);                  
                    $scope.cerrarVentana();
                    $state.go('DispensacionHc');   
                    
                    localStorageService.add("formulaTodoPendiente",{
                        evolucion: evolucionStorage.evolucionId,
                        filtro:{tipo:'EV'},
                        empresa: 'FD',
                        pacienteId: evolucionStorage.pacienteId,
                        tipoIdPaciente: evolucionStorage.tipoIdPaciente
                                  
                    });
                                                      
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            });         
        };
        
        
        
        /*that.dispensacionPendientes = function(obj){
            
            var evolucionStorage = localStorageService.get("dispensarFormulaDetalle");
            dispensacionHcService.realizarEntregaFormulaPendientes(obj,function(data){
                if(data.status === 200){                   
                    AlertService.mostrarMensaje("success", data.msj);                  
                    $scope.$emit('emitRealizarEntregaFormula', {response: data});
                    $scope.cerrarVentana();
                    $state.go('DispensacionHc');
                    
                    localStorageService.add("consultarFormulaPendientes",{
                        evolucion: evolucionStorage.evolucionId,
                        filtro:{tipo:'EV'},
                        empresa: 'FD',
                        pacienteId: evolucionStorage.pacienteId,
                        tipoIdPaciente: evolucionStorage.tipoIdPaciente

                    });
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            });         
        };*/
        /*
         * @author Cristian Manuel Ardila
         * +Descripcion Metodo encargado generar el reporte
         * para consultar los medicamentos pendientes           
         * @fecha  2016-10-12
         */
        that.consultaMedicamentosPendientes = function(parametros){

            var obj = {                   
                session: $scope.session,
                data: {
                   listar_medicamentos_pendientes: {
                        evolucion: parametros.evolucionId,
                        tipoIdPaciente:parametros.tipoIdPaciente,
                        pacienteId: parametros.pacienteId
                   }
                }    
            };   

            dispensacionHcService.listarMedicamentosPendientesPorDispensar(obj,function(data){
                console.log("data [consultaMedicamentosPendientes]: ", data);
                if (data.status === 200) {
                    var nombre = data.obj.listar_medicamentos_pendientes.nombre_pdf;                    
                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });  
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
                        evolucion: parametro.evolucionId,
                        tipoIdPaciente:parametro.tipoIdPaciente,
                        pacienteId: parametro.pacienteId,
                        pendientes: estado
                   }
               }    
            };    
            dispensacionHcService.listarMedicamentosDispensados(obj,function(data){
                console.log("data [consultaMedicamentosPendientes]: ", data);
                if (data.status === 200) {
                    var nombre = data.obj.listar_medicamentos_dispensados.nombre_pdf;                          
                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });  
        };

                
        that.notificarSolicitud = function(title, body, parametros) {
            
            console.log("notificar SOlicitud ", parametros)
            webNotification.showNotification(title, {
                body: body,
                icon: '/images/logo.png',
                onClick: function onNotificationClicked() {
                    that.consultaMedicamentosPendientes(parametros); 
                    that.consultaMedicamentosDispensados(parametros,0);
                },
                autoClose: 90000 //auto close the notification after 2 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
                if (error) {
                    window.alert('Error interno: ' + error.message);
                } else {

                    setTimeout(function hideNotification() {

                        hide(); //manually close the notification (you can skip this if you use the autoClose option)
                    }, 90000);
                }
            });
        }
        
            /**
            * @author Cristian Ardila
            * @fecha  2016/08/03
            * +Descripcion Metodo el cual invocara el servicio que permitira realizar
            *              todo el proceso pertinente para dispensar una formula con
            *              pendientes
            *             
            */
        that.dispensacionPendientes = function(obj){
            
           dispensacionHcService.realizarEntregaFormulaPendientes(obj,function(data){
                
                AlertService.mostrarMensaje("warning", data.msj);

                if(data.status === 500){                       
                   AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                }
 
                socket.on("onNotificarEntregaFormula", function(datos) {
                    
                    console.log("datos ", datos);

                    if(datos.status === 200){
 
                        that.notificarSolicitud("Entrega lista", "Formula # " + datos.obj.dispensacion, 
                        {evolucionId:datos.obj.evolucionId,
                            tipoIdPaciente:datos.obj.tipoIdPaciente,
                            pacienteId:datos.obj.pacienteId});
                    }                    
                });               
            });    
        };
        
        
       
        /**
         * @author Cristian Ardila
         * @fecha  2016/08/03
         * +Descripcion Metodo el cual invocara el servicio que permitira realizar
         *              todo el proceso pertinente para dispensar una formula
         *             
         */
        that.dispensacionNormal = function(obj){
                   
            dispensacionHcService.realizarEntregaFormula(obj,function(data){
               
                AlertService.mostrarMensaje("warning", data.msj);
                if(data.status === 500){                       
                   AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                }
 
                socket.on("onNotificarEntregaFormula", function(datos) {
 
                    if(datos.status === 200){
 
                        that.notificarSolicitud("Entrega lista", "Formula # " + datos.obj.dispensacion, 
                        {evolucionId:datos.obj.evolucionId,
                            tipoIdPaciente:datos.obj.tipoIdPaciente,
                            pacienteId:datos.obj.pacienteId});
                        
                    }                    
                }); 
               /* if(data.status === 200){                   
                    AlertService.mostrarMensaje("success", data.msj);                  
                    $scope.cerrarVentana();
                    $state.go('DispensacionHc');   
                    
                    localStorageService.add("consultarFormula",{
                        evolucion: evolucionStorage.evolucionId,
                        filtro:{tipo:'EV'},
                        empresa: 'FD',
                        pacienteId: evolucionStorage.pacienteId,
                        tipoIdPaciente: evolucionStorage.tipoIdPaciente

                    });
                                                      
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }*/
            });         
        };
        
        
        
        /**
         * @author Cristian Manuel Ardila
         * +Descripcion Metodo encargado de sugerir al usuario dos tipos de confirmacion
         *              antes de dispensar la formula
         *   
         */
        $scope.realizarEntregaFormula = function(){
            /**
             * +Descripcion Se valida si el usuario selecciono el tipo de formula
             */
            if(!seleccionTipoFormula || seleccionTipoFormula === undefined){
                 AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar el tipo de formula");
                return;
            }
            AlertService.mostrarVentanaAlerta("IMPORTANTE",  "UNA VEZ REALIZADA LA ENTREGA DE LOS MEDICAMENTOS\n NO SE PODRA MODIFICAR (POR FAVOR VERIFIQUE!!!)",
                function(estado){               
                    if(estado){                    
                        AlertService.mostrarVentanaAlerta("MENSAJE DE ENTREGA DE MEDICAMENTOS",  "DESEA REALIZAR LA ENTREGA DE MEDICAMENTOS",
                            function(estadoConfirm){                
                                if(estadoConfirm){
                                    that.realizarEntregaFormula();
                                }
                            }
                        );  
                     
                    }
                }
            ); 
        };
        
        
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de invocar el servicio que consultara
         *              los medicamentos temporales
         * @fecha 08/06/2016
         * @returns {undefined}
         */      
        that.consultarMedicamentosTemporales = function(){                
            $scope.Temporales = [];
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
            var obj = {                   
                session: $scope.session,
                data: {
                   listar_medicamentos_temporales: {
                        evolucion: resultadoStorage.evolucionId                           
                   }
                }    
            };      
            
            dispensacionHcService.medicamentosTemporales(obj, function(data){

                if(data.status === 200){                     
                    $scope.Temporales.push(dispensacionHcService.renderMedicamentosTemporales(data.obj.listar_medicamentos_temporales));    

                }      
                    
            });  
        };
        
        
        /**
        * @author Cristian Ardila
        * +Descripcion Se visualiza la tabla con los medicamentos listos
        *              para dispensar
        * @fecha 27/09/2016
        **/
        $scope.medicamentosTemporales = {
            data: 'Temporales[0]',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'getDescripcion()', displayName: 'Medicamento'},
                {field: 'mostrarLotes()[0].getCantidad()', displayName: 'Cantidad', width:"20%"}
               
            ]
        };
        
       
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de cerrar la ventana actual
         * @fecha 09/06/2016 (DD/MM/YYYY)
         */
        $scope.cerrarVentana = function(){
            
            $modalInstance.close();
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

                    }
                }
            }
        });
        
        that.listarTipoFormulas();
        that.consultarMedicamentosTemporales();
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            
            socket.remove(['onNotificarEntregaFormula','onNotificarCabeceraFormula']);  
            $scope.$$watchers = null;
            // set localstorage

           
                   
        });

         }]);
});
