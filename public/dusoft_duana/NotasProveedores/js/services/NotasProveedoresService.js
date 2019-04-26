define(["angular", "js/services"], function (angular, services) {

    services.factory('NotasProveedoresService',
        ['Request', 'API',
            function (Request, API) {
                const self = this;

                let post = (url, obj, callback) => {
                    Request.realizarRequest(url, "POST", obj, data => callback(data) );
                };

                self.TiposDoc = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.TIPOS_DOC, obj, callback);
                };

                self.listarNotas = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.LISTAR_NOTAS, obj, callback);
                };

                self.agregarDetalleTemporal = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.AGREGAR_DETALLE_TEMPORAL, obj, callback);
                };

                self.conceptosEspecificos = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.CONCEPTOS_ESPECIFICOS, obj, callback);
                };

                self.agregarDetalleTemporal = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.AGREGAR_DETALLE_TEMPORAL, obj, callback);
                };

                self.eliminarProductoTemporal = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.ELIMINAR_PRODUCTO_TEMPORAL, obj , callback);
                };

                self.crearNota = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.CREAR_NOTA, obj, callback);
                };

                self.crearNotaTemporal = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.CREAR_NOTA_TEMPORAL, obj, callback);
                };

                self.verNotasFactura = (obj, callback) => {
                    post(API.NOTAS_PROVEEDORES.VER_NOTAS_FACTURA, obj, callback);
                };

                return this;
            }
        ]
    );
});
