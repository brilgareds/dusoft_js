//Controlador de la View verpedidosfarmacias.html

define(["angular",
    "js/controllers",
    'includes/slide/slideContent',
    'models/generacionpedidos/pedidosfarmacias/PedidoFarmacia',
    "includes/components/logspedidos/LogsPedidosController"], function (angular, controllers) {

    controllers.controller('ListaPedidosController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaPedido', 'PedidoFarmacia',
        'CentroUtilidadPedidoFarmacia', 'BodegaPedidoFarmacia',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal", "PedidosFarmaciasService",
        function ($scope, $rootScope, Request,
                EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                CentroUtilidadPedidoFarmacia, BodegaPedidoFarmacia,
                API, socket, AlertService, $state, Usuario,
                localStorageService, $modal, PedidosFarmaciasService) {

            var self = this;


            $scope.rootPedidosFarmacias = {};

            $scope.rootPedidosFarmacias.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };


            /*Se comenta debido a que no se requiere la empresa actual del usuaio, si no farmacias duana
             * var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
             $scope.rootPedidosFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(empresa.getNombre(), empresa.getCodigo());*/

            $scope.rootPedidosFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get("FARMACIA DUANA", 'FD');
            $scope.rootPedidosFarmacias.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;

            //selecciona la empresa del usuario


            $scope.rootPedidosFarmacias.ultima_busqueda = {};

            $scope.rootPedidosFarmacias.paginaactual = 1;

            $scope.rootPedidosFarmacias.termino_busqueda = "";



            $scope.rootPedidosFarmacias.opcionesModulo = {
                btnModificarPedido: {
                    'click': $scope.rootPedidosFarmacias.opciones.sw_modificar_pedido
                },
                btnModificarEspecialPedido: {
                    'click': $scope.rootPedidosFarmacias.opciones.sw_modificacion_especial_pedidos
                },
                btnConsultarPedido: {
                    'click': $scope.rootPedidosFarmacias.opciones.sw_consultar_pedido
                }
            };

            $scope.rootPedidosFarmacias.filtros = [
                /*
                 {nombre : "Razon social", razonSocial:true},*/
                {nombre: "Bodega", descripcionBodega: true},
                {nombre: "Pedido", numeroPedido: true},
                {nombre: "Usuario", usuario: true}
            ];

            $scope.rootPedidosFarmacias.filtro = $scope.rootPedidosFarmacias.filtros[0];

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs",
                "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs",
                "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-warning btn-xs", "btn btn-danger btn-xs"];

            $scope.rootPedidosFarmacias.lista_pedidos_farmacias = {
                data: 'rootPedidosFarmacias.empresaSeleccionada.obtenerPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'descripcion_estado_actual_pedido', displayName: 'Estado', cellClass: "txt-center", visible: $scope.rootPedidosFarmacias.opciones.sw_ver_columna_estado_pedidos, width: "8%",
                        cellTemplate: "<button ng-class='agregarClase(row.entity.estado_actual_pedido)'> \
					<span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span>\
					   <span ng-class='agregarIcon(row.entity.estado_actual_pedido)'>\
					    {{row.entity.descripcion_estado_actual_pedido}}\
					    </span>\
					 </button>"},
                    {field: 'numero_pedido', displayName: 'PF - PC', cellClass: "txt-center", width: "8%",
                        cellTemplate: "<div>{{row.entity.numero_pedido}}<a ng-if='row.entity.getNumeroPedidoCliente()>0' title='Numero Pedido Cliente'> - {{row.entity.getNumeroPedidoCliente()}}</a></div>"},

                    {field: 'farmaciaDestino.getCentroUtilidadSeleccionado().getNombre()', displayName: 'Farmacia'},
                    {field: 'farmaciaDestino.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getNombre()', displayName: 'Bodega'},
                    {field: 'farmaciaDestino.getZona()', displayName: 'Zona'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'estado_actual_pedido', displayName: 'EstadoId', visible: false},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null)">\
                                                <a href="javascripts:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'1\')" ng-validate-events="{{root.servicio.getOpcionesModulo().btnModificarPedido}}" >Modificar</a>\
                                            </li>\
                                            <li  ng-if="row.entity.estado_actual_pedido != 11 "><a href="javascripts:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'2\')" ng-validate-events="{{root.servicio.getOpcionesModulo().btnVerPedido}}">Ver</a></li>\
                                            <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null) ||  row.entity.estado_actual_pedido == 5  ||  row.entity.estado_actual_pedido == 8 || row.entity.estado_actual_pedido == 9 || row.entity.estado_actual_pedido == 10">\
                                                <a href="javascripts:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'3\')" ng-validate-events="{{root.servicio.getOpcionesModulo().btnModificacionEspecial}}" >Modificación Especial</a>\
                                            </li>\
                                            <li ng-if="row.entity.getTieneDespacho()">\
                                                <a href="javascripts:void(0);" ng-click="imprimirDespacho(row.entity)">Documento Despacho</a>\
                                            </li>\
                                            <li ng-if="row.entity.getTieneDespacho() && (row.entity.estado_actual_pedido == 4 || row.entity.estado_actual_pedido == 5)">\
                                                <a href="javascripts:void(0);" ng-click="imprimirPlanilla(row.entity)">Planilla Despacho</a>\
                                            </li>\
					     <li ng-if="row.entity.estado_actual_pedido== 0 && rootPedidosFarmacias.opciones.sw_anulacion_pedidos_farmacia">\
                                                <a href="javascripts:void(0);" ng-click="onAnularPedido(row.entity)">Anular</a>\
                                            </li>\
                                            <li ng-if="false">\
                                                <a href="javascripts:void(0);" ng-click="ventanaEnviarEmail(row.entity)">Enviar Email</a>\
                                            </li>\
                                            <li ng-if="rootPedidosFarmacias.opciones.sw_consultar_logs">\
                                                <a href="javascripts:void(0);" ng-click="onTraerLogsPedidos(row.entity)">Ver logs</a>\
                                            </li>\
                                        </ul>\n\
                                    </div>'
                    }

                ]

            };

            $scope.agregarIcon = function (dato) {

                var icon = "";
                if (dato === '11') {
                    icon = "glyphicon glyphicon-remove-circle";
                }
                return icon;
            }

            /*
             * +Descripcion: Anula el pedido solo si esta en estado 'No Asignado' 
             * @param {type} dato
             * @returns {estado}
             */
            $scope.onAnularPedido = function (dato) {
                var parametros = {estado: 11, numeroPedido: dato.numero_pedido};
                self.modificarEstadoPedido(parametros);
            };

            self.modificarEstadoPedido = function (parametros) {
                var obj = {
                    session: $scope.rootPedidosFarmacias.session,
                    data: {
                        pedidos_farmacias: {
                            numeroPedido: parametros.numeroPedido,
                            estado: parametros.estado,
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().codigo
                        }
                    }
                };

                Request.realizarRequest(
                        API.PEDIDOS.FARMACIAS.ACTUALIZAR_ESTADO_PEDIDO_FARMACIA,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                self.buscarPedidos();
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El pedido No. " + parametros.numeroPedido + " Anulado correctamente");
                            }
                        }
                );
            };


            /*
             * @Author: Eduar
             * @param {Array<object>} pedidos
             * +Descripcion: metodo encargado de serializar el json de pedidos, depende de self.crearPedido()
             */

            self.renderPedidos = function (pedidos) {

                for (var i in pedidos) {

                    var obj = pedidos[i];

                    var pedido = PedidosFarmaciasService.crearPedido(obj);

                    pedido.setTieneDespacho(obj.tiene_despacho).
                            setDespachoEmpresaId(obj.despacho_empresa_id).
                            setDespachoPrefijo(obj.despacho_prefijo).
                            setDespachoNumero(obj.despacho_numero);

                    $scope.rootPedidosFarmacias.empresaSeleccionada.agregarPedido(pedido);

                }
            };

            /*
             * @Author: Eduar
             * @param {object} obj
             * @param {function} callback
             * +Descripcion: Metodo encargado de consultar los encabezados de los pedidos de farmacia
             */
            self.consultarEncabezados = function (obj, callback) {

                var url = API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function (data) {

                    callback(data);

                });
            };


            /*
             * @Author: Eduar
             * +Descripcion: function helper que prepara los parametros y hace el llamado para buscar los encabezados de pedidos de farmacia
             * depende de self.consultarEncabezados() y self.renderPedidos()
             */
            self.buscarPedidos = function (callback) {

                var obj = {
                    session: $scope.rootPedidosFarmacias.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: $scope.rootPedidosFarmacias.termino_busqueda,
                            empresa_id: $scope.rootPedidosFarmacias.empresaSeleccionada.getCodigo(),
                            empresa_id_actual: Usuario.getUsuarioActual().getEmpresa().codigo,
                            pagina_actual: $scope.rootPedidosFarmacias.paginaactual,
                            filtro: $scope.rootPedidosFarmacias.filtro
                        }
                    }
                };

                self.consultarEncabezados(obj, function (data) {

                    if (data.status === 200) {
                        if (data.obj.pedidos_farmacias.length > 0) {

                            /*las empresas del usuario (de la session) son de tipo Empresa, por lo tanto se requiere asegurar 
                             que sean de tipo EmpresaPedidoFarmacia para acceder a los metodos 
                             de esta ultima*/

                            $scope.rootPedidosFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(
                                    $scope.rootPedidosFarmacias.empresaSeleccionada.getNombre(),
                                    $scope.rootPedidosFarmacias.empresaSeleccionada.getCodigo()
                                    );


                            self.renderPedidos(data.obj.pedidos_farmacias);

                            if (callback) {
                                callback(true);
                            }
                        } else {
                            if (callback) {
                                callback(false);
                            }
                        }
                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error");
                    }

                });
            };

            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: Permite reemplazar un objeto pedido que viene del socket
             */
            self.reemplazarPedidoEstado = function (pedido) {
                var empresa = $scope.rootPedidosFarmacias.empresaSeleccionada;
                if (empresa !== undefined) {

                    for (var i in empresa.obtenerPedidos()) {
                        var _pedido = empresa.obtenerPedidos()[i];

                        if (_pedido.get_numero_pedido() === pedido.numero_pedido) {

                            _pedido.setDatos(pedido);

                            break;
                        }
                    }

                }

            };

            $scope.onTraerLogsPedidos = function (pedido) {

                var empresa = Usuario.getUsuarioActual().getEmpresa();
                var centro = empresa.getCentroUtilidadSeleccionado();

                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: '../includes/components/logspedidos/logspedidos.html',
                    controller: "LogsPedidosController",
                    windowClass: 'app-modal-window-xlg',
                    resolve: {
                        pedido: function () {
                            return pedido;
                        },
                        tipoPedido: function () {
                            return  '1';
                        },
                        empresaId: function () {
                            return empresa.getCodigo();
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
             * @param {Object} filtro
             * +Descripcion: Handler del dropdown de busqueda
             */


            $scope.onSeleccionFiltro = function (filtro) {
                $scope.rootPedidosFarmacias.filtro = filtro;
            };

            /*
             * @Author: Eduar
             * @param {string} estado
             * +Descripcion: Handler del boton enviar email
             */

            $scope.ventanaEnviarEmail = function (pedido) {
                PedidosFarmaciasService.ventanaEnviarEmail($scope.rootPedidosFarmacias.session, pedido, function (err, archivo) {
                    if (err.err) {
                        AlertService.mostrarMensaje("warning", err.msj);
                    } else if (archivo) {
                        $scope.visualizarReporte("/reports/" + archivo, archivo, "_blank");
                    }
                });
            };

            /*
             * @Author: Eduar
             * @param {string} estado
             * +Descripcion: retorna la clase que debe agregarse al boton de estado
             */

            $scope.agregarClase = function (estado) {

                return estados[parseInt(estado)];
            };

            /*
             * @Author: Eduar
             * +Descripcion: handler del combo de empresas
             */

            $scope.onBuscarPedidos = function () {
                $scope.rootPedidosFarmacias.paginaactual = 1;
                self.buscarPedidos();
            };

            /*
             * @Author: Eduar
             * @param {Object} event
             * +Descripcion: handler del text input para buscar pedidos por descripcion
             */
            $scope.onCampoBuscarPedidos = function (event) {
                if (event.which === 13) {
                    $scope.rootPedidosFarmacias.paginaactual = 1;
                    self.buscarPedidos();
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: funcion helper que permite paginar
             */
            $scope.paginaAnterior = function () {
                if ($scope.rootPedidosFarmacias.paginaactual === 1) {
                    return;
                }

                $scope.rootPedidosFarmacias.paginaactual--;
                self.buscarPedidos();
            };

            /*
             * @Author: Eduar
             * +Descripcion: funcion helper que permite paginar
             */
            $scope.paginaSiguiente = function () {
                $scope.rootPedidosFarmacias.paginaactual++;
                self.buscarPedidos(function (resultado) {
                    if (!resultado) {
                        $scope.rootPedidosFarmacias.paginaactual--;
                    }
                });
            };

            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler para imprimir el despacho de un pedido
             */
            $scope.imprimirDespacho = function (pedido) {

                var test = {
                    session: $scope.rootPedidosFarmacias.session,
                    data: {
                        movimientos_bodegas: {
                            empresa: pedido.getDespachoEmpresaId(),
                            numero: pedido.getDespachoNumero(),
                            prefijo: pedido.getDespachoPrefijo()
                        }
                    }
                };
                Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_DOCUMENTO_DESPACHO, "POST", test, function (data) {
                    if (data.status === 200) {
                        var nombre = data.obj.movimientos_bodegas.nombre_pdf;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                    }

                });

            };

            /*
             * @Author: German Galvis
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler para imprimir la planilla despacho de un pedido
             */
            $scope.imprimirPlanilla = function (pedido) {

                var obj = {
                    session: $scope.rootPedidosFarmacias.session,
                    data: {
                        empresa: pedido.getDespachoEmpresaId(),
                        numero: pedido.getDespachoNumero(),
                        prefijo: pedido.getDespachoPrefijo()
                    }
                };

                Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_PLANILLA_DESPACHO, "POST", obj, function (data) {
                    if (data.status === 200) {
                        var nombre = data.obj.planillas_despachos.nombre_reporte;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }


                });

            };

            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler de la opcion modificar pedido 
             */

            $scope.onVerPedidoFarmacia = function (pedido, tipo) {
                localStorageService.set("pedidoFarmacia", {
                    numero_pedido: pedido.get_numero_pedido(),
                    tipoModificacion: tipo
                });

                $state.go('GuardarPedido');

            };


            //referencia del socket io
            socket.on("onListarPedidosFarmacias", function (datos) {

                if (datos.status === 200) {

                    var pedido = datos.obj.pedidos_farmacias[0];
                    self.reemplazarPedidoEstado(pedido);

                }
            });

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                socket.remove(["onListarPedidosFarmacias"]);
            });

            localStorageService.remove("pedidoFarmacia");

            var empresaUsuario = Usuario.getUsuarioActual().getEmpresa();

            if (!empresaUsuario) {
                $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una empresa valida para generar pedidos.", tipo: "warning"});
            } else if (!empresaUsuario.getCentroUtilidadSeleccionado()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene un centro de utilidad valido para generar pedidos.", tipo: "warning"});
            } else if (!empresaUsuario.getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una bodega valida para generar pedidos", tipo: "warning"});
            } else {
                self.buscarPedidos();
            }

        }]);

});
