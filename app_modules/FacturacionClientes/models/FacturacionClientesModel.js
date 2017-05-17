var FacturacionClientesModel = function (m_e008) {
    this.m_e008 = m_e008;
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los tipos de terceros
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.listarTiposTerceros = function (callback) {

    G.knex.column('tipo_id_tercero as id', 'descripcion')
            .select()
            .from('tipo_id_terceros')
            .orderBy('tipo_id_tercero', 'asc')
            .then(function (resultado) {

                callback(false, resultado)
            }).catch(function (err) {
        console.log("err [listarTipoDocumento]:", err);
        callback({err:err, msj: "Error al consultar la lista de los tipos de terceros"});   
    });

};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los tipos de terceros
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.listarPrefijosFacturas = function (obj,callback) {

    G.knex.column([G.knex.raw('prefijo as id'),
                G.knex.raw('prefijo as descripcion'),
                "empresa_id",
                "numeracion",
                "documento_id"])
            .select()
            .from('documentos')
            .where(function () {
                this.andWhere("tipo_doc_general_id",'FV01')
                if(obj.estado ===0){
                    this.andWhere("empresa_id", obj.empresaId);
                }else{
                    this.andWhere("documento_id", obj.documentoId);
                }
            })
            /*.where("tipo_doc_general_id",'FV01')
            .andWhere("empresa_id", obj.empresaId)*/
            .then(function (resultado) {

                callback(false, resultado)
            }).catch(function (err) {
        console.log("err [listarPrefijosFacturas]:", err);
        callback({err:err, msj: "Error al consultar la lista de los prefijos"});   
    });

};

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.listarClientes = function (obj, callback) {

    var columnas = [G.knex.raw("DISTINCT a.tipo_id_tercero as tipo_id_tercero"),
        "a.tercero_id",
        "a.direccion",
        "a.telefono",
        "a.email",
        "a.nombre_tercero",
        "a.tipo_bloqueo_id",
        "f.departamento",
        "g.pais",
        "municipio"];

    var query = G.knex.select(columnas)
            .from('terceros as a')
            .innerJoin('terceros_clientes as b', function () {
                this.on("a.tipo_id_tercero", "b.tipo_id_tercero")
                        .on("a.tercero_id", "b.tercero_id")
            }).leftJoin('inv_tipos_bloqueos as c', function () {
        this.on("a.tipo_bloqueo_id", "c.tipo_bloqueo_id")

    }).join('inv_bodegas_movimiento_despachos_clientes as d', function () {
        this.on("a.tipo_id_tercero", "b.tipo_id_tercero")
                .on("a.tercero_id", "d.tercero_id")
    }).leftJoin('tipo_mpios as e', function () {
        this.on("a.tipo_pais_id", "e.tipo_pais_id")
                .on("a.tipo_dpto_id", "e.tipo_dpto_id")
                .on("a.tipo_mpio_id", "e.tipo_mpio_id")
    }).leftJoin('tipo_dptos as f', function () {
        this.on("e.tipo_pais_id", "f.tipo_pais_id")
                .on("e.tipo_dpto_id", "f.tipo_dpto_id")

    }).leftJoin('tipo_pais as g', function () {
        this.on("f.tipo_pais_id", "g.tipo_pais_id")
    }).groupBy("a.tipo_id_tercero",
            "a.tercero_id",
            "a.direccion",
            "a.telefono",
            "a.email",
            "a.nombre_tercero",
            "a.tipo_bloqueo_id",
            "c.descripcion",
            "g.pais",
            "f.departamento",
            "municipio")
            .orderBy("a.nombre_tercero")
            .where(function () {

                if ((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("a.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                }
                if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("a.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                }
            }).andWhere('b.empresa_id', obj.empresaId);

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarClientes]:", err);
       callback({err:err, msj: "Error al consultar la lista de los clientes"});   
    });

};

function __camposListaFacturasGeneradas() {

    var colSubQuery2 = [
        "a.empresa_id",
        "a.factura_fiscal",
        "a.prefijo",
        "a.documento_id",
        "i.descripcion",
        "i.texto1",
        "i.texto2",
        "i.texto3",
        "i.mensaje",
        "a.tipo_id_tercero",
        "a.tercero_id",
        "c.nombre_tercero",
        "c.direccion",
        "c.telefono",
        G.knex.raw("h.pais||'-'||g.departamento ||'-'||f.municipio as ubicacion"),
        "a.fecha_registro",
        //G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY-MM-DD 00:00:00') AS fecha_registro"),
        "a.usuario_id",
        "a.valor_total",
        "a.saldo",
        "a.observaciones",
        G.knex.raw("TO_CHAR(a.fecha_vencimiento_factura,'YYYY-MM-DD') AS fecha_vencimiento_factura"),
        "a.porcentaje_rtf",
        "a.porcentaje_ica",
        "a.porcentaje_reteiva",
        "e.razon_social",
        "e.tipo_id_tercero as tipo_id_empresa",
        "e.id",
        G.knex.raw("e.direccion as direccion_empresa"),
        G.knex.raw("e.telefonos as telefono_empresa"),
        "e.digito_verificacion",
        G.knex.raw("l.pais as pais_empresa"),
        G.knex.raw("k.departamento as departamento_empresa"),
        G.knex.raw("j.municipio as municipio_empresa"),
        G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY') as anio_factura"),
        "m.subtotal",
        "m.iva_total",
    ];

    return colSubQuery2;
}
;


function __consultaAgrupada(tabla1, estado, columna, query, filtro) {
 
    var consulta = G.knex.select(columna)
            .from(tabla1)
            .join('terceros as c', function () {
                this.on("a.tipo_id_tercero", "c.tipo_id_tercero")
                        .on("a.tercero_id", "c.tercero_id")
            }).join('system_usuarios as d', function () {
        this.on("a.usuario_id", "d.usuario_id")

    }).join('empresas as e', function () {
        this.on("a.empresa_id", "e.empresa_id")

    }).join('tipo_mpios as f', function () {
        this.on("c.tipo_pais_id", "f.tipo_pais_id")
                .on("c.tipo_dpto_id", "f.tipo_dpto_id")
                .on("c.tipo_mpio_id", "f.tipo_mpio_id")

    }).join('tipo_dptos as g', function () {
        this.on("f.tipo_pais_id", "g.tipo_pais_id")
                .on("f.tipo_dpto_id", "g.tipo_dpto_id")

    }).join('tipo_pais as h', function () {
        this.on("g.tipo_pais_id", "h.tipo_pais_id")

    }).join('tipo_mpios as j', function () {
        this.on("e.tipo_pais_id ", "j.tipo_pais_id")
                .on("e.tipo_dpto_id", "j.tipo_dpto_id")
                .on("e.tipo_mpio_id", "j.tipo_mpio_id")
    }).join('tipo_dptos as k', function () {
        this.on("j.tipo_pais_id", "k.tipo_pais_id")
                .on("j.tipo_dpto_id", "k.tipo_dpto_id")

    }).join('tipo_pais as l', function () {
        this.on("k.tipo_pais_id", "l.tipo_pais_id")

    }).join(query, function () {

        this.on("m.empresa_id", "a.empresa_id")
                .on("m.prefijo", "a.prefijo")
                .on("m.factura_fiscal", "a.factura_fiscal")

    }).join('documentos as i', function () {
        this.on("a.empresa_id", "i.empresa_id")
                .on("a.documento_id", "i.documento_id")

    }).where(function () {

        this.andWhere('a.empresa_id', filtro.empresaId)
            .andWhere('c.nombre_tercero', G.constants.db().LIKE, "%" + filtro.nombreTercero + "%")
            .andWhere('a.tercero_id', G.constants.db().LIKE, "%" + filtro.terceroId + "%");//
        if (filtro.numero !== "") {
            this.andWhere('a.factura_fiscal', filtro.numero);
        }
        if (filtro.prefijo !== "") {
            this.andWhere('a.prefijo', filtro.prefijo);
        }
        if (filtro.tipoIdTercero !== "") {
            this.andWhere('a.tipo_id_tercero', filtro.tipoIdTercero);
        }
        if (filtro.pedidoClienteId !== "") {
            this.andWhere('a.pedido_cliente_id', filtro.pedidoClienteId);
        }

    });


    if (estado === 0) {

        consulta.join('vnts_vendedores as b', function () {
            this.on("a.tipo_id_vendedor", "b.tipo_id_vendedor")
                    .on("a.vendedor_id", "b.vendedor_id")
        });

        consulta.join('ventas_ordenes_pedidos as pedi', function () {
            this.on("pedi.empresa_id", "a.empresa_id")
                    .on("pedi.pedido_cliente_id", "a.pedido_cliente_id")
                    .on("pedi.tercero_id", "a.tercero_id")
                    .on("pedi.tipo_id_tercero", "a.tipo_id_tercero")

        }).as("a");

    }
    return consulta;

}
;

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.listarFacturasGeneradas = function (filtro, callback) {

    var colQuery = [G.knex.raw("a.*"),
        "b.estado",
        G.knex.raw("case when b.estado=0 then 'Sincronizado' else 'NO sincronizado' end as descripcion_estado"),
        "b.mensaje"];

    var colSubQuery2 = __camposListaFacturasGeneradas();
    colSubQuery2.push(G.knex.raw("'0' as factura_agrupada"));
    colSubQuery2.push("a.tipo_id_vendedor");
    colSubQuery2.push("a.vendedor_id");
    colSubQuery2.push("b.nombre");
    colSubQuery2.push("pedi.observacion");
    colSubQuery2.push("a.pedido_cliente_id");

    var colSubQuery2B = __camposListaFacturasGeneradas();
    colSubQuery2B.push(G.knex.raw("'1' as factura_agrupada"));
    colSubQuery2B.push(G.knex.raw("(SELECT bb.tipo_id_vendedor\
                                        FROM inv_facturas_agrupadas_despacho_d bb \
                                        WHERE  bb.empresa_id = a.empresa_id and bb.prefijo = a.prefijo \
                                        AND bb.factura_fiscal = a.factura_fiscal limit 1 ) as tipo_id_vendedor"));
    colSubQuery2B.push(G.knex.raw("(SELECT cc.vendedor_id \
                                        FROM inv_facturas_agrupadas_despacho_d cc \
                                        WHERE cc.empresa_id = a.empresa_id \
                                        AND cc.prefijo = a.prefijo \n\
                                        AND cc.factura_fiscal = a.factura_fiscal limit 1 ) as vendedor_id"));
    colSubQuery2B.push(G.knex.raw("(SELECT ee.nombre\
                                        FROM inv_facturas_agrupadas_despacho_d dd\
                                        INNER JOIN vnts_vendedores ee on dd.tipo_id_vendedor = ee.tipo_id_vendedor and dd.vendedor_id = ee.vendedor_id\
                                        WHERE dd.empresa_id = a.empresa_id and dd.prefijo = a.prefijo and dd.factura_fiscal = a.factura_fiscal limit 1 ) as nombre"));
    colSubQuery2B.push(G.knex.raw("'' as observacion"));
    colSubQuery2B.push(G.knex.raw("0 as pedido_cliente_id"));

    var colSubQuery1 = ["a.empresa_id",
        "a.prefijo",
        "a.factura_fiscal",
        G.knex.raw("SUM((valor_unitario*cantidad)) as subtotal"),
        G.knex.raw("SUM(((valor_unitario*cantidad)*(porc_iva/100))) as iva_total")
    ];



    var subQuery1 = G.knex.column(colSubQuery1).select().from("inv_facturas_despacho_d as a").groupBy("a.empresa_id", "a.prefijo", "a.factura_fiscal").as("m");

    var subQuery1B = G.knex.column(colSubQuery1).select().from("inv_facturas_agrupadas_despacho_d as a").groupBy("a.empresa_id", "a.prefijo", "a.factura_fiscal").as("m");


    var subQuery2 = __consultaAgrupada("inv_facturas_despacho as a",
            0,
            colSubQuery2,
            subQuery1,
            filtro)
            .union(__consultaAgrupada("inv_facturas_agrupadas_despacho as a",
                    1,
                    colSubQuery2B,
                    subQuery1B,
                    filtro));

    var query = G.knex.column(colQuery)
            .from(subQuery2)
            .leftJoin("logs_facturacion_clientes_ws_fi as b ", function () {
                this.on("a.prefijo", "b.prefijo")
                        .on("a.factura_fiscal", "b.factura_fiscal")
                        .on(G.knex.raw("b.prefijo_nota IS NULL"))
            }).orderBy("fecha_registro", "desc");

    query.limit(G.settings.limit).
            offset((filtro.paginaActual - 1) * G.settings.limit)
    query.then(function (resultado) {
       //console.log("resultado [query.toSQL()]:  ", query.toSQL());
        callback(false, resultado)
    }).catch(function (err) {
        //console.log("err [listarFacturasGeneradas] ", err);
        callback({err:err, msj: "Error al consultar la lista de las facturas generadas"});   
    });
};



/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los tipos de terceros
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.consultarDocumentosPedidos = function(obj,callback) {

    var query = G.knex.column([G.knex.raw(" x.pedido_cliente_id"),  "x.numero", "x.prefijo", "x.empresa_id"])
           .select().from("inv_bodegas_movimiento_despachos_clientes as x")
           .where("x.factura_gener",'0')
           .andWhere("x.empresa_id",obj.empresaId)
           .andWhere("x.pedido_cliente_id",obj.pedidoClienteId)
           .as("b");                        
   
        query.then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [consultarDocumentosPedidos]:", err);
        callback({err:err, msj: "Error al consultar la lista de documentos"});   
    });
                  
};




/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los pedidos para generar la factura
 *              correspondiente
 * @fecha 2017-10-05
 */
FacturacionClientesModel.prototype.listarPedidosClientes = function (obj, callback) {
   
   var columnQuery = [
        "a.tipo_id_tercero",
	"a.tercero_id",
	"c.nombre_tercero",
	"c.direccion",
	"a.pedido_cliente_id",
	"a.fecha_registro",
	"a.tipo_id_vendedor",
	"a.vendedor_id",
	"a.empresa_id",
	"d.nombre",
	"a.observacion",
        /*"b.prefijo",
        G.knex.raw("b.numero as factura_fiscal"),*/
        G.knex.raw("true as seleccionado")
   ];
   
   
   
    var subQuery1 = G.knex.column([G.knex.raw("DISTINCT x.pedido_cliente_id")/*,  "x.numero", "x.prefijo"*/ ])
           .select().from("inv_bodegas_movimiento_despachos_clientes as x")
           .where("x.factura_gener",'0')
           .andWhere("x.empresa_id",obj.empresaId).as("b"); //obj.empresaId
    
    var query = G.knex.select(columnQuery)
            .from("ventas_ordenes_pedidos as a")
            .join(subQuery1, function () {

                this.on("a.pedido_cliente_id","b.pedido_cliente_id")

            }).join("terceros as c", function(){      
                this.on("a.tipo_id_tercero","c.tipo_id_tercero")
                    .on("a.tercero_id","c.tercero_id")
            }).join("vnts_vendedores as d", function(){
                this.on("a.tipo_id_vendedor","d.tipo_id_vendedor")
                    .on("a.vendedor_id","d.vendedor_id")
            }).where(function () {

                this.andWhere('a.tipo_id_tercero', obj.tipoIdTercero)//obj.tipoIdTercero
                    .andWhere('a.tercero_id',obj.terceroId);//obj.terceroId
                if (obj.pedidoClienteId !== "") {
                    this.andWhere('a.pedido_cliente_id', obj.pedidoClienteId);
                }
                
            });
    
    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function (resultado) {
       
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarPedidosClientes] ", err);
        callback({err:err, msj: "Error al consultar la lista de los pedidos"});   
    });
};




FacturacionClientesModel.prototype.consultarTerceroContrato = function (obj, callback) {
   
   var columnQuery = [
        "a.tipo_id_tercero",
        "a.tercero_id",
        "e.nombre_tercero",
        "e.direccion",
        "e.telefono",
        "a.observacion",
        "a.tipo_cliente",
        "a.cuenta_contable",
        G.knex.raw("CASE WHEN a.sw_rtf = '1' THEN a.porcentaje_rtf ELSE 0 END as porcentaje_rtf"),
        G.knex.raw("CASE  WHEN a.sw_ica = '1' THEN a.porcentaje_ica ELSE 0 END as porcentaje_ica"),
        G.knex.raw("CASE WHEN a.sw_reteiva = '1' THEN a.porcentaje_reteiva ELSE 0 END as porcentaje_reteiva"),
        G.knex.raw("CASE WHEN a.sw_cree = '1' THEN a.porcentaje_cree ELSE 0 END as porcentaje_cree"),
        G.knex.raw("CASE WHEN c.condiciones_cliente IS NOT NULL THEN c.condiciones_cliente WHEN d.condiciones_cliente IS NOT NULL THEN d.condiciones_cliente\
        ELSE (SELECT condiciones_cliente FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1' ) END as condiciones_cliente"),
        G.knex.raw("CASE WHEN c.contrato_cliente_id IS NOT NULL THEN c.contrato_cliente_id WHEN d.contrato_cliente_id IS NOT NULL THEN d.contrato_cliente_id\
        ELSE (SELECT contrato_cliente_id FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1')  END as contrato"),        
        G.knex.raw("CASE WHEN c.contrato_cliente_id IS NOT NULL THEN 'Contrato: <b>TERCERO - CLIENTE</b>' WHEN d.contrato_cliente_id IS NOT NULL\
        THEN 'Contrato: UNIDAD DE NEGOCIO: <b>'||b.descripcion||'</b>' ELSE 'Contrato: <b>GENERICO</b>' END as tipo_contrato"),
        G.knex.raw("CASE WHEN c.vendedor_id IS NOT NULL THEN c.tipo_id_vendedor||'@'||c.vendedor_id WHEN d.vendedor_id IS NOT NULL\
        THEN d.tipo_id_vendedor||'@'||d.vendedor_id END as vendedor_id"),        
        "c.facturar_iva"
   ];
    
   var query = G.knex.select(columnQuery)
            .from("terceros_clientes as a")
              .leftJoin("unidades_negocio as b", function () {
                this.on("a.codigo_unidad_negocio","b.codigo_unidad_negocio")
            }).leftJoin("vnts_contratos_clientes as c", function () {
                this.on("a.tipo_id_tercero","c.tipo_id_tercero")
                    .on("a.tercero_id","c.tercero_id")
                    .on(G.knex.raw("a.empresa_id = '"+obj.empresaId+"' "))// + obj.empresaId
                    .on(G.knex.raw("c.estado = '1'"))
            }).leftJoin("vnts_contratos_clientes as d", function () {
                this.on("a.codigo_unidad_negocio","d.codigo_unidad_negocio")
                    .on(G.knex.raw("d.empresa_id = '"+obj.empresaId+"' "))//+ obj.empresaId
                    .on(G.knex.raw("d.estado = '1'"))
            }).join("terceros as e", function(){
                this.on("a.tipo_id_tercero","e.tipo_id_tercero")
                    .on(G.knex.raw("a.empresa_id = '"+obj.empresaId+"' "))//
                    .on("a.tercero_id","e.tercero_id")
            }).where(function(){
                this.andWhere("a.tipo_id_tercero", obj.tipoIdTercero)
                    .andWhere("a.tercero_id", obj.terceroId)
            });
   
   
   query.then(function(resultado) {
      
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarTerceroContrato] ", err);
        callback({err:err, msj: "Error al consultar el contrato de terceros"});   
    });
   
};


/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los tipos de terceros
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.consultarParametrosRetencion = function (obj,callback) {

    G.knex.select('*')
        .from('vnts_bases_retenciones')
        .where(function(){
            this.andWhere("estado",'1')
                .andWhere(G.knex.raw("anio = TO_CHAR(NOW(),'YYYY')"))
                .andWhere("empresa_id", obj.empresaId)
        })
        .then(function (resultado) {

            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [consultarParametrosRetencion]:", err);
        callback({err:err, msj: "Error al consultar los parametros de retencion"});   
    });

};

 
/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de consultar la factura agrupada
 * @controller FacturacionClientes.prototype.generarFacturaAgrupada
 */
FacturacionClientesModel.prototype.consultarFacturaAgrupada = function (obj,callback) {

    G.knex.select('*')
        .from('inv_facturas_agrupadas_despacho')
        .where(function(){
            this.andWhere("empresa_id",obj.empresa_id)
                .andWhere("prefijo", obj.id)
                .andWhere("factura_fiscal", obj.numeracion)
        })
        .then(function (resultado) {

            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [consultarFacturaAgrupada]:", err);
        callback({err:err, msj: "Error al consultar la factura agrupada"});   
    });

};

/**
 * +Descripcion Funcion encarhada de consultar la ip autorizada para generar
 *              facturas
 * @fecha 2017-05-08
 * @author Cristian Ardila
 */
FacturacionClientesModel.prototype.consultarDireccionIp = function(obj, callback){
 
    G.knex.select('*')
    .from('pc_crea_facturacion')
    .where("ip", obj.direccionIp)
    .then(function (resultado) {
         callback(false, resultado)
    }).catch(function (err) {
        console.log("err [consultarDireccionIp]:", err);
    callback({err:err, msj: "Error al consultar la direccion Ip"});   
    });


};

/**
 * +Descripcion Metodo encargado de registrar la direccion ip en el 
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.insertarPcFactura = function(obj,transaccion, callback){
   
    var parametros = {ip: obj.parametros.parametros.direccion_ip,
            prefijo: obj.parametros.documento_facturacion[0].id,
            factura_fiscal: obj.parametros.documento_facturacion[0].numeracion,
            sw_tipo_factura : obj.swTipoFactura,
            fecha_registro: G.knex.raw('now()'),
            empresa_id: obj.parametros.documento_facturacion[0].empresa_id
            };
        
    var query = G.knex('pc_factura_clientes').insert(parametros);
    
    if(transaccion)
        query.transacting(transaccion);     
        query.then(function(resultado){   
            console.log("resultado [insertarPcFactura]", resultado);
            callback(false, resultado);
        }).catch(function(err){
            console.log("err (/catch) [insertarPcFactura]: ", err);     
            callback({err:err, msj: "Error al guardar la factura agrupada]"});   
        });
};
/**
 * +Descripcion Metodo encargado de registrar la cabecera de la factura
 *              agrupada
 * @author Cristian Manuel Ardila Troches
 * @fecha  2017-05-08
 */
FacturacionClientesModel.prototype.insertarFacturaAgrupada = function(obj,transaccion, callback){
      
    var parametros = {empresa_id: obj.parametros.documento_facturacion[0].empresa_id,
            tipo_id_tercero: obj.parametros.consultar_tercero_contrato[0].tipo_id_tercero,
            tercero_id: obj.parametros.consultar_tercero_contrato[0].tercero_id,
            factura_fiscal: obj.parametros.documento_facturacion[0].numeracion,
            prefijo: obj.parametros.documento_facturacion[0].id,
            documento_id: obj.parametros.documento_facturacion[0].documento_id,
            usuario_id: obj.usuario,
            observaciones: obj.parametros.consultar_tercero_contrato[0].condiciones_cliente,
            porcentaje_rtf: obj.porcentaje_rtf,
            porcentaje_ica: obj.porcentaje_ica,
            porcentaje_reteiva: obj.porcentaje_reteiva,
            porcentaje_cree: obj.porcentaje_cree,
            tipo_pago_id: obj.tipoPago};
         
    var query = G.knex('inv_facturas_agrupadas_despacho').insert(parametros);     
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){
            console.log("resultado [insertarFacturaAgrupada]", resultado);
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [insertarFacturaAgrupada]: ", err);     
            callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    });
};

/**
 * +Descripcion Metodo encargado de registrar la cabecera de la factura
 *              agrupada
 * @author Cristian Manuel Ardila Troches
 * @fecha  2017-05-08
 */
FacturacionClientesModel.prototype.insertarFacturaIndividual = function(obj,transaccion, callback){
    
  
   var parametros = {empresa_id: obj.parametros.documento_facturacion[0].empresa_id,
            tipo_id_tercero: obj.parametros.consultar_tercero_contrato[0].tipo_id_tercero,
            tercero_id: obj.parametros.consultar_tercero_contrato[0].tercero_id,
            factura_fiscal: obj.parametros.documento_facturacion[0].numeracion,
            prefijo: obj.parametros.documento_facturacion[0].id,
            documento_id: obj.parametros.documento_facturacion[0].documento_id,
            usuario_id: obj.usuario,
            tipo_id_vendedor:obj.parametros.parametros.pedido.pedidos[0].vendedor[0].tipo_id_tercero, 
            vendedor_id: obj.parametros.parametros.pedido.pedidos[0].vendedor[0].id, 
            pedido_cliente_id: obj.parametros.parametros.pedido.pedidos[0].numero_cotizacion, 
            observaciones: obj.parametros.consultar_tercero_contrato[0].condiciones_cliente,
            porcentaje_rtf: obj.porcentaje_rtf,
            porcentaje_ica: obj.porcentaje_ica,
            porcentaje_reteiva: obj.porcentaje_reteiva,
            porcentaje_cree: obj.porcentaje_cree,
            tipo_pago_id: obj.tipoPago};
    
     //console.log("parametros [insertarFacturaIndividual]: ", parametros)
    
    var query = G.knex('inv_facturas_despacho').insert(parametros);     
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){
            //console.log("resultado [insertarFacturaIndividual]", resultado);
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [insertarFacturaIndividual]: ", err);     
            callback({err:err, msj: "Error al guardar la factura individual]"});   
    });
};

/**
 * +Descripcion Metodo encargado de insertar el detalle de la factura 
 *              individual
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
function __insertarFacturaIndividualDetalle(obj,transaccion, callback){
      
    var parametros = {
            item_id: G.knex.raw('DEFAULT'),
            prefijo: obj.prefijo,
            factura_fiscal: obj.numeracion,
            observacion: '', 
            codigo_producto: obj.codigo_producto,
            cantidad: parseInt(obj.cantidad),
            fecha_vencimiento: obj.fecha_vencimiento,
            lote: obj.lote,
            valor_unitario: parseInt(obj.valor_unitario),
            empresa_id: obj.empresa_id,
            cantidad_devuelta:parseInt(0),
            porc_iva: obj.porcentaje_gravamen
        };
      
   
    
    var query = G.knex('inv_facturas_despacho_d').insert(parametros);     
       
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){
            console.log("resultado [insertarFacturaIndividualDetalle]", resultado);
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [insertarFacturaIndividualDetalle]: ", err);     
            callback({err:err, msj: "Error al guardar la factura individual]"});   
    }); 
};

/**
 * +Descripcion Metodo encargado de insertar el detalle de las facturas 
 *              que se agruparan
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.insertarFacturaAgrupadaDetalle = function(obj,transaccion, callback){
       
     var parametros = {
            item_id: G.knex.raw('DEFAULT'),
            tipo_id_vendedor: obj.tipo_id_vendedor,
            vendedor_id: obj.vendedor_id,
            pedido_cliente_id: obj.pedido_cliente_id, 
            empresa_id: obj.empresa_id,
            factura_fiscal: obj.factura_fiscal,
            prefijo: obj.prefijo,
            codigo_producto: obj.codigo_producto,
            cantidad: parseInt(obj.cantidad),
            valor_unitario: obj.valor_unitario,
            lote:obj.lote,
            fecha_vencimiento:obj.fecha_vencimiento,
            porc_iva: obj.porc_iva
        }; 
       
    var query = G.knex('inv_facturas_agrupadas_despacho_d').insert(parametros);     
     
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){
            console.log("resultado [__insertarFacturaAgrupadaDetalle]", resultado);
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [insertarFacturaAgrupadaDetalle]: ", err);     
            callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    }); 
};


/**
 * +Descripcion Metodo encargado de actualizar la numeracion del documento
 * @author Cristian Ardila
 * @fecha 2017-09-05
 */
FacturacionClientesModel.prototype.actualizarNumeracion = function(obj,transaccion, callback){
    var parametros = {empresa_id:obj.parametros.documento_facturacion[0].empresa_id,
                    documento_id:obj.parametros.documento_facturacion[0].documento_id,
                    tipo_doc_general_id: 'FV01'
            };
    var query = G.knex('documentos').where(parametros).increment('numeracion', '1' );         
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){    
            console.log("resultado [actualizarNumeracion]:", resultado);
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [actualizarNumeracion]: ", err);       
        callback({err:err, msj: "Error al actualizar la numeracion del documento"});   
    });  
};

/**
 * +Descripcion Funcion encargada de actualizar en la tabla donde se almacenan
 *	        los pedidos el campo estado_factura_fiscal en 1 para identificar
 *		que el pedido ya ha sido facturado
 * @author Cristian Ardila
 * @fecha 2017-09-05
 */
FacturacionClientesModel.prototype.actualizarEstadoFacturaPedido = function(obj,transaccion, callback){
    
    var parametros = { 
            pedido_cliente_id: obj.pedido_cliente_id, 
            tipo_id_tercero: obj.tipo_id_tercero,
            tercero_id: obj.tercero_id,
            tipo_id_vendedor:obj.tipo_id_vendedor, 
            vendedor_id: obj.vendedor_id
    };
    
    var query = G.knex("ventas_ordenes_pedidos")
                .where(parametros)            
                .update({estado_factura_fiscal: '1'});
    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){        
            console.log("resultado [actualizarEstadoFacturaPedido]: ", resultado); 
            callback(false, resultado);
    }).catch(function(err){   
            console.log("err (/catch) [actualizarEstadoFacturaPedido]: ", err);        
            callback({err:err, msj: "Error al actualizar el estado de factura del pedido"});
    });    
};

/**
 * +Descripcion Metodo encargado de generar las facturas agrupadas 
 *              mediante la transaccion la cual ejecuta varios querys
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.transaccionGenerarFacturasAgrupadas = function(obj, callback)
{   
    console.log("***********FacturacionClientesModel.prototype.transaccionGenerarFacturasAgrupadas*************************");
    console.log("***********FacturacionClientesModel.prototype.transaccionGenerarFacturasAgrupadas*************************");
    console.log("***********FacturacionClientesModel.prototype.transaccionGenerarFacturasAgrupadas*************************");
    
    var that = this;
    var def = G.Q.defer();
    var porcentajeRtf = '0';
    var porcentajeIca = '0';
    var porcentajeReteiva = '0';
    var porcentajeCree = obj.consultar_tercero_contrato[0].porcentaje_cree;
    var parametrosInsertaFacturaAgrupadaDetalle = [];
    var parametrosFacturasAgrupadas;
    var parametrosActualizarEstadoFactura = [];
    
    if (obj.consultar_parametros_retencion.sw_rtf === '1' || obj.consultar_parametros_retencion.sw_rtf === '3')
        porcentajeRtf = obj.consultar_tercero_contrato[0].porcentaje_rtf;
    if (obj.consultar_parametros_retencion.sw_ica === '1' || obj.consultar_parametros_retencion.sw_ica === '3')
        porcentajeIca = obj.consultar_tercero_contrato[0].porcentaje_ica;
    if (obj.consultar_parametros_retencion.sw_reteiva === '1' || obj.consultar_parametros_retencion.sw_reteiva === '3')
        porcentajeReteiva = obj.consultar_tercero_contrato[0].porcentaje_reteiva;
        
    G.knex.transaction(function(transaccion) {  
        
        G.Q.ninvoke(that,'insertarFacturaAgrupada',
        {parametros:obj,
         porcentaje_rtf:porcentajeRtf,
         porcentaje_ica: porcentajeIca,
         porcentaje_reteiva: porcentajeReteiva,
         porcentaje_cree: porcentajeCree,
         usuario: obj.parametros.usuario,
         tipoPago: obj.parametros.tipoPago
         
        },transaccion).then(function(resultado){           
            
            return G.Q.ninvoke(that,'insertarPcFactura',{parametros:obj,swTipoFactura: '1'}, transaccion);    
            
        }).then(function(){
            
            return G.Q.nfcall(__detallePedidosClientes,that,0, obj.parametros.pedidos,transaccion);
            
        }).then(function(){ 
            
           
            obj.documento_facturacion.forEach(function(documento){                
                
                datosAdicionalesAgrupados.forEach(function(rowDatosAdicionalesAgrupados){                    
                   
                    rowDatosAdicionalesAgrupados.forEach(function(row){
                     
                        row.datos_adicionales.forEach(function(rowDatosAdicionales){
                         
                            row.detalle.forEach(function(rowDetalle){
                               
                                if(obj.consultar_tercero_contrato[0].facturar_iva === '0'){
                                    rowDetalle.porcentaje_gravamen = 0;
                                }
                                   
                                parametrosFacturasAgrupadas = {
                                    tipo_id_tercero: obj.parametros.tipoIdTercero,
                                    tercero_id: obj.parametros.terceroId,
                                    tipo_id_vendedor: row.vendedor.tipo_id_tercero,
                                    vendedor_id: row.vendedor.id,
                                    pedido_cliente_id : rowDatosAdicionales.numero_pedido,
                                    empresa_id:documento.empresa_id, 
                                    factura_fiscal:documento.numeracion,
                                    prefijo: documento.id,
                                    codigo_producto: rowDetalle.codigo_producto,
                                    cantidad: parseInt(rowDetalle.cantidad),
                                    valor_unitario: rowDetalle.valor_unitario,
                                    lote:rowDetalle.lote,
                                    fecha_vencimiento: rowDetalle.fecha_vencimiento,
                                    porcentaje_gravamen: rowDetalle.porcentaje_gravamen
                                };                                                                
                                parametrosInsertaFacturaAgrupadaDetalle.push(parametrosFacturasAgrupadas);                            
                            });
                        });                      
                    });                   
                    parametrosActualizarEstadoFactura.push(parametrosFacturasAgrupadas);
                });                           
            }); 
                                      
        }).then(function(){
            //console.log("*******parametrosInsertaFacturaAgrupadaDetalle  ", parametrosInsertaFacturaAgrupadaDetalle);
            return G.Q.nfcall(__insertarFacturaAgrupadaDetalle,that,0,parametrosInsertaFacturaAgrupadaDetalle,transaccion);
           
        }).then(function(){
            
            return G.Q.ninvoke(that,'actualizarNumeracion',{parametros:obj}, transaccion);
            
        }).then(function(){
 
            return G.Q.nfcall(__actualizarEstadoFacturaPedido,that,0,parametrosActualizarEstadoFactura, transaccion);
            
        }).then(function(){
                                               
           console.log("AQUI VA OK OKo OK [consultaCompleta]: ");
           //transaccion.commit(); 
        }).fail(function(err){
                console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
                transaccion.rollback(err);
        }).done();

    }).then(function(){
       callback(false);
    }).catch(function(err){      
       callback(err.msj);
    }).done(); 
    
};



function __actualizarEstadoFacturaPedido(that,index,datos,transaccion, callback){
    console.log("*****parametrosActualizarEstadoFactura************");
    
    var dato = datos[index];
    if(!dato){
        
        callback(false);
        return;
    }
    
    index++;
    
    //console.log("datos [parametrosActualizarEstadoFactura]:: ", dato);
    
    G.Q.ninvoke(that,'actualizarEstadoFacturaPedido',dato,transaccion).then(function(resultado){
        
        //console.log("datos [codigo_producto]:: ", resultado);
        
    }).fail(function(err){
        console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
        transaccion.rollback(err);
    }).done();
    
     setTimeout(function() {
         
            __actualizarEstadoFacturaPedido(that,index,datos,transaccion, callback)
    
    }, 300);
    
}

/**
 * +Descripcion Metodo encargado de reccorrer el arreglo de los parametros que
 *              registrara el detalle de las facturas agrupadas
 * @fecha 2017-05-17
 */
function __insertarFacturaAgrupadaDetalle(that,index,datos,transaccion, callback){
    
    var dato = datos[index];
    if(!dato){
        
        callback(false);
        return;
    }
    
    index++;
    
    G.Q.ninvoke(that,'insertarFacturaAgrupadaDetalle',dato,transaccion).then(function(resultado){
        
        //console.log("datos [codigo_producto]:: ", resultado);
        
    }).fail(function(err){
        console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
        transaccion.rollback(err);
    }).done();
    
     setTimeout(function() {
         
            __insertarFacturaAgrupadaDetalle(that,index,datos,transaccion, callback)
    
    }, 300);
    
}
/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de actualizar el movimiento de despacho
 *              de  los clientes
 * @fecha 2017-09-05
 */
function __actualizarDespacho(obj,transaccion,callback) {
    
    console.log("********__actualizarDespacho***************");
    console.log("********__actualizarDespacho***************");
    console.log("********__actualizarDespacho***************");
    
    var parametros ={empresa_id:obj.empresa_id,
                    prefijo:obj.prefijo,
                    numero: obj.numero                   
                    };

    var query = G.knex('inv_bodegas_movimiento_despachos_clientes')
                 .where(parametros).update({factura_gener: '1'});


    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
        console.log("resultado [__actualizarDespacho]: ", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__actualizarDespacho]: ", err);
        callback({err:err, msj: "Error al actualizar el movimiento del despacho del cliente"});   
    });  
};

var datosAdicionalesAgrupados = [];
/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de registrar los despachos agrupados
 * @fecha 2017-05-11
 */
function __detallePedidosClientes(that, index, pedidos,transaccion, callback) {
   
    var pedido = pedidos[index];   
    
    if (!pedido) {       
       
        callback(false);  
        return;                     
    }  
    
    index++;
    
     
     
     //
    if(pedido.pedidos[0].documentoSeleccionado.length > 0){
        
      // console.log("# Cotizacion >>>>>> ", pedido.pedidos[0].numero_cotizacion); 
        /* console.log("Cantidad de documentos ", pedido.pedidos[0].documentoSeleccionado.length);*/
        return G.Q.nfcall(__guardarDespachoIndividual,that,0, pedido.pedidos[0],[],transaccion).then(function(resultado){ 
         
        datosAdicionalesAgrupados.push(resultado)
       
        setTimeout(function() {
            __detallePedidosClientes(that, index, pedidos,transaccion, callback);
        }, 300);  
        
        
        }).fail(function(err){ 
            console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
            callback(err);            
        }).done();
    }
   /* */
     
    setTimeout(function() {
            __detallePedidosClientes(that, index, pedidos,transaccion, callback);
    }, 300);
   
};

 


/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de registrar los despachos agrupados
 * @fecha 2017-05-11
 */
function __guardarDespachoIndividual(that, index, documentos,consultaCompleta,transaccion,callback) {
   
   console.log("*****__guardarDespachoIndividual******** ");
    var documento = documentos.documento === undefined ? documentos[index] : documentos.documento[index];   
    var def = G.Q.defer();
    var retorno = {cabecera:'',datos_adicionales:'', detalle:'', vendedor:''};
    if (!documento) {                                             
        //console.log("retorno >>>>>>> ", retorno);
        callback(false,consultaCompleta);                                   
        return;                                                        
    }  
    //console.log("VENDEDORES   ===== ", documentos.vendedor[0])
    index++;
    var parametros = {empresa_id:documento.empresa,prefijo:documento.prefijo,numero: documento.numero};
    
    
    G.Q.ninvoke(that.m_e008,'obtenerDocumentoBodega', parametros).then(function(resultado){     
                   
             
            if(resultado.length > 0){
               retorno.cabecera = resultado;
               retorno.vendedor = documentos.documento === undefined ? '' : documentos.vendedor[0];
               return G.Q.ninvoke(that.m_e008,'consultarDatosAdicionales',parametros);
            }else{
                throw {msj:'El documento no existe', state:404};
            }
                      
        //console.log("resultado [obtenerDocumentoBodega]: ", resultado)
      
    }).then(function(resultado){
        
      // console.log("resultado [consultarDatosAdicionales]: ", resultado);
        if(resultado.length > 0){
            retorno.datos_adicionales = resultado;
            
            return G.Q.ninvoke(that.m_e008,'obtenerTotalDetalleDespacho',{empresa:documento.empresa,prefijoDocumento:documento.prefijo,numeroDocumento: documento.numero});
        }else{
            throw {msj:'El documento no tiene datos adicionales', state:404};
        }
    }).then(function(resultado){
        
       // console.log("resultado [obtenerTotalDetalleDespacho]: ", resultado)
        if(resultado.length > 0){
            retorno.detalle = resultado;
            //console.log("retorno [__guardarDespachoIndividual]: ", retorno); 
            consultaCompleta.push(retorno);
        }else{
            throw {msj:'El documento no tiene detalle', state:404};
        }
        
    }).then(function(resultado){
        
        return G.Q.nfcall(__actualizarDespacho, {empresa_id:documento.empresa,prefijo:documento.prefijo,numero: documento.numero},transaccion);
    })
   .fail(function(err){    
        console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
        callback(err);            
    }).done();
    
    setTimeout(function() {
            __guardarDespachoIndividual(that, index, documentos,consultaCompleta,transaccion,callback);
    }, 300);
   
};

/**
 * +Descripcion Metodo encargado de generar las facturas agrupadas 
 *              mediante la transaccion la cual ejecuta varios querys
 * @author Cristian Ardila
 * @fecha 17/05/2017 DD/MM/YYYY
 */
FacturacionClientesModel.prototype.transaccionGenerarFacturaIndividual = function(obj, callback)
{   
  
    var that = this;
    var def = G.Q.defer();
    var porcentajeRtf = '0';
    var porcentajeIca = '0';
    var porcentajeReteiva = '0';
    var porcentajeCree = obj.consultar_tercero_contrato[0].porcentaje_cree;
    
    
    if (obj.consultar_parametros_retencion.sw_rtf === '1' || obj.consultar_parametros_retencion.sw_rtf === '3')
        porcentajeRtf = obj.consultar_tercero_contrato[0].porcentaje_rtf;
    if (obj.consultar_parametros_retencion.sw_ica === '1' || obj.consultar_parametros_retencion.sw_ica === '3')
        porcentajeIca = obj.consultar_tercero_contrato[0].porcentaje_ica;
    if (obj.consultar_parametros_retencion.sw_reteiva === '1' || obj.consultar_parametros_retencion.sw_reteiva === '3')
        porcentajeReteiva = obj.consultar_tercero_contrato[0].porcentaje_reteiva;
        
    G.knex.transaction(function(transaccion) {  
        
        G.Q.ninvoke(that,'insertarFacturaIndividual',
        {parametros:obj,
         porcentaje_rtf:porcentajeRtf,
         porcentaje_ica: porcentajeIca,
         porcentaje_reteiva: porcentajeReteiva,
         porcentaje_cree: porcentajeCree,
         usuario: obj.parametros.usuario,
         tipoPago: obj.parametros.tipoPago
         
        },transaccion).then(function(resultado){   
             
            return G.Q.ninvoke(that,'insertarPcFactura',{parametros:obj,swTipoFactura: '1'}, transaccion);                                  
        }).then(function(){
            
            return G.Q.nfcall(__guardarDespachoIndividual,that,0, obj.parametros.documentos,[],transaccion);
            
        }).then(function(consultaCompleta){
            
            if(consultaCompleta.length > 0){
                
                obj.documento_facturacion.forEach(function(documento){

                    consultaCompleta.forEach(function(row){

                        row.detalle.forEach(function(rowDetalle){

                            if(obj.consultar_tercero_contrato[0].facturar_iva === '0'){
                                rowDetalle.porcentaje_gravamen = 0;
                            }
                            var parametros = {empresa_id:documento.empresa_id, 
                                    numeracion:documento.numeracion,
                                    prefijo: documento.id,
                                    codigo_producto: rowDetalle.codigo_producto,
                                    cantidad: rowDetalle.cantidad,
                                    valor_unitario: rowDetalle.valor_unitario,
                                    lote:rowDetalle.lote,
                                    fecha_vencimiento: rowDetalle.fecha_vencimiento,
                                    porcentaje_gravamen: rowDetalle.porcentaje_gravamen
                                };   
                            console.log("parametros ", parametros)
                            return G.Q.nfcall(__insertarFacturaIndividualDetalle,parametros,transaccion);
                        });    
                    });                 
                });
                
            }else{
                throw {msj:'No hay documentos seleccionados', status: 404};  
                
            }
             
        }).then(function(){
            
            return G.Q.ninvoke(that,'actualizarNumeracion',{parametros:obj}, transaccion);
            
        }).then(function(){
           
            var parametros = { 
                pedido_cliente_id: obj.parametros.pedido.pedidos[0].numero_cotizacion, 
                tipo_id_tercero: obj.consultar_tercero_contrato[0].tipo_id_tercero,
                tercero_id: obj.consultar_tercero_contrato[0].tercero_id,
                tipo_id_vendedor:obj.parametros.pedido.pedidos[0].vendedor[0].tipo_id_tercero, 
                vendedor_id: obj.parametros.pedido.pedidos[0].vendedor[0].id
            };
          
            return G.Q.ninvoke(that,'actualizarEstadoFacturaPedido',parametros, transaccion);
            
        }).then(function(){
                                               
           console.log("AQUI VA OK OKo OK [consultaCompleta]: ");
           transaccion.commit(); 
        }).fail(function(err){
            console.log("err (/fail) [transaccionGenerarFacturaIndividual]: ", err);
            transaccion.rollback(err);
        }).done();

    }).then(function(){
        
       callback(false);
    }).catch(function(err){     
        
       callback(err);
    }).done(); 
    
};



                
                
                
FacturacionClientesModel.$inject = ["m_e008"];


module.exports = FacturacionClientesModel;