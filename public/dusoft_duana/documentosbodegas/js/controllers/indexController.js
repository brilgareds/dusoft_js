
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('indexController', [
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
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Sesion) {

            var that = this;
            
            console.log('============= Indexcontroller =====', $state.get());

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                termino_busqueda_documentos : "",
                documentos_salida: [],
                documentos_entrada: [],
                documentos_ajustes: [],
                documentos_traslado: [],
            };


            $scope.consultar_listado_documentos_usuario = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: '1 ',
                            bodega_id: '03',
                            tipo_documento: ''
                        }
                    }
                };

                Request.realizarRequest(API.INDEX.LISTA_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {

                    $scope.datos_view.response = data;

                    if (data.status === 200) {
                        var documentos_bodegas = data.obj.movimientos_bodegas;

                        documentos_bodegas.forEach(function(documento) {

                            if (documento.tipo_doc_bodega_id === 'E007' || documento.tipo_doc_bodega_id === 'E008' || documento.tipo_doc_bodega_id === 'E012' ||
                                    documento.tipo_doc_bodega_id === 'E012' || documento.tipo_doc_bodega_id === 'NC01' || documento.tipo_doc_bodega_id === 'ND01') {
                                $scope.datos_view.documentos_salida.push(documento)
                            }

                            if (documento.tipo_doc_bodega_id === 'I001' || documento.tipo_doc_bodega_id === 'I002' || documento.tipo_doc_bodega_id === 'I004' ||
                                    documento.tipo_doc_bodega_id === 'I005' || documento.tipo_doc_bodega_id === 'I006' || documento.tipo_doc_bodega_id === 'I007') {
                                $scope.datos_view.documentos_entrada.push(documento)
                            }
                            
                            if (documento.tipo_doc_bodega_id === 'E003' || documento.tipo_doc_bodega_id === 'I003') {
                                $scope.datos_view.documentos_ajustes.push(documento)
                            }
                            
                            if (documento.tipo_doc_bodega_id === 'T001' || documento.tipo_doc_bodega_id === 'T004') {
                                $scope.datos_view.documentos_traslado.push(documento)
                            }
                        });
                        
                        // Emitir Evento
                        $rootScope.$emit("onDocumentosBodegas", documentos_bodegas);
                    }
                });
            };
            
            $scope.gestionar_documento = function(documento){
              console.log('======= gestionar_documento ======');  
              console.log(documento);
              $state.go(documento.tipo_doc_bodega_id);
            };

            $scope.consultar_listado_documentos_usuario();

        }]);
});