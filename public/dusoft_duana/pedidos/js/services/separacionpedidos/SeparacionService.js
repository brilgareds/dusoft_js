define(["angular", "js/services"], function(angular, services) {


    services.factory('SeparacionService', 
                    ['$rootScope', 'Request', 'API',
                     "$modal", "Usuario","PedidoAuditoria", "Cliente",
                     "Farmacia","ProductoPedido",
        function($rootScope, Request, API,
                 $modal, Usuario,PedidoAuditoria, Cliente,
                 Farmacia, ProductoPedido) {

            var self = this;
            
            /*
             * @Author: Eduar
             * @param {Boolean} esTemporal
             * @param {function} callback
             * +Descripcion: Trae los pedidos asignados al tercero o los que estan en separacion
             */
            self.traerPedidosAsignadosClientes = function(session, filtro, pagina, termino, callback) {
                
                var obj = {
                    session: session,
                    data: {
                        pedidos_clientes: {
                            filtro: filtro.estado,
                            operario_id:0,
                            pagina_actual:pagina,
                            limite:25,
                            termino_busqueda:termino
                        }
                    }
                };
                
                var url = API.SEPARACION_PEDIDOS.CLIENTES.LISTAR_PEDIDOS_OPERARIO_CLIENTE;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                       var pedidos = self.serializarPedidosOperario('1', data.obj.pedidos_clientes);
                       callback(pedidos);

                    } else {
                        callback(false);
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {Object} parametros
             * @param {function} callback
             * +Descripcion: Realiza la peticion para traer los pedidos de farmacias
             */
           self.traerPedidosAsignadosFarmacias = function(session, filtro, pagina, termino, callback) {
                var obj = {
                    session: session,
                    data: {
                        pedidos_farmacias: {
                            filtro: filtro,
                            operario_id:0,
                            pagina_actual:pagina,  
                            limite:25,
                            termino_busqueda:termino
                        }
                    }
                };
                
                var url = API.SEPARACION_PEDIDOS.FARMACIAS.LISTAR_PEDIDOS_OPERARIO_FARMACIA;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                       var pedidos = self.serializarPedidosOperario('2', data.obj.pedidos_farmacias);
                       callback(pedidos);

                    } else {
                        callback(false);
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {Object} parametros
             * @param {function} callback
             * +Descripcion: Realiza la peticion para traer los pedidos de farmacias
             */
           self.traerDocumentoTemporal = function(session, pedido, callback) {
               var url = API.SEPARACION_PEDIDOS.CLIENTES.CONSULTAR_TEMPORAL_CLIENTES;
               if(pedido.getTipo() === '2'){
                   url = API.SEPARACION_PEDIDOS.FARMACIAS.CONSULTAR_TEMPORAL_FARMACIAS;
               }
               
                var obj = {
                    session: session,
                    data: {
                        documento_temporal: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
                };
                

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                      console.log("pedidos clientes >>>>>>>> ", data);

                    } else {
                        callback(false);
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {String} tipoPedido
             * @param {Array<Object>} pedidos
             * +Descripcion: Serializa los objetos necesarios del modulo
             */
            self.serializarPedidosOperario = function(tipoPedido, pedidos){
                var listaPedidos  = [];
                for(var i in pedidos){
                    var _pedido = pedidos[i];
                    var agregar = false;
                    var estado_separacion = (_pedido.estado_separacion === null)?"0":_pedido.estado_separacion;
                    //Valida el tipo a agregar dependiendo del tipo de pedido 1= cliente y 2= farmacia
                    if (_pedido.documento_temporal_id === null){
                       agregar = true;
                    } else if(_pedido.documento_temporal_id !== null && estado_separacion === "0"){
                        
                       agregar = true;
                    } 
                    
                    if(agregar){
                        var pedido = PedidoAuditoria.get();
                        pedido.setTipo(tipoPedido);
                        
                        //Se hace un set del cliente o la farmacia dependiendo del tipo de pedido
                        if(tipoPedido === '1'){
                            var cliente = Cliente.get(_pedido.nombre_cliente, _pedido.direccion_cliente, _pedido.tipo_id_cliente, _pedido.identificacion_cliente);
                            pedido.setCliente(cliente);
                        } else {
                            var farmacia = Farmacia.get(
                                _pedido.farmacia_id, _pedido.bodega_id, _pedido.nombre_farmacia, 
                                _pedido.nombre_bodega, _pedido.centro_utilidad
                            );
                            
                            pedido.setFarmacia(farmacia);
                        }
                        
                        pedido.setDatos(_pedido);
                        pedido.agregarDetallePedido(ProductoPedido, _pedido.lista_productos);
                        pedido.setCantidadProductos(pedido.getProductos().length);
                        listaPedidos.push(pedido);
                    }
                }
                
                return listaPedidos;
                                
            };
           

            return this;
        }]);
});



