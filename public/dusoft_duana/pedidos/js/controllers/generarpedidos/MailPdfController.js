
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('MailPdfController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$modalInstance", "Empresa", "AlertService", "Usuario", 'STATIC', 'tipo_documento',
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, $modalInstance, Empresa, AlertService, Usuario, STATIC, tipo_documento) {
            
            var that = this;

//            $scope.rootMailPdf.titulo_modulo= "Administracion de Operarios de Bodega";
//            $scope.operario = angular.copy(operario);
//            $scope.operario.activo = Boolean(Number(operario.estado));
//            $scope.usuarios = [];
//            $scope.usuario = {};
//            $scope.alert = false;
//            $scope.msg = "";

            $scope.rootMailPdf = {};
            
            $scope.rootMailPdf.session = {
                         usuario_id: Usuario.usuario_id,
                         auth_token: Usuario.token
                     };

//            console.log(">>>> SESSION: ", Session);
//
//            $scope.rootMailPdf.session = Session;
            
            $scope.rootMailPdf.Empresa = Empresa;
            $scope.rootMailPdf.tipo_documento = tipo_documento;
            
            $scope.rootMailPdf.icono_mail = STATIC.BASE_IMG + "/mail-icon1.png";
            $scope.rootMailPdf.icono_pdf = STATIC.BASE_IMG + "/pdf-icon.png";
            
            $scope.rootMailPdf.titulo = "Envío de Email";
            
            $scope.rootMailPdf.destinatarios = '';
            $scope.rootMailPdf.asunto = '';
            $scope.rootMailPdf.contenido = '';
            
            $scope.rootMailPdf.label_btn = "Enviar";
            
            $scope.rootMailPdf.cerrar_modal_principal = false;
            
            $modalInstance.opened.then(function() {
                $timeout(function(){
                    
                    if($scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getEmail() !== undefined && $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getEmail() !== '') {
                        $scope.rootMailPdf.destinatarios = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getEmail();
                    }
                    
                    if($scope.rootMailPdf.tipo_documento === 'c') {
                        var numero_cotizacion = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                        $scope.rootMailPdf.asunto = "Cotización N° "+numero_cotizacion+" - DUANA y Cia Ltda.";;
                    }

                    if($scope.rootMailPdf.tipo_documento === 'p') {
                        var numero_pedido = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().get_numero_pedido();
                        $scope.rootMailPdf.asunto = "Pedido N° "+numero_pedido+" - DUANA y Cia Ltda.";;
                    }
                    
                }, 400);
                
           });

            that.validarEmail = function (dir_email) {
                
                //var mail_valido = false;
                var conteo_validos = 0;
                
                var emails_destino = dir_email.split(',');
                
                if(emails_destino !== undefined && emails_destino.length > 0) {
                    
                    emails_destino.forEach(function(mail){
                        
                        if(mail !== '') {
                            
                            var arroba_mail = mail.split('@');

                            if(arroba_mail !== undefined && arroba_mail.length > 1) {

                                 if(arroba_mail[0] !== '' && arroba_mail[1] !== '') {

                                     var punto_mail = arroba_mail[1].split('.');

                                    if(punto_mail !== undefined && punto_mail.length > 1) {

                                        if(punto_mail[0] !== '' && punto_mail[1] !== '') {
                                            //mail_valido = true;
                                            conteo_validos++;
                                        }
                                    }
                                 }
                            }                            
                        }
                    });    
                } 
                
                if(conteo_validos === emails_destino.length && emails_destino.length > 0) {
                    return true;
                }
                else {
                    return false;
                }
                
            };            

            that.generarPdfCotizacionCliente = function(callback){
                
                var codigo_empresa_origen = $scope.rootMailPdf.Empresa.getCodigo();
                var nombre_empresa_origen = $scope.rootMailPdf.Empresa.getNombre();
                
                var numero_cotizacion = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                
                var id_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getId();
                var nombre_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getNombre();
                var ciudad_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getMunicipio();
                var direccion_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getDireccion();

                var fecha_registro = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getFechaRegistro();
                var observacion = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getObservacion();
                
                var valor_total_sin_iva = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().valor_total_sin_iva;
                var valor_total_con_iva = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().valor_total_con_iva;
                
                //validar email
                var mail_valido = that.validarEmail($scope.rootMailPdf.destinatarios);

                if(mail_valido){
                    
                    var obj_pdf = {
                        session: $scope.rootMailPdf.session,
                        data: {
                            encabezado_pedido_cliente: {
                                numero_cotizacion: numero_cotizacion,        
                                codigo_origen_id: codigo_empresa_origen,
                                empresa_origen: nombre_empresa_origen,

                                id_cliente: id_cliente,
                                nombre_cliente: nombre_cliente,
                                ciudad_cliente: ciudad_cliente,
                                direccion_cliente: direccion_cliente,

                                fecha_registro: fecha_registro,
                                observacion: observacion,

                                valor_total_sin_iva: valor_total_sin_iva,
                                valor_total_con_iva: valor_total_con_iva,

                                email: true,

                                destinatarios: $scope.rootMailPdf.destinatarios,
                                asunto: $scope.rootMailPdf.asunto,
                                contenido: $scope.rootMailPdf.contenido
                            },
                            detalle_pedido_cliente: $scope.rootMailPdf.Empresa.getPedidoSeleccionado().obtenerProductos()
                        }
                    };

                    var url_imprimir_cotizacion_pdf = API.PEDIDOS.IMPRIMIR_COTIZACION_CLIENTE;

                    Request.realizarRequest(url_imprimir_cotizacion_pdf, "POST", obj_pdf, function(data) {

                        if (data.status === 200) {
                            console.log("Éxito: ", data.msj);
                            that.msgMailExitoso();
                            $scope.rootMailPdf.cerrar_modal_principal = true;
                            callback();
                        }
                        else{
                            console.log("Error: ", data.msj);
                            that.msgMailFallido();
                            $scope.rootMailPdf.cerrar_modal_principal = true;
                            callback();
                        }
                    });                    
                    
                }
                else {
                    that.msgMailInvalido();
                }

            };
            
            that.generarPdfPedidoCliente = function(callback){
                
                var codigo_empresa_origen = $scope.rootMailPdf.Empresa.getCodigo();
                var nombre_empresa_origen = $scope.rootMailPdf.Empresa.getNombre();
                
                var numero_pedido = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().get_numero_pedido();
                
                var id_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getId();
                var nombre_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getNombre();
                var ciudad_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getMunicipio();
                var direccion_cliente = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getCliente().getDireccion();

                var fecha_registro = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getFechaRegistro();
                var observacion = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().getObservacion();
                
                var valor_total_sin_iva = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().valor_total_sin_iva;
                var valor_total_con_iva = $scope.rootMailPdf.Empresa.getPedidoSeleccionado().valor_total_con_iva;
                
                //validar email
                var mail_valido = that.validarEmail($scope.rootMailPdf.destinatarios);

                if(mail_valido){
                    
                    var obj_pdf = {
                        session: $scope.rootMailPdf.session,
                        data: {
                            encabezado_pedido_cliente: {
                                numero_pedido: numero_pedido,        
                                codigo_origen_id: codigo_empresa_origen,
                                empresa_origen: nombre_empresa_origen,

                                id_cliente: id_cliente,
                                nombre_cliente: nombre_cliente,
                                ciudad_cliente: ciudad_cliente,
                                direccion_cliente: direccion_cliente,

                                fecha_registro: fecha_registro,
                                observacion: observacion,

                                valor_total_sin_iva: valor_total_sin_iva,
                                valor_total_con_iva: valor_total_con_iva,

                                email: true,

                                destinatarios: $scope.rootMailPdf.destinatarios,
                                asunto: $scope.rootMailPdf.asunto,
                                contenido: $scope.rootMailPdf.contenido
                            },
                            detalle_pedido_cliente: $scope.rootMailPdf.Empresa.getPedidoSeleccionado().obtenerProductos()
                        }
                    };

                    var url_imprimir_pedido_pdf = API.PEDIDOS.IMPRIMIR_PEDIDO_CLIENTE;

                    Request.realizarRequest(url_imprimir_pedido_pdf, "POST", obj_pdf, function(data) {

                        if (data.status === 200) {
                            
                            console.log("Éxito: ", data.msj);
                            that.msgMailExitoso();
                            $scope.rootMailPdf.cerrar_modal_principal = true;
                            callback();
                        }
                        else{
                            console.log("Error: ", data.msj);
                            that.msgMailFallido();
                            $scope.rootMailPdf.cerrar_modal_principal = true;
                            callback();
                        }
                    });                    
                    
                }
                else {
                    
                    that.msgMailInvalido();
                    
                }

            };
            
            that.msgMailInvalido = function() {
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Aviso: </h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <h4 >Verifique los email. Hay uno o más mal escritos.</h4>\
                                    </div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }
                };

                var modalInstance = $modal.open($scope.opts);                    
                
            };
            
            that.msgMailExitoso = function() {
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Aviso: </h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <h4 >El email fue enviado satisfactoriamente.</h4>\
                                    </div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }
                };

                var modalInstance = $modal.open($scope.opts);                    
                
            };
            
            that.msgMailFallido = function() {
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Aviso: </h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <h4 >Hubo problemas al intentar enviar el email.</h4>\
                                    </div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }
                };

                var modalInstance = $modal.open($scope.opts);                    
                
            };

            $scope.enviarMail = function() {
                
                if($scope.rootMailPdf.tipo_documento === 'c') {
                    that.generarPdfCotizacionCliente(function(){
                        $scope.close();
                    });
                }
                
                if($scope.rootMailPdf.tipo_documento === 'p') {
                    that.generarPdfPedidoCliente(function(){
                        $scope.close();
                    });
                }
                
//                if($scope.rootMailPdf.cerrar_modal_principal === true)
//                    $scope.close();

            };

            $scope.close = function() {
                $modalInstance.close();
            };

            $scope.closeAlert = function() {
                $scope.alert = false;
            };
            
        }]);
});