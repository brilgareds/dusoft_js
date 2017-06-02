define(["angular", "js/services"], function(angular, services) {


    services.factory('cajaGeneralService',
            ['Request', 'API', 'CajaGeneral', 'Grupos',
                function(Request, API, CajaGeneral, Grupos) {

                    var self = this;


                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.listarCajaGeneral = function(obj, callback) {
                        Request.realizarRequest(API.CAJA_GENERAL.LISTAR_CAJA_GENERAL, "POST", obj, function(data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.listarGrupos = function(obj, callback) {
                        Request.realizarRequest(API.CAJA_GENERAL.LISTAR_GRUPOS, "POST", obj, function(data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.listarTerceros = function(parametros, callback) {

                        Request.realizarRequest(API.TERCEROS.LISTAR_TERCEROS, "POST", parametros, function(data) {
                            console.log("data:::", data);
                            callback(data);

                        });
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las cajas
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderCajaGeneral = function(caja) {

                        var cajaGeneral = [];

                        caja.forEach(function(dato) {
                            var _cajaGeneral = CajaGeneral.get(dato.caja_id, dato.empresa_id, dato.centro_utilidad);
                            _cajaGeneral.setDescripcionCaja(dato.descripcion3);
                            _cajaGeneral.setNombreEmpresa(dato.descripcion1);
                            _cajaGeneral.setNombreCentroUtilidad(dato.descripcion2);
                            _cajaGeneral.setCuentaTipoId(dato.cuenta_tipo_id);
                            _cajaGeneral.setPrefijoFacContado(dato.prefijo_fac_contado);
                            _cajaGeneral.setPrefijoFacCredito(dato.prefijo_fac_credito);
                            _cajaGeneral.setConceptoCaja(dato.concepto_caja);
                            cajaGeneral.push(_cajaGeneral);
                        });
                        console.log("cajaGeneral", cajaGeneral);
                        return cajaGeneral;
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las cajas
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderGrupos = function(datos) {

                        var grupos = [];

                        datos.forEach(function(dato) {
                            var _grupo = Grupos.get(dato.grupo_concepto, dato.descripcion);
                            _grupo.setPrecio(dato.precio);
                            _grupo.setPorcentajeGravamen(dato.porcentaje_gravamen);
                            _grupo.setSwPrecioManual(dato.sw_precio_manual);
                            _grupo.setSwCantidad(dato.sw_cantidad);
                            _grupo.setConceptoId(dato.concepto_id);
                            grupos.push(_grupo);
                        });
                        console.log("grupo", grupos);
                        return grupos;
                    };


                    return this;
                }]);

});
