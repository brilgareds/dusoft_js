define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('treeSearch', ["$state", "$rootScope", "$timeout", function($state, $rootScope, $timeout) {

            var directive = {};

            directive.restrict = 'E';
            directive.template = '<div class="input-group input-group-sm col-md-5" style="padding-top:0px;">\
                                    <input type="text" class="form-control inputSearchTree" placeholder="Buscar" aria-describedby="basic-addon1">\
                                    <span class="input-group-addon botonmenu" id="basic-addon1"><span class="glyphicon glyphicon-align-justify" ></span></span>\
                                  </div>';

            directive.scope = {
            };

            //cuando la etiqueta esta cargada en el dom
            directive.link = function(scope, element, attrs, ngModel) {
                
                var id = "#"+attrs.treeid;
                var clase = "."+attrs.treeid;
                
                //se agrega la clase unica al elemento (es unica porque es el id que se asigno al jstree)
                element.addClass(attrs.treeid);                
                
                //se crea una extencion de jquery para buscar en cada nodo de jstree que ademas sea insensible a mayusculas
                $.extend($.expr[":"], {
                    "containsJstree": function(elem, i, match, array) {
                        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
                    }
                });
                
                //busca en cada nodo el termino de busqueda
                $(document).on("keyup", clase+" .inputSearchTree", function(e) {
                    var busqueda = $(this).val();
                    $( id + " li").hide();
                    $( id + ' li:containsJstree("' + busqueda + '")').show();
                });
            };



            return directive;

        }]);

});

