//directiva pensada para trabajar con manipulacion general del dom para modulos
define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('directivaGeneralModulos', function() {

        var directive = {};

        //cuando la etiqueta esta cargada en el dom
        directive.link = function(scope, element, attrs, ngModel) {
            
           /* $(document).on("blur", ".validar_caracteres", function() {
                    alert("")
                });*/

            element.on("blur", ".validar_caracteres", function() {
                //no permite los caracteres especiales
                $(this).val(
                        scope.firstToUpperCase($(this).val().replace(/[^a-z0-9 ]/gi, ''))
                );

                //notifica a angular el cambio
                $(this).trigger('input');
            });

            element.on("blur",".validar_espacios", function() {

                $(this).val(scope.camelCase($(this).val()));

                //reemplaza los espacios
                $(this).val(
                       scope.firstToUpperCase($(this).val().replace(/[ ]/gi, ''))
                );

                //notifica a angular el cambio
                $(this).trigger('input');
            });

            scope.camelCase = function(input) {
                return input.replace(/ (.)/g, function(match, group1) {
                    return group1.toUpperCase();
                });
            };

            scope.firstToUpperCase = function(str) {
                return str.substr(0, 1).toUpperCase() + str.substr(1);
            };
        };

        return directive;

    });

});
