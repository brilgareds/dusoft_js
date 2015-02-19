define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('arbolModulos', ["$state", "$rootScope", "$timeout", function($state, $rootScope, $timeout) {

            return {
                //scope: { model: '=data' },
                scope:{
                     datosArbol: '='
                },
                link: function(scope, element, attrs, ngModel) {
                    console.log("data scope ", scope.datosArbol);
                    scope.modulosSeleccionados = [];
                    var plugins = ["state"];

                    if (attrs.plugins) {
                        plugins = plugins.concat(attrs.plugins.split(","));
                    }

                    scope.$watch("datosArbol", function(nuevoDato, antiguo) {
                        console.log("data changed ", nuevoDato, antiguo);
                    });

                    //inicializacion del elemento cuando el dom este listo
                    angular.element(document).ready(function() {


                        $(element).jstree({
                            'core': {
                                data: scope.datosArbol,
                                "open_parents": true,
                                "themes": {"stripes": true}

                            },
                            "state": {"key": "tree"},
                            plugins: plugins


                        }).on("select_node.jstree", function(node, selected, event) {

                            //obtiene todos los nodos seleccionados
                            var seleccionados = $(this).jstree("get_selected", true);
                            scope.modulosSeleccionados = [];


                            $.each(seleccionados, function() {
                                console.log(this);
                                //se agrega el nodo seleccionado
                                agregarModuloSeleccionado(scope, this.id);

                                //agrega los parent de cada nodo
                                for (var i in this.parents) {
                                    agregarModuloSeleccionado(scope, this.parents[i]);
                                }

                            });
                            console.log(scope.modulosSeleccionados);
                        });
                    });

                    //agrega los nodos seleccionados validando que no se repitan y que no sea parent con id #
                    function agregarModuloSeleccionado(scope, modulo) {

                        for (var i in scope.modulosSeleccionados) {
                            if (scope.modulosSeleccionados[i] === modulo || modulo === "#") {
                                return false;
                            }
                        }
                        scope.modulosSeleccionados.push(modulo);
                    }


                    /*$(".botonmenu").on("click", function(e) {
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
                     });*/



                }
            };
        }]);

});

