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
            

            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite traer del API los lotes del productos
             */
           /* self.traerLogs = function(callback) {

                $scope.rootLogsPedidos.lotes = [];
                $scope.rootLogsPedidos.cantidadLotes = 0;

                var obj = {
                    session: $scope.rootLogsPedidos.session,
                    data: {
                        pedidos:{
                            empresa_id:empresaId,
                            numero_pedido:pedido.get_numero_pedido(),
                            tipo_pedido : tipoPedido 
                        }
                    }
                };
                Request.realizarRequest(URL.CONSTANTS.API.PEDIDOS.CONSULTAR_LOGS, "POST", obj, function(data) {
                    var valido = false;
                    if (data.status === 200) {
                        for (var i in data.obj.productos) {
                            var _producto = data.obj.productos[i];
                            var producto = Producto.get(_producto.codigo_producto, _producto.descripcion_producto);
                            producto.setDescripcionAccion(_producto.descripcion_accion);
                            producto.setResponsable(_producto.nombre);
                            producto.setCantidadSolicitada(_producto.cantidad_solicitada);
                            producto.setCantidadActual(_producto.cantidad_actual);
                            producto.setFechaModificacion(_producto.fecha_registro);
                            $scope.rootLogsPedidos.productos.push(producto);
                        }
                        
                        valido = true;
                    }
                    
                    if (callback)
                         callback(valido);

                });

            };*/


            /*
             * @Author: Eduar
             * +Descripcion: Libera recursos del watch de angular
             */
           /* self.finalizar = function(){
               console.log("finalizando ventana");
               //Timer para no impedir la animacion de la ventana
               $timeout(function(){
                    $scope.rootLogsPedidos = {};
                    $scope.$$watchers = null;
                   
               }, 1000);
            };*/
            
            console.log(">>>>>>>>>>>>>>>>>>>>>>>> chat dusoft controller init");
            


        }]);

});
