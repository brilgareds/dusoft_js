
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {
    //probando branch de pedidos clientes
    controllers.controller('dispensacionHcDetalleController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "$filter",
        "Usuario","AprobacionDespacho","EmpresaDispensacionHc","dispensacionHcService",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                 Sesion,AprobacionDespacho,EmpresaDispensacionHc,dispensacionHcService) {

            var that = this;
            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };
         
            // Definicion variables del View
           
            $scope.root = {
                seleccionarOtros: '',
                empresaSeleccionada: '',
                activar_tab: {tab_productos: true, tab_cargar_archivo: false},
                visualizar: false,
                // Opciones del Modulo 
                opciones: Sesion.getUsuarioActual().getModuloActual().opciones,
                progresoArchivo: 0,
                btnSolicitarAutorizacionCartera: true,
                estadoRegistro: 0,
                prefijoList: '',
                existenciaDocumento:true,
                detalleFormula: []
               

            };
            
            $scope.documentoDespachoAprobado;
            
            $scope.cargarEmpresaSession = function(){
                
                if($scope.root.seleccionarOtros){
                var session = angular.copy(Sesion.getUsuarioActual().getEmpresa());
                var empresa = EmpresaDispensacionHc.get(session.nombre, session.codigo);          
                    $scope.root.empresaSeleccionada = empresa;
                    
                }else{
                    
                    $scope.root.empresaSeleccionada = "";
                }
            };    
            
			 
	
            /**
             * +Descripcion: Se activa el cambo de interfaz, cuando se selecciona
             *               el detalle de una aprobacion o se creara una aprobacion
             */
            if ($state.is("DispensarFormulaDetalle") === true) {
               
              
             var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
             console.log(" ---- obj ---- ", resultadoStorage);
              
              var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_formulas: {
                                filtro:{tipo:'EV'},
                                terminoBusqueda: resultadoStorage.evolucionId,//$scope.root.numero,
                                empresaId:'',
                                fechaInicial: resultadoStorage.fechaInicial,
                                fechaFinal:resultadoStorage.fechaFinal,
                                paginaActual:resultadoStorage.paginaActual,
                                estadoFormula : resultadoStorage.estadoFormula
                           }
                       }    
                    };
                 
                  
                    dispensacionHcService.listarFormulas(obj, function(data){
                        
                        console.log("De nuevo data ", data)
                           if(data.status === 200) {       
                               //$scope.root.items = data.obj.listar_formulas.length;                              
                               $scope.root.detalleFormula = dispensacionHcService.renderListarFormulasMedicas(data.obj,1);
                               that.listarMedicamentosFormulados(resultadoStorage);
                           }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                           
                         //  console.log("$scope.root.detalleFormula ", $scope.root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].agregarProductos({productoDes: 'Hola mundo'}));
                           
                    });
               
            };
            
               
           that.listarMedicamentosFormulados = function(resultadoStorage){
               
                 var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_formulados: {
                              
                                evolucionId: resultadoStorage.evolucionId,//$scope.root.numero,
                                
                           }
                       }    
                    };
               dispensacionHcService.listarMedicamentosFormulados(obj,function(data){
                  
                 $scope.root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].agregarProductos(dispensacionHcService.renderListarMedicamentosFormulados(data.obj));
                  /*   console.log(" *************** Lista medicamentos formulados ", data.obj.listar_medicamentos_formulados) */
                   //console.log("$scope.root.detalleFormula ", $scope.root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos());
                     console.log("Detalle de la formula ", $scope.root.detalleFormula[0])    
                  
               });
           }
           
           $scope.regresarListaDespachosAprobados = function() {
                $state.go('DispensacionHc');
            };

            that.init = function() {
            };       
            that.init();
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                // set localstorage
                localStorageService.add("dispensarFormulaDetalle", null);
                /*localStorageService.add("pedido", null);*/
                $scope.root=null;
                $scope.documentoDespachoAprobado=null;
                
              
            });
        }]);
});