define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('myTree', ["$state", "$rootScope", "$timeout", function($state, $rootScope, $timeout) {
            return {
                link: function(scope, element, attrs) {

                    //configura el slide basado en la carga del menu
                    $rootScope.$on("slidecargado", function(){
                        $rootScope.$emit("configurarslide");
                    });
                    //evento para saber el state del url
                    //$rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams){ 
                    //observador para cuando los datos del arbol se carguen del servidor

                    var listener = scope.$watch(scope.$parent.treedata, function(e) {
                        console.log("cambio de datos");
                        var data = localStorage.getItem("tree");

                        if (data) {
                            data = JSON.parse(data);

                        } else {
                            data = {
                                "state": {
                                    "core": {
                                        "open": [
                                        ],
                                        "scroll": {
                                            "left": 0,
                                            "top": 0
                                        },
                                        "selected": []
                                    }
                                }
                            };
                        };

                        //timer para dar una espera en chrome
                       $timeout(function() {
                            for (var i in scope.$parent.treedata) {
                                var obj = scope.$parent.treedata[i];
                              //  console.log("url object " + obj.state + " current state" + $state.current.name)
                                if (obj.state !== undefined && obj.state !== "") {

                                    if (obj.state === $state.current.name) {
                                        //console.log(obj.id)
                                        data.state.core.selected = [obj.id];

                                        localStorage.setItem("tree", JSON.stringify(data));
                                        break;
                                    }
                                }
                            }
                            //remueve el listener
                            listener();
                            scope.iniTree();
                        }, 500);

                    });

                    scope.iniTree = function() {
                        //inicializacion del elemento cuando el dom este listo
                        angular.element(document).ready(function() {
                            $(element).jstree({
                                'core': {
                                    data: scope.$parent.treedata,
                                    "open_parents": true

                                },
                                "state": {"key": "tree"},
                                plugins: ["state"]

                            }).on("select_node.jstree", function(node, selected, event) {
                                //se valida si fue por medio de un evento o por el state del plugin
                                //configura el slide para el modulo visto en el menu
                                $rootScope.$emit("configurarslide");

                                if (selected.event) {
                                    scope.$emit("nodeSelected", selected.node.original);
                                }
                            });
                        });

                        $(".botonmenu").on("click",function (e) {
                            var el =  $(".contenedormenu");
                            if(el.hasClass("mostrarmenu")){
                                el.removeClass("mostrarmenu");
                                el.addClass("cerrarmenu");
                            } else {
                                el.removeClass("cerrarmenu");
                                el.addClass("mostrarmenu");
                            }
                            

                        });

                        $(".contenedormenu").on("mouseleave",function(){
                             var el =  $(this);
                             if(el.hasClass("mostrarmenu")){
                                el.removeClass("mostrarmenu");
                                el.addClass("cerrarmenu");
                             }
                        });


                    };

                }
            };
        }]);

});

