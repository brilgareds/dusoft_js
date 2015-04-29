//Controlador de la View seleccioncliente.html asociado a Slide en cotizacioncliente.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionClienteController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'ClientePedido', 'API',
        "AlertService", 'Usuario',

        function($scope, $rootScope, Request, EmpresaPedido, ClientePedido, API, AlertService, Usuario) {

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
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
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
                            empresa_id: '03',
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
                    else{
                        console.log("Error en consulta de Clientes: ", data.msj);
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
                
                //console.log(">>>>>> Seleccion Cliente - Datos Creación Cliente: ",obj);
                
                var cliente = ClientePedido.get(
                                    obj.nombre_tercero,  //nombre_tercero
                                    obj.direccion,       //direccion
                                    obj.tipo_id_tercero, //tipo_id_tercero
                                    obj.tercero_id,      //id
                                    obj.telefono         //telefono
                                );
                
                cliente.setIdentificacion();                    //identificacion = tipo_id_tercero + id
                cliente.setPais(obj.pais);                      //pais
                cliente.setDepartamento(obj.departamento);      //departamento
                cliente.setMunicipio(obj.municipio);            //municipio
                cliente.setUbicacion();                         //ubicacion = pais + departamento + municipio
                cliente.setContratoId(obj.contrato_cliente_id); //contrato_id
                cliente.setEstadoContrato(obj.estado_contrato);  //estado_contrato
                cliente.setEmail(obj.email);                    //email
                cliente.setContratoVigente(obj.contrato_vigente);
                
                console.log(">>>> CLIENTES: Vigencia Contrato -> ", obj.contrato_vigente);

                return cliente;
            };

            /*  Construcción de Grid    */

            that.renderGrid = function() {

                $scope.rootSeleccionCliente.grid_clientes = {
                    data: 'rootSeleccionCliente.Empresa.getClientes()',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: false,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'identificacion', displayName: 'Identificación', width: "8%"},
                        {field: 'nombre_tercero', displayName: 'Nombre Cliente'},
                        {field: 'ubicacion', displayName: 'Ubicación'},
                        {field: 'direccion', displayName: 'Dirección'},
                        {field: 'telefono', displayName: 'Teléfono', width: "11%"},
                        {field: 'contrato_vigente', displayName: 'Contrato Vigente', width: "11%"},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "8%",
                        cellTemplate: ' <div class="row">\n\
                                            <button ng-if="row.entity.estado_contrato == 1 && row.entity.contrato_vigente == true" class="btn btn-default btn-xs" ng-click="onSeleccionarCliente(row)">\n\
                                                <span class="glyphicon glyphicon-plus-sign"> Seleccionar</span>\n\
                                            </button>\n\
                                            <button ng-if="row.entity.estado_contrato == 1 && row.entity.contrato_vigente==false" ng-disabled="true" class="btn btn-default btn-xs" ng-click="">\n\
                                                <span class="glyphicon glyphicon-plus-sign"> Fin Contrato</span>\n\
                                            </button>\n\
                                            <button ng-if="row.entity.estado_contrato != 1" ng-disabled="true" class="btn btn-default btn-xs" ng-click="">\n\
                                                <span class="glyphicon glyphicon-lock"> Bloqueado</span>\n\
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
                
                //Se inserta el objeto cliente en el objeto Empresa
                //$scope.rootSeleccionCliente.Empresa.getPedidoSeleccionado().setCliente(row.entity);
                
                
            };

            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
                //Este evento no funciona para los Slides, así que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes líneas son efectivas si se usa la view sin el slide
                $scope.rootSeleccionCliente = {};
                $scope.$$watchers = null;

            });
            
            //eventos de widgets
            $scope.onKeySeleccionClientePress = function(ev) {

                 if (ev.which == 13) {
                     $scope.onBuscarSeleccionCliente($scope.obtenerParametros(),"");
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.rootSeleccionCliente.paginaactual--;
                 $scope.onBuscarSeleccionCliente($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootSeleccionCliente.paginaactual++;
                 $scope.onBuscarSeleccionCliente($scope.obtenerParametros(), true);
            };

        }]);
});
