var FacturacionProveedores = function(m_facturacion_proveedores,m_sincronizacion) {
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    this.m_sincronizacion = m_sincronizacion;
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra                                         
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.listarOrdenesCompraProveedor = function(req, res) {

    var that = this;
    var args = req.body.data;
    var fechaFin = '';
    var fechaInicio = '';

    if (args.listar_clientes === undefined || args.listar_clientes.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.listar_clientes.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_clientes: []}));
        return;
    }

    if (args.listar_clientes.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    if (args.listar_clientes.terminoBusqueda === '') {
        res.send(G.utils.r(req.url, '', 404, {}));
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
    var porFacturar = args.listar_clientes.porFacturar;
    var usuario = req.session.user.usuario_id;
    fechaInicio = args.listar_clientes.fechaInicio;
    fechaFin = args.listar_clientes.fechaFin;

    var parametros = {empresaId: empresaId,
        terminoBusqueda: terminoBusqueda,
        paginaActual: paginaActual,
        filtro: filtro,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        usuarioId: usuario,
        porFacturar:porFacturar
    };

    G.Q.ninvoke(that.m_facturacion_proveedores, 'consultarOrdenesCompraProveedor', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listarOrdenesCompraProveedor: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error listarOrdenesCompraProveedor ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las facturas proveedores                                       
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.listarFacturaProveedor = function(req, res) {

    var that = this;
    var args = req.body.data;
    var fechaFin = '';
    var fechaInicio = '';

    if (args.listar_proveedores === undefined || args.listar_proveedores.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.listar_proveedores.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_proveedores: []}));
        return;
    }

    if (args.listar_proveedores.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    if (args.listar_proveedores.terminoBusqueda === '') {
        res.send(G.utils.r(req.url, '', 404, {}));
        return;
    }

    if (!args.listar_proveedores.filtro) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }

    var empresaId = args.listar_proveedores.empresaId;
    var terminoBusqueda = args.listar_proveedores.terminoBusqueda;
    var paginaActual = args.listar_proveedores.paginaActual;
    var filtro = args.listar_proveedores.filtro;
    var usuario = req.session.user.usuario_id;
    fechaInicio = args.listar_proveedores.fechaInicio;
    fechaFin = args.listar_proveedores.fechaFin;

    var parametros = {empresaId: empresaId,
        terminoBusqueda: terminoBusqueda,
        paginaActual: paginaActual,
        filtro: filtro,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        usuarioId: usuario};

    G.Q.ninvoke(that.m_facturacion_proveedores, 'consultarFacturaProveedor', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listarFacturaProveedor: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error listarFacturaProveedor ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de retornar el detalle de la recepcion                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.detalleRecepcionParcial = function(req, res) {

    var that = this;
    var args = req.body.data;
    var recepcionDetalle = [];
    var recepcionDetalleTotal = {};

    if (args.detalleRecepcionParcial.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {detalleRecepcionParcial: []}));
        return;
    }

    if (args.detalleRecepcionParcial.recepcion_parcial_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la recepcion_parcial_id', 404, {detalleRecepcionParcial: []}));
        return;
    }


    var parametros = {
        paginaActual: args.detalleRecepcionParcial.paginaActual,
        recepcion_parcial_id: args.detalleRecepcionParcial.recepcion_parcial_id,
        empresa_id: args.detalleRecepcionParcial.empresa_id,
        porcentajeCree: args.detalleRecepcionParcial.porcentajeCree,
        porcentajeRtf: args.detalleRecepcionParcial.porcentajeRtf,
        porcentajeIca: args.detalleRecepcionParcial.porcentajeIca,
        porcentajeReteiva: args.detalleRecepcionParcial.porcentajeReteiva
    };

    G.Q.ninvoke(that.m_facturacion_proveedores, 'detalleRecepcionParcial', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            recepcionDetalle = resultado;
            return G.Q.ninvoke(that.m_facturacion_proveedores, "listarParametrosRetencion", parametros);

        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function(resultado) {
        var valores = {
            Total: 0,
            porcIva: 0,
            SubTotal: 0,
            Iva: 0,
            Cantidad: 0,
            _subTotal: 0,
            _iva: 0,
            impuesto_cree: 0,
            Cantidad:0

        };
        return G.Q.nfcall(__impuestos, that, 0, recepcionDetalle, resultado[0], valores, parametros);

    }).then(function(resultado) {
        recepcionDetalleTotal[0] = resultado;
        recepcionDetalleTotal[1] = recepcionDetalle;
        res.send(G.utils.r(req.url, 'Consulta detalleRecepcionParcial', 200, {detalleRecepcionParcial: recepcionDetalleTotal}));

    }).fail(function(err) {
        console.log("Error detalleRecepcionParcial ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de crear la factura sobre la recepcion                                                   
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.ingresarFactura = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    var respuestaFI = [];

    if (args.facturaProveedor.parmetros.numeroFactura === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de Factura', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el Id de la Empresa', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.empresaId === undefined || args.facturaProveedor.centroUtilidad === undefined || args.facturaProveedor.bodega === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la información de la Empresa', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.recepciones[0].proveedor === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el Id del proveedor', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.descripcionFactura === undefined || args.facturaProveedor.parmetros.descripcionFija === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la observacion', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.fechaVencimiento === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la fecha Vencimiento', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.fechaFactura === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la fecha Factura', 404, {ingresarFactura: []}));
        return;
    }
    if (parseInt(args.facturaProveedor.parmetros.totalDescuento) < 0) {
        res.send(G.utils.r(req.url, 'Se requiere el valor del Descuento', 404, {ingresarFactura: []}));
        return;
    }

    var parametros = {
        that: that,
        numero_factura: args.facturaProveedor.parmetros.numeroFactura,
        empresa_id: args.facturaProveedor.empresaId,
        empresaId: args.facturaProveedor.empresaId,
        centro_utilidad: args.facturaProveedor.centroUtilidad,
        bodega: args.facturaProveedor.bodega,
        codigo_proveedor_id: args.facturaProveedor.parmetros.recepciones[0].proveedor,
        observaciones: args.facturaProveedor.parmetros.descripcionFactura + '' + args.facturaProveedor.parmetros.descripcionFija,
        valor_descuento: args.facturaProveedor.parmetros.totalDescuento,
        fecha_factura: args.facturaProveedor.parmetros.fechaVencimiento,
        fecha_radicacion_factura: args.facturaProveedor.parmetros.fechaFactura,
        usuario_id: usuario,
        usuario: usuario,
        terminoBusqueda: "",
        fechaInicio: "",
        fechaFin: "", filtro: {},
        protocol: req.protocol,
        host: req.get('host')

    };
 
        G.knex.transaction(function(transaccion) { 
            
            G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', parametros).then(function(resultado) {

                return G.Q.nfcall(__impuestoProveedor, resultado[0], args.facturaProveedor.parmetros.recepciones[0], {});

            }).then(function(resultado) {

                parametros.porc_ica = resultado.ica;
                parametros.porc_rtf = resultado.rtf;
                parametros.porc_rtiva = resultado.iva;

                return G.Q.ninvoke(that.m_facturacion_proveedores, 'ingresarFacturaCabecera', parametros,transaccion);

            }).then(function(resultado) {

                return G.Q.nfcall(__ingresarFacturaDetalle, that, 0, args.facturaProveedor.parmetros.recepciones, parametros,transaccion);

            }).then(function(resultado) {
                
                transaccion.commit();

            }).fail(function(err) {
                
                transaccion.rollback(err);
               
            }).done();
            
    }).then(function(){
        var paramt = [];
        paramt[0] = parametros.empresaId;
        paramt[1] = parametros.codigo_proveedor_id;
        paramt[2] = parametros.numero_factura;
        var param = {param: paramt};
        return  G.Q.ninvoke(that.m_sincronizacion,"sincronizarCuentasXpagarFi", param);
        
    }).then(function(resultado) {
        
        respuestaFI = resultado;
        return G.Q.nfcall(__reporteFactura, parametros);

    }).then(function(resultado) {
               
        res.send(G.utils.r(req.url, 'ingresarFactura ok', 200, {ingresarFactura: resultado, respuestaFI: respuestaFI})); 
        
    }).catch(function(err){
        console.log("ERROR",err);
       res.send(G.utils.r(req.url, err, 500, {err: err}));
    }).done();     

};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado crear la sincronizacion                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.sincronizarFi = function(req, res) {

    var args = req.body.data;
    var that=this;

    if (args.sincronizarFI.empresa === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la Empresa', 404, {sincronizarFi: []}));
        return;
    }

    if (args.sincronizarFI.codigoProveedor === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo del producto', 404, {sincronizarFi: []}));
        return;
    }

    if (args.sincronizarFI.numeroFactura === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero factura', 404, {sincronizarFi: []}));
        return;
    }

    var parametros = [];
    parametros[0] = args.sincronizarFI.empresa;
    parametros[1] = args.sincronizarFI.codigoProveedor;
    parametros[2] = args.sincronizarFI.numeroFactura;
    
    var param = {param: parametros,funcion:'cuentas_x_pagar_fi'};
    G.Q.ninvoke(that.m_sincronizacion,"sincronizarCuentasXpagarFi", param).then(function(resultado) {
        
        res.send(G.utils.r(req.url, 'ingresarFactura ok', 200, {sincronizarFi: resultado}));

    }).fail(function(err) {
        console.log("Error sincronizarFi: ", err);
        res.send(G.utils.r(req.url, err, 500, {err: err}));
    }).done();

};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado crear el reporte factura proveedor                                      
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.reporteFacturaProveedor = function(req, res) {

    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;

    if (args.facturaProveedor.numeroFactura === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de Factura', 404, {reporteFacturaProveedor: []}));
        return;
    }
    if (args.facturaProveedor.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el Id de la Empresa', 404, {reporteFacturaProveedor: []}));
        return;
    }
    if (args.facturaProveedor.codigoProveedorId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo_proveedor_id', 404, {reporteFacturaProveedor: []}));
        return;
    }

    var parametros = {
        that: that,
        usuario: usuario,
        numero_factura: args.facturaProveedor.numeroFactura,
        empresaId: args.facturaProveedor.empresaId,
        empresa_id: args.facturaProveedor.empresaId,
        codigo_proveedor_id: args.facturaProveedor.codigoProveedorId,
        terminoBusqueda: "",
        fechaInicio: "",
        fechaFin: "",
        filtro: {},
        protocol: req.protocol,
        host: req.get('host')
    };
    parametros.filtro.tipo = "";
    G.Q.nfcall(__reporteFactura, parametros).then(function(resultado) {

        res.send(G.utils.r(req.url, 'ingresarFactura ok', 200, {reporteFacturaProveedor: resultado}));

    }).fail(function(err) {
        console.log("Error reporteFacturaProveedor ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado obtener los datos para generar el reporte                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __reporteFactura(parametros, callback) {

    var cabeceraFactura = [];
    var detalleFactura = [];
    var impuestos = [];
    var valores = [];

    G.Q.ninvoke(parametros.that.m_facturacion_proveedores, 'consultarFacturaProveedor', parametros).then(function(resultado) {

        cabeceraFactura = resultado;
        parametros.anio = cabeceraFactura[0].anio_factura;

        return G.Q.ninvoke(parametros.that.m_facturacion_proveedores, "listarParametrosRetencion", parametros);

    }).then(function(resultado) {

        impuestos = resultado;
        return G.Q.ninvoke(parametros.that.m_facturacion_proveedores, "consultarFacturaProveedorDetalle", parametros);

    }).then(function(resultado) {
        detalleFactura = resultado;

        var valores = {
            Total: 0,
            porcIva: 0,
            SubTotal: 0,
            Iva: 0,
            Cantidad: 0,
            _subTotal: 0,
            _iva: 0,
            impuesto_cree: 0,
            Cantidad:0

        };

        return G.Q.nfcall(__impuestos, parametros.that, 0, detalleFactura, impuestos[0], valores, cabeceraFactura[0]);

    }).then(function(resultado) {

        valores = resultado;
        var datos = [];
        datos['cabecera'] = cabeceraFactura[0];
        datos['impuestos'] = impuestos[0];
        datos['detalle'] = detalleFactura;
        datos['serverUrl'] = parametros.protocol + '://' + parametros.host + "/";
        datos['usuario'] = parametros.usuario;
        datos['valores'] = valores[0];
        return G.Q.nfcall(__generarReporteFactura, datos);

    }).then(function(resultado) {

        callback(false, resultado);

    }).fail(function(err) {
        console.log("Error reporteFacturaProveedor ", err);
        callback(true, err);

    }).done();

}
;

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Funcion que genera el reporte en formato PDF usando la libreria JSReport                                  
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __generarReporteFactura(rows, callback) {
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/FacturacionProveedores/reports/factura.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/FacturacionProveedores/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: {
            style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            cabecera: rows['cabecera'],
            detalle: rows['detalle'],
            valores: rows['valores'],
            fecha_actual: new Date().toFormat('DD/MM/YYYY HH24:MI:SS'),
            usuario_imprime: rows['usuario'],
            serverUrl: rows['serverUrl']
        }
    }, function(err, response) {
        response.body(function(body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function(err) {

                if (err) {
                    callback(true, err);
                } else {
                    callback(false, nombre_reporte);
                }
            });

        });
    });
}
;

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo recursivo privado encargado de iterar la recepciones parciales                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __ingresarFacturaDetalle(that, index, detalle, parametros,transaccion, callback) {

    var producto = detalle[index];

    if (!producto) {
        callback(false);
        return;
    }

    producto.recepcion_parcial_id = producto.recepcion_parcial;

    G.Q.ninvoke(that.m_facturacion_proveedores, 'detalleRecepcionParcial', producto).then(function(resultado) {

        return G.Q.nfcall(__insertarDetalle, that, 0, resultado, parametros,transaccion);

    }).then(function(resultado) {

        return G.Q.ninvoke(that.m_facturacion_proveedores, 'updateEstadoRecepcionParcial', producto,transaccion);

    }).then(function(resultado) {

        setTimeout(function() {
            index++;
            __ingresarFacturaDetalle(that, index, detalle, parametros,transaccion, callback);
        }, 3);

    }).fail(function(err) {
        G.Q.nfcall(__eliminarFactura, that, producto);
        console.log("(Error err:::: __ingresarFacturaDetalle )", err);
        callback(err);
        return;
    }).done();
}
;

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo privado encargado de eliminar las recepciones de una factura                                                  
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __eliminarFactura(that, parametros, callback) {
    G.Q.ninvoke(that.m_facturacion_proveedores, 'eliminarFacturaDetalle', parametros).then(function(resultado) {
        return  G.Q.ninvoke(that.m_facturacion_proveedores, 'eliminarFactura', parametros);
    }).then(function(resultado) {
        callback(false);
        return;
    }).fail(function(err) {
        console.log("Error __eliminarFactura ", err);
        callback(err);
        return;
    }).done();
}
;

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo recursivo privado encargado de iterar el detalle de una recepcion                                               
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __insertarDetalle(that, index, productos, parametros,transaccion, callback) {

    var producto = productos[index];

    if (!producto) {
        callback(false);
        return;
    }
    producto.numero_factura = parametros.numero_factura;
    producto.codigo_proveedor_id = parametros.codigo_proveedor_id;

    G.Q.ninvoke(that.m_facturacion_proveedores, 'ingresarFacturaDetalle', producto,transaccion).then(function(resultado) {

        setTimeout(function() {
            index++;
            __insertarDetalle(that, index, productos, parametros,transaccion, callback);
        }, 3);

    }).fail(function(err) {
        console.log("Error __insertarDetalle", err);
        callback(err);
        return;
    }).done();
}
;

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo privado encargado de obtener los impuestos de los proveedores                                             
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __impuestoProveedor(impuesto, impuestoProveedor, resultado, callback) {
    resultado.rtf = 0;
    resultado.ica = 0;
    resultado.iva = 0;
    if (impuesto.sw_rtf === '2' || impuesto.sw_rtf === '3')
        resultado.rtf = impuestoProveedor.porcentaje_rtf;
    if (impuesto.sw_ica === '2' || impuesto.sw_ica === '3')
        resultado.ica = impuestoProveedor.porcentaje_ica;
    if (impuesto.sw_reteiva === '2' || impuesto.sw_reteiva === '3')
        resultado.iva = impuestoProveedor.porcentaje_reteiva;
    callback(false, resultado);
    return;
}
;

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo privado encargado de obtener los impuestos de los proveedores  y valores totales                                           
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __impuestos(that, index, productos, impuesto, resultado, cabecera, callback) {

    var producto = productos[index];
    if (!producto) {

        if (impuesto.sw_rtf === '2' || impuesto.sw_rtf === '3')
            if (resultado._subTotal >= parseInt(impuesto.base_rtf)) {
                resultado.valorRetFte = Math.round(resultado._subTotal * (cabecera.porcentajeRtf / 100));
            } else {
                resultado.valorRetFte = 0;
            }

        if (impuesto.sw_ica === '2' || impuesto.sw_ica === '3')
            if (resultado._subTotal >= parseInt(impuesto.base_ica)) {
                resultado.valorRetIca = Math.round(resultado._subTotal * (cabecera.porcentajeIca / 1000));
            } else {
                resultado.valorRetIca = 0;
            }
        if (impuesto.sw_reteiva === '2' || impuesto.sw_reteiva === '3')
            if (resultado.subtotal >= parseInt(impuesto.base_reteiva)) {
                resultado.valorRetIva = Math.round(resultado._iva * (cabecera.porcentajeReteiva / 100));
            } else {
                resultado.valorRetIva = 0;
            }

        if (cabecera.porcentajeCree > 0) {
            resultado.impuesto_cree = ((cabecera.porcentajeCree / 100) * resultado._subTotal);
        } else {
            resultado.impuesto_cree = 0;
        }
        resultado.total = (((((resultado._subTotal + resultado._iva) - resultado.valorRetFte) - resultado.valorRetIca) - resultado.valorRetIva) - resultado.impuesto_cree);

        callback(false, [resultado]);
        return;
    }

    index++;

    resultado.Total = resultado.Total + (producto.valor * parseInt(producto.cantidad));
    resultado.porcIva = (producto.porc_iva / 100) + 1;
    resultado.SubTotal = (producto.valor * parseInt(producto.cantidad));
    resultado.Iva = resultado.Iva + (resultado.SubTotal - (resultado.SubTotal / parseInt(resultado.porcIva)));
    resultado.Cantidad += parseInt(producto.cantidad);
    resultado._subTotal += (producto.valor * parseInt(producto.cantidad)) / ((producto.porc_iva / 100) + 1);
    resultado._iva += (producto.valor * parseInt(producto.cantidad)) - (producto.valor * parseInt(producto.cantidad)) / ((producto.porc_iva / 100) + 1);

    setTimeout(function() {
        __impuestos(that, index, productos, impuesto, resultado, cabecera, callback);
    }, 3);

}
;

FacturacionProveedores.$inject = ["m_facturacion_proveedores", "m_sincronizacion"];

module.exports = FacturacionProveedores;