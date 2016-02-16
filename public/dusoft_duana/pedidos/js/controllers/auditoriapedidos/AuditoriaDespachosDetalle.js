
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {
    //probando branch de pedidos clientes
    controllers.controller('AuditoriaDespachosDetalle', [
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
        "Usuario","EmpresaDespacho","DocumentoAuditado","AuditoriaDespachoService",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                 Sesion,EmpresaDespacho,DocumentoAuditado,AuditoriaDespachoService) {

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
                var empresa = EmpresaDespacho.get(session.nombre, session.codigo);          
                    $scope.datos_view.empresaSeleccionada = empresa;
                    
                }else{
                    
                    $scope.datos_view.empresaSeleccionada = "";
                }
            };    

          
         
           /**
                 * @author Cristian Ardila
                 * @fecha 04/02/2016
                 * +Descripcion Metodo encargado de invocar el servicio que
                 *              listara todos los despachos aprobados por parte
                 *              de la persona de seguridad
                 */
                
                that.listarDespachosAprobados = function(prefijo,numero,empresa){
                   
                    var obj = {
                        
                       session:$scope.session,
                       prefijo:prefijo,
                       numero: numero,//$scope.datos_view.numero,
                       empresa_id:empresa,
                       fechaInicial: '',
                       fechaFinal:'',
                       paginaactual:1,
                       registroUnico: false
                        
                    };
                   
                    AuditoriaDespachoService.listarDespachosAuditados(obj,function(data){
                        
                           if (data.status === 200) {
                               
                               
                                that.renderListarDespachosAuditados(data);
                                
                           }else{
                                 AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                           }
                     });
                  };
                   
                
                   
                  that.renderListarDespachosAuditados = function(data){
                      
                       $scope.documentoAuditado = [];
                          for (var i in data.obj.despachos_auditados) {
                            var _documento = data.obj.despachos_auditados[i];
                            console.log("_documento ", _documento)
                            var documento = DocumentoAuditado.get(1, _documento.prefijo, _documento.numero, _documento.fecha_registro);
                           
                            documento.setRazonSocial(_documento.razon_social);
                            documento.setEmpresaId(_documento.empresa_id);
                            
                           $scope.documentoAuditado.push(documento);
                        }
                            that.obtenerProductos($scope.documentoAuditado[0]);
                    };
                    
                    
                that.obtenerProductos = function(documento){
                      
                  var obj = {
                     session: $scope.session,
                        data: {
                            despachos_auditados: {
                                session:  $scope.session,
                                prefijo:documento.getPrefijo(),
                                numero: documento.getNumero(),//$scope.datos_view.numero,
                                empresa_id:documento.getEmpresaId()
                                
                            }
                            
                        }
                    };
                    console.log("obj ", obj)
                  Request.realizarRequest(API.DESPACHOS_AUDITADOS.DESPACHOS_AUDITADOS, "POST", obj, function(data){ 
                             /* var items =[];
                      
                                documento.agregarProductos(items)
                                console.log("documentoAuditado ", documento.obtenerProductos())
                                
                                console.log("data ", data)*/
                        }); 
                      
                      
                  }  
                  
             
            /**
             * +Descripcion: Se activa el cambo de interfaz, cuando se selecciona
             *               el detalle de una aprobacion o se creara una aprobacion
             */
            if ($state.is("AuditoriaDespachos") === true) {
               
               var documento = localStorageService.get("auditoriaDespachos");
             
               if (documento) {
              //DocumentoAuditado
               console.log("documento ", documento);
               that.listarDespachosAprobados(documento.prefijo,documento.numero,documento.empresa);
                   /* ValidacionDespachosService.listarDespachosAprobados(obj,function(data){
                          
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
                        
                     });*/
                  
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