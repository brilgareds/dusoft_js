define(["angular", "js/directive", "includes/menu/treeSearch"], function(angular, directive) {

    directive.directive('myTree', ["$state", "$rootScope", "$timeout", function($state, $rootScope, $timeout) {
            return {
                link: function(scope, element, attrs) {



                    $.extend($.expr[":"], {
                        "containsJstree": function(elem, i, match, array) {
                            return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
                        }
                    });

                    //configura el slide basado en la carga del menu
                    $rootScope.$on("slidecargado", function() {
                        $rootScope.$emit("configurarslide");
                    });
                    //evento para saber el state del url
                    //observador para cuando los datos del arbol se carguen del servidor

                    $rootScope.$on("inicializarDatosArbol", function(e) {
                        console.log("cambio de datos>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
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
                        }
                        ;

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

                        scope.iniTree();
                    });


                    scope.iniTree = function() {
                        $(element).jstree({
                            'core': {
                                data: scope.$parent.treedata,
                                "open_parents": true

                            },
                            "state": {"key": "tree"},
                            plugins: ["state","sort"],
                            "sort": function(a,b){
                                
                                 if(this.get_text(b).toLowerCase() === "home"){
                                     return 1;
                                 }
                                
                                 return this.get_text(a) > this.get_text(b) ? 1 : -1; 
                            }

                        }).on("select_node.jstree", function(node, selected, event) {
                            //se valida si fue por medio de un evento o por el state del plugin
                            //configura el slide para el modulo visto en el menu
                            $rootScope.$emit("configurarslide");

                            if (selected.event) {
                                scope.$emit("nodeSelected", selected.node.original);
                            }
                        });

                        $(".botonmenu").on("click", function(e) {
                            var el = $(".contenedormenu");
                            if (el.hasClass("mostrarmenu")) {
                                el.removeClass("mostrarmenu");
                                el.addClass("cerrarmenu");
                            } else {
                                el.removeClass("cerrarmenu");
                                el.addClass("mostrarmenu");
                            }


                        });

                        $(".contenedormenu").on("mouseleave", function() {
                            var el = $(this);
                            if (el.hasClass("mostrarmenu")) {
                                el.removeClass("mostrarmenu");
                                el.addClass("cerrarmenu");
                            }
                        });


                    };


                    $(document).on("keyup", "#buscarModulosPrincipales", function(e) {
                        var busqueda = $(this).val();
                        var id = element.attr("id");
                        $("#" + id + " li").hide();

                        $('#' + id + ' li:containsJstree("' + busqueda + '")').show();
                    });

                }
            };
        }]);

});

