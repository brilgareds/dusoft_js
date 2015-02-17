define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('arbolModulos', ["$state", "$rootScope", "$timeout", function($state, $rootScope, $timeout) {
            return {
                link: function(scope, element, attrs) {
                    
                    var modulosSeleccionados = [];

                    //inicializacion del elemento cuando el dom este listo
                    angular.element(document).ready(function() {
                        var data = [{"id": "ajson1", "parent": "#", "text": "ajson1"},
                            {"id": "ajson2", "parent": "#", "text": "ajson2"},
                            {"id": "ajson3", "parent": "ajson2", "text": "ajson3"},
                            {"id": "ajson4", "parent": "ajson2", "text": "ajson4"},
                            {"id": "ajson5", "parent": "ajson4", "text": "ajson5"},
                            {"id": "ajson6", "parent": "ajson4", "text": "ajson6"},
                            {"id": "ajson7", "parent": "ajson6", "text": "ajson7"},
                            {"id": "ajson8", "parent": "ajson6", "text": "ajson8"}
                        ];

                        $(element).jstree({
                            'core': {
                                data: data,
                                "open_parents": true,
                                "themes" : { "stripes" : true }

                            },
                            "state": {"key": "tree"},
                            plugins: ["state"/*, "checkbox"*/]


                        }).on("select_node.jstree", function(node, selected, event) {
                            //se valida si fue por medio de un evento o por el state del plugin
                            //configura el slide para el modulo visto en el menu
                            // console.log($(element).jstree().get_selected());
                            var seleccionados = $(this).jstree("get_selected", true);
                            modulosSeleccionados= [];
                            $.each(seleccionados, function() {
                                console.log(this);
                                agregarModuloSeleccionado(this.id);
                                
                                for(var i in this.parents){
                                    agregarModuloSeleccionado(this.parents[i]);
                                }
                                
                            });
                            console.log(modulosSeleccionados);
                        });
                    });
                    
                    function agregarModuloSeleccionado(modulo){
                        for(var i in modulosSeleccionados){
                            if(modulosSeleccionados[i] === modulo || modulo === "#"){
                                return false;
                            }
                        }
                        
                        modulosSeleccionados.push(modulo);
                        
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

