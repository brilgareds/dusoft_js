//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers",'../../../../includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoClienteController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state',

        function($scope, $rootScope, Request, Empresa, Cliente, PedidoVenta, API, socket, AlertService, $state) {

            //$scope.Empresa = Empresa;
            
//            $scope.session = {
//                usuario_id: Usuario.usuario_id,
//                auth_token: Usuario.token
//            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.listado_productos = [];
            $scope.listado_productos_seleccionados = [];

//            $scope.lista_productos = {};
//            $scope.lista_productos_seleccionados = {};
            
            $scope.tipo_cliente = 1;

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
                $scope.$emit('cerrarseleccionproducto', {animado:true});
               
                $scope.listado_productos = [];
                $scope.listado_productos_seleccionados = [];
            };
            
            $rootScope.$on("mostrarseleccionproducto", function(e, datos) {
                //alert("TIPO CLIENTE - FUENTE: ");
                //console.log("TIPO CLIENTE - FUENTE: ", datos);
                
                $scope.tipo_cliente = datos;
                //alert("TIPO CLIENTE - COPIA: ");
                //console.log("TIPO CLIENTE - COPIA: ", $scope.tipo_cliente);
                
                $scope.buscarSeleccionProducto("");
            });

            $scope.buscarSeleccionProducto = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
                for(var i=0; i<10; i++)
                {
                    //var pedido = Pedido.get();
                    if($scope.tipo_cliente === 1) {
                    
                        var obj = {
                                codigo_producto: '123456'+i,
                                descripcion: 'TRIPARTYCINA X '+i,
                                cum: '102030'+i,
                                codigo_invima: 'INV-321098'+i,
                                iva: 16,
                                precio_regulado: '50'+i,
                                precio_venta: '60'+i,
                                existencia_bodega: '20'+i,
                                cantidad_disponible: '10'+i,
                                cantidad_solicitada: 0
                        };

                        $scope.listado_productos.push(obj);

                    }

                }
                
                $scope.renderGrid();
            };

            /*  Construcción de Grid    */
            
            $scope.renderGrid = function() {
            
                $scope.lista_productos = {    
                    data: 'listado_productos',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código Producto'},
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'cum', displayName: 'CUM'},
                        {field: 'codigo_invima', displayName: 'Código Invima'},
                        {field: 'iva', displayName: 'Iva'},
                        {field: 'precio_regulado', displayName: 'Precio Regulado'},
                        {field: 'precio_venta', displayName: 'Precio Venta'},
                        {field: 'existencia_bodega', displayName: 'Existencia'},
                        {field: 'cantidad_disponible', displayName: 'Disponible'},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada', enableCellEdit: true},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-success btn-xs" ng-click="onRowClick1(row)">\n\
                                                    <span class="glyphicon glyphicon-plus-sign">Incluir</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]

                };

                $scope.lista_productos_seleccionados = {    
                    data: 'listado_productos_seleccionados',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    //enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                            
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código Producto'},
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                        {field: 'iva', displayName: 'Iva'},
                        {field: 'precio_venta', displayName: 'Precio Unitario'},
                        {field: 'total_sin_iva', displayName: 'Total Sin Iva'},
                        {field: 'total_con_iva', displayName: 'Total Con Iva'},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-danger btn-xs" ng-click="onRowClick2(row)">\n\
                                                    <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]

                };
            };
            
            $scope.onRowClick1 = function(row) {
                
//                var obj_sel = { 
//                            codigo_producto: row.entity.codigo_producto,
//                            descripcion: row.entity.descripcion,
//                            cantidad_solicitada: row.entity.cantidad_solicitada,
//                            cantidad_pendiente: 0
//                        }
//                        
//                $scope.listado_productos_seleccionados.push(obj_sel);
                
                console.log(row.entity);


                var obj_sel = {
                        codigo_producto: row.entity.codigo_producto,
                        descripcion: row.entity.descripcion,
                        cantidad_solicitada: row.entity.cantidad_solicitada,
                        iva: row.entity.iva,
                        precio_venta: row.entity.precio_venta,
                        total_sin_iva: row.entity.cantidad_solicitada*row.entity.precio_venta, //cantidad*precio_venta
                        total_con_iva: row.entity.cantidad_solicitada*row.entity.precio_venta + row.entity.cantidad_solicitada*row.entity.precio_venta*row.entity.iva/100 //cantidad*precio_venta + cantidad*precio_venta*iva
                };

                $scope.listado_productos_seleccionados.push(obj_sel);


            };
            
            $scope.onRowClick2 = function(row) {
                
                $scope.listado_productos_seleccionados.splice(row.rowIndex,1);
                
            };
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
 
                //Este evento no funciona para los Slides, así que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes líneas son efectivas si se usa la view sin el slide

                $scope.listado_productos_farmacias = [];
                $scope.listado_productos_clientes = [];

            });
            
            //eventos de widgets
            $scope.onKeySeleccionProductoPress = function(ev, termino_busqueda) {
                 //if(!$scope.buscarSeleccionProducto($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     $scope.buscarSeleccionProducto(termino_busqueda);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.paginaactual--;
                 $scope.buscarSeleccionProducto($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.paginaactual++;
                 $scope.buscarSeleccionProducto($scope.termino_busqueda, true);
            };

            $scope.valorSeleccionado = function() {

            };
            
            //$scope.buscarSeleccionProducto("");

        }]);
});
