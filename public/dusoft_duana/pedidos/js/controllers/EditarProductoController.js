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
            
           $scope.rootEditarProducto = {}; 
           $scope.rootEditarProducto.producto = angular.copy(producto);
            $scope.rootEditarProducto.producto.cantidad_solicitada = 120;
           $scope.rootEditarProducto.pedido   = angular.copy(documento.getPedido());
           $scope.rootEditarProducto.documento = documento;
           $scope.rootEditarProducto.producto.lote.cantidad_ingresada = $scope.rootEditarProducto.producto.cantidad_separada;
           $scope.rootEditarProducto.lotes    = [];
           $scope.rootEditarProducto.mostrarJustificacion = false;

            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.rootEditarProducto.caja  = {
                numero:0,
                valida:false
            };

            $scope.rootEditarProducto.validacionlote = {valido:true};
            $scope.rootEditarProducto.validacionproducto = {
                valido:true
            };

           $modalInstance.opened.then(function() {
               var obj = {
                    session:$scope.session,
                    data:{
                        pedidos: {
                            numero_pedido: $scope.rootEditarProducto.pedido.numero_pedido,
                            codigo_producto: $scope.rootEditarProducto.producto.codigo_producto,
                            identificador: ($scope.rootEditarProducto.pedido.tipo == 1)?"CL":"FM",
                            limite:100,
                            empresa_id:"03"
                        }
                    }
                };

               Request.realizarRequest(API.PEDIDOS.DISPONIBILIDAD, "POST", obj, function(data) {

                    if(data.status === 200){
                       var lotes = data.obj.existencias_producto;

                       $scope.rootEditarProducto.producto.disponible = data.obj.disponibilidad_bodega;
                       for(var i in lotes){
                            $scope.agregarLote(lotes[i]);
                       }

                    } 
                });
           });

            $modalInstance.result.finally(function() {
                $scope.rootEditarProducto = {};
            });
            

           $scope.agregarLote = function(data){
                var lote = LoteProductoPedido.get(data.lote, data.fecha_vencimiento);
                lote.existencia_actual = data.existencia_actual;
                lote.disponible = $scope.rootEditarProducto.producto.disponible;
                if($scope.esLoteSeleccionado(lote)){
                    lote.selected = true;
                    lote.cantidad_ingresada = $scope.rootEditarProducto.producto.cantidad_separada;

                }

                $scope.rootEditarProducto.lotes.push(
                    lote
                );
           }

           $scope.lotes_producto = {
                data: 'rootEditarProducto.lotes',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_lote', displayName: 'Código Lote'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento'},
                    {field: 'existencia_actual', displayName: 'Existencia'},
                    {field: 'disponible', displayName: 'Disponible'},
                    {field:'cantidad_ingresada', displayName:'Cantidad', cellTemplate:'<div class="col-xs-12"><input type="text" ng-value="row.entity.cantidad_ingresada" validacion-numero class="form-control grid-inline-input" ng-disabled="!row.entity.selected" ng-change="onCantidadIngresadaChange(row)"'+
                             'ng-model="row.entity.cantidad_ingresada" /></div>'},
                    {field: 'opciones', displayName: "Cambiar", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <input-check ng-model="row.entity.selected" ng-click="onEditarLote(row)"> />'
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

                $scope.rootEditarProducto.producto.lote = row.entity;
                $scope.rootEditarProducto.producto.cantidad_separada = 0;

                //$scope.producto.lote.selected = !row.entity.selected;
                
                for(var i in $scope.rootEditarProducto.lotes){
                    if(!$scope.esLoteSeleccionado($scope.rootEditarProducto.lotes[i])){
                       /* console.log("no selected",$scope.lotes[i]);
                        console.log("why",$scope.producto.lote, $scope.lotes[i])*/
                        $scope.rootEditarProducto.lotes[i].selected = false;
                        $scope.rootEditarProducto.lotes[i].cantidad_ingresada = 0;
                        
                    }
                }

                
                
            };

            $scope.onCantidadIngresadaChange= function(row,e){
                if(!row.entity.selected) return;
                $scope.rootEditarProducto.validacionlote = $scope.esCantidadIngresadaValida(row.entity);

                if($scope.rootEditarProducto.validacionlote.valido){
                    console.log("valido ", $scope.validacionlote)
                    $scope.rootEditarProducto.producto.cantidad_separada = Number(row.entity.cantidad_ingresada);
                } else {
                    $scope.rootEditarProducto.mostrarJustificacion = false;
                    console.log("validacion mala ", $scope.rootEditarProducto.validacionlote);
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
                
                
                if(cantidad_ingresada > $scope.rootEditarProducto.producto.cantidad_solicitada){
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
                 if(lote.codigo_lote == $scope.rootEditarProducto.producto.lote.codigo_lote 
                        && lote.fecha_vencimiento == $scope.rootEditarProducto.producto.lote.fecha_vencimiento){
                   // console.log("es lote seleccionado ", lote)
                    return true;
                 } 

                 return false;
            };

            $scope.auditarPedido = function(){
                $scope.rootEditarProducto.validacionproducto.valido = true;
               

                if(isNaN($scope.rootEditarProducto.producto.cantidad_separada) || $scope.rootEditarProducto.producto.cantidad_separada == 0){

                    $scope.rootEditarProducto.validacionproducto.valido = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "La cantidad separada no es valida";
                    return;
                }

                if($scope.rootEditarProducto.validacionlote.valido == false){
                    console.log("validacion lote ", $scope.rootEditarProducto.validacionlote)
                    $scope.rootEditarProducto.validacionproducto.valido = $scope.rootEditarProducto.validacionlote.valido;
                    $scope.rootEditarProducto.validacionproducto.mensaje = $scope.rootEditarProducto.validacionlote.mensaje;

                    return;
                }


                $scope.rootEditarProducto.mostrarJustificacion = $scope.esJustificacionNecesaria();

                if($scope.rootEditarProducto.mostrarJustificacion){
                    $scope.rootEditarProducto.validacionproducto.valido = false
                    $scope.rootEditarProducto.validacionproducto.mensaje = "Se debe ingresar la justificación del auditor";
                    return;
                }
                    

                if(isNaN($scope.rootEditarProducto.caja.numero) || $scope.rootEditarProducto.caja.numero == 0){
                    console.log($scope.rootEditarProducto.caja.numero , " numero de caja ", isNaN($scope.rootEditarProducto.caja.numero), $scope)
                    $scope.rootEditarProducto.validacionproducto.valido = false
                    $scope.rootEditarProducto.caja.valida = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "Número de caja no es válido";

                    return;
                }

                if(!$scope.rootEditarProducto.caja.valida){
                    $scope.rootEditarProducto.validacionproducto.valido = false
                    $scope.rootEditarProducto.validacionproducto.mensaje = "La caja se encuentra cerrada";
                    return;
                }

                $rootScope.$emit("productoAuditado", $scope.rootEditarProducto.producto);
                $modalInstance.close();
                return;
   
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            item_id: $scope.rootEditarProducto.producto.lote.item_id,
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

            $scope.esJustificacionNecesaria = function(){
                if($scope.rootEditarProducto.producto == undefined) return;

                console.log("separada ",$scope.rootEditarProducto.producto.cantidad_separada, " solicitada ",$scope.rootEditarProducto.producto.cantidad_solicitada
                    , " lengt just",$scope.rootEditarProducto.producto.lote.justificacion_auditor.length)
                if($scope.rootEditarProducto.producto.cantidad_separada < 
                    $scope.rootEditarProducto.producto.cantidad_solicitada ){

                        if($scope.rootEditarProducto.producto.lote.justificacion_auditor.length < 10){
                            return true;
                        }

                }

                return false;
            };

            $scope.onValidarCaja = function(){

                if(isNaN($scope.rootEditarProducto.caja.numero) || $scope.rootEditarProducto.caja.numero == 0){
                    $scope.rootEditarProducto.validacionproducto.valido = false
                    $scope.rootEditarProducto.caja.valida = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "Número de caja no es válido";

                    return;
                }

                var cliente = (!$scope.rootEditarProducto.pedido.cliente)?$scope.rootEditarProducto.pedido.farmacia:$scope.rootEditarProducto.pedido.cliente;

                var url = API.DOCUMENTOS_TEMPORALES.VALIDAR_CAJA;
                 console.log($scope.rootEditarProducto, " cliente ", cliente)
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            documento_temporal_id: $scope.rootEditarProducto.documento.documento_temporal_id,
                            numero_caja: $scope.rootEditarProducto.caja.numero,
                            numero_pedido: $scope.rootEditarProducto.pedido.numero_pedido,
                            direccion_cliente: $scope.rootEditarProducto.pedido.cliente.direccion_cliente,
                            nombre_cliente:cliente.nombre_tercero || cliente.nombre_farmacia
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                   
                    if(data.status === 200){
                        var obj = data.obj.movimientos_bodegas;
                         console.log("obj for box ",obj)
                        $scope.rootEditarProducto.caja.valida = obj.caja_valida;
                        if(!obj.caja_valida){
                            $scope.rootEditarProducto.validacionproducto.valido = false;
                            $scope.rootEditarProducto.validacionproducto.mensaje = "La caja se encuentra cerrada";
                        } else {
                            $scope.rootEditarProducto.validacionproducto.valido = true;
                        }

                    } 
                });
            };

            $scope.onCerrarCaja = function(){
                 var url = API.DOCUMENTOS_TEMPORALES.GENERAR_ROTULO;
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            documento_temporal_id: $scope.rootEditarProducto.documento.documento_temporal_id,
                            numero_caja: $scope.rootEditarProducto.caja.numero
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    console.log(data)
                    if(data.status === 200){
                        
                        $scope.cerrar = true;
                    } else {
                        $scope.cerrar = false;
                    }
                });
            };

            $scope.cerrarModal = function(){
                $modalInstance.close();
            };

        }]);

});

///api/movBodegas/E008/generarRotuloCaja documento_temporal_id numero_caja