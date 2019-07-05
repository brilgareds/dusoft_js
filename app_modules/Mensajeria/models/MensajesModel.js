/* global G */
var Mensajeria = function () {
};

/**
 * @author German Galvis
 * +Descripcion consulta todos los mensajes del usuario en sesion
 * @params parametro: termino de busqueda 
 * @params callback: listado
 * @fecha 2019-06-29
 */
Mensajeria.prototype.listarMensajesTotal = function (parametros, callback) {

    var columnas = [
        "a.actualizacion_id",
        "a.usuario_id",
        "a.asunto",
        "a.descripcion",
        G.knex.raw("to_char(a.fecha_ini, 'dd-mm-yy hh:mi am') as fecha_registro"),
        G.knex.raw("to_char(a.fecha_fin, 'dd-mm-yy hh:mi am') as fecha_validez"),
        G.knex.raw("(select count(b.actualizacion_id) from controlar_lectura as b where b.actualizacion_id=a.actualizacion_id) as cantidad_lectores"),
        G.knex.raw("(SELECT array_to_string(array_agg(descripcion), ', ') FROM (select cx.perfil_id, cx.obligatorio,ca.descripcion\
                    from controlar_x_perfil as cx\
                    left join system_perfiles as ca on cx.perfil_id = ca.perfil_id\
                    where cx.actualizacion_id = a.actualizacion_id ORDER BY cx.perfil_id) as x ) as perfiles"),
//        "to_char(fecha_ini, 'dd-mm-yy hh:mi am') as fecha_inia",
//        "to_char(fecha_fin, 'dd-mm-yy hh:mi am') as fecha_fina",
//        "to_char(fecha_actu, 'dd-mm-yy hh:mi am') as fecha_actua",
//        "fecha_ini as fecha_registro",
//        "fecha_fin as fecha_validez",
        "a.fecha_actu"
    ];

    var query = G.knex.select(columnas)
            .from('actualizaciones as a');

    if (parametros.filtro === 2) {
        query.andWhere(G.knex.raw("a.descripcion " + G.constants.db().LIKE + "'%" + parametros.termino_busqueda + "%' "));
    }

    if (parametros.filtro === 1) {
        query.andWhere(G.knex.raw("a.asunto " + G.constants.db().LIKE + "'%" + parametros.termino_busqueda + "%' "));
    }

    query.orderBy('a.fecha_ini', 'desc');

    if (parametros.tipo === 1) {
        query.limit(G.settings.limit).offset((parametros.pagina_actual - 1) * G.settings.limit);
    }

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarMensajesTotal]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todos los usuarios que han leido el mensaje
 * @params parametro: termino de busqueda 
 * @params callback: listado
 * @fecha 2019-07-02
 */
Mensajeria.prototype.ConsultarLecturasMensajes = function (obj, callback) {

    var columnas = [
        "su.nombre",
        G.knex.raw("to_char(cl.fecha_lectura, 'dd-mm-yy hh:mi am') as fecha")
    ];

    var query = G.knex.select(columnas)
            .from('controlar_lectura as cl')
            .innerJoin("system_usuarios as su ", "cl.usuario_id", "su.usuario_id")
            .where('cl.actualizacion_id', obj.id)
            .orderBy('su.nombre', 'asc');


    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [ConsultarLecturasMensajes]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todos los roles a los que va dirigido el mensaje
 * @params parametro: termino de busqueda 
 * @params callback: listado
 * @fecha 2019-07-02
 */
Mensajeria.prototype.ConsultarRolesMensajes = function (obj, callback) {

    var columnas = [
        "cx.perfil_id",
        "cx.obligatorio",
        "ca.descripcion"
    ];

    var query = G.knex.select(columnas)
            .from('controlar_x_perfil as cx')
            .leftJoin("system_perfiles as ca ", "cx.perfil_id", "ca.perfil_id")
            .where('cx.actualizacion_id', obj.id);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [ConsultarRolesMensajes]:", err);
        callback(err);
    });
};

module.exports = Mensajeria;