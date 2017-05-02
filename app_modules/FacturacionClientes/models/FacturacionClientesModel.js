var FacturacionClientesModel = function() {};
 
/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de consultar la evolucion de una formula
 * @controller FacturacionClientes.prototype.listarClientes
 */
FacturacionClientesModel.prototype.listarTiposTerceros = function(callback){
   
   /* var query = G.knex.raw("SELECT DISTINCT a.tipo_id_tercero, a.tercero_id, a.direccion, a.telefono, a.email, a.nombre_tercero, a.tipo_bloqueo_id, c.descripcion as bloqueo, g.pais, f.departamento, municipio FROM terceros as a JOIN terceros_clientes as b ON (a.tipo_id_tercero = b.tipo_id_tercero) AND (a.tercero_id = b.tercero_id) AND (b.empresa_id = '03') LEFT JOIN inv_tipos_bloqueos as c ON (a.tipo_bloqueo_id = c.tipo_bloqueo_id) JOIN inv_bodegas_movimiento_despachos_clientes as d ON (a.tipo_id_tercero = b.tipo_id_tercero) AND (a.tercero_id = d.tercero_id) LEFT JOIN tipo_mpios as e ON (a.tipo_pais_id = e.tipo_pais_id) AND (a.tipo_dpto_id = e.tipo_dpto_id) AND (a.tipo_mpio_id = e.tipo_mpio_id) LEFT JOIN tipo_dptos as f ON (e.tipo_pais_id = f.tipo_pais_id) AND (e.tipo_dpto_id = f.tipo_dpto_id) LEFT JOIN tipo_pais as g ON (f.tipo_pais_id = g.tipo_pais_id) WHERE a.nombre_tercero ILIKE '%%' AND a.tercero_id ILIKE '%%' GROUP BY a.tipo_id_tercero, a.tercero_id, a.direccion, a.telefono, a.email, a.nombre_tercero, a.tipo_bloqueo_id, c.descripcion, g.pais, f.departamento, municipio ORDER BY a.nombre_tercero LIMIT 100 OFFSET 0");
           
        query.then(function(resultado){ 
            console.log("resultado ", resultado);
            callback(false, resultado)
    }).catch(function(err){    
        console.log("err [consultarEvolucionFormula]:", err);
        callback(err);
    });*/
     G.knex.column('tipo_id_tercero as id', 'descripcion')
          .select()
          .from('tipo_id_terceros')
          .orderBy('tipo_id_tercero', 'asc')
    .then(function(resultado){ 
             
        callback(false, resultado)
    }).catch(function(err){    
        console.log("err [listarTipoDocumento]:", err);
        callback(err);
    });
    
};
 
 

FacturacionClientesModel.$inject = [];


module.exports = FacturacionClientesModel;