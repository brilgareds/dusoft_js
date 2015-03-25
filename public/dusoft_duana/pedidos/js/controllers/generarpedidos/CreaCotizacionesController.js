//Controlador de la View cotizacioncliente.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/ClientePedido', 'models/PedidoVenta', 'models/VendedorPedido'], function(angular, controllers) {

    var fo = controllers.controller('CreaCotizacionesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state','VendedorPedido', 'Usuario', 'ProductoPedido', "$modal",
        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, PedidoVenta, API, socket, AlertService, $state, VendedorPedido, Usuario, ProductoPedido, $modal) {

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
                
            $scope.rootCreaCotizaciones.es_cotizacion = true;

            $scope.rootCreaCotizaciones.listado_productos = [];

            $scope.rootCreaCotizaciones.seleccion_vendedor = 0;
            $scope.rootCreaCotizaciones.nombre_seleccion_vendedor = "";
            $scope.rootCreaCotizaciones.tipo_id_seleccion_vendedor = "";
            
            $scope.rootCreaCotizaciones.Empresa.setCodigo('03');
            $scope.rootCreaCotizaciones.Empresa.setNombre('DUANA & CIA LTDA.');
            
            //$scope.rootCreaCotizaciones.valor_total_sin_iva = 0;
            //$scope.rootCreaCotizaciones.valor_total_con_iva = 0;

            $scope.datos_cliente = {
                nit: '',
                nombre: '',
                direccion: '',
                telefono: '',
                ubicacion: ''
            };
            
            /* Nuevas variables y objetos para almacenamiento y validación - Inicio */
            
                $scope.rootCreaCotizaciones.tab_estados = {tab1: true, tab2: false};
            
                /**/$scope.rootCreaCotizaciones.titulo_tab_1 = "Incluir Producto Manual";
                /**/$scope.rootCreaCotizaciones.titulo_tab_2 = "Cargar Archivo Plano";
            
            /* Nuevas variables y objetos para almacenamiento y validación - Fin */
            
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
               
                return pedido;
                
            };
            
            that.crearPedidoSeleccionadoEmpresa = function(pedido){
                
                 $scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
                
            };
            
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
                
                //Si no hay Pedido/Cotizacion Seleccionado, se crea una Cotización Vacia. Para Pedidos el llegar a éste punto implica un Pedido Seleccionado
                if(that.empty($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado())){
                    
                    that.crearPedidoSeleccionadoEmpresa(that.crearPedidoVacio());
                }
                //Si hay Pedido/Cotizacion Seleccionado recibe el objeto Pedido/Cotización Correspondiente
                //debe haber numero_cotizacion o numero_pedido. Según sea, carga iterfaz para manipular Cotización o Pedido. Validar según sea el caso.
                else{
                    $scope.rootCreaCotizaciones.seleccion_vendedor = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getId();
                    
                    $scope.rootCreaCotizaciones.observacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion();
                    
                    // HACER CONSULTA DE PRODUCTOS DE LA COTIZACIÓN O PEDIDO (DETALLE)
                    console.log(">>>>>>>>> Numero Cotización: ", $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion());
                    
                    if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined)
                    {
                        console.log(">>>>>>>>>>>>>> Número Cotización con Valor");

                        that.consultarDetalleCotizacion(function(data){

                            var detalle = data.obj.resultado_consulta;
                            that.renderDetalleCotizacion(detalle);

                        });
                    }                       
                    else {
                        
                        console.log(">>>>>>>>>>>>>> Número Cotización sin Valor");
                        
                        $scope.rootCreaCotizaciones.es_cotizacion = false;
                        
                        //Crear las siguientes Operaciones
                        that.consultarDetallePedido(function(data){

                            var detalle = data.obj.resultado_consulta;
                            that.renderDetalleCotizacion(detalle);

                        });
                    }
                                                
                }

            };
            
            that.consultarDetalleCotizacion = function(callback){
                
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

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(data);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                    }
                });
                    
            };
            
            that.consultarDetallePedido = function(callback){
                
                
                
                console.log(" >>>>>> Consultando Detalle - Objeto Pedido: ",$scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado());
                
                var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            detalle_pedido: {
                                numero_pedido: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido(),                            
                            }
                        }
                    };
                 
                var url = API.PEDIDOS.LISTAR_DETALLE_PEDIDO;
                    
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Consulta exitosa: ", data.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(data);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                    }
                });
                    
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
                
                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().vaciarProductos();
                
                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva = 0;
                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva = 0;
                
                detalle.forEach(function(producto){
                    
                    var obj = that.crearObjetoDetalle(producto);
                    
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva += parseFloat(obj.getTotalSinIva());
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva += parseFloat(obj.getTotalConIva());
                    
                    console.log(">>> Valor Parcial Total Sin Iva: ", $scope.rootCreaCotizaciones.valor_total_sin_iva);
                    
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().agregarProducto(obj);
                    
                });
            };
            
            that.crearObjetoDetalle = function(producto){
                
                //codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible, molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia, existencia_disponible, cantidad_pendiente
                
                var objeto_producto = ProductoPedido.get(
                        producto.codigo_producto,//codigo,
                        producto.nombre_producto,//nombre,
                        0,//existencia,
                        producto.valor_unitario,//precio,
                        producto.numero_unidades,//cantidad_solicitada,
                        0,//cantidad_ingresada,
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
                footerTemplate: '   <div class="row col-md-12">\
                                        <div class="col-md-3 pull-right">\
                                            <table class="table table-clear">\
                                                <tbody>\
                                                    <tr>\
                                                        <td class="left"><strong>Total Sin IVA</strong></td>\
                                                        <td class="right">{{rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva | currency: "$ "}}</td>\
                                                    </tr>\
                                                    <tr>\
                                                        <td class="left"><strong>Total Con IVA</strong></td>\
                                                        <td class="right">{{rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva | currency: "$ "}}</td>\
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Descripción'},
                    {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                    {field: 'iva', displayName: 'Iva %'},
                    {field: 'precio', displayName: 'Precio Unitario', cellFilter: "currency:'$ '"},
                    {field: 'total_sin_iva', displayName: 'Total Sin Iva', cellFilter: "currency:'$ '"},
                    {field: 'total_con_iva', displayName: 'Total Con Iva', cellFilter: "currency:'$ '"}
                ]

            };

            $scope.abrirViewPedidosClientes = function()
            {
                $state.go('PedidosClientes');
            };

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
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setVendedor(vendedor);
                        
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

            /*$scope.$on('flow::fileAdded', function(event, $flow, flowFile) {

                var arreglo_nombre = flowFile.name.split(".");

                if (arreglo_nombre[1] !== 'txt' && arreglo_nombre[1] !== 'csv') {
                    alert("El archivo debe ser TXT o CSV. Intente de nuevo ...");
                }
            });*/

            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.rootCreaCotizaciones = {};

            });
            
            /**/
            //Función que inserta el encabezado del pedido temporal
            that.insertarEncabezadoCotizacion = function(callback) {
                
                if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() === "") {

                    var obj_encabezado = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            cotizacion_encabezado: {

                                empresa_id: $scope.rootCreaCotizaciones.Empresa.getCodigo(),
                                tipo_id_tercero: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().tipo_id_tercero,
                                tercero_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id,
                                tipo_id_vendedor: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getTipoId(),
                                vendedor_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getId(),
                                estado: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().estado,
                                observaciones: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion()

                            }
                        }
                    };

                    var url_encabezado = API.PEDIDOS.CREAR_COTIZACION;

                    Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                        if (data.status === 200) {
                            
                            console.log("Registro Insertado Exitosamente en Encabezado");

                            var pedido_cliente_id_tmp = data.obj.resultado_consulta[0].pedido_cliente_id_tmp;
                            
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setNumeroCotizacion(pedido_cliente_id_tmp);

                            if(callback !== undefined && callback !== "" && callback !== 0){
                                callback(true);
                            }
                        }
                        else {
                            console.log(data.msj);
                            if(callback !== undefined && callback !== "" && callback !== 0){
                                callback(false);
                            }
                        }
                    });
                    /* Fin - Inserción del Encabezado */
                }
                else{
                    console.log("Cotización Existente - Continua Inserción Detalle");
                    callback(true);
                }
            };          
            /**/
            
            $scope.rootCreaCotizaciones.opciones_archivo = new Flow();
            $scope.rootCreaCotizaciones.opciones_archivo.target = API.PEDIDOS.ARCHIVO_PLANO_PEDIDO_CLIENTE;
            $scope.rootCreaCotizaciones.opciones_archivo.testChunks = false;
            $scope.rootCreaCotizaciones.opciones_archivo.singleFile = true;
            $scope.rootCreaCotizaciones.opciones_archivo.query = {
                session: JSON.stringify($scope.rootCreaCotizaciones.session)
            };
            
            $scope.cargar_archivo_plano = function($flow) {

                $scope.rootCreaCotizaciones.opciones_archivo = $flow;
            };

            $scope.subir_archivo_plano = function() {
                    
                   // that.insertarEncabezadoCotizacion(function(insert_encabezado_exitoso) {

                        //--Inicialmente no se insertará Encabezado porque aquí se genera un consecutivo y no puede eliminarse una cotización. Se creará despué de validar la información del archivo.
                        //if (insert_encabezado_exitoso) {

                            //console.log("Pedido Seleccionado para PLANO: ",$scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado());
                            
                            var observacion = $scope.rootCreaCotizaciones.observacion;
                
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setObservacion(observacion);

                            $scope.rootCreaCotizaciones.opciones_archivo.opts.query.data = JSON.stringify({
                                
                                pedido_cliente: {
                                    //DATOS PARA CONSULTA PRODUCTOS
                                    //termino_busqueda: $scope.rootCreaCotizaciones.termino_busqueda,
                                    //pagina_actual: $scope.rootCreaCotizaciones.paginaactual,
                                    //empresa_id: '03',
                                    empresa_id: $scope.rootCreaCotizaciones.Empresa.getCodigo(),
                                    centro_utilidad_id: '1 ',
                                    bodega_id: '03',
                                    tipo_producto: '0',
                                    contrato_cliente_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getContratoId(),
                                    pedido_cliente_id_tmp: '0',
                                    
                                    //DATOS PARA ENCABEZADO
                                    //empresa_id: $scope.rootCreaCotizaciones.Empresa.getCodigo(),
                                    tipo_id_tercero: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().tipo_id_tercero,
                                    tercero_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id,
                                    tipo_id_vendedor: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getTipoId(),
                                    vendedor_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getId(),
                                    estado: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().estado,
                                    observaciones: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion()
                                }

                            });

                            $scope.rootCreaCotizaciones.opciones_archivo.upload();
                        //}
                   // });
            };

            $scope.respuesta_archivo_plano = function(file, message) {
                
                /*var para_seleccion_empresa = [];
                var para_seleccion_centro_utilidad = [];
                var para_seleccion_bodega = [];*/

                var data = (message !== undefined) ? JSON.parse(message) : {};


                if (data.status === 200) {

                    /*$scope.rootCreaCotizaciones.opciones_archivo.cancel();
                    
                    if ($scope.rootCreaPedidoFarmacia.para_seleccion_empresa)
                    {
                        para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',');
                    }

                    if ($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad)
                    {
                        para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',');
                    }

                    if ($scope.rootCreaPedidoFarmacia.para_seleccion_bodega)
                    {
                        para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(',');
                    }*/
                    
                    //--numero_cotizacion: pedido_cliente_id_tmp,
                    
                    var numero_cotizacion = data.obj.pedido_cliente_detalle.numero_cotizacion;
                    
                    console.log(">>>>> Número Cotización PLANO DATA: ",data.obj.pedido_cliente_detalle);
                    
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setNumeroCotizacion(numero_cotizacion);
                    
                    that.ventana_modal_no_validos(data, function(){
                        $scope.setTabActivo(1, function(){
                        
                            //Trae detalle de productos cargados del archivo
                            /*that.consultarDetallePedidoTemporal(para_seleccion_empresa, para_seleccion_centro_utilidad, para_seleccion_bodega);*/
                            that.consultarDetalleCotizacion(function(data){

                                var detalle = data.obj.resultado_consulta;
                                that.renderDetalleCotizacion(detalle);

                            });
                        });
                    });
                    

                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            };
            
            that.ventana_modal_no_validos = function(data, callback){
                
                $scope.productos_validos = data.obj.pedido_cliente_detalle.productos_validos;
                $scope.productos_invalidos = data.obj.pedido_cliente_detalle.productos_invalidos;

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Listado Productos </h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <h4 >Lista Productos INVALIDOS.</h4>\
                                        <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                            <div class="list-group">\
                                                <a ng-repeat="producto in productos_invalidos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                    {{ producto.codigo_producto}}\
                                                </a>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }
                };
                
                var modalInstance = $modal.open($scope.opts);  
                
                callback();
            };     
            
            $scope.setTabActivo = function(number, callback) {

                if (number === 1)
                {
                    $scope.rootCreaCotizaciones.tab_estados.tab1 = true;
                    if(callback !== undefined && callback !== "" && callback !== 0){
                        callback();
                    }
                }

                if (number === 2)
                {
                    $scope.rootCreaCotizaciones.tab_estados.tab2 = true;
                    if(callback !== undefined && callback !== "" && callback !== 0){
                        callback();
                    }
                }

            };
            
            $scope.generarPdfCotizacionCliente = function(){
                
                var codigo_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getCodigo();
                var nombre_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getNombre();
                
                var numero_cotizacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                
                var id_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getId();
                var nombre_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getNombre();
                var ciudad_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getMunicipio();
                var direccion_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getDireccion();

                var fecha_registro = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getFechaRegistro();
                var observacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion();
                
                var valor_total_sin_iva = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva;
                var valor_total_con_iva = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva;


                var obj_pdf = {
                    session: $scope.rootCreaCotizaciones.session,
                    data: {
                        encabezado_pedido_cliente: {
                            numero_cotizacion: numero_cotizacion,        
                            codigo_origen_id: codigo_empresa_origen,
                            empresa_origen: nombre_empresa_origen,
                            
                            id_cliente: id_cliente,
                            nombre_cliente: nombre_cliente,
                            ciudad_cliente: ciudad_cliente,
                            direccion_cliente: direccion_cliente,

                            fecha_registro: fecha_registro,
                            observacion: observacion,
                    
                            valor_total_sin_iva: valor_total_sin_iva,
                            valor_total_con_iva: valor_total_con_iva
                        },
                        detalle_pedido_cliente: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos()
                    }
                };

                var url_imprimir_cotizacion_pdf = API.PEDIDOS.IMPRIMIR_COTIZACION_CLIENTE;

                Request.realizarRequest(url_imprimir_cotizacion_pdf, "POST", obj_pdf, function(data) {

                    if (data.status === 200) {

                        var nombre_archivo_temporal = data.obj.reporte_pedido.nombre_reporte;

                        $scope.visualizarReporte("/reports/"+nombre_archivo_temporal, "Cotizacion: "+numero_cotizacion, "download");
                    }
                    else{
                        console.log("Error: ", data.msj);
                    }
                });
            };
            
            $scope.generarPdfPedidoCliente = function(){
                
                var codigo_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getCodigo();
                var nombre_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getNombre();
                
                var numero_pedido = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido();
                
                var id_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getId();
                var nombre_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getNombre();
                var ciudad_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getMunicipio();
                var direccion_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getDireccion();

                var fecha_registro = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getFechaRegistro();
                var observacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion();
                
                var valor_total_sin_iva = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva;
                var valor_total_con_iva = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva;


                var obj_pdf = {
                    session: $scope.rootCreaCotizaciones.session,
                    data: {
                        encabezado_pedido_cliente: {
                            numero_pedido: numero_pedido,        
                            codigo_origen_id: codigo_empresa_origen,
                            empresa_origen: nombre_empresa_origen,
                            
                            id_cliente: id_cliente,
                            nombre_cliente: nombre_cliente,
                            ciudad_cliente: ciudad_cliente,
                            direccion_cliente: direccion_cliente,

                            fecha_registro: fecha_registro,
                            observacion: observacion,
                    
                            valor_total_sin_iva: valor_total_sin_iva,
                            valor_total_con_iva: valor_total_con_iva
                        },
                        detalle_pedido_cliente: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos()
                    }
                };

                var url_imprimir_pedido_pdf = API.PEDIDOS.IMPRIMIR_PEDIDO_CLIENTE;

                Request.realizarRequest(url_imprimir_pedido_pdf, "POST", obj_pdf, function(data) {

                    if (data.status === 200) {

                        var nombre_archivo_temporal = data.obj.reporte_pedido.nombre_reporte;

                        $scope.visualizarReporte("/reports/"+nombre_archivo_temporal, "Pedido: "+numero_pedido, "download");
                    }
                    else{
                        console.log("Error: ", data.msj);
                    }
                });
            };            
            
            $scope.generarPedidoCliente = function (){
                
                var obj_encabezado = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            pedido_cliente: {
                                numero_cotizacion: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion()
                            }
                        }
                    };
                    /* Fin - Objeto para inserción de Encabezado*/

                    /* Inicio - Validar Existencia de encabezado */

                    var url_encabezado = API.PEDIDOS.INSERTAR_PEDIDO_CLIENTE;

                    Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                        if (data.status === 200) {
                            
                            console.log("Inserción de Pedido Cliente exitosa", data.msj);
                            
                            var numero_pedido = data.obj.numero_pedido;
                            
                            /* Mensaje para Usuario - Inicio */
                            $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Listado Productos </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >Número de Pedido: '+numero_pedido+' </h4>\
                                            </div>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                        </div>',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            }
                        };

                        var modalInstance = $modal.open($scope.opts);  

                            /* Mensaje para Usuario - Fin */
                        }
                        else{
                            console.log("Falló la Inserción de Pedido Cliente", data.msj);
                        }
                    });
            };
            
            //that.crearPedidoVacio();
            that.cargarListadoVendedores();
            
            $scope.buscarCotizaciones("");

        }]);
});
