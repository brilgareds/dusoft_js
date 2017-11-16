define(["angular","js/services"], function(angular, services){

    var Alert = services.service('AlertService',["$modal", "$sce", function($modal, $sce) {
      var that = this;
      this.el;
      this.colaEjecucion = [];
      this.timer;
      this.mostrandoMensaje = false;
      this.intervalo = 4000;

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
      
      this.mostrarVentanaAlerta = function(titulo, mensaje, callback){
          
            var opts = {
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            template: ' <div class="modal-header">\
                            <button type="button" class="close" ng-click="close()">&times;</button>\
                            <h4 class="modal-title">{{titulo}}</h4>\
                        </div>\
                        <div class="modal-body" ng-bind-html="mensaje">\
                            <h4>{{mensaje}}</h4>\
                        </div>\
                        <div class="modal-footer" style="margin-top: 0px">\
                            <button class="btn btn-primary" ng-click="close()" ng-if="!callback">Cerrar</button>\
                            <button class="btn btn-warning" ng-click="onBtnModal(true)" ng-if="callback">Aceptar</button>\
                            <button class="btn btn-primary" ng-click="onBtnModal(false)" ng-if="callback">Cancelar</button>\
                        </div>',
            controller: ["$scope", "$modalInstance", "titulo", "mensaje", "callback", function($scope, $modalInstance, titulo, mensaje, callback) {
                $scope.mensaje = $sce.trustAsHtml(mensaje);
                $scope.titulo  = titulo;
                $scope.callback = callback;
                $scope.close = function() {
                    if(callback){
                        callback(false);
                    }
                    $modalInstance.close();
                };
                
                $scope.onBtnModal = function(aceptar){
                    callback(aceptar);
                    $modalInstance.close();
                }

            }],
            resolve: {
                titulo: function() {
                    return titulo;
                },
                mensaje: function(){
                    return mensaje;
                },
                callback : function(){
                    return callback;
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
