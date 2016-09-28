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
        'ConversacionDetalle','$sce',
        
        function($scope, $rootScope, Request,
                Empresa, CentroUtilidad, Bodega,
                API, socket, AlertService, $state, Usuario,
                localStorageService, URL, 
                $filter, $timeout, $modal, Conversacion,
                ConversacionDetalle,$sce) {

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
                usuarioActual:Usuario.getUsuarioActual(),
                terminoBusqueda:"",
                mensajeNotificacion: localStorageService.get("mensajeNotificacion") || undefined
            };
            
            
            $scope.root.listaConversaciones = {
                data: 'root.conversaciones',
                enableColumnResize: true,
                enableRowSelection: true,
                singeSelection:true,
                showFilter: true,
                multiSelect:false,
                enableHighlighting:true,
                afterSelectionChange:function(row, $event){
                    
                    row.entity.setNotificacion(false);
                    
                    if(row.selected){
                        self.listarDetalleConversacion(row.entity);
                    }
                    
                },
                columnDefs: [
                    {field: 'getNombre()', displayName: '', cellClass: "txt-center", width:"40",
                        cellTemplate: '<button class="btn btn-default btn-xs" ng-click="onMostrarVentanaGrupos($event, row.entity)"><span class="glyphicon glyphicon-user" ></span></button>'},
                    {field: 'getNombre()', displayName: 'Participantes', cellClass:"ngCellText",
                        cellTemplate:"<div ng-class=\"{'blink' : row.entity.tieneNotificacion()}\">{{row.entity.getNombre()}}</div>"},
                    {field: 'getFechaCreacion()', cellClass:"ngCellText", displayName: 'Fecha', width:100, 
                        cellTemplate:"<div ng-class=\"{'blink' : row.entity.tieneNotificacion()}\">{{row.entity.getFechaCreacion()}}</div>"}

                ]

            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de chat
            * @fecha 2016-09-05
            */
            $scope.onMostrarVentanaGrupos = function(event, conversacion){
                event.stopPropagation();
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    size: 'lg',
                    keyboard: true,
                    templateUrl: '../includes/components/gruposChat/GrupoChat.html',
                    controller: 'GruposChatController',
                    resolve: {
                        conversacion: function() {
                            return conversacion;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            
            $scope.onAbrirVentanaCompleta = function(){
                var conversacion = $scope.root.conversacionSeleccionada;
                
                if(conversacion.getId() !== 0){
                    localStorageService.set("mensajeNotificacion", {id_conversacion:conversacion.getId()});
                }
                
                
                window.open(
                    '/dusoft_duana/chat/#/Admin',
                    '_blank' // <- This is what makes it open in a new window.
                );
            };
            
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de subir archivo
            * @fecha 2016-09-13
            */
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
                
                
                Request.subirArchivo(URL.CONSTANTS.API.CHAT.GUARDAR_MENSAJE, fd, function(respuesta) {
                    
                    if(respuesta.status === 200){
                     
                    } else {
                        var mensaje =  {
                            id_conversacion:conversacion.getId(), usuario:Usuario.getUsuarioActual().getNombreUsuario(),
                            mensaje:respuesta.msj, archivo_adjunto:null,
                            fecha_mensaje:"",
                            error:true
                        };
                                
                        self.agregarDetalleConversacion(mensaje);
                        
                        $scope.$emit("onMensajeNuevo", mensaje, Usuario.getUsuarioActual());
                    }
                    
                });
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del evento emitido por la ventana de grupos
            * @fecha 2016-09-15
            */
            var onVentanaGruposCerrada = $rootScope.$on("onVentanaGruposCerrada",function(){
               self.onTraerConversaciones();
            });
            
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
                localStorageService.remove("mensajeNotificacion");
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
            * +Descripcion Subraya resultado de busqueda
            * @fecha 2016-09-23
            */
            $scope.highlight = function(text, search) {
                if (!search) {
                    return $sce.trustAsHtml(text);
                }
                return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del textinput para buscar coincidencias en las conversaciones
            * @fecha 2016-09-23
            */
            $scope.onBuscarConversaciones = function(event){
                if(event.which === 13){
                    self.onTraerConversaciones();
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
                    } else {
                        var mensaje =  {
                            id_conversacion:conversacion.getId(), usuario:Usuario.getUsuarioActual().getNombreUsuario(),
                            mensaje:"El mensaje no se envio", archivo_adjunto:null,
                            fecha_mensaje:"",
                            error:true
                        };
                        
                        self.agregarDetalleConversacion(mensaje);
                        $scope.$emit("onMensajeNuevo", mensaje, Usuario.getUsuarioActual());
                    }
                    
                });
            };
            
            
            self.marcarConversacionConNotificacion = function(id){
                
                for(var i in  $scope.root.conversaciones){
                    var conversacion =  $scope.root.conversaciones[i];
                    
                    if(id ===  conversacion.getId()){
                        conversacion.setNotificacion(true);
                    }
                }
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Evento socket al recibir un menssaje
            * @fecha 2016-09-15
            */
           socket.on("onNotificarMensaje", function(data){
               
               var conversacion = $scope.root.conversacionSeleccionada;
              
               //console.log("conversacion ", data.mensaje.id_conversacion, " conversacion ", conversacion.getId());
               
                //Conversacion actual
                if(data.mensaje.id_conversacion === conversacion.getId()){
                    self.agregarDetalleConversacion(data.mensaje);
                    
                } else {
                   
                }
                
                self.onTraerConversaciones(function(){
                    self.marcarConversacionConNotificacion(data.mensaje.id_conversacion);
                });
                
                $scope.$emit("onMensajeNuevo", data.mensaje, Usuario.getUsuarioActual());

           });
           
           
            $scope.$on('$destroy', function() {
                onVentanaGruposCerrada();
                $scope.$$watchers = null;
                socket.remove(["onNotificarMensaje"]);
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
        
                if(_conversacion.error){
                    conversacion.setMensaje("<span style='color:red'>"+conversacion.getMensaje()+"</span>");
                }

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
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            termino_busqueda:$scope.root.terminoBusqueda
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
                            
                            //Verifica si hay un mensaje pendiente al dar click en la notificacion web
                            if($scope.root.mensajeNotificacion && $scope.root.mensajeNotificacion.id_conversacion === conversacion.getId()){
                                self.listarDetalleConversacion(conversacion);
                                localStorageService.remove("mensajeNotificacion");
                                $scope.root.mensajeNotificacion = undefined;
                            }
                            
                        }
                        
                        if(callback)
                            callback();
                        
                    } 
                    

                });
            };
            
            self.onTraerConversaciones();

        }]);

});
