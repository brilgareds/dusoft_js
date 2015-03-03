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

                            if (element.jstree(true).settings) {
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
                            
                            //evita que se seleccione otro nodo diferente al actual
                            if (scope.modulosSeleccionados.length > 0) {
                                
                                //deselecciona todos los nodos para evitar multiples nodos
                                element.jstree("deselect_all");
                                scope.modulosSeleccionados = [];
                                
                                //se vuelve a seleccionar el nodo que el usuario eligio
                                element.jstree("select_node", "#"+selected.node.id);
                                return;
                            }

                            //obtiene todos los nodos seleccionados
                            var seleccionados = $(this).jstree("get_selected", true);
                            //scope.modulosSeleccionados = [];

                            $.each(seleccionados, function() {

                                //se agrega el nodo seleccionado
                                agregarModuloSeleccionado(scope, this.id);

                                if (attrs.tipo === 'multiple') {
                                    //agrega los parent de cada nodo
                                    for (var i in this.parents) {
                                        agregarModuloSeleccionado(scope, this.parents[i]);
                                    }

                                }

                            });

                            console.log("modulos seleccionaddos ", scope.modulosSeleccionados);
                            scope.$emit("modulosSeleccionados", scope.modulosSeleccionados);

                        }).on("deselect_node.jstree", function(){
                           console.log("deselected"); 
                        });
                    }

                    //agrega los nodos seleccionados validando que no se repitan y que no sea parent con id #
                    function agregarModuloSeleccionado(scope, modulo) {

                        modulo = modulo.split("_")[1];
                        for (var i in scope.modulosSeleccionados) {
                            if (scope.modulosSeleccionados[i] === modulo || !modulo) {
                                return false;
                            }
                        }

                        scope.modulosSeleccionados.push(modulo);
                    }

                }
            };
        }]);

});

