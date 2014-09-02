define(["angular", "js/controllers", '../../../../includes/slide/slideContent',
        'models/Farmacia', 'models/Pedido', 'models/Separador',
        'models/DocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request', 
        'Empresa', 'Farmacia', 'Pedido',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "Usuario", 
        function($scope, $rootScope, Request, Empresa, Farmacia, Pedido, Separador, DocumentoTemporal, API, socket, AlertService,Usuario) {

            $scope.Empresa = Empresa;
            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            $scope.pedidosSeparadosSeleccionados = [];
            $scope.empresas = [];
            $scope.seleccion = "FD";
            $scope.session = {
               usuario_id:Usuario.usuario_id,
               auth_token:Usuario.token
            };
            
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda  = {};
            $scope.paginaactual = 1;
            $scope.numero_pedido = "";


            $scope.buscarPedidosSeparadosFarmacia = function(termino, paginando) {

                $scope.ultima_busqueda.seleccion;
                $scope.ultima_busqueda.termino_busqueda;
                
                //valida si cambio el termino de busqueda
                if($scope.ultima_busqueda.termino_busqueda != $scope.termino_busqueda
                        || $scope.ultima_busqueda.seleccion != $scope.seleccion){
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal:{
                            termino_busqueda: termino,
                            empresa_id: $scope.seleccion,
                            pagina_actual: $scope.paginaactual,
                            filtro: {
                                finalizados: true
                            }
                        }
                    }
                };
                
//                if($scope.estadoseleccionado != ""){
//                    obj.data.documento_temporal.filtro[$scope.estadoseleccionado] = true;
//                }

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_FARMACIAS, "POST", obj, function(data) {

                    if(data.status == 200) { 
                        $scope.ultima_busqueda = {
                            termino_busqueda: $scope.termino_busqueda,
                            seleccion: $scope.seleccion
                        }
                        
                        if(data.obj.documentos_temporales != undefined) {
                            $scope.renderPedidosSeparadosFarmacia(data.obj, paginando);
                        }
                    }
                    
                });
            };
            
            $scope.listarEmpresas = function() {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.empresas = data.obj.empresas;
                        //console.log(JSON.stringify($scope.empresas))
                    }
                });
            };
            
            $scope.renderPedidosSeparadosFarmacia = function(data, paginando) {

                $scope.items = data.documentos_temporales.length;
                
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items == 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }
                
                $scope.Empresa.vaciarDocumentoTemporal("Farmacia");

                for (var i in data.documentos_temporales) {

                    var obj = data.documentos_temporales[i];
                    
                    var documento_temporal = $scope.crearDocumentoTemporal(obj);

                    $scope.Empresa.agregarDocumentoTemporal(documento_temporal, "Farmacia");
                }
            };

            $scope.crearDocumentoTemporal = function(obj){
                
                var documento_temporal = DocumentoTemporal.get();
                documento_temporal.setDatos(obj);

                var pedido = Pedido.get(obj);
                pedido.setDatos(obj);
                
                var farmacia = Farmacia.get(
                        obj.farmacia_id,
                        obj.bodega_id,
                        obj.nombre_farmacia,
                        obj.nombre_bodega
                    );
                
                pedido.setFarmacia(farmacia);
                
                documento_temporal.setPedido(pedido);
                
                var separador = Separador.get(obj.responsable_pedido, obj.responsable_id, 1);
                
                documento_temporal.setSeparador(separador);
                
                return documento_temporal;
                
            };

            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_separados_farmacias = {
                data: 'Empresa.getDocumentoTemporal("Farmacia")',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Numero Pedido'},
                    {field: 'pedido.nombre_vendedor', displayName: 'Farmacia'},
                    {field: 'pedido.farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'zona_pedido', displayName: 'Zona'},
//                    {field: 'descripcion_estado_actual_separado', displayName: "Estado"},
                    {field: 'separador.nombre_operario', displayName: 'Separador'},
                    {field: 'auditor.nombre_operario', displayName: 'Auditor'},
                    {field: 'descripcion_estado_separacion', displayName: 'Estado Separación'},
                    {field: 'fecha_separacion_pedido', displayName: "Fecha Separación"},
                    {field: 'movimiento', displayName: "Movimiento", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Auditar</span></button></div>'}
                ]

            };

            $scope.onRowClick = function(row){
                 $scope.slideurl = "views/pedidoseparadofarmacia.html?time="+new Date().getTime();
                 $scope.$emit('mostrardetallefarmacia',row.entity);
                 //console.log("Presionado Botón Auditar Farmacia: ", row.entity);
            };
            
            $scope.valorSeleccionado = function(valor) {
                $scope.buscarPedidosSeparadosFarmacia("");
            };
            
            $scope.agregarClase = function(estado){
                return estados[estado];
            };


            //fin delegado grid pedidos //

            $scope.onPedidoSeleccionado = function(check, row){

                row.selected = check;
                if(check){
                    $scope.agregarPedido(row.entity);
                } else {
                   
                    $scope.quitarPedido(row.entity);
                }

            };  


            $scope.quitarPedido = function(pedido){
                for(var i in $scope.pedidosSeparadosSeleccionados){
                    var _pedido = $scope.pedidosSeparadosSeleccionados[i];
                    if(_pedido.numero_pedido == pedido.numero_pedido){
                        $scope.pedidosSeparadosSeleccionados.splice(i,true);
                    }
                }
            };  

            $scope.agregarPedido = function(pedido){
                //valida que no exista el pedido en el array
                for(var i in $scope.pedidosSeparadosSeleccionados){
                    var _pedido = $scope.pedidosSeparadosSeleccionados[i];
                    if(_pedido.numero_pedido == pedido.numero_pedido){
                        return false;
                    }
                }

                $scope.pedidosSeparadosSeleccionados.push(pedido);
            };

            $scope.buscarSeleccion = function(row){
                var pedido = row.entity;
                for(var i in $scope.pedidosSeparadosSeleccionados){
                    var _pedido = $scope.pedidosSeparadosSeleccionados[i];
                    if(_pedido.numero_pedido == pedido.numero_pedido){
                        
                        row.selected = true;
                        return true;
                    }
                }
                row.selected = false;
                return false;
            };

            

            //eventos de widgets
            $scope.onKeySeparadosPress = function(ev, termino_busqueda) {
                
                if (ev.which == 13) {
                    $scope.buscarPedidosSeparadosFarmacia(termino_busqueda);
                }
            };

            $scope.paginaAnterior = function(){
                $scope.paginaactual--;
                $scope.buscarPedidosSeparadosFarmacia($scope.termino_busqueda,true);
            };

            $scope.paginaSiguiente = function(){
                $scope.paginaactual++;
                $scope.buscarPedidosSeparadosFarmacia($scope.termino_busqueda,true);
            };



            //fin de eventos

            //se realiza el llamado a api para pedidos
           $scope.buscarPedidosSeparadosFarmacia("");
           $scope.listarEmpresas("");

        }]);
});
