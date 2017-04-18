
define(["angular", "js/controllers"], function(angular, controllers) {

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
        "GeneralService",
        "TipoDocumentos",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Empresa, Documento, Sesion,GeneralService,TipoDocumentos) {

            var that = this;    
            $scope.claseDoc;

            $scope.Empresa = Empresa;
            $scope.terminoBusqueda="";

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
            
            $scope.seleccionarDocumentoEvento = function($event,terminoBusqueda){
                console.log("termono",terminoBusqueda);
                console.log("$event.which ",$event.which);
                
                if ($event.which === 13) {
                 $scope.terminoBusqueda=terminoBusqueda;
                }
                if($scope.tipoDocumento.tipo.tipo !== undefined){
                 that.listarDocumetosTemporales();
                }
            };
            
            $scope.seleccionarDocumento = function(){                
                if($scope.tipoDocumento.tipo.tipo !== undefined){
                 that.listarDocumetosTemporales();
                }
            };
            
            that.listarDocumetosTemporales=function(){

    var obj = {
                    session: $scope.session,
                    data: {
                              empresaId : Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                              centroUtilidadId : Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                              bodegaId : Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                              tipoDocGeneralId : $scope.tipoDocumento.tipo.tipo,
                              invTipoMovimiento : $scope.claseDoc,
                              numeroDocumento : $scope.terminoBusqueda
                       }
                };

                Request.realizarRequest(API.INDEX.LISTAR_DOCUMENTOS_TEMPORALES, "POST", obj, function(data) {  
                    if (data.status === 200) {
                        $scope.documentosTemorales=data.obj.obtenerDocumetosTemporales;
                    }
                });
            };
            
             $scope.listaDocumentosTemporales = {
                data: 'documentosTemorales',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'tipo_movimiento', displayName: 'Clase de Documento', width: "10%"},
                    {field: 'tipo_doc_bodega_id', displayName: 'Tipo Doc', width: "10%"},
                    {field: 'doc_tmp_id', displayName: 'No. Doc', width: "10%"},
                    {field: 'orden', displayName: 'Orden', width: "10%"},
                    {field: 'tipo_clase_documento', displayName: 'Descripción', width: "30%"},
                    {field: 'nombre', displayName: "Usuario", width: "20%"},
                    {field: 'fecha_registro', displayName: "Fecha", cellFilter: "date:\'dd-MM-yyyy\'", width: "5%"},
                    {width: "5%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                           <div ng-if="validarDelete(row.entity.usuario_id)">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_eliminar_documento(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                           </div>\
                                        </div>'}
                ]
            };
            
             $scope.btn_eliminar_documento = function(data) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            console.log("datadatadatadata",data);
                            if(data.tipo_doc_bodega_id==="I002"){
                            that.eliminarGetDocTemporal(data);
                            }
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            that.eliminarGetDocTemporal = function(datos) {
                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: datos.orden,
                        doc_tmp_id: datos.doc_tmp_id
                    }
                };
             
                GeneralService.eliminarGetDocTemporal(obj, function(data) {
                     if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            
            $scope.validarDelete = function(usuario){
                var disabled = false;
                if($scope.session.usuario_id === usuario){
                   disabled = true;
                }
                return disabled;
            };
            
            $scope.onBuscar = function(claseDoc){
              that.getTiposDocumentosBodegaUsuario(claseDoc);
              $scope.claseDoc=claseDoc;
            };
            
           that.getTiposDocumentosBodegaUsuario=function(claseDoc){
                  
            var obj = {
                    session: $scope.session,
                    data: {
                       
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            invTipoMovimiento: claseDoc
                        
                    }
                };

                Request.realizarRequest(API.INDEX.GET_TIPOS_DOCUMENTOS_BODEGA_USUARIO, "POST", obj, function(data) { 
                    if (data.status === 200) {
                       that.renderTipoDocumento(data.obj.getTiposDocumentosBodegaUsuario);
                    }
                });
            };
            
            that.renderTipoDocumento=function(tipoDocumento){
                var tipoDocumentos = [];           
                tipoDocumento.forEach(function(data) {
                     var _tipoDocumento = TipoDocumentos.get(data.tipo_doc_bodega_id,data.tipo_clase_documento);
                     tipoDocumentos.push(_tipoDocumento);
                });   
                console.log("tipoDocumentos::",tipoDocumentos);
                $scope.tipoDocumento = tipoDocumentos;
                
            };
            
    

            $scope.consultar_listado_documentos_usuario();
        }]);
});