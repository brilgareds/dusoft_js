define(["angular", "js/controllers",'models/ClientePedido',
        'models/PedidoAuditoria', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido', "directive/auditoriapedidos/ValidarEventoFila"], function(angular, controllers) {

    var fo = controllers.controller('EditarProductoController', [
        '$scope', '$rootScope', 'Request', 
        '$modalInstance', 'EmpresaPedido','Cliente',
         'PedidoAuditoria', 'API',"socket", "AlertService",
         "producto", "Usuario", "documento","LoteProductoPedido","productos",
         "documento_despacho","Caja","$modal",

        function(   $scope, $rootScope, Request,
                    $modalInstance, Empresa, Cliente,
                    PedidoAuditoria, API, socket, AlertService, 
                    producto, Usuario, documento, LoteProductoPedido, productos,
                    documento_despacho, Caja, $modal) {

        $scope.rootEditarProducto = {}; 
        $scope.rootEditarProducto.producto  = producto;

        $scope.rootEditarProducto.pedido   = angular.copy(documento.getPedido());
        $scope.rootEditarProducto.documento = documento;
        $scope.rootEditarProducto.producto.lote.cantidad_ingresada = $scope.rootEditarProducto.producto.cantidad_separada;
        $scope.rootEditarProducto.lotes    = [];
        $scope.rootEditarProducto.seleccionados = [];
        
        $scope.justificaciones = [
            {descripcion: "No hay fisico"},
            {descripcion: "Averiado"},
            {descripcion: "Proximo A Vencer"},
            {descripcion: "Trocado"},
            {descripcion: "Por presentacion"}
        ];


        var that = this;


         $scope.session = {
              usuario_id: Usuario.getUsuarioActual().getId(),
              auth_token: Usuario.getUsuarioActual().getToken()
         };

         $scope.rootEditarProducto.caja = Caja.get();

         $scope.rootEditarProducto.validacionlote = {valido:true};
         $scope.rootEditarProducto.validacionproducto = {
             valido:true
         };

        $modalInstance.opened.then(function() {
            that.traerItemsAuditados(function(){
                that.traerDisponibles(function(data){

                     if(data.status === 200){
                         $scope.rootEditarProducto.mostrarJustificacion = ($scope.rootEditarProducto.producto.lote.justificacion_auditor.length > 0)?true:false;
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
                         lote.setTipoCaja(lotes[i].tipo_caja);
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
             enableRowSelection: true,
             showFilter:true,
             selectedItems:[],
             columnDefs: [     
                 {field: 'codigo_lote', displayName: 'Código Lote'},
                 {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento'},
                 {field: 'existencia_actual', displayName: 'Existencia'},
                 {field: 'numero_caja', displayName: 'Caja / Nevera', cellClass: "ngCellText",
                     cellTemplate: '<div ng-switch="row.entity.tipoCaja">\
                         <div ng-switch-when="0"><span ng-if="row.entity.numero_caja > 0">Caja - {{row.entity.numero_caja}}</span></div>\
                         <div ng-switch-when="1"><span ng-if="row.entity.numero_caja > 0">Nevera - {{row.entity.numero_caja}}</span></div>\
                     </div>'
                 },
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
                                
               if(!row.entity || row.entity.cantidad_ingresada === 0 || row.entity.numero_caja > 0 || !row.entity.seleccionado ){
                   return false;
               }
               
               return true;

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
             //row.selected = false;
         };

         $scope.duplicarLote = function(lote, row){

             var _lote = angular.copy(lote);
             _lote.item_id = 0;
             _lote.numero_caja = 0;
             _lote.seleccionado = false;
             $scope.rootEditarProducto.producto.lotesSeleccionados.splice(row.rowIndex + 1, 0,_lote);

         };

         $scope.onCantidadFocus = function(row){
             var cantidad_ingresada = row.entity.cantidad_ingresada;

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


             Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.ELIMINAR_ITEM_TEMPORAL, "POST", obj, function(data) {

                 console.log("respuesta al modificar lote ",data);
                 if(data.status === 200){
                     lote.item_id = 0 ;
                     that.traerDisponibles(function(data){

                         if(data.status === 200){

                            $scope.rootEditarProducto.producto.cantidad_pendiente += parseInt(lote.cantidad_ingresada);
                            lote.cantidad_pendiente += parseInt(lote.cantidad_ingresada);
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


            Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.MODIFICAR_DETALLE_TEMPORAL, "POST", obj, function(data) {

                 if(data.status === 200){
                     lote.item_id = data.obj.documento_temporal.item_id;
                     that.traerDisponibles(function(data){

                         if(data.status === 200){
                            $scope.rootEditarProducto.producto.cantidad_pendiente -= parseInt(lote.cantidad_ingresada);
                            $scope.rootEditarProducto.producto.disponible = data.obj.disponibilidad_bodega;
                            $scope.rootEditarProducto.mostrarJustificacion = that.esJustificacionNecesaria();
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

             obj.cantidad_ingresada = cantidad_ingresada;

             if(cantidad_ingresada === 0){
                 obj.valido  = false;
                 obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
                 return obj;

             }


             if(cantidad_ingresada > $scope.rootEditarProducto.producto.cantidad_pendiente){
                 obj.valido  = false;
                 obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad pendiente!!.";
                 return obj;

             }


             if(parseInt(lote.cantidad_ingresada) >/* lote.disponible*/parseInt($scope.rootEditarProducto.producto.disponible)){
                 lote.cantidad_ingresada = 0;
                 obj.valido  = false;
                 obj.mensaje = "La cantidad ingresada, NO PUEDE SER MAYOR A la Disponibilidad en BODEGA!!.";

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
                 $scope.rootEditarProducto.validacionproducto.valido = $scope.rootEditarProducto.validacionlote.valido;
                 $scope.rootEditarProducto.validacionproducto.mensaje = $scope.rootEditarProducto.validacionlote.mensaje;

                 return;
             }


             $scope.rootEditarProducto.mostrarJustificacion = that.esJustificacionNecesaria();

             if($scope.rootEditarProducto.mostrarJustificacion && $scope.rootEditarProducto.producto.lote.justificacion_auditor.length === 0){
                 $scope.rootEditarProducto.validacionproducto.valido = false;
                 $scope.rootEditarProducto.validacionproducto.mensaje = "Se debe seleccionar la justificación del auditor";
                 return;
             }


             //validar que los productos seleccionados tengan cajas
             for(var i in $scope.rootEditarProducto.producto.lotesSeleccionados){
                 var lote = $scope.rootEditarProducto.producto.lotesSeleccionados[i];
                 if(lote.seleccionado && (lote.numero_caja === 0 || isNaN(lote.numero_caja) || !lote.numero_caja) ){
                     $scope.rootEditarProducto.validacionproducto.valido = false;
                     $scope.rootEditarProducto.validacionproducto.mensaje = "El lote codigo: "+lote.codigo_lote+ ", esta seleccionado y no tiene caja asignada.";
                     return;

                 }

             }

             if($scope.rootEditarProducto.producto.obtenerCantidadSeleccionada() > 0){
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
                 
                // console.log("$scope.rootEditarProducto.producto.lote.justificacion_auditor ", $scope.rootEditarProducto.producto.lote.justificacion_auditor, " pendiente ",$scope.rootEditarProducto.producto.lote.cantidad_pendiente, " cantidad ingresada ", $scope.rootEditarProducto.producto.lote.cantidad_ingresada);

                 if($scope.rootEditarProducto.producto.lote.justificacion_auditor.length > 0 && $scope.rootEditarProducto.producto.lote.cantidad_pendiente > 0 ){
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

                 console.log("justificacion de auditor >>>>>>>>>>>>>", $scope.rootEditarProducto.producto.lote.justificacion_auditor, " pendiente ", cantidad_pendiente);
                 if($scope.rootEditarProducto.producto.lote.justificacion_auditor.length > 0 && cantidad_pendiente> 0 ){
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
             console.log("esJustificacionNecesaria >>>>>>>>>>>>>>>>  pendiente", $scope.rootEditarProducto.producto.cantidad_pendiente);
             if($scope.rootEditarProducto.producto === undefined) return;

             if($scope.rootEditarProducto.producto.cantidad_pendiente > 0){
                 return true;
             }

             return false;
         };

         $scope.onValidarCaja = function(){

         };

         $scope.onSeleccionarCaja = function(){
             $scope.cerrar = false;
             if($scope.lotes_producto.selectedItems.length === 0){
                 $scope.rootEditarProducto.validacionproducto.valido = false;
                 $scope.rootEditarProducto.caja.setValida(false);
                 $scope.rootEditarProducto.validacionproducto.mensaje = "No se han seleccionado lotes para la caja";
                 return;
             }

             if(isNaN($scope.rootEditarProducto.caja.getNumero()) || $scope.rootEditarProducto.caja.getNumero() === 0 ||
                      isNaN($scope.rootEditarProducto.caja.getTipo())){

                 $scope.rootEditarProducto.validacionproducto.valido = false;
                 $scope.rootEditarProducto.caja.setValida(false);
                 $scope.rootEditarProducto.validacionproducto.mensaje = "El número o el tipo no son validos";

                 return;
             }

             var cliente = (!$scope.rootEditarProducto.pedido.cliente)?$scope.rootEditarProducto.pedido.farmacia:$scope.rootEditarProducto.pedido.cliente;

             var url = API.DOCUMENTOS_TEMPORALES.VALIDAR_CAJA;
             var obj = {
                 session:$scope.session,
                 data:{
                     documento_temporal: {
                         documento_temporal_id: $scope.rootEditarProducto.documento.documento_temporal_id,
                         numero_caja: $scope.rootEditarProducto.caja.getNumero(),
                         numero_pedido: $scope.rootEditarProducto.pedido.numero_pedido,
                         direccion_cliente: cliente.direccion || cliente.nombre_farmacia,
                         nombre_cliente:cliente.nombre_tercero || cliente.nombre_farmacia,
                         tipo:$scope.rootEditarProducto.caja.getTipo()
                     }
                 }
             };

             //valida la caja
             Request.realizarRequest(url, "POST", obj, function(data) {

                 if(data.status === 200){
                     var obj = data.obj.movimientos_bodegas;
                     //$scope.rootEditarProducto.caja.valida = obj.caja_valida;
                     if(!obj.caja_valida){
                         $scope.rootEditarProducto.validacionproducto.valido = false;
                         $scope.rootEditarProducto.validacionproducto.mensaje = "La caja se encuentra cerrada";
                         $scope.rootEditarProducto.caja.setValida(false);
                     } else {
                         $scope.rootEditarProducto.validacionproducto.valido = true;


                         var items = [];


                         for(var i in $scope.lotes_producto.selectedItems){
                             items.push($scope.lotes_producto.selectedItems[i].item_id);
                         }

                         var obj = {
                               session:$scope.session,
                               data:{
                                   documento_temporal: {
                                       temporales: items,
                                       numero_caja: $scope.rootEditarProducto.caja.getNumero(),
                                       tipo:$scope.rootEditarProducto.caja.getTipo()
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
                                                   lotes[ii].numero_caja = $scope.rootEditarProducto.caja.getNumero();
                                                   lotes[ii].setTipoCaja($scope.rootEditarProducto.caja.getTipo());
                                                   break;
                                               }
                                           }
                                      }

                                      //desseleccionar los lotes que tiene caja
                                      for(var i in $scope.rootEditarProducto.producto.lotesSeleccionados){
                                          $scope.lotes_producto.selectRow(i, false);
                                      }


                                      $scope.rootEditarProducto.caja.setValida(true);

                               } else {
                                     $scope.rootEditarProducto.validacionproducto.valido = false;
                                     $scope.rootEditarProducto.validacionproducto.mensaje = "Ha ocurrido un error generanado la caja";
                               }
                           });
                     } 

                 } else {
                     $scope.rootEditarProducto.validacionproducto.valido = false;
                     $scope.rootEditarProducto.validacionproducto.mensaje = data.msj;
                 }
             });




         };

         $scope.onCerrarCaja = function(){
             var caja = $scope.rootEditarProducto.caja;
              $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
              //  size: 'sm',
                keyboard: true,
                template: ' <div class="modal-header">\
                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                <h4 class="modal-title">Desea cerrar la <span ng-if="caja.tipo == 0">caja</span><span ng-if="caja.tipo == 1">nevera</span>?</h4>\
                            </div>\
                            <div class="modal-body">\
                                <h4>Una vez cerrada no se podra abrir nuevamente.</h4>\
                                <h4>Numero: {{ caja.getNumero() }}</h4>\
                            </div>\
                            <div class="modal-footer">\
                                <button class="btn btn-primary" ng-click="close()">No</button>\
                                <button class="btn btn-warning" ng-click="confirmar()" ng-disabled="" >Si</button>\
                            </div>',
                scope: $scope,
                controller: function($scope, $modalInstance, caja) {
            
                    $scope.caja = caja;
                    $scope.confirmar = function() {
                        that.cerrarCaja();
                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
                    };

                },
                resolve: {
                    caja: function() {
                        return caja;
                    }
                }
            };
            var modalInstance = $modal.open($scope.opts);
           
         };
         
         that.cerrarCaja = function(){
             var url = API.DOCUMENTOS_TEMPORALES.GENERAR_ROTULO;
             var obj = {
                 session:$scope.session,
                 data:{
                     documento_temporal: {
                         documento_temporal_id: $scope.rootEditarProducto.documento.documento_temporal_id,
                         numero_caja: $scope.rootEditarProducto.caja.getNumero(),
                         tipo:$scope.rootEditarProducto.caja.getTipo()
                     }
                 }
             };

             Request.realizarRequest(url, "POST", obj, function(data) {
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
                                                    $scope.rootEditarProducto.caja.getNumero(),
                                                    $scope.rootEditarProducto.caja.getTipo()
                              );

         };

         $scope.cerrarModal = function(){
             $modalInstance.close();
         };

    }]);

});


