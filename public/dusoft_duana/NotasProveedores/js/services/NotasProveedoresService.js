define(["angular", "js/services"], function (angular, services) {

    services.factory('NotasProveedoresService',
        ['Request', 'API',
            function (Request, API) {
                var self = this;

                self.TiposDoc = function (obj, callback) {
                    Request.realizarRequest(API.NOTAS_PROVEEDORES.TIPOS_DOC, "POST", obj, function (data) {
                        callback(data);
                    });
                };

                self.listarNotasProveedores = function (obj, callback) {
                    Request.realizarRequest(API.NOTAS_PROVEEDORES.LISTAR_NOTAS, "POST", obj, function (data) {
                        callback(data);
                    });
                };

                self.listarNotasProveedores = function (obj, callback) {
                    Request.realizarRequest(API.NOTAS_PROVEEDORES.LISTAR_NOTAS, "POST", obj, function (data) {
                        callback(data);
                    });
                };

                self.guardarTemporalDetalle = function(obj, callback) {
                    Request.realizarRequest(API.NOTAS_PROVEEDORES.GUARDAR_TEMPORAL_DETALLE, 'POST', obj, function(data){
                        callback(data);
                    })
                };

                return this;
            }
        ]
    );
});
