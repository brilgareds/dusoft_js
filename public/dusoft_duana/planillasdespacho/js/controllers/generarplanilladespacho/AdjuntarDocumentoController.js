
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('AdjuntarDocumentoController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "$timeout",
        "AlertService",
        "$modalInstance",
        "$state",
        "ClientePlanillaDespacho",
        "FarmaciaPlanillaDespacho",
        "Documento",
        "Usuario",
        "OtrasSalidasPlanillaDespacho",
        "documentoLio",
        "numeroGuia",
        function ($scope, $rootScope, Request, $modal, API, $timeout, AlertService, $modalInstance, $state, ClientePlanilla,
                FarmaciaPlanilla, Documento, Sesion, OtrasSalidasPlanillaDespacho, documentoLio, numeroGuia) {

            var that = this;

            $scope.datos_view = {
                opcion_predeterminada: documentoLio.tipo, // 0 = farmacias 1 = clientes 2 = Otras Empresas
                termino_busqueda: documentoLio.tipo === '2' ? documentoLio.prefijo : documentoLio.tercero, //'',
                termino_busqueda_documentos: '',
                mostrarTercero: false,
                despachoPorLios: true,
                tercero_seleccionado: FarmaciaPlanilla.get(),
                documento_seleccionado: Documento.get()
            };

            $scope.datos_clientes_farmacias = [];
            $scope.datos_view.documentosSeleccionados = [];


            $scope.buscador_cliente_farmacia = function (ev) {

                if (ev.which == 13) {
                    $scope.seleccionar_cliente_farmacia();
                }
            };

            $scope.buscador_documentos = function (ev) {

                if (ev.which == 13) {
                    $scope.buscar_documentos_bodega($scope.datos_view.tercero_seleccionado);
                }
            };

            $scope.seleccionar_cliente_farmacia = function () {

                $scope.datos_view.tercero_seleccionado.limpiar_documentos();

                $scope.datos_view.termino_busqueda_documentos = '';
                $scope.datos_view.documento_seleccionado = Documento.get();

                if ($scope.datos_view.opcion_predeterminada === "0") {
                    $scope.datos_view.mostrarTercero = false;
                    that.buscar_farmacias();
                }

                if ($scope.datos_view.opcion_predeterminada === "1") {
                    $scope.datos_view.mostrarTercero = false;
                    that.buscar_clientes();
                }

                if ($scope.datos_view.opcion_predeterminada === "2") {
                    $scope.datos_view.mostrarTercero = true;
                    that.listarDocumentosOtrasSalidas();
                }

            };

            that.buscar_clientes = function () {


                var obj = {
                    session: $scope.session,
                    data: {
                        clientes: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            pais_id: 'CO',
                            departamento_id: '76',
                            ciudad_id: '001',
                            estado: 1,
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.CLIENTES.LISTAR_CLIENTES, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_clientes(data.obj.listado_clientes);

                    }
                });
            };

            that.render_clientes = function (clientes) {

                $scope.Empresa.limpiar_clientes();

                clientes.forEach(function (data) {

                    var cliente = ClientePlanilla.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);
                    $scope.Empresa.set_clientes(cliente);
                });

                $scope.datos_clientes_farmacias = $scope.Empresa.get_clientes();

            };

            that.buscar_farmacias = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.CENTROS_UTILIDAD.LISTAR_CENTROS_UTILIDAD, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_farmacias(data.obj.centros_utilidad);

                    }
                });
            };

            that.render_farmacias = function (farmacias) {

                $scope.Empresa.limpiar_farmacias();

                farmacias.forEach(function (data) {

                    var farmacia = FarmaciaPlanilla.get(data.empresa_id, data.centro_utilidad_id, data.descripcion);
                    $scope.Empresa.set_farmacias(farmacia);
                });

                $scope.datos_clientes_farmacias = $scope.Empresa.get_farmacias();
            };


            that.listarDocumentosOtrasSalidas = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        validacionDespachos: {

                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.LISTAR_DOCUMENTOS_OTRAS_SALIDAS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderOtrasSalidas(data.obj.documentos);
                    }
                });
            };

            that.renderOtrasSalidas = function (otrasSalidas) {

                $scope.Empresa.limpiar_farmacias();

                otrasSalidas.forEach(function (data) {

                    var salida = OtrasSalidasPlanillaDespacho.get(data.prefijo);
                    $scope.Empresa.set_farmacias(salida);
                });

                $scope.datos_clientes_farmacias = $scope.Empresa.get_farmacias();
            };

            $scope.buscar_documentos_bodega = function (tercero) {

                if (tercero) {
                    that.removerTerceros(tercero);
                }
                if (tercero) {
                    $scope.datos_view.tercero_seleccionado = tercero;
                }

                if ($scope.datos_view.opcion_predeterminada === "0") {
                    that.documentos_bodega_farmacias();
                }

                if ($scope.datos_view.opcion_predeterminada === "1") {
                    that.documentos_bodega_clientes();
                }

                if ($scope.datos_view.opcion_predeterminada === "2") {
                    that.listarFarmaciasMedipol(function (result) {
                        that.documentosOtrasSalidas();
                    });
                }
            };


            that.listarFarmaciasMedipol = function (callback) {

                var url = API.CENTROS_UTILIDAD.LISTAR_FARMACIAS_TERCEROS;

                if ($scope.datos_view.tercero_seleccionado.nombre === 'LO') {
                    url = API.CENTROS_UTILIDAD.LISTAR_CENTROS_UTILIDAD;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_tercero(data.obj.centros_utilidad, callback);

                    }
                });
            };

            that.render_tercero = function (farmacias, callback) {

                $scope.Empresa.limpiar_farmacias();

                farmacias.forEach(function (data) {

                    var farmacia = FarmaciaPlanilla.get(data.empresa_id, data.bodega, data.descripcion);
                    farmacia.set_centro_utilidad(data.centro_utilidad_id);
                    $scope.Empresa.set_farmacias(farmacia);
                });

                $scope.datos_farmacias_terceros = $scope.Empresa.get_farmacias();
                callback(true);
            };

            that.documentosOtrasSalidas = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        validacionDespachos: {
                            prefijo: $scope.datos_view.tercero_seleccionado.getNombre(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.LISTAR_NUMERO_PREFIJO_OTRAS_SALIDAS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_documentos(data.obj.planillas_despachos);
                    }
                });
            };

            that.documentos_bodega_clientes = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            tipo_id: $scope.datos_view.tercero_seleccionado.getTipoId(),
                            tercero_id: $scope.datos_view.tercero_seleccionado.getId(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.LISTAR_DOCUMENTOS_CLIENTES, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_documentos(data.obj.planillas_despachos);
                    }
                });
            };

            that.documentos_bodega_farmacias = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            farmacia_id: $scope.datos_view.tercero_seleccionado.get_empresa_id(),
                            centro_utilidad_id: $scope.datos_view.tercero_seleccionado.getCodigo(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_documentos
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.LISTAR_DOCUMENTOS_FARMACIAS, "POST", obj, function (data) {

                    if (data.status === 200) {

                        that.render_documentos(data.obj.planillas_despachos);
                    }
                });
            };

            that.render_documentos = function (documentos) {

                $scope.datos_view.tercero_seleccionado.limpiar_documentos();

                documentos.forEach(function (data) {

                    var documento = Documento.get(data.id_aprobacion_planillas, data.empresa_id, data.prefijo, data.numero, data.numero_pedido);
                    documento.set_cantidad_cajas_auditadas(data.cantidad_cajas);
                    documento.set_cantidad_neveras_auditadas(data.cantidad_neveras);
                    documento.set_cantidad_bolsas_auditadas(data.cantidad_bolsas);
                    documento.tipo = data.tipo;

                    if ($scope.datos_view.despachoPorLios) {
                        var _documento = that.obtenerDocumentoSeleccionado(documento);
                        if (_documento) {
                            documento.setSeleccionado(true);
                        }
                    }
                    $scope.datos_view.tercero_seleccionado.set_documentos(documento);
                });

            };

            $scope.aceptar_documentos_bodegas = function () {

                var documentos = $scope.datos_view.documentosSeleccionados;

                if ($scope.datos_view.despachoPorLios && documentos.length > 0) {

                    that.gestionarDocumentosParaLio(documentos);

                } else if ($scope.datos_view.despachoPorLios && documentos.length === 0) {

                    AlertService.mostrarVentanaAlerta("Alerta del sistema", "Debe seleccionar por lo menos un documento para agregar al lio");

                }

            };


            /**
             * +Descripcion Metodo encargado de invocar el servicio que modifica
             *              los lios
             * @author German Galvis
             * @fecha 12/07/2019 DD/MM/YYYY
             * @returns {undefined}
             */
            that.gestionarDocumentosParaLio = function (documentos) {

                var obj = {
                    session: $scope.root.session,
                    data: {
                        planillas_despachos: {
                            documentos: documentos,
                            totalCaja: 0,
                            lio_id: documentoLio.lio_id,
                            cantidadLios: 0,
                            cantidadNeveras: 0,
                            cantidadBolsas: 0,
                            numeroGuia: numeroGuia,
                            observacion: documentoLio.observacion
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.AGREGAR_DOCUMENTOS_LIOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Se ha guardado el registro correctamente");
                        $scope.onCerrarDoc(documentos);
                    } else if (data.status === 403) {

                        AlertService.mostrarVentanaAlerta("Alerta del sistema", data.msj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Ha ocurrido un error...");
                    }

                });
            };

            that.onLiosRegistrados = $rootScope.$on("onLiosRegistrados", function () {
                $scope.buscar_documentos_bodega();
            });

            $scope.lista_clientes_farmacias = {
                data: 'datos_clientes_farmacias',
                enableColumnResize: true,
                enableRowSelection: false,

                columnDefs: [
                    {field: 'getNombre()', displayName: 'Nombre', width: "85%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <input-check   ng-model="row.entity.seleccionado" ng-change="buscar_documentos_bodega(row.entity)"/>\
                                        </div>'
                    }
                ]
            };

            $scope.lista_remisiones_bodega = {
                data: 'datos_view.tercero_seleccionado.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'lios', displayName: "", width: "40", cellClass: "txt-center dropdown-button", cellTemplate: "<div><input-check   ng-model='row.entity.seleccionado' ng-change='onAgregarDocumentoALio(row.entity)' ng-disabled='!datos_view.despachoPorLios'   /></div>"},
                    {field: 'get_id()', displayName: 'Grupo', width: "8%"},
                    {field: 'get_descripcion()', displayName: 'Doc Bodega', width: "25%"},
                    {field: 'get_tercero()', displayName: 'Cliente', width: "43%", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                     <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >{{row.entity.tercero.nombre}}<span class="caret"></span></button>\
                     <ul class="dropdown-menu dropdown-options">\
                     <li ng-repeat="farmacia in datos_farmacias_terceros">\
                     <a href="javascript:void(0)" ng-click="onSeleccionTercero(row.entity,farmacia)">{{farmacia.nombre}}</a>\
                     </li>\
                     </ul>\
                     </div>'}
                ]
            };

            $scope.lista_remisiones_bodega_1 = {
                data: 'datos_view.tercero_seleccionado.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'lios', displayName: "", width: "5%", cellClass: "txt-center dropdown-button", cellTemplate: "<div><input-check   ng-model='row.entity.seleccionado' ng-change='onAgregarDocumentoALio(row.entity)' ng-disabled='!datos_view.despachoPorLios'   /></div>"},
                    {field: 'get_id()', displayName: 'Grupo', width: "20%"},
                    {field: 'get_descripcion()', displayName: 'Doc Bodega', width: "60%"}
                ]
            };

            $scope.onSeleccionTercero = function (fila, farmacia) {


                if ($scope.datos_view.documentosSeleccionados.length > 0) {

                    var documentos = $scope.datos_view.documentosSeleccionados;

                    for (var i in documentos) {
                        var _documento = documentos[i];
                        if (_documento.tipo === '2') {
                            _documento.tercero = farmacia;
                        }
                    }
                } else {
                    fila.tercero = farmacia;
                }

            };

            $scope.onCerrar = function () {

                $modalInstance.close([]);
            };

            $scope.onCerrarDoc = function (documentos) {

                $modalInstance.close(documentos);
            };

            /*
             * @Author: Eduar
             * +Descripcion: Handler del checkbox de la lista
             */
            $scope.onAgregarDocumentoALio = function (documento) {
                if (documento.getSeleccionado()) {
                    that.agregarDocumentoSeleccionado(documento);
                } else {
                    that.removerDocumentoSeleccionado(documento);
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: Remueve los documentos seleccionados
             */
            that.removerDocumentos = function () {
                var documentos = $scope.datos_view.documentosSeleccionados;
                for (var i in documentos) {
                    var _documento = documentos[i];
                    _documento.setSeleccionado(false);
                }

                $scope.datos_view.documentosSeleccionados = [];
            };

            /*
             * @Author: German Galvis
             * +Descripcion: Remueve los terceros seleccionados
             */
            that.removerTerceros = function (tercero) {
                var terceros = $scope.datos_clientes_farmacias;
                for (var i in terceros) {
                    if (terceros[i].nombre !== tercero.nombre || terceros[i].id !== tercero.id || terceros[i].tipo_id_tercero !== tercero.tipo_id_tercero) {
                        var _tercero = terceros[i];
                        _tercero.seleccionado = false;
                    }
                }

            };

            /*
             * @Author: Eduar
             * +Descripcion: Agrega un documento al array de seleccionados y selecciona el objeto
             */
            that.agregarDocumentoSeleccionado = function (documento) {
                var documentos = $scope.datos_view.documentosSeleccionados;

                for (var i in documentos) {
                    var _documento = documentos[i];
                    if (_documento.get_prefijo() === documento.get_prefijo() && _documento.get_numero() === documento.get_numero()) {
                        return false;
                    }
                }

                $scope.datos_view.documentosSeleccionados.push(documento);

            };

            /*
             * @Author: Eduar
             * +Descripcion: Remueve un documento especifico
             */
            that.removerDocumentoSeleccionado = function (documento) {
                var documentos = $scope.datos_view.documentosSeleccionados;

                for (var i in documentos) {
                    var _documento = documentos[i];
                    if (_documento.get_prefijo() === documento.get_prefijo() && _documento.get_numero() === documento.get_numero()) {
                        documentos.splice(i, 1);
                    }
                }

            };

            /*
             * @Author: Eduar
             * return Documento
             * +Descripcion: Retorno de documento especifico
             */
            that.obtenerDocumentoSeleccionado = function (documento) {
                var documentos = $scope.datos_view.documentosSeleccionados;

                for (var i in documentos) {
                    var _documento = documentos[i];
                    if (_documento.get_prefijo() === documento.get_prefijo() && _documento.get_numero() === documento.get_numero()) {
                        return _documento;
                    }
                }

                return null;
            };

            $scope.seleccionar_cliente_farmacia();

        }]);
});