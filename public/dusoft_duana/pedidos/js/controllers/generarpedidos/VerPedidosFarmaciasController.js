//Controlador de la View verpedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('VerPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Farmacia', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService",

        function($scope, $rootScope, Request, EmpresaPedido, Farmacia, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService) {
            
            var that = this;
            
            that.pedido = PedidoVenta.get();
            
            $scope.rootVerPedidosFarmacias = {};
            
            $scope.rootVerPedidosFarmacias.Empresa = EmpresaPedido;
            $scope.rootVerPedidosFarmacias.Pedido = PedidoVenta;
            
            $scope.rootVerPedidosFarmacias.paginas = 0;
            $scope.rootVerPedidosFarmacias.items = 0;
            $scope.rootVerPedidosFarmacias.termino_busqueda = "";
            $scope.rootVerPedidosFarmacias.ultima_busqueda = {};
            $scope.rootVerPedidosFarmacias.paginaactual = 1;

            $scope.rootVerPedidosFarmacias.listado_pedidos = [];
            
            $scope.rootVerPedidosFarmacias.ultima_busqueda.seleccion = "";
            $scope.rootVerPedidosFarmacias.ultima_busqueda.termino_busqueda = "";
            
            $scope.rootVerPedidosFarmacias.seleccion = "FD";
            
            $scope.rootVerPedidosFarmacias.session = {
                usuario_id:Usuario.usuario_id,
                auth_token:Usuario.token
            };
            
            $scope.rootVerPedidosFarmacias.listado_farmacias = [];

            $scope.rootVerPedidosFarmacias.estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            that.listarFarmacias = function() {

                var obj = {
                    session: $scope.rootVerPedidosFarmacias.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                        $scope.rootVerPedidosFarmacias.listado_farmacias = data.obj.empresas;
                        //that.renderFarmacias(data.obj.empresas);
                    }
                    
                });
            };
            
            /*that.renderFarmacias = function(farmacias){
                
                $scope.rootVerPedidosFarmacias.Empresa.vaciarFarmacias();
                
                farmacias.forEach(function(registro){
                    
                    var farmacia = Farmacia.get(registro.empresa_id, "", registro.razon_social, "", 0, "");
                    
                    $scope.rootVerPedidosFarmacias.Empresa.agregarFarmacias(farmacia);
                });
                console.log("EmpresaPedido Farmacias: ", $scope.rootVerPedidosFarmacias.Empresa.getFarmacias());
            };*/
            
           /* $scope.seleccion_farmacia = function(){
                console.log('>>>>>>>>>>>>',$scope.farmacia_seleccionada.get_farmacia_id(), $scope.farmacia_seleccionada.get_nombre_farmacia());                
            }*/
            
            $scope.obtenerParametros = function(){

                //valida si cambio el termino de busqueda
                if($scope.rootVerPedidosFarmacias.ultima_busqueda.termino_busqueda !== $scope.rootVerPedidosFarmacias.termino_busqueda
                        || $scope.rootVerPedidosFarmacias.ultima_busqueda.seleccion !== $scope.rootVerPedidosFarmacias.seleccion)
                /*if($scope.rootVerPedidosFarmacias.ultima_busqueda.termino_busqueda !== $scope.rootVerPedidosFarmacias.termino_busqueda
                        || $scope.rootVerPedidosFarmacias.ultima_busqueda.seleccion !== $scope.farmacia_seleccionada.get_farmacia_id())*/
                {
                    $scope.rootVerPedidosFarmacias.paginaactual = 1;
                
                }

                var obj = {
                    session:$scope.rootVerPedidosFarmacias.session,
                    data:{
                        pedidos_farmacias:{
                            termino_busqueda: $scope.rootVerPedidosFarmacias.termino_busqueda,
                            empresa_id: $scope.rootVerPedidosFarmacias.seleccion,
                            //empresa_id: $scope.farmacia_seleccionada.get_farmacia_id(),
                            pagina_actual: $scope.rootVerPedidosFarmacias.paginaactual,
                            filtro:{}
                        }
                    }
                };

                return obj;
            };
            
            $scope.onBuscarPedidosFarmacias = function(obj, paginando) {
                
                var url = API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS;
                
                Request.realizarRequest(url, "POST", obj, function(data) {
                    
                    console.log("Data: ",data);

                    if(data.status === 200) {
                        
                        $scope.rootVerPedidosFarmacias.ultima_busqueda = {
                                termino_busqueda: $scope.rootVerPedidosFarmacias.termino_busqueda,
                                seleccion: $scope.rootVerPedidosFarmacias.seleccion
                                //seleccion: $scope.farmacia_seleccionada.get_farmacia_id()
                        }
                        
                        that.renderPedidosFarmacias(data.obj, paginando);
                    }

                });

            };

            that.renderPedidosFarmacias = function(data, paginando) {

                $scope.rootVerPedidosFarmacias.items = data.pedidos_farmacias.length;
                
                //se valida que hayan registros en una siguiente pagina
                if(paginando && $scope.rootVerPedidosFarmacias.items === 0){
                    if($scope.rootVerPedidosFarmacias.paginaactual > 1){
                        $scope.rootVerPedidosFarmacias.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning","No se encontraron más registros");
                    return;
                }

                $scope.rootVerPedidosFarmacias.Empresa.vaciarPedidosFarmacia();
                
                if(data.pedidos_farmacias.length > 0)
                {    
                    $scope.rootVerPedidosFarmacias.Empresa.setCodigo(data.pedidos_farmacias[0].empresa_origen_id);
                }
               
                for (var i in data.pedidos_farmacias) {

                    var obj = data.pedidos_farmacias[i];
                    
                    var pedido = that.crearPedido(obj);

                    $scope.rootVerPedidosFarmacias.Empresa.agregarPedidoFarmacia(pedido);

                }

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
                pedido.setTipo(pedido.TIPO_FARMACIA);
                pedido.setObservacion(obj.observacion);

                        
                var farmacia = Farmacia.get(
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

            //Grid Lista Pedidos
            $scope.rootVerPedidosFarmacias.lista_pedidos_farmacias = {
                data: 'rootVerPedidosFarmacias.Empresa.getPedidosFarmacia()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_pedido', displayName: 'Número Pedido'},
                    {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia'},
                    {field: 'farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'zona', displayName: 'Zona'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'estado_actual_pedido', displayName: 'EstadoId', visible: false},
                    {field: 'descripcion_estado_actual_pedido', displayName: 'Estado', cellClass: "txt-center",
                        cellTemplate: "<button ng-class='rootVerPedidosFarmacias.estados[row.entity.estado_actual_pedido]'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                        cellTemplate: ' <div>\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEditarPedidoFarmacia(row.entity)" ng-disabled="(row.entity.estado_actual_pedido != 0 && row.entity.estado_actual_pedido != 1) || row.entity.estado_separacion != null">\n\
                                                <span class="glyphicon glyphicon-pencil">Modificar</span>\n\
                                            </button>\n\
                                        </div>'}

                ]

            };
 
            // Agregar Restriccion de acuerdo al estado de asigancion del pedido
            $scope.agregarRestriccion = function(estado_separacion) {

                var clase = "";
                if (estado_separacion)
                    clase = "glyphicon glyphicon-lock";

                return clase;
            };
            
            $scope.abrirViewPedidoFarmacia = function(){
                
                PedidoVenta.pedidoseleccionado = "";    
                localStorageService.set("pedidoseleccionado", PedidoVenta.pedidoseleccionado);
                
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
                that.pedido.setObservacion("");
                
                //Creación objeto farmacia
                var farmacia = Farmacia.get(
                        0,
                        0,
                        "",
                        "",
                        0,
                        ""
                );

                that.pedido.setFarmacia(farmacia);

                $scope.rootVerPedidosFarmacias.Empresa.setPedidoSeleccionado(that.pedido);
                
                /**/
                
                $scope.rootVerPedidosFarmacias.Empresa.getPedidoSeleccionado().vaciarProductos();
                $state.go('CreaPedidosFarmacias');
            };
            
            $scope.onEditarPedidoFarmacia = function(data){
                
                var pedido = PedidoVenta.get();
                
                var datos_pedido = {
                    numero_pedido: data.numero_pedido,
                    fecha_registro: data.fecha_registro,
                    descripcion_estado_actual_pedido: data.descripcion_estado_actual_pedido,
                    estado_actual_pedido: data.estado_actual_pedido,
                    estado_separacion: data.estado_separacion
                };
                
                pedido.setDatos(datos_pedido);
                pedido.setTipo(2);
                pedido.setObservacion(data.observacion);

                        
                var farmacia = Farmacia.get(
                        data.farmacia.farmacia_id,
                        data.farmacia.bodega_id,
                        data.farmacia.nombre_farmacia,
                        data.farmacia.nombre_bodega,
                        data.farmacia.centro_utilidad_id,
                        data.farmacia.nombre_centro_utilidad
                        );

                pedido.setFarmacia(farmacia);
                //Insertar aquí el pedido seleccionado para el singleton Empresa
                $scope.rootVerPedidosFarmacias.Empresa.setPedidoSeleccionado(pedido);
                
                PedidoVenta.pedidoseleccionado = data.numero_pedido;
                $state.go('CreaPedidosFarmacias');                
            }
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 

                $scope.rootVerPedidosFarmacias = {};
                $scope.$$watchers = null;

            });
            
            //eventos de widgets
            $scope.onTeclaBuscarPedidosFarmacias = function(ev) {

                 if (ev.which === 13) {
                     $scope.onBuscarPedidosFarmacias($scope.obtenerParametros());
                 }
            };
            
            $scope.paginaAnterior = function() {
                 $scope.rootVerPedidosFarmacias.paginaactual--;
                 $scope.onBuscarPedidosFarmacias($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootVerPedidosFarmacias.paginaactual++;
                 $scope.onBuscarPedidosFarmacias($scope.obtenerParametros(), true);
            };

            $scope.valorSeleccionado = function() {
                
                $scope.onBuscarPedidosFarmacias($scope.obtenerParametros());
            };
            
            $scope.onBuscarPedidosFarmacias($scope.obtenerParametros());
            that.listarFarmacias("");

        }]);
});
