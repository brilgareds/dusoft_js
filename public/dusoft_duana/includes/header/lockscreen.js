define(["angular","js/directive"], function(angular, directive){

    directive.directive('lockscreen',["$http", function($http) {
       return {
            restrict: 'A',
            link: function (scope, el, attrs)
            {
                setHeight($(window).height());

                $( window ).resize(function() {
                    setHeight($(window).height());
                });

                function setHeight(height){
                    el.css({'height':height+'px'});
                }
            }
        };
       
    }]);

});
