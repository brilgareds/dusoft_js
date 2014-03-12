
define(["angular", "js/controllers", "models/Movimiento", "models/Pendiente", "models/PedidoKardex", "models/FarmaciaKardex", "models/ClienteKardex"], function(angular, controllers) {

    var fo = controllers.controller('MovimientoController', [
        '$scope', "$rootScope", "Request",
        "$filter", '$state', 'Empresa',
        'ProductoMovimiento', '$modal', "API",
        "Movimiento", "$sce", "$filter", "Pendiente",
        "PedidoKardex", "FarmaciaKardex", "ClienteKardex",
        function($scope, $rootScope, Request, $filter, $state, Empresa, ProductoMovimiento, $modal, API,
                Movimiento, $sce, $filter, Pendiente, PedidoKardex, FarmaciaKardex, ClienteKardex) {

            $scope.Empresa = Empresa;
            $scope.fechainicial = new Date();
            $scope.fechafinal = "";
            $scope.producto = {};
            $scope.titulo = "Movimientos del producto";
            $scope.cantidad_entradas = 0;
            $scope.cantidad_salidas = 0;
            $scope.existencia = 0;
            $scope.descuadre = 0;
            $scope.nombreProducto = "";


            $scope.validarHtml = function(html) {
                var htmlValido = $sce.trustAsHtml(html);
                return htmlValido;
            };

            $scope.formatearFecha = function(fecha) {
                return $filter('date')(fecha, 'yyyy-MM-dd');
            };


            $scope.lista_movimientos = {
                data: 'producto.getMovimientos()',
                multiSelect: false,
                rowHeight: 250,
                columnDefs: [
                    {field: 'tipo_movimiento', displayName: 'T M', width: "50"},
                    {field: 'fecha', displayName: 'Fecha', cellTemplate: "<div> {{formatearFecha(row.entity.fecha)}} </div>", width: "10%"},
                    {field: 'numero', displayName: 'Numero', cellTemplate: "<div>{{row.entity.prefijo}} - {{row.entity.numero}} </div>", width: "10%"},
                    {field: 'factura', displayName: 'Factura', width: "10%"},
                    {field: 'detalle.getDetalle()', height: "200px", displayName: 'Terceros', cellTemplate: "<div class='largeCell' ng-bind-html=\"validarHtml(row.entity.detalle.getDetalle())\"></div>"},
                    {field: 'cantidad_entradas', displayName: 'Entradas', width: "7%"},
                    {field: 'cantidad_salidas', displayName: 'Salidas', width: "7%"},
                    {field: 'costo', displayName: 'Costo', width: "7%"},
                    {field: 'lote', displayName: 'Lote', width: "7%"},
                    {field: 'fecha_vencimiento', displayName: 'Fecha V', cellTemplate: "<div> {{formatearFecha(row.entity.fecha_vencimiento)}} </div>", width: "10%"}
                ]

            };


            $scope.lista_pendientes_farmacia = {
                data: "producto.getPendientesFarmacia()",
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Solicitud'},
                    {field: 'pedido.cantidad_solicitada', displayName: 'Cant Solicitada'},
                    {field: 'pedido.cantidad_pendiente', displayName: 'Cant Pendiente'},
                    {field: 'pedido.farmacia.nombre_farmacia', displayName: 'Farmacia'},
                    {field: 'pedido.usuario', displayName: 'Usuario'}
                ]
            };


            $scope.lista_pendientes_cliente = {
                data: "producto.getPendientesClientes()",
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Pedido'},
                    {field: 'pedido.cantidad_solicitada', displayName: 'Cant Solicitada'},
                    {field: 'pedido.cliente.nombre_cliente', displayName: 'Cliente'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'pedido.usuario', displayName: 'Usuario'}
                ]
            };

            $scope.onRowClick = function(row) {


            };

            $scope.cerrar = function() {
                $scope.$emit('cerrarslide');
            };

            //eventos

            //eventos de widgets



            //eventos personalizados
            $rootScope.$on("mostrarslide", function(e, producto, movimientos) {
                $scope.producto = angular.copy(producto);
                console.log("====");
                console.log($scope.producto)
                $scope.existencia = $scope.producto.existencia;
                $scope.nombreProducto = producto.descripcion;

                //movimientos
                for (var i in movimientos.movimientos_producto) {
                    var movimiento = Movimiento.get();
                    movimiento.setDatos(movimientos.movimientos_producto[i]);
                    $scope.producto.agregarMovimiento(movimiento);

                    if (movimiento.tipo_movimiento == "E") {
                        $scope.cantidad_salidas = $scope.cantidad_salidas + movimiento.cantidad_salidas;
                    } else {
                        $scope.cantidad_entradas = $scope.cantidad_entradas + movimiento.cantidad_entradas;
                    }

                }

                //pendientes farmacia

                for (var i in movimientos.pendientes_farmacias) {
                    var obj = movimientos.pendientes_farmacias[i];

                    var pendiente = Pendiente.get(obj.fecha_registro);
                    var pedido = PedidoKardex.get(
                            {
                                numero_pedido: obj.numero_pedido,
                                cantidad_pendiente: obj.cantidad_pendiente,
                                cantidad_solicitada: obj.cantidad_solicitada,
                                usuario: obj.usuario
                            }
                    );

                    var farmacia = FarmaciaKardex.get(
                            obj.farmacia_id,
                            null,
                            obj.razon_social
                            );

                    pedido.setFarmacia(farmacia);
                    pendiente.setPedido(pedido);

                    $scope.producto.agregarPendienteFarmacia(pendiente);
                }


                //pendientes clientes

                for (var i in movimientos.pendientes_clientes) {
                    var obj = movimientos.pendientes_clientes[i];

                    var pendiente = Pendiente.get(obj.fecha_registro);
                    var pedido = PedidoKardex.get(
                            {
                                numero_pedido: obj.numero_pedido,
                                cantidad_pendiente: obj.cantidad_pendiente,
                                cantidad_solicitada: obj.cantidad_solicitada,
                                usuario: obj.usuario
                            }
                    );

                    var cliente = ClienteKardex.get(
                            obj.nombre_tercero,
                            null,
                            obj.tipo_id_tercero,
                            obj.tercero_id
                            );

                    pedido.setCliente(cliente);
                    pendiente.setPedido(pedido);

                    $scope.producto.agregarPendienteCliente(pendiente);
                }

                console.log($scope.producto.getPendientesClientes());

            });

        }]);
});