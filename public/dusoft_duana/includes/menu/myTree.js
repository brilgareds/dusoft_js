define(["angular","js/directive"], function(angular, directive){

    directive.directive('myTree',["$timeout", "$state",function(timer, $state) {
       return function(scope, element, attrs) {

          //se debe esperar que el elemento este listo en el dom
          angular.element(document).ready(function(){
               $(element).jstree({
                  'core':{
                      data:scope.$parent.treedata,
                      "open_parents": true

                  },
                  "state" : { "key" : "demo2" },
                  plugins: ["state"]

               }).
               on("select_node.jstree",function(node,selected, event){

                    //se valida si fue por medio de un evento o por el state del plugin
                   if(selected.event){
                      scope.$emit("nodeSelected",selected.node.original);
                   }
                   
               });


           });

       }
    }]);

});

