
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {
    //probando branch de pedidos clientes
    controllers.controller('ValidacionDespachoDetalleController', [
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
        "Usuario","AprobacionDespacho","EmpresaAprobacionDespacho","ValidacionDespachosService",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                 Sesion,AprobacionDespacho,EmpresaAprobacionDespacho,ValidacionDespachosService) {

            var that = this;
            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };
         
            // Definicion variables del View
           
            $scope.datos_view = {
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
                existenciaDocumento:true
               

            };
            
            $scope.documentoDespachoAprobado;
            
            $scope.cargarEmpresaSession = function(){
                
                if($scope.datos_view.seleccionarOtros){
                var session = angular.copy(Sesion.getUsuarioActual().getEmpresa());
                var empresa = EmpresaAprobacionDespacho.get(session.nombre, session.codigo);          
                    $scope.datos_view.empresaSeleccionada = empresa;
                    
                }else{
                    
                    $scope.datos_view.empresaSeleccionada = "";
                }
            };
            
            
            
            /**
             * @author Cristian Ardila
             * @fecha 05/02/2016
             * +Descripcion Se obtienen los documentos segun la empresa
             * 
             */
             that.traerListadoDocumentosUsuario = function(callback) {
	         var session = angular.copy(Sesion.getUsuarioActual().getEmpresa());	
                
		 var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: session.centroUtilidad.codigo,
                            bodega_id: session.centroUtilidad.bodega.codigo,
                            tipo_documento: 'E008'
                        }
                    }
                };
                
                Request.realizarRequest(API.VALIDACIONDESPACHOS.CONSULTAR_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {
                   
                    if (data.status === 200) {
                        callback(data);
                    }

                });

            };
			
            
            that.traerListadoDocumentosUsuario(function(data) {
                if (data.obj.movimientos_bodegas !== undefined) {
                   
                    $scope.documentos_usuarios = data.obj.movimientos_bodegas;
                }
            });
			 
			
            
            $scope.aprobarDespacho = function() {
               
             if($scope.documentoDespachoAprobado === undefined || 
                $scope.documentoDespachoAprobado === null      ||
                $scope.documentoDespachoAprobado === null){
           
                 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe diligenciar los campos del formulario");
              }else{
               
                if($scope.datos_view.seleccionarOtros === true){

                       that.registrarAprobacion(1);
                     
                }else{   
                    
                    that.validarCantidadCajasNeveras();
                  /*  that.obtenerDocumento(function(estado){
                       
                       if(estado){
                        that.validarCantidadCajasNeveras();
                       }
                   });*/
                }
              }
            };
           
           /**
            * @author Cristian Ardila
            * @fecha  10/02/2016
            * +Descripcion Funcion que se ejecutar cuando el campo numero
            *              pierde el foco, lo que permitira consultar la existencia
            *              del documento
            */
           $scope.validarExistenciaDocumento = function(){
            that.obtenerDocumento(function(estado){    
                 $scope.datos_view.existenciaDocumento = true;
                   if(estado){
                      $scope.datos_view.existenciaDocumento = false;
                   } 
               });        
           };
           /**
            * @author Cristian Ardila
            * @fecha 04/02/2016
            * +Descripcion Funcion encargada de invocar el servicio para
            *              obtener el documento consultado
            * @returns {undefined}
            */
           that.obtenerDocumento = function(callback){    
            
               var prefijo ;
              
               if(!$scope.datos_view.seleccionarOtros){
                    
                    prefijo = $scope.datos_view.prefijoList.prefijo;
               }else{
                    prefijo = $scope.documentoDespachoAprobado.prefijo;
               }
               
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: $scope.documentoDespachoAprobado.numero
                    
                        }
                    }
                };
               
                Request.realizarRequest(API.VALIDACIONDESPACHOS.OBTENER_DOCUMENTO, "POST", obj, function(data) {
                       
                      if (data.status === 200) {
                       
                           callback(true);
                        }else {
                           callback(false);
                           AlertService.mostrarVentanaAlerta("Mensaje del sistema",data.msj);
                    }  
                    
               });
           };
           
           /**
            * @author Cristian Ardila
            * @fecha 04/02/2016
            * +Descripcion Metodo encargado de invocar el servicio para validar
            *              las cantidades de cajas y neveras que ingrese el 
            *              personal de seguridad cuando va a registrar la aprobacion
            *              de un despacho
            */
           that.validarCantidadCajasNeveras = function(){
             
              var prefijo ;
              
               if(!$scope.datos_view.seleccionarOtros){
                    
                    prefijo = $scope.datos_view.prefijoList.prefijo;
               }else{
                    prefijo = $scope.documentoDespachoAprobado.prefijo;
               }
               
               
             var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: $scope.documentoDespachoAprobado.numero
                    
                        }
                    }
                };
               
                Request.realizarRequest(API.VALIDACIONDESPACHOS.CANTIDADES_CAJA_NEVERA, "POST", obj, function(data) {
                      
                      if (data.status === 200) {
                      
                        if (parseInt($scope.documentoDespachoAprobado.cantidadCajas) === data.obj.planillas_despachos.totalCajas && 
                            parseInt($scope.documentoDespachoAprobado.cantidadNeveras) === data.obj.planillas_despachos.totalNeveras) {
                           
                            that.registrarAprobacion(0);
                        }else{
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Las cantidades de cajas y/o neveras NO coinciden con las cantidades auditadas");
                        }
                    }  
                    
                     if (data.status === 500) {
                          AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                     }
               });
               
           };
           
           /**
            * @author Cristian Ardila
            * @fecha 04/02/2016
            * +Descripcion Metodo encargado de registrar la aprobacion por parte
            *              del personal de seguridad sobre un despacho
            * @returns {undefined}
            */
           that.registrarAprobacion = function(estado){
                
               var prefijo ;
              
               if(!$scope.datos_view.seleccionarOtros){
                    
                    prefijo = $scope.datos_view.prefijoList.prefijo;
               }else{
                    prefijo = $scope.documentoDespachoAprobado.prefijo;
               }
               
                var obj = {
                    session: $scope.session,
                    data: {
                        validacionDespachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: $scope.documentoDespachoAprobado.numero,
                            cantidad_cajas: $scope.documentoDespachoAprobado.cantidadCajas,
                            cantidad_neveras: $scope.documentoDespachoAprobado.cantidadNeveras,
                            observacion: $scope.documentoDespachoAprobado.observacion,
                            estado: estado
                    
                        }
                    }
                };
               
                Request.realizarRequest(API.VALIDACIONDESPACHOS.REGISTRAR_APROBACION, "POST", obj, function(data) {
                  
                      if (data.status === 200) {
                      
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            $state.go('ValidacionEgresos');
                            
                    }  else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
               });
               
           };
             
            /**
             * +Descripcion: Se activa el cambo de interfaz, cuando se selecciona
             *               el detalle de una aprobacion o se creara una aprobacion
             */
            if ($state.is("ValidacionEgresosDetalle") === true) {
               
               var documento = localStorageService.get("validacionEgresosDetalle");
             
               $scope.datos_view.estadoRegistro = 1;
               if (documento) {
              
                if(documento.estado === 1){
                    
                  $scope.datos_view.seleccionarOtros = true;
                    var obj = {
                        
                       session: $scope.session,
                       prefijo:documento.prefijo || 0,
                       numero: documento.numero || 0,
                       empresa_id:documento.empresa,
                       fechaInicial: "",
                       fechaFinal:"",
                       paginaactual:1,
                       registroUnico: true
                        
                    };
                 
                    ValidacionDespachosService.listarDespachosAprobados(obj,function(data){
                          
                           if (data.status === 200) {
                                var resultado = data.obj.validacionDespachos[0];
                               
                                var empresa = EmpresaAprobacionDespacho.get(resultado.razon_social, resultado.empresa_id);
                               
                                 $scope.datos_view.empresaSeleccionada = empresa;
                             
                                 $scope.documentoDespachoAprobado= AprobacionDespacho.get(1,resultado.prefijo,resultado.numero,resultado.fecha_registro)
                                 $scope.documentoDespachoAprobado.setCantidadCajas(resultado.cantidad_cajas);
                                 $scope.documentoDespachoAprobado.setCantidadNeveras(resultado.cantidad_neveras);
                                 $scope.documentoDespachoAprobado.setObservacion(resultado.observacion);
                           }else{
                                 AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }                    
                        
                     });
                  }
                }              
                if(documento.estado === 2){  
                   // $scope.datos_view.seleccionarOtros = false;
                    $scope.datos_view.estadoRegistro = 2;
                    
                }
               
            };
            
               /*
                 * @author Cristian Ardila
                 * @fecha 05/02/2016
                 * +Descripcion funcion obtiene las empresas del servidor invocando
                 *              el servicio listarEmpresas de 
                 *              (ValidacionDespachosSerivice.js)
                 * @returns {json empresas}
                 */
                that.listarEmpresas = function(callback) {

                   ValidacionDespachosService.listarEmpresas($scope.session,$scope.datos_view.termino_busqueda_empresa, function(data){
                         
                      $scope.empresas = [];      
                      if (data.status === 200) {

                            that.render_empresas(data.obj.listar_empresas);
                            callback(true);
                       }else{
                            callback(false);
                       }
                   });
                };


                that.render_empresas = function(empresas) {
                    for (var i in empresas) {
                        var _empresa = EmpresaAprobacionDespacho.get(empresas[i].razon_social, empresas[i].empresa_id);
                        $scope.empresas.push(_empresa);
                    }
                };
                
                
                ////////////////////////////////////        
                    /*
                     * funcion ejecuta listarCentroUtilidad
                     * @returns {lista CentroUtilidad}
                     */
                    $scope.onSeleccionarEmpresa = function(empresa_Nombre) {
                        if (empresa_Nombre.length < 3) {
                            return;
                        }
                        $scope.datos_view.termino_busqueda_empresa = empresa_Nombre;
                        that.listarEmpresas(function() {
                        });
                    };
           /**
            * @author Cristian Ardila
            * @fecha 04/02/2016
            * +Descripcion Metodo encargado de llevar al usuario a la pagina
            *              inicial
            */
           $scope.regresarListaDespachosAprobados = function() {
                $state.go('ValidacionEgresos');
            };

            that.init = function() {
            };       
            that.init();
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                // set localstorage
                localStorageService.add("validacionEgresosDetalle", null);
                localStorageService.add("pedido", null);
                $scope.datos_view=null;
                $scope.documentoDespachoAprobado=null;
                
              
            });
        }]);
});