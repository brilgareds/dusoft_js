define(["angular","js/services"], function(angular, services){
    services.factory('socket', ["$rootScope", function ($rootScope) {
      var socket = io.connect();
      
      var listenersPrivados = [
          "onRealizarNotificacionWeb",
          "onCerrarSesion"          
      ];
      
      function esEventoPrivado(evento){
          for(var i in listenersPrivados){
              if(evento === listenersPrivados[i]){
                  return true;
              }
          }
          
          return false;
      }
      
      
      return {
            on: function (eventName, callback) {
              socket.on(eventName, function () {  

                var args = arguments;

                if(!$rootScope.$$phase) {
                   $rootScope.$apply(function () {
                    callback.apply(socket, args);
                  });
                }

              });
            },
            emit: function (eventName, data, callback) {
              socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                  if (callback) {
                    callback.apply(socket, args);
                  }
                });
              })
            },
            //Remueve los listeners registrados en los controladores
            removeAllListeners: function (eventName, callback) {
                
                for(var i in socket.$events){
                    if(!esEventoPrivado(i)){
                        socket.$events[i] = null;
                        delete  socket.$events[i];
                    }
                }
                
            },
            //Borra todos los listeners incluyendo los privados
            forceRemoveListener:function(eventName, callback){
                socket.removeAllListeners(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function () {
                      callback.apply(socket, args);
                    });
                });
            }
      };
    }]);

});
