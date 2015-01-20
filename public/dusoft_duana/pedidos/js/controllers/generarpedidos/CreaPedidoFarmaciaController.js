//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CreaPedidoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'FarmaciaVenta', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', 'ProductoPedido',
        function($scope, $rootScope, Request, EmpresaPedido, FarmaciaVenta, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService, $modal, ProductoPedido) {

            $scope.expreg = new RegExp("^[0-9]*$");

            var that = this;
            
            that.pedido = PedidoVenta.get();

            $scope.rootCreaPedidoFarmacia = {};
            
            $scope.rootCreaPedidoFarmacia.Empresa = EmpresaPedido;

            $scope.rootCreaPedidoFarmacia.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.rootCreaPedidoFarmacia.paginas = 0;
            $scope.rootCreaPedidoFarmacia.items = 0;
            $scope.rootCreaPedidoFarmacia.termino_busqueda = "";
            $scope.rootCreaPedidoFarmacia.ultima_busqueda = "";
            $scope.rootCreaPedidoFarmacia.paginaactual = 1;

            $scope.rootCreaPedidoFarmacia.bloquear_tab = true; 
            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;

            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;

            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = true;
            //$scope.rootCreaPedidoFarmacia.bloqueo_modificar_pedido = false;

            $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = false;

            $scope.rootCreaPedidoFarmacia.tab_estados = {tab1: true, tab2: false};

            //$scope.rootCreaPedidoFarmacia.listado_productos = [];

            $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = 0;
            $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = 0;
            $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = 0;
            $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = "0,";
            
            $scope.rootCreaPedidoFarmacia.para_seleccion_empresa_anterior = '0';
            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad_anterior = '0';

            $scope.rootCreaPedidoFarmacia.de_lista_empresas = [];
            $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad = [];
            $scope.rootCreaPedidoFarmacia.de_lista_bodegas = [];
            $scope.rootCreaPedidoFarmacia.para_lista_empresas = [];
            $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
            $scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];

            $scope.rootCreaPedidoFarmacia.titulo_tab_1= "";
            $scope.rootCreaPedidoFarmacia.titulo_tab_2= "";
            $scope.rootCreaPedidoFarmacia.observacion = "";
            
            $scope.rootCreaPedidoFarmacia.pedido = {numero_pedido: ""};
            

            //Inicio - Creación de Pedido y Empresa Vacia
            if($scope.rootCreaPedidoFarmacia.Empresa.pedidosFarmacias.length === 0){
                var datos_pedido = {
                            numero_pedido: "",
                            fecha_registro: "",
                            descripcion_estado_actual_pedido: "",
                            estado_actual_pedido: "",
                            estado_separacion: ""
                        };

                that.pedido.setDatos(datos_pedido);
                that.pedido.setTipo(2);
                that.pedido.setObservacion("");
                //that.pedido.setEnUso(0);

                var farmacia = FarmaciaVenta.get();

                that.pedido.setFarmacia(farmacia);

                $scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(that.pedido);
            }
            //Fin - Creación de Pedido y Empresa Vacia


            /******************** DROPDOWN DE ***********************/

            that.consultarEmpresasDe = function(callback) {

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_empresas = data.obj.empresas;
                        
                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });

            };

            that.consultarCentrosUtilidadDe = function(empresa_id, callback) {
                
                if(empresa_id !== undefined && empresa_id !== ""){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = empresa_id;
                }

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        centro_utilidad: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CENTROS_UTILIDAD_EMPRESAS_GRUPO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad = data.obj.centros_utilidad;

                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });
            };

            that.consultarBodegaDe = function(empresa_id, centro_utilidad_id, callback) {
                
                if(empresa_id !== undefined && empresa_id !== ""){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = empresa_id;
                }
                
                if(centro_utilidad_id !== undefined && centro_utilidad_id !== ""){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = centro_utilidad_id;
                }

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        bodegas: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.BODEGAS_EMPRESAS_GRUPO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_bodegas = data.obj.bodegas;

                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });
            };

            /******************** DROPDOWN PARA ***********************/

            that.consultarEmpresasPara = function(callback) {

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_FARMACIAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        $scope.rootCreaPedidoFarmacia.para_lista_empresas = data.obj.lista_farmacias;
                        
                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });

            };

            that.consultarCentrosUtilidadPara = function(empresa_id, callback) {
                
                var para_seleccion_empresa = "";
                
                if(empresa_id !== undefined && empresa_id !== ""){
                    para_seleccion_empresa = empresa_id;
                }
                else{
                    para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',')[0];                    
                }
                    

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: para_seleccion_empresa
                        }
                    }
                };
                
                Request.realizarRequest(API.PEDIDOS.CENTROS_UTILIDAD_FARMACIAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                
                        $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = data.obj.lista_centros_utilidad;
                
                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });
            };

            that.consultarBodegaPara = function(empresa_id, centro_utilidad_id, callback) {
                
                var para_seleccion_empresa = "";
                var para_seleccion_centro_utilidad = "";
                
                if(empresa_id != undefined && empresa_id != ""){
                    para_seleccion_empresa = empresa_id;
                }
                else{
                    para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',')[0];
                }
                
                if(centro_utilidad_id != undefined && centro_utilidad_id != ""){
                    para_seleccion_centro_utilidad = centro_utilidad_id;
                }
                else{
                    para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',')[0];
                }

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: para_seleccion_empresa,
                            centro_utilidad_id: para_seleccion_centro_utilidad
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.BODEGAS_FARMACIAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        
                        $scope.rootCreaPedidoFarmacia.para_lista_bodegas = data.obj.lista_bodegas;
                        
                        if(callback !== undefined && callback !== ""){
                            callback();
                        }
                    }

                });
            };

            /*************** EVENTO CARGA GRID **********************/

            $scope.$on('cargarGridPrincipal', function(event, valor) {

                if ($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length > 0) {
                    $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                    $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                }
                else {
                    $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
                    $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                }

                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                        && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0] !== '0'
                        && $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0] !== '0' && $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0] !== '0'
                        && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0) {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                }
                else {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                }

            });

            that.buscarPedido = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.rootCreaPedidoFarmacia.ultima_busqueda !== $scope.rootCreaPedidoFarmacia.termino_busqueda) {
                    $scope.rootCreaPedidoFarmacia.paginaactual = 1;
                }

                if (PedidoVenta.pedidoseleccionado !== "") {
                    
//                    console.log("Singleton Empresa: ", $scope.rootCreaPedidoFarmacia.Empresa);

                    console.log(">>>>>>>>>>>>>>>>> ESTADO ACTUAL DEL PEDIDO: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Detalle Pedido";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;

                    $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = PedidoVenta.pedidoseleccionado;

                    localStorageService.set("pedidoseleccionado", PedidoVenta.pedidoseleccionado);
                    
                    that.cargarInformacionPedido();

                }
                else if (localStorageService.get("pedidoseleccionado")) {
                    
                    
                    console.log(">>>>>>>>>>>>>>>>> ESTADO ACTUAL DEL PEDIDO: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Detalle Pedido";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;
                    
                    if (localStorageService.get("pedidoseleccionado").length > 0) {
                        $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = localStorageService.get("pedidoseleccionado");
                    }
                    
                    that.recargarInformacionPedido();
                }
                else if (PedidoVenta.pedidoseleccionado === "" && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id !==0
                            && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id !== ""){
                        
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Incluir Producto Manual";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "Cargar Archivo Plano";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = false;
                    
                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = $scope.rootCreaPedidoFarmacia.Empresa.getCodigo();
                    $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = '1 ';
                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = '03';
                    
                    var para_farmacia_id = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id;
                    var nombre_farmacia = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_farmacia;
                    var para_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id;
                    var nombre_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_centro_utilidad;
                    var para_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.bodega_id;
                    var nombre_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_bodega;                    
                    
                    
                    console.log(">>>>>>>>>>>>>>>>> ESTADO ACTUAL DEL PEDIDO: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    console.log(">>>>>>>>>> para_farmacia_id",para_farmacia_id);
                    console.log(">>>>>>>>>> para_centro_utilidad",para_centro_utilidad);
                    console.log(">>>>>>>>>> para_bodega",para_bodega);

                    /* Inicio - Llenado de DropDowns*/
                    that.consultarEmpresasDe(function(){

                        var de_empresa_id = $scope.rootCreaPedidoFarmacia.Empresa.getCodigo();

                        that.consultarCentrosUtilidadDe(de_empresa_id, function(){

                            that.consultarBodegaDe(de_empresa_id, '1 ', function(){

                                that.consultarEmpresasPara(function(){

                                    $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = para_farmacia_id+","+nombre_farmacia;

                                    that.consultarCentrosUtilidadPara(para_farmacia_id, function(){

                                        $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = para_centro_utilidad+","+nombre_centro_utilidad;

                                        that.consultarBodegaPara(para_farmacia_id, para_centro_utilidad, function(){

                                            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = para_bodega+","+nombre_bodega;
                                            
                                            that.consultarEncabezadoPedidoTemporal(function(consulta_encabezado_exitosa){

                                                if(consulta_encabezado_exitosa){
                                                    
                                                    var array_farmacia = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",");
                                                    var array_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",");
                                                    var array_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",");
                                                    
                                                    that.consultarDetallePedidoTemporal(array_farmacia, array_centro_utilidad, array_bodega, function(){
                                                    
                                                        /* Inicio - Valores Validadores */
                                                        if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                                                            && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_farmacia_id !== 0
                                                            && para_centro_utilidad !== 0 && para_bodega !== 0
                                                            && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
                                                        {

                                                            $scope.rootCreaPedidoFarmacia.bloquear_tab = false;
                                                            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = false;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;

                                                        }
                                                        else{
                                                            $scope.rootCreaPedidoFarmacia.bloquear_tab = false;
                                                            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = false;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;

                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                                                            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                                                        }

                                                        /* Fin - Valores Validadores */           

                                                    });
                                                }

                                            });
                                            
                                        });
                                    });
                                });

                            });

                        });
                    });

                    /* Fin - Llenado de DropDowns*/

                }
                else {
                    
                    console.log(">>>>>>>>>>>>>>>>> ESTADO ACTUAL DEL PEDIDO: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    $scope.rootCreaPedidoFarmacia.titulo_tab_1 = "Incluir Producto Manual";
                    $scope.rootCreaPedidoFarmacia.titulo_tab_2 = "Cargar Archivo Plano";
                    $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = false;
                    
                    that.consultarEmpresasDe();
                    that.consultarEmpresasPara();
                    
                }

            };
            
            that.cargarInformacionPedido = function(){

                var para_farmacia_id = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id;
                var para_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id;;
                var para_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.bodega_id;
                
                var nombre_farmacia = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_farmacia;
                var nombre_centro_utilidad = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_centro_utilidad;
                var nombre_bodega = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_bodega;
                
                var de_empresa_id = $scope.rootCreaPedidoFarmacia.Empresa.getCodigo();

                $scope.rootCreaPedidoFarmacia.observacion = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().observacion;

                /* Inicio - Llenado de DropDowns*/
                that.consultarEmpresasDe(function(){

                    $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = de_empresa_id;

                    that.consultarCentrosUtilidadDe(de_empresa_id, function(){

                        $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = '1 ';

                        that.consultarBodegaDe(de_empresa_id, '1 ', function(){

                            $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = '03';

                            that.consultarEmpresasPara(function(){

                                $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = para_farmacia_id+","+nombre_farmacia;

                                that.consultarCentrosUtilidadPara(para_farmacia_id, function(){

                                    $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = para_centro_utilidad+","+nombre_centro_utilidad;

                                    that.consultarBodegaPara(para_farmacia_id, para_centro_utilidad, function(){

                                        $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = para_bodega+","+nombre_bodega;

                                    });
                                });
                            });

                        });

                    });
                });

                /* Fin - Llenado de DropDowns*/

                /* Inicio - Validaciones de bloqueo */
                $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;
                $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;

                $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;

                /* Fin - Validaciones de bloqueo */

                /* Inicio - Consulta Detalle Pedido */

                var obj_detalle = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CONSULTAR_DETALLE_PEDIDO_FARMACIA, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {

                        //crear detalle en el objeto
                        data.obj.detalle_pedido.forEach(function(registro){

                            var producto = ProductoPedido.get(
                                                registro.codigo_producto,        //codigo_producto
                                                registro.descripcion,            //descripcion
                                                0,                               //existencia **hasta aquí heredado
                                                0,                               //precio
                                                registro.cantidad_solicitada,    //cantidad_solicitada
                                                0,                               //cantidad_separada
                                                "",                              //observacion
                                                "",                              //disponible
                                                "",                              //molecula
                                                "",                              //existencia_farmacia
                                                registro.tipo_producto_id,          //tipo_producto_id
                                                "",                              //total_existencias_farmacia
                                                "",                              //existencia_disponible
                                                (registro.cantidad_pendiente <= 0) ? '0' : registro.cantidad_pendiente      //cantidad_pendiente --(registro.cantidad_pendiente <= 0) ? 0 : registro.cantidad_pendiente -- registro.cantidad_pendiente
                                            );
                                                
                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                                                
                        });
                    }
                    else{

                    }
                });
                /* Fin - Consulta Detalle Pedido*/                  
            };            
            
            
            that.consultarEncabezadoPedidoFinal = function(numero_pedido, callback){
                
                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                        }
                    }
                };
                
                var url = API.PEDIDOS.CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA;
                
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if(data.status === 200) {
                        
                        console.log("Consulta exitosa: ", data.msj);
                        
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(data);
                        }
                    }
                    else{
                        console.log("Error en la consulta: ", data.msj);
                    }
                });
            };
            
            //Función para recargar todos los datos del pedido si se hace 'reload'
            that.recargarInformacionPedido = function(){
                
//                /* Inicio - Consulta de pedido */
//                var obj = {
//                    session: $scope.rootCreaPedidoFarmacia.session,
//                    data: {
//                        pedidos_farmacias: {
//                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
//                        }
//                    }
//                };
//
//                Request.realizarRequest(API.PEDIDOS.CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA, "POST", obj, function(data) {
//
//                    if (data.status === 200) {

                var numero_pedido = $scope.rootCreaPedidoFarmacia.pedido.numero_pedido;

                that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){

                        //console.log("Consulta exitosa: ", data.msj);

                        //Variables para creación de Farmacia más adelante
                        var para_farmacia_id = data.obj.encabezado_pedido[0].farmacia_id;
                        var para_centro_utilidad = data.obj.encabezado_pedido[0].centro_utilidad;
                        var para_bodega = data.obj.encabezado_pedido[0].bodega;
                        var de_empresa_id = data.obj.encabezado_pedido[0].empresa_destino;
                        
                        //Crea empresa - setCodigo
                        $scope.rootCreaPedidoFarmacia.Empresa.setCodigo(de_empresa_id);
                        
                        
                        var pedido = PedidoVenta.get();
                        
                        var datos_pedido = {
                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                            fecha_registro: data.obj.encabezado_pedido[0].fecha_registro,
                            descripcion_estado_actual_pedido: "",
                            estado_actual_pedido: data.obj.encabezado_pedido[0].estado,
                            estado_separacion: ""
                        };

                        pedido.setDatos(datos_pedido);
                        pedido.setTipo(2);
                        pedido.setObservacion(data.obj.encabezado_pedido[0].observacion);
                        //pedido.setEnUso(data.obj.encabezado_pedido[0].en_uso);

                        $scope.rootCreaPedidoFarmacia.observacion = data.obj.encabezado_pedido[0].observacion;

                        /* Inicio - Llenado de DropDowns*/
                        that.consultarEmpresasDe(function(){

                            $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = de_empresa_id;

                            that.consultarCentrosUtilidadDe(de_empresa_id, function(){

                                $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = '1 ';

                                that.consultarBodegaDe(de_empresa_id, '1 ', function(){

                                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = '03';

                                    that.consultarEmpresasPara(function(){

                                        var nombre_empresa = "";

                                        $scope.rootCreaPedidoFarmacia.para_lista_empresas.forEach(function(empresa){
                                            if(empresa.empresa_id === para_farmacia_id){
                                                nombre_empresa = empresa.nombre_empresa;
                                            }
                                        });

                                        $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = para_farmacia_id+","+nombre_empresa;

                                        that.consultarCentrosUtilidadPara(para_farmacia_id, function(){

                                            var nombre_centro_utilidad = "";

                                            $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad.forEach(function(centro_utilidad){
                                                if(centro_utilidad.centro_utilidad_id === para_centro_utilidad){
                                                    nombre_centro_utilidad = centro_utilidad.nombre_centro_utilidad;
                                                }
                                            });

                                            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = para_centro_utilidad+","+nombre_centro_utilidad;

                                            that.consultarBodegaPara(para_farmacia_id, para_centro_utilidad, function(){

                                                var nombre_bodega = "";

                                                $scope.rootCreaPedidoFarmacia.para_lista_bodegas.forEach(function(bodega){
                                                    if(bodega.bodega_id === para_bodega){
                                                        nombre_bodega = bodega.nombre_bodega;
                                                    }
                                                });

                                                $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = para_bodega+","+nombre_bodega;
                                                
                                                //Creación objeto farmacia
                                                var farmacia = FarmaciaVenta.get(
                                                        para_farmacia_id,
                                                        para_bodega,
                                                        nombre_empresa,
                                                        nombre_bodega,
                                                        para_centro_utilidad,
                                                        nombre_centro_utilidad
                                                );

                                                pedido.setFarmacia(farmacia);
                                                
                                                $scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(pedido);
                                                
                                                /* Inicio - Consulta Detalle Pedido */

                                                var obj_detalle = {
                                                    session: $scope.rootCreaPedidoFarmacia.session,
                                                    data: {
                                                        pedidos_farmacias: {
                                                            numero_pedido: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                                                        }
                                                    }
                                                };

                                                Request.realizarRequest(API.PEDIDOS.CONSULTAR_DETALLE_PEDIDO_FARMACIA, "POST", obj_detalle, function(data) {

                                                    if (data.status === 200) {

                                                        data.obj.detalle_pedido.forEach(function(registro){

                                                            var producto = ProductoPedido.get(
                                                                            registro.codigo_producto,        //codigo_producto
                                                                            registro.descripcion,            //descripcion
                                                                            0,                               //existencia **hasta aquí heredado
                                                                            0,                               //precio
                                                                            registro.cantidad_solicitada,    //cantidad_solicitada
                                                                            0,                               //cantidad_separada
                                                                            "",                              //observacion
                                                                            "",                              //disponible
                                                                            "",                              //molecula
                                                                            "",                              //existencia_farmacia
                                                                            registro.tipo_producto_id,       //tipo_producto_id
                                                                            "",                              //total_existencias_farmacia
                                                                            "",                              //existencia_disponible
                                                                            (registro.cantidad_pendiente <= 0) ? '0' : registro.cantidad_pendiente      //cantidad_pendiente
                                                                        );

                                                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                                                        });
                                                    }
                                                    else{
                                                        console.log("Error en la consulta del detalle: ", data.msj);
                                                    }
                                                });
                                                /* Fin - Consulta Detalle Pedido*/ 

                                            });
                                        });
                                    });

                                });


                            });
                        });

                        /* Fin - Llenado de DropDowns*/

                        /* Inicio - Validaciones de bloqueo */
                        $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;
                        $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                        $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;

                        $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                        $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;

                        
                        /* Fin - Validaciones de bloqueo */

//                    }
//                    else {
//                        console.log("Error en la consulta: ", data.msj);
//                    }

                });

                /* Fin - Consulta de pedido */
                 
            };
            

            //Grid para pedidos ya generados
            $scope.rootCreaPedidoFarmacia.detalle_pedido_generado = {
                data: 'rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: false,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "9%"},
                    {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente'},
                    {field: 'nueva_cantidad', displayName: 'Modificar Cantidad', width: "10%",
                                cellTemplate: ' <div class="col-xs-12">\n\
                                                    <input type="text" ng-model="row.entity.nueva_cantidad" validacion-numero class="form-control grid-inline-input"'+
                                                    'ng-keyup="onTeclaModificarCantidad($event, row)" ng-model="row.entity.cantidad_ingresada" ng-disabled="!rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()" />\n\
                                                </div>'
                    },
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "13%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onModificarCantidad(row)" ng-disabled="row.entity.nueva_cantidad<=0 || row.entity.nueva_cantidad==null || !expreg.test(row.entity.nueva_cantidad) || rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido !=0 || !rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()">\n\
                                                <span class="glyphicon glyphicon-pencil">Modificar</span>\n\
                                            </button>\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarProducto(row)" ng-disabled="rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido !=0 || !rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable()">\n\
                                                <span class="glyphicon glyphicon-remove">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]
            };
            
            $scope.onTeclaModificarCantidad = function(ev, row) {
//                console.log("Key Evento: ", ev.which);
                if (ev.which === 13) {
                    if (parseInt(row.entity.nueva_cantidad) > 0) {
                        $scope.onModificarCantidad(row);
                    }
                }
            };
            
            
            $scope.onModificarCantidad = function(row){
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido;
                
                that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){

                    //$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().setEnUso(data.obj.encabezado_pedido[0].en_uso);
                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
                    //console.log(">>>> Modificar - Estado del Pedido: ", data.obj.encabezado_pedido[0].estado);
                    //console.log(">>>> Scope Modificar - Estado del Pedido: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){
                    
                        if(row.entity.nueva_cantidad >= row.entity.cantidad_solicitada){

                            var template = ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Mensaje del Sistema</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <h4>La Nueva Cantidad debe ser Menor a la Actual ! </h4> \
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
                        else{

                                var template = ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <h4>Seguro desea bajar la cantidad de '+row.entity.cantidad_solicitada+' a '+row.entity.nueva_cantidad+' ? </h4> \
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                                    <button class="btn btn-primary" ng-click="modificarCantidad()" ng-disabled="" >Si</button>\
                                                </div>';

                            controller = function($scope, $modalInstance) {

                                $scope.modificarCantidad = function() {
                                    that.verificarEstadoPedido(function(){

                                        that.modificarValoresCantidad(
                                            $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                                            row.entity
                                        );
                                    }    
                                    );

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
                        }
                    }
                    else{
                        //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
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
                                                <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
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
                });
            };
            
            that.verificarEstadoPedido = function(callback){
                
                /* Inicio: Verificación estado del pedido */
                obj_verificar = {
                    session:$scope.rootCreaPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            termino_busqueda: $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            pagina_actual: $scope.rootCreaPedidoFarmacia.paginaactual,
                            filtro:{}
                        }
                    }
                };
                
                var url = API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj_verificar, function(data) {

                    if(data.status === 200) {

                       if((data.obj.pedidos_farmacias[0].estado_actual_pedido !== '0' && data.obj.pedidos_farmacias[0].estado_actual_pedido !== '1')|| data.obj.pedidos_farmacias[0].estado_separacion !== null){
                           //No se debe hacer Modificación
                           
                            var template = '<div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Mensaje del Sistema</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <h4>El pedido se encuentra en estado de separación y ya no puede modificarse !!</h4> \
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
                       else{
                           // Se puede hacer modificación o eliminación
                           if(callback !== undefined && callback !== ""){
                               callback();
                           }
                       }
                    }
                    else{
                        console.log("No se pudo realizar la consulta", data.msj);
                    }

                });

                /* Fin: Verificación estado del pedido */                                
            };
            
            that.modificarValoresCantidad = function(numero_pedido, data){
                
                var solicitado_inicial = data.cantidad_solicitada;
                var pendiente_inicial = data.cantidad_pendiente;
                
                var diferencia_cantidad = 0;
                var nuevo_pendiente = 0;

                diferencia_cantidad = data.cantidad_solicitada - data.nueva_cantidad;

                data.cantidad_solicitada = data.nueva_cantidad;
                
                data.nueva_cantidad = "";

                nuevo_pendiente = data.cantidad_pendiente - diferencia_cantidad;

                if(nuevo_pendiente >= 0){
                    data.cantidad_pendiente = nuevo_pendiente;
                }
                else{
                    data.cantidad_pendiente = 0;
                }

                /* Inicio - Modificación en BD */
                
                obj_modificar = {
                    session:$scope.rootCreaPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            numero_pedido: parseInt(numero_pedido),
                            codigo_producto: data.codigo_producto,
                            cantidad_solicitada: parseInt(data.cantidad_solicitada),
                            cantidad_pendiente: parseInt(data.cantidad_pendiente)
                        }
                    }
                };
                
                var url = API.PEDIDOS.ACTUALIZAR_CANTIDADES_DETALLE_PEDIDO_FARMACIA;
                
                Request.realizarRequest(url, "POST", obj_modificar, function(data) {

                    if(data.status === 200) {
                        console.log("Actualización Exitosa: ", data.msj);
                    }
                    else {
                        console.log("Actualización Falló: ", data.msj);
                        data.cantidad_solicitada = solicitado_inicial;
                        data.cantidad_pendiente = pendiente_inicial;
                    }
                });

                /* Fin - Modificación en BD */                
            };
            
            $scope.onEliminarProducto = function(row){
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido;
                
                that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){

                    //$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().setEnUso(data.obj.encabezado_pedido[0].en_uso);
                    
                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
                    
                    //console.log(">>>>>> Eliminar - Estado del Pedido: ", data.obj.encabezado_pedido[0].estado);

                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){
                
                        var template = '<div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Mensaje del Sistema</h4>\
                                        </div>\
                                        <div class="modal-body">\
                                            <h4>Seguro desea eliminar el producto '+row.entity.codigo_producto+' ? </h4> \
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-warning" ng-click="close()">No</button>\
                                            <button class="btn btn-primary" ng-click="eliminarProducto()" ng-disabled="" >Si</button>\
                                        </div>';

                        controller = function($scope, $modalInstance) {

                            $scope.eliminarProducto = function() {
                                that.verificarEstadoPedido(function(){

                                    that.eliminarProductoPedido(
                                        $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                                        row.entity,
                                        row.rowIndex
                                    );
                                }    
                                );

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
                    }
                    else{
                        //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
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
                                                <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
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
                });
            };
            
            that.eliminarProductoPedido = function(numero_pedido, data, index){
                
                /* Inicio - Borrado producto en BD */
                obj_eliminar = {
                    session:$scope.rootCreaPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            numero_pedido: parseInt(numero_pedido),
                            codigo_producto: data.codigo_producto
                        }
                    }
                };
                
                var url = API.PEDIDOS.ELIMINAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA;
                
                Request.realizarRequest(url, "POST", obj_eliminar, function(data) {

                    if(data.status === 200) {
                        console.log("Eliminación Exitosa: ", data.msj);

                        $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().eliminarProducto(index);
                    }
                    else {
                        console.log("Eliminación Falló: ", data.msj);
                    }
                });
                
                /* Fin - Borrado producto en BD */
            }            

            //definicion y delegados del Tabla de pedidos clientes
            $scope.rootCreaPedidoFarmacia.lista_productos = {
                data: 'rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "9%",
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                    <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
                                                    <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
                                                    <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
                                                    <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
                                                    <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
                                                    <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                                </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente'}
                ]
            };


            $scope.onIncluirProductos = function(tipo_cliente) {
                $scope.slideurl = "views/generarpedidos/seleccionproductofarmacia.html?time=" + new Date().getTime();

                var datos_de = {
                    empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                    bodega_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega
                };

                var datos_para = {
                    empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                    bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                };

                var observacion = $scope.rootCreaPedidoFarmacia.observacion;
                
                var datos_pedido = {
                        numero_pedido: "",
                        fecha_registro: "",
                        descripcion_estado_actual_pedido: "",
                        estado_actual_pedido: "",
                        estado_separacion: ""
                    };

                that.pedido.setDatos(datos_pedido);
                that.pedido.setTipo(2);
                that.pedido.setObservacion($scope.rootCreaPedidoFarmacia.observacion);
                
                //Creación objeto farmacia
                var farmacia = FarmaciaVenta.get(
                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0]),
                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]),
                        $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[1],
                        $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[1],
                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0]),
                        $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[1]
                );

                that.pedido.setFarmacia(farmacia);

                $scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(that.pedido);

                $scope.$emit('mostrarseleccionproducto', tipo_cliente, datos_de, datos_para, observacion, that.pedido);

                //$scope.$broadcast('cargarGridSeleccionadoSlide'/*, $scope.rootCreaPedidoFarmacia.listado_productos*/);
            };
            
            that.consultarEncabezadoPedidoTemporal = function(callback){
                
                var obj_encabezado = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                        }
                    }
                };
                
                console.log("Objeto Consulta Encabezado: ",obj_encabezado);

                var url_consultar_encabezado = API.PEDIDOS.CONSULTAR_ENCABEZADO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_consultar_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {                
                        
                        console.log("La consulta del encabezado fue exitosa: ", data.msj);
                        console.log("Consulta Encabezado: ", data);
                        
                        /**/
                        var datos_pedido = {
                            numero_pedido: "",
                            fecha_registro: "",
                            descripcion_estado_actual_pedido: "",
                            estado_actual_pedido: "",
                            estado_separacion: ""
                        };

                        that.pedido.setDatos(datos_pedido);
                        that.pedido.setTipo(2);

                        if(data.obj.encabezado_pedido.length > 0){
                            that.pedido.setObservacion(data.obj.encabezado_pedido[0].observacion); //Falta consulta de pedido
                            $scope.rootCreaPedidoFarmacia.observacion = that.pedido.getObservacion();
                        }

                        //Creación objeto farmacia
                        var farmacia = FarmaciaVenta.get(
                                parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0]),
                                parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]),
                                $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[1],
                                $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[1],
                                parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0]),
                                $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[1]
                        );

                        that.pedido.setFarmacia(farmacia);

                        $scope.rootCreaPedidoFarmacia.Empresa.setPedidoSeleccionado(that.pedido);

                        /**/
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(true);
                        }
                    }
                    else{
                        console.log("La consulta del encabezado falló: ", data.msj);
                        
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(false);
                        }
                    }
                });
            };
            
            that.consultarDetallePedidoTemporal = function(para_seleccion_empresa, para_seleccion_centro_utilidad, para_seleccion_bodega, callback){

                /* Ejecutar la acción de Consultar los productos del pedido temporal */
                var obj_detalle = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: para_seleccion_empresa[0],
                            centro_utilidad_id: para_seleccion_centro_utilidad[0],
                            bodega_id: para_seleccion_bodega[0]
                        }
                    }
                };
                /* Fin - Objeto para Inserción Detalle */

                /* Inicio - Validar existencia de producto en Detalle Pedido */
                
                console.log(">>>>Objeto consulta Detalle: ",obj_detalle);

                var url_productos_detalle = API.PEDIDOS.LISTAR_DETALLE_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_productos_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        
                        console.log("Consulta del detalle exitosa! ", data.msj);
                        
                        if (data) {
                            console.log("Datos consulta Detalle: ",data);
                            //console.log("Productos en BD: ", data.obj);
                            //$scope.rootCreaPedidoFarmacia.listado_productos = data.obj.listado_productos;

                            /* Inicio - Objeto */
                            //crear detalle en el objeto

                            $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().vaciarProductos();

                            data.obj.listado_productos.forEach(function(registro){

                                var producto = ProductoPedido.get(
                                                    registro.codigo_producto,        //codigo_producto
                                                    registro.descripcion,            //descripcion
                                                    0,                               //existencia **hasta aquí heredado
                                                    0,                               //precio
                                                    registro.cantidad_solicitada,    //cantidad_solicitada
                                                    0,                               //cantidad_separada
                                                    "",                              //observacion
                                                    "",                              //disponible
                                                    "",                              //molecula
                                                    "",                              //existencia_farmacia
                                                    registro.tipo_producto_id,       //tipo_producto_id
                                                    "",                              //total_existencias_farmacia
                                                    "",                              //existencia_disponible
                                                    (registro.cantidad_pendiente <= 0) ? '0' : registro.cantidad_pendiente      //cantidad_pendiente
                                                );

                                $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
                            });

                            /* Fin - Objeto */

                            //Desabilitar carga de archivo plano si hay producto en la grid cuando hay pedido almacenado en BD
                            if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                                    && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0'
                                    && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
                            {

                                $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                                $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                            }
                            else {

                                $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                                $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                            }
                        }
                        
                        if(callback !== undefined && callback !== "" && callback !== 0)
                        {
                            callback();
                        }
                    }
                    else{
                        console.log("Consulta del detalle fallida ", data.msj);
                        
                        if(callback !== undefined && callback !== "" && callback !== 0)
                        {
                            callback();
                        }
                    }
                });  
                
            };

            $scope.valorSeleccionado = function(valor) {

                var para_seleccion_empresa = ['0'];
                var para_seleccion_centro_utilidad = ['0'];
                var para_seleccion_bodega = ['0'];
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa && valor === 1){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = 0;
                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = 0;
                }
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad && valor === 2){
                    $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = 0;
                }
                
                if ($scope.rootCreaPedidoFarmacia.para_seleccion_empresa && valor === 4)
                {
                    $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = '0,';
                    $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = '0,';
                }

                if ($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad && valor === 5)
                {
                    $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = '0,';
                }
                
                para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',');
                para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',');
                para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(',');
                
                /* Validaciones DropDown DE */

                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0)
                {
                    that.consultarCentrosUtilidadDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                }

                if ($scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0)
                {
                    that.consultarBodegaDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                }

                /* Validaciones DropDown PARA */

                if (para_seleccion_empresa[0] !== '0')
                {
                    that.consultarCentrosUtilidadPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;                    
                }

                if (para_seleccion_centro_utilidad[0] !== '0')
                {
                    that.consultarBodegaPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                }

                /******************************** Validaciones bloqueos ****************************************/

                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                        && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                        && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0')
                {
                    $scope.rootCreaPedidoFarmacia.bloquear_tab = false;
                    $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = false;

                    //Consultar Información de Encabezado de Pedido Temporal
                    
                    that.consultarEncabezadoPedidoTemporal(function(consulta_encabezado_exitosa){
                        
                        if(consulta_encabezado_exitosa){
                            that.consultarDetallePedidoTemporal(para_seleccion_empresa, para_seleccion_centro_utilidad, para_seleccion_bodega);
                        }
                        
                    });
                }

                //Desabilitar carga de archivo plano si hay producto en la grid cuando no hay un pedido temporal almacenado en BD
                if ($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                        && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                        && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0'
                        && $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
                {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                }
                else {

                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                }

            };

            $scope.generarPedidoFarmacia = function() {
                
                var tipo_producto_anterior = '0';
                var generar_pedido = 0;
                
                $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.forEach(function(producto){
                    
                    if(producto.tipo_producto_id !== tipo_producto_anterior && tipo_producto_anterior !== '0'){

                            generar_pedido++;

                    }
                    
                    tipo_producto_anterior = producto.tipo_producto_id;
                    
                });
                
                if(generar_pedido === 0) {

                    /* Inicio - Objeto para inserción de Encabezado*/

                    var obj_encabezado = {
                        session: $scope.rootCreaPedidoFarmacia.session,
                        data: {
                            pedidos_farmacias: {
                                empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0],
                                observacion: $scope.rootCreaPedidoFarmacia.observacion,
                                tipo_pedido: 0, //Pedido Normal. Pedido General tiene un valor de 1
                            }
                        }
                    };
                    /* Fin - Objeto para inserción de Encabezado*/

                    /* Inicio - Validar Existencia de encabezado */

                    var url_encabezado = API.PEDIDOS.INSERTAR_PEDIDO_FARMACIA_DEFINITIVO;

                    Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                        if (data.status === 200) {
                            console.log("Encabezado Ingresado : ", data.msj);

                            var numero_pedido_generado = data.obj.numero_pedido[0].solicitud_prod_a_bod_ppal_id;

                            /* Inicio - Objeto para Inserción Detalle */
                            var obj_detalle = {
                                session: $scope.rootCreaPedidoFarmacia.session,
                                data: {
                                    detalle_pedidos_farmacias: {
                                        numero_pedido: numero_pedido_generado,
                                        empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                        centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                        bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                    }
                                }
                            };
                            /* Fin - Objeto para Inserción Detalle */

                            /* Inicio - Validar existencia de producto en Detalle Pedido */

                            var url_detalle = API.PEDIDOS.INSERTAR_DETALLE_PEDIDO_FARMACIA_DEFINITIVO;

                            Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                                if (data.status === 200) {
                                    console.log("Detalle Ingresado : ", data.msj);
                                    PedidoVenta.pedidoseleccionado = numero_pedido_generado;
                                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido = numero_pedido_generado;
                                    $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = PedidoVenta.pedidoseleccionado;
                                    
//***************--------          //Revisar si ésta línea es realmente útil para habilitar botones de Modificar y eliminar
                                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = 0;
                                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().setEditable(true);
                                    //console.log(">>>>> Valor de Editable Pedido: ", $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getEditable());

                                    /* Inicio - Objeto para Eliminar Detalle Completo */
                                    var obj_detalle = {
                                        session: $scope.rootCreaPedidoFarmacia.session,
                                        data: {
                                            detalle_pedidos_farmacias: {
                                                empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                                centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                                bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                            }
                                        }
                                    };
                                    /* Fin - Objeto para Eliminar Detalle Completo */

                                    /* Inicio - Borrado Detalle Completo Pedido */

                                    var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_DETALLE_PEDIDO_FARMACIA_TEMPORAL_COMPLETO;

                                    Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                                        if (data.status === 200) {
                                            console.log("Eliminación de detalle Exitosa: ", data.msj);

                                            //Se asignan los valores de la Grid de pedidos temporales a la Grid del Pedido Generado
                                            //$scope.rootCreaPedidoFarmacia.listado_productos = []; //La grid puede ser diferente pero el objeto igual.
                                            $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true; //Activa la visibilidad de la grid de pedido definitivo
                                            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true; //Bloquea botón generar pedido
                                            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true; //Bloquear botón incluir producto

                                            //Eliminación de encabezado
                                            var obj_encabezado = {
                                                session: $scope.rootCreaPedidoFarmacia.session,
                                                data: {
                                                    pedidos_farmacias: {
                                                        empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                                        centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                                        bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                                    }
                                                }
                                            };
                                            var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                                            Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                                                if (data.status === 200) {
                                                    console.log("Eliminación de encabezado Exitosa: ", data.msj);
                                                }
                                                else
                                                {
                                                    console.log("Eliminación de encabezado Fallida: ", data.msj);
                                                }
                                            });
                                        }
                                        else
                                        {
                                            console.log("Eliminación Detalle Fallida: ", data.msj);
                                        }
                                    });
                                    /* Fin - Borrado Detalle Completo Pedido*/

                                }
                                else {
                                    console.log("Detalle No Ingresado : ", data.msj);
                                }
                            });

                        }
                        else {
                            console.log("Encabezado No Ingresado : ", data.msj);
                        }
                    });

                }
                else{
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
                                                <h4 >No se puede Generar el Pedido. Tiene productos de diferente tipo!</h4>\
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
            };

            $scope.setTabActivo = function(number, callback) {

                if (number === 1)
                {
                    $scope.rootCreaPedidoFarmacia.tab_estados.tab1 = true;
                    if(callback !== undefined && callback !== "" && callback !== 0){
                        callback();
                    }
                }

                if (number === 2)
                {
                    $scope.rootCreaPedidoFarmacia.tab_estados.tab2 = true;
                    if(callback !== undefined && callback !== "" && callback !== 0){
                        callback();
                    }
                }

            };

            $scope.abrirViewVerPedidosFarmacias = function()
            {
                that.actualizarEncabezadoPedidoTemporal();
                $state.go('VerPedidosFarmacias'); //Crear la URL para éste acceso y relacionarlo con el botón de "Cancelar en la View"
            };
            
/**/
            //Función que actualizar la observación si ya existe un encabezado
            that.actualizarEncabezadoPedidoTemporal = function() {
                
                var obj_encabezado = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0],
                            empresa_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                            centro_utilidad_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                            bodega_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega,
                            observacion: $scope.rootCreaPedidoFarmacia.observacion
                        }
                    }
                };

                /* Inicio - Validar Existencia de encabezado */

                var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {
                        
                        console.log(data.msj);

                        if (data.obj.numero_registros[0].count > 0) {
                            
                            //Actualizar
                            var url_actualizar_encabezado = API.PEDIDOS.ACTUALIZAR_ENCABEZADO_TEMPORAL_PEDIDO_FARMACIA;
                            
                            Request.realizarRequest(url_actualizar_encabezado, "POST", obj_encabezado, function(data_update) {
                                
                                if(data_update.status === 200) {
                                    
                                    console.log(data_update.msj);
                                    
                                }
                                else {
                                    console.log(data_update.msj);
                                }
                            });
                        }
                        else {
                            console.log(">>>>> Encabezado Vacío");
                        }
                    }
                    else {
                        console.log(data.msj);
                    }
                });
                
                /* Fin - Validar Existencia de encabezado */
            };
/**/            
            $scope.abrirViewVerPedidosFarmaciasEliminarTemporal = function(){

                //Eliminación Detalle Temporal
                var obj_detalle = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                        }
                    }
                };
                
                var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_DETALLE_PEDIDO_FARMACIA_TEMPORAL_COMPLETO;

                Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        console.log("Eliminación del detalle Exitosa: ", data.msj);
                        
                        //Eliminación encabezado temporal
                        var obj_encabezado = {
                            session: $scope.rootCreaPedidoFarmacia.session,
                            data: {
                                pedidos_farmacias: {
                                    empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                    bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                }
                            }
                        };

                        var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                        Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                            if (data.status === 200) {
                                console.log("Eliminación de encabezado Exitosa: ", data.msj);
                                $state.go('VerPedidosFarmacias');
                            }
                            else{
                                console.log("Eliminación de encabezado Fallida: ", data.msj);
                            }
                        });
                        
                        
                    }
                    else
                    {
                        console.log("Eliminación del detalle Fallida: ", data.msj);
                    }
                });
            };

            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.rootCreaPedidoFarmacia = {};
                $scope.$$watchers = null;
                localStorageService.remove("pedidoseleccionado");

            });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {

            });

            $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

            });

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            });
            
            /* Código de SelecciónProductoFarmaciaController */
            
            //Función que inserta el encabezado del pedido temporal
            that.insertarEncabezadoPedidoTemporal = function(callback) {
                
                var obj_encabezado = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {                            
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0],
                            empresa_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                            centro_utilidad_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                            bodega_destino_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega,
                            observacion: $scope.rootCreaPedidoFarmacia.observacion
                        }
                    }
                };
                
                //console.log(">>> obj_encabezado: ", obj_encabezado);
                /* Fin - Objeto para inserción de Encabezado*/

                /* Inicio - Validar Existencia de encabezado */

                var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {

                    if (data.status === 200) {
                        //console.log("ENCABEZADO: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
                        if (data.obj.numero_registros[0].count > 0) {

                            console.log("Ya existe éste registro en el encabezado");
                            if(callback !== undefined && callback !== "" && callback !== 0){
                                callback(true);
                            }
                        }
                        else {
                            /* Inicio - Inserción del Encabezado */

                            var url_encabezado = API.PEDIDOS.CREAR_PEDIDO_TEMPORAL;

                            Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                                if (data.status === 200) {
                                    console.log("Registro Insertado Exitosamente en Encabezado");

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
                    }
                    else {
                        console.log(data.msj);
                        if(callback !== undefined && callback !== "" && callback !== 0){
                            callback(false);
                        }
                    }
                });
            };
            /* Código de SelecciónProductoFarmaciaController */

            $scope.rootCreaPedidoFarmacia.opciones_archivo = new Flow();
            $scope.rootCreaPedidoFarmacia.opciones_archivo.target = API.PEDIDOS.ARCHIVO_PLANO_PEDIDO_FARMACIA;
            $scope.rootCreaPedidoFarmacia.opciones_archivo.testChunks = false;
            $scope.rootCreaPedidoFarmacia.opciones_archivo.singleFile = true;
            $scope.rootCreaPedidoFarmacia.opciones_archivo.query = {
                session: JSON.stringify($scope.rootCreaPedidoFarmacia.session)
            };

            $scope.cargar_archivo_plano = function($flow) {

                $scope.rootCreaPedidoFarmacia.opciones_archivo = $flow;
            };

            $scope.subir_archivo_plano = function() {
                    
                    that.insertarEncabezadoPedidoTemporal(function(insert_encabezado_exitoso) {

                        if (insert_encabezado_exitoso) {

                            $scope.rootCreaPedidoFarmacia.opciones_archivo.opts.query.data = JSON.stringify({
                                
                                pedido_farmacia: {
                                    empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                                    bodega_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega,
                                    empresa_para: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                    centro_utilidad_para: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],                                    
                                    bodega_para: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                }

                            });

                            $scope.rootCreaPedidoFarmacia.opciones_archivo.upload();
                        }
                    });
            };

            $scope.respuesta_archivo_plano = function(file, message) {
                
                var para_seleccion_empresa = [];
                var para_seleccion_centro_utilidad = [];
                var para_seleccion_bodega = [];

                var data = (message !== undefined) ? JSON.parse(message) : {};


                if (data.status === 200) {

                    $scope.rootCreaPedidoFarmacia.opciones_archivo.cancel();
                    
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
                    }
                    
                    
                    that.ventana_modal_no_validos(data, function(){
                        $scope.setTabActivo(1, function(){
                        
                            //Trae detalle de productos cargados del archivo
                            that.consultarDetallePedidoTemporal(para_seleccion_empresa, para_seleccion_centro_utilidad, para_seleccion_bodega);
                        });
                    });
                    

                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            };
            
            that.ventana_modal_no_validos = function(data, callback){
                
                $scope.productos_validos = data.obj.pedido_farmacia_detalle.productos_validos;
                $scope.productos_invalidos = data.obj.pedido_farmacia_detalle.productos_invalidos;

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
            
            $scope.generarPdfPedidoFarmacia = function(){
                
                var nombre_empresa_origen = "";
                var nombre_centro_utilidad_origen = "";
                var nombre_bodega_origen = "";
                
                $scope.rootCreaPedidoFarmacia.de_lista_empresas.forEach(function(empresa){
                    if(empresa.empresa_id === $scope.rootCreaPedidoFarmacia.Empresa.getCodigo()){
                        nombre_empresa_origen = empresa.razon_social;
                    }
                });
                
                $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad.forEach(function(centro_utilidad){
                    if(centro_utilidad.centro_utilidad_id === $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad){
                        nombre_centro_utilidad_origen = centro_utilidad.descripcion;
                    }
                });
                
                $scope.rootCreaPedidoFarmacia.de_lista_bodegas.forEach(function(bodega){
                    if(bodega.bodega_id === $scope.rootCreaPedidoFarmacia.de_seleccion_bodega){
                        nombre_bodega_origen = bodega.descripcion;
                    }
                });
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido;

                var obj_pdf = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {
                        encabezado_pedido_farmacia: {
                            numero_pedido: numero_pedido,
                            empresa_origen_id: $scope.rootCreaPedidoFarmacia.Empresa.getCodigo(), //Nuevo
                            empresa_origen: nombre_empresa_origen,
                            centro_utilidad_origen: nombre_centro_utilidad_origen,
                            bodega_origen: nombre_bodega_origen,
                            empresa_destino_id: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.farmacia_id, //Nuevo
                            empresa_destino: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_farmacia,//$scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[1],
                            centro_utilidad_destino_id: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id, //Nuevo
                            centro_utilidad_destino: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_centro_utilidad,
                            bodega_destino_id: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.bodega_id, //Nuevo
                            bodega_destino: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().farmacia.nombre_bodega,
                            fecha_registro: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().fecha_registro,
                            observacion: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getObservacion()
                        },
                        detalle_pedido_farmacia: $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().lista_productos
                    }
                };

//                console.log("Fecha Registro: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().fecha_registro);
//                console.log("Observación: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().getObservacion);
//                console.log("Objeto PDF: ",obj_pdf);

                var url_imprimir_dedido_pdf = API.PEDIDOS.IMPRIMIR_PEDIDO_FARMACIA;

                Request.realizarRequest(url_imprimir_dedido_pdf, "POST", obj_pdf, function(data) {

                    if (data.status === 200) {
                        //console.log("Eliminación de detalle Exitosa: ", data.msj);
                        var nombre_archivo_temporal = data.obj.reporte_pedido.nombre_reporte;
//                        console.log("Exito: ", data.msj);
//                        console.log("Data Resultado Temporal: ",data);
//                        console.log("Nombre PDF: ", nombre_archivo_temporal); //public/reports/
                        $scope.visualizarReporte("/reports/"+nombre_archivo_temporal, "Pedido: "+numero_pedido, "download");
                    }
                    else{
                        console.log("Error: ", data.msj);
                    }
                });
            };
            

            that.crearPedido = function(obj) {

                var pedido = PedidoVenta.get();

                var datos_pedido = {
                    numero_pedido: obj.numero_pedido,
                    fecha_registro: obj.fecha_registro,
                    descripcion_estado_actual_pedido: obj.descripcion_estado_actual_pedido,
                    estado_actual_pedido: obj.estado_actual_pedido,
                    estado_separacion: obj.estado_separacion
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(PedidoVenta.TIPO_FARMACIA);

                pedido.setObservacion(obj.observacion);

                //pedido.setEnUso(obj.en_uso);

                var farmacia = FarmaciaVenta.get(
                        obj.farmacia_id,
                        obj.bodega_id,
                        obj.nombre_farmacia,
                        obj.nombre_bodega,
                        obj.centro_utilidad,
                        obj.nombre_centro_utilidad
                        );

                pedido.setFarmacia(farmacia);

                return pedido;
            };

            //referencia del socket io
            socket.on("onListarPedidosFarmacias", function(datos) {

                if (datos.status == 200) {
                    var obj = datos.obj.pedidos_farmacias[0];
                    var pedido = that.crearPedido(obj);

                    that.reemplazarPedidoEstado(pedido);
                    AlertService.mostrarMensaje("success", "pedido Asignado Correctamente!");

                }
            });
            
            
            that.reemplazarPedidoEstado = function(pedido) {
                
                if($scope.rootCreaPedidoFarmacia.Empresa != undefined){
                
                    for (var i in $scope.rootCreaPedidoFarmacia.Empresa.getPedidosFarmacia()) {
                        var _pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidosFarmacia()[i];

                        if (pedido.numero_pedido == _pedido.numero_pedido) {
                            _pedido.descripcion_estado_actual_pedido = pedido.descripcion_estado_actual_pedido;
                            _pedido.estado_actual_pedido = pedido.estado_actual_pedido;
                            _pedido.estado_separacion = pedido.estado_separacion;

                            break;
                        }
                    }
                
                }
                
            };
       
            that.buscarPedido("");

        }]);
});
