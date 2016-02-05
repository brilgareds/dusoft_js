
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {
    //probando branch de pedidos clientes
    controllers.controller('ValidacionDespachoControllerDetalleController', [
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
                btnSolicitarAutorizacionCartera: true

            };
            
            $scope.documentoDespachoAprobado;
            $scope.aprobarDespacho = function() {
                
             if($scope.documentoDespachoAprobado === undefined || 
                $scope.documentoDespachoAprobado === null      ||
                $scope.documentoDespachoAprobado === null){
           
                 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe diligenciar los campos del formulario");
              }else{
               
                var url = '';
                var obj = {};
                
                if($scope.datos_view.seleccionarOtros === true){
                   
                   that.obtenerDocumento(function(estado){
                       
                       if(estado){
                       that.registrarAprobacion(1);
                       }
                   });
                }else{   
                    
                    that.obtenerDocumento(function(estado){
                       
                       if(estado){
                        that.validarCantidadCajasNeveras();
                       }
                   });
                }
              }
            };
           
           /**
            * @author Cristian Ardila
            * @fecha 04/02/2016
            * +Descripcion Funcion encargada de invocar el servicio para
            *              obtener el documento consultado
            * @returns {undefined}
            */
           that.obtenerDocumento = function(callback){    
               
              
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: $scope.documentoDespachoAprobado.prefijo,
                            numero: $scope.documentoDespachoAprobado.numero
                    
                        }
                    }
                };
               
                Request.realizarRequest(API.VALIDACIONDESPACHOS.OBTENER_DOCUMENTO, "POST", obj, function(data) {
                       
                      if (data.status === 200) {
                           // 
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
            
             var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: $scope.documentoDespachoAprobado.prefijo,
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
               
                var obj = {
                    session: $scope.session,
                    data: {
                        validacionDespachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: $scope.documentoDespachoAprobado.prefijo,
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
                
              
                var prefijo = 0;
                var numero = 0;
                var cantidadCajas = 0;
                var cantidadNeveras = 0;
                var observacion = "";
                var fechaRegistro = 0;
                
                if(documento.estado === 1){
                    
                     $scope.estadoRegistro = 1;
                    if (documento) {
                        var empresa = EmpresaAprobacionDespacho.get(documento.documentoAprobado.razon_social, documento.documentoAprobado.empresaId);
                        $scope.datos_view.empresaSeleccionada = empresa;
                        prefijo = documento.documentoAprobado.prefijo || 0;
                        numero =  documento.documentoAprobado.numero || 0;
                        cantidadCajas =  documento.documentoAprobado.cantidadCajas || 0;
                        cantidadNeveras =  documento.documentoAprobado.cantidadNeveras || 0;
                        observacion =    documento.documentoAprobado.observacion || 0;
                        fechaRegistro =  documento.documentoAprobado.fecha_registro || 0;
                    }
                   $scope.documentoDespachoAprobado= AprobacionDespacho.get(1,prefijo,numero,fechaRegistro)
                   $scope.documentoDespachoAprobado.setCantidadCajas(cantidadCajas);
                   $scope.documentoDespachoAprobado.setCantidadNeveras(cantidadNeveras);
                   $scope.documentoDespachoAprobado.setObservacion(observacion);
               
                }              
                if(documento.estado === 2){  
                    $scope.estadoRegistro = 2;
                }
               
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