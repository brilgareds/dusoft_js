var DocumentoBodegaE009 = function () {
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las bodegas que pertenezcan a la empresa y la bodega
 * seleccionada
 * @params obj: pedidoId
 * @fecha 2018-02-05
 */
DocumentoBodegaE009.prototype.listarBodegas = function (callback) {
    var query = G.knex
            .select()
            .from('bodegas');
    //.where('bodega','03');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarBodegas]:", err);
        callback(err);
    });
};


/**
 * @author German Galvis
 * +Descripcion consulta todas las productos
 * @fecha 2018-02-12
 */
DocumentoBodegaE009.prototype.listarProductos = function (parametros, callback) {
    console.log("modelo productos", parametros);
    var columnas = [
        "invenPro.codigo_producto",
        "invenPro.tipo_producto_id",
        "invenPro.descripcion",
        "exisBodega.existencia",
        "subclase.descripcion AS subClase"
    ];

    var query = G.knex.distinct('invenPro.codigo_producto')
            .select(columnas)
            .from("inventarios_productos AS invenPro")
            .innerJoin("existencias_bodegas AS exisBodega ", function () {
                this.on("invenPro.codigo_producto", "exisBodega.codigo_producto")
            })
            .innerJoin("empresas AS empresa", function () {
                this.on("exisBodega.empresa_id", "empresa.empresa_id")
            })
            .innerJoin("centros_utilidad AS centro", function () {
                this.on("exisBodega.centro_utilidad", "centro.centro_utilidad")
            })
            .innerJoin("bodegas AS bodega", function () {
                this.on("exisBodega.bodega", "bodega.bodega")
            })
            .innerJoin("inv_subclases_inventarios AS subclase", function () {
                this.on("invenPro.subclase_id", "subclase.subclase_id")
                .on("invenPro.clase_id", "subclase.clase_id")
            })
            .where("empresa.empresa_id", parametros.empresa_id)
            .andWhere("centro.centro_utilidad", parametros.centro_utilidad)
            .andWhere("bodega.bodega", parametros.bodega)
            .andWhere("exisBodega.existencia", '>', 0)
           // .andWhere('invenPro.descripcion', 'like', '%' + parametros.busqueda.toString().toUpperCase() + '%')
            .andWhere(function () {
                if (parametros.tipoFiltro === '0') {
                    this.andWhere("invenPro.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else if (parametros.tipoFiltro === '2') {
                    this.andWhere("subclase.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else {
                    this.andWhere("invenPro.codigo_producto", parametros.descripcion);
                }
            })
            .limit(G.settings.limit).offset((parametros.pagina_actual - 1) * G.settings.limit);


    query.then(function (resultado) {
        console.log("Query resultado ", resultado);
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosEmpresa]:", err);
        callback(err);
    });
};


//DocumentoBodegaE009.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocumentoBodegaE009;
