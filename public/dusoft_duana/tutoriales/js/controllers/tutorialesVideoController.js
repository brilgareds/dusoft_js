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

                    url: "../../../../stylesheets/videoTutoriales/videogular.css"
                }
            };            
            $scope.close = function(){
                $modalInstance.close();
            
            }
        }                        
    ])

});