var CajaGeneralModel = function() {
};


/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-05-31 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarCajaGeneral = function(obj, callback) {

    var columna_a = [
        "a.caja_id",
        "b.sw_todos_cu",
        "b.empresa_id",
        "b.centro_utilidad",
        "b.ip_address",
        G.knex.raw("b.descripcion as descripcion3"),
        "b.tipo_numeracion",
        G.knex.raw("d.razon_social as descripcion1"),
        G.knex.raw("e.descripcion as descripcion2"),
        "b.cuenta_tipo_id",
        "a.caja_id",
        "b.tipo_numeracion_devoluciones",
        G.knex.raw("NULL AS prefijo_fac_contado"),
        G.knex.raw("NULL AS prefijo_fac_credito"),
        G.knex.raw("NULL as concepto_caja")
    ];
    var columna_b = [
        "a.caja_id",
        G.knex.raw("NULL as sw_todos_cu"),
        "b.empresa_id",
        "f.centro_utilidad",
        "b.ip_address",
        G.knex.raw("b.descripcion as descripcion3"),
        G.knex.raw("NULL as tipo_numeracion"),
        G.knex.raw("d.razon_social as descripcion1"),
        G.knex.raw("e.descripcion AS descripcion2"),
        "b.cuenta_tipo_id",
        "a.caja_id",
        G.knex.raw("NULL as tipo_numeracion_devoluciones"),
        "b.prefijo_fac_contado",
        "b.prefijo_fac_credito",
        G.knex.raw("b.concepto as concepto_caja")
    ];

    var query = G.knex.select(columna_a)
            .from('cajas_usuarios as a')
            .innerJoin('cajas as b', function() {
        this.on("a.caja_id", "b.caja_id")
    })
            .innerJoin('documentos as c', function() {
        this.on("b.tipo_numeracion", "c.documento_id")
    })
            .innerJoin('empresas as d', function() {
        this.on("b.empresa_id", "d.empresa_id")
    })
            .innerJoin('centros_utilidad as e', function() {
        this.on("d.empresa_id", "e.empresa_id")
                .on("b.centro_utilidad", "e.centro_utilidad")
    })
            .where(function() {

    }).andWhere(' a.usuario_id', obj.usuario_id)
            .andWhere('d.empresa_id', obj.empresa_id)
            .andWhere('b.centro_utilidad', obj.centro_utilidad)
            .union(function() {
        this.select(columna_b)
                .from("userpermisos_cajas_rapidas as a")
                .innerJoin('cajas_rapidas as b', function() {
            this.on("a.caja_id", "b.caja_id")
        })
                .innerJoin('empresas as d', function() {
            this.on("b.empresa_id", "d.empresa_id")
        })
                .innerJoin('departamentos as f', function() {
            this.on("b.departamento", "f.departamento")
        })
                .innerJoin('centros_utilidad as e', function() {
            this.on("f.centro_utilidad", "e.centro_utilidad")
                    .on("f.empresa_id", "e.empresa_id")
        })
                .where(function() {
            this.andWhere(G.knex.raw("b.cuenta_tipo_id = '03'"))
            this.orWhere(G.knex.raw("b.cuenta_tipo_id='08'"))

        }).andWhere('a.usuario_id', obj.usuario_id)
                .andWhere('f.empresa_id', obj.empresa_id)
                .andWhere('f.centro_utilidad', obj.centro_utilidad)
    }).as("b");

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarCajaGeneral]:", err);
        callback(err);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los grupos
 * @fecha 2017-06-02 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarGrupos = function(obj, callback) {

    var columna = [
        G.knex.raw("DISTINCT a.grupo_concepto"),
        "a.descripcion",
        "b.grupo_concepto",
        "b.descripcion",
        "b.precio",
        "b.porcentaje_gravamen",
        "b.sw_precio_manual",
        "b.sw_cantidad",
        "b.concepto_id"
    ];

    var query = G.knex.select(columna)
            .from('grupos_conceptos as a')
            .innerJoin('conceptos_caja_conceptos as b',
            function() {
                this.on("a.grupo_concepto", "b.grupo_concepto")
            }).where(function() {
        if (obj.contado) {
            this.andWhere(G.knex.raw("b.sw_contado='1'"))
        }
        if (obj.credito) {
            this.andWhere(G.knex.raw("b.sw_credito='1'"))
        }
        if (obj.conceptoId !== '') {
            this.andWhere('b.concepto_id', obj.conceptoId)
        }
        if (obj.grupoConcepto !== '') {
            this.andWhere('b.grupo_concepto', obj.grupoConcepto)
        }
    }).andWhere('a.empresa_id', obj.empresa_id)

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarGrupos]:", err);
        callback(err);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los Conceptos
 * @fecha 2017-06-02 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarConceptos = function(obj, callback) {

    var columna = [
        "b.grupo_concepto",
        "b.descripcion",
        "b.precio",
        "b.porcentaje_gravamen",
        "b.sw_precio_manual",
        "b.sw_cantidad",
        "b.concepto_id"
    ];

    var query = G.knex.select(columna)
            .from('grupos_conceptos as a')
            .innerJoin('conceptos_caja_conceptos as b',
            function() {
                this.on("a.grupo_concepto", "b.grupo_concepto")
            }).where(function() {
        if (obj.contado) {
            this.andWhere(G.knex.raw("b.sw_contado='1'"))
        }
        if (obj.credito) {
            this.andWhere(G.knex.raw("b.sw_credito='1'"))
        }
    }).andWhere('a.empresa_id', obj.empresa_id)

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarGrupos]:", err);
        callback(err);
    });
};

CajaGeneralModel.$inject = [];


module.exports = CajaGeneralModel;