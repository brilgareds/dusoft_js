define(["angular", "js/controllers", 'controllers/asignacioncontroller', '../../../../includes/slide/slideContent', 'models/Cliente', 'models/Pedido'], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'Empresa', 'Cliente',
        'Pedido', 'API', "socket", "$timeout",
        "AlertService", "Usuario", "localStorageService",
        function($scope, $rootScope, Request, $modal, Empresa, Cliente, Pedido, API, socket, $timeout, AlertService, Usuario, localStorageService) {

            $scope.Empresa = Empresa;
            $scope.pedidosSeleccionados = [];
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            //Arreglo temporal para prueba de Grid
            $scope.pedidosSeparados = [];
            $scope.Mensaje = "";

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            $scope.buscarPedidosSeparadosCliente = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 0;
                }

                //**-- El data viene definido de la lógica en el node js ... pedidos_separados_clientes deberá definirse allá y se debe cambiar si biene con otro nombre

                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            termino_busqueda: termino,
                            pagina_actual: $scope.paginaactual,
                            filtro: {
                                finalizados: true
                            }
                        }
                    }
                };

//                obj = {};

                // --** En éste punto se usará API.PEDIDOS.LISTAR_PEDIDOS_SEPARADOS **--

                Request.realizarRequest("/api/movBodegas/E008/consultarDocumentosTemporalesClientes", "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;

                    console.log("Datos de la DATA: ",data );
                    //--** En éste punto simular el render mientras están listos lo servicios
                    //$scope.renderPedidosSeparadosCliente(data.obj, paginando);
                    
                    /* Inicio Llenado Pedido - Temporal */
                    for(var i=0; i < 100; i++){
                 
                            var estado = '';
                            var zona = '';

                            if(i%2)
                            estado = 'Terminado';
                            else
                            estado = 'En Proceso';

                            if(i%4 == 0)
                            zona = 'Norte';
                            else if(i%4 == 1)
                            zona = 'Sur';
                            else if(i%4 == 2)
                            zona = 'Oriente';
                            else if(i%4 == 3)
                            zona = 'Occidente';

                            var pedido = {
                            numero_pedido : '102001_'+i,
                            nombre_cliente: 'Juan Cliente Mejía_'+i,
                            nombre_vendedor: 'Carlos Marín',
                            zona_pedido: zona,
                            descripcion_estado_actual_separado: estado,
                            estado_actual_separado: 2+(2*(i%2)),
                            nombre_separador: 'Pedro Perez',
                            fecha_registro: '12-08-2014',
                            };
                            $scope.Empresa.agregarPedido(pedido);

                            //Se adiciona aquí porque no coincipen los campos con los de pedido asociado a la empresa
                            $scope.pedidosSeparados.push(pedido);
                       }
                    /* Fin Llenado Pedido - Temporal */
                });

                /* Request.realizarRequest("/testing", "POST", obj, function(data) {
                 //$scope.ultima_busqueda = $scope.termino_busqueda;
                 
                 $scope.Mensaje = data.msj;
                 console.log("mensaje scope ",$scope.Mensaje );
                 
                 //--** En éste punto simular el render mientras están listos lo servicios
                 //$scope.renderPedidosSeparadosCliente(data.obj, paginando);
                 
                 for(var i=0; i < 100; i++){
                 
                 var estado = '';
                 var zona = '';
                 
                 if(i%2)
                 estado = 'Terminado';
                 else
                 estado = 'En Proceso';
                 
                 if(i%4 == 0)
                 zona = 'Norte';
                 else if(i%4 == 1)
                 zona = 'Sur';
                 else if(i%4 == 2)
                 zona = 'Oriente';
                 else if(i%4 == 3)
                 zona = 'Occidente';
                 
                 var pedido = {
                 numero_pedido : '102001_'+i,
                 nombre_cliente: 'Juan Cliente Mejía_'+i,
                 nombre_vendedor: 'Carlos Marín',
                 zona_pedido: zona,
                 descripcion_estado_actual_separado: estado,
                 estado_actual_separado: 2+(2*(i%2)),
                 nombre_separador: $scope.Mensaje,
                 fecha_registro: '12-08-2014',
                 };
                 $scope.Empresa.agregarPedido(pedido);
                 
                 //Se adiciona aquí porque no coincipen los campos con los de pedido asociado a la empresa
                 $scope.pedidosSeparados.push(pedido);
                 
                 };
                 
                 });*/
            };

            //informacion temporal

//            $scope.renderPedidosSeparadosCliente = function(data, paginando) {
//
//                $scope.items = data.pedidos_separados_clientes.length;
//                //se valida que hayan registros en una siguiente pagina
//                if(paginando && $scope.items == 0){
//                    if($scope.paginaactual > 0){
//                        $scope.paginaactual--;
//                    }
//                    AlertService.mostrarMensaje("warning","No se encontraron mas registros");
//                    return;
//                }
//
//                $scope.Empresa.vaciarPedidos();
//               
//
//                for (var i in data.pedidos_separados_clientes) {
//
//                    var obj = data.pedidos_separados_clientes[i];
//                    //console.log(obj);
//                    var pedido = $scope.crearPedido(obj);
//
//                    $scope.Empresa.agregarPedido(
//                        pedido
//                    );
//
//
//                }
//
//            };





            //**-- Se debe llamar crearPedido o debe llamarse crearPedidoSeparado ?
            //**-- Con el pedido debe crearse el documento relacionado que contiene lo que se ha separado
            $scope.crearPedido = function(obj) {
                var pedido = Pedido.get();
                pedido.setDatos(obj);

                var cliente = Cliente.get(
                        obj.nombre_cliente,
                        obj.direccion_cliente,
                        obj.tipo_id_cliente,
                        obj.identificacion_cliente,
                        obj.telefono_cliente
                        );

                pedido.setCliente(cliente);

                return pedido;
            };



            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_separados_clientes = {
                //data: 'Empresa.getPedidos()',
                data: 'pedidosSeparados',
                enableColumnResize: true,
                enableRowSelection: false,
                //enableSorting:false,
                /*rowTemplate: '<div " style="height: 100%" ng-class="{red: !row.getProperty(\'isUploaded\')}" rel="{{row.entity.numero_pedido}}" ng-click="rowClicked($event, row)">' + 
                 '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell "  >' +
                 '<div ng-cell ></div>' +
                 '</div>' +
                 '</div>',*/
                columnDefs: [
//                    {field: 'descripcion_estado_actual_pedido', displayName: "Estado Actual", cellClass:"txt-center",
//                    cellTemplate: '<div ng-class="agregarClase(row.entity.estado_actual_separado)" >{{row.entity.descripcion_estado_actual_separado}}</div>'},
                    {field: 'numero_pedido', displayName: 'Numero Pedido'},
                    {field: 'nombre_cliente', displayName: 'Cliente'},
                    {field: 'nombre_vendedor', displayName: 'Vendedor'},
                    {field: 'zona_pedido', displayName: 'Zona'},
//                    {field: 'descripcion_estado_actual_separado', displayName: "Estado"},
                    {field: 'nombre_separador', displayName: 'Separador'},
                    {field: 'fecha_registro', displayName: "Fecha Registro"},
                    {field: 'movimiento', displayName: "Movimiento", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Auditar</span></button></div>'}

                ]

            };

            $scope.onRowClick = function(row) {
                console.log("on row clicked");
                $scope.slideurl = "views/pedidoseparado.html?time=" + new Date().getTime();
                $scope.$emit('mostrarslide', row.entity);
                //$scope.$emit('mostrarslide');
            };

            $scope.agregarClase = function(estado) {
                return estados[estado];
            };


            //fin delegado grid pedidos //

            $scope.onPedidoSeleccionado = function(check, row) {
                console.log("agregar!!!!!");
                console.log(check)
                console.log(row);

                row.selected = check;
                if (check) {
                    $scope.agregarPedido(row.entity);
                } else {

                    $scope.quitarPedido(row.entity);
                }

                console.log($scope.pedidosSeleccionados);
            };


            $scope.quitarPedido = function(pedido) {
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
                        $scope.pedidosSeleccionados.splice(i, true);
                    }
                }
            };

            $scope.agregarPedido = function(pedido) {
                //valida que no exista el pedido en el array
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
                        return false;
                    }
                }

                $scope.pedidosSeleccionados.push(pedido);
            };

            $scope.buscarSeleccion = function(row) {
                var pedido = row.entity;
                for (var i in $scope.pedidosSeleccionados) {
                    var _pedido = $scope.pedidosSeleccionados[i];
                    if (_pedido.numero_pedido == pedido.numero_pedido) {
                        //console.log("buscarSeleccion encontrado **************");
                        //console.log(pedido);
                        row.selected = true;
                        return true;
                    }
                }
                row.selected = false;
                return false;
            };



            //eventos de widgets
            $scope.onKeySeparadosPress = function(ev, termino_busqueda) {
                //Empresa.getPedidos()[0].numero_pedido = 0000;
                if (ev.which == 13) {
                    $scope.buscarPedidosSeparadosCliente(termino_busqueda);
                }
            };

            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                $scope.buscarPedidosSeparadosCliente($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarPedidosSeparadosCliente($scope.termino_busqueda, true);
            };



            //fin de eventos

            //se realiza el llamado a api para pedidos
            $scope.buscarPedidosSeparadosCliente("");


        }]);
});
