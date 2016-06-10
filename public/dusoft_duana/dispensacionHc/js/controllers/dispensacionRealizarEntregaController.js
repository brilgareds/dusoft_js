define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('dispensacionRealizarEntregaController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',    
            "$timeout", 
            "$filter",
            "localStorageService",
            "$state",
            "dispensacionHcService","$modalInstance",
        function($scope, $rootScope, Request, API, AlertService, Usuario,                     
                $timeout, $filter,localStorageService,$state,dispensacionHcService,$modalInstance) {

        var that = this;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              

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
            
            console.log("entity ", entity)
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
                        todoPendiente:0
                        
                   }
               }    
            };  
           console.log("ESTO obj ", obj);
            dispensacionHcService.realizarEntregaFormula(obj,function(data){
                
                console.log("estado realizarEntregaFormula: ", data);
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
