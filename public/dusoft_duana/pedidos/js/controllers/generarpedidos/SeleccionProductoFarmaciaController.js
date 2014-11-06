//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state','Usuario', 'ProductoPedido',

        function($scope, $rootScope, Request, Empresa, Cliente, PedidoVenta, API, socket, AlertService, $state, Usuario, ProductoPedido) {
            
            $scope.expreg = new RegExp("^[0-9]*$");
            
            that = this;
            
            $scope.$on('cargarGridSeleccionadoSlide', function(event, mass) {
                //Recibimos la GRID del PADRE: -> mass
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = mass;
                
                console.log("EL CONTENIDO RECIBIDO ES: ", mass);
                
                /* Utilizar la siguiente información  para modificar los campos de la grid fuente. Se debe hacer búsqueda por id de producto */
                
                /*
                    $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].fila_activa = true;
                    $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].tipo_boton = 'success';
                    $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].etiqueta_boton = 'Incluir';
                 
                    object.each(function(index, value)){
                        console.log(value);
                    }
                 
                 */
                if($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados){
                    
                    console.log("Listado desde MASS: ", $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados);
                
                    $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.forEach(function(valor){
                        console.log("Código Producto: ", valor.codigo_producto);
                        console.log("Cantidad Solicitada: ", valor.cantidad_solicitada);
                    });
                }
                
            });

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
                $scope.$emit('cerrarseleccionproducto', {animado:true});

                $scope.rootSeleccionProductoFarmacia = {};
            };

            $rootScope.$on("mostrarseleccionproducto", function(e, tipo_cliente, datos_de, datos_para, observacion, pedido) {
                
                console.log("Pedido desde CrearPedidoFarmacia: ", pedido);
                
//                if(expreg.test("4a5")){
//                    alert("La expresión es Válida");
//                }
//                else
//                    {
//                        alert("La expresión está chafa!");
//                    }
                
                $scope.rootSeleccionProductoFarmacia = {};
                
                $scope.rootSeleccionProductoFarmacia.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };
                
                $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
                
                $scope.rootSeleccionProductoFarmacia.tipo_cliente = tipo_cliente;

                $scope.rootSeleccionProductoFarmacia.items = 0;
                $scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {};
                $scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda = "";
                
                $scope.rootSeleccionProductoFarmacia.de_empresa_id = datos_de.empresa_id;
                $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id = datos_de.centro_utilidad_id;
                $scope.rootSeleccionProductoFarmacia.de_bodega_id = datos_de.bodega_id;
                
                $scope.rootSeleccionProductoFarmacia.para_empresa_id = datos_para.empresa_id;
                $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id = datos_para.centro_utilidad_id;
                $scope.rootSeleccionProductoFarmacia.para_bodega_id = datos_para.bodega_id;
                
//                console.log("------------------------------- Datos a enviar -------------------------------------");
//                  
//                console.log("Termino Búsqueda: ",$scope.rootSeleccionProductoFarmacia.termino_busqueda);
//                console.log("Página Actual: ",$scope.rootSeleccionProductoFarmacia.paginaactual);
//                
//                console.log("ID Empresa Origen: ",$scope.rootSeleccionProductoFarmacia.de_empresa_id);
//                console.log("ID Centro Utilidad Origen: ",$scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id);
//                console.log("ID Bodega Origen: ",$scope.rootSeleccionProductoFarmacia.de_bodega_id);            
//                
//                console.log("ID Empresa Destino: ",$scope.rootSeleccionProductoFarmacia.para_empresa_id);
//                console.log("ID Centro Utilidad Destino: ",$scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id);
//                console.log("ID Bodega Destino: ",$scope.rootSeleccionProductoFarmacia.para_bodega_id);

                $scope.rootSeleccionProductoFarmacia.listado_productos = [];
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = [];
                
                $scope.rootSeleccionProductoFarmacia.observacion_encabezado = observacion;
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
                            termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda,
                            pagina_actual: $scope.rootSeleccionProductoFarmacia.paginaactual,
                            empresa_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
                            empresa_destino_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                            centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                            bodega_destino_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                            
                            filtro:{}
                        }
                    }
                };

                return obj;
            }
            
            $scope.buscarSeleccionProducto = function(obj, paginando) {

                var url = API.PEDIDOS.LISTAR_PRODUCTOS_FARMACIAS;
                
                console.log("Antes de listar Productos ... ");

                Request.realizarRequest(url, "POST", obj, function(data) {
                    
                    console.log("Después de obtener Data ... ");
                    
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
                $scope.rootSeleccionProductoFarmacia.listado_productos = data.lista_productos;
                //$scope.rootSeleccionProductoFarmacia.listado_productos = [];
               
                /*for (var i in data.lista_productos) {

                    var obj = data.lista_productos[i];
                    
                    var producto = that.crearProducto(obj);

                    $scope.rootSeleccionProductoFarmacia.listado_productos.push(producto);

                }*/

            };
            
            /* Por el momento se dascarta ésta función */
            
            that.crearProducto = function(obj) {
                
                //var pedido = PedidoVenta.get();
                
                var producto = {
                    codigo_producto: obj.codigo_producto,
                    descripcion: obj.nombre_producto,
                    molecula: obj.descripcion_molecula,
                    existencia_farmacia: obj.existencias_farmacia,
                    existencia_bodega: obj.existencia,
                    total_existencias_farmacias: obj.total_existencias_farmacias,
                    existencia_disponible: obj.disponibilidad_bodega,
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
                        {field: 'codigo_producto', displayName: 'Código Producto', width: "9%"},
                        {field: 'nombre_producto', displayName: 'Descripción', width: "37%"},
                        //{field: 'descripcion_molecula', displayName: 'Molécula'},
                        {field: 'existencias_farmacia', displayName: 'Existencia Farmacia', width: "10%"},
                        {field: 'existencia', displayName: 'Existencia Bodega', width: "10%"},
                        {field: 'total_existencias_farmacias', displayName: 'Total Exist. Farmacia', width: "11%"},
                        {field: 'disponibilidad_bodega', displayName: 'Disponible', width: "6%"},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada', enableCellEdit: true, width: "10%"},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "6%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-default btn-xs" ng-click="onRowClick1(row)" ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null || !expreg.test(row.entity.cantidad_solicitada)">\n\
                                                    <span class="glyphicon glyphicon-plus-sign">Incluir</span>\n\
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
                        {field: 'codigo_producto', displayName: 'Código Producto', width: "9%"},
                        {field: 'descripcion', displayName: 'Descripción', width: "37%"},
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
            };

            $scope.onRowClick1 = function(row) {
                
                    $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;

                    $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.forEach(function(valor){
                        if(valor.codigo_producto === row.entity.codigo_producto){
                            $scope.rootSeleccionProductoFarmacia.no_incluir_producto = true;
                            return;
                        }
                    });
                    
                    if($scope.rootSeleccionProductoFarmacia.no_incluir_producto === false)
                    {
                        var cantidad_pendiente = row.entity.cantidad_solicitada - row.entity.disponibilidad_bodega;

                        var obj_sel = { 
                                    codigo_producto: row.entity.codigo_producto,
                                    descripcion: row.entity.nombre_producto,
                                    cantidad_solicitada: row.entity.cantidad_solicitada,
                                    cantidad_pendiente: (cantidad_pendiente < 0) ? 0 : cantidad_pendiente,

                                }


                        $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.unshift(obj_sel); 

                        /* Crear aquí el producto e insertarlo en lista de productos del pedido */

                        var producto = ProductoPedido.get(
                                row.entity.codigo_producto,
                                row.entity.descripcion,
                                parseInt(row.entity.existencia_bodega),
                                0,
                                parseInt(row.entity.cantidad_solicitada)
                            );

                        console.log("Producto creado: ", producto);
                        //console.log("ROW Tipo Producto Id: ", row.entity.tipo_producto_id);

                        $scope.rootSeleccionProductoFarmacia.pedido.agregarProducto(producto);

                        /*************************************************************************/                    

                        $scope.$emit('cargarGridPrincipal', $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados);
                        
                        /*************** Encabezado ***************/
                        
                        var obj_encabezado = {
                            session:$scope.rootSeleccionProductoFarmacia.session,
                            data:{
                                pedidos_farmacias:{
                                    empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                                    centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                                    bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,

                                    empresa_destino_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
                                    centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
                                    bodega_destino_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
                                    
                                    observacion: $scope.rootSeleccionProductoFarmacia.observacion_encabezado
                                }
                            }
                        };
                        
                        //console.log("Información para insert ENCABEZADO: ",obj_encabezado);
                        
                        //REQUEST para validar existencia previa del registro
                        var url_registros_encabezado = API.PEDIDOS.NUMERO_REGISTROS_PEDIDO_TEMPORAL;
                        
                        Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {

                            //console.log("Resultado INSERT Pedido: ",data);

                            if(data.status == 200) {

                                //that.renderProductosFarmacia(data.obj, paginando);
                                console.log("Número de Registros: ", data);
                            }
                            else{
                                console.log("Error en la Consulta: ",data);
                            }

                        });
                        
                        var url_encabezado = API.PEDIDOS.CREAR_PEDIDO_TEMPORAL;

                        Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                            //console.log("Resultado INSERT Pedido: ",data);

                            if(data.status == 200) {

                                //that.renderProductosFarmacia(data.obj, paginando);
                                console.log("Registro Insertado Exitosamente en Encabezado");
                            }
                            else{
                                console.log("Error en la Inserción de encabezado: ",data);
                            }

                        });
                        
                        /****************************************/
                        
                        /******** Detalle *********/
                        
                        var obj_detalle = {
                            session:$scope.rootSeleccionProductoFarmacia.session,
                            data:{
                                detalle_pedidos_farmacias:{
                                    numero_pedido: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim() + $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim() + row.entity.codigo_producto.trim(),
                                    
                                    empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                                    centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                                    bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                                    
                                    codigo_producto: row.entity.codigo_producto,
                                    cantidad_solic: parseInt(row.entity.cantidad_solicitada),
                                    tipo_producto_id: row.entity.tipo_producto_id,
                                    cantidad_pendiente: (cantidad_pendiente < 0) ? 0 : cantidad_pendiente 
                                }
                            }
                        };
                        
                        //console.log("Información para insert DETALLE: ",obj_detalle);
                        
                        //REQUEST para validar existencia previa del registro en el detalle
                        var url_registros_detalle = API.PEDIDOS.NUMERO_REGISTROS_DETALLE_PEDIDO_TEMPORAL;
                        
                        Request.realizarRequest(url_registros_detalle, "POST", obj_encabezado, function(data) {

                            //console.log("Resultado INSERT Pedido: ",data);

                            if(data.status == 200) {

                                //that.renderProductosFarmacia(data.obj, paginando);
                                console.log("Número de Registros en Detalle: ", data);
                            }
                            else{
                                console.log("Error en la Consulta: ",data);
                            }

                        });
                        
                        var url_detalle = API.PEDIDOS.CREAR_DETALLE_PEDIDO_TEMPORAL;

                        Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                            //console.log("Resultado INSERT Detalle Pedido: ",data);

                            if(data.status == 200) {

                                //that.renderProductosFarmacia(data.obj, paginando);
                                console.log("Registro Insertado Exitosamente en Detalle");
                            }
                            else{
                                console.log("Error en la inserción del Detalle: ",data);
                            }

                        });
                        
                        /**************************/
                        
                    }
            };
            
            $scope.onRowClick2 = function(row) {
                
//                $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].fila_activa = true;
//                $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].tipo_boton = 'success';
//                $scope.rootSeleccionProductoFarmacia.listado_productos[row.entity.sourceIndex].etiqueta_boton = 'Incluir';

                $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
                
                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.splice(row.rowIndex,1);
                $scope.rootSeleccionProductoFarmacia.pedido.eliminarProducto(row.rowIndex);
                
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
