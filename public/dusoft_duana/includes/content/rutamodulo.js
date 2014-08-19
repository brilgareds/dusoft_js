define(["angular","js/directive"], function(angular, directive){

    directive.directive('rutamodulo',["$http", "$rootScope", function($http, $rootScope) {
       return {
            restrict: 'A',
            link: function (scope, el, attrs)
            {

               $rootScope.$on("$stateChangeSuccess", function(event, toState){
                    console.log("statechage ", toState);
                    if(toState.text !== undefined){
                        el.text(toState.text);
                    } else {
                        el.text(toState.name);
                    }
               })
            }
        };
       
    }]);

});
