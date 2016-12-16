define(["angular","js/directive"], function(angular, directive){

   directive.directive('loginDirective', [function() {
        return {
            link:function(scope, element, attrs) {
                $(document).ready(function(){

                    $('.arriba').click(function(){
                        $('body, html').animate({
                                scrollTop: '0px'
                        }, 300);
                    });

                    $(window).scroll(function(){
                        if( $(this).scrollTop() > 0 ){
                                $('.arriba').slideDown(300);
                        } else {
                                $('.arriba').slideUp(300);
                        }
                    });
                    
                    
                    $(".botonmas").click(function(){
                       $("html, body").animate({ scrollTop: $('#mision').offset().top }, 400); 
                    });

                });

            }
	}   
    }]);

});