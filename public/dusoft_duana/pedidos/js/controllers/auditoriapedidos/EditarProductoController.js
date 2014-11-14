define(["angular", "js/controllers",'models/ClientePedido',
        'models/PedidoAuditoria', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido', "directive/auditoriapedidos/ValidarEventoFila"], function(angular, controllers) {

    var fo = controllers.controller('EditarProductoController', [
        '$scope', '$rootScope', 'Request', 
        '$modalInstance', 'EmpresaPedido','Cliente',
         'PedidoAuditoria', 'API',"socket", "AlertService",
         "producto", "Usuario", "documento","LoteProductoPedido","productos",

        function(   $scope, $rootScope, Request,
                    $modalInstance, Empresa, Cliente,
                    PedidoAuditoria, API, socket, AlertService, 
                    producto, Usuario, documento, LoteProductoPedido, productos) {
            
           $scope.rootEditarProducto = {}; 
           $scope.rootEditarProducto.producto = angular.copy(producto);
           //console.log("lote por producto ", $scope.rootEditarProducto.producto)
            //$scope.rootEditarProducto.producto.cantidad_solicitada = 120;
           $scope.rootEditarProducto.pedido   = angular.copy(documento.getPedido());
           $scope.rootEditarProducto.documento = documento;
           $scope.rootEditarProducto.producto.lote.cantidad_ingresada = $scope.rootEditarProducto.producto.cantidad_separada;
           $scope.rootEditarProducto.lotes    = [];
           $scope.rootEditarProducto.seleccionados = [];

           var that = this;
           

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
               that.traerItemsAuditados(function(){
                   that.traerDisponibles(function(disponibles){
                       that.agregarDisponibles(disponibles);
                       
                   });
                    
               });
               
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
                            identificador: ($scope.rootEditarProducto.pedido.tipo == 1)?"CL":"FM",
                            limite:100,
                            empresa_id:"03"
                        }
                    }
                };

               Request.realizarRequest(API.PEDIDOS.DISPONIBILIDAD, "POST", obj, function(data) {

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
                       
                       callback(lotesDisponibles);
                       
                    } 
                });
           };
           
           //agrega el disponible si no se encuentra
           that.agregarDisponibles = function(disponibles){
               var separados = $scope.rootEditarProducto.producto.lotesSeleccionados;
               for(var i in disponibles){
                   var encontrado = false;
                   var lote = disponibles[i];
                   for(var i in separados){
                       var _loteseparado = separados[i];
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
            
           /* //verifica que el lote que se valla a agregar de disponibilidad no este agregado
           that.verificarExistenciaLote = function(lote){
               var lotes = $scope.rootEditarProducto.producto.lotesSeleccionados;
               for(var i in lotes){
                   
                   if(lote.codigo_lote === lotes[i].codigo_lote && lote.fecha_vencimiento === lotes[i].fecha_vencimiento){
                       return {existe:true, lote:lotes[i]};
                   }
               }
               
                return {existe:false, lote:{}};
           };
           
           //agrega lote al grid de disponibles
           that.agregarLote = function(data){
                var lote = LoteProductoPedido.get(data.lote, data.fecha_vencimiento);
                var loteexistencia = {};
                
                loteexistencia = that.verificarExistenciaLote(lote);
                if(loteexistencia.existe){
                   lote = loteexistencia.lote;
                }
                
                lote.existencia_actual = data.existencia_actual;
                lote.disponible = $scope.rootEditarProducto.producto.disponible;
                
                var seleccion = that.esLoteSeleccionado(lote); 
             //   console.log("seleccion ",seleccion)
                
                if(seleccion.seleccionado){
                    console.log("seleccionado ",seleccion)
                    lote.seleccionado = true;
                    lote.cantidad_ingresada = seleccion.lote.cantidad_ingresada;
                    lote.item_id = seleccion.lote.item_id;
                }
                
                if(!loteexistencia.existe){
                    $scope.rootEditarProducto.producto.agregarLote(lote);     
                } else {
                    console.log("no se agrego ", lote)
                }
                
           };
           
            //verifica si el lote fue seleccionado en la separacion
            that.esLoteSeleccionado = function(lote){
                for(var i in $scope.rootEditarProducto.seleccionados){
                    var _lote = $scope.rootEditarProducto.seleccionados[i];
                   // console.log("buscando en  ",_lote, " con ",lote)
                    
                    if(lote.codigo_lote === _lote.codigo_lote 
                        && lote.fecha_vencimiento === _lote.fecha_vencimiento){
                    
                      return {seleccionado:true, lote:_lote};
                   }
                }

                 return {seleccionado:false, lote:{}};
            };*/

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
                    {field: 'item_id', displayName: 'item_id'},
                    {field:'cantidad_ingresada', displayName:'Cantidad', cellTemplate:'<div class="col-xs-12"><input type="text"  ng-focus="onCantidadFocus(row)" ng-model="row.entity.cantidad_ingresada" validacion-numero class="form-control grid-inline-input"  ng-change="onCantidadIngresadaChange(row)"'+
                             'ng-model="row.entity.cantidad_ingresada" /></div>'},
                    {field: 'opciones', displayName: "Cambiar", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <input-check ng-model="row.entity.seleccionado" ng-change="onEditarLote(row)" ng-disabled="row.entity.cantidad_ingresada == 0" >  />'},
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width:40,
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="duplicarLote(row.entity)">\n\
                                                <span class="glyphicon glyphicon-plus"></span>\n\
                                            </button>\n\
                                        </div>'
                    }    
                   
                ],
                beforeSelectionChange:function(row, event){
                    console.log(row, "before selection ", event);
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
            
            $scope.duplicarLote = function(lote){
                console.log("lote a duplicar ", lote);
                var _lote = angular.copy(lote);
                _lote.item_id = 0;
                _lote.seleccionado = false;
                $scope.rootEditarProducto.producto.lotesSeleccionados.push(_lote);
                
            };

            $scope.onCantidadFocus = function(row){
                var cantidad_ingresada = row.entity.cantidad_ingresada;
               //
                console.log("cantidad_ingresada ",cantidad_ingresada, row.entity )
               /* for(var i in $scope.rootEditarProducto.lotes){
                    var lote = $scope.rootEditarProducto.lotes[i];
                    lote.cantidad_ingresada = 0;
                    lote.selected = false;
                }*/

                if(cantidad_ingresada > 0){
                    row.entity.cantidad_ingresada = cantidad_ingresada;
                } else {
                    row.entity.cantidad_ingresada = 0;
                }
                
                     
            };

            that.validarCantidadIngresadaLote= function(row){
                if(row.entity.cantidad_ingresada == 0){
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
                if(lote.cantidad_ingresada !== 0 && !lote.seleccionado){
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
                    }
                });
                
            };
            
            
            that.agregarLoteAlTemporal = function(lote){
               console.log("item >>>>>>>>>>>>> ",lote)
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

                 var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            item_id: $scope.rootEditarProducto.producto.lote.item_id,
                            cantidad_ingresada: $scope.rootEditarProducto.producto.lote.cantidad_ingresada,
                            fecha_vencimiento:$scope.rootEditarProducto.producto.lote.fecha_vencimiento,
                            lote:$scope.rootEditarProducto.producto.lote.codigo_lote,
                            valor_unitario:$scope.rootEditarProducto.producto.precio,
                            empresa_id:$scope.rootEditarProducto.documento.empresa_id,
                            centro_utilidad_id:$scope.rootEditarProducto.documento.centro_utilidad,
                            bodega_id:$scope.rootEditarProducto.documento.bodega_id,
                            doc_tmp_id:$scope.rootEditarProducto.documento.documento_temporal_id,
                            usuario_id:$scope.rootEditarProducto.documento.usuario_id,
                            codigo_producto:$scope.rootEditarProducto.producto.codigo_producto,
                            iva:$scope.rootEditarProducto.producto.porcentaje_gravament
                            
                            
                        }
                    }
                };

                console.log("params to send ",obj);
                

               Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.MODIFICAR_DETALLE_TEMPORAL, "POST", obj, function(data) {

                   // console.log("respuesta al modificar lote ",data);
                    if(data.status === 200){
                        lote.item_id = data.obj.documento_temporal.item_id;
                    }
                });
                  
            };


            that.esCantidadIngresadaValida = function(lote){
                var obj = { valido : true};
                //var cantidad_ingresada = parseInt(lote.cantidad_ingresada);
                var cantidad_ingresada = $scope.rootEditarProducto.producto.obtenerCantidadSeleccionada();
                
                console.log("cantidad ingresada >>>>>>> ", cantidad_ingresada, " solicitada ",$scope.rootEditarProducto.producto.cantidad_solicitada);
                obj.cantidad_ingresada = cantidad_ingresada;
                
                if(cantidad_ingresada === 0){
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
                    return obj;
                    
                }
                
                
                if(cantidad_ingresada > $scope.rootEditarProducto.producto.cantidad_solicitada){
                    obj.valido  = false;
                    obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
                    return obj;
                    
                }
                
                
                if(cantidad_ingresada >/* lote.disponible*/$scope.rootEditarProducto.producto.disponible){
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

           

            $scope.auditarPedido = function(){
                
                
                return;
                $scope.rootEditarProducto.validacionproducto.valido = true;
              

                if($scope.rootEditarProducto.validacionlote.valido === false){
                    console.log("validacion lote ", $scope.rootEditarProducto.validacionlote)
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
                    

                if(isNaN($scope.rootEditarProducto.caja.numero) /*|| $scope.rootEditarProducto.caja.numero == 0*/){
                    $scope.rootEditarProducto.validacionproducto.valido = false
                    $scope.rootEditarProducto.caja.valida = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "Número de caja no es válido";

                    return;
                }

                if(!$scope.rootEditarProducto.caja.valida && $scope.rootEditarProducto.caja.numero > 0){
                    $scope.rootEditarProducto.validacionproducto.valido = false;
                    $scope.rootEditarProducto.validacionproducto.mensaje = "La caja se encuentra cerrada";
                    return;
                }
                
   
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            item_id: $scope.rootEditarProducto.producto.lote.item_id,
                            auditado: true,
                            numero_caja:$scope.rootEditarProducto.caja.numero
                        }
                    }
                };


                if($scope.rootEditarProducto.producto.lote.justificacion_auditor.length >= 10 && $scope.rootEditarProducto.producto.lote.cantidad_pendiente > 0 ){
                    obj.data.documento_temporal.justificacion = {
                        documento_temporal_id:$scope.rootEditarProducto.documento.documento_temporal_id,
                        codigo_producto:$scope.rootEditarProducto.producto.codigo_producto,
                        cantidad_pendiente:$scope.rootEditarProducto.producto.lote.cantidad_pendiente,
                        justificacion_auditor:$scope.rootEditarProducto.producto.lote.justificacion_auditor,
                        existencia:$scope.rootEditarProducto.producto.lote.existencia_actual,
                        usuario_id:$scope.rootEditarProducto.documento.separador.usuario_id,
                        justificacion:$scope.rootEditarProducto.producto.lote.justificacion_separador
                    };
                }
                console.log("params to send ",obj);
                //console.log("cantidad pendienet ",$scope.rootEditarProducto.producto.lote)
                //return;
               Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.AUDITAR_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {

                    if(data.status === 200){
                       $rootScope.$emit("productoAuditado", $scope.rootEditarProducto.producto, $scope.rootEditarProducto.documento);
                       $modalInstance.close();
                    } 
                });
            };

            that.esJustificacionNecesaria = function(){
                if($scope.rootEditarProducto.producto === undefined) return;

                console.log("separada ",$scope.rootEditarProducto.producto.cantidad_separada, " solicitada ",$scope.rootEditarProducto.producto.cantidad_solicitada
                    , " lengt just",$scope.rootEditarProducto.producto.lote.justificacion_auditor.length, " justificacion auditor ",$scope.rootEditarProducto.producto.lote.justificacion_auditor);
                if($scope.rootEditarProducto.producto.cantidad_separada < 
                    $scope.rootEditarProducto.producto.cantidad_solicitada ){

                        return true;

                }

                return false;
            };

            $scope.onValidarCaja = function(){
               // console.log("formato de caja ",isNaN($scope.rootEditarProducto.caja.numero))
                if(isNaN($scope.rootEditarProducto.caja.numero) /*|| $scope.rootEditarProducto.caja.numero == 0*/){
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
                            direccion_cliente: $scope.rootEditarProducto.pedido.cliente.direccion,
                            nombre_cliente:cliente.nombre_tercero || cliente.nombre_farmacia
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                   
                    if(data.status === 200){
                        var obj = data.obj.movimientos_bodegas;
                         console.log("obj for box ",obj);
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
                    console.log(data);
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


