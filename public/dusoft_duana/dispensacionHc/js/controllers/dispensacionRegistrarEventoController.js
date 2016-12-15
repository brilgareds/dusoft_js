define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('dispensacionRegistrarEventoController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',    
            "$timeout", 
            "$filter",
            "localStorageService",
            "$state",
            "dispensacionHcService","$modalInstance","socket",
        function($scope, $rootScope, Request, API, AlertService, Usuario,                     
                $timeout, $filter,localStorageService,$state,dispensacionHcService,$modalInstance,socket) {

        var that = this;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
        var fecha_actual = new Date();
        
         $scope.root = {                  
                    fechaRegistroEvento: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                    observacion: ''
         };
         
         /**
            * @author Cristian Ardila
            * @fecha 04/02/2016
            * +Descripcion Funcion que permitira desplegar el popup datePicker
            *               de la fecha de registro del evento
            * @param {type} $event
            */   
        $scope.abrirFechaRegistroEvento = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.root.datepickerFechaRegistroEvento = true;
        };
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
         * @author Cristian Manuel Ardila Troches
         * @fecha 2016-08-03
         * +Descripcion Funcion encargada de invocar el servicio para registrar
         *              el evento del paciente al cual se le dispensaran los
         *              medicamentos pendientes
         */
        that.registrarEvento = function(){
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle"); 
            
            var obj = {                   
                session: $scope.session,
                data: {
                   registrar_evento: {
                        evolucionId: resultadoStorage.evolucionId,                    
                        observacion: $scope.root.observacion,
                        pacienteId: resultadoStorage.pacienteId,
                        tipoIdPaciente: resultadoStorage.tipoIdPaciente,
                        fecha: $scope.root.fechaRegistroEvento
                   }
               }    
            };  
         
            dispensacionHcService.registrarEvento(obj,function(data){
             
                if(data.status === 200){                   
                    AlertService.mostrarMensaje("success", data.msj);                  
                    $scope.cerrarVentana();
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            }); 
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo de confirmacion que se ejecutara cuando desde el formulario
         * @fecha 2016/08/03        
         */
        $scope.registrarEvento = function(){
            
            AlertService.mostrarVentanaAlerta("Mensaje del sistema",  "Desea registrar el evento?",
                function(estado){               
                    if(estado){                    
                       that.registrarEvento();
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
        
        
        
        
        
        
        /**
        * @author Cristian Ardila
        * @fecha 09/06/2016 (MM/DD/YYYY)
        * +Descripcion Metodo el cual invocara el servicio que consulta
        *              todos los registros de los eventos de esta formula
        * */
        that.listarRegistroDeEventos = function(){
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle"); 
            
            var obj = {
                session: $scope.session,
                data: {
                    registrar_evento:{
                        evolucion: resultadoStorage.evolucionId, 
                    }
                }
            };

            dispensacionHcService.listarRegistroDeEventos(obj,function(data){
                
               
                if(data.status === 200){                        
                   $scope.registroDeEventos =  dispensacionHcService.renderListarTipoDocumento(data.obj.listar_registro_eventos);
                  
                }else{                         
                    AlertService.mostrarMensaje("success", data.msj); 
                }
               
            });

        };
        
        /*that.onDescripcionCompletaObservacion = function (entity){
            
            $scope.root.observacion = entity.descripcion;
        };*/
        /**
         * @author Cristian Ardila
         * +Descripcion Se visualiza la tabla con los tipos de formulas
         * @fecha 25/05/2016
         */
        $scope.listaRegistroDeEventos = {
            data: 'registroDeEventos',
            /*afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        that.onDescripcionCompletaObservacion(rowItem.entity);
                    }
                },*/
            enableColumnResize: true,
            enableRowSelection: true,
            keepLastSelected: false,
            multiSelect: false,
            columnDefs: [
                             
                {field: 'tipo', displayName: 'Fecha registro', width: '20%'},
                {field: 'descripcion', displayName: 'Descripcion'}
            ],
            
        };
        
        
        
        that.listarRegistroDeEventos();
        
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
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $scope.$$watchers = null;
            // set localstorage

            $scope.root=null;
                   
        });

     }]);
});
