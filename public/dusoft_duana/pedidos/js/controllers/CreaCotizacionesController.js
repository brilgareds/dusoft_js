//Controlador de la View cotizacioncliente.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CreaCotizacionesController', [
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
            $scope.bloquear = true; //Default True
            $scope.bloqueo_producto_incluido = false;
            $scope.bloquear_upload = true;
            //$scope.tab_activo = true;

            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.listado_productos = [];
            
            //$scope.ruta_upload = {target: '/subida'}; //ruta del servidor para subir el archivo
            
            $scope.seleccion_vendedor = 0;
            
            $scope.datos_cliente = {
                nit: '',
                nombre: '',
                direccion: '',
                telefono: '',
                ubicacion: ''
            };
            
            $scope.lista_vendedores = [ {id: 1, nombre: 'Oscar Huerta'},
                                        {id: 2, nombre: 'Bruce Wayn'},
                                        {id: 3, nombre: 'John Malcovich'},
                                        {id: 4, nombre: 'Patricia Salgado'},
                                        {id: 5, nombre: 'Sofia Vergara'},
                                        {id: 6, nombre: 'Salma Hayec'}
                                        ];
                   
            $scope.$on('cargarClienteSlide', function(event, data) {
                    //console.log("La Información Llega a la Grid ", data);
                    //console.log("Después: ", data);
                    
                    $scope.datos_cliente = data;
                    
                    if($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.seleccion_vendedor != 0)
                    {
                        $scope.bloquear = false;
                    }
                    
                    if($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.seleccion_vendedor != 0 && $scope.listado_productos.length == 0){

                        $scope.bloquear_upload = false;
                    }
                    else{
                        
                        $scope.bloquear_upload = true;
                    }
                    
                });
            
            $scope.$on('cargarGridPrincipal', function(event, data) {
                    //console.log("La Información Llega a la Grid ", data);
                    $scope.listado_productos = data;
                    
                    if($scope.listado_productos.length){                        
                        $scope.bloqueo_producto_incluido = true;
                    }
                    else {
                        $scope.bloqueo_producto_incluido = false;
                    }
                    
                    if($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.seleccion_vendedor != 0 && $scope.listado_productos.length == 0){
                        $scope.bloquear_upload = false;
                    }
                    else{
                        $scope.bloquear_upload = true;
                    }

                });
                
//            $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
//                    event.preventDefault();//prevent file from uploading
//                });

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            $scope.buscarCotizaciones = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
//                for(i=0; i<10; i++)
//                {
//                    //var pedido = Pedido.get();
//                    
//                    obj = { 
//                            codigo_producto: '123456'+i,
//                            descripcion: 'TRIPARTYCINA X '+i,
//                            cantidad_solicitada: 10*i,
//                            iva: 16,
//                            precio_venta: '60'+i,
//                            total_sin_iva: 100, //cantidad*precio_venta
//                            total_con_iva: 116 //cantidad*precio_venta + cantidad*precio_venta*iva
//                        }
//                    
//                    $scope.listado_productos.push(obj);
//                        
//                }

                
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
                    data: 'listado_productos',
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
                        {field: 'total_con_iva', displayName: 'Total Con Iva'}
                    ]

                };
/**************** Antigua Grid *********/
//            $scope.lista_productos = {
//                data: 'listado_productos',
//                enableColumnResize: true,
//                enableRowSelection: false,
//                columnDefs: [
//                    {field: 'numero_producto', displayName: 'Número Producto'},
//                    {field: 'nombre_producto', displayName: 'Nombre Producto'},
//                    {field: 'nombre_vendedor', displayName: 'Vendedor'},
//                    {field: 'fecha_cotizacion', displayName: 'Fecha'},
//                    {field: 'valor_cotizacion', displayName: 'Valor'},
//                    {field: 'estado', displayName: 'Estado'},
//                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Activar</span></button></div>'}
//
//                ]
//
//            };
/**************** Antigua Grid *********/

            
            $scope.abrirViewPedidosClientes = function()
            {
                $state.go('PedidosClientes');
            }
            
            $scope.onRowClickSelectCliente = function() {
                $scope.slideurl = "views/seleccioncliente.html?time=" + new Date().getTime();
                $scope.$emit('mostrarseleccioncliente');
            };
            
            $scope.onRowClickSelectProducto = function(tipo_cliente) {
                $scope.slideurl = "views/seleccionproductocliente.html?time=" + new Date().getTime();
                $scope.$emit('mostrarseleccionproducto', tipo_cliente);
                
                $scope.$broadcast('cargarGridSeleccionadoSlide', $scope.listado_productos);
            };
            
//            $scope.onClickTab = function() {
//                $scope.tab_activo = false;
//            }
            
            $scope.valorSeleccionado = function() {
                
                if($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.seleccion_vendedor != 0)
                {
                    $scope.bloquear = false;
                }
                
                if($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.seleccion_vendedor != 0 && $scope.listado_productos.length == 0){
                    $scope.bloquear_upload = false;
                }
                else{
                    $scope.bloquear_upload = true;
                }
                
            };
            
            $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
                
                var arreglo_nombre = flowFile.name.split(".");
    
                if(arreglo_nombre[1] !== 'txt' && arreglo_nombre[1] !== 'csv') {
                    alert("El archivo debe ser TXT o CSV. Intente de nuevo ...");
                }
            });
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
               //alert("En éste momento debo limpiar algo");
               
               $scope.listado_productos = [];
               $scope.lista_vendedores = [];
               
            });
            
            $scope.buscarCotizaciones("");

        }]);
});
