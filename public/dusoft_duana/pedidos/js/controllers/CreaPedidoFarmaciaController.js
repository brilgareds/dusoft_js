define(["angular", "js/controllers",'../../../../includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CreaPedidoFarmaciaController', [
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
            $scope.bloquear = false; //Default True
            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.listado_cotizaciones = [];
            
            $scope.de_seleccion_empresa = 0;
            $scope.de_seleccion_centro_utilidad = 0;
            $scope.de_seleccion_bodega = 0;

            $scope.para_seleccion_empresa = 0;
            $scope.para_seleccion_centro_utilidad = 0;
            $scope.para_seleccion_bodega = 0;
            
            $scope.de_lista_empresas = [    {id: 1, nombre: 'COSMITET'},
                                            {id: 2, nombre: 'DUANA'},
                                            {id: 3, nombre: 'DUMIAN'},
                                            {id: 4, nombre: 'DUCATI'}
                                            ];
                                            
            $scope.de_lista_centro_utilidad = [     {id: 1, nombre: 'CENTRO_1'},
                                                    {id: 2, nombre: 'CENTRO_2'},
                                                    {id: 3, nombre: 'CENTRO_3'},
                                                    {id: 4, nombre: 'CENTRO_4'}
                                                    ];
            $scope.de_lista_bodegas = [     {id: 1, nombre: 'BODEGA_1'},
                                            {id: 2, nombre: 'BODEGA_2'},
                                            {id: 3, nombre: 'BODEGA_3'},
                                            {id: 4, nombre: 'BODEGA_4'}
                                            ];
            
            $scope.para_lista_empresas = [      {id: 1, nombre: 'FARMASANITAS'},
                                                {id: 2, nombre: 'FARMAGISTERIO'},
                                                {id: 3, nombre: 'FARMDEFENSA'},
                                                {id: 4, nombre: 'FARMACIA X'}
                                                ];
            $scope.para_lista_centro_utilidad = [       {id: 1, nombre: 'CENTRO_1'},
                                                        {id: 2, nombre: 'CENTRO_2'},
                                                        {id: 3, nombre: 'CENTRO_3'},
                                                        {id: 4, nombre: 'CENTRO_4'}
                                                        ];
            $scope.para_lista_bodegas = [       {id: 1, nombre: 'BODEGA_1'},
                                                {id: 2, nombre: 'BODEGA_2'},
                                                {id: 3, nombre: 'BODEGA_3'},
                                                {id: 4, nombre: 'BODEGA_4'}
                                                ];

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

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
                            existencia_x_farmacia: 20*i
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

            $scope.lista_productos = {
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
                    {field: 'existencia_farmacia', displayName: 'Existencia Farmacia'},
                    {field: 'existencia_bodega', displayName: 'Existencia Bodega'},
                    {field: 'existencia_disponible', displayName: 'Disponible'},
                    {field: 'existencia_reservada', displayName: 'Reservado'},
                    {field: 'existencia_x_farmacia', displayName: 'Existencias Farmacias', width: "12%"},
                    {field: 'cantidad', displayName: 'Cantidad'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Eliminar</span></button></div>'}
                ]

            };
            
//            $scope.abrirViewCotizacion = function()
//            {
//                $state.go('CotizacionCliente');
//            }
//            
//            $scope.onRowClickSelectCliente = function() {
//                $scope.slideurl = "views/seleccioncliente.html?time=" + new Date().getTime();
//                $scope.$emit('mostrarseleccioncliente');
//            };
            
            $scope.onRowClickSelectProducto = function() {
                $scope.slideurl = "views/seleccionproducto.html?time=" + new Date().getTime();
                $scope.$emit('mostrarseleccionproducto');
            };
            
            $scope.valorSeleccionado = function(tipo_seleccion) {
                
                if($scope.de_seleccion_empresa != 0 && $scope.de_seleccion_centro_utilidad != 0
                    && $scope.de_seleccion_bodega != 0 && $scope.para_seleccion_empresa != 0
                    && $scope.para_seleccion_centro_utilidad != 0 && $scope.para_seleccion_bodega != 0)
                {
                    $scope.bloquear = false;
                }
                
//                if(tipo_seleccion=='DeEmpresa') {
//                    alert("de_seleccion_empresa :"+$scope.de_seleccion_empresa);
//                }
//                
//                if(tipo_seleccion=='DeCentro') {
//                    alert("de_seleccion_centro_utilidad :"+$scope.de_seleccion_centro_utilidad);
//                }
//                
//                if(tipo_seleccion=='DeBodega') {
//                    alert("de_seleccion_bodega :"+$scope.de_seleccion_bodega);
//                }
//                
//                if(tipo_seleccion=='ParaEmpresa') {
//                    alert("para_seleccion_empresa :"+$scope.para_seleccion_empresa);
//                }
//                
//                if(tipo_seleccion=='ParaCentro') {
//                    alert("para_seleccion_centro_utilidad :"+$scope.para_seleccion_centro_utilidad);
//                }
//                
//                if(tipo_seleccion=='ParaBodega') {
//                    alert("para_seleccion_bodega :"+$scope.para_seleccion_bodega);
//                    alert("Bloquear = "+$scope.bloquear);
//                }
                
            }
            
            $scope.buscarCotizaciones("");

        }]);
});
