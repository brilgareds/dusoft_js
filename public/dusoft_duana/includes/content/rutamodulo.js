define(["angular","js/directive"], function(angular, directive){

    directive.directive('rutamodulo',["$http", "$rootScope", function($http, $rootScope) {
       return {
            restrict: 'A',
            link: function (scope, el, attrs)
            {
               $rootScope.$on("$stateChangeSuccess", function(event, toState){
                    el.css({display:"inline"});
                   
                    var titulo = el.find("#menubread");
                    if(toState.text !== undefined){
                        titulo.text(toState.text);
                    } else {
                        titulo.text(toState.name);
                    }
               });
            },
            template:'<ul class="page-breadcrumb breadcrumb">'+
                        '<li>'+
                            '<i class="glyphicon glyphicon-home"></i> '+
                            '<a href="javascript:void(0);" id="menubread" style="margin-left:5px;"></a>'+
                        '</li>'+
                       '</ul>'
        };
       
    }]);

});
