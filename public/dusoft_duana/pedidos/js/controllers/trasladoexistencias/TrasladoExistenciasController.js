//Controlador de la View verpedidosfarmacias.html

define(["angular",
    "js/controllers",
    'includes/slide/slideContent',
    'models/generacionpedidos/pedidosfarmacias/PedidoFarmacia',
    'includes/Constants/Url'], function(angular, controllers) {

    controllers.controller('TrasladoExistenciasController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'CentroUtilidad', 'Bodega',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request,
                Empresa, CentroUtilidad, Bodega,
                API, socket, AlertService, $state, Usuario,
                localStorageService, $modal) {

            var self = this;

            
                
            $scope.rootExistencias = {};
            $scope.rootExistencias.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };


            //Se comenta debido a que no se requiere la empresa actual del usuaio, si no farmacias duana
             /* var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
            $scope.rootExistencias.empresaSeleccionada = EmpresaPedidoFarmacia.get(empresa.getNombre(), empresa.getCodigo());*/

            var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
            var centro = angular.copy(empresa.getCentroUtilidadSeleccionado());
            var bodega = angular.copy(centro.getBodegaSeleccionada());

            $scope.rootExistencias.empresaSeleccionada = EmpresaPedidoFarmacia.get(empresa.getNombre(), empresa.getCodigo());
            $scope.rootExistencias.centroUtilidadSeleccionado = CentroUtilidad.get(centro.getNombre(), centro.getCodigo());
            $scope.rootExistencias.bodegaSeleccionado = Bodega.get(bodega.getNombre(), bodega.getCodigo());

            $scope.rootExistencias.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            console.log("usuario actual ", Usuario.getUsuarioActual().getEmpresa(), $scope.rootExistencias.empresaSeleccionada);
            //selecciona la empresa del usuario


            $scope.rootExistencias.ultima_busqueda = {};

            $scope.rootExistencias.paginaactual = 1;

            $scope.rootExistencias.termino_busqueda = "";

            $scope.rootExistencias.filtros = [
                /*
                {nombre : "Razon social", razonSocial:true},*/
                {nombre : "Descripcion", descripcionProducto:true},                
                {nombre : "Codigo", codigoProducto:true}    
            ];

            $scope.rootExistencias.filtro  = $scope.rootExistencias.filtros[0];


            $scope.rootExistencias.opcionesModulo = {
                btnModificarPedido: {
                    'click': $scope.rootExistencias.opciones.sw_modificar_pedido
                },
                btnModificarEspecialPedido: {
                    'click': $scope.rootExistencias.opciones.sw_modificacion_especial_pedidos
                },
                btnConsultarPedido: {
                    'click': $scope.rootExistencias.opciones.sw_consultar_pedido
                }
            };

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs",
                "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs",
                "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs"];

            $scope.rootExistencias.lista_pedidos_farmacias = {
                data: 'rootExistencias.empresaSeleccionada.obtenerPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting:true,
                columnDefs: [
                    {field: 'descripcion_estado_actual_pedido', displayName: 'Estado', cellClass: "txt-center", visible: $scope.rootExistencias.opciones.sw_ver_columna_estado_pedidos,
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

                    $scope.rootExistencias.empresaSeleccionada.agregarPedido(pedido);

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
                    session: $scope.rootExistencias.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: $scope.rootExistencias.termino_busqueda,
                            empresa_id: $scope.rootExistencias.empresaSeleccionada.getCodigo(),
                            pagina_actual: $scope.rootExistencias.paginaactual,
                            filtro:  $scope.rootExistencias.filtro 
                        }
                    }
                };

                self.consultarEncabezados(obj, function(data) {
                    
                    if(data.status === 200){
                        if(data.obj.pedidos_farmacias.length > 0){
                            
                            /*las empresas del usuario (de la session) son de tipo Empresa, por lo tanto se requiere asegurar 
                              que sean de tipo EmpresaPedidoFarmacia para acceder a los metodos 
                              de esta ultima*/

                            $scope.rootExistencias.empresaSeleccionada = EmpresaPedidoFarmacia.get(
                                    $scope.rootExistencias.empresaSeleccionada.getNombre(),
                                    $scope.rootExistencias.empresaSeleccionada.getCodigo()
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
             * @param {PedidoFarmacia} pedido
             * +Descripcion: Permite reemplazar un objeto pedido que viene del socket
             */
            self.reemplazarPedidoEstado = function(pedido) {
                var empresa = $scope.rootExistencias.empresaSeleccionada;
                if(empresa!== undefined){
                    
                    for (var i in empresa.obtenerPedidos() ) {
                        var _pedido = empresa.obtenerPedidos()[i];

                        if (_pedido.get_numero_pedido() === pedido.numero_pedido) {

                            _pedido.setDatos(pedido);

                            break;
                        }
                    }
                
                }
                
            };
            
          /*
           * @Author: Eduar
           * @param {Object} filtro
           * +Descripcion: Handler del dropdown de busqueda
           */
                
          
          $scope.onSeleccionFiltro = function(filtro){
              $scope.rootExistencias.filtro = filtro;
          };
          
          /*
           * @Author: Eduar
           * @param {string} estado
           * +Descripcion: Handler del boton enviar email
           */
                        
           $scope.ventanaEnviarEmail = function(pedido) {
               PedidosFarmaciasService.ventanaEnviarEmail($scope.rootExistencias.session, pedido,function(err, archivo){
                    if(err.err){
                        AlertService.mostrarMensaje("warning", err.msj);
                    } else if(archivo) {
                        $scope.visualizarReporte("/reports/" + archivo, archivo, "_blank");
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
                $scope.rootExistencias.paginaactual = 1;
                self.buscarPedidos();
            };

            /*
             * @Author: Eduar
             * @param {Object} event
             * +Descripcion: handler del text input para buscar pedidos por descripcion
             */
            $scope.onCampoBuscarPedidos = function(event) {
                if (event.which === 13) {
                    $scope.rootExistencias.paginaactual = 1;
                    self.buscarPedidos();
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: funcion helper que permite paginar
             */
            $scope.paginaAnterior = function() {
                if ($scope.rootExistencias.paginaactual === 1) {
                    return;
                }

                $scope.rootExistencias.paginaactual--;
                self.buscarPedidos();
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: funcion helper que permite paginar
             */
            $scope.paginaSiguiente = function() {
                $scope.rootExistencias.paginaactual++;
                self.buscarPedidos(function(resultado){
                    if(!resultado){
                        $scope.rootExistencias.paginaactual--;
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
                    session: $scope.rootExistencias.session,
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
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
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
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                socket.removeAllListeners();
            });
            
            localStorageService.remove("pedidoFarmacia");
           //self.buscarPedidos();
           
           
          self.traerEmpresas = function(callback) {

                $scope.rootExistencias.listaEmpresas = [];
                $scope.rootExistencias.listaCentroUtilidad = [];
                $scope.rootExistencias.listaBodegas = [];
                

                var obj = {
                    session: $scope.rootExistencias.session,
                    data: {
                        pedidos_farmacias:{
                            permisos_kardex:true
                        }
                    }
                };
                Request.realizarRequest(URL.CONSTANTS.API.KARDEX.LISTAR_EMPRESAS_FARMACIAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        for (var i in data.obj.empresas) {
                            var empresa = EmpresaPedidoFarmacia.get(
                                    data.obj.empresas[i].razon_social,
                                    data.obj.empresas[i].empresa_id
                            );

                            $scope.rootExistencias.listaEmpresas.push(empresa);
                        }

                        if (callback)
                            callback();
                    }

                });

            };
            
            self.consultarCentrosUtilidadPorEmpresa = function(callback) {

                $scope.rootExistencias.listaCentroUtilidad = [];

                var obj = {
                    session: $scope.rootExistencias.session,
                    data: {
                        centro_utilidad: {
                            empresa_id: $scope.rootExistencias.empresaSeleccionada.getCodigo()
                        }
                    }
                };

                Request.realizarRequest(URL.CONSTANTS.API.KARDEX.CENTROS_UTILIDAD_EMPRESAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        for (var i in data.obj.centros_utilidad) {
                            var centroUtilidad = CentroUtilidad.get(
                                    data.obj.centros_utilidad[i].descripcion,
                                    data.obj.centros_utilidad[i].centro_utilidad_id
                            );

                            $scope.rootExistencias.listaCentroUtilidad.push(centroUtilidad);
                        }
                        if (callback)
                            callback();
                    }

                });
            };
            
            self.consultarBodegasPorEmpresa = function(callback) {

                $scope.rootExistencias.listaBodegas = [];
                var obj = {
                    session: $scope.rootExistencias.session,
                    data: {
                        bodegas: {
                            empresa_id: $scope.rootExistencias.empresaSeleccionada.getCodigo(),
                            centro_utilidad_id: $scope.rootExistencias.centroUtilidadSeleccionado.getCodigo()
                        }
                    }
                };

                Request.realizarRequest(URL.CONSTANTS.API.KARDEX.BODEGAS_EMPRESA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        for (var i in data.obj.bodegas) {
                            var bodega = Bodega.get(
                                    data.obj.bodegas[i].descripcion,
                                    data.obj.bodegas[i].bodega_id
                            );

                            $scope.rootExistencias.listaBodegas.push(bodega);
                        }
                        if (callback)
                            callback();
                    }
                });
            };
            
            $scope.consultarCentrosUtilidadPorEmpresa = function(){
                $scope.rootExistencias.centroUtilidadSeleccionado = null;
                $scope.rootExistencias.bodegaSeleccionado = null;
            };
            
            $scope.consultarBodegasPorEmpresa = function(){
                
            };
            
            self.traerEmpresas(function(){
                self.consultarCentrosUtilidadPorEmpresa(function(){
                    self.consultarBodegasPorEmpresa(function(){
                        
                    });
                });
            });


        }]);

});
