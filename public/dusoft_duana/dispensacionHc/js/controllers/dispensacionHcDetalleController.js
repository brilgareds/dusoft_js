
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
        "Usuario","dispensacionHcService",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                 Usuario,dispensacionHcService) {

        var that = this;
        // Definicion Variables de Usuario
        $scope.session = {
            usuario_id: Usuario.getUsuarioActual().getId(),
            auth_token: Usuario.getUsuarioActual().getToken()
        };
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());    
       // Definicion variables del View
           
        that.init = function(empresa, callback) {

            $scope.root = {              
                activar_tab: {tab_productos: true, tab_cargar_archivo: false},
                visualizar: false,
             // Opciones del Modulo 
                opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                detalleFormula: []


            };
            callback();
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
                        filtro:resultadoStorage.filtro,
                        terminoBusqueda: resultadoStorage.terminoBusqueda,//$scope.root.numero,
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
                        evolucionId: resultadoStorage.evolucionId,
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
                        principioActivo: entity.principioActivo,
                        empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        centroUtilidad: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
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
        **/
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
                        cantidadSolicitada: $scope.cantidadEntrega,
                        empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        centroUtilidad: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                   }
               }    
            };
               
            dispensacionHcService.temporalLotes(obj, function(data){              
                if(data.status === 200) {                                          
                    AlertService.mostrarMensaje("success", data.msj);   
                }else{
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }            
            });            
        };
         
        
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de invocar el servicio que consultara
         *              los medicamentos temporales
         * @fecha 08/06/2016
         * @returns {undefined}
         */      
        that.consultarMedicamentosTemporales = function(){
            $scope.medicamentosTemporales = [];
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
                    $scope.medicamentosTemporales.push(dispensacionHcService.renderMedicamentosTemporales(data.obj.listar_medicamentos_temporales));    

                }      
                    
            });  
        };
        
        
        /**
           * @author Cristian Ardila
           * +Descripcion Se visualiza la tabla con los medicamentos listos
           *              para dispensar
           * @fecha 25/05/2016
           */
        $scope.listaMedicamentosTemporales = {
            data: 'medicamentosTemporales[0]',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'getCodigoProducto()', displayName: 'Codigo', width:"10%"},
                {field: 'getDescripcion()', displayName: 'Medicamento'},
                {field: 'mostrarLotes()[0].getCantidad()', displayName: 'Cantidad', width:"10%"},          
                {field: 'mostrarLotes()[0].getFechaVencimiento()', displayName: 'Fecha vencimiento', width:"10%"},
                {field: 'mostrarLotes()[0].getCodigo()', displayName: 'Lote', width:"10%"},

                {field: 'Sel', width: "10%",
                    displayName: "Dispensar",
                    cellClass: "txt-center",
                    cellTemplate: '<button class="btn btn-default btn-xs" ng-click="eliminarMedicamentoTemporal(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>'

                }
            ]
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de invocar el servicio para eliminar
         *              un producto de la lista de los temporales de la formula
         * @fecha 08/06/2016 (DD-MM-YYYY)
         */
        $scope.eliminarMedicamentoTemporal = function(entity){
            
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
            var obj = {                   
                        session: $scope.session,
                        data: {
                           eliminar_medicamentos_temporales: {
                                evolucion: resultadoStorage.evolucionId,
                                serialId : entity.serialId,
                                codigoProducto : entity.codigo_producto
                           }
                       }    
                    };    
                    
         
            dispensacionHcService.eliminarMedicamentosTemporales(obj,function(data){
               
                if(data.status === 200){                     
                    AlertService.mostrarMensaje("success", data.msj); 
                    that.consultarMedicamentosTemporales();
                         
                }      
            });
            
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de cambiar de view al inicio del modulo
         * @fecha 09/06/2016 (DD-MM-YYYY)
         */
        $scope.regresarListaFormulas = function() {
            $state.go('DispensacionHc');
        };
        
        
        /**
          * @author Cristian Ardila
          * +Descripcion Metodo que desplegara una ventana encargada de 
          *              listar los tipos de entrega de la formula
        */
        $scope.ventanaTipoEntregaFormula = function(){
            
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: true,
                keyboard: true,
                templateUrl: 'views/dispensacionHc/dispensacionRealizarEntrega.html',
                scope: $scope,                  
                controller: "dispensacionRealizarEntregaController"
                                   
            };
            var modalInstance = $modal.open($scope.opts);   
           
                modalInstance.result.then(function(){
                    //$scope.showBtnImprimirPendientes = true;
                    that.consultarMedicamentosTemporales();
                },function(){});                          
                
        };
        
        
        /**
          * @author Cristian Ardila
          * +Descripcion Metodo que desplegara una ventana encargada de 
          *              listar los lotes de la formula a traves de un formulario
        */
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
                            that.consultarMedicamentosTemporales();
                            $modalInstance.close();
                        };
                    }                         
                };
            var modalInstance = $modal.open($scope.opts);   
            
        };
        
        
        that.consultarMedicamentosTemporales();
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de escuchar el evento emitido cuando se
         *              finaliza la entrega de la formula
         * @fecha 15/06/2016
         */
        var emitRealizarEntregaFormula = $scope.$on('emitRealizarEntregaFormula', function(e, parametros) { 
            $scope.showBtnImprimir = true;
            that.consultarMedicamentosTemporales();
        });                    
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de imprimir el reporte de los medicamentos
         *              que quedaron pendientes para dispensar
         * @fecha 16/06/2016
         */
        $scope.imprimirMedicamentosPendientes = function(){
            
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");  
                console.log("resultadoStorage ", resultadoStorage);
            var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_pendientes: {
                                evolucion: resultadoStorage.evolucionId,
                                tipoIdPaciente:resultadoStorage.tipoIdPaciente,
                                pacienteId: resultadoStorage.pacienteId
                           }
                       }    
                    };    
            dispensacionHcService.listarMedicamentosPendientesPorDispensar(obj,function(data){

                if (data.status === 200) {
                        var nombre = data.obj.listar_medicamentos_pendientes.nombre_pdf;
                        console.log("nombre ", nombre);
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });  
                
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de imprimir el reporte de los medicamentos
         *              que quedaron pendientes para dispensar
         * @fecha 16/06/2016
         */
        $scope.imprimirMedicamentosDispensados = function(){
            
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");  
                console.log("resultadoStorage ", resultadoStorage);
            var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_dispensados: {
                                evolucion: resultadoStorage.evolucionId,
                                tipoIdPaciente:resultadoStorage.tipoIdPaciente,
                                pacienteId: resultadoStorage.pacienteId
                           }
                       }    
                    };    
            dispensacionHcService.listarMedicamentosDispensados(obj,function(data){

                if (data.status === 200) {
                        var nombre = data.obj.listar_medicamentos_dispensados.nombre_pdf;
                        console.log("nombre ", nombre);
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });  
                
        };
        
        
        that.init(empresa, function() {

            if (!Usuario.getUsuarioActual().getEmpresa()) {
                $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene una empresa valida para dispensar formulas", tipo:"warning"});
                AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
            }else{
                if(!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                    Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                    $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene un centro de utilidad valido para dispensar formulas.", tipo:"warning"});
                    AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                }else{
                    if(!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                        $rootScope.$emit("onIrAlHome",{mensaje:"El usuario no tiene una bodega valida para dispensar formulas.", tipo:"warning"});
                        AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                    }
                }
            }
        });
            
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
           
            $scope.$$watchers = null;
           
            emitRealizarEntregaFormula();
             //socket.removeAllListeners();
            localStorageService.add("dispensarFormulaDetalle", null);
                
            $scope.root=null;
           
            });
        }]);
});