define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('AutorizarOrdenesComprasController', [
        '$scope', 'Request',
        '$modalInstance',
        'API', "AlertService",
        "Usuario", "modeloAutorizacion", "banderaAutorizacion",
        function($scope, Request,
                $modalInstance,
                API, AlertService,
                Usuario,
                modeloAutorizacion, banderaAutorizacion) {
            $scope.root = {};
            $scope.root.rootAutorizacionOrdenCompra = modeloAutorizacion;
            $scope.root.rootAutorizacionOrdenComprabandera = banderaAutorizacion;
            $scope.root.nombreUsuario = Usuario.getUsuarioActual().nombre;
            $scope.root.observacion = "";

            var that = this;

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /*
             * Método que valida quien autorizado la orden de compra
             * @param modeloAutorizacionOrdenCompra donde se encuntra el modelo del modulo
             * @param banderaautorizacionOrdenCompra si es 0 es el primer autorizador 1 es el segundo autorizador
             * @return modifica la autorizacion
             */
            $scope.autorizarOrdenCompra = function(modeloAutorizacionOrdenCompra, banderaautorizacionOrdenCompra) {
                var observacion = "";
                var autorizador1 = "";
                var autorizador2 = "";
                var swAutorizado = "";
                var swNoAutoriza = null;
                var modificar=false;
                if ($scope.root.observacion.trim().length < 7) {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe Digitar una Observación con Minimo 7 Caracteres");
                    return false;
                }
                if (modeloAutorizacionOrdenCompra.getUsuarioIdAutorizador() === null)
                {
                    autorizador1 = Usuario.getUsuarioActual().id;
                    autorizador2 = null;
                    if (banderaautorizacionOrdenCompra === 0)
                    {                       
                        swNoAutoriza = '0';
                        observacion = "EL Autorizador 1 NO Aprueba: " + $scope.root.observacion;
                    } else {
                        swAutorizado = '0';
                        observacion = "EL Autorizador 1 Aprueba: " + $scope.root.observacion;
                    }
                } else {
                    autorizador1 = modeloAutorizacionOrdenCompra.getUsuarioIdAutorizador();
                    autorizador2 = Usuario.getUsuarioActual().id;
                    
                    if (banderaautorizacionOrdenCompra === 0)
                    {                        
                        swNoAutoriza = '1';
                        swAutorizado = '2';
                        if (modeloAutorizacionOrdenCompra.getSwNoAutorizado() === '0') {
                           swNoAutoriza = '2';                           
                        }
                        observacion = modeloAutorizacionOrdenCompra.getJustificacion() + "\n EL Autorizador 2 NO Aprueba: " + $scope.root.observacion;
                    } else {
                        swAutorizado = '1';
                        observacion = modeloAutorizacionOrdenCompra.getJustificacion() + "\n EL Autorizador 2 Aprueba: " + $scope.root.observacion;
                        that.ingresarBodegaMovimientoTmpOrden(modeloAutorizacionOrdenCompra, autorizador2,function(resultado){                     
                       
                         });
                    }  
                }
                 that.modificarAutorizacionesComprasOrdenes(modeloAutorizacionOrdenCompra, autorizador1, swAutorizado, observacion, autorizador2, swNoAutoriza,function(){
                    $scope.cerrarModal(); 
                    });
                return true;
            };


            /*
             * @Author: AMGT
             * @param {object} obj
             * @param {function} callback
             * +Descripcion: Metodo encargado de realizar la peticion al servidor para el insert
             */
            that.insertarBodegaMovimientoTmp = function(obj, callback) {//BodegaMovimientoTmp

                var url = API.ORDENES_COMPRA.INSERTAR_BODEGA_MOVIMIENTO_TMP;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    callback(data);
                });
            };

            /*
             * Método para el envio al servidor de los datos que insertan en la tabla inv_bodegas_movimiento_tmp_d
             * @param modeloAutorizacionOrdenCompra donde se encuntra el modelo del modulo
             * @param autorizador2 
             * @return inserta en inv_bodegas_movimiento_tmp_d
             */
            that.ingresarBodegaMovimientoTmpOrden = function(modeloAutorizacionOrdenCompra, autorizador2,callback)
            {
                var usuarioId = autorizador2;
                var docTmpId = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.getDocTmpId();
                var empresa = modeloAutorizacionOrdenCompra.getEmpresa();
                var centroUtilidad = modeloAutorizacionOrdenCompra.getCentroUtilidad();
                var bodega = modeloAutorizacionOrdenCompra.getBodega();
                var codigoProducto = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.getCodigoProducto();
                var cantidad = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.get_cantidad_recibida();
                var porcentajeGravamen = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.getPorcentajeGravamen();
                var totalCosto = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.getTotalCosto();
                var fechaVencimiento = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.lote.getFechaVencimiento();
                var codigoLote = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.lote.getCodigo();
                var localProd = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.getLocalProd();
                var numeroOrdenCompra = modeloAutorizacionOrdenCompra.ordenSeleccionada.get_numero_orden();
                var itemIdCompras = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.getItemId();

                var obj = {
                    session: $scope.session,
                    data: {
                        autorizacion: {
//                            usuarioId: usuarioId,
			    usuarioId : modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.usuarioIngreso,     
                            docTmpId: docTmpId,
                            empresa: empresa,
                            bodega: bodega,
                            centroUtilidad: centroUtilidad,
                            codProucto: codigoProducto,
                            cantidad: cantidad,
                            porcentajeGravamen: porcentajeGravamen,
                            totalCosto: totalCosto,
                            fechaVencimiento: fechaVencimiento,
                            lote: codigoLote,
                            localProd: localProd,
                            orden: numeroOrdenCompra,
                            itemIdCompras:itemIdCompras,
                            valorUnitario:0,
                            totalCostoPed:0
                        }
                    }
                };

                that.insertarBodegaMovimientoTmp(obj, function(data) {
                    if (data.status === 200) {
                        callback(true);
                    }
                    if (data.status !== 200) {
                        AlertService.mostrarVentanaAlerta("Ha Ocurrido un Error", data.msj);
                        callback(false);
                    }
                });
            };


            /*
             * @Author: AMGT
             * @param {object} obj
             * @param {function} callback
             * +Descripcion: Metodo encargado de realizar la peticion al servidor para el update 
             */
            that.modificarAutorizacionCompras = function(obj, callback) {

                var url = API.ORDENES_COMPRA.MODIFICAR_AUTORIZACION_COMPRAS;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    callback(data);
                });
            };


            /*
             * Método para el envio al servidor de los datos que modifican los datos de autorizacion de ordenes de compras
             * @param modeloAutorizacionOrdenCompra donde se encuntra el modelo del modulo
             * @param autorizador1 autorizador de la orden de compras
             * @param swAutorizado 0- primer autorizador 1- segundo autorizador   
             * @param observacion de la autorizacion
             * @param autorizador2 autorizador de la orden de compras
             * @param swNoAutorizado del autorizador1 0- no autoriza primer autorizador 1- no autoriza segundo autorizador 2- no autoriza los autorizadores 
             * @return inserta en inv_bodegas_movimiento_tmp_d
             */
            that.modificarAutorizacionesComprasOrdenes = function(modeloAutorizacionOrdenCompra, autorizador1, swAutorizado, observacion, autorizador2, swNoAutoriza,callback)
            {
                var empresa = modeloAutorizacionOrdenCompra.getEmpresa();
                var bodega = modeloAutorizacionOrdenCompra.getBodega();
                var centroUtilidad = modeloAutorizacionOrdenCompra.getCentroUtilidad();
                var codigoProducto = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.getCodigoProducto();
                var numeroOrdenCompra = modeloAutorizacionOrdenCompra.ordenSeleccionada.get_numero_orden();
                var codigoLote = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.lote.getCodigo();

                var obj = {
                    session: $scope.session,
                    data: {
                        autorizacion: {
                            empresa: empresa,
                            bodega: bodega,
                            centroUtilidad: centroUtilidad,
                            codProucto: codigoProducto,
                            orden: numeroOrdenCompra,
                            lote: codigoLote,
                            usuarioAutorizador: autorizador1,
                            usuarioAutorizador2: autorizador2,
                            swAutorizado: swAutorizado,
                            swNoAutoriza: swNoAutoriza,
                            observacion: observacion
                        }
                    }
                };

                that.modificarAutorizacionCompras(obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarVentanaAlerta("Mensaje del Sistema", data.msj);
                        callback(true);
                    }
                    callback(false);
                });
            };
            /*
             * @Author: AMGT
             * +Descripcion: funcion encargada de cerrar la ventana modal
             */
            $scope.cerrarModal = function() {
                $modalInstance.close();
            };
            
             $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                $scope.root = {};
            });
        }]);
});