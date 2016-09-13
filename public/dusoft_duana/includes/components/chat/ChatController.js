define(["angular",
    "js/controllers",
    'includes/Constants/Url', 'includes/classes/Chat/Conversacion', 'includes/classes/Chat/ConversacionDetalle',
    "includes/components/gruposChat/GruposChatController"], function(angular, controllers) {

    controllers.controller('ChatController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'CentroUtilidad', 'Bodega',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", 'URL',
        '$filter', '$timeout','$modal','Conversacion',
        'ConversacionDetalle',
        function($scope, $rootScope, Request,
                Empresa, CentroUtilidad, Bodega,
                API, socket, AlertService, $state, Usuario,
                localStorageService, URL, 
                $filter, $timeout, $modal, Conversacion,
                ConversacionDetalle) {

            var self = this;

            /*
             * @Author: Eduar
             * +Descripcion: Definicion del objeto que contiene los parametros del controlador
             */
            $scope.root = {
                session: {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                },
                conversaciones:[],
                conversacionSeleccionada:Conversacion.get(),
                conversacionSeleccioanda: false,
                usuarioActual:Usuario.getUsuarioActual()
            };
            
            
            $scope.root.listaConversaciones = {
                data: 'root.conversaciones',
                enableColumnResize: true,
                enableRowSelection: true,
                singeSelection:true,
                showFilter: true,
                multiSelect:false,
                enableHighlighting:true,
                afterSelectionChange:function(row){
                    
                    if(row.selected){
                        self.listarDetalleConversacion(row.entity);
                    }
                    
                },
                columnDefs: [
                    {field: 'getNombre()', displayName: 'Participantes'},
                    {field: 'getFechaCreacion()', displayName: 'Fecha', width:100}

                ]

            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de chat
            * @fecha 2016-09-05
            */
            $scope.onMostrarVentanaGrupos = function(){
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    size: 'lg',
                    keyboard: true,
                    templateUrl: '../includes/components/gruposChat/GrupoChat.html',
                    controller: 'GruposChatController'
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            
            
            $scope.subirArchivo = function(files) {
                var conversacion = $scope.root.conversacionSeleccionada;
                var fd = new FormData();
                fd.append("file", files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify( 
                        {
                            chat: {
                                    id_conversacion: conversacion.getId(),
                                    usuario_id:Usuario.getUsuarioActual().getId(),
                                    mensaje:Usuario.getUsuarioActual().getNombreUsuario()+ " Envio un archivo"
                                }
                        }
                ));
                
                
                Request.subirArchivo(URL.CONSTANTS.API.CHAT.GUARDAR_MENSAJE, fd, function(completo) {
                                        
                    if(completo){
                     
                    }
                    
                });
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del textinput para guardar el mensaje
            * @fecha 2016-09-05
            */
            $scope.onGuardarMensaje = function(event){
                if(event.which === 13){                    
                    self.guardarMensaje();
                }
            };
            
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del tab de conversaciones
            * @fecha 2016-09-09
            */
            $scope.onTraerConversaciones = function(){
                self.onTraerConversaciones();
                $scope.$emit("onTabConversaciones");
            };
            
            
          /**
            * @author Eduar Garcia
            * +Descripcion Por medio de la extension del archivo valida si es imagen
            * @fecha 2016-09-13
            */
            $scope.esImagen = function(archivo){
                var extensiones = ["gif", "png", "jpg", "jpeg"];
                var extension =  archivo.substr(archivo.lastIndexOf('.')+1)
                
                if(extensiones.indexOf(extension.toLowerCase()) === -1){
                    return false;
                } else {
                    return true;
                }
                
                
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion al API guardar mensaje del usuario
            * @fecha 2016-09-05
            */
            self.guardarMensaje = function(){
                
                if($scope.root.mensaje.length === 0){
                    return;
                }
                
                var conversacion = $scope.root.conversacionSeleccionada;
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            id_conversacion: conversacion.getId(),
                            usuario_id:Usuario.getUsuarioActual().getId(),
                            mensaje:$scope.root.mensaje
                        }
                    }
                };

                Request.realizarRequest(URL.CONSTANTS.API.CHAT.GUARDAR_MENSAJE, "POST", obj, function(data) {
                                        
                    if(data.status === 200){
                        /*var _conversacion = data.obj.conversacion[0];
                        self.agregarDetalleConversacion(_conversacion);*/
                        $scope.root.mensaje = "";
                    }
                    
                });
            };
            
           socket.on("onNotificarMensaje", function(data){
               
               var conversacion = $scope.root.conversacionSeleccionada;
               console.log("conversacion ", data.mensaje.id_conversacion, " conversacion ", conversacion.getId());
               
                //Conversacion actual
                if(data.mensaje.id_conversacion === conversacion.getId()){
                    self.agregarDetalleConversacion(data.mensaje);
                    
                } else {
                   
                }
                
                self.onTraerConversaciones();
                $scope.$emit("onMensajeNuevo", data.mensaje, Usuario.getUsuarioActual());

           });
            
          /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion al API para traer el detalle de una conversacion
            * @fecha 2016-09-05
            */
            self.listarDetalleConversacion = function(conversacion){
               $scope.root.conversacionSeleccionada = conversacion;
               $scope.root.conversacionSeleccionada.vaciarDetalle();
               var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            id_conversacion: conversacion.getId()
                        }
                    }
                };

                Request.realizarRequest(URL.CONSTANTS.API.CHAT.OBTENER_DETALLE_CONVERSACION, "POST", obj, function(data) {
                                        
                    if(data.status === 200){
                        var _conversaciones = data.obj.conversaciones;
                        
                        for(var i in _conversaciones){
                            var _conversacion = _conversaciones[i];
                            self.agregarDetalleConversacion(_conversacion);
                        }
                        
                        $scope.root.conversacionSeleccioanda = true;
                        
                        $timeout(function(){
                            $scope.$emit("realizarScrollInferior");
                        },500);
                        
                        
                    }
                    

                });
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Agrega un mensaje insertado por el usuario
            * @fecha 2016-09-08
            */ 
            self.agregarDetalleConversacion = function(_conversacion){
                var conversacion = ConversacionDetalle.get(
                        _conversacion.id_conversacion, _conversacion.usuario,
                        _conversacion.mensaje, _conversacion.archivo_adjunto,
                        _conversacion.fecha_mensaje
                );

               $scope.root.conversacionSeleccionada.agregarDetalle(conversacion);
            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Hace peticion para obtener las conversaciones del usuario
             */
            self.onTraerConversaciones = function(callback){
                
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            usuario_id: Usuario.getUsuarioActual().getId()
                        }
                    }
                };

                Request.realizarRequest(URL.CONSTANTS.API.CHAT.OBTENER_CONVERSACIONES, "POST", obj, function(data) {
                                        
                    if(data.status === 200){
                        $scope.root.conversaciones = [];
                        var _conversaciones = data.obj.conversaciones;
                        
                        for(var i in _conversaciones){
                            var _conversacion = _conversaciones[i];
                            var conversacion = Conversacion.get(_conversacion.id_conversacion, _conversacion.titulo, _conversacion.fecha_creacion);
                            
                            $scope.root.conversaciones.push(conversacion);
                        }
                        
                    } 
                    

                });
            };
            
            self.onTraerConversaciones();

        }]);

});
