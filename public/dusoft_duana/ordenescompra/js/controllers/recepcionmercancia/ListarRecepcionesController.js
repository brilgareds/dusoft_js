
define(["angular", "js/controllers",
    "models/OrdenCompraPedido",
    "models/EmpresaOrdenCompra",
    "models/ProveedorOrdenCompra",
    "models/UnidadNegocio",
    "models/ProductoOrdenCompra",
    "models/NovedadRecepcion",
    "models/Transportadora",
    "models/RecepcionMercancia",
    "models/UsuarioOrdenCompra"
], function(angular, controllers) {

    controllers.controller('ListarRecepcionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "EmpresaOrdenCompra",
        "RecepcionMercancia",
        "ProveedorOrdenCompra",
        "Transportadora",
        "OrdenCompraPedido",
        "NovedadRecepcion",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Recepcion, Proveedor, Transportadora, OrdenCompra, Novedad, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;


            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            var fecha_actual = new Date();

            $scope.datos_view = {
                lista_recepciones: [],
                fecha_inicial: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fecha_final: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                datepicker_fecha_inicial : false,
                datepicker_fecha_final : false,
                termino_busqueda: '',
                pagina_actual: 1,
                cantidad_items : 0,
                paginar : false
            };

            $scope.buscador_recepciones = function(ev) {
                
                if (ev.which === 13) {
                    $scope.buscar_recepciones();
                }
            };
            
            $scope.buscar_recepciones = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            fecha_inicial: $filter('date')($scope.datos_view.fecha_inicial, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.datos_view.fecha_final, "yyyy-MM-dd") + " 23:59:00",
                            termino_busqueda: $scope.datos_view.termino_busqueda,
                            pagina_actual: $scope.datos_view.pagina_actual
                        }
                    }
                };
                
                Request.realizarRequest(API.ORDENES_COMPRA.LISTAR_RECEPCIONES_MERCANCIA, "POST", obj, function(data) {

                    $scope.datos_view.response = data;
                    
                    $scope.datos_view.cantidad_items = data.obj.ordenes_compras.recepciones_mercancia.length;
                    
                    if ($scope.datos_view.paginar && $scope.datos_view.cantidad_items === 0) {
                            if ($scope.datos_view.pagina_actual > 0) {
                                $scope.datos_view.pagina_actual--;
                            }
                            $scope.datos_view.paginar = false;
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                    if (data.status === 200) {

                        that.render_recepciones_mercancia(data.obj.ordenes_compras.recepciones_mercancia);
                    }

                });
            };

            that.render_recepciones_mercancia = function(recepciones) {

                $scope.Empresa.limpiar_recepciones_mercancia();

                recepciones.forEach(function(data) {

                    var recepcion = Recepcion.get(data.empresa_id, data.id, data.fecha_registro, data.estado);
                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion_proveedor, data.telefono_proveedor);
                    var transportadora = Transportadora.get(data.inv_transportador_id, data.nombre_transportadora, '', data.estado_transportadora);
                    var orden_compra = OrdenCompra.get(data.numero_orden);
                    var novedad_mercancia = Novedad.get(data.novedades_recepcion_id, data.codigo_novedad, data.descripcion_novedad, data.estado_novedad);

                    recepcion.set_numero_guia(data.numero_guia);
                    recepcion.set_cantidad_cajas(data.cantidad_cajas);
                    recepcion.set_cantidad_neveras(data.cantidad_neveras);

                    recepcion.set_proveedor(proveedor);
                    recepcion.set_transportadora(transportadora);
                    recepcion.set_orden_compra(orden_compra);
                    recepcion.set_novedad(novedad_mercancia);
                    recepcion.set_descripcion_estado(data.descripcion_estado);

                    $scope.Empresa.set_recepciones_mercancia(recepcion);
                });
            };

            $scope.lista_recepciones_mercancia = {
                data: 'Empresa.get_recepciones_mercancia()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'get_numero_guia()', displayName: '# Guía', width: "10%"},
                    {field: 'get_transportadora().get_descripcion()', displayName: 'Transportador', width: "13%"},
                    {field: 'get_proveedor().get_nombre()', displayName: 'Proveedor', width: "20%"},
                    {field: 'get_orden_compra().get_numero_orden()', displayName: "Orden Compra", width: "9%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cajas', width: "5%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Neveras', width: "5%"},
                    {field: 'get_novedad().get_descripcion()', displayName: "Novedad", width: "15%"},
                    {field: 'get_descripcion_estado()', displayName: "Estado", width: "5%"},
                    {field: 'get_fecha_registro()', displayName: "F. Registro", width: "9%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="verificar_recepcion(row.entity)" >Verifcar</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };

            /***/

            $scope.crear_recepcion = function() {                
                $state.go('RecepcionMercancia');
            };

            $scope.verificar_recepcion = function(recepcion) {
                localStorageService.add("numero_recepcion", recepcion.get_numero_recepcion());
                $state.go('VerificarMercancia');
            };


            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = true;
                $scope.datos_view.datepicker_fecha_final = false;

            };

            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = false;
                $scope.datos_view.datepicker_fecha_final = true;

            };
            
            $scope.pagina_anterior = function() {
                $scope.datos_view.pagina_actual--;
                $scope.datos_view.paginar= true;
                $scope.buscar_recepciones();
            };

            $scope.pagina_siguiente = function() {
                $scope.datos_view.pagina_actual++;
                $scope.datos_view.paginar= true;
                $scope.buscar_recepciones();
            };

            $scope.buscar_recepciones();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});