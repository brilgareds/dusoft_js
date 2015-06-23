//Controlador de la View pedidosclientes.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta', 'models/VendedorPedido'], function(angular, controllers) {

    var fo = controllers.controller('PedidosClientesVentasController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', 'Usuario', 'VendedorPedido', "$modal",

        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, PedidoVenta, API, socket, AlertService, $state, Usuario, VendedorPedido, $modal) {

            var that = this;

            $scope.rootPedidosClientes = {};
            
            $scope.rootPedidosClientes.Empresa = EmpresaPedido;

            $scope.rootPedidosClientes.paginas = 0;
            $scope.rootPedidosClientes.items = 0;
            $scope.rootPedidosClientes.termino_busqueda = "";
            $scope.rootPedidosClientes.ultima_busqueda = {};
            $scope.rootPedidosClientes.paginaactual = 1;
            $scope.rootPedidosClientes.listado_cotizaciones = [];
            
            $scope.rootPedidosClientes.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            //that.estados = [ "btn btn-warning btn-xs", "btn btn-success btn-xs" ];
            //that.estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs"];
            that.estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs", "btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs"];
            
            /* INICIO - Operaciones nuevas */
            
            $scope.obtenerParametros = function() {

                //valida si cambio el termino de busqueda
                if ($scope.rootPedidosClientes.ultima_busqueda.termino_busqueda !== $scope.rootPedidosClientes.termino_busqueda)
                {
                    $scope.rootPedidosClientes.paginaactual = 1;
                }

                var obj = {
                    session: $scope.rootPedidosClientes.session,
                    data: {
                        pedidos_cliente: {
                            empresa_id: '03',                            
                            termino_busqueda: $scope.rootPedidosClientes.termino_busqueda,
                            pagina_actual: $scope.rootPedidosClientes.paginaactual,
                            filtro: {}
                        }
                    }
                };

                return obj;
            };
            
            //$scope.onBuscarPedido($scope.obtenerParametros(),"");

            $scope.onBuscarPedido = function(obj, paginando) {

                that.consultarEncabezadosPedidos(obj, function(data) {

                    $scope.rootPedidosClientes.ultima_busqueda = {
                        termino_busqueda: $scope.rootPedidosClientes.termino_busqueda
                    }

                    that.renderPedidos(data.obj, paginando);

                });
            };


            that.consultarEncabezadosPedidos = function(obj, callback) {

                var url = API.PEDIDOS.LISTADO_PEDIDOS_CLIENTES;

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

            that.renderPedidos = function(data, paginando) {

                $scope.rootPedidosClientes.items = data.resultado_consulta.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.rootPedidosClientes.items === 0) {
                    if ($scope.rootPedidosClientes.paginaactual > 1) {
                        $scope.rootPedidosClientes.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron más registros");
                    return;
                }

                $scope.rootPedidosClientes.Empresa.vaciarPedidos();

                if (data.resultado_consulta.length > 0)
                {
                    $scope.rootPedidosClientes.Empresa.setCodigo(data.resultado_consulta[0].empresa_id);
                }

                for (var i in data.resultado_consulta) {

                    var obj = data.resultado_consulta[i];

                    var pedido = that.crearPedido(obj);

                    $scope.rootPedidosClientes.Empresa.agregarPedido(pedido);

                }

            };

            that.crearPedido = function(obj) {

                var pedido = PedidoVenta.get();
                var observacion = obj.observacion.split("||obs_cartera||");

                var datos_pedido = {
                    numero_pedido: obj.numero_pedido,
                    fecha_registro: obj.fecha_registro,
                    estado: obj.estado,
                    estado_actual_pedido: obj.estado_pedido,
                    estado_separacion: obj.estado_separacion
                };

                pedido.setDatos(datos_pedido);
                
                pedido.setTipo(PedidoVenta.TIPO_CLIENTE);

                pedido.setNumeroCotizacion('');
                
                pedido.setValorPedido(obj.valor_pedido);

                pedido.setObservacion(obj.observacion[0]);
                
                pedido.setDespachoEmpresaId(obj.despacho_empresa_id);
                
                pedido.setDespachoPrefijo(obj.despacho_prefijo);
                
                pedido.setDespachoNumero(obj.despacho_numero);
                
                pedido.setTieneDespacho(obj.tiene_despacho);
                
                //pedido.tiene_obs_cartera - propiedad solo existente en ésta instancia
                pedido.tiene_obs_cartera = false;
                
                if(observacion.length > 1) {
                    pedido.setObservacionCartera(observacion[1]);
                    pedido.tiene_obs_cartera = true;
                }
                else {
                    pedido.setObservacionCartera("");
                }
                
                var vendedor = VendedorPedido.get(
                        obj.nombre_vendedor,    //nombre_tercero
                        obj.tipo_id_vendedor,   //tipo_id_tercero
                        obj.vendedor_id,        //id
                        '',                     //direccion
                        obj.telefono_vendedor   //telefono
                    );
                
                pedido.setVendedor(vendedor);

                var cliente = ClientePedido.get(
                        obj.nombre_cliente,    //nombre_tercero
                        obj.direccion_cliente, //direccion
                        obj.tipo_id_cliente,   //tipo_id_tercero
                        obj.cliente_id,        //id
                        obj.telefono_cliente   //telefono
                        );
                           
                //console.log(">>>> Objeto BD Datos: ",obj);
                cliente.setTipoPaisId(obj.tipo_pais_cliente);//pais
                cliente.setTipoDepartamentoId(obj.tipo_departamento_cliente);//departamento
                cliente.setTipoMunicipioId(obj.tipo_municipio_cliente);//municipio
                //cliente.setUbicacion(); //ubicacion

                pedido.setCliente(cliente);
                
                //console.log(">>>> Objeto Cliente: ", pedido.getCliente());

                return pedido;
            };            
            
            /* FIN - Operaciones nuevas */
            
            $scope.rootPedidosClientes.lista_pedidos_clientes = {
                data: 'rootPedidosClientes.Empresa.getPedidos()',
                //data: 'rootPedidosClientes.listado_cotizaciones',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                //showFilter: true,
                multiSelect: false,
                columnDefs: [
                    {field: 'estado_pedido', displayName: 'Estado Proceso', cellClass: "txt-center", width: "9%",
                        cellTemplate:   "   <button ng-if='row.entity.estado_actual_pedido==0' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> No Asignado\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==1' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> Asignado\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==2' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> Auditado\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==3' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> En Zona Despacho\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==4' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> Despachado\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==5' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> Despachado con Pendientes\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==6' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> Separación Finalizada\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==7' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> En Auditoria\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==8' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> Auditado con pdtes\
                                            </button>\
                                            <button ng-if='row.entity.estado_actual_pedido==9' ng-class='agregarClase(row.entity.estado_actual_pedido)'>\
                                                <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> En zona con pdtes\
                                            </button>\
                                        "},                
                    {field: 'numero_pedido', displayName: 'Número Pedido', width: "9%"},
                    {field: 'cliente.nombre_tercero', displayName: 'Cliente'},
                    {field: 'vendedor.nombre_tercero', displayName: 'Vendedor'},
                    {field: 'fecha_registro', displayName: 'Fecha', width: "10%"},
                    {field: 'valor_pedido', displayName: '$ Valor', cellFilter: "currency:'$ '", width: "10%"},
                    {field: 'estado', displayName: 'Estado Pedido', cellClass: "txt-center", width: "9%",
                        cellTemplate:   "   <label ng-if='row.entity.estado==0'>Inactivo</label><!--Inactivo-->\
                                            <label ng-if='row.entity.estado==1'>Activo</label>\
                                            <label ng-if='row.entity.estado==2'>Anulado</label>\
                                            <label ng-if='row.entity.estado==3'>Entregado</label>\
                                        "},                    
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="onVerPedido(row.entity)" >Ver</a></li>\
                                                <li></li>\
                                                <li ng-if="(row.entity.estado_actual_pedido == 0) && !row.entity.estado_separacion"><a href="javascript:void(0);" ng-click="onEditarPedido(row.entity)">Modificar</a></li>\
                                                <li ng-if="(row.entity.estado_actual_pedido == 0) && !row.entity.estado_separacion"></li>\
                                                <li ng-if="(row.entity.estado_actual_pedido == 0) && !row.entity.estado_separacion && row.entity.estado==0"><a href="javascript:void(0);" ng-click="onAprobarCartera(row.entity)">Aprobar Cartera</a></li>\
                                                <li ng-if="(row.entity.estado_actual_pedido == 0) && !row.entity.estado_separacion && row.entity.estado==0"></li>\
                                                <li ng-if="row.entity.tiene_obs_cartera"><a href="javascript:void(0);" ng-click="onVerObservacionCartera(row.entity)">Ver Obs Cartera</a></li>\
                                                <li ng-if="row.entity.tiene_obs_cartera"></li>\
                                                <li ng-if="row.entity.getTieneDespacho()">\
                                                    <a href="javascript:void(0);" ng-click="imprimirDespachos(row.entity.getDespachoEmpresaId(),row.entity.getDespachoNumero(),row.entity.getDespachoPrefijo())">Documento Despacho</a>\
                                                </li>\
                                            </ul>\
                                        </div>'
                    }

                ]

            };
            
/* NUEVO */

            $scope.imprimirDespachos = function(empresa, numero, prefijo) {

                console.log(">>>> Documentos Despacho: ",empresa," - " ,numero, " - ",prefijo);

                var test = {
                    session: $scope.rootPedidosClientes.session,
                    data: {
                        movimientos_bodegas: {
                            empresa: empresa,
                            numero: numero,
                            prefijo: prefijo
                        }
                    }
                };
                
                /*
                 var url = API.PEDIDOS.CONSULTA_ESTADO_COTIZACION;

                Request.realizarRequest(url, "POST", obj, function(data_estado) {
                 */
                
                Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_DOCUMENTO_DESPACHO, "POST", test, function(data) {
                    if (data.status === 200) {
                        var nombre = data.obj.movimientos_bodegas.nombre_pdf;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "download");
                    }

                });

            };

            $scope.onAprobarCartera = function(obj) {

                $scope.rootPedidosClientes.Empresa.setPedidoSeleccionado(obj);
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generarpedidos/aprobarpedido.html',
                    controller: "AprobarPedidoController",
                    resolve :{
                        Empresa : function(){
                           return $scope.rootPedidosClientes.Empresa;
                        }//,
//                        tipo_documento: function(){
//                           return tipo_documento;
//                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
                
            }
            /**/
            
            $scope.onVerObservacionCartera = function(obj){

                console.log(">>> Observación Cartera - Button: ", obj.getObservacionCartera());

                var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Observación Cartera</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4> '+obj.getObservacionCartera()+' </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">Cerrar</button>\
                                    </div>';

                controller = function($scope, $modalInstance) {

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                };

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };

                var modalInstance = $modal.open($scope.opts);
                
            };

/* NUEVO - FIN*/
            
            //Clase para color de estado en proceso
            $scope.agregarClase = function(estado) {

                return that.estados[estado];
            };
            
            // Agregar Restriccion de acuerdo al estado de asigancion del pedido
            $scope.agregarRestriccion = function(estado_separacion) {
                
                var clase = "";
                if (estado_separacion)
                    clase = "glyphicon glyphicon-lock";

                return clase;
            };
            
            that.consultarEstadoCotizacion = function(data, callback){
                
                //Objeto para consulta de encabezado pedido
                var obj = {
                    session: $scope.rootPedidosClientes.session,
                    data: {
                        estado_cotizacion: {
                            numero_cotizacion: data.numero_cotizacion,
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTA_ESTADO_COTIZACION;

                Request.realizarRequest(url, "POST", obj, function(data_estado) {

                    if (data_estado.status === 200) {
                        console.log("Consulta exitosa: ", data_estado.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {

                            var estado = data_estado.obj.resultado_consulta[0].estado;
                            
                            callback(estado);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data_estado.msj);
                    }
                });
                
            };
            
            //CONSULTA ESTADO DEL PEDIDO
            that.consultarEstadoPedido = function(data, callback){
                
                //Objeto para consulta de Estado del pedido en el encabezado del mismo
                var obj = {
                    session: $scope.rootPedidosClientes.session,
                    data: {
                        estado_pedido: {
                            numero_pedido: data.numero_pedido,
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTA_ESTADO_PEDIDO;

                Request.realizarRequest(url, "POST", obj, function(data_estado) {

                    if (data_estado.status === 200) {
                        console.log("Consulta exitosa: ", data_estado.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {

                            var estado_pedido = data_estado.obj.resultado_consulta[0].estado_pedido;
                            var estado_separacion = data_estado.obj.resultado_consulta[0].estado_separacion;
                            
                            callback(estado_pedido, estado_separacion);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data_estado.msj);
                    }
                });
                
            };
            
            that.consultarContratoCliente = function(data, callback){

                //Objeto Consulta Contrato Cliente
                var obj = {
                    session: $scope.rootPedidosClientes.session,
                    data: {
                        contrato_cliente: {
                            tipo_id_cliente: data.cliente.getTipoId(),
                            cliente_id: data.cliente.getId()
                        }
                    }
                };
                
                var url = API.TERCEROS.CONSULTAR_CONTRATO_CLIENTE;
                
                Request.realizarRequest(url, "POST", obj, function(data_contrato) {

                    if (data_contrato.status === 200) {
                        console.log("Consulta exitosa: ", data_contrato.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {

                            var array_datos_contrato = data_contrato.obj.resultado_consulta;
                            
                            var datos_contrato = {};
                            
                            if(array_datos_contrato.length > 1){

                                array_datos_contrato.forEach(function(info_contrato){
                                    if(info_contrato.estado === '1')
                                        datos_contrato = info_contrato;
                                });
                            
                            }
                            else{
                                datos_contrato = array_datos_contrato[0];
                            }
                            
                            callback(datos_contrato.contrato_cliente_id);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data_contrato.msj);
                    }
                });
                
            };
            
            $scope.onVerPedido = function(data){
                
                $scope.rootPedidosClientes.Empresa.setPedidoSeleccionado(data);
                
                $scope.rootPedidosClientes.Empresa.getPedidoSeleccionado().setEditable(false);
                        
                that.consultarContratoCliente(data, function(contrato_cliente_id){

                    $scope.rootPedidosClientes.Empresa.getPedidoSeleccionado().getCliente().setContratoId(contrato_cliente_id);

                    //console.log(">>>> Objeto Empresa - Pedido Seleccionado: ", $scope.rootPedidosClientes.Empresa.getPedidoSeleccionado());

                    $state.go('CotizacionCliente');

                });
            };
            
            $scope.onEditarPedido = function(data) {

                that.consultarEstadoPedido(data, function(estado_pedido, estado_separacion){
                //that.consultarEstadoCotizacion(data, function(estado){

                    //$scope.rootPedidosClientes.Empresa.setPedidoSeleccionado(data);

                    //console.log(">>>>>>>>> ESTADO PEDIDO: ", estado_pedido);
                    //console.log(">>>>>>>>> DATA ENCABEZADO PEDIDO: ",data);

                    //(row.entity.estado_actual_pedido == 0 || row.entity.estado_actual_pedido == 1) && !row.entity.estado_separacion
                    if ((estado_pedido === '0' || estado_pedido === '1') && !estado_separacion) {
                    
                        //console.log(">>>>>>>>> ESTADO PEDIDO 0 ... INGRESO IF ");
                        
                        //console.log(">>>> DATOS OBJETO PEDIDO SELECCIONADO: ", data);
                        
                        $scope.rootPedidosClientes.Empresa.setPedidoSeleccionado(data);
                        
                        that.consultarContratoCliente(data, function(contrato_cliente_id){
                            
                            $scope.rootPedidosClientes.Empresa.getPedidoSeleccionado().getCliente().setContratoId(contrato_cliente_id);
                            $scope.rootPedidosClientes.Empresa.getPedidoSeleccionado().setEditable(true);
                            
                            //console.log(">>>> Objeto Empresa - Pedido Seleccionado: ", $scope.rootPedidosClientes.Empresa.getPedidoSeleccionado());
                            
                            $state.go('CotizacionCliente');
                            
                        });

                    }
                    else {
                        //console.log(">>>>>>>> EMPRESA SELECIONADO antes ALERTA!: ",$scope.rootPedidosClientes.Empresa);
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
                                                <h4 >El Pedido ' + data.numero_pedido + ' ya está siendo separado o en proceso de <br>despacho. No puede modificarse!</h4>\
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
            
            /*NUEVO*/
            
           /* $scope.onNuevaCotizacion = function (){

                $scope.rootPedidosClientes.Empresa.setPedidoSeleccionado({});
                $state.go('CotizacionCliente');
            };*/
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
               //Limpieza de objeto rootPedidosClientes
               $scope.rootPedidosClientes = {};

            });
            
            //eventos de widgets
            $scope.onKeyBuscarPedidos = function(ev) {

                 if (ev.which == 13) {
                     //Aquí no se usa el parámetro "termino_busqueda" porque ésta variable se usa en el scope y se actualiza sin necesidad de pasarla como parámetro
                     $scope.onBuscarPedido($scope.obtenerParametros(), true);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.rootPedidosClientes.paginaactual--;
                 $scope.onBuscarPedido($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootPedidosClientes.paginaactual++;
                 $scope.onBuscarPedido($scope.obtenerParametros(), true);
            };

            $scope.valorSeleccionado = function() {

            };
            
            $scope.onTabPedidosClick = function(){
                $scope.onBuscarPedido($scope.obtenerParametros(),"");
            }
            
            //$scope.onBuscarPedido($scope.obtenerParametros(),"");

        }]);
});
