define(["angular", 
    "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('GuardarTerceroController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal","GestionTercerosService",
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal, GestionTercerosService) {
                     
            var self = this;
            
            $scope.root = {
                tabActual : 0,
                tiposNaturaleza:[
                    {
                        codigo:"0",
                        descripcion:"Natural"
                    },
                    {
                        codigo:"1",
                        descripcion:"Juridica"
                    }
                ],
                tabs: [false, false, false],
                session : {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                }
            };
            
            $scope.listaContactos = {
                data: 'usuarios',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: true,
                columnDefs: [
                    {field: 'nombre_usuario', displayName: 'Nombre'},
                    {field: 'usuario', displayName: 'Correo'},
                    {field: 'usuario', displayName: 'Tipo'}
                ]

            };
            
            
            $scope.root.tipoNaturaleza =  $scope.root.tiposNaturaleza[0];
           
            /**
            * @author Eduar Garcia
            * +Descripcion Permite obtener los parametros de los dropdown
            * @fecha 2017-03-17
            */
            self.gestionarParametrosTerceros = function(){
                
                var parametros = {
                    session:$scope.root.session,
                    data:{}
                };
                
                GestionTercerosService.obtenerParametrizacionTerceros(parametros,function(){
                
                });
                
                GestionTercerosService.obtenerPaises(parametros,function(){
                
                });
  
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler de los tabs del formulario de clientes, es tambien llamado por el boton siguiente
            * @params obj: {tab}
            * @fecha 2017-03-15
            */
            $scope.onTabChange = function(tab){
                $scope.root.tabActual = tab;
                
                for(var _tab in $scope.root.tabs){   
                    if(parseInt(_tab) === parseInt(tab)){
                        $scope.root.tabs[_tab] = true;
                    } else {
                        $scope.root.tabs[_tab] = false;
                    }
                }                
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de siguiente
            * @fecha 2017-03-15
            */
            $scope.onBtnSiguiente = function(){
                $scope.root.tabActual++;
                $scope.onTabChange($scope.root.tabActual);
            };  
            
            $scope.onCambiarNaturaleza = function(){
                console.log("tipo naturaleza ", $scope.root.tipoNaturaleza);
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de cancelar
            * @fecha 2017-03-15
            */
            $scope.onBtnCancelar = function(){
                $state.go("Terceros");
            };
            
            self.gestionarParametrosTerceros();
            

        }]);
        
});
