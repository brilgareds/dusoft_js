define(["angular", "js/controllers",'models/Cliente',
        'models/PedidoAuditoria', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('EditarProductoController', [
        '$scope', '$rootScope', 'Request', 
        '$modalInstance', 'Empresa','Cliente',
         'PedidoAuditoria', 'API',"socket", "AlertService",
         "producto", "Usuario", "documento","LoteProductoPedido",

        function(   $scope, $rootScope, Request,
                    $modalInstance, Empresa, Cliente,
                    PedidoAuditoria, API, socket, AlertService, 
                    producto, Usuario, documento, LoteProductoPedido) {
            
           $scope.producto = angular.copy(producto);
           $scope.pedido   = angular.copy(documento.getPedido());
           $scope.lotes    = [];
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };


           $modalInstance.opened.then(function() {
               var obj = {
                    session:$scope.session,
                    data:{
                        pedidos: {
                            numero_pedido: $scope.pedido.numero_pedido,
                            codigo_producto: $scope.producto.codigo_producto,
                            identificador: ($scope.pedido.tipo == 1)?"CL":"FM",
                            limite:100,
                            empresa_id:"03"
                        }
                    }
                };

               Request.realizarRequest(API.PEDIDOS.DISPONIBILIDAD, "POST", obj, function(data) {

                    if(data.status === 200){
                       var lotes = data.obj.existencias_producto;

                       $scope.producto.disponible = data.obj.disponibilidad_bodega;
                       for(var i in lotes){
                            $scope.agregarLote(lotes[i]);
                       }

                    } 
                });
           });

            $modalInstance.result.finally(function() {
                $scope.producto = {};
                $scope.lotes = [];
            });
            

           $scope.agregarLote = function(data){
                var lote = LoteProductoPedido.get(data.lote, data.fecha_vencimiento);
                lote.existencia_actual = data.existencia_actual;
                lote.disponible = $scope.producto.disponible;
                if($scope.esLoteSeleccionado(lote)){
                    lote.selected = true;
                }

                $scope.lotes.push(
                    lote
                );
           }

           $scope.lotes_producto = {
                data: 'lotes',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_lote', displayName: 'Código Lote'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento'},
                    {field: 'existencia_actual', displayName: 'Existencia'},
                    {field: 'disponible', displayName: 'Disponible'},
                    {field:'cantidad_ingresada', displayName:'Cantidad', cellTemplate:'<div class="col-xs-12"><input type="text" validacion-numero class="form-control grid-inline-input" ng-disabled="!row.entity.selected" ng-change="onCantidadIngresadaChange(row)"'+
                             'ng-model="row.entity.cantidad_ingresada" /></div>'},
                    {field: 'opciones', displayName: "Cambiar", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-xs" ng-class="getClass(row)" ng-click="onEditarLote(row)">\n\
                                                <span class="glyphicon glyphicon-check"></span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };



            $scope.getClass = function(row){
                if(row.entity.selected){
                    return "btn-success";
                } else {
                    return "btn-default";
                }
            };
            
            $scope.onEditarLote = function(row){
                
                //evite desmargar el mismo seleccionado
                if($scope.esLoteSeleccionado(row.entity)){
                    return;
                }

                $scope.producto.lote = row.entity;
               // $scope.producto.lote.selected   = !row.entity.selected;
                $scope.producto.cantidad_separada = 0;

                $scope.producto.lote.selected = !row.entity.selected;
                
                for(var i in $scope.lotes){
                    if(!$scope.esLoteSeleccionado($scope.lotes[i])){
                        /*console.log("no selected",$scope.lotes[i]);
                        console.log("why",$scope.producto.lote, $scope.lotes[i])*/
                        $scope.lotes[i].selected = false;
                        $scope.lotes[i].cantidad_ingresada = 0;
                        
                    }
                }
                
                
            };

            $scope.onCantidadIngresadaChange= function(row){
                if(!row.entity.selected) return;

                var validacion = $scope.esCantidadIngresadaValida(row.entity);

                if(validacion.valido){
                    console.log("valido ", validacion)
                    $scope.producto.cantidad_separada = Number(row.entity.cantidad_ingresada);
                } else {
                    console.log("validacion mala ", validacion);
                }
                
            };


            $scope.esCantidadIngresadaValida = function(lote){
                var obj = { valido : true};
                var cantidad_ingresada = parseInt(lote.cantidad_ingresada);
                if(cantidad_ingresada == 0){
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
                    return obj;
                    
                }
                
                
                if(cantidad_ingresada > $scope.producto.cantidad_solicitada){
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
                    return obj;
                    
                }
                
                
                if(cantidad_ingresada > lote.disponible){
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, NO PUEDE SER MAYOR A la Disponibilidad en BODEGA!!.";
                    return obj;
                }
                
                if(cantidad_ingresada > lote.existencia_actual){
                    obj.valido  = false;
                    obj.mensaje =  "La cantidad ingresada, debe ser menor al stock de la bodega!!.";
                    return obj;
                }

                return obj;
            };

            $scope.esLoteSeleccionado = function(lote){
                return lote.codigo_lote == $scope.producto.lote.codigo_lote 
                        && lote.fecha_vencimiento == $scope.producto.lote.fecha_vencimiento;
            };

            $scope.auditarPedido = function(){
   
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            item_id: $scope.producto.lote.item_id,
                            auditado: true
                        }
                    }
                };

               Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.AUDITAR_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {

                    if(data.status === 200){
                       console.log(data)

                    } 
                });
            };

        }]);

});


/*public HashMap<String, Object> validarLote(){
        HashMap<String, Object> obj = new HashMap<String, Object>();
        int cantidad_ingresada = (cantidad.getText().toString().length() > 0)? Integer.parseInt(cantidad.getText().toString()):0;
        
        if(cantidad_ingresada == 0){
            obj.put("valido", false );
            obj.put("mensaje", "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.");
            return obj;
            
        }
        
        
        if(cantidad_ingresada > producto.getCantidadSolicitada()){
            obj.put("valido", false );
            obj.put("mensaje", "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.");
            return obj;
            
        }
        
        if(cantidad_ingresada > producto.getCantidadpendiente()){
            obj.put("valido", false );
            obj.put("mensaje", "La cantidad ingresada, NO PUEDE SER MAYOR A la cantidad PENDIENTE!!.");
            return obj;
        }
        
        if(cantidad_ingresada > lote.getDisponible()){
            obj.put("valido", false );
            obj.put("mensaje", "La cantidad ingresada, NO PUEDE SER MAYOR A la Disponibilidad en BODEGA!!.");
            return obj;
        }
        
        if(cantidad_ingresada > lote.getCantidad()){
            Log.d("response", "cantidad ingresada "+cantidad_ingresada + " cantidad del lote "+lote.getCantidad());
            obj.put("valido", false );
            obj.put("mensaje", "La cantidad ingresada, debe ser menor al stock de la bodega!!.");
            return obj;
        }
        
        obj.put("valido", true);
        
        return obj;
    }*/