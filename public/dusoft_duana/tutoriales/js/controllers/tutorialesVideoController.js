define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('tutorialesVideoController',['$scope', '$rootScope', 'AlertService', 'Usuario', "$timeout",
            "$filter", "localStorageService",
            "$state", "$modalInstance",
            "socket",
            "API", "urlTutorial", "$sce",
        function ($scope, $rootScope, AlertService, Usuario, $timeout,
                $filter, localStorageService, $state, $modalInstance, socket, API, urlTutorial, $sce) {

            $scope.config = {
                preload: "none",
                sources: [
                    {src: $sce.trustAsResourceUrl(urlTutorial), type: "video/mp4"}
                ],
                tracks: [
                    {
                        src: "pale-blue-dot.vtt",
                        kind: "subtitles",
                        srclang: "en",
                        label: "English",
                        default: ""
                    }
                ],
                theme: {

                    url: "http://localhost:3000/Tutoriales/styles/themes/default/videogular.css?c=dusoft"
                }
            };
            
            $scope.close = function(){
                $modalInstance.close();
            
            }

        }
        
        
        
    ])

});