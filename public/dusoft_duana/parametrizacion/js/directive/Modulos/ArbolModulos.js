define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('arbolModulos', ["$state", "$rootScope", "$timeout", function($state, $rootScope, $timeout) {

            return {
                //scope: { model: '=data' },
                /*scope: {
                 datosArbol: '='
                 },*/
                link: function(scope, element, attrs, ngModel) {

                    //evento que indica que el elemento se cargo en el dom
                    scope.$emit("arbolListoEnDom");

                    scope.modulosSeleccionados = [];

                    var plugins = ["state"];

                    if (attrs.plugins) {
                        plugins = plugins.concat(attrs.plugins.split(","));
                    }

                    //determina que los datos del arbol cambiaron, actualiza los nodos
                    scope.$on("datosArbolCambiados", function(e, datos) {
                        if (datos) {

                           // $('#treeId').jstree(true).settings.core.data = newData;
                           // $('#treeId').jstree(true).refresh();
                          
                           if(element.jstree(true).settings){
                               element.jstree(true).settings.core.data = datos;
                               element.jstree(true).refresh();
                           } else {
                               init(datos);
                           }
                        }
                    });


                    function init(datos) {
                        element.jstree({
                            'core': {
                                data: datos,
                                "open_parents": true,
                                "themes": {"stripes": true}

                            },
                            "state": {"key": "treemodulos"},
                            plugins: plugins


                        }).on("select_node.jstree", function(node, selected, event) {

                            console.log("nodo seleccionado ", selected);
                            //obtiene todos los nodos seleccionados
                            var seleccionados = $(this).jstree("get_selected", true);
                            scope.modulosSeleccionados = [];


                            $.each(seleccionados, function() {
                                console.log(this);

                                //se agrega el nodo seleccionado
                                agregarModuloSeleccionado(scope, this.id);

                                if (attrs.plugins === 'multiple') {
                                    //agrega los parent de cada nodo
                                    for (var i in this.parents) {
                                        agregarModuloSeleccionado(scope, this.parents[i]);
                                    }
                                }

                            });

                            console.log(scope.modulosSeleccionados);
                            scope.$emit("modulosSeleccionados", scope.modulosSeleccionados);

                        });
                    }

                    //agrega los nodos seleccionados validando que no se repitan y que no sea parent con id #
                    function agregarModuloSeleccionado(scope, modulo) {

                        for (var i in scope.modulosSeleccionados) {
                            if (scope.modulosSeleccionados[i] === modulo || modulo === "#") {
                                return false;
                            }
                        }

                        modulo = modulo.split("_")[1];

                        scope.modulosSeleccionados.push(modulo);
                    }

                }
            };
        }]);

});

