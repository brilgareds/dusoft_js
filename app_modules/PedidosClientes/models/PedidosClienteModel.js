
var PedidosClienteModel = function(productos, m_pedidos_logs) {

    // Temporalmente
    this.m_productos = productos;
    this.m_pedidos_logs = m_pedidos_logs;
};

/**
 * @api {sql} listar_pedidos_clientes Pedidos Clientes
 * @apiName Pedidos Clientes
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Lista todos los pedidos realizados a clientes.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {String} empresa_id Identificador de la Empresa que realizÃ³ el pedido
 * @apiParam {String} termino_busqueda Termino por el cual desea filtrar lo pedidos.
 *                    Se puede filtrar por:
 *                    numero del pedido
 *                    identificacion del tercero
 *                    nombre del tercero
 *                    direccion
 *                    telefono
 *                    identificacion del vendedor
 *                    nombre del vendedor.
 *
 * @apiParam {Number} pagina Numero de la pagina, actualmente se traen 1000 registros por pagina (Cambiar en configuraciones de empresa)
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - listarPedidosClientes();
 * @apiSuccessExample SQL.
 *          select
 a.pedido_cliente_id as numero_pedido,
 b.tipo_id_tercero as tipo_id_cliente,
 b.tercero_id as identificacion_cliente,
 b.nombre_tercero as nombre_cliente,
 b.direccion as direccion_cliente,
 b.telefono as telefono_cliente,
 c.tipo_id_vendedor,
 c.vendedor_id as idetificacion_vendedor,
 c.nombre as nombre_vendedor,
 a.estado,
 case when a.estado = 0 then 'Inactivo '
 when a.estado = 1 then 'Activo'
 when a.estado = 2 then 'Anulado'
 when a.estado = 3 then 'Entregado' end as descripcion_estado,
 a.estado_pedido as estado_actual_pedido,
 case when a.estado_pedido = 0 then 'No Asignado'
 when a.estado_pedido = 1 then 'Asignado'
 when a.estado_pedido = 2 then 'Auditado'
 when a.estado_pedido = 3 then 'En Despacho'
 when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido,
 a.fecha_registro
 from ventas_ordenes_pedidos a
 inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id
 inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id
 where a.empresa_id = $1
 and (   a.pedido_cliente_id ilike $2
 or b.tercero_id ilike $2
 or b.nombre_tercero ilike $2
 or b.direccion ilike $2
 or b.telefono ilike $2
 or c.vendedor_id ilike $2
 or c.nombre ilike $2)
 AND (a.estado IN ('0','1','2','3')) order by 1 desc  limit $3 offset $4
 *
 */
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
PedidosClienteModel.prototype.listar_pedidos_clientes = function(empresa_id, 
                                                                termino_busqueda, 
                                                                filtro, 
                                                                pagina, 
                                                                estadoPedido, 
                                                                estadoSolicitud,
                                                                fecha_inicial,
                                                                fecha_final,
                                                                callback) {

    var estado = "";


    if (filtro !== undefined) {

        if (filtro.no_asignados) {
            estado = '0';
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
        
        if (filtro.por_autorizar) {
            estado = '10';
        }
    }
    
    
            
    var facturaFiscal =   G.knex.raw("'FF' as factura_fiscal");
    
    var estadoFacturaFiscal =  G.knex.raw("'00' as estado_factura_fiscal");
    
     if (fecha_inicial !== undefined) {
        
        //if(filtro.filtroEstadoFacturado){
            /*facturaFiscal = G.knex.raw("CASE WHEN (SELECT max(fac.factura_fiscal) as factura_fiscal FROM (\
                        SELECT distinct(invfa.factura_fiscal) as factura_fiscal\
                                  FROM inv_facturas_agrupadas_despacho as invfa\
                                  INNER JOIN inv_facturas_agrupadas_despacho_d as invfad \
                                  ON invfa.prefijo = invfad.prefijo \
                                  AND invfa.factura_fiscal = invfad.factura_fiscal\
                                  AND invfad.pedido_cliente_id = a.pedido_cliente_id\
                        UNION\
                        SELECT distinct(factura_fiscal) as factura_fiscal\
                        FROM inv_facturas_despacho as b \
                        WHERE b.pedido_cliente_id = a.pedido_cliente_id\
                        ) as fac ) is null THEN 'NO FACTURADO'\
                        ELSE 'FACTURADO' END as factura_fiscal "
                    );*/
            facturaFiscal = G.knex.raw("CASE WHEN estado_factura_fiscal = 0 THEN 'NO FACTURADO' ELSE 'FACTURADO' END as factura_fiscal ");
            
            estadoFacturaFiscal = "estado_factura_fiscal";
            /*estadoFacturaFiscal = G.knex.raw("CASE WHEN (SELECT max(fac.factura_fiscal) as factura_fiscal FROM (\
                        SELECT distinct(invfa.factura_fiscal) as factura_fiscal\
                                  FROM inv_facturas_agrupadas_despacho as invfa\
                                  INNER JOIN inv_facturas_agrupadas_despacho_d as invfad \
                                  ON invfa.prefijo = invfad.prefijo \
                                  AND invfa.factura_fiscal = invfad.factura_fiscal\
                                  AND invfad.pedido_cliente_id = a.pedido_cliente_id\
                        UNION\
                        SELECT distinct(factura_fiscal) as factura_fiscal\
                        FROM inv_facturas_despacho as b \
                        WHERE b.pedido_cliente_id = a.pedido_cliente_id\
                        ) as fac ) is null THEN '0'\
                        ELSE '1' END as estado_factura_fiscal "
                    );*/
         
        /*}else{
            
            facturaFiscal =   G.knex.raw("'-----------' as factura_fiscal");    
            estadoFacturaFiscal =  G.knex.raw("'00' as estado_factura_fiscal");
            
        }*/
    }
    var columns = [ 
        facturaFiscal,
        estadoFacturaFiscal,
        "a.empresa_id",
        "a.centro_destino as centro_utilidad_id",
        "a.bodega_destino as bodega_id",
        "a.pedido_cliente_id as numero_pedido",
        "b.tipo_id_tercero as tipo_id_cliente",
        "b.tercero_id as identificacion_cliente",
        "b.nombre_tercero as nombre_cliente",
        "b.direccion as direccion_cliente",
        "b.telefono as telefono_cliente",
        "c.tipo_id_vendedor",
        "c.vendedor_id as idetificacion_vendedor",
        "c.nombre as nombre_vendedor",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Inactivo '\
                    when a.estado = '1' then 'Activo'\
                    when a.estado = '2' then 'Anulado'\
                    when a.estado = '3' then 'Entregado'\
                    when a.estado = '4' then 'Debe autorizar cartera' end as descripcion_estado"),
        "a.estado_pedido as estado_actual_pedido",
        G.knex.raw("case when a.estado_pedido = '0' AND a.estado != '4' then 'No Asignado'\
                    when a.estado_pedido = '1' then 'Asignado'\
                    when a.estado_pedido = '2' then 'Auditado'\
                    when a.estado_pedido = '3' then 'En Zona Despacho'\
                    when a.estado_pedido = '4' then 'Despachado'\
                    when a.estado_pedido = '5' then 'Despachado con Pendientes'\
                    when a.estado_pedido = '6' then 'Separacion Finalizada'\
                    when a.estado_pedido = '7' then 'En Auditoria'\
                    when a.estado_pedido = '8' then 'Auditado con pdtes'\
                    when a.estado_pedido = '9' then 'En zona con pdtes'\
                    when a.estado = '4' then 'Debe autorizar cartera'\
                    when a.estado_pedido = '10' then 'Por Autorizar' end as descripcion_estado_actual_pedido"),
        "d.estado as estado_separacion",
        G.knex.raw("to_char(a.fecha_registro, 'dd-mm-yyyy HH:mi am') as fecha_registro"),
        "e.empresa_id as despacho_empresa_id",
        "e.prefijo as despacho_prefijo",
        "e.numero as despacho_numero",
        G.knex.raw("CASE WHEN e.numero IS NOT NULL THEN true ELSE false END as tiene_despacho"),
        "f.descripcion as descripcion_tipo_producto",
        G.knex.raw("'1' as tipo_pedido")
        
    ];
      
            
    var query = G.knex.column(columns).from("ventas_ordenes_pedidos as a").innerJoin("terceros as b", function() {
        this.on("a.tipo_id_tercero", "b.tipo_id_tercero").on("a.tercero_id", "b.tercero_id");
    }).innerJoin("vnts_vendedores as c", function() {
        this.on("a.tipo_id_vendedor", "c.tipo_id_vendedor").on("a.vendedor_id", "c.vendedor_id");
    }).leftJoin("inv_bodegas_movimiento_tmp_despachos_clientes as d", "a.pedido_cliente_id", "d.pedido_cliente_id").where(function() {
        this.where("a.empresa_id", empresa_id)
        
        if (fecha_inicial !== undefined) {
             this.where(G.knex.raw("a.fecha_registro between '"+ fecha_inicial + "' and '"+ fecha_final +"'"));
        }
       
        if (estado !== "") {
            this.where("a.estado_pedido", estado);
        }
    }).
            leftJoin("inv_bodegas_movimiento_despachos_clientes as e", "a.pedido_cliente_id", "e.pedido_cliente_id").
            innerJoin("inv_tipo_producto as f", "a.tipo_producto", "f.tipo_producto_id").
             
            andWhere(function() {

        if (filtro) {
            if (filtro.tipo_busqueda === 0) {
                this.where(G.knex.raw("a.pedido_cliente_id::varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%");
            }

            if (filtro.tipo_busqueda === 1) {
                this.where("b.tercero_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                        orWhere("b.nombre_tercero", G.constants.db().LIKE, "%" + termino_busqueda + "%");
            }

            if (filtro.tipo_busqueda === 2) {
                this.where("c.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                        orWhere("c.vendedor_id", G.constants.db().LIKE, "%" + termino_busqueda + "%")
            }
        }
    });

    if (estadoPedido) {
        query.andWhere('a.estado', G.constants.db().LIKE, "%" + estadoPedido + "%");
    }

    if (estadoSolicitud) {
        andWhere('a.estado_pedido', G.constants.db().LIKE, "%" + estadoSolicitud + "%");
    }

    query.limit(G.settings.limit).
            offset((pagina - 1) * G.settings.limit);
    //La base del 170 no responde con un orderby,  por esa razon se condiciona para produccion
    if (G.program.prod) {
        query.orderByRaw("6 DESC");
    }

    query.then(function(rows) {
         
        callback(false, rows);
    }). catch (function(err) {
        console.log("err [listar_pedidos_clientes]: ", err);
        callback(err);
    });
};

/**
 * +Descripcion Model encargado de consultar la lista de facturas
 *              de un pedido
 *  @author Cristian Ardila
 *  @fecha 2017-01-02
 */
PedidosClienteModel.prototype.listarFacturasPedido = function(obj,callback){
    
     var subColQuery = [G.knex.raw("distinct(invfa.factura_fiscal) as factura_fiscal"), 
                        "invfad.pedido_cliente_id as pedido_cliente_id",
                        "invfa.fecha_registro as fecha_registro"];
                    
     var subQuery = G.knex.select(subColQuery)
                .from("inv_facturas_agrupadas_despacho as invfa")
                .innerJoin("inv_facturas_agrupadas_despacho_d as invfad", 
                    function() {
                        this.on("invfa.prefijo","invfad.prefijo")
                            .on("invfa.factura_fiscal","invfad.factura_fiscal")

                }).union(function(){
                    this.select([G.knex.raw("distinct(factura_fiscal) as factura_fiscal"),
                                "b.pedido_cliente_id",
                                "b.fecha_registro"])
                        .from('inv_facturas_despacho as b');
                        
                }).as("fac");
     
    var query = G.knex.select(["fac.pedido_cliente_id", "fac.factura_fiscal",  G.knex.raw("to_char(fac.fecha_registro, 'YYYY-MM-DD HH12:MI:SS') as fecha_registro")])
                        .from(subQuery)
                        .where('fac.pedido_cliente_id',obj.pedido);
                
    query.then(function(resultado){ 
        //console.log("resultado [listarFacturasPedido]:", resultado);     
        callback(false, resultado);
    }).catch(function(err){    
        console.log("err [listarFacturasPedido]:", err);
        callback(err);
    });
    
};
/**
 * @author Eduar Garcia
 * +Descripcion: Metodo usado por el crontab de pedidos para borrar temporales todas las noches
 * @param {type} callback
 * @returns {void}
 */
PedidosClienteModel.prototype.eliminarTemporalesClientes = function(callback) {
    var sql = "UPDATE ventas_ordenes_pedidos_tmp  set estado = '0'";

    G.knex.raw(sql).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [eliminarTemporalesClientes]: ", err);
        callback(err);
    });
};

/**
 * @author Eduar Garcia
 * +Descripcion: Metodo usado por el crontab de pedidos para borrar reservas de clientes, siempre y cuando la fecha sea igual o mayor a un mes
 * @param {type} callback
 * @returns {void}
 */
PedidosClienteModel.prototype.borrarReservas = function(callback) {
    var sql = "UPDATE ventas_ordenes_pedidos_d SET cantidad_despachada = numero_unidades WHERE pedido_cliente_id IN(\
                SELECT a.pedido_cliente_id FROM ventas_ordenes_pedidos AS a\
                  inner join (\
                  	select  EXTRACT(DAY FROM MAX(now())-MIN(b.fecha_registro)) as dias, b.pedido_cliente_id, b.empresa_id\
                        from ventas_ordenes_pedidos as b\
                        GROUP BY 2,3\
                  ) as t on t.pedido_cliente_id = a.pedido_cliente_id  and t.empresa_id = a.empresa_id\
                  WHERE t.dias  >= 30\
          ) and cantidad_despachada < numero_unidades";

    G.knex.raw(sql).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [borrarReservas]: ", err);
        callback(err);
    });
};

/**
 * @api {sql} consultar_pedido Consultar Pedido
 * @apiName Consultar Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Consulta la informaciÃ³n principal del pedido seleccionado.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del Pedido
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Evento - onNotificarPedidosActualizados();
 *
 *     Modulo : PedidosClientes
 *     Accion : Evento - onNotificacionOperarioPedidosAsignados();
 * @apiSuccessExample SQL.
 *          select
 a.pedido_cliente_id as numero_pedido,
 b.tipo_id_tercero as tipo_id_cliente,
 b.tercero_id as identificacion_cliente,
 b.nombre_tercero as nombre_cliente,
 b.direccion as direccion_cliente,
 b.telefono as telefono_cliente,
 c.tipo_id_vendedor,
 c.vendedor_id as idetificacion_vendedor,
 c.nombre as nombre_vendedor,
 a.estado,
 case when a.estado = 0 then 'Inactivo '
 when a.estado = 1 then 'Activo'
 when a.estado = 2 then 'Anulado'
 when a.estado = 3 then 'Entregado' end as descripcion_estado,
 a.estado_pedido as estado_actual_pedido,
 case when a.estado_pedido = 0 then 'No Asignado'
 when a.estado_pedido = 1 then 'Asignado'
 when a.estado_pedido = 2 then 'Auditado'
 when a.estado_pedido = 3 then 'En Despacho'
 when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido,
 a.fecha_registro
 from ventas_ordenes_pedidos a
 inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id
 inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id
 where a.pedido_cliente_id = $1
 AND (a.estado IN ('0','1','2','3')) order by 1 desc;
 *
 */

PedidosClienteModel.prototype.consultar_pedido = function(numero_pedido, callback) {

    var columnas = [
        "a.pedido_cliente_id as numero_pedido",
        "b.tipo_id_tercero as tipo_id_cliente",
        "b.tercero_id as identificacion_cliente",
        "b.nombre_tercero as nombre_cliente",
        "b.direccion as direccion_cliente",
        "b.telefono as telefono_cliente",
        G.knex.raw("coalesce(f.contrato_cliente_id, (SELECT contrato_cliente_id FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1')) as contrato_cliente_id"),
        "c.tipo_id_vendedor",
        "c.vendedor_id as idetificacion_vendedor",
        "c.nombre as nombre_vendedor",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Inactivo '\
             when a.estado = '1' then 'Activo'\
             when a.estado = '2' then 'Anulado'\
             when a.estado = '3' then 'Entregado' end as descripcion_estado"),
        "a.estado_pedido as estado_actual_pedido",
        G.knex.raw("case when a.estado_pedido = '0' then 'No Asignado'\
             when a.estado_pedido = '1' then 'Asignado'\
             when a.estado_pedido = '2' then 'Auditado'\
             when a.estado_pedido = '3' then 'En Zona Despacho'\
             when a.estado_pedido = '4' then 'Despachado'\
             when a.estado_pedido = '5' then 'Despachado con Pendientes'\
             when a.estado_pedido = '6' then 'Separacion Finalizada'\
             when a.estado_pedido = '7' then 'En Auditoria'\
             when a.estado_pedido = '8' then 'Auditado con pdtes'\
             when a.estado_pedido = '9' then 'En zona con pdtes'\
             when a.estado_pedido = '10' then 'Por Autorizar' end as descripcion_estado_actual_pedido"),
        "d.estado as estado_separacion",
        "a.observacion",
        "a.observacion_cartera",
        "a.sw_aprobado_cartera",
        G.knex.raw("coalesce(a.tipo_producto,'') as tipo_producto"),
        G.knex.raw("coalesce(e.descripcion,'') as descripcion_tipo_producto"),
        "a.fecha_registro",
        "g.nombre",
        "h.razon_social"
    ];

    G.knex.column(columnas).from("ventas_ordenes_pedidos as a").innerJoin("terceros as b", function() {
        this.on("a.tipo_id_tercero", "b.tipo_id_tercero").
                on("a.tercero_id", "b.tercero_id");
    }).innerJoin("vnts_vendedores as c", function() {
        this.on("a.tipo_id_vendedor", "c.tipo_id_vendedor").
                on("a.vendedor_id", "c.vendedor_id");
    }).leftJoin("inv_bodegas_movimiento_tmp_despachos_clientes as d", "a.pedido_cliente_id", "d.pedido_cliente_id").
            leftJoin("inv_tipo_producto as e", "a.tipo_producto", "e.tipo_producto_id").
            leftJoin("vnts_contratos_clientes as f", function() {
        this.on("b.tipo_id_tercero", "f.tipo_id_tercero").
                on("b.tercero_id", "f.tercero_id").
                on("a.empresa_id", "f.empresa_id").
                on(G.knex.raw("f.estado = '1'"));
    }).innerJoin("system_usuarios as g", "g.usuario_id", "a.usuario_id")
            .innerJoin("empresas as h", "h.empresa_id", "a.empresa_id")
            .where("a.pedido_cliente_id", numero_pedido).orderByRaw("1 desc").then(function(rows) {
        callback(false, rows);
    }). catch (function(err) {
        console.log("err [consultar_pedido]: ", err);
        callback(err);
    }).done();
};


/*
 * @Autor : Cristian Ardila
 * +Descripcion : Se consulta el detallado de un pedido que
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.consultarDetallePedido
 *
 * @api {sql} consultar_detalle_pedido Detalle Pedido
 * @apiName Detalle Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Consulta toda la informacion detallada del pedido como productos, cantidades, precios, iva etc.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del Pedido
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - listaPedidosOperariosBodega();
 * @apiSuccessExample SQL.
 *          select
 a.pedido_cliente_id as numero_pedido,
 a.codigo_producto,
 fc_descripcion_producto(a.codigo_producto) as descripcion_producto,
 a.numero_unidades as cantidad_solicitada,
 a.cantidad_despachada,
 a.numero_unidades - a.cantidad_despachada as cantidad_pendiente,
 a.cantidad_facturada,
 a.valor_unitario,
 a.porc_iva as porcentaje_iva,
 (a.valor_unitario+(a.valor_unitario*(a.porc_iva/100)))as valor_unitario_con_iva,
 (a.numero_unidades*(a.valor_unitario*(a.porc_iva/100))) as valor_iva
 from ventas_ordenes_pedidos_d a where a.pedido_cliente_id = $1 ;
 *
 */

PedidosClienteModel.prototype.consultar_detalle_pedido = function(numero_pedido, callback) {

    var sql = " select c.estado,\
                    a.pedido_cliente_id as numero_pedido,\
                    a.codigo_producto,\
                    fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                    a.numero_unidades::integer as cantidad_solicitada,\
                    a.cantidad_despachada::integer as cantidad_despachada_real,\
                    (a.numero_unidades - a.cantidad_despachada)::integer as cantidad_pendiente_real,\
                    COALESCE(b.cantidad_temporalmente_separada,0)::integer as cantidad_temporalmente_separada,\
                    ABS( a.cantidad_despachada +  COALESCE(b.cantidad_temporalmente_separada,0) )::integer as cantidad_despachada,\
                    (a.numero_unidades - ABS( a.cantidad_despachada +  COALESCE(b.cantidad_temporalmente_separada,0) ) )::integer as cantidad_pendiente,\
                    /*a.cantidad_facturada::integer,*/ \
                    a.valor_unitario,\
                    a.porc_iva as porcentaje_iva,\
                    (a.valor_unitario+(a.valor_unitario*(a.porc_iva/100)))as valor_unitario_con_iva,\
                    (a.numero_unidades*(a.valor_unitario*(a.porc_iva/100))) as valor_iva,\
                    COALESCE(b.justificacion, '') as justificacion, \
                    COALESCE(b.justificacion_auditor, '') as justificacion_auditor, \
                    COALESCE(b.lote, '') as lote,\
                    b.fecha_vencimiento,\
                    b.item_id,\
                    b.tipo_estado_auditoria,\
                    b.cantidad_ingresada,\
                    COALESCE(b.auditado, '0') as auditado,\
                    c.codigo_barras, \
                   (a.numero_unidades * a.valor_unitario)  as subtotal,\
                   ((a.valor_unitario+(a.valor_unitario*(a.porc_iva/100))) * a.numero_unidades) as total,\
                    f.existencia_actual,\
                    g.existencia as existencia_bodega,\
                    c.estado as bloqueado,\
                    (\
                        select case when j.estado = '1' then 'Aprobado' when j.estado = '2' then 'Denegado' end as descripcion_autorizacion from autorizaciones_productos_pedidos  as j\
                        where  tipo_pedido = '0' and j.codigo_producto = a.codigo_producto and j.pedido_id = a.pedido_cliente_id\
                        order by fecha_verificacion asc limit 1\
                    ) as descripcion_autorizacion,\
                    b.observacion_justificacion_separador,\
                    b.observacion_justificacion_auditor\
                    from ventas_ordenes_pedidos_d a \
                    inner join inventarios_productos c on a.codigo_producto = c.codigo_producto \
                    inner join inv_subclases_inventarios d on c.grupo_id = d.grupo_id and c.clase_id = d.clase_id and c.subclase_id = d.subclase_id \
                    inner join inv_clases_inventarios e on d.grupo_id = e.grupo_id and d.clase_id = e.clase_id \
                    left join (\
                        select a.numero_pedido, a.codigo_producto, a.justificacion, a.justificacion_auditor, sum(a.cantidad_temporalmente_separada) as cantidad_temporalmente_separada,\
                        a.lote, a.fecha_vencimiento, a.item_id, a.tipo_estado_auditoria, a.cantidad_ingresada, a.auditado, a.empresa_id, a.centro_utilidad, a.bodega, a.observacion_justificacion_separador, a.observacion_justificacion_auditor\
                        from (\
                                select a.pedido_cliente_id as numero_pedido,  b.codigo_producto,  c.observacion as justificacion, c.justificacion_auditor, \
                                SUM(b.cantidad) as cantidad_temporalmente_separada, b.lote, to_char(b.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento,\
                                b.item_id, '2' as tipo_estado_auditoria, b.cantidad :: integer as cantidad_ingresada, b.auditado, b.empresa_id, b.centro_utilidad, b.bodega,\
                                c.observacion_justificacion_separador, c.observacion_justificacion_auditor\
                                from inv_bodegas_movimiento_tmp_despachos_clientes a \
                                inner join inv_bodegas_movimiento_tmp_d b on a.usuario_id = b.usuario_id and a.doc_tmp_id = b.doc_tmp_id\
                                left join inv_bodegas_movimiento_tmp_justificaciones_pendientes c on b.doc_tmp_id = c.doc_tmp_id and b.usuario_id = c.usuario_id and b.codigo_producto = c.codigo_producto\
                                group by 1,2,3,4,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16\
                                union \
                                select a.pedido_cliente_id  as numero_pedido, b.codigo_producto, b.observacion as justificacion, b.justificacion_auditor, \
                                0 as cantidad_temporalmente_separada, '' as lote, null as fecha_vencimiento, 0 as item_id, '3' as tipo_estado_auditoria,\
                                0 as  cantidad_ingresada, '0' as auditado, '' as empresa_id, '' as centro_utilidad, '' as bodega, b.observacion_justificacion_separador, b.observacion_justificacion_auditor \
                                from inv_bodegas_movimiento_tmp_despachos_clientes a \
                                left join inv_bodegas_movimiento_tmp_justificaciones_pendientes b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                                and b.codigo_producto not in(\
                                      select aa.codigo_producto from inv_bodegas_movimiento_tmp_d aa where aa.doc_tmp_id = b.doc_tmp_id and aa.usuario_id = b.usuario_id\
                                )\
                        ) a group by 1,2,3,4,6, 7, 8, 9, 10, 11,12,13,14,15,16 \
                    ) as b on a.pedido_cliente_id = b.numero_pedido and a.codigo_producto = b.codigo_producto\
                    left join existencias_bodegas_lote_fv f on f.empresa_id = b.empresa_id and f.centro_utilidad = b.centro_utilidad and f.codigo_producto = b.codigo_producto and f.lote = b.lote and f.fecha_vencimiento = b.fecha_vencimiento :: date and f.bodega = b.bodega\
                    left join existencias_bodegas g on g.empresa_id = b.empresa_id and g.centro_utilidad = b.centro_utilidad and g.codigo_producto = b.codigo_producto and g.bodega = b.bodega\
                    where a.pedido_cliente_id = ?  order by e.descripcion ;";

    G.knex.raw(sql, [numero_pedido]).
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
       
        console.log("err [consultar_detalle_pedido]: ", err);
        callback(err);
    });

};

/**
 * @api {sql} listar_pedidos_del_operario Listar Pedidos Operarios
 * @apiName Listar Pedidos Operarios
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Listar los pedidos asignados a un operario de bodega.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} responsable Nombre del Operario
 * @apiParam {Number} pagina NÃºmero de la pagina que requiere traer registros
 * @apiParam {Number} limite Cantidad de resgistros por pagina, si no se envia el limite default es 1000
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - listaPedidosOperariosBodega();
 * @apiSuccessExample SQL.
 *      select
 *      a.pedido_cliente_id as numero_pedido,
 *      b.tipo_id_tercero as tipo_id_cliente,
 *      b.tercero_id as identificacion_cliente,
 *      b.nombre_tercero as nombre_cliente,
 *      b.direccion as direccion_cliente,
 *      b.telefono as telefono_cliente,
 *      c.tipo_id_vendedor,
 *      c.vendedor_id as idetificacion_vendedor,
 *      c.nombre as nombre_vendedor,
 *      a.estado,
 *      case when a.estado = 0 then 'Inactivo'
 *      when a.estado = 1 then 'Activo'
 *      when a.estado = 2 then 'Anulado'
 *      when a.estado = 3 then 'Entregado' end as descripcion_estado,
 *      a.estado_pedido as estado_actual_pedido,
 *      case when a.estado_pedido = 0 then 'No Asignado'
 *      when a.estado_pedido = 1 then 'Asignado'
 *      when a.estado_pedido = 2 then 'Auditado'
 *      when a.estado_pedido = 3 then 'En Despacho'
 *      when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido,
 *      a.fecha_registro,
 *      d.responsable_id,
 *      e.nombre as responsable_pedido,
 *      d.fecha as fecha_asignacion_pedido
 *      from ventas_ordenes_pedidos a
 *      inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id
 *      inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id
 *      inner join ventas_ordenes_pedidos_estado d on a.pedido_cliente_id = d.pedido_cliente_id and a.estado_pedido = d.estado
 *      inner join operarios_bodega e on d.responsable_id = e.operario_id
 *      where d.responsable_id = $1
 *      and a.estado_pedido = '1'
 *      AND (a.estado IN ('1'))
 *      order by by d.fecha desc limit $2 offset $3 ;;
 */

PedidosClienteModel.prototype.listar_pedidos_del_operario = function(responsable, termino_busqueda, filtro, pagina, limite, callback) {

    var columnas = [
        "a.empresa_id as empresa_destino",
        "a.centro_destino",
        "a.bodega_destino",
        "f.doc_tmp_id as documento_temporal_id",
        "a.pedido_cliente_id as numero_pedido",
        "b.tipo_id_tercero as tipo_id_cliente",
        "b.tercero_id as identificacion_cliente",
        "b.nombre_tercero as nombre_cliente",
        "b.direccion as direccion_cliente",
        "b.telefono as telefono_cliente",
        "c.tipo_id_vendedor",
        "c.vendedor_id as idetificacion_vendedor",
        "c.nombre as nombre_vendedor",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Inactivo'\
                    when a.estado = '1' then 'Activo'\
                    when a.estado = '2' then 'Anulado'\
                    when a.estado = '3' then 'Entregado' end as descripcion_estado"),
        "a.estado_pedido as estado_actual_pedido",
        G.knex.raw("case when a.estado_pedido = '0' then 'No Asignado'\
                    when a.estado_pedido = '1' then 'Asignado'\
                    when a.estado_pedido = '2' then 'Auditado'\
                    when a.estado_pedido = '3' then 'En Zona Despacho'\
                    when a.estado_pedido = '4' then 'Despachado'\
                    when a.estado_pedido = '5' then 'Despachado con Pendientes'\
                    when a.estado_pedido = '6' then 'Separacion Finalizada'\
                    when a.estado_pedido = '7' then 'En Auditoria'\
                    when a.estado_pedido = '8' then 'Auditado con pdtes'\
                    when a.estado_pedido = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido"),
        "f.estado as estado_separacion",
        G.knex.raw("case when f.estado = '0' then 'Separacion en Proceso'\
                    when f.estado = '1' then 'Separacion Finalizada' end as descripcion_estado_separacion"),
        "a.fecha_registro",
        "d.responsable_id",
        "e.nombre as responsable_pedido",
        "d.fecha as fecha_asignacion_pedido",
        "g.fecha_registro as fecha_separacion_pedido"
    ];

    var query = G.knex.column(columnas).from("ventas_ordenes_pedidos as a").innerJoin("terceros as b", function() {
        this.on("a.tipo_id_tercero", "b.tipo_id_tercero").
                on("a.tercero_id", "b.tercero_id");
    }).innerJoin("vnts_vendedores as c", function() {
        this.on("a.tipo_id_vendedor", "c.tipo_id_vendedor").
                on("a.vendedor_id", "c.vendedor_id");
    }).innerJoin("ventas_ordenes_pedidos_estado as d", function() {
        this.on("a.pedido_cliente_id", "d.pedido_cliente_id").
                on("a.estado_pedido", "d.estado").
                on(G.knex.raw("(d.sw_terminado is null or d.sw_terminado = ?)", ['0']));
    }).innerJoin("operarios_bodega as e", "d.responsable_id", "e.operario_id").
            leftJoin("inv_bodegas_movimiento_tmp_despachos_clientes as f", "a.pedido_cliente_id", "f.pedido_cliente_id").
            leftJoin("inv_bodegas_movimiento_tmp as g", function() {
        this.on("f.usuario_id", "g.usuario_id").
                on("f.doc_tmp_id", "g.doc_tmp_id");

    }).where(function() {

        /*=========================================================================*/
        // Se implementa este filtro, para poder filtrar los pedidos del clientes
        // asignados al operario de bodega y saber si el pedido tiene temporales o
        // fue finalizado correctamente.
        /*=========================================================================*/

        var estado_pedido = '1';
        if (filtro !== undefined) {

            if (filtro.asignados) {
                this.whereRaw(" f.doc_tmp_id IS NULL and  e.usuario_id = ? ", [responsable]);
            }

            if (filtro.temporales) {
                this.whereRaw("  f.doc_tmp_id IS NOT NULL AND f.estado = '0' and  e.usuario_id = ? ", [responsable]);
            }
            if (filtro.finalizados) {
                estado_pedido = '7';
                this.whereRaw(" e.usuario_id = (select usuario_id from operarios_bodega where operario_id = d.responsable_id ) and  g.usuario_id = ?", [responsable]);
            }
        }

        this.where("a.estado_pedido", estado_pedido);

    });

    query.andWhere(function() {
        this.where(G.knex.raw("a.fecha_registro >= ?", [ (new Date().getFullYear() - 1) + "-01-12 00:00:00"]));
    });

    if (filtro.numeroPedido) {
        query.where(G.knex.raw("a.pedido_cliente_id :: varchar"), "=", termino_busqueda);
    } else {

        query.andWhere(function() {
            this.where(G.knex.raw("a.pedido_cliente_id :: varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("b.tercero_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("b.nombre_tercero", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("c.vendedor_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("c.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%");
        });
    }
    query.totalRegistros = 0;
    query.then(function(total) {
        var registros = query.
                limit(limite).
                offset((pagina - 1) * limite).
                orderBy("d.fecha", "asc");

        query.totalRegistros = total.length;
        return registros;

    }).then(function(rows) {
        callback(false, rows, query.totalRegistros);
    }). catch (function(err) {
        console.log("err [listar_pedidos_del_operario]: ", err);
        callback(err);
    }).done();
};


/**
 * @api {sql} asignar_responsables_pedidos Asignar Responsables
 * @apiName Asignar Responsables
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Se le asignan pedidos a un operario de bodega para ser separados.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Number} responsable Id del Operario de bodega
 * @apiParam {Number} usuario Id del usuario que registra la asignacion.
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - asignarResponsablesPedido();
 */

PedidosClienteModel.prototype.asignar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {
    var that = this;

    G.knex.column("*").
            from("ventas_ordenes_pedidos_estado as a").
            where("a.pedido_cliente_id", numero_pedido).
            andWhere("a.estado", estado_pedido).
            whereRaw("(a.sw_terminado is null or a.sw_terminado = '0')").then(function(responsable_estado_pedido) {


        if (responsable_estado_pedido.length > 0) {
            //Actualizar
            that.actualizar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                //Actualizar estado actual del pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        } else {
            // Asignar
            that.insertar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                //Actualizar estado actual del pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        }

    }). catch (function(err) {
        console.log("err [asignar_responsables_pedidos]: ", err);
        callback(err);
    });
};


/**
 * @api {sql} insertar_responsables_pedidos Ingresar Responsables Pedido
 * @apiName Ingresar Responsables Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Ingresar el responsable del pedido asignado
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Number} responsable Id del Operario de bodega
 * @apiParam {Number} usuario Id del usuario que registra la asignacion.
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          INSERT INTO ventas_ordenes_pedidos_estado( pedido_cliente_id, estado, responsable_id, fecha, usuario_id) VALUES ($1, $2, $3, now(), $4);
 */

//  Almacenar responsable al pedido
// Callbacks :  * Modulo :  PedidosClientes
//                          Modelo - asignar_responsables_pedidos();
PedidosClienteModel.prototype.insertar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {


    G.knex("ventas_ordenes_pedidos_estado").
            returning("venta_orden_pedido_estado_id").
            insert({pedido_cliente_id: numero_pedido, estado: estado_pedido, responsable_id: responsable, fecha: 'now()', usuario_id: usuario}).
            then(function(resultado) {

        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [insertar_responsables_pedidos]: ", err);
        callback(err);
    }).done();

};

/**
 * @api {sql} actualizar_responsables_pedidos Actualizar Responsables Pedido
 * @apiName Actualizar Responsables Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Asigna el Pedido a otro operario de bodega.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Number} responsable Id del Operario de bodega
 * @apiParam {Number} usuario Id del usuario que registra la asignacion.
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          UPDATE ventas_ordenes_pedidos_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4  WHERE pedido_cliente_id=$1 AND estado=$2;
 */

PedidosClienteModel.prototype.actualizar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {


    G.knex("ventas_ordenes_pedidos_estado").
            where("pedido_cliente_id", numero_pedido).
            andWhere("estado", estado_pedido).
            whereRaw("(sw_terminado is null or sw_terminado = '0')").
            returning('venta_orden_pedido_estado_id').
            update({responsable_id: responsable, fecha: 'NOW()', usuario_id: usuario}).then(function(resultado) {



        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [actualizar_responsables_pedidos]: ", err);
        callback(err);
    });

};


/**
 * @api {sql} eliminar_responsables_pedidos Eliminar el responsable de un pedido
 * @apiName Eliminar Responsables Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Permite eliminar el / los responsable de un pedido
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          UPDATE ventas_ordenes_pedidos_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4  WHERE pedido_cliente_id=$1 AND estado=$2;
 */

PedidosClienteModel.prototype.eliminar_responsables_pedidos = function(numero_pedido, callback) {
    G.knex("ventas_ordenes_pedidos_estado").
            where("pedido_cliente_id", numero_pedido).
            whereRaw("(sw_terminado is null or sw_terminado = '0')").del().
            then(function(rows) {
        callback(false, rows);
    }). catch (function(err) {
         console.log("err [eliminar_responsables_pedidos]: ", err);
        callback(err);
    }).done();

};

/**
 * @api {sql} actualizar_estado_actual_pedido Actualizar Estado Actual del Peedido
 * @apiName Actualizar Estado Actual
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Permite cambiar el estado actual del pedido, dependiendo en momento o gestion determinada en donde se encuentre.
 * Los estados permitidos son:
 * 0 = No Asignado. Cuando se crea el pedido por primera vez
 * 1 = Asignado, cuando el pedido fue asignado a un operario de bodega para ser despachado
 * 2 = En Auditoria, Cuando se ha separado el pedido y lo estan auditando para verificar su correcta separacion.
 * 3 = Auditado, Cuando se ha separado el pedido y lo estan auditando para verificar su correcta separacion.
 * 4 = En Despacho, Cuando se encuentra listo para ser despachado al lugar de destino.
 * 5 = Despachado, Cuando el pedido ha sido despachado en su total al lugar de destino.
 * 6 = Despachado con Pendientes, Cuando el pedido ha sido despachado en su total al lugar de destino.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          UPDATE ventas_ordenes_pedidos SET estado_pedido=$2 WHERE pedido_cliente_id=$1;
 */

PedidosClienteModel.prototype.actualizar_estado_actual_pedido = function(numero_pedido, estado_pedido, callback) {

    G.knex("ventas_ordenes_pedidos").
            where("pedido_cliente_id", numero_pedido).
            update({estado_pedido: estado_pedido}).then(function(resultado) {

        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [actualizar_estado_actual_pedido]: ", err);
        callback(err);
    });

};


/**
 * FUNCION SIN PROPOSITO ---->>> ACCIONES SOBRE ESTA FUNCION (ELIMINAR;DELETE;DROP;KILL)
 */
PedidosClienteModel.prototype.calcular_cantidad_total_pendiente_producto = function(empresa_id, codigo_producto, callback) {


    var sql = " SELECT\
                b.codigo_producto,\
                SUM((b.numero_unidades - b.cantidad_despachada)) as cantidad_total_pendiente\
                FROM ventas_ordenes_pedidos a\
                inner join ventas_ordenes_pedidos_d b ON a.pedido_cliente_id = b.pedido_cliente_id\
                where a.empresa_id = :1 and b.codigo_producto = :2 and (b.numero_unidades - b.cantidad_despachada) > 0  \
                GROUP BY 1";


    G.knex.raw(sql, {1: empresa_id, 2: codigo_producto}).then(function(err, resultado) {

        callback(err, resultado.rows, resultado);
    }).catch (function(err) {
        console.log("err [calcular_cantidad_total_pendiente_producto]: ", err);
        callback(err);
    });
};

/**
 * FUNCION SIN PROPOSITO ---->>> ACCIONES SOBRE ESTA FUNCION (ELIMINAR;DELETE;DROP;KILL)
 */
PedidosClienteModel.prototype.calcular_cantidad_reservada_cotizaciones_clientes = function(codigo_producto, callback) {

    var sql = " SELECT b.codigo_producto, sum(b.numero_unidades)::integer as total_reservado from ventas_ordenes_pedidos_tmp a\
                INNER JOIN ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                WHERE b.codigo_producto = :1 and a.estado = '1'\
                GROUP BY b.codigo_producto";

    G.knex.raw(sql, {1: codigo_producto}).then(function(resultado) {
        callback(false, resultado.rows);
    }).catch (function(err) {
        console.log("err [calcular_cantidad_reservada_cotizaciones_clientes]: ", err);
        callback(err);
    });
};



/**
 * @author Eduar Garcia
 * +Descripcion: Calcula la cantidad TOTAL de un producto que estÃ¡ reservada en cotizaciones de Clientes por fecha
 * @param {type} codigo_producto
 * @param {type} fecha_registro_pedido
 * @param {type} callback
 * @returns {void}
 * Funciones que hacen uso del modelo : Pedidos -> PedidosModel -> calcular_disponibilidad_producto();
 */
PedidosClienteModel.prototype.calcular_cantidad_reservada_cotizaciones_clientes_por_fecha = function(codigo_producto, fecha_registro_pedido, callback) {

    var sql = " SELECT b.codigo_producto, sum(b.numero_unidades)::integer as total_reservado from ventas_ordenes_pedidos_tmp a\
                INNER JOIN ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                WHERE b.codigo_producto = :1 and a.estado = '1' AND a.fecha_registro < :2\
                GROUP BY b.codigo_producto";

    G.knex.raw(sql, {1: codigo_producto, 2: fecha_registro_pedido}).then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        console.log("err [calcular_cantidad_reservada_cotizaciones_clientes_por_fecha]: ", err);
        callback(err);
    });


};


// lista todos los responsables del pedido
PedidosClienteModel.prototype.obtener_responsables_del_pedido = function(numero_pedido, callback) {

    var columnas = [
        "a.pedido_cliente_id as numero_pedido",
        "a.estado",
        G.knex.raw("case when a.estado='0' then 'No Asignado'\
             when a.estado='1' then 'Asignado'\
             when a.estado='2' then 'Auditado'\
             when a.estado='3' then 'En Zona Despacho'\
             when a.estado='4' then 'Despachado'\
             when a.estado='5' then 'Despachado con Pendientes'\
             when a.estado='6' then 'Separacion Finalizada'\
             when a.estado='7' then 'En Auditoria'\
             when a.estado='8' then 'Auditado con pdtes'\
             when a.estado='9' then 'En zona con pdtes' end as descripcion_estado"),
        "b.operario_id",
        "b.nombre as nombre_responsable",
        "b.usuario_id as usuario_id_responsable",
        "a.usuario_id",
        "c.nombre as nombre_usuario",
        "a.fecha as fecha_asignacion",
        "a.fecha_registro",
        G.knex.raw("COALESCE(a.sw_terminado,'0') as sw_terminado")
    ];

    var sql = G.knex.columns(columnas).
            from("ventas_ordenes_pedidos_estado as a").
            innerJoin("system_usuarios as c", "a.usuario_id", "c.usuario_id").
            leftJoin("operarios_bodega as b", "a.responsable_id", "b.operario_id").
            where("a.pedido_cliente_id", numero_pedido).
            orderBy("a.fecha_registro", "desc").
            then(function(rows) {
        callback(false, rows);
    }). catch (function(err) {
        console.log("err [obtener_responsables_del_pedido]: ", err);
        callback(err);
    }).done();

};


PedidosClienteModel.prototype.terminar_estado_pedido = function(numero_pedido, estados, terminado, callback) {

    estados = estados.join(",");

    var sql = "update ventas_ordenes_pedidos_estado set sw_terminado = :2\
               where  pedido_cliente_id = :1 and estado :: integer in(" + estados + ") and (sw_terminado is null or sw_terminado = '0')";

    G.knex.raw(sql, {1: numero_pedido, 2: terminado}).then(function(resultado) {
        callback(false, resultado);
    }).catch(function(err){
        console.log("err [terminar_estado_pedido]: ", err);
        callback(err);
    });

};

/**
 *
 * @param {string} numero_pedido
 * @param {string} numero_caja
 * @param {string} tipo
 * @param {function} callback
 * @returns {void}
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 11:33 am
 * */
PedidosClienteModel.prototype.obtenerDetalleRotulo = function(numero_pedido, numero_caja, tipo, callback) {

    var sql = "SELECT a.direccion, a.cliente, '' AS departamento, a.numero_caja, a.tipo FROM inv_rotulo_caja a\
               WHERE a.solicitud_prod_a_bod_ppal_id = :1 AND a.numero_caja = :2 AND a.tipo = :3; ";


    G.knex.raw(sql, {1: numero_pedido, 2: numero_caja, 3: tipo}).then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        console.log("err [obtenerDetalleRotulo]: ", err);
        callback(err);
    });



};

/**
 * +Descripcion: Pedidos en Donde esta pendiente por entregar el Producto
 * @param {string} empresa
 * @param {string} codigo_producto
 * @param {function} callback
 * @returns {void}
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 11:33 am
 * */
PedidosClienteModel.prototype.listar_pedidos_pendientes_by_producto = function(empresa, codigo_producto, callback) {

    var sql = " SELECT\
                a.pedido_cliente_id as numero_pedido,\
                b.numero_unidades as cantidad_solicitada,\
                ((b.numero_unidades - b.cantidad_despachada)) as cantidad_pendiente,\
                a.tipo_id_tercero,\
                a.tercero_id,\
                c.nombre_tercero,\
                d.usuario,\
                a.fecha_registro,\
                e.justificacion_separador,\
                e.justificacion_auditor\
                FROM ventas_ordenes_pedidos a\
                inner JOIN ventas_ordenes_pedidos_d AS b ON a.pedido_cliente_id = b.pedido_cliente_id\
                inner JOIN terceros as c ON (a.tipo_id_tercero = c.tipo_id_tercero) AND (a.tercero_id = c.tercero_id)\
                JOIN system_usuarios as d ON (a.usuario_id = d.usuario_id)\
                left join(\
                      select bb.observacion as justificacion_separador, bb.justificacion_auditor, aa.pedido_cliente_id, bb.codigo_producto\
                      from inv_bodegas_movimiento_despachos_clientes aa\
                      inner join inv_bodegas_movimiento_justificaciones_pendientes bb on aa.numero = bb.numero and aa.prefijo = bb.prefijo\
                ) e on e.pedido_cliente_id = a.pedido_cliente_id  and e.codigo_producto = b.codigo_producto\
                WHERE a.empresa_id = :1 and b.codigo_producto= :2 and a.estado = '1' and b.numero_unidades <> b.cantidad_despachada\
                ORDER BY a.pedido_cliente_id; ";

    G.knex.raw(sql, {1: empresa, 2: codigo_producto}).then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        console.log("err [listar_pedidos_pendientes_by_producto]: ", err);
        callback(err);
    });


};


/**
 * @api {sql} actualizar_despachos_pedidos_cliente Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription se actualiza la cantidad despachada del pedido al genear el despacho
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario estÃ© autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */

PedidosClienteModel.prototype.actualizar_despachos_pedidos_cliente = function(numero_pedido, prefijo_documento, numero_documento, transaccion, callback) {
    var sql = "select b.codigo_producto, sum(b.cantidad) AS cantidad_despachada, b.prefijo, b.numero\
                from inv_bodegas_movimiento_despachos_clientes a\
                inner join inv_bodegas_movimiento_d b on a.empresa_id =b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                where a.pedido_cliente_id = :1 and a.numero= :3 and a.prefijo= :2 group by 1,3,4";


    G.knex.raw(sql, {1: numero_pedido, 2: prefijo_documento, 3: numero_documento}).transacting(transaccion).then(function(resultado) {

        var length = resultado.rows.length;

        resultado.rows.forEach(function(row) {

            var cantidad_despachada = parseInt(row.cantidad_despachada);
            sql = "UPDATE ventas_ordenes_pedidos_d\
                    SET cantidad_despachada= cantidad_despachada + :1\
                    WHERE   pedido_cliente_id = :2\
                    AND  codigo_producto = :3\
                    AND cantidad_despachada < numero_unidades ";


            G.knex.raw(sql, {1: cantidad_despachada, 2: numero_pedido, 3: row.codigo_producto}).transacting(transaccion).then(function(resultado2) {



                if (--length === 0) {
                    callback(false, resultado2.rows);
                    return;
                }

            }). catch (function(err) {
                callback(err);
            });

        });

    }). catch (function(err) {
         console.log("err [actualizar_despachos_pedidos_cliente]: ", err);
        callback(err);
    });
};

/*
 * Author : Camilo Orozco
 * Descripcion :  SQL listado de productos para la seleccion de medicamentos en una cotizacion o en un pedido de cliente.
 * Funciones que usan el model:
 *  (PedidosClienteController.js)-- __validar_datos_productos_archivo_plano
 *  -- PedidosCliente.prototype.listarProductosClientes
 *  -- PedidosCliente __validar_datos_productos_archivo_plano
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 6:10 pm
 */
PedidosClienteModel.prototype.listar_productos = function(empresa, centro_utilidad_id, bodega_id, contrato_cliente_id, filtro, pagina, filtros, filtroAvanzado, callback) {


    var filtroProducto = "";
    var filtroNumeroCotizacion = "";
    var filtroNumeroPedido = "";
    var sql_aux = "";
    var termino_busqueda = filtro.termino_busqueda;
    var tipo_producto = filtro.tipo_producto;
    var laboratorio_id = filtro.laboratorio_id;
    var parametros = {1: empresa, 2: centro_utilidad_id, 3: bodega_id, 4: contrato_cliente_id};
    
    if (filtroAvanzado.tipoBusqueda === 0) {

        if (tipo_producto !== undefined && tipo_producto !== '') {
            sql_aux = " and b.tipo_producto_id = '" + tipo_producto + "'";
        }
        if (laboratorio_id !== undefined && laboratorio_id !== '') {
            sql_aux += " and f.clase_id = '" + laboratorio_id + "'";
        }
        if (filtros.tipo_busqueda === 0) {
            filtroProducto = "AND (fc_descripcion_producto(b.codigo_producto) " + G.constants.db().LIKE + " :5)";
            parametros["5"] = '%' + termino_busqueda + '%';
        }

        if (filtros.tipo_busqueda === 1) {
            filtroProducto = "AND (e.descripcion " + G.constants.db().LIKE + " :5)";
            parametros["5"] = '%' + termino_busqueda + '%';
        }

        if (filtros.tipo_busqueda === 2) {
            /*filtroProducto = "AND (a.codigo_producto " + G.constants.db().LIKE + " :5)";
            parametros["5"] = '%' + termino_busqueda + '%';*/
            if(filtro.filtro_producto === 0){
                filtroProducto = "AND (a.codigo_producto " + G.constants.db().LIKE + " :5)";
                parametros["5"] = '%' + termino_busqueda + '%';
            }else{
                filtroProducto = "AND (a.codigo_producto = :5)";
                console.log("filtroProducto ", filtroProducto);
                parametros["5"] = termino_busqueda;
            }
             //console.log("EL ARREGLO ", filtros.numero[0]);
            if(filtros.numero[0] !== null){
                if(filtros.tipo === 1){
                    filtroNumeroCotizacion = "AND a.pedido_cliente_id_tmp NOT IN ( :6 )";
                    parametros["6"] = filtros.numero.join() ;
                }

                if(filtros.tipo === 2){
                    filtroNumeroPedido = "AND a.pedido_cliente_id NOT IN ( :6 )";
                    parametros["6"] = filtros.numero.join() ;
                }
            }
        
        }

        if (filtros === '') {
            filtroProducto = "AND (a.codigo_producto " + G.constants.db().LIKE + " :5)";
            parametros["5"] = '%' + termino_busqueda + '%';

        }
        
        
    }
       
        
    if (filtroAvanzado.tipoBusqueda === 1){
        parametros["5"] = '%' + filtroAvanzado.molecula + '%';
        parametros["6"] = '%' + filtroAvanzado.descripcionProducto + '%';
        parametros["7"] = '%' + filtroAvanzado.concentracion + '%';
        parametros["8"] = '%' + filtroAvanzado.codigoProducto + '%';
        parametros["9"] = '%' + filtroAvanzado.laboratorio_id + '%';
        
        sql_aux = "AND a.codigo_producto " + G.constants.db().LIKE + " :8\
                   AND b.contenido_unidad_venta " + G.constants.db().LIKE + " :7\
                   AND fc_descripcion_producto(b.codigo_producto) " + G.constants.db().LIKE + " :6\
                   AND e.descripcion " + G.constants.db().LIKE + " :5\
                   AND f.clase_id " + G.constants.db().LIKE + " :9 and b.tipo_producto_id  " + G.constants.db().LIKE +" '%"+ filtroAvanzado.tipo_producto + "%' ";

        //filtroAvanzado.tipoBusqueda
    }


    //Se agrega un nuevo campo llamado contrato que retornara FALSE si no tiene
    //contrato con la empresa y TRUE si lo tiene
    var sql = "a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                b.tipo_producto_id,\
                d.descripcion as descripcion_tipo_producto,\
                b.codigo_cum,\
                b.codigo_invima,\
                to_char(b.vencimiento_codigo_invima, 'yyyy-mm-dd') as vencimiento_codigo_invima,\
                b.porc_iva as iva,\
                a.existencia::integer as existencia,\
                coalesce(h.cantidad_total_pendiente, 0)::integer as cantidad_total_pendiente,\
                case when coalesce((a.existencia - coalesce(h.cantidad_total_pendiente, 0) - coalesce(i.total_solicitado, 0) )::integer, 0) < 0 then 0 \
                        else coalesce((a.existencia - coalesce(h.cantidad_total_pendiente, 0) - coalesce(i.total_solicitado, 0) )::integer, 0) end as cantidad_disponible,\
                case when g.precio_pactado > 0 then true else false end as tiene_precio_pactado,\
                split_part(coalesce(fc_precio_producto_contrato_cliente( :4, a.codigo_producto, :1 ),'0'), '@', 1) as precio_producto,\
                b.sw_regulado,\
                c.precio_regulado,\
                b.estado,\
                c.costo_ultima_compra,\
                CASE WHEN (SELECT con.contrato_cliente_id FROM vnts_contratos_clientes con WHERE con.contrato_cliente_id = :4 AND con.porcentaje_genericos > 0) is null then false else true end as contrato\
                ,b.unidad_medida\
                from existencias_bodegas a \
                inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and a.empresa_id = c.empresa_id\
                inner join inv_tipo_producto d ON b.tipo_producto_id = d.tipo_producto_id\
                inner join inv_subclases_inventarios e ON b.grupo_id = e.grupo_id and b.clase_id = e.clase_id and b.subclase_id = e.subclase_id\
                inner join inv_clases_inventarios f ON e.grupo_id = f.grupo_id and e.clase_id = f.clase_id\
                left join (\
                    select b.codigo_producto, coalesce(b.precio_pactado,0) as precio_pactado\
                    from vnts_contratos_clientes a\
                    inner join vnts_contratos_clientes_productos b on a.contrato_cliente_id = b.contrato_cliente_id\
                    where a.contrato_cliente_id = :4\
                ) g on c.codigo_producto = g.codigo_producto\
                left join (\
                    select aa.empresa_id, aa.codigo_producto, sum(aa.cantidad_total_pendiente) as cantidad_total_pendiente\
                    from (\
                      select a.empresa_id, b.codigo_producto, SUM((b.numero_unidades - b.cantidad_despachada)) as cantidad_total_pendiente, 1\
                      from ventas_ordenes_pedidos a\
                      inner join ventas_ordenes_pedidos_d b ON a.pedido_cliente_id = b.pedido_cliente_id\
                      where (b.numero_unidades - b.cantidad_despachada) > 0  and a.estado='1' "+filtroNumeroPedido+" \
                      group by 1,2 \
                      UNION\
                      select a.empresa_destino as empresa_id, b.codigo_producto, SUM( b.cantidad_pendiente) AS cantidad_total_pendiente, 2\
                      from solicitud_productos_a_bodega_principal a \
                      inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id    \
                      where b.cantidad_pendiente > 0 \
                      group by 1,2\
                    ) aa group by 1,2\
                ) h on (a.empresa_id = h.empresa_id) and c.codigo_producto = h.codigo_producto\
                left join(\
                   SELECT aa.empresa_id, aa.codigo_producto, SUM(aa.total_reservado) as total_solicitado FROM( \
                        select b.codigo_producto, a.empresa_destino as empresa_id,  SUM(cantidad_solic)::integer as total_reservado\
                        from  solicitud_bodega_principal_aux a\
                        inner join solicitud_pro_a_bod_prpal_tmp b on a.farmacia_id = b.farmacia_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.usuario_id = b.usuario_id\
                        group by 1,2\
                        union\
                        SELECT b.codigo_producto, a.empresa_id, sum(b.numero_unidades)::integer as total_reservado from ventas_ordenes_pedidos_tmp a\
                        INNER JOIN ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                        WHERE  a.estado = '1' "+filtroNumeroCotizacion+" \
                        GROUP BY 1,2\
                    ) aa group by 1,2\
                ) i on (a.empresa_id = i.empresa_id) and c.codigo_producto = i.codigo_producto \
                where a.empresa_id = :1 and a.centro_utilidad = :2 and a.bodega = :3 " + sql_aux + " \
                 " + filtroProducto;

    var query = G.knex.select(G.knex.raw(sql, parametros)).
            limit(G.settings.limit).
            offset((pagina - 1) * G.settings.limit).then(function(resultado) {
            //console.log("resultado [listar_productos]: >> ", resultado);
        callback(false, resultado);
    }). catch (function(err) {
            console.log("err [listar_productos]: ", err);
        callback(err);
    });

};


/*
 * @author : Camilo Orizco
 * +Descripcion :  SQL Insertar Cotizacion
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 2:43 pm
 */
PedidosClienteModel.prototype.insertar_cotizacion = function(cotizacion, callback) {

    var parametros = {
        1: cotizacion.empresa_id,
        2: cotizacion.cliente.tipo_id_tercero,
        3: cotizacion.cliente.id,
        4: cotizacion.usuario_id,
        5: null,
        6: cotizacion.vendedor.tipo_id_tercero,
        7: cotizacion.vendedor.id,
        8: '1',
        9: cotizacion.observacion,
        10: cotizacion.tipo_producto,
        11: cotizacion.centro_utilidad_id,
        12: cotizacion.bodega_id,
        13: '',
        14: '',
        15: cotizacion.centro_utilidad_id,
        16: cotizacion.bodega_id

    };

    var sql = " INSERT INTO ventas_ordenes_pedidos_tmp (\
                empresa_id,\
                tipo_id_tercero,\
                tercero_id,\
                fecha_registro,\
                usuario_id,\
                fecha_envio,\
                tipo_id_vendedor,\
                vendedor_id,\
                estado,\
                observaciones,\
                tipo_producto,\
                centro_utilidad_id,\
                bodega_id,\
                observacion_cartera,\
                sw_aprobado_cartera,\
                centro_destino,\
                bodega_destino\
                )\
                VALUES( :1, :2, :3, NOW(), :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16) \
                RETURNING pedido_cliente_id_tmp as numero_cotizacion ;";

    //Pendiente revisar porque algunas veces llega en null el centro utilidad y bodega
    G.knex.raw(sql, parametros).
    then(function(resultado) { 
        callback(false, resultado.rows, resultado);
    }). catch (function(err) {
        console.log("err [insertar_cotizacion]", err);
        callback(err);
    });

};


/*
 * @author : Cristian Ardila
 * @fecha:  02/12/2015
 * Descripcion :  SQL Insertar Detalle Cotizacion
 * @Funciones que hacen uso del modelo:
 *  -- Controller: PedidosCliente.prototype.insertarDetalleCotizacion
 *                 PedidosClienteController __insertarDetalleCotizacion()
 */
PedidosClienteModel.prototype.insertar_detalle_cotizacion = function(cotizacion, producto, callback) {


    var sql = "INSERT INTO ventas_ordenes_pedidos_d_tmp (pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario,usuario_id,fecha_registro) \
                 VALUES ( :1, :2, :3, :4, :5, :6, NOW() ) ; ";

    G.knex.raw(sql, {1: cotizacion.numero_cotizacion, 2: producto.codigo_producto, 3: producto.iva, 4: producto.cantidad_solicitada, 5: producto.precio_venta, 6: cotizacion.usuario_id}).
            then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [insertar_detalle_cotizacion]", err);
        callback(err);
    });

};


/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Modificar Detalle Cotizacion
 * @Funciones que hacen uso del modelo:
 *  -- Controller: PedidosCliente.prototype.modificarDetalleCotizacion
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 2:43 pm
 */
PedidosClienteModel.prototype.modificar_detalle_cotizacion = function(cotizacion, producto, callback) {


    G.knex('ventas_ordenes_pedidos_d_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numero_cotizacion)
            .andWhere('codigo_producto', producto.codigo_producto)
            .update({
        porc_iva: producto.iva,
        numero_unidades: producto.cantidad_solicitada,
        valor_unitario: producto.precio_venta,
        usuario_id: cotizacion.usuario_id,
        fecha_registro: 'NOW()'

    }).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("err [modificar_detalle_cotizacion]: ", error);
        callback(error);
    });

};

/*
 * @author : Camilo Orozco
 * +Descripcion :  Modelo que consultara las cotizaciones segun el criterio de busqueda,
 *                 Numero, Nombre Ã³ ID de Cliente, Nombre Ã³ ID de Vendedor
 * @Funciones que hacen uso del modelo:
 *  --PedidosCliente.prototype.listarCotizaciones
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 5:24 pm
 */
PedidosClienteModel.prototype.listar_cotizaciones = function(empresa_id, fecha_inicial, fecha_final, termino_busqueda, pagina, estadoCotizacion, filtros, callback) {

    var filtroCotizacion = "";
    var filtroEstadoCotizacion = "";
    var parametros = {1: empresa_id, 2: fecha_inicial, 3: fecha_final};

    /**
     * +Descripcion Se valida si se envia el estado de cotizacion=6 cuando se
     *              accede desde el cliente al TAB Aprobacion cotizaciones
     *              para consultar unicamente las cotizaciones que solicitan
     *              autorizacion aÃ±adiendo al vector de parametros el criterio
     *              de busqueda por estado de cotizacion
     */
    if (estadoCotizacion) {
        filtroEstadoCotizacion = " AND (a.estado " + G.constants.db().LIKE + " :4)";
        parametros["4"] = '%' + estadoCotizacion + '%';
    }
    /**
     * +Descripcion El criterio de busqueda para una cotizacion sera dependiento
     *              el tipo de busqueda numero Cotizacion=0, Cliente =1, Vendedor =2
     *              aÃ±adiendo al vector de parametros el criterio de busqueda
     *
     */
    if (filtros.tipo_busqueda === 0) {
        filtroCotizacion = " AND (a.pedido_cliente_id_tmp::varchar " + G.constants.db().LIKE + " :5) ";
        parametros["5"] = '%' + termino_busqueda + '%';
    }

    if (filtros.tipo_busqueda === 1) {
        filtroCotizacion = "  AND (b.nombre_tercero " + G.constants.db().LIKE + " :5 OR a.tercero_id " + G.constants.db().LIKE + " :5)";
        parametros["5"] = '%' + termino_busqueda + '%';
    }

    if (filtros.tipo_busqueda === 2) {
        filtroCotizacion = " AND (f.nombre " + G.constants.db().LIKE + " :5 OR f.vendedor_id " + G.constants.db().LIKE + " :5)";
        parametros["5"] = '%' + termino_busqueda + '%';

    }


    var sql = "a.empresa_id,\
     a.centro_destino as centro_utilidad_id,\
     a.bodega_destino as bodega_id,\
     a.pedido_cliente_id_tmp as numero_cotizacion,\
     a.tipo_id_tercero,\
     a.tercero_id,\
     b.nombre_tercero,\
     b.direccion,\
     b.telefono,\
     b.email,\
     e.pais,\
     d.departamento,\
     c.municipio,\
     f.tipo_id_vendedor,\
     f.vendedor_id,\
     f.nombre as nombre_vendendor,\
     f.telefono as telefono_vendedor,\
     a.observaciones,\
     coalesce(a.observacion_cartera, '') as observacion_cartera,\
     coalesce(a.sw_aprobado_cartera, '') as sw_aprobado_cartera,\
     coalesce(a.tipo_producto,'') as tipo_producto,\
     coalesce(g.descripcion,'') as descripcion_tipo_producto,\
     a.estado,\
     case when a.estado = '0' then 'Inactivo'\
     when a.estado = '1' then 'Activo'\
     when a.estado = '2' then 'Anulado'\
     when a.estado = '3' then 'Aprobado cartera'\
     when a.estado = '5' then 'Tiene un pedido'\
     when a.estado = '6' then 'Se solicita autorizacion'\
     when a.estado = '4' then 'No autorizado por cartera' end as descripcion_estado,\
     to_char(a.fecha_registro, 'dd-mm-yyyy HH:mi am') as fecha_registro,\
     h.pedido_cliente_id as numero_pedido, '0' as tipo_pedido\
     from ventas_ordenes_pedidos_tmp a\
     inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
     inner join tipo_mpios c on b.tipo_pais_id = c.tipo_pais_id and b.tipo_dpto_id = c.tipo_dpto_id and b.tipo_mpio_id = c.tipo_mpio_id\
     inner join tipo_dptos d on c.tipo_pais_id = d.tipo_pais_id and c.tipo_dpto_id = d.tipo_dpto_id\
     inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
     inner join vnts_vendedores f on a.tipo_id_vendedor = f.tipo_id_vendedor and a.vendedor_id = f.vendedor_id \
     left join inv_tipo_producto g on a.tipo_producto = g.tipo_producto_id \
     left join ventas_ordenes_pedidos h on a.pedido_cliente_id_tmp = h.pedido_cliente_id_tmp \
     where a.empresa_id= :1 and a.fecha_registro between :2 and :3 \
     " + filtroCotizacion + " " + filtroEstadoCotizacion;


    var query = G.knex.select(G.knex.raw(sql, parametros)).
            limit(G.settings.limit).
            offset((pagina - 1) * G.settings.limit).orderBy("a.pedido_cliente_id_tmp", "desc").then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [listar_cotizaciones]: ", err);
        callback(err);

    });
                        
};

/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Consultar Cotizacion
 * @Funciones que hacen uso del modelo:
 *  --PedidosCliente.prototype.consultarCotizacion
 *  --PedidosCliente.prototype.reporteCotizacion
 */
PedidosClienteModel.prototype.consultar_cotizacion = function(cotizacion, callback) {

    var sql = " select\
                a.empresa_id,\
                a.centro_destino as centro_utilidad_id,\
                a.bodega_destino as bodega_id,\
                a.pedido_cliente_id_tmp as numero_cotizacion,\
                coalesce(h.contrato_cliente_id, (SELECT contrato_cliente_id FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1')) as contrato_cliente_id,\
                a.tipo_id_tercero,\
                a.tercero_id,\
                b.nombre_tercero,\
                b.direccion,\
                b.telefono,\
                b.email,\
                e.pais,\
                d.departamento,\
                c.municipio,\
                f.tipo_id_vendedor,\
                f.vendedor_id,\
                f.nombre as nombre_vendendor,\
                f.telefono as telefono_vendedor,\
                a.observaciones,\
                coalesce(a.observacion_cartera, '') as observacion_cartera,\
                coalesce(a.sw_aprobado_cartera, '') as sw_aprobado_cartera,\
                coalesce(a.tipo_producto,'') as tipo_producto,\
                coalesce(g.descripcion,'') as descripcion_tipo_producto,\
                a.estado,\
                case when a.estado = '0' then 'Inactivo'\
                     when a.estado = '1' then 'Activo'\
                     when a.estado = '2' then 'Anulado'\
                     when a.estado = '3' then 'Aprobado cartera'\
                     when a.estado = '5' then 'Tiene un pedido'\
                     when a.estado = '6' then 'Se solicita autorizacion'\
                     when a.estado = '4' then 'Desaprobado por cartera' end as descripcion_estado,\
                a.fecha_registro,\
                j.razon_social,\
                k.nombre as usuario_cotizacion\
                from ventas_ordenes_pedidos_tmp a\
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                inner join tipo_mpios c on b.tipo_pais_id = c.tipo_pais_id and b.tipo_dpto_id = c.tipo_dpto_id and b.tipo_mpio_id = c.tipo_mpio_id\
                inner join tipo_dptos d on c.tipo_pais_id = d.tipo_pais_id and c.tipo_dpto_id = d.tipo_dpto_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join vnts_vendedores f on a.tipo_id_vendedor = f.tipo_id_vendedor and a.vendedor_id = f.vendedor_id \
                left join inv_tipo_producto g on a.tipo_producto = g.tipo_producto_id \
                left join vnts_contratos_clientes h ON b.tipo_id_tercero = h.tipo_id_tercero AND b.tercero_id = h.tercero_id and a.empresa_id = h.empresa_id and h.estado = '1' \
                INNER JOIN empresas j ON j.empresa_id = a.empresa_id \
                INNER JOIN system_usuarios k ON k.usuario_id = a.usuario_id\
                where a.pedido_cliente_id_tmp = :1 ";


    G.knex.raw(sql, {1: parseInt(cotizacion.numero_cotizacion)}).then(function(resultado) {

        callback(false, resultado.rows, resultado);
    }). catch (function(err) {
        console.log("err [consultar_cotizacion]: ", err);
        callback(err);
    });
};



/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Consultar Detalle Cotizacion
 * @Funciones que hacen uso del modelo:
 *  --PedidosCliente.prototype.consultarDetalleCotizacion
 *  --PedidosCliente.prototype.cotizacionArchivoPlano
 *  --PedidosCliente.prototype.reporteCotizacion
 */
PedidosClienteModel.prototype.consultar_detalle_cotizacion = function(cotizacion, termino_busqueda, callback) {

    var sql = " SELECT\
                a.pedido_cliente_id_tmp as numero_cotizacion,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.numero_unidades as cantidad_solicitada,\
                a.porc_iva as iva,\
                a.valor_unitario, \
                (a.numero_unidades * a.valor_unitario) as subtotal,\
                (a.numero_unidades * (a.valor_unitario * (a.porc_iva/100))) as valor_iva,\
                ((a.valor_unitario+(a.valor_unitario*(a.porc_iva/100))) * a.numero_unidades) as total\
                FROM ventas_ordenes_pedidos_d_tmp AS a\
                WHERE pedido_cliente_id_tmp = :1 and \
                (\
                    a.codigo_producto ilike :2 or\
                    fc_descripcion_producto(a.codigo_producto) ilike :2 \
                );";


    G.knex.raw(sql, {1: cotizacion.numero_cotizacion, 2: '%' + termino_busqueda + '%'}).then(function(resultado) {
        callback(false, resultado.rows, resultado);
    }). catch (function(err) {
        console.log("err [consultar_detalle_cotizacion]: ", err);
        callback(err);
    });
};


/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Consultar Eliminar producto de la Cotizacion
 * @Funciones que hacen uso del modelo:
 *  --PedidosCliente.prototype.eliminarProductoCotizacion
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 2:43 pm
 */
PedidosClienteModel.prototype.eliminar_producto_cotizacion = function(cotizacion, producto, callback)
{

    G.knex('ventas_ordenes_pedidos_d_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numero_cotizacion)
            .andWhere('codigo_producto', producto.codigo_producto)
            .del().then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("err [eliminar_producto_cotizacion]: ", error);
        callback(error);
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar las observaciones ingresadas por el area de cartera
 * @Funciones que hacen uso del modelo:
 *  --PedidosCliente.prototype.observacionCarteraCotizacion
 * Modificacion: Se migra a KNEX.js
 * @fecha: 05/12/2015 9:58 pm
 */
PedidosClienteModel.prototype.observacion_cartera_cotizacion = function(cotizacion, callback)
{

    var sql_aux = '4'; // Estado Activo

    if (cotizacion.aprobado_cartera === 1)
        sql_aux = '3'; // Estado Aprobado Cartera

    G.knex('ventas_ordenes_pedidos_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numero_cotizacion)
            .update({
        observacion_cartera: cotizacion.observacion_cartera,
        sw_aprobado_cartera: cotizacion.aprobado_cartera,
        estado: sql_aux

    }).then(function(resultado) {

        callback(false, resultado.rows, resultado);
    }). catch (function(error) {
        console.log("err [observacion_cartera_cotizacion]: ", error);
        callback(error);
    });
};


/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar estado de pedido a aprobado por cartera - No asignado
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  --PedidosCliente.prototype.observacionCarteraPedido
 */
PedidosClienteModel.prototype.actualizarPedidoCarteraEstadoNoAsigando = function(pedido, callback)
{
    G.knex('ventas_ordenes_pedidos')
            .where('pedido_cliente_id', pedido.numero_pedido)
            .update({
        observacion_cartera: pedido.observacion_cartera,
        sw_aprobado_cartera: pedido.aprobado_cartera,
        estado: '1' //pedido.estado_desaprobado
    }).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("err [actualizarPedidoCarteraEstadoNoAsigando]: ", error);
        callback(error);
    });
};



/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar estado de la cotizacion cuando se crea el pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.generar_pedido_cliente
 */
PedidosClienteModel.prototype.solicitarAutorizacion = function(cotizacion, callback)
{
    G.knex('ventas_ordenes_pedidos_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numeroCotizacion)
            .update({
        estado: cotizacion.estado
    }).then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [solicitarAutorizacion]: ", error);
        callback(error);
    });

};

/*
 * @author : Cristian Ardila
 * @fecha   17/11/2015
 * +Descripcion :  modelo encargado de eliminar una cotizacion
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.eliminarCotizacion
 */
PedidosClienteModel.prototype.eliminarDetalleCotizacion = function(cotizacion, callback)
{
    G.knex('ventas_ordenes_pedidos_tmp').where('pedido_cliente_id_tmp', cotizacion).del().then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [eliminarDetalleCotizacion]: ", error);
        callback(error);
    });
};




/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar si una cotizacion tiene un
 *               pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.eliminarCotizacion
 */
PedidosClienteModel.prototype.consultaCotizacionEnPedido = function(cotizacion, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id_tmp: cotizacion
    }).select('pedido_cliente_id_tmp').then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [consultaCotizacionEnPedido]: ", error);
        callback(error);
    });
};

/*
 * @Autor : Cristian Ardila
 * +Descripcion : Funcion encargada de actualizar el estado del pedido a 4 (Autorizar nuevamente cartera)
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.modificarDetallePedido
 *  --PedidosCliente.prototype.insertarDetallePedido
 *  --PedidosCliente.prototype.eliminarProductoPedido
 *  --PedidosCliente.prototype.insertarCantidadProductoDetallePedido
 */
PedidosClienteModel.prototype.actualizarEstadoPedido = function(pedido, estado_pedido, callback)
{
    var aprobacionCartera;
    if (estado_pedido === 4) {
        aprobacionCartera = pedido.aprobado_cartera;
    } else {
        aprobacionCartera = 0;
    }
    G.knex('ventas_ordenes_pedidos').where('pedido_cliente_id', pedido.numero_pedido).update({
        observacion_cartera: pedido.observacion_cartera,
        sw_aprobado_cartera: aprobacionCartera,
        estado: estado_pedido
    }).then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [actualizarEstadoPedido]: ", error);
        callback(error);
    });
};

/**
 * @author Cristian Ardila
 * +Descripcion: Funcion encargada de consultar el valor total en un pedido
 * @fecha: 04/11/2015
 * @param {string} numero_pedido
 * @param {type} callback
 * @returns {void}
 * @funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.modificarDetallePedido
 *  --PedidosCliente.prototype.insertarDetallePedido
 *  --PedidosCliente.prototype.eliminarProductoPedido
 */
PedidosClienteModel.prototype.consultarTotalValorPedidoCliente = function(numero_pedido, callback) {

    G.knex.select(
            G.knex.raw('sum(ventas_ordenes_pedidos_d_tmp.valor_unitario * ventas_ordenes_pedidos_d_tmp.numero_unidades) as valor_total_cotizacion')
            ).from('ventas_ordenes_pedidos_d_tmp').leftJoin('ventas_ordenes_pedidos',
            'ventas_ordenes_pedidos_d_tmp.pedido_cliente_id_tmp',
            'ventas_ordenes_pedidos.pedido_cliente_id_tmp').where('ventas_ordenes_pedidos.pedido_cliente_id', numero_pedido).then(function(rows) {
        callback(false, rows);
    }). catch (function(err) {
        console.log("err [consultarTotalValorPedidoCliente]: ", err);
        callback(err);
    });
};

/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el estado de un pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.consultarEstadoPedido
 */
PedidosClienteModel.prototype.consultarEstadoPedido = function(numero_pedido, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id: numero_pedido
    }).select('estado').then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [consultarEstadoPedido]: ", error);
        callback(error);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar ela existencia de un producto en
 *               la cotizacion
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.insertarDetalleCotizacion
 */
PedidosClienteModel.prototype.consultarProductoDetalleCotizacion = function(numero_pedido, codigo_producto, callback) {

    G.knex('ventas_ordenes_pedidos_d_tmp').where({
        pedido_cliente_id_tmp: numero_pedido,
        codigo_producto: codigo_producto
    }).select('pedido_cliente_id_tmp').then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [consultarProductoDetalleCotizacion]: ", error);
        callback(error);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar ela existencia de un producto en
 *               un producto
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.consultarEstadoPedido
 */
PedidosClienteModel.prototype.consultarProductoDetallePedido = function(pedido, producto, callback) {

    G.knex('ventas_ordenes_pedidos_d').where({
        pedido_cliente_id: pedido.numero_pedido,
        codigo_producto: producto.codigo_producto
    }).select('pedido_cliente_id').then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [consultarProductoDetallePedido]: ", error);
        callback(error);
    });
};


PedidosClienteModel.prototype.consultarProductoPedido = function(pedido, producto, callback) {


    var sql = "SELECT * FROM ventas_ordenes_pedidos_d WHERE pedido_cliente_id = :1 AND codigo_producto = :2 ";

    G.knex.raw(sql, {1: pedido.numero_pedido, 2: producto.codigo_producto}).
            then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [consultarProductoPedido]", err);
        callback(err);
    });

};

/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el estado de un pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.consultarEstadoPedido
 */
PedidosClienteModel.prototype.consultarEstadoPedidoEstado = function(numero_pedido, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id: numero_pedido,
    }).select('estado', 'estado_pedido').then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [consultarProductoPedido]", error);
        callback(error);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar si la cotizacion ya tiene un pedido
 * @fecha: 11/11/2015
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.generarPedido
 */
PedidosClienteModel.prototype.consultarExistenciaPedidoCotizacion = function(numeroCotizacion, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id_tmp: numeroCotizacion
    }).select('pedido_cliente_id_tmp').then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [consultarExistenciaPedidoCotizacion]", error);
        callback(error);
    });
};
/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el estado de una cotizacion
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.consultarEstadoCotizacion
 *  --PedidosClientesEvents.prototype.onNotificarEstadoCotizacion
 *  --PedidosCliente.prototype.generarPedido
 *  --PedidosCliente.prototype.eliminarCotizacion
 */
PedidosClienteModel.prototype.consultarEstadoCotizacion = function(numeroCotizacion, callback) {


    G.knex('ventas_ordenes_pedidos_tmp').where({
        pedido_cliente_id_tmp: numeroCotizacion
    }).select('estado', 'usuario_id').then(function(rows) {

        callback(false, rows);
    }). catch (function(error){
        console.log("err [consultarEstadoCotizacion]", error);
        callback(error);
    });
};

/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar la cabecera de una cotizacion
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.actualizarCabeceraCotizacion
 */
PedidosClienteModel.prototype.actualizarCabeceraCotizacion = function(cotizacion, callback)
{

    G.knex('ventas_ordenes_pedidos_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numero_cotizacion)
            .update({
        observaciones: cotizacion.observacion
    }).then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        console.log("err [actualizarCabeceraCotizacion]", error);
        callback(error);
    });

};
/*
 * @author : Cristian Ardila
 * @fecha:  05/11/2015
 * Descripcion :  Funcion encargada de almacenar el detalle del pedido
 */
PedidosClienteModel.prototype.insertarDetallePedido = function(pedido, producto, callback) {


    var sql = "INSERT INTO ventas_ordenes_pedidos_d (pedido_cliente_id, codigo_producto, porc_iva, numero_unidades, valor_unitario,fecha_registro,usuario_id) \
                 VALUES ( :1, :2, :3, :4, :5,NOW(), :6);";

    G.knex.raw(sql, {1: pedido.numero_pedido, 2: producto.codigo_producto, 3: producto.iva, 4: producto.cantidad_solicitada, 5: producto.precio_venta, 6: pedido.usuario_id}).
            then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {

        callback(err);
    });
};
/*
 * Autor : Camilo Orozco
 * Descripcion : Transaccion para la generaciÃ³n del pedido
 * +Modificacion 1: Se modifica la funcion reemplazando la funcion interna (__actualizar_estado_cotizacion)
 *                por la siguiente (__CambioEstadoCotizacionCreacionProducto)
 *                esto con el objetivo de aÃ±adirle un nuevo estado = 5 el cual consiste en indicar
 *                que la cotizacion ya tiene un pedido asignado
 * @fecha: 04/11/2015
 * +Modificacion 2: Se migra a KNEX.js
 * @fecha: 04/12/2015 2:43 pm
 */
PedidosClienteModel.prototype.generar_pedido_cliente = function(cotizacion, callback)
{

    var pedido;
    G.knex.transaction(function(transaccion) {

        G.Q.nfcall(__insertar_encabezado_pedido_cliente, cotizacion, transaccion).then(function(resultado) {

            pedido = {numero_pedido: (resultado.rows.length > 0) ? resultado.rows[0].numero_pedido : 0, estado: 0};

            return G.Q.nfcall(__generar_detalle_pedido_cliente, cotizacion, pedido, transaccion);

        }).then(function() {

            return G.Q.nfcall(__CambioEstadoCotizacionCreacionProducto, cotizacion, transaccion);

        }).then(function() {

            transaccion.commit();

        }).fail(function(err) {

            transaccion.rollback(err);

        }).done();

    }).then(function() {

        callback(false, pedido);

    }). catch (function(err) {

        callback(err);
    }).done();

};




/*
 * Author : Eduar Garcia
 * Descripcion :  Cambia el estado de una cotizacion
 */
PedidosClienteModel.prototype.modificarEstadoCotizacion = function(cotizacion, callback) {
    __actualizar_estado_cotizacion(cotizacion, function(err, rows, result) {

        callback(err, rows);

    });
};



/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Modificar Detalle Pedido
 * Modificacion: Se migra a KNEX.js
 * @fecha: 05/12/2015 9:34 pm
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente __productosPedidos
 *  --PedidosCliente.prototype.modificarDetallePedido
 */
PedidosClienteModel.prototype.modificar_detalle_pedido = function(pedido, producto, callback) {
    var that = this;

    var cantidadDespachar;
    var campoDespacho = "";
    if (pedido.estadoSolicitud === '8') {
        cantidadDespachar = producto.cantidadPendienteDespachar;
        campoDespacho = "cantidad_despachada = '0' , numero_unidades = :2,";


    } else {
        cantidadDespachar = producto.cantidad_solicitada;
        campoDespacho = "numero_unidades = :2, ";
    }

    var sql = "UPDATE ventas_ordenes_pedidos_d SET porc_iva= :1," + campoDespacho + " valor_unitario = :3, usuario_id = :4, fecha_registro = :5 \
               WHERE  pedido_cliente_id = :6 AND codigo_producto = :7\
                returning( select numero_unidades  from ventas_ordenes_pedidos_d where\
                            pedido_cliente_id = :6 and codigo_producto = :7 \
                ) as cantidad_solicitada_anterior";
    var parametros = {
        1: producto.iva, 2: cantidadDespachar, 3: producto.precio_venta,
        4: pedido.usuario_id, 5: 'NOW()', 6: pedido.numero_pedido, 7: producto.codigo_producto
    };



    G.knex.raw(sql, parametros
            ).then(function(resultado) {

        var obj = {
            usuarioId: pedido.usuario_id, accion: '0', tipoPedido: '0', numeroPedido: pedido.numero_pedido,
            empresaId: pedido.empresa_id, codigoProducto: producto.codigo_producto,
            cantidadSolicitada: resultado.rows[0]['cantidad_solicitada_anterior'], cantidadActual: cantidadDespachar
        };

        return G.Q.ninvoke(that.m_pedidos_logs, "guardarLog", obj);
        //callback(false, resultado.rows);
    }).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {

        callback(err);
    }).done();

};


/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Eliminar producto del pedido
 * Modificacion: Se migra a KNEX.js
 * @fecha: 05/12/2015 9:18 pm
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.eliminarProductoPedido
 */
PedidosClienteModel.prototype.eliminar_producto_pedido = function(pedido, producto, callback)
{
    var that = this;
    G.knex('ventas_ordenes_pedidos_d')
            .where('pedido_cliente_id', pedido.numero_pedido)
            .andWhere('codigo_producto', producto.codigo_producto)
            .del().then(function(resultado) {
        var obj = {
            usuarioId: pedido.usuario_id, accion: '1', tipoPedido: '0', numeroPedido: pedido.numero_pedido,
            empresaId: pedido.empresa_id, codigoProducto: producto.codigo_producto,
            cantidadSolicitada: '0', cantidadActual: '0'
        };

        return G.Q.ninvoke(that.m_pedidos_logs, "guardarLog", obj);

    }).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {

        callback(error);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el total de productos de un pedido
 * @fecha: 18/03/2016
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.eliminarProductoPedido
 */
PedidosClienteModel.prototype.consultarTotalProductosPedido = function(pedido, callback) {

    var obj = {
        pedido_cliente_id: pedido,
    };

    G.knex('ventas_ordenes_pedidos_d')
            .where(obj)
            .count('pedido_cliente_id as total')
            .then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        callback(error);
    });
};



/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el total de productos de un pedido
 * @fecha: 18/03/2016
 * @Funciones que hacen uso del model :
 *  --PedidosCliente.prototype.eliminarProductoPedido
 */
PedidosClienteModel.prototype.consultarTotalProductosCotizacion = function(pedido, callback) {

    var obj = {
        pedido_cliente_id_tmp: pedido,
    };

    G.knex('ventas_ordenes_pedidos_d_tmp')
            .where(obj)
            .count('pedido_cliente_id_tmp as total')
            .then(function(rows) {
        callback(false, rows);
    }). catch (function(error) {
        callback(error);
    });
};

/*************************************************
 *
 *  FUNCIONES PRIVADAS
 *
 *************************************************/

/*
 * Autor : Camilo Orozco
 * Descripcion : SQL para ingresar encabezado pedido cliente
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 2:43 pm
 */
function __insertar_encabezado_pedido_cliente(cotizacion, transaccion, callback) {


    var sql = " INSERT INTO ventas_ordenes_pedidos(\
                    empresa_id,\
                    centro_destino,\
                    bodega_destino,\
                    tipo_id_tercero,\
                    tercero_id,\
                    tipo_id_vendedor,\
                    vendedor_id,\
                    observacion,    \
                    observacion_cartera,\
                    sw_aprobado_cartera,\
                    estado,\
                    estado_pedido,\
                    tipo_producto,\
                    usuario_id,\
                    fecha_registro,\
                    pedido_cliente_id_tmp,\
                    valor_total_cotizacion\
                    ) (\
                  select\
                  a.empresa_id,\
                  a.centro_destino,\
                  a.bodega_destino,\
                  a.tipo_id_tercero,\
                  a.tercero_id,\
                  a.tipo_id_vendedor,\
                  a.vendedor_id,\
                  a.observaciones,\
                  a.observacion_cartera,\
                  a.sw_aprobado_cartera,\
                  '1' as estado,\
                  '0' as estado_pedido,\
                  a.tipo_producto,\
                  a.usuario_id,\
                  now() as fecha_registro,\
                  :1 as pedido_cliente_id_tmp,\
                  :2 as valor_total_cotizacion\
                  from ventas_ordenes_pedidos_tmp a\
                  where a.pedido_cliente_id_tmp = :1\
                ) returning pedido_cliente_id as numero_pedido ";


    var query = G.knex.raw(sql, {1: cotizacion.numero_cotizacion, 2: cotizacion.total});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        callback(err);
    });


}
;

/*
 * Autor : Camilo Orozco
 * Descripcion : SQL para generar el detalle del pedido cliente, a partir de una cotizacion
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 2:43 pm
 */
function __generar_detalle_pedido_cliente(cotizacion, pedido, transaccion, callback) {

    var sql = " INSERT INTO ventas_ordenes_pedidos_d(\
                    pedido_cliente_id, \
                    codigo_producto, \
                    porc_iva, \
                    numero_unidades, \
                    valor_unitario, \
                    usuario_id,    \
                    fecha_registro\
                )(\
                    SELECT \
                    :1 as numero_pedido, \
                    codigo_producto, \
                    porc_iva, \
                    numero_unidades, \
                    valor_unitario, \
                    usuario_id,    \
                    NOW() as fecha_registro\
                    FROM ventas_ordenes_pedidos_d_tmp \
                    WHERE pedido_cliente_id_tmp = :2\
                ) ;";


    var query = G.knex.raw(sql, {1: pedido.numero_pedido, 2: cotizacion.numero_cotizacion});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {

        callback(false, resultado);
    }). catch (function(err) {

        callback(err);
    });

}
;

/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar estado de la cotizacion cuando se crea el pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.generar_pedido_cliente
 */
function __CambioEstadoCotizacionCreacionProducto(cotizacion, transaccion, callback)
{

    var sql = " UPDATE ventas_ordenes_pedidos_tmp SET sw_aprobado_cartera = '1', estado = '5' WHERE pedido_cliente_id_tmp = :1";

    var query = G.knex.raw(sql, {1: cotizacion.numero_cotizacion});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {

        callback(false, resultado);
    }). catch (function(err) {

        callback(err);
    });

}
;
/*
 * Autor : Camilo Orozco
 * Descripcion : SQL para actualizar estados de la cotizacion
 * Modificacion: Se migra a KNEX.js
 * @fecha: 04/12/2015 2:43 pm
 */
function __actualizar_estado_cotizacion(cotizacion, callback) {
    // Estados Cotizacion
    // 0 => Inactiva
    // 1 => Activo
    // 2 => Anulado
    // 3 => Aprobado Cartera
    G.knex('ventas_ordenes_pedidos_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numero_cotizacion)
            .update({
        estado: cotizacion.estado
    }).then(function(rows) {

        callback(false, rows);
    }). catch (function(error) {
        callback(error);

    });

}
;



PedidosClienteModel.$inject = ["m_productos", "m_pedidos_logs"];


module.exports = PedidosClienteModel;

