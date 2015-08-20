var PlanillasFarmaciasModel = function() {

};


PlanillasFarmaciasModel.prototype.listar_planillas_farmacias = function(fecha_inicial, fecha_final, termino_busqueda, callback) {

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
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro  \
                FROM inv_planillas_farmacia_devolucion a \
                INNER JOIN inv_transportadoras b on a.inv_transportador_id = b.transportadora_id  \
                INNER JOIN system_usuarios f on a.usuario_id = f.usuario_id   \
                LEFT JOIN ( select a.planilla_id, sum(a.cantidad_cajas) as total_cajas, \
                sum(a.cantidad_neveras) as total_neveras \
                    FROM (select a.id_inv_planilla_farmacia_devolucion as planilla_id, \
                          a.cantidad_cajas, a.cantidad_neveras, 1 \
                          FROM inv_planillas_farmacia_devolucion_detalle a) as a group by 1) as g on a.id_inv_planilla_farmacia_devolucion = g.planilla_id \
                          INNER JOIN empresas h ON a.empresa_id = h.empresa_id  \
                          WHERE a.fecha_registro between $1 and $2  \
                          AND (a.id_inv_planilla_farmacia_devolucion::varchar ilike $3 \
                                or  b.descripcion ilike $3 \
                                or b.placa_vehiculo ilike $3 \
                                or a.nombre_conductor ilike $3 \
                          ) order by a.id_inv_planilla_farmacia_devolucion DESC;";
  /*  var sql = " select \
                a.id, \
                a.id as numero_guia,\
                a.numero_guia_externo,\
                b.transportadora_id,\
                b.descripcion as nombre_transportadora,\
                b.placa_vehiculo,\
                b.estado as estado_transportadora,\
                e.tipo_pais_id as pais_id,\
                e.pais as nombre_pais,\
                d.tipo_dpto_id as departamento_id,\
                d.departamento as nombre_departamento,\
                a.ciudad_id,\
                c.municipio as nombre_ciudad,\
                a.nombre_conductor,\
                a.observacion,\
                g.total_cajas,\
                g.total_neveras,\
                a.usuario_id,\
                f.nombre as nombre_usuario,\
                a.estado,\
                case when a.estado = 0 then 'Anulada' \
                     when a.estado = 1 then 'Activa' \
                     when a.estado = 2 then 'Despachada' end as descripcion_estado, \
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro,\
                To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho\
                from inv_planillas_despacho a \
                inner join inv_transportadoras b on a.inv_transportador_id = b.transportadora_id\
                inner join tipo_mpios c on a.ciudad_id = c.tipo_mpio_id and a.departamento_id = c.tipo_dpto_id and a.pais_id = c.tipo_pais_id\
                inner join tipo_dptos d on c.tipo_dpto_id = d.tipo_dpto_id and c.tipo_pais_id = d.tipo_pais_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                left join (\
                    select a.planilla_id, sum(a.cantidad_cajas) as total_cajas, sum(a.cantidad_neveras) as total_neveras\
                    from (\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 1\
                      from inv_planillas_detalle_farmacias a\
                      union\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 2\
                      from inv_planillas_detalle_clientes a\
                      union \
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 3\
                      from inv_planillas_detalle_empresas a \
                    ) as a group by 1\
                  ) as g on a.id = g.planilla_id\
                where a.fecha_registro between $1 and $2 \
                and (\
                    a.id ilike $3 or\
                    b.descripcion ilike $3 or\
                    b.placa_vehiculo ilike $3 or\
                    e.pais ilike $3 or\
                    d.departamento ilike $3 or\
                    c.municipio ilike $3 or\
                    a.nombre_conductor ilike $3 \
                ) order by a.id DESC; ";*/

    G.db.query(sql, [fecha_inicial, fecha_final, "%"+termino_busqueda+"%"], function(err, rows, result) {
        callback(err, rows);
    });
};

/**
 * 
 * @param {type} callback
 * @returns {undefined}
 * @author Cristian Ardila
 * +Descripcion: Metodo que ejecuta el query de la consulta encargada de listar
 * las farmacias
 */
PlanillasFarmaciasModel.prototype.obtenerFarmacias = function(codigoempresa,callback) {

  var sql = "SELECT razon_social, empresa_id \
            FROM empresas WHERE sw_activa = 1\
            AND empresa_id != $1\
            AND empresa_id IN(\
                SELECT empresa_id  \
                FROM empresas WHERE sw_activa = 1  \
                AND empresa_id IN('03','01','FD') );";

  

    G.db.query(sql, [codigoempresa], function(err, rows, result) {
        callback(err, rows);
    });

};


PlanillasFarmaciasModel.prototype.obtenerTipoDocumento = function(empresa,centroUtilidad,bodega,pagina,callback){
    
   /*,c.abreviatura,a.documento_id, a.empresa_id, a.prefijo, a.sw_estado, a.numeracion,  b.centro_utilidad, b.bodega,b.bodegas_doc_id,b.sw_estado, c.usuario_id,c.doc_tmp_id,c.bodegas_doc_id,*/
 
   /* var sql = "SELECT  d.codigo_producto, \
a.tipo_doc_general_id,\
a.descripcion,\
c.observacion,\
c.fecha_registro\
FROM  documentos a INNER JOIN inv_bodegas_documentos b ON a.documento_id = b.documento_id AND a.empresa_id = b.empresa_id  INNER JOIN inv_bodegas_movimiento_tmp c ON b.bodegas_doc_id = c.bodegas_doc_id   LEFT JOIN inv_bodegas_movimiento_tmp_d d ON c.doc_tmp_id = d.doc_tmp_id  WHERE b.empresa_id = 'FD' AND  b.centro_utilidad = '06' AND  b.bodega = '06' AND  b.documento_id IN ('229');"
    
*/
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<EJECUTANDOLO>>>>>>>>>>>>>>>>>>>>>>>>>");  
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
            AND m.numero NOT IN (SELECT numero from inv_planillas_farmacia_devolucion_detalle)";
    
    
     G.db.paginated(sql, [empresa,centroUtilidad,bodega],pagina, G.settings.limit, function(err, rows, result) {
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
PlanillasFarmaciasModel.prototype.ingresar_planilla_farmacia = function(empresa_id,
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
   
                     
    G.db.query(sql, [empresa_id, centro_utilidad,bodega,id_empresa_destino, inv_transportador_id,nombre_conductor,observacion,numero_guia_externo,'1',usuario_id], function(err, rows, result) {
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
PlanillasFarmaciasModel.prototype.ingresar_documentos_planilla_farmacia = function(id,empresa_id, prefijo, numero, cantidad_cajas, 
                                                                     cantidad_neveras, temperatura_neveras, observacion, 
                                                                     usuario_id, callback) {


var sql = "INSERT INTO inv_planillas_farmacia_devolucion_detalle\
(id_inv_planilla_farmacia_devolucion,empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id, fecha_registro)\
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now())RETURNING id_inv_planilla_farmacia_devolucion_detalle;";


    G.db.query(sql, [id,empresa_id, prefijo, numero, cantidad_cajas,cantidad_neveras, temperatura_neveras, observacion, usuario_id], function(err, rows, result) {
        callback(err, rows, result);

    });
};



module.exports = PlanillasFarmaciasModel;