//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state','Usuario', 'ProductoPedido',

        function($scope, $rootScope, Request, Empresa, Cliente, PedidoVenta, API, socket, AlertService, $state, Usuario, ProductoPedido) {
            
            that = this;
            
            $scope.$on('cargarGridSeleccionadoSlide', function(event, mass) {
                //Recibimos la GRID del PADRE: -> mass
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = mass;
            });

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
                $scope.$emit('cerrarseleccionproducto', {animado:true});

                $scope.rootSeleccionProductoFarmacia = {};
            };

            $rootScope.$on("mostrarseleccionproducto", function(e, tipo_cliente, datos_de, pedido) {
                
                console.log("Pedido desde CrearPedidoFarmacia: ", pedido);
                
                /* Construcción del Pedido - Datos */
                
//                datos_pedido = {
//                    numero_pedido: obj.numero_pedido,
//                    fecha_registro: obj.fecha_registro,
//                    descripcion_estado_actual_pedido: obj.descripcion_estado_actual_pedido,
//                    estado_actual_pedido: obj.estado_actual_pedido,
//                    estado_separacion: obj.estado_separacion
//                };
//                
//                pedido.setDatos(datos_pedido);
//                
//                pedido.agregarProducto(producto); // Agrega producto al listado de productos
                
                /**/
                
                $scope.rootSeleccionProductoFarmacia = {};
                
                $scope.rootSeleccionProductoFarmacia.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };
                
                $scope.rootSeleccionProductoFarmacia.tipo_cliente = tipo_cliente;

//                $scope.rootSeleccionProductoFarmacia.paginas = 0;
                $scope.rootSeleccionProductoFarmacia.items = 0;
                $scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {};
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda = "";
                //$scope.rootSeleccionProductoFarmacia.ultima_busqueda.seleccion = "";
                
                $scope.rootSeleccionProductoFarmacia.de_empresa_id = datos_de.empresa_id;
                $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id = datos_de.centro_utilidad_id;
                $scope.rootSeleccionProductoFarmacia.de_bodega_id = datos_de.bodega_id;
                
//                console.log("ID Empresa: ",$scope.rootSeleccionProductoFarmacia.de_empresa_id);
//                console.log("ID Centro Utilidad: ",$scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id);
//                console.log("ID Bodega: ",$scope.rootSeleccionProductoFarmacia.de_bodega_id);

                $scope.rootSeleccionProductoFarmacia.listado_productos = [];
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = [];
                $scope.rootSeleccionProductoFarmacia.pedido = pedido;
                
                $scope.buscarSeleccionProducto($scope.obtenerParametros(),"");
            });
            
            $scope.obtenerParametros = function(){

                //valida si cambio el termino de busqueda
                if($scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda != $scope.rootSeleccionProductoFarmacia.termino_busqueda){
                    $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                }

                var obj = {
                    session:$scope.rootSeleccionProductoFarmacia.session,
                    data:{
                        productos:{
                            
                            empresa_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
                            pagina_actual: $scope.rootSeleccionProductoFarmacia.paginaactual,
                            termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda,
                            filtro:{}
                        }
                    }
                };

                return obj;
            }
            
            $scope.buscarSeleccionProducto = function(obj, paginando) {

                //valida si cambio el termino de busqueda
//                if ($scope.rootSeleccionProductoFarmacia.ultima_busqueda != $scope.rootSeleccionProductoFarmacia.termino_busqueda) {
//                    $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
//                }
                
//                for(var i=0; i<10; i++)
//                {
//                    var obj = { 
//                            codigo_producto: '123456'+i,
//                            descripcion: 'LOBOTOMICINA X '+i,
//                            molecula: 'LOBOTONINA'+i,
//                            existencia_farmacia: '10'+i,
//                            existencia_bodega: '20'+i,
//                            existencia_disponible: '10'+i,
//                            cantidad_solicitada: 0,
//                            fila_activa: true,
//                            tipo_boton: 'success',
//                            etiqueta_boton: 'Incluir'
//                        };
//
//                    $scope.rootSeleccionProductoFarmacia.listado_productos.push(obj);
//
//                }

                var url = API.PEDIDOS.LISTAR_PRODUCTOS;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    
                    console.log("Datos Listado Productos: ",data);
                    
                    if(data.status == 200) {
                        
                        $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {
                                termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda,
                                //seleccion: $scope.rootVerPedidosFarmacias.seleccion
                        }
                        
                        that.renderProductosFarmacia(data.obj, paginando);
                    }

                });
                
                $scope.renderGrid();
            };
            
            that.renderProductosFarmacia = function(data, paginando) {

                $scope.rootSeleccionProductoFarmacia.items = data.lista_productos.length;
                
                //se valida que hayan registros en una siguiente pagina
                if(paginando && $scope.rootSeleccionProductoFarmacia.items == 0){
                    if($scope.rootSeleccionProductoFarmacia.paginaactual > 1){
                        $scope.rootSeleccionProductoFarmacia.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning","No se encontraron más registros");
                    return;
                }

                //$scope.rootSeleccionProductoFarmacia.Empresa.vaciarPedidosFarmacia();
                //--$scope.rootSeleccionProductoFarmacia.listado_productos = data.lista_productos;
                $scope.rootSeleccionProductoFarmacia.listado_productos = [];
               
                for (var i in data.lista_productos) {

                    var obj = data.lista_productos[i];
                    
                    var producto = that.crearProducto(obj);

                    $scope.rootSeleccionProductoFarmacia.listado_productos.push(producto);

                }

            };

            that.crearProducto = function(obj) {
                
                //var pedido = PedidoVenta.get();
                
                producto = {
                    codigo_producto: obj.codigo_producto,
                    descripcion: obj.nombre_producto,
                    molecula: "",
                    existencia_farmacia: 0,
                    existencia_bodega: obj.existencia,
                    existencia_disponible: 0,
                    cantidad_solicitada: 0,
                    fila_activa: true,
                    tipo_boton: 'success',
                    etiqueta_boton: 'Incluir'
                };
                
                return producto;
            };

            
            /*  Construcción de Grid    */

            $scope.renderGrid = function() {

                $scope.lista_productos = {    
                    data: 'rootSeleccionProductoFarmacia.listado_productos',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código Producto'},
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'molecula', displayName: 'Molécula'},
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
                        {field: 'codigo_producto', displayName: 'Código Producto'},
                        {field: 'descripcion', displayName: 'Descripción'},
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
            $scope.onKeySeleccionProductoPress = function(ev) {
                 //if(!$scope.buscarSeleccionProducto($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     console.log("Término Búsqueda: ",$scope.rootSeleccionProductoFarmacia.termino_busqueda);
                     $scope.buscarSeleccionProducto($scope.obtenerParametros());
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.rootSeleccionProductoFarmacia.paginaactual--;
                 $scope.buscarSeleccionProducto($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootSeleccionProductoFarmacia.paginaactual++;
                 $scope.buscarSeleccionProducto($scope.obtenerParametros(), true);
            };

            $scope.valorSeleccionado = function() {

            };
            
            //$scope.buscarSeleccionProducto("");

        }]);
});
