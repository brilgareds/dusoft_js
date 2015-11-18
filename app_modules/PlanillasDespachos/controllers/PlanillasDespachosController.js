
var PlanillasDespachos = function(planillas_despachos, e008, pedidos_farmacias, eventos_pedidos_farmacias, pedidos_clientes, eventos_pedidos_clientes, emails) {

    console.log("Modulo Planillas Despachos Cargado ");

    this.m_planillas_despachos = planillas_despachos;

    this.m_e008 = e008;

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

    this.emails = emails;
};


PlanillasDespachos.prototype.listarPlanillasDespachos = function(req, res) {

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

    that.m_planillas_despachos.listar_planillas_despachos(fecha_inicial, fecha_final, termino_busqueda, function(err, lista_planillas_despachos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las planillas_despachos', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de planillas_despachos', 200, {planillas_despachos: lista_planillas_despachos}));
        }
    });
};

// Consultar los documentos de despacho de una farmacia 
PlanillasDespachos.prototype.consultarDocumentosDespachosPorFarmacia = function(req, res) {

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

    var empresa_id = args.planillas_despachos.empresa_id;
    var farmacia_id = args.planillas_despachos.farmacia_id;
    var centro_utilidad_id = args.planillas_despachos.centro_utilidad_id;
    var termino_busqueda = (args.planillas_despachos.termino_busqueda === undefined) ? '' : args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.consultar_documentos_despachos_por_farmacia(empresa_id, farmacia_id, centro_utilidad_id, termino_busqueda, function(err, lista_documendos_despachos) {
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
PlanillasDespachos.prototype.consultarDocumentosDespachosPorCliente = function(req, res) {

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

    var empresa_id = args.planillas_despachos.empresa_id;
    var tipo_id = args.planillas_despachos.tipo_id;
    var tercero_id = args.planillas_despachos.tercero_id;
    var termino_busqueda = (args.planillas_despachos.termino_busqueda === undefined) ? '' : args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.consultar_documentos_despachos_por_cliente(empresa_id, tipo_id, tercero_id, termino_busqueda, function(err, lista_documendos_despachos) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Documentos Despachos Clientes', 200, {planillas_despachos: lista_documendos_despachos}));
            return;
        }
    });
};

PlanillasDespachos.prototype.consultarPlanillaDespacho = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;

    that.m_planillas_despachos.consultar_planilla_despacho(planilla_id, function(err, planilla_despacho) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado la planilla', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Planilla despacho', 200, {planillas_despachos: planilla_despacho}));
        }
    });
};

PlanillasDespachos.prototype.consultarDocumentosPlanillaDespacho = function(req, res) {

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

    that.m_planillas_despachos.consultar_documentos_planilla_despacho(planilla_id, termino_busqueda, function(err, planilla_despacho) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos de la  planilla', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Documentos planilla despacho', 200, {planillas_despachos: planilla_despacho}));
        }
    });
};

PlanillasDespachos.prototype.generarPlanillaDespacho = function(req, res) {

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

    if (args.planillas_despachos.pais_id === '' || args.planillas_despachos.departamento_id === '' || args.planillas_despachos.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id  estan vacias', 404, {}));
        return;
    }

    if (args.planillas_despachos.transportador_id === '' || args.planillas_despachos.nombre_conductor === '' || args.planillas_despachos.observacion === '') {
        res.send(G.utils.r(req.url, 'transportador_id, nombre_conductor u observacion esta vacia', 404, {}));
        return;
    }


    var pais_id = args.planillas_despachos.pais_id;
    var departamento_id = args.planillas_despachos.departamento_id;
    var ciudad_id = args.planillas_despachos.ciudad_id;
    var transportador_id = args.planillas_despachos.transportador_id;
    var nombre_conductor = args.planillas_despachos.nombre_conductor;
    var observacion = args.planillas_despachos.observacion;
    var numero_guia_externo = args.planillas_despachos.numero_guia_externo;
    var usuario_id = req.session.user.usuario_id;

    that.m_planillas_despachos.ingresar_planilla_despacho(pais_id, departamento_id, ciudad_id, transportador_id, nombre_conductor, observacion, numero_guia_externo, usuario_id, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {

            var numero_guia = (rows.length > 0) ? rows[0].id : 0;

            res.send(G.utils.r(req.url, 'Planilla despacho regitrada correctamente', 200, {numero_guia: numero_guia}));
            return;
        }
    });

};


PlanillasDespachos.prototype.ingresarDocumentosPlanillaDespacho = function(req, res) {

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

    var planilla_id = args.planillas_despachos.planilla_id;
    var empresa_id = args.planillas_despachos.empresa_id;
    var prefijo = args.planillas_despachos.prefijo;
    var numero = args.planillas_despachos.numero;
    var cantidad_cajas = args.planillas_despachos.cantidad_cajas;
    var cantidad_neveras = (args.planillas_despachos.cantidad_neveras === '') ? 0 : args.planillas_despachos.cantidad_neveras;
    var temperatura_neveras = (args.planillas_despachos.temperatura_neveras === '') ? null : args.planillas_despachos.temperatura_neveras;
    var observacion = args.planillas_despachos.observacion;
    var estado_pedido = ''; // 3 => En zona despacho, 9 => en zona con pdtes
    var responsable = null;
    var usuario_id = req.session.user.usuario_id;


    // Ingresar el documento a la planilla de despacho
    that.m_planillas_despachos.ingresar_documentos_planilla(tabla, planilla_id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id, function(err, rows, result) {

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
            that.m_e008.consultar_documento_despacho(numero, prefijo, empresa_id, usuario_id, function(err, documento_bodega) {

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
                        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario_id, function(err, rows, responsable_estado_pedido) {

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
                        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario_id, function(err, rows, responsable_estado_pedido) {

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

PlanillasDespachos.prototype.eliminarDocumentoPlanilla = function(req, res) {

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

    that.m_planillas_despachos.eliminar_documento_planilla(tabla, planilla_id, empresa_id, prefijo, numero, function(err, rows, result) {

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
            that.m_e008.consultar_documento_despacho(numero, prefijo, empresa_id, usuario_id, function(err, documento_bodega) {

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
                        that.m_pedidos_farmacias.eliminar_responsables_pedidos(numero_pedido, function(err, rows, resultado) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 0', 500, {}));
                                return;
                            } else {
                                that.m_pedidos_farmacias.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function(err, rows) {
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
                        that.m_pedidos_clientes.eliminar_responsables_pedidos(numero_pedido, function(err, rows, resultado) {
                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1', 500, {}));
                                return;
                            } else {
                                that.m_pedidos_clientes.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function(err, rows) {

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

PlanillasDespachos.prototype.despacharPlanilla = function(req, res) {

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

    that.m_planillas_despachos.consultar_documentos_planilla_despacho(planilla_id, '', function(err, documentos_planilla) {

        if (err || documentos_planilla.length === 0) {
            console.log('==================>');
            console.log(err, documentos_planilla);
            res.send(G.utils.r(req.url, 'Error Interno code 1', 500, {planillas_despachos: []}));
            return;
        } else {


            __despachar_documentos_planilla(that, 0, documentos_planilla, {continuar: true, msj: ''}, function(resultado) {

                if (!resultado.continuar) {
                    res.send(G.utils.r(req.url, resultado.msj, 500, {planillas_despachos: []}));
                    return;
                } else {
                    that.m_planillas_despachos.modificar_estado_planilla_despacho(planilla_id, estado, function(err, rows, result) {

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
PlanillasDespachos.prototype.reportePlanillaDespacho = function(req, res) {

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

    that.m_planillas_despachos.consultar_planilla_despacho(planilla_id, function(err, planilla_despacho) {


        if (err || planilla_despacho.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {

            that.m_planillas_despachos.consultar_documentos_planilla_despacho(planilla_id, '', function(err, lista_documentos) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
                    return;
                } else {

                    planilla_despacho = planilla_despacho[0];

                    // Lista Documentos
                    var datos = [];
                    lista_documentos.forEach(function(documento) {

                        if (datos[documento.descripcion_destino]) {
                            datos[documento.descripcion_destino].push(documento);
                        } else {
                            datos[documento.descripcion_destino] = [documento];
                        }
                    });

                    var documentos = [];
                    for (var z in datos) {
                        documentos.push({tercero: z, detalle: datos[z]});
                    }

                    _generar_reporte_planilla_despacho({planilla_despacho: planilla_despacho, documentos_planilla: documentos, usuario_imprime: req.session.user.nombre_usuario, serverUrl: req.protocol + '://' + req.get('host') + "/"}, function(nombre_reporte) {

                        if (enviar_email) {

                            var path = G.dirname + "/public/reports/" + nombre_reporte;
                            var filename = "PlanillaGuiaNo-" + planilla_id + '.pdf';

                            __enviar_correo_electronico(that, emails, path, filename, subject, message, function(enviado) {

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

        that.m_e008.consultar_documento_despacho(numero, prefijo, empresa_id, usuario_id, function(err, documento_bodega) {
            
            console.log('==========');
            console.log(err, documento_bodega);
            console.log('==========');
            
            if (err /*|| documento_bodega.length === 0*/) {
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
                    estado_pedido = '4';
                } else if (estado_actual_pedido === '9') {
                    // si es Zona con pdtes => pasa a Despachado con pdtes                    
                    estado_pedido = '5';
                } else {
                    estado_pedido = estado_actual_pedido;
                }

                if (tipo === '0') {
                    // Farmacias
                    that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, null, usuario_id, function(err, rows, responsable_estado_pedido) {

                        if (err) {
                            resultado.continuar = false;
                            resultado.msj += ' Error Interno code 2. ';
                        }
                        // Notificando Pedidos Actualizados en Real Time                        
                        that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                        that.m_pedidos_farmacias.terminar_estado_pedido(numero_pedido, [estado_actual_pedido, estado_pedido], '1', function(err, rows, results) {

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
                    that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, null, usuario_id, function(err, rows, responsable_estado_pedido) {

                        if (err) {
                            resultado.continuar = false;
                            resultado.msj += ' Error Interno code 3. ';
                        }
                        // Notificando Pedidos Actualizados en Real Time                            
                        that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});

                        that.m_pedidos_clientes.terminar_estado_pedido(numero_pedido, [estado_actual_pedido, estado_pedido], '1', function(err, rows, results) {

                            if (err) {
                                resultado.continuar = false;
                                resultado.msj += ' Error Interno code 3.1';
                            }
                            __despachar_documentos_planilla(contexto, ++i, documentos_planilla, resultado, callback);
                        });
                    });
                }
                
                // Otras Empresas 
                /*if (tipo === '2') {
                    __despachar_documentos_planilla(contexto, ++i, documentos_planilla, resultado, callback);
                }*/
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
    }, function(err, response) {

        response.body(function(body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function(err) {

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

    smtpTransport.sendMail(settings, function(error, response) {

        if (error) {
            callback(false);
            return;
        } else {
            smtpTransport.close();
            callback(true);
            return;
        }
    });
};

PlanillasDespachos.$inject = ["m_planillas_despachos", "m_e008", "m_pedidos_farmacias", "e_pedidos_farmacias", "m_pedidos_clientes", "e_pedidos_clientes", "emails"];

module.exports = PlanillasDespachos;