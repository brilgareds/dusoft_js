define(["angular",
    "js/controllers",
    'includes/Constants/Url', 'includes/classes/Lote'], function(angular, controllers) {

    controllers.controller('ChatController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'CentroUtilidad', 'Bodega',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", 'URL',
        '$filter', '$timeout',
        function($scope, $rootScope, Request,
                Empresa, CentroUtilidad, Bodega,
                API, socket, AlertService, $state, Usuario,
                localStorageService, URL, 
                $filter, $timeout) {

            var self = this;

            /*
             * @Author: Eduar
             * +Descripcion: Definicion del objeto que contiene los parametros del controlador
             */
            $scope.rootLogsPedidos = {
                session: {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                },
                productos:[]
            };
            
            
            $scope.rootLogsPedidos.listadoProductos = {
                data: 'rootLogsPedidos.productos',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                enableHighlighting:true,
                size:'lg',
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width:'100'},
                    {field: 'descripcion', displayName: 'Nombre'},
                    {field: 'cantidadSolicitada', displayName: 'Solicitado', width:'100'},
                    {field: 'cantidadActual', displayName: 'Modificado', width:'100'},
                    {field: 'descripcionAccion', displayName: 'Acción', width:'200'},
                    {field: 'responsable', displayName: 'Usuario', width:'200'},
                    {field: 'fechaModificacion', displayName: 'Fecha', width:'200'}

                ]

            };
            
        }]);

});
