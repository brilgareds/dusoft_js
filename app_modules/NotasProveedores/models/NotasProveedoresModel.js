/* global G */

var NotasProveedoresModel = function () {
};

NotasProveedoresModel.prototype.TiposDoc = function (obj, callback) {
    var resultado = ['CC', 'CE'];
    callback(false, resultado);
};

NotasProveedoresModel.prototype.listarNotasProveedor = function (obj, callback) {
    var contarFiltros = 0;

    var query = G.knex.select([
        "c.tipo_id_tercero as documentoTipo",
        "c.tercero_id as documentoId",
        "c.nombre_tercero as proveedorNombre",
        "b.codigo_proveedor_id as proveedorId",
        "a.numero_factura as facturaNumero",
        "a.observaciones as facturaObservacion",
        G.knex.raw("TO_CHAR(a.fecha_registro, 'DD-MM-YYY') as fecha"),
        "a.valor_factura as facturaValor",
        "a.saldo as facturaSaldo"
    ])
        .from('inv_facturas_proveedores as a')
        .leftJoin('terceros_proveedores as b', 'a.codigo_proveedor_id', 'b.codigo_proveedor_id')
        .leftJoin('terceros as c', function () {
            this.on('b.tipo_id_tercero', '=', 'c.tipo_id_tercero')
                .on('b.tercero_id', '=', 'c.tercero_id')
        })
        .where('a.saldo', '>', '0')
        .andWhere('a.empresa_id', obj.empresaId)
        .andWhere(function () {
            if (obj.tipo_documento) {
                contarFiltros++;
                this.where('c.tipo_id_tercero', obj.tipo_documento);
            }
            if (obj.numero_documento) {
                contarFiltros++;
                this.where('c.tercero_id', obj.numero_documento);
            }
            if (obj.nombre) {
                contarFiltros++;
                this.where("c.nombre_tercero", "ILIKE", "%" + obj.nombre + "%");
            }
            if (obj.factura) {
                contarFiltros++;
                this.where("a.numero_factura", "ILIKE", "%" + obj.factura + "%");
            }

            if (contarFiltros === 0) {
                this.where(false);
            }
        });
    // console.log('Sql es: ', G.sqlformatter.format(query.toString()));

    query.then(function (response) {
        callback(false, response);
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.guardarTemporalDetalle = (detalle, callback) => {
    var resultado = [];
    detalle.sube_baja_costo = '1';
    detalle.mayorValor = detalle.mayorValor ? '1':'0';

    var query = G.knex('inv_notas_facturas_proveedor_d_tmp')
        .insert({
            codigo_proveedor_id: detalle.codigo_proveedor_id,
            numero_factura: detalle.numero_factura,
            empresa_id: detalle.empresaId,
            usuario_id: detalle.usuarioId,
            codigo_producto: detalle.codigo_producto,
            cantidad: detalle.cantidad,
            concepto: detalle.conceptoGeneralId,
            concepto_especifico: detalle.conceptoEspecificoId,
            valor_concepto: detalle.valorConcepto,
            observacion: detalle.observacion,
            nota_mayor_valor: detalle.mayorValor,
            valor: detalle.valor,
            porc_iva: detalle.porc_iva,
            sube_baja_costo: detalle.sube_baja_costo
        });
    // console.log('SQL is: ', G.sqlformatter.format(query.toString()));

    query.then(resultado => {
        callback(false, resultado);
    }).catch(err => {
        callback(err);
    });
};

NotasProveedoresModel.prototype.temporalEncabezado = function (obj, callback) {
    var that = this;

    G.Q.ninvoke(that, 'buscarTemporalEncabezado', obj)
        .then(function (temporal) {
            if (temporal.length === 0) {
                var query = G.knex('inv_notas_facturas_proveedor_tmp')
                    .insert({
                        codigo_proveedor_id: obj.proveedorId,
                        factura_proveedor: obj.facturaNumero,
                        empresa_id: obj.empresaId,
                        usuario_id: obj.usuarioId
                    });
                return query.then(function () {
                    return G.Q.ninvoke(that, 'buscarTemporalEncabezado', obj); // Temporal Creado
                }).then(function (temporal) {
                    if (temporal.length === 1) {
                        temporal = temporal[0];
                        return temporal;
                    } else if(temporal.length > 1) {
                        throw 'Demasiados temporales! total temporales: ' + temporal.length;
                    } else {
                        throw 'Error al crear';
                    }
                }).catch(function (err) {
                    console.log('Error: ', err);
                });
            } else if (temporal.length === 1) {
                temporal = temporal[0];
                return temporal;
            } else if(temporal.length > 1) {
                throw 'Demasiados temporales! total temporales: ' + temporal.length;
            }
        }).then(function (temporal) {
            temporal.subtotal = parseFloat(temporal.subtotal);
            temporal.subtotalString = obj.number_money(String(temporal.subtotal));
            temporal.iva_total = parseFloat(temporal.iva_total);
            temporal.iva_totalString = obj.number_money(String(temporal.iva_total));
            temporal.valor_factura = parseFloat(temporal.valor_factura);
            temporal.valor_facturaString = obj.number_money(String(temporal.valor_factura));
            temporal.valor_descuento = parseFloat(temporal.valor_descuento);
            temporal.valor_descuentoString = obj.number_money(String(temporal.valor_descuento));
            temporal.saldo = parseFloat(temporal.saldo);
            temporal.saldoString = obj.number_money(String(temporal.saldo));
            temporal.totalSaldo = temporal.saldo - temporal.valor_descuento;
            temporal.totalSaldoString = obj.number_money(String(temporal.totalSaldo));
            callback(false, temporal); // Temporal encontrado
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.conceptosEspecificos = function (obj, callback) {

    var query = G.knex('glosas_concepto_general_especifico as a')
        .select([
            'b.codigo_concepto_especifico as codigo',
            'descripcion_concepto_especifico as nombre'
        ])
        .innerJoin('glosas_concepto_especifico as b', 'a.codigo_concepto_especifico', 'b.codigo_concepto_especifico')
        .where('a.codigo_concepto_general', obj.conceptoGeneral)
        .orderBy('b.codigo_concepto_especifico');
    // console.log('SQl is: ', G.sqlformatter.format(query.toString()));

    query.then(function(response){
        response.forEach(function(element){
            element.nombre = element.nombre.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        });
        callback(false, response);
    }).catch(function(err){
        callback(err);
    });
};

const promesa = new Promise((resolve, reject) => { resolve(true); });

NotasProveedoresModel.prototype.verNotasFactura = (obj, callback) => {
    console.log('In model "verNotasFactura"');

    promesa.then(response => {

        const inner =
            G.knex
                .select([
                    'x.codigo_proveedor_id',
                    'x.numero_factura',
                    G.knex.raw('SUM(((x.valor/((x.porc_iva/100)+1))*x.cantidad)) as subtotal'),
                    G.knex.raw('SUM(((x.valor-(x.valor/((x.porc_iva/100)+1)))*x.cantidad)) as iva_total'),
                    G.knex.raw('SUM((x.valor * x.cantidad)) as total')
                ])
                .from('inv_facturas_proveedores_d as x')
                .where('x.numero_factura', obj.facturaNumero)
                .andWhere('x.codigo_proveedor_id', obj.proveedorId)
                .groupBy(['x.codigo_proveedor_id', 'x.numero_factura']).as('f');

        const consultarNotasFactura =
            G.knex
                .select([
                    'a.empresa_id',
                    'a.prefijo',
                    'a.numero',
                    'a.numero_factura',
                    'a.codigo_proveedor_id',
                    'a.fecha_registro',
                    'a.valor_nota',
                    'b.descripcion as documento',
                    'd.tipo_id_tercero',
                    'd.tercero_id',
                    'd.nombre_tercero',
                    'e.usuario',
                    'f.subtotal',
                    'f.iva_total',
                    'f.total',
                    'g.porc_rtf',
                    'g.porc_ica',
                    'g.porc_rtiva',
                    G.knex.raw("TO_CHAR(g.fecha_registro,'YYYY') as anio_factura")
                ])
                .from(`${obj.tabla} as a`)
                .innerJoin('documentos as b', function() {
                    this.on('a.empresa_id', 'b.empresa_id')
                        .on('a.documento_id', 'b.documento_id')
                })
                .innerJoin('terceros_proveedores as c', 'a.codigo_proveedor_id', 'c.codigo_proveedor_id')
                .innerJoin('terceros as d', function() {
                    this.on('c.tipo_id_tercero', 'd.tipo_id_tercero')
                        .on('c.tercero_id', 'd.tercero_id')
                })
                .innerJoin('system_usuarios as e', 'a.usuario_id', 'e.usuario_id')
                .innerJoin(inner, function() {
                    this.on('a.numero_factura', 'f.numero_factura')
                        .on('a.codigo_proveedor_id', 'f.codigo_proveedor_id')
                })
                .innerJoin('inv_facturas_proveedores as g', function() {
                    this.on('a.numero_factura', 'g.numero_factura')
                        .on('a.codigo_proveedor_id', 'g.codigo_proveedor_id')
                })
                .where('a.numero_factura', obj.facturaNumero)
                .andWhere('a.codigo_proveedor_id', obj.proveedorId);

        return consultarNotasFactura;
    }).then(response => {
        console.log('Fine!!');
        callback(false, response);
    }).catch(err => {
        console.log('Error: ', err);
        callback(err);
    });
};

NotasProveedoresModel.prototype.eliminarProductoTemporal = (obj, callback) => {

    var query = G.knex('inv_notas_facturas_proveedor_d_tmp')
        .where('codigo_producto', obj.codigo)
        .andWhere('codigo_proveedor_id', obj.proveedorId)
        .andWhere('numero_factura', obj.facturaNumero)
        .del();

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    })
};

NotasProveedoresModel.prototype.conceptosGenerales = function (obj, callback) {
    var query = G.knex.select([
            'codigo_concepto_general as codigo',
            'descripcion_concepto_general as nombre'
        ])
        .from('glosas_concepto_general').orderBy('codigo_concepto_general');

    query.then(function (response) {
        callback(false, response);
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.ParametrosRetencion = function (obj, temporal, callback) {
    var filtro = 'anio = TO_CHAR(NOW(),\'YYYY\') ';

    if (obj.anioRetencion) {
        filtro = "anio = '" + obj.anioRetencion;
    }

    var query = G.knex('vnts_bases_retenciones')
        .select()
        .where('estado', '1')
        .andWhere('empresa_id', obj.empresaId)
        .andWhere(G.knex.raw(filtro));

    query.then(function (response) {
        if (response.length === 1) {
            var retenciones = response[0];
            retenciones.retencionFuente = 0.00;
            retenciones.retencionIca = 0.00;
            retenciones.retencionIva = 0.00;

            if (retenciones.sw_rtf === '2' || retenciones.sw_rtf === '3'){
                if (temporal.subtotal >= retenciones.base_rtf) {
                    retenciones.retencionFuente = temporal.subtotal * (temporal.porc_rtf / 100);
                }
            }
            if (retenciones.sw_ica === '2' || retenciones.sw_ica === '3') {
                if (temporal.subtotal >= retenciones.base_ica) {
                    retenciones.retencionIca = temporal.subtotal * (temporal.porc_ica / 1000);
                }
            }
            if (retenciones.sw_reteiva === '2' || retenciones.sw_reteiva === '3') {
                if (temporal.subtotal >= retenciones.base_reteiva) {
                    retenciones.retencionIva = temporal.iva_total * (temporal.porc_rtiva / 100);
                }
            }
            retenciones.retencionFuenteString = obj.number_money(String(retenciones.retencionFuente));
            retenciones.retencionIcaString = obj.number_money(String(retenciones.retencionIca));
            retenciones.retencionIvaString = obj.number_money(String(retenciones.retencionIva));

            callback(false, retenciones);
        } else if (response.length > 1) {
            throw 'Demasiados parametros de retencion!!';
        } else {
            throw 'No existen parametros de retencion!!';
        }
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.facturaDetalle = function (obj, temporales, callback) {
    let filtro = '1 = 1 ';
    let busqueda;

    if (obj.productoCodigo) {
        filtro += "and c.codigo_producto = '" + obj.productoCodigo + "' ";
    }
    if (obj.productoDescripcion) {
        filtro += "and c.descripcion ILIKE '%" + obj.productoDescripcion + "%' ";
    }

    var query = G.knex.select([
        'a.codigo_producto',
        G.knex.raw('sum(a.cantidad) as cantidad'),
        G.knex.raw('sum(a.cantidad_devuelta) as cantidad_devuelta'),
        G.knex.raw('AVG(a.valor) as valor'),
        G.knex.raw('AVG(a.porc_iva) as porc_iva'),
        'a.codigo_proveedor_id',
        'a.numero_factura',
        G.knex.raw('fc_descripcion_producto(a.codigo_producto) as descripcion'),
        G.knex.raw("CASE WHEN (b.codigo_producto IS NOT NULL) THEN 'disabled checked' ELSE ' ' END as checkbox")
    ]).from('inv_facturas_proveedores_d as a')
        .leftJoin('inv_notas_facturas_proveedor_d_tmp as b', function () {
            this.on('a.numero_factura', 'b.numero_factura')
                .on('a.codigo_producto', 'b.codigo_producto')
                .on('a.codigo_proveedor_id', 'b.codigo_proveedor_id')
        })
        .leftJoin('inventarios_productos as c', 'a.codigo_producto', 'c.codigo_producto')
        .where('a.numero_factura', obj.facturaNumero)
        .andWhere('a.codigo_proveedor_id', obj.proveedorId)
        .andWhere(G.knex.raw(filtro))
        .groupBy([
            'a.codigo_producto',
            'a.codigo_proveedor_id',
            'a.numero_factura',
            'b.codigo_producto'
        ]);
    query.then(function (response) {
        if (response.length > 0) {
            response.forEach(function (element) {
                element.cantidad = parseFloat(element.cantidad);
                element.cantidadString = element.cantidad.toLocaleString('de-DE').replace(/(,)/g, ".");
                element.valor = parseFloat(element.valor);
                element.valorString = obj.number_money(String(element.valor));
                element.valorTotal = parseFloat(element.valor * (element.cantidad - element.cantidad_devuelta));
                element.valorTotalString = obj.number_money(String(element.valorTotal));
                element.porc_iva = parseFloat(element.porc_iva);
                element.hidden = false;
                if(Array.isArray(temporales)){
                    busqueda = temporales.find(temporal => temporal.codigo === element.codigo_producto);
                    if(busqueda !== undefined){ element.hidden = true; }
                }else{ console.log('No existen temporales!'); }
            });
            callback(false, response);
        } else {
            throw 'Detalle no encontrado!';
        }
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.temporalDetalle = function (obj, callback) {

    var query = G.knex
        .select([
            'a.codigo_producto as codigo',
            G.knex.raw('fc_descripcion_producto(a.codigo_producto) as descripcionTitulo'),
            'a.numero_factura as facturaNumero',
            'a.codigo_proveedor_id as proveedorId',
            'a.valor_concepto as valorConcepto',
            'a.cantidad as cantidad',
            'a.valor',
            'a.porc_iva as porcIva',
            G.knex.raw('((a.porc_iva/100)*a.valor_concepto) as iva'),
            'a.observacion',
            'a.nota_mayor_valor as notaMayorValor',
            'a.concepto as conceptoGeneralId',
            'a.concepto_especifico as conceptoEspecificoId',
            'c.descripcion_concepto_general as conceptoGeneral',
            'd.descripcion_concepto_especifico as conceptoEspecifico',
            'e.usuario',
            'a.sube_baja_costo as subeBajaCosto',
            G.knex.raw(
                "CASE WHEN (a.nota_mayor_valor ='1')\n " +
                "   THEN 'NOTA POR MAYOR VALOR'\n   ELSE 'NOTA POR MENOR VALOR'\n   END as tipo_nota,\n" +
                "CASE WHEN (a.sube_baja_costo ='1') AND (a.nota_mayor_valor ='1')\n" +
                "   THEN 'APLICA NOTA BAJA COSTO'\n " +
                "WHEN (a.sube_baja_costo ='1') AND (a.nota_mayor_valor ='0')\n" +
                "   THEN 'APLICA NOTA SUBE COSTO'\n ELSE 'NO APLICA NOTA SUBE/BAJA COSTO'\n END as operacion"
            )
        ])
        .from('inv_notas_facturas_proveedor_d_tmp as a')
        .innerJoin('glosas_concepto_general_especifico as b', function () {
            this.on('a.concepto_especifico', 'b.codigo_concepto_especifico')
                .on('a.concepto', 'b.codigo_concepto_general')
        })
        .innerJoin('glosas_concepto_general as c', 'b.codigo_concepto_general', 'c.codigo_concepto_general')
        .innerJoin('glosas_concepto_especifico as d', 'b.codigo_concepto_especifico', 'd.codigo_concepto_especifico')
        .innerJoin('system_usuarios as e', 'a.usuario_id', 'e.usuario_id')
        .where('a.numero_factura', obj.facturaNumero)
        .andWhere('a.codigo_proveedor_id', obj.proveedorId)
        .orderBy('a.codigo_producto');
    // console.log('SQl2 is: ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        let response = {
            all: [],
            bajaCosto: [],
            subeCosto: [],
            totalBajaCosto: 0,
            totalSubeCosto: 0,
        };
        if(resultado.length > 0){
            let tipoNota;
            let totalConceptos = 0;
            resultado.forEach(element => {
                element.descripcionTitulo = element.descripciontitulo;
                delete element.descripciontitulo;
                if(element.descripcionTitulo.length > 25) {
                    element.descripcion = element.descripcionTitulo.substring(0, 25) + '...';
                }else{
                    element.descripcion = element.descripcionTitulo;
                }
                element.descripcionConCodigo = element.codigo + ' - ' + element.descripcionTitulo;
                element.cantidad = parseFloat(element.cantidad);
                element.cantidadString = element.cantidad.toLocaleString('de-DE').replace(/(,)/g, ".");
                element.iva = parseFloat(element.iva);
                element.ivaString = obj.number_money(String(element.iva));
                element.valor = parseFloat(element.valor);
                element.valorString = obj.number_money(String(element.valor));
                element.valorConcepto = parseFloat(element.valorConcepto);
                element.valorConceptoString = obj.number_money(String(element.valorConcepto));
                element.totalConcepto = element.valorConcepto * element.cantidad;
                element.totalConceptoString = obj.number_money(String(element.totalConcepto));
                element.tipoNota = element.tipo_nota;
                delete element.tipo_nota;
                response.all.push(element);
                if(element.notaMayorValor === '1'){
                    response.bajaCosto.push(element);
                    response.totalBajaCosto += element.valorConcepto;
                }else{
                    response.subeCosto.push(element);
                    response.totalSubeCosto += element.valorConcepto;
                }
            });
        }
        callback(false, response);
    }).catch(function (err) {
        callback(err);
    })
};

NotasProveedoresModel.prototype.ParametrosNota = function (obj, callback) {

    var query = G.knex.select([
        'a.empresa_id',
        'a.documento_id_credito',
        'a.documento_id_debito',
        'b.prefijo as prefijo_credito',
        'b.numeracion as numeracion_credito',
        'b.descripcion as descripcion_credito',
        'c.prefijo as prefijo_debito',
        'c.numeracion as numeracion_debito',
        'c.descripcion as descripcion_debito'
    ])
        .from('inv_notas_facturas_parametros as a')
        .innerJoin('documentos as b', function () {
            this.on('a.documento_id_credito', 'b.documento_id')
                .on('a.empresa_id', 'b.empresa_id')
        })
        .innerJoin('documentos as c', function () {
            this.on('a.documento_id_debito', 'c.documento_id')
                .on('a.empresa_id', 'c.empresa_id')
        })
        .where({
            'a.empresa_id': obj.empresaId,
            'a.modulo': obj.modulo
        });
    // console.log('Sql is: ', G.sqlformatter.format(query.toString()));

    query.then(response => {
        if(response.length === 1) { callback(false, response[0]); }
        else if(response.length > 1) { throw 'Existen muchos parametros para la nota!!\n Total: ' + response.length;}
        else { throw 'No existen parametros para la nota'; }
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.buscarTemporalEncabezado = function (obj, callback) {

    var join = G.knex.column([
        'x.codigo_proveedor_id',
        'x.numero_factura',
        G.knex.raw('SUM(((x.valor/((x.porc_iva/100)+1))*x.cantidad)) as subtotal'),
        G.knex.raw('SUM(((x.valor-(x.valor/((x.porc_iva/100)+1)))*x.cantidad)) as iva_total'),
        G.knex.raw('SUM((x.valor * x.cantidad)) as total')])
        .from('inv_facturas_proveedores_d as x')
        .where('x.numero_factura', obj.facturaNumero)
        .andWhere('x.codigo_proveedor_id', obj.proveedorId)
        .groupBy(['x.codigo_proveedor_id', 'x.numero_factura'])
        .as('f');

    var query = G.knex.select([
        "a.factura_proveedor",
        "a.codigo_proveedor_id",
        "a.empresa_id",
        "a.fecha_registro",
        "a.usuario_id",
        "c.tipo_id_tercero",
        "c.tercero_id",
        "c.nombre_tercero",
        "d.usuario",
        "e.saldo",
        "e.valor_factura",
        "e.valor_descuento",
        "e.porc_rtf",
        "e.porc_ica",
        "e.porc_rtiva",
        "f.subtotal",
        "f.iva_total",
        "f.total",
        G.knex.raw('TO_CHAR(e.fecha_registro,\'YYYY\') as anio_factura')
    ])
        .from('inv_notas_facturas_proveedor_tmp as a')
        .innerJoin('terceros_proveedores as b', 'a.codigo_proveedor_id', 'b.codigo_proveedor_id')
        .innerJoin('terceros as c', function () {
            this.on('b.tipo_id_tercero', 'c.tipo_id_tercero')
                .on('b.tercero_id', 'c.tercero_id')
        })
        .innerJoin('system_usuarios as d', 'a.usuario_id', 'd.usuario_id')
        .innerJoin('inv_facturas_proveedores as e', function () {
            this.on('a.factura_proveedor', 'e.numero_factura')
                .on('a.codigo_proveedor_id', 'e.codigo_proveedor_id')
        })
        .innerJoin(join, function () {
            this.on('e.numero_factura', 'f.numero_factura')
                .on('e.codigo_proveedor_id', 'f.codigo_proveedor_id')
        })
        .where('a.factura_proveedor', obj.facturaNumero)
        .andWhere('a.codigo_proveedor_id', obj.proveedorId);
    //console.log('Sql is: ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.insertNotaProveedor = (nota, transaccion, callback) => {
    let insertNota = G.knex(nota.tabla)
        .insert({
            documento_id: nota.documentoId,
            prefijo: nota.prefijo,
            numero: nota.numeracion,
            empresa_id: nota.parametros.empresa_id,
            codigo_proveedor_id: nota.encabezado.codigo_proveedor_id,
            usuario_id: nota.encabezado.usuario_id,
            numero_factura: nota.encabezado.factura_proveedor,
            valor_nota: nota.valorNota
        });

    // console.log('Encabezado query: ', G.sqlformatter.format(insertNota.toString()));

    if (transaccion){ insertNota.transacting(transaccion); }

    insertNota.then(response => {
        callback(false, response);
    }).catch(err => {
        callback(err);
    });
};

NotasProveedoresModel.prototype.insertNotaProveedorDetalle = (nota, transaccion, callback) => {
    let insertDetalle = {};
    let updateInventario = {};
    let nuevoCosto = 0;
    const itemsTotal = nota.items.length;
    let contador = 0;

    nota.items.forEach(item => {
        insertDetalle = G.knex(nota.tablaDetalle)
            .insert({
                item_id: G.knex.raw('DEFAULT'),
                empresa_id: nota.encabezado.empresa_id,
                prefijo: nota.prefijo,
                numero: nota.numeracion,
                cantidad: item.cantidad,
                porc_iva: item.porcIva,
                codigo_producto: item.codigo,
                valor_concepto: item.valorConcepto,
                valor_unitario: item.valor,
                concepto: item.conceptoGeneralId.trim(),
                concepto_especifico: item.conceptoEspecificoId.trim(),
                observacion: item.observacion,
                sube_baja_costo: item.subeBajaCosto
            });

        // console.log('Detalle Query: ', G.sqlformatter.format(insertDetalle.toString()));

        nuevoCosto = item.valor - (item.valorConcepto / item.cantidad);

        if (transaccion){ insertDetalle.transacting(transaccion); }

        insertDetalle.then(response => {
            updateInventario = G.knex('inventarios')
                .update({
                    costo: nuevoCosto,
                    costo_ultima_compra: nuevoCosto
                })
                .where('empresa_id', nota.parametros.empresa_id)
                .andWhere('codigo_producto', item.codigo);

            if (transaccion){ updateInventario.transacting(transaccion); }

            return updateInventario;
        }).then(response => {
            contador++;
            if(itemsTotal === contador){ callback(false, true); }
        }).catch(err => {
            callback(err);
        });
    });
};

NotasProveedoresModel.prototype.updateFacturasProveedores = (nota, transaccion, callback) => {
    const saldo = G.knex.raw(`(saldo ${nota.signo} ${nota.valorNota})`);
    const valorNotasKey = G.knex.raw(`valor_notas_${nota.tipoNota}`);
    const valorNotasValue = G.knex.raw(`(valor_notas_${nota.tipoNota} + ${nota.valorNota})`);
    let objUpdate = {
        saldo: saldo,
        [valorNotasKey]: valorNotasValue
    };

    const updateSaldoValorNota = G.knex('inv_facturas_proveedores')
        .update(objUpdate)
        .where('codigo_proveedor_id', nota.encabezado.codigo_proveedor_id)
        .andWhere('numero_factura', nota.encabezado.factura_proveedor);

    if(transaccion) { updateSaldoValorNota.transacting(transaccion); }

    updateSaldoValorNota.then(response => {
            let filtro = G.knex.raw('saldo <= 0');
            let objUpdate2 = { sw_estado: '2' };

            const updateEstado = G.knex('inv_facturas_proveedores')
                .update(objUpdate2)
                .where('codigo_proveedor_id', nota.encabezado.codigo_proveedor_id)
                .andWhere('numero_factura', nota.encabezado.factura_proveedor)
                .andWhere(filtro);

            if(transaccion) { updateEstado.transacting(transaccion); }

            return updateEstado;
        }).then(response => {
            callback(false, response);
        }).catch(err => {
            callback(err);
        });
};

NotasProveedoresModel.prototype.updateDocumentos = (nota, transaccion, callback) => {
    let updateDocumentos = G.knex('documentos')
        .update('numeracion', G.knex.raw('numeracion+1'))
        .where('empresa_id', nota.encabezado.empresa_id)
        .andWhere('documento_id', nota.documentoId);

    if(transaccion) { updateDocumentos.transacting(transaccion) }

    updateDocumentos.then(response => {
        callback(false, response);
    }).catch(err => {
        callback(err);
    });
};

NotasProveedoresModel.prototype.crearNota = (parametrosNota, temporal, transaccion, callback) => {

    transaction.then(response => {
        console.log('Transaction fine!!\nResponse: ', response);
        callback(false, response);
    }).catch(err => {
        callback(err);
    });
};

NotasProveedoresModel.$inject = [];
module.exports = NotasProveedoresModel;
