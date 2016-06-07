
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
        "Usuario","EmpresaDispensacionHc","dispensacionHcService",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                 Sesion,EmpresaDispensacionHc,dispensacionHcService) {

            var that = this;
            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };
         
            // Definicion variables del View
           
           that.init = function() {
               
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
             * +Descripcion: Se activa el cambio de interfaz, cuando se selecciona
             *               el detalle de una formula para dispensar
             */
            if ($state.is("DispensarFormulaDetalle") === true) {
               
              
             var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
            
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
                        
                           if(data.status === 200) {       
                               //$scope.root.items = data.obj.listar_formulas.length;                              
                               $scope.root.detalleFormula = dispensacionHcService.renderListarFormulasMedicas(data.obj,1);
                               that.listarMedicamentosFormulados(resultadoStorage);
                           }else{
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                         
                    });
               
            };
            
           /**
            * @author Cristian Ardila
            * +Descripcion Metodo encargado de ejecutar el servicio que consultara
            *              los medicamentos formulados
            * @fecha 25/05/2016
            */    
           that.listarMedicamentosFormulados = function(resultadoStorage){
                var productos;
                 var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_formulados: { 
                              
                                evolucionId: resultadoStorage.evolucionId,//$scope.root.numero,
                                
                           }
                       }    
                    };
               dispensacionHcService.listarMedicamentosFormulados(obj,function(data){
                  
                    if(data.status === 200) {       

                       productos = dispensacionHcService.renderListarMedicamentosFormulados(data.obj);
                        $scope.root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].agregarProductos(productos);
                     }else{
                          AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                     }

                  
               });
              
           };
           
           
           
          /**
           * @author Cristian Ardila
           * +Descripcion Se visualiza la tabla con los medicamentos listos
           *              para dispensar
           * @fecha 25/05/2016
           */
           $scope.listaMedicamentosFormulados = {
               data: 'root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].mostrarProductos()[0]',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
               columnDefs: [


            {field: 'getCodigoProducto()', displayName: 'Codigo', width:"15%"},
            {field: 'getDescripcion()', displayName: 'Medicamento'},
            {field: 'getCantidadEntrega()', displayName: 'Cant. entregar', width:"10%"},
            {field: 'getPerioricidadEntrega()', displayName: 'Perioricidad entrega', width:"25%"},
            {field: 'getTiempoTotal()', displayName: 'Dias tratamiento', width:"15%"},
            {field: 'Dispensar', width: "10%",
                       displayName: "Dispensar",
                       cellClass: "txt-center",
                       cellTemplate: '<button class="btn btn-default btn-xs" ng-click="detalleLotesProductoFormula(row.entity)">Dispensar</button>'

                 }
               ]
           };
                    

        /**
          * @author Cristian Manuel Ardila Troches
          * @fecha  04/03/2016
          * +Descripcion: Se desplegara una ventana modal con un formulario
          *               el cual permitira hacer una busqueda avanzada por
          *               producto
          * @param {type} cotizacion_pedido
          */  
        $scope.detalleLotesProductoFormula = function(entity) {
       
              
                $scope.producto= entity.codigo_producto;
                $scope.descripcion= entity.descripcion;
                $scope.cantidadEntrega = entity.cantidadEntrega;
               
               console.log("$scope.cantidadEntrega ", $scope.cantidadEntrega);
              
                var obj = {                   
                        session: $scope.session,
                        data: {
                           cantidadProducto: {
                                codigoProducto: entity.codigo_producto,
                                evolucionId: resultadoStorage.evolucionId,
                                principioActivo: entity.principioActivo
                           }
                       }    
                    };
                 
           
                dispensacionHcService.cantidadProductoTemporal(obj,function(data){
                   that.cantidadPendiente = 0;
                   
                   if(data.status === 200) {       
                       
                        if (entity.codigo_producto === data.obj.cantidadProducto[0].codigo_formulado) {
                           
                              that.cantidadPendiente = entity.cantidadEntrega - data.obj.cantidadProducto[0].total;
                        }
                           
                    }else{
                              that.cantidadPendiente = entity.cantidadEntrega;
                    }
                     $scope.cantidadPendiente = that.cantidadPendiente;
                     that.consultarExistenciasBodegas(entity);
                   
                     

                });
               // $scope.datos_view.pedido_seleccionado = obj;       
               
            };
           
         /**
          * @author Cristian ardila
          * +Descripcion Metodo encargado de invocar el servicio que consultara
          *              los lotes disponibles para el producto
          * @fecha 26/05/2016
          */
         that.consultarExistenciasBodegas = function(entity){
              
             var obj = {                   
                        session: $scope.session,
                        data: {
                           existenciasBodegas: {
                                codigoProducto: entity.codigo_producto,
                                principioActivo: entity.principioActivo
                           }
                       }    
                    };
             
            dispensacionHcService.existenciasBodegas(obj, function(data){
                
                 entity.vaciarProductosHc();
                 if(data.status === 200) {                      
                     
                     entity.agregarProductosHc(dispensacionHcService.renderListarProductosLotes(data.obj));
                     
                     $scope.lotes = entity.mostrarProductosHc();
                     that.ventanaDispensacionFormula();
                 }else{
                     AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                 }
              
            });
            
            
         };
         
           
         /**
           * @author Cristian Ardila
           * +Descripcion Se visualiza la tabla con los medicamentos listos
           *              para dispensar
           * @fecha 25/05/2016
           */
           $scope.listaLotes = {
               data: 'lotes[0]',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
               columnDefs: [

               {field: 'getCodigoProducto()', displayName: 'Codigo', width:"10%"},
              // {field: 'getDescripcion()', displayName: 'Producto', width:"15%"},
               {field: 'getConcentracion()', displayName: 'Concentracion', width:"10%"},
               {field: 'getMolecula()', displayName: 'Descripcion'},
               {field: 'getCodigoFormaFarmacologico()', displayName: 'F.Farmacologica', width:"10%"},
               {field: 'getLaboratorio()', displayName: 'Laboratorio', width:"10%"},
               
            {field: 'mostrarLotes()[0].getCodigo()', displayName: 'Lote', width:"10%"},
            {field: 'mostrarLotes()[0].getFechaVencimiento()', displayName: 'Fecha vencimiento', width:"10%"},
            {field: 'mostrarLotes()[0].getCantidad()', displayName: 'Existencia', width:"10%"},
            {field: 'cantidad_solicitada', width: "7%", displayName: 'Cantidad',
                        cellTemplate: '<div class="col-xs-12"> \
                                      <input type="text" \
                                       ng-model="row.entity.cantidadDispensada" \
                                       validacion-numero-entero \
                                       class="form-control grid-inline-input" \n\
                                       name="" id="" /> </div>'},
            {field: 'Sel', width: "10%",
                       displayName: "Dispensar",
                       cellClass: "txt-center",
                       cellTemplate: '<input type="radio"  class="btn btn-default btn-xs" ng-click="temporalLotes(row.entity)">Dispensar'

                 }
               ]
           };
         
         /**
          * @author Cristian Ardila
          * +Descripcion Metodo encargado de invocar el servicio que
          *              almacenara los productos en las tablas temporales
          * @fecha 07/06/2016
          */
         $scope.temporalLotes = function(entity){
             
             
             var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
            
            var obj = {                   
                        session: $scope.session,
                        data: {
                           temporalLotes: {
                                evolucion: resultadoStorage.evolucionId,
                                detalle: entity,
                                codigoProducto: $scope.producto,
                                cantidadSolicitada: $scope.cantidadEntrega
                           }
                       }    
                    };
               
            dispensacionHcService.temporalLotes(obj, function(data){
               
                 if(data.status === 200) {                      
                     
                     AlertService.mostrarMensaje("mensaje del sistema", data.msj);
                 }else{
                     AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                 }
              
            });
            
             
         };
         
         that.ventanaDispensacionFormula = function() {
               
            $scope.opts = {
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/dispensacionHc/lotesMedicamentosFormulados.html',
                    scope: $scope,
                    windowClass: 'app-modal-window-xlg',
                    controller: function($scope, $modalInstance) {

                        $scope.cerrarVentanaDispensacionFormula = function() {

                            $modalInstance.close();
                        };
                    }
                            
                };
                var modalInstance = $modal.open($scope.opts);
                
           };
           
           $scope.regresarListaFormulas = function() {
                $state.go('DispensacionHc');
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