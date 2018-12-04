
/* global G */

var FacturacionClientes = function (m_facturacion_clientes, m_dispensacion_hc, m_e008, m_usuarios, m_sincronizacion, e_facturacion_clientes, m_pedidos_clientes, c_sincronizacion, m_productos) {
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_dispensacion_hc = m_dispensacion_hc;
    this.m_e008 = m_e008;
    this.m_usuarios = m_usuarios;
    this.m_productos = m_productos;
    this.m_sincronizacion = m_sincronizacion;
    this.e_facturacion_clientes = e_facturacion_clientes;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.c_sincronizacion = c_sincronizacion;

    G.log.configure({
        appenders: [
            {
                type: "file",
                absolute: true,
                filename: "files/Logs/FacturacionClientes/facturacion_clientes.log",
                maxLogSize: 20480,
                backups: 1,
                category: ['facturacion_clientes', 'console']
            },
            {
                type: "console"
            }
        ],
        replaceConsole: false
    });

    G.log.loadAppender('file');
};


var logger = G.log.getLogger('facturacion_clientes');
/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los tipos de terceros
 *              
 */
FacturacionClientes.prototype.procesosFacturacion = function (req, res) {

    var that = this;
    var usuario = req.session.user.usuario_id;
    G.Q.ninvoke(that.m_facturacion_clientes, 'procesosFacturacion', {filtro: '2'}).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta lista de facturas en proceso', 200, {lista_facturas_proceso: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.procesosFacturacion",
            "usuario_id": usuario,
            "parametros: ": "No tiene",
            "resultado: ": err});
        logger.error("-----------------------------------");
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los tipos de terceros
 *              
 */
FacturacionClientes.prototype.listarTiposTerceros = function (req, res) {

    var that = this;
    var usuario = req.session.user.usuario_id;
    G.Q.ninvoke(that.m_facturacion_clientes, 'listarTiposTerceros').then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta lista tipos terceros', 200, {listar_tipo_terceros: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.listarTiposTerceros",
            "usuario_id": usuario,
            "parametros: ": "No tiene",
            "resultado: ": err});
        logger.error("-----------------------------------");
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los prefijos
 *              
 */
FacturacionClientes.prototype.listarPrefijosFacturas = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;

    if (args.listar_prefijos === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_prefijos: []}));
        return;
    }

    if (args.listar_prefijos.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_prefijos: []}));
        return;
    }

    var parametros = {
        empresaId: args.listar_prefijos.empresaId,
        estado: 0
    };
    G.Q.ninvoke(that.m_facturacion_clientes, 'listarPrefijosFacturas', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta lista de prefijos', 200, {listar_prefijos: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.listarPrefijosFacturas",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar las facturas generadas
 *              
 */
FacturacionClientes.prototype.listarFacturasGeneradas = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.listar_facturas_generadas === undefined || args.listar_facturas_generadas.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_facturas_generadas: []}));
        return;
    }

    if (args.listar_facturas_generadas.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_facturas_generadas: []}));
        return;
    }

    if (args.listar_facturas_generadas.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {listar_facturas_generadas: []}));
        return;
    }

    if (!args.listar_facturas_generadas.filtro) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }

    if (args.listar_facturas_generadas.numero === "" &&
            args.listar_facturas_generadas.pedidoClienteId === "" &&
            args.listar_facturas_generadas.terminoBusqueda === "" &&
            args.listar_facturas_generadas.nombreTercero === "") {

        res.send(G.utils.r(req.url, 'Debe diligenciar un criterio de busqueda', 404, {listar_facturas_generadas: []}));
        return;
    }
    var empresaId = args.listar_facturas_generadas.empresaId;
    var terminoBusqueda = args.listar_facturas_generadas.terminoBusqueda;
    var paginaActual = args.listar_facturas_generadas.paginaActual;
    var filtro = args.listar_facturas_generadas.filtro;
    var filtroTipoIdTercero = args.listar_facturas_generadas.tipoIdTercero;
    var prefijo = args.listar_facturas_generadas.prefijo;
    var numero = args.listar_facturas_generadas.numero;
    var usuario = req.session.user.usuario_id;
    var nombreTercero = args.listar_facturas_generadas.nombreTercero;
    var numeroPedido = args.listar_facturas_generadas.pedidoClienteId;

    var parametros = {
        empresa_id: empresaId,
        factura_fiscal: numero,
        prefijo: prefijo.tipo,
        tipoIdTercero: filtroTipoIdTercero.tipo,
        pedidoClienteId: numeroPedido,
        terceroId: terminoBusqueda,
        nombreTercero: nombreTercero,
        paginaActual: paginaActual
    };

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarFacturasGeneradas', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_facturas_generadas: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.listarFacturasGeneradas",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
FacturacionClientes.prototype.listarClientes = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.listar_clientes === undefined || args.listar_clientes.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_clientes: []}));
        return;
    }

    if (args.listar_clientes.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_clientes: []}));
        return;
    }

    if (args.listar_clientes.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {listar_clientes: []}));
        return;
    }

    if (!args.listar_clientes.filtro) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }

    var empresaId = args.listar_clientes.empresaId;
    var terminoBusqueda = args.listar_clientes.terminoBusqueda;
    var paginaActual = args.listar_clientes.paginaActual;
    var filtro = args.listar_clientes.filtro;
    var usuario = req.session.user.usuario_id;


    var parametros = {empresaId: empresaId,
        terminoBusqueda: terminoBusqueda,
        paginaActual: paginaActual,
        filtro: filtro,
        usuarioId: usuario
    };

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarClientes', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_clientes: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.listarClientes",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};



FacturacionClientes.prototype.listarDocumentosPorFacturar = function (req, res) {
    var that = this;
    var args = req.body.data;

    if (args.facturas_consumo === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {facturas_consumo: []}));
        return;
    }

    if (args.facturas_consumo.numeroDocumento === undefined || !args.facturas_consumo.tipoTerceroId ||
            !args.facturas_consumo.terceroId) {
        res.send(G.utils.r(req.url, 'Se requiere el numero documento, documento y tipo de tercero', 404, {facturas_consumo: []}));
        return;
    }

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarDocumentosPorFacturar', args.facturas_consumo).then(function (resultado) {

        if (resultado.length > 0) {
            return res.send(G.utils.r(req.url, 'Consulta lista de documentos', 200, {facturas_consumo: resultado}));
        } else {
            throw 'No hay documentos disponibles para este cliente';
        }

    }).
            fail(function (err) {

                res.send(G.utils.r(req.url, err, 500, {}));
            }).done();


};

FacturacionClientes.prototype.obtenerDetallePorFacturar = function (req, res) {
    var args = req.body.data;
    var that = this;

    if (!args.facturas_consumo || !args.facturas_consumo.numero_documento || !args.facturas_consumo.prefijo_documento || !args.facturas_consumo.empresa_id) {
        res.send(G.utils.r(req.url, 'Algunos datos abligatorios no esta definidos', 404, {}));
        return;
    }
    args.facturas_consumo.estado = 1;
    G.Q.ninvoke(that.m_facturacion_clientes, "obtenerDetallePorFacturar", args.facturas_consumo).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Detalle del documento', 200, {detalle: resultado}));

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err.msj || err, err.status || 500, err.obj || {}));
    }).done();

};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los pedidos de los clientes 
 *              que se van a facturar
 *              
 */
FacturacionClientes.prototype.listarPedidosClientes = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.listar_pedidos_clientes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_pedidos_clientes: []}));
        return;
    }

    if (args.listar_pedidos_clientes.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_pedidos_clientes: []}));
        return;
    }

    if (args.listar_pedidos_clientes.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {listar_clientes: []}));
        return;
    }

    var terminoBusqueda = args.listar_pedidos_clientes.terminoBusqueda;
    var pedidoMultipleFarmacia = args.listar_pedidos_clientes.pedidoMultipleFarmacia;
    var estadoProcesoPedido = args.listar_pedidos_clientes.estadoProcesoPedido;
    var tipoIdTercero = args.listar_pedidos_clientes.tipoIdTercero;
    var terceroId = args.listar_pedidos_clientes.terceroId;
    var paginaActual = args.listar_pedidos_clientes.paginaActual;
    var usuario = req.session.user.usuario_id;
    var bodega = req.session.user.bodega;
    var parametros = {
        empresaId: args.listar_pedidos_clientes.empresaId,
        tipoIdTercero: tipoIdTercero,
        terceroId: terceroId,
        pedidoClienteId: terminoBusqueda,
        paginaActual: paginaActual,
        pedidoMultipleFarmacia: pedidoMultipleFarmacia,
        estadoProcesoPedido: estadoProcesoPedido,
        procesoFacturacion: 1,
        bodega: bodega
    };

    if (pedidoMultipleFarmacia === '1') {

        parametros['fechaInicial'] = args.listar_pedidos_clientes.fechaInicial;
        parametros['fechaFinal'] = args.listar_pedidos_clientes.fechaFinal;

    }

    var listaPedidosClientes;

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarPedidosClientes', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            listaPedidosClientes = resultado;
            return G.Q.nfcall(__listarDocumentosPedidos, that, 0, resultado, parametros.empresaId, []);

        } else {
            throw 'El cliente no tiene pedidos para facturar';
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {

            return res.send(G.utils.r(req.url, 'Consulta lista de pedidos clientes', 200, {listar_pedidos_clientes: listaPedidosClientes, lista_prefijos: resultado}));

        } else {
            throw 'El cliente no tiene pedidos para facturar';
        }
    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.listarPedidosClientes",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva que almacenara en un arreglo los despachos de
 *              cada pedido consultado
 * @fecha 2017/06/06
 */
function __listarDocumentosPedidos(that, index, pedidos, empresaId, documentos, callback) {
    var pedido = pedidos[index];

    if (!pedido) {
        callback(false, documentos);
        return;
    }


    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDocumentosPedidos', {empresaId: empresaId, pedidoClienteId: pedido.pedido_cliente_id, estado: 0}).
            then(function (resultado) {

                if (resultado.length > 0) {
                    documentos.push(resultado);
                }

                index++;
                var timer = setTimeout(function () {
                    clearTimeout(timer);
                    __listarDocumentosPedidos(that, index, pedidos, empresaId, documentos, callback);
                }, 0);

            }).fail(function (err) {
        console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
        callback(err);
    }).done();

}
;

/**
 * +Descripcion Metodo encargado de reccorrer el arreglo de pedidos listos para
 *              facturar sus despachos
 * @fecha 2017-05-31
 * @author Cristian Ardila
 */
function __recorrerPedidos(that, index, pedidos, empresa, consultaDocumentos, documentosSeleccionados, parametros, callback) {

    consultaDocumentos = {vendedor: [], documentoSeleccionado: []};
    documentosSeleccionados = {pedidos: []};
    var pedido = pedidos[index];

    if (!pedido) {
        callback(false);
        return;
    }

    index++;

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDocumentosPedidos', {empresaId: empresa, pedidoClienteId: pedido.pedido, estado: 1}).then(function (resultado) {

        if (resultado.length > 0) {

            consultaDocumentos.vendedor.push({tipo_id_tercero: pedido.tipo_id_tercero, id: pedido.tercero_id});
            documentosSeleccionados.pedidos.push(consultaDocumentos);
            parametros.pedidos.push(documentosSeleccionados);

            return G.Q.nfcall(__agregarDocumentosPedido, 0, resultado, consultaDocumentos.documentoSeleccionado);
        }

    }).then(function (resultado) {

    }).fail(function (err) {
        console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
        callback(err);
    }).done();

    setTimeout(function () {
        __recorrerPedidos(that, index, pedidos, empresa, consultaDocumentos, documentosSeleccionados, parametros, callback);
    }, 300);
}
;

/**
 * +Descripcion Se agregan los despachos al arreglo de documentos seleccionados relacionados
 *              a un proceso 
 */
function __agregarDocumentosPedido(index, documentos, documentoSeleccionado, callback) {

    var documento = documentos[index];

    if (!documento) {

        callback(false, documentoSeleccionado);
        return;
    }
    index++;

    documentoSeleccionado.push(documento);

    __agregarDocumentosPedido(index, documentos, documentoSeleccionado, callback);

}
;

/*
 * @author Cristian Ardila
 * @fecha 02/06/2017
 * +Descripcion Controlador encargado de almacenar los pedidos que quedaran en
 *              proceso de facturacion
 *              
 */
FacturacionClientes.prototype.procesarDespachos = function (req, res) {

    var that = this;
    var args = req.body.data;
    /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
    var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


    if (args.procesar_factura_cosmitet === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (args.procesar_factura_cosmitet.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (args.procesar_factura_cosmitet.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (args.procesar_factura_cosmitet.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    var usuario = req.session.user.usuario_id;
    var bodega = req.session.user.bodega;
    var parametros = {
        empresaId: args.procesar_factura_cosmitet.empresaId,
        tipoIdTercero: '',
        terceroId: '',
        documentoId: '',
        estado: 1,
        tipoPago: args.procesar_factura_cosmitet.tipoPago,
        usuario: usuario,
        direccion_ip: '',
        pedidos: [],
        fechaInicial: args.procesar_factura_cosmitet.fechaInicial,
        fechaFinal: args.procesar_factura_cosmitet.fechaFinal,
        pedidoMultipleFarmacia: args.procesar_factura_cosmitet.pedidoMultipleFarmacia,
        paginaActual: 1,
        pedidoClienteId: '',
        bodega: bodega,
        idProceso: ''
    };

    var pedidosCosmitet;
    that.e_facturacion_clientes.onNotificarFacturacionTerminada({generar_factura_agrupada: ''}, 'Facturando...', 201, usuario);
    res.send(G.utils.r(req.url, 'Generando facturacion...', 201, {generar_factura_agrupada: ''}));

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDireccionIp', {direccionIp: ip.substr(7, ip.length)}).then(function (resultado) {

        if (ip.substr(0, 6) === '::1' || resultado.length > 0) {
            parametros.direccion_ip = ip;
            parametros.tipoIdTercero = '';
            parametros.terceroId = '';
            parametros.estadoProcesoPedido = 0;
            parametros.procesoFacturacion = 0;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'listarPedidosClientes', parametros)

        } else {
            throw {msj: 'La Ip #' + ip.substr(7, ip.length) + ' No tiene permisos para realizar la peticion', status: 409};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            pedidosCosmitet = resultado;
            parametros.tipoIdTercero = args.procesar_factura_cosmitet.tipoIdTercero;
            parametros.terceroId = args.procesar_factura_cosmitet.terceroId;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarFacturaEnProceso', parametros);
        } else {
            throw {msj: '[listarPedidosClientes]: No hay pedidos disponibles para facturar', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            parametros.idProceso = resultado[0].id;
            G.Q.nfcall(__insertarFacturaEnProcesoDetalle, that, 0, pedidosCosmitet, parametros.idProceso)
        } else {
            throw {msj: '[insertarFacturaEnProceso]: No se creo la cabecera para el proceso de facturacion', status: 404};
        }

    }).then(function (resultado) {

        that.e_facturacion_clientes.onNotificarFacturacionTerminada({generar_factura_agrupada: ''}, 'Facturacion en proceso, tardara unos minutos', 201, usuario);

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.procesarDespachos",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        that.e_facturacion_clientes.onNotificarFacturacionTerminada({generar_factura_agrupada: ''}, 'Se ha presentado errores en el proceso', 500, usuario);
    });
};

/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva encargada de actualizar los pedidos que quedaran en proceso
 *              de facturacion
 * @fecha 2017/06/02 YYYY/MM/DD
 */
function __insertarFacturaEnProcesoDetalle(that, index, datos, procesoId, callback) {

    var dato = datos[index];
    if (!dato) {
        callback(false);
        return;
    }

    index++;
    dato.idProceso = procesoId;

    G.Q.ninvoke(that.m_facturacion_clientes, 'insertarFacturaEnProcesoDetalle', dato).then(function (resultado) {

        return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarEstadoProcesoPedido', dato);

    }).then(function (resultado) {

    }).fail(function (err) {
        console.log("err (/fail) [insertarFacturaEnProcesoDetalle]: ", err);
    }).done();

    setTimeout(function () {
        __insertarFacturaEnProcesoDetalle(that, index, datos, procesoId, callback)
    }, 300);
}
;
/**
 * @author Cristian Manuel Ardila
 * +Descripcion controlador el cual sera invocado desde un CronTab para generar
 *              la facturacion de los despachos ya en estado de proceso
 * @fecha 01/06/2017 DD/MM/YYYY generarFacturasAgrupadasEnProceso
 */
FacturacionClientes.prototype.generarFacturasAgrupadasEnProceso = function () {

    var that = this;
    var idProceso;
    var parametros = {empresaId: '', tipoIdTercero: '', terceroId: '', documentoId: '', estado: 1,
        tipoPago: '', usuario: '', direccion_ip: '', pedidos: [], facturacionCosmitet: 1
    };

    var parametroBodegaDocId = {variable: '', tipoVariable: 1, modulo: 'FacturasDespacho'};
    var consultaDocumentos = {vendedor: [], documentoSeleccionado: []};
    var documentosSeleccionados = {pedidos: []};
    var resultadoFacturacionAgrupada;

    G.Q.ninvoke(that.m_facturacion_clientes, 'procesosFacturacion', {filtro: '0'}).then(function (resultado) {

        if (resultado.length > 0) {

            parametros.empresaId = resultado[0].empresa_id;
            parametros.usuario = resultado[0].usuario_id;
            parametros.tipoIdTercero = resultado[0].tipo_id_cliente;
            parametros.terceroId = resultado[0].cliente_id;
            parametros.tipoPago = resultado[0].tipo_pago_id;
            parametros.direccion_ip = resultado[0].ip;
            parametroBodegaDocId.variable = "documento_factura_" + resultado[0].empresa_id;
            idProceso = resultado[0];
            return G.Q.ninvoke(that.m_facturacion_clientes, "procesosDetalleFacturacion", resultado[0]);

        } else {
            throw {msj: '[procesosFacturacion]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {

            return G.Q.nfcall(__recorrerPedidos, that, 0, resultado, parametros.empresaId, consultaDocumentos, documentosSeleccionados, parametros);

        } else {
            throw {msj: '[procesosDetalleFacturacion]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        return G.Q.ninvoke(that.m_facturacion_clientes, "actualizarEstadoProcesoFacturacion", {id: idProceso.id, estado: '4'});

    }).then(function () {

        return G.Q.ninvoke(that, "__generarFacturasAgrupadas", parametros, parametroBodegaDocId, parametros.direccion_ip);

    }).then(function (resultado) {

        resultadoFacturacionAgrupada = resultado;
        return G.Q.ninvoke(that.m_facturacion_clientes, "actualizarEstadoProcesoFacturacion",
                {id: idProceso.id, estado: '3', factura_fiscal: resultadoFacturacionAgrupada.data.generar_factura_agrupada[0].numeracion,
                    prefijo: resultadoFacturacionAgrupada.data.generar_factura_agrupada[0].id});

    }).then(function (resultado) {

        that.e_facturacion_clientes.onNotificarFacturacionTerminada(
                resultadoFacturacionAgrupada.data,
                resultadoFacturacionAgrupada.msj,
                200,
                parametros.usuario
                );
    }).fail(function (err) {

        G.Q.ninvoke(that.m_facturacion_clientes, "actualizarEstadoProcesoFacturacion", {id: idProceso.id, estado: '2'}).then(function (resultado) {

        }).fail(function (err) {
            logger.error("-----------------------------------");
            logger.error({"metodo": "FacturacionClientes.prototype.generarFacturasAgrupadasEnProceso",
                "usuario_id": parametros.usuario,
                "parametros: ": parametros,
                "parametroBodegaDocId": parametroBodegaDocId,
                "consultaDocumentos": consultaDocumentos,
                "documentosSeleccionados": documentosSeleccionados,
                "resultado: ": err});
            logger.error("-----------------------------------");
            console.log("Error Inesperado, consulte con el admin [generarPedidoBodegaFarmacia]: ", err);
        });
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.generarFacturasAgrupadasEnProceso",
            "usuario_id": parametros.usuario,
            "parametros: ": parametros,
            "parametroBodegaDocId": parametroBodegaDocId,
            "consultaDocumentos": consultaDocumentos,
            "documentosSeleccionados": documentosSeleccionados,
            "resultado: ": err});
        logger.error("-----------------------------------");
        console.log("err [generarPedidoBodegaFarmacia]: ", err);
    });

};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de generar la facturacion con multiples
 *              Documentos
 *              
 */
FacturacionClientes.prototype.generarFacturasAgrupadas = function (req, res) {

    var that = this;
    var args = req.body.data;
    /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
//    var ip ='::ffff:10.0.2.158';
    var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

    if (args.generar_factura_agrupada === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {generar_factura_agrupada: []}));
        return;
    }

    if (args.generar_factura_agrupada.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {generar_factura_agrupada: []}));
        return;
    }

    if (args.generar_factura_agrupada.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {generar_factura_agrupada: []}));
        return;
    }

    if (args.generar_factura_agrupada.documentos === undefined || args.generar_factura_agrupada.documentos.length < 2) {
        res.send(G.utils.r(req.url, 'Debe seleccionar los pedidos', 404, {generar_factura_agrupada: []}));
        return;
    }

    var usuario = req.session.user.usuario_id;
    var parametros = {
        empresaId: args.generar_factura_agrupada.empresaId,
        tipoIdTercero: args.generar_factura_agrupada.tipoIdTercero,
        terceroId: args.generar_factura_agrupada.terceroId,
        documentoId: '',
        estado: 1,
        tipoPago: args.generar_factura_agrupada.tipoPago,
        usuario: usuario,
        direccion_ip: '',
        pedidos: args.generar_factura_agrupada.documentos,
        facturacionCosmitet: args.generar_factura_agrupada.facturacionCosmitet
    };


    var parametroBodegaDocId = {variable: "documento_factura_" + parametros.empresaId, tipoVariable: 1, modulo: 'FacturasDespacho'};

    G.Q.ninvoke(that, "__generarFacturasAgrupadas", parametros, parametroBodegaDocId, ip).then(function (resultado) {

        res.send(G.utils.r(req.url, resultado.msj, resultado.status, resultado.data));

    }).fail(function (err) {
        console.log("err [generarPedidoBodegaFarmacia]: ", err);
        res.send(G.utils.r(req.url, err.msj, err.status, {pedidos_clientes: err.pedidos_clientes}));
    });

};



/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de asignar el responsable del pedido, actualizar
 *              el estado terminado del pedido, y si es el caso almacenar los productos
 *              proximos a autorizar
 * @fecha 03/02/2017 (DD/MM/YYYY)
 */
FacturacionClientes.prototype.__generarFacturasAgrupadas = function (parametros, parametroBodegaDocId, ip, callback) {

    var that = this;
    var documentoFacturacion;
    var consultarTerceroContrato;
    var consultarParametrosRetencion;
    var def = G.Q.defer();

    G.Q.ninvoke(that.m_dispensacion_hc, 'estadoParametrizacionReformular', parametroBodegaDocId).then(function (resultado) {

        if (resultado.length > 0) {
            parametros.documentoId = resultado[0].valor;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'listarPrefijosFacturas', parametros)
        } else {
            throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
        }


    }).then(function (resultado) {

        documentoFacturacion = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', parametros);
        } else {
            throw {msj: '[listarPrefijosFacturas]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        consultarTerceroContrato = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', parametros);
        } else {
            throw {msj: '[consultarTerceroContrato]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        consultarParametrosRetencion = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarFacturaAgrupada', documentoFacturacion[0]);
        } else {
            throw {msj: '[consultarParametrosRetencion]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {

            throw {msj: 'Se ha generado un error (Duplicate-key) Al crear la factura [' + documentoFacturacion[0].id + "-" + documentoFacturacion[0].numeracion + "]", status: 409};

        } else {

            if (ip.substr(0, 6) === '::ffff') {
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDireccionIp', {direccionIp: ip.substr(7, ip.length)});
            } else {
                def.resolve();
            }
        }

    }).then(function (resultado) {

        if (!resultado || resultado.length > 0) {
            parametros.direccion_ip = ip;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'transaccionGenerarFacturasAgrupadas',
                    {documento_facturacion: documentoFacturacion,
                        consultar_tercero_contrato: consultarTerceroContrato,
                        consultar_parametros_retencion: consultarParametrosRetencion,
                        parametros: parametros
                    });
        } else {
            throw {msj: 'La Ip #' + ip.substr(7, ip.length) + ' No tiene permisos para realizar la peticion', status: 409};
        }

    }).then(function (resultado) {

//        var parametros = [];
//        parametros[0] = resultado.empresa_id;
//        parametros[1] = resultado.id;
//        parametros[2] = resultado.numeracion;
//
//        var param = {param: parametros, funcion: 'facturas_venta_fi'};
//
//        return G.Q.ninvoke(that.m_sincronizacion, "sincronizarCuentasXpagarFi", param);
//
//    }).then(function (resultado) {

        callback(false, {
            status: 200,
            msj: 'Se genera la factura satisfactoriamente',
            data: {generar_factura_agrupada: documentoFacturacion,
                resultado_sincronizacion_ws: {resultado: {mensaje_ws: 'No sincronizado', mensaje_bd: "Log Registrado Correctamente "}}// resultado
            }
        }
        );


    }).fail(function (err) {

        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }

        callback(err, {status: status, msj: msj});
    }).done();

};


/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de consultar el detalle de la factura temporal
 * @fecha 2017-08-10 YYYY-MM-DD
 */
FacturacionClientes.prototype.eliminarTotalTemporalFacturaConsumo = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.eliminar_total_tmp === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {eliminar_producto_tmp: []}));
        return;
    }

    if (!args.eliminar_total_tmp.id) {
        res.send(G.utils.r(req.url, 'Se requiere el id', 404, {eliminar_producto_tmp: []}));
        return;
    }
    var def = G.Q.defer();
    var parametro = {
        id_factura_xconsumo: args.eliminar_total_tmp.id
    };
    var usuario = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_facturacion_clientes, 'eliminarProductoTemporalFacturaConsumo', parametro).then(function (resultado) {

        if (resultado.length > 0) {

            return G.Q.nfcall(__consultarTemporaldetalleFactura, that, def, 0, resultado);

        } else {
            throw {msj: 'No se elimino ningun producto', status: 404};
        }

    }).then(function (resultado) {

        var parametrosTotalValor = {
            id_factura_xconsumo: args.eliminar_total_tmp.id,
            valor_sub_total: 0,
            valor_total: 0,
            valor_total_iva: 0,
            estado: 3
        };

        return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarValorTotalTemporalFacturaConsumo', parametrosTotalValor);


    }).then(function (resultado) {

        return res.send(G.utils.r(req.url, "Se elimina el detalle del temporal satisfactoriamente", 200, {eliminar_producto_tmp: ''}));

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.eliminarTotalTemporalFacturaConsumo",
            "usuario_id": usuario,
            "parametros: ": parametro,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();
};



function __consultarTemporaldetalleFactura(that, def, index, pedidos, callback) {

    var pedido = pedidos[index];

    if (!pedido) {
        callback(false);
        return;
    }
    index++;
    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleTemporalFacturaConsumo', {pedido_cliente_id: pedido, estado: 3}).then(function (resultado) {

        if (resultado.length === 0) {
            G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarEstadoFacturaPedido', {pedido_cliente_id: pedido, estado_factura_fiscal: '0'}, {}).then(function (resultado) {

            }).fail(function (err) {
                console.log("err (/fail) [__actualizarEstadoFacturaPedidoDespacho]: ", err);
            }).done();
        }


    }).fail(function (err) {
        console.log("err (/fail) [__actualizarEstadoFacturaPedidoDespacho]: ", err);
    }).done();


    var timer = setTimeout(function () {
        clearTimeout(timer);
        __consultarTemporaldetalleFactura(that, def, index, pedidos, callback)
    }, 0);
}

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de consultar el detalle de la factura temporal
 * @fecha 2017-08-10 YYYY-MM-DD
 */
FacturacionClientes.prototype.eliminarProductoTemporalFacturaConsumo = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.eliminar_producto_tmp === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {eliminar_producto_tmp: []}));
        return;
    }

    if (!args.eliminar_producto_tmp.id) {
        res.send(G.utils.r(req.url, 'Se requiere el id de registro', 404, {eliminar_producto_tmp: []}));
        return;
    }

    if (!args.eliminar_producto_tmp.codigoProducto) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {eliminar_producto_tmp: []}));
        return;
    }

    if (!args.eliminar_producto_tmp.lote) {
        res.send(G.utils.r(req.url, 'Se requiere el lote', 404, {eliminar_producto_tmp: []}));
        return;
    }

    if (!args.eliminar_producto_tmp.fechaVencimiento) {
        res.send(G.utils.r(req.url, 'Se requiere la fecha de vencimiento', 404, {eliminar_producto_tmp: []}));
        return;
    }


    var parametro = {
        id_factura_xconsumo: args.eliminar_producto_tmp.id,
        codigo_producto: args.eliminar_producto_tmp.codigoProducto,
        lote: args.eliminar_producto_tmp.lote,
        fecha_vencimiento: args.eliminar_producto_tmp.fechaVencimiento
    };
    var usuario = req.session.user.usuario_id;
    var numeroPedido;
    var def = G.Q.defer();
    var subTotalValorProductos = 0;
    var totalValorIva = 0;
    var totalValorProductos = 0;

    G.Q.ninvoke(that.m_facturacion_clientes, 'eliminarProductoTemporalFacturaConsumo', parametro).then(function (resultado) {

        if (resultado.length > 0) {
            numeroPedido = resultado[0];
            var parametros = {
                pedido_cliente_id: resultado[0],
                estado: 3
            };
            return  G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleTemporalFacturaConsumo', parametros);//return res.send(G.utils.r(req.url, "Se elimina el producto satisfactoriamente", 200, {eliminar_producto_tmp:resultado}));
        } else {
            throw {msj: 'No se elimino ningun producto', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length === 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarEstadoFacturaPedido', {pedido_cliente_id: numeroPedido, estado_factura_fiscal: '0'}, {});
        } else {
            def.resolve();
        }


    }).then(function (resultado) {

        return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleTemporalFacturaConsumo', {id_factura_xconsumo: args.eliminar_producto_tmp.id, estado: 5});

    }).then(function (resultado) {

        if (resultado.length > 0) {
            resultado.forEach(function (row) {

                subTotalValorProductos += parseFloat(row.cantidad_despachada * (parseFloat(row.valor_unitario)))
                totalValorIva += parseFloat((parseFloat(parseFloat(row.valor_unitario)) * parseFloat(row.porc_iva)) / 100);
                totalValorProductos += parseFloat(parseFloat(row.cantidad_despachada * (parseFloat(parseFloat(row.valor_unitario)) + parseFloat((parseFloat(parseFloat(row.valor_unitario)) * parseFloat(row.porc_iva)) / 100))).toFixed(2));

            });

            var parametrosTotalValor = {
                id_factura_xconsumo: args.eliminar_producto_tmp.id,
                valor_sub_total: subTotalValorProductos.toFixed(2),
                valor_total: totalValorProductos.toFixed(2),
                valor_total_iva: totalValorIva,
                estado: 3
            };

            return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarValorTotalTemporalFacturaConsumo', parametrosTotalValor);
        } else {
            def.resolve();
        }

    }).then(function (resultado) {

        return res.send(G.utils.r(req.url, "Se elimina el producto del temporal satisfactoriamente", 200, {eliminar_producto_tmp: ''}));

    }).fail(function (err) {

        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.sincronizarFactura",
            "usuario_id": usuario,
            "parametros: ": parametro,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de cargar el archivo plano
 * @fecha 2018-10-22 YYYY-MM-DD
 */
FacturacionClientes.prototype.subirArchivo = function (req, res) {

    var that = this;
    var args = req.body.data;
    // data
    if (args.data === undefined) {
        res.send(G.utils.r(req.url, 'la data  No Esta Definida', 404, {}));
        return;
    }
    // nombre
    if (args.data.nombre === '') {
        res.send(G.utils.r(req.url, 'nombre esta vacio', 404, {}));
        return;
    }

    // Empresa, Centro Utilidad,  Bodega
    if (args.data.empresa_id === '' || args.data.centro_id === '' || args.data.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacios', 404, {}));
        return;
    }
    // Validar Cliente
    if (args.data.tipo_id_tercero === '' || args.data.tercero_id === '') {
        res.send(G.utils.r(req.url, 'tipo_id o tercero_id estan vacios', 404, {}));
        return;
    }

    // Observaciones
    if (args.data.observacion === '') {
        res.send(G.utils.r(req.url, 'observacion esta vacia', 404, {}));
        return;
    }

    var parametros = {
        nombre: args.data.nombre,
        observacion: args.data.observacion,
        tipo_id_tercero: args.data.tipo_id_tercero,
        tercero_id: args.data.tercero_id,
        empresa_id: args.data.empresa_id,
        centro_id: args.data.centro_id,
        bodega_id: args.data.bodega_id
    };
    var _productosInvalidosNoExistentes = "";
    var _productosValidosExistentes = "";

    /**
     * +Descripcion Se obtienen los productos del archivo plano
     */
    G.Q.nfcall(__subir_archivo_plano, req.files).then(function (contenido) {

        if (contenido.length > 0) {
            /*
             * +Descripcion Se valida si cada uno de los productos existe en el inventario
             */
            return G.Q.nfcall(__validar_productos_archivo_plano, that, 0, contenido, [], [], parametros);

        } else {
            throw {msj: "El archivo esta vacio", status: 500, data: {pedidos_clientes: {}}};
        }

    }).then(function (productosPlano) {
        /*
         * +Descripcion Productos que no se encuentran en el inventario
         */
        _productosInvalidosNoExistentes = productosPlano[1];
        _productosValidosExistentes = productosPlano[0];

        if (_productosValidosExistentes.length === 0) {

            throw {msj: 'Lista de Productos',
                status: 200,
                data: {pedidos_clientes: {
                        productos_validos: _productosValidosExistentes,
                        productos_invalidos: _productosInvalidosNoExistentes
                    }}};
            return;
        }

        return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarUltimoGrupo');

    }).then(function (grupo) {

        parametros.grupo = grupo[0].nextval;

        if (_productosValidosExistentes.length > 0) {
            return G.Q.nfcall(__insertarProductosConsumo, that, 0, parametros, _productosValidosExistentes, []);
        } else {

            return true;

        }

    }).then(function (resultado) {

        productosDuplicadosInvalidos = resultado;

        if (productosDuplicadosInvalidos.length > 0) {
            productosInvalidosTodos = productosDuplicadosInvalidos.concat(_productosInvalidosNoExistentes);
        } else {
            productosInvalidosTodos = _productosInvalidosNoExistentes;
        }

        throw {msj: 'Productos cargados correctamente', status: 200, data: {cargue_archivo: {
                    productos_validos: _productosValidosExistentes,
                    productos_invalidos: productosInvalidosTodos

                }}};
        return;

    }).fail(function (err) {

        console.log("err [subirArchivo]:", err);
        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }
        res.send(G.utils.r(req.url, msj, status, err.data));
    }).done();

};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de eliminar la factura temporal
 * @fecha 2018-07-05 YYYY-MM-DD
 */
FacturacionClientes.prototype.eliminarCabeceraTemporalFacturaConsumo = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.empresaId === undefined || args.empresaId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {eliminar_tmp: []}));
        return;
    }

    if (args.id_factura_xconsumo === undefined || args.id_factura_xconsumo === '') {
        res.send(G.utils.r(req.url, 'Se requiere el id', 404, {eliminar_tmp: []}));
        return;
    }

    var parametros = {
        id_factura_xconsumo: args.id_factura_xconsumo,
        empresa_id: args.empresaId
    };
    var usuario = req.session.user.usuario_id;
    G.knex.transaction(function (transaccion) {

        G.Q.ninvoke(that.m_facturacion_clientes, 'eliminarDocumentoTemporal_d', parametros, transaccion).then(function (resultado) {

            return G.Q.nfcall(that.m_facturacion_clientes.eliminarDocumentoTemporal, parametros, transaccion);

        }).then(function (resultado) {

            transaccion.commit();

        }).fail(function (err) {
            console.log("Error rollback ", err);
            transaccion.rollback(err);
        }).done();
    }).then(function () {

        return res.send(G.utils.r(req.url, "Se elimina el temporal satisfactoriamente", 200, {eliminar_tmp: ''}));

    }).catch(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.eliminarCabeceraTemporalFacturaConsumo",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));

    }).done();
};

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de consultar el detalle de la factura temporal
 * @fecha 2017-08-10 YYYY-MM-DD
 */
FacturacionClientes.prototype.consultarDetalleTemporalFacturaConsumo = function (req, res) {



    var that = this;
    var args = req.body.data;

    if (args.facturas_consumo === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.empresa_id) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.tipoTerceroId) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo del tercero', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    var estado = 4;
    if (args.facturas_consumo.estado === 0) {
        estado = 6;
    }

    var parametros = {
        empresaId: args.facturas_consumo.empresa_id,
        tipoIdTercero: args.facturas_consumo.tipoTerceroId,
        terceroId: args.facturas_consumo.terceroId,
        prefijo: args.facturas_consumo.prefijo_documento,
        numero: args.facturas_consumo.numero_documento,
        idFacturaXconsumo: args.facturas_consumo.idFacturaXconsumo,
        estado: estado
    };

    var usuario = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleTemporalFacturaConsumo', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            return res.send(G.utils.r(req.url, "Lista detalle factura consumo temporal", 200, {procesar_factura_cosmitet: resultado}));
        } else {
            throw {msj: 'No hay productos en temporal', status: 404};
        }

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.consultarDetalleTemporalFacturaConsumo",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();


};
/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los terceros
 *              
 */
FacturacionClientes.prototype.generarTemporalFacturaConsumo = function (req, res) {

    var that = this;
    var args = req.body.data;

    /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
    var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    var usuario = req.session.user.usuario_id;
    var def = G.Q.defer();



    if (args.facturas_consumo === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.empresaId) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.tipoIdTercero) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo del tercero', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.terceroId) {
        res.send(G.utils.r(req.url, 'Se requiere el tercero', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.documentoId) {
        res.send(G.utils.r(req.url, 'Se requiere el documento', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.estado) {
        res.send(G.utils.r(req.url, 'Se requiere el estado', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.tipoPago) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    if (!args.facturas_consumo.fechaCorte) {
        res.send(G.utils.r(req.url, 'Se requiera la fecha del corte de facturacion', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    var documentoFacturacion;
    var consultarTerceroContrato;
    var consultarParametrosRetencion;

    var parametros = {
        empresaId: args.facturas_consumo.empresaId,
        tipoIdTercero: args.facturas_consumo.tipoIdTercero,
        terceroId: args.facturas_consumo.terceroId,
        documentoId: '',
        estado: 1,
        tipoPago: args.facturas_consumo.tipoPago,
        usuario: usuario,
        direccion_ip: '',
        pedidos: args.facturas_consumo.documentos,
        documentos: args.facturas_consumo.documentoDetalle,
        id_factura_xconsumo: args.facturas_consumo.idFacturaXconsumo,
        observacion: args.facturas_consumo.observacion,
        fechaCorte: args.facturas_consumo.fechaCorte
    };

    var parametrosDetalleTmp = {
        codigo_producto: args.facturas_consumo.documentoDetalle.producto,
        lote: args.facturas_consumo.documentoDetalle.lote,
        empresaId: args.facturas_consumo.documentos.empresa,
        tipoIdTercero: args.facturas_consumo.tipoIdTercero,
        terceroId: args.facturas_consumo.terceroId,
        prefijo: args.facturas_consumo.documentos.prefijo,
        numero: args.facturas_consumo.documentos.numero,
        estado: 1
    };

    var parametroBodegaDocId = {variable: "documento_factura_" + args.facturas_consumo.empresaId, tipoVariable: 1, modulo: 'FacturasDespacho'};
    var totalValorProductos = 0;
    var subTotalValorProductos = 0;
    var totalValorIva = 0;


    if (parametros.documentos.cantidadNueva <= 0) {

        res.send(G.utils.r(req.url, 'La cantidad debe ser mayor a Cero (0)', 404, {procesar_factura_cosmitet: []}));
        return;
    }

    /**
     * +Descripcion Se valida la cantidad temporal hasta el momento que se ha facturado
     *              del efc del producto
     */
    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleTemporalFacturaConsumo', parametrosDetalleTmp).then(function (resultado) {

        if (resultado.length > 0) {
            var cantidadRestante = parseInt(args.facturas_consumo.documentoDetalle.cantidadDespachada) - parseInt(resultado[0].cantidad_despachada);

            if (parseInt(args.facturas_consumo.documentoDetalle.cantidadNueva) > cantidadRestante) {

                throw {msj: 'La nueva cantidad no debe superar a la cantidad a facturar', status: 404};
                return;
            } else {
                return G.Q.ninvoke(that.m_dispensacion_hc, 'estadoParametrizacionReformular', parametroBodegaDocId);
            }
        } else {

            if (parseInt(args.facturas_consumo.documentoDetalle.cantidadNueva) > parseInt(args.facturas_consumo.documentoDetalle.cantidadDespachada)) {

                throw {msj: 'La nueva cantidad no debe superar a la cantidad a facturar', status: 404};
                return;
            } else {
                return G.Q.ninvoke(that.m_dispensacion_hc, 'estadoParametrizacionReformular', parametroBodegaDocId)
            }
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            parametros.documentoId = resultado[0].valor;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'listarPrefijosFacturas', parametros)
        } else {
            throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
        }


    }).then(function (resultado) {

        documentoFacturacion = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', parametros);
        } else {
            throw {msj: '[listarPrefijosFacturas]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        consultarTerceroContrato = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', parametros);
        } else {
            throw {msj: '[consultarTerceroContrato]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        consultarParametrosRetencion = resultado;

        if (resultado.length > 0) {

            if (ip.substr(0, 6) === '::ffff') {
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDireccionIp', {direccionIp: ip.substr(7, ip.length)});
            } else {
                def.resolve();
            }

        } else {

            throw {msj: '[consultarParametrosRetencion]: Consulta sin resultados', status: 404};

        }

    }).then(function (resultado) {

        if (resultado !== undefined) {
            if (resultado.length > 0) {

                parametros.direccion_ip = ip;

                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTemporalFacturaConsumo',
                        {tipo_id_tercero: parametros.tipoIdTercero,
                            tercero_id: parametros.terceroId,

                            paginaActual: 1, terminoBusqueda: '', filtro: '', empresa_id: args.facturas_consumo.documentos.empresa
                        });

            } else {
                throw {msj: 'La Ip #' + ip.substr(7, ip.length) + ' No tiene permisos para realizar la peticion', status: 409};
            }

        } else {
            throw {msj: 'La Ip #' + ip.substr(7, ip.length) + ' No tiene permisos para realizar la peticion', status: 409};
        }


    }).then(function (resultado) {

        if (resultado.length > 0 && (parametros.id_factura_xconsumo !== undefined && parametros.id_factura_xconsumo !== "")) {
            //estaba comentado por que ya traia id_factura_xconsumo  
            //se comenta porque al crear un nuevo temporal, la consulta anterior carga el id_factura_xconsumo de la consulta          
            //if(parametros.id_factura_xconsumo===undefined || parametros.id_factura_xconsumo===""){
            //parametros.id_factura_xconsumo = resultado[0].id_factura_xconsumo;
            //}  

            def.resolve();
        } else {

            return G.Q.ninvoke(that.m_facturacion_clientes, 'generarTemporalFacturaConsumo',
                    {documento_facturacion: documentoFacturacion,
                        consultar_tercero_contrato: consultarTerceroContrato,
                        consultar_parametros_retencion: consultarParametrosRetencion,
                        parametros: parametros
                    });
        }

    }).then(function (resultado) {

        if (resultado) {
            if (parametros.id_factura_xconsumo === undefined || parametros.id_factura_xconsumo === "") {
                parametros.id_factura_xconsumo = resultado[0].id_factura_xconsumo;
            }
        }

        var parametrosDetalleFactura = {
            id_factura_xconsumo: parametros.id_factura_xconsumo,
            tipo_id_vendedor: 'NIT',
            vendedor_id: '830080649',
            pedido_cliente_id: parametros.pedidos.pedido,
            empresa_id: parametros.pedidos.empresa,
            prefijo: parametros.pedidos.prefijo,
            factura_fiscal: parametros.pedidos.numero,
            observacion: '',
            codigo_producto: parametros.documentos.producto,
            fecha_vencimiento: parametros.documentos.fechaVencimiento,
            lote: parametros.documentos.lote,
            valor_unitario: parametros.documentos.valorUnitario,
            cantidad_despachada: parametros.documentos.cantidadNueva,
            cantidad_devuelta: 0,
            porc_iva: parametros.documentos.porcIva
        };


        return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarDetalleFacturaConsumo', parametrosDetalleFactura);



    }).then(function (resultado) {


        if (resultado.rowCount > 0) {


            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleTemporalFacturaConsumo',
                    {estado: 5, id_factura_xconsumo: parametros.id_factura_xconsumo, prefijo: parametros.pedidos.prefijo, factura_fiscal: parametros.pedidos.numero});
        } else {
            throw {msj: 'No se registro ninguna unidad', status: 404};
            return;
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {

            resultado.forEach(function (row) {

                subTotalValorProductos += parseFloat(row.cantidad_despachada * (parseFloat(row.valor_unitario)))
                totalValorIva += parseFloat((parseFloat(parseFloat(row.valor_unitario)) * parseFloat(row.porc_iva)) / 100);
                totalValorProductos += parseFloat(parseFloat(row.cantidad_despachada * (parseFloat(parseFloat(row.valor_unitario)) + parseFloat((parseFloat(parseFloat(row.valor_unitario)) * parseFloat(row.porc_iva)) / 100))).toFixed(2));

            });

            var parametrosTotalValor = {
                id_factura_xconsumo: parametros.id_factura_xconsumo,
                tipo_id_vendedor: 'NIT',
                vendedor_id: '830080649',
                valor_sub_total: subTotalValorProductos.toFixed(2),
                valor_total: totalValorProductos.toFixed(2),
                valor_total_iva: totalValorIva,
                estado: 0
            }

            return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarValorTotalTemporalFacturaConsumo', parametrosTotalValor);

        } else {

            throw {msj: 'Consulta sin resultados Detalle', status: 404};
            return;
        }

    }).then(function (resultado) {

        if (resultado > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarEstadoFacturaPedido', {pedido_cliente_id: parametros.pedidos.pedido, estado_factura_fiscal: '2'}, {});
        } else {
            throw {msj: 'No se actualizo el estado del pedido', status: 404};
            return;
        }

    }).then(function (resultado) {

        if (resultado > 0) {
            res.send(G.utils.r(req.url, 'Se registra el temporal satisfactoriamente', 200, {facturas_consumo: parametros}));
            return;
        } else {
            throw {msj: 'No se registro el producto en temporal', status: 404};
            return;
        }


    }).fail(function (err) {
        console.log("Error", err);
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.generarTemporalFacturaConsumo",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "parametroBodegaDocId": parametroBodegaDocId,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();

};


/**
 * 
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar las facturas que se encuentran
 *              en la tabla de temporal
 */
FacturacionClientes.prototype.listarFacturasTemporales = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    var empresa_id = req.session.user.empresa;
    if (args.listar_facturas_temporal.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {imprimir_reporte_factura: []}));
        return;
    }

    var terminoBusqueda = args.listar_facturas_temporal.terminoBusqueda;
    var filtro = args.listar_facturas_temporal.filtro;
    var paginaActual = args.listar_facturas_temporal.paginaActual;

    var parametros = {tipo_id_tercero: '',
        empresa_id: empresa_id,
        tercero_id: '',
        sw_facturacion: '',
        paginaActual: paginaActual,
        terminoBusqueda: terminoBusqueda,
        filtro: filtro};

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTemporalFacturaConsumo', parametros).then(function (resultado) {

        if (resultado.length > 0) {

            return res.send(G.utils.r(req.url, 'Lista de facturas temporales', 200, {listar_facturas_temporal: resultado}));
        } else {
            throw {msj: '[consultarTemporalFacturaConsumo]: Consulta sin resultados', status: 404};
        }

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.listarFacturasTemporales",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();

};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar las farmacias
 * @fecha 2018-10-19
 */
FacturacionClientes.prototype.buscarFarmacias = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        empresa_id: args.empresa_id,
        centro: args.centro,
        bodega: args.bodega};

    G.Q.ninvoke(that.m_facturacion_clientes, 'buscarFarmacias', parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listado farmacias ok!!!!', 200, {listarBodegas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de farmacias', 500, {listarBodegas: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar los productos consumidos
 * @fecha 2018-10-18
 */
FacturacionClientes.prototype.listarFacturasConsumoBarranquillaTemporales = function (req, res) {
    var that = this;
    var args = req.body.data;
    var empresa_id = req.session.user.empresa;

    var terminoBusqueda = args.listar_facturas_consumo_temporal.terminoBusqueda;
    var filtro = args.listar_facturas_consumo_temporal.filtro;
    var paginaActual = args.listar_facturas_consumo_temporal.paginaActual;

    var parametros = {
        empresa_id: empresa_id,
        paginaActual: paginaActual,
        terminoBusqueda: terminoBusqueda,
        filtro: filtro};

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTemporalFacturaConsumoBarranquilla', parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listado productos ok!!!!', 200, {listar_facturas_consumo_temporal: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de productos', 500, {listar_facturas_consumo_temporal: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar los productos detallados
 * @fecha 2018-10-19
 */
FacturacionClientes.prototype.listarProductos = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        empresa_id: args.empresa_id,
        grupo_id: args.grupo_id,
        paginaActual: args.paginaActual};

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarProductos', parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listado productos ok!!!!', 200, {listarProductos: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de productos', 500, {listarProductos: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar los productos detallados
 * @fecha 2018-10-19
 */
FacturacionClientes.prototype.imprimirCsv = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        empresa_id: args.empresa_id,
        grupo_id: args.grupo_id,
        paginaActual: '-1'};

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarProductos', parametros).then(function (resultado) {

        return G.Q.nfcall(__generarCsvBarranquilla, resultado);
    }).then(function (resultado) {
        console.log("resultado", resultado);
        res.send(G.utils.r(req.url, 'Consultar listado productos ok!!!!', 200, {imprimirCsv: resultado}));
    }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de productos', 500, {imprimirCsv: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de eliminar la factura barranquilla temporal
 * @fecha 2018-10-19 YYYY-MM-DD
 */
FacturacionClientes.prototype.eliminarTemporalFacturaConsumoBarranquilla = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.empresaId === undefined || args.empresaId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {eliminar_tmp: []}));
        return;
    }

    if (args.grupo_id === undefined || args.grupo_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere el id', 404, {eliminar_tmp: []}));
        return;
    }

    var parametros = {
        grupo_id: args.grupo_id,
        empresa_id: args.empresaId
    };
    var usuario = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_facturacion_clientes, 'eliminarProductosTemporalBarranquilla', parametros)

            .then(function () {

                return res.send(G.utils.r(req.url, "Se elimina el temporal satisfactoriamente", 200, {eliminar_tmp: ''}));

            }).catch(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.eliminarTemporalFacturaConsumoBarranquilla",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));

    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 12/08/2017
 * +Descripcion Controlador encargado de consultar los documentos que se encuentran
 *              en los temporales para posteriormente generar la facturacion
 *              por consumo
 *              
 */
FacturacionClientes.prototype.generarFacturaXConsumo = function (req, res) {

    var that = this;
    var args = req.body.data;
    /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
    var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    var def = G.Q.defer();

    if (!args.generar_factura_consumo) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {generar_factura_consumo: []}));
        return;
    }

    if (!args.generar_factura_consumo.empresa_id) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {generar_factura_consumo: []}));
        return;
    }

    if (!args.generar_factura_consumo.tipoTerceroId) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de documento del cliente', 404, {generar_factura_consumo: []}));
        return;
    }

    if (!args.generar_factura_consumo.terceroId) {
        res.send(G.utils.r(req.url, 'Se requiere el documento del cliente', 404, {generar_factura_consumo: []}));
        return;
    }

    if (!args.generar_factura_consumo.contratoClienteId) {
        res.send(G.utils.r(req.url, 'Se requiere el id del contrato', 404, {generar_factura_consumo: []}));
        return;
    }
    var datosDocumentosXConsumo = {
        cabecera: '',
        detalle: '',
        temporal: ''
    };
    var parametros = {
        tipo_id_tercero: args.generar_factura_consumo.tipoTerceroId,
        tercero_id: args.generar_factura_consumo.terceroId,
        sw_facturacion: 0,
        paginaActual: 1,
        terminoBusqueda: '',
        filtro: '',
        empresa_id: args.generar_factura_consumo.empresa_id,
        idFacturaXconsumo: args.generar_factura_consumo.id_factura_xconsumo
    };
    var parametrosDetalle = {
        tipoIdTercero: args.generar_factura_consumo.tipoTerceroId,
        terceroId: args.generar_factura_consumo.terceroId,
        empresaId: args.generar_factura_consumo.empresa_id,
        idFacturaXconsumo: args.generar_factura_consumo.id_factura_xconsumo,
        estado: 2
    };
    var resultadoFacturasXConsumo;
    var documentoFacturacion = "";
    var consultarParametrosRetencion = "";
    var usuario = req.session.user.usuario_id;
    var parametroBodegaDocId = {variable: "documento_factura_" + args.generar_factura_consumo.empresa_id, tipoVariable: 1, modulo: 'FacturasDespacho'};

    that.e_facturacion_clientes.onNotificarFacturacionXConsumoTerminada({generar_factura_consumo: ''}, 'Facturando...', 200, usuario);
    res.send(G.utils.r(req.url, 'Generando facturacion X consumo...', 200, {generar_factura_consumo: ''}));

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTemporalFacturaConsumo', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            datosDocumentosXConsumo.cabecera = resultado;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleTemporalFacturaConsumo', parametrosDetalle)
        } else {
            throw {msj: '[consultarTemporalFacturaConsumo]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            datosDocumentosXConsumo.detalle = resultado;
            datosDocumentosXConsumo.temporal = resultado;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarValorTotalTemporalFacturaConsumo',
                    {id_factura_xconsumo: datosDocumentosXConsumo.cabecera[0].id_factura_xconsumo, estado: 1, sw_facturacion: 2});

        } else {
            throw {msj: 'No hay productos en temporal', status: 404};
        }

    }).then(function (resultado) {

        if (resultado > 0) {

            return G.Q.ninvoke(that.m_dispensacion_hc, 'estadoParametrizacionReformular', parametroBodegaDocId);
        } else {
            throw {msj: 'No se actualizo el estado del temporal', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            parametros.documentoId = resultado[0].valor;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'listarPrefijosFacturas', parametros)
        } else {
            throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
        }


    }).then(function (resultado) {

        documentoFacturacion = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', {empresaId: args.generar_factura_consumo.empresa_id});
        } else {
            throw {msj: '[listarPrefijosFacturas]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        consultarParametrosRetencion = resultado;

        if (resultado.length > 0) {

            if (ip.substr(0, 6) === '::ffff') {
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDireccionIp', {direccionIp: ip.substr(7, ip.length)});
            } else {
                def.resolve();
            }

        } else {
            throw {msj: '[consultarParametrosRetencion]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (!resultado || resultado.length > 0) {
            parametros.direccion_ip = ip;


            datosDocumentosXConsumo.cabecera[0].factura_fiscal = documentoFacturacion[0].numeracion;
            datosDocumentosXConsumo.cabecera[0].prefijo = documentoFacturacion[0].id;
            datosDocumentosXConsumo.cabecera[0].documento_id = documentoFacturacion[0].documento_id;

            var parametrosCabecera = {empresa_id: datosDocumentosXConsumo.cabecera[0].empresa,
                tipo_id_tercero: datosDocumentosXConsumo.cabecera[0].tipo_id_tercero,
                tercero_id: datosDocumentosXConsumo.cabecera[0].tercero_id,
                factura_fiscal: datosDocumentosXConsumo.cabecera[0].factura_fiscal,
                prefijo: datosDocumentosXConsumo.cabecera[0].prefijo,
                documento_id: datosDocumentosXConsumo.cabecera[0].documento_id,
                usuario_id: usuario,
                observaciones: datosDocumentosXConsumo.cabecera[0].observaciones,
                porcentaje_rtf: datosDocumentosXConsumo.cabecera[0].porcentaje_rtf,
                porcentaje_ica: datosDocumentosXConsumo.cabecera[0].porcentaje_ica,
                porcentaje_reteiva: datosDocumentosXConsumo.cabecera[0].porcentaje_reteiva,
                porcentaje_cree: datosDocumentosXConsumo.cabecera[0].porcentaje_cree,
                tipo_pago_id: datosDocumentosXConsumo.cabecera[0].tipo_pago_id,
                //valor_total: datosDocumentosXConsumo.cabecera[0].valor_total,
                facturacion_cosmitet: 0

            };

            return G.Q.ninvoke(that.m_facturacion_clientes, 'generarFacturaXConsumo',
                    {parametrosCabecera: parametrosCabecera, datosDocumentosXConsumo: datosDocumentosXConsumo});

        } else {
            throw {msj: 'La Ip #' + ip.substr(7, ip.length) + ' No tiene permisos para realizar la peticion', status: 409};
        }

    }).then(function (resultado) {

        //CAMBIAR LA CONSULTA PARA QUE VAYA A LA TEMPORAL

        return G.Q.nfcall(__consultarCantidadesFacturadasXConsumo, that, 0, datosDocumentosXConsumo, []);

    }).then(function (resultado) {

        if (resultado.length > 0) {
            resultadoFacturasXConsumo = resultado;
            return G.Q.nfcall(__obtenerDetallePorFacturar, that, 0, resultado, []);
        } else {
            throw {msj: '[Detalle de factura]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
//            console.log("Aresultado resultadoFacturasXConsumo ",resultadoFacturasXConsumo );
//            console.log("Aresultado resultado ",resultado );
            return G.Q.nfcall(__distribuirUnidadesFacturadas, that, 0, 0, resultadoFacturasXConsumo, resultado, []);
        } else {
            throw {msj: '[Detalle de productos por facturar]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {
//console.log("Aresultado ",resultado );
        productosActualizados = [];
        //Se sugiere insertar desde esta parte en una transaccion mejor
        if (resultado.length > 0) {
            return G.Q.nfcall(__actualizarCantidadFacturadaXConsumo, that, 0, resultado);
        } else {
            throw {msj: '[Unidades distribuidas por lote]: Consulta sin resultados', status: 404};
        }


    }).then(function (resultado) {

        return G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarValorTotalTemporalFacturaConsumo',
                {id_factura_xconsumo: datosDocumentosXConsumo.cabecera[0].id_factura_xconsumo,
                    estado: 2,
                    sw_facturacion: 1,
                    prefijo: documentoFacturacion[0].id,
                    factura_fiscal: documentoFacturacion[0].numeracion,
                    documento_id: documentoFacturacion[0].documento_id
                });

    }).then(function (resultado) {

        if (resultado > 0) {
            return G.Q.nfcall(__obtenerEstadoFacturaPedidoDespacho, that, 0, datosDocumentosXConsumo.temporal, []);
        } else {
            throw {msj: 'No actualizo el valor total de la factura', status: 404};
            return;
        }

    }).then(function (resultado) {

        return G.Q.nfcall(__actualizarEstadoFacturaPedidoDespacho, that, 0, resultado);

    }).then(function (resultado) {

        var parametros = [];
        parametros[0] = datosDocumentosXConsumo.cabecera[0].empresa_id;
        parametros[1] = documentoFacturacion[0].id;
        parametros[2] = documentoFacturacion[0].numeracion;

        var param = {param: parametros, funcion: 'facturas_venta_fi'};
        return G.Q.ninvoke(that.m_sincronizacion, "sincronizarCuentasXpagarFi", param);

    }).then(function (resultado) {

        that.e_facturacion_clientes.onNotificarFacturacionXConsumoTerminada(
                resultado.param,
                resultado.resultado,
                201,
                usuario);

    }).fail(function (err) {

        G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarValorTotalTemporalFacturaConsumo',
                {id_factura_xconsumo: datosDocumentosXConsumo.cabecera[0].id_factura_xconsumo, estado: 1, sw_facturacion: 3}).then(function (resultado) {

        }).fail(function (err) {
            logger.error("-----------------------------------");
            logger.error({"metodo": "FacturacionClientes.prototype.generarFacturaXConsumo",
                "usuario_id": usuario,
                "parametros: ": parametros,
                "resultado: ": err});
            logger.error("-----------------------------------");
        });
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.generarFacturaXConsumo",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }

        that.e_facturacion_clientes.onNotificarFacturacionXConsumoTerminada({generar_factura_consumo: ''}, 'Se ha presentado errores en el proceso', 500, usuario);
    }).done();
};


/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva que actualizara el estado factura_fiscal del pedido
 *              en 1 evitando de esta manera ser facturado mas de una vez
 *              posteriormente actualizara el despacho en la tabla de movimientos
 *              de despacho evitando tambien ser seleccionado el mismo documento ya
 *              facturado
 * @fecha 24/08/2017
 */
function __actualizarEstadoFacturaPedidoDespacho(that, index, datos, callback) {

    var dato = datos[index];
    if (!dato) {
        callback(false);
        return;
    }

    index++;

    if (dato.estado_pedido === 1) {

        G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarEstadoFacturaPedido', {pedido_cliente_id: dato.pedido_cliente_id, estado_factura_fiscal: '1'}, {}).then(function (resultado) {

            return G.Q.ninvoke(that.m_facturacion_clientes, "actualizarDespacho", {empresa_id: dato.empresa_id, prefijo: dato.prefijo, numero: dato.numeracion}, {});

        }).then(function (resultado) {

            var timer = setTimeout(function () {
                clearTimeout(timer);
                __actualizarEstadoFacturaPedidoDespacho(that, index, datos, callback)
            }, 0);

        }).fail(function (err) {
            console.log("err (/fail) [__actualizarEstadoFacturaPedidoDespacho]: ", err);
        }).done();
    }

    var timer = setTimeout(function () {
        clearTimeout(timer);
        __actualizarEstadoFacturaPedidoDespacho(that, index, datos, callback)
    }, 0);

}
;


/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva encargada de consultar si el pedido ya ha sido
 *              despachado en su totalidad en el proceso de facturacion por consumo
 *              y de esta manera actualizar el estado del despacho para no facturarse
 *              de nuevo
 * @fecha 2017-08-04
 */
function __obtenerEstadoFacturaPedidoDespacho(that, index, datos, pedidosEstados, callback) {

    var dato = datos[index];
    if (!dato) {
        callback(false, pedidosEstados);
        return;
    }

    index++;

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarEstadoPedido', {prefijo: dato.prefijo, numeracion: dato.factura_fiscal}).then(function (resultado) {
        pedidosEstados.push({empresa_id: dato.empresa_id, prefijo: dato.prefijo, numeracion: dato.factura_fiscal, pedido_cliente_id: dato.pedido_cliente_id, estado_pedido: resultado[0].estado_pedido});

        var timer = setTimeout(function () {
            clearTimeout(timer);
            __obtenerEstadoFacturaPedidoDespacho(that, index, datos, pedidosEstados, callback);
        }, 0);

    }).fail(function (err) {
        console.log("err (/fail) [__obtenerEstadoFacturaPedidoDespacho]: ", err);
    }).done();


}
;

/**
 * @author Cristian Ardila
 * +Descripcion funcion recursiva encargada de actualizar uno a uno cada producto
 *              segun la cantidad que se ha facturado
 * @fecha 2017-08-15             
 */
var productosActualizados = [];

function __obtenerDetallePorFacturar(that, index, datos, detallePorFacturar, callback) {

    var dato = datos[index];
    if (!dato) {
        callback(false, detallePorFacturar);
        return;
    }

    index++;

    G.Q.ninvoke(that.m_facturacion_clientes, 'obtenerDetallePorFacturar', {
        empresa_id: dato.empresa_id, estado: 0, prefijo_documento: dato.prefijo_documento, numero_documento: dato.numeracion_documento}).then(function (resultado) {

        detallePorFacturar.push(resultado);

    }).fail(function (err) {
        console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
    }).done();

    setTimeout(function () {
        __obtenerDetallePorFacturar(that, index, datos, detallePorFacturar, callback)
    }, 300);
}
;

/**
 * +Descripcion Metodo encargado de distribuir las unidades facturadas,
 *              de acuerdo a los productos almacenados en el movimiento
 *              segun la cantidad y la caja
 *              Ejemplo:
 *              producto_facturado = 11223, cantidad = 3
 *              producto_mov1 = 11223, Lote = 11, caja = 1, cantidad_mov = 2
 *              producto_mov2 = 11223, Lote = 11, caja = 2, cantidad_mov = 1
 *              de esta forma garantizar que en cada producto_mov
 *              se asigne la cantidad requerida
 */
function __distribuirUnidadesFacturadas(that, index, index2, datos, productos, unidadesDistribuidas, callback) {

    var dato = datos[index];
    var producto = productos[index2];
    if (!dato) {
        callback(false, unidadesDistribuidas);
        return;
    }

    index++;
    index2++;

    producto.forEach(function (row) {
        if (dato.codigo_producto === row.codigo_producto
                && dato.lote === row.lote
                && dato.prefijo_documento === row.prefijo
                && dato.numeracion_documento === row.numero) {

            if (productosActualizados.length > 0) {

                if (dato.codigo_producto === productosActualizados[0].codigo_producto
                        && dato.lote === productosActualizados[0].lote
                        && dato.prefijo_documento === productosActualizados[0].prefijo
                        && dato.numeracion_documento === productosActualizados[0].numero) {

                    if (dato.cantidad >= row.cantidad) {
                        despacho = parseInt(row.cantidad);
                        dato.cantidad = (parseInt(dato.cantidad) - parseInt(row.cantidad));
                    } else {
                        despacho = dato.cantidad;

                    }

                } else {

                    dato.cantidad = parseInt(dato.cantidad2);

                    if (parseInt(dato.cantidad) >= parseInt(row.cantidad)) {
                        despacho = row.cantidad;
                        dato.cantidad = (dato.cantidad - row.cantidad);
                    } else {
                        despacho = dato.cantidad2;
                    }

                }

            } else {

                if (parseInt(dato.cantidad) >= parseInt(row.cantidad)) {
                    despacho = row.cantidad;
                    dato.cantidad = (parseInt(dato.cantidad) - parseInt(row.cantidad));
                } else {
                    despacho = parseInt(dato.cantidad2);
                }

            }

            productosActualizados.unshift({
                codigo_producto: row.codigo_producto,
                lote: row.lote,
                caja: row.numero_caja,
                prefijo: row.prefijo,
                numero: row.numero
            });

            unidadesDistribuidas.push({
                cantidad_facturada: despacho,
                prefijo: row.prefijo,
                numero: row.numero,
                codigo_producto: row.codigo_producto,
                lote: row.lote,
                numero_caja: row.numero_caja});

        }
    });

    setTimeout(function () {
        __distribuirUnidadesFacturadas(that, index, index2, datos, productos, unidadesDistribuidas, callback)
    }, 0);
}

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de actualizar el movimiento del despacho
 * @fecha 2017-08-24
 */
function __actualizarCantidadFacturadaXConsumo(that, index, datos, callback) {

    var dato = datos[index];
    if (!dato) {
        callback(false);
        return;
    }

    index++;

    G.Q.ninvoke(that.m_facturacion_clientes, 'actualizarCantidadFacturadaXConsumo', {
        cantidad_facturada: dato.cantidad_facturada,
        prefijo: dato.prefijo,
        numero: dato.numero,
        codigo_producto: dato.codigo_producto,
        lote: dato.lote,
        numero_caja: dato.numero_caja}).then(function (resultado) {

        var timer = setTimeout(function () {
            clearTimeout(timer);
            __actualizarCantidadFacturadaXConsumo(that, index, datos, callback)
        }, 0);
    }).fail(function (err) {
        console.log("err (/fail) [actualizarCantidadFacturadaXConsumo]: ", err);
    }).done();



}
;
/**
 * @author Cristian Ardila
 * +Descripcion funcion recursiva encargada de almacenar en un arreglo la consulta 
 *              del detalle de lo que se ha facturado por consumo hasta ahora
 * @fecha 2017-08-15             
 */
function __consultarCantidadesFacturadasXConsumo(that, index, datos, productosFacturados, callback) {

    var dato = datos.detalle[index];
    if (!dato) {
        callback(false, productosFacturados);
        return;
    }

    index++;

    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDetalleFacturaConsumo', {
        prefijo: dato.prefijo,
        numero: dato.factura_fiscal,
        codigo_producto: dato.codigo_producto,
        tipo_id_vendedor: dato.tipo_id_vendedor,
        vendedor_id: dato.vendedor_id,
        lote: dato.lote,
        factura_fiscal: datos.cabecera[0].factura_fiscal
    }).then(function (resultado) {
        productosFacturados.push(resultado[0]);
    }).fail(function (err) {
        console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
    }).done();

    setTimeout(function () {
        __consultarCantidadesFacturadasXConsumo(that, index, datos, productosFacturados, callback)
    }, 300);
}
;


/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de generar la facturacion por cada documento
 *              validando si la ip tiene permisos para generar la accion
 *              
 */
FacturacionClientes.prototype.generarFacturaIndividual = function (req, res) {

    var that = this;
    var args = req.body.data;

    /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
    var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


    if (args.generar_factura_individual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {generar_factura_individual: []}));
        return;
    }

    if (args.generar_factura_individual.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {generar_factura_individual: []}));
        return;
    }

    if (args.generar_factura_individual.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {generar_factura_individual: []}));
        return;
    }


    var usuario = req.session.user.usuario_id;
    var parametros = {
        empresaId: args.generar_factura_individual.empresaId,
        tipoIdTercero: args.generar_factura_individual.tipoIdTercero,
        terceroId: args.generar_factura_individual.terceroId,
        documentoId: '',
        estado: 1,
        tipoPago: args.generar_factura_individual.tipoPago,
        usuario: usuario,
        direccion_ip: '',
        pedido: args.generar_factura_individual.pedido,
        documentos: args.generar_factura_individual.documentos,
        facturacionCosmitet: args.generar_factura_individual.facturacionCosmitet
    };
    var parametroBodegaDocId = {variable: "documento_factura_" + parametros.empresaId, tipoVariable: 1, modulo: 'FacturasDespacho'};
    var documentoFacturacion;
    var consultarTerceroContrato;
    var consultarParametrosRetencion;
    var def = G.Q.defer();

    G.Q.ninvoke(that.m_dispensacion_hc, 'estadoParametrizacionReformular', parametroBodegaDocId).then(function (resultado) {

        parametros.documentoId = resultado[0].valor;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'listarPrefijosFacturas', parametros)
        } else {
            throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        documentoFacturacion = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', parametros);
        } else {
            throw {msj: '[listarPrefijosFacturas]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        consultarTerceroContrato = resultado;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', parametros);
        } else {
            throw {msj: '[consultarTerceroContrato]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        consultarParametrosRetencion = resultado;

        if (resultado.length > 0) {

            if (ip.substr(0, 6) === '::ffff') {
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarDireccionIp', {direccionIp: ip.substr(7, ip.length)});
            } else {
                def.resolve();
            }

        } else {

            throw {msj: '[consultarParametrosRetencion]: Consulta sin resultados', status: 404};

        }

    }).then(function (resultado) {

        if (!resultado || resultado.length > 0) {
            parametros.direccion_ip = ip;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'transaccionGenerarFacturaIndividual',
                    {documento_facturacion: documentoFacturacion,
                        consultar_tercero_contrato: consultarTerceroContrato,
                        consultar_parametros_retencion: consultarParametrosRetencion,
                        parametros: parametros
                    });
        } else {
            throw {msj: 'La Ip #' + ip.substr(7, ip.length) + ' No tiene permisos para realizar la peticion', status: 409};
        }

    }).then(function (resultado) {

//        var parametros = [];
//        parametros[0] = resultado.empresa_id;
//        parametros[1] = resultado.prefijo;
//        parametros[2] = resultado.numeracion;
//
//        var param = {param: parametros, funcion: 'facturas_venta_fi'};
//        return G.Q.ninvoke(that.m_sincronizacion, "sincronizarCuentasXpagarFi", param);
//
//    }).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Se genera la factura satisfactoriamente', 200, {generar_factura_individual: documentoFacturacion,
            resultado_sincronizacion_ws: {resultado: {mensaje_ws: 'No sincronizado', mensaje_bd: "Log Registrado Correctamente "}}// resultado
        }));

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.generarFacturaIndividual",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "parametroBodegaDocId": parametroBodegaDocId,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();

};

FacturacionClientes.prototype.sincronizarFactura = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
    var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

    if (args.sincronizar_factura === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {sincronizar_factura: []}));
        return;
    }

    if (args.sincronizar_factura.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {sincronizar_factura: []}));
        return;
    }

    if (args.sincronizar_factura.factura_fiscal === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de factura', 404, {sincronizar_factura: []}));
        return;
    }

    var parametros = {
        empresaId: args.sincronizar_factura.empresa_id,
        documentoId: ''
    };

    var parametroBodegaDocId = {variable: "documento_factura_" + args.sincronizar_factura.empresa_id, tipoVariable: 1, modulo: 'FacturasDespacho'};

    G.Q.ninvoke(that.m_dispensacion_hc, 'estadoParametrizacionReformular', parametroBodegaDocId).then(function (resultado) {

        parametros.documentoId = resultado[0].valor;

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'listarPrefijosFacturas', parametros)
        } else {
            throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
        }


    }).then(function (resultado) {

        var parametrosSincronizar = [];
        parametrosSincronizar[0] = resultado[0].empresa_id;
        parametrosSincronizar[1] = resultado[0].id;
        parametrosSincronizar[2] = args.sincronizar_factura.factura_fiscal;
        var param = {param: parametrosSincronizar, funcion: 'facturas_venta_fi'};

        return G.Q.ninvoke(that.m_sincronizacion, "sincronizarCuentasXpagarFi", param);

    }).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Se genera la factura satisfactoriamente', 200, {resultado_sincronizacion_ws: resultado}));

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.sincronizarFactura",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "parametroBodegaDocId": parametroBodegaDocId,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();

}

function __productos(productos, index, productosDian, callback) {
    var item = productos[index];
    var formato = 'DD-MM-YYYY';


    if (!item) {
        callback(false, productosDian);
        return;
    }

    var atrip1 = {
        nombreAtributo: "FechaVencimientoProd", //String 
        valor: G.moment(item.fecha_vencimiento).format(formato) //Fecha dd-MM-yyyy HH24:mm:ss  *****corregir formato
    };
    var atrip2 = {
        nombreAtributo: "loteProd", //String
        valor: item.lote //String
    };
    var atrip3 = {
        nombreAtributo: "codigoCumProd", //String
        valor: item.codigo_cum//String
    };
    var atrip4 = {
        nombreAtributo: "codigoInvimaProd", //String
        valor: item.codigo_invima //String
    };
    var atrip5 = {
        nombreAtributo: "valorTotalProd", //String
        valor: item.subtotal//decimal
    };
    var atributoAdicionalProd = [];
    atributoAdicionalProd.push(atrip1);
    atributoAdicionalProd.push(atrip2);
    atributoAdicionalProd.push(atrip3);
    atributoAdicionalProd.push(atrip4);
    atributoAdicionalProd.push(atrip5);

    var prod = {//OPCIONAL
        atributosAdicionalesProd: {
            atributoAdicionalProd: atributoAdicionalProd
        }
        ,
        cantidad: item.cantidad, //decimal OPCIONAL -
        descripcion: item.descripcion, //String OPCIONAL -
        identificador: item.codigo_producto, //String -
        imprimible: true, //boolean -
        /*               impuestoAlConsumo: { //-
         nombre: obj.x, //String -
         porcentual: obj.x, //decimal -
         valor: obj.x //decimal -
         },
         impuestoICA: { // -
         nombre: obj.x, //String -
         // porcentual: obj.x, //decimal *
         valor: obj.x //decimal -
         },
         impuestoIVA: {
         nombre: obj.x, //String -
         porcentual: obj.x, //decimal -
         valor: obj.x //decimal -
         },*/

//                listaImpuestosDeducciones: {// OPCIONAL -
//                    nombre: "IVA19", //String -
//                    //porcentual: obj.x, //decimal 
//                    baseGravable: item.porc_iva, //decimal  -
//                    valor: item.iva_total.replace(",", ".") //decimal -
//                },
        pagable: true, //boolean -
        valorUnitario: item.valor_unitario //decimal -
    };
    var impuesto;
    var ivaPorcentaje = parseInt(item.porc_iva);
    if (ivaPorcentaje === 0) {
        impuesto = {// OPCIONAL -
            nombre: "IVA0", //String -
            //porcentual: obj.x, //decimal 
            baseGravable: item.porc_iva, //decimal  -
            valor: item.iva_total.replace(",", ".") //decimal -

        };
    }
    ;
    if (ivaPorcentaje === 19) {
        impuesto = {// OPCIONAL -
            nombre: "IVA19", //String -
            //porcentual: obj.x, //decimal 
            baseGravable: item.porc_iva, //decimal  -
            valor: item.iva_total.replace(",", ".") //decimal -
        }

    }
    ;
    if (ivaPorcentaje === 10) {
        impuesto = {// OPCIONAL -
            nombre: "IVA10", //String -
            //porcentual: obj.x, //decimal 
            baseGravable: item.porc_iva, //decimal  -
            valor: item.iva_total.replace(",", ".") //decimal -
        };
    }
    ;
    prod.listaImpuestosDeducciones = impuesto;
    productosDian.push(prod);

    var timer = setTimeout(function () {
        index++;
        __productos(productos, index, productosDian, callback);
        clearTimeout(timer);
    }, 0);
}

function __productosAdjunto(productos, index, productosDian, callback) {
    var item = productos[index];
    var formato = 'DD-MM-YYYY';


    if (!item) {
        callback(false, productosDian);
        return;
    }

    var prod = {
        cantidad: item.cantidad, //decimal OPCIONAL -
        descripcion: item.descripcion, //String OPCIONAL -
        identificador: item.codigo_producto, //String -
        imprimible: true, //boolean -
        pagable: true, //boolean -
        valorUnitario: item.valor_unitario //decimal -
    };
    var impuesto;
    var ivaPorcentaje = parseInt(item.porc_iva);
    if (ivaPorcentaje === 0) {
        impuesto = {// OPCIONAL -
            nombre: "IVA0", //String -
            //porcentual: obj.x, //decimal 
            baseGravable: item.porc_iva, //decimal  -
            valor: item.iva_total.replace(",", ".") //decimal -

        };
    }
    ;
    if (ivaPorcentaje === 19) {
        impuesto = {// OPCIONAL -
            nombre: "IVA19", //String -
            //porcentual: obj.x, //decimal 
            baseGravable: item.porc_iva, //decimal  -
            valor: item.iva_total.replace(",", ".") //decimal -
        }

    }
    ;
    if (ivaPorcentaje === 10) {
        impuesto = {// OPCIONAL -
            nombre: "IVA10", //String -
            //porcentual: obj.x, //decimal 
            baseGravable: item.porc_iva, //decimal  -
            valor: item.iva_total.replace(",", ".") //decimal -
        };
    }
    ;
    prod.listaImpuestosDeducciones = impuesto;
    productosDian.push(prod);

    var timer = setTimeout(function () {
        index++;
        __productosAdjunto(productos, index, productosDian, callback);
        clearTimeout(timer);
    }, 0);
}

FacturacionClientes.prototype.generarSincronizacionDian = function (req, res) {
    that = this;
    var args = req.body.data.imprimir_reporte_factura;
    var productos;
    var resultado;
    var data;

    G.Q.nfcall(__generarSincronizacionDian, that, req).then(function (data) {
        resultado = data;

        return G.Q.nfcall(__productosAdjunto, resultado.detalle, 0, []);

    }).then(function (productos) {
        /*        var json = {
         codigoMoneda: "COP",
         descripcion: "",
         fechaExpedicion: resultado.cabecera.fecha_registro,
         fechaVencimiento: resultado.cabecera.fecha_vencimiento_factura,
         icoterms: '',
         codigoDocumentoDian: resultado.cabecera.tipo_id_tercero,
         numeroIdentificacion: resultado.cabecera.tercero_id,
         identificadorConsecutivo: resultado.cabecera.factura_fiscal,
         identificadorResolucion: resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION : G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION_BQ,
         mediosPago: resultado.cabecera.tipo_pago_id,
         nombreSucursal: "",
         desde: resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().DESDE : G.constants.IDENTIFICADOR_DIAN().DESDE_BQ, //long -
         hasta: resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().HASTA : G.constants.IDENTIFICADOR_DIAN().HASTA_BQ, //long -
         prefijo: resultado.cabecera.prefijo,
         perfilEmision: "CLIENTE",
         perfilUsuario: "CLIENTE",
         productos: productos,
         subtotalFactura: resultado.cabecera.subtotal, //decimal OPCIONAL -
         
         //            nombreReteFuente: "ReteFuente", //String -
         ReteFuente: resultado.valores.retencionFuenteSf, //decimal -
         baseGravableReteFuente: resultado.valores.baseRetencionFuente, //decimal -
         
         //            nombreIVA: "IVA", //String -
         IVA: resultado.valores.Iva, //decimal -
         baseGravableIVA: resultado.cabecera.subtotal, //decimal -
         
         //            nombreReteICA: "ReteICA", //String -
         ReteICA: resultado.valores.retencionIcaSf, //decimal -
         baseGravableReteICA: resultado.valores.baseRetencionIca, //decimal -
         
         //            nombreReteIVA: "ReteIVA", //String -
         ReteIVA: resultado.valores.retencionIvaSf, //decimal -
         baseGravableReteIVA: resultado.valores.baseRetencionIva, //decimal -
         
         tipoFactura: 1, //numeric -
         totalFactura: resultado.valores.totalFactura, //decimal OPCIONAL -
         nombreAdquirente: resultado.cabecera.nombre_tercero,
         vendedor: resultado.cabecera.nombre,
         numeroPedido: resultado.cabecera.pedido_cliente_id,
         totalenLetras: resultado.valores.totalFacturaLetra,
         observacionesPedido: resultado.detalle[0].observacion + ", PEDIDOS FACTURADOS: " + resultado.cabecera.pedido_cliente_id, //resultado.cabecera.observacion,
         observacionesDespacho: "", resultado.detalle[0].obs_despacho, 
         elaboradoPor: resultado.imprimio.usuario,
         tipoFormato: '1',  // diferencia el tipo de factura esperando definicion del campo por parte de certicamara
         condiciones: resultado.cabecera.observaciones,
         mensajeResolucion: resultado.cabecera.texto1,
         mensajeContribuyente: resultado.cabecera.texto2 + " " + resultado.cabecera.texto3
         };*/

        var json = {
            codigoMoneda: "COP",
            fechaExpedicion: resultado.cabecera.fecha_registro,
            fechaVencimiento: resultado.cabecera.fecha_vencimiento_factura,
            codigoDocumentoDian: resultado.cabecera.tipo_id_tercero,
            numeroIdentificacion: resultado.cabecera.tercero_id,
            identificadorConsecutivo: resultado.cabecera.factura_fiscal,
            identificadorResolucion: resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION : G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION_BQ,
            mediosPago: resultado.cabecera.tipo_pago_id,
            desde: resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().DESDE : G.constants.IDENTIFICADOR_DIAN().DESDE_BQ, //long -
            hasta: resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().HASTA : G.constants.IDENTIFICADOR_DIAN().HASTA_BQ, //long -
            prefijo: resultado.cabecera.prefijo,
            perfilEmision: "CLIENTE",
            perfilUsuario: "CLIENTE",
            productos: productos,
            subtotalFactura: resultado.cabecera.subtotal,
            ReteFuente: resultado.valores.retencionFuenteSf,
            baseGravableReteFuente: resultado.valores.baseRetencionFuente,
            IVA: resultado.valores.Iva,
            baseGravableIVA: resultado.cabecera.subtotal,
            ReteICA: resultado.valores.retencionIcaSf,
            baseGravableReteICA: resultado.valores.baseRetencionIca,
            ReteIVA: resultado.valores.retencionIvaSf,
            baseGravableReteIVA: resultado.valores.baseRetencionIva,
            tipoFactura: 1,
            totalFactura: resultado.valores.totalFactura,

            coordXQr: 164,
            coordYQr: 260,
            coordXCufe: 120,
            coordYCufe: 256,
            pdf: G.base64.base64Encode(G.dirname + "/public/reports/" + resultado.pdf)
        };

        return G.Q.ninvoke(that.c_sincronizacion, 'facturacionElectronica', json);


    }).then(function (respuesta) {

        data = respuesta;
        var parametros = {
            empresa_id: args.empresaId,
            prefijo: resultado.cabecera.prefijo,
            factura_fiscal: resultado.cabecera.factura_fiscal,
            sw_factura_dian: respuesta.sw_factura_dian,
            json_envio: data.lastRequest,
            respuesta_ws: data
        };

        if (respuesta.sw_factura_dian === '1') {

            return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);

        } else if (respuesta.sw_factura_dian === '0') {

            return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);

        }

    }).then(function (resultado) {

        if (data.sw_factura_dian === '1') {

            res.send(G.utils.r(req.url, 'Sincronizacion correcta con Certicamara', 200, data));

        } else if (data.sw_factura_dian === '0') {

            res.send(G.utils.r(req.url, data.msj, data.status, data));

        }

    }).fail(function (err) {

        res.send(G.utils.r(req.url, err.msj, err.status, err));

    }).done();

};

/**
 * @author AMGT (duplica de generarReporteDespacho)
 * +Descripcion Metodo encargado de generar el informe detallado de la factura  
 *              generada
 * @fecha 18/05/2017
 */
function __generarSincronizacionDian(that, req, callback) {

    var def = G.Q.defer();
    var args = req.body.data;

    var empresaId = args.imprimir_reporte_factura.empresaId;
    var paginaActual = args.imprimir_reporte_factura.paginaActual;
    var prefijo = args.imprimir_reporte_factura.prefijo;
    var numero = args.imprimir_reporte_factura.numero;
    var usuario = req.session.user.usuario_id;

    var parametros = {empresa_id: empresaId, factura_fiscal: numero, prefijo: prefijo, tipoIdTercero: '',
        pedidoClienteId: '', terceroId: '', nombreTercero: '', paginaActual: paginaActual
    };
    var parametrosFacturaGenerada = {empresa_id: empresaId, factura_fiscal: numero, prefijo: prefijo};
    var usuario_id = req.session.user.usuario_id;
    var today = new Date();
    var formato = 'YYYY-MM-DD hh:mm';
    var fechaToday = G.moment(today).format(formato);
    var parametrosReporte = {
        cabecera: '',
        serverUrl: req.protocol + '://' + req.get('host') + "/",
        detalle: {},
        valores: {},
        productos: {},
        imprimio: {usuario: '', fecha: fechaToday},
        archivoHtml: 'facturaGeneradaDetallePDF.html',
        reporte: "factura_generada_detalle_"
    };

    var retencionFuente = 0;
    var retencionIca = 0;
    var retencionIva = 0;
    var totalFactura = 0;
    var subTotal = 0;
    var totalIva = 0;

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarFacturasGeneradas', parametros).then(function (resultado) {

        if (resultado) {
            parametrosReporte.cabecera = resultado[0];

            return G.Q.ninvoke(that.m_usuarios, 'obtenerUsuarioPorId', usuario_id)
        } else {
            throw {msj: '[listarFacturasGeneradas]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado) {
            parametrosReporte.imprimio.usuario = resultado.nombre;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', parametros, 0);
        } else {
            throw {msj: '[obtenerUsuarioPorId]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            parametrosReporte.detalle = resultado;
            parametrosReporte.productos = resultado;
            if (parametrosReporte.cabecera.factura_agrupada === '1') {
                parametrosReporte.cabecera.pedido_cliente_id = '';
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarPedidosFacturaAgrupada', parametrosFacturaGenerada);
            } else {
                def.resolve();
            }
        } else {
            throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado) {
            if (resultado.length > 0) {
                var coma = ",";
                var length = resultado.length - 1;
                resultado.forEach(function (row, index) {
                    if (index === length) {
                        coma = "";
                    }
                    parametrosReporte.cabecera.pedido_cliente_id += row.pedido_cliente_id + coma;
                });

            } else {
                throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
            }
        } else {
            def.resolve();
        }

    }).then(function (resultado) {

        return G.Q.ninvoke(that.m_facturacion_clientes, 'procesosFacturacion', {filtro: '1',
            factura_fiscal: parametros.factura_fiscal,
            prefijo: parametros.prefijo
        });

    }).then(function (resultado) {

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', parametros, 1);
        } else {
            def.resolve();
        }

    }).then(function (resultado) {

        if (resultado) {
            parametrosReporte.productos = resultado;
        }
        return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id});

    }).then(function (resultado) {

        if (resultado.length > 0) {

            parametrosReporte.detalle.forEach(function (row) {
                subTotal += parseFloat(row.subtotal_factura);
                totalIva += parseFloat(row.iva_total);
            });

            if (subTotal >= resultado[0].base_rtf) {

                retencionFuente = (subTotal * (parseFloat(parametrosReporte.cabecera.porcentaje_rtf) / 100));
            }

            if (subTotal >= resultado[0].base_ica) {
                retencionIca = (subTotal) * (parseFloat(parametrosReporte.cabecera.porcentaje_ica) / 1000);
            }
            if (subTotal >= resultado[0].base_reteiva) {
                retencionIva = (totalIva) * (parseFloat(parametrosReporte.cabecera.porcentaje_reteiva) / 100);
            }

            totalFactura = ((((parseFloat(totalIva) + parseFloat(subTotal)) - parseFloat(retencionFuente)) - parseFloat(retencionIca)) - parseFloat(retencionIva));


            parametrosReporte.valores.baseRetencionFuente = resultado[0].base_rtf;
            parametrosReporte.valores.baseRetencionIca = resultado[0].base_ica;
            parametrosReporte.valores.baseRetencionIva = resultado[0].base_reteiva;
            parametrosReporte.valores.Iva = totalIva;
            parametrosReporte.valores.retencionFuenteSf = retencionFuente;
            parametrosReporte.valores.retencionIcaSf = retencionIca;
            parametrosReporte.valores.retencionIvaSf = retencionIva;


            parametrosReporte.valores.retencionFuente = G.utils.numberFormat(retencionFuente, 2);
            parametrosReporte.valores.retencionIca = G.utils.numberFormat(retencionIca, 2);
            parametrosReporte.valores.retencionIva = G.utils.numberFormat(retencionIva, 2);
            parametrosReporte.valores.ivaTotal = G.utils.numberFormat(parseFloat(totalIva), 2);
            parametrosReporte.valores.subTotal = G.utils.numberFormat(parseFloat(subTotal), 2);
            parametrosReporte.valores.totalFactura = G.utils.numberFormat(parseFloat(totalFactura), 2);
            parametrosReporte.valores.totalFacturaLetra = G.utils.numeroLetra(totalFactura).charAt(0).toUpperCase() + G.utils.numeroLetra(totalFactura).slice(1);

        } else {
            throw {msj: '[consultarParametrosRetencion]: Consulta sin resultados', status: 404};
        }


        return G.Q.nfcall(__generarPdf2, parametrosReporte);

    }).then(function (resultado) {

        parametrosReporte.pdf = resultado;

        callback(false, parametrosReporte);


    }).fail(function (err) {
        console.log("Error  ", err);
        callback(err);
    }).done();
}
;


FacturacionClientes.prototype.generarReporteFacturaGeneradaDian = function (req, res) {
    var that = this;
    var args = req.body.data;
    var that = this;
    var args = req.body.data;
    var prefijo = args.imprimir_reporte_factura.prefijo;
    var numero = args.imprimir_reporte_factura.numero;
    var tipo_documento = args.imprimir_reporte_factura.tipo_documento;
    
    var json = {
        tipoDocumento : tipo_documento,//factura
        factura : prefijo+"_"+numero,//prefijo_nofactura
        tipoRespuesta : 'PDF'//factura
    };
        
    G.Q.ninvoke(that.c_sincronizacion, 'consultaFacturacionElectronica', json).then(function (resultado) {
        
        return res.send(G.utils.r(req.url, 'Factura generada satisfactoriamente', 200, {consulta_factura_generada_detalle: {nombre_pdf: resultado, resultados: {}}}));
        
    }).fail(function (err) {
      
        res.send(G.utils.r(req.url, err, 500, {}));
        
    }).done();
}
;

FacturacionClientes.prototype.generarReporteFacturaGenerada = function (req, res) {

    var that = this;
    var args = req.body.data;
    var def = G.Q.defer();

    var that = this;
    var args = req.body.data;

    if (args.imprimir_reporte_factura === undefined || args.imprimir_reporte_factura.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {imprimir_reporte_factura: []}));
        return;
    }

    if (args.imprimir_reporte_factura.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {imprimir_reporte_factura: []}));
        return;
    }

    if (args.imprimir_reporte_factura.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {imprimir_reporte_factura: []}));
        return;
    }

    var empresaId = args.imprimir_reporte_factura.empresaId;
    var paginaActual = args.imprimir_reporte_factura.paginaActual;
    var prefijo = args.imprimir_reporte_factura.prefijo;
    var numero = args.imprimir_reporte_factura.numero;
    var usuario = req.session.user.usuario_id;

    var parametros = {empresa_id: empresaId, factura_fiscal: numero, prefijo: prefijo, tipoIdTercero: '',
        pedidoClienteId: '', terceroId: '', nombreTercero: '', paginaActual: paginaActual
    };
    var parametrosFacturaGenerada = {empresa_id: empresaId, factura_fiscal: numero, prefijo: prefijo};
    var usuario_id = req.session.user.usuario_id;
    var today = new Date();
    var formato = 'YYYY-MM-DD hh:mm';
    var fechaToday = G.moment(today).format(formato);
    var parametrosReporte = {
        cabecera: '',
        serverUrl: req.protocol + '://' + req.get('host') + "/",
        detalle: {},
        valores: {},
        productos: {},
        imprimio: {usuario: '', fecha: fechaToday},
        archivoHtml: 'facturaGeneradaDetallePDF.html',
        reporte: "factura_generada_detalle_"
    };

    var retencionFuente = 0;
    var retencionIca = 0;
    var retencionIva = 0;
    var totalFactura = 0;
    var subTotal = 0;
    var totalIva = 0;

    G.Q.ninvoke(that.m_facturacion_clientes, 'listarFacturasGeneradas', parametros).then(function (resultado) {

        if (resultado) {
            parametrosReporte.cabecera = resultado[0];

            return G.Q.ninvoke(that.m_usuarios, 'obtenerUsuarioPorId', usuario_id)
        } else {
            throw {msj: '[listarFacturasGeneradas]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado) {
            parametrosReporte.imprimio.usuario = resultado.nombre;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', parametros, 0);
        } else {
            throw {msj: '[obtenerUsuarioPorId]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            parametrosReporte.detalle = resultado;
            parametrosReporte.productos = resultado;
            if (parametrosReporte.cabecera.factura_agrupada === '1') {
                parametrosReporte.cabecera.pedido_cliente_id = '';
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarPedidosFacturaAgrupada', parametrosFacturaGenerada);
            } else {
                def.resolve();
            }
        } else {
            throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        if (resultado) {
            if (resultado.length > 0) {
                var coma = ",";
                var length = resultado.length - 1;
                resultado.forEach(function (row, index) {
                    if (index === length) {
                        coma = "";
                    }
                    parametrosReporte.cabecera.pedido_cliente_id += row.pedido_cliente_id + coma;
                });

            } else {
                throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
            }
        } else {
            def.resolve();
        }

    }).then(function (resultado) {

        return G.Q.ninvoke(that.m_facturacion_clientes, 'procesosFacturacion', {filtro: '1',
            factura_fiscal: parametros.factura_fiscal,
            prefijo: parametros.prefijo
        });

    }).then(function (resultado) {

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', parametros, 1);
        } else {
            def.resolve();
        }

    }).then(function (resultado) {

        if (resultado) {
            parametrosReporte.productos = resultado;
        }
        return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id});

    }).then(function (resultado) {

        if (resultado.length > 0) {

            parametrosReporte.detalle.forEach(function (row) {
                subTotal += parseFloat(row.subtotal_factura);
                totalIva += parseFloat(row.iva_total);
            });

            if (subTotal >= resultado[0].base_rtf) {

                retencionFuente = (subTotal * (parseFloat(parametrosReporte.cabecera.porcentaje_rtf) / 100));
            }

            if (subTotal >= resultado[0].base_ica) {
                retencionIca = (subTotal) * (parseFloat(parametrosReporte.cabecera.porcentaje_ica) / 1000);
            }

            if (subTotal >= resultado[0].base_reteiva) {
                retencionIva = (totalIva) * (parseFloat(parametrosReporte.cabecera.porcentaje_reteiva) / 100);
            }

            totalFactura = ((((parseFloat(totalIva) + parseFloat(subTotal)) - parseFloat(retencionFuente)) - parseFloat(retencionIca)) - parseFloat(retencionIva));


            parametrosReporte.valores.retencionFuente = G.utils.numberFormat(retencionFuente, 2);
            parametrosReporte.valores.retencionIca = G.utils.numberFormat(retencionIca, 2);
            parametrosReporte.valores.retencionIva = G.utils.numberFormat(retencionIva, 2);
            parametrosReporte.valores.ivaTotal = G.utils.numberFormat(parseFloat(totalIva), 2);
            parametrosReporte.valores.subTotal = G.utils.numberFormat(parseFloat(subTotal), 2);
            parametrosReporte.valores.totalFactura = G.utils.numberFormat(parseFloat(totalFactura), 2);
            parametrosReporte.valores.totalFacturaLetra = G.utils.numeroLetra(totalFactura).charAt(0).toUpperCase() + G.utils.numeroLetra(totalFactura).slice(1);

            return G.Q.nfcall(__generarPdf2, parametrosReporte);

        } else {
            throw {msj: '[consultarParametrosRetencion]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Factura generada satisfactoriamente', 200, {
            consulta_factura_generada_detalle: {nombre_pdf: resultado, resultados: {}}
        }));

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.generarReporteFacturaGenerada",
            "usuario_id": usuario,
            "parametros: ": parametros,
            "parametrosReporte: ": parametrosReporte,
            "parametrosFacturaGenerada": parametrosFacturaGenerada,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();
};
/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de generar el informe detallado de la factura  
 *              generada
 * @fecha 18/05/2017
 */
FacturacionClientes.prototype.generarReportePedido = function (req, res) {

    var that = this;
    var args = req.body.data;
    var def = G.Q.defer();

    if (args.imprimir_reporte_pedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {imprimir_reporte_pedido: []}));
        return;
    }

    if (args.imprimir_reporte_pedido.cabecera === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {imprimir_reporte_pedido: []}));
        return;
    }

    if (args.imprimir_reporte_pedido.cabecera.numeroPedido === undefined) {
        res.send(G.utils.r(req.url, 'El numero de pedido no esta definido', 404, {imprimir_reporte_pedido: []}));
        return;
    }

    var numeroPedido = args.imprimir_reporte_pedido.cabecera.numeroPedido;
    var today = new Date();
    var formato = 'YYYY-MM-DD hh:mm';
    var fechaToday = G.moment(today).format(formato);
    var subTotal = 0;
    var valorIvaTotal = 0;
    var total = 0;
    var usuario_id = req.session.user.usuario_id;
    var parametrosReporte = {
        cabecera: args.imprimir_reporte_pedido.cabecera,
        serverUrl: req.protocol + '://' + req.get('host') + "/",
        valores: {},
        productos: {},
        subTotal: 0,
        valorIvaTotal: 0,
        total: 0,
        pedido: args.imprimir_reporte_pedido.cabecera.numeroPedido,
        imprimio: {usuario: '', fecha: fechaToday},
        archivoHtml: 'reporteDetallePedido.html',
        reporte: "reporte_detalle_pedido_"
    };

    G.Q.ninvoke(that.m_usuarios, 'obtenerUsuarioPorId', usuario_id).then(function (resultado) {

        if (resultado) {
            parametrosReporte.imprimio.usuario = resultado.nombre;
            return G.Q.ninvoke(that.m_pedidos_clientes, 'consultar_detalle_pedido', numeroPedido)
        } else {
            throw {msj: '[obtenerUsuarioPorId]: Consulta sin resultados', status: 404};
        }

    }).then(function (resultado) {
        parametrosReporte.productos = resultado;

        parametrosReporte.productos.forEach(function (row) {

            subTotal += parseFloat(row.valor_total_sin_iva);
            valorIvaTotal += parseFloat(row.valor_iva);

        });

        total = parseFloat(subTotal) + parseFloat(valorIvaTotal);
        parametrosReporte.subTotal = G.utils.numberFormat(subTotal, 2);
        parametrosReporte.valorIvaTotal = G.utils.numberFormat(valorIvaTotal, 2);
        parametrosReporte.total = G.utils.numberFormat(total, 2);

        return G.Q.nfcall(__generarPdf, parametrosReporte);

    }).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Factura generada satisfactoriamente', 200, {
            consulta_factura_generada_detalle: {nombre_pdf: resultado, resultados: {}}
        }));

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.generarReportePedido",
            "usuario_id": usuario_id,
            "numeroPedido: ": numeroPedido,
            "parametrosReporte: ": parametrosReporte,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();
};




/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de generar el informe detallado de la factura  
 *              generada
 * @fecha 18/05/2017
 */
FacturacionClientes.prototype.generarReporteDespacho = function (req, res) {

    var that = this;
    var args = req.body.data;
    var def = G.Q.defer();

    if (args.imprimir_reporte_despacho === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {imprimir_reporte_despacho: []}));
        return;
    }

    if (args.imprimir_reporte_despacho.documento === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {imprimir_reporte_despacho: []}));
        return;
    }

    var today = new Date();
    var formato = 'YYYY-MM-DD hh:mm';
    var fechaToday = G.moment(today).format(formato);
    var subTotal = 0;
    var valorIvaTotal = 0;
    var usuario_id = req.session.user.usuario_id;

    var parametrosDocumento = {empresa_id: args.imprimir_reporte_despacho.documento.empresa,
        prefijo: args.imprimir_reporte_despacho.documento.prefijo,
        numero: args.imprimir_reporte_despacho.documento.numero
    };

    var parametrosReporte = {
        cabecera: '',
        datos_adicionales: '',
        serverUrl: req.protocol + '://' + req.get('host') + "/",
        valores: {},
        productos: {},
        productosPendientesJustificados: {},
        prefijo: args.imprimir_reporte_despacho.documento.prefijo,
        numero: args.imprimir_reporte_despacho.documento.numero,
        subTotal: 0,
        valorIvaTotal: 0,
        total: 0,
        imprimio: {usuario: '', fecha: fechaToday, usuario_id: usuario_id},
        archivoHtml: 'reporteDetalleDespacho.html',
        reporte: "reporte_detalle_despacho_"
    };

    G.Q.ninvoke(that.m_usuarios, 'obtenerUsuarioPorId', usuario_id).then(function (resultado) {

        if (resultado) {
            parametrosReporte.imprimio.usuario = resultado.nombre;
            return G.Q.ninvoke(that.m_e008, 'obtenerDocumentoBodega', parametrosDocumento)
        } else {
            throw {msj: '[obtenerUsuarioPorId]: Consulta sin resultados', status: 404};
        }

    })
            .then(function (resultado) {

                if (resultado.length > 0) {
                    parametrosReporte.cabecera = resultado[0];

                    return G.Q.ninvoke(that.m_e008, 'consultarDatosAdicionales', parametrosDocumento);
                } else {
                    throw {msj: 'El documento no existe', state: 404};
                }

            }).then(function (resultado) {

        if (resultado.length > 0) {
            parametrosReporte.datos_adicionales = resultado[0];
            return G.Q.ninvoke(that.m_e008, 'obtenerTotalDetalleDespacho', {
                empresa: parametrosDocumento.empresa_id,
                prefijoDocumento: parametrosDocumento.prefijo,
                numeroDocumento: parametrosDocumento.numero
            });
        } else {
            throw {msj: 'El documento no tiene datos adicionales', state: 404};
        }

    }).then(function (resultado) {

        if (resultado.length > 0) {
            parametrosReporte.productos = resultado;
            resultado.forEach(function (row) {
                valorIvaTotal += parseFloat(row.iva) * parseFloat(row.cantidad);
                subTotal += parseFloat(row.valor_unitario) * parseFloat(row.cantidad);
            });
            parametrosReporte.subTotal = G.utils.numberFormat(Math.round(parseFloat(subTotal)), 0);
            parametrosReporte.valorIvaTotal = G.utils.numberFormat(parseFloat(valorIvaTotal), 2);
            parametrosReporte.total = G.utils.numberFormat(parseFloat(valorIvaTotal) + parseFloat(subTotal), 2);

            return G.Q.ninvoke(that.m_e008, 'consultarJustificacionDespachos', parametrosDocumento);
        } else {
            throw {msj: 'El documento no tiene detalle', state: 404};
        }


    }).then(function (resultado) {

        parametrosReporte.productosPendientesJustificados = resultado;

        return G.Q.nfcall(__generarPdf, parametrosReporte);

    }).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Factura generada satisfactoriamente', 200, {
            consulta_despacho_generado_detalle: {nombre_pdf: resultado, resultados: {}}
        }));

    }).fail(function (err) {
        logger.error("-----------------------------------");
        logger.error({"metodo": "FacturacionClientes.prototype.generarReporteDespacho",
            "usuario_id": usuario_id,
            "parametrosDocumento: ": parametrosDocumento,
            "parametrosReporte: ": parametrosReporte,
            "resultado: ": err});
        logger.error("-----------------------------------");
        if (!err.status) {
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
        res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();

};

/**
 * +Descripcion Funcion encargada de generar el reporte pdf en una plantilla
 *              html, procesando los datos enviados
 */
function __generarPdf(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/FacturacionClientes/reports/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/CajaGeneral/reports/javascripts/helpers.js', 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();
            var nombreTmp = datos.reporte + fecha.getTime() + ".html";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    console.log("err [__generarPdf]: ", err)
                } else {
                    callback(false, nombreTmp);
                }
            });
        });
    });
}

/**
 * +Descripcion Funcion encargada de generar el reporte pdf procesando los datos enviados
 */
function __generarPdf2(datos, callback) {
    datos.style = G.dirname + "/public/stylesheets/facturacion/style.css";
    var logo=G.base64Img.base64Sync("public/images/logocliente.png", function(err, data) {});

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/FacturacionClientes/reports/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/CajaGeneral/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '792px',
                headerHeight: "290px",// .imagent{position: absolute;top: 10px;}
                header: 
                        `<style>
                            p {margin-top:0; margin-bottom:0;line-height: 75%; }
                            .letra_factura{font: 100% sans-serif;
                                           display: flex;
                                            justify-content: center;
                                            align-content: center;
                                            flex-direction: column;}
                            .letra_factura2{font: 100% sans-serif;margin-top:8px;   position: absolute;
                                           top: 13px;}
                            .imgQr{
//                                  position: absolute;
                                    top: 20px;
                                    margin:20px;
//                                  display:block;
                                    }
                            .letra_factura_info{font: 50% sans-serif;text-align: center;}
                            .letra_factura_info_ctr{font: 40% sans-serif; text-align: center;}
                            .letra_factura_info_jst{font: 40% sans-serif; text-align: justify; text-justify: inter-word;}
                            .letra_factura_info_40{font: 40% sans-serif;text-align: center;}
                            .letra_factura_info_40_jt{font: 40% sans-serif;text-align: justify;}
                           
                         </style>
                         <table border='0' width='100%' >
                           <tr>
                            <td align="center" width='30%'>
                                <p ><img  src="` + logo+`"  border='0' width="300px" height="80px"></p>
                                <p class="letra_factura_info">` + datos.cabecera.tipo_id_empresa +`: ` + datos.cabecera.id+` - ` + datos.cabecera.digito_verificacion+`</p>
                                <p class="letra_factura_info">` + datos.cabecera.direccion_empresa+` TELEFONO : ` + datos.cabecera.telefono_empresa+`</p>
                                <p class="letra_factura_info">` + datos.cabecera.pais_empresa+` - ` + datos.cabecera.departamento_empresa+` - ` + datos.cabecera.municipio_empresa+`</p>
                                <p class="letra_factura_info">` + datos.cabecera.texto2+`</p>
                            <td>
                            <td width='30%'> 
                                <br><br><br>
                                <p class="letra_factura_info_ctr">` + datos.cabecera.texto3+`</p>                                 
                                <p class="letra_factura_info_jst">` + datos.cabecera.texto1+`</p>                                 
                            <td>
                            <td width='40%' valign="top">
                                 <b><p align="center" valign="top" >&nbsp;</p></b>                                                          
                                 <b><p align="center" valign="top" >FACTURA DE VENTA</p></b>  
                                 <b><p align="center" valign="top" style="margin-top:3px;" >` + datos.cabecera.prefijo+` ` +datos.cabecera.factura_fiscal+`</p></b> 
                            <td>
                           </tr>
                         </table>
                            `
            }
        },
        data: datos
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();
            var nombreTmp = datos.reporte + fecha.getTime() + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    console.log("err [__generarPdf]: ", err)
                } else {
                    callback(false, nombreTmp);
                }
            });
        });
    });
}

/*
 * Autor : Camilo Orozco
 * Descripcion : Cargar Archivo Plano
 */
function __subir_archivo_plano(files, callback) {

    var ruta_tmp = files.file.path;
    var ext = G.path.extname(ruta_tmp);
    var nombre_archivo = G.random.randomKey(3, 3) + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_temporal + nombre_archivo;

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.Q.nfcall(G.fs.copy, ruta_tmp, ruta_nueva).
                then(function () {
                    return  G.Q.nfcall(G.fs.unlink, ruta_tmp);
                }).then(function () {
            var parser = G.XlsParser;
            var workbook = parser.readFile(ruta_nueva);
            var filas = G.XlsParser.serializar(workbook, ['codigo', 'cantidad', 'lote', 'fecha_vencimiento', 'valor_unitario', 'iva']);

            if (!filas) {
                callback(true);
                return;
            } else {
                G.fs.unlinkSync(ruta_nueva);
                callback(false, filas);
            }
        }).
                fail(function (err) {
                    G.fs.unlinkSync(ruta_nueva);
                    callback(true);
                }).
                done();

    } else {
        callback(true);
    }
}
;


/*
 * Autor : Eduar Garcia
 * Descripcion : Validar que los codigos de los productos del archivo plano sean validos.
 *
 */
function __validar_productos_archivo_plano(that, index, filas, productosValidos, productosInvalidos, parametros, callback) {

    var producto = filas[index];
    if (!producto) {

        callback(false, productosValidos, productosInvalidos);
        return;
    }
    var obj = {
        codigo_producto: producto.codigo,
        empresa_id: parametros.empresa_id
    };
    /**
     * +Descripcion Funcion encargada de modificar el detalle del pedido
     */
    var _producto = {codigo_producto: producto.codigo, cantidad: producto.cantidad, lote: producto.lote};

    G.Q.ninvoke(that.m_productos, 'validar_producto_inventario', obj).then(function (resultado) {

        if (resultado.length > 0) {
            return G.Q.ninvoke(that.m_productos, 'validar_producto', producto.codigo);
        } else {

            return false;

        }

    }).then(function (resultado) {

        if (resultado.length > 0) {

            _producto.tipoProductoId = resultado[0].tipo_producto_id;
            _producto.descripcion = resultado[0].descripcion_producto;
            _producto.fecha_vencimiento = new Date((producto.fecha_vencimiento - (25567 + 1)) * 86400 * 1000); //producto.fecha_vencimiento;
            _producto.valor_unitario = parseFloat(producto.valor_unitario);
            _producto.iva = producto.iva;
            productosValidos.push(_producto);

        } else {
            _producto.mensajeError = "No existe en inventario";
            _producto.existeInventario = false;
            productosInvalidos.push(_producto);

        }

        index++;
        setTimeout(function () {
            __validar_productos_archivo_plano(that, index, filas, productosValidos, productosInvalidos, parametros, callback);
        }, 0);

    }).fail(function (error) {

        callback(error);
    });
}
;

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de insertar un arreglo de productos en la tabla
 *              productos_consumo
 * 
 */
function __insertarProductosConsumo(that, index, parametros, _productos_validos, _productos_invalidos, callback) {

    var producto = _productos_validos[index];
    if (!producto) {
        callback(false, _productos_invalidos);
        return;
    }

    producto.empresa_id = parametros.empresa_id;
    producto.bodega_id = parametros.bodega_id;
    producto.centro_id = parametros.centro_id;
    producto.observacion = parametros.observacion;
    producto.nombre = parametros.nombre;
    producto.grupo = parametros.grupo;
    producto.tipo_id_tercero = parametros.tipo_id_tercero;
    producto.tercero_id = parametros.tercero_id;

    that.m_facturacion_clientes.insertar_productos_consumo(producto, function (err, rows) {
        if (err) {

            _productos_invalidos.push(producto);
        }

        index++;
        setTimeout(function () {
            __insertarProductosConsumo(that, index, parametros, _productos_validos, _productos_invalidos, callback);
        }, 0);

    });
}

/**
 * @author German Galvis
 * +Descripcion Metodo encargado generar un archivo xls
 *              productos_consumo
 * 
 */
function __creaExcel(data, callback) {

    console.log("__creaExcel");

    var workbook = new G.Excel.Workbook();
    var worksheet = workbook.addWorksheet(data.nameHoja, {properties: {tabColor: {argb: 'FFC0000'}}});

    var alignment = {vertical: 'middle', horizontal: 'center'};
    var border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}};

    var font = {name: 'Calibri', size: 9};

    var style = {font: font, border: border};

    worksheet.columns = [
        {header: 'CODIGO', key: 'a', style: style},
        {header: 'PRODUCTO - ' + data.name, key: 'b', width: 50, style: style},
        {header: 'MOLECULA', key: 'c', width: 25, style: style},
        {header: 'LABORATORIO', key: 'd', style: style},
        {header: 'TIPO PRODUCTO', key: 'e', style: style},
        {header: 'NIVEL', key: 'f', style: style},
        {header: 'Promedio Mes', key: 'g', width: 9, style: style},
        {header: 'Stock Farmacia', key: 'h', width: 8.5, style: style},
        {header: 'Pedido 60 Dias', key: 'i', width: 7.5, style: style},
        {header: '', key: 'j', width: 10, style: style},
        {header: 'Stock Bodega', key: 'k', width: 7.5, style: style}
    ];

    worksheet.views = [
        {zoomScale: 160, state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1'}
    ];
    var i = 1;
    data.forEach(function (element) {

        if (element.color === 'ROJO') {
            worksheet.addRow([element.codigo_poducto, element.poducto, element.molecula, element.laboratorio, element.tipo_producto, element.nivel,
                element.promedioMes, element.totalStock, element.pedido60Dias, '', element.stockBodega]).font = {
                color: {argb: 'C42807'}, name: 'Calibri', size: 9
            };
        } else {
            worksheet.addRow([element.codigo_poducto, element.poducto, element.molecula, element.laboratorio, element.tipo_producto, element.nivel,
                element.promedioMes, element.totalStock, element.pedido60Dias, '', element.stockBodega]);
        }

        worksheet.getColumn('A').hidden = true;
        worksheet.getColumn('D').hidden = true;
        worksheet.getColumn('E').hidden = true;
        worksheet.getColumn('F').hidden = true;

        i++;
    });

    var font = {
        name: 'SansSerif',
        size: 9,
        bold: true
    };

    var alignment = {vertical: 'center', horizontal: 'distributed'};

    var border = {
        top: {style: 'double'},
        left: {style: 'double'},
        bottom: {style: 'double'},
        right: {style: 'double'}
    };

    var style = {font: font, border: border, alignment: alignment};

    worksheet.getCell('A1').style = style;
    worksheet.getCell('B1').style = style;
    worksheet.getCell('C1').style = style;
    worksheet.getCell('D1').style = style;
    worksheet.getCell('E1').style = style;
    worksheet.getCell('F1').style = style;
    worksheet.getCell('G1').style = style;
    worksheet.getCell('H1').style = style;
    worksheet.getCell('I1').style = style;
    worksheet.getCell('J1').style = style;
    worksheet.getCell('K1').style = style;

// save workbook to disk
    workbook.xlsx.writeFile(G.dirname + "/files/Rotaciones/" + data.nameArchivo).then(function () {
        console.log("saved");
        callback(false, data.nameArchivo);
    });
}
;

/**
 * @author German Galvis
 * +Descripcion controlador que genera csv
 */
function __generarCsvBarranquilla(datos, callback) {

    var fields = ["codigo_producto", "cantidad", "lote", "fecha_vencimiento", "valor_unitario", "iva"];

    var fieldNames = ["CODIGO", "CANTIDAD", "LOTE", "FECHA VENCIMIENTO", "VALOR UNITARIO", "IVA"];

    var opts = {
        data: datos,
        fields: fields,
        fieldNames: fieldNames,
        del: ';',
        hasCSVColumnTitle: 'Productos Consumo'
    };

    G.json2csv(opts, function (err, csv) {
        if (err)
            console.log("Eror de Archivo: ", err);
        var nombreReporte = "CSV_" + datos[0].grupo_id + ".csv";
        G.fs.writeFile(G.dirname + "/public/reports/" + nombreReporte, csv, function (err) {
            if (err) {
                console.log('Error __generarCsvBarranquilla', err);
                throw err;
            }
            callback(false, nombreReporte);

        });
    });
}

FacturacionClientes.$inject = ["m_facturacion_clientes", "m_dispensacion_hc", "m_e008", "m_usuarios", "m_sincronizacion", "e_facturacion_clientes", "m_pedidos_clientes", "c_sincronizacion", "m_productos"];

module.exports = FacturacionClientes;
