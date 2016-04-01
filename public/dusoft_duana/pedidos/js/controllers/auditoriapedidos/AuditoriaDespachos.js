define(["angular", "js/controllers",
    'models/auditoriapedidos/Farmacia',
    'models/auditoriapedidos/PedidoAuditoria',
    'models/auditoriapedidos/Separador',
    'models/auditoriapedidos/DocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaDespachos', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Farmacia', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "Usuario",
        "localStorageService", "$filter", "$state", "DocumentoAuditado", "EmpresaDespacho", "AuditoriaDespachoService",
        function($scope, $rootScope, Request, Empresa,
                Farmacia, PedidoAuditoria, Separador,
                DocumentoTemporal, API, socket, AlertService, Usuario,
                localStorageService, $filter, $state, DocumentoAuditado, EmpresaDespacho, AuditoriaDespachoService) {

            $scope.Empresa = Empresa;
            $scope.pedidosSeparadosSeleccionados = [];
            $scope.empresas = [];
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();


            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = {};
            $scope.paginaactual = 1;
            $scope.numero_pedido = "";


            var empresa = Usuario.getUsuarioActual().getEmpresa();
            var that = this;
            var fecha_actual = new Date();

            that.init = function(empresa, callback) {

                $scope.datos_view = {
                    empresaSeleccionada: EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo()),
                    fecha_inicial_aprobaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                    fecha_final_aprobaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                    prefijo: "",
                    numero: "",
                    items: 0,
                    termino_busqueda: '',
                    estadoSesion: true,
                    paginaactual: 1,
                    termino_busqueda_empresa: ''

                };

                $scope.filtros = [
                    {nombre: "Prefijo", filtroPrefijo: true},
                    {nombre: "Numero", filtroNombre: true}

                ];
                $scope.filtro = $scope.filtros[0];
                //Deja en estado visible el buscador
                $scope.visibleBuscador = true;
                $scope.visibleBotonBuscador = true;

                callback();
            };

            $scope.onSeleccionFiltro = function(filtro) {

                $scope.filtro = filtro;
                $scope.datos_view.termino_busqueda = '';

                $scope.visibleBuscador = true;
                $scope.visibleListaEstados = false;
                $scope.visibleBotonBuscador = true;


            };


            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Metodo invocado desde los texfield de EFC y numero
             * @param {type} event
             */
            $scope.cargarListarDespachosAprobados = function(event) {

                if ($scope.filtro.nombre === "Prefijo") {
                    $scope.datos_view.numero = "";
                    $scope.datos_view.prefijo = $scope.datos_view.termino_busqueda;
                }

                if ($scope.filtro.nombre === "Numero") {
                    $scope.datos_view.prefijo = "";
                    $scope.datos_view.numero = $scope.datos_view.termino_busqueda;
                }
                that.listarDespachosAuditados();

            };

            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Metodo invocado para buscar segun la opcion
             *              seleccionada
             * @param {type} event
             */
            $scope.buscarDespachosAprobados = function(event) {

                if (event.which === 13) {
                    $scope.datos_view.paginaactual = 1;
                    if ($scope.filtro.nombre === "Prefijo") {
                        $scope.datos_view.numero = "";
                        $scope.datos_view.prefijo = $scope.datos_view.termino_busqueda;
                    }

                    if ($scope.filtro.nombre === "Numero") {
                        $scope.datos_view.prefijo = "";
                        $scope.datos_view.numero = $scope.datos_view.termino_busqueda;
                    }
                    that.listarDespachosAuditados();
                }
            };



            /*
             * @author Cristian Ardila
             * @fecha 05/02/2016
             * +Descripcion funcion obtiene las empresas del servidor invocando
             *              el servicio listarEmpresas de 
             *              (ValidacionDespachosSerivice.js)
             * @returns {json empresas}
             */
            that.listarEmpresas = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        listar_empresas: {
                            pagina: 1,
                            empresaName: $scope.datos_view.termino_busqueda_empresa
                        }
                    }
                };

                Request.realizarRequest(API.DESPACHOS_AUDITADOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    $scope.empresas = [];

                    if (data.status === 200) {

                        that.render_empresas(data.obj.listar_empresas);
                        callback(true);
                    } else {
                        callback(false);
                    }

                });
            };


            that.render_empresas = function(empresas) {
                for (var i in empresas) {

                    var _empresa = EmpresaDespacho.get(empresas[i].razon_social, empresas[i].empresa_id);
                    $scope.empresas.push(_empresa);
                }
            };


            /*
             * funcion ejecuta listarCentroUtilidad
             * @returns {lista CentroUtilidad}
             */
            $scope.onSeleccionarEmpresa = function(empresa_Nombre) {
                if (empresa_Nombre.length < 3) {
                    return;
                }
                $scope.datos_view.termino_busqueda_empresa = empresa_Nombre;
                that.listarEmpresas(function() {
                });
            };


            $scope.listarEmpresas = function() {
                $scope.empresas = Usuario.getUsuarioActual().getEmpresasFarmacias();
            };

            $scope.cargarListaDespachosAuditados = function() {

                that.listarDespachosAuditados();

            };

            /**
             * @author Cristian Ardila
             * @fecha  16/02/2016
             * +Descripcion Metodo encargado de invocar el servicio que lista
             *              los despachos auditados
             * @returns {undefined}
             */
            that.listarDespachosAuditados = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        despachos_auditados: {
                            session: $scope.session,
                            prefijo: $scope.datos_view.prefijo,
                            numero: $scope.datos_view.numero, //$scope.datos_view.numero,
                            empresa_id: $scope.datos_view.empresaSeleccionada.getCodigo(),
                            fechaInicial: $filter('date')($scope.datos_view.fecha_inicial_aprobaciones, "yyyy-MM-dd") + " 00:00:00",
                            fechaFinal: $filter('date')($scope.datos_view.fecha_final_aprobaciones, "yyyy-MM-dd") + " 23:59:00",
                            paginaactual: $scope.datos_view.paginaactual,
                            registroUnico: false
                        }
                    }
                };

                Request.realizarRequest(API.DESPACHOS_AUDITADOS.LISTAR_DESPACHOS_AUDITADOS, "POST", obj, function(data) {

                    if (data.status === 200) {

                        $scope.datos_view.items = data.obj.despachos_auditados.length;

                        that.renderListarDespachosAuditados(data);

                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };


            that.renderListarDespachosAuditados = function(data) {

                $scope.documentosAprobados = [];
                for (var i in data.obj.despachos_auditados) {

                    var _documento = data.obj.despachos_auditados[i];

                    var documento = DocumentoAuditado.get(1, _documento.prefijo, _documento.numero, _documento.fecha_registro);
                    documento.setEmpresaId(_documento.empresa_id);
                    documento.setRazonSocial(_documento.razon_social);
                    documento.setTipoPedido(_documento.tipo_pedido);
                    documento.setBodegaDestino((_documento.tipo_pedido === 2) ? _documento.bodega_destino : "BD");
                    documento.setEmpresaDestino(_documento.empresa_destino);
                    var pedido = PedidoAuditoria.get().setNumero(_documento.pedido);
                    documento.setPedido(pedido);
                    $scope.documentosAprobados.push(documento);
                };

            };
            /*
             * funcion para paginar anterior
             * @returns {lista datos}
             */
            $scope.paginaAnterior = function() {

                if ($scope.datos_view.paginaactual === 1)
                    return;
                $scope.datos_view.paginaactual--;
                that.listarDespachosAuditados();
            };


            /*
             * funcion para paginar siguiente
             * @returns {lista datos}
             */
            $scope.paginaSiguiente = function() {
                $scope.datos_view.paginaactual++;
                that.listarDespachosAuditados();
            };


            /**
             * +Descripcion Se visualiza la tabla con todas las aprobaciones
             *              por parte del personal de seguridad
             */
            $scope.listaAprobaciones = {
                data: 'documentosAprobados',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getRazonSocial()', displayName: 'Empresa', width: "25%"},
                    {field: 'getPrefijo()', displayName: 'prefijo', width: "25%"},
                    {field: 'getNumero()', displayName: 'Numero', width: "20%"},
                    {field: 'fecha_registro', displayName: 'Fecha Registro', width: "20%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                            <li ng-if="row.entity.get_estado_cotizacion() == \'0\' || row.entity.get_estado_cotizacion() == \'2\' " ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_modificar_estado }}" ng-click="activarCotizacion(row.entity)" >Activar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="imprimirDespacho(row.entity)" >Reporte</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="detalleDespachoAprobado(row.entity)" >Detalle</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="sincronizarDocumento(row.entity)" >Sincronizar</a></li>\
                                             </ul>\
                                       </div>'
                    }
                ]
            };

            /*
             * @Author: Eduar
             * @param {DocumentoAuditado} documento
             * +Descripcion: handler para sincronizar documento
             */
            $scope.sincronizarDocumento = function(documento){
                var obj = {
                    session: $scope.session,
                    documento: {
                        prefijo_documento : documento.getPrefijo(),
                        numero_documento : documento.getNumero(),
                        bodega_destino : documento.getBodegaDestino(),
                        empresa_id: documento.getEmpresaId(),
                        tipo_pedido:documento.getTipoPedido(),
                        numero_pedido : documento.getPedido().getNumero()
                    }
                };

                AuditoriaDespachoService.sincronizarDocumento(obj, function(data){
                    var msj = "Ha ocurrido un error sincronizando el documento";
                    var titulo = "Error";
                    
                    if(data.status === 200){
                        msj = "Documento sincronizado correctamente";
                        titulo = "Mensaje del sistema";
                    } else if(data.status !== 500) {
                        msj = data.msj;
                    } 
                    
                    AlertService.mostrarVentanaAlerta(titulo, data.msj);
                });
                
            };

            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler para imprimir el despacho de un pedido
             */
            $scope.imprimirDespacho = function(documento) {

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            empresa: $scope.datos_view.empresaSeleccionada.getCodigo(),
                            numero: documento.getNumero(),
                            prefijo: documento.getPrefijo()
                        }
                    }
                };
                Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_DOCUMENTO_DESPACHO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        var nombre = data.obj.movimientos_bodegas.nombre_pdf;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                    }

                });

            };

            /*
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Funcion encargada de cambiar de GUI cuando 
             *              se presiona el boton de detalle de la tabla
             *              de datos
             */
            $scope.detalleDespachoAprobado = function(documentoAprobado) {
                localStorageService.add("auditoriaDespachos",
                        {
                            empresa: documentoAprobado.getEmpresaId(),
                            prefijo: documentoAprobado.getPrefijo(),
                            numero: documentoAprobado.getNumero(),
                            estado: 1
                        });
                $state.go('AuditoriaDespachos');

            };


            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Funcion que permitira desplegar el popup datePicker
             *               de la fecha iniciañ
             * @param {type} $event
             */
            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.datos_view.datepicker_fecha_inicial = true;
                $scope.datos_view.datepicker_fecha_final = false;

            };

            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Funcion que permitira desplegar el popup datePicker
             *               de la fecha final
             * @param {type} $event
             */
            $scope.abrir_fecha_final = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datos_view.datepicker_fecha_inicial = false;
                $scope.datos_view.datepicker_fecha_final = true;

            };



            /**
             * @author Cristian Ardila
             * @fecha 16/02/2016
             * +Descripcion Metodo principal el cual validar si el usuario
             *              ha seleccionado la empresa, centro de utilidad y
             *              bodega
             */
            that.init(empresa, function() {

                if (!Usuario.getUsuarioActual().getEmpresa()) {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
                } else {
                    if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                            Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                        AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                    } else {
                        if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                            AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                        } else {
                            $scope.datos_view.estadoSesion = false;
                            that.listarEmpresas(function(estado) {
                                that.listarDespachosAuditados();
                            });
                        }
                    }
                }
            });


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                // set localstorage

                $scope.datos_view = null;

            });

        }]);
});
