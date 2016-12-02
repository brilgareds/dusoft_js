define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('dispensacionMovimientoFormulasPacienteController',
        ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',    
            "$timeout", 
            "$filter",
            "localStorageService",
            "$state",
            "dispensacionHcService","$modalInstance","socket","detallePaciente",
        function($scope, $rootScope, Request, API, AlertService, Usuario,                     
                $timeout, $filter,localStorageService,$state,dispensacionHcService,$modalInstance,socket, detallePaciente) {

        var that = this;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
             
          /**
            * @author Cristian Manuel Ardila Troches
            * +Descripcion Metodo que se activara cuando se seleccione
            *              en la lista de formulas de la pagina principal
            *              la opcion (Movimiento), el cual invocara el 
            *              servicio encargado de listar el movimiento
            *              de formulas del paciente
            * @fecha 2016/12/02 YYYY/MM/DD
            */
           that.consultarMovimientoFormulasPaciente = function(){                        

               var obj = {                   
                           session: $scope.session,
                           data: {
                              consultar_movimiento_formula_paciente: {
                                   tipoIdPaciente:detallePaciente.tipoIdPaciente,
                                   pacienteId: detallePaciente.pacienteId,

                              }
                          }    
                       };  
               dispensacionHcService.consultarMovimientoFormulasPaciente(obj,function(data){

                   if(data.status === 200){ 

                       $scope.listaMovimientoFormulasPaciente = dispensacionHcService.renderListarMovimientoFormulasPaciente(data.obj);
                       
                   }else{                         
                      AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj); 
                   }


               });   //dispensacionMovimientoFormulasPaciente


           };
           
           
           /**
            * +Descripcion Se visualiza la tabla con todas las aprobaciones
            *              por parte del personal de seguridad
            */
          $scope.listaMovimientoFormulaPaciente = {
              data: 'listaMovimientoFormulasPaciente',
              enableColumnResize: true,
              enableRowSelection: false,
              enableCellSelection: true,
              enableHighlighting: true,
              columnDefs: [
                  {field: 'getNombre()', displayName: 'Farmacia', width:"12%"}, 
                  {field: 'mostrarUsuarios()[0].getNombre()', displayName: '# Usuario', width:"12%"}, 
                  {field: 'mostrarUsuarios()[0].mostrarModulosHc()[0].getNombre()', displayName: 'Modulo', width:"12%"}, 
                  {field: 'mostrarUsuarios()[0].mostrarModulosHc()[0].mostrarEntregas()[0].getFechaEntrega()', displayName: 'Fecha', width:"12%"}, 
                  {field: 'mostrarUsuarios()[0].mostrarModulosHc()[0].mostrarEntregas()[0].mostrarFormulas()[0].getNumeroFormula()', displayName: 'Fecha', width:"12%"}, 
                  {field: 'mostrarUsuarios()[0].mostrarModulosHc()[0].mostrarEntregas()[0].mostrarFormulas()[0].mostrarProductos()[0].getCodigoProducto()', displayName: 'Codigo', width:"12%"}, 
                  {field: 'mostrarUsuarios()[0].mostrarModulosHc()[0].mostrarEntregas()[0].mostrarFormulas()[0].mostrarProductos()[0].getDescripcion()', displayName: 'Descripcion', width:"12%"}, 
                  {field: 'mostrarUsuarios()[0].mostrarModulosHc()[0].mostrarEntregas()[0].mostrarFormulas()[0].mostrarProductos()[0].getCantidadEntrega()', displayName: 'Cantidad', width:"12%"}, 
                 
              ]               
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
                  
        that.consultarMovimientoFormulasPaciente();
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
        
         
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $scope.$$watchers = null;
            // set localstorage

            $scope.root=null;
                   
        });

   }]);
});
