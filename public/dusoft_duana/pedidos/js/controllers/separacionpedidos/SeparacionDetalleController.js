//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionDetalleController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal, localStorageService, $state) {


            var self = this;

            self.init = function(callback) {
                $scope.rootDetalle = {};
                $scope.rootDetalle.pedido;
              
                callback();
            };
            
            
           /**
             * +Descripcion: Metodo para prototipo de confirm y ser reutilizado
             * en la clase
             * 
             */
            self.confirm = function(titulo, mensaje,callback){ 
                
               $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">'+titulo+'</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4 ><b>'+mensaje+'?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelarEliminacion()">Cancelar</button>\
                                        <button class="btn btn-primary"  ng-click="aceptarEliminacion()">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.aceptarEliminacion = function() {                           
                            $modalInstance.close();
                             callback(true);
                        };
                        $scope.cancelarEliminacion = function() {
                            $modalInstance.close();
                            callback(false);                           
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
           /**
             * +Descripcion: Metodo encargado de generar la separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.generarSeparacion = function(){
                console.log("generando Separacion")
            };  
            
            
            /**
             * 
             * @param {type} producto
             * @returns {undefined}
             * +Descripcion: Metodo para eliminar productos uno por uno
             * de la lista de separacion detalle
             * +@author Cristian Ardila
             */
            self.eliminarProducto = function(producto){
                console.log(producto);
            };
            
           /**
             * +Descripcion: Metodo encargado de eliminar todos los productos
             * de la lista del detalle de separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.eliminarProductoTodos = function(){
                console.log("ELIMINACION TODOS")
            };  
            
           /**
             * +Descripcion: Metodo encargado de generar y auditar la separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.generarAuditar = function(){
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    
                    templateUrl: 'views/separacionpedidos/separacionSeleccionDocumentoDespacho.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.cerrarGenerarAuditar = function() {
                            $modalInstance.close();
                            
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            }; 
            
            
            /**
             * +Descripcion: Metodo para confirmar la eliminacion de
             * un producto de la lista de separacion, si acepta se ejecutara un
             * metodo mas encargado de invocar el servicio para eliminacion,
             * si presiona el boton cancelar, se cancelara el proceso
             */
            $scope.onEliminarProducto = function(producto){
                
                 self.confirm("Eliminar producto", "Desea eliminar el producto",function(confirmar){                 
                  if(confirmar){                      
                            self.eliminarProducto(producto);       
                  }
              });         
            };
            

            
            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  clientes y pedidos temporales clientes
             */
            $scope.detalleSeparacionProducto = {
                data: 'rootDetalle.pedido.productos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto',   displayName: 'Producto', width:"600",
                     cellTemplate:'<div class="ngCellText">\
                                        {{row.entity.codigo_producto}} - {{row.entity.descripcion}}\
                                   </div>'
                     },
                    {field: 'lotesSeleccionados[0].codigo_lote', displayName: 'Lote'},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                    {field: 'lotesSeleccionados[0].cantidad_ingresada',  displayName: 'Ingresado'},
                    {field: 'cantidad_pendiente',  displayName: 'Pendiente'},
                    {displayName: "Accion", cellClass: "txt-center dropdown-button",width: "10%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarProducto(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };
            
            /**
             * +Descripcion: Metodo encargado de cerrar la ventana slider del 
             * detalle de separacion de productos
             * @author Cristian Ardila
             */
            $scope.closeDetallePedidos = function() {
                
               // self.mostrarDetallePedidosCompleto();
                $scope.$emit('closeDetallePedidos', {animado: true});              
            };
            
            
            /*
             * +descripcion: confirmar la eliminacion de todos los productos de 
             * la lista de detalle de separacion, si acepta, se ejecutara un 
             * metodo mas que invocara el servicio para la eliminacion,
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onEliminarProductosTodos = function(){               
              self.confirm("Eliminar toda la separacion", "Desea eliminar la separacion",function(confirmar){                 
                  if(confirmar){                      
                            self.eliminarProductoTodos();
                  }
              });  
            };
           
            /*
             * +descripcion: confirmar la generacion de la separacion 
             * si acepta se generara la separacion invocando al metodo 
             * method(generarSeparacion)
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onGenerarSeparacion = function(){               
              self.confirm("Generar separacion", "Desea generar la separacion de los productos",function(confirmar){                 
                  if(confirmar){                      
                            self.generarSeparacion();
                  }
              });  
            };
            
            
             /**
             * +Descripcion: Datos de prueba
             */
            $scope.dataDocumentoDespacho = [
                {nombre: 'Acetaminofen', codigo: 10},
                {nombre: 'Acetaminofen', codigo: 10},
                {nombre: 'Acetaminofen', codigo: 10},
                {nombre: 'Acetaminofen', codigo: 10},
                {nombre: 'Acetaminofen', codigo: 10}
                
            ];
            
             $scope.listarDocumentoDespacho = {
                data: 'dataDocumentoDespacho',
                
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected:false,
                multiSelect:false,
                columnDefs: [
                    {field: 'nombre', displayName: 'Descripcion'},
                    {field: 'codigo', displayName: 'Codigo'}
                   
                     
                ]
               
            };
 
            
            /*
             * +descripcion: confirmar que se genera y audita la separacion
             * si acepta se generara y auditara la separacion invocando al metodo 
             * method(generarAuditar)
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onGenerarAuditar = function(){               
              self.confirm("Generar y auditar", "Desea generar y auditar la separacion de los productos",function(confirmar){                 
                  if(confirmar){                      
                            self.generarAuditar();
                  }
              });  
            };
                        
            
            /*self.mostrarDetallePedidosCompleto =  $rootScope.$on("mostrarDetallePedidosCompleto", function(e, datos) {
            });*/

            self.init(function() {
                 $scope.rootDetalle.pedido = $scope.rootSeparacion.documento.getPedido();

                 console.log("$scope.rootSeparacionClientes.pedido", $scope.rootDetalle.pedido.productos);
                /**
                * +Descripcion: Datos de prueba
                */
                $scope.myData = [
                    {lote: 50, solicitado: "100", ingresado: 60, pendiente: 50, producto: 'ACETAMINOFEN'},
                    {lote: 50, solicitado: "100", ingresado: 60, pendiente: 50, producto: 'ACETAMINOFEN'},
                    {lote: 50, solicitado: "100", ingresado: 60, pendiente: 50, producto: 'ACETAMINOFEN'},
                    {lote: 50, solicitado: "100", ingresado: 60, pendiente: 50, producto: 'ACETAMINOFEN'},
                    {lote: 50, solicitado: "100", ingresado: 60, pendiente: 50, producto: 'ACETAMINOFEN'}
                ];

            });

        }]);
});
