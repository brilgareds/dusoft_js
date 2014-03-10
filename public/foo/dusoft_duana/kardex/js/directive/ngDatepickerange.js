define(["angular","js/directive"], function(angular, directive){

    directive.directive('ngDatepickerange', function() {
       return function(scope, element, attrs) {
           element.datepicker({
               inline: true,
               dateFormat: 'dd.mm.yy',
               onSelect: function(dateText) {
                  /* var modelPath = $(this).attr('ng-model');
                   putObject(modelPath, scope, dateText);*/
                   scope.$apply();
               }
           });
       }
    });

});