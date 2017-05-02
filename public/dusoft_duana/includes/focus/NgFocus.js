/**
 * 
 * @param {type} angular
 * @author http://jsfiddle.net/jamseernj/6guy3sp9/
 * +Descripcion: Directiva que permite dos decimales en un valor numerico
 * @fecha 18/11/2015
 */
define(["angular", "js/directive"], function(angular, directive) {
console.log("AAAAAAAAAAAAAAAAAAAAAAA");
    directive.directive('ngFocus', function() {
console.log("BBBBBBBBBBBBBBBBBBBBBBB");
var hijo = document.getElementById('lote');
console.log("hijo",hijo);
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function(val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }
                    var clean = val.replace(/[^0-9\.]/g, '');
                    var decimalCheck = clean.split('.');

                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 4);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function(event) {
                    console.log("CCCCCCCCCCCCCCCCCCC",event);
                    var hijo = document.getElementById('lote');
                     document.getElementById("lote").focus();
                    hijo.focus();
console.log("hijo",hijo);
 that = this;
                var code = e.keyCode || e.which;
                    if (code === 13) {
                    console.log(">>>>>>>>>>>> Cambio de Foco INTRO<<<<<<<<<<<<<<<");
                    console.log("CODE: ", code);
                    scope.$apply(function(){
                        e.preventDefault();
                        that.next().focus();
                    });
                    e.preventDefault();
                }
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        }
    });
});