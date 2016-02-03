
define(["angular", "js/controllers",
    "models/Index/EmpresaDocumento",
    "models/Index/DocumentoBodega"
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
        "EmpresaDocumento",
        "DocumentoBodega",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Empresa, Documento, Sesion) {

            var that = this;          

            $scope.Empresa = Empresa;

            //se valida que el usuario tenga centro de utilidad y bodega
            var empresa = Sesion.getUsuarioActual().getEmpresa();

            if (!empresa) {
                $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar una Empresa", tipo: "warning"});
            } else if (!empresa.getCentroUtilidadSeleccionado()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar un Centro de Utilidad", tipo: "warning"});
            } else if (!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar una Bodega", tipo: "warning"});
            }

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                termino_busqueda_documentos: "",
                documentos_salida: [],
                documentos_entrada: [],
                documentos_ajustes: [],
                documentos_traslado: []
            };


            $scope.consultar_listado_documentos_usuario = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_documento: ''
                        }
                    }
                };

                Request.realizarRequest(API.INDEX.LISTA_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {

                    $scope.datos_view.response = data;

                    if (data.status === 200) {

                        that.render_documentos(data.obj.movimientos_bodegas);

                        $scope.datos_view.documentos_salida = $scope.Empresa.get_documentos_salida();
                        $scope.datos_view.documentos_entrada = $scope.Empresa.get_documentos_entrada();
                        $scope.datos_view.documentos_ajustes = $scope.Empresa.get_documentos_ajuste();
                        $scope.datos_view.documentos_traslado = $scope.Empresa.get_documentos_traslado();                                               
                    }
                });
            };

            that.render_documentos = function(documentos) {

                $scope.Empresa.limpiar_documentos();

                documentos.forEach(function(data) {

                    var documento = Documento.get(data.bodegas_doc_id, data.prefijo);
                    documento.set_empresa(data.empresa_id).set_centro_utilidad(data.centro_utilidad).set_bodega(data.bodega);
                    documento.set_tipo_movimiento(data.tipo_movimiento).set_tipo(data.tipo_doc_bodega_id).set_tipo_clase_documento(data.tipo_clase_documento);
                    documento.set_descripcion(data.descripcion);
                    
                    $scope.Empresa.set_documentos(documento);
                });
            };

            $scope.gestionar_documento = function(documento) {
              
                var result = $state.get().filter(function(obj) {
                    return obj.name === documento.get_tipo();
                });

                if (result.length > 0) {
                    
                    var datos = { bodegas_doc_id : documento.get_bodegas_doc_id(), prefijo : documento.get_prefijo(), numero : documento.get_numero()}
                    localStorageService.add("documento_bodega_" + documento.get_tipo(), datos);
                    
                    $state.go(documento.get_tipo());
                } else
                    AlertService.mostrarMensaje("warning", 'El modulo [ ' + documento.get_tipo() + '-' + documento.get_descripcion() + ' ] aun no esta disponible en esta version!!!');

            };

            $scope.consultar_listado_documentos_usuario();
        }]);
});