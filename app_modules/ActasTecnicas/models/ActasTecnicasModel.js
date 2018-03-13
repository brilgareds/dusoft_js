var ActasTecnicasModel = function () {

};

/**
 * @author Andres M Gonzalez
 * +Descripcion almacena el acta tecnica
 * @params obj: objeto que contiene los datos del formulario
 * @fecha 2018-02-20
 */
ActasTecnicasModel.prototype.guardarActa = function (obj, callback) {

    var observacion = obj.form.observacionDiligenciar === undefined ? '' : obj.form.observacionDiligenciar;

    var query = G.knex("esm_acta_tecnica").
            insert({
                empresa_id: obj.form.empresa,
                centro_utilidad: obj.form.centro_utilidad,
                bodega: obj.form.bodega,
                usuario_id: obj.form.usuario_id,
                orden_pedido_id: obj.form.orden,
                codigo_producto: obj.form.codigoProducto,
                lote: obj.form.lote,
                fecha_vencimiento: obj.form.vencimiento,
                numero_factura: obj.form.factura,
                numero_remision: obj.form.remision,
                registro_sanitario: obj.form.registroSanitario,
                argumentacion_doble_muestreo: obj.form.argumentacionDobleMst,
                total_corrugadas: obj.form.totalCorrugado,
                unidad_corrugadas: obj.form.unCorrugada,
                unidad_corrugadas_a_muestrear: obj.form.unCorugadaMst,
                corrugadas_a_muestrear: obj.form.corrugadaMst,
                sw_concepto_calidad: obj.form.filtroAprobacion.selec,
                observacion: observacion,
                responsable_realiza: obj.form.nombre_usuario,
                responsable_verifica: obj.form.usuarioVerifica, //verifica
                cantidad: obj.form.cantidad,
                c_nc_lote: obj.form.loteC,
                c_nc_vencimiento: obj.form.vencimientoC,
                prefijo: null,
                numero: null,
                unidades_a_muestrear: obj.form.unidadesMst,
                unidades_adicionales_a_muestrear: obj.form.unidAdicionales,
                relacion_defectos: obj.form.filtror.selec,
                cantidad_defectusos: obj.form.cantidadRelacion,
                maximo_permitido: obj.form.maximoPermitidoRelacion,
                observacion_defectuosos: obj.form.observacionDefectuosos,
                observacion_calidad: obj.form.observacionConcepto,
                fabricante: obj.form.fabricante
            }).returning("acta_tecnica_id");


    if (obj.transaccion)
        query.transacting(obj.transaccion);

    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error ", err);
        callback(err);
    }).done();
};

/**
 * @author Andres M Gonzalez
 * +Descripcion modifica en la tabla esm_acta_tecnica
 * @params obj: prefijo y numero
 * @fecha 2018-02-20
 */
ActasTecnicasModel.prototype.updateActaTecnica = function (obj, transaccion, callback) {

    var query = G.knex("esm_acta_tecnica").
            where('orden_pedido_id', obj.orden_pedido_id).
            update({
                prefijo: obj.prefijo,
                numero: obj.numero
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });

};

/**
 * @author Andres M Gonzalez
 * +Descripcion inserta en la tabla esm_acta_tecnica_evaluacion_visual
 * @params obj: datos a almacenar
 * @fecha 2018-02-20
 */
ActasTecnicasModel.prototype.evalucacionVisual = function (obj, callback) {

    var query = G.knex("esm_acta_tecnica_evaluacion_visual").
            insert(
                    {
                        acta_tecnica_id: obj.acta_tecnica_id,
                        evaluacion_visual_id: obj.evaluacion_visual_id,
                        observaciones: obj.observacionEvaluacion,
                        sw_cumple: obj.sw_cumple

                    });

    if (obj.transaccion)
        query.transacting(obj.transaccion);

    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error ", err);
        callback(err);
    }).done();
};

/**
 * @author Andres M Gonzalez
 * +Descripcion consulta las actas segun orden
 * @params obj: codigo proveerdor, orden de pedido
 * @fecha 2018-02-20
 */
ActasTecnicasModel.prototype.listarOrdenesParaActas = function (obj, callback) {

    var columna = [
        G.knex.raw("distinct a.orden_pedido_id as numero_orden"),
        "c.tipo_id_tercero",
        "c.tercero_id",
        "c.nombre_tercero",
        "b.codigo_proveedor_id",
        "a.observacion as observaciones",
        G.knex.raw("TO_CHAR(a.fecha_registro,'DD-MM-YYYY hh:mm:ss pm') as fecha_registro")
    ];

    var query = G.knex.select(columna)
            .from('compras_ordenes_pedidos as a')
            .innerJoin('terceros_proveedores as b',
                    function () {
                        this.on("a.codigo_proveedor_id", "b.codigo_proveedor_id");
                    })
            .innerJoin('terceros as c',
                    function () {
                        this.on("b.tipo_id_tercero", "c.tipo_id_tercero")
                                .on("b.tercero_id", "c.tercero_id");
                    })
            .where(function () {
                if (obj.codigoProveedor !== undefined && obj.codigoProveedor !== "") {
                    this.andWhere(G.knex.raw("b.codigo_proveedor_id = " + obj.codigoProveedor));
                }
                if (obj.termino !== undefined && obj.termino !== "") {
                    this.andWhere(G.knex.raw("a.orden_pedido_id = " + obj.termino));
                }
            });

    query.then(function (resultado) {
        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [listarOrdenesParaActas]:", query.toSQL());
        callback(err);
    });
};

/**
 * @author Andres M Gonzalez
 * +Descripcion consulta los productos para actas
 * @params obj: codigo proveerdor, orden de pedido
 * @fecha 2018-02-20
 */
ActasTecnicasModel.prototype.listarProducto = function (obj, callback) {

    var columna = [
        G.knex.raw("fc_descripcion_producto_alterno(a.codigo_producto) as descripcion_producto"),
        "b.descripcion as nombre_generico",
        G.knex.raw("c.descripcion||' x '||a.cantidad  as presentacion_comercial"),
        "d.descripcion as fabricante",
        "e.numero_unidades as cantidad",
        "a.codigo_invima as codigo_invima"
    ];

    var query = G.knex.select(columna)
            .from('inventarios_productos as a')
            .innerJoin('inv_subclases_inventarios as b',
                    function () {
                        this.on("a.grupo_id", "b.grupo_id")
                                .on("a.clase_id", "b.clase_id")
                                .on("a.subclase_id", "b.subclase_id");
                    })
            .innerJoin('inv_presentacioncomercial as c',
                    function () {
                        this.on("a.presentacioncomercial_id", "c.presentacioncomercial_id");
                    })
            .innerJoin('inv_fabricantes as d',
                    function () {
                        this.on("d.fabricante_id", "a.fabricante_id");
                    })
            .innerJoin('compras_ordenes_pedidos_detalle as e',
                    function () {
                        this.on("e.codigo_producto", "a.codigo_producto")
                                .on("e.orden_pedido_id", obj.ordenPedido);
                    })
            .where(function () {

                this.andWhere("a.codigo_producto", obj.codigoProducto);

            });

    query.then(function (resultado) {
        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [listarProducto]:", G.sqlformatter.format(query.toString()));
        callback(err);
    });
};

/**
 * @author Andres M Gonzalez
 * +Descripcion consulta el detalle de la orden
 * @params obj: orden de pedido
 * @fecha 2018-02-20
 */
ActasTecnicasModel.prototype.listarProductosParaActas = function (obj, callback) {


    var columna = [
        "a.empresa_id_pedido",
        "a.centro_utilidad_pedido",
        "a.bodega_pedido",
        "b.orden_pedido_id",
        "b.codigo_producto",
        G.knex.raw("fc_descripcion_producto_alterno(b.codigo_producto) AS descripcion"),
        "b.numero_unidades",
        "b.valor",
        "b.porc_iva",
        G.knex.raw("CASE WHEN  b.codigo_producto in (\
                             select a.codigo_producto \
                             from esm_acta_tecnica a \
                             WHERE   \
                             a.orden_pedido_id=b.orden_pedido_id \
                            )\
                           THEN '1' ELSE '0' END AS estado_acta ")
    ];

    var query = G.knex.select(columna)
            .from('compras_ordenes_pedidos_detalle as b')
            .innerJoin('compras_ordenes_pedidos as a',
                    function () {
                        this.on("b.orden_pedido_id", "a.orden_pedido_id");
                    })
            .where(function () {
                this.andWhere("b.orden_pedido_id", obj.ordenPedido);
            });

    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [listarProductosParaActas]:", query.toSQL());
        callback(err);
    });
};

module.exports = ActasTecnicasModel;