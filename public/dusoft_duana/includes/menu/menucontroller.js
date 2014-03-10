define(["angular", "js/controllers", "treemenu"], function(angular, controllers) {

    controllers.controller('menucontroller', ['$scope', '$rootScope', "$state",
        function($scope, $rootScope, $state) {

            $scope.$on("nodeSelected", function(e, data) {

                console.log(data);

                var parent = data.parent;
                var url = data.url;

                //se valida si tiene una url
                if (url !== undefined || (url && url.length > 0)) {
                    //se valida si es un padre
                    if (isNaN(parent)) {
                        url = "../" + url;
                        console.log(url)
                        $scope.changelocation(url);
                    } else {
                        //si no posee la propiedad parentname se coloca por default el nombre del modulo actual
                        var parentname = (data.parentname == undefined) ? $rootScope.name : data.parentname;

                        if ($rootScope.name == parentname) {
                            $state.go(data.url);
                        } else {
                            url = "../" + parentname + "/#/" + url;
                            $scope.changelocation(url);

                        }

                    }
                } else {
                    console.log("No se encontro el url");
                }



            });


            $scope.changelocation = function(url) {
                //el window location no deja setear el estado del menu por eso se debe cambiar con una milesima despues de hacer click
                var timer = setTimeout(function() {
                    window.location = url;
                    clearTimeout(timer);
                }, 100);
            }

            $scope.treedata = [
                {"id": "1", "parent": "#", "text": "Administracion de Pedidos", "url": "pedidos"},
                {"id": "2", "parent": "1", "text": "Creacion De Pedidos", "url": "creacionpedidos"},
                {"id": "3", "parent": "2", "text": "Clientes", "url": "clientes", "parentname": "pedidos"},
                {"id": "4", "parent": "2", "text": "Farmacia", "url": "route1", "parentname": "pedidos"},
                {"id": "5", "parent": "1", "text": "Asignacion Pedidos", "url": "AsignarPedidos", "parentname": "pedidos"},
                {"id": "6", "parent": "1", "text": "Auditoria De Pedidos"},
                {"id": "7", "parent": "#", "text": "Parametrizacion"},
                {"id": "8", "parent": "7", "text": "Parametrizacion de Usuarios", "url": ""},
                {"id": "9", "parent": "8", "text": "Usuarios del Sistema"},
                {"id": "10", "parent": "8", "text": "Usuarios Dpto Ventas"},
                {"id": "11", "parent": "8", "text": "Operarios de Bodega", "url": "OperariosBodega", "parentname": "parametrizacion"},
                {"id": "12", "parent": "#", "text": "Kardex", "url": "kardex"},
                {"id": "13", "parent": "12", "text": "Kardex", "url": "kardex", "parentname":"kardex", "url":"listarproductos.verkardex"}

            ]


            $scope.titulo = "Menu de navegacion";
        }]);
});