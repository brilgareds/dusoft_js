
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
            $scope.termino_busquedaTmp="";
            $scope.ultima_busqueda = "";
            $scope.termino = "";
            $scope.paginaactual = 1;
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.ultima_busquedaTmp = "";
            $scope.terminoTmp = "";
            $scope.paginaactualTmp = 1;
            $scope.paginasTmp = 0;
            $scope.itemsTmp = 0;

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
            
            $scope.btn_documento= function(valor){
              that.gestionarDocumentoSeleccionado(valor);
            };

            that.gestionarDocumentoSeleccionado = function(documento) {
           
                var result = $state.get().filter(function(obj) {
                    return obj.name === documento.tipo_doc_bodega_id;
                });

                if (result.length > 0) {
                    var numero = documento.numero||'';
                    var datosAdicionales;
                    if(documento.tipo_doc_bodega_id==='I002'){
                         datosAdicionales = {doc_tmp : documento.doc_tmp_id,orden : documento.orden,codigo_proveedor_id:documento.codigo_proveedor_id};
                    }
                    var datos = { bodegas_doc_id : documento.bodegas_doc_id, prefijo : documento.prefijo, numero : numero, datosAdicionales : datosAdicionales};
                    localStorageService.add("documento_bodega_" + documento.tipo_doc_bodega_id, datos);
                    
                    $state.go(documento.tipo_doc_bodega_id);
                } else
                    AlertService.mostrarMensaje("warning", 'El modulo [ ' + documento.tipo_doc_bodega_id + '-' + documento.descripcion + ' ] aun no esta disponible en esta version!!!');
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
            
            $scope.seleccionarDocumentoEvento = function($event, terminoBusqueda) {

            if ($event.which === 13 || $event.which === 1) {
                $scope.termino_busquedaTmp = terminoBusqueda;
                $scope.terminoTmp = terminoBusqueda;
                if ($scope.tipoDocumento.tipo.tipo !== undefined) {
                    that.listarDocumetosTemporales(true);
                }
            }
        };
            /*
             * evento del select temporal
             */
            $scope.seleccionarDocumento = function(){   
                if($scope.tipoDocumento.tipo.tipo !== undefined){
                 that.listarDocumetosTemporales(true);
                }
            };
            
            $scope.seleccionarDocumentoCreadoEvento = function($event,terminoBusqueda){
                
                if ($event.which === 13 || $event.which === 1) {
                 $scope.terminoBusqueda=terminoBusqueda;
                 $scope.termino = terminoBusqueda;
                    if($scope.tipoDocumento.tipo.tipo !== undefined){
                    that.listarDocumentosBodegaUsuario(true);
                   }
                }                
            };
            
            $scope.seleccionarDocumentoCreado = function(){                
                if($scope.tipoDocumento.tipo.tipo !== undefined){
                 that.listarDocumentosBodegaUsuario(true);
                }
            };            
            
             $scope.listaDocumentosTemporales = {
                data: 'documentosTemorales',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
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
                                            <button class="btn btn-default btn-xs" ng-click="btn_documento(row.entity)"><span class="glyphicon glyphicon-send"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="btn_eliminar_documento(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                           </div>\
                                        </div>'}
                ]
            };
            
             $scope.listaDocumentos = {
                data: 'Documento',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'tipo', displayName: 'Tipo Movimiento', width: "8%"},
                    {field: 'tipo_movimiento', displayName: 'Doc Bod ID', width: "10%"},
                    {field: 'bodegas_doc_id', displayName: 'Doc ID', width: "10%"},
                    {field: 'prefijoNumero', displayName: 'Número', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripción', width: "25%"},
                    {field: 'observaciones', displayName: "Observación", width: "25%"},
                    {field: 'fecha_registro', displayName: "Fecha", cellFilter: "date:\'dd-MM-yyyy\'", width: "5%"},
                    {width: "7%", displayName: "Acciónes", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                           <div ">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_imprimir(row.entity)">Imprimir <span class="glyphicon glyphicon-print"></span></button>\
                                           </div>\
                                        </div>'}
                ]
            };
            
            that.crearHtmlDocumento=function(documentos,callback){

                var obj = {
                        session: $scope.session,
                        data: {
                                  empresaId : Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                                  prefijo:documentos.prefijo,
                                  numeracion:documentos.numero
                           }
                    };

                    Request.realizarRequest(API.I002.CREAR_HTML_DOCUMENTO, "POST", obj, function(data) {  
                        if (data.status === 200) {
                            console.log("QWERTY ",data);
                            callback(data);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("warning", data.msj);
                            callback(false);
                        }
                    });
            };
             
            $scope.btn_imprimir = function(documentos){
                 
                  that.crearHtmlDocumento(documentos,function(respuesta){
                      if(respuesta !== false){
                        console.log("respuesta ",respuesta);
                        $scope.visualizarReporte("/reports/" + respuesta.obj.nomb_pdf, respuesta.obj.nomb_pdf, "_blank");
                      }                      
                  });  
                  
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
              that.getTiposDocumentosBodegaEmpresa(claseDoc);
              $scope.claseDoc=claseDoc;
            };
            
           that.getTiposDocumentosBodegaEmpresa=function(claseDoc){
                  
            var obj = {
                    session: $scope.session,
                    data: {
                            empresa_id:Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            invTipoMovimiento: claseDoc                        
                    }
                };

                Request.realizarRequest(API.INDEX.GET_TIPOS_DOCUMENTOS_BODEGA_EMPRESA, "POST", obj, function(data) { 
                    if (data.status === 200) {
                       that.renderTipoDocumento(data.obj.getTiposDocumentosBodegaEmpresa);
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
            
            that.listarDocumetosTemporales = function(paginandoTmp) {

            if ($scope.ultima_busquedaTmp !== $scope.terminoTmp) {
                $scope.paginaactualTmp = 1;
            }

            var obj = {
                session: $scope.session,
                data: {
                    empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                    centroUtilidadId: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                    bodegaId: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                    tipoDocGeneralId: $scope.tipoDocumento.tipo.tipo,
                    invTipoMovimiento: $scope.claseDoc,
                    numeroDocumento: $scope.termino_busquedaTmp,
                    paginaActual: $scope.paginaactualTmp
                }
            };

            Request.realizarRequest(API.INDEX.LISTAR_DOCUMENTOS_TEMPORALES, "POST", obj, function(data) {
                if (data.status === 200) {

                    $scope.itemsTmp = data.obj.obtenerDocumetosTemporales.length;

                    //                se valida que hayan registros en una siguiente pagina
                    if (paginandoTmp && $scope.itemsTmp === 0) {
                        if ($scope.paginaactualTmp > 1) {
                            $scope.paginaactualTmp--;
                        }
                        AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                        return;
                    }

                    $scope.paginasTmp = (data.obj.obtenerDocumetosTemporales.length / 10);
                    $scope.itemsTmp = data.obj.obtenerDocumetosTemporales.length;

                    $scope.documentosTemorales = data.obj.obtenerDocumetosTemporales;
                }
            });
        };
            
           that.listarDocumentosBodegaUsuario=function(paginando){
               
             if ($scope.ultima_busqueda !== $scope.termino) {
                    $scope.paginaactual = 1;
                }   
                  
            var obj = {
                    session: $scope.session,
                    data: {
                            empresaId : Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            centroUtilidadId : Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodegaId : Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipoDocGeneralId : $scope.tipoDocumento.tipo.tipo,
                            invTipoMovimiento : $scope.claseDoc,
                            numeroDocumento : $scope.terminoBusqueda,
                            paginaActual: $scope.paginaactual
                    }
                };

                Request.realizarRequest(API.INDEX.GET_DOCUMENTOS_BODEGA_USUARIO, "POST", obj, function(data) { 
                    if (data.status === 200) {
                        $scope.ultima_busqueda = $scope.termino;
                       that.renderDocumento(data.obj.getDocumentosBodegaUsuario,paginando);
                    }
                });
            };
            
            that.renderDocumento=function(documentos,paginando){
                var allDocumentos = [];      
                
                $scope.items = documentos.length;
                
//                se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.paginas = (documentos.length / 10);
                $scope.items = documentos.length;
                
                
                documentos.forEach(function(data) {
                    var doc= Documento.get(data.documento_id,data.prefijo,data.numero,data.fecha_registro);
                     doc.set_tipo(data.tipo_movimiento);
                     doc.set_tipo_movimiento(data.tipo_doc_bodega_id);
                     doc.set_descripcion(data.descripcion);
                     doc.set_observaciones(data.observacion);
                     doc.setPrefijoNumero(data.prefijo+'-'+data.numero);
                     var nomb_pdf = "documentoI002" + data.prefijo + data.numero + ".html";  
                     doc.setArchivo(nomb_pdf);
                     allDocumentos.push(doc);
                });   
                $scope.Documento=allDocumentos;
            };
            
              /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
             $scope.paginaAnterior = function() {
                if($scope.paginaactual === 1) return;
                $scope.paginaactual--;
                that.listarDocumentosBodegaUsuario(true);
            };
            
            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                that.listarDocumentosBodegaUsuario(true);
            };
            
              /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
             $scope.paginaAnteriorTmp = function() {
                if($scope.paginaactualTmp === 1) return;
                $scope.paginaactualTmp--;
                that.listarDocumetosTemporales(true);
            };
            
            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
            $scope.paginaSiguienteTmp = function() {
                $scope.paginaactualTmp++;
                that.listarDocumetosTemporales(true);
            };
            
            
    

            $scope.consultar_listado_documentos_usuario();
        }]);
});