
define([
    "angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/HabilitarModulosEmpresaController",
    "models/Modulo/Modulo"
], function(angular, controllers) {

    controllers.controller('AdministracionModulosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "$timeout", "AlertService", "Usuario", "$modal","Modulo",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, Usuario, $modal, Modulo) {

            
            
            $scope.rootModulos = {
                
            };
            
            $scope.rootModulos.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            
            $scope.rootModulos.moduloACrear = {
                moduloPadre :undefined
            };
            
            $scope.rootModulos.iconos = [
                {clase:'glyphicon glyphicon-file', nombre:'Archivo'},
                {clase:'glyphicon glyphicon-list-alt', nombre:'Lista'}
            ];
                        
            
            $scope.listado_opciones = {
                data: '[]',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_opcion', displayName: 'Nombre Opcion'},
                    {field: 'alias', displayName: 'Alias'}
                ]

            };
            
            //se carga los modulos despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                       
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_MODULOS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log(Modulo);
                        var datos = data.obj.modulos;
                        $scope.rootModulos.modulos = [];
                        
                        for(var i in datos){
                            var modulo = Modulo.get(
                                    datos[i].id,
                                    datos[i].parent,
                                    datos[i].nombre,
                                    datos[i].url
                            );

                            $scope.rootModulos.modulos.push(modulo);
                        }
                        
                       // console.log(modulos);
                        $scope.$broadcast("datosArbolCambiados",$scope.rootModulos.modulos);

                    }

                });
            });

            //ventana para habilitar el modulo en una empresa
            $scope.onHabilitarModuloEnEmpresas = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    size: 'lg',
                    templateUrl: 'views/AdministracionModulos/Modulos/habilitarModuloEmpresa.html',
                    controller: "HabilitarModulosEmpresaController",
                    resolve: {
                    }
                };



                var modalInstance = $modal.open($scope.opts);

            };
            
            
            /*$scope.onModuloPadreSeleccionado = function(){
                console.log($scope.rootModulos.moduloACrear.moduloPadre);
            };
            */
            $scope.onCrearModulo = function(){
                console.log($scope.rootModulos.moduloACrear);
            };
            
            $scope.onSeleccionIcono = function(icono){
                console.log(icono);
                $scope.rootModulos.moduloACrear.icon = icono.clase;
            };



        }]);
});