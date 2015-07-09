//Controlador de la View cotizacioncliente.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/ClientePedido', 'models/PedidoVenta', 'models/VendedorPedido'], function(angular, controllers) {

    var fo = controllers.controller('CreaCotizacionesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state','VendedorPedido', 'Usuario', 'ProductoPedido', "$modal", 'STATIC', "localStorageService",
        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, PedidoVenta, API, socket, AlertService, $state, VendedorPedido, Usuario, ProductoPedido, $modal, STATIC, localStorageService) {

            var that = this;
            
            console.log(">>>> STATIC - CreaCotiz : ", STATIC);

            $scope.expreg = new RegExp("^[0-9]*$");
            
            $scope.rootCreaCotizaciones = {};

            $scope.rootCreaCotizaciones.Empresa = EmpresaPedido;
            $scope.rootCreaCotizaciones.paginas = 0;
            $scope.rootCreaCotizaciones.items = 0;
            $scope.rootCreaCotizaciones.termino_busqueda = "";
            $scope.rootCreaCotizaciones.ultima_busqueda = "";
            $scope.rootCreaCotizaciones.paginaactual = 1;

            $scope.rootCreaCotizaciones.bloquear_upload = true;

            $scope.rootCreaCotizaciones.bloquear_incluir_producto = true;
            
            $scope.rootCreaCotizaciones.observacion = "";
            
            $scope.rootCreaCotizaciones.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
                
            $scope.rootCreaCotizaciones.es_cotizacion = true;

            $scope.rootCreaCotizaciones.seleccion_vendedor = 0;
            $scope.rootCreaCotizaciones.nombre_seleccion_vendedor = "";
            $scope.rootCreaCotizaciones.tipo_id_seleccion_vendedor = "";
            
            $scope.rootCreaCotizaciones.bloquear_eliminar = false; //NUEVO
            
            
            $scope.rootCreaCotizaciones.Empresa.setCodigo(Usuario.getUsuarioActual().getEmpresa().getCodigo());
            $scope.rootCreaCotizaciones.Empresa.setNombre(Usuario.getUsuarioActual().getEmpresa().getNombre());
            
            /* Nuevas variables y objetos para almacenamiento y validación - Inicio */
            
            $scope.rootCreaCotizaciones.tab_estados = {tab1: true, tab2: false};

            $scope.rootCreaCotizaciones.titulo_tab_1 = "Incluir Producto Manual";
            $scope.rootCreaCotizaciones.titulo_tab_2 = "Cargar Archivo Plano";
            
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
                        console.log("Consulta Vendedores Exitosa: ",data.msj);
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
                
                //Se hacen asignaciones de ésta forma porque definición de setDatos convierte a null los ''
                //No se cambia definición del objeto para evitar generar problemas a lo ya desarrollado
                pedido.numero_pedido = '';
                pedido.fecha_registro = '';
                pedido.descripcion_estado_actual_pedido = '';
                pedido.estado = '1';
                pedido.estado_separacion = '';
                
                pedido.setTipo(PedidoVenta.TIPO_CLIENTE);
               
                return pedido;
                
            };
            
            that.crearPedidoSeleccionadoEmpresa = function(pedido){
                
                 $scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
                
            };
            
            //Trae el cliente con el evento "cargarClienteSlide" y lo asigna como objeto cliente para el objeto pedido
            $scope.$on('cargarClienteSlide', function(event, data) {

                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setCliente(data);
                
                var cantidad_productos = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos().length;
                
                /* Bloqueo de Inccluir Producto y Subir Archivo Plano */

                if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getId() !== '' && $scope.rootCreaCotizaciones.seleccion_vendedor !== 0)
                {
                    $scope.rootCreaCotizaciones.bloquear_incluir_producto = false;
                }

                if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id !== '' && $scope.rootCreaCotizaciones.seleccion_vendedor !== 0
                    && cantidad_productos === 0)
                {

                    $scope.rootCreaCotizaciones.bloquear_upload = false;
                }
                else {

                    $scope.rootCreaCotizaciones.bloquear_upload = true;
                }

            });

            $scope.$on('cargarGridPrincipal', function(event, bloquear_eliminar) {
                
                var cantidad_productos = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos().length;
                
                $scope.rootCreaCotizaciones.bloquear_eliminar = bloquear_eliminar;

                if (cantidad_productos) {
                    $scope.rootCreaCotizaciones.bloqueo_producto_incluido = true;
                }
                else {
                    $scope.rootCreaCotizaciones.bloqueo_producto_incluido = false;
                }

                if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id !== '' && $scope.rootCreaCotizaciones.seleccion_vendedor !== 0 && cantidad_productos === 0) {

                    $scope.rootCreaCotizaciones.bloquear_upload = false;
                }
                else {
                    $scope.rootCreaCotizaciones.bloquear_upload = true;
                }

            });

            $scope.buscarCotizaciones = function(paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootCreaCotizaciones.ultima_busqueda !== $scope.rootCreaCotizaciones.termino_busqueda) {
                    $scope.rootCreaCotizaciones.paginaactual = 1;
                }
                
                //Inicializa encabezado cotización para recarga
                if(localStorageService.get("cotizacionseleccionada") !== undefined && localStorageService.get("cotizacionseleccionada") !== "" && localStorageService.get("cotizacionseleccionada") !== null) {
                    
                    console.log(">>> El LocalStorage: ",localStorageService.get("cotizacionseleccionada"));
                    console.log(">>>> CASO COTIZACION");
                    
                    if(localStorageService.get("cotizacionseleccionada").length > 0) {

                        var numero_cotizacion = localStorageService.get("cotizacionseleccionada");

                        that.consultarEncabezadoCotizacion(numero_cotizacion, function(data){
                            var cotizacion = that.crearCotizacion(data);
                            $scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(cotizacion);
                            
                            console.log(">>>> EDITABLE Cotización - tipo: ",typeof JSON.parse(localStorageService.get("editable")));
                            console.log(">>>> EDITABLE Cotización: ",JSON.parse(localStorageService.get("editable")));
                            
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setEditable(JSON.parse(localStorageService.get("editable")));
                            
                            //console.log(">>>> EDITABLE Cotización: ",$scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getEditable());
                            
                            console.log(">>> INFO Pedido Seleccionado Cotización: ",$scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado());
                            
                            //Ejecutar aquí mismo toda la recarga de datos debido que a la asincronía. Solo así se puede garantizar la ejecución
                            that.completarEncabezadoAndGenerarDetalle();
                        });

                    }
                    
                }

                //Inicializa encabezado pedido para recarga
                else if(localStorageService.get("pedidoseleccionado") !== undefined && localStorageService.get("pedidoseleccionado") !== "" && localStorageService.get("pedidoseleccionado") !== null) {
                    
                    console.log(">>>> CASO PEDIDO");
                    
                    if(localStorageService.get("pedidoseleccionado").length > 0) {

                        var numero_pedido = localStorageService.get("pedidoseleccionado");

                        that.consultarEncabezadoPedido(numero_pedido, function(data){
                            var pedido = that.crearPedido(data);
                            $scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
                            
                            console.log(">>>> EDITABLE Pedido: ",localStorageService.get("editable"));
                            
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setEditable(JSON.parse(localStorageService.get("editable")));
                            
                            console.log(">>> INFO Pedido Seleccionado Pedido: ",$scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado());
                            
                            //Ejecutar aquí mismo toda la recarga de datos debido que a la asincronía. Solo así se puede garantizar la ejecución
                            that.completarEncabezadoAndGenerarDetalle();
                        });

                    }

                }
                
                //Si no hay Pedido/Cotizacion Seleccionado, se crea una Cotización Vacia. Para Pedidos el llegar a éste punto implica un Pedido Seleccionado
                else if(that.empty($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado())){
                    
                    console.log(">>>> CASO VACIO");
                    
                    that.crearPedidoSeleccionadoEmpresa(that.crearPedidoVacio());

                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setEncabezadoBloqueado(false);
                    $scope.rootCreaCotizaciones.bloquear_incluir_producto = true;
                    $scope.rootCreaCotizaciones.bloquear_upload = true;


                }
                //Si hay Pedido/Cotizacion Seleccionado recibe el objeto Pedido/Cotización Correspondiente
                //debe haber numero_cotizacion o numero_pedido. Según sea, carga iterfaz para manipular Cotización o Pedido. Validar según sea el caso.
                else{
                    console.log(">>>> CASO CAMBIO VISTA");
                    that.completarEncabezadoAndGenerarDetalle();
                          
                }
            };
            
            /*NUEVO 26-05-2015*/
            
            that.completarEncabezadoAndGenerarDetalle = function() {
                
                $scope.rootCreaCotizaciones.seleccion_vendedor = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getId();

                $scope.rootCreaCotizaciones.observacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion();

                //Hacer aquí consultas para traer nombres de pais, departamento y ciudad. Luego armar Ubicación con setUbicación

                var tipo_pais_id = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getTipoPaisId();
                var tipo_dpto_id = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getTipoDepartamentoId();
                var tipo_mpio_id = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getTipoMunicipioId();

                var nombre_pais = '';
                var nombre_departamento = '';
                var nombre_municipio = '';

                that.nombrePais(tipo_pais_id, function(result_nombre_pais){

                    nombre_pais = result_nombre_pais;

                    that.nombreDepartamento(tipo_pais_id, tipo_dpto_id, function(result_nombre_departamento){

                        nombre_departamento = result_nombre_departamento;

                        that.nombreMunicipio(tipo_pais_id, tipo_dpto_id, tipo_mpio_id, function(result_nombre_municipio){

                            nombre_municipio = result_nombre_municipio;

                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().setPais(nombre_pais);
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().setDepartamento(nombre_departamento);
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().setMunicipio(nombre_municipio);

                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().setUbicacion();
                            
                            var editable = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getEditable();
                            localStorageService.set("editable", editable);

                            if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined)
                            {
                                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setEncabezadoBloqueado(true);
                                $scope.rootCreaCotizaciones.bloquear_incluir_producto = false;
                                //Por seguridad pero no influye mucho
                                $scope.rootCreaCotizaciones.bloquear_upload = true;

                                localStorageService.set("cotizacionseleccionada", $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion());
                                localStorageService.set("pedidoseleccionado", "");

                                that.consultarDetalleCotizacion(function(data){

                                    var detalle = data.obj.resultado_consulta;
                                    that.renderDetalleCotizacion(detalle);

                                });
                            }                       
                            else if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined){

                                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setEncabezadoBloqueado(true);
                                $scope.rootCreaCotizaciones.bloquear_incluir_producto = false;
                                //Por seguridad pero no influye mucho
                                $scope.rootCreaCotizaciones.bloquear_upload = true;

                                $scope.rootCreaCotizaciones.es_cotizacion = false;

                                localStorageService.set("pedidoseleccionado", $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido());
                                localStorageService.set("cotizacionseleccionada", "");

                                that.consultarDetallePedido(function(data){

                                    var detalle = data.obj.resultado_consulta;
                                    that.renderDetalleCotizacion(detalle);

                                });
                            }
                        });
                    });
                });   
            };
            
            that.consultarEncabezadoCotizacion = function(numero_cotizacion, callback) {

                var obj = {
                    session: $scope.rootCreaCotizaciones.session,
                    data: {
                        cotizacion_cliente: {
                            numero_cotizacion: numero_cotizacion
                        }
                    }
                };

                var url = API.PEDIDOS.CONSULTAR_ENCABEZADO_COTIZACION_CLIENTE;

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
            
            that.consultarEncabezadoPedido = function(numero_pedido, callback) {

                var obj = {
                    session: $scope.rootCreaCotizaciones.session,
                    data: {
                        pedido_cliente: {
                            numero_pedido: numero_pedido
                        }
                    }
                };

                var url = API.PEDIDOS.CONSULTAR_ENCABEZADO_PEDIDO_CLIENTE;

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

            that.crearCotizacion = function(data) {
                
                console.log(">>>> Data: ", data);
                
                var obj = data.obj.resultado_consulta[0];

                var cotizacion = PedidoVenta.get();
                var observacion = obj.observaciones.split("||obs_cartera||");
                
                //console.log(">>>> Longitud OBSERVACIONES: ", observacion.length);

                var datos_cotizacion = {
                    numero_pedido: '',
                    fecha_registro: obj.fecha_registro,
                    estado: obj.estado
                };

                cotizacion.setDatos(datos_cotizacion);
                
                cotizacion.setTipo(PedidoVenta.TIPO_CLIENTE);

                cotizacion.setNumeroCotizacion(obj.numero_cotizacion);
                
                cotizacion.setValorCotizacion(obj.valor_cotizacion);

                cotizacion.setObservacion(observacion[0]);
                
                if(observacion.length > 1) {
                    cotizacion.setObservacionCartera(observacion[1]);
                }
                else {
                    cotizacion.setObservacionCartera("");
                }

                var vendedor = VendedorPedido.get(
                        obj.nombre_vendedor,    //nombre_tercero
                        obj.tipo_id_vendedor,   //tipo_id_tercero
                        obj.vendedor_id,        //id
                        '',                     //direccion
                        obj.telefono_vendedor   //telefono
                    );
                
                cotizacion.setVendedor(vendedor);

                var cliente = ClientePedido.get(
                        obj.nombre_cliente,    //nombre_tercero
                        obj.direccion_cliente, //direccion
                        obj.tipo_id_cliente,   //tipo_id_tercero
                        obj.cliente_id,        //id
                        obj.telefono_cliente   //telefono
                        );
                            
                cliente.setPais(obj.pais);//pais
                cliente.setDepartamento(obj.departamento);//departamento
                cliente.setMunicipio(obj.municipio);//municipio
                cliente.setUbicacion(); //ubicacion

                cliente.setTipoPaisId(obj.tipo_pais_cliente);//pais
                cliente.setTipoDepartamentoId(obj.tipo_departamento_cliente);//departamento
                cliente.setTipoMunicipioId(obj.tipo_municipio_cliente);//municipio
                cliente.setEmail(obj.email); //email

                cotizacion.setCliente(cliente);

                return cotizacion;
            };
            
            that.crearPedido = function(data) {
                
                var obj = data.obj.resultado_consulta[0];

                var pedido = PedidoVenta.get();
                var observacion = obj.observacion.split("||obs_cartera||");

                var datos_pedido = {
                    numero_pedido: obj.numero_pedido,
                    fecha_registro: obj.fecha_registro,
                    estado: obj.estado,
                    estado_actual_pedido: obj.estado_pedido,
                    estado_separacion: obj.estado_separacion
                };

                pedido.setDatos(datos_pedido);
                
                pedido.setTipo(PedidoVenta.TIPO_CLIENTE);

                pedido.setNumeroCotizacion('');
                
                pedido.setValorPedido(obj.valor_pedido);

                pedido.setObservacion(obj.observacion[0]);
                
                //pedido.tiene_obs_cartera - propiedad solo existente en ésta instancia
                pedido.tiene_obs_cartera = false;
                
                if(observacion.length > 1) {
                    pedido.setObservacionCartera(observacion[1]);
                    pedido.tiene_obs_cartera = true;
                }
                else {
                    pedido.setObservacionCartera("");
                }
                
                var vendedor = VendedorPedido.get(
                        obj.nombre_vendedor,    //nombre_tercero
                        obj.tipo_id_vendedor,   //tipo_id_tercero
                        obj.vendedor_id,        //id
                        '',                     //direccion
                        obj.telefono_vendedor   //telefono
                    );
                
                pedido.setVendedor(vendedor);

                var cliente = ClientePedido.get(
                        obj.nombre_cliente,    //nombre_tercero
                        obj.direccion_cliente, //direccion
                        obj.tipo_id_cliente,   //tipo_id_tercero
                        obj.cliente_id,        //id
                        obj.telefono_cliente   //telefono
                        );
                           
                cliente.setTipoPaisId(obj.tipo_pais_cliente);//pais
                cliente.setTipoDepartamentoId(obj.tipo_departamento_cliente);//departamento
                cliente.setTipoMunicipioId(obj.tipo_municipio_cliente);//municipio

                pedido.setCliente(cliente);

                return pedido;
            };  
            
            /*NUEVO 26-05-2015*/
            
            that.nombrePais = function(tipo_pais_id, callback){
                
                var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            paises: {
                                pais_id: tipo_pais_id
                            }
                        }
                    };
                
                var url = API.PAISES.BUSCAR_PAIS;
                    
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Consulta exitosa: ", data.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            
                            var nombre_pais = data.obj.paises[0].nombre_pais;
                            callback(nombre_pais);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                        
                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback('');
                        }
                    }
                });
            };
            
            that.nombreDepartamento = function(tipo_pais_id, tipo_dpto_id, callback){
                
                var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            departamentos: {
                                pais_id: tipo_pais_id,
                                departamento_id: tipo_dpto_id
                            }
                        }
                    };
                
                var url = API.DEPARTAMENTOS.BUSCAR_DEPARTAMENTO;
                    
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Consulta exitosa: ", data.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            var nombre_departamento = data.obj.departamentos[0].nombre_departamento;
                            callback(nombre_departamento);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                        
                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback('');
                        }
                    }
                });
            };
            
            that.nombreMunicipio = function(tipo_pais_id, tipo_dpto_id, tipo_mpio_id, callback){
                
                var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            ciudades: {
                                pais_id: tipo_pais_id,
                                departamento_id: tipo_dpto_id,
                                ciudad_id: tipo_mpio_id
                            }
                        }
                    };
                
                var url = API.CIUDADES.BUSCAR_CIUDAD;
                    
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Consulta exitosa: ", data.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            
                            var nombre_ciudad = data.obj.ciudades[0].nombre_ciudad;
                            callback(nombre_ciudad);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                        
                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback('');
                        }
                    }
                });
            };            
            
            that.consultarDetalleCotizacion = function(callback){
                
                var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            detalle_cotizacion: {
                                numero_cotizacion: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion()                            
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
                                numero_pedido: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido()                     
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
                    
                    console.log("ParseFloat Sin Iva: ", parseFloat(obj.getTotalSinIva()));
                    console.log("ParseFloat Con Iva: ", parseFloat(obj.getTotalConIva()));
                    
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva += parseFloat(obj.getTotalSinIva());
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva += parseFloat(obj.getTotalConIva());
                    
                    console.log(">>> Valor Parcial Total Sin Iva: ", $scope.rootCreaCotizaciones.valor_total_sin_iva);
                    console.log(">>> Valor Parcial Total Con Iva: ", $scope.rootCreaCotizaciones.valor_total_con_iva);
                    
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().agregarProducto(obj);
                    
                });
            };
            
            that.crearObjetoDetalle = function(producto){
                
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
                        producto.tipo_producto,//tipo_producto_id,
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
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                //showFilter: true,
                multiSelect: false,
                footerTemplate: '   <div class="row col-md-12">\
                                        <div class="col-md-3 pull-right">\
                                            <br>\
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
                    {field: 'codigo_producto', displayName: 'Cód. Producto',  width: "9%",
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                                <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción'},
                    {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada', width: "10%",
                        cellTemplate: ' <div class="col-xs-12">\n\
                                                    <input type="text" ng-model="row.entity.cantidad_solicitada" validacion-numero-entero class="form-control grid-inline-input"'+
                                                    'ng-keyup="onTeclaModificarCantidad($event, row)" ng-disabled="!rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getEditable()" />\n\
                                                </div>'
                    },
                    {field: 'iva', displayName: 'Iva %',  width: "8%"},
                    {field: 'precio', displayName: 'Precio Unitario', cellFilter: "currency:'$ '",  width: "10%"},
                    {field: 'total_sin_iva', displayName: 'Total Sin Iva', cellFilter: "currency:'$ '",  width: "10%"},
                    {field: 'total_con_iva', displayName: 'Total Con Iva', cellFilter: "currency:'$ '",  width: "10%"},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "13%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onModificarCantidad(row)"\n\
                                                    ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null\n\
                                                        || !rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getEditable() || !expreg.test(row.entity.cantidad_solicitada)">\n\
                                                <span class="glyphicon glyphicon-pencil">Modificar</span>\n\
                                            </button>\n\
                                            <button ng-if="rootCreaCotizaciones.bloquear_eliminar == false" class="btn btn-default btn-xs" ng-click="onEliminarProducto(row)"\n\
                                                    ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null\n\
                                                        || !rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getEditable() || !expreg.test(row.entity.cantidad_solicitada)">\n\
                                                <span class="glyphicon glyphicon-remove">Eliminar</span>\n\
                                            </button>\n\
                                            <button ng-if="rootCreaCotizaciones.bloquear_eliminar == true" class="btn btn-default btn-xs" ng-click=""\n\
                                                    ng-disabled="true">\n\
                                                <span class="glyphicon glyphicon-remove">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    } 
                ]

            };
            
            $scope.onTeclaModificarCantidad = function(ev, row) {

                if (ev.which === 13) {
                    
                    $scope.onModificarCantidad(row);
                    
                }
            };
            
            $scope.onModificarCantidad = function(row){
                
                var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>Seguro desea modificar el producto '+row.entity.codigo_producto+' - '+row.entity.descripcion+' ? </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">No</button>\
                                        <button class="btn btn-primary" ng-click="aceptaModificar()" ng-disabled="" >Si</button>\
                                    </div>';

                controller = function($scope, $modalInstance) {

                    $scope.aceptaModificar = function() {

                        //Se acepta modificar y se procede
                        that.modificarCantidad(row);

                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                };

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };

                var modalInstance = $modal.open($scope.opts);

            };
            
            that.modificarCantidad = function(row){
                
                if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined)
                {
                    
                    var numero_cotizacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                
                    //Consultar primero estado de la cotización
                    that.consultarEstadoCotizacion(numero_cotizacion, function(estado_cotizacion){
                    
                        if (estado_cotizacion === '1' || estado_cotizacion === '2') {
                            that.modificarCotizacion(row);
                        }
                        else{
                            /**/
                            $scope.opts = {
                                backdrop: true,
                                backdropClick: true,
                                dialogFade: false,
                                keyboard: true,
                                template: ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Aviso: </h4>\
                                            </div>\
                                            <div class="modal-body row">\
                                                <div class="col-md-12">\
                                                    <h4 >La Cotización ' + numero_cotizacion + ' se ha convertido en Pedido. No puede Modificarse!</h4>\
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
                            /**/
                        }
                    });
                    
                }
                else if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined)
                {
                    //that.modificarPedido(row);
/**/
                    var numero_pedido = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido();
                        
                    that.consultarEstadoPedido(numero_pedido, function(estado_pedido, estado_separacion){

                        if ((estado_pedido === '0' /*|| estado_pedido === '1'*/) && !estado_separacion) {
                            //Ejecuta la modificación
                            that.modificarPedido(row);
                        } //Fin IF estado_pedido
                        else {
                            //Muestra Alerta explicando porqué no puede modificar
                            $scope.opts = {
                                backdrop: true,
                                backdropClick: true,
                                dialogFade: false,
                                keyboard: true,
                                template: ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Aviso: </h4>\
                                            </div>\
                                            <div class="modal-body row">\
                                                <div class="col-md-12">\
                                                    <h4 >El Pedido ' + numero_pedido + ' ya fue asignado para ser procesado.<br>No puede modificarse!</h4>\
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
                        }

                    }); //Fin consultarEstadoPedido    
/**/
                }
            };
            
            that.modificarCotizacion = function(row){
                
                var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            obj_pedido: {
                                numero_cotizacion: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion(),
                                codigo_producto: row.entity.codigo_producto,
                                cantidad: row.entity.cantidad_solicitada
                            }
                        }
                    };

                var url = API.PEDIDOS.MODIFICAR_CANTIDADES_COTIZACION;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Modificación Exitosa: ",data.msj);

                        //Consultar Detalle de la Cotización para recargar Grid
                        that.consultarDetalleCotizacion(function(data){

                            var detalle = data.obj.resultado_consulta;
                            that.renderDetalleCotizacion(detalle);

                        });
                        
                    }
                    else{
                        console.log("Error al intentar Modificar: ", data.msj);
                    }

                });
            };
            
            that.modificarPedido = function(row){
                
                var obj = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            obj_pedido: {
                                numero_pedido: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido(),
                                codigo_producto: row.entity.codigo_producto,
                                cantidad: row.entity.cantidad_solicitada
                            }
                        }
                    };
                    
                console.log("Objeto Modificar Pedido: ", obj);

                var url = API.PEDIDOS.MODIFICAR_CANTIDADES_PEDIDO;
                
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Modificación Exitosa: ",data.msj);
                        
                        //Consultar Detalle del Pedido para recargar Grid
                        that.consultarDetallePedido(function(data){
                            
                            var detalle = data.obj.resultado_consulta;
                            that.renderDetalleCotizacion(detalle);
                            
                        });                       

                    }
                    else{
                        console.log("Error al intentar Modificar: ", data.msj);
                    }

                });
                
            };
 

            $scope.onEliminarProducto = function(row){
                
                var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>Seguro desea eliminar el producto '+row.entity.codigo_producto+' - '+row.entity.descripcion+' ? </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">No</button>\
                                        <button class="btn btn-primary" ng-click="aceptaEliminar()" ng-disabled="" >Si</button>\
                                    </div>';

                controller = function($scope, $modalInstance) {

                    $scope.aceptaEliminar = function() {
                        
                        //Se acepta eliminar y se procede
                        that.eliminarProducto(row);

                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                };

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };

                var modalInstance = $modal.open($scope.opts);
                
            };
            
            /* Eliminar producto seleccionado - Inicio */
            that.eliminarProducto = function(row) {

                if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos().length === 1)
                {

                    $scope.rootCreaCotizaciones.bloquear_eliminar = true;
                    //Mensaje: Solo queda un producto. La cotización debe tener al menos un producto. No puede eliminar éste.
                    var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4>Solo queda un producto en el detalle y debe haber al menos uno. <br>No puede eliminar más productos. </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                    </div>';

                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: template,
                        scope: $scope,
                        controller: controller
                    };

                    var modalInstance = $modal.open($scope.opts);                            
                }
                else {

                    if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined)
                    {
                         var numero_cotizacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                
                        //Consultar primero estado de la cotización
                        that.consultarEstadoCotizacion(numero_cotizacion, function(estado_cotizacion){
                            
                            if (estado_cotizacion === '1' || estado_cotizacion === '2') {
                                that.eliminarDetalleCotizacion(row);
                            }
                            else{
                                /**/
                                $scope.opts = {
                                    backdrop: true,
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    template: ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Aviso: </h4>\
                                                </div>\
                                                <div class="modal-body row">\
                                                    <div class="col-md-12">\
                                                        <h4 >La Cotización ' + numero_cotizacion + ' se ha convertido en Pedido. No puede Modificarse!</h4>\
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
                                /**/
                            }

                        });
                    }
                    else if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== ''
                        && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined)
                    {
                        
                        var numero_pedido = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido();
                        
                        that.consultarEstadoPedido(numero_pedido, function(estado_pedido, estado_separacion){

                            if ((estado_pedido === '0'/* || estado_pedido === '1'*/) && !estado_separacion) {
                                //Ejecuta la eliminación
                                that.eliminarDetallePedido(row);
                            } //Fin IF estado_pedido
                            else {
                                //Muestra Alerta explicando porqué no puede eliminar
                                $scope.opts = {
                                    backdrop: true,
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    template: ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Aviso: </h4>\
                                                </div>\
                                                <div class="modal-body row">\
                                                    <div class="col-md-12">\
                                                        <h4 >El Pedido ' + numero_pedido + ' ya fue asignado para ser procesado.<br>No puede modificarse!</h4>\
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
                            }

                        }); //Fin consultarEstadoPedido    
                    }
                }                        
            };            
            /* Eliminar producto seleccionado - Fin */
            
            //Eliminar Detalle Cotización
            that.eliminarDetalleCotizacion = function(row){
                
                var obj_detalle = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            eliminar_detalle_cotizacion: {
                                numero_cotizacion: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion(),
                                codigo_producto: row.entity.codigo_producto
                            }
                        }
                    };
                    /* Fin - Objeto para Eliminar Registro del Detalle */

                    /* Inicio - Borrado de registro en Detalle Pedido */

                var url_eliminar_detalle_cotizacion = API.PEDIDOS.ELIMINAR_REGISTRO_DETALLE_COTIZACION;

                Request.realizarRequest(url_eliminar_detalle_cotizacion, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        console.log("Eliminación de detalle Exitosa: ", data.msj);
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva -= parseFloat(row.entity.total_sin_iva);
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva -= parseFloat(row.entity.total_con_iva);                        
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().eliminarProducto(row.rowIndex);
                    }
                    else
                    {
                        console.log("Eliminación Detalle Fallida: ", data.msj);
                    }
                });
                    
            };
            
            //Eliminar Detalle Pedido
            that.eliminarDetallePedido = function(row){
                
                var obj_detalle = {
                        session: $scope.rootCreaCotizaciones.session,
                        data: {
                            eliminar_detalle_pedido: {
                                numero_pedido: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido(),
                                codigo_producto: row.entity.codigo_producto
                            }
                        }
                    };
                    /* Fin - Objeto para Eliminar Registro del Detalle */

                    /* Inicio - Borrado de registro en Detalle Pedido */

                var url_eliminar_detalle_pedido = API.PEDIDOS.ELIMINAR_REGISTRO_DETALLE_PEDIDO;

                Request.realizarRequest(url_eliminar_detalle_pedido, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        console.log("Eliminación de detalle Exitosa: ", data.msj);
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_sin_iva -= parseFloat(row.entity.total_sin_iva);
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().valor_total_con_iva -= parseFloat(row.entity.total_con_iva);                        
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().eliminarProducto(row.rowIndex);
                    }
                    else
                    {
                        console.log("Eliminación Detalle Fallida: ", data.msj);
                    }
                });
                    
            };
            
            that.consultarEstadoPedido = function(numero_pedido, callback){
                
                var obj = {
                    session: $scope.rootCreaCotizaciones.session,
                    data: {
                        estado_pedido: {
                            numero_pedido: numero_pedido
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTA_ESTADO_PEDIDO;

                Request.realizarRequest(url, "POST", obj, function(data_estado) {

                    if (data_estado.status === 200) {
                        console.log("Consulta exitosa: ", data_estado.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {

                            var estado_pedido = data_estado.obj.resultado_consulta[0].estado_pedido;
                            var estado_separacion = data_estado.obj.resultado_consulta[0].estado_separacion;
                            
                            callback(estado_pedido, estado_separacion);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data_estado.msj);
                    }
                });
                
            };            
/**/            
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
                
                $scope.$emit('mostrarseleccionproducto_cliente', tipo_cliente, cliente);

            };

            $scope.valorSeleccionado = function() {

                var vendedor_seleccionado = $scope.rootCreaCotizaciones.seleccion_vendedor;
                
                var cantidad_productos = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos().length;
                
                /* Bloqueos Incluir Producto y Subir Archivo Plano */
                if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente() !== undefined)
                {
                    if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getId() !== '' && $scope.rootCreaCotizaciones.seleccion_vendedor !== 0)
                    {
                        $scope.rootCreaCotizaciones.bloquear_incluir_producto = false;
                    }

                    if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id !== '' && $scope.rootCreaCotizaciones.seleccion_vendedor !== 0
                        && cantidad_productos === 0)
                    {

                        $scope.rootCreaCotizaciones.bloquear_upload = false;
                    }
                    else {

                        $scope.rootCreaCotizaciones.bloquear_upload = true;
                    }
                }
                
                $scope.rootCreaCotizaciones.Empresa.getVendedores().forEach(function(vendedor){

                    if(vendedor.id === vendedor_seleccionado){
                        
                        var obj_vendedor = {
                            nombre: vendedor.nombre_tercero,
                            tipo_id_vendedor: vendedor.tipo_id_tercero,
                            vendedor_id: vendedor.id,
                            telefono: vendedor.telefono
                        };
                        
                        var vendedor = that.crearVendedor(obj_vendedor);
                        
                        $scope.rootCreaCotizaciones.nombre_seleccion_vendedor = vendedor.nombre_tercero;

                        $scope.rootCreaCotizaciones.Empresa.setVendedorSeleccionado(vendedor);
                        $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setVendedor(vendedor);

                    }
                });

            };

            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.rootCreaCotizaciones = {};
                
                localStorageService.set("cotizacionseleccionada", "");
                localStorageService.set("pedidoseleccionado", "");
                localStorageService.set("editable","");

            });
            
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
                            var fecha_registro = data.obj.resultado_consulta[0].fecha_registro;
                            
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setNumeroCotizacion(pedido_cliente_id_tmp);
                            $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().fecha_registro = fecha_registro;

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
                var empresa = Usuario.getUsuarioActual().getEmpresa();
               
                              
                var observacion = $scope.rootCreaCotizaciones.observacion;

                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setObservacion(observacion);

                $scope.rootCreaCotizaciones.opciones_archivo.opts.query.data = JSON.stringify({

                    pedido_cliente: {
                        //DATOS PARA CONSULTA LISTADO PRODUCTOS
                        empresa_id: $scope.rootCreaCotizaciones.Empresa.getCodigo(),
                        centro_utilidad_id: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                        bodega_id: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                        tipo_producto: '0',
                        contrato_cliente_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getContratoId(),
                        pedido_cliente_id_tmp: '0',

                        //DATOS PARA INSERCIÓN DE ENCABEZADO
                        tipo_id_tercero: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().tipo_id_tercero,
                        tercero_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id,
                        tipo_id_vendedor: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getTipoId(),
                        vendedor_id: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getVendedor().getId(),
                        estado: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().estado,
                        observaciones: $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getObservacion()
                    }

                });

                $scope.rootCreaCotizaciones.opciones_archivo.upload();
            };

            $scope.respuesta_archivo_plano = function(file, message) {

                var data = (message !== undefined) ? JSON.parse(message) : {};

                if (data.status === 200) {
                    
                    var numero_cotizacion = data.obj.pedido_cliente_detalle.numero_cotizacion;
                    
                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setNumeroCotizacion(numero_cotizacion);
                    
                    that.ventana_modal_no_validos(data, function(){
                        $scope.setTabActivo(1, function(){
                        
                            //Trae detalle de productos cargados del archivo
                            that.consultarDetalleCotizacion(function(data){

                                var detalle = data.obj.resultado_consulta;
                                that.renderDetalleCotizacion(detalle);
                                
                                //Bloqueos de Interfaz
                                /* Bloqueos Archivo Plano - Inicio */
                                var cantidad_productos = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().obtenerProductos().length;

                                if (cantidad_productos > 0) {

                                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setEncabezadoBloqueado(true);
                                }
                                else {

                                    $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setEncabezadoBloqueado(false);
                                }

                                if ($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().id !== '' && $scope.rootCreaCotizaciones.seleccion_vendedor !== 0 && cantidad_productos === 0) {

                                    $scope.rootCreaCotizaciones.bloquear_upload = false;
                                }
                                else {
                                    $scope.rootCreaCotizaciones.bloquear_upload = true;
                                }
                                /* Bloqueos Archivo Plano - Fin */                                

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
            
            that.generarPdfCotizacionCliente = function(){
                
                var codigo_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getCodigo();
                var nombre_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getNombre();
                
                var numero_cotizacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                
                var id_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getId();
                var nombre_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getNombre();
                var ciudad_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getMunicipio();
                var direccion_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getDireccion();
                var email_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getEmail();

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
                            email_cliente: email_cliente,

                            fecha_registro: fecha_registro,
                            observacion: observacion,
                    
                            valor_total_sin_iva: valor_total_sin_iva,
                            valor_total_con_iva: valor_total_con_iva,
                            
                            email: false
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
            
            that.generarPdfPedidoCliente = function(){
                
                var codigo_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getCodigo();
                var nombre_empresa_origen = $scope.rootCreaCotizaciones.Empresa.getNombre();
                
                var numero_pedido = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido();
                
                var id_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getId();
                var nombre_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getNombre();
                var ciudad_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getMunicipio();
                var direccion_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getDireccion();
                var email_cliente = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getCliente().getEmail();
                console.log(">>>> Email Cliente: ",email_cliente);

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
                            email_cliente: email_cliente,

                            fecha_registro: fecha_registro,
                            observacion: observacion,
                    
                            valor_total_sin_iva: valor_total_sin_iva,
                            valor_total_con_iva: valor_total_con_iva,
                            
                            email: false
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
            
            //Consulta Estado de la Cotización
            that.consultarEstadoCotizacion = function(numero_cotizacion, callback){
                
                //Objeto para consulta de encabezado pedido
                var obj = {
                    session: $scope.rootCreaCotizaciones.session,
                    data: {
                        estado_cotizacion: {
                            numero_cotizacion: numero_cotizacion
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTA_ESTADO_COTIZACION;

                Request.realizarRequest(url, "POST", obj, function(data_estado) {

                    if (data_estado.status === 200) {
                        console.log("Consulta exitosa: ", data_estado.msj);

                        if (callback !== undefined && callback !== "" && callback !== 0) {

                            var estado = data_estado.obj.resultado_consulta[0].estado;
                            
                            callback(estado);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data_estado.msj);
                    }
                });
                
            };
            
            //Genera el pedido del cliente si la cotización está en estado "Activa"
            $scope.generarPedidoCliente = function (){
                
                
                var numero_cotizacion = $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                
                //Consultar primero estado de lacotización
                that.consultarEstadoCotizacion(numero_cotizacion, function(estado_cotizacion){
                    
                    if (estado_cotizacion === '2') {

                        var obj_encabezado = {
                            session: $scope.rootCreaCotizaciones.session,
                            data: {
                                pedido_cliente: {
                                    numero_cotizacion: numero_cotizacion
                                }
                            }
                        };
                        /* Fin - Objeto para inserción de Encabezado*/

                        /* Inicio - Validar Existencia de encabezado */

                        var url_encabezado = API.PEDIDOS.INSERTAR_PEDIDO_CLIENTE;

                        Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                            if (data.status === 200) {

                                console.log("Inserción de Pedido Cliente exitosa", data.msj);

                                console.log(">>> DATA TRAS GENERAR PEDIDO: ", data);

                                var numero_pedido = data.obj.numero_pedido;
                                var fecha_registro = data.obj.fecha_registro;

                                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().numero_pedido = numero_pedido;
                                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().fecha_registro = fecha_registro;
                                $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().setNumeroCotizacion('');
                                $scope.rootCreaCotizaciones.es_cotizacion = false;

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
                    }
                    else if (estado_cotizacion === '1'){
                        
                        //Avisa que no puede generar pedido porque la cotización no ha sido aprobada por cartera
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Aviso: </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >La Cotización ' + numero_cotizacion + ' no está aprobada por Cartera.<br>No puede generar el Pedido.</h4>\
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
                        
                    }
                    else {
                        //Avisar la no posibilidad de modiificar porque se ha convertido en Pedido
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Aviso: </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >La Cotización ' + numero_cotizacion + ' se ha convertido en Pedido. No puede generar otro Pedido!</h4>\
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
                    }
                }); //Fin that.consultarEstadoCotizacion
            };
            

            // Opciones de la ventana Modal
            $scope.opcionesPDF = function() {
                
                var template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Qué desea hacer ?</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <button class="btn btn-success" ng-click="aceptaPDF()">Guardar PDF</button>\
                                        <button class="btn btn-primary" ng-click="aceptaEmail()">Enviar PDF via Email</button>\
                                    </div>';

                controller = function($scope, $modalInstance) {

                    $scope.aceptaPDF = function() {
                        that.guardarPDF();
                        $modalInstance.close();
                    };
                    
                    $scope.aceptaEmail = function() {
                        that.mailPDF();
                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                };

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller,
                    windowClass: 'app-modal-window-pdf'
                };

                var modalInstance = $modal.open($scope.opts);                
                
            };
            
            that.guardarPDF = function() {
                
                if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined) {
                    
                    that.generarPdfCotizacionCliente();
                    
                }
                else if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined) {
                    
                    that.generarPdfPedidoCliente();
                    
                }
                
            };
            
            that.mailPDF = function() {
                
                var tipo_documento = '';
                
                if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().getNumeroCotizacion() !== undefined) {
                    
                    tipo_documento = 'c';
                    
                }
                else if($scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== '' && $scope.rootCreaCotizaciones.Empresa.getPedidoSeleccionado().get_numero_pedido() !== undefined) {
                    
                    tipo_documento = 'p';
                    
                }
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generarpedidos/mailpdf.html',
                    controller: "MailPdfController",
                    resolve :{
                        Empresa : function(){
                           return $scope.rootCreaCotizaciones.Empresa;
                        },
                        tipo_documento: function(){
                           return tipo_documento;
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
                
            };
            
            that.cargarListadoVendedores();
            
            $scope.buscarCotizaciones("");

        }]);
});
