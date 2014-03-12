define(["angular","js/services"], function(angular, services){

    var Alert = services.service('AlertService',function() {
      var that = this;
      this.el;
      this.colaEjecucion = [];
      this.timer;
      this.mostrandoMensaje = false;
      this.intervalo = 2000;

      this.mostrarMensaje = function(tipo, msg){

         this.colaEjecucion.push({tipo:tipo,msg:msg});
         this.procesarMensaje();
          
      }  

      this.procesarMensaje =function(){
        if(!this.mostrandoMensaje){

            var msg = this.colaEjecucion[0];

            if(msg){
                this.mostrandoMensaje = true;
                console.log(msg)
                that.el.html("<p class='alertcontenido alert alert-"+msg.tipo+"'>"+msg.msg+"</p>").show();

                this.timer = setTimeout(function(){
                    that.el.html("<p>"+msg.msg+"</p>").hide();
                    that.destruirIntervalo();
                    that.colaEjecucion.splice(0,1);
                    that.mostrandoMensaje = false;
                    that.procesarMensaje();
                   
                },this.intervalo);


            } else {
              console.log(this.colaEjecucion)
              console.log("no hay mensajes pendientes");
            }

        }
      }


      this.destruirIntervalo =function(){
        clearTimeout(this.timer);
         this.timer = null;
      }

      angular.element(document).ready(function () {
          $("body").append(
              "<div id='systemAlerlt'>"+


              "</div>"
          );

          that.el = $("#systemAlerlt");

         /* that.mostrarMensage("danger","my mesage here");
          that.mostrarMensage("success","my mesage here2");
          that.mostrarMensage("warning","my mesage here3");

          setTimeout(function(){
               that.mostrarMensage("danger","my mesage here4");
              that.mostrarMensage("info","my mesage here5");
              that.mostrarMensage("info","my mesage here6 its to large but i want to show here");
          },2000)*/

           

      });

    });





});
