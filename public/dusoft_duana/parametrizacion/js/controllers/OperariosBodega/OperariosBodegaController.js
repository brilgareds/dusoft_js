
define(["angular", "js/controllers", "controllers/OperariosBodega/AdministracionController"], function(angular, controllers) {

    controllers.controller('OperariosBodegaController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "Operario", "AlertService", "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, Operario, AlertService, Usuario) {
            $scope.termino_busqueda = "";
            $scope.operarios = [];

            
            
            $scope.session = { usuario_id: Usuario.usuario_id, auth_token: Usuario.token };
            
            $scope.buscarOperario = function(termino_busqueda) {
                Request.realizarRequest(API.TERCEROS.LISTAR_OPERARIOS, "POST", {session: $scope.session, data: { lista_operarios : { termino_busqueda: termino_busqueda } }}, function(data) {                
                    $scope.renderOperariosBodega(data);
                });
            };


            $scope.renderOperariosBodega = function(data) {

                $scope.operarios = [];
                
                for (var i in data.obj.lista_operarios) {

                    var obj = data.obj.lista_operarios[i];
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
                multiSelect: false,
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