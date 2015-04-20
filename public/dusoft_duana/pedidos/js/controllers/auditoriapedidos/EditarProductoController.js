define(["angular", "js/controllers",'models/ClientePedido',
        'models/PedidoAuditoria', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido', "directive/auditoriapedidos/ValidarEventoFila"], function(angular, controllers) {

    var fo = controllers.controller('EditarProductoController', [
        '$scope', '$rootScope', 'Request', 
        '$modalInstance', 'EmpresaPedido','Cliente',
         'PedidoAuditoria', 'API',"socket", "AlertService",
         "producto", "Usuario", "documento","LoteProductoPedido","productos",
         "documento_despacho",

        function(   $scope, $rootScope, Request,
                    $modalInstance, Empresa, Cliente,
                    PedidoAuditoria, API, socket, AlertService, 
                    producto, Usuario, documento, LoteProductoPedido, productos,
                    documento_despacho) {
            
           $scope.rootEditarProducto = {}; 
           //$scope.rootEditarProducto.producto = angular.copy(producto);
           $scope.rootEditarProducto.producto  = producto;
           //console.log("lote por producto ", $scope.rootEditarProducto.producto)
            //$scope.rootEditarProducto.producto.cantidad_solicitada = 120;
           $scope.rootEditarProducto.pedido   = angular.copy(documento.getPedido());
           $scope.rootEditarProducto.documento = documento;
           $scope.rootEditarProducto.producto.lote.cantidad_ingresada = $scope.rootEditarProducto.producto.cantidad_separada;
           $scope.rootEditarProducto.lotes    = [];
           $scope.rootEditarProducto.seleccionados = [];

           var that = this;
           

            $scope.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
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
               that.traerItemsAuditados(function(){
                   that.traerDisponibles(function(data){
                      
                        if(data.status === 200){
                            $scope.rootEditarProducto.mostrarJustificacion = ($scope.rootEditarProducto.producto.lote.justificacion_auditor.length > 0)?true:false;
                           // console.log("justificacion auditor ",$scope.rootEditarProducto.producto.lote.justificacion_auditor);
                           var lotes = data.obj.existencias_producto;
                           var lotesDisponibles = [];
                           $scope.rootEditarProducto.producto.disponible = data.obj.disponibilidad_bodega;

                           for(var i in lotes){
                               var lote = LoteProductoPedido.get(lotes[i].lote, lotes[i].fecha_vencimiento);
                               lote.existencia_actual =  lotes[i].existencia_actual;
                               lotesDisponibles.push(lote);
                           }

                            that.agregarDisponibles(lotesDisponibles);

                        } 

                   });
                    
               });
               
           });
           
        $modalInstance.result.then(function() {
            $scope.rootEditarProducto.producto.cantidad_separada = $scope.rootEditarProducto.producto.obtenerCantidadSeleccionada();
            $scope.rootEditarProducto.producto.cantidad_solicitada = $scope.rootEditarProducto.producto.cantidad_pendiente;
            $scope.rootEditarProducto.producto.lotesSeleccionados = [];
            
        }, function() {
        });

           
           that.traerItemsAuditados = function(callback){
               
                var filtro = {};
                filtro.termino_busqueda  =  $scope.rootEditarProducto.producto.codigo_producto;
                filtro.codigo_producto = true;

                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id:$scope.rootEditarProducto.documento.documento_temporal_id,
                            usuario_id:$scope.rootEditarProducto.documento.usuario_id,
                            filtro:filtro
                        }
                    }
                };
                             
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_ITEMS_POR_PRODUCTO, "POST", obj, function(data) {
                    if(data.status === 200){
                        var lotes = data.obj.movimientos_bodegas.lista_productos_auditados;
                        for(var i in lotes){
                            var lote = LoteProductoPedido.get(lotes[i].lote, lotes[i].fecha_vencimiento);
                            lote.item_id = lotes[i].item_id;
                            lote.cantidad_ingresada = lotes[i].cantidad_ingresada;
                            lote.seleccionado = true;
                            lote.numero_caja = lotes[i].numero_caja;
                           // $scope.rootEditarProducto.seleccionados.push(lote);
                            $scope.rootEditarProducto.producto.agregarLote(lote);
                            
                        }
                        callback();
                    }
                   
                });
               
           };
           
           that.traerDisponibles = function(callback){
               var obj = {
                    session:$scope.session,
                    data:{
                        pedidos: {
                            numero_pedido: $scope.rootEditarProducto.pedido.numero_pedido,
                            codigo_producto: $scope.rootEditarProducto.producto.codigo_producto,
                            identificador: ($scope.rootEditarProducto.pedido.tipo === 1)?"CL":"FM",
                            limite:100,
                            empresa_id:"03"
                        }
                    }
                };

               Request.realizarRequest(API.PEDIDOS.DISPONIBILIDAD, "POST", obj, function(data) {

                   callback(data);
                });
           };
           
           //agrega el disponible si no se encuentra
           that.agregarDisponibles = function(disponibles){
               var separados = $scope.rootEditarProducto.producto.lotesSeleccionados;
               for(var i in disponibles){
                   var encontrado = false;
                   var lote = disponibles[i];
                   for(var ii in separados){
                       var _loteseparado = separados[ii];
                       if(_loteseparado.codigo_lote === lote.codigo_lote && lote.fecha_vencimiento === _loteseparado.fecha_vencimiento){
                           encontrado = true;
                           _loteseparado.existencia_actual = lote.existencia_actual;
                       }
                   }
                   
                   if(!encontrado){
                       lote.seleccionado = false;
                       $scope.rootEditarProducto.producto.agregarLote(lote);
                   }
               }
               
           };

            $modalInstance.result.finally(function() {

                setTimeout(function(){
                    $scope.rootEditarProducto = {};
                    $scope.$$watchers = null;                   
                });
                
            });
            

           $scope.lotes_producto = {
                data: 'rootEditarProducto.producto.lotesSeleccionados',
                enableColumnResize: true,
                enableHighlighting: true,
                selectedItems:[],
                columnDefs: [     
                   // {field: '', displayName: '', width:30, cellTemplate:'<input type="checkbox" ng-model="" />'},
                    {field: 'codigo_lote', displayName: 'Código Lote'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento'},
                    {field: 'existencia_actual', displayName: 'Existencia'},
                   // {field: 'disponible', displayName: 'Disponible'},
                    {field: 'numero_caja', displayName: 'Caja'},
                    {field:'cantidad_ingresada', displayName:'Cantidad', cellTemplate:'<div class="col-xs-12"><input type="text"  ng-focus="onCantidadFocus(row)" ng-model="row.entity.cantidad_ingresada" validacion-numero class="form-control grid-inline-input" ng-disabled="row.entity.seleccionado"  ng-change="onCantidadIngresadaChange(row)"'+
                             'ng-model="row.entity.cantidad_ingresada" ng-disabled="row.entity.numero_caja > 0" /></div>'},
                    {field: 'opciones', displayName: "Cambiar", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <input-check  ng-model="row.entity.seleccionado" ng-change="onEditarLote(row)" ng-disabled="row.entity.cantidad_ingresada == 0 || row.entity.numero_caja > 0" >  />'},
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width:40,
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs"  ng-disabled="!row.entity.seleccionado" ng-click="duplicarLote(row.entity, row)">\n\
                                                <span class="glyphicon glyphicon-plus"></span>\n\
                                            </button>\n\
                                        </div>'
                    }    
                   
                ],
                beforeSelectionChange:function(row, event){
                    console.log(row, "before selection ", event, row instanceof  Array);
                    if(!row.entity || row.entity.numero_caja > 0) return false;
                    
                   // console.log($scope.lotes_producto.selectedItems);
                    if($scope.esEventoPropagadoPorFila(event)){
                        return row.entity.seleccionado;
                    } else {
                        /*if(!row.entity.seleccionado){
                            return true;
                        }*/
                        return false;
                    }
                }

            };



            $scope.getClass = function(row){
                if(row.entity.seleccionado){
                    return "btn-success";
                } else {
                    return "btn-default";
                }
            };

             $scope.onCantidadIngresadaChange= function(row,e){
                row.entity.seleccionado = false;
                row.selected = false;
            };
            
            $scope.duplicarLote = function(lote, row){
                
                console.log("lote a duplicar ", lote, " index ",row);
                var _lote = angular.copy(lote);
                _lote.item_id = 0;
                _lote.numero_caja = 0;
                _lote.seleccionado = false;
                $scope.rootEditarProducto.producto.lotesSeleccionados.splice(row.rowIndex + 1, 0,_lote);
                
            };

            $scope.onCantidadFocus = function(row){
                var cantidad_ingresada = row.entity.cantidad_ingresada;
               //
                console.log("cantidad_ingresada ",cantidad_ingresada, row.entity );


                if(cantidad_ingresada > 0){
                    row.entity.cantidad_ingresada = cantidad_ingresada;
                } else {
                    row.entity.cantidad_ingresada = 0;
                }
                
                     
            };

            that.validarCantidadIngresadaLote= function(row){
                if(row.entity.cantidad_ingresada === 0){
                    row.entity.seleccionado = false;
                    row.entity.editando = false;
                } else {
                    row.entity.seleccionado = true;
                    row.entity.editando = true;
                }
            };

            $scope.onEditarLote = function(row){
                var lote = row.entity;

                //eliminar el lote del temporal
                if(lote.cantidad_ingresada !== 0 && !lote.seleccionado || lote.numero_caja > 0){
                    row.selected = false;
                    that.eliminiarLoteTemporal(lote);
                } else {
                    //agregar el lote al temporal
                    that.agregarLoteAlTemporal(lote);
                }

            };
            
            
            that.eliminiarLoteTemporal = function(lote){
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            item_id: lote.item_id,
                            documento_temporal_id:$scope.rootEditarProducto.documento.documento_temporal_id,
                            usuario_id:$scope.rootEditarProducto.documento.usuario_id,
                            codigo_producto:$scope.rootEditarProducto.producto.codigo_producto

                        }
                    }
                };
                
                //console.log("eliminar lote ", obj);
              
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.ELIMINAR_ITEM_TEMPORAL, "POST", obj, function(data) {

                    console.log("respuesta al modificar lote ",data);
                    if(data.status === 200){
                        lote.item_id = 0 ;
                        that.traerDisponibles(function(data){
                      
                            if(data.status === 200){
                                
                               $scope.rootEditarProducto.producto.cantidad_pendiente += parseInt(lote.cantidad_ingresada);
                               $scope.rootEditarProducto.producto.disponible = data.obj.disponibilidad_bodega;
                               console.log("datos retirados ",$scope.rootEditarProducto.producto);

                            } 

                       });
                    } else {
                        $scope.rootEditarProducto.validacionproducto.valido = false;
                        $scope.rootEditarProducto.validacionproducto.mensaje = "Ha ocurrido un error eliminando el item";
                    }
                });
                
            };
            
            
            that.agregarLoteAlTemporal = function(lote){
              $scope.rootEditarProducto.validacionlote = that.esCantidadIngresadaValida(lote);
                
                //console.log("cantidad ingresada ", lote.cantidad_ingresada, " validacion ", $scope.rootEditarProducto.validacionlote );
                
                if(lote.cantidad_ingresada === 0 || lote.cantidad_ingresada === '' || !$scope.rootEditarProducto.validacionlote.valido){
                    $scope.rootEditarProducto.mostrarJustificacion = false;
                    $scope.rootEditarProducto.validacionproducto.valido = false;
                    lote.seleccionado = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = $scope.rootEditarProducto.validacionlote.mensaje;
                    return;
                } else {
                    $scope.rootEditarProducto.validacionproducto.valido = true;
                    $scope.rootEditarProducto.validacionproducto.mensaje = '';
                }
                

                lote.justificacion_separador = $scope.rootEditarProducto.producto.lote.justificacion_separador;
                $scope.rootEditarProducto.producto.lote = lote;
                $scope.rootEditarProducto.producto.cantidad_separada = Number($scope.rootEditarProducto.validacionlote.cantidad_ingresada);
                $scope.rootEditarProducto.producto.lote.cantidad_pendiente = $scope.rootEditarProducto.producto.cantidad_solicitada - lote.cantidad_ingresada;
                $scope.rootEditarProducto.mostrarJustificacion = that.esJustificacionNecesaria();
                
                
                console.log(">>>>>>>>>>>>>>>>>>>>>>> ",documento_despacho);
                 var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            item_id: $scope.rootEditarProducto.producto.lote.item_id,
                            cantidad_ingresada: $scope.rootEditarProducto.producto.lote.cantidad_ingresada,
                            fecha_vencimiento:$scope.rootEditarProducto.producto.lote.fecha_vencimiento,
                            lote:$scope.rootEditarProducto.producto.lote.codigo_lote,
                            valor_unitario:$scope.rootEditarProducto.producto.precio,
                            empresa_id:documento_despacho.empresa_id.trim(),
                            centro_utilidad_id:documento_despacho.centro_utilidad.trim(),
                            bodega_id:documento_despacho.bodega.trim(),
                            doc_tmp_id:$scope.rootEditarProducto.documento.documento_temporal_id,
                            usuario_id:$scope.rootEditarProducto.documento.usuario_id,
                            codigo_producto:$scope.rootEditarProducto.producto.codigo_producto,
                            iva:$scope.rootEditarProducto.producto.porcentaje_gravament
                            
                            
                        }
                    }
                };

                //console.log("params to send ",obj);
                
               Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.MODIFICAR_DETALLE_TEMPORAL, "POST", obj, function(data) {

                   // console.log("respuesta al modificar lote ",data);
                    if(data.status === 200){
                        lote.item_id = data.obj.documento_temporal.item_id;
                        that.traerDisponibles(function(data){
                      
                            if(data.status === 200){
                               $scope.rootEditarProducto.producto.cantidad_pendiente -= parseInt(lote.cantidad_ingresada);
                               $scope.rootEditarProducto.producto.disponible = data.obj.disponibilidad_bodega;

                            } 

                       });
                    } else {
                        $scope.rootEditarProducto.validacionproducto.valido = false;
                        $scope.rootEditarProducto.validacionproducto.mensaje = "Ha ocurrido un error guardando el item";
                    }
                });
                  
            };


            that.esCantidadIngresadaValida = function(lote){
                var obj = { valido : true};
                var cantidad_ingresada = parseInt(lote.cantidad_ingresada);
                //var cantidad_ingresada = $scope.rootEditarProducto.producto.obtenerCantidadSeleccionada();
                var cantidad_por_lote  = $scope.rootEditarProducto.producto.obtenerCantidadSeleccionadaPorLote(lote.codigo_lote);
                
                console.log("cantidad ingresada >>>>>>> ", cantidad_ingresada, " solicitada ",$scope.rootEditarProducto.producto.cantidad_solicitada, " por lote ",cantidad_por_lote, " disponible ", $scope.rootEditarProducto.producto.disponible);
                obj.cantidad_ingresada = cantidad_ingresada;
                
                if(cantidad_ingresada === 0){
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
                    return obj;
                    
                }
                
                
                if(cantidad_ingresada > $scope.rootEditarProducto.producto.cantidad_pendiente){
                    console.log("cantidad_ingresada ",cantidad_ingresada ," pendiente ",$scope.rootEditarProducto.producto.cantidad_pendiente );
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad pendiente!!.";
                    return obj;
                    
                }
                
                
                if(parseInt(lote.cantidad_ingresada) >/* lote.disponible*/parseInt($scope.rootEditarProducto.producto.disponible)){
                    lote.cantidad_ingresada = 0;
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, NO PUEDE SER MAYOR A la Disponibilidad en BODEGA!!.";
                    console.log("lote.cantidad_ingresada ",lote.cantidad_ingresada, "$scope.rootEditarProducto.producto.disponible", $scope.rootEditarProducto.producto.disponible);
                    return obj;
                }
                
                if(cantidad_por_lote > lote.existencia_actual){
                    obj.valido  = false;
                    obj.mensaje =  "La cantidad ingresada, debe ser menor al stock de la bodega!!.";
                    return obj;
                }
                
                

                return obj;
            };

           

            $scope.auditarPedido = function(){
                
                
                $scope.rootEditarProducto.validacionproducto.valido = true;
              

                if($scope.rootEditarProducto.validacionlote.valido === false && parseInt($scope.rootEditarProducto.producto.disponible) > 0 ){
                    console.log("validacion lote ", $scope.rootEditarProducto.validacionlote);
                    $scope.rootEditarProducto.validacionproducto.valido = $scope.rootEditarProducto.validacionlote.valido;
                    $scope.rootEditarProducto.validacionproducto.mensaje = $scope.rootEditarProducto.validacionlote.mensaje;

                    return;
                }


                $scope.rootEditarProducto.mostrarJustificacion = that.esJustificacionNecesaria();

                if($scope.rootEditarProducto.mostrarJustificacion && $scope.rootEditarProducto.producto.lote.justificacion_auditor.length < 10){
                    $scope.rootEditarProducto.validacionproducto.valido = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "Se debe ingresar la justificación del auditor";
                    return;
                }
                
               console.log("lotes seleccionados >>>>>>>>>>>>>>>>>",$scope.rootEditarProducto.producto.lotesSeleccionados);
                
                //validar que los productos seleccionados tengan cajas
                for(var i in $scope.rootEditarProducto.producto.lotesSeleccionados){
                    var lote = $scope.rootEditarProducto.producto.lotesSeleccionados[i];
                    console.log("validando caja en ", lote);
                    if(lote.seleccionado && (lote.numero_caja === 0 || isNaN(lote.numero_caja) || !lote.numero_caja) ){
                        $scope.rootEditarProducto.validacionproducto.valido = false;
                        $scope.rootEditarProducto.validacionproducto.mensaje = "El lote codigo: "+lote.codigo_lote+ ", esta seleccionado y no tiene caja asignada.";
                        return;
                        
                    }
                    
                }
                
                if($scope.rootEditarProducto.producto.obtenerCantidadSeleccionada() > 0){
                    console.log($scope.rootEditarProducto.producto.lotesSeleccionados.length, "seleccionados >>>>");
                    that.auditarItemsSeleccionados(0);
                } else {
                    that.justificarPendiente();
                }
                
            };
            
            that.justificarPendiente = function(){
                //var cantidad_pendiente = $scope.rootEditarProducto.producto.cantidad_solicitada - $scope.rootEditarProducto.producto.obtenerCantidadSeleccionada();
                  var cantidad_pendiente = $scope.rootEditarProducto.producto.cantidad_pendiente;
                    var obj = {
                        session:$scope.session,
                        data:{
                            documento_temporal: {
                                justificacionPendiente:true,
                                auditado:true
                            }
                        }
                    };


                    if($scope.rootEditarProducto.producto.lote.justificacion_auditor.length >= 10 && $scope.rootEditarProducto.producto.lote.cantidad_pendiente > 0 ){
                        obj.data.documento_temporal.justificacion = {
                            documento_temporal_id:$scope.rootEditarProducto.documento.documento_temporal_id,
                            codigo_producto:$scope.rootEditarProducto.producto.codigo_producto,
                            cantidad_pendiente:cantidad_pendiente,
                            justificacion_auditor:$scope.rootEditarProducto.producto.lote.justificacion_auditor,
                            existencia:0,
                            usuario_id:$scope.rootEditarProducto.documento.separador.usuario_id,
                            justificacion:$scope.rootEditarProducto.producto.lote.justificacion_separador
                        };
                    }
                    //console.log("params to send ",obj, lote);
                    //return;
                   Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.AUDITAR_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {
                       console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> justificar pendiente ", data);
                        if(data.status === 200){
                           $rootScope.$emit("productoAuditado", $scope.rootEditarProducto.producto, $scope.rootEditarProducto.documento);
                           $modalInstance.close();
                        } else {
                            $scope.rootEditarProducto.validacionproducto.valido = false;
                            $scope.rootEditarProducto.validacionproducto.mensaje = "Ha ocurrido un error auditando el producto";
                        }
                    });
            };
            
            that.auditarItemsSeleccionados = function(index){
                if(index > ($scope.rootEditarProducto.producto.lotesSeleccionados.length - 1) ){

                    $rootScope.$emit("productoAuditado", $scope.rootEditarProducto.producto, $scope.rootEditarProducto.documento);
                    $modalInstance.close();
                    return;
                }
                var lote = $scope.rootEditarProducto.producto.lotesSeleccionados[index];
                
                    
                if(lote.seleccionado){

                   // var cantidad_pendiente = $scope.rootEditarProducto.producto.cantidad_solicitada - $scope.rootEditarProducto.producto.obtenerCantidadSeleccionada();
                   var cantidad_pendiente = $scope.rootEditarProducto.producto.cantidad_pendiente;
                    var obj = {
                        session:$scope.session,
                        data:{
                            documento_temporal: {
                                item_id: lote.item_id,
                                auditado: true,
                                numero_caja:lote.numero_caja
                            }
                        }
                    };


                    if($scope.rootEditarProducto.producto.lote.justificacion_auditor.length >= 10 && cantidad_pendiente> 0 ){
                        obj.data.documento_temporal.justificacion = {
                            documento_temporal_id:$scope.rootEditarProducto.documento.documento_temporal_id,
                            codigo_producto:$scope.rootEditarProducto.producto.codigo_producto,
                            cantidad_pendiente:cantidad_pendiente,
                            justificacion_auditor:$scope.rootEditarProducto.producto.lote.justificacion_auditor,
                            existencia:lote.existencia_actual,
                            usuario_id:$scope.rootEditarProducto.documento.separador.usuario_id,
                            justificacion:$scope.rootEditarProducto.producto.lote.justificacion_separador
                        };
                    }
                    //console.log("params to send ",obj, lote);
                    //return;
                   Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.AUDITAR_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {

                        if(data.status === 200){
                            index++;
                            that.auditarItemsSeleccionados(index);
                        } 
                    });
                } else {
                    index++;
                    that.auditarItemsSeleccionados(index);
                }
            };

            that.esJustificacionNecesaria = function(){
                if($scope.rootEditarProducto.producto === undefined) return;

                console.log("separada ",$scope.rootEditarProducto.producto.cantidad_separada, " solicitada ",$scope.rootEditarProducto.producto.cantidad_solicitada
                    , " lengt just",$scope.rootEditarProducto.producto.lote.justificacion_auditor.length, " justificacion auditor ",$scope.rootEditarProducto.producto.lote.justificacion_auditor);
                    
                
                /*if($scope.rootEditarProducto.producto.obtenerCantidadSeleccionada() < 
                    $scope.rootEditarProducto.producto.cantidad_solicitada ){

                        return true;

                }*/
                
                if($scope.rootEditarProducto.producto.cantidad_pendiente > 0){
                    return true;
                }

                return false;
            };

            $scope.onValidarCaja = function(){
               // console.log("formato de caja ",isNaN($scope.rootEditarProducto.caja.numero))
                
            };
            
            $scope.onSeleccionarCaja = function(){
                $scope.cerrar = false;
                if($scope.lotes_producto.selectedItems.length === 0){
                    $scope.rootEditarProducto.validacionproducto.valido = false;
                    $scope.rootEditarProducto.caja.valida = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "No se han seleccionado lotes para la caja";
                    return;
                }
                
                if(isNaN($scope.rootEditarProducto.caja.numero) || $scope.rootEditarProducto.caja.numero === 0){
                    $scope.rootEditarProducto.validacionproducto.valido = false;
                    $scope.rootEditarProducto.caja.valida = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "Número de caja no es válido";

                    return;
                }

                var cliente = (!$scope.rootEditarProducto.pedido.cliente)?$scope.rootEditarProducto.pedido.farmacia:$scope.rootEditarProducto.pedido.cliente;

                var url = API.DOCUMENTOS_TEMPORALES.VALIDAR_CAJA;
                 //console.log($scope.rootEditarProducto.pedido.farmacia, " cliente ", cliente);
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            documento_temporal_id: $scope.rootEditarProducto.documento.documento_temporal_id,
                            numero_caja: $scope.rootEditarProducto.caja.numero,
                            numero_pedido: $scope.rootEditarProducto.pedido.numero_pedido,
                            direccion_cliente: cliente.direccion || cliente.nombre_farmacia,
                            nombre_cliente:cliente.nombre_tercero || cliente.nombre_farmacia
                        }
                    }
                };
                
                //valida la caja
                Request.realizarRequest(url, "POST", obj, function(data) {
                   
                    if(data.status === 200){
                        var obj = data.obj.movimientos_bodegas;
                         console.log("obj for box ",obj);
                        //$scope.rootEditarProducto.caja.valida = obj.caja_valida;
                        if(!obj.caja_valida){
                            $scope.rootEditarProducto.validacionproducto.valido = false;
                            $scope.rootEditarProducto.validacionproducto.mensaje = "La caja se encuentra cerrada";
                            $scope.rootEditarProducto.caja.valida = false;
                        } else {
                            $scope.rootEditarProducto.validacionproducto.valido = true;
                            
                            console.log($scope.lotes_producto.selectedItems, " caja valida ",$scope.rootEditarProducto.caja.valida );
              
                            var items = [];
                            

                            for(var i in $scope.lotes_producto.selectedItems){
                                items.push($scope.lotes_producto.selectedItems[i].item_id);
                            }

                            var obj = {
                                  session:$scope.session,
                                  data:{
                                      documento_temporal: {
                                          temporales: items,
                                          numero_caja: $scope.rootEditarProducto.caja.numero
                                      }
                                  }
                              };

                              Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_CAJA_TEMPORALES, "POST", obj, function(data) {

                                  if(data.status === 200){
                                          //asigna numero de caja a los lotes seleccionados
                                         var lotes = $scope.lotes_producto.selectedItems;
                                         var index = 0;
                                         for(var i in items){
                                              for(var ii in lotes){
                                                  if(lotes[ii].item_id === items[i]){
                                                      lotes[ii].numero_caja = $scope.rootEditarProducto.caja.numero;
                                                      break;
                                                  }
                                              }
                                         }

                                         //desseleccionar los lotes que tiene caja
                                         for(var i in $scope.rootEditarProducto.producto.lotesSeleccionados){
                                             $scope.lotes_producto.selectRow(i, false);
                                         }


                                         $scope.rootEditarProducto.caja.valida = true;

                                  } else {
                                        $scope.rootEditarProducto.validacionproducto.valido = false;
                                        $scope.rootEditarProducto.validacionproducto.mensaje = "Ha ocurrido un error generanado la caja";
                                  }
                              });
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
                    console.log(data);
                    if(data.status === 200){
                        
                        $scope.cerrar = true;
                        //$scope.rootEditarProducto.caja.numero = "";
                    } else {
                        $scope.cerrar = false;
                    }
                });
            };
            
            $scope.onImprimirRotulo = function(){
                $scope.cerrar = false;     
                $rootScope.$emit("onGenerarPdfRotulo", $scope.rootEditarProducto.documento.pedido.tipo,
                                                       $scope.rootEditarProducto.documento.pedido.numero_pedido,
                                                       $scope.rootEditarProducto.caja.numero);
                
            };

            $scope.cerrarModal = function(){
                $modalInstance.close();
            };

        }]);

});


