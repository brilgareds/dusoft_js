define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('ActaTecnicaController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',    
            "$timeout", 
            "$filter",
            "localStorageService",
            "$state",
            "$modalInstance","socket","identificadorProductoPendiente",
        function($scope, $rootScope, Request, API, AlertService, Usuario,                     
                $timeout, $filter,localStorageService,$state,$modalInstance,socket,identificadorProductoPendiente) {

        var that = this;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
        var seleccionTipoJustificacion;
        $scope.root = { observacion:''}; 
        console.log("SSSSSSSSSSSSSSSSS",identificadorProductoPendiente);
     
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
                  
        
        var justificacion = [{descripcion: 'Error de formulacion ', id:'0'},
                            {descripcion: 'Error de digitacion', id:'1'},
                            {descripcion: 'Confrontado', id:'2'}]
      /**
        * @author Cristian Ardila
        * @fecha 09/06/2016 (MM/DD/YYYY)
        * +Descripcion Metodo el cual invocara el servicio que consulta
        *              todos los tipos de formulas
        **/
        that.listarTiposJustificaciones = function(){

            var obj = {
                session: $scope.session,
                data: {
                    listar_tipo_formula:{

                    }
                }
            };
//            dispensacionHcService.listarTipoFormula(obj,function(data){
//                                      
//                   $scope.tipoJustificacion =  dispensacionHcService.renderListarTipoDocumento(justificacion);                                              
//            });
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Se visualiza la tabla con los tipos de formulas
         * @fecha 25/05/2016
         */
        $scope.listarTiposJustificaciones = {
            data: 'tipoJustificacion',
            afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                       
                        that.onSeleccionTipoFormula(rowItem.entity);
                    }else{
                        that.onSeleccionTipoFormula(undefined);
                    }
                },
            enableColumnResize: true,
            enableRowSelection: true,
            keepLastSelected: false,
            multiSelect: false,
            columnDefs: [
                {field: 'descripcion', displayName: 'Descripcion'}
            ]
            
        };
         
        that.onSeleccionTipoFormula = function(entity){
            seleccionTipoJustificacion = entity;          
        };
        
         /**
         * +Descripcion metodo encargado de invcar el servicio que descartara 
         *              el producto de los pendientes
         */
        that.descartarProductoPendiente = function(){
            
            if(!seleccionTipoJustificacion){
                 AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar la justificacion");
                 return;
            }
            var obj = {                   
                session: $scope.session,
                data: {
                   realizar_descarate_producto: {
                        evolucion: evolucion,
                        identificadorProductoPendiente: identificadorProductoPendiente,
                        tipoJustificacion: seleccionTipoJustificacion.tipo
                       
                   }
               }    
            };   
           
            dispensacionHcService.descartarProductoPendiente(obj,function(data){
                     
                if(data.status === 200) {       
                    AlertService.mostrarMensaje("success", data.msj);
                    $scope.cerrarVentana();
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            });                           
            
        };
        
        /**
         * +Descripcion metodo ejecutado desde la vista para confirmar si
         *              desea descartar el pendiente o no
         */
        $scope.descartarProductoPendiente = function(){
            
            AlertService.mostrarVentanaAlerta("Confirmar",  "Desea descartar el pendiente",
                function(estado){               
                    if(estado){
                      that.descartarProductoPendiente();
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
        
        that.listarTiposJustificaciones();
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $scope.$$watchers = null;
            // set localstorage

            $scope.root=null;
                   
        });

         }]);
});
