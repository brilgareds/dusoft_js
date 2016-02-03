
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {
    //probando branch de pedidos clientes
    controllers.controller('ValidacionDespachoControllerDetalleController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "$filter",
        "Usuario","AprobacionDespacho",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                 Sesion,AprobacionDespacho) {

            var that = this;
            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };
         
            // Definicion variables del View
            $scope.datos_view = {
                termino_busqueda_clientes: '',
                termino_busqueda_productos: '',
                activar_tab: {tab_productos: true, tab_cargar_archivo: false},
                visualizar: false,
                // Opciones del Modulo 
                opciones: Sesion.getUsuarioActual().getModuloActual().opciones,
                progresoArchivo: 0,
                btnSolicitarAutorizacionCartera: true

            };
            $scope.notificacionPedidoAutorizar = 0;
            that.consultarEstadoPedidoCotizacion = function(tipo, numero) {

                var url = '';
                var obj = {};

                if (tipo === 1) {

                    url = API.PEDIDOS.CLIENTES.CONSULTAR_ESTADO_PEDIDO;
                    obj = {
                        session: $scope.session,
                        data: {pedidos_clientes: {pedido: numero}}
                    };

                }

                if (tipo === 2) {

                    url = API.PEDIDOS.CLIENTES.CONSULTAR_ESTADO_COTIZACION;
                    obj = {
                        session: $scope.session,
                        data: {pedidos_clientes: {cotizacion: numero}}
                    };

                }
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                      
                    }
                });
            };
            $scope.items = null;
          
            
            
            $scope.documentoDespachoAprobado;
            //Cotizacion
            //if (localStorageService.get("cotizacion")) {
            if ($state.is("ValidacionEgresosDetalle") === true) {
                
              
                var documento = localStorageService.get("validacionEgresosDetalle");
                var prefijo = 0;
                var numero = 0;
                var cantidadCajas = 0;
                var cantidadNeveras = 0;
                var observacion = "";
                var fechaRegistro = 0;
                console.log("documentoAprobado ", documento)
                if (documento) {
                    prefijo = documento.documentoAprobado.prefijo || 0;
                    numero =  documento.documentoAprobado.numero || 0;
                    cantidadCajas =  documento.documentoAprobado.cantidadCajas || 0;
                    cantidadNeveras =  documento.documentoAprobado.cantidadNeveras || 0;
                    observacion =    documento.documentoAprobado.observacion || 0;
                    fechaRegistro =  documento.documentoAprobado.fecha_registro || 0;
                }
               $scope.documentoDespachoAprobado= AprobacionDespacho.get(1,prefijo,numero,fechaRegistro)
               $scope.documentoDespachoAprobado.setCantidadCajas(cantidadCajas);
               $scope.documentoDespachoAprobado.setCantidadNeveras(cantidadNeveras);
               $scope.documentoDespachoAprobado.setObservacion(observacion);
                /*
                 * +Descripcion: Se consulta el estado de la cotizacion
                 */
            //    that.consultarEstadoPedidoCotizacion(2, cotizacion.numero_cotizacion);


                //} else if (localStorageService.get("pedido")) {
            }

           
           
          
           $scope.regresarListaDespachosAprobados = function() {
             
                $state.go('ValidacionEgresos');
            };
          
         
            

            that.init = function() {

            };


         
            that.init();


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;


                // set localstorage
                localStorageService.add("validacionEgresosDetalle", null);
                localStorageService.add("pedido", null);
               // localStorageService.get("validacionEgresosDetalle", null);

                //socket.removeAllListeners();
                // datos view
                //$scope.datos_view = null;
            });
        }]);
});