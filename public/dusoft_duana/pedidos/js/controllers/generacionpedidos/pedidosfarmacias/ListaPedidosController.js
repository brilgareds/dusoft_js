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
        '$state', "Usuario", "localStorageService", "$modal","ListaPedidosFarmaciasService",
        function($scope, $rootScope, Request,
                EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                CentroUtilidadPedidoFarmacia, BodegaPedidoFarmacia,
                API, socket, AlertService, $state, Usuario,
                localStorageService, $modal, ListaPedidosFarmaciasService) {

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
                    {field: 'farmaciaOrigen.getCentroUtilidadSeleccionado().getNombre()', displayName: 'Farmacia'},
                    {field: 'farmaciaOrigen.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getNombre()', displayName: 'Bodega'},
                    {field: 'zona', displayName: 'Zona'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'estado_actual_pedido', displayName: 'EstadoId', visible: false},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "8%",
                    cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null)" ng-if="rootPedidosFarmacias.opciones.sw_modificar_pedido">\n\
                                                <a href="javascript:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'1\')" ng-validate-events="{{rootPedidosFarmacias.opcionesModulo.btnModificarPedido}}" >Modificar</a>\
                                            </li>\
                                            <li><a href="javascript:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'2\')" ng-validate-events="{{rootPedidosFarmacias.opcionesModulo.btnConsultarPedido}}">Ver</a></li>\
                                            <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null)" ng-if="rootPedidosFarmacias.opciones.sw_modificacion_especial_pedidos">\
                                                <a href="javascript:void(0);" ng-click="onVerPedidoFarmacia(row.entity, \'3\')" ng-validate-events="{{rootPedidosFarmacias.opcionesModulo.btnModificarEspecialPedido}}" >Modificación Especial</a>\
                                            </li>\
                                            <li ng-if="row.entity.getTieneDespacho()">\
                                                <a href="javascript:void(0);" ng-click="imprimirDespacho(row.entity)">Documento Despacho</a>\
                                            </li>\
                                        </ul>\n\
                                    </div>'
                    }

                ]

            };

            /*
             * @Author: Eduar
             * @param {Array<object>} pedidos
             * +Descripcion: metodo encargado de serializar el json de pedidos, depende de self.crearPedido()
             */

            self.renderPedidos = function(pedidos) {

                for (var i in pedidos) {

                    var obj = pedidos[i];

                    var pedido = ListaPedidosFarmaciasService.crearPedido(obj);
                    
                    pedido.setTieneDespacho(obj.tiene_despacho).
                    setDespachoEmpresaId(obj.despacho_empresa_id).
                    setDespachoPrefijo(obj.despacho_prefijo).
                    setDespachoNumero(obj.despacho_numero);

                      //Falta el campo del estado True o False para botón "Imprimir EFC"

                      //pedido.setEnUso(obj.en_uso);
                    

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
            
            localStorageService.remove("pedidoFarmacia");
            self.buscarPedidos();

            /*
             *   var that = this;
             
             that.pedido = PedidoVenta.get();
             
             $scope.rootPedidosFarmacias = {};
             
             //$scope.rootPedidosFarmacias.opciones = $scope.$parent.$parent.opciones;
             $scope.rootPedidosFarmacias.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
             
             
             
             
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
             
             console.log(">>>>>> Opciones Eventos: ", $scope.rootPedidosFarmacias.opcionesModulo);
             
             
             $scope.rootPedidosFarmacias.Empresa = EmpresaPedido;
             $scope.rootPedidosFarmacias.Pedido = PedidoVenta;
             
             $scope.rootPedidosFarmacias.paginas = 0;
             $scope.rootPedidosFarmacias.items = 0;
             $scope.rootPedidosFarmacias.termino_busqueda = "";
             $scope.rootPedidosFarmacias.ultima_busqueda = {};
             $scope.rootPedidosFarmacias.paginaactual = 1;
             
             $scope.rootPedidosFarmacias.listado_pedidos = [];
             
             $scope.rootPedidosFarmacias.ultima_busqueda.seleccion = "";
             $scope.rootPedidosFarmacias.ultima_busqueda.termino_busqueda = "";
             
             $scope.rootPedidosFarmacias.seleccion = Usuario.getUsuarioActual().getEmpresa().getCodigo();
             
             $scope.rootPedidosFarmacias.session = {
             usuario_id: Usuario.getUsuarioActual().getId(),
             auth_token: Usuario.getUsuarioActual().getToken()
             };
             
             $scope.rootPedidosFarmacias.empresasDestino = Usuario.getUsuarioActual().getEmpresasFarmacias();
             
             $scope.rootPedidosFarmacias.listado_farmacias = [];
             
             
             var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs"];
             
             that.listarFarmacias = function() {
             
             var listado_farmacias = [];
             
             console.log("Listado Empresas Farmacias: ",$scope.rootPedidosFarmacias.empresasDestino);
             
             $scope.rootPedidosFarmacias.empresasDestino.forEach(function(farmacia){
             
             var obj_farmacia = {
             empresa_id: farmacia.codigo,
             razon_social: farmacia.nombre
             };
             
             listado_farmacias.push(obj_farmacia);
             });
             
             $scope.rootPedidosFarmacias.listado_farmacias = listado_farmacias;
             console.log("Listado Farmacias: ", $scope.rootPedidosFarmacias.listado_farmacias);
             
             };
             
             
             $scope.obtenerParametros = function() {
             
             //valida si cambio el termino de busqueda
             if ($scope.rootPedidosFarmacias.ultima_busqueda.termino_busqueda !== $scope.rootPedidosFarmacias.termino_busqueda
             || $scope.rootPedidosFarmacias.ultima_busqueda.seleccion !== $scope.rootPedidosFarmacias.seleccion)
             
             {
             $scope.rootPedidosFarmacias.paginaactual = 1;
             
             }
             
             var obj = {
             session: $scope.rootPedidosFarmacias.session,
             data: {
             pedidos_farmacias: {
             termino_busqueda: $scope.rootPedidosFarmacias.termino_busqueda,
             empresa_id: $scope.rootPedidosFarmacias.seleccion,
             //empresa_id: $scope.farmacia_seleccionada.get_farmacia_id(),
             pagina_actual: $scope.rootPedidosFarmacias.paginaactual,
             filtro: {}
             }
             }
             };
             
             return obj;
             };
             
             $scope.onBuscarPedidosFarmacias = function(obj, paginando) {
             
             that.consultarEncabezadosPedidos(obj, function(data) {
             
             $scope.rootPedidosFarmacias.ultima_busqueda = {
             termino_busqueda: $scope.rootPedidosFarmacias.termino_busqueda,
             seleccion: $scope.rootPedidosFarmacias.seleccion
             //seleccion: $scope.farmacia_seleccionada.get_farmacia_id()
             };
             
             that.renderPedidosFarmacias(data.obj, paginando);
             
             });
             };
             
             
             that.consultarEncabezadosPedidos = function(obj, callback) {
             
             var url = API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS;
             
             Request.realizarRequest(url, "POST", obj, function(data) {
             
             if (data.status === 200) {
             console.log("Consulta exitosa: ", data.msj);
             
             if (callback !== undefined && callback !== "" && callback !== 0) {
             callback(data);
             }
             }
             else {
             console.log("Error en la consulta: ", data.msj);
             }
             });
             };
             
             that.renderPedidosFarmacias = function(data, paginando) {
             
             $scope.rootPedidosFarmacias.items = data.pedidos_farmacias.length;
             
             //se valida que hayan registros en una siguiente pagina
             if (paginando && $scope.rootPedidosFarmacias.items === 0) {
             if ($scope.rootPedidosFarmacias.paginaactual > 1) {
             $scope.rootPedidosFarmacias.paginaactual--;
             }
             AlertService.mostrarMensaje("warning", "No se encontraron más registros");
             return;
             }
             
             $scope.rootPedidosFarmacias.Empresa.vaciarPedidosFarmacia();
             
             if (data.pedidos_farmacias.length > 0)
             {
             $scope.rootPedidosFarmacias.Empresa.setCodigo(data.pedidos_farmacias[0].empresa_origen_id);
             }
             
             for (var i in data.pedidos_farmacias) {
             
             var obj = data.pedidos_farmacias[i];
             
             var pedido = that.crearPedido(obj);
             
             $scope.rootPedidosFarmacias.Empresa.agregarPedidoFarmacia(pedido);
             
             }
             
             };
             
             that.crearPedido = function(obj) {
             
             //console.log(">>>> OBJETO DE CONSULTA -- DESPACHO: ", obj.despacho_numero," - " ,obj.tiene_despacho," - " ,obj.numero_pedido);
             
             var pedido = PedidoVenta.get();
             
             var datos_pedido = {
             numero_pedido: obj.numero_pedido,
             fecha_registro: obj.fecha_registro,
             descripcion_estado_actual_pedido: obj.descripcion_estado_actual_pedido,
             estado_actual_pedido: obj.estado_actual_pedido,
             estado_separacion: obj.estado_separacion
             };
             
             pedido.setDatos(datos_pedido);
             pedido.setTipo(PedidoVenta.TIPO_FARMACIA);
             
             pedido.setObservacion(obj.observacion);
             
             pedido.setDespachoEmpresaId(obj.despacho_empresa_id);
             
             pedido.setDespachoPrefijo(obj.despacho_prefijo);
             
             pedido.setDespachoNumero(obj.despacho_numero);
             
             pedido.setTieneDespacho(obj.tiene_despacho);
             
             //Falta el campo del estado True o False para botón "Imprimir EFC"
             
             //pedido.setEnUso(obj.en_uso);
             
             var farmacia = FarmaciaVenta.get(
             obj.farmacia_id,
             obj.bodega_id,
             obj.nombre_farmacia,
             obj.nombre_bodega,
             obj.centro_utilidad,
             obj.nombre_centro_utilidad
             );
             
             pedido.setFarmacia(farmacia);
             
             return pedido;
             };
             
             //Grid Lista Pedidos Definitivos
             $scope.rootPedidosFarmacias.lista_pedidos_farmacias = {
             data: 'rootPedidosFarmacias.Empresa.getPedidosFarmacia()',
             enableColumnResize: true,
             enableRowSelection: false,
             columnDefs: [
             {field: 'descripcion_estado_actual_pedido', displayName: 'Estado', cellClass: "txt-center", visible: $scope.rootPedidosFarmacias.opciones.sw_ver_columna_estado_pedidos,
             cellTemplate: "<button ng-class='agregarClase(row.entity.estado_actual_pedido)'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},
             {field: 'numero_pedido', displayName: 'Número Pedido'},
             {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia'},
             {field: 'farmacia.nombre_bodega', displayName: 'Bodega'},
             {field: 'zona', displayName: 'Zona'},
             {field: 'fecha_registro', displayName: 'Fecha'},
             {field: 'estado_actual_pedido', displayName: 'EstadoId', visible: false},
             {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "8%",
             cellTemplate: '<div class="btn-group">\
             <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
             <ul class="dropdown-menu dropdown-options">\
             <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null)" ng-if="rootPedidosFarmacias.opciones.sw_modificar_pedido">\n\
             <a href="javascript:void(0);" ng-click="onEditarPedidoFarmacia(row.entity)" ng-validate-events="{{rootPedidosFarmacias.opcionesModulo.btnModificarPedido}}" >Modificar</a>\
             </li>\
             <li><a href="javascript:void(0);" ng-click="onVerPedidoFarmacia(row.entity)" ng-validate-events="{{rootPedidosFarmacias.opcionesModulo.btnConsultarPedido}}">Ver</a></li>\
             <li ng-show="!(row.entity.estado_actual_pedido != 0 || row.entity.estado_separacion != null)" ng-if="rootPedidosFarmacias.opciones.sw_modificacion_especial_pedidos">\
             <a href="javascript:void(0);" ng-click="onEdicionEspecialPedidoFarmacia(row.entity)" ng-validate-events="{{rootPedidosFarmacias.opcionesModulo.btnModificarEspecialPedido}}" >Modificación Especial</a>\
             </li>\
             <li ng-if="row.entity.getTieneDespacho()">\
             <a href="javascript:void(0);" ng-click="imprimirDespachos(row.entity.getDespachoEmpresaId(),row.entity.getDespachoNumero(),row.entity.getDespachoPrefijo())">Documento Despacho</a>\
             </li>\
             </ul>\n\
             </div>'
             }
             
             ]
             
             };
             
             
             $scope.agregarClase = function(estado) {
             
             return estados[estado];
             };
             
             // Agregar Restriccion de acuerdo al estado de asigancion del pedido
             $scope.agregarRestriccion = function(estado_separacion) {
             
             var clase = "";
             if (estado_separacion)
             clase = "glyphicon glyphicon-lock";
             
             return clase;
             };
             
             $scope.abrirViewPedidoFarmacia = function() {
             
             PedidoVenta.pedidoseleccionado = "";
             localStorageService.set("pedidoseleccionado", PedidoVenta.pedidoseleccionado);
             
             
             var datos_pedido = {
             numero_pedido: "",
             fecha_registro: "",
             descripcion_estado_actual_pedido: "",
             estado_actual_pedido: "",
             estado_separacion: ""
             };
             
             that.pedido.setDatos(datos_pedido);
             that.pedido.setTipo(2);
             that.pedido.setObservacion("");
             //that.pedido.setEnUso(0);
             
             //Creación objeto farmacia
             var farmacia = FarmaciaVenta.get(
             0,
             0,
             "",
             "",
             0,
             ""
             );
             
             that.pedido.setFarmacia(farmacia);
             
             $scope.rootPedidosFarmacias.Empresa.setPedidoSeleccionado(that.pedido);
             
             
             $scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().vaciarProductos();
             
             //console.log(">>>>>>>>>>>>> Pedido Seleccionado En Uso: ", $scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().getEnUso());
             
             $state.go('CreaPedidosFarmacias');
             };
             
             //Edición Especial de Pedido Farmacia - Solo Jefe de Farmacia
             $scope.onEdicionEspecialPedidoFarmacia = function(data) {
             if(!$scope.validarPermisosPedido(data)){
             
             $scope.mostrarAlertaPermisoDenegadoPedido(data);
             return;
             }
             var pedido = PedidoVenta.get();
             
             var datos_pedido = {
             numero_pedido: data.numero_pedido,
             fecha_registro: data.fecha_registro,
             descripcion_estado_actual_pedido: data.descripcion_estado_actual_pedido,
             estado_actual_pedido: data.estado_actual_pedido,
             estado_separacion: data.estado_separacion
             };
             
             pedido.setDatos(datos_pedido);
             pedido.setTipo(2);
             pedido.setObservacion(data.observacion);
             pedido.setEditable(true);
             pedido.setModificacionEspecial(true);
             
             //Set en_uso -- Hacer consulta antes para confirmar estado en BD -- Recibir información del evento (socket)
             
             //Objeto para consulta de encabezado pedido
             var obj = {
             session: $scope.rootPedidosFarmacias.session,
             data: {
             pedidos_farmacias: {
             termino_busqueda: data.numero_pedido,
             empresa_id: $scope.rootPedidosFarmacias.seleccion,
             pagina_actual: $scope.rootPedidosFarmacias.paginaactual,
             filtro: {}
             }
             }
             };
             
             that.consultarEncabezadosPedidos(obj, function(data_encabezado) {
             
             //pedido.setEnUso(data_encabezado.obj.pedidos_farmacias[0].en_uso);
             
             var farmacia = FarmaciaVenta.get(
             data.farmacia.farmacia_id,
             data.farmacia.bodega_id,
             data.farmacia.nombre_farmacia,
             data.farmacia.nombre_bodega,
             data.farmacia.centro_utilidad_id,
             data.farmacia.nombre_centro_utilidad
             );
             
             pedido.setFarmacia(farmacia);
             //Insertar aquí el pedido seleccionado para el singleton Empresa
             $scope.rootPedidosFarmacias.Empresa.setPedidoSeleccionado(pedido);
             
             PedidoVenta.pedidoseleccionado = data.numero_pedido;
             
             console.log(">>>>>>>>>>>>>>>>>>>> ESTADO ACTUAL PEDIDO: ", $scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().estado_actual_pedido);
             
             //if ($scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().getEnUso() === 0) {
             if ($scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0') {
             //$scope.$emit('bloqueoModificarPedido', false);
             $state.go('CreaPedidosFarmacias');
             //$scope.$emit('bloqueoModificarPedido', false);
             
             }
             else {
             
             //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
             $scope.opts = {
             backdrop: true,
             backdropClick: true,
             dialogFade: false,
             keyboard: true,
             template: ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Aviso: </h4>\
             </div>\
             <div class="modal-body row">\
             <div class="col-md-12">\
             <h4 >El Pedido ' + $scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().numero_pedido + ' ha sido asignado. No puede modificarse!</h4>\
             </div>\
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
             </div>',
             scope: $scope,
             controller: function($scope, $modalInstance) {
             $scope.close = function() {
             $modalInstance.close();
             };
             }
             };
             
             var modalInstance = $modal.open($scope.opts);
             }
             
             });                
             
             };
             
             
             //Edición Normal de Pedido Farmacia
             $scope.onEditarPedidoFarmacia = function(data) {
             if(!$scope.validarPermisosPedido(data)){
             
             $scope.mostrarAlertaPermisoDenegadoPedido(data);
             return;
             }
             
             
             var pedido = PedidoVenta.get();
             
             var datos_pedido = {
             numero_pedido: data.numero_pedido,
             fecha_registro: data.fecha_registro,
             descripcion_estado_actual_pedido: data.descripcion_estado_actual_pedido,
             estado_actual_pedido: data.estado_actual_pedido,
             estado_separacion: data.estado_separacion
             };
             
             pedido.setDatos(datos_pedido);
             pedido.setTipo(2);
             pedido.setObservacion(data.observacion);
             pedido.setEditable(true);
             
             //Set en_uso -- Hacer consulta antes para confirmar estado en BD -- Recibir información del evento (socket)
             
             //Objeto para consulta de encabezado pedido
             var obj = {
             session: $scope.rootPedidosFarmacias.session,
             data: {
             pedidos_farmacias: {
             termino_busqueda: data.numero_pedido,
             empresa_id: $scope.rootPedidosFarmacias.seleccion,
             pagina_actual: $scope.rootPedidosFarmacias.paginaactual,
             filtro: {}
             }
             }
             };
             
             that.consultarEncabezadosPedidos(obj, function(data_encabezado) {
             
             //pedido.setEnUso(data_encabezado.obj.pedidos_farmacias[0].en_uso);
             
             var farmacia = FarmaciaVenta.get(
             data.farmacia.farmacia_id,
             data.farmacia.bodega_id,
             data.farmacia.nombre_farmacia,
             data.farmacia.nombre_bodega,
             data.farmacia.centro_utilidad_id,
             data.farmacia.nombre_centro_utilidad
             );
             
             pedido.setFarmacia(farmacia);
             //Insertar aquí el pedido seleccionado para el singleton Empresa
             $scope.rootPedidosFarmacias.Empresa.setPedidoSeleccionado(pedido);
             
             PedidoVenta.pedidoseleccionado = data.numero_pedido;
             
             console.log(">>>>>>>>>>>>>>>>>>>> ESTADO ACTUAL PEDIDO: ", $scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().estado_actual_pedido);
             
             //if ($scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().getEnUso() === 0) {
             if ($scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0') {
             //$scope.$emit('bloqueoModificarPedido', false);
             $state.go('CreaPedidosFarmacias');
             //$scope.$emit('bloqueoModificarPedido', false);
             
             }
             else {
             
             //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
             $scope.opts = {
             backdrop: true,
             backdropClick: true,
             dialogFade: false,
             keyboard: true,
             template: ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Aviso: </h4>\
             </div>\
             <div class="modal-body row">\
             <div class="col-md-12">\
             <h4 >El Pedido ' + $scope.rootPedidosFarmacias.Empresa.getPedidoSeleccionado().numero_pedido + ' ha sido asignado. No puede modificarse!</h4>\
             </div>\
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
             </div>',
             scope: $scope,
             controller: function($scope, $modalInstance) {
             $scope.close = function() {
             $modalInstance.close();
             };
             }
             };
             
             var modalInstance = $modal.open($scope.opts);
             }
             
             });
             
             };
             
             
             $scope.onVerPedidoFarmacia = function(data) {
             if(!$scope.validarPermisosPedido(data)){
             
             $scope.mostrarAlertaPermisoDenegadoPedido(data);
             return;
             }
             
             var pedido = PedidoVenta.get();
             
             var datos_pedido = {
             numero_pedido: data.numero_pedido,
             fecha_registro: data.fecha_registro,
             descripcion_estado_actual_pedido: data.descripcion_estado_actual_pedido,
             estado_actual_pedido: data.estado_actual_pedido,
             estado_separacion: data.estado_separacion
             };
             
             pedido.setDatos(datos_pedido);
             pedido.setTipo(2);
             pedido.setObservacion(data.observacion);
             pedido.setEditable(false);
             
             //Set en_uso -- Hacer consulta antes para confirmar estado en BD -- Recibir información del evento (socket)
             
             //Objeto para consulta de encabezado pedido
             var obj = {
             session: $scope.rootPedidosFarmacias.session,
             data: {
             pedidos_farmacias: {
             termino_busqueda: data.numero_pedido,
             empresa_id: $scope.rootPedidosFarmacias.seleccion,
             pagina_actual: $scope.rootPedidosFarmacias.paginaactual,
             filtro: {}
             }
             }
             };
             
             that.consultarEncabezadosPedidos(obj, function(data_encabezado) {
             
             //pedido.setEnUso(data_encabezado.obj.pedidos_farmacias[0].en_uso);
             
             var farmacia = FarmaciaVenta.get(
             data.farmacia.farmacia_id,
             data.farmacia.bodega_id,
             data.farmacia.nombre_farmacia,
             data.farmacia.nombre_bodega,
             data.farmacia.centro_utilidad_id,
             data.farmacia.nombre_centro_utilidad
             );
             
             pedido.setFarmacia(farmacia);
             //Insertar aquí el pedido seleccionado para el singleton Empresa
             $scope.rootPedidosFarmacias.Empresa.setPedidoSeleccionado(pedido);
             
             PedidoVenta.pedidoseleccionado = data.numero_pedido;
             
             //$scope.$emit('bloqueoModificarPedido', true);
             
             $state.go('CreaPedidosFarmacias');
             
             //$scope.$emit('bloqueoModificarPedido', true);
             
             });
             
             };
             
             //$scope.$emit('mostrarseleccionproducto', tipo_cliente, datos_de, datos_para, observacion, that.pedido);
             
             //Método para liberar Memoria de todo lo construido en ésta clase
             $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
             
             $scope.rootPedidosFarmacias = {};
             $scope.$$watchers = null;
             
             });
             
             //eventos de widgets
             $scope.onTeclaBuscarPedidosFarmacias = function(ev) {
             
             if (ev.which === 13) {
             $scope.onBuscarPedidosFarmacias($scope.obtenerParametros());
             }
             };
             
             $scope.paginaAnterior = function() {
             $scope.rootPedidosFarmacias.paginaactual--;
             $scope.onBuscarPedidosFarmacias($scope.obtenerParametros(), true);
             };
             
             $scope.paginaSiguiente = function() {
             $scope.rootPedidosFarmacias.paginaactual++;
             $scope.onBuscarPedidosFarmacias($scope.obtenerParametros(), true);
             };
             
             $scope.valorSeleccionado = function() {
             
             $scope.onBuscarPedidosFarmacias($scope.obtenerParametros());
             };
             
             
             //referencia del socket io
             socket.on("onListarPedidosFarmacias", function(datos) {
             
             if (datos.status === 200) {
             var obj = datos.obj.pedidos_farmacias[0];
             var pedido = that.crearPedido(obj);
             
             that.reemplazarPedidoEstado(pedido);
             AlertService.mostrarMensaje("success", "pedido Asignado Correctamente!");
             
             }
             });
             
             
             that.reemplazarPedidoEstado = function(pedido) {
             
             if($scope.rootPedidosFarmacias.Empresa !== undefined){
             
             for (var i in $scope.rootPedidosFarmacias.Empresa.getPedidosFarmacia()) {
             var _pedido = $scope.rootPedidosFarmacias.Empresa.getPedidosFarmacia()[i];
             
             if (pedido.numero_pedido === _pedido.numero_pedido) {
             _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
             _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
             _pedido.estado_separacion = pedido.estado_separacion;
             
             break;
             }
             }
             
             }
             
             };
             
             
             $scope.onBuscarPedidosFarmacias($scope.obtenerParametros());
             that.listarFarmacias("");
             */

        }]);

});
