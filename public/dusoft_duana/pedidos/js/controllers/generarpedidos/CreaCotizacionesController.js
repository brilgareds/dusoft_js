//Controlador de la View cotizacioncliente.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/ClientePedido', 'models/PedidoVenta', 'models/VendedorPedido'], function(angular, controllers) {

    var fo = controllers.controller('CreaCotizacionesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state','VendedorPedido', 'Usuario',
        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, PedidoVenta, API, socket, AlertService, $state, VendedorPedido, Usuario) {

            //$scope.Empresa = Empresa;

//            $scope.session = {
//                usuario_id: Usuario.usuario_id,
//                auth_token: Usuario.token
//            };

            var that = this;
            
            $scope.rootCreaCotizaciones = {};

            $scope.rootCreaCotizaciones.Empresa = EmpresaPedido;
            $scope.rootCreaCotizaciones.paginas = 0;
            $scope.rootCreaCotizaciones.items = 0;
            $scope.rootCreaCotizaciones.termino_busqueda = "";
            $scope.rootCreaCotizaciones.ultima_busqueda = "";
            $scope.rootCreaCotizaciones.paginaactual = 1;
            $scope.rootCreaCotizaciones.bloquear = true; //Default True
            $scope.rootCreaCotizaciones.bloqueo_producto_incluido = false;
            $scope.rootCreaCotizaciones.bloquear_upload = true;
            
            $scope.rootCreaCotizaciones.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };
            
            //$scope.tab_activo = true;

            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.rootCreaCotizaciones.listado_productos = [];

            //$scope.ruta_upload = {target: '/subida'}; //ruta del servidor para subir el archivo

            $scope.rootCreaCotizaciones.seleccion_vendedor = 0;

            $scope.datos_cliente = {
                nit: '',
                nombre: '',
                direccion: '',
                telefono: '',
                ubicacion: ''
            };

            /*$scope.rootCreaCotizaciones.lista_vendedores = [{id: 1, nombre: 'Oscar Huerta'},
                {id: 2, nombre: 'Bruce Wayn'},
                {id: 3, nombre: 'John Malcovich'},
                {id: 4, nombre: 'Patricia Salgado'},
                {id: 5, nombre: 'Sofia Vergara'},
                {id: 6, nombre: 'Salma Hayec'}
            ];*/
            
            that.cargarListadoVendedores = function(){
                
                var obj_vendedores = {
                    session: $scope.rootCreaCotizaciones.session,
                    data: {
                    }
                };
                
                var url = API.TERCEROS.LISTAR_VENDEDORES;
                
                Request.realizarRequest(url, "POST", obj_vendedores, function(data) {

                    if (data.status === 200) {
                        console.log(">>>> Vendedores: ",data);
                        that.renderVendedores(data.obj);
                    }
                    else{
                        console.log("Error en consulta de Vendedores: ", data.msj);
                    }

                });
                
            };
            
            that.renderVendedores = function(data) {

                $scope.rootCreaCotizaciones.Empresa.vaciarVendedores();
                
                var vendedor_obj = {};
                
                data.listado_vendedores.forEach(function(vendedor){
                    
                    vendedor_obj = that.crearVendedor(vendedor);
                    
                    $scope.rootCreaCotizaciones.Empresa.agregarVendedor(vendedor_obj);
                    
                });
            };
            
            that.crearVendedor = function(obj) {
                
                var vendedor = VendedorPedido.get(
                                    obj.nombre,           //nombre_tercero
                                    obj.tipo_id_vendedor, //tipo_id_tercero
                                    obj.vendedor_id,      //id
                                    obj.telefono          //telefono
                                );

                return vendedor;
            };
            
            that.crearPedidoVacio = function() {
                
                var pedido = PedidoVenta.get();
                        
                var datos_pedido = {
                    numero_pedido: "",
                    fecha_registro: "",
                    descripcion_estado_actual_pedido: "",
                    estado_actual_pedido: "",
                    estado_separacion: ""
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(PedidoVenta.TIPO_CLIENTE);
                pedido.setObservacion("");
                
               //$scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
               
                return pedido;
                
            };
            
            that.crearPedidoSeleccionadoEmpresa = function(pedido){
                
                 $scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
                
            };
            
            that.buscarPedido = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootCreaCotizaciones.ultima_busqueda !== $scope.rootCreaCotizaciones.termino_busqueda) {
                    $scope.rootCreaCotizaciones.paginaactual = 1;
                }

                /*if (PedidoVenta.pedidoseleccionado !== "") {
                    
                }   */
            };
            
            //Trae el cliente con el evento "cargarClienteSlide" y lo asigna como objeto cliente para el objeto pedido
            $scope.$on('cargarClienteSlide', function(event, data) {
                
                //console.log(">>>>> Evento: ", event);

                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setCliente(data);

                if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().nombre_tercero != ''
                    && $scope.rootCreaCotizaciones.seleccion_vendedor != 0)
                {
                    $scope.rootCreaCotizaciones.bloquear = false;
                }

                if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id != '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().nombre_tercero != ''
                    && $scope.rootCreaCotizaciones.seleccion_vendedor != 0 && $scope.rootCreaCotizaciones.listado_productos.length == 0)
                {

                    $scope.rootCreaCotizaciones.bloquear_upload = false;
                }
                else {

                    $scope.rootCreaCotizaciones.bloquear_upload = true;
                }

            });

            $scope.$on('cargarGridPrincipal', function(event, data) {
                //console.log("La Información Llega a la Grid ", data);
                $scope.rootCreaCotizaciones.listado_productos = data;

                if ($scope.rootCreaCotizaciones.listado_productos.length) {
                    $scope.rootCreaCotizaciones.bloqueo_producto_incluido = true;
                }
                else {
                    $scope.rootCreaCotizaciones.bloqueo_producto_incluido = false;
                }

                if ($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.rootCreaCotizaciones.seleccion_vendedor != 0 && $scope.rootCreaCotizaciones.listado_productos.length == 0) {

                    $scope.rootCreaCotizaciones.bloquear_upload = false;
                }
                else {
                    $scope.rootCreaCotizaciones.bloquear_upload = true;
                }

            });

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            $scope.buscarCotizaciones = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootCreaCotizaciones.ultima_busqueda != $scope.rootCreaCotizaciones.termino_busqueda) {
                    $scope.rootCreaCotizaciones.paginaactual = 1;
                }

            };


            //definicion y delegados del Tabla de pedidos clientes

            $scope.rootCreaCotizaciones.lista_productos = {
                data: 'rootCreaCotizaciones.listado_productos',
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

            $scope.abrirViewPedidosClientes = function()
            {
                $state.go('PedidosClientes');
            }

            $scope.onRowClickSelectCliente = function() {
                $scope.slideurl = "views/generarpedidos/seleccioncliente.html?time=" + new Date().getTime();
                $scope.$emit('mostrarseleccioncliente');
            };

            $scope.onRowClickSelectProducto = function(tipo_cliente) {
                $scope.slideurl = "views/generarpedidos/seleccionproductocliente.html?time=" + new Date().getTime();
                $scope.$emit('mostrarseleccionproducto', tipo_cliente);

                $scope.$broadcast('cargarGridSeleccionadoSlide', $scope.rootCreaCotizaciones.listado_productos);
            };

//            $scope.onClickTab = function() {
//                $scope.tab_activo = false;
//            }

            $scope.valorSeleccionado = function() {

                console.log("Valor Seleccionado: ", $scope.seleccion_vendedor);

                if ($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.rootCreaCotizaciones.seleccion_vendedor != 0)
                {
                    $scope.rootCreaCotizaciones.bloquear = false;
                }

                if ($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.rootCreaCotizaciones.seleccion_vendedor != 0 && $scope.rootCreaCotizaciones.listado_productos.length == 0) {
                    $scope.rootCreaCotizaciones.bloquear_upload = false;
                }
                else {
                    $scope.rootCreaCotizaciones.bloquear_upload = true;
                }

            };

            $scope.$on('flow::fileAdded', function(event, $flow, flowFile) {

                var arreglo_nombre = flowFile.name.split(".");

                if (arreglo_nombre[1] !== 'txt' && arreglo_nombre[1] !== 'csv') {
                    alert("El archivo debe ser TXT o CSV. Intente de nuevo ...");
                }
            });

            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                //alert("En éste momento debo limpiar algo");

                $scope.rootCreaCotizaciones = {};
                
                //$scope.rootCreaCotizaciones.listado_productos = [];
                //$scope.rootCreaCotizaciones.lista_vendedores = [];

            });

            //that.crearPedidoVacio();
            that.cargarListadoVendedores();
            that.crearPedidoSeleccionadoEmpresa(that.crearPedidoVacio());
            $scope.buscarCotizaciones("");

        }]);
});
