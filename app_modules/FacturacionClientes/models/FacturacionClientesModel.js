var FacturacionClientesModel = function () {};

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
        callback(err);
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
FacturacionClientesModel.prototype.listarClientes = function (obj,callback) {

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
            .where( function(){ 
                
                if((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda !=="" ){
                    this.andWhere(G.knex.raw("a.tercero_id  "+G.constants.db().LIKE+"'%" + obj.terminoBusqueda + "%'"))
               } 
               if((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !=="" ){
                    this.andWhere(G.knex.raw("a.nombre_tercero  "+G.constants.db().LIKE+"'%" + obj.terminoBusqueda + "%'"))                    
               } 
            }).andWhere('b.empresa_id',obj.empresaId);
               
    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
                    query.then(function (resultado) {
 
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarClientes]:", err);
        callback(err);
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
FacturacionClientesModel.prototype.listarFacturasGeneradas = function (obj,callback) {
    
    
    var colSubQuery2 = [G.knex.raw("'0' as factura_agrupada"),
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
                "a.usuario_id",
                "a.tipo_id_vendedor",
                "a.vendedor_id",
                "b.nombre",
                "a.valor_total",
                "a.saldo",
                "a.pedido_cliente_id",
                "a.observaciones",
                "a.fecha_vencimiento_factura",
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
                "pedi.observacion"];
    
    var colSubQuery1 = ["a.empresa_id",  
       "a.prefijo",  
       "a.factura_fiscal",  
       G.knex.raw("SUM((valor_unitario*cantidad)) as subtotal"),  
       G.knex.raw("SUM(((valor_unitario*cantidad)*(porc_iva/100))) as iva_total")
    ];
   
    var subQuery1 = G.knex.select(colSubQuery1).from("inv_facturas_despacho_d as a").groupBy("a.empresa_id","a.prefijo","a.factura_fiscal");
    
    var subQuery2 = G.knex.select(colSubQuery2)
            .from("inv_facturas_despacho as a")
            .join('vnts_vendedores as b', function () {
                this.on("a.tipo_id_vendedor", "b.tipo_id_vendedor")
                    .on("a.vendedor_id", "b.vendedor_id")
            }).join('terceros as c', function () {
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
            }).join('tipo_dptos as k', function() {
                this.on("j.tipo_pais_id","k.tipo_pais_id")
                    .on("j.tipo_dpto_id","k.tipo_dpto_id")
            
            }).join('tipo_pais as l', function() {
                this.on("k.tipo_pais_id","l.tipo_pais_id")
                   
            }).join('ventas_ordenes_pedidos as pedi', function() {
                this.on("pedi.empresa_id","a.empresa_id")
                    .on("pedi.pedido_cliente_id","a.pedido_cliente_id")
                    .on("pedi.tercero_id","a.tercero_id")
                    .on("pedi.tipo_id_tercero","a.tipo_id_tercero")
                   
            }).join('documentos as i', function(){
                this.on("a.empresa_id","i.empresa_id")
                    .on("a.documento_id","i.documento_id")
            }).join(subQuery1, function(){
                
                this.on("m.empresa_id","a.empresa_id")
                        .on("m.prefijo","a.prefijo")
                        .on("m.factura_fiscal","a.factura_fiscal")
            });
                    
     
     
     
     
     subQuery2.then(function(resultado){    
         console.log("resultado ", resultado)
            callback(false, resultado)
        }).catch(function(err){        
            console.log("err [listarFacturasGeneradas] ", err);
            callback(err);
        });
};

FacturacionClientesModel.$inject = [];


module.exports = FacturacionClientesModel;