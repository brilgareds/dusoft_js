define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('AutorizarOrdenesComprasController', [
        '$scope', '$rootScope', 'Request',
        '$modalInstance',
        'API', "socket", "AlertService",
        "Usuario", "$modal", "modeloAutorizacion", "banderaAutorizacion",
        function($scope, $rootScope, Request,
                $modalInstance,
                API, socket, AlertService,
                Usuario, $modal,
                modeloAutorizacion, banderaAutorizacion) {

            $scope.rootAutorizacionOrdenCompra = modeloAutorizacion;
            $scope.rootAutorizacionOrdenComprabandera = banderaAutorizacion;
            $scope.nombreUsuario = Usuario.getUsuarioActual().nombre;
            $scope.observacion = "";

            var that = this;

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };


            $scope.autorizarOrdenCompra = function(modeloAutorizacionOrdenCompra, banderaautorizacionOrdenCompra) {
                var observacion = "";                
                var autorizador1 = "";
                var autorizador2 = "";
                var swAutorizado = "";
                var swNoAutoriza = "";
      
                if ($scope.observacion.trim().length >= 7) {
                    $scope.cerrarModal();
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe Digitar una Observación con Minimo 7 Caracteres");
                    return false;
                }
                if (modeloAutorizacionOrdenCompra.usuarioIdAutorizador === null)
                {
                    autorizador1 = Usuario.getUsuarioActual().id;
                    autorizador2 = null;
                    if (banderaautorizacionOrdenCompra == "0")
                    {
                        swNoAutoriza = '0';
                        observacion = "EL Autorizador 1 No Aprueba: " + $scope.observacion;
                    } else {
                        observacion = "EL Autorizador 1 Aprueba: " + $scope.observacion;
                    }
                    swAutorizado = '0';

                } else {
                    autorizador1 = modeloAutorizacionOrdenCompra.usuarioIdAutorizador;
                    autorizador2 = Usuario.getUsuarioActual().id;
                    swAutorizado = '1';
                    if (banderaautorizacionOrdenCompra == "0")
                    {
                        swNoAutoriza = '1';
                        if(modeloAutorizacionOrdenCompra.swNoAutorizado == '0'){
                         swNoAutoriza = '2';   
                        }
                        observacion = modeloAutorizacionOrdenCompra.justificacion + "\n EL Autorizador 2 No Aprueba: " + $scope.observacion;
                    } else {
                        observacion = modeloAutorizacionOrdenCompra.justificacion + "\n EL Autorizador 2 Aprueba: " + $scope.observacion;
                    }
                                    
                    that.ingresarBodegaMovimientoTmpOrden(modeloAutorizacionOrdenCompra,autorizador2);
                }
                that.modificarAutorizacionesComprasOrdenes(modeloAutorizacionOrdenCompra, autorizador1, swAutorizado, observacion, autorizador2, swNoAutoriza);
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
            
           that.ingresarBodegaMovimientoTmpOrden = function(modeloAutorizacionOrdenCompra,autorizador2)
            {
                var usuarioId=autorizador2;
                var docTmpId = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.docTmpId;
                var empresa = modeloAutorizacionOrdenCompra.empresa;
                var centroUtilidad = modeloAutorizacionOrdenCompra.centroUtilidad;
                var bodega = modeloAutorizacionOrdenCompra.bodega;                
                var codigoProducto = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.codigo_producto;
                var cantidad=modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.cantidad_recibida;
                var porcentajeGravamen=modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.porcentajeGravamen;
                var totalCosto=modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.totalCosto;
                var fechaVencimiento=modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.lote.fecha_vencimiento;
                var codigoLote = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.lote.codigo_lote;
                var localProd = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.localProd;
                var numeroOrdenCompra = modeloAutorizacionOrdenCompra.ordenSeleccionada.numero_orden_compra;
                                
                var obj = {
                    session: $scope.session,
                    data: {
                        autorizacion: {
                            usuarioId: usuarioId,
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
                            orden: numeroOrdenCompra
                        }
                    }
                };

                that.insertarBodegaMovimientoTmp(obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
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



            that.modificarAutorizacionesComprasOrdenes = function(modeloAutorizacionOrdenCompra, autorizador1, swAutorizado, observacion, autorizador2, swNoAutoriza)
            {
                var empresa = modeloAutorizacionOrdenCompra.empresa;
                var bodega = modeloAutorizacionOrdenCompra.bodega;
                var centroUtilidad = modeloAutorizacionOrdenCompra.centroUtilidad;
                var codigoProducto = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.codigo_producto;
                var numeroOrdenCompra = modeloAutorizacionOrdenCompra.ordenSeleccionada.numero_orden_compra;
                var codigoLote = modeloAutorizacionOrdenCompra.ordenSeleccionada.productoSeleccionado.lote.codigo_lote;
                
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
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            /*
             * @Author: AMGT
             * +Descripcion: funcion encargada de cerrar la ventana modal
             */
            $scope.cerrarModal = function() {
                $modalInstance.close();
            };

        }]);

});

