define(["angular", "js/controllers",
    "models/EmpresaInduccion",
    "models/CentroUtilidadesInduccion",
    "models/BodegasInduccion",
    "models/ProductoInduccion"], function(angular, controllers) {

    controllers.controller('InduccionDetalleController',
            ['$scope', '$rootScope', 'Usuario', "Request",
                "localStorageService", "$modal",
                "API", "EmpresaInduccion",
                "CentroUtilidadesInduccion", "BodegasInduccion",
                "ProductoInduccion", "AlertService","$state",
                function($scope, $rootScope, Usuario, Request,
                        localStorageService, $modal, API,
                        EmpresaInduccion, CentroUtilidadesInduccion, BodegasInduccion, ProductoInduccion, AlertService,$state) {
                            
                            
                        var that = this;    
                       // console.log(localStorageService.get("productoInduccion"))
                        $scope.detalladoProductosInduccion = localStorageService.get("productoInduccion");
                        $scope.nombres = "HOLA PRUEBA";
                        
                        $rootScope.$emit("onBuscarProducto", "fdfdffddf" );
                        
                        
                        that.init = function(){

                        };
                        
                        
                        that.init();
                        

                }]);

});
