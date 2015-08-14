//Controlador de la View pedidosclientes.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/generarpedidos/ClientePedido', 
        'models/generarpedidos/PedidoVenta', 
        'models/generarpedidos/VendedorPedido'], function(angular, controllers) {

    var fo = controllers.controller('CotizacionesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', 'Usuario', 'VendedorPedido', "$modal",

        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, PedidoVenta, API, socket, AlertService, $state, Usuario, VendedorPedido, $modal) {

            var that = this;
            
            //se valida que el usuario tenga centro de utilidad y bodega
            var empresa = Usuario.getUsuarioActual().getEmpresa();
            
            if(!empresa){
                $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene una empresa valida para generar pedidos de clientes", tipo:"warning"});
            } else if(!empresa.getCentroUtilidadSeleccionado()){
                $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene un centro de utilidad valido para generar pedidos de clientes.", tipo:"warning"});
            } else if(!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()){
                $rootScope.$emit("onIrAlHome",{mensaje:"El usuario no tiene una bodega valida para generar pedidos de clientes", tipo:"warning"});
            }
            

            $scope.rootCotizaciones = {};
            
            $scope.rootCotizaciones.Empresa = EmpresaPedido;

            $scope.rootCotizaciones.paginas = 0;
            $scope.rootCotizaciones.items = 0;
            $scope.rootCotizaciones.termino_busqueda = "";
            $scope.rootCotizaciones.ultima_busqueda = {};
            $scope.rootCotizaciones.paginaactual = 1;
            $scope.rootCotizaciones.listado_cotizaciones = [];
            
            $scope.rootCotizaciones.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            that.estados = [ "btn btn-warning btn-xs", "btn btn-success btn-xs", "btn btn-info btn-xs" ];
            
            /* INICIO - Operaciones nuevas */
            
            $scope.obtenerParametros = function() {

                //valida si cambio el termino de busqueda
                if ($scope.rootCotizaciones.ultima_busqueda.termino_busqueda !== $scope.rootCotizaciones.termino_busqueda)
                {
                    $scope.rootCotizaciones.paginaactual = 1;
                }

                var obj = {
                    session: $scope.rootCotizaciones.session,
                    data: {
                        cotizaciones_cliente: {
                            empresa_id: Usuario.getUsuarioActual().empresa.codigo,//'03',                            
                            termino_busqueda: $scope.rootCotizaciones.termino_busqueda,
                            pagina_actual: $scope.rootCotizaciones.paginaactual,
                            filtro: {}
                        }
                    }
                };

                return obj;
            };
            
            //$scope.onBuscarCotizacion($scope.obtenerParametros(),"");

            $scope.onBuscarCotizacion = function(obj, paginando) {

                that.consultarEncabezadosCotizaciones(obj, function(data) {

                    $scope.rootCotizaciones.ultima_busqueda = {
                        termino_busqueda: $scope.rootCotizaciones.termino_busqueda
                    };

                    that.renderCotizaciones(data.obj, paginando);

                });
            };


            that.consultarEncabezadosCotizaciones = function(obj, callback) {

                var url = API.PEDIDOS.LISTAR_COTIZACIONES;

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

            that.renderCotizaciones = function(data, paginando) {

                $scope.rootCotizaciones.items = data.resultado_consulta.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.rootCotizaciones.items === 0) {
                    if ($scope.rootCotizaciones.paginaactual > 1) {
                        $scope.rootCotizaciones.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron más registros");
                    return;
                }

                $scope.rootCotizaciones.Empresa.vaciarPedidosTemporales();

                if (data.resultado_consulta.length > 0)
                {
                    $scope.rootCotizaciones.Empresa.setCodigo(data.resultado_consulta[0].empresa_id);
                }

                for (var i in data.resultado_consulta) {

                    var obj = data.resultado_consulta[i];

                    var cotizacion = that.crearCotizacion(obj);

                    $scope.rootCotizaciones.Empresa.agregarPedidoTemporal(cotizacion);

                }

            };

            that.crearCotizacion = function(obj) {

                var cotizacion = PedidoVenta.get();
                var observacion = obj.observaciones.split("||obs_cartera||");
                
                //console.log(">>>> Longitud OBSERVACIONES: ", observacion.length);

                var datos_cotizacion = {
                    numero_pedido: '',
                    fecha_registro: obj.fecha_registro,
                    estado: obj.estado
                };

                cotizacion.setDatos(datos_cotizacion);
                
                cotizacion.setTipo(PedidoVenta.TIPO_CLIENTE);

                cotizacion.setNumeroCotizacion(obj.numero_cotizacion);
                
                cotizacion.setValorCotizacion(obj.valor_cotizacion);

                cotizacion.setObservacion(observacion[0]);
                
                if(observacion.length > 1) {
                    cotizacion.setObservacionCartera(observacion[1]);
                }
                else {
                    cotizacion.setObservacionCartera("");
                }

                var vendedor = VendedorPedido.get(
                        obj.nombre_vendedor,    //nombre_tercero
                        obj.tipo_id_vendedor,   //tipo_id_tercero
                        obj.vendedor_id,        //id
                        '',                     //direccion
                        obj.telefono_vendedor   //telefono
                    );
                
                cotizacion.setVendedor(vendedor);

                var cliente = ClientePedido.get(
                        obj.nombre_cliente,    //nombre_tercero
                        obj.direccion_cliente, //direccion
                        obj.tipo_id_cliente,   //tipo_id_tercero
                        obj.cliente_id,        //id
                        obj.telefono_cliente   //telefono
                        );
                            
//                cliente.setPais(obj.pais);//pais
//                cliente.setDepartamento(obj.departamento);//departamento
//                cliente.setMunicipio(obj.municipio);//municipio
//                cliente.setUbicacion(); //ubicacion

                cliente.setTipoPaisId(obj.tipo_pais_cliente);//pais
                cliente.setTipoDepartamentoId(obj.tipo_departamento_cliente);//departamento
                cliente.setTipoMunicipioId(obj.tipo_municipio_cliente);//municipio
                cliente.setEmail(obj.email); //email

                cotizacion.setCliente(cliente);

                return cotizacion;
            };            
            
            /* FIN - Operaciones nuevas */
            
            $scope.rootCotizaciones.lista_pedidos_clientes = {
                data: 'rootCotizaciones.Empresa.getPedidosTemporales()',
                //data: 'rootCotizaciones.listado_cotizaciones',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                //showFilter: true,
                multiSelect: false,
                columnDefs: [
                    {field: 'estado', displayName: 'Estado', cellClass: "txt-center", width: "7%",
                        cellTemplate: " <button ng-if='row.entity.estado==0' ng-class='agregarClase(row.entity.estado)'>\
                                            Inactivo\
                                        </button>\
                                        <button ng-if='row.entity.estado==1' ng-class='agregarClase(row.entity.estado)'>\
                                            Activo\
                                        </button>\n\
                                        <button ng-if='row.entity.estado==2' ng-class='agregarClase(row.entity.estado)'>\
                                            Cartera Ok\
                                        </button>"},            
                    {field: 'numero_cotizacion', displayName: 'Número Cotización', width: "10%"},
                    {field: 'cliente.nombre_tercero', displayName: 'Cliente'},
                    {field: 'vendedor.nombre_tercero', displayName: 'Vendedor'},
                    {field: 'fecha_registro', displayName: 'Fecha', width: "10%"},
                    {field: 'valor_cotizacion', displayName: '$ Valor', cellFilter: "currency:'$ '", width: "10%"},                
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="onVerCotizacion(row.entity)" >Ver</a></li>\
                                                <li></li>\
                                                <li ng-if="row.entity.estado == 1 || row.entity.estado == 2"><a href="javascript:void(0);" ng-click="onEditarCotizacion(row.entity)">Modificar</a></li>\
                                                <li ng-if="row.entity.estado == 1 || row.entity.estado == 2"></li>\
                                                <li ng-if="row.entity.estado == 1 || row.entity.estado == 2"><a href="javascript:void(0);" ng-click="onCambiarEstado(row.entity)">Inactivar</a></li>\
                                                <li ng-if="row.entity.estado == 1 || row.entity.estado == 2"></li>\
                                                <li ng-if="row.entity.estado == 1"><a href="javascript:void(0);" ng-click="onAprobarCotizacion(row.entity)">Aprobar Cartera</a></li>\
                                                <li ng-if="row.entity.estado == 1"></li>\
                                                <li ng-if="row.entity.estado == 2"><a href="javascript:void(0);" ng-click="onVerObservacionCartera(row.entity)">Ver Obs Cartera</a></li>\
                                                <li ng-if="row.entity.estado == 2"></li>\
                                            </ul>\n\
                                        </div>'
                    }

                ]

            };
            
            /*NUEVO*/
            
            /**/
            $scope.onAprobarCotizacion = function(obj) {
                
//                var tipo_documento = '';
//                
//                if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined) {
//                    //Tipo Documento Cotización
//                    tipo_documento = 'c';
//                    
//                }
//                else if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined) {
//                    //Tipo Documento Pedido
//                    tipo_documento = 'p';
//                    
//                }

                $scope.rootCotizaciones.Empresa.setPedidoSeleccionado(obj);
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generarpedidos/aprobarcotizacion.html',
                    controller: "AprobarCotizacionController",
                    resolve :{
                        Empresa : function(){
                           return $scope.rootCotizaciones.Empresa;
                        }//,
//                        tipo_documento: function(){
//                           return tipo_documento;
//                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
                
            };
            /**/
            
            $scope.onVerObservacionCartera = function(obj){

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
            
            $scope.onCambiarEstado = function(obj){
                
                                var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>Seguro desea Inactivar la cotización '+obj.numero_cotizacion+' ? </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">No</button>\
                                        <button class="btn btn-primary" ng-click="aceptaInactivar()" ng-disabled="" >Si</button>\
                                    </div>';

                controller = function($scope, $modalInstance) {

                    $scope.aceptaInactivar = function() {
                        
                        //Se acepta eliminar y se procede
                        that.cambiarEstado(obj);

                        $modalInstance.close();
                    };

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
            
            that.cambiarEstado = function(obj){
                if(obj.estado === '1') {
                    
                    //obj.estado = '0';
                    that.cambiarEstadoCotizacion(obj.numero_cotizacion, '0', function(cambio_exitoso){
                        if(cambio_exitoso)
                            obj.estado = '0';
                        else {
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
                                                    <h4 >No se pudo modificar el estado. No se puede registrar la modificación en la Base de Datos.</h4>\
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
                }
            };
            
            that.cambiarEstadoCotizacion = function(numero_cotizacion, nuevo_estado, callback){
                
                var obj = {
                    session: $scope.rootCotizaciones.session,
                    data: {
                        estado_cotizacion: {
                            numero_cotizacion: numero_cotizacion,
                            nuevo_estado: nuevo_estado
                        }
                    }
                };
                
                var url = API.PEDIDOS.CAMBIAR_ESTADO_COTIZACION;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Consulta exitosa: ", data.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(true);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(false);
                        }
                    }
                });
                
                
            };
            
            $scope.agregarClase = function(estado) {

                return that.estados[estado];
            };
            
            that.consultarEstadoCotizacion = function(data, callback){
                
                //Objeto para consulta de encabezado pedido
                var obj = {
                    session: $scope.rootCotizaciones.session,
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
            
            that.consultarContratoCliente = function(data, callback){

                //Objeto Consulta Contrato Cliente
                var obj = {
                    session: $scope.rootCotizaciones.session,
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
            
            $scope.onVerCotizacion = function(data){
                
                $scope.rootCotizaciones.Empresa.setPedidoSeleccionado(data);
                
                $scope.rootCotizaciones.Empresa.getPedidoSeleccionado().setEditable(false);
                
                that.consultarContratoCliente(data, function(contrato_cliente_id){
                            
                    $scope.rootCotizaciones.Empresa.getPedidoSeleccionado().getCliente().setContratoId(contrato_cliente_id);
                    
                    $state.go('CotizacionCliente');
                            
                });
                
            };
            
            $scope.onEditarCotizacion = function(data) {

                that.consultarEstadoCotizacion(data, function(estado){

                    $scope.rootCotizaciones.Empresa.setPedidoSeleccionado(data);

                    if (estado === '1' || estado === '2') {
                        
                        that.consultarContratoCliente(data, function(contrato_cliente_id){
                            
                            $scope.rootCotizaciones.Empresa.getPedidoSeleccionado().getCliente().setContratoId(contrato_cliente_id);
                            $scope.rootCotizaciones.Empresa.getPedidoSeleccionado().setEditable(true);
                            
                            //console.log(">>>> Objeto Empresa - Pedido Seleccionado: ", $scope.rootCotizaciones.Empresa.getPedidoSeleccionado());
                            
                            $state.go('CotizacionCliente');
                            
                        });

                    }
                    else {

                        //Avisar la no posibilidad de modiificar porque se ha convertido en Pedido
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
                                                <h4 >La Cotización ' + $scope.rootCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() + ' se ha convertido en Pedido. No puede modificarse!</h4>\
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
            
            $scope.onNuevaCotizacion = function (){

                $scope.rootCotizaciones.Empresa.setPedidoSeleccionado({});
                $state.go('CotizacionCliente');
            };
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
               //Limpieza de objeto rootCotizaciones
               $scope.rootCotizaciones = {};

            });
            
            $scope.onKeyBuscarCotizaciones = function(ev) {

                 if (ev.which === 13) {
                     //Aquí no se usa el parámetro "termino_busqueda" porque ésta variable se usa en el scope y se actualiza sin necesidad de pasarla como parámetro
                     $scope.onBuscarCotizacion($scope.obtenerParametros(), true);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.rootCotizaciones.paginaactual--;
                 $scope.onBuscarCotizacion($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootCotizaciones.paginaactual++;
                 $scope.onBuscarCotizacion($scope.obtenerParametros(), true);
            };

            $scope.valorSeleccionado = function() {

            };
            
            $scope.onBuscarCotizacion($scope.obtenerParametros(),"");

        }]);
});
