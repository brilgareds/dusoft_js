define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('dispensacionRealizarEntregaController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',    
            "$timeout", 
            "$filter",
            "localStorageService",
            "$state",
            "dispensacionHcService","$modalInstance","socket","estadoEntregaFormula","estadoTodoPendiente","tipoEstadoFormula",
        function($scope, $rootScope, Request, API, AlertService, Usuario,                     
                $timeout, $filter,localStorageService,$state,dispensacionHcService,$modalInstance,socket,estadoEntregaFormula, estadoTodoPendiente,tipoEstadoFormula) {

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
        
        /**
         * @author Cristian Ardila
         * +Descripcion Se visualiza la tabla con los tipos de formulas
         * @fecha 25/05/2016
         */
        $scope.listaTiposFormulas = {
            data: 'tipoFormula',
            afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        that.onSeleccionTipoFormula(rowItem.entity);
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
            console.log("entity ", seleccionTipoFormula);
        };
        
        that.realizarEntregaFormula = function(){
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle"); 
            var obj = {                   
                session: $scope.session,
                data: {
                   realizar_entrega_formula: {
                        variable: 'ParametrizacionReformular',
                        evolucionId: resultadoStorage.evolucionId,                    
                        empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(), 
                        bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                        observacion: $scope.root.observacion,
                        todoPendiente:0,
                        tipoFormula: seleccionTipoFormula,
                        tipoEstadoFormula: tipoEstadoFormula
                        
                   }
               }    
            };  
           
            if(estadoEntregaFormula === 0){
                
                if(estadoTodoPendiente === 1){
                    console.log("DISPENSAR FORMULA ");
                    that.dispensacionNormal(obj);
                }else{
                    console.log("TODO PENDIENTES ");
                    that.guardarTodoPendiente(obj);
                }
                //
            }
           
           
            if(estadoEntregaFormula === 1){
                console.log("DISPENSAR PENDIENTES FORMULA ");
                that.dispensacionPendientes(obj);
            }
            
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
            
            dispensacionHcService.guardarTodoPendiente(obj,function(data){
                console.log("guardarTodoPendiente ", data);
                if(data.status === 200){                   
                    AlertService.mostrarMensaje("success", data.msj);                  
                    //$scope.$emit('emitRealizarEntregaFormula', {response: data});
                    $scope.cerrarVentana();
                    $state.go('DispensacionHc');  
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
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
        that.dispensacionPendientes = function(obj){
            console.log("*********dispensacionPendientes*************");
            
            var evolucionStorage = localStorageService.get("dispensarFormulaDetalle");
            dispensacionHcService.realizarEntregaFormulaPendientes(obj,function(data){
                console.log("DATA ULTIMA RESPUESTA ", data);
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
        };
        
        /**
         * @author Cristian Ardila
         * @fecha  2016/08/03
         * +Descripcion Metodo el cual invocara el servicio que permitira realizar
         *              todo el proceso pertinente para dispensar una formula
         *             
         */
        that.dispensacionNormal = function(obj){
            console.log("*********dispensacionNormal*************");
            
            var evolucionStorage = localStorageService.get("dispensarFormulaDetalle");
           
            dispensacionHcService.realizarEntregaFormula(obj,function(data){
              
                if(data.status === 200){                   
                    AlertService.mostrarMensaje("success", data.msj);                  
                    $scope.$emit('emitRealizarEntregaFormula', {response: data});
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
                }
            });         
        };
        
        
        
        
        $scope.realizarEntregaFormula = function(){
            
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
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $scope.$$watchers = null;
            // set localstorage

            $scope.root=null;
                   
        });

         }]);
});
