
/* global G */

var PlanillasDespachos = function (planillas_despachos, e008, pedidos_farmacias, eventos_pedidos_farmacias, pedidos_clientes, eventos_pedidos_clientes, emails) {

    this.m_planillas_despachos = planillas_despachos;

    this.m_e008 = e008;

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

    this.emails = emails;
};


PlanillasDespachos.prototype.listarPlanillasDespachos = function (req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.fecha_inicial === undefined || args.planillas_despachos.fecha_final === undefined || args.planillas_despachos.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final o termino_busqueda no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.fecha_inicial === '' || args.planillas_despachos.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial o fecha_final estan vacíos', 404, {}));
        return;
    }

    var fecha_inicial = args.planillas_despachos.fecha_inicial;
    var fecha_final = args.planillas_despachos.fecha_final;
    var termino_busqueda = args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.listar_planillas_despachos(fecha_inicial, fecha_final, termino_busqueda, function (err, lista_planillas_despachos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las planillas_despachos', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de planillas_despachos', 200, {planillas_despachos: lista_planillas_despachos}));
        }
    });
};

// Consultar los documentos de despacho de una farmacia 
PlanillasDespachos.prototype.consultarDocumentosDespachosPorFarmacia = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.empresa_id === undefined || args.planillas_despachos.farmacia_id === undefined || args.planillas_despachos.centro_utilidad_id === undefined) {

        res.send(G.utils.r(req.url, 'El empresa_id, farmacia_id o centro_utilidad_id NO estan definidos', 404, {}));
        return;
    }

    if (args.planillas_despachos.empresa_id === "" || args.planillas_despachos.farmacia_id === "" || args.planillas_despachos.centro_utilidad_id === "") {
        res.send(G.utils.r(req.url, 'El empresa_id, farmacia_id o centro_utilidad_id estan vacios', 404, {}));
        return;
    }

    var parametros = {
        empresa_id: args.planillas_despachos.empresa_id,
        farmacia_id: args.planillas_despachos.farmacia_id,
        centro_utilidad_id: args.planillas_despachos.centro_utilidad_id,
        termino_busqueda: (args.planillas_despachos.termino_busqueda === undefined) ? '' : args.planillas_despachos.termino_busqueda,
        estadoListarValidacionDespachos: (args.planillas_despachos.estadoValidarDespachos === undefined) ? 0 : args.planillas_despachos.estadoValidarDespachos
    };

    that.m_planillas_despachos.consultar_documentos_despachos_por_farmacia(parametros, function (err, lista_documendos_despachos) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Documentos Despachos Clientes', 200, {planillas_despachos: lista_documendos_despachos}));
            return;
        }
    });
};

// Consultar los documentos de despacho de un cliente 
PlanillasDespachos.prototype.consultarDocumentosDespachosPorCliente = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.empresa_id === undefined || args.planillas_despachos.tipo_id === undefined || args.planillas_despachos.tercero_id === undefined) {

        res.send(G.utils.r(req.url, 'El empresa_id, tipo_id o tercero_id NO estan definidos', 404, {}));
        return;
    }

    if (args.planillas_despachos.empresa_id === "" || args.planillas_despachos.tipo_id === "" || args.planillas_despachos.tercero_id === "") {
        res.send(G.utils.r(req.url, 'El empresa_id, tipo_id o tercero_id estan vacios', 404, {}));
        return;
    }

    var parametros = {
        empresa_id: args.planillas_despachos.empresa_id,
        tipo_id: args.planillas_despachos.tipo_id,
        tercero_id: args.planillas_despachos.tercero_id,
        termino_busqueda: (args.planillas_despachos.termino_busqueda === undefined) ? '' : args.planillas_despachos.termino_busqueda,
        estadoListarValidacionDespachos: (args.planillas_despachos.estadoValidarDespachos === undefined) ? 0 : args.planillas_despachos.estadoValidarDespachos
    };

    that.m_planillas_despachos.consultar_documentos_despachos_por_cliente(parametros, function (err, lista_documendos_despachos) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Documentos Despachos Clientes', 200, {planillas_despachos: lista_documendos_despachos}));
            return;
        }
    });
};

PlanillasDespachos.prototype.consultarPlanillaDespacho = function (req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;

    that.m_planillas_despachos.consultar_planilla_despacho(planilla_id, function (err, planilla_despacho) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado la planilla', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Planilla despacho', 200, {planillas_despachos: planilla_despacho}));
        }
    });
};

PlanillasDespachos.prototype.consultarDocumentosPlanillaDespacho = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined || args.planillas_despachos.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === '') {
        res.send(G.utils.r(req.url, 'planilla_id esta vacio', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var termino_busqueda = args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.consultar_documentos_planilla_despacho(planilla_id, termino_busqueda, function (err, planilla_despacho) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos de la  planilla', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Documentos planilla despacho', 200, {planillas_despachos: planilla_despacho}));
        }
    });
};

PlanillasDespachos.prototype.consultarDocumentosPlanillaDespachoDetalle = function (req, res) {

    var that = this;

    var args = req.body.data;
console.log("args::: ",args);
    if (args.planillas_despachos === undefined) {
        res.send(G.utils.r(req.url, 'No se definieron parametros de consulta', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var termino_busqueda = args.planillas_despachos.termino_busqueda;
    var obj = args.planillas_despachos.tercero;
        obj.registro_salida_bodega_id = args.planillas_despachos.registro_salida_bodega_id;
    
    var obj = {}; 
    if(args.planillas_despachos.tercero !== undefined){
      obj = args.planillas_despachos.tercero;
    }
    if(args.planillas_despachos.modificar !== undefined){
      obj.modificar = args.planillas_despachos.modificar;
    }

    that.m_planillas_despachos.consultar_documentos_planilla_despacho_detalle(planilla_id, termino_busqueda, obj, function (err, planilla_despacho) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos de la  planilla', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Documentos planilla despacho', 200, {planillas_despachos: planilla_despacho}));
        }
    });
};

PlanillasDespachos.prototype.generarPlanillaDespacho = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.pais_id === undefined || args.planillas_despachos.departamento_id === undefined || args.planillas_despachos.ciudad_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.transportador_id === undefined || args.planillas_despachos.nombre_conductor === undefined || args.planillas_despachos.observacion === undefined) {
        res.send(G.utils.r(req.url, 'transportador_id, nombre_conductor u observacion no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.numero_guia_externo === undefined) {
        res.send(G.utils.r(req.url, 'numero_guia_externo no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.numero_placa_externo === undefined) {
        res.send(G.utils.r(req.url, 'numero_placa_externo no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.pais_id === '' || args.planillas_despachos.departamento_id === '' || args.planillas_despachos.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id  estan vacias', 404, {}));
        return;
    }

    if (args.planillas_despachos.transportador_id === '' || args.planillas_despachos.nombre_conductor === '' || args.planillas_despachos.observacion === '') {
        res.send(G.utils.r(req.url, 'transportador_id, nombre_conductor u observacion esta vacia', 404, {}));
        return;
    }


    var parametros = {
        pais_id: args.planillas_despachos.pais_id,
        departamento_id: args.planillas_despachos.departamento_id,
        ciudad_id: args.planillas_despachos.ciudad_id,
        transportador_id: args.planillas_despachos.transportador_id,
        nombre_conductor: args.planillas_despachos.nombre_conductor,
        observacion: args.planillas_despachos.observacion,
        numero_guia_externo: args.planillas_despachos.numero_guia_externo,
        numero_placa_externo: args.planillas_despachos.numero_placa_externo,
        tipo_planilla: args.planillas_despachos.tipo_planilla,
        usuario_id: req.session.user.usuario_id
    };


    that.m_planillas_despachos.ingresar_planilla_despacho(parametros, function (err, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {

            var numero_guia = (result.length > 0) ? result[0] : 0;

            res.send(G.utils.r(req.url, 'Planilla despacho regitrada correctamente', 200, {numero_guia: numero_guia}));
            return;
        }
    });

};


PlanillasDespachos.prototype.ingresarDocumentosPlanillaDespacho = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined || args.planillas_despachos.empresa_id === undefined || args.planillas_despachos.prefijo === undefined || args.planillas_despachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidad_cajas === undefined || args.planillas_despachos.cantidad_neveras === undefined || args.planillas_despachos.temperatura_neveras === undefined || args.planillas_despachos.observacion === undefined) {
        res.send(G.utils.r(req.url, 'cantidad_cajas, cantidad_neveras, temperatura_neveras u observacion no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.tipo === undefined) {
        res.send(G.utils.r(req.url, 'tipo no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === undefined || args.planillas_despachos.empresa_id === undefined || args.planillas_despachos.prefijo === undefined || args.planillas_despachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero esta vacios', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidad_cajas === '') {
        res.send(G.utils.r(req.url, 'cantidad_cajas esta vacio', 404, {}));
        return;
    }

    if (args.planillas_despachos.tipo === '') {
        res.send(G.utils.r(req.url, 'tipo esta vacio', 404, {}));
        return;
    }

    var tipo = args.planillas_despachos.tipo; // 0= farmacias 1 = clientes 2 = Otras empresas    
    var tabla = ["inv_planillas_detalle_farmacias", "inv_planillas_detalle_clientes", "inv_planillas_detalle_empresas"];

    tabla = tabla[tipo];

    if (tabla === undefined) {
        res.send(G.utils.r(req.url, 'el tipo no es valido', 404, {}));
        return;
    }

    var empresa_id = args.planillas_despachos.empresa_id;
    var prefijo = args.planillas_despachos.prefijo;
    var numero = args.planillas_despachos.numero;
    var estado_pedido = ''; // 3 => En zona despacho, 9 => en zona con pdtes
    var responsable = null;
    var usuario_id = req.session.user.usuario_id;

    var parametros = {
        planilla_id: args.planillas_despachos.planilla_id,
        empresa_id: args.planillas_despachos.empresa_id,
        prefijo: args.planillas_despachos.prefijo,
        numero: args.planillas_despachos.numero,
        cantidad_cajas: args.planillas_despachos.cantidad_cajas,
        cantidad_neveras: (args.planillas_despachos.cantidad_neveras === '') ? 0 : args.planillas_despachos.cantidad_neveras,
        temperatura_neveras: (args.planillas_despachos.temperatura_neveras === '') ? null : args.planillas_despachos.temperatura_neveras,
        observacion: args.planillas_despachos.observacion,
        tipo: tipo,
        usuario_id: req.session.user.usuario_id
    };

    if (tipo === '2') {
        parametros.empresa_cliente = args.planillas_despachos.empresa_cliente;
        parametros.centro_cliente = args.planillas_despachos.centro_cliente;
        parametros.bodega_cliente = args.planillas_despachos.bodega_cliente;
    }

    // Ingresar el documento a la planilla de despacho
    that.m_planillas_despachos.ingresar_documentos_planilla(tabla, parametros, function (err, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {

            if (tipo === '2') {
                // Otras Empresas
                res.send(G.utils.r(req.url, 'Documento regitrado correctamente', 200, {planillas_despachos: {}}));
                return;
            }

            // Registrar los responsables del pedido, y notificar en tiempo real
            that.m_e008.consultar_documento_despacho(numero, prefijo, empresa_id, usuario_id, function (err, documento_bodega) {

                if (err || documento_bodega.length === 0) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el documento', 500, {planillas_despachos: []}));
                    return;
                } else {
                    documento_bodega = documento_bodega[0];

                    var numero_pedido = documento_bodega.numero_pedido;
                    var estado_actual_pedido = documento_bodega.estado_pedido;

                    if (estado_actual_pedido === '2') {
                        // si es auditado => pasa a Zona de despacho
                        estado_pedido = '3';
                    } else if (estado_actual_pedido === '8') {
                        // si es auditado con pdtes => pasa a Zona con pdtes
                        estado_pedido = '9';
                    } else {
                        estado_pedido = estado_actual_pedido;
                    }


                    if (tipo === '0') {
                        // Farmacias
                        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario_id, function (err, rows, responsable_estado_pedido) {

                            if (!err) {
                                // Notificando Pedidos Actualizados en Real Time
                                that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                res.send(G.utils.r(req.url, 'Documento regitrado correctamente', 200, {planillas_despachos: {}}));
                                return;
                            }
                        });
                    }

                    if (tipo === '1') {
                        // Clientes
                        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario_id, function (err, rows, responsable_estado_pedido) {

                            if (!err) {
                                // Notificando Pedidos Actualizados en Real Time
                                that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                res.send(G.utils.r(req.url, 'Documento regitrado correctamente', 200, {planillas_despachos: {}}));
                                return;
                            }
                        });
                    }
                }
            });
        }
    });
};

PlanillasDespachos.prototype.eliminarDocumentoPlanilla = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined || args.planillas_despachos.empresa_id === undefined || args.planillas_despachos.prefijo === undefined || args.planillas_despachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.tipo === undefined) {
        res.send(G.utils.r(req.url, 'tipo no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === '' || args.planillas_despachos.empresa_id === '' || args.planillas_despachos.prefijo === '' || args.planillas_despachos.numero === '') {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero estan vacios', 404, {}));
        return;
    }

    if (args.planillas_despachos.tipo === '') {
        res.send(G.utils.r(req.url, 'tipo esta vacio', 404, {}));
        return;
    }

    var tipo = args.planillas_despachos.tipo; // 0= farmacias 1 = clientes 2 = Otras empresas    
    var tabla = ["inv_planillas_detalle_farmacias", "inv_planillas_detalle_clientes", "inv_planillas_detalle_empresas"];

    tabla = tabla[tipo];

    if (tabla === undefined) {
        res.send(G.utils.r(req.url, 'el tipo no es valido', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var empresa_id = args.planillas_despachos.empresa_id;
    var prefijo = args.planillas_despachos.prefijo;
    var numero = args.planillas_despachos.numero;
    var usuario_id = req.session.user.usuario_id;
    var estado_pedido = '';

    that.m_planillas_despachos.eliminar_documento_planilla(tabla, planilla_id, empresa_id, prefijo, numero, function (err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {

            if (tipo === '2') {
                // Otras Empresas
                res.send(G.utils.r(req.url, 'Documento eliminado correctamente', 200, {planillas_despachos: {}}));
                return;
            }

            // Registrar los responsables del pedido, y notificar en tiempo real
            that.m_e008.consultar_documento_despacho(numero, prefijo, empresa_id, usuario_id, function (err, documento_bodega) {

                if (err || documento_bodega.length === 0) {
                    res.send(G.utils.r(req.url, 'Se ha generado un error consultado el documento', 500, {planillas_despachos: []}));
                    return;
                } else {

                    documento_bodega = documento_bodega[0];

                    var numero_pedido = documento_bodega.numero_pedido;
                    var estado_actual_pedido = documento_bodega.estado_pedido;

                    if (estado_actual_pedido === '3') {
                        // si es Zona de despacho  => pasa a auditado                        
                        estado_pedido = '2';
                    } else if (estado_actual_pedido === '9') {
                        // si es Zona con pdtes => pasa a auditado con pdtes
                        estado_pedido = '8';
                    } else {
                        estado_pedido = estado_actual_pedido;
                    }


                    if (tipo === '0') {
                        // Farmacias
                        that.m_pedidos_farmacias.eliminar_responsables_pedidos(numero_pedido, function (err, rows, resultado) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 0', 500, {}));
                                return;
                            } else {
                                that.m_pedidos_farmacias.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function (err, rows) {
                                    // Notificando Pedidos Actualizados en Real Time
                                    that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                    res.send(G.utils.r(req.url, 'Documento eliminado correctamente', 200, {planillas_despachos: {}}));
                                    return;
                                });
                            }
                        });
                    }

                    if (tipo === '1') {
                        // Clientes   
                        that.m_pedidos_clientes.eliminar_responsables_pedidos(numero_pedido, function (err, rows, resultado) {
                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1', 500, {}));
                                return;
                            } else {
                                that.m_pedidos_clientes.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function (err, rows) {

                                    // Notificando Pedidos Actualizados en Real Time
                                    that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                                    res.send(G.utils.r(req.url, 'Documento eliminado correctamente', 200, {planillas_despachos: {}}));
                                    return;
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};

PlanillasDespachos.prototype.despacharPlanilla = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === '') {
        res.send(G.utils.r(req.url, 'planilla_id esta vacio', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var estado = '2'; // 0 = Anulada, 1 = Activa, 2 = Desachada

    that.m_planillas_despachos.consultar_documentos_planilla_despacho(planilla_id, '', function (err, documentos_planilla) {

        if (err || documentos_planilla.length === 0) {

            res.send(G.utils.r(req.url, 'Error Interno code 1', 500, {planillas_despachos: []}));
            return;
        } else {


            __despachar_documentos_planilla(that, 0, documentos_planilla, {continuar: true, msj: ''}, function (resultado) {

                if (!resultado.continuar) {
                    res.send(G.utils.r(req.url, resultado.msj, 500, {planillas_despachos: []}));
                    return;
                } else {
                    that.m_planillas_despachos.modificar_estado_planilla_despacho(planilla_id, estado, function (err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Interno code 4', 500, {planillas_despachos: []}));
                            return;
                        } else {

                            res.send(G.utils.r(req.url, 'Planilla despachada correctamente', 200, {planillas_despachos: {}}));
                            return;
                        }
                    });
                }
            });
        }
    });
};

// Generar Reporte Planilla Despacho
PlanillasDespachos.prototype.reportePlanillaDespacho = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definidas', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === '' || args.planillas_despachos.planilla_id === 0 || args.planillas_despachos.planilla_id === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el planilla_id', 404, {}));
        return;
    }

    if (args.planillas_despachos.enviar_email !== undefined) {

        if (args.planillas_despachos.emails === undefined || args.planillas_despachos.subject === undefined || args.planillas_despachos.message === undefined) {
            res.send(G.utils.r(req.url, 'emails, subject o message no esta definidas', 404, {}));
            return;
        }

        if (args.planillas_despachos.emails.length === 0 || args.planillas_despachos.subject === '') {
            res.send(G.utils.r(req.url, 'emails, subject o message estan vacios', 404, {}));
            return;
        }

        var emails = args.planillas_despachos.emails;
        var subject = args.planillas_despachos.subject;
        var message = args.planillas_despachos.message;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var enviar_email = args.planillas_despachos.enviar_email;

    that.m_planillas_despachos.consultar_planilla_despacho(planilla_id, function (err, planilla_despacho) {


        if (err || planilla_despacho.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {

            that.m_planillas_despachos.consultar_documentos_planilla_despacho(planilla_id, '', function (err, lista_documentos) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
                    return;
                } else {

                    planilla_despacho = planilla_despacho[0];

                    // Lista Documentos
                    var datos = [];
                    lista_documentos.forEach(function (documento) {

                        var clienteSede = documento.descripcion_destino;
                        if (documento.descripcion_sede !== null && documento.descripcion_sede !== '') {
                            clienteSede = documento.descripcion_sede;
                        }


                        if (datos[clienteSede]) {
                            datos[clienteSede].push(documento);
                        } else {
                            datos[clienteSede] = [documento];
                        }
                    });

                    var documentos = [];
                    for (var z in datos) {
                        var direccion = datos[z][0].direccion_destino;
                        if (datos[z][0].direccion_sede !== '') {
                            direccion = datos[z][0].direccion_sede;
                        }


//                        documentos.push({tercero: z, detalle: datos[z]});
                        documentos.push({tercero: z, ciudad: datos[z][0].ciudad, direccion: direccion, detalle: datos[z]});
                    }

                    _generar_reporte_planilla_despacho({planilla_despacho: planilla_despacho, documentos_planilla: documentos, usuario_imprime: req.session.user.nombre_usuario, serverUrl: req.protocol + '://' + req.get('host') + "/"}, function (nombre_reporte) {

                        if (enviar_email) {

                            var path = G.dirname + "/public/reports/" + nombre_reporte;
                            var filename = "PlanillaGuiaNo-" + planilla_id + '.pdf';

                            __enviar_correo_electronico(that, emails, path, filename, subject, message, function (enviado) {

                                if (!enviado) {
                                    res.send(G.utils.r(req.url, 'Se genero un error al enviar el reporte', 500, {planillas_despachos: {nombre_reporte: nombre_reporte}}));
                                    return;
                                } else {
                                    res.send(G.utils.r(req.url, 'Reporte enviado correctamente', 200, {planillas_despachos: {nombre_reporte: nombre_reporte}}));
                                    return;
                                }
                            });
                        } else {
                            res.send(G.utils.r(req.url, 'Nombre Reporte', 200, {planillas_despachos: {nombre_reporte: nombre_reporte}}));
                            return;
                        }
                    });
                }
            });
        }
    });
};

function __despachar_documentos_planilla(contexto, i, documentos_planilla, resultado, callback) {

    var that = contexto;

    if (i < documentos_planilla.length) {

        var documento = documentos_planilla[i];
        var empresa_id = documento.empresa_id;
        var numero = documento.numero;
        var prefijo = documento.prefijo;
        var tipo = documento.tipo;
        var estado_pedido = '';
        var usuario_id = documento.usuario_id;

        that.m_e008.consultar_documento_despacho(numero, prefijo, empresa_id, usuario_id, function (err, documento_bodega) {


            if (err) {
                resultado.continuar = false;
                resultado.msj += ' Error Interno code 1. ';

                __despachar_documentos_planilla(contexto, ++i, documentos_planilla, resultado, callback);

            } else {

                if (tipo === '2') {
                    __despachar_documentos_planilla(contexto, ++i, documentos_planilla, resultado, callback);
                    return;
                }

                documento_bodega = documento_bodega[0];

                var numero_pedido = documento_bodega.numero_pedido;
                var estado_actual_pedido = documento_bodega.estado_pedido;

                if (estado_actual_pedido === '3') {
                    // si es Zona de despacho  => pasa a Despachado
                    estado_pedido = '3';
                } else if (estado_actual_pedido === '9') {
                    // si es Zona con pdtes => pasa a Despachado con pdtes                    
                    estado_pedido = '9';
                } else {
                    estado_pedido = estado_actual_pedido;
                }

                if (tipo === '0') {
                    // Farmacias
                    that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, null, usuario_id, function (err, rows, responsable_estado_pedido) {

                        if (err) {
                            resultado.continuar = false;
                            resultado.msj += ' Error Interno code 2. ';
                        }
                        // Notificando Pedidos Actualizados en Real Time                        
                        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                        that.m_pedidos_farmacias.terminar_estado_pedido(numero_pedido, [estado_actual_pedido, estado_pedido], '1', function (err, rows, results) {

                            if (err) {
                                resultado.continuar = false;
                                resultado.msj += ' Error Interno code 2.1';
                            }
                            __despachar_documentos_planilla(contexto, ++i, documentos_planilla, resultado, callback);
                        });

                    });
                }

                if (tipo === '1') {

                    // Clientes
                    that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, null, usuario_id, function (err, rows, responsable_estado_pedido) {

                        if (err) {
                            resultado.continuar = false;
                            resultado.msj += ' Error Interno code 3. ';
                        }
                        // Notificando Pedidos Actualizados en Real Time                            
                        that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                        that.m_pedidos_clientes.terminar_estado_pedido(numero_pedido, [estado_actual_pedido, estado_pedido], '1', function (err, rows, results) {

                            if (err) {
                                resultado.continuar = false;
                                resultado.msj += ' Error Interno code 3.1';
                            }
                            __despachar_documentos_planilla(contexto, ++i, documentos_planilla, resultado, callback);
                        });
                    });
                }

            }
        });

    } else {

        callback(resultado);
    }
}

function _generar_reporte_planilla_despacho(rows, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/PlanillasDespachos/reports/planilla_despacho.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/PlanillasDespachos/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender',
        },
        data: {
            style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            planilla_despacho: rows.planilla_despacho,
            documentos_planilla: rows.documentos_planilla,
            fecha_actual: new Date().toFormat('DD/MM/YYYY HH24:MI:SS'),
            usuario_imprime: rows.usuario_imprime,
            serverUrl: rows.serverUrl
        }
    }, function (err, response) {

        response.body(function (body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function (err) {

                if (err) {
                    console.log('=== Se ha generado un error generando el reporte ====');
                } else {
                    callback(nombre_reporte);
                }
            });

        });
    });
}

function __enviar_correo_electronico(that, to, ruta_archivo, nombre_archivo, subject, message, callback) {

    var smtpTransport = that.emails.createTransport("SMTP", {
        host: G.settings.email_host, // hostname
        secureConnection: true, // use SSL
        port: G.settings.email_port, // port for secure SMTP
        auth: {
            user: G.settings.email_user,
            pass: G.settings.email_password
        }
    });

    var settings = {
        from: G.settings.email_sender,
        to: to,
        subject: subject,
        html: message,
        attachments: [{'filename': nombre_archivo, 'contents': G.fs.readFileSync(ruta_archivo)}]
    };

    smtpTransport.sendMail(settings, function (error, response) {

        if (error) {
            callback(false);
            return;
        } else {
            smtpTransport.close();
            callback(true);
            return;
        }
    });
}
;



PlanillasDespachos.prototype.consultarCantidadCajaNevera = function (req, res) {



    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined ||
            args.planillas_despachos.empresa_id === undefined ||
            args.planillas_despachos.prefijo === undefined ||
            args.planillas_despachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa esta vacio', 404, {}));
        return;
    }

    if (args.planillas_despachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'el numero de prefijo esta vacio', 404, {}));
        return;
    }

    if (args.planillas_despachos.numero === '') {
        res.send(G.utils.r(req.url, 'el numero esta vacio', 404, {}));
        return;
    }

    var empresa_id = args.planillas_despachos.empresa_id;
    var prefijo = args.planillas_despachos.prefijo;
    var numero = args.planillas_despachos.numero;
    var esPlanillas = args.planillas_despachos.esPlanillas || false;

    var obj = {
        empresa_id: empresa_id,
        prefijo: prefijo,
        numero: numero,
        tipo: 0,
        esPlanillas: esPlanillas
    };

    G.Q.ninvoke(that.m_planillas_despachos, 'consultarCantidadCajaNevera', obj).then(function (resultado) {

        obj.totalCajas = (resultado.length > 0) ? resultado[0].total_cajas : 0;
        obj.totalNeveras = (resultado.length > 0) ? resultado[0].total_neveras : 0;

        res.send(G.utils.r(req.url, 'Cantidades de cajas y neveras', 200, {planillas_despachos: obj}));
    }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error consultado las cantidades', 500, {planillas_despachos: {}}));
            }).done();



};



/**
 *@author Cristian Ardila
 *@fecha  06/02/2016
 *+Descripcion Controlador encargado de consultar el total de cajas de un conjunto
 *             de documentos 
 **/
PlanillasDespachos.prototype.gestionarLios = function (req, res) {

    var that = this;

    var args = req.body.data;


    if (args.planillas_despachos === undefined) {
        res.send(G.utils.r(req.url, 'planillas_despachos no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.documentos === undefined) {
        res.send(G.utils.r(req.url, 'La variable documentos no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.totalCaja === undefined || args.planillas_despachos.totalCaja === '' || args.planillas_despachos.totalCaja === '0') {
        res.send(G.utils.r(req.url, 'la cantidad de cajas debe estar definido y no puede estar en cero', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidadLios === undefined || args.planillas_despachos.cantidadLios === '' || args.planillas_despachos.cantidadLios === '0') {
        res.send(G.utils.r(req.url, 'la cantidad de lios debe estar definido y no puede estar en cero', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidadNeveras === undefined || args.planillas_despachos.cantidadNeveras === '' || args.planillas_despachos.cantidadNeveras === '0') {
        res.send(G.utils.r(req.url, 'la cantidad de neveras debe estar definido y no puede estar en cero', 404, {}));
        return;
    }

    args.planillas_despachos.usuario_id = req.session.user.usuario_id;
    var temperatura = parseInt(args.planillas_despachos.cantidadNeveras) > 0 ? '3.2' : '0';

    args.planillas_despachos.temperatura = temperatura;

    G.Q.ninvoke(that.m_planillas_despachos, 'consecutivoLio').then(function (resultado) {

        args.planillas_despachos.consecutivoLio = resultado[0].nextval;

        return G.Q.ninvoke(that.m_planillas_despachos, 'insertarLioDocumento', args.planillas_despachos);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Se insertan satisfactoriamente los lios', 200, {planillas_despachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error interno', 500, {planillas_despachos: {}}));

    }).done();

};

/**
 * @author German Galvis
 * @fecha 29/04/2019
 *+Descripcion Controlador encargado de actualizar la cantidad de cajas o neveras de un lio
 **/
PlanillasDespachos.prototype.modificarLios = function (req, res) {

    var that = this;

    var args = req.body.data;


    if (args.planillas_despachos === undefined) {
        res.send(G.utils.r(req.url, 'planillas_despachos no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.documentos === undefined) {
        res.send(G.utils.r(req.url, 'La variable documentos no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.totalCaja === undefined || args.planillas_despachos.totalCaja === '' || args.planillas_despachos.totalCaja === '0') {
        res.send(G.utils.r(req.url, 'la cantidad de cajas debe estar definido y no puede estar en cero', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidadLios === undefined || args.planillas_despachos.cantidadLios === '' || args.planillas_despachos.cantidadLios === '0') {
        res.send(G.utils.r(req.url, 'la cantidad de lios debe estar definido y no puede estar en cero', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidadNeveras === undefined || args.planillas_despachos.cantidadNeveras === '' || args.planillas_despachos.cantidadNeveras === '0') {
        res.send(G.utils.r(req.url, 'la cantidad de neveras debe estar definido y no puede estar en cero', 404, {}));
        return;
    }

    args.planillas_despachos.usuario_id = req.session.user.usuario_id;
    var temperatura = parseInt(args.planillas_despachos.cantidadNeveras) > 0 ? '3.2' : '0';

    args.planillas_despachos.temperatura = temperatura;

    G.Q.ninvoke(that.m_planillas_despachos, 'modificarLioDocumento', args.planillas_despachos).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Se modifica satisfactoriamente los lios', 200, {planillas_despachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error interno', 500, {planillas_despachos: {}}));

    }).done();

};



/**
 * @author Cristian Ardila
 * @fecha 09/11/2015
 * +Descripcion: Controlador encargado de actualizar el estado de la cotizacion
 *               para solicitar aprobacion por cartera
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
PlanillasDespachos.prototype.actualizarLioDocumento = function (req, res) {

    var that = this;
    var args = req.body.data;


    if (args.planillas_despachos === undefined) {
        res.send(G.utils.r(req.url, ' no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.documentos === undefined) {
        res.send(G.utils.r(req.url, 'La variable documentos no esta definido', 404, {}));
        return;
    }


    var tipo = args.planillas_despachos.tipo; // 0= farmacias 1 = clientes 2 = Otras empresas  

    var tabla = ["inv_planillas_detalle_farmacias", "inv_planillas_detalle_clientes", "inv_planillas_detalle_empresas"];

    tabla = tabla[tipo];

    if (tabla === undefined) {
        res.send(G.utils.r(req.url, 'el tipo no es valido', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_planillas_despachos, 'actualizarLioDocumento', args.planillas_despachos.documentos)

            .then(function (resultado) {


                return res.send(G.utils.r(req.url, 'cantidad de cajas', 200, {planillas_despachos: resultado}));

            }).fail(function (err) {


        res.send(G.utils.r(req.url, 'Error consultado las cantidades', 500, {planillas_despachos: {}}));

    }).done();


};

/**
 * @author German Galvis
 * @fecha 29/04/2019
 * +Descripcion: Controlador encargado de actualizar la cantidad de cajas o neveras de un documento
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
PlanillasDespachos.prototype.modificarDocumentoPlanilla = function (req, res) {

    var that = this;
    var args = req.body.data;


    if (args === undefined) {
        res.send(G.utils.r(req.url, ' no esta definido', 404, {}));
        return;
    }

    if (args.documento === undefined) {
        res.send(G.utils.r(req.url, 'La variable documento no esta definido', 404, {}));
        return;
    }


    var tipo = args.tipo; // 0= farmacias 1 = clientes 2 = Otras empresas  

    var tabla = ["inv_planillas_detalle_farmacias", "inv_planillas_detalle_clientes", "inv_planillas_detalle_empresas"];

    tabla = tabla[tipo];

    if (tabla === undefined) {
        res.send(G.utils.r(req.url, 'el tipo no es valido', 404, {}));
        return;
    }

    var parametros = {
        documento: args.documento,
        tabla: tabla
    };

    G.Q.ninvoke(that.m_planillas_despachos, 'modificarDocumento', parametros, false).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Documento Modificado Correctamente', 200, {planillas_despachos: resultado}));

    }).fail(function (err) {


        res.send(G.utils.r(req.url, 'Error consultado las cantidades', 500, {planillas_despachos: {}}));

    }).done();


};



PlanillasDespachos.$inject = ["m_planillas_despachos", "m_e008", "m_pedidos_farmacias", "e_pedidos_farmacias", "m_pedidos_clientes", "e_pedidos_clientes", "emails"];

module.exports = PlanillasDespachos;