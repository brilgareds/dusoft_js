//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionDetalleController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService",
        "$state", "SeparacionService", "Usuario", "DocumentoDespacho",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal,
                localStorageService, $state, SeparacionService,
                Usuario, DocumentoDespacho) {


            var self = this;

            self.init = function(callback) {
                $scope.rootDetalle = {};
                $scope.rootDetalle.pedido = $scope.rootSeparacion.documento.getPedido();
                $scope.rootDetalle.nombreCliente;

                $scope.rootDetalle.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                if ($scope.rootDetalle.pedido.getTipo() === '1') {
                    $scope.rootDetalle.nombreCliente = $scope.rootDetalle.pedido.getCliente().getNombre();
                } else {

                    $scope.rootDetalle.nombreCliente = $scope.rootDetalle.pedido.getFarmacia().get_nombre_farmacia()
                            + " -- " + $scope.rootDetalle.pedido.getFarmacia().getNombreBodega();
                }


                callback();
            };

            
             /**
             * +Descripcion: Metodo para confirmar la eliminacion de
             * un producto de la lista de separacion, si acepta se ejecutara un
             * metodo mas encargado de invocar el servicio para eliminacion,
             * si presiona el boton cancelar, se cancelara el proceso
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            $scope.onEliminarLote = function(producto) {

                self.confirm("Eliminar producto", "Desea eliminar el producto", function(confirmar) {
                    if (confirmar) {
                        self.eliminarLote(producto);
                    }
                });
            };

            /**
             * +Descripcion: Grilla en comun para pedidos asignados 
             * clientes y pedidos temporales clientes
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            $scope.detalleSeparacionProducto = {
                data: 'rootDetalle.pedido.productos',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Producto', width: "600",
                        cellTemplate: '<div class="ngCellText">\
                                        {{row.entity.codigo_producto}} - {{row.entity.descripcion}}\
                                   </div>'
                    },
                    {field: 'lotesSeleccionados[0].codigo_lote', displayName: 'Lote'},
                    {field: 'lotesSeleccionados[0].fecha_vencimiento', displayName: 'F Vencimiento'},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                    {field: 'lotesSeleccionados[0].cantidad_ingresada', displayName: 'Ingresado'},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente'},
                    {displayName: "", cellClass: "txt-center dropdown-button", width: "50",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarLote(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            /**
             * +Descripcion: Metodo encargado de cerrar la ventana slider del 
             * detalle de separacion de productos
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            $scope.cerrarDetallePedidos = function(finalizar) {

                $scope.$emit('closeDetallePedidos', {animado: true, finalizar: finalizar});
            };


            /*
             * +descripcion: confirmar la eliminacion de todos los productos de 
             * la lista de detalle de separacion, si acepta, se ejecutara un 
             * metodo mas que invocara el servicio para la eliminacion,
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onEliminarTemporal = function() {
                self.confirm("Eliminar toda la separacion", "Desea eliminar la separacion", function(confirmar) {
                    if (confirmar) {
                        self.eliminarTemporal();
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
            $scope.onGenerarDocumento = function() {
                var productos = self.validarProductos();
                if (productos.length > 0) {
                    self.mostrarProductosSinCajaJustificacion(productos);
                    return;
                }

                self.confirm("Generar separacion", "Desea generar la separacion de los productos", function(confirmar) {
                    if (confirmar) {
                        self.generarDocumento(function(continuar) {
                            if (continuar) {

                                $scope.cerrarDetallePedidos(true);
                                $state.go("SeparacionPedidos");
                                AlertService.mostrarMensaje("success", "Separacion finalizada");
                            } else {
                                AlertService.mostrarVentanaAlerta("Error", "Se genero un error");
                            }
                        });
                    }
                });
            };

            /**
             * +Descripcion: Componente grid que se visualizara en el popup
             *  Generar y auditar, para seleccionar el tipo de documento
             *  que se pretende realizar
             *  @author Cristian Ardila
             *  @fecha 23/09/2015
             */
            $scope.listarDocumentoDespacho = {
                data: 'documentos',
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        self.onSeleccionDocumento(rowItem.entity);
                    }
                },
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected: false,
                multiSelect: false,
                columnDefs: [
                    {field: 'get_prefijo()', displayName: 'Codigo'},
                    {field: 'get_descripcion()', displayName: 'Descripcion'}
                ]
            };
           
            /**
             * +Descripcion: Metodo para prototipo de confirm y ser reutilizado
             * en la clase
             * 
             */
            self.confirm = function(titulo, mensaje, callback) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">' + titulo + '</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4 ><b>' + mensaje + '?</h4>\
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
            self.generarDocumento = function(callback) {
                var url = API.SEPARACION_PEDIDOS.CLIENTES.FINALIZAR_DOCUMENTO_CLIENTES;
                var pedido = $scope.rootDetalle.pedido;

                if (pedido.getTipo() === '2') {
                    url = API.SEPARACION_PEDIDOS.FARMACIAS.FINALIZAR_DOCUMENTO_FARMACIAS;
                }

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            /**
             * 
             * @param {type} producto
             * @returns {undefined}
             * +Descripcion: Metodo para eliminar productos uno por uno
             * de la lista de separacion detalle
             * +@author Cristian Ardila
             */
            self.eliminarLote = function(producto) {
                var url = API.SEPARACION_PEDIDOS.ELIMINAR_ITEM_TEMPORAL;
                var pedido = $scope.rootDetalle.pedido;

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            item_id: producto.getItemId(),
                            codigo_producto: producto.getCodigoProducto(),
                            documento_temporal_id: pedido.getTemporalId()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var index = pedido.getProductos().indexOf(producto);
                        pedido.getProductos().splice(index, 1);
                        AlertService.mostrarMensaje("success", "Lote eliminado correctamente");
                    } else {
                        AlertService.mostrarVentanaAlerta("Error", "Se ha generado un error");
                    }
                });
            };

            /**
             * +Descripcion: Metodo encargado de eliminar todos los productos
             * de la lista del detalle de separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.eliminarTemporal = function() {
                var url = API.SEPARACION_PEDIDOS.CLIENTES.ELIMINAR_DOCUMENTO_TEMPORAL_CLIENTES;
                var pedido = $scope.rootDetalle.pedido;

                if (pedido.getTipo() === '2') {
                    url = API.SEPARACION_PEDIDOS.FARMACIAS.ELIMINAR_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.cerrarDetallePedidos(true);
                        $scope.$emit("onFinalizar");
                        AlertService.mostrarMensaje("success", "Documento eliminado");
                    } else {
                        AlertService.mostrarVentanaAlerta("Error", "Se ha generado un error");
                    }
                });
            };

            
            /**
             * +Descripcion: Metodo encargado de generar y auditar la separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.generarAuditar = function() {
                $scope.opts = {
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: 'views/separacionpedidos/separacionSeleccionDocumentoDespacho.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.cerrarGenerarAuditar = function() {
                            $modalInstance.close();

                        };
                    }
                };
                self.ventanaAuditoria = $modal.open($scope.opts);
            };

             /**
             * +Descripcion: Metodo encargado de consultar los tipos de documento
             * despacho
             * @author:Cristian Ardila
             * @fecha: 22/09/2015
             * @param {function} callback
             * @returns {void}
             */
            self.traerListadoDocumentosDespacho = function(callback) {

                var empresa = Usuario.getUsuarioActual().getEmpresa();
                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_documento: 'E008'
                        }
                    }
                };

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {
                    if (data.status === 200) {


                        callback(data);
                        self.renderDocumentosDespachos(data);
                    }
                });
            };
             /**
             * +Descripcion: Metodo encargado de mapear contra el modelo
             * DocumentoDespacho la respuesta del servicio que consulta la lista
             * de documentos almacenando cada objeto creado en un arreglo
             * @author Cristian Ardila
             * @fecha  23/09/2015
             * @param {type} data
             * @returns {void}
             */
            self.renderDocumentosDespachos = function(data) {


                $scope.documentos = [];
                for (var i in data.obj.movimientos_bodegas) {
                    var _documentos = data.obj.movimientos_bodegas[i];

                    var documentos = DocumentoDespacho.get(_documentos.bodegas_doc_id, _documentos.prefijo, '', '');
                    documentos.set_descripcion(_documentos.descripcion);
                    documentos.set_tipo(_documentos.tipo_doc_bodega_id);
                    documentos.set_tipo_clase_documento(_documentos.tipo_clase_documento);
                    $scope.documentos.push(documentos);
                }


            };

            /**
             * +Descripcion: Metodo que se activa con el evento 
             * (afterSelectionChange)del componente GridView al instante
             * que se selecciona un documento, procediendo a generar el documento
             * y despues auditando los lotes.
             * @author Cristian Ardila
             * @fecha  23/09/2015
             * @param {string} entity
             * @returns {void}
             */
            self.onSeleccionDocumento = function(entity) {

                var pedido = $scope.rootDetalle.pedido;

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: pedido.getTemporalId(),
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            bodegas_doc_id: entity.get_bodegas_doc_id(),
                            numero_pedido: pedido.get_numero_pedido(),
                            auditor: Usuario.getUsuarioActual().getId()
                        }
                    }
                };

                self.renderDocumentoTemporalClienteFarmacia(obj, pedido.getTipo(), function(continuar) {
                    if (!continuar) {
                        AlertService.mostrarVentanaAlerta("Error", "Se ha generado un error");
                    }

                    var productos = angular.copy($scope.rootDetalle.pedido.getProductos());
                    
                   
                    
                    self.generarDocumento(function(continuar) {

                        if (continuar) {
                            self.auditarLotes(productos, 0, function(continuar, msj) {
                                AlertService.mostrarMensaje("success", msj);
                                if (continuar) {
                                    self.ventanaAuditoria.close();
                                    $scope.cerrarDetallePedidos(true);
                                    
                                    if(pedido.getTipo() === '1'){
                                        localStorageService.set("auditoriaCliente", pedido.get_numero_pedido());
                                    } else {
                                        localStorageService.set("auditoriaFarmacia", pedido.get_numero_pedido());
                                    }
                                    
                                    $state.go("AuditarPedidos");
                                }
                            });
                        } else {
                            AlertService.mostrarVentanaAlerta("Error", "Se ha generado un error");
                        }
                    })
                });
            };


            /**
             * +Descripcion: Funcion que obtiene la cantidad ingresada de un producto
             * sumando todos los lotes a disposicion
             * @author Cristian Ardila
             * @fecha  24/09/2015
             * @param {type} productoLotes
             * @returns {Number}
             */
           self.obtenerCantidadIngresada = function(productoLotes){
                
                var productos = $scope.rootDetalle.pedido.getProductos();           
                    var cantidadIngresada = 0;
                    for(var i in productos){
                        var _producto = productos[i];
                      
                        if(_producto.getCodigoProducto() === productoLotes.getCodigoProducto()){
                            cantidadIngresada += _producto.lotesSeleccionados[0].cantidad_ingresada;
                        }
                    }                                 
                    return cantidadIngresada;
           };                     
              
                
            
            /*
             * +Descripcion: Funcion encargada de auditar los lotes en grupo
             * @author Edu Gracia
             * @Fecha  23/09/2015
             * @param {type} productos
             * @param {type} index
             * @param {type} callback
             * @returns {unresolved}
             */
            self.auditarLotes = function(productos, index, callback) {

                var producto = productos[index];
                
                if (!producto) {
                    callback(true, "Productos auditados");
                    return;
                }

                var cantidadIngresada = self.obtenerCantidadIngresada(producto);

                var lote = producto.getLotesSeleccionados()[0];

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            item_id: producto.getItemId(),
                            auditado: true,
                            numero_caja: lote.getNumeroCaja()
                        }
                    }
                };


                if (cantidadIngresada < producto.getCantidadSolicitada()) {

                    obj.data.documento_temporal.justificacion = {
                        documento_temporal_id: $scope.rootDetalle.pedido.getTemporalId(),
                        codigo_producto: producto.getCodigoProducto(),
                        cantidad_pendiente: producto.getCantidadSolicitada() - cantidadIngresada,
                        justificacion_auditor: producto.getJustificacion(),
                        existencia: lote.existencia_actual,
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        justificacion: producto.getJustificacion()
                    };
                }

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.AUDITAR_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {
                    index++;
                    self.auditarLotes(productos, index, callback);
                });
            };

            /**
             * +Descripcion: Metodo encargado de acutalizar el tipo de documento
             * temporal, dependiendo del tipo que se le envie, 
             * si es 1 actualiza clientes
             * si es 2 acutaliza farmacias.
             * @param {type} obj
             * @param {string} tipo
             * @param {function} callback
             * @returns {void}
             */
            self.renderDocumentoTemporalClienteFarmacia = function(obj, tipo, callback) {

                var url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_CLIENTES;
                if (tipo === '2') {
                    url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", data.msj);
                        callback(true);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                });
            };
            
            
            /*
             * +descripcion: confirmar que se genera y audita la separacion
             * si acepta se desplegara una ventana modal con la lista de tipos
             * de documentos 
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onGenerarAuditar = function() {
                var productos = self.validarProductos();

                if (productos.length > 0) {
                    self.mostrarProductosSinCajaJustificacion(productos);
                    return;
                }

                self.confirm("Generar y auditar", "Desea generar y auditar la separacion de los productos", function(confirmar) {
                    if (confirmar) {
                        var productos = $scope.rootDetalle.pedido.getProductos();
                        var productosInvalidos = [];
                        
                        for (var i in productos) {

                            var numCaja = productos[i].getLotesSeleccionados()[0].getNumeroCaja();

                            if (numCaja === null || numCaja === 0 || numCaja === undefined) {

                                
                                productosInvalidos.push(productos[i]);

                            }
                        }
                        if (productosInvalidos.length === 0) {

                            self.generarAuditar();

                        } else {
                            self.mostrarProductosSinCajaJustificacion(productosInvalidos);
                        }
                    }
                });
            };
            
            self.mostrarProductosSinCajaJustificacion = function(productosInvalidos){
                $scope.productos = productosInvalidos; 
                $scope.opts = {
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                     template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="cerrarGenerarAuditar();">&times;</button>\
                                    <h4 class="modal-title">Productos sin caja asignada o sin justificación.</h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                            <div class="list-group">\
                                                <div ng-repeat="producto in productos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                    {{ producto.getCodigoProducto()}} - {{producto.getDescripcion()}}\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="cerrarGenerarAuditar();" ng-disabled="" >Aceptar</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.cerrarGenerarAuditar = function() {
                            $modalInstance.close();

                        };
                    }
                };
                self.ventanaAuditoria = $modal.open($scope.opts);                
            };
            
          
            /**
             * +Descripcion: Funcion encargada de validar los productos pendientes
             * Y si tienen justificacion
             * @author Cristian Ardila
             * @fecha  23/09/2015
             * @returns {Boolean}
             */
            self.validarProductos = function() {
                var productos = $scope.rootDetalle.pedido.getProductos();
                var _productosInvalidos = [];
                
                for(var i in  productos){
                    var justificacion = productos[i].getJustificacion(); 
                    var producto = productos[i];
                    var cantidadIngresada = 0;
                    
                    for(var ii in productos){
                        var _producto = productos[ii];
                        if(_producto.getCodigoProducto() === producto.getCodigoProducto() ){
                            cantidadIngresada += _producto.lotesSeleccionados[0].cantidad_ingresada;
                        }
                    }
                   
                    if(justificacion === null || justificacion === undefined || justificacion.length === 0 &&
                      cantidadIngresada < producto.getCantidadSolicitada()){
                        _productosInvalidos.push(producto);
                    }                                       
                }                           
                return _productosInvalidos;
            };
            
           
            /**
             * +Descripcion: Metodo principal, el cual al iniciar la aplicacion
             * ejecuta la funcion encargada de consultar los tipos de documento
             * @author Cristian Ardila
             * @fecha  23/09/2015
             */
            self.init(function() {

                self.traerListadoDocumentosDespacho(function() {


                });

            });

        }]);
});
