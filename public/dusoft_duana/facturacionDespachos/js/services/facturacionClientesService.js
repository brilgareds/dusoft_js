define(["angular", "js/services"], function (angular, services) {


    services.factory('facturacionClientesService',
            ['Request', 'API', "Usuario", "TipoTerceros","TerceroDespacho",

                function (Request, API, Usuario,TipoTerceros,TerceroDespacho) {

                    var self = this;



                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion Consulta todas las formulas
                     */
                    self.listarTiposTerceros = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_TIPOS_TERCEROS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarClientes = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_CLIENTES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarFacturasGeneradas = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_FACTURAS_GENERADAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Cristian Ardila
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene los tipos de documentos
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderListarTipoTerceros = function (tipoDocumento) {
                       
                        var tipoDocumentos = [];
                        for (var i in tipoDocumento) {

                            var _tipoDocumento = TipoTerceros.get(tipoDocumento[i].id, tipoDocumento[i].descripcion);
                            tipoDocumentos.push(_tipoDocumento);
                        }
                        return tipoDocumentos;
                    };

                    
                    /**
                     * +Descripcion Metodo encargado de serializar el resultado de
                     *              la consulta que obtiene los clientes
                     * @param {type} tipoDocumento
                     * @returns {Array|nm$_shim-array.exports}
                     */
                    self.renderTerceroDespacho = function (tipoDocumento) {
                       
                        var tercerosDespacho = [];
                        for (var i in tipoDocumento) {

                            var _terceroDespacho = TerceroDespacho.get(tipoDocumento[i].nombre_tercero, tipoDocumento[i].tipo_id_tercero, 
                                                    tipoDocumento[i].tercero_id,
                                                    tipoDocumento[i].direccion,
                                                    tipoDocumento[i].telefono);
                                _terceroDespacho.setEmail(tipoDocumento[i].email); 
                                _terceroDespacho.setTipoBloqueoId(tipoDocumento[i].tipo_bloqueo_id); 
                                _terceroDespacho.setMunicipio(tipoDocumento[i].municipio); 
                                _terceroDespacho.setDepartamento(tipoDocumento[i].departamento); 
                                _terceroDespacho.setPais(tipoDocumento[i].pais); 
                          
                            tercerosDespacho.push(_terceroDespacho);
                        }
                        return tercerosDespacho;
                    };
                    
                    return this;
                }]);

});



