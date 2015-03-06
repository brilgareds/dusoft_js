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

                    scope.modulosSeleccionados = {
                        padres: [],
                        hijos: []
                    };

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
                            "state": {"key": attrs.estado || "" },
                            plugins: plugins


                        }).on("select_node.jstree", function(node, selected, event) {

                            //evita que se seleccione otro nodo diferente al actual
                            if (scope.modulosSeleccionados.seleccionado) {

                                //deselecciona todos los nodos para evitar multiples nodos
                                element.jstree("deselect_all");
                                scope.modulosSeleccionados = {
                                    padres: [],
                                    hijos: []
                                };

                                //se vuelve a seleccionar el nodo que el usuario eligio
                                element.jstree("select_node", "#" + selected.node.id);
                                return;
                            }

                            //var seleccionados = $(this).jstree("get_selected", true);

                            //console.log("parents .....", selected.node.parents);
                            //console.log("childrens ....", selected.node.original);
                            
                            //se agrega el nodo seleccionado
                            scope.modulosSeleccionados.seleccionado = selected.node.original.modulo_id;

                            if (attrs.tipo === 'multiple') {
                                //agrega los nodos padres
                                for (var i in selected.node.parents) {
                                    agregarModuloSeleccionado(scope, selected.node.parents[i], "padres");
                                }
                                
                                //agrega los nodos hijos
                                for (var i in selected.node.children_d) {
                                    agregarModuloSeleccionado(scope, selected.node.children_d[i], "hijos");
                                }

                            }


                            console.log("modulos seleccionaddos ", scope.modulosSeleccionados);
                            scope.$emit("modulosSeleccionados", scope.modulosSeleccionados);

                        }).on("deselect_node.jstree", function() {
                            console.log("deselected");
                        });
                    }

                    //agrega los nodos padres e hijos
                    function agregarModuloSeleccionado(scope, modulo, tipo) {

                        modulo = modulo.split("_")[1];
                        
                        if(!modulo){
                            return;
                        }
                        
                        for (var i in scope.modulosSeleccionados[tipo]) {
                            if (scope.modulosSeleccionados[tipo][i] === modulo) {
                                return false;
                            }
                        }

                        scope.modulosSeleccionados[tipo].push(modulo);
                    }

                }
            };
        }]);

});

