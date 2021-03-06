
define([
    "angular", "js/controllers", "models/Movimiento",
    "models/Pendiente", "models/PedidoKardex", "models/FarmaciaKardex",
    "models/ClienteKardex", "models/ProveedorKardex", "models/OrdenCompraKardex"],
function(angular, controllers) {

    var fo = controllers.controller('MovimientoController', [
        '$scope', "$rootScope", "Request",
        "$filter", '$state', 'Empresa',
        'ProductoMovimiento', '$modal', "API",
        "Movimiento", "$sce", "$filter", "Pendiente",
        "PedidoKardex", "FarmaciaKardex", "ClienteKardex",
        "ProveedorKardex", "OrdenCompraKardex",
        function($scope, $rootScope, Request, $filter, $state, Empresa, ProductoMovimiento, $modal, API,
                Movimiento, $sce, $filter, Pendiente, PedidoKardex, FarmaciaKardex, ClienteKardex, Proveedor, OrdenCompra) {

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

            $scope.movimientos = [
                {descripcion: "Todos", tipo: ""},
                {descripcion: "E - Egreso", tipo: "E"},
                {descripcion: "I - Ingreso", tipo: "I"}

            ];

            
            $scope.validarHtml = function(html) {
                var htmlValido = $sce.trustAsHtml(html);
                return htmlValido;
            };

            $scope.formatearFecha = function(fecha) {
                return $filter('date')(fecha, 'yyyy-MM-dd');
            };


            $scope.filterOptions = {
                filterText: ''
            };


            $scope.lista_movimientos = {
                data: 'producto.getMovimientos()',
                multiSelect: false,
                rowHeight: 200,
                enableColumnResize: true,
                enableHighlighting: true,
                enableRowSelection: false,
                filterOptions: $scope.filterOptions,
                showFilter: true,
                sortInfo: {fields: ['fecha'], directions: ['desc']},
                columnDefs: [
                    {field: 'tipo_movimiento', displayName: 'T M', width: "50"},
                    {field: 'fecha', displayName: 'Fecha', cellTemplate: "<div> {{formatearFecha(row.entity.fecha)}} </div>", width: "9%"},
                    {field: 'numero', displayName: 'Numero', cellTemplate: "<div>{{row.entity.prefijo}} - {{row.entity.numero}} </div>", width: "10%"},
                   // {field: 'factura', displayName: 'Factura', width: "9%"},
                    {field: 'detalle.detalle', height: "200px", displayName: 'Terceros', cellTemplate: "<div class='largeCell' ng-bind-html=\"validarHtml(row.entity.detalle.getDetalle())\"></div>"},
                    {field: 'cantidad_entradas', displayName: 'Entradas', width: "5%"},
                    {field: 'cantidad_salidas', displayName: 'Salidas', width: "5%"},
                    {field: 'stock_actual', displayName: 'Existencia', width: "5%"},
                    {field: 'costo', displayName: 'Costo', visible:$scope.opcionesModulo.columnaCosto.visible, width: "6%"},
                    {field: 'lote', displayName: 'Lote', width: "150"},
                    {field: 'fecha_vencimiento', displayName: 'Fecha V', cellTemplate: "<div> {{formatearFecha(row.entity.fecha_vencimiento)}} </div>", width: "10%"},
                    {field: 'nombre', displayName: 'Usuario', width: "7%"}
                ]

            };


            $scope.lista_pendientes_farmacia = {
                data: "producto.getPendientesFarmacia()",
                enableHighlighting: true,
                enableColumnResize: true,
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Solicitud'},
                    {field: 'pedido.cantidad_solicitada', displayName: 'Cant Solicitada'},
                    {field: 'pedido.cantidad_pendiente', displayName: 'Cant Pendiente'},
                    {field: 'pedido.farmacia.nombre_farmacia', displayName: 'Farmacia destino'},
                    {field: 'pedido.farmacia.fechaRegistro', displayName: 'Fecha pedido'},
                    {field: 'pedido.usuario', displayName: 'Usuario'},
                    {field: 'pedido.getNombreSeparador()', displayName: 'Separador'},
                    {field: 'pedido.getNombreAuditor()', displayName: 'Auditor'},
                    {field: 'pedido.justificacionSeparador', displayName: 'Justificación separador'},
                    {field: 'pedido.justificacionAuditor', displayName: 'Justificación auditor'}
                ]
            };


            $scope.lista_pendientes_cliente = {
                data: "producto.getPendientesClientes()",
                enableHighlighting: true,
                enableColumnResize: true,
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Pedido'},
                    {field: 'pedido.cantidad_solicitada', displayName: 'Cant Solicitada'},
                    {field: 'pedido.cantidad_pendiente', displayName: 'Cant Pendiente'},
                    {field: 'pedido.cliente.nombre_tercero', displayName: 'Cliente'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'pedido.usuario', displayName: 'Usuario'},
                    {field: 'pedido.getNombreSeparador()', displayName: 'Separador'},
                    {field: 'pedido.getNombreAuditor()', displayName: 'Auditor'},
                    {field: 'pedido.justificacionSeparador', displayName: 'Justificación separador'},
                    {field: 'pedido.justificacionAuditor', displayName: 'Justificación auditor'},
                ]
            };

            $scope.lista_pendientes_ordenes = {
                data: "producto.getPendientesOrdenes()",
                enableHighlighting: true,
                enableColumnResize: true,
                columnDefs: [
                    {field: 'orden.numero_orden_compra', displayName: 'Orden De Compra'},
                    {field: 'orden.cantidad_solicitada', displayName: 'Cant Solicitada'},
                    {field: 'orden.proveedor.nombre_tercero', displayName: 'Proveedor'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'orden.usuario', displayName: 'Usuario'}
                ]
            };

            $scope.onRowClick = function(row) {


            };

            $scope.cerrar = function() {
                $scope.filterOptions.filterText = "";
                $scope.$emit('cerrardetallekardex', {animado: true});
            };

            //eventos

            //eventos de widgets
            $scope.filtrar_movimiento = function(opt) {
                var filterText = 'tipo_movimiento:' + opt.tipo;
                $scope.filterOptions.filterText = filterText;
            };

            $scope.calcularRenderGrid = function() {
                $(window).resize();
            };

            $rootScope.$on("cerrardetallekardexCompleto", function(e, datos) {
                $scope.producto = {};
                $scope.existencia = 0;
                $scope.nombreProducto = "";
                $scope.cantidad_salidas = 0;
                $scope.cantidad_entradas = 0;
                $scope.selemovimiento = {};

            });
            //eventos personalizados
            $rootScope.$on("mostrardetallekardexCompleto", function(e, datos) {

                var producto = datos[1];
                var movimientos = datos[2];
                $scope.producto = angular.copy(producto);
                $scope.existencia = $scope.producto.existencia;
                $scope.nombreProducto = producto.descripcion;
                $scope.cantidad_salidas = 0;
                $scope.cantidad_entradas = 0;
                $scope.selemovimiento = $scope.movimientos[0];


                //movimientos
                for (var i in movimientos.movimientos_producto) {
                    var movimiento = Movimiento.get();
                    movimiento.setDatos(movimientos.movimientos_producto[i]);

                    $scope.producto.agregarMovimiento(movimiento);
                    if (movimiento.tipo_movimiento === "E" || movimiento.tipo_movimiento === "T") {
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

                    pedido.justificacionSeparador= obj.justificacion_separador;
                    pedido.justificacionAuditor  = obj.justificacion_auditor;
                    
                    pedido.setNombreAuditor(obj.nombre_auditor).setNombreSeparador(obj.nombre_separador);

                    var farmacia = FarmaciaKardex.get(
                            obj.farmacia_id,
                            null,
                            obj.destino
                            //obj.razon_social
                    );

                    farmacia.setFechaRegistro(obj.fecha_registro);
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

                    pedido.justificacionSeparador = obj.justificacion_separador;
                    pedido.justificacionAuditor  = obj.justificacion_auditor;
                    pedido.setNombreAuditor(obj.nombre_auditor).setNombreSeparador(obj.nombre_separador);

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

                //pendientes ordenes
                for (var i in movimientos.pendientes_ordenes_compra) {
                    var obj = movimientos.pendientes_ordenes_compra[i];


                    var pendiente = Pendiente.get(obj.fecha_registro);
                    var orden = OrdenCompra.get(obj.numero_orden_compra);

                    var proveedor = Proveedor.get(
                            obj.tipo_id_tercero,
                            obj.tercero_id,
                            obj.codigo_proveedor_id,
                            obj.nombre_tercero
                            );


                    orden.setDatos(
                            {
                                proveedor: proveedor,
                                cantidad_solicitada: obj.cantidad_solicitada,
                                cantidad_pendiente: obj.cantidad_pendiente,
                                usuario: obj.usuario
                            }
                    );
                    pendiente.setOrden(orden);

                    $scope.producto.agregarPendienteOrden(pendiente);
                }

                $scope.calcularRenderGrid();

            });

        }]);
});