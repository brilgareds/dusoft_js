define(["angular", "js/services"], function (angular, services) {


    services.factory('facturacionProveedoresService',
            ['Request', 'API', "OrdenesComprasProveedores",

                function (Request, API, OrdenesComprasProveedores) {

                    var self = this;


                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  21/05/2016 DD/MM/YYYYY
                     * +Descripcion lista todas las ordenes de compra proveedores
                     */
                    self.listarOrdenCompraProveedores = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONPROVEEDOR.LISTAR_ORDENES_COMPRA_PROVEEDORES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las ordenes de compra de proveedores
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderOrdenesComprasProveedores = function (comprasProveedores) {
                      
                        var compras = [];
                        
                        comprasProveedores.forEach(function(data) { 
                                                                                       
                                var ordenComp = OrdenesComprasProveedores.get(data.orden_pedido_id,data.estado,data.observacion,data.fecha_orden);
                                ordenComp.set_empresa(data.empresa_id);
                                ordenComp.set_proveedor(data.codigo_proveedor_id);
                                ordenComp.set_sw_unificada(data.sw_unificada);
                                ordenComp.set_unidad_negocio(data.codigo_unidad_negocio);
                                ordenComp.set_sw_orden_compra_finalizada(data.sw_orden_compra_finalizada);
                                ordenComp.set_nombre_usuario(data.nombre);
                                ordenComp.set_nombre_proveedor(data.nombre_tercero);
                                ordenComp.set_prefijo(data.prefijo);
                                ordenComp.set_numero(data.numero);
                                ordenComp.set_recepcion_parcial(data.recepcion_parcial_id);
                                compras.push(ordenComp);
                                
                            });
                        
                        return compras;
                    };

                    
                    return this;
                }]);

});