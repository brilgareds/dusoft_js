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
                conversacionSeleccionada:Conversacion.get()
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
                    {field: 'getNombre()', displayName: 'Otras Conversaciones'}

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
            
          /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion al API para traer el detalle de una conversacion
            * @fecha 2016-09-05
            */
            self.listarDetalleConversacion = function(conversacion){
               $scope.root.conversacionSeleccionada = conversacion;
               var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            conversacion_id: conversacion.getId()
                        }
                    }
                };

                Request.realizarRequest(URL.CONSTANTS.API.CHAT.OBTENER_DETALLE_CONVERSACION, "POST", obj, function(data) {
                                        
                    if(data.status === 200){
                        var _conversaciones = data.obj.conversaciones;
                        
                        for(var i in _conversaciones){
                            var _conversacion = _conversaciones[i];
                            var conversacion = ConversacionDetalle.get(
                                    _conversacion.id_conversacion, _conversacion.usuario, _conversacion.mensaje, _conversacion.fecha_mensaje
                            );
                            
                           $scope.root.conversacionSeleccionada.agregarDetalle(conversacion);
                        }
                        
                    }
                    

                });
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
