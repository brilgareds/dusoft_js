define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('dispensacionAutorizarDispensacion',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',    
            "$timeout", 
            "$filter",
            "localStorageService",
            "$state",
            "dispensacionHcService","$modalInstance","socket","detalleRegistroDispensacion","codigoProducto",
        function($scope, $rootScope, Request, API, AlertService, Usuario,                     
                $timeout, $filter,localStorageService,$state,dispensacionHcService,$modalInstance,socket,detalleRegistroDispensacion, codigoProducto) {

        var that = this;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
        var seleccionTipoObservacion;
        $scope.root = { observacion:''}; 
        
        console.log("detalleRegistroDispensaciondetalleRegistroDispensacion ", detalleRegistroDispensacion.msj[0]);
        $scope.detalleRegistroDispensacion = detalleRegistroDispensacion.msj[0];
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
                  
        
        that.tipoObservacionConfrontado = function(){
            
              var tipoObservacion = [];                
              var data = [ {descripcion: "Prueba de observacion #1"},
                           {descripcion: "Prueba de observacion #2"},
                           {descripcion: "Prueba de observacion #3"}];
                     
              for(var i in data){                
                  tipoObservacion.push(data[i]);
                }                  
                return tipoObservacion;
        };
      /**
        * @author Cristian Ardila
        * @fecha 09/06/2016 (MM/DD/YYYY)
        * +Descripcion Metodo el cual invocara el servicio que consulta
        *              todos los tipos de formulas
        * */
        that.listarTipoObservacion = function(){

           $scope.tipoObservacion =  that.tipoObservacionConfrontado();
          
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Se visualiza la tabla con los tipos de formulas
         * @fecha 25/05/2016
         */
        $scope.listaTipoObservacion = {
            data: 'tipoObservacion',
            afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        that.onSeleccionTipoObservacion(rowItem.entity);
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
         
        that.onSeleccionTipoObservacion = function(entity){
            seleccionTipoObservacion = entity;
            console.log("entity ", seleccionTipoObservacion);
        };
        
        that.realizarEntregaFormula = function(){
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle"); 
            var obj = {                   
                session: $scope.session,
                data: {
                   autorizar_dispensacion: {
                        evolucion: resultadoStorage.evolucionId,                    
                        observacion: seleccionTipoObservacion.descripcion,
                        producto: codigoProducto
                        
                   }
               }    
            };  
          
            dispensacionHcService.autorizarDispensacionMedicamento(obj,function(data){
                console.log("RESPONDIENDO Y ACTUALIZANDO " );
                if(data.status === 200){
                     
                    AlertService.mostrarMensaje("success", data.msj);
                    //console.log("data.obj.autorizar_dispensacion.rows ", data.obj.autorizar_dispensacion.evolucion_id)
                    $scope.$emit('emitAutorizarDispensacionMedicamento', {evolucionId: data.obj.autorizar_dispensacion.evolucion_id});
                    $scope.cerrarVentana();
                    //$state.go('DispensacionHc');
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            }); 
        };
        
        
         
        $scope.realizarAutorizacionDispensacion = function(){
            
            AlertService.mostrarVentanaAlerta("Mensaje del sistema",  "Desea autorizar la dispensacion del medicamento?",
                function(estado){               
                    if(estado){                    
                       that.realizarEntregaFormula();
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
        
        that.listarTipoObservacion();
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $scope.$$watchers = null;
            // set localstorage

            $scope.root=null;
                   
        });

         }]);
});
