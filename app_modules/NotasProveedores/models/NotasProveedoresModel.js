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

NotasProveedoresModel.prototype.guardarTemporalDetalle = function (obj, callback) {
    if (obj.sube_baja_costo === undefined) {
        obj.sube_baja_costo = '0';
    }
    if (obj.nota_mayor_valor === undefined) {
        obj.nota_mayor_valor = '0';
    }

    var query = G.knex('inv_notas_facturas_proveedor_d_tmp').insert({
        codigo_proveedor_id: obj.proveedorId,
        numero_factura: obj.facturaNumero,
        empresa_id: obj.empresaId,
        usuario_id: obj.usuarioId,
        codigo_producto: obj.codigo_producto,
        cantidad: obj.cantidad,
        concepto: obj.codigo_concepto_general,
        concepto_especifico: obj.concepto_especifico,
        valor_concepto: obj.valor_concepto,
        observacion: obj.observacion,
        nota_mayor_valor: obj.nota_mayor_valor,
        valor: obj.valor,
        porc_iva: obj.porc_iva,
        sube_baja_costo: obj.sube_baja_costo
    });
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(false, {});
    });
};

NotasProveedoresModel.prototype.BuscarCrearTemporal = function (obj, callback) {
    var that = this;

    G.Q.ninvoke(that, 'BuscarTemporales', obj)
        .then(function(temporal){
            if(temporal.length === 0){
                var query = G.knex('inv_notas_facturas_proveedor_tmp')
                    .insert({
                        codigo_proveedor_id: obj.proveedorId,
                        factura_proveedor: obj.facturaNumero,
                        empresa_id: obj.empresaId,
                        usuario_id: obj.usuarioId
                    });
                return query.then(function(){
                    return G.Q.ninvoke(that, 'BuscarTemporales', obj); // Temporal Creado
                }).then(function(temporal){
                    if(temporal.length > 0) { return temporal; }
                    else{ throw 'Error al crear'; }
                }).catch(function(err){
                    console.log('Error: ', err);
                });
            }else{ return temporal; } // Buscando temporal
        }).then(function (result) {
            callback(false, result); // Temporal encontrado
        }).catch(function (err) {
            callback(err);
        });
};

NotasProveedoresModel.prototype.EliminarItemTemporal = function (obj, callback) {
    console.log('In Model "EliminarItemTemporal"');

    var query = G.knex(inv_notas_facturas_proveedor_d_tmp)
        .where('codigo_producto', obj.codigo_producto)
        .andWhere('codigo_proveedor_id', obj.codigo_proveedor_id)
        .andWhere('numero_factura', obj.facturaNumero)
        .del();

    query.then(function (resultado) {
        console.log('Se elimino el temporal!!');
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    })
};

NotasProveedoresModel.prototype.BuscarGlosasConceptoGeneral = function(obj, callback)
{
    var query = G.knex.select().from('glosas_concepto_general').orderBy('codigo_concepto_general');

    query.then(function(response){
        callback(false, response);
    }).catch(function(err){
        callback(err);
    });
};

NotasProveedoresModel.prototype.ParametrosRetencion = function (obj, callback) {
    var filtro = 'anio = TO_CHAR(NOW(),\'YYYY\') ';

    if (obj.anioRetencion) {
        filtro = "anio = '" + obj.anioRetencion;
    }

    var query = G.knex('vnts_bases_retenciones')
        .select()
        .where('estado', '1')
        .andWhere('empresa_id', obj.empresaId)
        .andWhere(G.knex.raw(filtro));

    query.then(function(response){
        if(response.length > 0){ callback(false, response); }
        else{ throw 'No existen parametros de retencion!!'; }
    }).catch(function(err){
        callback(err);
    });
};

NotasProveedoresModel.prototype.BuscarDetalle = function(obj, callback){
    var filtro = '1 = 1 ';

    if(obj.productoCodigo){
        filtro += "and c.codigo_producto = '" + obj.productoCodigo + "' ";
    }
    if(obj.productoDescripcion){
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
        .leftJoin('inv_notas_facturas_proveedor_d_tmp as b', function(){
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
    query.then(function(response){
        if(response.length > 0){
            response.forEach(function(element) {
                element.valor = element.valor;
                element.valorString = obj.number_money(String(element.valor));
                element.valorTotal = parseFloat(element.valor * (element.cantidad - element.cantidad_devuelta));
                element.valorTotalString = obj.number_money(String(element.valorTotal));
                element.porc_iva = parseFloat(element.porc_iva);
            });
            callback(false, response);
        }else{ throw 'Detalle no encontrado!'; }
    }).catch(function(err){
        callback(err);
    });


};

NotasProveedoresModel.prototype.DetalleNotaTemporal = function (obj, callback) {
    var filtro = '1 = 1';

    if (obj.tipoNota) {
        filtro = " a.nota_mayor_valor = '" + obj.tipoNota + "' ";
    }

    var query = G.knex
        .select([
            'a.codigo_producto',
            G.knex.raw('fc_descripcion_producto(a.codigo_producto) as descripcion'),
            'a.numero_factura',
            'a.codigo_proveedor_id',
            'a.valor_concepto',
            'a.cantidad',
            'a.valor',
            'a.porc_iva',
            G.knex.raw('((a.porc_iva/100)*a.valor_concepto) as iva'),
            'a.observacion',
            'a.nota_mayor_valor',
            'a.concepto',
            'a.concepto_especifico',
            'c.descripcion_concepto_general',
            'd.descripcion_concepto_especifico',
            'e.usuario',
            'a.sube_baja_costo',
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
        .andWhere(G.knex.raw(filtro))
        .orderBy('a.codigo_producto');
    // console.log('SQl2 is: ', G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
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

    query.then(function (response) {
        callback(false, response);
    }).catch(function (err) {
        callback(err);
    });
};

NotasProveedoresModel.prototype.BuscarTemporales = function (obj, callback) {

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

NotasProveedoresModel.$inject = [];
module.exports = NotasProveedoresModel;
