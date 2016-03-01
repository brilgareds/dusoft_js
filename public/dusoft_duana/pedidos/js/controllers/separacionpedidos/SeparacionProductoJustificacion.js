
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductoJustificacion',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        "Usuario", "$modalInstance", "SeparacionService","pedido", "$modalInstance",
        function($scope,$rootScope,Request,
                 API,socket,AlertService,$modal,
                 localStorageService,$state, Usuario, $modalInstance,
                 SeparacionService, pedido, $modalInstance){
         
            var self = this;
            
            self.init = function(callback){
                $scope.rootJustificacion = {};
                $scope.rootJustificacion.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
                
                $scope.rootJustificacion.justificaciones = [
                   {descripcion: "No hay fisico"},
                   {descripcion: "Averiado"},
                   {descripcion: "Proximo A Vencer"},
                   {descripcion: "Trocado"},
                   {descripcion: "Por presentacion"}
                ];
      
            };
             
           /**
             * @author Eduar garcia
             * +Descripcion: Permite crear el encabezado del temporal para posteriormete justificar
             */
             
            self.agregarEncabezado = function(callback){
                SeparacionService.agregarEncabezadoTemporal(pedido, $scope.rootJustificacion.session, function(continuar){
                    callback(continuar);
                });  
            };
            
            
             /**
             * @author Eduar garcia
             * @param{Object} justificacion
             * +Descripcion: Permite justificar un producto
             */
            self.justificar = function(justificacion){
                var url = API.SEPARACION_PEDIDOS.JUSTIFICACION_PENDIENTES;
                var producto = pedido.getProductoSeleccionado();
                
                var obj = {
                    session: $scope.rootJustificacion.session,
                    data: {
                        documento_temporal: {
                            codigo_producto : producto.getCodigoProducto(),
                            cantidad_pendiente : producto.getCantidadPendiente(),
                            existencia : 0,
                            doc_tmp_id : pedido.getTemporalId(),
                            justificacion : justificacion.descripcion,
                            justificacion_auditor : ""
                            
                        }
                    }
               };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        producto.setJustificacion(justificacion);
                        $modalInstance.close();
                        
                    } else {
                        AlertService.mostrarVentanaAlerta("Error", "Se ha generado un error");
                    }
                });
            };
            
           /**
             * @author Eduar garcia
             * +Descripcion: Grid de justificaciones
             */
            $scope.listaJustificaciones = {
                data: 'rootJustificacion.justificaciones',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'descripcion', displayName: 'Descripcion'},
                    {field: '', displayName: "", cellClass: "txt-center", width: "50",
                     cellTemplate: ' <input-check ng-model="row.entity.selected" ng-click="onSeleccionJustificacion(row.entity)"  />'}
                ]
            };
            
            
           /**
             * @author Eduar garcia
             * @param{Object} justificacion
             * +Descripcion: Handler de la seleccion de la justificacion
             */
            $scope.onSeleccionJustificacion = function(justificacion){
                if(pedido.getTemporalId() === 0){
                    self.agregarEncabezado(function(continuar){
                        if(continuar){
                            self.justificar(justificacion);
                        }
                    });
                } else {
                    self.justificar(justificacion);
                }
            };
            
           /**
             * @author Eduar garcia
             * +Descripcion: Handler del boton de cerrar
             */
            $scope.cerrar = function(){
                $modalInstance.close();
            };

            self.init(function(){
                
            });
            
        }
        
    ]);
});

