var PedidosFarmaciasModel = function() {

};

PedidosFarmaciasModel.prototype.listar_empresas = function(usuario, callback) {

    var sql = " SELECT	b.empresa_id, b.tipo_id_tercero as tipo_identificacion, b.id as identificacion, b.razon_social AS razon_social \
                FROM userpermisos_reportes_gral a \
                inner join empresas b on a.empresa_id = b.empresa_id \
                where a.usuario_id = $1 ";

    G.db.query(sql, [usuario], function(err, rows, result) {
        callback(err, rows);
    });

};

PedidosFarmaciasModel.prototype.listar_farmacias_usuario = function(tipo, usuario, empresa_id, centro_utilidad_id, permisos_kardex, callback) {

    var sql = "";
    var parametros = "";
    
    var tabla = "userpermisos_pedidos_farmacia_a_bprincipal";
    
    if(permisos_kardex){
        tabla = "inv_bodegas_userpermisos_admin";
    }
    
    //Depreciado para el modulo de kardex, se traen las empresas desde el modulo de Empresas 24/06/2015
    //Depreciado para el modulo de asignacion, se traen del perfil del usuario   25/06/2015
    //Depreciado para el modulo de auditoria, se traen del perfil del usuario 25/06/2015
    if (tipo === '1') {

        sql = " SELECT\
                a.empresa_id,\
                d.razon_social as nombre_empresa\
                FROM "+tabla+" AS a\
                JOIN bodegas as b ON (a.empresa_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (b.estado = '1')\
                JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                JOIN empresas as d ON (c.empresa_id = d.empresa_id) AND (sw_activa = '1')\
                WHERE a.usuario_id = $1 group by 1,2; ";
 
        parametros = [usuario];
    }
    
    //Depreciado para el modulo de kardex, se traen los centros de utilidad desde el modulo de CentrosUtilidad 24/06/2015
    if (tipo === '2') {

        sql = " SELECT\
                a.centro_utilidad as centro_utilidad_id,\
                c.descripcion as nombre_centro_utilidad\
                FROM "+tabla+" AS a\
                JOIN bodegas as b ON (a.empresa_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (b.estado = '1')\
                JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                JOIN empresas as d ON (c.empresa_id = d.empresa_id) AND (sw_activa = '1')\
                WHERE a.usuario_id = $1 and a.empresa_id = $2 group by 1,2 ";

        parametros = [usuario, empresa_id];
    }

    //Depreciado para el modulo de kardex, se traen las bodegas desde el modulo de Bodegas 24/06/2015
    if (tipo === '3') {
        if(!permisos_kardex){
            sql = " SELECT\
                    b.bodega as bodega_id,\
                    b.descripcion as nombre_bodega,\
                    a.sw_anular_pedido, a.sw_anular_reserva, a.sw_anular_reserva, a.sw_eliminar_productos, a.sw_modificar_pedido\
                    FROM userpermisos_pedidos_farmacia_a_bprincipal AS a\
                    JOIN bodegas as b ON (a.empresa_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (b.estado = '1')\
                    JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                    JOIN empresas as d ON (c.empresa_id = d.empresa_id) AND (sw_activa = '1')\
                    WHERE a.usuario_id = $1 and a.empresa_id = $2 and a.centro_utilidad = $3;  ";
        } else {
            sql = "SELECT\
                    b.bodega as bodega_id,\
                    b.descripcion as nombre_bodega\
                    FROM inv_bodegas_userpermisos_admin AS a\
                    JOIN bodegas as b ON (a.empresa_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (b.estado = '1')\
                    JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                    JOIN empresas as d ON (c.empresa_id = d.empresa_id) AND (sw_activa = '1')\
                    WHERE a.usuario_id = $1 and a.empresa_id = $2 and a.centro_utilidad = $3;";
        }

        parametros = [usuario, empresa_id, centro_utilidad_id];
    }


    G.db.query(sql, parametros, function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.guardarEncabezadoTemporal = function(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, 
                                                                     empresa_origen_id, centro_utilidad_origen_id, bodega_origen_id, observacion, usuario_id, callback){
    var that = this;
    
    that.existe_registro_encabezado_temporal(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, usuario_id, function(err, resultado) {
        
        if (resultado.length > 0 && parseInt(resultado[0].cantidad_registros) === 0) {
            that.insertar_pedido_farmacia_temporal(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id,
                    empresa_origen_id, centro_utilidad_origen_id, bodega_origen_id, observacion, usuario_id, function(err, rows, result) {
                        
                  callback(err, rows);
             });
        } else {
             that.actualizar_registro_encabezado_temporal(empresa_destino_id, centro_utilidad_destino_id,
                    bodega_destino_id, usuario_id, observacion, function(err, rows) {

                callback(err, rows);

            });
        }
    });
};


PedidosFarmaciasModel.prototype.guardarDetalleTemporal = function(numeroPedido, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, codigo_producto,
                                                                  cantidad_solicitada, tipoProductoId, cantidadPendiente, usuario_id, callback) {
                                                                      
      var that = this;
      
      that.existe_registro_detalle_temporal(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, codigo_producto, usuario_id, function(err, resultado){
          if (resultado.length > 0 && parseInt(resultado[0].cantidad_registros) === 0) {
              
              that.insertar_detalle_pedido_farmacia_temporal( numeroPedido, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, codigo_producto,
                                                         cantidad_solicitada, tipoProductoId, cantidadPendiente, usuario_id, function(err, rows, result) {
                   
                   callback(err, rows);
              });
              
          } else {
              callback(false);
          }
      });

};

PedidosFarmaciasModel.prototype.existe_registro_encabezado_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "SELECT COUNT(farmacia_id) as cantidad_registros  FROM solicitud_Bodega_principal_aux WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.obtenerCantidadProductosEnTemporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "SELECT COUNT(farmacia_id) as cantidad_registros  FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};


PedidosFarmaciasModel.prototype.existe_registro_detalle_temporal = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id, callback)
{
    var sql = "SELECT COUNT(farmacia_id) as cantidad_registros FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and codigo_producto = $4 and usuario_id = $5";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.existe_registro_detalle_pedido = function(numero_pedido, codigo_producto, callback)
{
    var sql = "SELECT COUNT(*) as cantidad_registros FROM solicitud_productos_a_bodega_principal_detalle WHERE solicitud_prod_a_bod_ppal_id = $1  and codigo_producto = $2";

    G.db.query(sql, [numero_pedido, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.actualizar_registro_encabezado_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion, callback)
{
   // console.log("modificando pedido temporal ", empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion);
    var sql = "UPDATE solicitud_Bodega_principal_aux SET observacion = $5 WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion], function(err, rows, result) {
        callback(err, rows, result);
    });
};


    
/// nuevo Eduar Garcia *********************
PedidosFarmaciasModel.prototype.insertar_pedido_farmacia_temporal = function(empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, 
                                                               empresa_origen_id, centro_utilidad_origen_id, bodega_origen_id, observacion, usuario_id, callback) {
    
    //En la base de datos la empresa destino erroneamente se asigno como la empresa origen, por eso se hace el intercambio con lo que envia el app cliente
    var sql = " INSERT INTO solicitud_Bodega_principal_aux ( farmacia_id, centro_utilidad, bodega, empresa_destino, centro_destino, bogega_destino, observacion, usuario_id )\
                VALUES( $1,$2,$3,$4,$5,$6,$7, $8);";

    G.db.query(sql, [empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, empresa_origen_id, centro_utilidad_origen_id, 
                    bodega_origen_id, observacion, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });

};


PedidosFarmaciasModel.prototype.insertar_detalle_pedido_farmacia_temporal = function(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad_solicitada,  tipo_producto_id, cantidad_pendiente, usuario_id, callback) {

    var sql = " INSERT INTO solicitud_pro_a_bod_prpal_tmp ( soli_a_bod_prpal_tmp_id, farmacia_id, centro_utilidad, bodega, codigo_producto, cantidad_solic, tipo_producto, cantidad_pendiente, usuario_id ) \
                VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 ) ;";

    G.db.query(sql, [numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad_solicitada,  tipo_producto_id, cantidad_pendiente, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.buscar_usuario_bloqueo = function(codigo_temporal, callback) {

    var sql = " SELECT b.nombre, b.usuario_id\
                FROM solicitud_pro_a_bod_prpal_tmp a\
                INNER JOIN system_usuarios b ON a.usuario_id = b.usuario_id\
                WHERE a.soli_a_bod_prpal_tmp_id = $1";

    G.db.query(sql, [codigo_temporal], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.consultar_pedido_farmacia_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback) {

    var sql = " SELECT farmacia_id, centro_utilidad, bodega, empresa_destino, centro_destino, bogega_destino as bodega_destino, observacion, usuario_id\
                FROM solicitud_Bodega_principal_aux\
                WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.listar_detalle_pedido_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "SELECT codigo_producto, fc_descripcion_producto(codigo_producto) as descripcion_producto, cantidad_solic::integer as cantidad_solicitada, cantidad_pendiente, tipo_producto as tipo_producto_id\
                FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4 order by cantidad_pendiente asc";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};
// ********************

PedidosFarmaciasModel.prototype.eliminar_registro_encabezado_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "DELETE FROM solicitud_Bodega_principal_aux WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.eliminar_registro_detalle_temporal = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id, callback)
{
    var sql = "DELETE FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and codigo_producto = $4 and usuario_id = $5";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.eliminar_detalle_temporal_completo = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "DELETE FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.insertarPedidoFarmacia = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion, tipo_pedido, callback) {
    
    var sql = "INSERT INTO solicitud_productos_a_bodega_principal(farmacia_id, centro_utilidad, bodega, observacion, usuario_id, fecha_registro, empresa_destino, centro_destino,\
                bodega_destino, sw_despacho, estado, tipo_pedido) \
                SELECT farmacia_id, centro_utilidad, bodega, $5, usuario_id, CURRENT_TIMESTAMP, empresa_destino, centro_destino, bogega_destino, 0, 0, $6 from solicitud_Bodega_principal_aux \
                WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4 \
                RETURNING solicitud_prod_a_bod_ppal_id";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion, tipo_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.insertarDetallePedidoFarmacia = function(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback) {
    
    var sql = "INSERT INTO solicitud_productos_a_bodega_principal_detalle(solicitud_prod_a_bod_ppal_id, farmacia_id, centro_utilidad, bodega, codigo_producto, cantidad_solic, tipo_producto, usuario_id, fecha_registro, sw_pendiente, cantidad_pendiente) \
                SELECT $1, farmacia_id, centro_utilidad, bodega, codigo_producto, cantidad_solic, tipo_producto, usuario_id, CURRENT_TIMESTAMP, 0, cantidad_solic from solicitud_pro_a_bod_prpal_tmp \
                WHERE farmacia_id = $2 and centro_utilidad = $3 and bodega = $4 and usuario_id = $5";

    G.db.query(sql, [numero_pedido, empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });

};

//insertar_producto_detalle_pedido_farmacia

PedidosFarmaciasModel.prototype.insertar_producto_detalle_pedido_farmacia = function(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad_solic, tipo_producto_id, usuario_id, cantidad_pendiente, callback){
 
    var sql = "INSERT INTO solicitud_productos_a_bodega_principal_detalle(solicitud_prod_a_bod_ppal_id, farmacia_id, centro_utilidad, bodega, codigo_producto, cantidad_solic, tipo_producto, usuario_id, fecha_registro, sw_pendiente, cantidad_pendiente) \
               VALUES($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, 0, $9)";

    G.db.query(sql, [numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad_solic, tipo_producto_id, usuario_id, cantidad_pendiente], function(err, rows, result) {
        callback(err, rows, result);
    });    
};


PedidosFarmaciasModel.prototype.actualizar_cantidades_detalle_pedido = function(numero_pedido, codigo_producto, cantidad_solicitada, cantidad_pendiente, usuario, callback)
{    
    G.db.begin(function() {
        
        //Los logs de modificaciones se registran en la misma tabla de registro de los eliminados
        __log_eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario, function(err, result) {

            if(err){
                callback(err);
                return;
            }

            __actualizar_cantidades_detalle_pedido(numero_pedido, codigo_producto, cantidad_solicitada, cantidad_pendiente, function(err, rows) {

                if(err){
                    callback(err);
                    return;
                }

                // Finalizar Transacción.
                G.db.commit(function(){
                    callback(err, rows);
                });
            });
        });
     });
};

PedidosFarmaciasModel.prototype.eliminar_producto_detalle_pedido = function(numero_pedido, codigo_producto, usuario, callback)
{
    G.db.begin(function() {
        
       __log_eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario, function(err, result) {

           if(err){
               callback(err);
               return;
           }

           __eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, function(err, rows) {

               if(err){
                   callback(err);
                   return;
               }

               // Finalizar Transacción.
               G.db.commit(function(){
                   callback(err, rows);
               });
           });
       });
    });
};

// Listar todos los pedidos de farmacias
PedidosFarmaciasModel.prototype.listar_pedidos_farmacias = function(empresa_id, termino_busqueda, filtro, pagina, callback) {

    /*=========================================================================*/
    // Se implementa este filtro, para poder filtrar los pedidos por el estado actual
    // 0 - No Asignado 
    // 1 - Asignado
    // 2 - Auditado
    // 3 - En Zona Despacho
    // 4 - Despachado
    // 5 - Despachado con Pendientes
    // 6 - separacion finalizada
    // 7 - En Auditoria
    // 8 - Auditado con Pdtes
    // 9 - En Zona con Pdtes
    /*=========================================================================*/

    var estado = "";

    if (filtro !== undefined) {

        if (filtro.no_asignados) {
            estado =  '0';
        }

        if (filtro.asignados) {
            estado = '1';
        }
        if (filtro.auditados) {
            estado = '2';
        }

        if (filtro.en_zona_despacho) {
            estado = '3';
        }

        if (filtro.despachado) {
            estado = '4';
        }

        if (filtro.despachado_pendientes) {
            estado = '5';
        }
        
        if (filtro.separacion_finalizada) {
            estado = '6';
        }
        
        if (filtro.en_auditoria) {
            estado = '7';
        }
        
        if (filtro.auditados_pdtes) {
            estado = '8';
        }
        
        if (filtro.en_zona_despacho_pdtes) {
            estado = '9';
        }
    }

   /* var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido, \
                a.farmacia_id, \
                d.empresa_id, \
                a.centro_utilidad, \
                a.bodega as bodega_id, \
                d.razon_social as nombre_farmacia, \
                b.descripcion as nombre_bodega,\
                a.usuario_id, \
                e.nombre as nombre_usuario ,\
                a.estado as estado_actual_pedido, \
                case when a.estado = '0' then 'No Asignado' \
                     when a.estado = '1' then 'Asignado' \
                     when a.estado = '2' then 'Auditado' \
                     when a.estado = '3' then 'En Zona Despacho' \
                     when a.estado = '4' then 'Despachado' \
                     when a.estado = '5' then 'Despachado con Pendientes' \
                     when a.estado = '6' then 'Separacion Finalizada' \
                     when a.estado = '7' then 'En Auditoria'  \
                     when a.estado = '8' then 'Auditado con pdtes' \
                     when a.estado = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido, \
                f.estado as estado_separacion, \
                to_char(a.fecha_registro, 'dd-mm-yyyy') as fecha_registro,\
                c.descripcion as nombre_centro_utilidad,\
                a.empresa_destino as empresa_origen_id,\
                a.observacion,\
                g.empresa_id as despacho_empresa_id,\
                g.prefijo as despacho_prefijo, \
                g.numero as despacho_numero, \
                CASE WHEN g.numero IS NOT NULL THEN true ELSE false END as tiene_despacho \
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                left join inv_bodegas_movimiento_tmp_despachos_farmacias f on a.solicitud_prod_a_bod_ppal_id = f.solicitud_prod_a_bod_ppal_id  \
                left join inv_bodegas_movimiento_despachos_farmacias g on a.solicitud_prod_a_bod_ppal_id = g.solicitud_prod_a_bod_ppal_id \
                where a.farmacia_id = $1 \
                and ( a.solicitud_prod_a_bod_ppal_id :: varchar ilike $2 \
                      or d.razon_social ilike $2 \
                      or b.descripcion ilike $2 \
                      or e.nombre ilike $2 ) \
                order by 1 desc ";
    
    G.db.paginated(sql, [empresa_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });*/
    
    //return;
    var columns = [
        "a.solicitud_prod_a_bod_ppal_id as numero_pedido", 
        "a.farmacia_id", 
        "d.empresa_id", 
        "a.centro_utilidad", 
        "a.bodega as bodega_id", 
        "d.razon_social as nombre_farmacia", 
        "b.descripcion as nombre_bodega",
        "a.usuario_id", 
        "e.nombre as nombre_usuario" ,
        "a.estado as estado_actual_pedido",
        G.knex.raw("case when a.estado = '0' then 'No Asignado' \
                     when a.estado = '1' then 'Asignado' \
                     when a.estado = '2' then 'Auditado' \
                     when a.estado = '3' then 'En Zona Despacho' \
                     when a.estado = '4' then 'Despachado' \
                     when a.estado = '5' then 'Despachado con Pendientes' \
                     when a.estado = '6' then 'Separacion Finalizada' \
                     when a.estado = '7' then 'En Auditoria'  \
                     when a.estado = '8' then 'Auditado con pdtes' \
                     when a.estado = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido"),
        "f.estado as estado_separacion", 
        G.knex.raw("to_char(a.fecha_registro, 'dd-mm-yyyy') as fecha_registro"),
        "c.descripcion as nombre_centro_utilidad",
        "a.empresa_destino as empresa_origen_id",
        "a.observacion",
        "g.empresa_id as despacho_empresa_id",
        "g.prefijo as despacho_prefijo", 
        "g.numero as despacho_numero", 
        G.knex.raw("CASE WHEN g.numero IS NOT NULL THEN true ELSE false END as tiene_despacho")
        
    ];
    
    G.knex.column(columns).
    from("solicitud_productos_a_bodega_principal as a").
    innerJoin("bodegas as b", function(){
         this.on("a.farmacia_id", "b.empresa_id" ).
         on("a.centro_utilidad", "b.centro_utilidad").
         on("a.bodega", "b.bodega");
    }).
    innerJoin("centros_utilidad as c", function(){
         this.on("b.empresa_id", "c.empresa_id" ).
         on("b.centro_utilidad", "c.centro_utilidad");
    }).
    innerJoin("empresas as d", function(){
         this.on("c.empresa_id", "d.empresa_id" );
    }).
    innerJoin("system_usuarios as e", function(){
         this.on("a.usuario_id", "e.usuario_id" );
    }).
    leftJoin("inv_bodegas_movimiento_tmp_despachos_farmacias as f", "a.solicitud_prod_a_bod_ppal_id", "f.solicitud_prod_a_bod_ppal_id").
    leftJoin("inv_bodegas_movimiento_despachos_farmacias as g", "a.solicitud_prod_a_bod_ppal_id", "g.solicitud_prod_a_bod_ppal_id ").
    where(function(){
        this.where("a.farmacia_id", empresa_id);
        
        if (estado !== "") {
            this.where("a.estado", estado);
        }
    }).
    andWhere(function() {
       if(filtro && filtro.usuario){
           
            this.where("e.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%");
            
       } else if(filtro && filtro.razon_social){
           
            this.where("d.razon_social", G.constants.db().LIKE, "%" + termino_busqueda + "%");
       } else if (filtro && filtro.descripcion){
           
            this.where("b.descripcion", G.constants.db().LIKE, "%" + termino_busqueda + "%");
       } else {
           this.where(G.knex.raw("a.solicitud_prod_a_bod_ppal_id :: varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%");
       }
       
    }).
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    orderByRaw("1 asc").
    then(function(rows){
        console.log("resultado de farmacias >>>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",rows);
        callback(false, rows);
    }).
    catch(function(err){
       console.log("error generado en lista pedidos farmacias ", err);
       callback(err);
    });
    
};

// Lista todos los pedidos temorales de farmacias
PedidosFarmaciasModel.prototype.listar_pedidos_temporales_farmacias = function(empresa_id, termino_busqueda, pagina, usuario, callback) {
    
   G.knex.column("d.razon_social as nombre_farmacia", "c.descripcion as nombre_centro_utilidad","b.descripcion as nombre_bodega","e.nombre as nombre_usuario",
    "a.farmacia_id", "a.centro_utilidad", "a.bodega", "a.empresa_destino", "a.centro_destino", "a.bogega_destino","a.usuario_id", "a.observacion").

    from("solicitud_bodega_principal_aux as a").

    innerJoin("bodegas as b", function(){
         this.on("a.farmacia_id", "b.empresa_id" ).
         on("a.centro_utilidad", "b.centro_utilidad").
         on("a.bodega", "b.bodega");
    }).
    innerJoin("centros_utilidad as c", function(){
         this.on("b.empresa_id", "c.empresa_id" ).
         on("b.centro_utilidad", "c.centro_utilidad");
    }).
    innerJoin("empresas as d", function(){
         this.on("c.empresa_id", "d.empresa_id" );
    }).
    innerJoin("system_usuarios as e", function(){
         this.on("a.usuario_id", "e.usuario_id" );
    }).
    where({
           "a.farmacia_id" : empresa_id,
           "a.usuario_id"  : usuario
    }).
    andWhere(function() {
       this.where("c.descripcion", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("b.descripcion", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("e.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%");
    }).
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    orderBy("nombre_centro_utilidad", "desc").
    then(function(rows){
        callback(false, rows);
    }).
    catch(function(err){
       callback(err);
    });
    
};


// Seleccionar Pedido Por un numero de pedido
PedidosFarmaciasModel.prototype.consultar_pedido = function(numero_pedido, callback) {

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido, \
                a.farmacia_id, \
                d.empresa_id, \
                a.centro_utilidad, \
                a.bodega as bodega_id, \
                d.razon_social as nombre_farmacia, \
                b.descripcion as nombre_bodega,\
                a.usuario_id, \
                e.nombre as nombre_usuario ,\
                a.estado as estado_actual_pedido, \
                case when a.estado = '0' then 'No Asignado' \
                     when a.estado = '1' then 'Asignado' \
                     when a.estado = '2' then 'Auditado' \
                     when a.estado = '3' then 'En Zona Despacho' \
                     when a.estado = '4' then 'Despachado' \
                     when a.estado = '5' then 'Despachado con Pendientes' \
                     when a.estado = '6' then 'Separacion Finalizada'  \
                     when a.estado = '7' then 'En auditoria'  \
                     when a.estado = '8' then 'Auditado con pdtes'  \
                     when a.estado = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido, \
                f.estado as estado_separacion, \
                to_char(a.fecha_registro, 'dd-mm-yyyy HH24:MI:SS.MS') as fecha_registro, \
                a.fecha_registro as fecha_registro_pedido,\
                a.empresa_destino,\
                a.centro_destino,\
                a.bodega_destino,\
                a.observacion\
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                left join inv_bodegas_movimiento_tmp_despachos_farmacias f on a.solicitud_prod_a_bod_ppal_id = f.solicitud_prod_a_bod_ppal_id \
                where a.solicitud_prod_a_bod_ppal_id = $1 \
                order by 1 desc";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.consultar_detalle_pedido = function(numero_pedido, callback) {

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.cantidad_solic::integer as cantidad_solicitada,\
                (a.cantidad_solic - a.cantidad_pendiente)::integer as cantidad_despachada_real,\
                a.cantidad_pendiente::integer as cantidad_pendiente_real,\
                COALESCE(b.cantidad_temporalmente_separada,0)::integer as cantidad_temporalmente_separada,\
                ABS( (a.cantidad_solic - a.cantidad_pendiente) +  COALESCE(b.cantidad_temporalmente_separada,0) )::integer as cantidad_despachada,\
                (a.cantidad_solic - ABS( (a.cantidad_solic - a.cantidad_pendiente) +  COALESCE(b.cantidad_temporalmente_separada,0) ))::integer as cantidad_pendiente,\
                f.costo as valor_unitario,\
                c.porc_iva as porcentaje_iva,\
                (f.costo+(f.costo*(c.porc_iva/100)))as valor_unitario_con_iva,\
                (a.cantidad_solic*(f.costo*(c.porc_iva/100))) as valor_iva,\
                COALESCE(b.justificacion, '') as justificacion, \
                COALESCE(b.justificacion_auditor, '') as justificacion_auditor, \
                COALESCE(b.lote, '') as lote,\
                b.fecha_vencimiento,\
                b.item_id,\
                b.tipo_estado_auditoria,\
                b.cantidad_ingresada,\
                COALESCE(b.auditado, '0') as auditado,\
                a.tipo_producto as tipo_producto_id\
                from solicitud_productos_a_bodega_principal_detalle a\
                inner join solicitud_productos_a_bodega_principal g on a.solicitud_prod_a_bod_ppal_id = g.solicitud_prod_a_bod_ppal_id\
                inner join inventarios f on a.codigo_producto = f.codigo_producto and g.empresa_destino = f.empresa_id\
                inner join inventarios_productos c on f.codigo_producto = c.codigo_producto \
                inner join inv_clases_inventarios e on c.grupo_id = e.grupo_id and c.clase_id = e.clase_id \
                left join (\
                    SELECT a.numero_pedido, a.codigo_producto, a.justificacion, a.justificacion_auditor, sum(a.cantidad_temporalmente_separada) as cantidad_temporalmente_separada, a.lote, a.fecha_vencimiento, a.item_id, a.tipo_estado_auditoria, a.cantidad_ingresada, a.auditado \
                    FROM ( \
                      select a.solicitud_prod_a_bod_ppal_id as numero_pedido, b.codigo_producto, c.observacion as justificacion, c.justificacion_auditor, SUM(b.cantidad) as cantidad_temporalmente_separada, b.lote, to_char(b.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento, b.item_id, '2' as tipo_estado_auditoria, b.cantidad :: integer as cantidad_ingresada, b.auditado\
                      from inv_bodegas_movimiento_tmp_despachos_farmacias a\
                      inner join inv_bodegas_movimiento_tmp_d b on a.usuario_id = b.usuario_id and a.doc_tmp_id = b.doc_tmp_id\
                      left join inv_bodegas_movimiento_tmp_justificaciones_pendientes c on b.doc_tmp_id = c.doc_tmp_id and b.usuario_id = c.usuario_id and b.codigo_producto = c.codigo_producto\
                      group by 1,2,3,4,6,7, 8,9, 10, 11\
                      UNION\
                      select a.solicitud_prod_a_bod_ppal_id  as numero_pedido, b.codigo_producto, b.observacion as justificacion, b.justificacion_auditor, 0 as cantidad_temporalmente_separada, '' as lote, null as fecha_vencimiento,  0 as item_id, '3' as tipo_estado_auditoria, 0 as cantidad_ingresada, '0' as auditado\
                      from inv_bodegas_movimiento_tmp_despachos_farmacias a \
                      left join inv_bodegas_movimiento_tmp_justificaciones_pendientes b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                       and b.codigo_producto not in(\
                            select aa.codigo_producto from inv_bodegas_movimiento_tmp_d aa where aa.doc_tmp_id = b.doc_tmp_id and aa.usuario_id = b.usuario_id\
                       )\
                    ) a group by 1,2,3,4, 6, 7, 8,9, 10, 11\
                ) as b on a.solicitud_prod_a_bod_ppal_id = b.numero_pedido and a.codigo_producto = b.codigo_producto\
                where a.solicitud_prod_a_bod_ppal_id= $1 order by e.descripcion ; ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });

};

PedidosFarmaciasModel.prototype.listar_pedidos_del_operario = function(responsable, termino_busqueda, filtro, pagina, limite, callback) {

    var sql_aux = " ";

    /*=========================================================================*/
    // Se implementa este filtro, para poder filtrar los pedidos del clientes 
    // asignados al operario de bodega y saber si el pedido tiene temporales o 
    // fue finalizado correctamente.
    /*=========================================================================*/
    var estado_pedido = 1;
    if (filtro !== undefined) {

        if (filtro.asignados) {
            sql_aux = "  h.doc_tmp_id IS NULL and  g.usuario_id = "+responsable+" and ";
        }

        if (filtro.temporales) {
            sql_aux = "  h.doc_tmp_id IS NOT NULL AND h.estado = '0' and g.usuario_id = "+responsable+" and ";
        }
        
        //filtro para traer los pedidos que estan  en auditoria
        if (filtro.finalizados) {
            estado_pedido = '7';
            sql_aux = " g.usuario_id = (select usuario_id from operarios_bodega where operario_id = f.responsable_id ) and  i.usuario_id = "+responsable+" and ";
        }
    }

    var sql = " select distinct\
                h.doc_tmp_id as documento_temporal_id,\
                h.usuario_id,\
                a.solicitud_prod_a_bod_ppal_id as numero_pedido, \
                a.farmacia_id, \
                d.empresa_id, \
                a.centro_utilidad, \
                a.bodega as bodega_id, \
                a.empresa_destino,\
                a.centro_destino,\
                a.bodega_destino,\
                d.razon_social as nombre_farmacia, \
                b.descripcion as nombre_bodega,\
                a.usuario_id, \
                e.nombre as nombre_usuario ,\
                a.estado as estado_actual_pedido, \
                case when a.estado = '0' then 'No Asignado' \
                     when a.estado = '1' then 'Asignado' \
                     when a.estado = '2' then 'Auditado' \
                     when a.estado = '3' then 'En Zona Despacho' \
                     when a.estado = '4' then 'Despachado' \
                     when a.estado = '5' then 'Despachado con Pendientes' \
                     when a.estado = '6' then 'Separacion Finalizada' \
                     when a.estado = '7' then 'En Auditoria'  \
                     when a.estado = '8' then 'Auditado con pdtes'  \
                     when a.estado = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido, \
                h.estado as estado_separacion,     \
                case when h.estado = '0' then 'Separacion en Proceso' \
                     when h.estado = '1' then 'Separacion Finalizada' \
                     when h.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion, \
                a.fecha_registro::date as fecha_registro, \
                f.responsable_id,\
                g.nombre as responsable_pedido,\
                f.fecha as fecha_asignacion_pedido, \
                i.fecha_registro as fecha_separacion_pedido  \
                from solicitud_productos_a_bodega_principal a \
                inner join bodegas b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios e ON a.usuario_id = e.usuario_id \
                inner join solicitud_productos_a_bodega_principal_estado f on a.solicitud_prod_a_bod_ppal_id = f.solicitud_prod_a_bod_ppal_id and a.estado = f.estado and (f.sw_terminado is null or f.sw_terminado = '0') \
                inner join operarios_bodega g on f.responsable_id = g.operario_id\
                left join inv_bodegas_movimiento_tmp_despachos_farmacias h on a.solicitud_prod_a_bod_ppal_id = h.solicitud_prod_a_bod_ppal_id \
                left join inv_bodegas_movimiento_tmp i on h.doc_tmp_id = i.doc_tmp_id and h.usuario_id = i.usuario_id \
                where " + sql_aux + " \
                 a.estado = '"+estado_pedido+"' /*AND a.sw_despacho = 0*/ \
                and (\
                    a.solicitud_prod_a_bod_ppal_id :: varchar ilike $1 or\
                    d.razon_social ilike  $1 or\
                    b.descripcion ilike $1 or\
                    e.nombre  ilike $1 \
                ) order by f.fecha asc ";
    
    //La clausula AND a.sw_despacho = 0 en la consulta SQL, se agrega temporalemente mientras se corrgigen los estados de los pedidos
    //esta clausula permite determinar si un pedido esta pendiente por despachaar (0) o despachado (1)

    G.db.pagination(sql, ["%" + termino_busqueda + "%"], pagina, limite, function(err, rows, result, total_records) {

        callback(err, rows, total_records);
    });
};





// Asigancion de responsable al pedido 
PedidosFarmaciasModel.prototype.asignar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var that = this;

    // Validar si existen responsables asigandos
    var sql = " SELECT * FROM solicitud_productos_a_bodega_principal_estado a WHERE a.solicitud_prod_a_bod_ppal_id = $1 AND a.estado = $2 and (a.sw_terminado is null or a.sw_terminado = '0');";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, responsable_estado_pedido, result) {
        if (responsable_estado_pedido.length > 0) {
            //Actualizar
            that.actualizar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                // Actualizar Estado Actual del Pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        } else {
            // Asignar
            that.insertar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                // Actualizar Estado Actual del Pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        }
    });
};


//  Almacenar responsable al pedido 
PedidosFarmaciasModel.prototype.insertar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "INSERT INTO solicitud_productos_a_bodega_principal_estado( solicitud_prod_a_bod_ppal_id, estado, responsable_id, fecha, usuario_id) " +
            "VALUES ($1, $2, $3, now(), $4);";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};

// actualizacion del responsable del pedido
PedidosFarmaciasModel.prototype.actualizar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "UPDATE solicitud_productos_a_bodega_principal_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4 " +
            "WHERE solicitud_prod_a_bod_ppal_id=$1 AND estado=$2 and (sw_terminado is null or sw_terminado = '0'); ";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.eliminar_responsables_pedidos = function(numero_pedido, callback) {

    var sql = "DELETE FROM solicitud_productos_a_bodega_principal_estado WHERE solicitud_prod_a_bod_ppal_id =$1 and (sw_terminado is null or sw_terminado = '0') ; ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });
};


// actualizacion el estado actual del pedido
PedidosFarmaciasModel.prototype.actualizar_estado_actual_pedido = function(numero_pedido, estado_pedido, callback) {

    var sql = "UPDATE solicitud_productos_a_bodega_principal SET estado=$2 WHERE solicitud_prod_a_bod_ppal_id=$1;";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};



// lista todos los responsables del pedido
PedidosFarmaciasModel.prototype.obtener_responsables_del_pedido = function(numero_pedido, callback) {

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,  \
                a.estado,\
                case when a.estado='0' then 'Registrado'\
                     when a.estado='1' then 'Asignado'\
                     when a.estado='2' then 'Auditado'\
                     when a.estado='3' then 'En Zona Despacho' \
                     when a.estado='4' then 'Despachado' \
                     when a.estado='5' then 'Despachado con Pendientes' \
                     when a.estado='6' then 'Separacion Finalizada' \
                     when a.estado='7' then 'En Auditoria' \
                     when a.estado='8' then 'Auditado con pdtes' \
                     when a.estado='9' then 'En zona con pdtes' end as descripcion_estado,\
                b.operario_id,\
                b.nombre as nombre_responsable,\
                b.usuario_id as usuario_id_responsable,\
                a.usuario_id,\
                c.nombre as nombre_usuario,\
                a.fecha as fecha_asignacion,\
                a.fecha_registro,    \
                COALESCE(a.sw_terminado,'0') as sw_terminado\
                from solicitud_productos_a_bodega_principal_estado a \
                inner join system_usuarios c on a.usuario_id = c.usuario_id\
                left join operarios_bodega b on a.responsable_id = b.operario_id\
                where a.solicitud_prod_a_bod_ppal_id=$1 order by a.fecha_registro DESC; ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.terminar_estado_pedido = function(numero_pedido,estados,terminado,callback) {
    
    estados = estados.join(",");
    
    var sql = "update solicitud_productos_a_bodega_principal_estado set sw_terminado = $2\
               where solicitud_prod_a_bod_ppal_id  = $1 and estado::integer in("+estados+") and (sw_terminado is null or sw_terminado = '0')";

    G.db.query(sql, [numero_pedido, terminado], function(err, rows, result) {
        callback(err, rows, result);
    });
};
// Pedidos en Donde esta pendiente por entregar el Producto
PedidosFarmaciasModel.prototype.listar_pedidos_pendientes_by_producto = function(empresa, codigo_producto, callback) {

    var sql = " select \
                a.farmacia_id,\
                c.razon_social,\
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                b.cantidad_solic as cantidad_solicitada,\
                b.cantidad_pendiente,\
                d.usuario_id,\
                d.usuario,\
                a.fecha_registro, \
                e.justificacion_separador,\
                e.justificacion_auditor\
                from solicitud_productos_a_bodega_principal a \
                inner join solicitud_productos_a_bodega_principal_detalle b on a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                inner join empresas c on a.farmacia_id = c.empresa_id\
                inner join system_usuarios d on a.usuario_id = d.usuario_id \
                left join(\
                      select bb.observacion as justificacion_separador, bb.justificacion_auditor, aa.solicitud_prod_a_bod_ppal_id, bb.codigo_producto\
                      from inv_bodegas_movimiento_despachos_farmacias aa\
                      inner join inv_bodegas_movimiento_justificaciones_pendientes bb on aa.numero = bb.numero and aa.prefijo = bb.prefijo\
                ) e on e.solicitud_prod_a_bod_ppal_id = a.solicitud_prod_a_bod_ppal_id  and e.codigo_producto = b.codigo_producto\
                where a.empresa_destino = $1 and b.codigo_producto = $2 and b.cantidad_pendiente > 0 ; ";


    G.db.query(sql, [empresa, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });

};

// obtiene informacion del rotulo para imprimir
PedidosFarmaciasModel.prototype.obtenerDetalleRotulo = function(numero_pedido, numero_caja, tipo, callback) {


    var sql  =  "SELECT c.ubicacion as direccion, c.descripcion as cliente, e.departamento, a.numero_caja, a.tipo FROM inv_rotulo_caja  a\
            INNER JOIN solicitud_productos_a_bodega_principal b ON b.solicitud_prod_a_bod_ppal_id = a.solicitud_prod_a_bod_ppal_id\
            INNER JOIN bodegas c ON b.farmacia_id = c.empresa_id AND b.centro_utilidad = c.centro_utilidad AND b.bodega = c.bodega\
            INNER JOIN centros_utilidad d ON c.empresa_id = d.empresa_id AND c.centro_utilidad = d.centro_utilidad\
            INNER JOIN tipo_dptos e ON e.tipo_dpto_id 	= d.tipo_dpto_id AND e.tipo_pais_id = d.tipo_pais_id\
            WHERE a.solicitud_prod_a_bod_ppal_id = $1 AND a.numero_caja = $2 AND a.tipo = $3;";

    G.db.query(sql, [numero_pedido, numero_caja, tipo], function(err, rows, result) {
        callback(err, rows);
    });
};


// Autor:      : Camilo  Orozco 
// Descripcion : Calcula la cantidad TOTAL pendiente de un producto en pedidos farmacia
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();
//               

PedidosFarmaciasModel.prototype.calcular_cantidad_total_pendiente_producto = function(empresa_id, codigo_producto, callback) {
    
    var sql = " select b.codigo_producto, SUM( b.cantidad_pendiente) AS cantidad_total_pendiente\
                from solicitud_productos_a_bodega_principal a \
                inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id    \
                where a.empresa_destino = $1 and b.codigo_producto = $2 and b.cantidad_pendiente > 0 \
                group by 1";
    
    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};

// Autor:      : Alexander López
// Descripcion : Calcula la cantidad TOTAL de un producto que está reservada en pedidos temporales de Farmacia
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();
//               

PedidosFarmaciasModel.prototype.calcular_cantidad_reservada_temporales_farmacias = function(codigo_producto, callback) {
    
    var sql = " select codigo_producto, SUM(cantidad_solic)::integer as total_reservado from solicitud_pro_a_bod_prpal_tmp where codigo_producto = $1\
                group by codigo_producto"; 
    
    G.db.query(sql, [codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};


// Autor:      : Eduar Garcia
// Descripcion : Calcula la cantidad TOTAL de un producto que está reservada en pedidos temporales de Farmacia por fecha de registro
// Calls       : Pedidos -> PedidosModel -> calcular_disponibilidad_producto();
//               

PedidosFarmaciasModel.prototype.calcular_cantidad_reservada_temporales_farmacias_por_fecha = function(codigo_producto, fecha_registro_pedido, callback) {
    
    var sql = " select codigo_producto, SUM(cantidad_solic)::integer as total_reservado from solicitud_pro_a_bod_prpal_tmp where codigo_producto = $1\
                and fecha_registro < $2\
                group by codigo_producto "; 
    
    G.db.query(sql, [codigo_producto, fecha_registro_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

/**
 * @api {sql} actualizar_cantidad_pendiente_en_solicitud Pedidos farmacias model
 * @apiName Pedidos Farmacias
 * @apiGroup PedidosFarmacias (sql)
 * @apiDescription se actualiza la cantidad pendiente del pedido al genear el despacho
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */

PedidosFarmaciasModel.prototype.actualizar_cantidad_pendiente_en_solicitud = function(numero_pedido, callback) {
    
     var sql = " select b.codigo_producto, b.cantidad_solic, sum(coalesce(c.cantidad_despachada,0)) as cantidad_despachada,\
                 b.cantidad_solic - sum(coalesce(c.cantidad_despachada,0)) as cantidad_pendiente from\
                solicitud_productos_a_bodega_principal a\
                inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                left join(\
                select b.codigo_producto, sum(b.cantidad) AS cantidad_despachada, b.prefijo, b.numero \
                from inv_bodegas_movimiento_despachos_farmacias a \
                inner join inv_bodegas_movimiento_d b on a.empresa_id =b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                where a.solicitud_prod_a_bod_ppal_id = $1 group by 1,3,4\
                ) as c on b.codigo_producto = c.codigo_producto\
                where a.solicitud_prod_a_bod_ppal_id = $1 group by 1,2 ";
    
    
    G.db.query(sql, [numero_pedido], function(err, rows, result) {
       
        
        if(err){
            callback(err, null);
            return;
        }
        
        var length = rows.length;
        
        G.db.begin(function() {
            rows.forEach(function(row){
                
                var cantidad_pendiente = parseInt(row.cantidad_pendiente);
                 sql = "UPDATE solicitud_productos_a_bodega_principal_detalle\
                        SET cantidad_pendiente= $1 WHERE solicitud_prod_a_bod_ppal_id= $2 AND\
                        codigo_producto=$3; ";


                G.db.transaction(sql, [cantidad_pendiente, numero_pedido, row.codigo_producto], function(err, rows, result) {

                     if (--length === 0) {
                         G.db.commit(function(){
                            callback(err, rows);
                            return;
                         });
                    }
                });

            });
        });
    });
};

PedidosFarmaciasModel.prototype.consultar_producto_en_farmacia = function(empresa_id, centro_utilidad, bodega, codigo_producto, callback) {
    
    var sql = " select count(*) as cantidad_registros from existencias_bodegas\
                where empresa_id = $1\
                and centro_utilidad = $2\
                and bodega = $3\
                and codigo_producto = $4";
    
    G.db.query(sql, [empresa_id, centro_utilidad, bodega, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
    
};

PedidosFarmaciasModel.prototype.actualizar_encabezado_pedido = function(numero_pedido, farmacia_id, centro_utilidad, bodega, observacion, callback) {
        
    var sql = " update solicitud_productos_a_bodega_principal\
                set farmacia_id = $2, centro_utilidad = $3, bodega = $4, observacion = $5\
                where solicitud_prod_a_bod_ppal_id = $1";
    
    G.db.query(sql, [numero_pedido, farmacia_id, centro_utilidad, bodega, observacion], function(err, rows, result) {
        callback(err, rows);
    });
    
};


PedidosFarmaciasModel.prototype.actualizarDestinoDeProductos = function(numero_pedido, farmacia_id, centro_utilidad, bodega, callback) {
    
    var sql = " update solicitud_productos_a_bodega_principal_detalle\
                set farmacia_id = $2, centro_utilidad = $3, bodega = $4\
                where solicitud_prod_a_bod_ppal_id = $1";  
    
    G.db.query(sql, [numero_pedido, farmacia_id, centro_utilidad, bodega], function(err, rows, result) {
        callback(err, rows);
    });
    
};

PedidosFarmaciasModel.prototype.listarProductos = function(empresa_id, centro_utilidad_id, bodega_id, empresa_destino, centro_destino, bodega_destino,
                                                           pagina, filtro, callback) {
    
    //console.log(">>>>---Datos Recibidos---<<<<");
    var sql_aux = "";
    var array_parametros = [empresa_id, centro_utilidad_id, bodega_id, empresa_destino, centro_destino, bodega_destino, "%" + filtro.termino_busqueda + "%"];
    var sql_filtro = "";

    // Se realiza este cambio para permitir buscar productos de un determiando tipo.
    if (filtro.tipo_producto !== '0') {
        sql_aux = " and b.tipo_producto_id = '"+filtro.tipo_producto+"' ";
    }
    
    if(filtro.tipo_busqueda === 0){
        sql_filtro =  " and fc_descripcion_producto(a.codigo_producto) ILIKE  $7 ";
    } else if(filtro.tipo_busqueda === 1){
        sql_filtro =  " and e.descripcion ILIKE $7 "; 
    } else {
        sql_filtro =  " and a.codigo_producto ILIKE $7 ";
    }
    
    console.log("sql aux ", sql_aux, pagina);
    
    var sql = " select\
                b.codigo_producto,\
                a.empresa_id,\
                a.centro_utilidad,\
                a.bodega,\
                f.descripcion as descripcion_laboratorio,\
                e.descripcion as descripcion_molecula,\
                fc_descripcion_producto(b.codigo_producto) as nombre_producto,\
                b.unidad_id,\
                b.estado,\
                b.codigo_invima,\
                b.contenido_unidad_venta,\
                b.sw_control_fecha_vencimiento,\
                a.existencia_minima,\
                a.existencia_maxima,\
                a.existencia::integer as existencia,\
                c.existencia as existencia_total,\
                c.costo_anterior,\
                c.costo,\
                CASE WHEN c.costo > 0 THEN ROUND(((c.precio_venta/c.costo)-1) * 100) ELSE NULL END as porcentaje_utilidad,\
                c.costo_penultima_compra,\
                c.costo_ultima_compra,\
                c.precio_venta_anterior,\
                c.precio_venta,\
                c.precio_minimo,\
                c.precio_maximo,\
                c.sw_vende,\
                c.grupo_contratacion_id,\
                c.nivel_autorizacion_id,\
                b.grupo_id,\
                b.clase_id,\
                b.subclase_id,\
                b.porc_iva,\
                b.tipo_producto_id,\
                case when coalesce((a.existencia - coalesce(h.cantidad_total_pendiente, 0) - coalesce(i.total_solicitado, 0))::integer, 0) < 0 then 0\
                        else coalesce((a.existencia - coalesce(h.cantidad_total_pendiente, 0) - coalesce(i.total_solicitado, 0))::integer, 0) end as disponibilidad_bodega,\
                coalesce(j.existencias_farmacia, 0) as existencias_farmacia\
                from existencias_bodegas a\
                inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and a.empresa_id = c.empresa_id\
                inner join inv_tipo_producto d ON b.tipo_producto_id = d.tipo_producto_id\
                inner join inv_subclases_inventarios e ON b.grupo_id = e.grupo_id and b.clase_id = e.clase_id and b.subclase_id = e.subclase_id\
                inner join inv_clases_inventarios f ON e.grupo_id = f.grupo_id and e.clase_id = f.clase_id\
                left join (\
		    select aa.empresa_id, aa.codigo_producto, sum(aa.cantidad_total_pendiente) as cantidad_total_pendiente\
                    from(\
                          select a.empresa_destino as empresa_id, /*a.centro_destino as centro_utilidad, a.bodega_destino as bodega,*/ b.codigo_producto, SUM( b.cantidad_pendiente) AS cantidad_total_pendiente\
                          from solicitud_productos_a_bodega_principal a\
                          inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                          where b.cantidad_pendiente > 0\
                          group by 1, 2\
                          union\
                          SELECT\
                          a.empresa_id, /*a.centro_destino as centro_utilidad, a.bodega_destino as bodega,*/ b.codigo_producto, SUM((b.numero_unidades - b.cantidad_despachada)) as cantidad_total_pendiente\
                          FROM ventas_ordenes_pedidos a\
                          inner join ventas_ordenes_pedidos_d b ON a.pedido_cliente_id = b.pedido_cliente_id\
                          where (b.numero_unidades - b.cantidad_despachada) > 0 and a.estado = '1'  \
                          GROUP BY 1, 2\
                       ) aa group by 1,2\
		) h on (a.empresa_id = h.empresa_id)  /*and (a.centro_utilidad = h.centro_utilidad or a.bodega =h.bodega)*/  and c.codigo_producto = h.codigo_producto \
                left join(\
                   SELECT aa.empresa_id, aa.codigo_producto, /*aa.centro_destino, aa.bodega_destino,*/ SUM(aa.total_reservado) as total_solicitado FROM(\
                        select b.codigo_producto, a.empresa_destino as empresa_id, /*a.centro_destino as centro_destino, a.bogega_destino as bodega_destino,*/ SUM(cantidad_solic)::integer as total_reservado\
                        from  solicitud_bodega_principal_aux a\
                        inner join solicitud_pro_a_bod_prpal_tmp b on a.farmacia_id = b.farmacia_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.usuario_id = b.usuario_id\
                        group by 1,2\
                        union\
                        SELECT b.codigo_producto, a.empresa_id, /*a.centro_destino, a.bodega_destino,*/ sum(b.numero_unidades)::integer as total_reservado from ventas_ordenes_pedidos_tmp a\
                        INNER JOIN ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                        WHERE  a.estado = '1'\
                        GROUP BY 1,2\
                    ) aa group by 1,2\
                ) i on (a.empresa_id = i.empresa_id) and i.codigo_producto = c.codigo_producto\
                left join (\
                    select\
                    a.codigo_producto,\
                    a.existencia::integer as existencias_farmacia\
                    from existencias_bodegas a\
                    where a.empresa_id= $4 and a.centro_utilidad = $5 and a.bodega = $6\
                    ORDER BY 1 ASC \
                ) j on j.codigo_producto = c.codigo_producto\
                where a.empresa_id= $1 and a.centro_utilidad = $2 and a.bodega = $3 " + sql_aux + sql_filtro+ "\
               ORDER BY 1 ASC ";
    
    G.db.paginated(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });
    
};

function __actualizar_cantidades_detalle_pedido(numero_pedido, codigo_producto, cantidad_solicitada, cantidad_pendiente, callback){
    
    var sql = "UPDATE solicitud_productos_a_bodega_principal_detalle\
                SET cantidad_solic = $3, cantidad_pendiente = $4\
                WHERE solicitud_prod_a_bod_ppal_id = $1 and codigo_producto = $2";

    G.db.transaction(sql, [numero_pedido, codigo_producto, cantidad_solicitada, cantidad_pendiente], callback);
};

function __eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, callback) {

    var sql = "DELETE FROM solicitud_productos_a_bodega_principal_detalle\
                WHERE solicitud_prod_a_bod_ppal_id = $1 and codigo_producto = $2";

    G.db.transaction(sql, [numero_pedido, codigo_producto], callback);
};

function __log_eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario, callback){
    
    var sql = "INSERT INTO log_eliminacion_pedidos_farmacia(pedido_id,farmacia,usuario_solicitud,codigo_producto,cant_solicita,cant_pendiente,usuario_id,fecha_registro,usuario_ejecuta)\
                SELECT a.solicitud_prod_a_bod_ppal_id as pedido_id, b.razon_social as farmacia, c.usuario as usuario_solicitud, a.codigo_producto, a.cantidad_solic as cant_solicita, a.cantidad_pendiente as cant_pendiente, a.usuario_id, CURRENT_TIMESTAMP as fecha_registro, c.nombre as usuario_ejecuta\
                FROM solicitud_productos_a_bodega_principal_detalle a\
                LEFT JOIN empresas b on b.empresa_id = a.farmacia_id\
                LEFT JOIN system_usuarios c on c.usuario_id = $3\
                WHERE a.solicitud_prod_a_bod_ppal_id = $1\
                AND a.codigo_producto = $2";

    G.db.transaction(sql, [numero_pedido, codigo_producto, usuario], callback);
};

module.exports = PedidosFarmaciasModel;