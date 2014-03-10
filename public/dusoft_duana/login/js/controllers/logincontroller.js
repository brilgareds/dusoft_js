
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('logincontroller', ['$scope', 'User',
        function($scope, User) {

            console.log("init login controller");

            $scope.autenticar = function(nombre, password) {


                User.nombre = nombre;
                User.password = password;

                console.log(User.nombre + " " + User.password);

                window.location = "../pedidos/";
            }


        }]);
});