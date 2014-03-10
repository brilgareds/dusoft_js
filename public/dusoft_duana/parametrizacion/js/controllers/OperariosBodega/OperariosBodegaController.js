
define(["angular", "js/controllers", "controllers/OperariosBodega/AdministracionController"], function(angular, controllers) {

    controllers.controller('OperariosBodegaController', ['$scope', '$rootScope', '$http', '$modal', 'API',
        "socket", "$timeout", "Operario", "AlertService",
        function($scope, $rootScope, $http, $modal, API, socket, $timeout, Operario, AlertService) {
            $scope.termino_busqueda = "";
            $scope.operarios = [];

            $scope.listarOperarios = function(url, termino, callback) {
                $http({method: 'GET', url: url, params: {termino_busqueda: termino}}).success(function(data, status, headers, config) {                   
                    callback(data.obj);
                }).error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };

            $scope.buscarOperario = function(termino_busqueda) {
                $scope.listarOperarios(API.TERCEROS.LISTAR_OPERARIOS, termino_busqueda, function(data) {
                    $scope.renderOperariosBodega(data);
                });
            };


            $scope.renderOperariosBodega = function(data) {

                $scope.operarios = [];
                
                for (var i in data.lista_operarios) {

                    var obj = data.lista_operarios[i];
                    var operario = Operario.get(obj.operario_id, obj.nombre_operario, obj.estado, obj.descripcion_estado, obj.usuario_id, obj.descripcion_usuario);

                    $scope.operarios.push(operario);
                }
            };

            $scope.onKeyPress = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscarOperario(termino_busqueda);
                }
            };

            //definicion y delegados del Tabla de pedidos clientes
            $scope.lista_operarios_bodega = {
                data: 'operarios',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_operario', displayName: 'Nombre Operario'},
                    {field: 'descripcion_estado', displayName: 'Estado'},
                    {field: 'descripcion_usuario', displayName: 'Login Usuario'},
                    {field: '', displayName: "Opciones", cellClass: "txt-center",
                        cellTemplate: '<div><button type="button" class="btn btn-default btn-xs" ng-click="administrarOperarioBodega(row.entity, 1)"><span class="glyphicon glyphicon-pencil"></span> Editar </button></div>'}
                ]
            };



            // Opciones de la ventana Modal
            $scope.administrarOperarioBodega = function(operario, accion) {
                
                // Accion = 0 -> Crear
                // Accion = 1 -> Modificar
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/OperariosBodega/gestionarOperarios.html',
                    controller: "AdministracionController",
                    resolve :{
                          operario : function(){
                              return operario;
                          },
                          accion : function(){
                              return accion;
                          }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
            };
            
             $rootScope.$on("listarOperariosBodega", function(e, data) {
                 $scope.buscarOperario("");
             });

            $scope.buscarOperario("");

        }]);
});