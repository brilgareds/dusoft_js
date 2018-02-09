var DevolucionesFarmaciaModel = function () {

};


/*@author German Andres Galvis H.
 * @fecha 2018-02-08
 * funcion que realiza consulta a la tabla Empresas
 * @param {type} callback
 * @returns {datos de consulta}
 */
// json
DevolucionesFarmaciaModel.prototype.listarEmpresas2 = function (empresaNombre, callback) {

console.log("MODEL  listarEmpresas2");
    var column = [
        "empresa_id",
        "razon_social"
    ];

    var query = G.knex.column(column)
            .select()
            .from('empresas')
            .where(G.knex.raw("razon_social :: varchar"), G.constants.db().LIKE, "%" + empresaNombre + "%")
            .limit(5)
            .then(function (rows) {
                callback(false, rows);
            })
            .catch(function (error) {
                callback(error);
            }).done();
};


/**
 * @author German Galvis
 * +Descripcion consulta todas las empresas
 * @fecha 2018-02-08
 */
DevolucionesFarmaciaModel.prototype.listarEmpresas = function (callback) {
    
    console.log("MODEL  listarEmpresas");
    console.log("modelo ");
    var query = G.knex
            .select()
            .from('empresas')
            .where('sw_activa', 1);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarEmpresas]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las productos
 * @fecha 2018-02-08
 */
DevolucionesFarmaciaModel.prototype.listarProductosEmpresa = function (parametros, callback) {
    
    console.log("MODEL listarProductosEmpresa");
    var columnas = [
        "invenPro.codigo_producto",
        "invenPro.descripcion",
        "existenciaBodega.existencia",
        "invenPro.porc_iva",
        "inventario.costo",
        "inventario.precio_venta"
    ];

    var query = G.knex.distinct('invenPro.codigo_producto')
            .select(columnas)
            .from("inventarios_productos AS invenPro")
            .innerJoin("inventarios AS inventario", function () {
                this.on("invenPro.codigo_producto", "inventario.codigo_producto")
            })
            .innerJoin("existencias_bodegas AS existenciaBodega ", function () {
                this.on("invenPro.codigo_producto", "existenciaBodega.codigo_producto")
            })
            .innerJoin("empresas AS empresa", function () {
                this.on("existenciaBodega.empresa_id", "empresa.empresa_id")
                        .on("inventario.empresa_id", "empresa.empresa_id")
            })
            .innerJoin("centros_utilidad AS centro", function () {
                this.on("existenciaBodega.centro_utilidad", "centro.centro_utilidad")
            })
            .innerJoin("bodegas AS bodega", function () {
                this.on("existenciaBodega.bodega", "bodega.bodega")
            })
            .where("empresa.empresa_id", parametros.empresa)
            .andWhere("centro.centro_utilidad", parametros.centroUtilidad)
            .andWhere("bodega.bodega", parametros.bodega)
            .andWhere('invenPro.descripcion', 'like', '%' + parametros.busqueda.toString().toUpperCase() + '%')
            .limit(G.settings.limit).offset((parametros.pagina_actual - 1) * G.settings.limit);


    console.log("Query resultado", G.sqlformatter.format(
            query.toString()));

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosEmpresa]:", err);
        callback(err);
    });
};