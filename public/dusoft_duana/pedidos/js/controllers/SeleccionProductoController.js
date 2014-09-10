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
            $scope.listado_cotizaciones = [];

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
               $scope.$emit('cerrarseleccionproducto', {animado:true});
            };

            $scope.buscarCotizaciones = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
                for(i=0; i<10; i++)
                {
                    //var pedido = Pedido.get();
                    
                    obj = { 
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
                    
                    $scope.listado_cotizaciones.push(obj);
                        
                }
                
                console.log("LISTADO COTIZACIONES: ", $scope.listado_cotizaciones);
                

                
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

            $scope.lista_productos_farmacia = {
                data: 'listado_cotizaciones',
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
                console.log($scope.lista_productos_farmacia);
                //$scope.lista_productos_farmacia.$gridScope.renderedRows[row.rowIndex] = 
            };
            
//            $scope.abrirViewCotizacion = function()
//            {
//                $state.go('CotizacionCliente');
//            }
//            
//            $scope.onRowClickSelectCliente = function(row) {
//                $scope.slideurl = "views/seleccioncliente.html?time=" + new Date().getTime();
//                $scope.$emit('mostrarseleccioncliente', row.entity);
//            };
//            
//            $scope.onRowClickSelectProducto = function(row) {
//                $scope.slideurl = "views/seleccionproducto.html?time=" + new Date().getTime();
//                $scope.$emit('mostrarseleccionproducto', row.entity);
//            };
            
            $scope.buscarCotizaciones("");

        }]);
});
