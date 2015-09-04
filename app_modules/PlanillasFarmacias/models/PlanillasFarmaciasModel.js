var PlanillasFarmaciasModel = function() {

};


PlanillasFarmaciasModel.prototype.listar_planillas_farmacias = function(fecha_inicial, fecha_final, filtro, termino_busqueda, pagina, callback) {

    var subqueryCajas = G.knex.from(
                                   G.knex.column(["a.id_inv_planilla_farmacia_devolucion as planilla_id", "a.cantidad_cajas", "a.cantidad_neveras"])
                                    .select().from('inv_planillas_farmacia_devolucion_detalle as a').as("a")).groupBy('a.planilla_id')
                                    .select("a.planilla_id as id_inv_planilla_farmacia_devolucion", 
                                    G.knex.raw("sum(cantidad_cajas)as total_cajas"), 
                                    G.knex.raw("sum(a.cantidad_neveras)as total_neveras"));

    var column = [
                    "a.id_inv_planilla_farmacia_devolucion as id",
                    "a.id_inv_planilla_farmacia_devolucion as numero_guia",
                    "a.numero_guia_externo",
                    "b.transportadora_id",
                    "b.descripcion as nombre_transportadora",
                    "b.placa_vehiculo",
                    "b.estado as estado_transportadora",
                    "a.nombre_conductor",
                    "a.observacion",
                    "a.id_empresa_destino",
                    G.knex.raw("(select r.razon_social from empresas as r where r.empresa_id =a.id_empresa_destino)as empresa_destino"),
                    "a.empresa_id",
                    G.knex.raw("(select r.razon_social from empresas as r where r.empresa_id =a.empresa_id ) as empresa_origen"),
                    "g.total_cajas",
                    "g.total_neveras",
                    "a.usuario_id",
                    "f.nombre as nombre_usuario",
                    "a.estado",
                    G.knex.raw("(case when a.estado = '0' then 'Anulada' when a.estado = '1' then 'Activa'   when a.estado = '2' then 'Despachada' end) as descripcion_estado"),
                    G.knex.raw("To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro"),
                    G.knex.raw("To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho ")
         ];

    G.knex .column(column)
            .select()
            .from('inv_planillas_farmacia_devolucion as a')
            .innerJoin("inv_transportadoras as b", "a.inv_transportador_id", "=", "b.transportadora_id")
            .innerJoin("system_usuarios as f", "a.usuario_id", "=", "f.usuario_id")
            .leftJoin(G.knex.raw('(' + subqueryCajas.toString() + ') AS g'),'a.id_inv_planilla_farmacia_devolucion','=','g.id_inv_planilla_farmacia_devolucion','LEFT')
            .innerJoin("empresas as h", "a.empresa_id", "=", "h.empresa_id")  
            .whereBetween('a.fecha_registro', [ fecha_inicial,  fecha_final ])
            .andWhere(function() {          
                if (filtro.filtroGuia === true) {
                    this.where(G.knex.raw('a.id_inv_planilla_farmacia_devolucion::varchar'), G.constants.db().LIKE, "%" + termino_busqueda + "%")
                }
                if (filtro.filtroTransportador === true) {
                    this.where(G.knex.raw('b.descripcion'), G.constants.db().LIKE, "%" + termino_busqueda + "%")
                }
                if (filtro.filtroEstado === true) {
                    this.where(G.knex.raw('a.estado'), G.constants.db().LIKE, "%" + termino_busqueda + "%")
                }
            })
            .limit(G.settings.limit)
            .offset((pagina - 1) * G.settings.limit)
            .orderBy('a.id_inv_planilla_farmacia_devolucion', 'desc')
            .then(function(rows) {
                callback(false, rows);
            })
            .catch (function(error) {
                callback(error);
            }).done();

};

/**
 * 
 * @param {type} callback
 * @returns {undefined}
 * @author Cristian Ardila
 * +Descripcion: Metodo que ejecuta el query de la consulta encargada de listar
 * las farmacias
 */
PlanillasFarmaciasModel.prototype.obtenerFarmacias = function(codigoempresa, callback) {

    var sql = "SELECT razon_social, empresa_id \
            FROM empresas WHERE sw_activa = '1'\
            AND empresa_id != $1\
            AND empresa_id IN(\
                SELECT empresa_id  \
                FROM empresas WHERE sw_activa = '1'  \
                AND empresa_id IN('03','01','FD') );";

    G.db.query(sql, [codigoempresa], function(err, rows, result) {
        callback(err, rows);
    });

};


PlanillasFarmaciasModel.prototype.obtenerTipoDocumento = function(empresa, centroUtilidad, bodega, pagina, terminoBusqueda, fechaInicial, fechaFinal, callback) {

    var sql = "SELECT  m.prefijo,m.numero,m.fecha_registro,a.bodegas_doc_id\
             FROM  inv_bodegas_movimiento as m,\
             inv_bodegas_documentos as a,\
             documentos as b,\
            tipos_doc_generales as c\
            WHERE m.empresa_id = $1 \
            AND m.prefijo = 'EDB'\
            AND a.centro_utilidad =$2\
            AND a.bodega =$3\
            AND c.inv_tipo_movimiento = 'E'\
            AND a.documento_id = '229' \
            AND a.documento_id = m.documento_id \
            AND a.empresa_id = m.empresa_id\
            AND a.centro_utilidad = m.centro_utilidad \
            AND a.bodega = m.bodega \
            AND b.documento_id = a.documento_id \
            AND b.empresa_id = a.empresa_id\
            AND c.tipo_doc_general_id = b.tipo_doc_general_id\
            AND m.numero NOT IN (SELECT numero from inv_planillas_farmacia_devolucion_detalle)\
            AND m.numero::varchar ilike $4\
            AND m.fecha_registro between $5 and $6 \
            UNION SELECT   m.prefijo,m.numero,m.fecha_registro,a.bodegas_doc_id\
            FROM inv_bodegas_movimiento as m, \
            inv_bodegas_movimiento_despachos_clientes as dc,\
            ventas_ordenes_pedidos vop,\
            inv_bodegas_documentos as a,\
            documentos as b, \
            tipos_doc_generales as c\
            WHERE m.empresa_id = $1\
            AND m.prefijo = 'EDB'\
            AND a.centro_utilidad = $2 \
            AND a.bodega = $3\
            AND c.inv_tipo_movimiento = 'E'\
            AND a.documento_id = '229' \
            AND m.empresa_id = dc.empresa_id\
            AND m.prefijo = dc.prefijo \
            AND m.numero = dc.numero\
            AND dc.pedido_cliente_id = vop.pedido_cliente_id\
            AND a.documento_id = m.documento_id \
            AND a.empresa_id = m.empresa_id\
            AND a.centro_utilidad = m.centro_utilidad \
            AND a.bodega = m.bodega\
            AND b.documento_id = a.documento_id \
            AND b.empresa_id = a.empresa_id\
            AND c.tipo_doc_general_id = b.tipo_doc_general_id\
            AND m.numero NOT IN (SELECT numero from inv_planillas_farmacia_devolucion_detalle)\
            AND m.numero::varchar ilike $4\
            AND m.fecha_registro between $5 and $6 \
            UNION SELECT  m.prefijo,m.numero,m.fecha_registro,a.bodegas_doc_id\
            FROM  inv_bodegas_movimiento as m, \
            inv_bodegas_movimiento_despachos_farmacias as df,\
            public.solicitud_productos_a_bodega_principal as sp,\
            inv_bodegas_documentos as a, documentos as b, \
            tipos_doc_generales as c\
            WHERE m.empresa_id = $1 \
            AND m.prefijo = 'EDB'\
            AND a.centro_utilidad =$2\
            AND a.bodega = $3\
            AND a.documento_id = '229'\
            AND c.inv_tipo_movimiento = 'E'\
            AND m.empresa_id = df.empresa_id\
            AND m.prefijo = df.prefijo\
            AND m.numero = df.numero \
            AND df.solicitud_prod_a_bod_ppal_id = sp.solicitud_prod_a_bod_ppal_id\
            AND a.documento_id = m.documento_id\
            AND a.empresa_id = m.empresa_id\
            AND a.centro_utilidad = m.centro_utilidad AND a.bodega = m.bodega\
            AND b.documento_id = a.documento_id\
            AND b.empresa_id = a.empresa_id \
            AND c.tipo_doc_general_id = b.tipo_doc_general_id\
            AND m.numero NOT IN (SELECT numero from inv_planillas_farmacia_devolucion_detalle) \
            AND m.numero::varchar ilike $4 AND m.fecha_registro between $5 and $6 \
            ORDER BY 2 DESC";


    G.db.paginated(sql, [empresa, centroUtilidad, bodega, '%' + terminoBusqueda + '%', fechaInicial, fechaFinal], pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);

    });

}


/**
 * 
 * @param {string} empresa_id
 * @param {string} centro_utilidad
 * @param {string} bodega
 * @param {string} id_empresa_destino
 * @param {string} inv_transportador_id
 * @param {string} nombre_conductor
 * @param {string} observacion
 * @param {string} numero_guia_externo
 * @param {string} usuario_id
 * @param {string} callback
 * @returns {void}
 * +Descripcion: Metodo encargado de ejecutar el query para registrar el encabezado
 * de las planillas de devoluciones
 * @author Cristian Ardila
 * @fecha 12/08/2015
 */
PlanillasFarmaciasModel.prototype.ingresarPlanillaFarmacia = function(empresa_id,
        centro_utilidad,
        bodega,
        id_empresa_destino,
        inv_transportador_id,
        nombre_conductor,
        observacion,
        numero_guia_externo,
        usuario_id,
        callback) {


    var sql = "INSERT INTO inv_planillas_farmacia_devolucion(empresa_id, centro_utilidad, bodega, id_empresa_destino, inv_transportador_id, nombre_conductor, observacion, numero_guia_externo,estado,usuario_id)\
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)RETURNING id_inv_planilla_farmacia_devolucion;";


    G.db.query(sql, [empresa_id, centro_utilidad, bodega, id_empresa_destino, inv_transportador_id, nombre_conductor, observacion, numero_guia_externo, '1', usuario_id], function(err, rows, result) {
        callback(err, rows, result);

    });
};



/**
 * 
 * @param {string} id
 * @param {string} empresa_id
 * @param {string} prefijo
 * @param {string} numero
 * @param {string} cantidad_cajas
 * @param {string} cantidad_neveras
 * @param {string} temperatura_neveras
 * @param {string} observacion
 * @param {string} usuario_id
 * @param {string} callback
 * @returns {void}
 * * +Descripcion: Metodo encargado de ejecutar el query para registrar el detallado
 * de las planillas de devoluciones
 * @author Cristian Ardila
 * @fecha 12/08/2015
 */
PlanillasFarmaciasModel.prototype.ingresarDocumentosPlanillaFarmacia = function(id, empresa_id, prefijo, numero, cantidad_cajas,
        cantidad_neveras, temperatura_neveras, observacion,
        usuario_id, callback) {

    var cantidad_neveras = (cantidad_neveras === '') ? 0 : cantidad_neveras;
    var temperatura_neveras = (temperatura_neveras === '') ? 0 : temperatura_neveras;

    var sql = "INSERT INTO inv_planillas_farmacia_devolucion_detalle\
(id_inv_planilla_farmacia_devolucion,empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id, fecha_registro)\
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now())RETURNING id_inv_planilla_farmacia_devolucion_detalle;";


    G.db.query(sql, [id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id], function(err, rows, result) {
        callback(err, rows, result);

    });
};

PlanillasFarmaciasModel.prototype.modificar_estado_planilla_despacho = function(planilla_id, estado, callback) {

    var sql = " update inv_planillas_farmacia_devolucion set estado = $2 , fecha_despacho = NOW() where id_inv_planilla_farmacia_devolucion = $1 ; ";

    G.db.query(sql, [planilla_id, estado], function(err, rows, result) {
        callback(err, rows, result);
    });
};



PlanillasFarmaciasModel.prototype.verificarPlanillaFarmacia = function(planilla_id, callback) {

    var sql = "select \
                a.id_inv_planilla_farmacia_devolucion as id,\
                a.id_inv_planilla_farmacia_devolucion as numero_guia,\
                a.numero_guia_externo,\
                b.transportadora_id, \
                b.descripcion as nombre_transportadora,\
                b.placa_vehiculo,\
                b.estado as estado_transportadora,\
                a.nombre_conductor, a.observacion,\
                a.id_empresa_destino,\
                (select r.razon_social from empresas r where r.empresa_id =a.id_empresa_destino)as empresa_destino,\
                a.empresa_id,\
                (select r.razon_social from empresas r where r.empresa_id =a.empresa_id ) as empresa_origen,  \
                g.total_cajas,  \
                g.total_neveras,  \
                a.usuario_id,  \
                f.nombre as nombre_usuario, \
                a.estado, \
                case when a.estado = '0' then 'Anulada' when a.estado = '1' then 'Activa'   when a.estado = '2' then 'Despachada' end as descripcion_estado, \
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro,  \
                To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho  \
                FROM inv_planillas_farmacia_devolucion a \
                INNER JOIN inv_transportadoras b on a.inv_transportador_id = b.transportadora_id  \
                INNER JOIN system_usuarios f on a.usuario_id = f.usuario_id   \
                LEFT JOIN ( select a.planilla_id, sum(a.cantidad_cajas) as total_cajas, \
                sum(a.cantidad_neveras) as total_neveras \
                    FROM (select a.id_inv_planilla_farmacia_devolucion as planilla_id, \
                          a.cantidad_cajas, a.cantidad_neveras, 1 \
                          FROM inv_planillas_farmacia_devolucion_detalle a) as a group by 1) as g on a.id_inv_planilla_farmacia_devolucion = g.planilla_id \
                          INNER JOIN empresas h ON a.empresa_id = h.empresa_id  \
                          WHERE (a.id_inv_planilla_farmacia_devolucion::varchar ilike $1 \
                          ) order by a.id_inv_planilla_farmacia_devolucion DESC;";

    G.db.query(sql, [planilla_id], function(err, rows, result) {
        callback(err, rows);
    });
};


PlanillasFarmaciasModel.prototype.consultar_documentos_planilla_farmacia = function(planilla_id, termino_busqueda, callback) {

    var sql = "select \
                a.id_inv_planilla_farmacia_devolucion as id,\
                a.id_inv_planilla_farmacia_devolucion as numero_guia,\
                a.numero_guia_externo,\
                b.transportadora_id, \
                b.descripcion as nombre_transportadora,\
                b.placa_vehiculo,\
                b.estado as estado_transportadora,\
                a.nombre_conductor, a.observacion,\
                a.id_empresa_destino,\
                (select r.razon_social from empresas r where r.empresa_id =a.id_empresa_destino)as empresa_destino,\
                a.empresa_id,\
                (select r.razon_social from empresas r where r.empresa_id =a.empresa_id ) as empresa_origen,  \
                g.total_cajas,  \
                g.total_neveras,  \
                g.temperatura_neveras,\
                g.prefijo,\
                g.numero,\
                a.usuario_id,\
                f.nombre as nombre_usuario, \
                a.estado, \
                case when a.estado = '0' then 'Anulada' when a.estado = '1' then 'Activa'   when a.estado = '2' then 'Despachada' end as descripcion_estado, \
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro,  \
                To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho  \
                FROM inv_planillas_farmacia_devolucion a \
                INNER JOIN inv_transportadoras b on a.inv_transportador_id = b.transportadora_id  \
                INNER JOIN system_usuarios f on a.usuario_id = f.usuario_id   \
                LEFT JOIN ( select a.planilla_id, \n\
                            sum(a.cantidad_cajas) as total_cajas,  \
                            sum(a.cantidad_neveras) as total_neveras, \
                            a.temperatura_neveras as temperatura_neveras,\
                            a.prefijo AS prefijo, \
                            a.numero AS numero\
                            FROM (\
                                    select a.id_inv_planilla_farmacia_devolucion as planilla_id, \
                                           a.cantidad_cajas,\
                                           a.cantidad_neveras,\
                                           a.temperatura_neveras,\
                                           a.prefijo, \
                                           a.numero, 1 \
                                    FROM inv_planillas_farmacia_devolucion_detalle a \
                                  ) as a group by 1,a.temperatura_neveras,a.prefijo,a.numero \
                            ) as g ON a.id_inv_planilla_farmacia_devolucion = g.planilla_id \
                          INNER JOIN empresas h ON a.empresa_id = h.empresa_id  \
                          WHERE a.id_inv_planilla_farmacia_devolucion::varchar ilike $1 \
                          AND(a.id_inv_planilla_farmacia_devolucion::varchar ilike $2);";
  

    G.db.query(sql, [planilla_id, '%' + termino_busqueda + '%'], function(err, rows, result) {
        callback(err, rows);
    });
};

PlanillasFarmaciasModel.prototype.eliminar_documento_planilla = function(planilla_id, empresa_id, prefijo, numero, callback) {

    var sql = "delete from inv_planillas_farmacia_devolucion_detalle where id_inv_planilla_farmacia_devolucion = $1 and empresa_id = $2 and  prefijo = $3 and  numero =$4"; 
    
    G.db.query(sql, [planilla_id, empresa_id, prefijo, numero], function(err, rows, result) {
        callback(err, rows, result);
    });
};

module.exports = PlanillasFarmaciasModel;