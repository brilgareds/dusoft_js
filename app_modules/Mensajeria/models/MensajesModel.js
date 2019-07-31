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
        "su.nombre",
        "a.asunto",
        "a.descripcion",
        G.knex.raw("to_char(a.fecha_ini, 'dd-mm-yy hh:mi am') as fecha_registro"),
        G.knex.raw("to_char(a.fecha_fin, 'dd-mm-yy hh:mi am') as fecha_validez"),
        G.knex.raw("(select count(b.actualizacion_id) from controlar_lectura as b where b.actualizacion_id=a.actualizacion_id) as cantidad_lectores"),
        G.knex.raw("(SELECT array_to_string(array_agg(descripcion), ', ') FROM (select cx.perfil_id, cx.obligatorio,ca.descripcion\
                    from controlar_x_perfil as cx\
                    left join system_perfiles as ca on cx.perfil_id = ca.perfil_id\
                    where cx.actualizacion_id = a.actualizacion_id ORDER BY cx.perfil_id) as x ) as perfiles"),
        "a.fecha_actu"
    ];

    var query = G.knex.select(columnas)
            .from('actualizaciones as a')
            .innerJoin("system_usuarios as su ", "a.usuario_id", "su.usuario_id");

    if (parametros.filtro === 2) {
        query.andWhere(G.knex.raw("a.descripcion " + G.constants.db().LIKE + "'%" + parametros.termino_busqueda + "%' "));
    }

    if (parametros.filtro === 1) {
        query.andWhere(G.knex.raw("a.asunto " + G.constants.db().LIKE + "'%" + parametros.termino_busqueda + "%' "));
    }

    query.orderBy('a.fecha_ini', 'desc');

    query.limit(G.settings.limit).offset((parametros.pagina_actual - 1) * G.settings.limit);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarMensajesTotal]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta los perfiles del sistema
 * @params parametro: 
 * @params callback: listado
 * @fecha 2019-07-25
 */
Mensajeria.prototype.consultarPerfiles = function (obj, callback) {

    var columnas = [
        "id as perfil_id",
        "nombre as descripcion"
    ];

    var query = G.knex.select(columnas)
            .from('roles')
            .where('empresa_id', obj.empresa_id)
            .andWhere('estado', 1)
            .orderBy('id', 'asc');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarPerfiles]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las empresas
 * seleccionada
 * @params obj: sesion
 * @fecha 2019-07-30
 */
Mensajeria.prototype.consultarEmpresas = function (callback) {
    var query = G.knex
            .select()
            .from('empresas')
            .whereIn('empresa_id',['FD','03','BQ'] )
            .andWhere('sw_activa','1');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarEmpresas]:", err);
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

/**
 * @author German Galvis
 * +Descripcion consulta todos los mensajes que van dirigidos al usuario en sesion
 * @params parametro: usuario_id 
 * @params callback: listado
 * @fecha 2019-07-17
 */
Mensajeria.prototype.ConsultarMensajesUsuario = function (obj, callback) {

//    var columnas = [
//        G.knex.raw("DISTINCT a.actualizacion_id"),
//        "a.asunto",
//        "a.descripcion",
//        "a.fecha_fin",
//        "cx.obligatorio",
//        G.knex.raw("(select nombre from system_usuarios where usuario_id=a.usuario_id) as nombre")
//    ];
//
//    var query = G.knex.select(columnas)
//            .from('system_usuarios_perfiles as sup')
//            .innerJoin(G.knex.raw("controlar_x_perfil as cx on (cx.perfil_id = sup.perfil_id or cx.perfil_id=-1)"))
//            .innerJoin("actualizaciones as a ", "cx.actualizacion_id", "a.actualizacion_id")
//            .innerJoin("system_usuarios as su ", "sup.usuario_id", "su.usuario_id")
//            .whereNotIn('sup.usuario_id',
//                    G.knex
//                    .column(['usuario_id'])
//                    .from('controlar_lectura')
//                    .where('usuario_id', obj.usuario_id)
//                    .andWhere(G.knex.raw("a.actualizacion_id = actualizacion_id")))
//            .andWhere(G.knex.raw("a.fecha_fin >=now()"))
//            .andWhere('sup.usuario_id', obj.usuario_id)
//            .orderBy('cx.obligatorio', 'desc');
    var columnas = [
        G.knex.raw("DISTINCT a.actualizacion_id"),
        "a.asunto",
        "a.descripcion",
        "a.fecha_fin",
        "cx.obligatorio",
        "su.nombre"
    ];

    var query = G.knex.select(columnas)
            .from('login_empresas as le')
            .innerJoin(G.knex.raw("controlar_x_perfil as cx on (cx.perfil_id = le.rol_id or cx.perfil_id=-1)"))
            .innerJoin("actualizaciones as a ", "cx.actualizacion_id", "a.actualizacion_id")
            .innerJoin("system_usuarios as su ", "le.login_id", "su.usuario_id")
            .whereNotIn('su.usuario_id',
                    G.knex
                    .column(['usuario_id'])
                    .from('controlar_lectura')
                    .where('usuario_id', obj.usuario_id)
                    .andWhere(G.knex.raw("a.actualizacion_id = actualizacion_id")))
            .andWhere(G.knex.raw("a.fecha_fin >=now()"))
            .andWhere('su.usuario_id', obj.usuario_id)
//            .andWhere('le.empresa_id', obj.empresa_id)
            .orderBy('cx.obligatorio', 'desc');

//console.log(G.sqlformatter.format(query.toString()));
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [ConsultarMensajesUsuario]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion registra la lectura de un mensaje
 * @params parametro: usuario_id, mensaje_id 
 * @params callback: listado
 * @fecha 2019-07-19
 */
Mensajeria.prototype.IngresarLectura = function (obj, callback) {

    var query = G.knex('controlar_lectura').
            insert({actualizacion_id: obj.mensaje_id, usuario_id: obj.usuario_id, sw: 1, fecha_lectura: 'now()'});

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [IngresarLectura]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion registra el mensaje
 * @params parametro: usuario_id, asunto, descripcion, fecha_fin
 * @params callback: listado
 * @fecha 2019-07-24
 */
Mensajeria.prototype.IngresarMensaje = function (obj, transaccion, callback) {

    var query = G.knex('actualizaciones').
            returning('actualizacion_id').
            insert({asunto: obj.asunto, usuario_id: obj.usuario_id, descripcion: obj.mensaje, fecha_ini: 'now()', fecha_fin: obj.fecha_fin});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [IngresarMensaje]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion registra los perfiles que deben leer el mensaje
 * @params parametro: usuario_id, asunto, descripcion, fecha_fin
 * @params callback: listado
 * @fecha 2019-07-24
 */
Mensajeria.prototype.agregarPerfilesLectura = function (obj, transaccion, callback) {

    var query = G.knex('controlar_x_perfil').
            insert({actualizacion_id: obj.mensaje_id, perfil_id: obj.item_id, obligatorio: obj.obligatorio, fecha_registro: 'now()'});
    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [agregarPerfilesLectura]:", err);
        callback(err);
    });
};

module.exports = Mensajeria;