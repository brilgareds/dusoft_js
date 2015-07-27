define(["angular", "js/services"], function(angular, services) {


    services.factory('ListaPedidosFarmaciasService', 
                    ['$rootScope', 'Request', 'API', 'PedidoFarmacia',
                     'CentroUtilidadPedidoFarmacia','BodegaPedidoFarmacia','FarmaciaPedido',
        function($rootScope, Request, API, PedidoFarmacia,
                 CentroUtilidadPedidoFarmacia, BodegaPedidoFarmacia, FarmaciaPedido) {

            var self = this;
            
            /*
             * @Author: Eduar
             * @param {object} obj
             * +Descripcion: metodo que serializa el pedido en los modelos usado por ListaPedidoController y ListaPedidoTemporalesController
             */
            
            self.crearPedido = function(obj) {

                var pedido = PedidoFarmacia.get();

                var datos_pedido = {
                    numero_pedido: obj.numero_pedido || '',
                    fecha_registro: obj.fecha_registro || '',
                    descripcion_estado_actual_pedido: obj.descripcion_estado_actual_pedido || '',
                    estado_actual_pedido: obj.estado_actual_pedido || '',
                    estado_separacion: obj.estado_separacion || ''
                };

                pedido.setDatos(datos_pedido);
                pedido.setDescripcion(obj.observacion);

                var farmacia = FarmaciaPedido.get(
                        obj.farmacia_id,
                        obj.bodega,
                        obj.nombre_farmacia
                );
                
                             
                var centroUtilidad = CentroUtilidadPedidoFarmacia.get(obj.nombre_farmacia, obj.centro_utilidad);
                var bodega = BodegaPedidoFarmacia.get(obj.nombre_bodega, obj.bodega_id || obj.bodega);
                farmacia.setCentroUtilidadSeleccionado(centroUtilidad).getCentroUtilidadSeleccionado().setBodegaSeleccionada(bodega);
                
                pedido.setFarmaciaOrigen(farmacia);

                return pedido;
            };

            return this;
        }]);
});



