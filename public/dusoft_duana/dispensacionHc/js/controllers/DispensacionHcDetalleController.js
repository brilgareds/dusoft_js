
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {
    //probando branch de pedidos clientes
    controllers.controller('DispensacionHcDetalleController', [
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
       
        /**
        *+Descripcion Variables enviadas como parametros al controller encargado
        *             de dispensar la formula
        **/
        var estadoEntregaFormula;
        var tipoEstadoFormula;
        that.init = function(empresa, callback) {
            callback();
        };  
       	 
        $scope.root = {              
            activar_tab: {tab_productos: true, tab_cargar_archivo: false},
            visualizar: false,
         // Opciones del Modulo 
            opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
            detalleFormula: []
        };
	$scope.root.detalleFormula= [];
        $scope.estadosLotesProxVencer = [           
                    "btn btn-warning btn-xs",
                    "btn btn-danger btn-xs",
                    "btn btn-success btn-xs",
                    
                    "btn btn-info btn-xs",                   
                    "btn btn-danger btn-xs",
                    "btn btn-warning btn-xs",
                    "btn btn-primary btn-xs",
                    "btn btn-primary btn-xs",
                    "btn btn-info btn-xs",
                    "btn btn-warning btn-xs",
                    "btn btn-warning btn-xs"
                ];
        
        /**
         * +Descripcion Funcion que se invocara cuando el usuario trate de acceder
         *              a la formula detalle con el boton SEND del navegador
         */
        that.alertaBotonSendNavegador = function(){
            
            AlertService.mostrarVentanaAlerta("IMPORTANTE",  "No se puede acceder de esa forma (Seleccione el criterio de busqueda)",
                    function(estado){               
                        
                            //window.location = "/dusoft_duana/DispensacionHc";
                            $state.go("DispensacionHc");
                         
                    }
                ); 
        };
        
        /**
         * +Descripcion Se agrega la clase Css de acuerdo al estado del lote
         *              a dispensar
         */
        $scope.agregarClaseLoteProxVencer = function(estado) {

            return $scope.estadosLotesProxVencer[estado];
        };        
        
        /**
         * @author Cristian Manuel Ardila Troches
         * +Descripcion Metodo encargado de consultar los medicamentos que
         *              quedaron pendientes en la dispensacion
         * @fecha 22/08/2016 DD/MM/YYYY
         */
        that.listarMedicamentosFormuladosPendientes = function(evolucionId){
            var productos;
            var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_pendientes: {
                                evolucionId: evolucionId
                           }
                       }    
                    };   
                    
            dispensacionHcService.listarMedicamentosFormuladosPendientes(obj,function(data){
               
                $scope.root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].vaciarProductos();
                if(data.status === 200) {                          
                   productos = dispensacionHcService.renderListarMedicamentosFormulados(data.obj.listar_medicamentos_pendientes);                 
                   $scope.root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].agregarProductos(productos);                  
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
        that.listarMedicamentosFormulados = function(evolucionId){
            
            var productos;
            var obj = {                   
                session: $scope.session,
                data: {
                   listar_medicamentos_formulados: { 
                        evolucionId: evolucionId,
                   }
                }    
            };
         
            dispensacionHcService.listarMedicamentosFormulados(obj,function(data){
                    
                $scope.root.detalleFormula[0].mostrarPacientes()[0].mostrarFormulas()[0].vaciarProductos();
                if(data.status === 200) {       

                   productos = dispensacionHcService.renderListarMedicamentosFormulados(data.obj.listar_medicamentos_formulados);
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
                        evolucionId: $scope.root.datos.evolucionId,
                        principioActivo: entity.principioActivo,
                        
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
            
           //var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");   
            
            //if(resultadoStorage){
           
            var obj = {                   
                session: $scope.session,
                data: {
                    existenciasBodegas: {
                        codigoProducto: entity.codigo_producto,
                        principioActivo: entity.principioActivo,
                        empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        centroUtilidad: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                        autorizado: entity.autorizado,
                        codigoFormaFarmacologica: entity.codigoFormaFarmacologica,
                        pacienteId: $scope.root.datos.pacienteId,
                        tipoPacienteId: $scope.root.datos.tipoIdPaciente
                   }
               }    
            };

            dispensacionHcService.existenciasBodegas(obj, function(data){

                entity.vaciarProductosHc();
                if(data.status === 200) {                                          
                    entity.agregarProductosHc(dispensacionHcService.renderListarProductosLotes(data.obj));                   
                    $scope.lotes = entity.mostrarProductosHc();
                    
                    
                    if($scope.lotes[0].length >0){
                        that.ventanaDispensacionFormula();   
                    }else{
                         AlertService.mostrarMensaje("warning", "No hay lotes disponibles");
                    }
                    /**
                     * +Descripcion Se recorre los lotes y se les setean la cantidad solicitada
                     *              a cada uno de ellos
                     */
                    $scope.lotes[0].forEach(function(producto) {                        
                         producto.cantidadDispensada = $scope.cantidadEntrega;                      
                    });

                };         
                
                if(data.status === 204) {  
                    
                    dispensacionHcService.usuarioPrivilegios(obj, function(privilegio){
                   
                        if(privilegio.status === 200){
                           
                            if(privilegio.obj.privilegios.sw_privilegio_autorizar_confrontado){
                                
                               that.ventanaAutorizaDispensacion(data, entity);   
                               
                            }else{
                               AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El usuario no posee privilegios para autorizar la dispensacion");   
                            }
                        }else{
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", privilegio.msj);
                        }                       
                    });                       
                    //AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }if(data.status === 500){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            }); 
            
            /*}else{     
                $scope.root.detalleFormula = null;
                that.alertaBotonSendNavegador();
            }*/
                      
        };
         
        /**
         *  @author Cristian Manuel Ardila
         * +Descripcion Evento que se activa al momento de que se autoriza el 
         *              medicamento confrontado para ser dispensado posteriormente
         *              y de esta forma abrir inmediatamente la ventana con los
         *              los lotes respectivos
         * @fecha 2016-13-10 YYYY-DD-MM
         */
        $scope.$on('emitLotesProductosFormula', function(e, parametros) { 
            
            //var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");   
            var obj = {                   
                session: $scope.session,
                data: {
                    existenciasBodegas: {
                        codigoProducto: parametros.entity.codigo_producto,
                        principioActivo: parametros.entity.principioActivo,
                        empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        centroUtilidad: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                        autorizado: "1",
                        codigoFormaFarmacologica: parametros.entity.codigoFormaFarmacologica,
                        pacienteId: $scope.root.datos.pacienteId,
                        tipoPacienteId: $scope.root.datos.tipoIdPaciente
                    }
                }    
            };
            
            dispensacionHcService.consultarLotesDispensarFormula(obj, function(data){
                
                parametros.entity.vaciarProductosHc();
                if(data.status === 200) {                                          
                    parametros.entity.agregarProductosHc(dispensacionHcService.renderListarProductosLotes(data.obj));                   
                    $scope.lotes = parametros.entity.mostrarProductosHc(); 
                    /**
                     * +Descripcion Se recorre los lotes y se les setean la cantidad solicitada
                     *              a cada uno de ellos
                     */
                    $scope.lotes[0].forEach(function(producto) {                        
                         producto.cantidadDispensada = $scope.cantidadEntrega;                      
                    });
                    that.ventanaDispensacionFormula();
                }       
               
            });
                    
        }); 
         
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
                //{field: 'getEstadoProductoVencimiento()', displayName: 'Codigo', width:"10%"}, 
                {field: 'getDescripcionProducto()', displayName: 'Descripcion'},
                //{field: 'getMolecula()', displayName: 'Descripcion'},
                {field: 'getConcentracion()', displayName: 'Concentracion', width:"10%"},                
                {field: 'getCodigoFormaFarmacologico()', displayName: 'F.Farmacologica', width:"10%"},
                {field: 'getLaboratorio()', displayName: 'Laboratorio', width:"10%"},
                {field: 'mostrarLotes()[0].getCodigo()', displayName: 'Lote', width:"10%"},
                //{field: 'mostrarLotes()[0].getFechaVencimiento()', displayName: 'Fecha vencimiento', width:"10%"},
                {field: 'fecha_vencimiento', width: "10%", displayName: 'Fecha vencimiento',
                         cellTemplate: '<div class="col-xs-12 "> \
                                       <input type="label" \
                                        ng-model="row.entity.lotes[0].fecha_vencimiento" \
                                        validacion-numero-entero \
                                        class="form-control grid-inline-input" \
                                        name="" \
                                        id="" \
                                        ng-class="agregarClaseLoteProxVencer(row.entity.estadoProductoVencimiento)"\n\
                                        /> </div>'},
                {field: 'mostrarLotes()[0].getCantidad()', displayName: 'Existencia', width:"10%"},
                {field: 'cantidad_solicitada', width: "7%", displayName: 'Cantidad',
                         cellTemplate: '<div class="col-xs-12 "> \
                                       <input type="text" \
                                        ng-model="row.entity.cantidadDispensada" \
                                        validacion-numero-entero \
                                        class="form-control grid-inline-input" \
                                        name="" \
                                        id="" \
                                        ng-disabled="row.entity.estadoProductoVencimiento == 1" ng-class=""\n\
                                        /> </div>'},
                {field: 'Sel', width: "10%",
                        displayName: "Dispensar",
                        cellClass: "txt-center",
                        
                        //cellTemplate : '<input-check ng-model="modelocheck"  ng-click="temporalLotes(row.entity)"></input-check>'
                         cellTemplate : '<div class="row">\
  <input-check ng-model="row.entity.loteSeleccionado" ng-click="temporalLotes(row.entity)" ng-disabled="row.entity.estadoProductoVencimiento == 1"></input-check>\
  <button class="btn btn-default btn-xs" ng-click="cerrarVentanaDispensacionFormula()" ng-disabled ="showBtnDispensar ">Cerrar  </button>\
</div>'                               
                  },
                /* {field: 'Cerrar', width: "10%",
                           displayName: "Opcion",
                           cellClass: "txt-center",
                           cellTemplate: '<button class="btn btn-default btn-xs" ng-click="cerrarVentanaDispensacionFormula()" ng-disabled ="showBtnDispensar">Cerrar  </button>'

                }*/
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
                {field: 'getPerioricidadEntrega()', displayName: 'Perioricidad entrega', width:"25%"},
                {field: 'getTiempoTotal()', displayName: 'Dias tratamiento', width:"15%"},
                {field: 'getCantidadEntrega()', displayName: 'Cant. entregar', width:"10%"},
                {field: 'Dispensar', width: "10%",
                           displayName: "Dispensar",
                           cellClass: "txt-center",
                           
                           cellTemplate: '<button class="btn btn-default btn-xs" ng-click="detalleLotesProductoFormula(row.entity)" ng-disabled ="row.entity.separarTemporal == 1 ">Dispensar  </button>'

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
            var obj = {
                        session: $scope.session,
                        data: {
                           eliminar_medicamentos_temporales: {
                                evolucion: $scope.root.datos.evolucionId,
                                serialId : entity.serialId,
                                codigoProducto : entity.codigo_producto
                           }
                       }
                    };             
         
            dispensacionHcService.eliminarMedicamentosTemporales(obj,function(data){
                
                if(data.status === 200){                     
                    AlertService.mostrarMensaje("success", data.msj); 
                    that.consultarMedicamentosTemporales();
                    
                    /**
                     * +Descripcion Se valida si los productos formulados son pendientes
                     */
                    if($scope.root.datos.pendientes === 1){    
                     
                        that.listarMedicamentosFormuladosPendientes($scope.root.datos.evolucionId);                      
                    }
                    if($scope.root.datos.pendientes === 0){

                        that.listarMedicamentosFormulados($scope.root.datos.evolucionId);
                    }
                  
                }              
                
            });
            
        };
        
       
         /**
          * @author Cristian Ardila
          * +Descripcion Metodo encargado de invocar el servicio que
          *              almacenara los productos en las tablas temporales
          * @fecha 07/06/2016
          */
        $scope.temporalLotes = function(entity){           
           
             
            //var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");           
            var obj = {                   
                session: $scope.session,
                data: {
                    temporalLotes: {
                        evolucion: $scope.root.datos.evolucionId,
                        detalle: entity,
                        codigoProducto: $scope.producto,
                        cantidadSolicitada: $scope.cantidadEntrega,
                        empresa: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        centroUtilidad: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodega: Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                   }
               }    
            };
               
           if(!entity.loteSeleccionado){
            
            dispensacionHcService.temporalLotes(obj, function(data){              
                if(data.status === 200) {                                          
                    AlertService.mostrarMensaje("success", data.msj);   
                  
                }else{
                    
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    entity.loteSeleccionado = false;
                }            
            });  
            
            }else{
                $scope.eliminarMedicamentoTemporal(entity);
            }
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
            //var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
            //if(resultadoStorage){
              var obj = {                   
                  session: $scope.session,
                  data: {
                     listar_medicamentos_temporales: {
                          evolucion: $scope.root.datos.evolucionId                           
                     }
                  }    
              };      
            
              dispensacionHcService.medicamentosTemporales(obj, function(data){
                  if(data.status === 200){                     
                      $scope.medicamentosTemporales.push(dispensacionHcService.renderMedicamentosTemporales(data.obj.listar_medicamentos_temporales));    
                  }      
              });  
           /* }else{     
                $scope.root.detalleFormula = null;
                that.alertaBotonSendNavegador();*/
                  //window.location = "/dusoft_duana/DispensacionHc";
                  //$rootScope.$emit("onIrAlHome",{mensaje: "No se puede acceder de esa forma (Seleccione el criterio de busqueda)", tipo:"warning"});
                  //AlertService.mostrarMensaje("warning", "No se puede acceder de esa forma (Seleccione el criterio de busqueda)");
            //}
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
         * +Descripcion Metodo encargado de cambiar de view al inicio del modulo
         * @fecha 09/06/2016 (DD-MM-YYYY)
         */
        $scope.regresarListaFormulas = function() {
            localStorageService.add("consultarFormula", null);
            localStorageService.add("consultarFormulaPendientes", null);
            $state.go('DispensacionHc');           
        };
        
        
        /**
          * @author Cristian Ardila
          * +Descripcion Metodo que desplegara una ventana encargada de 
          *              listar los tipos de entrega de la formula
        */
        $scope.ventanaTipoEntregaFormula = function(todoPendiente){
            dispensacionHcService.shared = $scope.root.datos;
            
            if($scope.root.datos.pendientes === 1 && todoPendiente ===2){
                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "los medicamentos ya se encuentran pendientes");
                return;
            }
            
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: true,
                keyboard: true,
                templateUrl: 'views/dispensacionHc/dispensacionRealizarEntrega.html',
                scope: $scope,                  
                controller: "dispensacionRealizarEntregaController",
                resolve: {
                        estadoEntregaFormula: function() {
                            return estadoEntregaFormula;
                        },
                        estadoTodoPendiente: function(){
                            return todoPendiente;
                        },
                        tipoEstadoFormula: function(){
                            return tipoEstadoFormula;
                        } 
                    }
                                   
            };
            var modalInstance = $modal.open($scope.opts);   
           
                modalInstance.result.then(function(){
                    //that.consultarMedicamentosTemporales();
                },function(){});                          
                
        };
        
        
        /**
         * @author Cristian Ardila
         * +Descripcion ventana modal para registrar la autorizacion de dispensacion
         *              de un medicamento confrontado
         */
        that.ventanaAutorizaDispensacion = function(ultimoRegistroDispensacion, entity){
   
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: true,
                keyboard: true,
                templateUrl: 'views/dispensacionHc/dispensarAutorizaDispensacion.html',
                scope: $scope,                  
                controller: "DispensacionAutorizarDispensacion",
                resolve: {
                        detalleRegistroDispensacion: function() {
                            return ultimoRegistroDispensacion;
                        },                     
                        detalleFormula: function(){
                            return entity;
                        }
                    }           
            };
            var modalInstance = $modal.open($scope.opts);   
           
                modalInstance.result.then(function(){
                },function(){});                          
                
        };
        /**
          * @author Cristian Ardila
          * +Descripcion Metodo que desplegara una ventana encargada de 
          *              listar los lotes de la formula a traves de un formulario
        */
        that.ventanaDispensacionFormula = function() {
            //var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
            $scope.opts = {
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/dispensacionHc/lotesMedicamentosFormulados.html',
                    scope: $scope,
                    windowClass: 'app-modal-window-xlg',
                    controller:['$scope', '$modalInstance', function($scope, $modalInstance) {
                        $scope.cerrarVentanaDispensacionFormula = function() {
                          that.consultarMedicamentosTemporales();
                          /**
                          * +Descripcion Se valida si los productos formulados son pendientes
                          */
                          if($scope.root.datos.pendientes === 1){    
                            that.listarMedicamentosFormuladosPendientes($scope.root.datos.evolucionId);                      
                          }

                          if($scope.root.datos.pendientes === 0){
                            that.listarMedicamentosFormulados($scope.root.datos.evolucionId);
                          }
                            
                          $modalInstance.close();
                        };
                    }]                 
                };
            var modalInstance = $modal.open($scope.opts);   
        };
        
        /**
          * @author Cristian Ardila
          * +Descripcion Metodo que desplegara una ventana encargada de 
          *              listar los tipos de entrega de la formula
        */
        $scope.ventanaRegistrarEvento = function(){
           
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: true,
                keyboard: true,
                templateUrl: 'views/dispensacionHc/dispensacionRegistrarEvento.html',
                scope: $scope,                  
                controller: "dispensacionRegistrarEventoController",
                              
            };
            var modalInstance = $modal.open($scope.opts);   
           
                modalInstance.result.then(function(){
                    
                },function(){});                          
                
        };
        
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de escuchar el evento emitido cuando se
         *              finaliza la entrega de la formula
         * @fecha 15/06/2016
         */
        var emitRealizarEntregaFormula = $scope.$on('emitRealizarEntregaFormula', function(e, parametros) { 
            $scope.showBtnImprimir = true;
            $scope.showBtnDispensar = true;
            that.consultarMedicamentosTemporales();
        });                    
        
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de escuchar el evento emitido cuando se
         *              finaliza la entrega de la formula
         * @fecha 15/06/2016
         */
       $scope.$on('emitAutorizarDispensacionMedicamento', function(e, parametros) { 
            if(parametros.pendientes === 0){
                that.listarMedicamentosFormulados(parametros);
            }else{
                that.listarMedicamentosFormuladosPendientes(parametros);
            }
        }); 
        
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de imprimir el reporte de los medicamentos
         *              que quedaron pendientes para dispensar
         * @fecha 16/06/2016
         */
        $scope.imprimirMedicamentosPendientes = function(){
            //var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");  
            var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_pendientes: {
                                evolucion: $scope.root.datos.evolucionId,
                                tipoIdPaciente:$scope.root.datos.tipoIdPaciente,
                                pacienteId: $scope.root.datos.pacienteId
                           }
                       }    
                    };    

            dispensacionHcService.listarMedicamentosPendientesPorDispensar(obj,function(data){

                if (data.status === 200) {
                        var nombre = data.obj.listar_medicamentos_pendientes.nombre_pdf;
                        
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
            
            //var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");  
              
            var obj = {                   
                        session: $scope.session,
                        data: {
                           listar_medicamentos_dispensados: {
                                evolucion: $scope.root.datos.evolucionId,
                                tipoIdPaciente:$scope.root.datos.tipoIdPaciente,
                                pacienteId: $scope.root.datos.pacienteId
                           }
                       }    
                    };    

            dispensacionHcService.listarMedicamentosDispensados(obj,function(data){
                if (data.status === 200) {
                  var nombre = data.obj.listar_medicamentos_dispensados.nombre_pdf;
                  $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });  
                
        };
        
        
        that.init(empresa, function() {
            
            if (!Usuario.getUsuarioActual().getEmpresa() ) {
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
            //emitAutorizarDispensacionMedicamento();
             //socket.removeAllListeners();
            localStorageService.add("dispensarFormulaDetalle", null);
                
            $scope.root=null;
           
            });


        //funcion inicializadora del modulo
        function init(){
          var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");

          $scope.root.datos = {
            estadoFormula : resultadoStorage.estadoFormula,
            evolucionId : resultadoStorage.evolucionId,
            fechaFinal : resultadoStorage.fechaFinal,
            fechaInicial : resultadoStorage.fechaInicial,
            filtro : resultadoStorage.filtro,
            pacienteId : resultadoStorage.pacienteId,
            paginaActual : resultadoStorage.paginaActual,
            pendientes : resultadoStorage.pendientes,
            terminoBusqueda : resultadoStorage.terminoBusqueda,
            tipoEstadoFormula : resultadoStorage.tipoEstadoFormula,
            tipoIdPaciente : resultadoStorage.tipoIdPaciente
          }

          obj = {
              session: $scope.session,
              data: {
                  listar_formulas: {
                      filtro: $scope.root.datos.filtro,
                      terminoBusqueda: $scope.root.datos.terminoBusqueda,
                      empresaId:'',
                      fechaInicial: $scope.root.datos.fechaInicial,
                      fechaFinal: $scope.root.datos.fechaFinal,
                      paginaActual: $scope.root.datos.paginaActual,
                      estadoFormula : $scope.root.datos.estadoFormula,
                  }
              }    
          };      

          dispensacionHcService.listarFormulas(obj, function(data){
              estadoEntregaFormula = $scope.root.datos.pendientes;  
              $scope.showBotonTodoPendiente = $scope.root.datos.pendientes;
              tipoEstadoFormula = $scope.root.datos.tipoEstadoFormula;

              if(data.status === 200) {
                  $scope.root.detalleFormula = dispensacionHcService.renderListarFormulasMedicas(data.obj,1);
                  $scope.root.datos.formulaCompleta = $scope.root.detalleFormula[0];
                  if($scope.root.datos.pendientes === 0){
                      that.listarMedicamentosFormulados($scope.root.datos.evolucionId);
                  }

                  if($scope.root.datos.pendientes === 1){
                      $scope.showBotonRegistrarEvento = $scope.root.datos.pendientes;
                      that.listarMedicamentosFormuladosPendientes($scope.root.datos.evolucionId);                      
                  }
               }else{
                   AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
               }
          });

          that.consultarMedicamentosTemporales();
        }

        init();

        }]);
});