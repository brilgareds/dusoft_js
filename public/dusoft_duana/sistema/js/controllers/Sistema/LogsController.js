
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('LogsController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout", "ErrorLog", "Version",
        function($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, ErrorLog, Version) {

            $scope.archivos = [];
            $scope.versiones = [];
            $scope.sincronizado = false;
            $scope.paginaactual = 1;

			$scope.descargar = function(archivo){
				window.open("/logs/" + archivo, "_blank");
			};

            $scope.paginaSiguiente = function(){
                $scope.paginaactual++;
                Version.getListaVersiones($scope.paginaactual, function(versiones){
                    $scope.versiones = versiones;
                });
            };

            $scope.paginaAnterior = function(){
                $scope.paginaactual--;
                Version.getListaVersiones($scope.paginaactual, function(versiones){
                    $scope.versiones = versiones;
                });
            };

        	//Recupera la lista de archivos log que se encuentran en /public/logs
            ErrorLog.getListaErrorLog(function(archivos){
                $scope.archivos = archivos;
            });

            //Obtiene los datos iniciales de la grilla Logs de Version
            Version.getListaVersiones($scope.paginaactual ,function(versiones){
                $scope.versiones = versiones;
            });
           
            //Obtiene los datos iniciales de la grilla Logs de Version
            Version.verificarSincronizacion(function(sincronizacion){
                $scope.sincronizado = sincronizacion.sincronizado;
                $scope.versionDB = sincronizacion.version_db;
                $scope.versionCodigo = sincronizacion.version_codigo;
            });

            //tabla Logs de version            
            $scope.data_logs = {
                data: 'versiones',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: false,
                enableHighlighting: false,
                columnDefs: [
                    {
                        displayName: "Id", 
                        field: 'id_version', 
                        cellClass: "txt-center",
                        width: "5%"
                    },
                    {
                        displayName: "Version", 
                        field: 'version', 
                        cellClass: "txt-center",
                        width: "10%"
                    },
                    {
                        displayName: 'Modulo', 
                        field: 'modulo', 
                        width: "20%"
                    },
                    {
                        displayName: 'Comentario', 
                        field: 'comentario', 
                        width: "65%"
                    }
                ]
            };

        }]);
});