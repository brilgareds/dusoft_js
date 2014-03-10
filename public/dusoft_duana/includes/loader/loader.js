define(["angular","js/directive"], function(angular, directive){

    directive.directive('loader',["$http", function($http) {
       return {
            restrict: 'A',
            link: function (scope, el, attrs)
            {
                this.colors = ["rgba(244,244,244, 0.5)", "rgba(233,233,233,0.5)", "rgba(217,217,217,0.5)"];
                this.count  = 0;
                this.timer = null;
                var that = this;


                angular.element(document).ready(function(){
                    el = $(el);
                    that.root   = $("#loadingWidget");
                    
                    scope.isLoading = function () {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function (v)
                    {
                        if(v){
                            el.show();
                            that.startTimer();
                        }else{
                           that.root.css("background-color","transparent");
                           el.hide();
                           that.stopTimer();
                        }
                    });

                    //EL modal sigue el scroll de la ventana principal
                    var elpos=el.offset().top;
                    $(window).scroll(function () {
                        var y=$(this).scrollTop();
                        if(y<elpos){el.stop().animate({'top':0},0);}
                        else{el.stop().animate({'top':y-elpos},0);}
                    });

               });

                //timer para opacar la ventana cuando el request se ha tomado cierto tiempo
                this.startTimer = function(){

                    if(this.timer != null){
                        return;
                    }

                    var that = this;
                    this.timer = setInterval(function(){
                        var rgb = (that.colors[that.count])?that.colors[that.count]:that.colors[that.colors.length - 1];
                        that.root.css("background-color",rgb);
                        if(that.count == (that.colors.length -1)){
                            that.stopTimer();
                        }
                        that.count++;
                    },5000);
                }

                this.stopTimer = function(){
                    this.count = 0;
                    clearInterval(this.timer);
                    this.timer = null;
                }

            }
        };
       
    }]);

});
