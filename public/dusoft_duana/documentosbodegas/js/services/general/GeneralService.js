define(["angular", "js/services"], function(angular, services) {


    services.factory('GeneralService',
            ['$rootScope', 'Request', 'API',"AlertService",
                "Usuario", "$modal", "localStorageService", function($rootScope, Request, API,
                AlertService,$modal, Usuario, localStorageService) {

                    var self = this;

                /*
                 * @Author: Andres Mauricio Gonzalez T.
                 * @fecha 17/03/2017
                 * +Descripcion: elimionar producto en temporal
                 */
               self.eliminarProductoMovimientoBodegaTemporal = function(objs,callback) {

                    var obj = {
                        session: objs.session,
                        data: {
                            item_id: objs.item_id
                        }
                    };

                    Request.realizarRequest(API.INDEX.ELIMINAR_PRODUCTO_MOVIMIENTO_BODEGA_TEMPORAL, "POST", obj, function(data) {
                            callback(data);                        
                    });
                };




                    /*
                     * @Author: Andres Mauricio Gonzalez T.
                     * @fecha 17/03/2017
                     * +Descripcion: adicionar temporal
                     */
                    self.addItemDocTemporal = function(obj, callback) {

                        Request.realizarRequest(API.INDEX.ADD_ITEM_DOC_TEMPORAL, "POST", obj, function(data) {
                            callback(data);
                        });

                    };
                    
                    

                    return this;
                }]);
});