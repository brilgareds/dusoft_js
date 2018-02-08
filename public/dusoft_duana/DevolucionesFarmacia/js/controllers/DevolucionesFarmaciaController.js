define(["angular", "js/controllers", 'includes/slide/slideContent'], function (angular, controllers) {

    controllers.controller('DevolucionesFarmaciaController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'CentroUtilidadInduccion', 'BodegaInduccion', 'ProductoInduccion', 'AprobacionDespacho',
                "$timeout", "$filter", "localStorageService", "$state", "ValidacionDespachosService",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        CentroUtilidadInduccion, BodegaInduccion, ProductoInduccion, AprobacionDespacho,
                        $timeout, $filter, localStorageService, $state, ValidacionDespachosService) {

                    var that = this;
                }]);
});