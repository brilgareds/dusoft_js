//Controlador de la View seleccioncliente.html asociado a Slide en cotizacioncliente.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionClienteController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', 'Usuario',

        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, PedidoVenta, API, socket, AlertService, $state, Usuario) {

            $scope.expreg = new RegExp("^[0-9]*$");

            var that = this;
            
            $scope.cerrar = function(){
               $scope.$emit('cerrarseleccioncliente', {animado:true});
               
               $scope.rootSeleccionCliente = {};
            };
            
            
            $rootScope.$on("mostrarseleccioncliente", function(e) {
                
                $scope.rootSeleccionCliente = {};
                
                $scope.rootSeleccionCliente.Empresa = EmpresaPedido;
                
                $scope.rootSeleccionCliente.paginas = 0;
                $scope.rootSeleccionCliente.items = 0;
                $scope.rootSeleccionCliente.termino_busqueda = "";
                $scope.rootSeleccionCliente.ultima_busqueda = "";
                $scope.rootSeleccionCliente.paginaactual = 1;
                
                $scope.rootSeleccionCliente.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };
                
                $scope.rootSeleccionCliente.ultima_busqueda = {};
                $scope.rootSeleccionCliente.ultima_busqueda.termino_busqueda = "";
                
                $scope.onBuscarSeleccionCliente($scope.obtenerParametros(), "");
            });
            

            $scope.obtenerParametros = function() {

                //valida si cambio el termino de busqueda
                if ($scope.rootSeleccionCliente.ultima_busqueda.termino_busqueda !== $scope.rootSeleccionCliente.termino_busqueda) {
                    $scope.rootSeleccionCliente.paginaactual = 1;
                }

                var obj = {
                    session: $scope.rootSeleccionCliente.session,
                    data: {
                        clientes: {
                            termino_busqueda: $scope.rootSeleccionCliente.termino_busqueda,
                            pagina_actual: $scope.rootSeleccionCliente.paginaactual,
                        }
                    }
                };

                return obj;
            };
            
            $scope.onBuscarSeleccionCliente = function(obj, paginando) {

                var url = API.TERCEROS.LISTAR_CLIENTES;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        $scope.rootSeleccionCliente.ultima_busqueda = {
                            termino_busqueda: $scope.rootSeleccionCliente.termino_busqueda
                        };

                        that.renderClientes(data.obj, paginando);
                    }

                });

                that.renderGrid();
            }; 
            
            that.renderClientes = function(data, paginando) {

                $scope.rootSeleccionCliente.items = data.listado_clientes.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.rootSeleccionCliente.items === 0) {
                    if ($scope.rootSeleccionCliente.paginaactual > 1) {
                        $scope.rootSeleccionCliente.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron más registros");
                    return;
                }

                $scope.rootSeleccionCliente.Empresa.vaciarClientes();
                
                var cliente_obj = {};
                
                data.listado_clientes.forEach(function(cliente){
                    
                    cliente_obj = that.crearCliente(cliente);
                    
                    $scope.rootSeleccionCliente.Empresa.agregarCliente(cliente_obj);
                    
                });
                
                //console.log(">>>>>>>> Listado Clientes: ", $scope.rootSeleccionCliente.Empresa.getClientes());

            };     

            that.crearCliente = function(obj) {
                
                var cliente = ClientePedido.get(
                                    obj.nombre_tercero,  //nombre_tercero
                                    obj.direccion,       //direccion
                                    obj.tipo_id_tercero, //tipo_id_tercero
                                    obj.tercero_id,      //id
                                    obj.telefono         //telefono
                                );
                                    
                cliente.setPais(obj.pais);                  //pais
                cliente.setDepartamento(obj.departamento);  //departamento
                cliente.setMunicipio(obj.municipio);        //municipio
                cliente.setUbicacion();                     //ubicacion = pais + departamento + municipio

                return cliente;
            };

            /*  Construcción de Grid    */

            that.renderGrid = function() {

                $scope.rootSeleccionCliente.grid_clientes = {
                    data: 'rootSeleccionCliente.Empresa.getClientes()',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: false,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'tipo_id_tercero', displayName: 'Tipo Id', width: "5%"},
                        {field: 'id', displayName: 'Identificación', width: "10%"},
                        {field: 'nombre_tercero', displayName: 'Nombre Cliente'},
                        {field: 'ubicacion', displayName: 'Ubicación'},
                        {field: 'direccion', displayName: 'Dirección'},
                        {field: 'telefono', displayName: 'Teléfono', width: "11%"},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onSeleccionarCliente(row)">\n\
                                                <span class="">Seleccionar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                    ]
                };

            };
            
            $scope.onSeleccionarCliente = function(row){
                
                //var pedido = $scope.rootSeleccionCliente.Empresa.getPedidoSeleccionado();
                
                //pedido.setCliente(row.entity);
                
                console.log(">>>> Cliente Seleccionado: ", row.entity);

                $scope.$emit('cargarClienteSlide', row.entity);
                    
                $scope.$emit('cerrarseleccioncliente', {animado:true});
               
                    //$scope.listado_clientes = [];
                //return
                
            };



            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
                //Este evento no funciona para los Slides, así que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes líneas son efectivas si se usa la view sin el slide
                $scope.rootSeleccionCliente = {};
                $scope.$$watchers = null;

            });
            
            //eventos de widgets
            $scope.onKeySeleccionClientePress = function(ev, termino_busqueda) {
                 //if(!$scope.buscarVerPedidosFarmacias($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     $scope.buscarSeleccionCliente(termino_busqueda);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.paginaactual--;
                 $scope.buscarSeleccionCliente($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.paginaactual++;
                 $scope.buscarSeleccionCliente($scope.termino_busqueda, true);
            };

            $scope.valorSeleccionado = function() {


            };
            

        }]);
});
