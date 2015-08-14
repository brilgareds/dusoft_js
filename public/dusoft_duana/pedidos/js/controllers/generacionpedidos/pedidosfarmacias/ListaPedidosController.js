//Controlador de la View verpedidosfarmacias.html

define(["angular",
    "js/controllers",
    'includes/slide/slideContent',
    'models/generacionpedidos/pedidosfarmacias/PedidoFarmacia'], function(angular, controllers) {

    controllers.controller('ListaPedidosController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaPedido', 'PedidoFarmacia',
        'CentroUtilidadPedidoFarmacia', 'BodegaPedidoFarmacia',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal","PedidosFarmaciasService",
        function($scope, $rootScope, Request,
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
            

            var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

            $scope.rootPedidosFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(empresa.getNombre(), empresa.getCodigo());
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
            

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs",
                "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs",
                "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs"];

            $scope.rootPedidosFarmacias.lista_pedidos_farmacias = {
                data: 'rootPedidosFarmacias.empresaSeleccionada.obtenerPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'descripcion_estado_actual_pedido', displayName: 'Estado', cellClass: "txt-center", visible: $scope.rootPedidosFarmacias.opciones.sw_ver_columna_estado_pedidos,
                        cellTemplate: "<button ng-class='agregarClase(row.entity.estado_actual_pedido)'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},
                    {field: 'numero_pedido', displayName: 'Número Pedido'},
                    {field: 'farmaciaDestino.getCentroUtilidadSeleccionado().getNombre()', displayName: 'Farmacia'},
                    {field: 'farmaciaDestino.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getNombre()', displayName: 'Bodega'},
                    {field: 'zona', displayName: 'Zona'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'estado_actual_pedido', displayName: 'EstadoId', visible: false},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "8%",
                    cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null)">\n\
                                                <a href="javascript:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'1\')" ng-validate-events="{{root.servicio.getOpcionesModulo().btnModificarPedido}}" >Modificar</a>\
                                            </li>\
                                            <li><a href="javascript:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'2\')" ng-validate-events="{{root.servicio.getOpcionesModulo().btnVerPedido}}">Ver</a></li>\
                                            <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null)">\
                                                <a href="javascript:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'3\')" ng-validate-events="{{root.servicio.getOpcionesModulo().btnModificacionEspecial}}" >Modificación Especial</a>\
                                            </li>\
                                            <li ng-if="row.entity.getTieneDespacho()">\
                                                <a href="javascript:void(0);" ng-click="imprimirDespacho(row.entity)">Documento Despacho</a>\
                                            </li>\
                                            <li ng-if="false">\
                                                <a href="javascript:void(0);" ng-click="ventanaEnviarEmail(row.entity)">Enviar Email</a>\
                                            </li>\
                                        </ul>\n\
                                    </div>'
                    }

                ]

            };
            
            
           $scope.ventanaEnviarEmail = function(pedido) {
               console.log("farmacia destino" ,pedido.getFarmaciaOrigen())
               PedidosFarmaciasService.ventanaEnviarEmail($scope.rootPedidosFarmacias.session, pedido,function(err, archivo){
                    if(err.err){
                        AlertService.mostrarMensaje("warning", err.msj);
                    } else if(archivo) {
                        $scope.visualizarReporte("/reports/" + archivo, archivo, "download");
                    }
                });
            };
            /*
             * @Author: Eduar
             * @param {Array<object>} pedidos
             * +Descripcion: metodo encargado de serializar el json de pedidos, depende de self.crearPedido()
             */

            self.renderPedidos = function(pedidos) {

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
            self.consultarEncabezados = function(obj, callback) {

                var url = API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {

                     callback(data);

                });
            };


            /*
             * @Author: Eduar
             * +Descripcion: function helper que prepara los parametros y hace el llamado para buscar los encabezados de pedidos de farmacia
             * depende de self.consultarEncabezados() y self.renderPedidos()
             */
            self.buscarPedidos = function(callback) {

                var obj = {
                    session: $scope.rootPedidosFarmacias.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: $scope.rootPedidosFarmacias.termino_busqueda,
                            empresa_id: $scope.rootPedidosFarmacias.empresaSeleccionada.getCodigo(),
                            pagina_actual: $scope.rootPedidosFarmacias.paginaactual,
                            filtro: {}
                        }
                    }
                };

                self.consultarEncabezados(obj, function(data) {
                    
                    if(data.status === 200){
                        if(data.obj.pedidos_farmacias.length > 0){
                            
                            /*las empresas del usuario (de la session) son de tipo Empresa, por lo tanto se requiere asegurar 
                              que sean de tipo EmpresaPedidoFarmacia para acceder a los metodos 
                              de esta ultima*/

                            $scope.rootPedidosFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(
                                    $scope.rootPedidosFarmacias.empresaSeleccionada.getNombre(),
                                    $scope.rootPedidosFarmacias.empresaSeleccionada.getCodigo()
                            );


                            self.renderPedidos(data.obj.pedidos_farmacias);

                            if(callback){
                                callback(true);
                            }
                        } else {
                            if(callback){
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
             * @param {string} estado
             * +Descripcion: retorna la clase que debe agregarse al boton de estado
             */

            $scope.agregarClase = function(estado) {

                return estados[estado];
            };

            /*
             * @Author: Eduar
             * +Descripcion: handler del combo de empresas
             */

            $scope.onBuscarPedidos = function() {
                $scope.rootPedidosFarmacias.paginaactual = 1;
                self.buscarPedidos();
            };

            /*
             * @Author: Eduar
             * @param {Object} event
             * +Descripcion: handler del text input para buscar pedidos por descripcion
             */
            $scope.onCampoBuscarPedidos = function(event) {
                if (event.which === 13) {
                    $scope.rootPedidosFarmacias.paginaactual = 1;
                    self.buscarPedidos();
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: funcion helper que permite paginar
             */
            $scope.paginaAnterior = function() {
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
            $scope.paginaSiguiente = function() {
                $scope.rootPedidosFarmacias.paginaactual++;
                self.buscarPedidos(function(resultado){
                    if(!resultado){
                        $scope.rootPedidosFarmacias.paginaactual--;
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler para imprimir el despacho de un pedido
             */
            $scope.imprimirDespacho = function(pedido) {

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
                Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_DOCUMENTO_DESPACHO, "POST", test, function(data) {
                    if (data.status === 200) {
                        var nombre = data.obj.movimientos_bodegas.nombre_pdf;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "download");
                    }

                });

            };
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler de la opcion modificar pedido 
             */
            
            $scope.onVerPedidoFarmacia = function(pedido, tipo) {
                localStorageService.set("pedidoFarmacia", {
                   numero_pedido: pedido.get_numero_pedido(),
                   tipoModificacion: tipo
                });
                
                $state.go('GuardarPedido');
             
             };
             
             
             //referencia del socket io
            socket.on("onListarPedidosFarmacias", function(datos) {

                if (datos.status === 200) {
                    console.log("pedido del socket ", datos);
                    var pedido = datos.obj.pedidos_farmacias[0];
                    self.reemplazarPedidoEstado(pedido);

                }
            }); 
            
            
            self.reemplazarPedidoEstado = function(pedido) {
                var empresa = $scope.rootPedidosFarmacias.empresaSeleccionada;
                if(empresa!== undefined){
                    
                    for (var i in empresa.obtenerPedidos() ) {
                        var _pedido = empresa.obtenerPedidos()[i];

                        if (_pedido.get_numero_pedido() === pedido.numero_pedido) {
                            /*_pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                            _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                            _pedido.estado_separacion = pedido.estado_separacion;*/
                            _pedido.setDatos(pedido);

                            break;
                        }
                    }
                
                }
                
            };
            
            localStorageService.remove("pedidoFarmacia");
            self.buscarPedidos();


        }]);

});
