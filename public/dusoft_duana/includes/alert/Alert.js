define(["angular","js/services"], function(angular, services){

    var Alert = services.service('AlertService',["$modal", function($modal) {
      var that = this;
      this.el;
      this.colaEjecucion = [];
      this.timer;
      this.mostrandoMensaje = false;
      this.intervalo = 2000;

      this.mostrarMensaje = function(tipo, msg){

         this.colaEjecucion.push({tipo:tipo,msg:msg});
         this.procesarMensaje();
          
      };

      this.procesarMensaje =function(){
        if(!this.mostrandoMensaje){

            var msg = this.colaEjecucion[0];

            if(msg){
                this.mostrandoMensaje = true;
                console.log(msg);
                that.el.html("<p class='alertcontenido alert alert-"+msg.tipo+"'>\
                                "+msg.msg+"</p>").show();

                this.timer = setTimeout(function(){
                    that.el.html("<p>"+msg.msg+"</p>").hide();
                    that.destruirIntervalo();
                    that.colaEjecucion.splice(0,1);
                    that.mostrandoMensaje = false;
                    that.procesarMensaje();
                   
                },this.intervalo);


            } else {
              console.log(this.colaEjecucion);
              console.log("no hay mensajes pendientes");
            }

        }
      };
      
      this.mostrarVentanaAlerta = function(titulo, mensaje){
            var opts = {
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
          //  size: 'sm',
            keyboard: true,
            template: ' <div class="modal-header">\
                            <button type="button" class="close" ng-click="close()">&times;</button>\
                            <h4 class="modal-title">{{titulo}}</h4>\
                        </div>\
                        <div class="modal-body">\
                            <h4>{{mensaje}}</h4>\
                        </div>\
                        <div class="modal-footer">\
                            <button class="btn btn-primary" ng-click="close()">Cerrar</button>\
                        </div>',
            controller: function($scope, $modalInstance, titulo, mensaje) {
                $scope.mensaje = mensaje;
                $scope.titulo  = titulo;
                $scope.close = function() {
                    $modalInstance.close();
                };

            },
            resolve: {
                titulo: function() {
                    return titulo;
                },
                mensaje: function(){
                    return mensaje;
                }
            }
        };
        var modalInstance = $modal.open(opts);
      };

      this.destruirIntervalo =function(){
        clearTimeout(this.timer);
        this.timer = null;
      };

      angular.element(document).ready(function () {
          $("body").append(
              "<div id='systemAlerlt'>"+


              "</div>"
          );

          that.el = $("#systemAlerlt");
      });

    }]);





});
