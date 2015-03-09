//Controlador de la View cotizacioncliente.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/ClientePedido', 'models/PedidoVenta', 'models/VendedorPedido'], function(angular, controllers) {

    var fo = controllers.controller('CreaCotizacionesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state','VendedorPedido', 'Usuario', 'ProductoPedido',
        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, PedidoVenta, API, socket, AlertService, $state, VendedorPedido, Usuario, ProductoPedido) {

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
            
            $scope.rootCreaCotizaciones.observacion = "";
            
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
            $scope.rootCreaCotizaciones.nombre_seleccion_vendedor = "";
            $scope.rootCreaCotizaciones.tipo_id_seleccion_vendedor = "";
            
            $scope.rootCreaCotizaciones.Empresa.setCodigo('03');
            $scope.rootCreaCotizaciones.Empresa.setNombre('DUANA & CIA LTDA.');

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
                    estado: '1',
                    estado_separacion: ""
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(PedidoVenta.TIPO_CLIENTE);
                //pedido.setObservacion("");
//                pedido.setTipoIdVendedor("");
//                pedido.setVendedorId("");
                
               //$scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
               
                return pedido;
                
            };
            
            that.crearPedidoSeleccionadoEmpresa = function(pedido){
                
                 $scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
                
            };
            
           /* that.buscarPedido = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootCreaCotizaciones.ultima_busqueda !== $scope.rootCreaCotizaciones.termino_busqueda) {
                    $scope.rootCreaCotizaciones.paginaactual = 1;
                }

            };*/
            
            //Trae el cliente con el evento "cargarClienteSlide" y lo asigna como objeto cliente para el objeto pedido
            $scope.$on('cargarClienteSlide', function(event, data) {
                
                //console.log(">>>>> Evento: ", event);

                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setCliente(data);
                
                //console.log(">>>>>> DATOS DEL CLIENTE: ", $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente());

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

            //var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            $scope.buscarCotizaciones = function(paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootCreaCotizaciones.ultima_busqueda !== $scope.rootCreaCotizaciones.termino_busqueda) {
                    $scope.rootCreaCotizaciones.paginaactual = 1;
                }

                if(that.empty($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado())){
                    that.crearPedidoSeleccionadoEmpresa(that.crearPedidoVacio());
                    //console.log(">>>>> EMPRESA: ",$scope.rootCreaCotizaciones.Empresa);
                }
                else{
                    $scope.rootCreaCotizaciones.seleccion_vendedor = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getId();
                    console.log("Información de Empresa: ", $scope.rootCreaCotizaciones.Empresa);
                    //that.crearPedidoSeleccionadoEmpresa(that.crearPedidoVacio());
                    
                    // HACER CONSULTA DE PRODUCTOS DEL PEDIDO (DETALLE)
                    
                    //detalle_cotizacion.numero_cotizacion
                    
                    var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            detalle_cotizacion: {
                                numero_cotizacion: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion(),                            
                            }
                        }
                    };

                    var url = API.PEDIDOS.LISTAR_DETALLE_COTIZACION;
                    
                    Request.realizarRequest(url, "POST", obj, function(data) {

                        if (data.status === 200) {
                            console.log("Consulta exitosa: ", data.msj);
                            
                            console.log("Datos de la consulta: ", data);

                            /*if (callback !== undefined && callback !== "" && callback !== 0) {
                                callback(data);
                            }*/
                            
                            var detalle = data.obj.resultado_consulta;
                            
                            that.renderDetalleCotizacion(detalle);
                        }
                        else {
                            console.log("Error en la consulta: ", data.msj);
                        }
                    });
                    
                }
            

            };
            
            that.empty = function (data)
            {
                if(typeof(data) === 'number' || typeof(data) === 'boolean')
                {
                  return false;
                }
                
                if(typeof(data) === 'undefined' || data === null)
                {
                  return true;
                }
                
                if(typeof(data.length) !== 'undefined')
                {
                  return data.length === 0;
                }
                
                var count = 0;
                
                for(var i in data)
                {
                  if(data.hasOwnProperty(i))
                  {
                    count ++;
                  }
                }
                
                return count === 0;
            };

            that.renderDetalleCotizacion = function(detalle){
                
                detalle.forEach(function(producto){
                    
                    var obj = that.crearObjetoDetalle(producto);
                    
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().agregarProducto(obj);
                    
                });
            };
            
            that.crearObjetoDetalle = function(producto){
                
                //codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible, molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia, existencia_disponible, cantidad_pendiente
                
                var objeto_producto = ProductoPedido.get(
                        producto.codigo_producto,//codigo,
                        producto.nombre_producto,//nombre,
                        '',//existencia,
                        producto.valor_unitario,//precio,
                        producto.numero_unidades,//cantidad_solicitada,
                        '',//cantidad_ingresada,
                        '',//observacion_cambio,
                        '',//disponible,
                        '',//molecula,
                        '',//existencia_farmacia,
                        '',//tipo_producto_id,
                        '',//total_existencias_farmacia,
                        '',//existencia_disponible,
                        ''//cantidad_pendiente
                    );
                        
                objeto_producto.setIva(producto.porc_iva);
                
                objeto_producto.setTotalSinIva();
                
                objeto_producto.setTotalConIva();
                        
                return objeto_producto;
                
            };

            //definicion y delegados del Tabla de pedidos clientes

            $scope.rootCreaCotizaciones.lista_productos = {
                data: 'rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos()',
                //data: 'rootCreaCotizaciones.listado_productos',
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
                    {field: 'precio', displayName: 'Precio Unitario'},
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
                
                var cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente();
                var observacion = $scope.rootCreaCotizaciones.observacion;
                
                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setObservacion(observacion);
                
                console.log(">>>> Observación: ", $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion());
                
                $scope.$emit('mostrarseleccionproducto', tipo_cliente, cliente);

                $scope.$broadcast('cargarGridSeleccionadoSlide', $scope.rootCreaCotizaciones.listado_productos);
            };

//            $scope.onClickTab = function() {
//                $scope.tab_activo = false;
//            }

            $scope.valorSeleccionado = function() {

                console.log("Valor Seleccionado: ", $scope.rootCreaCotizaciones.seleccion_vendedor);

                var vendedor_seleccionado = $scope.rootCreaCotizaciones.seleccion_vendedor;
                //var nombre_vendedor_seleccionado = "";
                
                $scope.rootCreaCotizaciones.Empresa.getVendedores().forEach(function(vendedor){

                    if(vendedor.id === vendedor_seleccionado){
                        //nombre_vendedor_seleccionado = vendedor.nombre_tercero;
                        
                        var obj_vendedor = {
                            nombre: vendedor.nombre_tercero,
                            tipo_id_vendedor: vendedor.tipo_id_tercero,
                            vendedor_id: vendedor.id,
                            telefono: vendedor.telefono
                        };
                        
                        var vendedor = that.crearVendedor(obj_vendedor);
                        
                        $scope.rootCreaCotizaciones.nombre_seleccion_vendedor = vendedor.nombre_tercero;
                        //$scope.rootCreaCotizaciones.tipo_id_seleccion_vendedor = vendedor.tipo_id_tercero;
                        $scope.rootCreaCotizaciones.Empresa.setVendedorSeleccionado(vendedor);
                        
                        //console.log(">>>>> Vendedor Seleccionado: ", $scope.rootCreaCotizaciones.Empresa.getVendedorSeleccionado());

                    }
                });
                
                console.log("Nombre Valor Seleccionado: ", $scope.rootCreaCotizaciones.nombre_seleccion_vendedor);
                console.log("Nombre Valor Seleccionado: ", $scope.rootCreaCotizaciones.tipo_id_seleccion_vendedor);
                
                //console.log("Valor Parámetro: ", valor);

                /*if ($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.rootCreaCotizaciones.seleccion_vendedor != 0)
                {
                    $scope.rootCreaCotizaciones.bloquear = false;
                }

                if ($scope.datos_cliente.nit != '' && $scope.datos_cliente.nombre != '' && $scope.rootCreaCotizaciones.seleccion_vendedor != 0 && $scope.rootCreaCotizaciones.listado_productos.length == 0) {
                    $scope.rootCreaCotizaciones.bloquear_upload = false;
                }
                else {
                    $scope.rootCreaCotizaciones.bloquear_upload = true;
                }*/

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
            
            $scope.buscarCotizaciones("");

        }]);
});
