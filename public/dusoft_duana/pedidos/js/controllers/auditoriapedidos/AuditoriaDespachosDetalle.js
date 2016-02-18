
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
        "Usuario","EmpresaDespacho","DocumentoAuditado","AuditoriaDespachoService","ProductoPedido",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                 Sesion,EmpresaDespacho,DocumentoAuditado,AuditoriaDespachoService,ProductoPedido) {

        var that = this;
        // Definicion Variables de Sesion
        $scope.session = {
            usuario_id: Sesion.getUsuarioActual().getId(),
            auth_token: Sesion.getUsuarioActual().getToken()
        };

      //Definicion variables del View         
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
                 console.log("$scope.documentoAuditado[0] ", data)
                   $scope.documentoAuditado = [];
                    for (var i in data.obj.despachos_auditados) {
                      var _documento = data.obj.despachos_auditados[i];
                      var documento = DocumentoAuditado.get(1, _documento.prefijo, _documento.numero, _documento.fecha_registro);
                      documento.setRazonSocial(_documento.razon_social);
                      documento.setEmpresaId(_documento.empresa_id); 
                      documento.setEmpresaDestino(_documento.empresa_destino);
                      documento.setRazonSocialEmpresaDestino(_documento.desc_empresa_destino);
                      documento.setObservacion(_documento.observacion);
                      documento.setPedido(_documento.pedido);
                      documento.setTipoPedido(_documento.tipo_pedido);
                      $scope.documentoAuditado.push(documento);
                      
                  }                     
                     
                      that.obtenerPedidos($scope.documentoAuditado[0]);
              };                    
              
              
              
             that.obtenerPedidos = function(documento){
                /* console.log("documento ", documento)
                var url = API.DESPACHOS_AUDITADOS.DETALLE_DOCUMENTO_AUDITADO;
                if(documento.getTipoPedido() === 1){
                    url = API.DESPACHOS_AUDITADOS.DETALLE_DOCUMENTO_AUDITADO;
                }*/
                 var obj = {
                     session: $scope.session,
                        data: {
                            despachos_auditados: {
                                session:  $scope.session,
                                prefijo:documento.getPrefijo(),
                                numero:  documento.getNumero(),
                                empresa_id:  documento.getEmpresaId()
                                
                            }
                            
                        }
                    };
                    
                    console.log("obj ", obj)
                /*  Request.realizarRequest(, "POST", obj, function(data){ 
                             $scope.productos = []; 
                              if (data.status === 200) {
                                  that.renderObtenerProductos(data.obj.despachos_auditados);
                              }else{
                                  AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                              }
                       }); 
                  };*/
                 
             };
            /**
             * @author Cristian Ardila
             * @fecha  18/02/2016
             * +Descripcion Metodo encargado de invocar el servicio que listara
             *              los productos asociados a un pedido
             */
            that.obtenerProductos = function(documento){
             
                  var obj = {
                     session: $scope.session,
                        data: {
                            despachos_auditados: {
                                session:  $scope.session,
                                prefijo:documento.getPrefijo(),
                                numero:  documento.getNumero(),
                                empresa_id:  documento.getEmpresaId()
                                
                            }
                            
                        }
                    };
                    
                  Request.realizarRequest(API.DESPACHOS_AUDITADOS.DETALLE_DOCUMENTO_AUDITADO, "POST", obj, function(data){ 
                             $scope.productos = []; 
                              if (data.status === 200) {
                                  that.renderObtenerProductos(data.obj.despachos_auditados);
                              }else{
                                  AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                              }
                       }); 
                  };
                  
            /**
             * @author Cristian Ardila
             * @fecha  17/02/0016
             * +Descripcion: Funcion encargada de guardar en cada documento
             *               un arreglo de los productos del detalle
             */ 
            that.renderObtenerProductos = function(productos){
                  console.log("productos ", productos);
                  for (var i in productos) {
                    
                       var _producto = ProductoPedido.get( productos[i].codigo_producto, productos[i].descripcion, 0, 0, 0,  productos[i].cantidad_recibida, "", 0, 0, 0, 0, 0, 0, 0);
                           _producto.setNumeroCaja(productos[i].numero_caja);
                           _producto.setTipo(productos[i].tipo);
                         
                      $scope.productos.push(_producto);
                  }
                     $scope.documentoAuditado[0].agregarProductos($scope.productos);                    
            };
            /**
             * +Descripcion: Se activa el cambo de interfaz, cuando se selecciona
             *               el detalle de una documento
             */
            if ($state.is("AuditoriaDespachos") === true) {
               
               var documento = localStorageService.get("auditoriaDespachos");
             
               if (documento) {
              
               that.listarDespachosAprobados(documento.prefijo,documento.numero,documento.empresa);
                  
                }              
               
            };
            
            /**
             * @author Cristian Ardila
             * @fecha  16/02/2016
             * +Descripcion Metodo encargado de imprimir el rotulo, invocado desde
             *              la tabla de los productos de un documento
             * 
             */
            $scope.onImprimirRotulo = function(tipo, entity) {
                
                console.log("entity ", entity)
              /*  var url = API.DOCUMENTOS_TEMPORALES.IMPRIMIR_ROTULO_CLIENTES;

                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.IMPRIMIR_ROTULO_FARMACIAS;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: numero_pedido,
                            numero_caja: numero_caja,
                            tipo: tipoCaja
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var nombre_reporte = data.obj.movimientos_bodegas.nombre_reporte;

                        $scope.visualizarReporte("/reports/" + nombre_reporte, "Rotulo_" + numero_caja, "download");
                    } else {

                    }
                });*/
            };
           /**
             * +Descripcion Se visualiza la tabla con todas las aprobaciones
             *              por parte del personal de seguridad
            */
            $scope.listaProductosDocumentosAuditados={
                data: 'documentoAuditado[0].obtenerProductos()[0]',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                   {field: 'getCodigoProducto()', displayName: 'Codigo', width:"20%"},
                   {field: 'getDescripcionProducto()', displayName: 'Descripcion', width:"30%"},
                   {field: 'getNumeroCaja()', displayName: 'Numero caja', width:"20%"},
                   {field: 'getCantidadSeparada()', displayName: 'Cant. Separada', width:"10%"},    
                   {field: 'getTipo()', displayName: 'Caj/Nev', width:"10%"},
                   {field: 'movimiento', displayName: "Opciones", width: "10%", cellClass: "txt-center",
                        cellTemplate: '<div >\
                            <button class="btn btn-default btn-xs" ng-click="onImprimirRotulo(1,row.entity)"><span class="glyphicon glyphicon-print"></span> Imprimir</button>\
                        </div>'
                    }
                   
                 ]
             }; 
           
           /*
            * @author Cristian Ardila
            * @fecha 04/02/2016
            * +Descripcion Funcion encargada de cambiar de GUI cuando 
            *              se presiona el boton de detalle de la tabla
            *              de datos
            */
           $scope.volverPaginaPrincipal = function() {
               
                 $state.go('AuditarPedidos');

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