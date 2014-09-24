//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoFarmaciaController', [
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
            
//            $scope.paginas = 0;
//            $scope.items = 0;
//            $scope.termino_busqueda = "";
//            $scope.ultima_busqueda = "";
//            $scope.paginaactual = 1;
//            
            //$scope.numero_pedido = "";
            //$scope.obj = {};
            
//            --$scope.listado_productos = [];
//            --$scope.listado_productos_seleccionados = [];
            
//            --$scope.tipo_cliente = 1;

            /*Ejemplo de angular.copy */
            //$scope.rootEditarProducto.producto = angular.copy(producto);
            /*Ejemplo de angular.copy */
            
            /*$scope.rootSeleccionProductoFarmacia = {};*/
            
//            $scope.rootSeleccionProductoFarmacia.paginas = 0;
//            $scope.rootSeleccionProductoFarmacia.items = 0;
            /*$scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
            $scope.rootSeleccionProductoFarmacia.ultima_busqueda = "";
            $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
            
            $scope.rootSeleccionProductoFarmacia.listado_productos = [];
            $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = [];
            $scope.rootSeleccionProductoFarmacia.tipo_cliente = 1;*/
            
            
            $scope.$on('cargarGridSeleccionadoSlide', function(event, mass) {
                //console.log("Recibimos la GRID del PADRE: ",mass)
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = mass;
            });

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
                $scope.$emit('cerrarseleccionproducto', {animado:true});

                $scope.rootSeleccionProductoFarmacia = {};
            };

            $rootScope.$on("mostrarseleccionproducto", function(e, datos) {
                
                $scope.rootSeleccionProductoFarmacia = {};
                $scope.rootSeleccionProductoFarmacia.tipo_cliente = datos;

//                $scope.rootSeleccionProductoFarmacia.paginas = 0;
//                $scope.rootSeleccionProductoFarmacia.items = 0;
                $scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.paginaactual = 1;

                $scope.rootSeleccionProductoFarmacia.listado_productos = [];
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = [];
                
                $scope.buscarSeleccionProducto("");
            });
            
            $scope.buscarSeleccionProducto = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootSeleccionProductoFarmacia.ultima_busqueda != $scope.rootSeleccionProductoFarmacia.termino_busqueda) {
                    $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                }
                
                for(var i=0; i<10; i++)
                {
                    var obj = { 
                            codigo_producto: '123456'+i,
                            descripcion: 'LOBOTOMICINA X '+i,
                            molecula: 'LOBOTONINA'+i,
                            existencia_farmacia: '10'+i,
                            existencia_bodega: '20'+i,
                            existencia_disponible: '10'+i,
                            cantidad_solicitada: 0,
                            fila_activa: true,
                            tipo_boton: 'success',
                            etiqueta_boton: 'Incluir'
                        };

                    $scope.rootSeleccionProductoFarmacia.listado_productos.push(obj);

                }
                
                $scope.renderGrid();
            };
            
            /*  ConstrucciÃ³n de Grid    */

            $scope.renderGrid = function() {

                $scope.lista_productos = {    
                    data: 'rootSeleccionProductoFarmacia.listado_productos',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'CÃ³digo Producto'},
                        {field: 'descripcion', displayName: 'DescripciÃ³n'},
                        {field: 'molecula', displayName: 'MolÃ©cula'},
                        {field: 'existencia_farmacia', displayName: 'Existencia Farmacia', width: "10%"},
                        {field: 'existencia_bodega', displayName: 'Existencia Bodega'},
                        {field: 'existencia_disponible', displayName: 'Disponible'},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada', enableCellEdit: true},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-{{row.entity.tipo_boton}} btn-xs" ng-click="onRowClick1(row)" ng-disabled="row.entity.cantidad_solicitada==0">\n\
                                                    <span class="glyphicon glyphicon-plus-sign">{{row.entity.etiqueta_boton}}</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]
                };

                $scope.lista_productos_seleccionados = {    
                    data: 'rootSeleccionProductoFarmacia.listado_productos_seleccionados',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    //enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'CÃ³digo Producto'},
                        {field: 'descripcion', displayName: 'DescripciÃ³n'},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                        {field: 'cantidad_pendiente', displayName: 'Cantidad Pendiente'},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-danger btn-xs" ng-click="onRowClick2(row)">\n\
                                                    <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]
                };
            }

            $scope.onRowClick1 = function(row) {
                
                if($scope.rootSeleccionProductoFarmacia.listado_productos[row.rowIndex].fila_activa !== false){
                
                    $scope.rootSeleccionProductoFarmacia.listado_productos[row.rowIndex].fila_activa = false;
                    $scope.rootSeleccionProductoFarmacia.listado_productos[row.rowIndex].tipo_boton = 'warning';
                    $scope.rootSeleccionProductoFarmacia.listado_productos[row.rowIndex].etiqueta_boton = 'Listo';

                    var obj_sel = { 
                                codigo_producto: row.entity.codigo_producto,
                                descripcion: row.entity.descripcion,
                                cantidad_solicitada: row.entity.cantidad_solicitada,
                                cantidad_pendiente: 0,
                                sourceIndex: row.rowIndex
                            }

                    //$scope.listado_productos_seleccionados.push(obj_sel);
                    $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.unshift(obj_sel);

                    $scope.$emit('cargarGridPrincipal', $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados);

                }
            };
            
            $scope.onRowClick2 = function(row) {
                
                $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].fila_activa = true;
                $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].tipo_boton = 'success';
                $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].etiqueta_boton = 'Incluir';
                
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.splice(row.rowIndex,1);
                
                $scope.$emit('cargarGridPrincipal', $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados);
                
            };
            
            //MÃ©todo para liberar Memoria de todo lo construido en Ã©sta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
 
                //Este evento no funciona para los Slides, asÃ­ que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes lÃ­neas son efectivas si se usa la view sin el slide

//                $scope.listado_productos = [];
//                $scope.listado_productos_seleccionados = [];

                $scope.rootSeleccionProductoFarmacia = {};

            });
            
            //eventos de widgets
            $scope.onKeySeleccionProductoPress = function(ev, termino_busqueda) {
                 //if(!$scope.buscarSeleccionProducto($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     $scope.buscarSeleccionProducto(termino_busqueda);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.rootSeleccionProductoFarmacia.paginaactual--;
                 $scope.buscarSeleccionProducto($scope.rootSeleccionProductoFarmacia.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootSeleccionProductoFarmacia.paginaactual++;
                 $scope.buscarSeleccionProducto($scope.rootSeleccionProductoFarmacia.termino_busqueda, true);
            };

            $scope.valorSeleccionado = function() {

            };
            
            //$scope.buscarSeleccionProducto("");

        }]);
});
