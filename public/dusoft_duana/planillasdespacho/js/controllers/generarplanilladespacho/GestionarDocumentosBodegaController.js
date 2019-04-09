
define(["angular", "js/controllers", "controllers/generarplanilladespacho/GestionarLiosController"], function (angular, controllers) {

    controllers.controller('GestionarDocumentosBodegaController', [
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
        "EmpresaPlanillaDespacho",
        "ClientePlanillaDespacho",
        "FarmaciaPlanillaDespacho",
        "Documento",
        "Usuario",
        "OtrasSalidasPlanillaDespacho",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Empresa, ClientePlanilla, FarmaciaPlanilla, Documento, Sesion, OtrasSalidasPlanillaDespacho) {

            var that = this;



            $rootScope.$on('gestionar_documentos_bodegaCompleto', function (e, parametros) {

                $scope.datos_view = {
                    opcion_predeterminada: "0", // 0 = farmacias 1 = clientes 2 = Otras Empresas
                    termino_busqueda: '',
                    termino_busqueda_documentos: '',
                    mostrarTercero: false,
                    tercero_seleccionado: FarmaciaPlanilla.get(), // tercero_seleccionado es una Farmacia por ser la opcion_predeterminada = 0
                    documento_seleccionado: Documento.get()
                };

                $scope.datos_clientes_farmacias = [];
                $scope.datos_view.documentosSeleccionados = [];

                $scope.seleccionar_cliente_farmacia();

            });

            $rootScope.$on('cerrar_gestion_documentos_bodegaCompleto', function (e, parametros) {
                that.onLiosRegistrados();
                that.removerDocumentos();
                $scope.datos_view = null;
                $scope.$$watchers = null;

            });


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
                that.removerDocumentos();

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
                            pais_id: $scope.planilla.get_ciudad().get_pais_id(),
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
                            estado:1,
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
                            pais_id: $scope.planilla.get_ciudad().get_pais_id(),
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
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

                //that.removerDocumentos();

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

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.CENTROS_UTILIDAD.LISTAR_FARMACIAS_TERCEROS, "POST", obj, function (data) {

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
                            prefijo: $scope.datos_view.tercero_seleccionado.getNombre()
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

                    if ($scope.datos_view.despachoPorLios) {
                        var _documento = that.obtenerDocumentoSeleccionado(documento);
                        if (_documento) {
                            documento.setSeleccionado(true);
                        }
                    }
                    $scope.datos_view.tercero_seleccionado.set_documentos(documento);
                });

            };

            $scope.validar_ingreso_documento = function (documento) {

                var disabled = false;

                if ($scope.datos_view.despachoPorLios) {
                    return true;
                }

                // Validar que el prefijo y el numero del documento esten presentes
                if (documento.get_prefijo() === undefined || documento.get_numero() === undefined) {
                    return true;
                }

                if (documento.get_prefijo() == '' || documento.get_numero() == '' || documento.get_numero() === 0) {
                    return true;
                }

                // Validar que las cantidad de cajas no sean 0 o vacias                                
                if (documento.get_cantidad_cajas() === '' || documento.get_cantidad_cajas() === 0) {
                    disabled = true;
                }

                // Validar que si ingresar neveras, obligatoriamente ingresen la temperatura de la nevera
                if (documento.get_cantidad_neveras() !== '' && documento.get_cantidad_neveras() !== 0) {
                    disabled = false;
//                    if (documento.get_temperatura_neveras() === '') {
//                        disabled = true;
//                    }
                }

                return disabled;
            };

            $scope.seleccionar_documento_planilla = function (documento) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            prefijo: documento.prefijo,
                            numero: documento.numero,
                            esPlanillas: true

                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.CANTIDADES_CAJA_NEVERA, "POST", obj, function (data) {

                    if (data.status === 200) {

                        if (parseInt(documento.get_cantidad_cajas()) === data.obj.planillas_despachos.totalCajas &&
                                parseInt(documento.get_cantidad_neveras()) === data.obj.planillas_despachos.totalNeveras) {

                            $scope.datos_view.documento_seleccionado = documento;

                            that.gestionar_planilla_despacho();
                        } else {
                            AlertService.mostrarMensaje("warning", "Las cantidades de cajas y/o neveras NO coinciden con las cantidades auditadas; Nro cajas Auditadas: " + data.obj.planillas_despachos.totalCajas + ", Nro neveras Auditadas: " + data.obj.planillas_despachos.totalNeveras);
                        }

                    }
                });


            };

            $scope.seleccionar_documento_otras_empresas = function () {

                $scope.datos_view.documento_seleccionado.set_empresa_id(Sesion.getUsuarioActual().getEmpresa().getCodigo());

                that.gestionar_planilla_despacho();

            };

            $scope.aceptar_documentos_bodegas = function () {

                var documentos = $scope.datos_view.documentosSeleccionados;

                //Valida el checkbox de lios para mostrar la ventana de lios
                if ($scope.datos_view.despachoPorLios && documentos.length > 0) {

                    that.gestionarPlanillaParaLios(function () {
                        that.mostrarVentanaLios(documentos);
                    });

                } else if ($scope.datos_view.despachoPorLios && documentos.length === 0) {

                    AlertService.mostrarVentanaAlerta("Alerta del sistema", "Debe seleccionar por lo menos un documento para despachos en lios");
                } else {
                    $scope.cerrar_gestion_documentos_bodega();
                }

                //testing
                /* if ($scope.datos_view.opcion_predeterminada === "2") {
                 $scope.datos_view.documento_seleccionado.set_empresa_id(Sesion.getUsuarioActual().getEmpresa().getCodigo());
                 
                 that.gestionar_planilla_despacho(function(continuar) {
                 if (continuar)
                 $scope.cerrar_gestion_documentos_bodega();
                 });
                 } else {
                 $scope.cerrar_gestion_documentos_bodega();
                 }*/
            };

            that.mostrarVentanaLios = function (documentos) {
                $scope.opts = {
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: 'views/generarplanilladespacho/gestionarLios.html',
                    controller: "GestionarLiosController",
                    resolve: {
                        documentos: function () {
                            return documentos;
                        },
                        tipo: function () {
                            return $scope.datos_view.opcion_predeterminada;
                        },
                        numeroGuia: function () {
                            return $scope.planilla.get_numero_guia();
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);

                /*modalInstance.result.then(function() {
                 
                 $scope.buscar_documentos_bodega();
                 }, function() {
                 });*/
            };

            that.onLiosRegistrados = $rootScope.$on("onLiosRegistrados", function () {
                $scope.buscar_documentos_bodega();
            });


            //Verifica si la existe la planilla, y crea un solo documento
            that.gestionar_planilla_despacho = function (callback) {

                $scope.planilla.set_documento($scope.datos_view.documento_seleccionado);

                if ($scope.planilla.get_numero_guia() === 0) {

                    that.generar_planilla_despacho(function (continuar) {

                        if (continuar) {

                            that.ingresar_documentos_planilla(function (continuar) {

                                if (callback)
                                    callback(continuar);
                            });
                        } else {
                            if (callback)
                                callback(continuar);
                        }
                    });
                } else {
                    that.ingresar_documentos_planilla(function (continuar) {
                        if (callback)
                            callback(continuar);
                    });
                }
            };

            //Verifica si existe la planilla y la crea, funcion usada por el proceso de lios
            that.gestionarPlanillaParaLios = function (callback) {
                $scope.planilla.set_documento($scope.datos_view.documento_seleccionado);

                if ($scope.planilla.get_numero_guia() === 0) {

                    that.generar_planilla_despacho(function (continuar) {

                        callback(continuar);
                    });
                } else {
                    callback(true);
                }
            };

            $scope.lista_clientes_farmacias = {
                data: 'datos_clientes_farmacias',
                enableColumnResize: true,
                enableRowSelection: false,

                columnDefs: [
                    {field: 'getNombre()', displayName: 'Nombre', width: "85%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="buscar_documentos_bodega(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
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
                    {field: 'get_id()', displayName: 'Grupo', width: "10%"},
                    {field: 'get_descripcion()', displayName: 'Documento Bodega', width: "25%"},
                    {field: 'get_tercero()', displayName: 'Cliente', width: "25%", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                     <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >{{row.entity.tercero.nombre}}<span class="caret"></span></button>\
                     <ul class="dropdown-menu dropdown-options">\
                     <li ng-repeat="farmacia in datos_farmacias_terceros">\
                     <a href="javascript:void(0)" ng-click="onSeleccionTercero(row.entity,farmacia)">{{farmacia.nombre}}</a>\
                     </li>\
                     </ul>\
                     </div>'},
                    {field: 'cantidad_cajas', displayName: 'Cajas', width: "10%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'cantidad_neveras', displayName: 'Nevera', width: "10%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_neveras" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="seleccionar_documento_planilla(row.entity)" ng-disabled="validar_ingreso_documento(row.entity)" style="margin-right:5px;" ><span class="glyphicon glyphicon-ok"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="onMostrarVentanaDescripcion(row.entity)" ng-show="datos_view.opcion_predeterminada == 2" ng-disabled="datos_view.despachoPorLios" ><span class="glyphicon glyphicon-pencil"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.lista_remisiones_bodega_1 = {
                data: 'datos_view.tercero_seleccionado.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'lios', displayName: "", width: "40", cellClass: "txt-center dropdown-button", cellTemplate: "<div><input-check   ng-model='row.entity.seleccionado' ng-change='onAgregarDocumentoALio(row.entity)' ng-disabled='!datos_view.despachoPorLios'   /></div>"},
                    {field: 'get_id()', displayName: 'Grupo', width: "10%"},
                    {field: 'get_descripcion()', displayName: 'Documento Bodega', width: "30%"},
                    {field: 'cantidad_cajas', displayName: 'Cajas', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'cantidad_neveras', displayName: 'Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_neveras" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="seleccionar_documento_planilla(row.entity)" ng-disabled="validar_ingreso_documento(row.entity)" style="margin-right:5px;" ><span class="glyphicon glyphicon-ok"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="onMostrarVentanaDescripcion(row.entity)" ng-show="datos_view.opcion_predeterminada == 2" ng-disabled="datos_view.despachoPorLios" ><span class="glyphicon glyphicon-pencil"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.onSeleccionTercero = function (fila, farmacia) {

                var documentos = $scope.datos_view.documentosSeleccionados;

                for (var i in documentos) {
                    var _documento = documentos[i];
                    _documento.tercero=farmacia;
                }

               // fila.tercero = farmacia;
            };

            $scope.onMostrarVentanaDescripcion = function (documento) {
                $scope.opts = {
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: 'views/generarplanilladespacho/descripcionOtrasSalidas.html',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function (documento, $modalInstance) {
                            $scope.documento = documento;

                            $scope.cerrar = function () {
                                $modalInstance.close();
                            };
                        }],
                    resolve: {
                        documento: function () {
                            return documento;
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function () {

                }, function () {

                });
            };

            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton de lios
             */
            $scope.onDespachoPorLios = function () {
                if (!$scope.datos_view.despachoPorLios) {
                    that.removerDocumentos();
                    $scope.datos_view.documentosSeleccionados = [];
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: Handler del checkbox de la lista
             */
            $scope.onAgregarDocumentoALio = function (documento) {
                //documento.setSeleccionado(!documento.getSeleccionado());
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
                $scope.datos_view.despachoPorLios = false;
                for (var i in documentos) {
                    var _documento = documentos[i];
                    _documento.setSeleccionado(false);
                }

                $scope.datos_view.documentosSeleccionados = [];
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

            that.generar_planilla_despacho = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            pais_id: $scope.planilla.get_ciudad().get_pais_id(),
                            departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
                            ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
                            transportador_id: $scope.planilla.get_transportadora().get_id(),
                            nombre_conductor: $scope.planilla.get_nombre_conductor(),
                            observacion: $scope.planilla.get_observacion(),
                            numero_guia_externo: $scope.planilla.get_numero_guia_externo(),
                            numero_placa_externo: $scope.planilla.get_numero_placa_externo()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.GENERAR_PLANILLA, "POST", obj, function (data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.planilla.set_numero_guia(data.obj.numero_guia);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            that.ingresar_documentos_planilla = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.planilla.get_numero_guia(),
                            empresa_id: $scope.planilla.get_documento().get_empresa_id(),
                            prefijo: $scope.planilla.get_documento().get_prefijo(),
                            numero: $scope.planilla.get_documento().get_numero(),
                            cantidad_cajas: $scope.planilla.get_documento().get_cantidad_cajas(),
                            cantidad_neveras: $scope.planilla.get_documento().get_cantidad_neveras(),
                            temperatura_neveras: $scope.planilla.get_documento().get_cantidad_neveras() > 0 ? '3.2' : '', //$scope.planilla.get_documento().get_temperatura_neveras(),
                            observacion: $scope.planilla.get_documento().get_observacion(),
                            tipo: $scope.datos_view.opcion_predeterminada
                        }
                    }
                };

                if ($scope.datos_view.opcion_predeterminada === '2') {
                    obj.data.planillas_despachos.empresa_cliente = $scope.planilla.get_documento().get_tercero().empresa_id;
                    obj.data.planillas_despachos.centro_cliente = $scope.planilla.get_documento().get_tercero().centro_utilidad;
                    obj.data.planillas_despachos.bodega_cliente = $scope.planilla.get_documento().get_tercero().codigo;
                }

                Request.realizarRequest(API.PLANILLAS.INGRESAR_DOCUMENTOS, "POST", obj, function (data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.planilla.set_documentos($scope.datos_view.documento_seleccionado);
                        $scope.datos_view.documento_seleccionado = Documento.get();

                        $scope.buscar_documentos_bodega($scope.datos_view.tercero_seleccionado);

                        callback(true);
                    } else {
                        callback(false);
                    }
                });

            };

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;

            });
        }]);
});