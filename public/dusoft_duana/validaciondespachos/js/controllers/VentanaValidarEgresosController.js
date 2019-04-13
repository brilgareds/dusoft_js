define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('VentanaValidarEgresosController', ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
        "$timeout", "$filter", "localStorageService", "$state", "$modalInstance",
        "socket", "webNotification", "CentroUtilidadInduccion", "BodegaInduccion", "DocumentoDespacho", "FarmaciaPlanillaDespacho", "ClienteDocumento",
        function ($scope, $rootScope, Request, API, AlertService, Usuario,
                $timeout, $filter, localStorageService, $state, $modalInstance,
                socket, webNotification, CentroUtilidadInduccion, BodegaInduccion, DocumentoDespacho, FarmaciaPlanillaDespacho, ClienteDocumento) {


            var that = this;
            var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            that.documentosStorage = localStorageService.get("documentosSeleccionados");
            $scope.datosView = {
                terminoBusquedaFarmacia: '',
                terminoBusquedaEfc: '',
                terceroSeleccionado: FarmaciaPlanillaDespacho.get(),
                documentosSeleccionados: [],
                cantidadCajas: 0,
                centroUtilidad: 0,
                clienteDocumento: 0,
                documentosSeleccionadosPreparados: '',
                seleccionarClienteFarmacia: true,
                tituloLista: "FARMACIAS"
            };


            $scope.seleccionarClienteFarmacia = function () {

                if ($scope.datosView.seleccionarClienteFarmacia) {
                    $scope.datosView.tituloLista = "FARMACIAS";
                } else {
                    $scope.datosView.tituloLista = "CLIENTES";
                }
            };
            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de listar los centros de utilidad
             * @fecha 2017/09/20
             */
            that.buscarCentroUtilidad = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            estado: '3',
                            pais_id: '1',
                            departamento_id: '1',
                            ciudad_id: '1',
                            termino_busqueda: $scope.datosView.terminoBusquedaFarmacia
                        }
                    }
                };

                Request.realizarRequest(API.CENTROS_UTILIDAD.LISTAR_CENTROS_UTILIDAD, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderCentroUtilidad(data.obj.centros_utilidad);

                    }
                });
            };


            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de listar los clientes a los cuales se les ha generado
             *              despachos
             * @fecha 2017/09/20
             */
            that.buscarClientes = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        clientes: {
                            ciudad_id: '001',
                            pais_id: 'CO',
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                            departamento_id: '76',
                            estado: '1',
                            termino_busqueda: $scope.datosView.terminoBusquedaFarmacia
                        }
                    }
                };

                Request.realizarRequest(API.CLIENTES.LISTAR_CLIENTES, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderClientes(data.obj.listado_clientes);

                    }
                });
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
                // $scope.distribuirCajas();
            };

            $scope.numeroCaja = false;
            $scope.numeroNevera = false;

            $scope.pulsar = function (check, tipo) {

                if (check) {
                    if (tipo === 'nevera') {
                        $scope.numeroCaja = false;
                        $scope.numeroNevera = true;
                    } else {
                        $scope.numeroCaja = true;
                        $scope.numeroNevera = false;
                    }
                } else {
                    $scope.numeroCaja = false;
                    $scope.numeroNevera = false;
                }
            };


            /*
             * @Author: Eduar
             * +Descripcion: Agrega un documento al array de seleccionados y selecciona el objeto
             */
            that.agregarDocumentoSeleccionado = function (documento) {
                var documentos;

                if (that.documentosStorage) {
                    documentos = that.documentosStorage.documentos;
                } else {
                    documentos = $scope.datosView.documentosSeleccionados;
                }

                for (var i in documentos) {

                    var _documento = documentos[i];

                    if (that.documentosStorage) {
                        _documento = DocumentoDespacho.get(0, _documento.prefijo, _documento.numero, _documento.empresaId);
                        _documento.setCantidadCajas(parseInt(documento.cantidadCajas));
                        _documento.setCantidadNeveras(parseInt(documento.cantidadNeveras));
                    }
                    if (_documento.get_prefijo() === documento.get_prefijo() && _documento.get_numero() === documento.get_numero()) {
                        return false;
                    }
                }
                if (that.documentosStorage) {
                    that.documentosStorage.documentos.push(documento);
                }
                $scope.datosView.documentosSeleccionados.push(documento);

            };


            /*
             * @Author: Eduar
             * +Descripcion: Remueve un documento especifico
             */
            that.removerDocumentoSeleccionado = function (documento) {
                var documentos = $scope.datosView.documentosSeleccionados;

                for (var i in documentos) {
                    var _documento = documentos[i];
                    if (_documento.get_prefijo() === documento.get_prefijo() && _documento.get_numero() === documento.get_numero()) {
                        documentos.splice(i, 1);
                    }
                }


                if (that.documentosStorage) {
                    //var documentosStorage = localStorageService.get("documentosSeleccionados").documentos;
                    for (var i in that.documentosStorage.documentos) {
                        var _documento = that.documentosStorage.documentos[i];
                        if (_documento.prefijo === documento.get_prefijo() && _documento.numero === documento.get_numero() && documento.getSeleccionado() === false) {
                            that.documentosStorage.documentos.splice(i, 1);
                        }
                    }
                }
            };

            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de distribuir la cantidad de cajas
             *              por cada Documento seleccionado 
             * @fecha 03/10/2017
             */
            var res = 0;
            var totalDecimal = 0;
            var cantidadCajas = 0;
            var cantidadNeveras = 0;
            var pos = "";
            that.documentosStorageActual = [];
            that.distribuirCajas = function (index, documentoSeleccionadoPreparado, callback) {

                var _documento = documentoSeleccionadoPreparado[index];

                cantidadCajas = parseInt($scope.datosView.cantidadCajas) / parseInt(documentoSeleccionadoPreparado.length);

                if (!_documento) {

                    res = 0;
                    totalDecimal = 0;
                    cantidadCajas = 0;

                    callback(false);
                    return;
                }
                index++;
                if (that.documentosStorage) {
                    _documento = DocumentoDespacho.get(0, _documento.prefijo, _documento.numero, _documento.empresaId);
                    _documento.setSeleccionado(true);
                }

                pos = cantidadCajas.toString().indexOf(".");
                if (pos > 0) {
                    res = String(cantidadCajas).substring((pos + 1), cantidadCajas.length);
                    totalDecimal += parseFloat("0." + res);
                }

                if ($scope.numeroCaja) {
                    _documento.setCantidadCajas(Math.floor(cantidadCajas));
                }

                if ($scope.numeroNevera) {
                    _documento.setCantidadNeveras(Math.floor(cantidadCajas));
                }

                if (index === documentoSeleccionadoPreparado.length - 1) {
                    if ($scope.numeroCaja) {
                        _documento.setCantidadCajas(parseInt(cantidadCajas) + parseInt(Math.ceil(totalDecimal)));
                    }
                    if ($scope.numeroNevera) {
                        _documento.setCantidadNeveras(parseInt(cantidadCajas) + parseInt(Math.ceil(totalDecimal)));
                    }
                }

                that.documentosStorageActual.push(_documento);

                setTimeout(function () {
                    that.distribuirCajas(index, documentoSeleccionadoPreparado, callback);
                }, 300);

            };

            /**
             * @author Cristian Ardila
             * +Descripcion Metodo invocado al presionar CLICK del boton (DISTRIBUIR)
             * @fecha 03/10/2017              
             */
            $scope.distribuirCajas = function () {
                that.documentosStorageActual = [];
                if ($scope.numeroCaja === $scope.numeroNevera) {
                    AlertService.mostrarMensaje("warning", "Debe chequear Caja o Nevera");
                    return;
                }
                if (!$scope.centroUtilidad && !$scope.clienteEgresos) {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar la farmacia");
                    return;
                }
                var documentoSeleccionadoPreparado = (that.documentosStorage) ? that.documentosStorage.documentos : $scope.datosView.documentosSeleccionados;

                that.distribuirCajas(0, documentoSeleccionadoPreparado, function (estado) {

                    localStorageService.add("documentosSeleccionados", {estado: 3, documentos: that.documentosStorageActual, totalCajas: $scope.datosView.cantidadCajas, totalNeveras: $scope.datosView.cantidadNeveras});

                    if ($scope.datosView.seleccionarClienteFarmacia && $scope.centroUtilidad) {
                        var centroUtilidad = CentroUtilidadInduccion.get($scope.centroUtilidad.nombre, $scope.centroUtilidad.codigo);
                        var bodega = BodegaInduccion.get('', $scope.centroUtilidad.bodegas[0].codigo);
                        centroUtilidad.agregarBodega(bodega);
                        $scope.seleccionarCentroUtilidad(centroUtilidad, '');
                    }

                    if (!$scope.datosView.seleccionarClienteFarmacia && $scope.clienteEgresos) {
                        var clienteDocumento = ClienteDocumento.get($scope.clienteEgresos.nombre,
                                $scope.clienteEgresos.direccion,
                                $scope.clienteEgresos.tipo_id_tercero,
                                $scope.clienteEgresos.id,
                                $scope.clienteEgresos.telefono);
                        $scope.seleccionarCliente(clienteDocumento, '');
                    }

                    $state.go('ValidacionEgresosDetalle');
                    $modalInstance.close();

                });

            };


            that.guardarCantidadCajas = 0;
            that.guardarCantidadNeveras = 0;
            var documentoDespachoStorage;
            /**
             * +Descripcion Metodo que recorrera los documentos seleccionados
             *              a los cuales se les agrego el numero de caja de forma
             *              individual
             */
            that.guardarDocumentosSeleccionados = function (index, documentoSeleccionadoPreparado, callback) {

                var _documento = documentoSeleccionadoPreparado[index];

                if (!_documento) {

                    callback(false);
                    return;
                }

                index++;
                if (that.documentosStorage) {
                    documentoDespachoStorage = DocumentoDespacho.get(0, _documento.prefijo, _documento.numero, _documento.empresaId);
                    documentoDespachoStorage.setSeleccionado(true);
                    documentoDespachoStorage.setCantidadCajas(parseInt(_documento.cantidadCajas));
                    documentoDespachoStorage.setCantidadNeveras(parseInt(_documento.cantidadNeveras));
                    that.documentosStorageActual.push(_documento);
                } else {
                    _documento.setCantidadCajas(parseInt(_documento.cantidadCajas));
                    _documento.setCantidadNeveras(parseInt(_documento.cantidadNeveras));
                    that.documentosStorageActual.push(_documento);
                }

                that.guardarCantidadCajas += parseInt(_documento.cantidadCajas);
                that.guardarCantidadNeveras += parseInt(_documento.cantidadNeveras);

                setTimeout(function () {
                    that.guardarDocumentosSeleccionados(index, documentoSeleccionadoPreparado, callback);
                }, 300);

            };

            /**
             * @author Cristian Ardila
             * +Descripcion Metodo invocado cuando se guardan los documentos a los cuales
             *              se les asigno el numero de caja de manera individual
             * @fecha 14/10/2017
             */
            $scope.guardarDocumentosSeleccionados = function () {

                that.documentosStorageActual = [];
                if (!$scope.centroUtilidad && !$scope.clienteEgresos) {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar la farmacia");
                    return;
                }
                var documentoSeleccionadoPreparado = (that.documentosStorage) ? that.documentosStorage.documentos : $scope.datosView.documentosSeleccionados;
                that.guardarDocumentosSeleccionados(0, documentoSeleccionadoPreparado, function (estado) {

                    localStorageService.add("documentosSeleccionados", {estado: 3, documentos: that.documentosStorageActual, totalCajas: that.guardarCantidadCajas, totalNeveras: that.guardarCantidadNeveras});

                    if ($scope.centroUtilidad) {
                        var centroUtilidad = CentroUtilidadInduccion.get($scope.centroUtilidad.nombre, $scope.centroUtilidad.codigo);
                        var bodega = BodegaInduccion.get('', $scope.centroUtilidad.bodegas[0].codigo);
                        centroUtilidad.agregarBodega(bodega);
                        $scope.seleccionarCentroUtilidad(centroUtilidad, '');
                    }

                    if ($scope.clienteEgresos) {
                        var clienteDocumento = ClienteDocumento.get($scope.clienteEgresos.nombre,
                                $scope.clienteEgresos.direccion,
                                $scope.clienteEgresos.tipo_id_tercero,
                                $scope.clienteEgresos.id,
                                $scope.clienteEgresos.telefono);
                        $scope.seleccionarCliente(clienteDocumento, '');
                    }

                    $state.go('ValidacionEgresosDetalle');
                    $modalInstance.close();

                });

            };

            /**
             * @author Cristian Ardila
             * @fecha 02/10/2017
             * +Descripcion Metodo encargado de mappear el arreglo de centro de 
             *              utilidad con el modelo correspondiente [CentroUtilidadInduccion]
             */
            that.renderCentroUtilidad = function (farmacias) {

                $scope.listaCentrosUtilidad = [];

                farmacias.forEach(function (data) {

                    var centroUtilidad = CentroUtilidadInduccion.get(data.descripcion, data.centro_utilidad_id);
                    var bodega = BodegaInduccion.get('', data.empresa_id);
                    centroUtilidad.agregarBodega(bodega);
                    $scope.listaCentrosUtilidad.push(centroUtilidad);

                });

            };


            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de mapear los datos del Servicio contra el model
             *              y de esta forma garantizar instancias el objeto
             */
            that.renderClientes = function (clientes) {

                $scope.listaClientes = [];

                clientes.forEach(function (data) {

                    var cliente = ClienteDocumento.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);
                    $scope.listaClientes.push(cliente);
                });
            };

            $scope.buscador_cliente_farmacia = function (ev) {

                if (ev.which == 13) {

                    if ($scope.centroUtilidad) {
                        var centroUtilidad = CentroUtilidadInduccion.get($scope.centroUtilidad.nombre, $scope.centroUtilidad.codigo);
                        var bodega = BodegaInduccion.get('', $scope.centroUtilidad.bodegas[0].codigo);
                        centroUtilidad.agregarBodega(bodega);
                        $scope.seleccionarCentroUtilidad(centroUtilidad,$scope.datosView.terminoBusquedaEfc);
                    }

                    if ($scope.clienteEgresos) {
                        var clienteDocumento = ClienteDocumento.get($scope.clienteEgresos.nombre,
                                $scope.clienteEgresos.direccion,
                                $scope.clienteEgresos.tipo_id_tercero,
                                $scope.clienteEgresos.id,
                                $scope.clienteEgresos.telefono);
                        $scope.seleccionarCliente(clienteDocumento, $scope.datosView.terminoBusquedaEfc);
                    }

                }
            };

            /**
             * +Descripcion Metodo que se invoca al seleccionar un centro de utilidad
             */
            $scope.seleccionarCentroUtilidad = function (centroUtilidad,terminoBusqueda) {

                $scope.centroUtilidad = CentroUtilidadInduccion.get(centroUtilidad.getNombre(), centroUtilidad.getCodigo());
                var bodega = BodegaInduccion.get('', centroUtilidad.getCentrosBodega()[0].getCodigo());
                $scope.centroUtilidad.agregarBodega(bodega);

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                            farmacia_id: centroUtilidad.getCentrosBodega()[0].getCodigo(),
                            centro_utilidad_id: centroUtilidad.getCodigo(),
                            termino_busqueda: terminoBusqueda,//'',
                            estadoValidarDespachos: 1
                        }
                    }
                };

                Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_DOCUMENTOS_FARMACIAS, "POST", obj, function (data) {

                    if (data.status === 200) {

                        that.render_documentos(data.obj.planillas_despachos);
                    }
                });
            };

            /**
             * +Descripcion Metodo que se invoca al seleccionar un cliente
             */
            $scope.seleccionarCliente = function (cliente, terminoBusqueda) {

                $scope.clienteEgresos = ClienteDocumento.get(cliente.getNombre(), cliente.getDireccion, cliente.getTipoId(), cliente.getId(), cliente.getTelefono());

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                            tipo_id: cliente.getTipoId(),
                            tercero_id: cliente.getId(),
                            termino_busqueda: terminoBusqueda, // '',
                            estadoValidarDespachos: 1
                        }
                    }
                };

                Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_DOCUMENTOS_CLIENTES, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.render_documentos(data.obj.planillas_despachos);
                    }
                });
            };

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

            /**
             * +Descripcion Metodo encargado de mapear los registros de los documentos 
             *              que posteriormente se visualizaran en el grid de datos
             */
            that.render_documentos = function (documentos) {

                $scope.datosView.terceroSeleccionado.limpiar_documentos();

                documentos.forEach(function (data) {

                    var documento = DocumentoDespacho.get(0, data.prefijo, data.numero, data.empresa_id);
                    documento.setNumeroPedido(data.numero_pedido);
                    documento.setFechaRegistro(data.fecha_registro);
                    documento.setEstadoDocumento(data.estado_documento);

                    if (that.documentosStorage) {

                        that.documentosStorage.documentos.forEach(function (row) {

                            if (row.prefijo === documento.get_prefijo() && row.numero === documento.get_numero()) {
                                documento.setSeleccionado(true);
                                documento.setCantidadCajas(row.cantidadCajas);
                                documento.setCantidadNeveras(row.cantidadNeveras);

                                $scope.datosView.documentosSeleccionados.push(documento);

                            }
                        });

                    } else {

                        $scope.datosView.documentosSeleccionados.forEach(function (row) {

                            if (row.prefijo === documento.get_prefijo() && row.numero === documento.get_numero()) {
                                documento.setSeleccionado(true);
                                documento.setCantidadCajas(row.cantidadCajas);
                                documento.setCantidadNeveras(row.cantidadNeveras);

                            }
                        });
                    }

                    if (data.estado_documento === "0") {
                        $scope.datosView.terceroSeleccionado.set_documentos(documento);
                    }

                });

            };

            $scope.desCheckearDocumento = function (entity) {
                entity.seleccionado = false;
                $scope.onAgregarDocumentoALio(entity);
            };

            $scope.lista_remisiones_bodega = {
                data: 'datosView.terceroSeleccionado.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'lios', displayName: "", width: "35",
                        cellClass: "txt-center dropdown-button",
                        cellTemplate: "<div><input-check \
                        ng-model='row.entity.seleccionado' \
                        ng-change='onAgregarDocumentoALio(row.entity)' \
                        ng-disabled='row.entity.cantidadNeveras == 0 && row.entity.cantidadCajas == 0 && datosView.cantidadCajas ==0 || row.entity.estadoDocumento == \"1\" '  /></div>"},
                    {
                        displayName: 'Documento Bodega',
                        cellTemplate: '<div class="ngCellText">\
                                        <span > {{row.entity.get_prefijo()}} - {{row.entity.get_numero()}} - (No Pedido {{row.entity.getNumeroPedido()}} )</span>\
                                      </div>'
                    },
                    {field: 'cantidad_cajas', displayName: 'Cajas', width: "15%",
                        cellTemplate: '<div class="col-xs-12"> \n\
                        <input type="text"\
                        ng-model="row.entity.cantidadCajas"\
                        validacion-numero-entero\
                        class="form-control grid-inline-input" ng-focus="desCheckearDocumento(row.entity)"\
                        name="" id="" /> </div>'},
                    {field: 'cantidad_neveras', displayName: 'Nevera', width: "15%",
                        cellTemplate: '<div class="col-xs-12"> \n\
                        <input type="text"\
                        ng-model="row.entity.cantidadNeveras"\
                        validacion-numero-entero\
                        class="form-control grid-inline-input" ng-focus="desCheckearDocumento(row.entity)"\
                        name="" id="" /> </div>'},
//                    {field: 'temperatura_neveras', displayName: '°C Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.temperatura_neveras" validacion-numero class="form-control grid-inline-input" name="" id="" /> </div>'},
                ]
            };

            /**
             * @author Cristian Ardila
             * @fecha 02/10/2017
             * +Descripcion Metodo invocado cada vez que se escriba en el dropdown
             *              el cual cargara los centros de utilidad 
             */
            $scope.listarCentrosUtilidad = function (termino_busqueda) {

                if (termino_busqueda.length < 4) {
                    return;
                }

                $scope.datosView.terminoBusquedaFarmacia = termino_busqueda;

                that.buscarCentroUtilidad();
            };


            /**
             * @author Cristian Ardila
             * @fecha 02/10/2017
             * +Descripcion Metodo invocado cada vez que se escriba en el dropdown
             *              el cual cargara los clientes
             */
            $scope.listarClientes = function (termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datosView.terminoBusquedaFarmacia = termino_busqueda;

                that.buscarClientes();
            };

            $scope.cerrarVentana = function () {
                $modalInstance.close();
            };
            /*
             * Inicializacion de variables
             * @param {type} empresa
             * @param {type} callback
             * @returns {void}
             */
            that.init = function (empresa, callback) {

                $scope.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                callback();

            };

            that.init(empresa, function () {

            });

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                that.documentosStorage = [];
                $scope.datos_view = null;
            });

        }]);

});

