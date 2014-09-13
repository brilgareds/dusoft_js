//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers",'../../../../includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoController', [
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
            $scope.listado_productos_farmacias = [];
            $scope.listado_productos_clientes = [];
            
            $scope.lista_productos = {};
            
            $scope.tipo_cliente = 1;

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            
            $scope.lista_productos = {    
                data: 'listado_productos_clientes',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                selectedItems: $scope.selectedRow,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Descripción'},
                    {field: 'molecula', displayName: 'Molécula'},
                    {field: 'existencia_bodega', displayName: 'Existencia Bodega'},
                    {field: 'existencia_disponible', displayName: 'Disponible'},
                    {field: 'existencia_reservada', displayName: 'Reservado'},
                    {field: 'cantidad', displayName: 'Cantidad', enableCellEdit: true},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-success btn-xs" ng-click="onRowClick1(row)">\n\
                                                <span class="glyphicon glyphicon-plus-sign">Incluir</span>\n\
                                            </button>\n\
                                            <button class="btn btn-danger btn-xs" ng-click="onRowClick2(row)">\n\
                                                <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };
            
            $scope.cerrar = function(){
                $scope.$emit('cerrarseleccionproductoCompleto', {animado:true});
               
                $scope.listado_productos_farmacias = [];
                $scope.listado_productos_clientes = [];
            };
            
            $rootScope.$on("mostrarseleccionproductoCompleto", function(e, datos) {
                //alert("TIPO CLIENTE - FUENTE: ");
                //console.log("TIPO CLIENTE - FUENTE: ", datos);
                
                $scope.tipo_cliente = datos[1];
                //alert("TIPO CLIENTE - COPIA: ");
                console.log("TIPO CLIENTE - COPIA: ", $scope.tipo_cliente);
                
                $scope.buscarSeleccionProducto("");
            });

            $scope.buscarSeleccionProducto = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
                for(i=0; i<10; i++)
                {
                    //var pedido = Pedido.get();
                    
                    obj1 = { 
                            codigo_producto: '123456'+i,
                            descripcion: 'LOBOTOMICINA X '+i,
                            molecula: 'LOBOTONINA'+i,
                            existencia_farmacia: '10'+i,
                            existencia_bodega: '20'+i,
                            existencia_disponible: '10'+i,
                            existencia_reservada: '10'+i,
                            existencia_x_farmacia: 20*i,
                            cantidad: 0
                        }
                    
                    $scope.listado_productos_farmacias.push(obj1);
                    
                    obj2 = {
                            codigo_producto: '123456'+i,
                            descripcion: 'LOBOTOMICINA X '+i,
                            molecula: 'LOBOTONINA'+i,
                            existencia_bodega: '20'+i,
                            existencia_disponible: '10'+i,
                            existencia_reservada: '10'+i,
                            cantidad: 0
                    }
                    
                    $scope.listado_productos_clientes.push(obj2);   

                }
                
                /*  Construcción de Grid    */
                
                console.log("TIPO CLIENTE ANTES DE GRID = ",$scope.tipo_cliente);
                
                if($scope.tipo_cliente === 1) {

                    //$scope.lista_productos_clientes = {
                    
                }
                else if($scope.tipo_cliente === 2) {

                    //$scope.lista_productos_farmacia = {
                    $scope.lista_productos = {    
                        data: 'listado_productos_farmacias',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        selectedItems: $scope.selectedRow,
                        multiSelect: false,
                        columnDefs: [
                            {field: 'codigo_producto', displayName: 'Código Producto'},
                            {field: 'descripcion', displayName: 'Descripción'},
                            {field: 'molecula', displayName: 'Molécula'},
                            {field: 'existencia_farmacia', displayName: 'Existencia Farmacia', width: "10%"},
                            {field: 'existencia_bodega', displayName: 'Existencia Bodega'},
                            {field: 'existencia_disponible', displayName: 'Disponible'},
                            {field: 'existencia_reservada', displayName: 'Reservado'},
                            {field: 'existencia_x_farmacia', displayName: 'Existencias Farmacias', width: "12%"},
                            {field: 'cantidad', displayName: 'Cantidad', enableCellEdit: true},
                            {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                                cellTemplate: ' <div class="row">\n\
                                                    <button class="btn btn-success btn-xs" ng-click="onRowClick1(row)">\n\
                                                        <span class="glyphicon glyphicon-plus-sign">Incluir</span>\n\
                                                    </button>\n\
                                                    <button class="btn btn-danger btn-xs" ng-click="onRowClick2(row)">\n\
                                                        <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                                    </button>\n\
                                                </div>'
                            }
                        ]

                    };
                }


                /***************************/
                
                //console.log("LISTADO COTIZACIONES: ", $scope.listado_cotizaciones);
                

                
//                var obj = {
//                    session: $scope.session,
//                    data: {
//                        documento_temporal: {
//                            termino_busqueda: termino,
//                            pagina_actual: $scope.paginaactual,
//                            filtro: {
//                                finalizados: true
//                            }
//                        }
//                    }
//                };
//
//                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES, "POST", obj, function(data) {
//                    $scope.ultima_busqueda = $scope.termino_busqueda;
//                    
//                    if(data.obj.documentos_temporales != undefined) {
//                        $scope.renderPedidosSeparadosCliente(data.obj, paginando);
//                    }
//
//                });

            };

//            $scope.renderPedidosSeparadosCliente = function(data, paginando) {
//
//                $scope.items = data.documentos_temporales.length;
//                //se valida que hayan registros en una siguiente pagina
//                if(paginando && $scope.items == 0){
//                    if($scope.paginaactual > 1){
//                        $scope.paginaactual--;
//                    }
//                    AlertService.mostrarMensaje("warning","No se encontraron mas registros");
//                    return;
//                }
//
//                $scope.Empresa.vaciarDocumentoTemporal("Cliente");
//               
//                for (var i in data.documentos_temporales) {
//
//                    var obj = data.documentos_temporales[i];
//                    
//                    var documento_temporal = $scope.crearDocumentoTemporal(obj);
//
//                    $scope.Empresa.agregarDocumentoTemporal(
//                        documento_temporal, "Cliente"
//                    );
//
//
//                }
//
//            };

//            $scope.crearDocumentoTemporal = function(obj) {
//                var documento_temporal = DocumentoTemporal.get();
//                documento_temporal.setDatos(obj);
//
//                var pedido = Pedido.get(obj);
//                pedido.setDatos(obj);
//                        
//                var cliente = Cliente.get(
//                        obj.nombre_cliente,
//                        obj.direccion_cliente,
//                        obj.tipo_id_cliente,
//                        obj.identificacion_cliente,
//                        obj.telefono_cliente
//                        );
//
//                pedido.setCliente(cliente);
//                
//                documento_temporal.setPedido(pedido);
//                
//                var separador = Separador.get(obj.responsable_pedido, obj.responsable_id, 1);
//                
//                documento_temporal.setSeparador(separador);
//                
//                return documento_temporal;
//            };

            //definicion y delegados del Tabla de pedidos clientes
            

            
            $scope.onRowClick1 = function(row) {
                alert("Botón Presionado");
//                row.entity.cellTemplate = ' <div class="row">\n\
//                                            <button class="btn btn-default btn-xs" ng-click="onRowClick1(row)">\n\
//                                                <span class="glyphicon glyphicon-ok">Incluido</span>\n\
//                                            </button>\n\
//                                            <button class="btn btn-danger btn-xs" ng-click="onRowClick2(row)">\n\
//                                                <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
//                                            </button>\n\
//                                        </div>';
                console.log(row);
                console.log(row.rowIndex);
                console.log(row.entity);
                console.log($scope.lista_productos_farmacia);
                //$scope.lista_productos_farmacia.$gridScope.renderedRows[row.rowIndex] = 
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
//                 var obj = {
//                     session: $scope.session,
//                     data: {
//                         movimientos_bodegas: {
//                             documento_temporal_id: $scope.documento_temporal_id, 
//                             usuario_id: $scope.usuario_id,
//                             bodegas_doc_id: $scope.seleccion,
//                             numero_pedido:$scope.numero_pedido
//                         }
//                     }
//                 };
//
//                $scope.validarDocumentoUsuario(obj, 2, function(data){
//                    if(data.status === 200){
//                        $scope.DocumentoTemporal.bodegas_doc_id = $scope.seleccion;
//                        AlertService.mostrarMensaje("success", data.msj);
//                    } else {
//                        AlertService.mostrarMensaje("warning", data.msj);
//                    }
//                });

            };
            
            //$scope.buscarSeleccionProducto("");

        }]);
});
