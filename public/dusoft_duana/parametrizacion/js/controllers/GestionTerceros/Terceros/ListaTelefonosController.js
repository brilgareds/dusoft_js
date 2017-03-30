define(["angular", 
    "js/controllers"], function(angular, controllers) {

    controllers.controller('ListaTelefonosController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        '$modalInstance','tercero',
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal,
                 $modalInstance, tercero) {
                     
            var self = this;
            console.log("tercero ", tercero)
            
            $scope.root = {
                tercero:tercero
            };
            
            var self = this;
            
            
            $scope.listaTelefonos = {
                data: 'root.tercero.getTelefonos()',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'getNumero()', displayName: 'Número'},
                    {field: 'getTipoTelefono().getDescripcion()', displayName: 'Tipo teléfono'},
                    {field: 'getTipoLineaTelefonica().getDescripcion()', displayName: 'Tipo de línea'},
                    {field: 'opciones', displayName: "", cellClass: "txt-center dropdown-button", width: "70", 
                        cellTemplate: '\
                                        <div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onEditarTelefono(row.entity)">Editar</a>\
                                            </li>\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onRemoverTelefono(row.entity)">Remover</a>\
                                            </li>\
                                        </ul>\
                                    </div>'
                    }
                ]

            };
            
            $scope.onEditarTelefono = function(telefono){
                $scope.root.tercero.setTelefonoSeleccionado(telefono);
                $scope.onCerrar();
            };
            
            $scope.onRemoverTelefono = function(telefono){
                var telefonos = $scope.root.tercero.getTelefonos();
                
                telefonos.splice(telefonos.indexOf(telefono), 1);
                
            };
            
            $scope.onCerrar = function(){
                $modalInstance.close();
            };
        
        }]);
        
});
